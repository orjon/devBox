import { cn } from "@/lib/utils"

function initials(name?: string | null) {
  if (!name) return "?"
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("")
}

export function UserAvatar({
  image,
  name,
  className,
}: {
  image?: string | null
  name?: string | null
  className?: string
}) {
  const base = cn(
    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground text-xs font-medium select-none overflow-hidden",
    className
  )

  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={image} alt={name ?? "User"} className={base} />
    )
  }

  return <div className={base}>{initials(name)}</div>
}
