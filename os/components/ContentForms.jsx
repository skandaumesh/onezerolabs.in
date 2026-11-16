'use client'

import { useMemo, useState } from 'react'
import { ActionForm, ConfirmSubmit, Submit } from '@/components/forms'
import { BUTTON_PRIMARY, Field, Input, Select, Textarea } from '@/components/ui'
import { createContentPost, importContentPlan, updateContentPost } from '@/lib/actions/content'
import { FORMATS, parsePlan, planSummary } from '@/lib/content.mjs'
import { formatDay } from '@/lib/dates.mjs'

const ownerOptions = (users) => [...users.map((u) => ({ value: u.id, label: u.name })), { value: 'both', label: 'Both' }]

/** Adds a post to the calendar, or edits one. Goes in a sheet, or on a post's page. */
export function ContentPostForm({ users, today, post, defaultOwner, themes = [] }) {
  const editing = Boolean(post)
  return (
    <ActionForm
      action={editing ? updateContentPost : createContentPost}
      reset={!editing}
      success={editing ? 'Saved' : 'Post added'}
      className={editing ? 'grid grid-cols-2 gap-3 p-4 pt-2' : 'grid grid-cols-2 gap-3 px-4 pb-4 pt-1'}
    >
      {editing && <input type="hidden" name="id" value={post.id} />}
      <div className="col-span-2">
        <Field label="Topic">
          <Input name="topic" required autoComplete="off" placeholder="5 things I check before a website goes live" defaultValue={post?.topic} data-autofocus={!editing || undefined} />
        </Field>
      </div>
      <Field label="Day">
        <Input type="date" name="post_date" required defaultValue={post?.post_date ?? today} />
      </Field>
      <Field label="Format">
        <Select name="format" defaultValue={post?.format ?? 'carousel'} options={FORMATS} />
      </Field>
      <Field label="Owner">
        <Select name="owner_id" defaultValue={post ? (post.for_both ? 'both' : (post.owner_id ?? '')) : defaultOwner} blank="No one yet" options={ownerOptions(users)} />
      </Field>
      <Field label="Week or theme">
        <Input name="theme" list="content-themes" autoComplete="off" placeholder="Week 1 — Things we do" defaultValue={post?.theme ?? ''} />
        <datalist id="content-themes">
          {themes.map((t) => (
            <option key={t} value={t} />
          ))}
        </datalist>
      </Field>
      {editing && (
        <>
          <div className="col-span-2">
            <Field label="Caption">
              <Textarea name="caption" rows={4} placeholder="The caption and hashtags" defaultValue={post.caption ?? ''} />
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="Notes">
              <Textarea name="notes" rows={3} placeholder="Hook ideas, shot list, slide outline" defaultValue={post.notes ?? ''} />
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="Link once posted">
              <Input name="link" inputMode="url" autoComplete="off" autoCapitalize="none" placeholder="https://www.instagram.com/p/…" defaultValue={post.link ?? ''} />
            </Field>
          </div>
        </>
      )}
      <div className="col-span-2">
        <Submit className={`${BUTTON_PRIMARY} w-full`}>{editing ? 'Save' : 'Add post'}</Submit>
      </div>
    </ActionForm>
  )
}

/**
 * Turns a pasted plan into posts: week headings and rows of Day, Format, Owner
 * and Topic. Shows what it found as it is pasted, and asks before adding them.
 * Goes in a sheet.
 */
export function ImportPlanForm({ users, today }) {
  const [plan, setPlan] = useState('')
  const [start, setStart] = useState(today)
  const found = useMemo(() => parsePlan(plan, users, start || today), [plan, start, users, today])
  const { posts, problems } = found
  const range = posts.length ? `${formatDay(posts.reduce((a, p) => (p.postDate < a ? p.postDate : a), posts[0].postDate), today)} to ${formatDay(posts.reduce((a, p) => (p.postDate > a ? p.postDate : a), posts[0].postDate), today)}` : ''

  return (
    <ActionForm action={importContentPlan} closeOnSuccess success="Plan added to the calendar" errorTitle="Couldn’t Import" className="grid gap-3 px-4 pb-4 pt-1">
      <Field label="Paste your plan" hint="Rows of Day, Format, Owner and Topic, from a document, sheet or chat. Week headings are kept.">
        <Textarea name="plan" rows={8} required value={plan} onChange={(e) => setPlan(e.target.value)} placeholder={'Week 1 — Things we actually do\n1\tCarousel\tSkanda\tA client wants a website…\n2\tReel\tTanisha\tHow I plan a month of content'} />
      </Field>
      <Field label="Day 1 is on">
        <Input type="date" name="start" required value={start} onChange={(e) => setStart(e.target.value)} />
      </Field>
      <div role="status" aria-live="polite" className="rounded-xl bg-fill px-3.5 py-3 text-foot text-ink2">
        {posts.length ? (
          <>
            <span className="font-semibold text-ink">
              {posts.length} posts found: {planSummary(posts)}
            </span>
            , {range}.
          </>
        ) : (
          'Paste a plan to see what will be added.'
        )}
        {problems.length > 0 && (
          <ul className="mt-2 list-disc space-y-0.5 pl-4 text-soon">
            {problems.slice(0, 5).map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        )}
      </div>
      <ConfirmSubmit
        destructive={false}
        confirm="Add Posts"
        title={() => `Add ${posts.length} Posts?`}
        message={() => `${planSummary(posts)}, ${range}, each with its own checklist. You’ll both be reminded at 5 pm on each day.`}
        className={`${BUTTON_PRIMARY} w-full`}
      >
        {posts.length ? `Add ${posts.length} posts` : 'Add posts'}
      </ConfirmSubmit>
    </ActionForm>
  )
}
