import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl
  const authToken = request.cookies.get('auth-token')

  // Redirect text-analyzer to dashboard
  if (pathname.includes('text-analyzer')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Public paths that don't need authentication
  const publicPaths = ['/', '/login', '/register']

  // Protected paths that need authentication
  const protectedPaths = ['/dashboard', '/supplements']

  // If path is protected and no auth token, redirect to login
  if (protectedPaths.some((path) => pathname.startsWith(path)) && !authToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If logged in user tries to access public paths, redirect to dashboard
  if (publicPaths.includes(pathname) && authToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
