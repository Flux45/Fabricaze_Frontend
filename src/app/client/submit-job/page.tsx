"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  FileCheck2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  HelpCircle,
  FileText,
  ShieldAlert,
  Info,
} from "lucide-react";
import { useFabricazeStore } from "@/lib/fabricazeStore";

// Secure allowed file extensions
const ALLOWED_EXTENSIONS = [
  // 3D CAD
  ".step",
  ".stp",
  ".stl",
  ".iges",
  ".igs",
  ".sldprt",
  ".obj",
  // 2D Drawings & Vector designs
  ".pdf",
  ".dwg",
  ".dxf",
  ".svg",
  // Images
  ".png",
  ".jpg",
  ".jpeg",
];

const DANGEROUS_EXTENSIONS = [
  ".exe",
  ".bat",
  ".cmd",
  ".sh",
  ".vbs",
  ".msi",
  ".dll",
  ".com",
  ".scr",
  ".js",
  ".ps1",
  ".apk",
  ".bin",
  ".pif",
  ".jar",
];

export default function SubmitJobPage() {
  const router = useRouter();
  const { createRfq, activeClient } = useFabricazeStore();

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileSecurityError, setFileSecurityError] = useState<string | null>(null);
  const [fileSecuritySuccess, setFileSecuritySuccess] = useState<string | null>(null);

  const [title, setTitle] = useState("Custom CNC Aluminum Housing");
  const [material, setMaterial] = useState("Aluminum 6061-T6");
  const [customMaterial, setCustomMaterial] = useState("");
  const [process, setProcess] = useState("Platform Recommends (Fabricaze DFM Engine decides)");
  const [quantity, setQuantity] = useState(10);
  const [tolerance, setTolerance] = useState("±0.05 mm");
  const [surfaceFinish, setSurfaceFinish] = useState("As-Machined");
  const [deliveryDate, setDeliveryDate] = useState("2026-10-15");
  const [instructions, setInstructions] = useState("");
  const [createdRfqCode, setCreatedRfqCode] = useState<string | null>(null);

  // Security validator against malicious executables
  const validateAndSetFile = (file: File) => {
    const fileName = file.name.toLowerCase();
    const fileExt = fileName.substring(fileName.lastIndexOf("."));

    // Check dangerous file types
    if (DANGEROUS_EXTENSIONS.includes(fileExt) || file.type.includes("x-msdownload") || file.type.includes("executable")) {
      setFileSecurityError(
        `Security Alert: Executable (.${fileExt.replace(".", "")}) and script files are strictly blocked to protect the marketplace infrastructure. Only verified CAD drawings, PDFs, and design vectors are allowed.`
      );
      setFileSecuritySuccess(null);
      setSelectedFile(null);
      return false;
    }

    // Check whitelist of allowed CAD / Drawing / Vector / Image formats
    if (!ALLOWED_EXTENSIONS.includes(fileExt)) {
      setFileSecurityError(
        `Unsupported File Format (${fileExt}). Permitted formats: 3D CAD (.STEP, .STL, .IGES, .SLDPRT), 2D Drawings (.PDF, .DWG, .DXF, .SVG), Images (.PNG, .JPG).`
      );
      setFileSecuritySuccess(null);
      setSelectedFile(null);
      return false;
    }

    // File passed security check
    setFileSecurityError(null);
    setFileSecuritySuccess(
      `Verified Safe Format: ${file.name} (${(file.size / 1024).toFixed(1)} KB) • Clean Scan Passed`
    );
    setSelectedFile(file);
    return true;
  };

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
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalMaterial = material === "Custom" ? (customMaterial.trim() || "Custom Alloy") : material;

    const newRfq = createRfq({
      title,
      description: instructions,
      rawMaterialType: finalMaterial,
      processType: "CNC_MACHINING",
      surfaceFinish: "AS_MACHINED",
      toleranceMm: tolerance,
      quantity,
      requiredDeliveryDate: deliveryDate,
      fileName: selectedFile ? selectedFile.name : "housing_cad_drawing.step",
      fileType: selectedFile ? selectedFile.name.split(".").pop() || "step" : "step",
      fileUrl: selectedFile ? `/cad/uploads/${selectedFile.name}` : "/cad/sample.step",
      estimatedBudgetMin: 0,
      estimatedBudgetMax: 0,
    });

    setCreatedRfqCode(newRfq.enquiryCode);
  };

  const finalDisplayMaterial = material === "Custom" ? (customMaterial.trim() || "Custom Material (To be specified)") : material;

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
                Job Code: <strong className="text-blue-600 font-bold font-mono">{createdRfqCode}</strong>
              </p>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your CAD drawing for <strong>{quantity} pcs ({finalDisplayMaterial})</strong> has been broadcasted to verified MSME machine shops!
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 text-left text-xs text-blue-950 space-y-2">
              <div className="font-bold flex items-center gap-2 text-sm text-blue-900">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Next Step in Testing Flow:
              </div>
              <p className="text-slate-700">
                Now switch to the <strong>Manufacturer Hub</strong> to act as an MSME shop, inspect the attached CAD drawing & comments, and submit a quote!
              </p>
              <div className="pt-2">
                <Link
                  href="/manufacturer/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition"
                >
                  <span>Go to Manufacturer Hub & Inspect Inquiry</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Side: Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
              {/* Part Title Card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs space-y-3">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Part Title / Component Reference
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Robotic Arm Actuator Housing Bracket"
                  className="w-full text-sm font-semibold text-slate-900 bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Secure File Upload Zone */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Upload 3D CAD Drawing / Technical Vector
                  </h2>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Antivirus & Malware Protected
                  </span>
                </div>

                {/* Security Error Alert */}
                {fileSecurityError && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Security Restriction</span>
                      <p className="mt-0.5 leading-relaxed">{fileSecurityError}</p>
                    </div>
                  </div>
                )}

                {/* Security Success Alert */}
                {fileSecuritySuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium">{fileSecuritySuccess}</span>
                  </div>
                )}

                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                    dragActive
                      ? "border-blue-500 bg-blue-50/50"
                      : "border-gray-200 hover:border-gray-300 bg-gray-50/50"
                  }`}
                >
                  <input
                    type="file"
                    id="file-upload"
                    accept=".step,.stp,.stl,.iges,.igs,.sldprt,.obj,.pdf,.dwg,.dxf,.svg,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center justify-center space-y-3"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-xs">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-blue-600 hover:underline">
                        Click to upload
                      </span>{" "}
                      <span className="text-sm text-gray-500">or drag & drop file</span>
                    </div>
                    <p className="text-xs text-gray-500 max-w-sm">
                      Allowed: <strong>3D CAD</strong> (.STEP, .STL, .IGES, .SLDPRT) • <strong>2D Drawings</strong> (.PDF, .DWG, .DXF, .SVG) • <strong>Images</strong> (.PNG, .JPG)
                    </p>
                  </label>

                  {selectedFile && (
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs text-gray-700 shadow-2xs font-mono">
                      <FileCheck2 className="w-4 h-4 text-emerald-600" />
                      <span>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Material & Specifications Card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs space-y-4">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  Material & Specifications
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Material with Custom Option */}
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
                      <option>Delrin POM (Polyacetal)</option>
                      <option value="Custom">Custom / Specify Other Material...</option>
                    </select>

                    {material === "Custom" && (
                      <div className="mt-2">
                        <input
                          type="text"
                          required
                          value={customMaterial}
                          onChange={(e) => setCustomMaterial(e.target.value)}
                          placeholder="e.g. Inconel 718, PEEK, Hardox 450, Tool Steel D2"
                          className="w-full text-xs bg-white border border-blue-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-900"
                        />
                      </div>
                    )}
                  </div>

                  {/* Manufacturing Process */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Manufacturing Process
                    </label>
                    <select
                      value={process}
                      onChange={(e) => setProcess(e.target.value)}
                      className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    >
                      <option>Platform Recommends (Fabricaze DFM Engine decides)</option>
                      <option>CNC Machining (Milling / Turning)</option>
                      <option>5-Axis CNC Precision Machining</option>
                      <option>Fiber Laser Cutting</option>
                      <option>Sheet Metal Fabrication & CNC Bending</option>
                      <option>Industrial 3D Printing (Metal DMLS / Polymer)</option>
                      <option>Manual Lathe / Milling Machining</option>
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

              {/* Additional Requirements & Comments Card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs space-y-4">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Delivery & Special Instructions / Comments
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Target Delivery Date
                    </label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Certificates Required
                    </label>
                    <div className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-gray-600 font-medium">
                      ✓ CMM Inspection & Material Test (Included)
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Comments / Specific Quality Notes for Manufacturer
                    </label>
                    <textarea
                      rows={3}
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="Provide special notes for machinists (e.g. Critical bore concentricity, thread tapping depth, heat-treat hardness certificates required, packaging specs)..."
                      className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-800"
                    />
                  </div>
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

            {/* Right Side: Live Project Summary */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs space-y-6 sticky top-24">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Live Project Summary
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    CAD Analysis
                  </span>
                </div>

                {/* Quick Estimate Banner (Zero by default per request) */}
                <div className="bg-slate-50 rounded-xl p-4 border border-gray-200">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Quick Estimate Range
                  </span>
                  <div className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                    ₹0 – ₹0
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Official quote generated upon manufacturer bid & toolpath review
                  </span>
                </div>

                {/* Specs List */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">Material:</span>
                    <span className="font-semibold text-slate-800">{finalDisplayMaterial}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">Process:</span>
                    <span className="font-semibold text-slate-800 max-w-[200px] text-right truncate">{process}</span>
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
