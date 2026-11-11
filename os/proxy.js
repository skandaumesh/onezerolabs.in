import { NextResponse } from 'next/server'
import { readSession, requireSecret, SESSION_COOKIE } from '@/lib/session.mjs'

/**
 * Everything except the login page needs a valid session.
 *
 * Server actions pass through: each one checks the session itself and redirects
 * in a form the page can follow. Redirected here, an expired session would leave
 * the form hanging with no response. test/rules.test.mjs fails if an action
 * skips that check, and the hub layout guards every page regardless of this file.
 */
export function proxy(request) {
  const signedIn = readSession(request.cookies.get(SESSION_COOKIE)?.value, requireSecret())
  const isAction = request.method === 'POST' && request.headers.has('next-action')
  if (signedIn || isAction || request.nextUrl.pathname === '/login') return NextResponse.next()
  return NextResponse.redirect(new URL('/login', request.url))
}

// Files a browser fetches before anyone has signed in stay public: the page
// assets, and what a phone reads to add the app to its home screen.
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|logo-print.png|robots.txt|manifest.webmanifest|apple-touch-icon.png|web-app-manifest-192x192.png|web-app-manifest-512x512.png).*)',
  ],
}
