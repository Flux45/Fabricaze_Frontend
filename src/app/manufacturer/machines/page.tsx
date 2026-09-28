"use client";

import { useState } from "react";
import Link from "next/link";
import { Wrench, Plus, CheckCircle2, Trash2, Power, X, Layers } from "lucide-react";
import { IMachine } from "@/types";

export default function ManufacturerMachinesPage() {
  const [machines, setMachines] = useState<IMachine[]>([
    {
      id: "mac-01",
      name: "Haas VF-2SS 3-Axis VMC",
      machineType: "CNC Milling",
      xAxisMm: 762,
      yAxisMm: 406,
      zAxisMm: 508,
      hourlyRateInr: 1200,
      isActive: true,
      supportedMaterials: ["Aluminum 6061-T6", "SS 304", "Brass C360"],
    },
    {
      id: "mac-02",
      name: "Mazak Quick Turn 250MSY CNC Lathe",
      machineType: "CNC Turning",
      xAxisMm: 230,
      zAxisMm: 575,
      hourlyRateInr: 950,
      isActive: true,
      supportedMaterials: ["Mild Steel EN8", "Aluminum 7075", "Delrin POM"],
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMachine, setNewMachine] = useState({
    name: "",
    machineType: "CNC Milling",
    xAxisMm: 800,
    yAxisMm: 500,
    zAxisMm: 500,
    hourlyRateInr: 1500,
    supportedMaterials: "Aluminum 6061, Stainless Steel",
  });

  const toggleStatus = (id: string) => {
    setMachines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isActive: !m.isActive } : m))
    );
  };

  const deleteMachine = (id: string) => {
    if (confirm("Are you sure you want to remove this machine from your active fleet?")) {
      setMachines((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleAddMachine = (e: React.FormEvent) => {
    e.preventDefault();
    const created: IMachine = {
      id: `mac-${Date.now()}`,
      name: newMachine.name,
      machineType: newMachine.machineType,
      xAxisMm: newMachine.xAxisMm,
      yAxisMm: newMachine.yAxisMm,
      zAxisMm: newMachine.zAxisMm,
      hourlyRateInr: newMachine.hourlyRateInr,
      isActive: true,
      supportedMaterials: newMachine.supportedMaterials.split(",").map((s) => s.trim()),
    };
    setMachines([...machines, created]);
    setIsAddModalOpen(false);
    setNewMachine({
      name: "",
      machineType: "CNC Milling",
      xAxisMm: 800,
      yAxisMm: 500,
      zAxisMm: 500,
      hourlyRateInr: 1500,
      supportedMaterials: "Aluminum 6061, Stainless Steel",
    });
  };

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
              Machine Fleet & Operational Capacity
            </h1>
            <p className="text-xs text-slate-500">
              Register CNC centers, working envelope travels, and hourly shop rates to receive matched RFQs automatically.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Machine</span>
            </button>
          </div>
        </div>

        {/* Machine Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {machines.map((machine) => (
            <div
              key={machine.id}
              className={`bg-white rounded-2xl p-6 border shadow-2xs space-y-4 transition ${
                machine.isActive ? "border-gray-200" : "border-gray-200 opacity-60 bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base">{machine.name}</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        machine.isActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-gray-100 text-gray-500 border border-gray-200"
                      }`}
                    >
                      {machine.isActive ? "Active / Idle Spindle" : "Offline / Maintenance"}
                    </span>
                  </div>
                  <span className="text-xs text-blue-600 font-semibold">{machine.machineType}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleStatus(machine.id)}
                    className={`p-2 rounded-xl border text-xs transition ${
                      machine.isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                        : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                    }`}
                    title="Toggle Machine Status"
                  >
                    <Power className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteMachine(machine.id)}
                    className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition"
                    title="Delete Machine"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Envelope Specifications */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-gray-100 text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">X-Travel</span>
                  <span className="font-bold text-slate-800">{machine.xAxisMm} mm</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Y-Travel</span>
                  <span className="font-bold text-slate-800">{machine.yAxisMm || "-"} mm</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Z-Travel</span>
                  <span className="font-bold text-slate-800">{machine.zAxisMm} mm</span>
                </div>
              </div>

              {/* Hourly rate & materials */}
              <div className="text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Shop Hourly Rate:</span>
                  <span className="font-extrabold text-blue-600">₹{machine.hourlyRateInr?.toLocaleString()}/hr</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Supported Materials:</span>
                  <div className="flex flex-wrap gap-1">
                    {machine.supportedMaterials.map((mat) => (
                      <span key={mat} className="px-2 py-0.5 rounded text-[10px] bg-gray-100 text-gray-700">
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Machine Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-gray-200 shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-bold text-slate-900 text-base">Register Machine to Fleet</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddMachine} className="space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Machine Name / Model</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Haas VF-4 4-Axis VMC"
                    value={newMachine.name}
                    onChange={(e) => setNewMachine({ ...newMachine, name: e.target.value })}
                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Type</label>
                    <select
                      value={newMachine.machineType}
                      onChange={(e) => setNewMachine({ ...newMachine, machineType: e.target.value })}
                      className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500"
                    >
                      <option>CNC Milling</option>
                      <option>CNC Turning</option>
                      <option>5-Axis CNC</option>
                      <option>Laser Cutting</option>
                      <option>Sheet Metal Press</option>
                      <option>3D Printer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Hourly Rate (INR)</label>
                    <input
                      type="number"
                      required
                      value={newMachine.hourlyRateInr}
                      onChange={(e) => setNewMachine({ ...newMachine, hourlyRateInr: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">X-Travel (mm)</label>
                    <input
                      type="number"
                      value={newMachine.xAxisMm}
                      onChange={(e) => setNewMachine({ ...newMachine, xAxisMm: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Y-Travel (mm)</label>
                    <input
                      type="number"
                      value={newMachine.yAxisMm}
                      onChange={(e) => setNewMachine({ ...newMachine, yAxisMm: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Z-Travel (mm)</label>
                    <input
                      type="number"
                      value={newMachine.zAxisMm}
                      onChange={(e) => setNewMachine({ ...newMachine, zAxisMm: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Supported Materials (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={newMachine.supportedMaterials}
                    onChange={(e) => setNewMachine({ ...newMachine, supportedMaterials: e.target.value })}
                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500"
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
                    className="px-4 py-2.5 rounded-xl border border-gray-300 text-slate-700 font-semibold text-xs hover:bg-gray-50 transition"
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
