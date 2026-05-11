import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  const { name, email, password, confirmPassword } = await request.json()

  if (!name || !email || !password || !confirmPassword) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 })
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: "Passwords do not match" }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 })
  }

  const hashed = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  })

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 })
}
