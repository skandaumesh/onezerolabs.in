/**
 * Public API for the OneZeroLabs agreement document system.
 *
 * Isomorphic. Nothing here touches the filesystem — the Node CLI and the
 * browser page both import from this file and supply their own output step.
 *
 *   import { createAgreementData, buildDocxDocument, buildPdfDefinition } from '@/lib/agreement/index.mjs'
 */

export { brand, pt, hp } from './config/branding.mjs'
export { createAgreementData, emptyAgreement, ph, isPlaceholder } from './config/schema.mjs'
export { exampleAgreement } from './config/exampleData.mjs'

export { buildSections, resolveSections } from './content/sections.mjs'
export {
  buildInfoTable, buildDeliverablesTable, buildPricingTable,
  buildMilestoneTable, buildBankTable, buildControlTable,
  buildSignatureData, formatAmount, tableForBlock,
} from './content/tables.mjs'

export {
  buildDocxDocument,
  createHeader as createDocxHeader,
  createFooter as createDocxFooter,
  createTitlePage as createDocxTitlePage,
  createInfoTable as createDocxInfoTable,
  createSection as createDocxSection,
  createSubsection as createDocxSubsection,
  createBulletList as createDocxBulletList,
  createPricingTable as createDocxPricingTable,
  createDeliverablesTable as createDocxDeliverablesTable,
  createSignatureBlock as createDocxSignatureBlock,
  addPageNumber,
} from './render/docx.mjs'

export {
  buildPdfDefinition,
  createHeader as createPdfHeader,
  createFooter as createPdfFooter,
  createTitlePage as createPdfTitlePage,
  createSection as createPdfSection,
  createSubsection as createPdfSubsection,
  createBulletList as createPdfBulletList,
  createSignatureBlock as createPdfSignatureBlock,
  CONTENT_WIDTH,
} from './render/pdf.mjs'

export { PDF_STANDARD_FONTS, ROBOTO_FILES, robotoFonts, suggestFilename } from './util.mjs'
