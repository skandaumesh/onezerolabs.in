import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Download, Info } from 'lucide-react'
import { FileIcon } from '@/components/DocumentRows'
import { ActionForm, ConfirmSubmit, Submit } from '@/components/forms'
import { PdfViewer } from '@/components/PdfViewer'
import { SheetButton } from '@/components/Sheet'
import { ShareFile } from '@/components/ShareFile'
import { BUTTON_DANGER, BUTTON_PRIMARY, BUTTON_SECONDARY, BUTTON_TEXT, Card, Field, Input, PageHeader, Select } from '@/components/ui'
import { deleteDocument, updateDocument } from '@/lib/actions/documents'
import { getUser, requireUser } from '@/lib/auth'
import { formatDateTime } from '@/lib/dates.mjs'
import { formatBytes, KIND_LABEL, typeOfMime } from '@/lib/documents.mjs'
import { isUuid } from '@/lib/forms'
import { getDocument, getFolderPath, listCompanyOptions, listFolderOptions, listHistory } from '@/lib/queries'

export async function generateMetadata({ params }) {
  const { id } = await params
  const doc = (await getUser()) && isUuid(id) ? await getDocument(id) : null
  return { title: doc?.name ?? 'Not found' }
}

function Detail({ label, children }) {
  return (
    <li className="flex items-baseline justify-between gap-4 px-4 py-2.5">
      <span className="shrink-0 text-sub text-muted">{label}</span>
      <span className="min-w-0 break-words text-right text-sub text-ink">{children}</span>
    </li>
  )
}

/** Details, editing, history and delete. Beside the file on a computer; in Info on a phone. */
function DocumentInfo({ doc, kind, folders, clients, history, folderHref }) {
  return (
    <>
      <Card
        title="Details"
        action={
          <SheetButton label="Edit" title="Edit file" className={BUTTON_TEXT}>
            <ActionForm action={updateDocument} closeOnSuccess success="Saved" className="grid gap-3 px-4 pb-4 pt-1">
              <input type="hidden" name="id" value={doc.id} />
              <Field label="Name">
                <Input name="name" required maxLength={200} defaultValue={doc.name} autoComplete="off" data-autofocus />
              </Field>
              <Field label="Folder">
                <Select
                  name="folder_id"
                  defaultValue={doc.folder_id ?? ''}
                  options={[{ value: '', label: 'Documents' }, ...folders.map((f) => ({ value: f.id, label: f.path }))]}
                />
              </Field>
              <Field label="Client">
                <Select name="company_id" blank="None" defaultValue={doc.company_id ?? ''} options={clients.map((c) => ({ value: c.id, label: c.name }))} />
              </Field>
              <Submit className={`${BUTTON_PRIMARY} w-full`}>Save</Submit>
            </ActionForm>
          </SheetButton>
        }
      >
        <ul className="rows pb-1.5">
          <Detail label="Kind">{KIND_LABEL[kind] ?? 'File'}</Detail>
          <Detail label="Size">{formatBytes(doc.size)}</Detail>
          <Detail label="Added">
            {formatDateTime(doc.created_at)}
            {doc.uploaded_by_name ? ` by ${doc.uploaded_by_name}` : ''}
          </Detail>
          <Detail label="Folder">
            <Link href={folderHref} className="text-accent">
              {doc.folder_name ?? 'Documents'}
            </Link>
          </Detail>
          <Detail label="Client">
            {doc.company_id ? (
              <Link href={`/clients/${doc.company_id}`} className="text-accent">
                {doc.company_name}
              </Link>
            ) : (
              'None'
            )}
          </Detail>
        </ul>
      </Card>

      {history.length > 0 && (
        <Card title="History">
          <ul className="rows pb-1.5">
            {history.map((h) => (
              <li key={h.id} className="px-4 py-2.5">
                <span className="block break-words text-sub text-ink">{h.summary}</span>
                <span className="block text-foot text-muted">
                  {h.user_name ?? 'Someone'} · {formatDateTime(h.at)}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <ActionForm action={deleteDocument} errorTitle="Couldn’t Delete">
        <input type="hidden" name="id" value={doc.id} />
        <ConfirmSubmit title={`Delete ${doc.name}?`} message="This can’t be undone." className={BUTTON_DANGER}>
          Delete file
        </ConfirmSubmit>
      </ActionForm>
    </>
  )
}

export default async function DocumentPage({ params }) {
  await requireUser()
  const { id } = await params
  const doc = isUuid(id) ? await getDocument(id) : null
  if (!doc) notFound()

  const [path, folders, companies, history] = await Promise.all([
    doc.folder_id ? getFolderPath(doc.folder_id) : [],
    listFolderOptions(),
    listCompanyOptions(),
    listHistory('document', id),
  ])
  // A client marked lost drops out of the list, but a file linked to one keeps it.
  const clients =
    doc.company_id && !companies.some((c) => c.id === doc.company_id) ? [...companies, { id: doc.company_id, name: doc.company_name }] : companies
  const type = typeOfMime(doc.mime)
  const isPdf = type.kind === 'pdf'
  const isImage = type.kind === 'image' && type.inline
  const href = `/documents/file/${id}/raw`
  const folderHref = doc.folder_id ? `/documents/folder/${doc.folder_id}` : '/documents'
  const where = ['Documents', ...path.map((f) => f.name)].join(' / ')
  const info = <DocumentInfo doc={doc} kind={type.kind} folders={folders} clients={clients} history={history} folderHref={folderHref} />
  const button = `${BUTTON_SECONDARY} flex-1 whitespace-nowrap sm:flex-none`

  return (
    <>
      <PageHeader back={{ href: folderHref, label: doc.folder_name ?? 'Documents' }} eyebrow={where} title={doc.name} />

      <div className="mb-4 flex flex-wrap gap-2">
        <a href={`${href}?download`} download={doc.name} className={isPdf || isImage ? button : `${BUTTON_PRIMARY} flex-1 whitespace-nowrap sm:flex-none`}>
          <Download size={16} aria-hidden="true" />
          Download
        </a>
        <ShareFile href={href} fileName={doc.name} title={doc.name} type={doc.mime} className={button} />
        {isPdf && (
          <SheetButton
            title="Info"
            className={`${button} lg:hidden`}
            label={
              <>
                <Info size={16} aria-hidden="true" />
                Info
              </>
            }
          >
            <div className="space-y-4 px-4 pb-4 pt-1">{info}</div>
          </SheetButton>
        )}
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          {isPdf && <PdfViewer src={href} name={doc.name} />}
          {isImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={href} alt={doc.name} className="card-surface max-h-[78vh] w-full rounded-card bg-surface object-contain" />
          )}
          {!isPdf && !isImage && (
            <div className="card-surface flex flex-col items-center gap-3 rounded-card bg-surface px-5 py-10 text-center">
              <FileIcon mime={doc.mime} large />
              <p className="text-sub text-muted">
                {KIND_LABEL[type.kind] ?? 'File'} · {formatBytes(doc.size)}
                <br />
                Download it to open it in its own app.
              </p>
            </div>
          )}
        </div>

        <div className={`min-w-0 space-y-4 ${isPdf ? 'hidden lg:block' : ''}`}>{info}</div>
      </div>
    </>
  )
}
