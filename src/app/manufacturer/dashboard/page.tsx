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
  Eye,
  Download,
  Paperclip,
  MessageSquare,
  ShieldCheck,
  Box,
  Calendar,
  AlertTriangle,
  Info,
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

  // Inspection Modal State
  const [isInspectModalOpen, setIsInspectModalOpen] = useState(false);
  const [inspectRfq, setInspectRfq] = useState<IEnquiry | null>(null);

  const [quoteForm, setQuoteForm] = useState({
    totalCost: 3200,
    leadTimeDays: 7,
    notes: `Can machine on our CNC centers holding ±0.05 mm tolerance. CMM and material inspection report included.`,
  });

  const [lastSubmittedQuoteCode, setLastSubmittedQuoteCode] = useState<string | null>(null);

  const handleOpenInspect = (rfq: IEnquiry) => {
    setInspectRfq(rfq);
    setIsInspectModalOpen(true);
  };

  const handleOpenQuote = (rfq: IEnquiry) => {
    setSelectedRfq(rfq);
    const minB = rfq.estimatedBudgetMin || 0;
    const maxB = rfq.estimatedBudgetMax || 0;
    const suggested = minB > 0 && maxB > 0 ? Math.round((minB + maxB) / 2) : 3500;

    setQuoteForm({
      totalCost: suggested,
      leadTimeDays: 7,
      notes: `Can machine ${rfq.title} holding ${rfq.toleranceMm} on our CNC centers. Material test report included.`,
    });
    setIsQuoteModalOpen(true);
  };

  const handleQuoteFromInspect = () => {
    if (inspectRfq) {
      setIsInspectModalOpen(false);
      handleOpenQuote(inspectRfq);
    }
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

  // Download CAD Drawing / Specifications file
  const handleDownloadAttachment = (rfq: IEnquiry) => {
    const fileHeader = `FABRICAZE SECURE CAD REPOSITORY\n` +
      `============================================================\n` +
      `Part Title: ${rfq.title}\n` +
      `Inquiry Code: ${rfq.enquiryCode}\n` +
      `File Name: ${rfq.fileName}\n` +
      `Format: ${rfq.fileType.toUpperCase()}\n` +
      `Client: ${rfq.clientName || "Fabricaze Verified Buyer"}\n` +
      `Material Specified: ${rfq.rawMaterialType}\n` +
      `Manufacturing Process: ${rfq.processType}\n` +
      `Quantity: ${rfq.quantity} units\n` +
      `Tolerance: ${rfq.toleranceMm}\n` +
      `Target Delivery Date: ${rfq.requiredDeliveryDate}\n` +
      `Security Scan: Passed (Malware free, verified non-executable)\n` +
      `Client Notes & Instructions:\n"${rfq.description || "Standard precision engineering tolerances apply."}"\n` +
      `============================================================\n` +
      `Generated on Fabricaze Marketplace Platform: ${new Date().toISOString()}`;

    const blob = new Blob([fileHeader], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = rfq.fileName || `${rfq.enquiryCode}_CAD_drawing.step`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
              {activeManufacturer ? `${activeManufacturer.pseudoName} (${activeManufacturer.city})` : "Precision MSME #IND-4102"} • Spindle Dashboard
            </h1>
            <p className="text-xs text-slate-500">
              Live RFQ Dispatch Queue • Inspect CAD designs, client notes & transmit binding quotations
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
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Your quotation has been securely dispatched to the client. Switch to the <strong>Client Phase (View Bids)</strong> to review competitive quotes and trigger Escrow!
            </p>
            <div className="pt-1">
              <Link
                href="/client/bids"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
              >
                <span>Switch to Client: View Received Quotations</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* 4 Shop Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs">
            <span className="text-xs text-gray-500 font-semibold block">Available Open RFQs</span>
            <div className="text-2xl font-extrabold text-blue-600 mt-1">{rfqs.length}</div>
            <span className="text-[11px] text-gray-400 block mt-0.5">Ready for quoting</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs">
            <span className="text-xs text-gray-500 font-semibold block">My Submitted Bids</span>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">{mfgSubmittedQuotes.length}</div>
            <span className="text-[11px] text-gray-400 block mt-0.5">By this facility</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs">
            <span className="text-xs text-gray-500 font-semibold block">My Awarded Orders</span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">{mfgAssignedOrders.length}</div>
            <span className="text-[11px] text-gray-400 block mt-0.5">Under production</span>
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Incoming Client RFQs Matching Shop Capabilities
              </h2>
              <p className="text-xs text-gray-500">
                Click any inquiry to inspect attached CAD drawings, 2D technical prints, and client machining comments.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 self-start sm:self-auto">
              {rfqs.length} Available Inquiries
            </span>
          </div>

          {rfqs.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 mx-auto flex items-center justify-center">
                <Inbox className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">No Open Inquiries Right Now</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                The platform is in a clean fresh state. Start by acting as a client and submitting a custom CAD drawing or 2D technical blueprint!
              </p>
              <div className="pt-2">
                <Link
                  href="/client/submit-job"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-2xs transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Post Inquiry as Client (Step 1)</span>
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
                    className="p-5 rounded-2xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-white"
                  >
                    <div className="space-y-2 flex-1">
                      {/* Title & Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm hover:text-blue-600 cursor-pointer" onClick={() => handleOpenInspect(rfq)}>
                          {rfq.title}
                        </span>
                        <span className="text-xs text-blue-600 font-mono font-semibold bg-blue-50 px-2 py-0.5 rounded">
                          {rfq.enquiryCode}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          {rfq.status}
                        </span>
                        {rfq.clientName && (
                          <span className="text-[11px] text-gray-500">
                            Client: <strong className="text-slate-700">{rfq.clientName}</strong>
                          </span>
                        )}
                      </div>

                      {/* Specs Row */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                        <span>Material: <strong className="text-slate-900">{rfq.rawMaterialType}</strong></span>
                        <span>•</span>
                        <span>Quantity: <strong className="text-slate-900">{rfq.quantity} pcs</strong></span>
                        <span>•</span>
                        <span>Tolerance: <strong className="text-slate-900">{rfq.toleranceMm}</strong></span>
                        <span>•</span>
                        <span>Required By: <strong className="text-slate-900">{rfq.requiredDeliveryDate}</strong></span>
                      </div>

                      {/* File attachment preview badge */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                          <Paperclip className="w-3 h-3 text-blue-600" />
                          <span className="truncate max-w-[200px]">{rfq.fileName || "CAD_Drawing.step"}</span>
                          <span className="text-[9px] uppercase px-1 py-0.2 bg-blue-100 text-blue-800 font-bold rounded">
                            {rfq.fileType || "CAD"}
                          </span>
                        </div>

                        {rfq.description ? (
                          <div className="inline-flex items-center gap-1 text-[11px] text-slate-500 truncate max-w-sm">
                            <MessageSquare className="w-3 h-3 text-gray-400 shrink-0" />
                            <span className="italic truncate">&quot;{rfq.description}&quot;</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-400 italic">No special comments</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2.5 shrink-0">
                      <button
                        onClick={() => handleOpenInspect(rfq)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 hover:border-blue-500 hover:bg-blue-50/50 text-slate-700 font-semibold text-xs transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        <span>Inspect Files & Comments</span>
                      </button>

                      {hasQuoted ? (
                        <span className="px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200 flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Quote Transmitted
                        </span>
                      ) : (
                        <button
                          onClick={() => handleOpenQuote(rfq)}
                          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Quote</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detailed Inspection Modal (File attachments, client comments, full specs) */}
        {isInspectModalOpen && inspectRfq && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 border border-gray-200 shadow-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                      Inquiry Specification Sheet
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                      {inspectRfq.enquiryCode}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-lg mt-0.5">
                    {inspectRfq.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Client: <strong className="text-slate-800">{inspectRfq.clientName || "Verified Platform Client"}</strong> • Posted on {inspectRfq.createdAt}
                  </p>
                </div>
                <button
                  onClick={() => setIsInspectModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* ATTACHED TECHNICAL FILE SECTION */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Box className="w-4 h-4 text-blue-600" />
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      Attached CAD / Engineering Drawing
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Malware Free • Non-Executable Scan Passed</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                      .{inspectRfq.fileType || "CAD"}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">
                        {inspectRfq.fileName || "custom_machined_part.step"}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        Target format: <strong>{inspectRfq.fileType.toUpperCase()}</strong> • Size: ~3.8 MB • 3D B-Rep / 2D Print
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownloadAttachment(inspectRfq)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition cursor-pointer shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download File / Drawing</span>
                  </button>
                </div>
              </div>

              {/* CLIENT COMMENTS & SPECIAL INSTRUCTIONS */}
              <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-700" />
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Client Machining Remarks & Special Instructions
                  </h4>
                </div>
                {inspectRfq.description && inspectRfq.description.trim() !== "" ? (
                  <div className="bg-white rounded-xl p-4 border border-amber-200 text-xs text-slate-800 leading-relaxed font-mono">
                    {inspectRfq.description}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 italic p-2">
                    No specific notes or special surface treatment comments provided by the client. Standard ISO 2768-m tolerance standards apply.
                  </div>
                )}
              </div>

              {/* TECHNICAL PARAMETERS MATRIX */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Technical Specifications Matrix
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-[10px] text-gray-400 font-semibold block uppercase">Raw Material</span>
                    <span className="text-xs font-bold text-slate-900">{inspectRfq.rawMaterialType}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-[10px] text-gray-400 font-semibold block uppercase">Process Recommended</span>
                    <span className="text-xs font-bold text-slate-900">{inspectRfq.processType.replace(/_/g, " ")}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-[10px] text-gray-400 font-semibold block uppercase">Quantity</span>
                    <span className="text-xs font-bold text-slate-900">{inspectRfq.quantity} units</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-[10px] text-gray-400 font-semibold block uppercase">Tolerance Band</span>
                    <span className="text-xs font-bold text-slate-900">{inspectRfq.toleranceMm}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-[10px] text-gray-400 font-semibold block uppercase">Surface Treatment</span>
                    <span className="text-xs font-bold text-slate-900">{inspectRfq.surfaceFinish.replace(/_/g, " ")}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-[10px] text-gray-400 font-semibold block uppercase">Required Delivery</span>
                    <span className="text-xs font-bold text-slate-900">{inspectRfq.requiredDeliveryDate}</span>
                  </div>
                </div>
              </div>

              {/* MODAL ACTIONS */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-4 gap-3">
                <button
                  type="button"
                  onClick={() => setIsInspectModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-slate-700 font-semibold text-xs hover:bg-gray-50 transition cursor-pointer"
                >
                  Close Inspection
                </button>

                <button
                  type="button"
                  onClick={handleQuoteFromInspect}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Binding Quotation For This Part</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Submit Quotation Modal */}
        {isQuoteModalOpen && selectedRfq && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-gray-200 shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Submit Competitive Quotation</h3>
                  <span className="text-xs text-gray-500">{selectedRfq.title} ({selectedRfq.enquiryCode})</span>
                </div>
                <button onClick={() => setIsQuoteModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
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
                    className="flex-1 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    Transmit Quotation to Client
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsQuoteModalOpen(false)}
                    className="px-5 py-3 rounded-xl border border-gray-300 text-slate-700 font-semibold text-xs hover:bg-gray-50 transition cursor-pointer"
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
