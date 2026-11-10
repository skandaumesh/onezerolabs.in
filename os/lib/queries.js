import 'server-only'

import { sql } from '@/lib/db.mjs'
import { addDays } from '@/lib/dates.mjs'

export const listUsers = () => sql('SELECT id, name FROM users ORDER BY name')

// --- tasks -------------------------------------------------------------------

const TASK_SELECT = `
  SELECT t.id, t.title, t.notes, t.priority, t.due_date, to_char(t.due_time, 'HH24:MI') AS due_time, t.done_at, t.approval, t.recurrence,
         t.project_id, t.blocked_by, t.assignee_id, t.for_both,
         CASE WHEN t.for_both THEN 'Both' ELSE u.name END AS assignee_name,
         p.name AS project_name,
         c.id AS company_id, c.name AS company_name,
         b.title AS blocker_title,
         (b.id IS NOT NULL AND b.done_at IS NULL) AS is_blocked,
         (SELECT count(*)::int FROM subtasks s WHERE s.task_id = t.id) AS subtask_count,
         (SELECT count(*)::int FROM subtasks s WHERE s.task_id = t.id AND s.done) AS subtask_done
  FROM tasks t
  LEFT JOIN users u ON u.id = t.assignee_id
  LEFT JOIN projects p ON p.id = t.project_id
  LEFT JOIN companies c ON c.id = p.company_id
  LEFT JOIN tasks b ON b.id = t.blocked_by`

const TASK_ORDER = `
  ORDER BY t.due_date NULLS LAST, t.due_time NULLS LAST,
           array_position(ARRAY['critical', 'high', 'medium', 'low'], t.priority),
           t.created_at`

/** Open tasks, optionally one person's, which includes those for both. Grouping by date happens on the page. */
export const listOpenTasks = (assigneeId = null) =>
  sql(
    `${TASK_SELECT}
     WHERE t.done_at IS NULL AND ($1::uuid IS NULL OR t.assignee_id = $1::uuid OR t.for_both)
     ${TASK_ORDER}`,
    [assigneeId]
  )

export const listDoneTasks = (assigneeId = null) =>
  sql(
    `${TASK_SELECT}
     WHERE t.done_at IS NOT NULL AND ($1::uuid IS NULL OR t.assignee_id = $1::uuid OR t.for_both)
     ORDER BY t.done_at DESC LIMIT 100`,
    [assigneeId]
  )

export const listProjectTasks = (projectId) =>
  sql(
    `${TASK_SELECT}
     WHERE t.project_id = $1
     ORDER BY t.done_at IS NOT NULL, t.created_at`,
    [projectId]
  )

export const getTask = async (id) => (await sql(`${TASK_SELECT} WHERE t.id = $1`, [id]))[0] || null

export const listSubtasks = (taskId) =>
  sql('SELECT id, title, done FROM subtasks WHERE task_id = $1 ORDER BY created_at', [taskId])

export const listComments = (taskId) =>
  sql(
    `SELECT tc.id, tc.body, tc.created_at, u.name AS author_name
     FROM task_comments tc LEFT JOIN users u ON u.id = tc.author_id
     WHERE tc.task_id = $1 ORDER BY tc.created_at`,
    [taskId]
  )

/** Open tasks in the same project that this task could wait on. */
export const listBlockerOptions = (projectId, taskId) =>
  sql(
    `SELECT id, title FROM tasks
     WHERE project_id = $1 AND id <> $2 AND done_at IS NULL
     ORDER BY created_at`,
    [projectId, taskId]
  )

// --- projects ----------------------------------------------------------------

const PROJECT_SELECT = `
  SELECT p.id, p.name, p.description, p.status, p.due_date, p.owner_id, p.company_id,
         c.name AS company_name, u.name AS owner_name,
         (SELECT count(*)::int FROM tasks t WHERE t.project_id = p.id) AS total_tasks,
         (SELECT count(*)::int FROM tasks t WHERE t.project_id = p.id AND t.done_at IS NOT NULL) AS done_tasks
  FROM projects p
  JOIN companies c ON c.id = p.company_id
  LEFT JOIN users u ON u.id = p.owner_id`

