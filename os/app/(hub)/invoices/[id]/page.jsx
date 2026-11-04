import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Download, Trash2 } from 'lucide-react'
import { ActionForm, ConfirmSubmit, Submit } from '@/components/forms'
import { ShareFile } from '@/components/ShareFile'
import { SheetButton } from '@/components/Sheet'
import { Badge, BUTTON_DANGER, BUTTON_PRIMARY, BUTTON_SECONDARY, Card, Field, Input, PageHeader } from '@/components/ui'
import { cancelInvoice, deleteDraft, deletePayment, issueInvoice, recordPayment } from '@/lib/actions/invoices'
import { getUser, requireUser } from '@/lib/auth'
import { formatDateTime, formatDay, todayIST } from '@/lib/dates.mjs'
import { isUuid } from '@/lib/forms'
import { amountInWords, invoiceState, invoiceTotals, lineAmount } from '@/lib/invoice.mjs'
import { formatINR } from '@/lib/money.mjs'
import { getInvoice, getSettings, listHistory, listInvoiceItems, listInvoicePayments } from '@/lib/queries'

export async function generateMetadata({ params }) {
  const { id } = await params
  const invoice = (await getUser()) && isUuid(id) ? await getInvoice(id) : null
  return { title: invoice ? invoice.number ?? 'Draft invoice' : 'Not found' }
}

const Label = ({ children }) => <div className="text-cap font-semibold uppercase tracking-wide text-muted">{children}</div>

function Total({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="text-ink tabular-nums">{value}</dd>
    </div>
  )
}

