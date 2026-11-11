'use client'

import { startTransition, useActionState, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ImagePlus } from 'lucide-react'
import { ActionErrorAlert } from '@/components/Alert'
import { showBanner } from '@/components/Banner'
import { ActionForm, Submit } from '@/components/forms'
import { useSheet } from '@/components/Sheet'
import { BUTTON_PRIMARY, BUTTON_SECONDARY, Field, Input, Textarea } from '@/components/ui'
import { createEvent, updateEvent } from '@/lib/actions/events'
import { addDays } from '@/lib/dates.mjs'
import { photoCount } from '@/lib/events.mjs'
import { uploadPhotos } from '@/lib/photo-client'

function EventFields({ event, today, kind }) {
  const upcoming = kind === 'upcoming'
  return (
    <>
      <div className="col-span-2">
        <Field label="Event">
          <Input name="title" required autoComplete="off" placeholder="Startup meetup, Koramangala" defaultValue={event?.title} data-autofocus />
        </Field>
      </div>
      <Field label="Date">
        <Input
          type="date"
          name="happened_on"
          required
          defaultValue={event?.happened_on ?? (upcoming ? addDays(today, 1) : today)}
          min={!event && upcoming ? today : undefined}
          max={!event && !upcoming ? today : undefined}
        />
      </Field>
      <Field label="Starts at">
        <Input type="time" name="start_time" defaultValue={event?.start_time ?? ''} />
      </Field>
      <div className="col-span-2">
        <Field label="Place">
          <Input name="place" autoComplete="off" placeholder="Bengaluru" defaultValue={event?.place ?? ''} />
        </Field>
      </div>
      <div className="col-span-2">
        <Field label={upcoming ? 'Notes' : 'What happened'}>
          <Textarea
            name="description"
            rows={4}
            placeholder={upcoming ? 'What it’s about, who’s going, what to bring' : 'Who we met, what we learned, what to follow up'}
            defaultValue={event?.description ?? ''}
          />
        </Field>
      </div>
    </>
  )
}

/** Says how far an upload has got. */
export function UploadProgress({ progress }) {
  if (!progress) return null
  return (
    <p role="status" className="text-center text-foot text-muted">
      Adding photo {progress.done + 1} of {progress.total}…
    </p>
  )
}

/**
 * Adds an event. An upcoming one has no photos yet, and both founders are
 * reminded the day before; a completed one is added with its photos, then opens.
 * Goes in a sheet.
 */
export function NewEventForm({ today, kind = 'completed' }) {
  const upcoming = kind === 'upcoming'
  const router = useRouter()
  const sheet = useSheet()
  const [files, setFiles] = useState([])
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(null)
  const [state, run] = useActionState(createEvent, null)
  const pickRef = useRef(null)

  useEffect(() => {
    if (!state?.ok) {
      if (state?.error) setBusy(false)
      return
    }
    if (upcoming) {
      showBanner('Event added. You’ll both be reminded the day before.')
      sheet?.close()
      return
    }
    ;(async () => {
      const { saved, failed } = files.length ? await uploadPhotos(state.id, files, setProgress) : { saved: 0, failed: [] }
      // One banner, as only one shows at a time. The sheet is about to close, and a banner outlives it.
      showBanner(`Event added${saved ? ` with ${photoCount(saved)}` : ''}${failed.length ? ` · ${photoCount(failed.length)} couldn’t be added` : ''}`)
      sheet?.close()
      router.push(`/events/${state.id}`)
    })()
    // Runs once per saved event.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  const onSubmit = (e) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    const data = new FormData(e.currentTarget)
    data.delete('photos')
    startTransition(() => run(data))
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-2 gap-3 px-4 pb-4 pt-1">
      <input type="hidden" name="kind" value={kind} />
      <EventFields today={today} kind={kind} />
      {!upcoming && (
        <div className="col-span-2">
          <input
            ref={pickRef}
            type="file"
            name="photos"
            accept="image/*"
            multiple
            className="sr-only"
            tabIndex={-1}
            onChange={(e) => setFiles([...e.target.files])}
          />
          <button type="button" onClick={() => pickRef.current?.click()} className={`${BUTTON_SECONDARY} w-full`}>
            <ImagePlus size={18} aria-hidden="true" />
            {files.length ? `${photoCount(files.length)} chosen` : 'Choose photos'}
          </button>
        </div>
      )}
      <div className="col-span-2 space-y-2">
        <button type="submit" disabled={busy} className={`${BUTTON_PRIMARY} w-full`}>
          {busy ? 'Saving…' : 'Add event'}
        </button>
        <UploadProgress progress={progress} />
      </div>
      <ActionErrorAlert state={state} title="Couldn’t Save" />
    </form>
  )
}

/** Changes an event's name, date, place or notes. Goes in a sheet. */
export function EditEventForm({ event, today }) {
  return (
    <ActionForm action={updateEvent} closeOnSuccess success="Saved" className="grid grid-cols-2 gap-3 px-4 pb-4 pt-1">
      <input type="hidden" name="id" value={event.id} />
      <EventFields event={event} today={today} kind={event.happened_on > today ? 'upcoming' : 'completed'} />
      <div className="col-span-2">
        <Submit className={`${BUTTON_PRIMARY} w-full`}>Save</Submit>
      </div>
    </ActionForm>
  )
}
