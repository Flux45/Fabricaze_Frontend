"use client";

import { useState } from "react";
import { Search, Download, FileText, CheckCircle, Clock, MoreVertical, DollarSign } from "lucide-react";
import { INITIAL_JOBS } from "@/lib/mockData";

export default function AdminJobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");

  const filteredJobs = INITIAL_JOBS.filter((job) => {
    const matchSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.client.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === "All Statuses" || job.status === statusFilter;
    const matchPriority = priorityFilter === "All Priorities" || job.priority === priorityFilter;

    return matchSearch && matchStatus && matchPriority;
  });

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header & Metrics matching Page 19 mockup */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Job Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor incoming client RFQs, active shop production batches, and manager assignments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("Generating monthly manufacturing revenue report...")}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-gray-300 text-slate-700 text-xs font-semibold hover:bg-gray-50 transition"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Revenue Report</span>
          </button>
          <button
            onClick={() => alert("Exporting all jobs records to CSV...")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Jobs</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Badges matching mockup */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs">
          <div className="text-2xl font-extrabold text-blue-600">47</div>
          <span className="text-xs font-semibold text-gray-500">Open Jobs</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs">
          <div className="text-2xl font-extrabold text-amber-600">23</div>
          <span className="text-xs font-semibold text-gray-500">In Production</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs">
          <div className="text-2xl font-extrabold text-emerald-600">156</div>
          <span className="text-xs font-semibold text-gray-500">Completed</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs">
          <div className="text-2xl font-extrabold text-slate-900">$347K</div>
          <span className="text-xs font-semibold text-gray-500">Total Value</span>
        </div>
      </div>

      {/* Filter and Search Bar matching mockup */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs space-y-3">
        <span className="text-xs font-bold text-gray-700">Filters & Search</span>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by job title, client, or job ID..."
              className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option>All Statuses</option>
              <option>Open</option>
              <option>Quoted</option>
              <option>In Production</option>
              <option>Completed</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option>All Priorities</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Table matching Page 19 mockup */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-slate-900">
            Jobs ({filteredJobs.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/75 text-gray-500 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-3.5">Job Details</th>
                <th className="px-6 py-3.5">Client</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Priority</th>
                <th className="px-6 py-3.5">Budget</th>
                <th className="px-6 py-3.5">Quotes</th>
                <th className="px-6 py-3.5">Manager</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-slate-700">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{job.title}</div>
                    <div className="text-[11px] text-gray-500">{job.code}</div>
                    <div className="text-[10px] text-gray-400">Posted: {job.date}</div>
                  </td>

                  <td className="px-6 py-4 font-medium text-slate-800">{job.client}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        job.status === "In Production"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : job.status === "Quoted"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : job.status === "Completed"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-gray-100 text-gray-700 border border-gray-200"
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        job.priority === "High"
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : job.priority === "Medium"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-gray-50 text-gray-600 border border-gray-200"
                      }`}
                    >
                      {job.priority}
                    </span>
                  </td>

                  <td className="px-6 py-4 font-semibold text-slate-900">{job.budget}</td>
                  <td className="px-6 py-4 text-blue-600 font-bold">{job.quotesCount} quotes</td>
                  <td className="px-6 py-4 text-gray-600">{job.manager}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
