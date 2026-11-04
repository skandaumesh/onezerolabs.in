'use client'

import { useState } from 'react'
import { CloudUpload, X } from 'lucide-react'
import { ProblemAlert } from '@/components/Alert'
import { showBanner } from '@/components/Banner'
import { useSheet } from '@/components/Sheet'
import { BUTTON_PRIMARY, BUTTON_SECONDARY, Field, Select } from '@/components/ui'
import { uploadDocument } from '@/lib/actions/documents'
import { ACCEPT, formatBytes, MAX_FILE_BYTES, MAX_FILE_MB, typeOfName } from '@/lib/documents.mjs'

/** What is wrong with a file before it is sent, or null. */
const problemWith = (file) => {
  if (!typeOfName(file.name)) return 'Not a kind kept here'
  if (file.size > MAX_FILE_BYTES) return `Over ${MAX_FILE_MB} MB`
  if (file.size === 0) return 'Empty'
  return null
}

/**
 * Picks files, or takes them dropped on it, and sends them one at a time so it can
 * say how far it has got. Goes in a sheet.
 */
export function UploadForm({ folderId = '', companyId = '', folders, companies }) {
  const sheet = useSheet()
  const [files, setFiles] = useState([])
  const [over, setOver] = useState(false)
  const [progress, setProgress] = useState(null)
  const [problem, setProblem] = useState(null)

  const add = (list) => {
    const picked = [...list]
    setFiles((current) => {
      const seen = new Set(current.map((f) => `${f.name}:${f.size}`))
      return [...current, ...picked.filter((f) => !seen.has(`${f.name}:${f.size}`))]
    })
  }

  const ready = files.filter((f) => !problemWith(f))

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!ready.length || progress) return
    const form = new FormData(e.currentTarget)
    const failed = []
    const skipped = []
    let saved = 0

    for (let i = 0; i < ready.length; i++) {
      setProgress({ done: i, total: ready.length })
      const data = new FormData()
      data.set('file', ready[i])
      data.set('folder_id', form.get('folder_id') ?? '')
      data.set('company_id', form.get('company_id') ?? '')
      try {
        const result = await uploadDocument(null, data)
        if (result?.error) failed.push({ file: ready[i], reason: result.error })
        else if (result?.skipped) skipped.push(result.name)
        else saved++
      } catch {
        failed.push({ file: ready[i], reason: `${ready[i].name} couldn’t be sent. Check the connection and try again.` })
      }
    }
    setProgress(null)

    if (saved) showBanner(saved === 1 ? 'File uploaded' : `${saved} files uploaded`)
    if (failed.length || skipped.length) {
      // Keep what failed, so trying again is one tap.
      setFiles(failed.map((f) => f.file))
      setProblem({
        title: failed.length ? (saved ? 'Some Files Weren’t Uploaded' : 'Couldn’t Upload') : 'Already Here',
        message: [
          ...failed.map((f) => f.reason),
          ...skipped.map((name) => `${name} is already in this folder, so it wasn’t added again.`),
        ].join('\n'),
      })
    } else {
      setFiles([])
      sheet?.close()
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 px-4 pb-4 pt-1">
      <label
        onDragEnter={() => setOver(true)}
        onDragLeave={() => setOver(false)}
        onDrop={() => setOver(false)}
        className={`relative flex min-h-36 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed px-4 py-6 text-center transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${
          over ? 'border-accent bg-accent/5' : 'border-line bg-field'
        }`}
      >
        <CloudUpload size={30} strokeWidth={1.75} className="mb-1 text-accent" aria-hidden="true" />
        <span className="text-body font-semibold text-ink">Choose files</span>
        <span className="text-foot text-muted">
          <span className="hidden md:inline">or drop them here. </span>PDF, Word, Excel, PowerPoint, images or zip, up to {MAX_FILE_MB} MB each.
        </span>
        {/* Covers the whole area, so a tap opens the picker and a drop lands on it. */}
        <input
          type="file"
          multiple
          accept={ACCEPT}
          aria-label="Choose files"
          onChange={(e) => {
            add(e.target.files)
            e.target.value = ''
          }}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </label>

      {files.length > 0 && (
        <ul aria-label="Chosen files" className="rows overflow-hidden rounded-2xl bg-field">
          {files.map((file) => {
            const issue = problemWith(file)
            return (
              <li key={`${file.name}:${file.size}`} className="flex items-center gap-2 py-1.5 pl-3.5 pr-1">
                <span className="min-w-0 flex-1">
                  <span className="block break-words text-sub text-ink">{file.name}</span>
                  <span className={`block text-foot ${issue ? 'text-late' : 'text-muted'}`}>{issue ?? formatBytes(file.size)}</span>
                </span>
                <button
                  type="button"
                  aria-label={`Remove ${file.name}`}
                  onClick={() => setFiles((current) => current.filter((f) => f !== file))}
                  className="press flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted"
                >
                  <X size={17} aria-hidden="true" />
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Folder">
          <Select
            name="folder_id"
            defaultValue={folderId ?? ''}
            options={[{ value: '', label: 'Documents' }, ...folders.map((f) => ({ value: f.id, label: f.path }))]}
          />
        </Field>
        <Field label="Client">
          <Select name="company_id" blank="None" defaultValue={companyId ?? ''} options={companies.map((c) => ({ value: c.id, label: c.name }))} />
        </Field>
      </div>

      <button type="submit" disabled={!ready.length || Boolean(progress)} className={`${ready.length ? BUTTON_PRIMARY : BUTTON_SECONDARY} w-full`}>
        {progress
          ? `Uploading ${progress.done + 1} of ${progress.total}…`
          : ready.length > 1
            ? `Upload ${ready.length} files`
            : 'Upload'}
      </button>
      <p role="status" className="sr-only">
        {progress ? `Uploading ${progress.done + 1} of ${progress.total}` : ''}
      </p>

      {problem && <ProblemAlert {...problem} onClose={() => setProblem(null)} />}
    </form>
  )
}
