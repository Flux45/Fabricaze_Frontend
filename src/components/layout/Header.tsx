"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Factory,
  UploadCloud,
  FileText,
  Users,
  ShieldCheck,
  Search,
  Bell,
  Settings,
  ChevronDown,
  Layers,
  Wrench,
} from "lucide-react";

import { useFabricazeStore } from "@/lib/fabricazeStore";
import { RotateCcw } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const { resetAllToZero } = useFabricazeStore();
  const [activeRole, setActiveRole] = useState<"client" | "manufacturer" | "admin">(
    pathname.startsWith("/admin")
      ? "admin"
      : pathname.startsWith("/manufacturer")
      ? "manufacturer"
      : "client"
  );

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-xs">
      {/* Demo Switcher & Hub Bar */}
      <div className="bg-slate-900 text-white text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium text-slate-300">
            Fabricaze Platform • MSME Manufacturing Network (Indore • Pune • Ahmedabad)
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={resetAllToZero}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-red-950/60 hover:bg-red-900 text-red-200 border border-red-800/80 transition"
            title="Reset platform data to clean slate"
          >
            <RotateCcw className="w-3 h-3 text-red-400" />
            <span>Reset to Zero</span>
          </button>

          <span className="text-slate-400 hidden sm:inline">Active Perspective:</span>
          <div className="inline-flex rounded-md bg-slate-800 p-0.5 border border-slate-700">
            <Link
              href="/client/submit-job"
              onClick={() => setActiveRole("client")}
              className={`px-2.5 py-0.5 rounded text-xs transition-colors ${
                activeRole === "client" && !pathname.startsWith("/admin") && !pathname.startsWith("/manufacturer")
                  ? "bg-blue-600 text-white font-medium"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Buyer / Client
            </Link>
            <Link
              href="/manufacturer/dashboard"
              onClick={() => setActiveRole("manufacturer")}
              className={`px-2.5 py-0.5 rounded text-xs transition-colors ${
                pathname.startsWith("/manufacturer")
                  ? "bg-amber-600 text-white font-medium"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Manufacturer Hub
            </Link>
            <Link
              href="/admin/dashboard"
              onClick={() => setActiveRole("admin")}
              className={`px-2.5 py-0.5 rounded text-xs transition-colors ${
                pathname.startsWith("/admin")
                  ? "bg-indigo-600 text-white font-medium"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Super Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Factory className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-gray-950 font-serif">
                  Fabricaze
                </span>
                <span className="block text-[10px] font-medium uppercase tracking-wider text-blue-600">
                  Digital Manufacturing
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/client/submit-job"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === "/client/submit-job"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <UploadCloud className="w-4 h-4 text-blue-600" />
                Submit Job
              </Link>

              <Link
                href="/client/bids"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === "/client/bids"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <FileText className="w-4 h-4 text-blue-600" />
                View Bids
              </Link>

              <Link
                href="/client/manufacturers"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === "/client/manufacturers"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Users className="w-4 h-4 text-blue-600" />
                Find Manufacturers
              </Link>

              <Link
                href="/client/orders"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === "/client/orders"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Orders & QC
              </Link>
            </nav>
          </div>

          {/* Right Side: Global Search & Admin Quick Controls */}
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block w-56">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search manufacturers..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            <button
              title="Notifications"
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-red-500 absolute top-1.5 right-1.5"></span>
            </button>

            <Link
              href="/admin/dashboard"
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Admin Settings"
            >
              <Settings className="w-4 h-4" />
            </Link>

            <div className="h-6 w-px bg-gray-200 mx-1"></div>

            {/* Profile Pill */}
            <div className="flex items-center gap-2 pl-1">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs flex items-center justify-center border border-blue-200">
                AJ
              </div>
              <div className="hidden lg:block text-left leading-tight">
                <span className="text-xs font-semibold text-gray-800 block">Ayush Jain</span>
                <span className="text-[10px] text-gray-500 block">Co-Founder</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
