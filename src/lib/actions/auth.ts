"use server"

import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { AuthError } from "next-auth"
import bcrypt from "bcryptjs"
import { signIn, signOut } from "@/auth"
import { prisma } from "@/lib/prisma"
import { createVerificationToken } from "@/lib/verification"
import { sendVerificationEmail } from "@/lib/email"

async function getBaseUrl() {
  const headersList = await headers()
  const host = headersList.get("host") ?? "localhost:3000"
  const proto = process.env.NODE_ENV === "production" ? "https" : "http"
  return `${proto}://${host}`
}

export async function credentialsSignIn(formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      if ((error as AuthError & { code?: string }).code === "unverified") {
        redirect("/sign-in?error=unverified")
      }
      redirect("/sign-in?error=invalid")
    }
    throw error
  }
}

export async function githubSignIn() {
  await signIn("github", { redirectTo: "/dashboard" })
}

export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!name || !email || !password || !confirmPassword) {
    redirect("/register?error=missing")
  }
  if (password !== confirmPassword) {
    redirect("/register?error=mismatch")
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    redirect("/register?error=exists")
  }

  const hashed = await bcrypt.hash(password, 12)
  await prisma.user.create({ data: { name, email, password: hashed } })

  const token = await createVerificationToken(email)
  const baseUrl = await getBaseUrl()
  const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${token}`
  await sendVerificationEmail(email, name, verificationUrl)

  redirect(`/verify-email?email=${encodeURIComponent(email)}`)
}

export async function resendVerificationAction(formData: FormData) {
  const email = formData.get("email") as string
  if (!email) redirect("/verify-email?error=missing")

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || user.emailVerified) {
    redirect(`/verify-email?email=${encodeURIComponent(email)}&sent=1`)
  }

  const token = await createVerificationToken(email)
  const baseUrl = await getBaseUrl()
  const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${token}`
  await sendVerificationEmail(email, user.name ?? "there", verificationUrl)

  redirect(`/verify-email?email=${encodeURIComponent(email)}&sent=1`)
}

export async function handleSignOut() {
  await signOut({ redirectTo: "/" })
}
