"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, Download, ShieldCheck, CheckCircle2, Clock, X, MessageSquare, ArrowRight } from "lucide-react";
import { useFabricazeStore } from "@/lib/fabricazeStore";
import { IDispute } from "@/types";

export default function AdminDisputesPage() {
  const { disputes, resolveDispute } = useFabricazeStore();
  const [selectedDispute, setSelectedDispute] = useState<IDispute | null>(null);

  const openDisputes = disputes.filter((d) => d.status === "Open");
  const inProgressDisputes = disputes.filter((d) => d.status === "In Progress");
  const resolvedDisputes = disputes.filter((d) => d.status === "Resolved");

  const handleResolve = (id: string, action: string) => {
    resolveDispute(id, action);
    alert(`Dispute ${id} resolved via: ${action}. Platform escrow adjusted.`);
    setSelectedDispute(null);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Super Admin Dispute Resolution</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Independent third-party mediation, dimensional tolerance verification, and escrow payouts
          </p>
        </div>
        <button
          onClick={() => alert("Exporting dispute resolution ledger...")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Ledger</span>
        </button>
      </div>

      {/* 4 Stat Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs">
          <div className="text-2xl font-extrabold text-red-600">{openDisputes.length}</div>
          <span className="text-xs font-semibold text-gray-500">Open Disputes</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs">
          <div className="text-2xl font-extrabold text-amber-600">{inProgressDisputes.length}</div>
          <span className="text-xs font-semibold text-gray-500">In Progress</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs">
          <div className="text-2xl font-extrabold text-emerald-600">{resolvedDisputes.length}</div>
          <span className="text-xs font-semibold text-gray-500">Resolved Cases</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs">
          <div className="text-2xl font-extrabold text-blue-600">{disputes.length}</div>
          <span className="text-xs font-semibold text-gray-500">Total Cases</span>
        </div>
      </div>

      {/* Active Disputes Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        {disputes.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-base font-bold text-slate-900">0 Active Disputes (Clean Slate Mode)</h3>
              <p className="text-xs text-slate-500">
                All disputes have been cleared. During client order testing, you can open a test dispute directly from the Order Milestone Tracker.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/client/orders"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-2xs transition"
              >
                <span>View Orders Flow</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-gray-200 text-gray-500 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Dispute Code</th>
                  <th className="px-6 py-3.5">Order / Job</th>
                  <th className="px-6 py-3.5">Parties Involved</th>
                  <th className="px-6 py-3.5">Issue Category</th>
                  <th className="px-6 py-3.5">Amount in Escrow</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {disputes.map((dispute) => (
                  <tr key={dispute.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4 font-mono font-bold text-red-600">{dispute.disputeCode}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{dispute.jobTitle}</div>
                      <span className="font-mono text-[10px] text-gray-400">{dispute.orderNumber}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      <div>Client: {dispute.clientName}</div>
                      <span className="text-[10px] text-gray-400">Mfg: {dispute.manufacturerPseudo}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                        {dispute.issueType}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-extrabold text-slate-900">₹{dispute.valueInr.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          dispute.status === "Open"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : dispute.status === "In Progress"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {dispute.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedDispute(dispute)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                      >
                        Arbitrate →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mediation Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-gray-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Escrow Arbitration: {selectedDispute.disputeCode}</h3>
                <span className="text-[10px] text-gray-500">Order #{selectedDispute.orderNumber}</span>
              </div>
              <button onClick={() => setSelectedDispute(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-gray-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Issue:</span>
                <span className="font-bold text-red-600">{selectedDispute.issueType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Escrow Value:</span>
                <span className="font-bold text-slate-900">₹{selectedDispute.valueInr.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Manufacturer:</span>
                <span className="font-semibold text-slate-700">{selectedDispute.manufacturerPseudo}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                Select Super Admin Arbitration Ruling
              </span>
              <button
                onClick={() => handleResolve(selectedDispute.id, "Full Refund to Client")}
                className="w-full py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-2xs transition text-left flex justify-between items-center"
              >
                <span>Full Refund to Buyer</span>
                <span className="text-[10px] opacity-80">100% Escrow Returned</span>
              </button>
              <button
                onClick={() => handleResolve(selectedDispute.id, "Free Rework / Remake Ordered")}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-2xs transition text-left flex justify-between items-center"
              >
                <span>Order Free Remake / Rework</span>
                <span className="text-[10px] opacity-80">Hold Escrow Till QC</span>
              </button>
              <button
                onClick={() => handleResolve(selectedDispute.id, "Escrow Released to Manufacturer")}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs transition text-left flex justify-between items-center"
              >
                <span>Approve Part & Disburse Escrow</span>
                <span className="text-[10px] opacity-80">Tolerance Passes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
