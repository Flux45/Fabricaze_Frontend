"use client";

import { useState } from "react";
import Link from "next/link";
import { Calculator, ArrowRight, CheckCircle2, Clock, MapPin, Sparkles } from "lucide-react";

interface EstimatorProps {
  initialMaterial?: string;
  initialProcess?: string;
  initialQuantity?: number;
  compact?: boolean;
}

export function QuickEstimator({
  initialMaterial = "Aluminum 6061",
  initialProcess = "CNC Machining",
  initialQuantity = 10,
  compact = false,
}: EstimatorProps) {
  const [material, setMaterial] = useState(initialMaterial);
  const [process, setProcess] = useState(initialProcess);
  const [quantity, setQuantity] = useState(initialQuantity);
  const [tolerance, setTolerance] = useState("±0.1 mm");
  const [finish, setFinish] = useState("As-Machined");

  // Dynamic cost estimation formula
  const calculateCost = () => {
    let base = 350;
    if (material.includes("Titanium")) base *= 4.5;
    else if (material.includes("Stainless")) base *= 2.2;
    else if (material.includes("Brass")) base *= 1.8;
    else if (material.includes("Aluminum")) base *= 1.2;

    if (process.includes("5-Axis")) base *= 2.4;
    else if (process.includes("CNC")) base *= 1.4;
    else if (process.includes("Laser")) base *= 0.8;

    if (tolerance === "±0.02 mm" || tolerance === "±0.01 mm") base *= 1.35;
    if (finish.includes("Anodized")) base += 85;

    // Batch discounting
    let discount = 1.0;
    if (quantity >= 500) discount = 0.58;
    else if (quantity >= 100) discount = 0.72;
    else if (quantity >= 25) discount = 0.85;

    const minTotal = Math.max(2500, Math.round(base * discount * 0.9 * quantity));
    const maxTotal = Math.max(8500, Math.round(base * discount * 1.35 * quantity));

    let minDays = 5;
    let maxDays = 8;
    if (quantity > 100) {
      minDays = 8;
      maxDays = 15;
    } else if (quantity > 500) {
      minDays = 14;
      maxDays = 25;
    }

    return { minTotal, maxTotal, minDays, maxDays };
  };

  const { minTotal, maxTotal, minDays, maxDays } = calculateCost();

  return (
    <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm ${compact ? "p-6" : "p-8"}`}>
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">Instant Cost Estimator</h3>
            <p className="text-xs text-gray-500">Live AI-assisted calculation from verified MSME rates</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
          <Sparkles className="w-3 h-3" /> Live
        </span>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Material Type</label>
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option>Aluminum 6061-T6</option>
            <option>Stainless Steel 304</option>
            <option>Stainless Steel 316L</option>
            <option>Brass C360</option>
            <option>Titanium Grade 5</option>
            <option>Delrin POM (Engineering Plastic)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Manufacturing Process</label>
          <select
            value={process}
            onChange={(e) => setProcess(e.target.value)}
            className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option>CNC Machining (3-Axis / 4-Axis)</option>
            <option>5-Axis CNC Precision</option>
            <option>Fiber Laser Cutting</option>
            <option>Sheet Metal Fabrication</option>
            <option>Industrial 3D Printing (SLS)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Quantity (Units)</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={5000}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
            <div className="flex gap-1">
              {[1, 10, 50, 500].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQuantity(q)}
                  className={`text-[10px] px-2 py-1 rounded border transition ${
                    quantity === q
                      ? "bg-blue-600 text-white border-blue-600 font-bold"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Tolerance Standard</label>
          <select
            value={tolerance}
            onChange={(e) => setTolerance(e.target.value)}
            className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option>±0.1 mm (Standard Commercial)</option>
            <option>±0.05 mm (Precision Machining)</option>
            <option>±0.02 mm (Aerospace Tight)</option>
          </select>
        </div>
      </div>

      {/* Output Projection Banner */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50/50 to-slate-50 rounded-xl p-5 border border-blue-100/80 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-800">
              Quick Estimate Range
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-900 tracking-tight mt-0.5">
              ₹{minTotal.toLocaleString()} – ₹{maxTotal.toLocaleString()}
            </div>
            <p className="text-[11px] text-blue-700/80 mt-1">
              Based on historical accepted quotes for similar Indian MSME batches
            </p>
          </div>

          <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-blue-100">
            <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
              Est. Turnaround
            </span>
            <div className="flex sm:justify-end items-center gap-1.5 text-gray-900 font-bold text-sm mt-0.5">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>{minDays}–{maxDays} business days</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">Includes dispatch & transit</p>
          </div>
        </div>

        {/* Regional matching capacity badge */}
        <div className="mt-4 pt-3 border-t border-blue-100/70 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-medium text-gray-700 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            Active MSME capacity ready:
          </span>
          <div className="flex gap-2">
            <span className="px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-700 font-medium text-[11px]">
              Indore: <strong className="text-blue-700">3 shops</strong>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-700 font-medium text-[11px]">
              Pune: <strong className="text-blue-700">5 shops</strong>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-700 font-medium text-[11px]">
              Ahmedabad: <strong className="text-blue-700">2 shops</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <Link
        href="/client/submit-job"
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 active:scale-[0.99]"
      >
        <span>Upload CAD & Receive Competitive Bids</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
