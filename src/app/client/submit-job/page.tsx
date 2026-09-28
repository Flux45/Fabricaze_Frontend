"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Info,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useFabricazeStore } from "@/lib/fabricazeStore";

export default function SubmitJobPage() {
  const router = useRouter();
  const { createRfq, activeClient } = useFabricazeStore();

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("Custom CNC Aluminum Housing");
  const [material, setMaterial] = useState("Aluminum 6061-T6");
  const [process, setProcess] = useState("CNC Machining");
  const [quantity, setQuantity] = useState(10);
  const [tolerance, setTolerance] = useState("±0.05 mm");
  const [surfaceFinish, setSurfaceFinish] = useState("As-Machined");
  const [deliveryDate, setDeliveryDate] = useState("2026-10-15");
  const [instructions, setInstructions] = useState("");
  const [createdRfqCode, setCreatedRfqCode] = useState<string | null>(null);

  // Dynamic cost calculation based on selected parameters
  const calculateEstimate = () => {
    let base = 350;
    if (material.includes("Titanium")) base *= 4.5;
    else if (material.includes("Stainless")) base *= 2.2;
    else if (material.includes("Brass")) base *= 1.8;
    else if (material.includes("Aluminum")) base *= 1.2;

    if (process.includes("5-Axis")) base *= 2.4;
    else if (process.includes("CNC")) base *= 1.4;
    else if (process.includes("Laser")) base *= 0.8;

    if (tolerance.includes("0.02") || tolerance.includes("0.01")) base *= 1.35;
    if (surfaceFinish.includes("Anodized")) base += 85;

    let discount = 1.0;
    if (quantity >= 500) discount = 0.58;
    else if (quantity >= 100) discount = 0.72;
    else if (quantity >= 25) discount = 0.85;

    const minEst = Math.max(2500, Math.round(base * discount * 0.9 * quantity));
    const maxEst = Math.max(8500, Math.round(base * discount * 1.35 * quantity));

    return { minEst, maxEst };
  };

  const { minEst, maxEst } = calculateEstimate();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRfq = createRfq({
      title,
      description: instructions,
      rawMaterialType: material,
      processType: "CNC_MACHINING",
      surfaceFinish: "AS_MACHINED",
      toleranceMm: tolerance,
      quantity,
      requiredDeliveryDate: deliveryDate,
      fileName: selectedFile ? selectedFile.name : "housing_cad_rev1.step",
      estimatedBudgetMin: minEst,
      estimatedBudgetMax: maxEst,
    });

    setCreatedRfqCode(newRfq.enquiryCode);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb / Tab Bar */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Posting as: {activeClient.fullName} ({activeClient.companyName}) • Step 1
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Post CAD Manufacturing RFQ
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Inquiry will be isolated to {activeClient.fullName}'s account in the client database.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/client/bids"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-2xs"
            >
              View Active Bids
            </Link>
          </div>
        </div>

        {createdRfqCode ? (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-gray-200 text-center space-y-5 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900">
                Inquiry Posted Successfully!
              </h2>
              <p className="text-xs text-slate-500">
                Job Code: <strong className="text-blue-600 font-bold">{createdRfqCode}</strong>
              </p>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your CAD drawing for <strong>{quantity} pcs ({material})</strong> is now broadcasted to the manufacturer marketplace!
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 text-left text-xs text-blue-950 space-y-2">
              <div className="font-bold flex items-center gap-2 text-sm text-blue-900">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Next Step in Testing Flow:
              </div>
              <p className="text-slate-700">
                Now switch to the <strong>Manufacturer Hub</strong> to act as an MSME machine shop and submit a competitive bid against this job!
              </p>
              <div className="pt-2">
                <Link
                  href="/manufacturer/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition"
                >
                  <span>Go to Manufacturer Hub & Submit Bid</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-4">
              <button
                onClick={() => setCreatedRfqCode(null)}
                className="px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition"
              >
                Post Another Inquiry
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Form: CAD Upload & Material Specs (Cols 1-7) */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
              {/* Job Title */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs space-y-2">
                <label className="block text-xs font-bold text-slate-900">
                  Job / Part Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Precision CNC Aluminum Housing"
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500 font-semibold text-slate-900"
                />
              </div>

              {/* CAD Upload Card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <UploadCloud className="w-4 h-4 text-blue-600" />
                    Upload CAD Files & 2D Drawings
                  </h2>
                  <span className="text-[11px] text-gray-500">Confidential NDA Protected</span>
                </div>

                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    dragActive
                      ? "border-blue-500 bg-blue-50/50"
                      : "border-gray-300 hover:border-gray-400 bg-gray-50/40"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    {selectedFile ? selectedFile.name : "Drop your CAD drawing here (.step, .dwg, .stl, .pdf)"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Or click browse to upload from your computer
                  </p>

                  <div className="mt-4">
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-300 text-xs font-semibold text-slate-700 hover:bg-gray-50 cursor-pointer shadow-2xs">
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span>{selectedFile ? "Replace File" : "Browse Files"}</span>
                      <input
                        type="file"
                        accept=".step,.stp,.dwg,.iges,.igs,.stl,.pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Material & Specifications Card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs space-y-4">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  Material & Specifications
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Material Type
                    </label>
                    <select
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    >
                      <option>Aluminum 6061-T6</option>
                      <option>Aluminum 7075-T6</option>
                      <option>Stainless Steel 304</option>
                      <option>Stainless Steel 316L</option>
                      <option>Mild Steel EN8 / MS</option>
                      <option>Brass C360</option>
                      <option>Titanium Grade 5</option>
                      <option>Delrin POM (White/Black)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Manufacturing Process
                    </label>
                    <select
                      value={process}
                      onChange={(e) => setProcess(e.target.value)}
                      className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    >
                      <option>CNC Machining (Milling/Turning)</option>
                      <option>5-Axis CNC Precision</option>
                      <option>Fiber Laser Cutting</option>
                      <option>Sheet Metal Fabrication & Bending</option>
                      <option>Industrial 3D Printing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Quantity (Pieces)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10000}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      placeholder="Enter quantity"
                      className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Tolerance (±mm)
                    </label>
                    <input
                      type="text"
                      value={tolerance}
                      onChange={(e) => setTolerance(e.target.value)}
                      placeholder="e.g. ±0.05 mm"
                      className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Surface Finish
                    </label>
                    <select
                      value={surfaceFinish}
                      onChange={(e) => setSurfaceFinish(e.target.value)}
                      className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    >
                      <option>As-Machined (Standard Ra 3.2μm)</option>
                      <option>Smooth Bead Blasted (Ra 1.6μm)</option>
                      <option>Anodized Type II (Matte / Colored)</option>
                      <option>Hardcoat Anodized Type III (Black)</option>
                      <option>Powder Coated (Industrial Grade)</option>
                      <option>Electropolished (Medical/Pharma)</option>
                      <option>Zinc Plated (Corrosion Protection)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Additional Requirements Card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs space-y-4">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Additional Requirements
                </h2>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Required Delivery Date
                  </label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full sm:w-64 text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Special Instructions & Quality Standards
                  </label>
                  <textarea
                    rows={3}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Specific tolerances, CMM inspection requirement, material test sheets..."
                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 active:scale-[0.99] transition cursor-pointer"
              >
                <span>Broadcast Inquiry to Marketplace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Right Side: Project Summary */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs space-y-6 sticky top-24">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Live Project Summary
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    Instant Preview
                  </span>
                </div>

                {/* Quick Estimate Banner */}
                <div className="bg-blue-50/80 rounded-xl p-4 border border-blue-100">
                  <span className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider block">
                    Quick Estimate Range
                  </span>
                  <div className="text-2xl font-extrabold text-blue-900 tracking-tight mt-0.5">
                    ₹{minEst.toLocaleString()} – ₹{maxEst.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-blue-700/80 block mt-1">
                    Based on market spindle rates
                  </span>
                </div>

                {/* Specs List */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">Material:</span>
                    <span className="font-semibold text-slate-800">{material}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">Process:</span>
                    <span className="font-semibold text-slate-800">{process}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">Quantity:</span>
                    <span className="font-semibold text-slate-800">{quantity} pieces</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">Tolerance:</span>
                    <span className="font-semibold text-slate-800">{tolerance}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">Target Delivery:</span>
                    <span className="font-semibold text-slate-800">{deliveryDate}</span>
                  </div>
                </div>

                <div className="pt-2 text-xs text-gray-500 space-y-1.5">
                  <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Marketplace Guarantees
                  </div>
                  <div>• 100% Protected Escrow Hold</div>
                  <div>• CMM Inspection Report verification</div>
                  <div>• Vendor Pseudo-name Anti-Bypass Protection</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
