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
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useFabricazeStore } from "@/lib/fabricazeStore";

export default function AdminDashboardPage() {
  const { rfqs, quotations, orders, disputes, manufacturers, resetAllToZero } = useFabricazeStore();

  const totalEscrowVolumeInr = orders.reduce((sum, o) => sum + o.totalAmountInr, 0);
  const openDisputesCount = disputes.filter((d) => d.status === "Open").length;

  const kpis = [
    {
      label: "Total Jobs Posted",
      value: rfqs.length.toString(),
      subtext: rfqs.length === 0 ? "Clean slate (0 jobs)" : `${rfqs.length} active RFQs`,
      icon: Briefcase,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Vetted MSME Partners",
      value: manufacturers.length.toString(),
      subtext: manufacturers.length === 0 ? "Clean slate (0 MSMEs)" : `${manufacturers.length} verified facilities`,
      icon: Factory,
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      label: "Total Escrow Volume",
      value: `₹${totalEscrowVolumeInr.toLocaleString()}`,
      subtext: orders.length === 0 ? "₹0 locked in escrow" : `${orders.length} funded orders`,
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Quotations Received",
      value: quotations.length.toString(),
      subtext: quotations.length === 0 ? "0 submitted bids" : `${quotations.length} total bids`,
      icon: FileCheck2,
      color: "text-amber-600 bg-amber-50",
    },
  ];

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Super Admin Executive Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time platform throughput, MSME spindle capacity, and financial escrow telemetry
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (confirm("Reset the entire platform to ZERO state? All RFQs, quotes, orders, and disputes will be cleared.")) {
                resetAllToZero();
              }
            }}
            className="px-3 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset to Zero</span>
          </button>
          <Link
            href="/admin/jobs"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-2xs transition"
          >
            Manage Jobs ({rfqs.length})
          </Link>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{kpi.label}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{kpi.value}</div>
                <span className="text-[11px] text-gray-500 mt-0.5 block">{kpi.subtext}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sub KPIs Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 block">Active Quality Disputes</span>
            <span className="text-lg font-bold text-red-600 mt-0.5 block">{openDisputesCount}</span>
            <span className="text-[10px] text-gray-400">Escrow payouts frozen</span>
          </div>
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 block">Active Production Batches</span>
            <span className="text-lg font-bold text-blue-600 mt-0.5 block">
              {orders.filter((o) => o.currentMilestone !== "DELIVERED").length}
            </span>
            <span className="text-[10px] text-gray-400">On shop floors</span>
          </div>
          <Clock className="w-6 h-6 text-blue-500" />
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 block">Delivered & Verified Orders</span>
            <span className="text-lg font-bold text-emerald-600 mt-0.5 block">
              {orders.filter((o) => o.currentMilestone === "DELIVERED").length}
            </span>
            <span className="text-[10px] text-gray-400">Escrow released</span>
          </div>
          <CheckCircle className="w-6 h-6 text-emerald-500" />
        </div>
      </div>

      {/* Real-Time Platform Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Recent RFQs */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              Recent RFQs
            </h3>
            <Link href="/admin/jobs" className="text-xs text-blue-600 hover:text-blue-800 font-semibold">
              View All ({rfqs.length})
            </Link>
          </div>

          {rfqs.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400">
              0 RFQs currently posted. The platform is in clean reset state.
            </div>
          ) : (
            <div className="space-y-3">
              {rfqs.slice(0, 4).map((rfq) => (
                <div
                  key={rfq.id}
                  className="p-3 bg-slate-50 rounded-xl border border-gray-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono text-[10px] text-blue-600 font-bold block">{rfq.enquiryCode}</span>
                    <span className="font-semibold text-slate-900">{rfq.title}</span>
                    <span className="text-[10px] text-gray-500 block">
                      {rfq.quantity} pcs • {rfq.rawMaterialType}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                    {rfq.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Active Production Orders */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Active Orders & Escrow
            </h3>
            <Link href="/client/orders" className="text-xs text-blue-600 hover:text-blue-800 font-semibold">
              Client View ({orders.length})
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400">
              0 orders currently in production. No escrow deposits locked.
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 4).map((order) => (
                <div
                  key={order.id}
                  className="p-3 bg-slate-50 rounded-xl border border-gray-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono text-[10px] text-blue-600 font-bold block">{order.orderNumber}</span>
                    <span className="font-semibold text-slate-900">{order.enquiryTitle}</span>
                    <span className="text-[10px] text-gray-500 block">
                      ₹{order.totalAmountInr.toLocaleString()} • {order.manufacturerPseudo}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                    {order.currentMilestone}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
