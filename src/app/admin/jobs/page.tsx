"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Download, FileText, CheckCircle, Clock, MoreVertical, DollarSign, Plus, ArrowRight } from "lucide-react";
import { useFabricazeStore } from "@/lib/fabricazeStore";

export default function AdminJobsPage() {
  const { rfqs, orders } = useFabricazeStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const openJobsCount = rfqs.filter((j) => j.status === "OPEN" || j.status === "QUOTED").length;
  const inProductionCount = orders.filter((o) => o.currentMilestone !== "DELIVERED").length;
  const completedCount = orders.filter((o) => o.currentMilestone === "DELIVERED").length;

  const filteredJobs = rfqs.filter((job) => {
    const matchSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.enquiryCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.rawMaterialType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === "All Statuses" || job.status === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Super Admin Job Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor incoming client RFQs, active shop production batches, and manager assignments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/client/submit-job"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Test RFQ</span>
          </Link>
          <button
            onClick={() => alert("Exporting all active jobs records to CSV...")}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-gray-300 text-slate-700 text-xs font-semibold hover:bg-gray-50 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs">
          <div className="text-2xl font-extrabold text-blue-600">{openJobsCount}</div>
          <span className="text-xs font-semibold text-gray-500">Open RFQs</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs">
          <div className="text-2xl font-extrabold text-amber-600">{inProductionCount}</div>
          <span className="text-xs font-semibold text-gray-500">In Production</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs">
          <div className="text-2xl font-extrabold text-emerald-600">{completedCount}</div>
          <span className="text-xs font-semibold text-gray-500">Completed Orders</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs">
          <div className="text-2xl font-extrabold text-slate-800">{rfqs.length}</div>
          <span className="text-xs font-semibold text-gray-500">Total System Jobs</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by job title, code, or material..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All Statuses</option>
            <option>OPEN</option>
            <option>QUOTED</option>
            <option>IN_PRODUCTION</option>
          </select>
        </div>
      </div>

      {/* Jobs Table or Zero State */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        {filteredJobs.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
              <FileText className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-base font-bold text-slate-900">0 Jobs in Management Database (Clean Slate)</h3>
              <p className="text-xs text-slate-500">
                All pre-existing jobs have been reset. To create a new live job, submit an RFQ from the Client Portal.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/client/submit-job"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-2xs transition"
              >
                <span>Submit Job as Client</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-gray-200 text-gray-500 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Job Code & Title</th>
                  <th className="px-6 py-3.5">Quantity & Material</th>
                  <th className="px-6 py-3.5">Tolerance</th>
                  <th className="px-6 py-3.5">Target Budget</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{job.title}</div>
                      <span className="font-mono text-[10px] text-blue-600">{job.enquiryCode}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div>{job.quantity} units</div>
                      <span className="text-[10px] text-gray-400">{job.rawMaterialType}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-700">{job.toleranceMm}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      ₹{(job.estimatedBudgetMin || 0).toLocaleString()} - ₹{(job.estimatedBudgetMax || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          job.status === "OPEN"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : job.status === "QUOTED"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href="/client/bids"
                        className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        View Bids →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
