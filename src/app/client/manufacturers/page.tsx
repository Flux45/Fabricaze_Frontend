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
} from "lucide-react";
import { INITIAL_MANUFACTURERS } from "@/lib/mockData";

export default function FindManufacturersPage() {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>(["CNC Machining"]);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);

  const capabilitiesList = [
    "CNC Machining",
    "Laser Cutting",
    "3D Printing",
    "Sheet Metal",
    "Welding",
    "Casting",
    "Heat Treatment",
    "5-Axis CNC",
    "CMM Inspection",
    "Design Support",
    "Rapid Prototyping",
    "Assembly",
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

  const filteredManufacturers = INITIAL_MANUFACTURERS.filter((mfg) => {
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
          {/* Left Filters Sidebar (Cols 1-4) matching mockup */}
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

              {/* Search */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Search</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search manufacturers..."
                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Location</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option>All Cities</option>
                  <option>Indore</option>
                  <option>Pune</option>
                  <option>Ahmedabad</option>
                </select>
              </div>

              {/* Capabilities Checkboxes */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Capabilities</label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {capabilitiesList.map((cap) => (
                    <label key={cap} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCapabilities.includes(cap)}
                        onChange={() => toggleCapability(cap)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                      />
                      <span>{cap}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Certifications Checkboxes */}
              <div className="pt-2 border-t border-gray-100">
                <label className="block text-xs font-semibold text-gray-700 mb-2">Certifications</label>
                <div className="space-y-1.5">
                  {certificationsList.map((cert) => (
                    <label key={cert} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCertifications.includes(cert)}
                        onChange={() => toggleCertification(cert)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                      />
                      <span>{cert}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Results Column (Cols 5-12) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Header + List / Map Toggle */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-2xs flex items-center justify-between">
              <div>
                <h1 className="text-base font-bold text-slate-900">Find Manufacturers</h1>
                <p className="text-xs text-gray-500">
                  {filteredManufacturers.length} verified manufacturers found
                </p>
              </div>

              <div className="inline-flex rounded-lg bg-gray-100 p-0.5 border border-gray-200">
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                    viewMode === "list"
                      ? "bg-white text-blue-600 shadow-2xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>List View</span>
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                    viewMode === "map"
                      ? "bg-white text-blue-600 shadow-2xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Map className="w-3.5 h-3.5" />
                  <span>Map View</span>
                </button>
              </div>
            </div>

            {/* Map View Display */}
            {viewMode === "map" ? (
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs text-center space-y-4">
                <div className="bg-slate-900 text-white rounded-xl p-8 relative overflow-hidden h-80 flex flex-col items-center justify-center">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  <MapPin className="w-10 h-10 text-blue-500 mb-2 animate-bounce" />
                  <h3 className="text-lg font-bold">Interactive Industrial Map</h3>
                  <p className="text-xs text-slate-400 max-w-sm mt-1">
                    Visualizing audited MSME manufacturing clusters across Indore (Pologround), Pune (Bhosari), and Ahmedabad (Naroda).
                  </p>
                  <div className="mt-4 flex gap-3 text-xs">
                    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      📍 Indore: 3 Active Shops
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      📍 Pune: 5 Active Shops
                    </span>
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      📍 Ahmedabad: 2 Active Shops
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* List View Cards matching Page 16 / Page 10 mockup */
              <div className="space-y-4">
                {filteredManufacturers.map((mfg) => (
                  <div
                    key={mfg.id}
                    className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs hover:border-blue-300 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      {/* Left: Avatar & Info */}
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 font-bold text-base flex items-center justify-center shrink-0 border border-blue-100">
                          {mfg.pseudoName.charAt(0)}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900 text-base">
                              {mfg.pseudoName}
                            </h3>
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle className="w-3 h-3" /> Verified
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1 text-amber-500 font-semibold">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <span>{mfg.rating}</span>
                              <span className="text-gray-400 font-normal">
                                ({mfg.reviewCount} reviews)
                              </span>
                            </span>
                            <span>•</span>
                            <span>{mfg.city}, {mfg.state}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-emerald-600 font-medium">
                              <Clock className="w-3 h-3" />
                              <span>{mfg.responseTime}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Price & Distance */}
                      <div className="sm:text-right space-y-1">
                        <span className="text-[11px] text-gray-500 block">Price Range</span>
                        <div className="text-sm font-bold text-slate-800">{mfg.priceRange}</div>
                        <span className="text-xs text-gray-500 block">{mfg.distanceKm} km away</span>
                      </div>
                    </div>

                    {/* Capabilities & Specialties */}
                    <div className="space-y-2 pt-2 border-t border-gray-100">
                      <div className="flex flex-wrap items-center gap-1.5 text-xs">
                        <span className="text-gray-500 text-[11px] mr-1">Capabilities:</span>
                        {mfg.capabilities.map((cap) => (
                          <span
                            key={cap}
                            className="px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-700"
                          >
                            {cap}
                          </span>
                        ))}
                      </div>

                      {mfg.specialties && (
                        <div className="flex flex-wrap items-center gap-1.5 text-xs">
                          <span className="text-gray-500 text-[11px] mr-1">Specialties:</span>
                          {mfg.specialties.map((spec) => (
                            <span
                              key={spec}
                              className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <button
                        onClick={() => alert(`Viewing verified MSME profile for ${mfg.pseudoName}`)}
                        className="text-xs text-gray-600 hover:text-slate-900 font-semibold"
                      >
                        View Profile & Spindle Hours
                      </button>

                      <Link
                        href="/client/submit-job"
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition"
                      >
                        Request Direct Quote
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
