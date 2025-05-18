"use client";
import { useUserStore } from "@/states/user.state";

import type React from "react"; // Added import for React
import { useEffect, useState } from "react";
import { SidebarNav } from "../(Dashboard)/(DashboardComponents)/sidebar-nav";
import { UserNav } from "../(Dashboard)/(DashboardComponents)/user-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const loadUser = useUserStore((state) => state.loadUser);

  const { user } = useUserStore();

  useEffect(() => {
    loadUser(); // Load user data from localStorage on app mount
  }, [loadUser]);

  return (
    <div className="min-h-screen bg-background dark text-gray-200 ">
      <div className="md:max-w-6xl mx-auto flex">
        <SidebarNav />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b">
            <div className=" text-2xl font-semibold">Welcome {user?.name}</div>
            <UserNav />
          </header>
          <main className="flex-1 overflow-auto p-4">{children}</main>
        </div>
      </div>
    </div>
  );
}
