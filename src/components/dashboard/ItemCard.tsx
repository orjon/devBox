import Link from "next/link";
import { Pin, Code, Sparkles, Terminal, StickyNote, File, Image, Link as LinkIcon, type LucideIcon } from "lucide-react";

// Maps the icon string stored in ItemType.icon to a Lucide component
const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link: LinkIcon,
}

interface ItemType {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface Item {
  id: string;
  title: string;
  contentType: string;
  content: string;
  description: string;
  language: string | null;
  itemTypeId: string;
  tags: string[];
  isFavorite: boolean;
  isPinned: boolean;
  lastUsedAt: Date;
}

interface ItemCardProps {
  item: Item;
  itemType: ItemType | undefined;
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function ItemCard({ item, itemType }: ItemCardProps) {
  const previewLines = item.content.split("\n").slice(0, 5).join("\n");
  const Icon = itemType ? (ICON_MAP[itemType.icon] ?? File) : null;

  return (
    <Link
      href={`/items/${item.id}`}
      className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 hover:border-border/80 hover:bg-card/80 transition-colors"
    >
      {/* Title + type icon + pin */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {Icon && itemType && (
            <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: itemType.color }} />
          )}
          <span className="font-medium text-sm text-foreground leading-tight truncate">{item.title}</span>
        </div>
        {item.isPinned && <Pin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>

      {/* Content preview */}
      <div className="rounded bg-muted px-3 py-2 font-mono text-xs text-muted-foreground overflow-hidden">
        <pre className="line-clamp-4 whitespace-pre-wrap break-all">{previewLines}</pre>
      </div>

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
        <span className="text-xs text-muted-foreground shrink-0">{timeAgo(item.lastUsedAt)}</span>
      </div>
    </Link>
  );
}
