import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/verification"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")

  if (!token) {
    return NextResponse.redirect(new URL("/sign-in?error=invalid_token", request.url))
  }

  const result = await verifyToken(token)

  if (!result) {
    return NextResponse.redirect(new URL("/sign-in?error=expired_token", request.url))
  }

  await prisma.user.update({
    where: { email: result.email },
    data: { emailVerified: new Date() },
  })

  return NextResponse.redirect(new URL("/sign-in?verified=1", request.url))
}
