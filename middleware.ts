import { NextRequest, NextResponse } from 'next/server';

// Middleware to check admin authentication
// TODO: Integrate with NextAuth.js for proper session management
export function middleware(request: NextRequest) {
  // For now, this is a placeholder
  // In Phase 3, we'll implement proper NextAuth.js authentication

  // Check if accessing admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // TODO: Verify admin session/token here
    // If not authenticated, redirect to login
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/vinyl/:path*', '/api/images/:path*'],
};
