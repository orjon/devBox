"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { deleteAccountAction } from "@/lib/actions/profile"

export function DeleteAccountButton() {
  const [confirming, setConfirming] = useState(false)

  if (!confirming) {
    return (
      <Button variant="outline" className="text-destructive border-destructive/40 hover:bg-destructive/10 hover:text-destructive" onClick={() => setConfirming(true)}>
        Delete account
      </Button>
    )
  }

  return (
    <div className="rounded-lg border border-destructive/40 p-4 space-y-3">
      <p className="text-sm text-foreground font-medium">Are you sure you want to delete your account?</p>
      <p className="text-sm text-muted-foreground">This will permanently delete your account, all your items, and collections. This cannot be undone.</p>
      <div className="flex gap-2">
        <form action={deleteAccountAction}>
          <Button type="submit" variant="outline" className="text-destructive border-destructive/40 hover:bg-destructive/10 hover:text-destructive">
            Yes, delete my account
          </Button>
        </form>
        <Button variant="outline" onClick={() => setConfirming(false)}>Cancel</Button>
      </div>
    </div>
  )
}
