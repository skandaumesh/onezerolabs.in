import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { ActionForm, ConfirmSubmit, Submit } from '@/components/forms'
import { SheetButton } from '@/components/Sheet'
import {
  Badge,
  BUTTON_DANGER,
  BUTTON_PRIMARY,
  BUTTON_SECONDARY,
  BUTTON_TEXT,
  Card,
  Empty,
  Field,
  Input,
  PageHeader,
  Progress,
  Select,
  Textarea,
} from '@/components/ui'
import { addContact, addNote, deleteCompany, deleteContact, scheduleFollowUp } from '@/lib/actions/crm'
import { getUser, requireUser } from '@/lib/auth'
import { NOTE_KIND_LABEL, NOTE_KINDS, PROJECT_STATUS_LABEL, STAGE_LABEL } from '@/lib/constants.mjs'
import { dueLabel, formatDateTime, todayIST } from '@/lib/dates.mjs'
import { isUuid, safeUrl } from '@/lib/forms'
import { formatINR, receivedStatus } from '@/lib/money.mjs'
import { DocumentRow } from '@/components/DocumentRows'
import { UploadForm } from '@/components/UploadForm'
import {
  getCompany,
  listCompanyDocuments,
  listCompanyIncome,
  listCompanyOptions,
  listCompanyProjects,
  listContacts,
  listFolderOptions,
  listNotes,
} from '@/lib/queries'

export async function generateMetadata({ params }) {
  const { id } = await params
  const company = (await getUser()) && isUuid(id) ? await getCompany(id) : null
  return { title: company?.name ?? 'Not found' }
}

const STAGE_TONE = { won: 'good', lost: 'late' }

function Detail({ label, children }) {
  if (!children) return null
  return (
    <li className="px-4 py-2.5">
      <div className="text-foot text-muted">{label}</div>
      <div className="mt-0.5 whitespace-pre-line break-words text-body text-ink md:text-sub">{children}</div>
    </li>
  )
}

