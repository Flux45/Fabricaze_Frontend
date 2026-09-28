"use client";

import { useState } from "react";
import Link from "next/link";
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

export default function SubmitJobPage() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [material, setMaterial] = useState("Aluminum 6061-T6");
  const [process, setProcess] = useState("CNC Machining");
  const [quantity, setQuantity] = useState(10);
  const [tolerance, setTolerance] = useState("±0.1 mm");
  const [surfaceFinish, setSurfaceFinish] = useState("As-Machined");
  const [deliveryDate, setDeliveryDate] = useState("2026-10-15");
  const [instructions, setInstructions] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    setIsSubmitted(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb / Tab Bar matching mockup */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Manufacturing Marketplace
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Submit Custom Manufacturing RFQ
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/client/bids"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-2xs"
            >
              View Active Bids (4)
            </Link>
          </div>
        </div>

        {isSubmitted ? (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 border border-gray-200 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">RFQ Broadcasted Successfully!</h2>
            <p className="text-sm text-slate-600">
              Job <strong>#FAB-2024-001</strong> has been dispatched to verified machine shops across <strong>Indore, Pune, and Ahmedabad</strong> matching your machine tolerances and material specs.
            </p>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-left text-xs text-blue-900 space-y-1">
              <div>• Expected Quoting Window: <strong>24–48 hours</strong></div>
              <div>• Target Batch: <strong>{quantity} units</strong> ({material})</div>
              <div>• Disintermediation Protection: <strong>Vendor pseudonyms active</strong></div>
            </div>
            <div className="pt-4 flex justify-center gap-4">
              <Link
                href="/client/bids"
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition"
              >
                Go to Bids Comparison
              </Link>
              <button
                onClick={() => setIsSubmitted(false)}
                className="px-6 py-2.5 rounded-xl bg-white border border-gray-300 text-slate-700 font-semibold text-sm hover:bg-gray-50 transition"
              >
                Submit Another Part
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Form: CAD Upload & Material Specs (Cols 1-7) */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
              {/* CAD Upload Card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <UploadCloud className="w-4 h-4 text-blue-600" />
                    Upload CAD Files & Drawings
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
                    {selectedFile ? selectedFile.name : "Drop your CAD files here"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Supports .dwg, .step, .iges, .stl, .pdf (Max 50MB)
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
                      placeholder="e.g. ±0.1 mm"
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
                    placeholder="Any specific tolerances, quality standards, or delivery instructions (e.g. CMM inspection report required, HT certificate required)..."
                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 active:scale-[0.99] transition cursor-pointer"
              >
                <span>Request Quotes from Verified MSMEs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Right Side: Project Summary & Tips (Cols 8-12) matching mockup */}
            <div className="lg:col-span-5 space-y-6">
              {/* Project Summary Card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Project Summary
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    Instant Preview
                  </span>
                </div>

                {/* Quick Estimate Banner */}
                <div className="bg-blue-50/80 rounded-xl p-4 border border-blue-100">
                  <span className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider block">
                    Quick Estimate
                  </span>
                  <div className="text-2xl font-extrabold text-blue-900 tracking-tight mt-0.5">
                    ₹{minEst.toLocaleString()} – ₹{maxEst.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-blue-700/80 block mt-1">
                    Based on similar projects in network
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
                    <span className="text-gray-500">Est. Lead Time:</span>
                    <span className="font-semibold text-slate-800">5–12 days</span>
                  </div>
                </div>

                {/* Recommended Manufacturers Hubs */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                    Recommended Manufacturers
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                      <span><strong>3 manufacturers</strong> in Indore (Pologround)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                      <span><strong>5 manufacturers</strong> in Pune (Bhosari / Chakan)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                      <span><strong>2 manufacturers</strong> in Ahmedabad (Naroda GIDC)</span>
                    </li>
                  </ul>
                </div>

                {/* Tips for Better Quotes */}
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                    Tips for Better Quotes
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-500">
                    <li className="flex items-start gap-1.5">
                      <span className="text-blue-600">•</span>
                      <span>Include detailed technical drawings with critical dimensions.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-blue-600">•</span>
                      <span>Specify material grade and certification requirements (HT, MT).</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-blue-600">•</span>
                      <span>Provide clear tolerance and quality standards.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-blue-600">•</span>
                      <span>Consider flexible delivery dates for better volume pricing.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
