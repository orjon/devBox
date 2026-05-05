import Link from "next/link";
import { Pin, File } from "lucide-react";
import type { ItemCardData } from "@/lib/db/items";
import { ICON_MAP } from "@/lib/icon-map";
import { timeAgo } from "@/lib/utils";

export function ItemCard({ item }: { item: ItemCardData }) {
  const { itemType } = item;
  const Icon = ICON_MAP[itemType.icon] ?? File;
  const previewLines = item.content?.split("\n").slice(0, 5).join("\n") ?? "";

  return (
    <Link
      href={`/items/${item.id}`}
      className="flex overflow-hidden rounded-lg border bg-card hover:bg-card/80 transition-colors"
    >
      <div className="w-2 shrink-0" style={{ backgroundColor: itemType.color }} />

      <div className="flex flex-col gap-2 p-4 flex-1 min-w-0">
        {/* Title + type icon + pin */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: itemType.color }} />
            <span className="font-medium text-sm text-foreground leading-tight truncate">{item.title}</span>
          </div>
          <Pin
            className={`h-3.5 w-3.5 shrink-0 ${!item.isPinned ? "text-muted-foreground" : ""}`}
            style={item.isPinned ? { color: "white", fill: "white" } : undefined}
          />
        </div>

        {/* Description */}
        {item.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
        )}

        {/* URL (link items) or content preview */}
        {item.url ? (
          <p className="text-xs text-blue-400 truncate">{item.url}</p>
        ) : previewLines ? (
          <div className="rounded bg-muted px-3 py-2 font-mono text-xs text-muted-foreground overflow-hidden">
            <pre className="line-clamp-4 whitespace-pre-wrap break-all">{previewLines}</pre>
          </div>
        ) : null}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="text-xs text-muted-foreground shrink-0">{timeAgo(item.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}
