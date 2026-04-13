"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import type { SidebarData } from "./Sidebar";

export function DashboardShell({
  children,
  sidebarData,
}: {
  children: React.ReactNode;
  sidebarData: SidebarData;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        {/* Reserve space on mobile for the fixed icon-strip sidebar */}
        <div className="w-14 shrink-0 lg:hidden" />
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((v) => !v)}
          data={sidebarData}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
