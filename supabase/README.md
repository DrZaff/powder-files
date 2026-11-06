# Supabase foundation

This directory contains the proposed Powder Files backend as versioned SQL. Nothing here is automatically applied to the live project.

The first migration adds public profiles, private account settings, a staff-managed resort directory, account-owned reviews, private/public/unlisted itineraries, saved itineraries, and independent public-itinerary copies with durable attribution. Row-level security is enabled on every new table.

The migration intentionally does not modify the existing `resorts` or empty `trips` tables, Auth configuration, Storage, or live data. Importing the reviewed global resort dataset is a later migration after this schema has been tested in a non-production Supabase branch or staging project.

## Privacy behavior

- Visitors can query published resorts, published reviews and public itineraries.
- Private itineraries are visible only to their owner and staff.
- Unlisted itineraries are not exposed by table queries; `get_shared_itinerary(token)` retrieves them through an unguessable link token.
- Copying is allowed only from public itineraries. The copy starts private and stores the original author and display attribution.
- Ordinary accounts cannot update official resorts or promote their own role.

## Safe rollout

1. Create a Supabase preview branch or separate staging project.
2. Apply the migration there with the Supabase CLI.
3. Test as anonymous, owner, second user, staff and service-role sessions.
4. Import Bristol Mountain as the first `resort_directory` fixture and verify public-read/staff-write behavior.
5. Connect React to staging Auth and complete registration, verification, recovery and account settings.
6. After review, apply the migration to production and import the full directory.

Never commit a service-role key, database password, access token, or local `.env` file. The browser may eventually receive only the project URL and Supabase publishable/anonymous key; authorization must continue to rely on row-level security.
