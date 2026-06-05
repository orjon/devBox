"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { changePasswordAction } from "@/lib/actions/profile"

const ERRORS: Record<string, string> = {
  missing: "All fields are required.",
  mismatch: "New passwords do not match.",
  "wrong-password": "Current password is incorrect.",
}

export function ChangePasswordForm({ error, success }: { error?: string; success?: string }) {
  const [open, setOpen] = useState(!!error)

  if (!open) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)}>
        Change password
      </Button>
    )
  }

  return (
    <div className="rounded-lg border border-border p-4 space-y-4">
      <h3 className="text-sm font-medium text-foreground">Change password</h3>

      {error && (
        <p className="text-sm text-destructive">{ERRORS[error] ?? "Something went wrong."}</p>
      )}
      {success === "password-changed" && (
        <p className="text-sm text-green-500">Password updated successfully.</p>
      )}

      <form action={changePasswordAction} className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-sm text-muted-foreground" htmlFor="currentPassword">Current password</label>
          <Input id="currentPassword" name="currentPassword" type="password" placeholder="••••••••" required autoComplete="current-password" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm text-muted-foreground" htmlFor="newPassword">New password</label>
          <Input id="newPassword" name="newPassword" type="password" placeholder="••••••••" required autoComplete="new-password" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm text-muted-foreground" htmlFor="confirmPassword">Confirm new password</label>
          <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" required autoComplete="new-password" />
        </div>
        <div className="flex gap-2">
          <Button type="submit">Update password</Button>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
        </div>
      </form>
    </div>
  )
}
