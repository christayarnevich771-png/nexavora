-- NEXAVORA marketplace schema
-- Run in order: 0001_schema.sql -> 0002_functions_triggers.sql -> 0003_rls.sql

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────────────────
-- Enums
-- ─────────────────────────────────────────────────────────────────────────

create type user_role as enum ('buyer_seller', 'moderator', 'admin');
create type listing_status as enum ('draft', 'active', 'paused', 'removed');
create type offer_status as enum ('pending', 'accepted', 'declined', 'withdrawn', 'expired');
create type order_status as enum (
  'pending_payment',
  'paid',
  'in_progress',
  'delivered',
  'completed',
  'cancelled',
  'disputed',
  'refunded'
);
create type order_event_type as enum (
  'created',
  'payment_marked_sent',
  'payment_confirmed',
  'delivered',
  'buyer_confirmed',
  'cancelled',
  'dispute_opened',
  'dispute_resolved',
  'refunded',
  'note'
);
create type dispute_status as enum ('open', 'under_review', 'resolved_buyer', 'resolved_seller', 'closed');
create type report_target_type as enum ('listing', 'profile', 'message', 'review');
create type report_status as enum ('open', 'reviewing', 'actioned', 'dismissed');
create type notification_type as enum (
  'message',
  'offer',
  'order_update',
  'dispute',
  'review',
  'system'
);

-- ─────────────────────────────────────────────────────────────────────────
-- profiles (1:1 with auth.users)
-- ─────────────────────────────────────────────────────────────────────────

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  display_name text,
  bio text,
  avatar_url text,
  role user_role not null default 'buyer_seller',
  is_verified boolean not null default false,
  is_banned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_length check (char_length(username) between 3 and 32),
  constraint profiles_username_format check (username ~ '^[a-z0-9_]+$')
);

create unique index profiles_username_key on public.profiles (lower(username));

-- ─────────────────────────────────────────────────────────────────────────
-- categories
-- ─────────────────────────────────────────────────────────────────────────

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────
-- listings
-- ─────────────────────────────────────────────────────────────────────────

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles (id) on delete cascade,
  category_id uuid references public.categories (id) on delete set null,
  slug text not null unique,
  title text not null,
  description text not null default '',
  price_cents integer not null,
  currency text not null default 'USD',
  delivery_time_days integer,
  status listing_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint listings_price_nonnegative check (price_cents >= 0),
  constraint listings_delivery_positive check (delivery_time_days is null or delivery_time_days > 0)
);

create index listings_seller_id_idx on public.listings (seller_id);
create index listings_category_id_idx on public.listings (category_id);
create index listings_status_idx on public.listings (status);
create index listings_created_at_idx on public.listings (created_at desc);

-- ─────────────────────────────────────────────────────────────────────────
-- listing_images
-- ─────────────────────────────────────────────────────────────────────────

create table public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  storage_path text not null,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create index listing_images_listing_id_idx on public.listing_images (listing_id);

-- ─────────────────────────────────────────────────────────────────────────
-- favorites
-- ─────────────────────────────────────────────────────────────────────────

create table public.favorites (
  user_id uuid not null references public.profiles (id) on delete cascade,
  listing_id uuid not null references public.listings (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

create index favorites_listing_id_idx on public.favorites (listing_id);

-- ─────────────────────────────────────────────────────────────────────────
-- offers
-- ─────────────────────────────────────────────────────────────────────────

create table public.offers (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  buyer_id uuid not null references public.profiles (id) on delete cascade,
  seller_id uuid not null references public.profiles (id) on delete cascade,
  amount_cents integer not null,
  currency text not null default 'USD',
  message text,
  status offer_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint offers_amount_nonnegative check (amount_cents >= 0),
  constraint offers_buyer_not_seller check (buyer_id <> seller_id)
);

create index offers_listing_id_idx on public.offers (listing_id);
create index offers_buyer_id_idx on public.offers (buyer_id);
create index offers_seller_id_idx on public.offers (seller_id);
create index offers_status_idx on public.offers (status);

-- ─────────────────────────────────────────────────────────────────────────
-- conversations & messages
-- ─────────────────────────────────────────────────────────────────────────

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings (id) on delete set null,
  buyer_id uuid not null references public.profiles (id) on delete cascade,
  seller_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  last_message_at timestamptz not null default now(),
  constraint conversations_buyer_not_seller check (buyer_id <> seller_id),
  unique (listing_id, buyer_id, seller_id)
);

create index conversations_buyer_id_idx on public.conversations (buyer_id);
create index conversations_seller_id_idx on public.conversations (seller_id);
create index conversations_last_message_at_idx on public.conversations (last_message_at desc);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  constraint messages_body_not_empty check (char_length(trim(body)) > 0)
);

