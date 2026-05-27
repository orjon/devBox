import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { resetPasswordAction } from "@/lib/actions/auth"

const ERRORS: Record<string, string> = {
  missing: "All fields are required.",
  mismatch: "Passwords do not match.",
  invalid: "This reset link is invalid or has expired.",
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>
}) {
  const { token, error } = await searchParams

  if (!token && !error) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
        <h1 className="mb-2 text-xl font-semibold text-foreground">Invalid link</h1>
        <p className="mb-6 text-sm text-muted-foreground">This password reset link is invalid or has expired.</p>
        <Link href="/forgot-password" className="text-sm text-foreground underline-offset-4 hover:underline">
          Request a new link
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
      <h1 className="mb-6 text-xl font-semibold text-foreground">Choose a new password</h1>

      {error && (
        <p className="mb-4 text-sm text-destructive">{ERRORS[error] ?? "Something went wrong."}</p>
      )}

      {error === "invalid" ? (
        <p className="text-sm text-muted-foreground">
          <Link href="/forgot-password" className="text-foreground underline-offset-4 hover:underline">
            Request a new reset link
          </Link>
        </p>
      ) : (
        <form action={resetPasswordAction} className="space-y-4">
          <input type="hidden" name="token" value={token ?? ""} />
          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground" htmlFor="password">New password</label>
            <Input id="password" name="password" type="password" placeholder="••••••••" required autoComplete="new-password" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground" htmlFor="confirmPassword">Confirm password</label>
            <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" required autoComplete="new-password" />
          </div>
          <Button type="submit" className="w-full">Reset password</Button>
        </form>
      )}
    </div>
  )
}
