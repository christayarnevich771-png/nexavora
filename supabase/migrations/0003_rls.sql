-- ─────────────────────────────────────────────────────────────────────────
-- Helper: is the current user an admin/moderator?
-- security definer + fixed search_path so this can be called from other
-- tables' RLS policies without re-triggering RLS recursion on profiles.
-- ─────────────────────────────────────────────────────────────────────────

create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'moderator')
  );
$$;

-- ─────────────────────────────────────────────────────────────────────────
-- profiles
-- ─────────────────────────────────────────────────────────────────────────

alter table public.profiles enable row level security;

create policy "Profiles are publicly readable"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Admins can update any profile"
  on public.profiles for update
  using (public.is_admin());

-- Row creation happens exclusively via the handle_new_user() trigger
-- (security definer), so no insert policy is granted to regular clients.

-- ─────────────────────────────────────────────────────────────────────────
-- categories (admin-managed reference data, publicly readable)
-- ─────────────────────────────────────────────────────────────────────────

alter table public.categories enable row level security;

create policy "Categories are publicly readable"
  on public.categories for select
  using (true);

create policy "Admins manage categories"
  on public.categories for all
  using (public.is_admin())
  with check (public.is_admin());

-- ─────────────────────────────────────────────────────────────────────────
-- listings
-- ─────────────────────────────────────────────────────────────────────────

alter table public.listings enable row level security;

create policy "Active listings are publicly readable"
  on public.listings for select
  using (status = 'active' or seller_id = auth.uid() or public.is_admin());

create policy "Sellers can create their own listings"
  on public.listings for insert
  with check (seller_id = auth.uid());

create policy "Sellers can update their own listings"
  on public.listings for update
  using (seller_id = auth.uid() or public.is_admin())
  with check (seller_id = auth.uid() or public.is_admin());

create policy "Sellers can delete their own listings"
  on public.listings for delete
  using (seller_id = auth.uid() or public.is_admin());

-- ─────────────────────────────────────────────────────────────────────────
-- listing_images (visibility follows the parent listing)
-- ─────────────────────────────────────────────────────────────────────────

alter table public.listing_images enable row level security;

create policy "Listing images follow listing visibility"
  on public.listing_images for select
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and (l.status = 'active' or l.seller_id = auth.uid() or public.is_admin())
    )
  );

create policy "Sellers manage images on their own listings"
  on public.listing_images for all
  using (
    exists (select 1 from public.listings l where l.id = listing_id and l.seller_id = auth.uid())
    or public.is_admin()
  )
  with check (
    exists (select 1 from public.listings l where l.id = listing_id and l.seller_id = auth.uid())
    or public.is_admin()
  );

-- ─────────────────────────────────────────────────────────────────────────
-- favorites (private to the user)
-- ─────────────────────────────────────────────────────────────────────────

alter table public.favorites enable row level security;

create policy "Users manage their own favorites"
  on public.favorites for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ─────────────────────────────────────────────────────────────────────────
-- offers
-- ─────────────────────────────────────────────────────────────────────────

alter table public.offers enable row level security;

create policy "Participants can view their own offers"
  on public.offers for select
  using (buyer_id = auth.uid() or seller_id = auth.uid() or public.is_admin());

create policy "Buyers can create offers"
  on public.offers for insert
  with check (buyer_id = auth.uid());

create policy "Participants can update their own offers"
  on public.offers for update
  using (buyer_id = auth.uid() or seller_id = auth.uid() or public.is_admin())
  with check (buyer_id = auth.uid() or seller_id = auth.uid() or public.is_admin());

-- ─────────────────────────────────────────────────────────────────────────
-- conversations & messages (private to the two participants)
-- ─────────────────────────────────────────────────────────────────────────

alter table public.conversations enable row level security;

create policy "Participants can view their own conversations"
  on public.conversations for select
  using (buyer_id = auth.uid() or seller_id = auth.uid() or public.is_admin());

create policy "Participants can start a conversation"
  on public.conversations for insert
  with check (buyer_id = auth.uid() or seller_id = auth.uid());

