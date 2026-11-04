const Block = ({ className }) => <div className={`rounded-card bg-fill/70 ${className}`} />

/** Shown the instant a link is tapped, so waiting on the server never looks like nothing happened. */
export default function Loading() {
  return (
    <div className="skeleton" aria-busy="true" aria-label="Loading">
      <Block className="mb-6 h-10 w-56 !rounded-xl md:mb-8 md:h-12" />
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Block className="h-24" />
        <Block className="h-24" />
        <Block className="h-24 max-lg:hidden" />
        <Block className="h-24 max-lg:hidden" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Block className="h-56" />
        <Block className="h-56" />
      </div>
    </div>
  )
}
