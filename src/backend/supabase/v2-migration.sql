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