export default async function InvoicePage({ params }) {
  await requireUser()
  const { id } = await params
  const invoice = isUuid(id) ? await getInvoice(id) : null
  if (!invoice) notFound()

  const today = todayIST()
  const [items, payments, history, settings] = await Promise.all([
    listInvoiceItems(id),
    listInvoicePayments(id),
    listHistory('invoice', id),
    getSettings(),
  ])
  const seller = invoice.seller ?? settings
  const totals = invoiceTotals(invoice.subtotal, invoice.gst_rate, seller.state, invoice.bill_to_state)
  const balance = Math.round((totals.total - invoice.paid) * 100) / 100
  const state = invoiceState({ ...invoice, total: totals.total }, today)
  const isDraft = invoice.status === 'draft'
  const canPay = invoice.status === 'issued'
  const pdfHref = `/invoices/${id}/pdf`
  const pdfName = `${(invoice.number ?? `draft-${invoice.bill_to_name}`).replace(/[^\w-]+/g, '-')}.pdf`
  const bank = [
    ['Bank', seller.bank_name],
    ['Account name', seller.account_name],
    ['Account number', seller.account_number],
    ['IFSC', seller.ifsc],
    ['UPI', seller.upi_id],
  ].filter(([, value]) => value)

  return (
    <div className="max-w-3xl">
      <PageHeader
        back={{ href: '/invoices', label: 'Invoices' }}
        eyebrow={<Badge tone={state.tone}>{state.text}</Badge>}
        title={invoice.number ?? 'Draft invoice'}
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {isDraft && (
          <ActionForm action={issueInvoice} errorTitle="Can’t Issue Invoice" success="Invoice issued" className="contents">
            <input type="hidden" name="id" value={id} />
            <ConfirmSubmit
              title="Issue This Invoice?"
              message="It gets its number and can no longer be edited."
              confirm="Issue"
              destructive={false}
              className={`${BUTTON_PRIMARY} flex-1 sm:flex-none`}
            >
              Issue invoice
            </ConfirmSubmit>
          </ActionForm>
        )}
        {canPay && (
          <SheetButton label="Record payment" title="Record payment" className={`${BUTTON_PRIMARY} flex-1 sm:flex-none`}>
            <ActionForm action={recordPayment} closeOnSuccess success="Payment recorded" className="grid grid-cols-2 gap-3 px-4 pb-4 pt-1">
              <input type="hidden" name="invoice_id" value={id} />
              <Field label="Amount (₹)">
                <Input name="amount" required inputMode="decimal" defaultValue={balance} autoComplete="off" data-autofocus />
              </Field>
              <Field label="Received on">
                <Input type="date" name="paid_on" required defaultValue={today} />
              </Field>
              <Field label="How">
                <Input name="method" placeholder="UPI, bank transfer" autoComplete="off" />
              </Field>
              <Field label="Reference">
                <Input name="reference" placeholder="Optional" autoComplete="off" />
              </Field>
              <div className="col-span-2">
                <Submit className={`${BUTTON_PRIMARY} w-full`}>Save payment</Submit>
              </div>
            </ActionForm>
          </SheetButton>
        )}
        <a href={pdfHref} className={`${isDraft || canPay ? BUTTON_SECONDARY : BUTTON_PRIMARY} flex-1 sm:flex-none`}>
          <Download size={16} aria-hidden="true" />
          {isDraft ? 'Preview PDF' : 'Download PDF'}
        </a>
        <ShareFile href={pdfHref} fileName={pdfName} title={invoice.number ?? 'Invoice'} className={`${BUTTON_SECONDARY} flex-1 sm:flex-none`} />
        {isDraft && (
          <Link href={`/invoices/${id}/edit`} className={`${BUTTON_SECONDARY} flex-1 sm:flex-none`}>
            Edit
          </Link>
        )}
      </div>

      <div className="space-y-4">
        {/* The invoice itself, one continuous page like the PDF, filling the phone's width. */}
        <section aria-label="Invoice" className="card-surface overflow-hidden rounded-card bg-surface">
          <div className="flex items-center justify-between gap-3 p-4 md:p-6">
            <div className="flex min-w-0 items-center gap-3">
              <Image src="/logo-print.png" alt="" width={44} height={44} className="logo-mark h-9 w-auto" />
              <div className="min-w-0 break-words text-headline text-ink">{seller.legal_name}</div>
            </div>
            <div className="shrink-0 text-right text-[0.8125rem] font-bold tracking-wide text-ink md:text-title">
              {seller.gstin ? 'TAX INVOICE' : 'INVOICE'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-line p-4 md:grid-cols-3 md:p-6">
            <div>
              <Label>Invoice date</Label>
              <div className="mt-0.5 font-medium text-ink">{formatDay(invoice.issue_date, today)}</div>
            </div>
            <div>
              <Label>Due date</Label>
              <div className="mt-0.5 font-medium text-ink">{invoice.due_date ? formatDay(invoice.due_date, today) : '—'}</div>
            </div>
            <div className="col-span-2 md:col-span-1">
              <Label>Amount due</Label>
              <div className="mt-0.5 text-title text-ink tabular-nums">{formatINR(Math.max(0, balance))}</div>
            </div>
          </div>

          <div className="grid gap-4 border-t border-line p-4 sm:grid-cols-2 md:p-6">
            <div className="min-w-0">
              <Label>Billed to</Label>
              <div className="mt-1 break-words font-semibold text-ink">{invoice.bill_to_name}</div>
              {[invoice.bill_to_address, invoice.bill_to_state, invoice.bill_to_gstin && `GSTIN ${invoice.bill_to_gstin}`]
                .filter(Boolean)
                .map((line) => (
                  <div key={line} className="break-words text-sub text-muted">
                    {line}
                  </div>
                ))}
            </div>
            <div className="min-w-0">
              <Label>From</Label>
              <div className="mt-1 break-words font-semibold text-ink">{seller.legal_name}</div>
              {[seller.address, seller.email, seller.phone, seller.gstin && `GSTIN ${seller.gstin}`]
                .filter(Boolean)
                .map((line) => (
                  <div key={line} className="break-words text-sub text-muted">
                    {line}
                  </div>
                ))}
            </div>
          </div>

          <div className="border-t border-line">
            <div className="flex justify-between gap-3 bg-canvas px-4 py-2 md:px-6">
              <Label>Description</Label>
              <Label>Amount</Label>
            </div>
            <ul className="rows" style={{ '--rows-inset': '0' }}>
              {items.map((item) => (
                <li key={item.id} className="flex items-baseline justify-between gap-3 px-4 py-3 md:px-6">
                  <div className="min-w-0">
                    <div className="break-words text-body text-ink md:text-sub">{item.description}</div>
                    <div className="text-foot text-muted tabular-nums">
                      {item.quantity} × {formatINR(item.rate)}
                    </div>
                  </div>
                  <div className="shrink-0 text-body font-medium text-ink tabular-nums md:text-sub">{formatINR(lineAmount(item))}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-line p-4 md:p-6">
            <dl className="space-y-1.5 text-body md:text-sub">
              <Total label="Subtotal" value={formatINR(totals.subtotal)} />
              {totals.cgst > 0 && <Total label={`CGST ${invoice.gst_rate / 2}%`} value={formatINR(totals.cgst)} />}
              {totals.sgst > 0 && <Total label={`SGST ${invoice.gst_rate / 2}%`} value={formatINR(totals.sgst)} />}
              {totals.igst > 0 && <Total label={`IGST ${invoice.gst_rate}%`} value={formatINR(totals.igst)} />}
              <div className="flex items-baseline justify-between gap-4 border-t border-line pt-2 text-headline text-ink">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatINR(totals.total)}</dd>
              </div>
              {invoice.paid > 0 && <Total label="Received" value={formatINR(invoice.paid)} />}
              {invoice.paid > 0 && balance > 0 && <Total label="Still to come" value={formatINR(balance)} />}
            </dl>
            <p className="mt-2 text-foot text-muted">{amountInWords(totals.total)}</p>
            {invoice.notes && <p className="mt-3 whitespace-pre-line break-words text-sub text-ink2">{invoice.notes}</p>}
          </div>

          {bank.length > 0 && (
            <div className="border-t border-line p-4 md:p-6">
              <Label>How to pay</Label>
              <dl className="mt-2 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1 text-sub">
                {bank.map(([name, value]) => (
                  <div key={name} className="contents">
                    <dt className="text-muted">{name}</dt>
                    <dd className="break-words font-medium text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </section>

        {payments.length > 0 && (
          <Card title="Payments" count={payments.length}>
            <ul className="rows">
              {payments.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-1.5 pl-4 pr-2">
                  <div className="min-w-0">
                    <div className="text-body font-medium text-ink tabular-nums md:text-sub">{formatINR(p.amount)}</div>
                    <div className="break-words text-foot text-muted">
                      {[formatDay(p.paid_on, today), p.method, p.reference].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                  <ActionForm action={deletePayment} errorTitle="Couldn’t Remove">
                    <input type="hidden" name="id" value={p.id} />
                    <ConfirmSubmit
                      title="Remove Payment?"
                      message={`This ${formatINR(p.amount)} payment will come off the invoice.`}
                      confirm="Remove"
                      aria-label={`Remove ${formatINR(p.amount)} payment`}
                      className="press flex h-11 w-11 items-center justify-center rounded-full text-muted hover:text-late"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </ConfirmSubmit>
                  </ActionForm>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {history.length > 0 && (
          <Card title="History">
            <ul className="rows pb-1">
              {history.map((h) => (
                <li key={h.id} className="px-4 py-2.5">
                  <div className="break-words text-sub text-ink">{h.summary}</div>
                  <div className="mt-0.5 text-foot text-muted">
                    {[h.user_name, formatDateTime(h.at)].filter(Boolean).join(' · ')}
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {isDraft && (
          <ActionForm action={deleteDraft} errorTitle="Couldn’t Delete">
            <input type="hidden" name="id" value={id} />
            <ConfirmSubmit title="Delete Draft?" message="This can’t be undone." className={BUTTON_DANGER}>
              Delete draft
            </ConfirmSubmit>
          </ActionForm>
        )}
        {canPay && (
          <ActionForm action={cancelInvoice} errorTitle="Can’t Cancel Invoice">
            <input type="hidden" name="id" value={id} />
            <ConfirmSubmit title={`Cancel ${invoice.number}?`} message="Its number stays used." confirm="Cancel Invoice" dismiss="Keep Invoice" className={BUTTON_DANGER}>
              Cancel invoice
            </ConfirmSubmit>
          </ActionForm>
        )}
      </div>
    </div>
  )
}