export const listProjects = () =>
  sql(`${PROJECT_SELECT}
       ORDER BY p.status = 'done', p.status = 'on_hold', p.due_date NULLS LAST, p.created_at DESC`)

export const listCompanyProjects = (companyId) =>
  sql(`${PROJECT_SELECT} WHERE p.company_id = $1 ORDER BY p.status = 'done', p.created_at DESC`, [companyId])

export const getProject = async (id) => (await sql(`${PROJECT_SELECT} WHERE p.id = $1`, [id]))[0] || null

export const listProjectOptions = () =>
  sql(
    `SELECT p.id, p.name, c.name AS company_name
     FROM projects p JOIN companies c ON c.id = p.company_id
     WHERE p.status <> 'done'
     ORDER BY c.name, p.name`
  )

// --- clients and leads -------------------------------------------------------

const COMPANY_SELECT = `
  SELECT c.id, c.name, c.sector, c.website, c.address, c.services, c.stage, c.source, c.lost_reason,
         c.next_follow_up, c.owner_id, u.name AS owner_name,
         (SELECT ct.name FROM contacts ct WHERE ct.company_id = c.id ORDER BY ct.created_at LIMIT 1) AS contact_name,
         (SELECT count(*)::int FROM projects p WHERE p.company_id = c.id AND p.status <> 'done') AS active_projects
  FROM companies c
  LEFT JOIN users u ON u.id = c.owner_id`

export const listCompanies = () => sql(`${COMPANY_SELECT} ORDER BY c.next_follow_up NULLS LAST, c.name`)

export const getCompany = async (id) => (await sql(`${COMPANY_SELECT} WHERE c.id = $1`, [id]))[0] || null

export const listCompanyOptions = () =>
  sql(`SELECT id, name FROM companies WHERE stage <> 'lost' ORDER BY name`)

export const listContacts = (companyId) =>
  sql('SELECT id, name, role, email, phone FROM contacts WHERE company_id = $1 ORDER BY created_at', [companyId])

export const listNotes = (companyId) =>
  sql(
    `SELECT n.id, n.kind, n.body, n.created_at, u.name AS author_name
     FROM notes n LEFT JOIN users u ON u.id = n.author_id
     WHERE n.company_id = $1 ORDER BY n.created_at DESC`,
    [companyId]
  )

// --- revenue -----------------------------------------------------------------

const INCOME_SELECT = `
  SELECT i.id, i.company_id, i.kind, i.description,
         i.amount::float8 AS amount, i.received::float8 AS received,
         c.name AS company_name
  FROM income i JOIN companies c ON c.id = i.company_id`

export const listIncome = () => sql(`${INCOME_SELECT} ORDER BY i.amount DESC, c.name`)

export const listCompanyIncome = (companyId) =>
  sql(`${INCOME_SELECT} WHERE i.company_id = $1 ORDER BY i.amount DESC`, [companyId])

// --- invoices ----------------------------------------------------------------

export const getSettings = async () => (await sql('SELECT * FROM company_settings WHERE id'))[0]

const INVOICE_SELECT = `
  SELECT i.id, i.number, i.company_id, i.income_id, i.status, i.issue_date, i.due_date,
         i.bill_to_name, i.bill_to_address, i.bill_to_state, i.bill_to_gstin,
         i.gst_rate::float8 AS gst_rate, i.notes, i.seller,
         c.name AS company_name,
         COALESCE((SELECT sum(round(it.quantity * it.rate, 2)) FROM invoice_items it WHERE it.invoice_id = i.id), 0)::float8 AS subtotal,
         COALESCE((SELECT sum(p.amount) FROM invoice_payments p WHERE p.invoice_id = i.id), 0)::float8 AS paid
  FROM invoices i JOIN companies c ON c.id = i.company_id`

export const listInvoices = () =>
  sql(`${INVOICE_SELECT} ORDER BY i.status = 'draft' DESC, i.issue_date DESC, i.created_at DESC`)

export const getInvoice = async (id) => (await sql(`${INVOICE_SELECT} WHERE i.id = $1`, [id]))[0] || null

export const listInvoiceItems = (invoiceId) =>
  sql(
    `SELECT id, description, quantity::float8 AS quantity, rate::float8 AS rate
     FROM invoice_items WHERE invoice_id = $1 ORDER BY position`,
    [invoiceId]
  )

