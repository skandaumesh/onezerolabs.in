import Link from 'next/link'
import { ActionForm, Submit } from '@/components/forms'
import { BUTTON_PRIMARY, BUTTON_SECONDARY, Field, Input, Select, Textarea } from '@/components/ui'
import { PROJECT_STATUSES } from '@/lib/constants.mjs'

/** Used to add and to edit. The client is chosen once, when the project is created. */
export function ProjectForm({ action, project, companies, defaultCompany, users, cancelHref }) {
  const p = project || {}
  return (
    <ActionForm action={action} className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:p-5">
      {project && <input type="hidden" name="id" value={project.id} />}

      <Field label="Project name" wide>
        <Input name="name" required defaultValue={p.name ?? ''} autoComplete="off" />
      </Field>
      {!project && (
        <Field label="Client" wide>
          <Select
            name="company_id"
            required
            blank="Choose a client"
            defaultValue={defaultCompany ?? ''}
            options={companies.map((c) => ({ value: c.id, label: c.name }))}
          />
        </Field>
      )}
      <Field label="Status">
        <Select name="status" defaultValue={p.status ?? 'planning'} options={PROJECT_STATUSES} />
      </Field>
      <Field label="Owner">
        <Select
          name="owner_id"
          blank="No owner"
          defaultValue={p.owner_id ?? ''}
          options={users.map((u) => ({ value: u.id, label: u.name }))}
        />
      </Field>
      <Field label="Deadline">
        <Input type="date" name="due_date" defaultValue={p.due_date ?? ''} />
      </Field>
      <Field label="Description" wide>
        <Textarea name="description" defaultValue={p.description ?? ''} />
      </Field>

      <div className="flex flex-wrap gap-2 sm:col-span-2">
        <Submit className={`${BUTTON_PRIMARY} flex-1 sm:flex-none`}>{project ? 'Save changes' : 'Create project'}</Submit>
        <Link href={cancelHref} className={`${BUTTON_SECONDARY} flex-1 sm:flex-none`}>
          Cancel
        </Link>
      </div>
    </ActionForm>
  )
}
