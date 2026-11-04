/**
 * Draws PDFs inside the app with pdf.js, so they open in place on every device.
 * Phones can't show a PDF in a page by themselves: Android hands it to another app.
 * For the browser only. pdf.js loads on first use, never during server rendering.
 */

let pdfjsReady = null
let sharedWorker = null

let dataUrl = ''

const loadPdfjs = () => {
  pdfjsReady ??= import('pdfjs-dist/legacy/build/pdf.mjs')
    .then((pdfjs) => {
      // Served by the app, from the same pdf.js version, so they always match.
      pdfjs.GlobalWorkerOptions.workerSrc = `/documents/pdf-worker?v=${pdfjs.version}`
      dataUrl = `/documents/pdf-data/${pdfjs.version}`
      return pdfjs
    })
    .catch((e) => {
      pdfjsReady = null
      throw e
    })
  return pdfjsReady
}

/**
 * Starts loading a PDF. Returns pdf.js's loading task: await `.promise` for the
 * document, and call `.destroy()` when done with it.
 */
export const openPdf = async (src) => {
  const pdfjs = await loadPdfjs()
  // One background worker for every PDF, rather than one each.
  sharedWorker ??= new pdfjs.PDFWorker({ name: 'ozl-pdf' })
  return pdfjs.getDocument({
    url: src,
    worker: sharedWorker,
    // The file comes whole from the app's own route, which needs no partial loading.
    disableRange: true,
    disableStream: true,
    // Fonts a PDF uses without carrying them, such as the Times in every agreement,
    // come from the same set Chrome's PDF viewer uses, never from the phone. Left to
    // the phone, an Android would swap in its own serif and change how the page looks.
    standardFontDataUrl: `${dataUrl}/fonts/`,
    useSystemFonts: false,
    cMapUrl: `${dataUrl}/cmaps/`,
    cMapPacked: true,
    wasmUrl: `${dataUrl}/wasm/`,
    iccUrl: `${dataUrl}/iccs/`,
    // Never run code from a document's fonts; slower, and much safer.
    isEvalSupported: false,
    enableXfa: false,
  })
}

// Paper is white in light and dark mode alike, as on iPhone.
const PAPER = 'rgb(255, 255, 255)'

// iPhones refuse canvases much over 16 million pixels, so stay well under.
const MAX_PIXELS = 12_000_000

/** Draws one page to fill `cssWidth`, sharp on this screen. Returns pdf.js's render task. */
export const drawPage = (page, canvas, cssWidth) => {
  const base = page.getViewport({ scale: 1 })
  let scale = (cssWidth * Math.min(window.devicePixelRatio || 1, 3)) / base.width
  const pixels = base.width * base.height * scale * scale
  if (pixels > MAX_PIXELS) scale *= Math.sqrt(MAX_PIXELS / pixels)
  const viewport = page.getViewport({ scale })
  canvas.width = Math.floor(viewport.width)
  canvas.height = Math.floor(viewport.height)
  return page.render({ canvas, viewport, background: PAPER })
}

// Thumbnails: two at a time, so a folder of PDFs never floods the phone, and each
// kept for the visit, so going back to a folder shows them at once.
const thumbnails = new Map()
let running = 0
const waiting = []
const takeTurn = () =>
  new Promise((resolve) => {
    if (running < 2) {
      running++
      resolve()
    } else waiting.push(resolve)
  })
const endTurn = () => {
  const next = waiting.shift()
  if (next) next()
  else running--
}

/** The first page as a small image. Resolves to { url, ratio } with ratio = height / width. */
export const pdfThumbnail = (src, cssWidth) => {
  if (!thumbnails.has(src)) {
    const job = (async () => {
      await takeTurn()
      let task
      try {
        task = await openPdf(src)
        const doc = await task.promise
        const page = await doc.getPage(1)
        const canvas = document.createElement('canvas')
        await drawPage(page, canvas, cssWidth).promise
        return { url: canvas.toDataURL('image/jpeg', 0.85), ratio: canvas.height / canvas.width }
      } finally {
        task?.destroy()
        endTurn()
      }
    })()
    thumbnails.set(src, job)
    job.catch(() => thumbnails.delete(src))
  }
  return thumbnails.get(src)
}
