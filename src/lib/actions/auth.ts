"use server"

import { redirect } from "next/navigation"
import { AuthError } from "next-auth"
import bcrypt from "bcryptjs"
import { signIn, signOut } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function credentialsSignIn(formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    })
  } catch (error) {
    if (error instanceof AuthError) {
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
  redirect("/sign-in?success=1")
}

export async function handleSignOut() {
  await signOut({ redirectTo: "/" })
}
