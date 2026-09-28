"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Star,
  Clock,
  ShieldCheck,
  MessageSquare,
  Award,
  Filter,
  ArrowUpDown,
  Building,
  Check,
  X,
  Send,
  ArrowRight,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useFabricazeStore } from "@/lib/fabricazeStore";
import { IQuotation } from "@/types";

export default function ViewBidsPage() {
  const { rfqs, quotations, awardQuotation } = useFabricazeStore();

  // If there are RFQs, default to the most recent one
  const activeRfq = rfqs.length > 0 ? rfqs[0] : null;
  const [selectedRfqId, setSelectedRfqId] = useState<string>(activeRfq?.id || "");

  const currentRfq = rfqs.find((r) => r.id === selectedRfqId) || activeRfq;

  // Filter quotes relevant to current RFQ (or all quotes if no specific RFQ)
  const relevantQuotes = currentRfq
    ? quotations.filter((q) => q.enquiryId === currentRfq.id)
    : quotations;

  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedBidId, setSelectedBidId] = useState<string | null>(null);
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
  const [isAwarded, setIsAwarded] = useState(false);
  const [awardedOrderId, setAwardedOrderId] = useState<string | null>(null);
  const [activeChatBid, setActiveChatBid] = useState<IQuotation | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ sender: string; text: string; time: string }[]>([
    {
      sender: "Manufacturer",
      text: "Hello! We reviewed your CAD specifications. We can hold tight tolerances on all critical features and provide CMM inspection reports upon machining.",
      time: "10:30 AM",
    },
  ]);

  // Filter & sort logic
  const filteredBids = relevantQuotes
    .filter((bid) => {
      if (selectedCity === "All Cities") return true;
      return bid.manufacturer.city.toLowerCase().includes(selectedCity.toLowerCase());
    })
    .sort((a, b) => {
      return sortOrder === "asc"
        ? a.totalCostInr - b.totalCostInr
        : b.totalCostInr - a.totalCostInr;
    });

  const selectedBid = filteredBids.find((b) => b.id === (selectedBidId || filteredBids[0]?.id));

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatHistory((prev) => [
      ...prev,
      { sender: "You", text: chatMessage, time: "Just now" },
    ]);
    setChatMessage("");
  };

  const handleConfirmAward = () => {
    if (!currentRfq || !selectedBid) return;
    const newOrder = awardQuotation(currentRfq.id, selectedBid.id);
    setIsAwardModalOpen(false);
    setIsAwarded(true);
    setAwardedOrderId(newOrder.id);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-4 mb-6 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Manufacturing Marketplace
            </span>
            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {currentRfq ? currentRfq.title : "Manufacturing RFQ Quotations"}
              </h1>
              {currentRfq && (
                <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-gray-200">
                  {currentRfq.enquiryCode}
                </span>
              )}
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                {relevantQuotes.length} {relevantQuotes.length === 1 ? "Bid" : "Bids"} Received
              </span>
            </div>
            {currentRfq ? (
              <p className="text-xs text-gray-500 mt-1">
                {currentRfq.quantity} units • {currentRfq.rawMaterialType} • Tolerance {currentRfq.toleranceMm} • Required by {currentRfq.requiredDeliveryDate}
              </p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">
                Submit an RFQ to invite verified MSME machine shops to bid on your manufacturing requirement.
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {rfqs.length > 1 && (
              <select
                value={selectedRfqId}
                onChange={(e) => {
                  setSelectedRfqId(e.target.value);
                  setIsAwarded(false);
                }}
                className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {rfqs.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.enquiryCode} - {r.title}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={() => setIsAwardModalOpen(true)}
              disabled={relevantQuotes.length === 0 || isAwarded}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs shadow-sm transition ${
                isAwarded
                  ? "bg-emerald-600 text-white cursor-default"
                  : relevantQuotes.length > 0
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white active:scale-98"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Award className="w-4 h-4" />
              <span>{isAwarded ? "Project Awarded (In Escrow)" : "Award Project to Selected Bid"}</span>
            </button>
          </div>
        </div>

        {/* Success Banner if awarded */}
        {isAwarded && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Escrow Funded & Production Initiated!</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  100% of the funds are safely locked in platform escrow. The manufacturer has been notified to commence drawing review & material sourcing.
                </p>
              </div>
            </div>
            <Link
              href="/client/orders"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 transition shadow-sm"
            >
              <span>Track Shop Floor Milestones</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Zero State if no quotations */}
        {relevantQuotes.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center shadow-2xs space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
              <Clock className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-lg font-bold text-slate-900">0 Quotations Received (Clean State)</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {currentRfq
                  ? `Your RFQ "${currentRfq.title}" (${currentRfq.enquiryCode}) is posted and live in the Manufacturer Hub. Log in as a manufacturer to submit a quotation against it!`
                  : "You haven't submitted any manufacturing RFQs yet. Upload your CAD drawing to initiate the process."}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/client/submit-job"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition"
              >
                <span>Upload New CAD / Post RFQ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/manufacturer/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition"
              >
                <span>Switch to Manufacturer Hub & Place Bid</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Filter & Sort Controls */}
            <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-2xs mb-6 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filter:</span>
                </div>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option>All Cities</option>
                  <option>Indore</option>
                  <option>Pune</option>
                  <option>Ahmedabad</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span>Sort:</span>
                </div>
                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 font-medium text-gray-700 hover:bg-gray-100 flex items-center gap-1"
                >
                  <span>Price: {sortOrder === "asc" ? "Low to High" : "High to Low"}</span>
                </button>
              </div>
            </div>

            {/* Bids List */}
            <div className="space-y-4">
              {filteredBids.map((bid) => {
                const isSelected = (selectedBidId || filteredBids[0]?.id) === bid.id;
                return (
                  <div
                    key={bid.id}
                    onClick={() => setSelectedBidId(bid.id)}
                    className={`bg-white rounded-2xl border transition duration-150 p-5 sm:p-6 cursor-pointer relative ${
                      isSelected
                        ? "border-blue-600 ring-2 ring-blue-500/20 shadow-md"
                        : "border-gray-200 hover:border-gray-300 shadow-2xs"
                    }`}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      {/* Left: Manufacturer Pseudo info */}
                      <div className="lg:col-span-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">
                            {bid.manufacturer.pseudoName}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <ShieldCheck className="w-3 h-3" /> Verified MSME
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1 font-medium text-slate-700">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {bid.manufacturer.rating} ({bid.manufacturer.reviewCount} reviews)
                          </span>
                          <span>•</span>
                          <span>{bid.manufacturer.city}</span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {(bid.manufacturer.capabilities || []).map((cap) => (
                            <span
                              key={cap}
                              className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium"
                            >
                              {cap}
                            </span>
                          ))}
                        </div>

                        <div className="pt-2 text-xs text-slate-500">
                          <p className="italic bg-slate-50 p-2.5 rounded-xl border border-gray-100">
                            "{bid.notes}"
                          </p>
                        </div>
                      </div>

                      {/* Middle: Breakdown & Lead Time */}
                      <div className="lg:col-span-5 grid grid-cols-2 gap-4 border-y lg:border-y-0 lg:border-x border-gray-100 py-4 lg:py-0 lg:px-6">
                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block">
                            Cost Breakdown
                          </span>
                          <div className="mt-2 space-y-1 text-xs">
                            <div className="flex justify-between text-gray-500">
                              <span>Machining:</span>
                              <span className="font-medium text-slate-700">₹{(bid.machiningCostInr || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                              <span>Raw Material:</span>
                              <span className="font-medium text-slate-700">₹{(bid.materialCostInr || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                              <span>Tooling/Setup:</span>
                              <span className="font-medium text-slate-700">₹{(bid.toolingCostInr || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                              <span>GST (18%):</span>
                              <span className="font-medium text-slate-700">₹{(bid.taxGstInr || Math.round(bid.totalCostInr * 0.18)).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block">
                            Delivery & Compliance
                          </span>
                          <div className="mt-2 space-y-2 text-xs">
                            <div className="flex items-center gap-1.5 text-slate-700">
                              <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              <span className="font-medium">{bid.deliveryDate}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-emerald-700">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>CMM Report Included</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Building className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              <span>{(bid.manufacturer.certifications || ["ISO 9001"]).join(", ")}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Price & CTA */}
                      <div className="lg:col-span-3 flex flex-col items-end justify-between h-full space-y-4">
                        <div className="text-right">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block">
                            Total Quotation
                          </span>
                          <div className="text-2xl font-black text-slate-900 tracking-tight">
                            ₹{(bid.totalCostInr + (bid.taxGstInr || Math.round(bid.totalCostInr * 0.18))).toLocaleString()}
                          </div>
                          <span className="text-[10px] text-gray-400 block">Includes 18% GST + Escrow</span>
                        </div>

                        <div className="w-full flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveChatBid(bid);
                            }}
                            className="flex-1 py-2 px-3 rounded-xl border border-gray-200 text-slate-700 hover:bg-gray-50 text-xs font-semibold flex items-center justify-center gap-1 transition"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Discuss</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBidId(bid.id);
                              setIsAwardModalOpen(true);
                            }}
                            className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1 transition shadow-2xs"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>Award</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Escrow Award Confirmation Modal */}
        {isAwardModalOpen && selectedBid && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-gray-200 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Award Project & Fund Escrow</h3>
                    <span className="text-[10px] text-gray-500">{selectedBid.manufacturer.pseudoName}</span>
                  </div>
                </div>
                <button onClick={() => setIsAwardModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-slate-50 p-4 rounded-xl border border-gray-100 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Job Title:</span>
                    <span className="font-semibold text-slate-800">{currentRfq?.title || "Custom Part"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Quotation Total:</span>
                    <span className="font-semibold text-slate-800">₹{selectedBid.totalCostInr.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">GST (18%):</span>
                    <span className="font-semibold text-slate-800">
                      ₹{(selectedBid.taxGstInr || Math.round(selectedBid.totalCostInr * 0.18)).toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-sm text-slate-900">
                    <span>Total Escrow Deposit:</span>
                    <span className="text-emerald-700">
                      ₹{(selectedBid.totalCostInr + (selectedBid.taxGstInr || Math.round(selectedBid.totalCostInr * 0.18))).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-blue-900 text-[11px] leading-relaxed">
                  <strong>Fabricaze Escrow Protection:</strong> Funds remain securely locked in platform escrow. The manufacturer is paid only after you inspect and accept the parts against CMM tolerance criteria.
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleConfirmAward}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
                >
                  Confirm & Fund Escrow
                </button>
                <button
                  onClick={() => setIsAwardModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-xs hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Messaging Modal */}
        {activeChatBid && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full flex flex-col h-[520px] border border-gray-200 shadow-2xl overflow-hidden">
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm">{activeChatBid.manufacturer.pseudoName}</h3>
                  <span className="text-[10px] text-emerald-400">Online • Anonymized Platform Channel</span>
                </div>
                <button onClick={() => setActiveChatBid(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
                {chatHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.sender === "You" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-3 ${
                        msg.sender === "You"
                          ? "bg-blue-600 text-white rounded-tr-xs"
                          : "bg-white text-slate-800 border border-gray-200 rounded-tl-xs shadow-2xs"
                      }`}
                    >
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.time}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200 flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type your technical specification question..."
                  className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
