-- ─────────────────────────────────────────────────────────────────────────
-- updated_at maintenance
-- ─────────────────────────────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger set_updated_at before update on public.listings
  for each row execute function public.set_updated_at();

create trigger set_updated_at before update on public.offers
  for each row execute function public.set_updated_at();

create trigger set_updated_at before update on public.orders
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- Automatic profile creation after Supabase Auth signup.
-- Username is derived from the email local-part (or metadata.username, if
-- the client supplied one at signup) and de-duplicated with a numeric
-- suffix if it's already taken.
-- ─────────────────────────────────────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  base_username text;
  candidate_username text;
  suffix int := 0;
begin
  base_username := lower(regexp_replace(
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    '[^a-z0-9_]', '', 'g'
  ));

  if base_username is null or char_length(base_username) < 3 then
    base_username := 'user_' || substr(new.id::text, 1, 8);
  end if;
  base_username := substr(base_username, 1, 32);

  candidate_username := base_username;

  while exists (
    select 1 from public.profiles where lower(username) = candidate_username
  ) loop
    suffix := suffix + 1;
    candidate_username := substr(base_username, 1, 28) || '_' || suffix;
  end loop;

  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    candidate_username,
    coalesce(new.raw_user_meta_data ->> 'display_name', base_username)
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────
-- Keep conversations.last_message_at current when a message is inserted.
-- ─────────────────────────────────────────────────────────────────────────

create or replace function public.touch_conversation()
returns trigger
language plpgsql
as $$
begin
  update public.conversations
  set last_message_at = new.created_at
  where id = new.conversation_id;
  return new;
end;
$$;

create trigger touch_conversation_on_message
  after insert on public.messages
  for each row execute function public.touch_conversation();

-- ─────────────────────────────────────────────────────────────────────────
-- Reviews may only be created for orders the reviewer actually completed
-- (either as buyer or seller), and the order must be in a completed state.
-- ─────────────────────────────────────────────────────────────────────────

create or replace function public.validate_review()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  matching_order public.orders%rowtype;
begin
  select * into matching_order from public.orders where id = new.order_id;

  if matching_order is null then
    raise exception 'Order % does not exist', new.order_id;
  end if;

  if matching_order.status <> 'completed' then
    raise exception 'Reviews can only be left on completed orders';
  end if;

  if new.reviewer_id not in (matching_order.buyer_id, matching_order.seller_id) then
    raise exception 'Only the buyer or seller on this order may leave a review';
  end if;

  if new.reviewee_id not in (matching_order.buyer_id, matching_order.seller_id) then
    raise exception 'reviewee_id must be the counterparty on this order';
  end if;

  return new;
end;
$$;

create trigger validate_review_before_insert
  before insert on public.reviews
  for each row execute function public.validate_review();
