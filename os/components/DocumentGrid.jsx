import Link from 'next/link'
import { FileArchive } from 'lucide-react'
import { PdfThumb } from '@/components/PdfThumb'
import { formatDay, todayIST } from '@/lib/dates.mjs'
import { formatBytes, typeOfMime } from '@/lib/documents.mjs'

const LABEL = {
  pdf: { text: 'PDF', className: 'bg-late-soft text-late' },
  word: { text: 'DOC', className: 'bg-accent/10 text-accent' },
  sheet: { text: 'XLS', className: 'bg-good-soft text-good' },
  slides: { text: 'PPT', className: 'bg-soon-soft text-soon' },
  text: { text: 'TXT', className: 'bg-pill text-ink2' },
}

/** The blue folder of the Files app: a back with a tab, and a lighter front. */
export function FolderGlyph({ className = '' }) {
  return (
    <svg viewBox="0 0 100 78" aria-hidden="true" className={className}>
      <path
        d="M7 3h23.5c2.4 0 4.2.8 5.9 2.5L41.2 10H93a7 7 0 0 1 7 7v54a7 7 0 0 1-7 7H7a7 7 0 0 1-7-7V10a7 7 0 0 1 7-7z"
        style={{ fill: 'rgb(var(--folder-back))' }}
      />
      <path d="M0 23a7 7 0 0 1 7-7h86a7 7 0 0 1 7 7v48a7 7 0 0 1-7 7H7a7 7 0 0 1-7-7z" style={{ fill: 'rgb(var(--folder-front))' }} />
      <path d="M7 16h86a7 7 0 0 1 7 7v1.2a7 7 0 0 0-7-7H7a7 7 0 0 0-7 7V23a7 7 0 0 1 7-7z" fill="white" fillOpacity="0.35" />
    </svg>
  )
}

/** A sheet of paper with a few lines on it and the kind of file at its foot. */
function PageGlyph({ kind }) {
  const label = LABEL[kind]
  return (
    <span aria-hidden="true" className="flex aspect-[1/1.414] h-full flex-col gap-[7%] rounded-[3px] bg-paper p-[12%] shadow-[0_1px_4px_rgba(0,0,0,0.2)] ring-1 ring-line">
      {[90, 70, 85, 55].map((w) => (
        <span key={w} className="block h-[5%] rounded-full bg-black/10" style={{ width: `${w}%` }} />
      ))}
      {label ? (
        <span className={`mt-auto self-start rounded px-1 py-px text-[0.5625rem] font-bold tracking-wide ${label.className}`}>{label.text}</span>
      ) : (
        <FileArchive size={18} className="mt-auto text-black/40" />
      )}
    </span>
  )
}

/**
 * A long name loses its middle, as in the Files app, so the start and the file type
 * both stay: "AGREEMENT_MLA…ademy.docx". Two lines of a tile hold about 24 characters.
 */
const shorten = (name, max = 24) => (name.length <= max ? name : `${name.slice(0, max - 11).trimEnd()}…${name.slice(-10)}`)

function Tile({ href, icon, name, lines, kind }) {
  return (
    <li className="min-w-0">
      <Link
        href={href}
        data-kind={kind}
        className="press flex h-full flex-col items-center gap-1.5 rounded-2xl px-1 pb-2 pt-1.5 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        <span className="flex h-[5.25rem] w-full items-end justify-center">{icon}</span>
        <span data-name="" className="sr-only">
          {name}
        </span>
        <span aria-hidden="true" title={name} className="line-clamp-2 w-full text-foot font-medium leading-tight text-ink [overflow-wrap:anywhere]">
          {shorten(name)}
        </span>
        <span className="text-cap leading-tight text-muted">
          {lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </span>
      </Link>
    </li>
  )
}

/**
 * Big icons, as in the Files app on iPhone: folders first, then files, each by name.
 * PDFs show their first page, and images show themselves.
 */
export function DocumentGrid({ folders, documents }) {
  const today = todayIST()
  return (
    <ul aria-label="Folder contents" className="grid grid-cols-3 gap-x-2 gap-y-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
      {folders.map((folder) => (
        <Tile
          key={folder.id}
          kind="folder"
          href={`/documents/folder/${folder.id}`}
          icon={<FolderGlyph className="h-auto w-[88%] max-w-[6.5rem] drop-shadow-[0_1px_1px_rgba(0,0,0,0.12)]" />}
          name={folder.name}
          lines={[folder.items === 1 ? '1 item' : `${folder.items} items`]}
        />
      ))}
      {documents.map((doc) => {
        const type = typeOfMime(doc.mime)
        const raw = `/documents/file/${doc.id}/raw`
        let icon = <PageGlyph kind={type.kind} />
        if (type.kind === 'pdf') icon = <PdfThumb src={raw}>{icon}</PdfThumb>
        if (type.kind === 'image' && type.inline) {
          icon = (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={raw} alt="" loading="lazy" decoding="async" className="h-[4.75rem] w-[4.75rem] rounded-xl bg-fill object-cover ring-1 ring-line" />
          )
        }
        return (
          <Tile
            key={doc.id}
            kind={type.kind}
            href={`/documents/file/${doc.id}`}
            icon={icon}
            name={doc.name}
            lines={[formatDay(todayIST(new Date(doc.created_at)), today), formatBytes(doc.size)]}
          />
        )
      })}
    </ul>
  )
}
