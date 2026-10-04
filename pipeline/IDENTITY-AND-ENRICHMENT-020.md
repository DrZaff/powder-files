# Identity cleanup and enrichment batch 020

Reviewed October 4, 2026. This pass acts on the profile-coverage audit before expanding numerical coverage.

## Identity results

- Four repeated stable IDs were collapsed, eliminating four duplicate public rows.
- Lac Blanc, Passy Plaine-Joux and St. Jakob im Defereggental each had two source identities representing one ski area. Each pair now has one canonical profile while retaining both source identities and existing researched content.
- The Washington and Michigan resorts named Crystal Mountain remain separate and now include state qualifiers in their display names.
- The Kitzbühel Alps mountain-range item and an insufficiently verified Mischliffen locality item were moved to the exclusions output rather than presented as active resorts.
- Sella Nevea now represents the currently scheduled Italian operation. The non-operating Slovenian side is not claimed as active.
- The public directory now has 1,400 rows and 1,400 unique stable IDs, with no exact repeated IDs or unresolved same-name groups.

## New official facts

- Ski Santa Fe: vertical, acreage, runs, lifts, base and peak elevations, snowfall, difficulty mix and the tentative 2026–27 season.
- Horseshoe Resort: vertical, lifts and terrain-park presence from a 2025 resort-owned publication. Its existing 28-versus-29 run conflict remains withheld.
- Sella Nevea: Italian-sector lift count, a named piste's length and vertical difference, and the scheduled 2026–27 season from Friuli Venezia Giulia's public tourism authority.

These additions raise profiles with at least one official fact from 510 to 513. A complete six-core-field profile increases from 18 to 19. All claims retain source URL, retrieval date, scope notes and field provenance.

## Limits

Scheduled seasons are weather-dependent. Sella Nevea statistics do not claim the closed Slovenian side. Horseshoe's conflicting run total remains unresolved. No commercial directory descriptions or imagery were imported.

No Supabase schema, policy, authentication, storage or live data was changed.
