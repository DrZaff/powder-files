import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const sql=await readFile(new URL('../migrations/202610040001_core_accounts_reviews_itineraries.sql',import.meta.url),'utf8')
const tables=['profiles','user_settings','resort_directory','reviews','itineraries','itinerary_days','itinerary_stops','saved_itineraries']

test('every application table enables row-level security',()=>{
  for(const table of tables)assert.match(sql,new RegExp(`alter table public\\.${table} enable row level security;`))
})

test('official resort writes require staff authorization',()=>{
  assert.match(sql,/resorts_public_read[\s\S]*using \(is_published\)/)
  for(const action of ['insert','update','delete'])assert.match(sql,new RegExp(`resorts_staff_${action}[\\s\\S]{0,180}public\\.is_staff\\(\\)`))
  assert.doesNotMatch(sql,/resorts_(owner|user)_(insert|update|delete)/)
})

test('unlisted itineraries use token RPC and are not public table rows',()=>{
  assert.match(sql,/itineraries_public_read[\s\S]{0,100}visibility = 'public'/)
  assert.doesNotMatch(sql,/itineraries_public_read[\s\S]{0,120}unlisted/)
  assert.match(sql,/get_shared_itinerary\(requested_token uuid\)[\s\S]*i\.share_token = requested_token[\s\S]*'unlisted'/)
  assert.match(sql,/to_jsonb\(i\) - 'share_token' - 'owner_id'/)
})

test('reviews and itineraries are tied to authenticated owners',()=>{
  assert.match(sql,/reviews_author_insert[\s\S]{0,180}author_id = auth\.uid\(\)/)
  assert.match(sql,/itineraries_owner_insert[\s\S]{0,120}owner_id = auth\.uid\(\)/)
  assert.match(sql,/profiles_prevent_role_escalation/)
})

test('public copy starts private and preserves attribution',()=>{
  assert.match(sql,/copy_public_itinerary\(source_itinerary uuid/)
  assert.match(sql,/where id = source_itinerary and visibility = 'public'/)
  assert.match(sql,/source_row\.summary, 'private', source_row\.id, source_row\.owner_id, author_label/)
  assert.match(sql,/attribution_name text/)
})

test('legacy trips and resorts are not altered or dropped',()=>{
  assert.doesNotMatch(sql,/alter table public\.(trips|resorts)\b/i)
  assert.doesNotMatch(sql,/drop table/i)
})
