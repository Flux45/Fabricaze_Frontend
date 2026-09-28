"use client";

import { useState } from "react";
import { AlertTriangle, Download, ShieldCheck, CheckCircle2, Clock, X, MessageSquare } from "lucide-react";
import { INITIAL_DISPUTES } from "@/lib/mockData";
import { IDispute } from "@/types";

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<IDispute[]>(INITIAL_DISPUTES);
  const [selectedDispute, setSelectedDispute] = useState<IDispute | null>(null);

  const resolveDispute = (id: string, action: string) => {
    alert(`Dispute ${id} resolved via: ${action}. Escrow updated.`);
    setDisputes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "Resolved" as const } : d))
    );
    setSelectedDispute(null);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header matching Page 21 mockup */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dispute Resolution</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Independent third-party mediation and escrow fund releases
          </p>
        </div>
        <button
          onClick={() => alert("Exporting dispute resolution ledger...")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Report</span>
        </button>
      </div>

      {/* 4 Stat Badges matching mockup */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs">
          <div className="text-2xl font-extrabold text-red-600">2</div>
          <span className="text-xs font-semibold text-gray-500">Open Disputes</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs">
          <div className="text-2xl font-extrabold text-amber-600">1</div>
          <span className="text-xs font-semibold text-gray-500">In Progress</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs">
          <div className="text-2xl font-extrabold text-emerald-600">12</div>
          <span className="text-xs font-semibold text-gray-500">Resolved This Month</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs">
          <div className="text-2xl font-extrabold text-blue-600">2.3</div>
          <span className="text-xs font-semibold text-gray-500">Avg Resolution Days</span>
        </div>
      </div>

      {/* Active Disputes Table matching mockup */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Active Disputes ({disputes.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/75 text-gray-500 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-3.5">Dispute Details</th>
                <th className="px-6 py-3.5">Job Information</th>
                <th className="px-6 py-3.5">Parties Involved</th>
                <th className="px-6 py-3.5">Issue Type</th>
                <th className="px-6 py-3.5">Priority</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Value</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-slate-700">
              {disputes.map((dispute) => (
                <tr key={dispute.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{dispute.disputeCode}</div>
                    <div className="text-[10px] text-gray-400">Reported: {dispute.reportedDate}</div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{dispute.jobTitle}</div>
                    <div className="text-[11px] text-gray-500">{dispute.orderNumber}</div>
                  </td>

                  <td className="px-6 py-4 space-y-0.5">
                    <div className="text-slate-800 font-medium">{dispute.clientName}</div>
                    <div className="text-[11px] text-gray-500">{dispute.manufacturerPseudo}</div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 font-semibold ${
                        dispute.issueType === "Quality Issue"
                          ? "text-red-600"
                          : dispute.issueType === "Delivery Delay"
                          ? "text-amber-600"
                          : "text-blue-600"
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{dispute.issueType}</span>
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        dispute.priority === "High"
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : dispute.priority === "Medium"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-gray-50 text-gray-600 border border-gray-200"
                      }`}
                    >
                      {dispute.priority}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        dispute.status === "Open"
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : dispute.status === "In Progress"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {dispute.status === "Resolved" && <CheckCircle2 className="w-3 h-3" />}
                      {dispute.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 font-bold text-slate-900">${dispute.valueInr.toLocaleString()}</td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedDispute(dispute)}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition"
                    >
                      Mediate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mediation Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-gray-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Escrow Mediation: {selectedDispute.disputeCode}
                </h3>
              </div>
              <button onClick={() => setSelectedDispute(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Job:</span>
                  <span className="font-semibold text-slate-800">{selectedDispute.jobTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Buyer:</span>
                  <span className="font-semibold text-slate-800">{selectedDispute.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Vendor:</span>
                  <span className="font-semibold text-slate-800">{selectedDispute.manufacturerPseudo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Issue:</span>
                  <span className="font-bold text-red-600">{selectedDispute.issueType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Held Amount:</span>
                  <span className="font-extrabold text-blue-600 text-sm">
                    ${selectedDispute.valueInr.toLocaleString()}
                  </span>
                </div>
              </div>

              <p className="text-slate-600">
                Review CMM inspection report against buyer tolerance spec (±0.05 mm). Choose an authorized escrow resolution action below:
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => resolveDispute(selectedDispute.id, "Full Refund to Buyer")}
                className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition"
              >
                Refund to Buyer
              </button>

              <button
                onClick={() => resolveDispute(selectedDispute.id, "Disbursed to Manufacturer")}
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
              >
                Release to Vendor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
