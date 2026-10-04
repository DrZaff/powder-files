export function field(value, sourceRecordId, confidence='medium') { return { value, source_record_ids:[sourceRecordId], confidence } }
export function mergeField(existing,incoming) {
  if (!existing) return incoming
  if (existing.value===incoming.value) return { ...existing, source_record_ids:[...new Set([...existing.source_record_ids,...incoming.source_record_ids])], confidence: existing.confidence==='high'||incoming.confidence==='high'?'high':existing.confidence }
  return existing
}
