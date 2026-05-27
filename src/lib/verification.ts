import { randomBytes } from "crypto"
import { prisma } from "@/lib/prisma"

const TOKEN_EXPIRY_HOURS = 24
const RESET_PREFIX = "reset:"

export async function createVerificationToken(email: string): Promise<string> {
  await prisma.verificationToken.deleteMany({ where: { identifier: email } })

  const token = randomBytes(32).toString("hex")
  const expires = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000)

  await prisma.verificationToken.create({
    data: { identifier: email, token, expires },
  })

  return token
}

export async function verifyToken(
  token: string
): Promise<{ email: string } | null> {
  const record = await prisma.verificationToken.findUnique({
    where: { token },
  })

  if (!record) return null
  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } })
    return null
  }

  await prisma.verificationToken.delete({ where: { token } })
  return { email: record.identifier }
}

export async function createPasswordResetToken(email: string): Promise<string> {
  const identifier = `${RESET_PREFIX}${email}`
  await prisma.verificationToken.deleteMany({ where: { identifier } })

  const token = randomBytes(32).toString("hex")
  const expires = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000)

  await prisma.verificationToken.create({
    data: { identifier, token, expires },
  })

  return token
}

export async function verifyPasswordResetToken(
  token: string
): Promise<{ email: string } | null> {
  const record = await prisma.verificationToken.findUnique({
    where: { token },
  })

  if (!record || !record.identifier.startsWith(RESET_PREFIX)) return null
  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } })
    return null
  }

  await prisma.verificationToken.delete({ where: { token } })
  return { email: record.identifier.slice(RESET_PREFIX.length) }
}