alter table public.messages enable row level security;

create policy "Participants can view messages in their conversations"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.buyer_id = auth.uid() or c.seller_id = auth.uid() or public.is_admin())
    )
  );

create policy "Participants can send messages in their conversations"
  on public.messages for insert
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
    )
  );

-- ─────────────────────────────────────────────────────────────────────────
-- orders & order_events
-- ─────────────────────────────────────────────────────────────────────────

alter table public.orders enable row level security;

create policy "Participants can view their own orders"
  on public.orders for select
  using (buyer_id = auth.uid() or seller_id = auth.uid() or public.is_admin());

create policy "Buyers can create orders"
  on public.orders for insert
  with check (buyer_id = auth.uid());

create policy "Participants can update their own orders"
  on public.orders for update
  using (buyer_id = auth.uid() or seller_id = auth.uid() or public.is_admin())
  with check (buyer_id = auth.uid() or seller_id = auth.uid() or public.is_admin());

alter table public.order_events enable row level security;

create policy "Participants can view events on their own orders"
  on public.order_events for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.buyer_id = auth.uid() or o.seller_id = auth.uid() or public.is_admin())
    )
  );

create policy "Participants can log events on their own orders"
  on public.order_events for insert
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.buyer_id = auth.uid() or o.seller_id = auth.uid())
    )
  );

-- ─────────────────────────────────────────────────────────────────────────
-- disputes
-- ─────────────────────────────────────────────────────────────────────────

alter table public.disputes enable row level security;

create policy "Participants can view disputes on their own orders"
  on public.disputes for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.buyer_id = auth.uid() or o.seller_id = auth.uid())
    )
    or public.is_admin()
  );

create policy "Participants can open a dispute on their own order"
  on public.disputes for insert
  with check (
    opened_by = auth.uid()
    and exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.buyer_id = auth.uid() or o.seller_id = auth.uid())
    )
  );

create policy "Admins resolve disputes"
  on public.disputes for update
  using (public.is_admin())
  with check (public.is_admin());

-- ─────────────────────────────────────────────────────────────────────────
-- reviews (public read, write restricted to completed-order participants;
-- the validate_review() trigger enforces the completed-order requirement)
-- ─────────────────────────────────────────────────────────────────────────

alter table public.reviews enable row level security;

create policy "Reviews are publicly readable"
  on public.reviews for select
  using (true);

create policy "Order participants can leave a review"
  on public.reviews for insert
  with check (
    reviewer_id = auth.uid()
    and exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.buyer_id = auth.uid() or o.seller_id = auth.uid())
    )
  );

-- ─────────────────────────────────────────────────────────────────────────
-- reports (private to the reporter; visible to admins/moderators)
-- ─────────────────────────────────────────────────────────────────────────

alter table public.reports enable row level security;

create policy "Reporters can view their own reports"
  on public.reports for select
  using (reporter_id = auth.uid() or public.is_admin());

create policy "Users can file a report"
  on public.reports for insert
  with check (reporter_id = auth.uid());

create policy "Admins manage reports"
  on public.reports for update
  using (public.is_admin())
  with check (public.is_admin());

-- ─────────────────────────────────────────────────────────────────────────
-- notifications (private to the recipient)
-- ─────────────────────────────────────────────────────────────────────────

alter table public.notifications enable row level security;

create policy "Users can view their own notifications"
  on public.notifications for select
  using (user_id = auth.uid());

create policy "Users can update their own notifications"
  on public.notifications for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Notifications are otherwise inserted by trusted server-side logic
-- (service role / security-definer functions), not by regular clients.

-- ─────────────────────────────────────────────────────────────────────────
-- admin_actions (admin/moderator only, in both directions)
-- ─────────────────────────────────────────────────────────────────────────

alter table public.admin_actions enable row level security;

create policy "Admins can view admin actions"
  on public.admin_actions for select
  using (public.is_admin());

create policy "Admins can log admin actions"
  on public.admin_actions for insert
  with check (public.is_admin() and admin_id = auth.uid());