export default async function CompanyPage({ params }) {
  await requireUser()
  const { id } = await params
  const company = isUuid(id) ? await getCompany(id) : null
  if (!company) notFound()

  const today = todayIST()
  const [contacts, notes, projects, income, documents, folderOptions, companies] = await Promise.all([
    listContacts(id),
    listNotes(id),
    listCompanyProjects(id),
    listCompanyIncome(id),
    listCompanyDocuments(id),
    listFolderOptions(),
    listCompanyOptions(),
  ])
  const website = safeUrl(company.website)
  const due = company.next_follow_up ? dueLabel(company.next_follow_up, today) : null

  return (
    <>
      <PageHeader
        back={{ href: company.stage === 'won' ? '/clients?view=clients' : '/clients', label: 'Clients & CRM' }}
        title={company.name}
        action={
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge tone={STAGE_TONE[company.stage] ?? 'plain'}>{STAGE_LABEL[company.stage]}</Badge>
            <Link href={`/clients/${id}/edit`} className={BUTTON_SECONDARY}>
              Edit
            </Link>
          </div>
        }
      />

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-4">
          {company.stage !== 'lost' && (
            <Card
              title="Next follow-up"
              action={due ? <Badge tone={due.tone}>{due.text}</Badge> : <span className="text-foot text-muted">None set</span>}
            >
              <ActionForm action={scheduleFollowUp} reset success="Follow-up set" className="grid grid-cols-1 gap-3 px-4 pb-4 pt-1 sm:grid-cols-2">
                <input type="hidden" name="id" value={id} />
                <Field label="Next date">
                  <Input type="date" name="next_follow_up" required min={today} />
                </Field>
                <Field label="What happened (optional)">
                  <Input name="note" autoComplete="off" placeholder="Saved to the timeline below" />
                </Field>
                <div className="sm:col-span-2">
                  <Submit className={`${BUTTON_PRIMARY} w-full sm:w-auto`}>Save follow-up</Submit>
                </div>
              </ActionForm>
            </Card>
          )}

          <Card
            title="Projects"
            count={projects.length}
            action={
              <Link href={`/projects/new?client=${id}`} className={BUTTON_TEXT}>
                Add project
              </Link>
            }
          >
            {projects.length ? (
              <ul className="rows">
                {projects.map((p) => (
                  <li key={p.id} className="row-press px-4 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Link href={`/projects/${p.id}`} className="break-words text-body font-medium text-ink after:absolute after:inset-0 md:text-sub">
                        {p.name}
                      </Link>
                      <Badge tone={p.status === 'done' ? 'good' : 'plain'}>{PROJECT_STATUS_LABEL[p.status]}</Badge>
                    </div>
                    <div className="mt-2">
                      <Progress done={p.done_tasks} total={p.total_tasks} />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty title="No projects yet" />
            )}
          </Card>

          <Card title="Conversations and notes" count={notes.length}>
            <ActionForm action={addNote} reset className="grid grid-cols-1 gap-3 px-4 pb-4 pt-1">
              <input type="hidden" name="company_id" value={id} />
              <Textarea name="body" required aria-label="Note" placeholder="What was said or decided?" />
              <div className="flex flex-wrap items-center gap-2">
                <div className="min-w-40 flex-1 sm:w-48 sm:flex-none">
                  <Select name="kind" aria-label="Note type" defaultValue="conversation" options={NOTE_KINDS} />
                </div>
                <Submit className={BUTTON_PRIMARY}>Add note</Submit>
              </div>
            </ActionForm>
            {notes.length ? (
              <ul className="rows">
                {notes.map((n) => (
                  <li key={n.id} className="px-4 py-3">
                    <p className="whitespace-pre-line break-words text-body text-ink md:text-sub">{n.body}</p>
                    <div className="mt-1.5 text-foot text-muted">
                      {[NOTE_KIND_LABEL[n.kind], n.author_name, formatDateTime(n.created_at)].filter(Boolean).join(' · ')}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty title="Nothing recorded yet" />
            )}
          </Card>
        </div>

        <div className="min-w-0 space-y-4">
          <Card title="Company">
            <ul className="rows pb-1.5">
              <Detail label="Owner">{company.owner_name}</Detail>
              <Detail label="Sector">{company.sector}</Detail>
              <Detail label="How they found us">{company.source}</Detail>
              <Detail label="Website">
                {website ? (
                  <a href={website} target="_blank" rel="noreferrer" className="text-accent">
                    {company.website}
                  </a>
                ) : (
                  company.website
                )}
              </Detail>
              <Detail label="Address">{company.address}</Detail>
              <Detail label="Services">{company.services}</Detail>
              {company.stage === 'lost' && <Detail label="Reason lost">{company.lost_reason ?? 'Not recorded'}</Detail>}
            </ul>
          </Card>

          {income.length > 0 && (
            <Card
              title="Revenue"
              count={income.length}
              action={
                <Link href="/revenue" className={BUTTON_TEXT}>
                  Open
                </Link>
              }
            >
              <ul className="rows pb-1">
                {income.map((item) => (
                  <li key={item.id} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 py-2.5">
                    <span className="min-w-0 break-words text-body text-ink md:text-sub">{item.description}</span>
                    <span className="flex items-center gap-2">
                      {item.kind !== 'monthly' && <Badge tone={receivedStatus(item).tone}>{receivedStatus(item).text}</Badge>}
                      <span className="text-body font-medium text-ink tabular-nums md:text-sub">
                        {formatINR(item.amount)}
                        {item.kind === 'monthly' && <span className="font-normal text-muted"> /month</span>}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <Card
            title="Documents"
            count={documents.length}
            action={
              <SheetButton label="Upload" title="Upload files" className={BUTTON_TEXT}>
                <UploadForm companyId={id} folders={folderOptions} companies={companies} />
              </SheetButton>
            }
          >
            {documents.length ? (
              <ul className="rows pb-1" style={{ '--rows-inset': '3.75rem' }}>
                {documents.map((doc) => (
                  <DocumentRow key={doc.id} doc={doc} showClient={false} showFolder />
                ))}
              </ul>
            ) : (
              <p className="px-4 pb-4 text-sub text-muted">No agreements or quotations yet.</p>
            )}
          </Card>

          <Card
            title="Contacts"
            count={contacts.length}
            action={
              <SheetButton label="Add contact" title="New contact" className={BUTTON_TEXT}>
                <ActionForm action={addContact} reset closeOnSuccess success="Contact added" className="grid gap-3 px-4 pb-4 pt-1">
                  <input type="hidden" name="company_id" value={id} />
                  <Input name="name" required aria-label="Contact name" placeholder="Name" autoComplete="off" data-autofocus />
                  <Input name="role" aria-label="Contact role" placeholder="Role" autoComplete="off" />
                  <Input type="email" name="email" aria-label="Contact email" placeholder="Email" autoComplete="off" autoCapitalize="none" />
                  <Input type="tel" name="phone" aria-label="Contact phone" placeholder="Phone" autoComplete="off" />
                  <Submit className={`${BUTTON_PRIMARY} w-full`}>Save contact</Submit>
                </ActionForm>
              </SheetButton>
            }
          >
            {contacts.length > 0 ? (
              <ul className="rows pb-1">
                {contacts.map((ct) => (
                  <li key={ct.id} className="flex items-start justify-between gap-2 px-4 py-3">
                    <div className="min-w-0 text-sub">
                      <div className="break-words font-medium text-ink">{ct.name}</div>
                      {ct.role && <div className="break-words text-muted">{ct.role}</div>}
                      {ct.email && (
                        <a href={`mailto:${ct.email}`} className="block break-all text-accent">
                          {ct.email}
                        </a>
                      )}
                      {ct.phone && (
                        <a href={`tel:${ct.phone.replace(/\s+/g, '')}`} className="block text-accent">
                          {ct.phone}
                        </a>
                      )}
                    </div>
                    <ActionForm action={deleteContact} errorTitle="Couldn’t Remove">
                      <input type="hidden" name="id" value={ct.id} />
                      <ConfirmSubmit
                        title={`Remove ${ct.name}?`}
                        message="They’ll come off the contacts list."
                        confirm="Remove"
                        aria-label={`Remove ${ct.name}`}
                        className="press -mr-2 -mt-1 flex h-11 w-11 items-center justify-center rounded-full text-muted hover:text-late"
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </ConfirmSubmit>
                    </ActionForm>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty title="No contacts yet" />
            )}
          </Card>

          <ActionForm action={deleteCompany} errorTitle="Can’t Delete" className="flex flex-col items-start gap-2">
            <input type="hidden" name="id" value={id} />
            <ConfirmSubmit title={`Delete ${company.name}?`} message="All its notes and contacts go with it. This can’t be undone." className={BUTTON_DANGER}>
              Delete {company.stage === 'won' ? 'client' : 'lead'}
            </ConfirmSubmit>
          </ActionForm>
        </div>
      </div>
    </>
  )
}
