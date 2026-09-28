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
  RotateCcw,
  Database,
  Building2,
  Check,
} from "lucide-react";
import { useFabricazeStore } from "@/lib/fabricazeStore";

export function Header() {
  const pathname = usePathname();
  const {
    activeRole,
    setActiveRole,
    activeClientId,
    setActiveClientId,
    activeManufacturerId,
    setActiveManufacturerId,
    clients,
    manufacturers,
    activeClient,
    activeManufacturer,
    resetAllToZero,
  } = useFabricazeStore();

  const isClientRoute = pathname.startsWith("/client") || pathname === "/";
  const isMfgRoute = pathname.startsWith("/manufacturer");
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-xs">
      {/* Top Multi-Tenant Context & Role Switcher Bar */}
      <div className="bg-slate-900 text-white text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Role Switcher & Context */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-[11px] uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Multi-Tenant Phase:</span>
          </div>

          <div className="inline-flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
            <Link
              href="/client/submit-job"
              onClick={() => setActiveRole("CLIENT")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                isClientRoute
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Client Phase
            </Link>

            <Link
              href="/manufacturer/dashboard"
              onClick={() => setActiveRole("MANUFACTURER")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                isMfgRoute
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Manufacturer Hub
            </Link>

            <Link
              href="/admin/dashboard"
              onClick={() => setActiveRole("ADMIN")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                isAdminRoute
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Super Admin
            </Link>
          </div>
        </div>

        {/* Right: Active Profile Picker (Client vs Manufacturer vs Admin Database) */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Client Selector (when in Client view) */}
          {isClientRoute && (
            <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 rounded-lg px-2.5 py-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Active Buyer:</span>
              <select
                value={activeClientId}
                onChange={(e) => setActiveClientId(e.target.value)}
                className="bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-800 text-white">
                    {c.fullName} ({c.companyName})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Manufacturer Selector (when in Manufacturer view) */}
          {isMfgRoute && (
            <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 rounded-lg px-2.5 py-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Active Shop:</span>
              <select
                value={activeManufacturerId}
                onChange={(e) => setActiveManufacturerId(e.target.value)}
                className="bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer"
              >
                {manufacturers.map((m) => (
                  <option key={m.id} value={m.id} className="bg-slate-800 text-white">
                    {m.pseudoName} ({m.city})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Database Visualizer Quick Link (Super Admin) */}
          <Link
            href="/admin/database"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition ${
              pathname === "/admin/database"
                ? "bg-emerald-600 text-white"
                : "bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Database Visualizer</span>
          </Link>

          {/* Reset to Zero */}
          <button
            type="button"
            onClick={() => {
              if (confirm("Reset the entire platform state to zero?")) {
                resetAllToZero();
              }
            }}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-red-950/60 hover:bg-red-900 text-red-200 border border-red-800/80 transition"
            title="Reset platform data to clean slate"
          >
            <RotateCcw className="w-3 h-3 text-red-400" />
            <span>Reset to Zero</span>
          </button>
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

            {/* Navigation Links based on active role */}
            <nav className="hidden md:flex items-center gap-1">
              {isMfgRoute ? (
                <>
                  <Link
                    href="/manufacturer/dashboard"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === "/manufacturer/dashboard"
                        ? "bg-amber-50 text-amber-800 font-bold"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Briefcase className="w-4 h-4 text-amber-600" />
                    Marketplace RFQs
                  </Link>

                  <Link
                    href="/manufacturer/machines"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === "/manufacturer/machines"
                        ? "bg-amber-50 text-amber-800 font-bold"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Wrench className="w-4 h-4 text-amber-600" />
                    Shop Machine Fleet
                  </Link>
                </>
              ) : isAdminRoute ? (
                <>
                  <Link
                    href="/admin/dashboard"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === "/admin/dashboard"
                        ? "bg-indigo-50 text-indigo-700 font-bold"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Layers className="w-4 h-4 text-indigo-600" />
                    Executive Dashboard
                  </Link>

                  <Link
                    href="/admin/database"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === "/admin/database"
                        ? "bg-emerald-50 text-emerald-700 font-bold"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Database className="w-4 h-4 text-emerald-600" />
                    Database Visualizer
                  </Link>

                  <Link
                    href="/admin/jobs"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === "/admin/jobs"
                        ? "bg-indigo-50 text-indigo-700 font-bold"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Briefcase className="w-4 h-4 text-indigo-600" />
                    Job Management
                  </Link>

                  <Link
                    href="/admin/quotes"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === "/admin/quotes"
                        ? "bg-indigo-50 text-indigo-700 font-bold"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <FileText className="w-4 h-4 text-indigo-600" />
                    Quote Audits
                  </Link>

                  <Link
                    href="/admin/disputes"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === "/admin/disputes"
                        ? "bg-indigo-50 text-indigo-700 font-bold"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    Disputes
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/client/submit-job"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === "/client/submit-job"
                        ? "bg-blue-50 text-blue-700 font-bold"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <UploadCloud className="w-4 h-4 text-blue-600" />
                    Submit Job (RFQ)
                  </Link>

                  <Link
                    href="/client/bids"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === "/client/bids"
                        ? "bg-blue-50 text-blue-700 font-bold"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <FileText className="w-4 h-4 text-blue-600" />
                    View Bids
                  </Link>

                  <Link
                    href="/client/orders"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === "/client/orders"
                        ? "bg-blue-50 text-blue-700 font-bold"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    Orders & Escrow
                  </Link>

                  <Link
                    href="/client/manufacturers"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === "/client/manufacturers"
                        ? "bg-blue-50 text-blue-700 font-bold"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Users className="w-4 h-4 text-blue-600" />
                    Directory
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Right Side: Persona Indicator & Admin Settings */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin/database"
              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Database Visualizer"
            >
              <Database className="w-4 h-4" />
            </Link>

            <Link
              href="/admin/dashboard"
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Super Admin Controls"
            >
              <Settings className="w-4 h-4" />
            </Link>

            <div className="h-6 w-px bg-gray-200 mx-1" />

            {/* Profile Avatar & Label */}
            <div className="flex items-center gap-2 pl-1">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200">
                {isMfgRoute ? "MF" : isAdminRoute ? "SA" : "AJ"}
              </div>
              <div className="hidden lg:block text-left leading-tight">
                <span className="text-xs font-bold text-gray-800 block">
                  {isMfgRoute
                    ? activeManufacturer.pseudoName
                    : isAdminRoute
                    ? "Super Admin (Ayush)"
                    : activeClient.fullName}
                </span>
                <span className="text-[10px] text-gray-500 block">
                  {isMfgRoute
                    ? activeManufacturer.city
                    : isAdminRoute
                    ? "Platform God-Mode"
                    : activeClient.companyName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function Briefcase(props: any) {
  return <BriefcaseIcon {...props} />;
}

import { Briefcase as BriefcaseIcon } from "lucide-react";
