"use client";

import { useState } from "react";
import Link from "next/link";
import { Wrench, Plus, CheckCircle2, Power, X, Layers, Activity, Cpu, ShieldCheck } from "lucide-react";
import { useFabricazeStore } from "@/lib/fabricazeStore";
import { IMachine } from "@/types";

export default function ManufacturerMachinesPage() {
  const { machines, addMachine } = useFabricazeStore();
  const [activeMachines, setActiveMachines] = useState<IMachine[]>(machines);
  const [filterType, setFilterType] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newMachine, setNewMachine] = useState({
    name: "",
    machineType: "CNC Milling",
    xAxisMm: 800,
    yAxisMm: 500,
    zAxisMm: 500,
    hourlyRateInr: 1500,
    supportedMaterials: "Aluminum 6061, Stainless Steel, Brass",
  });

  const machineTypes = [
    "All",
    "CNC Lathe / Turning",
    "Engine Lathe",
    "CNC Milling (VMC)",
    "5-Axis CNC",
    "Turret Milling Machine",
    "Fiber Laser Cutting",
    "CNC Press Brake",
    "Metal 3D Printing (DMLS)",
  ];

  const handleToggleStatus = (id: string) => {
    setActiveMachines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isActive: !m.isActive } : m))
    );
  };

  const handleAddMachine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMachine.name.trim()) return;

    const created = addMachine({
      name: newMachine.name,
      machineType: newMachine.machineType,
      xAxisMm: newMachine.xAxisMm,
      yAxisMm: newMachine.yAxisMm,
      zAxisMm: newMachine.zAxisMm,
      maxPartSizeMm: Math.max(newMachine.xAxisMm, newMachine.yAxisMm, newMachine.zAxisMm),
      hourlyRateInr: newMachine.hourlyRateInr,
      supportedMaterials: newMachine.supportedMaterials.split(",").map((s) => s.trim()),
    });

    setActiveMachines((prev) => [created, ...prev]);
    setIsAddModalOpen(false);
    setNewMachine({
      name: "",
      machineType: "CNC Milling",
      xAxisMm: 800,
      yAxisMm: 500,
      zAxisMm: 500,
      hourlyRateInr: 1500,
      supportedMaterials: "Aluminum 6061, Stainless Steel, Brass",
    });
  };

  const displayList = activeMachines.length > 0 ? activeMachines : machines;

  const filteredMachines = displayList.filter((m) => {
    if (filterType === "All") return true;
    return m.machineType.toLowerCase().includes(filterType.toLowerCase());
  });

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Capacity & Tooling
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Industrial Machine Fleet & Specifications
            </h1>
            <p className="text-xs text-slate-500">
              Standard real-world industrial machinery specs (Lathe, Milling, 5-Axis, Fiber Laser, Press Brake, Metal 3D Printing).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Machine</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
          {machineTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition ${
                filterType === type
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-white text-slate-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Machine Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMachines.map((m) => (
            <div
              key={m.id}
              className={`bg-white rounded-2xl p-6 border transition flex flex-col justify-between shadow-2xs ${
                m.isActive ? "border-gray-200 hover:border-gray-300" : "border-gray-200 opacity-60 bg-gray-50"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {m.machineType}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mt-1.5 leading-snug">{m.name}</h3>
                  </div>
                  <button
                    onClick={() => handleToggleStatus(m.id)}
                    title={m.isActive ? "Mark machine offline" : "Mark machine active"}
                    className={`p-1.5 rounded-lg border transition ${
                      m.isActive
                        ? "text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
                        : "text-gray-400 bg-gray-100 border-gray-200 hover:bg-gray-200"
                    }`}
                  >
                    <Power className="w-4 h-4" />
                  </button>
                </div>

                {/* Working Envelope */}
                <div className="bg-slate-50 rounded-xl p-3 border border-gray-100 text-xs space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    Working Envelope & Travels
                  </span>
                  <div className="grid grid-cols-3 gap-2 font-mono text-slate-800">
                    <div>
                      <span className="text-gray-400 block text-[9px]">X-Axis</span>
                      <span className="font-bold">{m.xAxisMm} mm</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[9px]">Y-Axis</span>
                      <span className="font-bold">{m.yAxisMm ? `${m.yAxisMm} mm` : "—"}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[9px]">Z-Axis</span>
                      <span className="font-bold">{m.zAxisMm} mm</span>
                    </div>
                  </div>
                </div>

                {/* Materials */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
                    Supported Raw Materials
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(m.supportedMaterials || []).map((mat) => (
                      <span
                        key={mat}
                        className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                      >
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-semibold">Shop Spindle Rate</span>
                  <span className="font-extrabold text-slate-900 text-base">₹{(m.hourlyRateInr || 1200).toLocaleString()}/hr</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      m.isActive ? "bg-emerald-500 animate-pulse" : "bg-gray-300"
                    }`}
                  />
                  <span className="text-[11px] font-semibold text-gray-600">
                    {m.isActive ? "Spindle Available" : "Maintenance / Idle"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Machine Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-gray-200 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Add Shop Machine Tool</h3>
                    <span className="text-[10px] text-gray-500">Expands RFQ matching coverage</span>
                  </div>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddMachine} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Make & Model</label>
                  <input
                    type="text"
                    required
                    value={newMachine.name}
                    onChange={(e) => setNewMachine({ ...newMachine, name: e.target.value })}
                    placeholder="e.g. DMG Mori NVX 5080 II"
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Machining Category</label>
                  <select
                    value={newMachine.machineType}
                    onChange={(e) => setNewMachine({ ...newMachine, machineType: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>CNC Milling</option>
                    <option>CNC Turning</option>
                    <option>5-Axis CNC</option>
                    <option>Fiber Laser Cutting</option>
                    <option>Press Brake</option>
                    <option>Direct Metal 3D Printing</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">X Travel (mm)</label>
                    <input
                      type="number"
                      value={newMachine.xAxisMm}
                      onChange={(e) => setNewMachine({ ...newMachine, xAxisMm: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Y Travel (mm)</label>
                    <input
                      type="number"
                      value={newMachine.yAxisMm}
                      onChange={(e) => setNewMachine({ ...newMachine, yAxisMm: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Z Travel (mm)</label>
                    <input
                      type="number"
                      value={newMachine.zAxisMm}
                      onChange={(e) => setNewMachine({ ...newMachine, zAxisMm: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Hourly Spindle Rate (₹/hr)</label>
                  <input
                    type="number"
                    value={newMachine.hourlyRateInr}
                    onChange={(e) => setNewMachine({ ...newMachine, hourlyRateInr: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Supported Materials (comma separated)</label>
                  <input
                    type="text"
                    value={newMachine.supportedMaterials}
                    onChange={(e) => setNewMachine({ ...newMachine, supportedMaterials: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
                  >
                    Save Machine
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
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
