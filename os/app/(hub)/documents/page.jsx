import { DocumentActions, DocumentSearch, FolderContents } from '@/components/DocumentBrowser'
import { DocumentRow } from '@/components/DocumentRows'
import { Card, Empty, PageHeader } from '@/components/ui'
import { requireUser } from '@/lib/auth'
import { formatBytes, likePattern } from '@/lib/documents.mjs'
import {
  getDocumentStats,
  listCompanyOptions,
  listDocuments,
  listFolderOptions,
  listFolders,
  searchDocuments,
} from '@/lib/queries'

export const metadata = { title: 'Documents' }

export default async function DocumentsPage({ searchParams }) {
  await requireUser()
  const params = await searchParams
  const q = typeof params.q === 'string' ? params.q.trim().slice(0, 100) : ''

  const [folders, documents, stats, folderOptions, companies, results] = await Promise.all([
    q ? [] : listFolders(null),
    q ? [] : listDocuments(null),
    getDocumentStats(),
    listFolderOptions(),
    listCompanyOptions(),
    q ? searchDocuments(likePattern(q)) : null,
  ])

  return (
    <>
      <PageHeader
        back={{ href: '/', label: 'Overview' }}
        title="Documents"
        description={
          stats.files
            ? `${stats.files === 1 ? '1 file' : `${stats.files} files`} · ${formatBytes(stats.bytes)}`
            : 'Agreements, quotations and anything else worth keeping.'
        }
        action={<DocumentActions folders={folderOptions} companies={companies} />}
      />

      <div className="mb-4">
        <DocumentSearch q={q} />
      </div>

      {results ? (
        <Card title="Results" count={results.length}>
          {results.length ? (
            <ul className="rows" style={{ '--rows-inset': '3.75rem' }}>
              {results.map((doc) => (
                <DocumentRow key={doc.id} doc={doc} showFolder />
              ))}
            </ul>
          ) : (
            <Empty title={`Nothing matches “${q}”`}>Search looks at file names, folders and clients.</Empty>
          )}
        </Card>
      ) : (
        <FolderContents
          folders={folders}
          documents={documents}
          emptyTitle="No documents yet"
          emptyText="Make folders such as Agreements and Quotations, then upload into them."
        />
      )}
    </>
  )
}
