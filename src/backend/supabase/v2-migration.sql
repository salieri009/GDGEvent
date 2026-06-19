-- =============================================================
-- DoodlePaws v2 migration (run after schema.sql)
-- Atomic adoption + pet status workflow + BFF-only writes
-- =============================================================

-- Drop anon INSERT — BFF uses service role (OQ5 / NFR-2.6 target)
drop policy if exists "Anyone can insert adoption application" on public.adoption_applications;

-- Atomic submit: insert application + set pet pending (v2 state-machines)
create or replace function public.submit_adoption_application(
  p_pet_id text,
  p_applicant_name text,
  p_favorite_snack text,
  p_promise_given boolean
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status text;
begin
  if p_promise_given is distinct from true then
    raise exception 'invalid_payload';
  end if;

  select status into v_status from public.pets where id = p_pet_id for update;
  if not found then
    raise exception 'pet_not_found';
  end if;
  if v_status <> 'available' then
    raise exception 'pet_not_available';
  end if;

  insert into public.adoption_applications (pet_id, applicant_name, favorite_snack, promise_given)
  values (p_pet_id, p_applicant_name, p_favorite_snack, true);

  update public.pets set status = 'pending' where id = p_pet_id;
end;
$$;

revoke all on function public.submit_adoption_application(text, text, text, boolean) from public;
grant execute on function public.submit_adoption_application(text, text, text, boolean) to service_role;

-- Admin review: approve (pet → adopted) or reject (pet → available)
create or replace function public.review_adoption_application(
  p_application_id uuid,
  p_action text
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_app record;
begin
  if p_action not in ('approve', 'reject') then
    raise exception 'invalid_action';
  end if;

  select a.id, a.pet_id, a.status, p.status as pet_status
  into v_app
  from public.adoption_applications a
  join public.pets p on p.id = a.pet_id
  where a.id = p_application_id
  for update of a, p;

  if not found then
    raise exception 'application_not_found';
  end if;

  if v_app.status <> 'pending' then
    raise exception 'application_not_pending';
  end if;

  if p_action = 'approve' then
    update public.adoption_applications set status = 'approved' where id = p_application_id;
    update public.pets set status = 'adopted' where id = v_app.pet_id;
  else
    update public.adoption_applications set status = 'rejected' where id = p_application_id;
    update public.pets set status = 'available' where id = v_app.pet_id;
  end if;
end;
$$;

revoke all on function public.review_adoption_application(uuid, text) from public;
grant execute on function public.review_adoption_application(uuid, text) to service_role;
