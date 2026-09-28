"use client";

import { useState } from "react";
import { AlertTriangle, Download, Eye, CheckCircle2, X } from "lucide-react";

export default function AdminQuotesPage() {
  const [selectedQuote, setSelectedQuote] = useState<any | null>(null);

  const quotes = [
    {
      id: "QUO-001",
      submittedDate: "2024-07-11",
      jobTitle: "Custom Aluminum Brackets",
      jobCode: "FAB-2024-1892",
      budget: "$12,000 - $18,000",
      manufacturer: "Precision Manufacturing LLC",
      quotedPrice: "$15,750",
      budgetVariance: "+12%",
      isUnusual: false,
      status: "Pending",
      leadTime: "14 days",
    },
    {
      id: "QUO-002",
      submittedDate: "2024-07-10",
      jobTitle: "Prototype CNC Machining",
      jobCode: "FAB-2024-1891",
      budget: "$2,000 - $3,500",
      manufacturer: "Advanced Fabrication Co",
      quotedPrice: "$4,200",
      budgetVariance: "+34%",
      isUnusual: true,
      status: "Under Review",
      leadTime: "7 days",
    },
    {
      id: "QUO-003",
      submittedDate: "2024-07-09",
      jobTitle: "Sheet Metal Fabrication",
      jobCode: "FAB-2024-1890",
      budget: "$25,000 - $35,000",
      manufacturer: "Metro Metalworks",
      quotedPrice: "$28,900",
      budgetVariance: "+8%",
      isUnusual: false,
      status: "Accepted",
      leadTime: "21 days",
    },
  ];

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header matching Page 20 mockup */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quotation Monitoring</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Algorithmic anomaly detection, price-gouge alerts, and vendor margin integrity
          </p>
        </div>
        <button
          onClick={() => alert("Generating quotation variance report...")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Generate Report</span>
        </button>
      </div>

      {/* Unusual Quote Detected Alert Banner matching mockup */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-amber-900">1 Unusual Quote Detected</h3>
            <p className="text-xs text-amber-800/90 mt-0.5">
              Quote <strong>QUO-002</strong> is <strong>34% above the expected budget range</strong>. Review recommended to prevent client friction.
            </p>
          </div>
        </div>

        <button
          onClick={() => setSelectedQuote(quotes[1])}
          className="px-4 py-2 rounded-xl bg-white border border-amber-300 text-amber-900 text-xs font-bold hover:bg-amber-100/50 transition shrink-0 shadow-2xs"
        >
          Review Now
        </button>
      </div>

      {/* Quotations Table matching mockup */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-slate-900">
            Recent Quotations ({quotes.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/75 text-gray-500 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-3.5">Quote Details</th>
                <th className="px-6 py-3.5">Job</th>
                <th className="px-6 py-3.5">Manufacturer</th>
                <th className="px-6 py-3.5">Quoted Price</th>
                <th className="px-6 py-3.5">Budget Variance</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Lead Time</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-slate-700">
              {quotes.map((q) => (
                <tr
                  key={q.id}
                  className={`hover:bg-gray-50/50 transition ${
                    q.isUnusual ? "bg-amber-50/30" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      {q.isUnusual && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                      <span>{q.id}</span>
                    </div>
                    <div className="text-[10px] text-gray-400">Submitted: {q.submittedDate}</div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{q.jobTitle}</div>
                    <div className="text-[11px] text-gray-500">{q.jobCode}</div>
                    <div className="text-[10px] text-gray-400">Budget: {q.budget}</div>
                  </td>

                  <td className="px-6 py-4 font-medium text-slate-800">{q.manufacturer}</td>

                  <td className="px-6 py-4 font-extrabold text-slate-900 text-sm">{q.quotedPrice}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`font-semibold text-xs ${
                        q.isUnusual ? "text-red-600 font-bold" : "text-emerald-600"
                      }`}
                    >
                      {q.budgetVariance}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        q.status === "Accepted"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : q.status === "Under Review"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {q.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-600">{q.leadTime}</td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedQuote(q)}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Quotation Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-gray-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-base">
                  Quotation Audit: {selectedQuote.id}
                </h3>
              </div>
              <button onClick={() => setSelectedQuote(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Job:</span>
                  <span className="font-semibold text-slate-800">{selectedQuote.jobTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Manufacturer:</span>
                  <span className="font-semibold text-slate-800">{selectedQuote.manufacturer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Expected Range:</span>
                  <span className="font-semibold text-slate-800">{selectedQuote.budget}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Quoted Total:</span>
                  <span className="font-bold text-red-600 text-sm">{selectedQuote.quotedPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Variance:</span>
                  <span className="font-bold text-red-600">{selectedQuote.budgetVariance}</span>
                </div>
              </div>

              <p className="text-slate-600 text-xs">
                Fabricaze price anomaly algorithm detected that this quotation exceeds standard material + spindle hour index for the Western Indian MSME cluster.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  alert(`Quote ${selectedQuote.id} approved for client viewing.`);
                  setSelectedQuote(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-2xs transition"
              >
                Approve & Forward to Client
              </button>
              <button
                onClick={() => {
                  alert(`Vendor notified to revise quotation.`);
                  setSelectedQuote(null);
                }}
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-slate-700 font-semibold text-xs hover:bg-gray-50 transition"
              >
                Request Revision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
