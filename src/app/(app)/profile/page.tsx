import { auth } from "@/auth"
import { UserAvatar } from "@/components/ui/UserAvatar"
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm"
import { DeleteAccountButton } from "@/components/profile/DeleteAccountButton"
import { getProfileData } from "@/lib/db/profile"
import { ICON_MAP } from "@/lib/icon-map"

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>
}) {
  const { error, success } = await searchParams
  const session = await auth()
  const userId = session?.user?.id ?? ""
  const profile = await getProfileData(userId)

  const joinDate = profile.createdAt.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl">
      <h1 className="text-xl font-semibold text-foreground">Profile</h1>

      {/* User info */}
      <section className="rounded-xl border border-border bg-card p-6 flex items-center gap-4">
        <UserAvatar image={profile.image} name={profile.name} className="h-14 w-14 text-base" />
        <div className="min-w-0">
          <p className="font-medium text-foreground truncate">{profile.name ?? "No name"}</p>
          <p className="text-sm text-muted-foreground truncate">{profile.email}</p>
          <p className="text-xs text-muted-foreground mt-1">Member since {joinDate}</p>
        </div>
      </section>

      {/* Stats */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold text-foreground mb-4">Usage</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-2xl font-bold text-foreground">{profile.itemCount}</p>
            <p className="text-sm text-muted-foreground">Items</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{profile.collectionCount}</p>
            <p className="text-sm text-muted-foreground">Collections</p>
          </div>
        </div>

        <div className="space-y-2">
          {profile.itemTypeBreakdown.map((type) => {
            const Icon = ICON_MAP[type.icon]
            return (
              <div key={type.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="h-4 w-4" style={{ color: type.color }} />}
                  <span className="text-sm text-muted-foreground">{type.name}</span>
                </div>
                <span className="text-sm font-medium text-foreground">{type.count}</span>
              </div>
            )
          })}
        </div>
      </section>

      {/* Account actions */}
      <section className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Account</h2>

        {profile.hasPassword && (
          <ChangePasswordForm error={error} success={success} />
        )}

        <DeleteAccountButton />
      </section>
    </div>
  )
}
