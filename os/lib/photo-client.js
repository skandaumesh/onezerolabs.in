'use client'

import { addEventPhoto } from '@/lib/actions/events'
import { fitWithin, FULL_EDGE, FULL_QUALITY, MAX_PHOTO_BYTES, THUMB_EDGE, THUMB_QUALITY } from '@/lib/events.mjs'

/** Draws the photo at most `edge` pixels long and encodes it as JPEG, lowering quality if it is still too big. */
const draw = async (bitmap, edge, quality, limit) => {
  const { width, height } = fitWithin(bitmap.width, bitmap.height, edge)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  context.fillStyle = '#fff' // a PNG's see-through parts would turn black in a JPEG
  context.fillRect(0, 0, width, height)
  context.imageSmoothingQuality = 'high'
  context.drawImage(bitmap, 0, 0, width, height)

  for (let q = quality; ; q -= 0.12) {
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', Math.max(q, 0.4)))
    if (!blob) throw new Error('This photo could not be read.')
    if (blob.size <= limit || q <= 0.4) return { blob, width, height }
  }
}

/** A photo from the camera roll as a full copy and a small one, both JPEG, turned the right way up. */
export const shrinkPhoto = async (file) => {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  try {
    const full = await draw(bitmap, FULL_EDGE, FULL_QUALITY, MAX_PHOTO_BYTES)
    const small = await draw(bitmap, THUMB_EDGE, THUMB_QUALITY, 350 * 1024)
    return { full: full.blob, small: small.blob, width: full.width, height: full.height }
  } finally {
    bitmap.close?.()
  }
}

/**
 * Sends photos to an event one at a time, so a slow phone connection shows how
 * far it has got and one bad photo does not stop the rest.
 */
export const uploadPhotos = async (eventId, files, onProgress) => {
  const failed = []
  let saved = 0
  for (let i = 0; i < files.length; i++) {
    onProgress?.({ done: i, total: files.length })
    try {
      const photo = await shrinkPhoto(files[i])
      const data = new FormData()
      data.set('event_id', eventId)
      data.set('photo', photo.full, 'photo.jpg')
      data.set('thumb', photo.small, 'small.jpg')
      data.set('width', String(photo.width))
      data.set('height', String(photo.height))
      const result = await addEventPhoto(null, data)
      if (result?.error) failed.push(`${files[i].name}: ${result.error}`)
      else saved++
    } catch {
      failed.push(`${files[i].name}: this photo could not be read.`)
    }
  }
  onProgress?.(null)
  return { saved, failed }
}

/**
 * A profile photo: the middle square of the chosen photo, turned the right way
 * up, at most `edge` pixels across, as JPEG.
 */
export const squarePhoto = async (file, edge, limit) => {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  try {
    const side = Math.min(bitmap.width, bitmap.height)
    const size = Math.min(edge, side)
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const context = canvas.getContext('2d')
    context.fillStyle = '#fff'
    context.fillRect(0, 0, size, size)
    context.imageSmoothingQuality = 'high'
    context.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, size, size)
    for (let q = 0.85; ; q -= 0.1) {
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', Math.max(q, 0.45)))
      if (!blob) throw new Error('This photo could not be read.')
      if (blob.size <= limit || q <= 0.45) return blob
    }
  } finally {
    bitmap.close?.()
  }
}
