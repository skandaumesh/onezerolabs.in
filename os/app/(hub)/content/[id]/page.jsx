import { notFound } from 'next/navigation'
import { ExternalLink, Trash2 } from 'lucide-react'
import { ContentPostForm } from '@/components/ContentForms'
import { FormatTag } from '@/components/ContentRow'
import { ActionForm, CheckButton, ConfirmSubmit, Submit } from '@/components/forms'
import { BUTTON_DANGER, BUTTON_SECONDARY, Card, Input, PageHeader } from '@/components/ui'
import { addContentStep, deleteContentPost, deleteContentStep, toggleContentDone, toggleContentStep } from '@/lib/actions/content'
import { requireUser } from '@/lib/auth'
import { dueLabel, formatDay, todayIST } from '@/lib/dates.mjs'
import { isUuid } from '@/lib/forms'
import { getContentPost, listContentPosts, listContentSteps, listUsers } from '@/lib/queries'

export async function generateMetadata({ params }) {
  const { id } = await params
  const post = isUuid(id) ? await getContentPost(id) : null
  return { title: post?.topic ?? 'Post' }
}

/** One planned post, like a Notion page: done or not, its checklist, and its details. */
export default async function ContentPostPage({ params }) {
  await requireUser()
  const { id } = await params
  const post = isUuid(id) ? await getContentPost(id) : null
  if (!post) notFound()
  const today = todayIST()
  const [steps, users, all] = await Promise.all([listContentSteps(id), listUsers(), listContentPosts()])
  const themes = [...new Set(all.map((p) => p.theme).filter(Boolean))]
  const due = dueLabel(post.post_date, today)
  const done = Boolean(post.done_at)

  return (
    <>
      <PageHeader back={{ href: '/content', label: 'Content' }} eyebrow={post.theme} title={post.topic} />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {done ? <span className="text-sub text-muted">{formatDay(post.post_date, today)}</span> : <span className={`text-sub font-medium ${due.tone === 'late' ? 'text-late' : due.tone === 'soon' ? 'text-soon' : 'text-ink2'}`}>{due.text}</span>}
        <FormatTag format={post.format} />
        {post.owner_name && <span className="text-sub text-ink2">{post.owner_name}</span>}
        {post.link && (
          <a href={post.link} target="_blank" rel="noopener noreferrer" className="press inline-flex items-center gap-1 text-sub font-medium text-accent">
            <ExternalLink size={14} aria-hidden="true" />
            View post
          </a>
        )}
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-4">
          <Card>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <CheckButton action={toggleContentDone} id={post.id} done={post.done_at} label={post.topic} />
              <div className="min-w-0">
                <div className="text-body font-medium text-ink md:text-sub">{done ? 'Done' : 'Not done yet'}</div>
                <div className="text-foot text-muted">{done ? 'No more reminders for this post.' : 'You’ll both be reminded at 5 pm on its day until it’s ticked.'}</div>
              </div>
            </div>
          </Card>

          <Card title="Checklist" count={`${steps.filter((s) => s.done).length}/${steps.length}`}>
            {steps.length > 0 && (
              <ul className="rows rows-task">
                {steps.map((s) => (
                  <li key={s.id} className="flex items-center gap-3 py-2.5 pl-4 pr-3">
                    <CheckButton action={toggleContentStep} id={s.id} done={s.done} label={s.title} square />
                    <span className={`min-w-0 flex-1 break-words text-body md:text-sub ${s.done ? 'text-muted line-through' : 'text-ink'}`}>{s.title}</span>
                    <ActionForm action={deleteContentStep} errorTitle="Couldn’t Remove">
                      <input type="hidden" name="id" value={s.id} />
                      <ConfirmSubmit title="Remove Step?" message={`“${s.title}” comes off this post’s checklist.`} confirm="Remove" aria-label={`Remove ${s.title}`} className="press flex h-11 w-11 items-center justify-center rounded-full text-muted hover:text-late">
                        <Trash2 size={16} aria-hidden="true" />
                      </ConfirmSubmit>
                    </ActionForm>
                  </li>
                ))}
              </ul>
            )}
            <ActionForm action={addContentStep} reset className="flex flex-wrap gap-2 p-4 pt-2">
              <input type="hidden" name="post_id" value={post.id} />
              <div className="min-w-40 flex-1">
                <Input name="title" required aria-label="New step" placeholder="Add a step" autoComplete="off" />
              </div>
              <Submit className={BUTTON_SECONDARY}>Add</Submit>
            </ActionForm>
          </Card>
        </div>

        <div className="min-w-0 space-y-4">
          <Card title="Details">
            <ContentPostForm users={users} today={today} post={post} themes={themes} />
          </Card>
          <ActionForm action={deleteContentPost} errorTitle="Couldn’t Delete">
            <input type="hidden" name="id" value={post.id} />
            <ConfirmSubmit title="Delete Post?" message="It comes off the calendar for both of you, with its checklist and notes." className={BUTTON_DANGER}>
              Delete post
            </ConfirmSubmit>
          </ActionForm>
        </div>
      </div>
    </>
  )
}
