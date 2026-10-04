import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeCoordinates, normalizeCountry, normalizeName, normalizeUrl, pointFromWkt } from '../lib/normalize.mjs'

test('normalizes names without erasing international letters',()=>{assert.equal(normalizeName('  L’Alpe-d’Huez & Ski  '),'lalpe dhuez and ski')})
test('normalizes common country aliases',()=>{assert.equal(normalizeCountry('United States of America'),'United States')})
test('normalizes and validates coordinates',()=>{assert.deepEqual(normalizeCoordinates('45.1234567','-110.2'),{latitude:45.123457,longitude:-110.2});assert.equal(normalizeCoordinates(91,0),null)})
test('parses Wikidata point and canonicalizes URLs',()=>{assert.deepEqual(pointFromWkt('Point(7.1 46.2)'),{latitude:46.2,longitude:7.1});assert.equal(normalizeUrl('example.com/'),'https://example.com')})
