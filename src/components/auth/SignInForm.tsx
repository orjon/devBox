import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { credentialsSignIn, githubSignIn } from "@/lib/actions/auth"

const ERRORS: Record<string, string> = {
  invalid: "Invalid email or password.",
  invalid_token: "Invalid verification link.",
  expired_token: "Verification link has expired.",
}

const SUCCESS: Record<string, string> = {
  "password-reset": "Password reset — sign in with your new password.",
}

export function SignInForm({ error, success, verified }: { error?: string; success?: string; verified?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
      <h1 className="mb-6 text-xl font-semibold text-foreground">Sign in to DevBox</h1>

      {success && (
        <p className="mb-4 text-sm text-green-500">
          {SUCCESS[success] ?? "Account created — sign in below."}
        </p>
      )}

      {verified && (
        <p className="mb-4 text-sm text-green-500">Email verified — you can now sign in.</p>
      )}

      {error === "unverified" && (
        <p className="mb-4 text-sm text-destructive">
          Please verify your email first.{" "}
          <Link href="/verify-email" className="underline underline-offset-4">
            Resend verification email
          </Link>
        </p>
      )}

      <form action={credentialsSignIn} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm text-muted-foreground" htmlFor="email">Email</label>
          <Input id="email" name="email" type="email" placeholder="you@example.com" required autoComplete="email" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm text-muted-foreground" htmlFor="password">Password</label>
            <Link href="/forgot-password" className="text-xs text-muted-foreground underline-offset-4 hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input id="password" name="password" type="password" placeholder="••••••••" required autoComplete="current-password" />
        </div>

        {error && error !== "unverified" && (
          <p className="text-sm text-destructive">{ERRORS[error] ?? "Something went wrong."}</p>
        )}

        <Button type="submit" className="w-full">Sign in</Button>
      </form>

      <div className="my-4 flex items-center gap-3">
        <div className="flex-1 border-t border-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="flex-1 border-t border-border" />
      </div>

      <form action={githubSignIn}>
        <Button type="submit" variant="outline" className="w-full">
          Sign in with GitHub
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        No account?{" "}
        <Link href="/register" className="text-foreground underline-offset-4 hover:underline">
          Register
        </Link>
      </p>
    </div>
  )
}
