import { notFound } from 'next/navigation'
import { DocumentActions, FolderContents } from '@/components/DocumentBrowser'
import { ActionForm, ConfirmSubmit, Submit } from '@/components/forms'
import { SheetButton } from '@/components/Sheet'
import { BUTTON_DANGER, BUTTON_PRIMARY, BUTTON_SECONDARY, Input, PageHeader } from '@/components/ui'
import { deleteFolder, renameFolder } from '@/lib/actions/documents'
import { getUser, requireUser } from '@/lib/auth'
import { isUuid } from '@/lib/forms'
import { getFolder, getFolderPath, listCompanyOptions, listDocuments, listFolderOptions, listFolders } from '@/lib/queries'

export async function generateMetadata({ params }) {
  const { id } = await params
  const folder = (await getUser()) && isUuid(id) ? await getFolder(id) : null
  return { title: folder?.name ?? 'Not found' }
}

export default async function FolderPage({ params }) {
  await requireUser()
  const { id } = await params
  const folder = isUuid(id) ? await getFolder(id) : null
  if (!folder) notFound()

  const [path, folders, documents, folderOptions, companies] = await Promise.all([
    getFolderPath(id),
    listFolders(id),
    listDocuments(id),
    listFolderOptions(),
    listCompanyOptions(),
  ])
  const parent = path.at(-2)
  const above = ['Documents', ...path.slice(0, -1).map((f) => f.name)].join(' / ')
  const empty = !folders.length && !documents.length

  return (
    <>
      <PageHeader
        back={parent ? { href: `/documents/folder/${parent.id}`, label: parent.name } : { href: '/documents', label: 'Documents' }}
        eyebrow={above}
        title={folder.name}
        action={<DocumentActions folderId={id} folders={folderOptions} companies={companies} />}
      />

      <FolderContents folders={folders} documents={documents} emptyText="Upload files here, or make a folder inside it." />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <SheetButton label="Rename folder" title="Rename folder" className={BUTTON_SECONDARY}>
          <ActionForm action={renameFolder} closeOnSuccess success="Renamed" className="grid gap-3 px-4 pb-4 pt-1">
            <input type="hidden" name="id" value={id} />
            <Input name="name" required maxLength={80} defaultValue={folder.name} aria-label="Folder name" autoComplete="off" data-autofocus />
            <Submit className={`${BUTTON_PRIMARY} w-full`}>Save</Submit>
          </ActionForm>
        </SheetButton>
        {empty ? (
          <ActionForm action={deleteFolder} errorTitle="Can’t Delete">
            <input type="hidden" name="id" value={id} />
            <ConfirmSubmit title={`Delete ${folder.name}?`} message="The folder is empty, so nothing else goes with it." className={BUTTON_DANGER}>
              Delete folder
            </ConfirmSubmit>
          </ActionForm>
        ) : (
          <p className="text-foot text-muted">To delete this folder, empty it first.</p>
        )}
      </div>
    </>
  )
}
