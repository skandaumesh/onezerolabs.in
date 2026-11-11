import Link from 'next/link'
import { FileArchive, FileImage, FileText } from 'lucide-react'
import { formatDay, todayIST } from '@/lib/dates.mjs'
import { formatBytes, typeOfMime } from '@/lib/documents.mjs'

// Like the Files app: a coloured label for documents, a picture icon for images.
const LOOK = {
  pdf: { label: 'PDF', className: 'bg-late-soft text-late' },
  word: { label: 'DOC', className: 'bg-accent/10 text-accent' },
  sheet: { label: 'XLS', className: 'bg-good-soft text-good' },
  slides: { label: 'PPT', className: 'bg-soon-soft text-soon' },
}

export function FileIcon({ mime, large = false }) {
  const kind = typeOfMime(mime).kind
  const size = large ? 'h-16 w-14 rounded-xl text-sub' : 'h-10 w-8 rounded-lg text-[0.625rem]'
  const look = LOOK[kind]
  if (look) {
    return (
      <span aria-hidden="true" className={`flex shrink-0 items-end justify-center pb-1.5 font-bold tracking-wide ${size} ${look.className}`}>
        {look.label}
      </span>
    )
  }
  const Icon = kind === 'image' ? FileImage : kind === 'archive' ? FileArchive : FileText
  return (
    <span aria-hidden="true" className={`flex shrink-0 items-center justify-center bg-fill text-muted ${size}`}>
      <Icon size={large ? 28 : 18} />
    </span>
  )
}

/** `showFolder` adds where it lives, for search results and a client's list. */
export function DocumentRow({ doc, showFolder = false, showClient = true }) {
  const today = todayIST()
  const detail = [
    formatBytes(doc.size),
    formatDay(todayIST(new Date(doc.created_at)), today),
    showClient && doc.company_name,
    showFolder && (doc.folder_name ? `in ${doc.folder_name}` : 'in Documents'),
  ].filter(Boolean)
  return (
    <li className="row-press flex items-center gap-3 px-4 py-2.5">
      <FileIcon mime={doc.mime} />
      <span className="min-w-0 flex-1">
        <Link href={`/documents/file/${doc.id}`} data-name="" className="block break-words text-body text-ink after:absolute after:inset-0 md:text-sub">
          {doc.name}
        </Link>
        <span className="block break-words text-foot text-muted">{detail.join(' · ')}</span>
      </span>
    </li>
  )
}
