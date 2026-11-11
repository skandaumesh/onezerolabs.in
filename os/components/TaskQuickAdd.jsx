import { ActionForm, Submit } from '@/components/forms'
import { MeetField } from '@/components/MeetField'
import { BUTTON_PRIMARY, Field, Input, Select } from '@/components/ui'
import { createTask } from '@/lib/actions/tasks'
import { PRIORITIES } from '@/lib/constants.mjs'

/**
 * Captures a task inside a sheet. It stays open and clears after each one, so a
 * project's checklist can be typed in one go. Pass `projectId` to fix the
 * project, or `projects` to offer a choice.
 */
export function TaskQuickAdd({ users, projectId, projects, defaultAssignee }) {
  return (
    <ActionForm action={createTask} reset success="Added" className="grid grid-cols-2 gap-3 px-4 pb-4 pt-1">
      {projectId && <input type="hidden" name="project_id" value={projectId} />}
      <div className="col-span-2">
        <Input name="title" required aria-label="What needs doing" placeholder="What needs doing?" autoComplete="off" data-autofocus />
      </div>
      <MeetField className="col-span-2" />
      {projects && (
        <div className="col-span-2">
          <Field label="Project">
            <Select
              name="project_id"
              blank="No project"
              options={projects.map((p) => ({ value: p.id, label: `${p.company_name} · ${p.name}` }))}
            />
          </Field>
        </div>
      )}
      <Field label="Assign to">
        <Select
          name="assignee_id"
          blank="Unassigned"
          defaultValue={defaultAssignee ?? ''}
          options={[...users.map((u) => ({ value: u.id, label: u.name })), { value: 'both', label: 'Both' }]}
        />
      </Field>
      <Field label="Priority">
        <Select name="priority" defaultValue="medium" options={PRIORITIES} />
      </Field>
      <Field label="Due date">
        <Input type="date" name="due_date" />
      </Field>
      <Field label="Time">
        <Input type="time" name="due_time" />
      </Field>
      <div className="col-span-2">
        <Submit className={`${BUTTON_PRIMARY} w-full`}>Add task</Submit>
      </div>
    </ActionForm>
  )
}
