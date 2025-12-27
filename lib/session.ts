import { cookies } from "next/headers"

const SESSION_COOKIE_NAME = "drivecoach_session"

export async function setSessionCookie(token: string, expiresAt: Date) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  })
}

export async function getSessionCookie() {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE_NAME)?.value
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}
