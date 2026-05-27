import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { requestPasswordResetAction } from "@/lib/actions/auth"

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>
}) {
  const { sent, error } = await searchParams

  return (
    <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
      <h1 className="mb-2 text-xl font-semibold text-foreground">Reset your password</h1>

      {sent ? (
        <>
          <p className="mb-6 text-sm text-muted-foreground">
            If that email is registered, we&apos;ve sent a reset link. Check your inbox.
          </p>
          <p className="text-center text-sm text-muted-foreground">
            <Link href="/sign-in" className="text-foreground underline-offset-4 hover:underline">
              Back to sign in
            </Link>
          </p>
        </>
      ) : (
        <>
          <p className="mb-6 text-sm text-muted-foreground">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>

          {error === "missing" && (
            <p className="mb-4 text-sm text-destructive">Email address is required.</p>
          )}

          <form action={requestPasswordResetAction} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground" htmlFor="email">Email</label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required autoComplete="email" />
            </div>
            <Button type="submit" className="w-full">Send reset link</Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link href="/sign-in" className="text-foreground underline-offset-4 hover:underline">
              Back to sign in
            </Link>
          </p>
        </>
      )}
    </div>
  )
}
