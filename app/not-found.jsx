import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="text-4xl font-bold tracking-tight text-ozl-ink sm:text-5xl font-[family-name:var(--font-eb-garamond)]">
        404 - Page Not Found
      </h2>
      <p className="mt-4 text-base text-ozl-muted">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-ozl-cta px-6 py-3 text-sm font-medium text-white transition-all hover:bg-neutral-800"
      >
        Return Home
      </Link>
    </div>
  )
}
