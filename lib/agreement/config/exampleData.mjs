/**
 * Example populated agreement.
 *
 * Deliberately long — enough scope, pricing and milestone rows to push the
 * document across several A4 pages, so pagination, repeated table headers and
 * the signature block are exercised realistically.
 *
 * The client here is a placeholder organisation invented for demonstration.
 * It is NOT a real OneZeroLabs client. Replace it before sending anything.
 */

export const exampleAgreement = {
  documentType: 'WEBSITE DEVELOPMENT & MAINTENANCE AGREEMENT',
  agreementNumber: 'OZL/AGR/2026/014',
  agreementDate: '12 February 2026',
  effectiveDate: '01 March 2026',
  contractDuration: '12 (twelve) months from the Effective Date',

  provider: {
    legalName: 'OneZeroLabs',
    address: 'Bengaluru, Karnataka 560091, India',
    email: 'hello@onezerolabs.in',
    phone: '+91 74837 29869',
    gstin: '[PROVIDER_GSTIN]',
    representative: { name: 'Skanda Umesh', designation: 'Founder' },
  },

  client: {
    name: 'Northwind Institute',
    legalEntity: 'Northwind Institute of Management Studies',
    address: '[CLIENT_ADDRESS], Bengaluru, Karnataka, India',
    email: 'operations@example.org',
    phone: '[CLIENT_PHONE]',
    gstin: '[CLIENT_GSTIN]',
    representative: { name: 'A. Rao', designation: 'Head of Administration' },
  },

  projectName: 'Institutional website rebuild and ongoing maintenance',
  purpose:
    'The Service Provider shall design, develop, deploy and thereafter maintain a public-facing institutional website together with an administrative content-management interface, as further described in the Services section of this Agreement.',

  deliverables: [
    { service: 'Discovery & IA', description: 'Stakeholder interviews, sitemap, content inventory and information architecture.', timeline: 'Week 1–2', status: 'Planned' },
    { service: 'UI Design', description: 'Responsive design system, key page designs and component library covering desktop, tablet and mobile breakpoints.', timeline: 'Week 3–5', status: 'Planned' },
    { service: 'Frontend Build', description: 'Production frontend implementation with accessibility and performance budgets applied.', timeline: 'Week 6–9', status: 'Planned' },
    { service: 'CMS Integration', description: 'Content-management integration enabling non-technical staff to edit pages, notices and staff directories.', timeline: 'Week 9–11', status: 'Planned' },
    { service: 'Migration & QA', description: 'Content migration, cross-browser testing, accessibility audit and defect resolution prior to launch.', timeline: 'Week 12–13', status: 'Planned' },
    { service: 'Deployment', description: 'Production deployment, DNS cutover, analytics and monitoring configuration, and handover of credentials.', timeline: 'Week 14', status: 'Planned' },
    { service: 'Training', description: 'Two structured training sessions for administrative staff plus written documentation.', timeline: 'Week 14', status: 'Planned' },
    { service: 'Maintenance', description: 'Ongoing updates, security patching, backups and content support for the remainder of the term.', timeline: 'Month 4–12', status: 'Recurring' },
  ],

  fees: [
    { item: 'Discovery & IA', description: 'Research, architecture and planning phase.', amount: 45000 },
    { item: 'UI Design', description: 'Design system and page designs across breakpoints.', amount: 85000 },
    { item: 'Frontend Build', description: 'Production implementation of the approved designs.', amount: 145000 },
    { item: 'CMS Integration', description: 'Content-management setup and editorial workflow.', amount: 70000 },
    { item: 'Migration, QA & Launch', description: 'Content migration, testing and production deployment.', amount: 55000 },
  ],

  commercials: {
    currency: 'INR',
    currencySymbol: 'Rs. ',
    taxNote: 'GST shall be charged at the rate prevailing on the date of each invoice.',
    advancePercent: '30',
    milestones: [
      { milestone: 'Advance', trigger: 'On signing of this Agreement', percent: '30' },
      { milestone: 'Design sign-off', trigger: 'On written approval of the UI design deliverable', percent: '25' },
      { milestone: 'Build complete', trigger: 'On completion of frontend build and CMS integration', percent: '30' },
      { milestone: 'Launch', trigger: 'On production deployment and handover', percent: '15' },
    ],
    recurringFee: '12,000',
    recurringCycle: 'month',
    latePaymentTerms: 'Interest at 1.5% per month shall accrue on amounts outstanding beyond the due date',
    paymentMethod: 'Bank transfer (NEFT / RTGS / UPI) to the account below',
    bankDetails: {
      accountName: 'OneZeroLabs',
      accountNumber: '[ACCOUNT_NUMBER]',
      bankName: '[BANK_NAME]',
      branch: '[BRANCH]',
      ifsc: '[IFSC]',
    },
  },

  paymentTerms: 'Each invoice is payable within 15 (fifteen) days of the invoice date',
  governingLaw: 'India',
  jurisdiction: 'Bengaluru, Karnataka',
  noticePeriodDays: '30',
  supportWindow: 'Monday to Friday, 10:00–18:00 IST',
  revisionRounds: '2 (two)',

  control: {
    documentId: 'OZL-AGR-2026-014',
    version: '1.0',
    status: 'DRAFT',
    lastUpdated: '12 February 2026',
    preparedBy: 'Skanda Umesh',
    approvedBy: '[APPROVED_BY]',
  },
}

export default exampleAgreement
