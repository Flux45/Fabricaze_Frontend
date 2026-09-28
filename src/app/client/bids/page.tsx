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
} from "lucide-react";
import { INITIAL_BIDS } from "@/lib/mockData";
import { IQuotation } from "@/types";

export default function ViewBidsPage() {
  const [bids, setBids] = useState<IQuotation[]>(INITIAL_BIDS);
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedBidId, setSelectedBidId] = useState<string | null>("bid-1");
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
  const [isAwarded, setIsAwarded] = useState(false);
  const [activeChatBid, setActiveChatBid] = useState<IQuotation | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ sender: string; text: string; time: string }[]>([
    {
      sender: "Manufacturer",
      text: "Hello! We have reviewed your .STEP drawing for Job #MFG-2024-001. We can hold ±0.05 mm on the critical bore using our Haas VMC. Let us know if you need material test certificates.",
      time: "10:30 AM",
    },
  ]);

  // Filter & sort logic
  const filteredBids = bids
    .filter((bid) => {
      if (selectedCity === "All Cities") return true;
      return bid.manufacturer.city.toLowerCase().includes(selectedCity.toLowerCase());
    })
    .sort((a, b) => {
      return sortOrder === "asc"
        ? a.totalCostInr - b.totalCostInr
        : b.totalCostInr - a.totalCostInr;
    });

  const selectedBid = bids.find((b) => b.id === selectedBidId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatHistory((prev) => [
      ...prev,
      { sender: "You", text: chatMessage, time: "Just now" },
    ]);
    setChatMessage("");
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
                CNC Aluminum Housing - Job #MFG-2024-001
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                4 Bids Received
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              10 pieces • Aluminum 6061-T6 • ±0.1mm tolerance • Required by Oct 15
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => selectedBidId && setIsAwardModalOpen(true)}
              disabled={!selectedBidId || isAwarded}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs shadow-sm transition ${
                isAwarded
                  ? "bg-emerald-600 text-white cursor-default"
                  : selectedBidId
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white active:scale-98"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Award className="w-4 h-4" />
              <span>{isAwarded ? "Project Awarded (In Production)" : "Award Project (1 selected)"}</span>
            </button>
          </div>
        </div>

        {/* Filter & Sort Controls matching mockup */}
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

        {/* Bids List matching Page 15 / Page 9 mockup */}
        <div className="space-y-4">
          {filteredBids.map((bid) => {
            const isSelected = selectedBidId === bid.id;
            return (
              <div
                key={bid.id}
                onClick={() => setSelectedBidId(bid.id)}
                className={`bg-white rounded-2xl p-6 border transition-all cursor-pointer relative shadow-2xs ${
                  isSelected
                    ? "border-blue-600 ring-2 ring-blue-500/20 shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* Radio / Selection Checkbox + Vendor Info (Cols 1-6) */}
                  <div className="lg:col-span-6 flex items-start gap-4">
                    <input
                      type="radio"
                      name="selected_bid"
                      checked={isSelected}
                      onChange={() => setSelectedBidId(bid.id)}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                    />

                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-sm shrink-0 border border-blue-100">
                      {bid.manufacturer.pseudoName.charAt(0)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-sm">
                          {bid.manufacturer.pseudoName}
                        </h3>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3 h-3" /> Verified
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1 text-amber-500 font-semibold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{bid.manufacturer.rating}</span>
                          <span className="text-gray-400 font-normal">
                            ({bid.manufacturer.reviewCount || 98} reviews)
                          </span>
                        </span>
                        <span>•</span>
                        <span>{bid.manufacturer.city}</span>
                      </div>

                      <p className="text-xs text-slate-600 pt-1 leading-relaxed">
                        {bid.notes}
                      </p>
                    </div>
                  </div>

                  {/* Pricing & Lead Time (Cols 7-9) */}
                  <div className="lg:col-span-3 lg:border-l border-gray-100 lg:pl-6 space-y-2">
                    <div>
                      <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                        Total Quote
                      </span>
                      <div className="text-2xl font-extrabold text-blue-600">
                        ₹{bid.totalCostInr.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Lead Time: <strong>{bid.deliveryDate}</strong></span>
                    </div>
                  </div>

                  {/* Capabilities, Certifications & Actions (Cols 10-12) */}
                  <div className="lg:col-span-3 lg:border-l border-gray-100 lg:pl-6 space-y-3">
                    <div>
                      <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                        Capabilities
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {bid.manufacturer.capabilities?.map((cap) => (
                          <span
                            key={cap}
                            className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-700"
                          >
                            {cap}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                        Certifications
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {bid.manufacturer.certifications?.map((cert) => (
                          <span
                            key={cert}
                            className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100"
                          >
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-3 text-xs">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Viewing capability portfolio for ${bid.manufacturer.pseudoName}`);
                        }}
                        className="text-gray-600 hover:text-blue-600 font-semibold"
                      >
                        View Portfolio
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveChatBid(bid);
                        }}
                        className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Message</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Award Project Modal with Escrow Breakdown */}
        {isAwardModalOpen && selectedBid && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 border border-gray-200 shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-base">Confirm Project Award</h3>
                </div>
                <button
                  onClick={() => setIsAwardModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <p className="text-slate-600">
                  You are awarding <strong>Job #MFG-2024-001</strong> to <strong>{selectedBid.manufacturer.pseudoName}</strong>.
                </p>

                {/* Price Breakdown */}
                <div className="bg-slate-50 rounded-xl p-4 border border-gray-200 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Machining & Parts (10 pcs):</span>
                    <span className="font-semibold text-slate-900">₹{selectedBid.totalCostInr.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST (18% Input Credit available):</span>
                    <span className="font-semibold text-slate-900">₹{Math.round(selectedBid.totalCostInr * 0.18).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fabricaze Escrow Guarantee:</span>
                    <span className="font-semibold text-emerald-600">Included (Free)</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-bold text-slate-900">
                    <span>Total Placed in Escrow:</span>
                    <span className="text-blue-600">₹{Math.round(selectedBid.totalCostInr * 1.18).toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 text-emerald-800 text-[11px] space-y-1">
                  <div className="font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Fabricaze Escrow Protection
                  </div>
                  <p>
                    Funds remain protected in third-party escrow. The manufacturer is paid only after dimensional verification against your CMM tolerance criteria.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setIsAwardModalOpen(false);
                    setIsAwarded(true);
                  }}
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
              {/* Header */}
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm">{activeChatBid.manufacturer.pseudoName}</h3>
                  <span className="text-[10px] text-emerald-400">Online • Anonymized Platform Channel</span>
                </div>
                <button onClick={() => setActiveChatBid(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages */}
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

              {/* Input */}
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
