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
  ArrowRight,
  X,
  Send,
  Layers,
} from "lucide-react";
import { useFabricazeStore } from "@/lib/fabricazeStore";
import { IOrder, IDispute } from "@/types";

const MILESTONES_ORDER: IOrder["currentMilestone"][] = [
  "DRAWING_REVIEW",
  "MATERIAL_PROCUREMENT",
  "MACHINING_FABRICATION",
  "QC_INSPECTION",
  "DISPATCHED",
  "DELIVERED",
];

const MILESTONE_LABELS: Record<IOrder["currentMilestone"], string> = {
  DRAWING_REVIEW: "Drawing Review",
  MATERIAL_PROCUREMENT: "Material Sourcing",
  MACHINING_FABRICATION: "CNC Machining",
  QC_INSPECTION: "QC & CMM Verification",
  DISPATCHED: "Dispatched",
  DELIVERED: "Final Delivery",
};

export default function ClientOrdersPage() {
  const { myOrders, advanceOrderMilestone, raiseDispute, activeClient } = useFabricazeStore();
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");
  const [disputeModalOrder, setDisputeModalOrder] = useState<IOrder | null>(null);
  const [disputeIssueType, setDisputeIssueType] = useState<IDispute["issueType"]>("Quality Issue");
  const [disputeDescription, setDisputeDescription] = useState("");
  const [disputeSuccessMsg, setDisputeSuccessMsg] = useState<string | null>(null);

  const activeOrders = myOrders.filter((o) => o.currentMilestone !== "DELIVERED");
  const completedOrders = myOrders.filter((o) => o.currentMilestone === "DELIVERED");

  const displayedOrders = activeTab === "active" ? activeOrders : completedOrders;

  const handleNextMilestone = (order: IOrder) => {
    const currentIdx = MILESTONES_ORDER.indexOf(order.currentMilestone);
    if (currentIdx < MILESTONES_ORDER.length - 1) {
      const nextMilestone = MILESTONES_ORDER[currentIdx + 1];
      advanceOrderMilestone(order.id, nextMilestone);
    }
  };

  const handleReleaseEscrow = (orderId: string) => {
    advanceOrderMilestone(orderId, "DELIVERED");
    alert("Delivery accepted! Escrow funds have been released to the manufacturer.");
  };

  const handleOpenDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeModalOrder) return;

    const newDispute = raiseDispute({
      orderNumber: disputeModalOrder.orderNumber,
      jobTitle: disputeModalOrder.enquiryTitle,
      clientName: "Ayush (Active Session)",
      manufacturerPseudo: disputeModalOrder.manufacturerPseudo,
      issueType: disputeIssueType,
      valueInr: disputeModalOrder.totalAmountInr,
    });

    setDisputeSuccessMsg(`Dispute ${newDispute.disputeCode} opened and flagged for Super Admin resolution.`);
    setDisputeModalOrder(null);
    setDisputeDescription("");
  };

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
            <p className="text-xs text-slate-500 mt-0.5">
              Track real-time CNC spindle progress, review CMM calibration certificates, and release escrow funds.
            </p>
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
              Active Orders ({activeOrders.length})
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "completed"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "bg-white text-gray-700 border border-gray-200"
              }`}
            >
              Completed Orders ({completedOrders.length})
            </button>
          </div>
        </div>

        {/* Dispute Confirmation Toast */}
        {disputeSuccessMsg && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>{disputeSuccessMsg}</span>
            </div>
            <button
              onClick={() => setDisputeSuccessMsg(null)}
              className="text-amber-700 hover:text-amber-900 font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Zero State if no orders */}
        {displayedOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center shadow-2xs space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
              <Box className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-lg font-bold text-slate-900">
                0 {activeTab === "active" ? "Active" : "Completed"} Production Orders (Clean State)
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {activeTab === "active"
                  ? "You have no active manufacturing jobs currently in production. Post an RFQ and award a quotation to initiate an escrow-protected order."
                  : "No completed jobs yet. Completed orders will appear here once you accept delivery and release escrow."}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/client/submit-job"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition"
              >
                <span>Upload CAD / Post New RFQ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/client/bids"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-sm transition"
              >
                <span>View Received Quotations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {displayedOrders.map((order) => {
              const currentMilestoneIndex = MILESTONES_ORDER.indexOf(order.currentMilestone);
              const isDelivered = order.currentMilestone === "DELIVERED";

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-2xs space-y-8"
                >
                  {/* Order Header Summary */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-blue-600 font-mono">{order.orderNumber}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            isDelivered
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {isDelivered ? "DELIVERED & VERIFIED" : "IN PRODUCTION"}
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-slate-900 mt-1">
                        {order.enquiryTitle}
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Specs: <strong>{order.partSpecs}</strong> • Manufacturer:{" "}
                        <strong>{order.manufacturerPseudo}</strong> • Created on {order.createdAt}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="bg-slate-50 px-4 py-2 rounded-xl border border-gray-200">
                        <span className="text-gray-500 block text-[10px] uppercase font-semibold">Total in Escrow</span>
                        <span className="text-sm font-bold text-slate-900">₹{order.totalAmountInr.toLocaleString()}</span>
                      </div>
                      <div
                        className={`px-4 py-2 rounded-xl border ${
                          order.escrowStatus === "RELEASED"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                            : "bg-blue-50 border-blue-200 text-blue-800"
                        }`}
                      >
                        <span className="block text-[10px] uppercase font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Escrow Status
                        </span>
                        <span className="text-xs font-bold">
                          {order.escrowStatus === "RELEASED" ? "Funds Released to MSME" : "100% Funds Protected"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Visual Step Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Real-Time Shop Floor Milestones
                      </h3>
                      {!isDelivered && (
                        <button
                          onClick={() => handleNextMilestone(order)}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200"
                        >
                          <span>Simulate Next Stage →</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                      {MILESTONES_ORDER.map((milestoneKey, idx) => {
                        const milestoneIdx = MILESTONES_ORDER.indexOf(milestoneKey);
                        const isDone = milestoneIdx < currentMilestoneIndex || isDelivered;
                        const isCurrent = milestoneIdx === currentMilestoneIndex && !isDelivered;

                        return (
                          <div
                            key={milestoneKey}
                            className={`p-3 rounded-xl border text-xs space-y-1 transition ${
                              isDone
                                ? "bg-emerald-50/60 border-emerald-200 text-emerald-900"
                                : isCurrent
                                ? "bg-blue-50/80 border-blue-300 text-blue-900 ring-2 ring-blue-500/20"
                                : "bg-gray-50 border-gray-200 text-gray-400"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold">Step 0{idx + 1}</span>
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              ) : isCurrent ? (
                                <Clock className="w-4 h-4 text-blue-600 animate-spin" />
                              ) : (
                                <div className="w-3 h-3 rounded-full border border-gray-300" />
                              )}
                            </div>
                            <div className="font-semibold text-xs leading-snug">
                              {MILESTONE_LABELS[milestoneKey]}
                            </div>
                            <div className="text-[10px] opacity-75">
                              {isDone ? "Completed" : isCurrent ? "Active on Floor" : "Pending"}
                            </div>
                          </div>
                        );
                      })}
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
                          <span className="text-[10px] text-emerald-600 font-medium">✓ Verified Material Hardness</span>
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
                          <span className="text-[10px] text-emerald-600 font-medium">✓ Certified Alloy Ingot</span>
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
                      <span>Logistics Tracking: <strong>{order.trackingNumber}</strong></span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setDisputeModalOrder(order)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Report Discrepancy / Open Dispute</span>
                      </button>

                      {!isDelivered && (
                        <button
                          onClick={() => handleReleaseEscrow(order.id)}
                          className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition shadow-2xs"
                        >
                          Accept Delivery & Release Escrow
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Dispute Modal */}
        {disputeModalOrder && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-gray-200 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Raise Quality / Delivery Dispute</h3>
                    <span className="text-[10px] text-gray-500">{disputeModalOrder.orderNumber}</span>
                  </div>
                </div>
                <button onClick={() => setDisputeModalOrder(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleOpenDispute} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Issue Category</label>
                  <select
                    value={disputeIssueType}
                    onChange={(e) => setDisputeIssueType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="Quality Issue">Quality Issue (Tolerance Deviation / CMM Failure)</option>
                    <option value="Spec Mismatch">Spec Mismatch (Raw Material Mismatch)</option>
                    <option value="Delivery Delay">Delivery Delay (Shop Floor Lead Time Breach)</option>
                    <option value="Communication">Communication Issue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Detailed Explanation</label>
                  <textarea
                    rows={3}
                    value={disputeDescription}
                    onChange={(e) => setDisputeDescription(e.target.value)}
                    placeholder="Describe specific dimensional or visual defect found during inspection..."
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl text-red-900 text-[11px] leading-relaxed">
                  <strong>Notice:</strong> Raising a dispute freezes the escrow payout automatically. A Fabricaze Super Admin QC engineer will review calibration telemetry to arbitrate.
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition"
                  >
                    Submit Dispute
                  </button>
                  <button
                    type="button"
                    onClick={() => setDisputeModalOrder(null)}
                    className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-xs hover:bg-gray-50 transition"
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
