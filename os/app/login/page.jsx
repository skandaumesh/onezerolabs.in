import Image from 'next/image'
import { redirect } from 'next/navigation'
import { ActionForm, Submit } from '@/components/forms'
import { PasswordInput } from '@/components/PasswordInput'
import { BUTTON_PRIMARY, Field, Input } from '@/components/ui'
import { signIn } from '@/lib/actions/auth'
import { getUser } from '@/lib/auth'
import { sql } from '@/lib/db.mjs'

export const metadata = { title: 'Sign in' }
export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  if (await getUser()) redirect('/')
  const [{ users }] = await sql('SELECT count(*)::int AS users FROM users')

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]">
      <div className="w-full max-w-sm py-10">
        <Image src="/logo-print.png" alt="" width={48} height={48} className="logo-mark mb-5 h-12 w-auto" />
        <h1 className="text-large-title text-ink">OneZeroLabs OS</h1>
        <p className="mb-6 mt-1.5 text-body text-muted">Internal workspace. Co-founders only.</p>

        {users === 0 ? (
          <div className="card-surface rounded-card bg-surface p-5 text-sub text-ink2">
            <p className="font-medium text-ink">No logins exist yet.</p>
            <p className="mt-1">Create the first one from the os folder:</p>
            <code className="mt-3 block overflow-x-auto rounded-xl bg-field p-3 text-foot text-ink">
              npm run user:add -- --name Skanda --email you@example.com
            </code>
          </div>
        ) : (
          <ActionForm action={signIn} errorTitle="Can’t Sign In" className="card-surface space-y-4 rounded-card bg-surface p-5">
            <Field label="Email">
              <Input type="email" name="email" required autoComplete="username" autoCapitalize="none" autoFocus />
            </Field>
            <Field label="Password">
              <PasswordInput name="password" required autoComplete="current-password" />
            </Field>
            <Submit className={`${BUTTON_PRIMARY} w-full`}>Sign in</Submit>
          </ActionForm>
        )}
      </div>
    </main>
  )
}