create index messages_conversation_id_idx on public.messages (conversation_id, created_at);
create index messages_sender_id_idx on public.messages (sender_id);

-- ─────────────────────────────────────────────────────────────────────────
-- orders & order_events
-- ─────────────────────────────────────────────────────────────────────────

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete restrict,
  offer_id uuid references public.offers (id) on delete set null,
  buyer_id uuid not null references public.profiles (id) on delete restrict,
  seller_id uuid not null references public.profiles (id) on delete restrict,
  amount_cents integer not null,
  currency text not null default 'USD',
  payment_method text,
  status order_status not null default 'pending_payment',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  constraint orders_amount_nonnegative check (amount_cents >= 0),
  constraint orders_buyer_not_seller check (buyer_id <> seller_id)
);

create index orders_buyer_id_idx on public.orders (buyer_id);
create index orders_seller_id_idx on public.orders (seller_id);
create index orders_listing_id_idx on public.orders (listing_id);
create index orders_status_idx on public.orders (status);

create table public.order_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  actor_id uuid references public.profiles (id) on delete set null,
  event_type order_event_type not null,
  note text,
  created_at timestamptz not null default now()
);

create index order_events_order_id_idx on public.order_events (order_id, created_at);

-- ─────────────────────────────────────────────────────────────────────────
-- disputes
-- ─────────────────────────────────────────────────────────────────────────

create table public.disputes (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  opened_by uuid not null references public.profiles (id) on delete cascade,
  reason text not null,
  status dispute_status not null default 'open',
  resolution_note text,
  resolved_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  constraint disputes_reason_not_empty check (char_length(trim(reason)) > 0)
);

create unique index disputes_order_id_key on public.disputes (order_id);

-- ─────────────────────────────────────────────────────────────────────────
-- reviews
-- ─────────────────────────────────────────────────────────────────────────

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  listing_id uuid not null references public.listings (id) on delete cascade,
  reviewer_id uuid not null references public.profiles (id) on delete cascade,
  reviewee_id uuid not null references public.profiles (id) on delete cascade,
  rating smallint not null,
  body text,
  created_at timestamptz not null default now(),
  constraint reviews_rating_range check (rating between 1 and 5),
  constraint reviews_reviewer_not_reviewee check (reviewer_id <> reviewee_id)
);

create unique index reviews_order_reviewer_key on public.reviews (order_id, reviewer_id);
create index reviews_reviewee_id_idx on public.reviews (reviewee_id);
create index reviews_listing_id_idx on public.reviews (listing_id);

-- ─────────────────────────────────────────────────────────────────────────
-- reports
-- ─────────────────────────────────────────────────────────────────────────

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  target_type report_target_type not null,
  target_id uuid not null,
  reason text not null,
  status report_status not null default 'open',
  handled_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  constraint reports_reason_not_empty check (char_length(trim(reason)) > 0)
);

create index reports_target_idx on public.reports (target_type, target_id);
create index reports_status_idx on public.reports (status);

-- ─────────────────────────────────────────────────────────────────────────
-- notifications
-- ─────────────────────────────────────────────────────────────────────────

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type notification_type not null,
  title text not null,
  body text,
  link text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_user_id_idx on public.notifications (user_id, created_at desc);
create index notifications_unread_idx on public.notifications (user_id) where read_at is null;

-- ─────────────────────────────────────────────────────────────────────────
-- admin_actions
-- ─────────────────────────────────────────────────────────────────────────

create table public.admin_actions (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.profiles (id) on delete cascade,
  action text not null,
  target_type text,
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index admin_actions_admin_id_idx on public.admin_actions (admin_id, created_at desc);
