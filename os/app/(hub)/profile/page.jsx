import { LogOut } from 'lucide-react'
import { ActionForm, ConfirmSubmit, Submit } from '@/components/forms'
import { ThemeSwitch } from '@/components/ThemeSwitch'
import { Avatar, BUTTON_DANGER, BUTTON_PRIMARY, BUTTON_SECONDARY, Card, Field, Input, PageHeader } from '@/components/ui'
import { signOut } from '@/lib/actions/auth'
import { changePassword, updateName } from '@/lib/actions/profile'
import { requireUser } from '@/lib/auth'
import { MIN_PASSWORD_LENGTH } from '@/lib/session.mjs'

export const metadata = { title: 'Profile' }

export default async function ProfilePage() {
  const user = await requireUser()

  return (
    <div className="max-w-2xl">
      <PageHeader title="Profile" />

      <div className="space-y-4">
        <Card>
          <div className="flex items-center gap-4 p-4">
            <Avatar name={user.name} large />
            <div className="min-w-0">
              <div className="break-words text-headline text-ink">{user.name}</div>
              <div className="break-all text-body text-muted md:text-sub">{user.email}</div>
            </div>
          </div>
        </Card>

        <Card title="Appearance">
          <div className="px-4 pb-4 pt-1">
            <ThemeSwitch />
          </div>
        </Card>

        <Card title="Your name">
          <ActionForm action={updateName} success="Saved" className="flex flex-wrap items-start gap-2 px-4 pb-4 pt-1">
            <div className="min-w-40 flex-1">
              <Input name="name" required aria-label="Your name" defaultValue={user.name} autoComplete="name" />
            </div>
            <Submit className={BUTTON_SECONDARY}>Save</Submit>
          </ActionForm>
        </Card>

        <Card title="Password">
          <ActionForm action={changePassword} reset success="Password changed" className="grid gap-3.5 px-4 pb-4 pt-1">
            <Field label="Current password">
              <Input type="password" name="current" required autoComplete="current-password" />
            </Field>
            <Field label="New password" hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}>
              <Input type="password" name="next" required minLength={MIN_PASSWORD_LENGTH} autoComplete="new-password" />
            </Field>
            <Field label="New password again">
              <Input type="password" name="again" required autoComplete="new-password" />
            </Field>
            <div>
              <Submit className={`${BUTTON_PRIMARY} w-full sm:w-auto`}>Change password</Submit>
            </div>
          </ActionForm>
        </Card>

        <form action={signOut}>
          <ConfirmSubmit title="Sign Out?" message="You’ll need your password to sign back in." confirm="Sign Out" className={`${BUTTON_DANGER} w-full`}>
            <LogOut size={17} aria-hidden="true" />
            Sign out
          </ConfirmSubmit>
        </form>
      </div>
    </div>
  )
}
