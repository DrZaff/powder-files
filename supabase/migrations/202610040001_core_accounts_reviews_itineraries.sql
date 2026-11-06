-- Powder Files account, review, and itinerary foundation.
-- The legacy `resorts` and empty `trips` tables remain untouched.

create extension if not exists pgcrypto with schema extensions;
create extension if not exists citext with schema extensions;

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public, pg_temp as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username extensions.citext unique,
  display_name text,
  bio text,
  avatar_url text,
  role text not null default 'member' check (role in ('member', 'staff', 'owner')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint profiles_username_format check (username is null or username::text ~ '^[A-Za-z0-9_]{3,30}$'),
  constraint profiles_display_name_length check (char_length(display_name) <= 80),
  constraint profiles_bio_length check (char_length(bio) <= 500)
);

create table public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email_trip_updates boolean not null default true,
  email_community_updates boolean not null default false,
  preferred_units text not null default 'imperial' check (preferred_units in ('imperial', 'metric')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.resort_directory (
  stable_id text primary key,
  name text not null,
  alternate_names text[] not null default '{}',
  locality text,
  region text,
  country text,
  latitude double precision,
  longitude double precision,
  official_website text,
  operating_status text not null default 'unknown',
  verification_status text not null default 'candidate' check (verification_status in ('verified', 'candidate', 'uncertain', 'incomplete')),
  confidence text not null default 'medium' check (confidence in ('low', 'medium', 'high')),
  overview jsonb,
  mountain_facts jsonb not null default '{}'::jsonb,
  provenance jsonb not null default '{}'::jsonb,
  is_published boolean not null default false,
  source_collected_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint resort_directory_latitude check (latitude is null or latitude between -90 and 90),
  constraint resort_directory_longitude check (longitude is null or longitude between -180 and 180)
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  resort_id text not null references public.resort_directory(stable_id) on delete restrict,
  author_id uuid not null references auth.users(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  title text,
  body text not null,
  status text not null default 'published' check (status in ('draft', 'published', 'hidden')),
  visit_date date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint reviews_title_length check (char_length(title) <= 120),
  constraint reviews_body_length check (char_length(body) between 20 and 5000),
  constraint reviews_one_per_author_resort unique (author_id, resort_id)
);

create table public.itineraries (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  summary text,
  visibility text not null default 'private' check (visibility in ('private', 'public', 'unlisted')),
  share_token uuid not null default gen_random_uuid() unique,
  copied_from_id uuid references public.itineraries(id) on delete set null,
  original_author_id uuid references auth.users(id) on delete set null,
  attribution_name text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  published_at timestamptz,
  constraint itineraries_title_length check (char_length(title) between 1 and 120),
  constraint itineraries_summary_length check (char_length(summary) <= 1000),
  constraint itineraries_publication_date check ((visibility = 'private' and published_at is null) or visibility in ('public', 'unlisted'))
);

create table public.itinerary_days (
  itinerary_id uuid not null references public.itineraries(id) on delete cascade,
  day_number integer not null check (day_number between 1 and 366),
  title text,
  notes text,
  calendar_date date,
  primary key (itinerary_id, day_number),
  constraint itinerary_days_title_length check (char_length(title) <= 120),
  constraint itinerary_days_notes_length check (char_length(notes) <= 3000)
);

create table public.itinerary_stops (
  id uuid primary key default gen_random_uuid(),
  itinerary_id uuid not null,
  day_number integer not null,
  position integer not null check (position between 1 and 100),
  resort_id text references public.resort_directory(stable_id) on delete restrict,
  custom_name text,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  foreign key (itinerary_id, day_number) references public.itinerary_days(itinerary_id, day_number) on delete cascade,
  constraint itinerary_stops_named check (resort_id is not null or nullif(trim(custom_name), '') is not null),
  constraint itinerary_stops_position_unique unique (itinerary_id, day_number, position),
  constraint itinerary_stops_notes_length check (char_length(notes) <= 2000)
);

create table public.saved_itineraries (
  user_id uuid not null references auth.users(id) on delete cascade,
  itinerary_id uuid not null references public.itineraries(id) on delete cascade,
  saved_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, itinerary_id)
);

create index reviews_resort_published_idx on public.reviews (resort_id, created_at desc) where status = 'published';
create index reviews_author_idx on public.reviews (author_id, created_at desc);
create index itineraries_public_idx on public.itineraries (published_at desc) where visibility = 'public';
create index itineraries_owner_idx on public.itineraries (owner_id, updated_at desc);
create index itinerary_stops_resort_idx on public.itinerary_stops (resort_id);

create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger user_settings_set_updated_at before update on public.user_settings for each row execute function public.set_updated_at();
create trigger resort_directory_set_updated_at before update on public.resort_directory for each row execute function public.set_updated_at();
create trigger reviews_set_updated_at before update on public.reviews for each row execute function public.set_updated_at();
create trigger itineraries_set_updated_at before update on public.itineraries for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public, extensions, pg_temp as $$
declare requested_username text;
begin
  requested_username := nullif(trim(new.raw_user_meta_data ->> 'username'), '');
  if requested_username !~ '^[A-Za-z0-9_]{3,30}$' or exists (select 1 from public.profiles where username = requested_username) then
    requested_username := null;
  end if;
  insert into public.profiles (id, username, display_name)
  values (new.id, requested_username, left(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), 80));
  insert into public.user_settings (user_id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.prevent_role_escalation()
returns trigger language plpgsql set search_path = public, pg_temp as $$
begin
  if new.role is distinct from old.role and coalesce(auth.jwt() ->> 'role', '') <> 'service_role' then
    raise exception 'Profile roles may only be changed by the service role';
  end if;
  return new;
end;
$$;

create trigger profiles_prevent_role_escalation before update on public.profiles for each row execute function public.prevent_role_escalation();

create or replace function public.is_staff(check_user uuid default auth.uid())
returns boolean language sql stable security definer set search_path = public, pg_temp as $$
  select exists (select 1 from public.profiles where id = check_user and role in ('staff', 'owner'));
$$;

create or replace function public.can_read_itinerary(check_itinerary uuid)
returns boolean language sql stable security definer set search_path = public, pg_temp as $$
  select exists (select 1 from public.itineraries where id = check_itinerary and (visibility = 'public' or owner_id = auth.uid() or public.is_staff()));
$$;

create or replace function public.owns_itinerary(check_itinerary uuid)
returns boolean language sql stable security definer set search_path = public, pg_temp as $$
  select exists (select 1 from public.itineraries where id = check_itinerary and owner_id = auth.uid());
$$;

alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.resort_directory enable row level security;
alter table public.reviews enable row level security;
alter table public.itineraries enable row level security;
alter table public.itinerary_days enable row level security;
alter table public.itinerary_stops enable row level security;
alter table public.saved_itineraries enable row level security;

create policy profiles_public_read on public.profiles for select using (true);
create policy profiles_owner_update on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy user_settings_owner_read on public.user_settings for select using (user_id = auth.uid());
create policy user_settings_owner_update on public.user_settings for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy resorts_public_read on public.resort_directory for select using (is_published);
create policy resorts_staff_read on public.resort_directory for select using (public.is_staff());
create policy resorts_staff_insert on public.resort_directory for insert with check (public.is_staff());
create policy resorts_staff_update on public.resort_directory for update using (public.is_staff()) with check (public.is_staff());
create policy resorts_staff_delete on public.resort_directory for delete using (public.is_staff());

create policy reviews_public_read on public.reviews for select using (status = 'published');
create policy reviews_author_read on public.reviews for select using (author_id = auth.uid());
create policy reviews_staff_read on public.reviews for select using (public.is_staff());
create policy reviews_author_insert on public.reviews for insert with check (author_id = auth.uid() and status in ('draft', 'published'));
create policy reviews_author_update on public.reviews for update using (author_id = auth.uid()) with check (author_id = auth.uid() and status in ('draft', 'published'));
create policy reviews_author_delete on public.reviews for delete using (author_id = auth.uid());
create policy reviews_staff_update on public.reviews for update using (public.is_staff()) with check (public.is_staff());
create policy reviews_staff_delete on public.reviews for delete using (public.is_staff());

create policy itineraries_public_read on public.itineraries for select using (visibility = 'public');
create policy itineraries_owner_read on public.itineraries for select using (owner_id = auth.uid());
create policy itineraries_staff_read on public.itineraries for select using (public.is_staff());
create policy itineraries_owner_insert on public.itineraries for insert with check (owner_id = auth.uid());
create policy itineraries_owner_update on public.itineraries for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy itineraries_owner_delete on public.itineraries for delete using (owner_id = auth.uid());

create policy itinerary_days_read on public.itinerary_days for select using (public.can_read_itinerary(itinerary_id));
create policy itinerary_days_owner_insert on public.itinerary_days for insert with check (public.owns_itinerary(itinerary_id));
create policy itinerary_days_owner_update on public.itinerary_days for update using (public.owns_itinerary(itinerary_id)) with check (public.owns_itinerary(itinerary_id));
create policy itinerary_days_owner_delete on public.itinerary_days for delete using (public.owns_itinerary(itinerary_id));

create policy itinerary_stops_read on public.itinerary_stops for select using (public.can_read_itinerary(itinerary_id));
create policy itinerary_stops_owner_insert on public.itinerary_stops for insert with check (public.owns_itinerary(itinerary_id));
create policy itinerary_stops_owner_update on public.itinerary_stops for update using (public.owns_itinerary(itinerary_id)) with check (public.owns_itinerary(itinerary_id));
create policy itinerary_stops_owner_delete on public.itinerary_stops for delete using (public.owns_itinerary(itinerary_id));

create policy saved_itineraries_owner_read on public.saved_itineraries for select using (user_id = auth.uid());
create policy saved_itineraries_owner_insert on public.saved_itineraries for insert with check (user_id = auth.uid() and exists (select 1 from public.itineraries i where i.id = itinerary_id and i.visibility = 'public'));
create policy saved_itineraries_owner_delete on public.saved_itineraries for delete using (user_id = auth.uid());

create or replace function public.get_shared_itinerary(requested_token uuid)
returns jsonb language sql stable security definer set search_path = public, pg_temp as $$
  select jsonb_build_object(
    'itinerary', to_jsonb(i) - 'share_token' - 'owner_id',
    'author', jsonb_build_object('username', p.username, 'display_name', p.display_name),
    'days', coalesce((select jsonb_agg((to_jsonb(d) - 'itinerary_id') || jsonb_build_object(
      'stops', coalesce((select jsonb_agg(to_jsonb(s) - 'itinerary_id' order by s.position) from public.itinerary_stops s where s.itinerary_id = i.id and s.day_number = d.day_number), '[]'::jsonb)
    ) order by d.day_number) from public.itinerary_days d where d.itinerary_id = i.id), '[]'::jsonb)
  )
  from public.itineraries i left join public.profiles p on p.id = i.owner_id
  where i.share_token = requested_token and i.visibility in ('public', 'unlisted');
$$;

create or replace function public.copy_public_itinerary(source_itinerary uuid, new_title text default null)
returns uuid language plpgsql security definer set search_path = public, pg_temp as $$
declare source_row public.itineraries%rowtype; copied_id uuid; author_label text;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  select * into source_row from public.itineraries where id = source_itinerary and visibility = 'public';
  if not found then raise exception 'Public itinerary not found'; end if;
  select coalesce(nullif(display_name, ''), username::text, 'Powder Files member') into author_label from public.profiles where id = source_row.owner_id;
  insert into public.itineraries (owner_id, title, summary, visibility, copied_from_id, original_author_id, attribution_name)
  values (auth.uid(), coalesce(nullif(trim(new_title), ''), source_row.title || ' — Copy'), source_row.summary, 'private', source_row.id, source_row.owner_id, author_label)
  returning id into copied_id;
  insert into public.itinerary_days (itinerary_id, day_number, title, notes, calendar_date)
  select copied_id, day_number, title, notes, calendar_date from public.itinerary_days where itinerary_id = source_row.id;
  insert into public.itinerary_stops (itinerary_id, day_number, position, resort_id, custom_name, notes)
  select copied_id, day_number, position, resort_id, custom_name, notes from public.itinerary_stops where itinerary_id = source_row.id;
  return copied_id;
end;
$$;

revoke all on function public.get_shared_itinerary(uuid) from public;
grant execute on function public.get_shared_itinerary(uuid) to anon, authenticated;
revoke all on function public.copy_public_itinerary(uuid, text) from public;
grant execute on function public.copy_public_itinerary(uuid, text) to authenticated;

grant select on public.profiles, public.resort_directory, public.reviews, public.itineraries, public.itinerary_days, public.itinerary_stops to anon, authenticated;
grant update on public.profiles, public.user_settings to authenticated;
grant select on public.user_settings, public.saved_itineraries to authenticated;
grant insert, update, delete on public.resort_directory, public.reviews, public.itineraries, public.itinerary_days, public.itinerary_stops to authenticated;
grant insert, delete on public.saved_itineraries to authenticated;

comment on table public.resort_directory is 'Owner/staff-managed official resort records. Ordinary users have read-only access to published rows.';
comment on column public.itineraries.share_token is 'Secret capability used only by get_shared_itinerary; never returned by public table policies.';
comment on column public.itineraries.attribution_name is 'Snapshot retained when a public itinerary is independently copied.';
