import { type NextRequest, NextResponse } from "next/server"

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("drivecoach_session")?.value

  const protectedRoutes = ["/dashboard", "/portal", "/onboarding", "/admin"]
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  // Redirect authenticated users away from auth pages
  const authRoutes = ["/auth"]
  const isAuthRoute = authRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  if (isAuthRoute && token) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/portal/:path*", "/onboarding/:path*", "/auth/:path*", "/admin/:path*"],
}
