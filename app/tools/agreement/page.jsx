'use client'

/**
 * Agreement generator — internal tool page.
 *
 * Fill the form, download a .docx or .pdf. Everything runs in the browser:
 * no upload, no server round-trip, so client data never leaves the machine.
 *
 * The heavy libraries (docx ~500 KB, pdfmake ~2 MB with fonts) are loaded
 * dynamically on first export so they never enter the main page bundle.
 */

import { useMemo, useState } from 'react'
// Import the LIGHT modules only. `index.mjs` re-exports the renderers, which
// import `docx` — pulling that in here would defeat the dynamic import below.
import { createAgreementData } from '@/lib/agreement/config/schema.mjs'
import { exampleAgreement } from '@/lib/agreement/config/exampleData.mjs'
import { suggestFilename, PDF_STANDARD_FONTS } from '@/lib/agreement/util.mjs'
import { BTN_PRIMARY, BTN_SECONDARY, HEADING } from '@/components/ui/light-kit'

const FIELD =
  'w-full rounded-lg border border-[#0E1A33]/10 bg-white/80 px-3 py-2 text-[14px] text-[#0E1A33] ' +
  'placeholder:text-[#94A3B8] outline-none transition focus:border-[#0E1A33]/30 focus:bg-white'
const LABEL = 'mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-[#6E809F]'

// White panels on the grey page, as the homepage sets cards on its grey band.
const PANEL = 'rounded-2xl border border-white bg-white/60 p-5 md:p-6 shadow-[0_12px_28px_-16px_rgba(51,65,85,0.2)]'
const PANEL_TITLE = 'text-[15px] font-semibold text-[#0E1A33]'
const SMALL_BTN = 'rounded-full border border-[#0E1A33]/15 bg-white px-4 py-1.5 text-[12px] text-[#0E1A33] transition hover:border-[#0E1A33]/30'

const BLANK_FORM = {
  documentType: '',
  agreementNumber: '',
  agreementDate: '',
  effectiveDate: '',
  contractDuration: '',
  clientName: '',
  clientLegalEntity: '',
  clientAddress: '',
  clientEmail: '',
  clientRepName: '',
  clientRepDesignation: '',
  providerAddress: '',
  providerEmail: '',
  providerRepName: '',
  providerRepDesignation: '',
  projectName: '',
  purpose: '',
  paymentTerms: '',
  governingLaw: '',
  jurisdiction: '',
  noticePeriodDays: '',
  supportWindow: '',
  revisionRounds: '',
  documentId: '',
  version: '',
  status: '',
  preparedBy: '',
}

/** Map the flat form into the nested agreement schema. */
const toAgreementData = (f, rows) =>
  createAgreementData({
    documentType: f.documentType,
    agreementNumber: f.agreementNumber,
    agreementDate: f.agreementDate,
    effectiveDate: f.effectiveDate,
    contractDuration: f.contractDuration,
    provider: {
      address: f.providerAddress,
      email: f.providerEmail,
      representative: { name: f.providerRepName, designation: f.providerRepDesignation },
    },
    client: {
      name: f.clientName,
      legalEntity: f.clientLegalEntity,
      address: f.clientAddress,
      email: f.clientEmail,
      representative: { name: f.clientRepName, designation: f.clientRepDesignation },
    },
    projectName: f.projectName,
    purpose: f.purpose,
    deliverables: rows.deliverables.filter((r) => r.service || r.description),
    fees: rows.fees.filter((r) => r.item || r.amount),
    paymentTerms: f.paymentTerms,
    governingLaw: f.governingLaw,
    jurisdiction: f.jurisdiction,
    noticePeriodDays: f.noticePeriodDays,
    supportWindow: f.supportWindow,
    revisionRounds: f.revisionRounds,
    control: {
      documentId: f.documentId,
      version: f.version,
      status: f.status,
      preparedBy: f.preparedBy,
    },
  })

/** Flatten the example back into the form shape. */
const exampleToForm = () => {
  const e = exampleAgreement
  return {
    documentType: e.documentType,
    agreementNumber: e.agreementNumber,
    agreementDate: e.agreementDate,
    effectiveDate: e.effectiveDate,
    contractDuration: e.contractDuration,
    clientName: e.client.name,
    clientLegalEntity: e.client.legalEntity,
    clientAddress: e.client.address,
    clientEmail: e.client.email,
    clientRepName: e.client.representative.name,
    clientRepDesignation: e.client.representative.designation,
    providerAddress: e.provider.address,
    providerEmail: e.provider.email,
    providerRepName: e.provider.representative.name,
    providerRepDesignation: e.provider.representative.designation,
    projectName: e.projectName,
    purpose: e.purpose,
    paymentTerms: e.paymentTerms,
    governingLaw: e.governingLaw,
    jurisdiction: e.jurisdiction,
    noticePeriodDays: e.noticePeriodDays,
    supportWindow: e.supportWindow,
    revisionRounds: e.revisionRounds,
    documentId: e.control.documentId,
    version: e.control.version,
    status: e.control.status,
    preparedBy: e.control.preparedBy,
  }
}