export const listInvoicePayments = (invoiceId) =>
  sql(
    `SELECT id, amount::float8 AS amount, paid_on, method, reference
     FROM invoice_payments WHERE invoice_id = $1 ORDER BY paid_on, created_at`,
    [invoiceId]
  )

export const listHistory = (entity, entityId) =>
  sql(
    `SELECT id, summary, user_name, at FROM audit_log
     WHERE entity = $1 AND entity_id = $2 ORDER BY at DESC, id DESC`,
    [entity, entityId]
  )

export const listClientsForInvoice = () =>
  sql(`SELECT id, name, address FROM companies WHERE stage <> 'lost' ORDER BY name`)

// --- overview ----------------------------------------------------------------

export const getOverview = async (userId, today) => {
  const horizon = addDays(today, 7)

  const [counts, attention, deadlines, followUps, approvals] = await Promise.all([
    sql(
      `SELECT
         (SELECT count(*)::int FROM projects WHERE status NOT IN ('done', 'on_hold')) AS active_projects,
         (SELECT count(*)::int FROM tasks WHERE done_at IS NULL AND due_date < $1) AS overdue_tasks,
         (SELECT count(*)::int FROM tasks WHERE done_at IS NULL AND due_date BETWEEN $1 AND $2)
           + (SELECT count(*)::int FROM projects WHERE status NOT IN ('done', 'on_hold') AND due_date BETWEEN $1 AND $2)
           AS upcoming_deadlines,
         (SELECT count(*)::int FROM companies WHERE stage <> 'lost' AND next_follow_up <= $1) AS follow_ups_due`,
      [today, horizon]
    ),
    // Overdue and due today, the signed-in founder's own first, counting those for both.
    sql(
      `${TASK_SELECT}
       WHERE t.done_at IS NULL AND t.due_date <= $1
       ORDER BY (t.for_both OR t.assignee_id IS NOT DISTINCT FROM $2::uuid) DESC, t.due_date, t.due_time NULLS LAST,
                array_position(ARRAY['critical', 'high', 'medium', 'low'], t.priority)`,
      [today, userId]
    ),
    // After today, because today's tasks are already in the list above.
    sql(
      `SELECT * FROM (
         SELECT 'task' AS type, t.id, t.title, t.due_date, to_char(t.due_time, 'HH24:MI') AS due_time, c.name AS company_name,
                CASE WHEN t.for_both THEN 'Both' ELSE u.name END AS person
         FROM tasks t
         LEFT JOIN projects p ON p.id = t.project_id
         LEFT JOIN companies c ON c.id = p.company_id
         LEFT JOIN users u ON u.id = t.assignee_id
         WHERE t.done_at IS NULL AND t.due_date > $1 AND t.due_date <= $2
         UNION ALL
         SELECT 'project', p.id, p.name, p.due_date, NULL, c.name, u.name
         FROM projects p
         JOIN companies c ON c.id = p.company_id
         LEFT JOIN users u ON u.id = p.owner_id
         WHERE p.status NOT IN ('done', 'on_hold') AND p.due_date BETWEEN $1 AND $2
       ) d ORDER BY due_date, due_time NULLS LAST, type`,
      [today, horizon]
    ),
    sql(
      `${COMPANY_SELECT}
       WHERE c.stage <> 'lost' AND c.next_follow_up <= $1
       ORDER BY c.next_follow_up`,
      [today]
    ),
    sql(
      `${TASK_SELECT}
       WHERE t.done_at IS NULL AND t.approval IN ('awaiting', 'changes_requested')
       ${TASK_ORDER}`
    ),
  ])

  return { ...counts[0], attention, deadlines, followUps, approvals }
}

// --- documents ---------------------------------------------------------------

const DOCUMENT_SELECT = `
  SELECT d.id, d.name, d.mime, d.size, d.created_at, d.folder_id, d.company_id,
         f.name AS folder_name, c.name AS company_name, u.name AS uploaded_by_name
  FROM documents d
  LEFT JOIN folders f ON f.id = d.folder_id
  LEFT JOIN companies c ON c.id = d.company_id
  LEFT JOIN users u ON u.id = d.uploaded_by`

