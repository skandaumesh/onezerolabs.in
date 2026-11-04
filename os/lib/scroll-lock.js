/**
 * Stops the page behind a sheet or alert scrolling, which a modal dialog does not do
 * by itself. It counts holders, because an alert can open on top of a sheet: closing
 * the alert must not free the page while the sheet is still up.
 */
let holders = 0

export const lockPageScroll = () => {
  const root = document.documentElement
  if (holders++ === 0) {
    // The scrollbar's space is handed back as padding, so the dimming reaches the
    // edge of the window and the page does not shift sideways.
    const scrollbar = window.innerWidth - root.clientWidth
    root.style.scrollbarGutter = 'auto'
    root.style.overflow = 'hidden'
    root.style.paddingRight = `${scrollbar}px`
  }
  return () => {
    if (--holders > 0) return
    root.style.scrollbarGutter = ''
    root.style.overflow = ''
    root.style.paddingRight = ''
  }
}
