import Link from "next/link";
import {
  UploadCloud,
  FileCheck2,
  ShieldCheck,
  Truck,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  MapPin,
  CheckCircle,
  Building2,
  Clock,
  Award,
} from "lucide-react";
import { QuickEstimator } from "@/components/estimator/QuickEstimator";

export default function Home() {
  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-blue-50/60 via-slate-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Transforming Indian Manufacturing • MSME 5.0</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.15]">
                Gateway to <span className="text-blue-600">Digital Manufacturing</span> in India.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                Fabricaze connects product developers, startups, and global OEMs directly with verified Indian MSME machine shops. Upload your CAD drawings, receive transparent competitive quotes in 1–3 days, and track production with CMM inspection reports.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/client/submit-job"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98]"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Submit CAD / Request Quotes</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/client/manufacturers"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-slate-700 border border-gray-300 font-semibold text-sm hover:bg-gray-50 transition-colors shadow-xs"
                >
                  <span>Explore MSME Directory</span>
                </Link>
              </div>

              {/* Key Trust Signals */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-xs text-slate-600">
                <div>
                  <strong className="block text-xl font-bold text-slate-900">1–3 Days</strong>
                  <span>Quotation Turnaround</span>
                </div>
                <div>
                  <strong className="block text-xl font-bold text-slate-900">₹0 Fee</strong>
                  <span>To Post First RFQ</span>
                </div>
                <div>
                  <strong className="block text-xl font-bold text-slate-900">100% Escrow</strong>
                  <span>Guaranteed Quality Hold</span>
                </div>
              </div>
            </div>

            {/* Right Estimator Widget */}
            <div className="lg:col-span-5">
              <QuickEstimator />
            </div>
          </div>
        </div>
      </section>

      {/* The Market Reality: $500B India Opportunity */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-3xl mb-12">
            <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">
              The Indian Manufacturing Revolution
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 text-white">
              Why Now? Bridging 63M Offline MSMEs with Global Demand
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
              India’s manufacturing sector is scaling to $1 Trillion by 2030. As the world accelerates its “China + 1” sourcing strategy, Fabricaze organizes India’s fragmented precision machining network into a unified digital powerhouse.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700">
              <div className="text-3xl font-extrabold text-blue-400 mb-1">65%</div>
              <h4 className="font-semibold text-white text-sm">Fragmented Supply Chain</h4>
              <p className="text-xs text-slate-400 mt-2">
                Unorganized suppliers struggle with digital discovery. Fabricaze brings them online with verified capability badges.
              </p>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700">
              <div className="text-3xl font-extrabold text-amber-400 mb-1">45 Days ➔ 3 Days</div>
              <h4 className="font-semibold text-white text-sm">Slashing Quoting Delays</h4>
              <p className="text-xs text-slate-400 mt-2">
                Traditional multi-vendor phone calling takes weeks. Fabricaze algorithmic matching delivers competitive bids in 24–72 hours.
              </p>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700">
              <div className="text-3xl font-extrabold text-emerald-400 mb-1">70%</div>
              <h4 className="font-semibold text-white text-sm">Real-Time Visibility</h4>
              <p className="text-xs text-slate-400 mt-2">
                Eliminates supply chain blind spots with milestone tracking from raw material sawing to CMM inspection.
              </p>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700">
              <div className="text-3xl font-extrabold text-purple-400 mb-1">100% Trust</div>
              <h4 className="font-semibold text-white text-sm">Pseudo-Name Protection</h4>
              <p className="text-xs text-slate-400 mt-2">
                Protects platform relationships against disintermediation while building transparent credibility through verified ratings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Flow (4 Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">
            Seamless Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mt-2">
            How Fabricaze Works
          </h2>
          <p className="text-slate-600 text-sm mt-3">
            From CAD upload to shop-floor delivery in four transparent steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs relative group hover:border-blue-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg mb-5 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Step 01</span>
            <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">Upload CAD & Specs</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Drop your .STEP, .DWG, .STL, or 2D technical drawings. Select alloy materials, precision tolerances (up to ±0.01mm), and surface finishes.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs relative group hover:border-blue-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg mb-5 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Step 02</span>
            <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">Ability Matching</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our capability matcher routes your RFQ to vetted machine shops in Indore, Pune, and Ahmedabad with idle spindle time.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs relative group hover:border-blue-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg mb-5 group-hover:scale-110 transition-transform">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Step 03</span>
            <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">Compare Quotes</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Review side-by-side bids showing lead times, total INR prices, ISO/AS9100 certs, and reviews. Award the project with 100% Escrow security.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs relative group hover:border-blue-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg mb-5 group-hover:scale-110 transition-transform">
              <Truck className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Step 04</span>
            <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">QC & Delivery</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Track manufacturing milestones live. Download verified CMM dimensional logs, Material Test (MT), and Hardness Test (HT) reports before dispatch.
            </p>
          </div>
        </div>
      </section>

      {/* Capabilities Spectrum */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">
                Full Spectrum Production
              </span>
              <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight mt-1">
                Precision Manufacturing Capabilities
              </h2>
            </div>
            <Link
              href="/client/submit-job"
              className="mt-4 md:mt-0 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>View full machine specifications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-blue-600 font-bold text-xs uppercase mb-2">Subtractive</div>
              <h3 className="text-base font-bold text-slate-900 mb-2">CNC Milling & Turning</h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                3-Axis, 4-Axis, and 5-Axis continuous machining for complex geometries in Aluminum, Stainless Steel, Brass, and Titanium.
              </p>
              <div className="text-[11px] text-slate-500 font-medium space-y-1">
                <div>• Tolerances down to ±0.01 mm</div>
                <div>• Parts up to 2,000 mm length</div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-amber-600 font-bold text-xs uppercase mb-2">Fabrication</div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Sheet Metal & Laser Cutting</h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                High-power fiber laser cutting, precision CNC press brake bending, stamping, and automated TIG/MIG welding assemblies.
              </p>
              <div className="text-[11px] text-slate-500 font-medium space-y-1">
                <div>• Sheet thickness: 0.5 mm to 25 mm</div>
                <div>• Amada & Trumpf certified lines</div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-purple-600 font-bold text-xs uppercase mb-2">Additive</div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Industrial 3D Printing</h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Rapid functional prototyping and low-volume production via Selective Laser Sintering (SLS), SLA, and Direct Metal Laser Sintering (DMLS).
              </p>
              <div className="text-[11px] text-slate-500 font-medium space-y-1">
                <div>• Materials: PA12, Resin, AlSi10Mg</div>
                <div>• 24-hour turnaround dispatch</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Industrial Hubs (Indore, Pune, Ahmedabad) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">
            Industrial Cluster Footprint
          </span>
          <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight mt-1">
            Ground Network in India’s Manufacturing Capitals
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Physically audited MSMEs equipped with modern CNCs, CMM coordinate measuring machines, and calibrated toolrooms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">Indore Hub</h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                Pologround / Sanwer
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              50–75 active machine shops specializing in precision automotive components, gear manufacturing, and rapid prototyping.
            </p>
            <div className="text-xs text-slate-500 space-y-1">
              <div>• Lead Time: <strong>2–5 days locally</strong></div>
              <div>• Capabilities: <strong>VMCs, Lathes, Surface Grinding</strong></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">Pune Hub</h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                Bhosari / Chakan
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Maharashtra’s auto & defense cluster. High-precision laser cutting, heavy sheet metal press lines, and certified ISO/IATF vendors.
            </p>
            <div className="text-xs text-slate-500 space-y-1">
              <div>• Lead Time: <strong>3–7 days</strong></div>
              <div>• Capabilities: <strong>Fiber Laser, CNC Press Brake, Robot Welding</strong></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">Ahmedabad Hub</h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                Naroda / Vatva
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Gujarat’s engineering heartland. Heavy machinery fabrication, casting, forging, and aerospace-grade 5-axis CNC facilities.
            </p>
            <div className="text-xs text-slate-500 space-y-1">
              <div>• Lead Time: <strong>5–10 days</strong></div>
              <div>• Capabilities: <strong>5-Axis CNC, Investment Casting, Heat Treatment</strong></div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Accelerate Your Manufacturing?
            </h2>
            <p className="text-blue-100 text-sm leading-relaxed">
              Join hundreds of hardware innovators and Indian MSMEs streamlining custom fabrication with guaranteed tolerances and secure escrow payments.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <Link
              href="/client/submit-job"
              className="w-full sm:w-auto text-center px-6 py-3.5 rounded-xl bg-white text-blue-700 font-bold text-sm hover:bg-blue-50 transition shadow-md"
            >
              Post a Job for Free
            </Link>
            <Link
              href="/manufacturer/dashboard"
              className="w-full sm:w-auto text-center px-6 py-3.5 rounded-xl bg-blue-700/80 hover:bg-blue-700 text-white border border-blue-400/30 font-semibold text-sm transition"
            >
              Register as Manufacturer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