export const getFolder = async (id) =>
  (await sql('SELECT id, name, parent_id FROM folders WHERE id = $1', [id]))[0] || null

/** The folders from the top down to this one, for the way back. */
export const getFolderPath = (id) =>
  sql(
    `WITH RECURSIVE up AS (
       SELECT id, name, parent_id, 0 AS depth FROM folders WHERE id = $1
       UNION ALL
       SELECT f.id, f.name, f.parent_id, up.depth + 1 FROM folders f JOIN up ON f.id = up.parent_id WHERE up.depth < 32
     )
     SELECT id, name FROM up ORDER BY depth DESC`,
    [id]
  )

/** The folders inside one folder, or at the top level when `parentId` is null. */
export const listFolders = (parentId) =>
  sql(
    `SELECT f.id, f.name,
            (SELECT count(*)::int FROM folders s WHERE s.parent_id = f.id)
              + (SELECT count(*)::int FROM documents d WHERE d.folder_id = f.id) AS items
     FROM folders f
     WHERE f.parent_id IS NOT DISTINCT FROM $1::uuid
     ORDER BY lower(f.name)`,
    [parentId]
  )

export const listDocuments = (folderId) =>
  sql(`${DOCUMENT_SELECT} WHERE d.folder_id IS NOT DISTINCT FROM $1::uuid ORDER BY lower(d.name)`, [folderId])

export const listCompanyDocuments = (companyId) =>
  sql(`${DOCUMENT_SELECT} WHERE d.company_id = $1 ORDER BY lower(d.name)`, [companyId])

/** Files whose name, client or folder contains the words. */
export const searchDocuments = (pattern) =>
  sql(
    `${DOCUMENT_SELECT}
     WHERE d.name ILIKE $1 OR c.name ILIKE $1 OR f.name ILIKE $1
     ORDER BY lower(d.name) LIMIT 100`,
    [pattern]
  )

export const getDocument = async (id) => (await sql(`${DOCUMENT_SELECT} WHERE d.id = $1`, [id]))[0] || null

/** The bytes too. Only the download route needs them. */
export const getDocumentFile = async (id) =>
  (
    await sql(
      `SELECT d.name, d.mime, f.data FROM documents d JOIN document_files f ON f.document_id = d.id WHERE d.id = $1`,
      [id]
    )
  )[0] || null

export const getDocumentStats = async () =>
  (await sql('SELECT count(*)::int AS files, COALESCE(sum(size), 0)::float8 AS bytes FROM documents'))[0]

/** Every folder as "Agreements / Clients", in tree order, for choosing where a file goes. */
export const listFolderOptions = () =>
  sql(
    `WITH RECURSIVE tree AS (
       SELECT id, name::text AS path, lower(name)::text AS sort, 0 AS depth FROM folders WHERE parent_id IS NULL
       UNION ALL
       SELECT f.id, tree.path || ' / ' || f.name, tree.sort || chr(1) || lower(f.name), tree.depth + 1
       FROM folders f JOIN tree ON f.parent_id = tree.id
       WHERE tree.depth < 32
     )
     SELECT id, path FROM tree ORDER BY sort COLLATE "C"`
  )

// --- bank --------------------------------------------------------------------

export const listEarnings = () =>
  sql(
    `SELECT e.id, e.user_id, u.name AS user_name, e.amount::float8 AS amount, e.rate::float8 AS rate,
            e.share::float8 AS share, e.received_on, e.paid_on, e.note,
            e.company_id, c.name AS company_name, a.name AS added_by, e.created_at
     FROM earnings e
     JOIN users u ON u.id = e.user_id
     LEFT JOIN companies c ON c.id = e.company_id
     LEFT JOIN users a ON a.id = e.created_by
     ORDER BY e.received_on DESC, e.created_at DESC`
  )

export const listBankEntries = () =>
  sql(
    `SELECT b.id, b.direction, b.amount::float8 AS amount, b.entry_date, b.description, b.category,
            b.agreed_by_both, u.name AS added_by, b.created_at
     FROM bank_entries b
     LEFT JOIN users u ON u.id = b.created_by
     ORDER BY b.entry_date DESC, b.created_at DESC`
  )
