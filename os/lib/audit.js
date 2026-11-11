import 'server-only'

/**
 * Records a change. Pass the same transaction that makes the change, so the two
 * succeed or fail together. `summary` is the sentence people read in a history list.
 */
export const logChange = (t, user, { action, entity, entityId, summary, before = null, after = null }) =>
  t.query(
    `INSERT INTO audit_log (user_id, user_name, action, entity, entity_id, summary, before, after)
     VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb)`,
    [
      user.id,
      user.name,
      action,
      entity,
      entityId,
      summary,
      before === null ? null : JSON.stringify(before),
      after === null ? null : JSON.stringify(after),
    ]
  )
