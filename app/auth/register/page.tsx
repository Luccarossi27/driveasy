// This page redirects to role-specific registration
import { redirect } from "next/navigation"

export default function RegisterPage() {
  redirect("/auth")
}
