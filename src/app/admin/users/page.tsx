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
} from "lucide-react";

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);

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

  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phoneNumber: "",
    city: "Indore",
    state: "Madhya Pradesh",
    gstNumber: "",
    capabilities: ["CNC Machining"],
    certifications: ["ISO 9001"],
    verificationStatus: "Verified",
  });

  const toggleVerify = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === "Verified" ? "Pending" : "Verified" } : u
      )
    );
  };

  const handleOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `USR-00${users.length + 1}`;
    const newUser = {
      id: newId,
      name: formData.companyName,
      email: formData.email,
      role: "Manufacturer",
      status: formData.verificationStatus,
      location: `${formData.city}, ${formData.state === "Madhya Pradesh" ? "MP" : formData.state === "Maharashtra" ? "MH" : "GJ"}`,
      joinDate: new Date().toISOString().split("T")[0],
      activity: "0 jobs completed (New Onboarding)",
    };

    setUsers([newUser, ...users]);
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
      capabilities: ["CNC Machining"],
      certifications: ["ISO 9001"],
      verificationStatus: "Verified",
    });
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
      {/* Header matching Page 18 mockup + "+ Onboard New Manufacturer" CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Management</h1>
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
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded transition ${
                        user.status === "Verified"
                          ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white"
                      }`}
                    >
                      {user.status === "Verified" ? "Revoke" : "Approve MSME"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboard New Manufacturer Modal */}
      {isOnboardModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 border border-gray-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Factory className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Onboard New MSME Manufacturer</h3>
                  <p className="text-xs text-slate-500">Register facility credentials, GSTIN, and machine capabilities</p>
                </div>
              </div>
              <button
                onClick={() => setIsOnboardModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleOnboardSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Company / Facility Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Malwa Precision Engineering"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Sharma"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    placeholder="contact@malwaprecision.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91-9826012345"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Manufacturing Hub</label>
                  <select
                    value={formData.city}
                    onChange={(e) => {
                      const c = e.target.value;
                      let s = "Madhya Pradesh";
                      if (c === "Pune") s = "Maharashtra";
                      else if (c === "Ahmedabad") s = "Gujarat";
                      else if (c === "Bengaluru") s = "Karnataka";
                      setFormData({ ...formData, city: c, state: s });
                    }}
                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-2.5 focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option>Indore</option>
                    <option>Pune</option>
                    <option>Ahmedabad</option>
                    <option>Bengaluru</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    GSTIN / Udyam Registration Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="23AAECM1234F1Z9 or UDYAM-MP-23-009182"
                    value={formData.gstNumber}
                    onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Primary Machining Capabilities
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {["CNC Machining", "5-Axis CNC", "Laser Cutting", "Sheet Metal", "3D Printing", "Heat Treatment"].map(
                    (cap) => (
                      <label key={cap} className="flex items-center gap-1.5 p-2 rounded-lg bg-gray-50 border border-gray-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.capabilities.includes(cap)}
                          onChange={() => {
                            setFormData((prev) => ({
                              ...prev,
                              capabilities: prev.capabilities.includes(cap)
                                ? prev.capabilities.filter((c) => c !== cap)
                                : [...prev.capabilities, cap],
                            }));
                          }}
                          className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                        />
                        <span className="text-[11px] font-medium text-slate-800">{cap}</span>
                      </label>
                    )
                  )}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-blue-900 text-[11px] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p>
                  Anonymized pseudo-name identifier (e.g. <strong>{formData.companyName || "Vendor"} #{formData.city.slice(0, 3).toUpperCase()}-4821</strong>) will be auto-generated to protect the platform from client bypass.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
                >
                  Onboard & Activate Manufacturer
                </button>
                <button
                  type="button"
                  onClick={() => setIsOnboardModalOpen(false)}
                  className="px-5 py-3 rounded-xl border border-gray-300 text-slate-700 font-semibold text-xs hover:bg-gray-50 transition"
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
