"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Download,
  AlertTriangle,
  FileCheck,
  Truck,
  Box,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export default function ClientOrdersPage() {
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");

  const milestones = [
    { name: "Drawing Review", status: "completed", date: "Oct 01, 2026" },
    { name: "Material Sourcing", status: "completed", date: "Oct 03, 2026" },
    { name: "CNC Machining", status: "in_progress", date: "In Progress" },
    { name: "QC & CMM Verification", status: "pending", date: "Pending" },
    { name: "Dispatched", status: "pending", date: "Pending" },
    { name: "Final Delivery", status: "pending", date: "Est. Oct 12" },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-4 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Orders & Quality Assurance
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Production Orders & Milestone Tracker
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("active")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "active"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "bg-white text-gray-700 border border-gray-200"
              }`}
            >
              Active Orders (1)
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "completed"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "bg-white text-gray-700 border border-gray-200"
              }`}
            >
              Completed Orders (3)
            </button>
          </div>
        </div>

        {/* Active Order Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-2xs space-y-8">
          {/* Order Header Summary */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-blue-600">Order #ORD-2024-1892</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  IN PRODUCTION
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1">
                Custom Aluminum Brackets - 500 units
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manufacturer: <strong>Metro Fabricators #PUN-9821</strong> • Awarded on Oct 01, 2026
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="bg-slate-50 px-4 py-2 rounded-xl border border-gray-200">
                <span className="text-gray-500 block text-[10px] uppercase font-semibold">Total in Escrow</span>
                <span className="text-sm font-bold text-slate-900">₹18,585 (Inc. GST)</span>
              </div>
              <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 text-emerald-800">
                <span className="block text-[10px] uppercase font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Escrow Status
                </span>
                <span className="text-xs font-bold">100% Funds Protected</span>
              </div>
            </div>
          </div>

          {/* Visual Step Progress Bar */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
              Real-Time Shop Floor Milestones
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {milestones.map((m, idx) => (
                <div
                  key={m.name}
                  className={`p-3 rounded-xl border text-xs space-y-1 ${
                    m.status === "completed"
                      ? "bg-emerald-50/60 border-emerald-200 text-emerald-900"
                      : m.status === "in_progress"
                      ? "bg-blue-50/80 border-blue-300 text-blue-900 ring-2 ring-blue-500/20"
                      : "bg-gray-50 border-gray-200 text-gray-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold">Step 0{idx + 1}</span>
                    {m.status === "completed" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : m.status === "in_progress" ? (
                      <Clock className="w-4 h-4 text-blue-600 animate-spin" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-gray-300"></div>
                    )}
                  </div>
                  <div className="font-semibold text-xs leading-snug">{m.name}</div>
                  <div className="text-[10px] opacity-75">{m.date}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quality Inspection Reports & Download Center */}
          <div className="bg-slate-50 rounded-xl p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-600" />
                Verified Test Certificates & Inspection Reports
              </h4>
              <span className="text-[11px] text-gray-500">ISO/IEC 17025 Calibrated</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white rounded-lg p-3 border border-gray-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-800 block">CMM Coordinate Report</span>
                  <span className="text-[10px] text-emerald-600 font-medium">✓ Tolerances within ±0.03mm</span>
                </div>
                <button
                  onClick={() => alert("Downloading CMM Dimensional Inspection Certificate (PDF)")}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"
                  title="Download Report"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-white rounded-lg p-3 border border-gray-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-800 block">Hardness Test (HT)</span>
                  <span className="text-[10px] text-emerald-600 font-medium">✓ 95 HB (6061-T6 verified)</span>
                </div>
                <button
                  onClick={() => alert("Downloading Heat Treatment & Hardness Report (PDF)")}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"
                  title="Download Report"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-white rounded-lg p-3 border border-gray-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-800 block">Raw Material Mill Test (MT)</span>
                  <span className="text-[10px] text-emerald-600 font-medium">✓ Hindalco batch certified</span>
                </div>
                <button
                  onClick={() => alert("Downloading Raw Material Chemical Analysis Sheet (PDF)")}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"
                  title="Download Report"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Action Row: Dispute & Contact */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Logistics Partner: <strong>Delhivery Industrial Express</strong> • Tracking #DELHIVERY-FAB-99120</span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin/disputes"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Report Discrepancy / Open Dispute</span>
              </Link>

              <button
                onClick={() => alert("Escrow release confirmed! Funds disbursed to manufacturer.")}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition shadow-2xs"
              >
                Accept Delivery & Release Escrow
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
