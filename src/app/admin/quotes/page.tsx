"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, Download, Eye, CheckCircle2, X, FileCheck2, ArrowRight } from "lucide-react";
import { useFabricazeStore } from "@/lib/fabricazeStore";
import { IQuotation } from "@/types";

export default function AdminQuotesPage() {
  const { quotations, rfqs } = useFabricazeStore();
  const [selectedQuote, setSelectedQuote] = useState<IQuotation | null>(null);

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Super Admin Quotation Audit</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit submitted MSME bids, flag suspicious budget anomalies (+25%), and inspect machine rate calculations
          </p>
        </div>
        <button
          onClick={() => alert("Exporting quotations ledger...")}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Ledger</span>
        </button>
      </div>

      {/* Quotations Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        {quotations.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
              <FileCheck2 className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-base font-bold text-slate-900">0 Quotations to Audit (Clean Slate Mode)</h3>
              <p className="text-xs text-slate-500">
                No bids have been submitted by manufacturers yet. Once a quotation is placed in the Manufacturer Hub, it will appear here for anomaly inspection.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/manufacturer/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-2xs transition"
              >
                <span>Go to Manufacturer Hub & Place Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-gray-200 text-gray-500 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Quote Code</th>
                  <th className="px-6 py-3.5">Related Job / RFQ</th>
                  <th className="px-6 py-3.5">Manufacturer</th>
                  <th className="px-6 py-3.5">Total Quoted</th>
                  <th className="px-6 py-3.5">Lead Time</th>
                  <th className="px-6 py-3.5">Anomaly Check</th>
                  <th className="px-6 py-3.5 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {quotations.map((quote) => {
                  const parentRfq = rfqs.find((r) => r.id === quote.enquiryId);
                  const isAnomaly = parentRfq && parentRfq.estimatedBudgetMax ? quote.totalCostInr > parentRfq.estimatedBudgetMax * 1.25 : false;

                  return (
                    <tr key={quote.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4 font-mono font-bold text-blue-600">{quote.quoteCode}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{parentRfq?.title || "Custom Part"}</div>
                        <span className="font-mono text-[10px] text-gray-400">{parentRfq?.enquiryCode}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-800">{quote.manufacturer.pseudoName}</span>
                        <span className="text-[10px] text-gray-400 block">{quote.manufacturer.city}</span>
                      </td>
                      <td className="px-6 py-4 font-extrabold text-slate-900">
                        ₹{(quote.totalCostInr + (quote.taxGstInr || Math.round(quote.totalCostInr * 0.18))).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-slate-600">{quote.deliveryDate}</td>
                      <td className="px-6 py-4">
                        {isAnomaly ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <AlertTriangle className="w-3 h-3" /> &gt;25% Over Budget
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Normal Range
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedQuote(quote)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quote Detail Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-gray-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Quote Audit Detail: {selectedQuote.quoteCode}</h3>
                <span className="text-[10px] text-gray-500">{selectedQuote.manufacturer.pseudoName}</span>
              </div>
              <button onClick={() => setSelectedQuote(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Machining Cost:</span>
                  <span className="font-bold text-slate-800">₹{(selectedQuote.machiningCostInr || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Raw Material:</span>
                  <span className="font-bold text-slate-800">₹{(selectedQuote.materialCostInr || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Tooling & Setup:</span>
                  <span className="font-bold text-slate-800">₹{(selectedQuote.toolingCostInr || 0).toLocaleString()}</span>
                </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">GST (18%):</span>
                <span className="font-bold text-slate-800">
                  ₹{(selectedQuote.taxGstInr || Math.round(selectedQuote.totalCostInr * 0.18)).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-2 border-t border-gray-200 font-extrabold text-sm text-slate-900">
                <span>Total Escrow Value:</span>
                <span className="text-blue-600">
                  ₹{(selectedQuote.totalCostInr + (selectedQuote.taxGstInr || Math.round(selectedQuote.totalCostInr * 0.18))).toLocaleString()}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-gray-100 text-[11px] text-slate-600">
                <strong>Manufacturer Notes:</strong> {selectedQuote.notes}
              </div>
            </div>

            <button
              onClick={() => setSelectedQuote(null)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
