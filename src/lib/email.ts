import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(
  email: string,
  name: string,
  verificationUrl: string
) {
  const { error } = await resend.emails.send({
    from: "DevBox <onboarding@resend.dev>",
    to: email,
    subject: "Verify your email address",
    html: `
      <p>Hi ${name},</p>
      <p>Thanks for signing up to DevBox. Please verify your email address by clicking the link below:</p>
      <p><a href="${verificationUrl}">Verify email address</a></p>
      <p>This link expires in 24 hours.</p>
      <p>If you didn't create an account, you can ignore this email.</p>
    `,
  })

  if (error) throw new Error(`Failed to send verification email: ${error.message}`)
}
