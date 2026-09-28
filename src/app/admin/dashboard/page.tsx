"use client";

import {
  Briefcase,
  Factory,
  DollarSign,
  FileCheck2,
  AlertTriangle,
  UserPlus,
  TrendingUp,
  Clock,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const kpis = [
    {
      label: "Total Jobs Posted",
      value: "1,247",
      change: "+12% from last month",
      trend: "up",
      icon: Briefcase,
    },
    {
      label: "Active Manufacturers",
      value: "89",
      change: "+5 this week",
      trend: "up",
      icon: Factory,
    },
    {
      label: "Total Revenue",
      value: "$54,892",
      change: "+18% from last month",
      trend: "up",
      icon: DollarSign,
    },
    {
      label: "Pending Quotations",
      value: "23",
      change: "-8% from last week",
      trend: "down",
      icon: FileCheck2,
    },
  ];

  const subKpis = [
    {
      label: "Active Disputes",
      value: "7",
      note: "2 resolved today",
      icon: AlertTriangle,
      color: "text-amber-600",
    },
    {
      label: "New Registrations",
      value: "34",
      note: "+6% this week",
      icon: UserPlus,
      color: "text-blue-600",
    },
    {
      label: "Completion Rate",
      value: "94.2%",
      note: "+2.1% this month",
      icon: TrendingUp,
      color: "text-emerald-600",
    },
  ];

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time platform throughput, MSME spindle capacity, and financial metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/quotes"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-2xs transition"
          >
            Review Quotations (23)
          </Link>
        </div>
      </div>

      {/* Primary KPI Cards (4 cols) matching Page 17 mockup */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs space-y-2"
            >
              <div className="flex items-center justify-between text-gray-500 text-xs">
                <span className="font-semibold">{kpi.label}</span>
                <Icon className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {kpi.value}
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <span>{kpi.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary KPI Cards (3 cols) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {subKpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-gray-500 block">{kpi.label}</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{kpi.value}</div>
                <span className="text-[11px] text-gray-400 block mt-0.5">{kpi.note}</span>
              </div>
              <div className={`p-3 rounded-xl bg-gray-50 ${kpi.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Bottom Grid: Platform Activity & Urgent Actions matching mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Platform Activity */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Platform Activity
            </h3>
            <span className="text-xs text-gray-400">Current Week</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-600">Jobs posted this week:</span>
              <span className="font-bold text-slate-900">127</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-600">Quotes submitted:</span>
              <span className="font-bold text-slate-900">298</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-600">Jobs completed:</span>
              <span className="font-bold text-emerald-600">84</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Revenue generated:</span>
              <span className="font-extrabold text-blue-600 text-sm">$12,847</span>
            </div>
          </div>
        </div>

        {/* Right: Urgent Actions Required matching mockup */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Urgent Actions Required
            </h3>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              3 Pending
            </span>
          </div>

          <div className="space-y-3">
            {/* Urgent Item 1 */}
            <div className="p-3.5 rounded-xl bg-red-50/70 border border-red-100 flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-red-950">High-value dispute escalation</span>
                  <Link href="/admin/disputes" className="text-red-700 font-semibold hover:underline">
                    Mediate
                  </Link>
                </div>
                <p className="text-red-800/80 mt-0.5">
                  Job #FAB-2024-1892 • $24,500 held in escrow
                </p>
              </div>
            </div>

            {/* Urgent Item 2 */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-100 flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950">Manufacturer verification pending</span>
                  <Link href="/admin/users" className="text-amber-800 font-semibold hover:underline">
                    Review
                  </Link>
                </div>
                <p className="text-amber-800/80 mt-0.5">
                  3 applications awaiting shop floor audit and GST check
                </p>
              </div>
            </div>

            {/* Urgent Item 3 */}
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-950">System maintenance scheduled</span>
                  <span className="text-blue-700 font-medium">Auto</span>
                </div>
                <p className="text-blue-800/80 mt-0.5">
                  Tomorrow at 2:00 AM IST (Automated GST invoice batching)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