const Section = ({ title, hint, children }) => (
  <section className={PANEL}>
    <h2 className={PANEL_TITLE}>{title}</h2>
    {hint && <p className="mt-1 text-[12px] text-[#6E809F]">{hint}</p>}
    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
  </section>
)

const Field = ({ label, value, onChange, placeholder, wide, textarea }) => (
  <div className={wide ? 'sm:col-span-2' : ''}>
    <label className={LABEL}>{label}</label>
    {textarea ? (
      <textarea rows={3} className={FIELD} value={value} onChange={onChange} placeholder={placeholder} />
    ) : (
      <input className={FIELD} value={value} onChange={onChange} placeholder={placeholder} />
    )}
  </div>
)

export default function AgreementGeneratorPage() {
  const [form, setForm] = useState(BLANK_FORM)
  const [deliverables, setDeliverables] = useState([
    { service: '', description: '', timeline: '', status: '' },
  ])
  const [fees, setFees] = useState([{ item: '', description: '', amount: '' }])
  const [busy, setBusy] = useState(null)
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const data = useMemo(
    () => toAgreementData(form, { deliverables, fees }),
    [form, deliverables, fees]
  )

  const filledCount = useMemo(
    () => Object.values(form).filter((v) => String(v).trim() !== '').length,
    [form]
  )

  const loadExample = () => {
    setForm(exampleToForm())
    setDeliverables(exampleAgreement.deliverables.map((d) => ({ ...d })))
    setFees(exampleAgreement.fees.map((f) => ({ ...f, amount: String(f.amount) })))
    setError('')
  }

  const reset = () => {
    setForm(BLANK_FORM)
    setDeliverables([{ service: '', description: '', timeline: '', status: '' }])
    setFees([{ item: '', description: '', amount: '' }])
    setError('')
  }

  const save = (blob, filename) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    // Revoke on the next tick so the download has definitely started.
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  /**
   * Letterhead logo. Fetched from /logo-print.png (BLACK artwork) — the site's
   * logo.png is white-on-transparent and would be invisible on white paper.
   * Both loaders fail soft: without a logo the letterhead is simply text-only.
   */
  const loadLogoBuffer = async () => {
    try {
      const res = await fetch('/logo-print.png')
      if (!res.ok) return null
      return await res.arrayBuffer()
    } catch {
      return null
    }
  }

  const loadLogoDataUrl = async () => {
    const buf = await loadLogoBuffer()
    if (!buf) return null
    let binary = ''
    const bytes = new Uint8Array(buf)
    for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i])
    return `data:image/png;base64,${btoa(binary)}`
  }

  const downloadDocx = async () => {
    setBusy('docx')
    setError('')
    try {
      const [{ Packer }, { buildDocxDocument }] = await Promise.all([
        import('docx'),
        import('@/lib/agreement/render/docx.mjs'),
      ])
      const logoBuffer = await loadLogoBuffer()
      const blob = await Packer.toBlob(buildDocxDocument(data, { logoBuffer }))
      save(blob, suggestFilename(data, 'docx'))
    } catch (e) {
      setError(`DOCX export failed: ${e?.message || e}`)
    } finally {
      setBusy(null)
    }
  }

  const downloadPdf = async () => {
    setBusy('pdf')
    setError('')
    try {
      const [pdfMakeMod, { buildPdfDefinition }, logoDataUrl] = await Promise.all([
        import('pdfmake/build/pdfmake'),
        import('@/lib/agreement/render/pdf.mjs'),
        loadLogoDataUrl(),
      ])
      const pdfMake = pdfMakeMod.default || pdfMakeMod

      // pdfmake 0.3 API is setFonts(), not the 0.2 `pdfMake.fonts = ...`
      // property. Times is a built-in PDF font, so no vfs font files are
      // needed here at all.
      pdfMake.setFonts(PDF_STANDARD_FONTS)

      pdfMake.createPdf(buildPdfDefinition(data, { logoDataUrl })).download(suggestFilename(data, 'pdf'))
    } catch (e) {
      setError(`PDF export failed: ${e?.message || e}`)
    } finally {
      setBusy(null)
    }
  }

  return (
    <main
      className="min-h-screen pb-24 pt-28 text-[#0E1A33]"
      style={{ background: 'linear-gradient(180deg, #FFFFFF 0px, #ECEFF4 240px)' }}
    >
      <div className="mx-auto w-full max-w-5xl px-6 md:px-8">
        {/* Header */}
        <div className="mb-10 border-b border-[#0E1A33]/10 pb-8">
          <span className="mb-3 block text-[10px] font-mono uppercase tracking-[0.4em] text-[#6E809F]">
            Internal tool
          </span>
          <h1 className={`${HEADING} text-4xl md:text-5xl`}>
            Agreement generator
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed font-light text-[#33415C]">
            Fill in what you know and export a branded A4 agreement as Word or PDF.
            Anything you leave blank stays as an obvious{' '}
            <code className="rounded bg-[#0E1A33]/[0.06] px-1.5 py-0.5 text-[13px] text-[#0E1A33]">[PLACEHOLDER]</code>{' '}
            so it is easy to spot before signing. Everything runs in your browser;
            nothing is uploaded.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={loadExample}
              className="rounded-full border border-[#0E1A33]/15 bg-white px-5 py-2 text-[13px] font-medium transition hover:border-[#0E1A33]/30"
            >
              Load example
            </button>
            <button
              onClick={reset}
              className="rounded-full border border-[#0E1A33]/10 px-5 py-2 text-[13px] font-medium text-[#6E809F] transition hover:border-[#0E1A33]/25 hover:text-[#0E1A33]"
            >
              Clear
            </button>
            <span className="text-[12px] text-[#94A3B8]">{filledCount} of 27 fields filled</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5">
          <Section title="Agreement" hint="Appears on the cover page and in the information table.">
            <Field label="Agreement title" wide value={form.documentType} onChange={set('documentType')}
              placeholder="WEBSITE DEVELOPMENT & MAINTENANCE AGREEMENT" />
            <Field label="Agreement number" value={form.agreementNumber} onChange={set('agreementNumber')} placeholder="OZL/AGR/2026/001" />
            <Field label="Contract period" value={form.contractDuration} onChange={set('contractDuration')} placeholder="12 (twelve) months" />
            <Field label="Agreement date" value={form.agreementDate} onChange={set('agreementDate')} placeholder="12 February 2026" />
            <Field label="Effective date" value={form.effectiveDate} onChange={set('effectiveDate')} placeholder="01 March 2026" />
          </Section>

          <Section title="Client">
            <Field label="Client name" value={form.clientName} onChange={set('clientName')} placeholder="Short name used in headings" />
            <Field label="Client legal entity" value={form.clientLegalEntity} onChange={set('clientLegalEntity')} placeholder="Full registered name" />
            <Field label="Client address" wide value={form.clientAddress} onChange={set('clientAddress')} />
            <Field label="Client email" value={form.clientEmail} onChange={set('clientEmail')} />
            <Field label="Signatory name" value={form.clientRepName} onChange={set('clientRepName')} />
            <Field label="Signatory designation" value={form.clientRepDesignation} onChange={set('clientRepDesignation')} />
          </Section>

          <Section title="OneZeroLabs" hint="Service-provider details used in Parties, Notices and the signature block.">
            <Field label="Address" wide value={form.providerAddress} onChange={set('providerAddress')} placeholder="Bengaluru, Karnataka 560091, India" />
            <Field label="Email" value={form.providerEmail} onChange={set('providerEmail')} placeholder="hello@onezerolabs.in" />
            <Field label="Signatory name" value={form.providerRepName} onChange={set('providerRepName')} />
            <Field label="Signatory designation" value={form.providerRepDesignation} onChange={set('providerRepDesignation')} />
          </Section>

          <Section title="Engagement">
            <Field label="Project / service name" wide value={form.projectName} onChange={set('projectName')} />
            <Field label="Purpose statement" wide textarea value={form.purpose} onChange={set('purpose')}
              placeholder="Becomes clause 2.1: what the Service Provider will actually do." />
          </Section>

          {/* Scope table */}
          <section className={PANEL}>
            <div className="flex items-center justify-between">
              <h2 className={PANEL_TITLE}>Scope of services</h2>
              <button
                onClick={() => setDeliverables((r) => [...r, { service: '', description: '', timeline: '', status: '' }])}
                className={SMALL_BTN}
              >
                + Row
              </button>
            </div>
            <div className="mt-5 space-y-3">
              {deliverables.map((row, i) => (
                <div key={i} className="grid grid-cols-1 gap-2 sm:grid-cols-12">
                  <input className={`${FIELD} sm:col-span-3`} placeholder="Service" value={row.service}
                    onChange={(e) => setDeliverables((r) => r.map((x, j) => (j === i ? { ...x, service: e.target.value } : x)))} />
                  <input className={`${FIELD} sm:col-span-5`} placeholder="Description" value={row.description}
                    onChange={(e) => setDeliverables((r) => r.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))} />
                  <input className={`${FIELD} sm:col-span-2`} placeholder="Timeline" value={row.timeline}
                    onChange={(e) => setDeliverables((r) => r.map((x, j) => (j === i ? { ...x, timeline: e.target.value } : x)))} />
                  <input className={`${FIELD} sm:col-span-2`} placeholder="Status" value={row.status}
                    onChange={(e) => setDeliverables((r) => r.map((x, j) => (j === i ? { ...x, status: e.target.value } : x)))} />
                </div>
              ))}
            </div>
          </section>

          {/* Fees table */}
          <section className={PANEL}>
            <div className="flex items-center justify-between">
              <h2 className={PANEL_TITLE}>Commercial terms</h2>
              <button
                onClick={() => setFees((r) => [...r, { item: '', description: '', amount: '' }])}
                className={SMALL_BTN}
              >
                + Row
              </button>
            </div>
            <p className="mt-1 text-[12px] text-[#6E809F]">
              Amounts in INR, digits only. The TOTAL row is calculated automatically when every amount is numeric.
            </p>
            <div className="mt-5 space-y-3">
              {fees.map((row, i) => (
                <div key={i} className="grid grid-cols-1 gap-2 sm:grid-cols-12">
                  <input className={`${FIELD} sm:col-span-3`} placeholder="Item" value={row.item}
                    onChange={(e) => setFees((r) => r.map((x, j) => (j === i ? { ...x, item: e.target.value } : x)))} />
                  <input className={`${FIELD} sm:col-span-6`} placeholder="Description" value={row.description}
                    onChange={(e) => setFees((r) => r.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))} />
                  <input className={`${FIELD} sm:col-span-3`} placeholder="45000" inputMode="numeric" value={row.amount}
                    onChange={(e) => setFees((r) => r.map((x, j) => (j === i ? { ...x, amount: e.target.value } : x)))} />
                </div>
              ))}
            </div>
          </section>

          <Section title="Legal & support">
            <Field label="Payment terms" wide value={form.paymentTerms} onChange={set('paymentTerms')} placeholder="Payable within 15 days of invoice date" />
            <Field label="Governing law" value={form.governingLaw} onChange={set('governingLaw')} placeholder="India" />
            <Field label="Jurisdiction" value={form.jurisdiction} onChange={set('jurisdiction')} placeholder="Bengaluru, Karnataka" />
            <Field label="Termination notice (days)" value={form.noticePeriodDays} onChange={set('noticePeriodDays')} placeholder="30" />
            <Field label="Support window" value={form.supportWindow} onChange={set('supportWindow')} placeholder="Mon to Fri, 10:00 to 18:00 IST" />
            <Field label="Revision rounds" value={form.revisionRounds} onChange={set('revisionRounds')} placeholder="2 (two)" />
          </Section>

          <Section title="Document control">
            <Field label="Document ID" value={form.documentId} onChange={set('documentId')} />
            <Field label="Version" value={form.version} onChange={set('version')} placeholder="1.0" />
            <Field label="Status" value={form.status} onChange={set('status')} placeholder="DRAFT / FINAL" />
            <Field label="Prepared by" value={form.preparedBy} onChange={set('preparedBy')} />
          </Section>
        </div>

        {/* Export */}
        <div className={`mt-8 ${PANEL} md:!p-8`}>
          <h2 className={PANEL_TITLE}>Export</h2>
          <p className="mt-1 text-[13px] text-[#33415C]">
            A4 portrait, running header and footer, automatic page numbers. The Word file is fully editable.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={downloadDocx}
              disabled={busy !== null}
              className={`${BTN_PRIMARY} px-8`}
            >
              {busy === 'docx' ? 'Generating…' : 'Download .docx'}
            </button>
            <button
              onClick={downloadPdf}
              disabled={busy !== null}
              className={`${BTN_SECONDARY} px-8`}
            >
              {busy === 'pdf' ? 'Generating…' : 'Download .pdf'}
            </button>
          </div>
          {error && (
            <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] text-rose-700">
              {error}
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
