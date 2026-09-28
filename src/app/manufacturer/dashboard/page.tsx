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
  AlertCircle,
  Plus,
  Send,
  X,
  Layers,
} from "lucide-react";

export default function ManufacturerDashboard() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedRfq, setSelectedRfq] = useState<any | null>(null);

  const [quoteForm, setQuoteForm] = useState({
    totalCost: 14500,
    leadTimeDays: 7,
    notes: "Can guarantee ±0.05 mm on bore. Material test and CMM reports included.",
  });

  const matchingRfqs = [
    {
      id: "rfq-1",
      code: "FAB-2024-1891",
      title: "Prototype CNC Machining",
      material: "Aluminum 7075-T6",
      process: "CNC Machining",
      quantity: 5,
      tolerance: "±0.1 mm",
      targetDelivery: "2026-10-05",
      budget: "₹2,000 - ₹3,500",
      clientLocation: "Pune, MH",
    },
    {
      id: "rfq-2",
      code: "FAB-2024-1890",
      title: "Sheet Metal Fabrication - Complex Enclosure",
      material: "SS 304 (2.0 mm)",
      process: "Laser Cutting & Bending",
      quantity: 50,
      tolerance: "±0.2 mm",
      targetDelivery: "2026-10-20",
      budget: "₹25,000 - ₹35,000",
      clientLocation: "Indore, MP",
    },
  ];

  const handleOpenQuote = (rfq: any) => {
    setSelectedRfq(rfq);
    setIsQuoteModalOpen(true);
  };

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Quotation of ₹${quoteForm.totalCost.toLocaleString()} submitted for ${selectedRfq.code}. Buyer will be notified.`);
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
                MSME Shop Floor Portal
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Audited & Verified MSME
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Precision Tech #IND-4102 • Indore Hub
            </h1>
            <p className="text-xs text-slate-500">
              Udyam Registered: UDYAM-MP-23-009182 • 4.8★ (142 completed jobs)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/manufacturer/machines"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-300 text-slate-700 font-semibold text-xs hover:bg-gray-50 transition shadow-2xs"
            >
              <Wrench className="w-3.5 h-3.5 text-blue-600" />
              <span>Manage Machine Fleet (2 Active)</span>
            </Link>
          </div>
        </div>

        {/* 4 Shop Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs">
            <span className="text-xs text-gray-500 font-semibold block">Available Matching RFQs</span>
            <div className="text-2xl font-extrabold text-blue-600 mt-1">2 Live</div>
            <span className="text-[11px] text-gray-400 block mt-0.5">Based on Haas VMC envelope</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs">
            <span className="text-xs text-gray-500 font-semibold block">Active Bids Pending</span>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">4 Bids</div>
            <span className="text-[11px] text-gray-400 block mt-0.5">Awaiting buyer decision</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs">
            <span className="text-xs text-gray-500 font-semibold block">In-Production Orders</span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">1 Batch</div>
            <span className="text-[11px] text-gray-400 block mt-0.5">₹18,585 in Escrow</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs">
            <span className="text-xs text-gray-500 font-semibold block">30-Day Disbursed Payout</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">₹1,42,800</div>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">100% on-time release</span>
          </div>
        </div>

        {/* Matching RFQ Opportunities Feed */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Open RFQs Matching Your Machines
              </h2>
              <p className="text-xs text-gray-500">
                Instant opportunities routed to your shop based on registered tolerance (±0.05mm) and spindle envelope
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
              Auto-Matched
            </span>
          </div>

          <div className="space-y-4">
            {matchingRfqs.map((rfq) => (
              <div
                key={rfq.id}
                className="p-5 rounded-xl border border-gray-200 hover:border-blue-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{rfq.title}</span>
                    <span className="text-xs text-gray-400">{rfq.code}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                    <span>Material: <strong>{rfq.material}</strong></span>
                    <span>•</span>
                    <span>Quantity: <strong>{rfq.quantity} pcs</strong></span>
                    <span>•</span>
                    <span>Tolerance: <strong>{rfq.tolerance}</strong></span>
                    <span>•</span>
                    <span>Required by: <strong>{rfq.targetDelivery}</strong></span>
                  </div>

                  <div className="text-xs text-slate-500">
                    Buyer Target Budget: <strong className="text-slate-800">{rfq.budget}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleOpenQuote(rfq)}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-2xs transition"
                  >
                    Submit Quotation
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Quotation Modal */}
        {isQuoteModalOpen && selectedRfq && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-gray-200 shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Submit Competitive Quotation</h3>
                  <span className="text-xs text-gray-500">{selectedRfq.title} ({selectedRfq.code})</span>
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
                    value={quoteForm.totalCost}
                    onChange={(e) => setQuoteForm({ ...quoteForm, totalCost: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-[11px] text-gray-500 mt-1 block">
                    GST (18%) of ₹{Math.round(quoteForm.totalCost * 0.18).toLocaleString()} will be automatically added by platform.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Estimated Lead Time (Days to Dispatch)
                  </label>
                  <input
                    type="number"
                    value={quoteForm.leadTimeDays}
                    onChange={(e) => setQuoteForm({ ...quoteForm, leadTimeDays: parseInt(e.target.value) || 1 })}
                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Manufacturer Notes & Quality Guarantee
                  </label>
                  <textarea
                    rows={3}
                    value={quoteForm.notes}
                    onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
                  >
                    Send Quotation to Buyer
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsQuoteModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-300 text-slate-700 font-semibold text-xs hover:bg-gray-50 transition"
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
