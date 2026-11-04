import Link from 'next/link'
import { AutoSubmitSelect, ActionForm } from '@/components/forms'
import { Badge, BUTTON_PRIMARY, Card, Empty, PageHeader, Tabs } from '@/components/ui'
import { moveStage } from '@/lib/actions/crm'
import { requireUser } from '@/lib/auth'
import { OPEN_STAGES, STAGES } from '@/lib/constants.mjs'
import { dueLabel, todayIST } from '@/lib/dates.mjs'
import { listCompanies } from '@/lib/queries'

export const metadata = { title: 'Clients & CRM' }

function LeadCard({ lead, today }) {
  const due = dueLabel(lead.next_follow_up, today)
  return (
    <li className="row-press relative rounded-2xl bg-raised p-3.5">
      <Link href={`/clients/${lead.id}`} className="block break-words text-body font-medium text-ink after:absolute after:inset-0 md:text-sub">
        {lead.name}
      </Link>
      {lead.contact_name && <div className="mt-0.5 break-words text-foot text-muted">{lead.contact_name}</div>}
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <Badge tone={due.tone}>Follow up: {due.text}</Badge>
      </div>
      <ActionForm action={moveStage} className="relative z-10 mt-2.5">
        <input type="hidden" name="id" value={lead.id} />
        <AutoSubmitSelect
          name="stage"
          aria-label={`Move ${lead.name} to stage`}
          defaultValue={lead.stage}
          options={STAGES}
          className="select-arrow min-h-10 w-full rounded-xl bg-canvas px-3 text-body text-ink2 outline-none focus:ring-[3px] focus:ring-accent/30 md:min-h-9 md:text-foot"
        />
      </ActionForm>
    </li>
  )
}

/** Stacked on phones, with empty stages hidden, so no lead sits off-screen. */
function Pipeline({ leads, today }) {
  return (
    <div className="pb-2 md:overflow-x-auto">
      <div className="grid gap-3 md:min-w-[880px] md:grid-cols-5">
        {OPEN_STAGES.map((stage, i) => {
          const column = leads.filter((l) => l.stage === stage.value)
          return (
            <section key={stage.value} className={`rounded-card bg-fill/60 p-2 ${column.length ? '' : 'max-md:hidden'}`}>
              <h2 className="flex items-center justify-between px-1.5 py-1 text-foot font-semibold text-ink">
                <span>
                  <span className="mr-1.5 font-normal text-muted tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  {stage.label}
                </span>
                <span className="font-normal text-muted tabular-nums">{column.length}</span>
              </h2>
              <ul className="mt-1.5 space-y-2">
                {column.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} today={today} />
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </div>
  )
}

function CompanyList({ companies, today, lost, emptyTitle, emptyText }) {
  if (!companies.length) {
    return (
      <Card>
        <Empty title={emptyTitle}>{emptyText}</Empty>
      </Card>
    )
  }
  return (
    <Card>
      <ul className="rows">
        {companies.map((c) => (
          <li key={c.id} className="row-press flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3">
            <div className="min-w-0">
              <Link href={`/clients/${c.id}`} className="break-words text-body font-medium text-ink after:absolute after:inset-0 md:text-sub">
                {c.name}
              </Link>
              <div className="mt-0.5 break-words text-foot text-muted">
                {lost
                  ? c.lost_reason || 'No reason recorded'
                  : [c.contact_name, c.sector, c.owner_name].filter(Boolean).join(' · ') || 'No details yet'}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {!lost && c.active_projects > 0 && (
                <span className="text-foot text-muted">
                  {c.active_projects} active project{c.active_projects === 1 ? '' : 's'}
                </span>
              )}
              {!lost && c.next_follow_up && (
                <Badge tone={dueLabel(c.next_follow_up, today).tone}>
                  Follow up: {dueLabel(c.next_follow_up, today).text}
                </Badge>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export default async function ClientsPage({ searchParams }) {
  await requireUser()
  const { view = 'pipeline' } = await searchParams
  const today = todayIST()
  const companies = await listCompanies()

  const leads = companies.filter((c) => c.stage !== 'won' && c.stage !== 'lost')
  const won = companies.filter((c) => c.stage === 'won')
  const lost = companies.filter((c) => c.stage === 'lost')

  return (
    <>
      <PageHeader
        title="Clients & CRM"
        description="Every open lead must have a next follow-up date or a closed status."
        action={
          <Link href={`/clients/new${view === 'clients' ? '?stage=won' : ''}`} className={BUTTON_PRIMARY}>
            {view === 'clients' ? 'Add client' : 'Add lead'}
          </Link>
        }
      />

      <div className="mb-4">
        <Tabs
          label="CRM view"
          active={view}
          items={[
            { value: 'pipeline', label: 'Pipeline', count: leads.length, href: '/clients' },
            { value: 'clients', label: 'Clients', count: won.length, href: '/clients?view=clients' },
            { value: 'lost', label: 'Lost', count: lost.length, href: '/clients?view=lost' },
          ]}
        />
      </div>

      {view === 'clients' ? (
        <CompanyList companies={won} today={today} emptyTitle="No clients yet" emptyText="Add an existing client, or mark a lead as Won." />
      ) : view === 'lost' ? (
        <CompanyList companies={lost} today={today} lost emptyTitle="No lost leads" />
      ) : leads.length ? (
        <Pipeline leads={leads} today={today} />
      ) : (
        <Card>
          <Empty title="No open leads">Add a lead with a next follow-up date and it will appear on the board.</Empty>
        </Card>
      )}
    </>
  )
}
