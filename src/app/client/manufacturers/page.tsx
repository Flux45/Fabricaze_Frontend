"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  CheckCircle,
  Star,
  Clock,
  Filter,
  Layers,
  ArrowRight,
  List,
  Map,
  ShieldCheck,
  Plus,
  X,
  Factory,
  Building2,
} from "lucide-react";
import { useFabricazeStore } from "@/lib/fabricazeStore";
import { IManufacturer } from "@/types";

export default function FindManufacturersPage() {
  const { manufacturers, onboardManufacturer } = useFabricazeStore();
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([]);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);

  // New onboarding form state
  const [newMfgName, setNewMfgName] = useState("");
  const [newMfgCity, setNewMfgCity] = useState("Indore");
  const [newMfgCaps, setNewMfgCaps] = useState("CNC Machining, Lathe Turning");

  const capabilitiesList = [
    "CNC Machining",
    "Lathe Turning",
    "Laser Cutting",
    "3D Printing",
    "Sheet Metal",
    "Welding",
    "Casting",
    "Heat Treatment",
    "5-Axis CNC",
    "CMM Inspection",
  ];

  const certificationsList = ["ISO 9001", "AS9100", "ISO 14001", "IATF 16949", "CE"];

  const toggleCapability = (cap: string) => {
    setSelectedCapabilities((prev) =>
      prev.includes(cap) ? prev.filter((c) => c !== cap) : [...prev, cap]
    );
  };

  const toggleCertification = (cert: string) => {
    setSelectedCertifications((prev) =>
      prev.includes(cert) ? prev.filter((c) => c !== cert) : [...prev, cert]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCity("All Cities");
    setSelectedCapabilities([]);
    setSelectedCertifications([]);
  };

  const handleOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMfgName.trim()) return;

    onboardManufacturer({
      companyName: newMfgName,
      city: newMfgCity,
      capabilities: newMfgCaps.split(",").map((c) => c.trim()),
      certifications: ["ISO 9001:2015"],
    });

    setIsOnboardModalOpen(false);
    setNewMfgName("");
  };

  const filteredManufacturers = manufacturers.filter((mfg) => {
    const matchesSearch =
      mfg.pseudoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mfg.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mfg.state.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCity =
      selectedCity === "All Cities" || mfg.city.toLowerCase() === selectedCity.toLowerCase();

    const matchesCap =
      selectedCapabilities.length === 0 ||
      selectedCapabilities.some((c) => mfg.capabilities.includes(c));

    const matchesCert =
      selectedCertifications.length === 0 ||
      selectedCertifications.some((cert) => mfg.certifications.includes(cert));

    return matchesSearch && matchesCity && matchesCap && matchesCert;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Filters Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Filter className="w-4 h-4 text-blue-600" />
                  Filters
                </h3>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Clear All Filters
                </button>
              </div>

              {/* Location Select */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Manufacturing Hub
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>All Cities</option>
                    <option>Indore</option>
                    <option>Pune</option>
                    <option>Ahmedabad</option>
                    <option>Rajkot</option>
                    <option>Bengaluru</option>
                  </select>
                </div>
              </div>

              {/* Capabilities Checkboxes */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">
                  Machining Capabilities
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {capabilitiesList.map((cap) => (
                    <label key={cap} className="flex items-center gap-2 cursor-pointer text-xs text-gray-600">
                      <input
                        type="checkbox"
                        checked={selectedCapabilities.includes(cap)}
                        onChange={() => toggleCapability(cap)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                      />
                      <span>{cap}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Certifications Checkboxes */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">
                  Quality Certifications
                </label>
                <div className="space-y-2">
                  {certificationsList.map((cert) => (
                    <label key={cert} className="flex items-center gap-2 cursor-pointer text-xs text-gray-600">
                      <input
                        type="checkbox"
                        checked={selectedCertifications.includes(cert)}
                        onChange={() => toggleCertification(cert)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                      />
                      <span>{cert}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Action: Register new MSME */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 space-y-4 shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Factory className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Are you an MSME Fabricator?</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Register your lathe, milling, or laser capacity to start bidding on verified industrial RFQs.
                </p>
              </div>
              <button
                onClick={() => setIsOnboardModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Onboard New Manufacturer</span>
              </button>
            </div>
          </div>

          {/* Right Main Content (Cols 5-12) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Verified Manufacturer Directory
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Browse vetted precision MSMEs with anonymized anti-bypass IDs and ISO-compliant QC
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsOnboardModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Manufacturer</span>
                </button>
                <div className="bg-white border border-gray-200 rounded-xl p-1 flex">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-lg text-xs font-semibold ${
                      viewMode === "list" ? "bg-slate-100 text-slate-900" : "text-gray-400 hover:text-slate-600"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("map")}
                    className={`p-1.5 rounded-lg text-xs font-semibold ${
                      viewMode === "map" ? "bg-slate-100 text-slate-900" : "text-gray-400 hover:text-slate-600"
                    }`}
                  >
                    <Map className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Search Input Bar */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by facility capabilities, city, or MSME identifier..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              />
            </div>

            {/* Zero State if empty */}
            {filteredManufacturers.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center shadow-2xs space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
                  <Factory className="w-8 h-8" />
                </div>
                <div className="max-w-md mx-auto space-y-2">
                  <h3 className="text-lg font-bold text-slate-900">0 Manufacturers Listed (Clean Slate Mode)</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    All pre-populated dummy manufacturer profiles have been removed per your reset instruction.
                    You can onboard new real-world MSME manufacturing facilities anytime using the button below or via the Super Admin portal.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => setIsOnboardModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Onboard First Manufacturer</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredManufacturers.map((mfg) => (
                  <div
                    key={mfg.id}
                    className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs hover:border-gray-300 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-base">{mfg.pseudoName}</h3>
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <ShieldCheck className="w-3 h-3" /> {mfg.verificationStatus}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1 font-semibold text-slate-700">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {mfg.rating} ({mfg.reviewCount} jobs)
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {mfg.city}, {mfg.state}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {mfg.responseTime} response
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href="/client/submit-job"
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-2xs flex items-center gap-1"
                        >
                          <span>Request Quote</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-1.5">
                      {mfg.capabilities.map((cap) => (
                        <span
                          key={cap}
                          className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-medium"
                        >
                          {cap}
                        </span>
                      ))}
                      {mfg.certifications.map((cert) => (
                        <span
                          key={cert}
                          className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-md font-semibold"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Onboarding Modal */}
        {isOnboardModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-gray-200 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Factory className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Onboard New MSME Partner</h3>
                    <span className="text-[10px] text-gray-500">Auto-assigns anonymized anti-bypass ID</span>
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
                    value={newMfgName}
                    onChange={(e) => setNewMfgName(e.target.value)}
                    placeholder="e.g. Apex Precision Engineering Works"
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Manufacturing City / Cluster</label>
                  <select
                    value={newMfgCity}
                    onChange={(e) => setNewMfgCity(e.target.value)}
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
                  <label className="block text-slate-700 font-semibold mb-1">Core Capabilities (comma separated)</label>
                  <input
                    type="text"
                    value={newMfgCaps}
                    onChange={(e) => setNewMfgCaps(e.target.value)}
                    placeholder="CNC Machining, Lathe Turning, Fiber Laser"
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-[11px] leading-relaxed">
                  <strong>Disintermediation Protection:</strong> The public directory displays an auto-generated pseudonym (e.g. <code>Apex Works #IND-4821</code>) to protect trade flow and guarantee escrow settlement.
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
                  >
                    Complete Onboarding
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
    </div>
  );
}
