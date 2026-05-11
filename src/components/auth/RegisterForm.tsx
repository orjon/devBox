import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { registerAction } from "@/lib/actions/auth"

const ERRORS: Record<string, string> = {
  missing: "All fields are required.",
  mismatch: "Passwords do not match.",
  exists: "An account with that email already exists.",
}

export function RegisterForm({ error }: { error?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
      <h1 className="mb-6 text-xl font-semibold text-foreground">Create an account</h1>

      <form action={registerAction} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm text-muted-foreground" htmlFor="name">Name</label>
          <Input id="name" name="name" type="text" placeholder="Your name" required autoComplete="name" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm text-muted-foreground" htmlFor="email">Email</label>
          <Input id="email" name="email" type="email" placeholder="you@example.com" required autoComplete="email" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm text-muted-foreground" htmlFor="password">Password</label>
          <Input id="password" name="password" type="password" placeholder="••••••••" required autoComplete="new-password" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm text-muted-foreground" htmlFor="confirmPassword">Confirm password</label>
          <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" required autoComplete="new-password" />
        </div>

        {error && <p className="text-sm text-destructive">{ERRORS[error] ?? "Something went wrong."}</p>}

        <Button type="submit" className="w-full">Create account</Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-foreground underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
