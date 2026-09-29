/**
 * Agreement body content, expressed as data.
 *
 * Nothing here knows about Word or PDF. Each section is a title plus a list of
 * blocks; the two renderers interpret the same block vocabulary.
 *
 * BLOCK TYPES
 *   { t:'p',        text }                     paragraph
 *   { t:'clauses',  items:[string] }           auto-numbered N.1, N.2, ...
 *   { t:'bullets',  items:[string] }           bulleted list
 *   { t:'sub',      text }                     bold subheading
 *   { t:'table',    head:[], rows:[[]], widths:[] }
 *   { t:'deliverables' }                       scope table, built from data
 *   { t:'pricing' }                            commercial table, built from data
 *   { t:'milestones' }                         milestone payment table
 *   { t:'bank' }                               bank details (omitted if empty)
 *   { t:'signature' }                          two signature blocks
 *   { t:'spacer',   h }                        vertical gap in points
 *
 * SECTION FLAGS
 *   include:false        drop the section
 *   pageBreakBefore      start the section on a new page
 *   keepTogether         never split this section across pages
 */

import { ph } from '../config/schema.mjs'

const RSQUO = '’' // right single quote, used in possessives

export const buildSections = (d) => {
  const CLIENT = ph(d.client.name, 'CLIENT_NAME')
  const CLIENT_ENTITY = ph(d.client.legalEntity, 'CLIENT_LEGAL_ENTITY')
  const CLIENT_ADDR = ph(d.client.address, 'CLIENT_ADDRESS')
  const PROVIDER = d.provider.legalName || 'OneZeroLabs'
  const PROVIDER_ADDR = ph(d.provider.address, 'PROVIDER_ADDRESS')
  const PROJECT = ph(d.projectName, 'PROJECT_NAME')
  const EFFECTIVE = ph(d.effectiveDate, 'EFFECTIVE_DATE')
  const DURATION = ph(d.contractDuration, 'CONTRACT_DURATION')
  const LAW = ph(d.governingLaw, 'GOVERNING_LAW')
  const JURIS = ph(d.jurisdiction, 'JURISDICTION')
  const NOTICE = ph(d.noticePeriodDays, 'NOTICE_PERIOD_DAYS')
  const SUPPORT = ph(d.supportWindow, 'SUPPORT_WINDOW')
  const REVISIONS = ph(d.revisionRounds, 'REVISION_ROUNDS')
  const PAYTERMS = ph(d.paymentTerms, 'PAYMENT_TERMS')
  const CUR = d.commercials.currencySymbol || 'Rs. '
  const CURCODE = d.commercials.currency || 'INR'

  return [
    {
      id: 'parties',
      title: 'PARTIES',
      keepTogether: true,
      blocks: [
        { t: 'p', text: `This Agreement ("Agreement") is entered into on ${EFFECTIVE} by and between:` },
        // The comma belongs INSIDE the bold run: justification stretches the gap
        // between two inlines, which rendered as "OneZeroLabs , having".
        { t: 'p', boldLead: `${PROVIDER},`, text: ` having its principal place of business at ${PROVIDER_ADDR}, hereinafter referred to as the "Service Provider";` },
        { t: 'p', text: 'AND', center: true, bold: true },
        { t: 'p', boldLead: `${CLIENT_ENTITY},`, text: ` having its principal place of business at ${CLIENT_ADDR}, hereinafter referred to as the "Client".` },
        { t: 'p', text: `The Service Provider and the Client are individually referred to as a "Party" and collectively as the "Parties".` },
        { t: 'p', text: 'The Parties agree to be bound by the terms and conditions set out below.' },
      ],
    },
    {
      id: 'purpose',
      title: 'PURPOSE AND SCOPE',
      blocks: [
        { t: 'p', text: `The purpose of this Agreement is to define the terms under which the Service Provider will deliver ${PROJECT} to the Client.` },
        {
          t: 'clauses',
          items: [
            ph(d.purpose, 'PURPOSE_STATEMENT'),
            'The scope of work is limited to the services and deliverables expressly described in this Agreement and its annexures. Anything not expressly included is out of scope.',
            'Any expansion of scope shall be handled under the change-request process described in the Revisions and Change Requests section.',
          ],
        },
      ],
    },
    {
      id: 'services',
      title: 'SERVICES',
      blocks: [
        { t: 'p', text: 'The Service Provider shall perform the following services with reasonable skill, care and diligence, in accordance with prevailing industry standards:' },
        { t: 'deliverables' },
        {
          t: 'clauses',
          items: [
            'The Service Provider may engage qualified personnel or subcontractors to perform parts of the Services, and remains responsible for work so delegated.',
            'Services are performed remotely unless on-site attendance is expressly agreed in writing.',
          ],
        },
      ],
    },
    {
      id: 'deliverables',
      title: 'DELIVERABLES',
      blocks: [
        {
          t: 'clauses',
          items: [
            'Deliverables shall be provided in the formats and to the specifications recorded in this Agreement.',
            'The Client shall review each deliverable and provide written acceptance or consolidated written feedback within [ACCEPTANCE_DAYS] business days of submission.',
            'A deliverable not rejected in writing within that period shall be deemed accepted, and the corresponding payment milestone shall become due.',
            'Rejection must identify the specific non-conformity with the agreed specification. Preference-based changes are treated as change requests.',
          ],
        },
      ],
    },
    {
      id: 'timeline',
      title: 'PROJECT TIMELINE',
      blocks: [
        { t: 'p', text: `The engagement shall commence on ${EFFECTIVE} and continue for ${DURATION}, unless extended or terminated in accordance with this Agreement.` },
        {
          t: 'clauses',
          items: [
            'Timelines are estimates based on timely Client cooperation and are not of the essence unless expressly stated otherwise in writing.',
            'Any delay caused by the Client, including delayed feedback, approvals, content or access, shall extend the affected dates on a day-for-day basis.',
            'Where a delay attributable to the Client exceeds [SUSPENSION_DAYS] business days, the Service Provider may suspend work and re-schedule remaining activities against its then-current availability.',
          ],
        },
      ],
    },
    {
      id: 'client-responsibilities',
      title: 'CLIENT RESPONSIBILITIES',
      blocks: [
        { t: 'p', text: 'The Client shall, at its own cost and in a timely manner:' },
        {
          t: 'bullets',
          items: [
            'Nominate a single authorised point of contact empowered to give approvals and decisions.',
            'Provide accurate content, brand assets, credentials and third-party access required to perform the Services.',
            'Provide consolidated written feedback within the agreed review periods.',
            'Procure and maintain any third-party licences, subscriptions, domains or hosting in its own name.',
            'Ensure that all material supplied to the Service Provider does not infringe the rights of any third party.',
            'Make payments in accordance with the agreed payment terms.',
          ],
        },
      ],
    },
    {
      id: 'provider-responsibilities',
      title: 'SERVICE PROVIDER RESPONSIBILITIES',
      blocks: [
        { t: 'p', text: 'The Service Provider shall:' },
        {
          t: 'bullets',
          items: [
            'Perform the Services with reasonable skill, care and diligence.',
            'Assign personnel with skills appropriate to the Services.',
            'Maintain regular communication and report progress at agreed intervals.',
            'Comply with applicable laws in the performance of the Services.',
            'Notify the Client promptly of any material risk to agreed timelines.',
            'Hand over deliverables, source files and credentials upon full settlement of amounts due.',
          ],
        },
      ],
    },
    {
      id: 'fees',
      title: 'FEES AND PAYMENT TERMS',
      blocks: [
        { t: 'p', text: `In consideration of the Services, the Client shall pay the Service Provider the following amounts, exclusive of applicable taxes, in ${CURCODE}:` },
        { t: 'pricing' },
        { t: 'sub', text: 'Payment Schedule' },
        { t: 'milestones' },
        {
          t: 'clauses',
          items: [
            `Payment terms: ${PAYTERMS}.`,
            `Payment method: ${ph(d.commercials.paymentMethod, 'PAYMENT_METHOD')}.`,
            `Late payment: ${ph(d.commercials.latePaymentTerms, 'LATE_PAYMENT_TERMS')}.`,
            'All amounts are non-refundable once the corresponding work has been performed, save where this Agreement expressly provides otherwise.',
            'The Service Provider may suspend the Services where an undisputed invoice remains unpaid beyond [SUSPENSION_DAYS] business days after written notice.',
          ],
        },
        { t: 'bank' },
      ],
    },
    {
      id: 'taxes',
      title: 'TAXES',
      blocks: [
        {
          t: 'clauses',
          items: [
            `All fees are exclusive of Goods and Services Tax (GST) and any other applicable statutory levies, which shall be charged in addition at the prevailing rate. ${ph(d.commercials.taxNote, 'TAX_NOTE')}`,
            'Each Party is responsible for its own income taxes.',
            'Where the Client is required by law to withhold tax at source, it shall deduct at the applicable rate, remit to the relevant authority and furnish a valid certificate within the statutory timeframe.',
          ],
        },
      ],
    },
    {
      id: 'ip',
      title: 'INTELLECTUAL PROPERTY RIGHTS',
      blocks: [
        {
          t: 'clauses',
          items: [
            'Each Party retains ownership of intellectual property it owned prior to this Agreement, and of anything it develops independently of it ("Background IP").',
            'Upon receipt of all amounts due, the Service Provider assigns to the Client all right, title and interest in the deliverables created specifically for the Client under this Agreement ("Foreground IP").',
            'The Service Provider retains ownership of its Background IP, including frameworks, libraries, internal tooling and reusable components, and grants the Client a perpetual, non-exclusive, royalty-free licence to use such components strictly as embedded within the deliverables.',
            'Until payment is received in full, all deliverables remain the property of the Service Provider and the Client has no licence to use them in production.',
            'The Service Provider may reference the engagement and display non-confidential visual excerpts in its portfolio and marketing, unless the Client withholds consent in writing.',
          ],
        },
      ],
    },
    {
      id: 'confidentiality',
      title: 'CONFIDENTIALITY',
      blocks: [
        {
          t: 'clauses',
          items: [
            'Each Party may receive non-public information of the other ("Confidential Information"). The receiving Party shall use it solely to perform this Agreement and shall protect it with no less care than it applies to its own confidential information.',
            'Confidential Information excludes information that is or becomes public without breach, was lawfully known before disclosure, or is independently developed without reference to the disclosing Party.',
            'Disclosure compelled by law or a competent authority is permitted, provided the disclosing Party is given prompt notice where lawful.',
            'These obligations survive termination for a period of [CONFIDENTIALITY_YEARS] years.',
          ],
        },
      ],
    },
    {
      id: 'data-protection',
      title: 'DATA PROTECTION AND SECURITY',
      blocks: [
        {
          t: 'clauses',
          items: [
            'Each Party shall comply with applicable data protection law, including the Digital Personal Data Protection Act, 2023, to the extent applicable.',
            `Where the Service Provider processes personal data on the Client${RSQUO}s behalf, it acts solely on the Client${RSQUO}s documented instructions and only for the purposes of this Agreement.`,
            'The Service Provider shall apply reasonable technical and organisational measures appropriate to the risk, including access control, encryption in transit and controlled credential handling.',
            'The Service Provider shall notify the Client without undue delay, and in any event within [BREACH_NOTICE_HOURS] hours, of becoming aware of a personal data breach affecting Client data.',
            'On termination, the Service Provider shall return or securely delete Client personal data, save where retention is required by law.',
          ],
        },
      ],
    },
    {
      id: 'third-party',
      title: 'THIRD-PARTY SERVICES',
      blocks: [
        {
          t: 'clauses',
          items: [
            'The Services may rely on third-party platforms, APIs, hosting, plugins or licences. These are governed by their own terms, which the Client accepts.',
            'Third-party costs are payable by the Client and are not included in the fees unless expressly stated.',
            'The Service Provider is not liable for outages, deprecations, price changes or defects in third-party services, but shall use reasonable efforts to mitigate their effect.',
          ],
        },
      ],
    },
    {
      id: 'revisions',
      title: 'REVISIONS AND CHANGE REQUESTS',
      blocks: [
        {
          t: 'clauses',
          items: [
            `The fees include ${REVISIONS} round(s) of revisions per deliverable, confined to the agreed scope.`,
            'Work outside the agreed scope, or revision rounds beyond the included allowance, constitutes a change request.',
            'The Service Provider shall provide a written estimate of cost and schedule impact for each change request. Work proceeds only on written approval.',
            'Approved change requests are deemed incorporated into this Agreement.',
          ],
        },
      ],
    },
    {
      id: 'maintenance',
      title: 'MAINTENANCE AND SUPPORT',
      blocks: [
        {
          t: 'clauses',
          items: [
            `Support is provided during ${SUPPORT}, excluding public holidays.`,
            'The Service Provider shall use reasonable efforts to acknowledge support requests within [RESPONSE_TIME] and to resolve them within a reasonable period appropriate to severity.',
            'Maintenance covers correction of defects in delivered work. It does not include new features, redesigns, content updates or third-party platform changes unless expressly agreed.',
            `Recurring maintenance fees, where applicable, are ${CUR}${ph(d.commercials.recurringFee, 'RECURRING_FEE')} per ${ph(d.commercials.recurringCycle, 'RECURRING_CYCLE')}.`,
          ],
        },
      ],
    },
    {
      id: 'communication',
      title: 'COMMUNICATION AND APPROVALS',
      blocks: [
        {
          t: 'clauses',
          items: [
            'Each Party shall nominate an authorised representative for day-to-day communication and approvals.',
            'Approvals given by a nominated representative by email are binding on that Party.',
            'Where this Agreement requires something to be "in writing", email to the addresses in the Notices section is sufficient, except for notices of termination or breach.',
          ],
        },
      ],
    },
    {
      id: 'warranties',
      title: 'WARRANTIES',
      blocks: [
        {
          t: 'clauses',
          items: [
            'Each Party warrants that it has full authority to enter into this Agreement and that doing so does not breach any other obligation binding on it.',
            'The Service Provider warrants that the Services will be performed with reasonable skill and care, and that deliverables will materially conform to the agreed specification for [WARRANTY_PERIOD] following acceptance.',
            'The Client warrants that all material it supplies is lawful and does not infringe third-party rights.',
            'Save as expressly stated, all warranties, conditions and terms implied by statute or common law are excluded to the maximum extent permitted. The Service Provider does not warrant that deliverables will be uninterrupted or error-free.',
          ],
        },
      ],
    },
    {
      id: 'liability',
      title: 'LIMITATION OF LIABILITY',
      blocks: [
        {
          t: 'clauses',
          items: [
            'Neither Party is liable for indirect, incidental, special, punitive or consequential loss, or for loss of profit, revenue, goodwill, business or data, however arising.',
            `The Service Provider${RSQUO}s aggregate liability arising out of or in connection with this Agreement shall not exceed the total fees actually paid by the Client under this Agreement in the [LIABILITY_WINDOW] preceding the event giving rise to the claim.`,
            'Nothing in this Agreement limits liability for fraud, wilful misconduct, gross negligence, or any liability that cannot lawfully be limited.',
            'The Client is solely responsible for maintaining backups of its own data and content.',
          ],
        },
      ],
    },
    {
      id: 'indemnification',
      title: 'INDEMNIFICATION',
      blocks: [
        {
          t: 'clauses',
          items: [
            `The Client shall indemnify the Service Provider against claims arising from material supplied by the Client, from the Client${RSQUO}s use of the deliverables in breach of this Agreement, or from the Client${RSQUO}s breach of applicable law.`,
            `The Service Provider shall indemnify the Client against third-party claims that the Foreground IP, as delivered, infringes that third party${RSQUO}s intellectual property rights, excluding claims arising from Client-supplied material or from modification of the deliverables by anyone other than the Service Provider.`,
            `The indemnified Party shall give prompt written notice, permit the indemnifying Party to control the defence, and provide reasonable cooperation at the indemnifying Party${RSQUO}s expense.`,
          ],
        },
      ],
    },
    {
      id: 'term',
      title: 'TERM AND TERMINATION',
      blocks: [
        {
          t: 'clauses',
          items: [
            `This Agreement commences on ${EFFECTIVE} and continues for ${DURATION}, unless terminated earlier in accordance with this section.`,
            `Either Party may terminate for convenience on ${NOTICE} days${RSQUO} prior written notice.`,
            'Either Party may terminate immediately on written notice where the other commits a material breach that is not remedied within [CURE_PERIOD_DAYS] days of written notice, or becomes insolvent.',
            'On termination the Client shall pay for all Services performed and expenses committed up to the effective date of termination.',
            'Sections concerning Intellectual Property, Confidentiality, Limitation of Liability, Indemnification, Governing Law and any provision which by its nature should survive, shall survive termination.',
          ],
        },
      ],
    },
    {
      id: 'force-majeure',
      title: 'FORCE MAJEURE',
      blocks: [
        {
          t: 'clauses',
          items: [
            'Neither Party is liable for failure or delay caused by events beyond its reasonable control, including natural disaster, war, civil unrest, epidemic, governmental action, strike, or failure of public telecommunications or power infrastructure.',
            'The affected Party shall notify the other promptly and use reasonable efforts to mitigate. Obligations are suspended for the duration of the event.',
            'Where such an event continues beyond [FORCE_MAJEURE_DAYS] days, either Party may terminate on written notice without liability, save for amounts already due.',
          ],
        },
      ],
    },
    {
      id: 'non-solicitation',
      title: 'NON-SOLICITATION',
      blocks: [
        {
          t: 'clauses',
          items: [
            'During the term and for [NON_SOLICIT_MONTHS] months thereafter, neither Party shall knowingly solicit for employment any individual who was materially involved in the delivery of the Services.',
            `This does not restrict general public recruitment advertising not specifically targeted at the other Party${RSQUO}s personnel.`,
          ],
        },
      ],
    },
    {
      id: 'dispute',
      title: 'DISPUTE RESOLUTION',
      blocks: [
        {
          t: 'clauses',
          items: [
            'The Parties shall first attempt to resolve any dispute amicably through good-faith discussion between their authorised representatives within [ESCALATION_DAYS] days of written notice of the dispute.',
            `Failing amicable resolution, the dispute shall be referred to arbitration by a sole arbitrator under the Arbitration and Conciliation Act, 1996. The seat and venue of arbitration shall be ${JURIS} and the proceedings shall be conducted in English.`,
            'The arbitral award shall be final and binding. Each Party bears its own costs unless the arbitrator directs otherwise.',
            'Nothing prevents either Party from seeking urgent interim relief from a court of competent jurisdiction.',
          ],
        },
      ],
    },
    {
      id: 'governing-law',
      title: 'GOVERNING LAW',
      blocks: [
        { t: 'p', text: `This Agreement shall be governed by and construed in accordance with the laws of ${LAW}. Subject to the Dispute Resolution section, the courts at ${JURIS} shall have exclusive jurisdiction.` },
      ],
    },
    {
      id: 'notices',
      title: 'NOTICES',
      blocks: [
        { t: 'p', text: 'All formal notices under this Agreement shall be in writing and delivered by hand, registered post or email to the addresses below, and shall be deemed received on delivery or, for email, on confirmed transmission during business hours.' },
        {
          t: 'table',
          head: ['', 'Service Provider', 'Client'],
          widths: [22, 39, 39],
          rows: [
            ['Entity', PROVIDER, CLIENT_ENTITY],
            ['Attention', ph(d.provider.representative.name, 'PROVIDER_REP_NAME'), ph(d.client.representative.name, 'CLIENT_REP_NAME')],
            ['Address', PROVIDER_ADDR, CLIENT_ADDR],
            ['Email', ph(d.provider.email, 'PROVIDER_EMAIL'), ph(d.client.email, 'CLIENT_EMAIL')],
          ],
        },
      ],
    },
    {
      id: 'entire-agreement',
      title: 'ENTIRE AGREEMENT',
      blocks: [
        { t: 'p', text: 'This Agreement, together with its annexures and any approved change requests, constitutes the entire agreement between the Parties and supersedes all prior proposals, quotations, discussions and understandings, whether oral or written, relating to its subject matter.' },
      ],
    },
    {
      id: 'amendments',
      title: 'AMENDMENTS',
      blocks: [
        { t: 'p', text: 'No amendment to this Agreement is effective unless made in writing and signed by an authorised representative of each Party. Approved written change requests are deemed amendments to the extent of the change described.' },
      ],
    },
    {
      id: 'severability',
      title: 'SEVERABILITY',
      blocks: [
        { t: 'p', text: 'If any provision of this Agreement is held invalid, illegal or unenforceable, that provision shall be severed or read down to the minimum extent necessary, and the remaining provisions shall continue in full force and effect.' },
      ],
    },
    {
      id: 'waiver',
      title: 'WAIVER',
      blocks: [
        { t: 'p', text: 'No failure or delay by either Party in exercising any right under this Agreement operates as a waiver of it, and no single or partial exercise precludes any further exercise. A waiver is effective only if given in writing.' },
      ],
    },
    {
      id: 'signatures',
      title: 'SIGNATURES',
      // Deliberately NOT pageBreakBefore. The signature block is kept together
      // as an unbreakable unit instead, so it moves to a fresh page only when it
      // genuinely does not fit — forcing a break here left a near-empty page.
      keepTogether: true,
      blocks: [
        { t: 'p', text: 'IN WITNESS WHEREOF, the Parties have executed this Agreement on the dates written below, each copy being an original and together constituting one instrument.' },
        { t: 'spacer', h: 10 },
        { t: 'signature' },
      ],
    },
  ]
}

/** Apply per-section overrides and splice in any extra sections. */
export const resolveSections = (data) => {
  const overrides = data.sectionOverrides || {}
  // A caller can replace the built-in set outright with data.sections.
  const source = data.sections && data.sections.length ? data.sections : buildSections(data)
  const base = source
    .map((s) => {
      const o = overrides[s.id]
      if (!o) return s
      if (o.include === false) return null
      return {
        ...s,
        ...o,
        blocks: o.blocks || [...(s.blocks || []), ...(o.extraBlocks || [])],
      }
    })
    .filter(Boolean)

  const extras = data.extraSections || []
  if (!extras.length) return base

  // Extra sections go before the signature block, which must stay last.
  const signatureAt = base.findIndex((s) => s.id === 'signatures')
  if (signatureAt === -1) return [...base, ...extras]
  return [...base.slice(0, signatureAt), ...extras, ...base.slice(signatureAt)]
}

export default buildSections
