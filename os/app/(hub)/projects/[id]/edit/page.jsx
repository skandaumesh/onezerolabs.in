import { notFound } from 'next/navigation'
import { ProjectForm } from '@/components/ProjectForm'
import { Card, PageHeader } from '@/components/ui'
import { updateProject } from '@/lib/actions/projects'
import { requireUser } from '@/lib/auth'
import { isUuid } from '@/lib/forms'
import { getProject, listUsers } from '@/lib/queries'

export const metadata = { title: 'Edit project' }

export default async function EditProjectPage({ params }) {
  await requireUser()
  const { id } = await params
  const project = isUuid(id) ? await getProject(id) : null
  if (!project) notFound()

  return (
    <div className="max-w-3xl">
      <PageHeader back={{ href: `/projects/${id}`, label: project.name }} title="Edit project" />
      <Card>
        <ProjectForm action={updateProject} project={project} users={await listUsers()} cancelHref={`/projects/${id}`} />
      </Card>
    </div>
  )
}
