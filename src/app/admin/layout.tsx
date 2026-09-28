"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileCheck,
  AlertTriangle,
  BarChart3,
  Settings,
  Shield,
  Factory,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "User Management", href: "/admin/users", icon: Users },
    { name: "Job Management", href: "/admin/jobs", icon: Briefcase },
    { name: "Quotations", href: "/admin/quotes", icon: FileCheck },
    { name: "Disputes", href: "/admin/disputes", icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Admin Dark Sidebar matching mockup (Pages 17–21) */}
      <aside className="w-64 bg-[#0F172A] text-slate-300 hidden md:flex flex-col border-r border-slate-800 shrink-0">
        {/* Brand */}
        <div className="p-6 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <Factory className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight">Fabricaze</span>
              <span className="block text-[10px] text-blue-400 font-semibold uppercase tracking-wider">
                Admin Dashboard
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="p-4 flex-1 space-y-6">
          <div>
            <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Main
            </span>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div>
            <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              System
            </span>
            <div className="space-y-1">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
              >
                <Settings className="w-4 h-4" />
                <span>Platform Settings</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Admin User Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
            A
          </div>
          <div className="text-left text-xs leading-tight">
            <span className="font-semibold text-white block">Admin User</span>
            <span className="text-[10px] text-slate-400 block">admin@fabricaze.com</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
