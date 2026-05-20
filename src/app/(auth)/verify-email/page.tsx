import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { resendVerificationAction } from "@/lib/actions/auth"

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; sent?: string; error?: string }>
}) {
  const { email, sent, error } = await searchParams

  return (
    <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
      <h1 className="mb-2 text-xl font-semibold text-foreground">Check your email</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        {email ? (
          <>We sent a verification link to <span className="text-foreground">{email}</span>. Click the link to activate your account.</>
        ) : (
          "We sent a verification link to your email address."
        )}
      </p>

      {sent && (
        <p className="mb-4 text-sm text-green-500">Verification email resent.</p>
      )}

      {error === "missing" && (
        <p className="mb-4 text-sm text-destructive">Email address is required.</p>
      )}

      <form action={resendVerificationAction} className="space-y-3">
        <Input
          name="email"
          type="email"
          defaultValue={email ?? ""}
          placeholder="you@example.com"
          required
        />
        <Button type="submit" variant="outline" className="w-full">
          Resend verification email
        </Button>
      </form>
    </div>
  )
}
