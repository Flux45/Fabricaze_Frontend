"use client";

import { useState } from "react";
import {
  Search,
  Download,
  CheckCircle,
  Clock,
  Plus,
  X,
  Factory,
  Building2,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Check,
  Users,
} from "lucide-react";
import { useFabricazeStore } from "@/lib/fabricazeStore";

export default function AdminUsersPage() {
  const { manufacturers, onboardManufacturer } = useFabricazeStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phoneNumber: "",
    city: "Indore",
    state: "Madhya Pradesh",
    gstNumber: "",
    capabilities: ["CNC Machining", "Lathe Turning"],
    certifications: ["ISO 9001"],
    verificationStatus: "VERIFIED",
  });

  // Base list combines registered manufacturers from store
  const registeredUsers = manufacturers.map((mfg, idx) => ({
    id: `MFG-${idx + 101}`,
    name: mfg.pseudoName,
    email: `contact@${mfg.pseudoName.toLowerCase().replace(/[^a-z0-9]/g, "")}.in`,
    role: "Manufacturer",
    status: mfg.verificationStatus === "VERIFIED" ? "Verified" : "Pending",
    location: `${mfg.city}, ${mfg.state}`,
    joinDate: "2026-09-28",
    activity: `${mfg.capabilities.join(", ")}`,
  }));

  const handleOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName.trim()) return;

    onboardManufacturer({
      companyName: formData.companyName,
      city: formData.city,
      state: formData.state,
      capabilities: formData.capabilities,
      certifications: formData.certifications,
      verificationStatus: "VERIFIED",
    });

    setIsOnboardModalOpen(false);
    alert(`MSME Manufacturer "${formData.companyName}" successfully onboarded with verified status!`);

    // Reset form
    setFormData({
      companyName: "",
      contactPerson: "",
      email: "",
      phoneNumber: "",
      city: "Indore",
      state: "Madhya Pradesh",
      gstNumber: "",
      capabilities: ["CNC Machining", "Lathe Turning"],
      certifications: ["ISO 9001"],
      verificationStatus: "VERIFIED",
    });
  };

  const filteredUsers = registeredUsers.filter((u) => {
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Super Admin User & MSME Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit client accounts, MSME factory credentials, and verification statuses
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOnboardModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition active:scale-98"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Onboard New Manufacturer</span>
          </button>

          <button
            onClick={() => alert("Exporting all user records to CSV...")}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-slate-700 text-xs font-semibold shadow-2xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Users</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs">
          <div className="text-2xl font-extrabold text-blue-600">{manufacturers.length}</div>
          <span className="text-xs font-semibold text-gray-500">Total Manufacturers</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs">
          <div className="text-2xl font-extrabold text-emerald-600">
            {manufacturers.filter((m) => m.verificationStatus === "VERIFIED").length}
          </div>
          <span className="text-xs font-semibold text-gray-500">Verified MSMEs</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs">
          <div className="text-2xl font-extrabold text-amber-600">
            {manufacturers.filter((m) => m.verificationStatus !== "VERIFIED").length}
          </div>
          <span className="text-xs font-semibold text-gray-500">Pending Verification</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs">
          <div className="text-2xl font-extrabold text-slate-800">100%</div>
          <span className="text-xs font-semibold text-gray-500">Anti-Bypass Protection</span>
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
            placeholder="Search by facility name, ID, or city..."
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
            <option>Verified</option>
            <option>Pending</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
              <Users className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-base font-bold text-slate-900">0 MSMEs in Directory (Clean Slate Mode)</h3>
              <p className="text-xs text-slate-500">
                All pre-populated mock manufacturers have been cleared. Click "Onboard New Manufacturer" to register a verified precision workshop.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setIsOnboardModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-2xs transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Onboard First MSME</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/75 text-gray-500 font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3.5">User / Facility</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Location</th>
                  <th className="px-6 py-3.5">Capabilities</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-slate-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{user.name}</div>
                      <div className="text-[11px] text-gray-500">{user.email}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{user.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-800">{user.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle className="w-3 h-3" />
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.location}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{user.activity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Onboard Modal */}
      {isOnboardModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-gray-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Factory className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Super Admin: Onboard Verified MSME</h3>
                  <span className="text-[10px] text-gray-500">Auto-assigns pseudonym & anti-bypass code</span>
                </div>
              </div>
              <button onClick={() => setIsOnboardModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleOnboardSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Company / Facility Legal Name</label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="e.g. Apex Precision Engineering Works"
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">City</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Indore</option>
                    <option>Pune</option>
                    <option>Ahmedabad</option>
                    <option>Rajkot</option>
                    <option>Bengaluru</option>
                    <option>Chennai</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">GST Identification Number</label>
                <input
                  type="text"
                  value={formData.gstNumber}
                  onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                  placeholder="23AAACP1234F1Z5"
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-[11px] leading-relaxed">
                <strong>Anti-Bypass Compliance:</strong> Fabricaze generates an anonymous ID for buyer interactions to safeguard trade transactions under platform escrow.
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
                >
                  Onboard & Verify Facility
                </button>
                <button
                  type="button"
                  onClick={() => setIsOnboardModalOpen(false)}
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
  );
}
