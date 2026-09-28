"use client";

import { useState } from "react";
import { Search, Download, CheckCircle, Clock, AlertCircle, MoreVertical } from "lucide-react";

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const [users, setUsers] = useState([
    {
      id: "USR-001",
      name: "TechCorp Solutions",
      email: "contact@techcorp.com",
      role: "Client",
      status: "Verified",
      location: "San Francisco, CA / Indore",
      joinDate: "2024-01-15",
      activity: "12 jobs posted",
    },
    {
      id: "USR-002",
      name: "Precision Manufacturing LLC",
      email: "info@precisionmfg.com",
      role: "Manufacturer",
      status: "Verified",
      location: "Indore, MP",
      joinDate: "2024-02-08",
      activity: "28 jobs completed",
    },
    {
      id: "USR-003",
      name: "StartupXYZ",
      email: "team@startupxyz.com",
      role: "Client",
      status: "Active",
      location: "Pune, MH",
      joinDate: "2024-03-12",
      activity: "3 jobs posted",
    },
    {
      id: "USR-004",
      name: "Advanced Fabrication Co",
      email: "orders@advancedfab.com",
      role: "Manufacturer",
      status: "Pending",
      location: "Ahmedabad, GJ",
      joinDate: "2024-07-10",
      activity: "0 jobs completed",
    },
  ]);

  const toggleVerify = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === "Verified" ? "Active" : "Verified" } : u))
    );
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchRole = roleFilter === "All Roles" || u.role === roleFilter;
    const matchStatus = statusFilter === "All Statuses" || u.status === statusFilter;

    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header matching Page 18 mockup */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit client accounts, MSME factory credentials, and verification statuses
          </p>
        </div>
        <button
          onClick={() => alert("Exporting all user records to CSV...")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Users</span>
        </button>
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
              placeholder="Search users by name or email..."
              className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option>All Roles</option>
              <option>Client</option>
              <option>Manufacturer</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option>All Statuses</option>
              <option>Verified</option>
              <option>Active</option>
              <option>Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table matching mockup */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Users ({filteredUsers.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/75 text-gray-500 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-3.5">User</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Location</th>
                <th className="px-6 py-3.5">Join Date</th>
                <th className="px-6 py-3.5">Activity</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-slate-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{user.name}</div>
                    <div className="text-[11px] text-gray-500">{user.email}</div>
                    <div className="text-[10px] text-gray-400">{user.id}</div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-800">{user.role}</span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        user.status === "Verified"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : user.status === "Active"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {user.status === "Verified" && <CheckCircle className="w-3 h-3" />}
                      {user.status === "Pending" && <Clock className="w-3 h-3" />}
                      {user.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-600">{user.location}</td>
                  <td className="px-6 py-4 text-gray-500">{user.joinDate}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{user.activity}</td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => toggleVerify(user.id)}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                    >
                      {user.status === "Verified" ? "Revoke" : "Verify MSME"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
