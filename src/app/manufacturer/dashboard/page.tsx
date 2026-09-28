"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Factory,
  Wrench,
  Clock,
  DollarSign,
  FileText,
  CheckCircle,
  Plus,
  Send,
  X,
  Layers,
  ArrowRight,
  Inbox,
  Sparkles,
} from "lucide-react";
import { useFabricazeStore } from "@/lib/fabricazeStore";
import { IEnquiry } from "@/types";

export default function ManufacturerDashboard() {
  const {
    rfqs,
    mfgSubmittedQuotes,
    mfgAssignedOrders,
    submitQuotation,
    activeManufacturer,
  } = useFabricazeStore();

  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedRfq, setSelectedRfq] = useState<IEnquiry | null>(null);

  const [quoteForm, setQuoteForm] = useState({
    totalCost: 3200,
    leadTimeDays: 7,
    notes: `Can machine on our CNC centers holding ±0.05 mm tolerance. CMM and material inspection report included.`,
  });

  const [lastSubmittedQuoteCode, setLastSubmittedQuoteCode] = useState<string | null>(null);

  const handleOpenQuote = (rfq: IEnquiry) => {
    setSelectedRfq(rfq);
    setQuoteForm({
      totalCost: rfq.estimatedBudgetMin ? Math.round((rfq.estimatedBudgetMin + (rfq.estimatedBudgetMax || 8000)) / 2) : 3200,
      leadTimeDays: 7,
      notes: `Can machine ${rfq.title} holding ${rfq.toleranceMm} on our CNC centers. Material test report included.`,
    });
    setIsQuoteModalOpen(true);
  };

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRfq) return;

    const quote = submitQuotation({
      enquiryId: selectedRfq.id,
      totalCostInr: quoteForm.totalCost,
      leadTimeDays: quoteForm.leadTimeDays,
      notes: quoteForm.notes,
    });

    setLastSubmittedQuoteCode(quote.quoteCode);
    setIsQuoteModalOpen(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Manufacturer Hub • Step 2
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verified MSME Shop
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Precision MSME #IND-4102 • Spindle Dashboard
            </h1>
            <p className="text-xs text-slate-500">
              Indore Hub (Pologround) • Ready to bid on client CAD RFQs
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/manufacturer/machines"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-300 text-slate-700 font-semibold text-xs hover:bg-gray-50 transition shadow-2xs"
            >
              <Wrench className="w-3.5 h-3.5 text-blue-600" />
              <span>Machine Catalog & Fleet</span>
            </Link>
          </div>
        </div>

        {/* Success Guidance Banner */}
        {lastSubmittedQuoteCode && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Quotation #{lastSubmittedQuoteCode} Submitted Successfully!
                </h3>
              </div>
              <button
                onClick={() => setLastSubmittedQuoteCode(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Your competitive quote has been submitted. Now switch back to <strong>Buyer View Bids</strong> to see the quote and award the project into Escrow!
            </p>
            <div className="pt-1">
              <Link
                href="/client/bids"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
              >
                <span>Switch to Buyer: View Bids & Award Project</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* 4 Shop Metrics (Live derived) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs">
            <span className="text-xs text-gray-500 font-semibold block">Available Open RFQs</span>
            <div className="text-2xl font-extrabold text-blue-600 mt-1">{rfqs.length}</div>
            <span className="text-[11px] text-gray-400 block mt-0.5">Matching shop machines</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs">
            <span className="text-xs text-gray-500 font-semibold block">My Submitted Bids</span>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">{mfgSubmittedQuotes.length}</div>
            <span className="text-[11px] text-gray-400 block mt-0.5">By this MSME facility</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs">
            <span className="text-xs text-gray-500 font-semibold block">My Awarded Orders</span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">{mfgAssignedOrders.length}</div>
            <span className="text-[11px] text-gray-400 block mt-0.5">Under shop production</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs">
            <span className="text-xs text-gray-500 font-semibold block">Escrow Secured Value</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              ₹{mfgAssignedOrders.reduce((sum, o) => sum + o.totalAmountInr, 0).toLocaleString()}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">Disbursed on delivery</span>
          </div>
        </div>

        {/* Matching RFQ Opportunities Feed */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Incoming Client RFQs Matching Shop Capabilities
              </h2>
              <p className="text-xs text-gray-500">
                Live opportunities posted by clients requiring precision CNC milling, turning, or fabrication
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
              {rfqs.length} Available
            </span>
          </div>

          {rfqs.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 mx-auto flex items-center justify-center">
                <Inbox className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">No Open RFQs Right Now</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                The platform is in a fresh zero state. Start the testing flow by acting as a client and submitting a custom CAD drawing!
              </p>
              <div className="pt-2">
                <Link
                  href="/client/submit-job"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-2xs transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Post First Inquiry as Client</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {rfqs.map((rfq) => {
                const hasQuoted = mfgSubmittedQuotes.some((q) => q.enquiryId === rfq.id);
                return (
                  <div
                    key={rfq.id}
                    className="p-5 rounded-2xl border border-gray-200 hover:border-blue-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{rfq.title}</span>
                        <span className="text-xs text-blue-600 font-semibold">{rfq.enquiryCode}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                          {rfq.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                        <span>Material: <strong>{rfq.rawMaterialType}</strong></span>
                        <span>•</span>
                        <span>Quantity: <strong>{rfq.quantity} pcs</strong></span>
                        <span>•</span>
                        <span>Tolerance: <strong>{rfq.toleranceMm}</strong></span>
                        <span>•</span>
                        <span>Target: <strong>{rfq.requiredDeliveryDate}</strong></span>
                      </div>

                      <div className="text-xs text-slate-500">
                        Estimated Budget Range: <strong className="text-slate-800">₹{rfq.estimatedBudgetMin?.toLocaleString()} – ₹{rfq.estimatedBudgetMax?.toLocaleString()}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {hasQuoted ? (
                        <span className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200">
                          ✓ Quote Submitted
                        </span>
                      ) : (
                        <button
                          onClick={() => handleOpenQuote(rfq)}
                          className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
                        >
                          Submit Quotation
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Submit Quotation Modal */}
        {isQuoteModalOpen && selectedRfq && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-gray-200 shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Submit Competitive Quotation</h3>
                  <span className="text-xs text-gray-500">{selectedRfq.title} ({selectedRfq.enquiryCode})</span>
                </div>
                <button onClick={() => setIsQuoteModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSendQuote} className="space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Total Quote Amount (INR, Excl. GST)
                  </label>
                  <input
                    type="number"
                    required
                    value={quoteForm.totalCost}
                    onChange={(e) => setQuoteForm({ ...quoteForm, totalCost: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-[11px] text-gray-500 mt-1 block">
                    GST (18%) of ₹{Math.round(quoteForm.totalCost * 0.18).toLocaleString()} will be charged to the buyer automatically.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Estimated Lead Time (Days to Dispatch)
                  </label>
                  <input
                    type="number"
                    required
                    value={quoteForm.leadTimeDays}
                    onChange={(e) => setQuoteForm({ ...quoteForm, leadTimeDays: parseInt(e.target.value) || 1 })}
                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Manufacturer Notes & Tolerances Commitment
                  </label>
                  <textarea
                    rows={3}
                    value={quoteForm.notes}
                    onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition"
                  >
                    Transmit Quotation to Client
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsQuoteModalOpen(false)}
                    className="px-5 py-3 rounded-xl border border-gray-300 text-slate-700 font-semibold text-xs hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
