import { FolderPlus, Search, Upload } from 'lucide-react'
import Link from 'next/link'
import { DocumentGrid } from '@/components/DocumentGrid'
import { ActionForm, Submit } from '@/components/forms'
import { SheetButton } from '@/components/Sheet'
import { BUTTON_PRIMARY, BUTTON_SECONDARY, Card, Empty, Input } from '@/components/ui'
import { UploadForm } from '@/components/UploadForm'
import { createFolder } from '@/lib/actions/documents'

/** Upload and New folder, for the top level or one folder. */
export function DocumentActions({ folderId = null, folders, companies }) {
  return (
    <div className="flex flex-wrap gap-2">
      <SheetButton
        title="Upload files"
        className={`${BUTTON_PRIMARY} flex-1 whitespace-nowrap sm:flex-none`}
        label={
          <>
            <Upload size={17} aria-hidden="true" />
            Upload
          </>
        }
      >
        <UploadForm folderId={folderId ?? ''} folders={folders} companies={companies} />
      </SheetButton>
      <SheetButton
        title="New folder"
        className={`${BUTTON_SECONDARY} flex-1 whitespace-nowrap sm:flex-none`}
        label={
          <>
            <FolderPlus size={17} aria-hidden="true" />
            New folder
          </>
        }
      >
        <ActionForm action={createFolder} closeOnSuccess success="Folder made" className="grid gap-3 px-4 pb-4 pt-1">
          {folderId && <input type="hidden" name="parent_id" value={folderId} />}
          <Input name="name" required maxLength={80} aria-label="Folder name" placeholder="Name, such as Quotations" autoComplete="off" data-autofocus />
          <Submit className={`${BUTTON_PRIMARY} w-full`}>Make folder</Submit>
        </ActionForm>
      </SheetButton>
    </div>
  )
}

/** The search field, as at the top of the Files app. Searching covers every folder. */
export function DocumentSearch({ q }) {
  return (
    <form action="/documents" role="search" className="flex items-center gap-2">
      <label className="relative min-w-0 flex-1">
        <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input
          type="search"
          name="q"
          defaultValue={q}
          maxLength={100}
          aria-label="Search documents"
          placeholder="Search"
          autoComplete="off"
          enterKeyHint="search"
          className="min-h-11 w-full rounded-xl bg-fill py-2 pl-9 pr-3 text-body text-ink outline-none placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent md:min-h-10 md:text-sub"
        />
      </label>
      {q && (
        <Link href="/documents" className="press inline-flex min-h-11 items-center px-1 text-body text-accent md:text-sub">
          Cancel
        </Link>
      )}
    </form>
  )
}

/** One folder's contents, as big icons. */
export function FolderContents({ folders, documents, emptyTitle = 'Nothing here yet', emptyText }) {
  if (!folders.length && !documents.length) {
    return (
      <Card>
        <Empty title={emptyTitle}>{emptyText}</Empty>
      </Card>
    )
  }
  return <DocumentGrid folders={folders} documents={documents} />
}
