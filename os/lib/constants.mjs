/** Labels for the fixed values the database CHECK constraints allow. */

const labels = (options) => Object.fromEntries(options.map((o) => [o.value, o.label]))

export const STAGES = [
  { value: 'new', label: 'New lead' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'meeting', label: 'Meeting scheduled' },
  { value: 'proposal', label: 'Proposal sent' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
]
export const STAGE_LABEL = labels(STAGES)
export const OPEN_STAGES = STAGES.filter((s) => s.value !== 'won' && s.value !== 'lost')
export const isOpenStage = (stage) => stage !== 'won' && stage !== 'lost'

export const SOURCES = ['Referral', 'LinkedIn', 'Instagram', 'Website', 'Direct outreach', 'Other'].map((s) => ({
  value: s,
  label: s,
}))

export const NOTE_KINDS = [
  { value: 'conversation', label: 'Conversation' },
  { value: 'internal', label: 'Internal note' },
]
export const NOTE_KIND_LABEL = labels(NOTE_KINDS)

export const PROJECT_STATUSES = [
  { value: 'planning', label: 'Planning' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'client_review', label: 'Client review' },
  { value: 'on_hold', label: 'On hold' },
  { value: 'done', label: 'Done' },
]
export const PROJECT_STATUS_LABEL = labels(PROJECT_STATUSES)

export const PRIORITIES = [
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]
export const PRIORITY_LABEL = labels(PRIORITIES)

export const APPROVALS = [
  { value: 'not_required', label: 'Not needed' },
  { value: 'awaiting', label: 'Awaiting client' },
  { value: 'approved', label: 'Client approved' },
  { value: 'changes_requested', label: 'Changes requested' },
]
export const APPROVAL_LABEL = labels(APPROVALS)

export const RECURRENCES = [
  { value: 'none', label: 'Does not repeat' },
  { value: 'weekly', label: 'Every week' },
  { value: 'monthly', label: 'Every month' },
  { value: 'yearly', label: 'Every year' },
]
export const RECURRENCE_LABEL = labels(RECURRENCES)

export const INCOME_KINDS = [
  { value: 'project', label: 'One-time project' },
  { value: 'monthly', label: 'Monthly fee' },
  { value: 'other', label: 'Other work' },
]
