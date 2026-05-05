"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutGrid,
  LayoutDashboard,
  File,
  Star,
  Settings,
  User,
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { currentUser } from "@/data/mock-data";
import type { SidebarItemType } from "@/lib/db/items";
import type { SidebarCollection } from "@/lib/db/collections";
import { ICON_MAP } from "@/lib/icon-map";

export type SidebarData = {
  itemTypes: SidebarItemType[]
  favorites: SidebarCollection[]
  recents: SidebarCollection[]
}

export interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  data: SidebarData;
}

export function Sidebar({ collapsed, onToggleCollapse, data }: SidebarProps) {
  const [openSections, setOpenSections] = useState({
    types: true,
    collections: true,
  });

  const toggle = (key: keyof typeof openSections) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const totalItemCount = data.itemTypes.reduce((sum, t) => sum + t.count, 0);

  return (
    <>
      {/* Mobile backdrop when expanded */}
      {!collapsed && (
        <div
          className="fixed inset-0 top-14 z-30 bg-black/50 lg:hidden"
          onClick={onToggleCollapse}
        />
      )}

      <aside
        className={cn(
          "flex flex-col bg-sidebar border-r border-sidebar-border overflow-hidden",
          "transition-all duration-300 ease-in-out",
          "fixed top-14 left-0 z-40 h-[calc(100vh-3.5rem)]",
          "lg:relative lg:top-auto lg:left-auto lg:z-auto lg:h-full lg:shrink-0",
          collapsed ? "w-14" : "w-56",
        )}
      >
        <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">

          {/* ── Navigation + collapse toggle ── */}
          <div className="p-2">
            {collapsed ? (
              <div className="flex justify-center py-1">
                <button
                  onClick={onToggleCollapse}
                  className="rounded-md p-1.5 text-sidebar-foreground/40 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  aria-label="Expand sidebar"
                >
                  <PanelLeft className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between px-2 pb-1 pt-0.5">
                <span className="text-sm text-sidebar-foreground/40">
                  Navigation
                </span>
                <button
                  onClick={onToggleCollapse}
                  className="rounded-md p-0.5 text-sidebar-foreground/40 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  aria-label="Collapse sidebar"
                >
                  <PanelLeftClose className="h-4 w-4" />
                </button>
              </div>
            )}
            <NavItem href="/dashboard" icon={<LayoutDashboard className="h-4 w-4 shrink-0" />} collapsed={collapsed}>
              Dashboard
            </NavItem>
          </div>

          {/* ── Types ── */}
          <div className="px-2 pb-2">
            {collapsed ? (
              <SectionDivider />
            ) : (
              <SectionHeader label="Types" open={openSections.types} onToggle={() => toggle("types")} />
            )}
            {(collapsed || openSections.types) && (
              <>
                <NavItem href="/items" icon={<LayoutGrid className="h-4 w-4 shrink-0" />} collapsed={collapsed} count={totalItemCount}>
                  All Items
                </NavItem>
                {data.itemTypes.map((type) => {
                  const Icon = ICON_MAP[type.icon] ?? File;
                  return (
                    <NavItem
                      key={type.id}
                      href={`/items/${type.name.toLowerCase()}s`}
                      icon={<Icon className="h-4 w-4 shrink-0" style={{ color: type.color }} />}
                      collapsed={collapsed}
                      count={type.count}
                    >
                      {type.name}s
                    </NavItem>
                  );
                })}
              </>
            )}
          </div>

          {/* ── Collections ── */}
          <div className="px-2 pb-2">
            {collapsed ? (
              <SectionDivider />
            ) : (
              <SectionHeader label="Collections" open={openSections.collections} onToggle={() => toggle("collections")} />
            )}
            {(collapsed || openSections.collections) && (
              <>
                {data.favorites.map((col) => (
                  <NavItem
                    key={col.id}
                    href={`/collections/${col.id}`}
                    icon={<Star className="h-4 w-4 shrink-0 fill-yellow-400 text-yellow-400" />}
                    collapsed={collapsed}
                    count={col.itemCount}
                  >
                    {col.name}
                  </NavItem>
                ))}
                {data.recents.map((col) => (
                  <NavItem
                    key={col.id}
                    href={`/collections/${col.id}`}
                    icon={
                      <div
                        className="h-4 w-4 shrink-0 rounded"
                        style={{ backgroundColor: col.dominantColor }}
                      />
                    }
                    collapsed={collapsed}
                    count={col.itemCount}
                  >
                    {col.name}
                  </NavItem>
                ))}
                {!collapsed && (
                  <Link
                    href="/collections"
                    className="flex items-center gap-2 rounded-md px-3 py-1.5 text-xs text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  >
                    View all collections
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </>
            )}
          </div>

          <div className="flex-1" />

          {/* ── User area ── */}
          <div className="flex items-center gap-2 border-t border-sidebar-border px-2 py-3 lg:px-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sidebar-primary">
              <User className="h-4 w-4 text-sidebar-primary-foreground" />
            </div>
            {!collapsed && (
              <>
                <span className="flex-1 truncate text-sm text-sidebar-foreground">
                  {currentUser.name}
                </span>
                <button
                  className="text-sidebar-foreground/40 hover:text-sidebar-foreground"
                  aria-label="Settings"
                >
                  <Settings className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

function SectionHeader({ label, open, onToggle }: { label: string; open: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="flex h-7 w-full items-center justify-between px-2">
      <span className="text-sm text-sidebar-foreground/40">{label}</span>
      <ChevronDown className={cn("h-3 w-3 text-sidebar-foreground/40 transition-transform duration-200", !open && "-rotate-90")} />
    </button>
  );
}

function SectionDivider() {
  return (
    <div className="flex h-7 items-center px-2">
      <div className="flex-1 border-t border-sidebar-border" />
    </div>
  );
}

function NavItem({
  href, icon, children, collapsed, count,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  collapsed: boolean;
  count?: number;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-md py-1.5 pl-3 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        !collapsed && "pr-2",
      )}
    >
      {icon}
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{children}</span>
          {count !== undefined && (
            <span className="tabular-nums text-xs text-sidebar-foreground/40">{count}</span>
          )}
        </>
      )}
    </Link>
  );
}
