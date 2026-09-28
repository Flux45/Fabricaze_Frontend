import Link from "next/link";
import { Factory, Shield, Award, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: About Fabricaze */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Factory className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white font-serif">Fabricaze</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              India’s premier digital manufacturing marketplace connecting hardware innovators, OEMs, and product teams with verified MSME machine shops.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <Shield className="w-4 h-4" />
              <span>MSME Idea Hackathon 5.0 • IIT Indore</span>
            </div>
          </div>

          {/* Col 2: Manufacturing Capabilities */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">
              Capabilities
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/client/submit-job" className="hover:text-white transition">CNC Machining (3-Axis & 5-Axis)</Link></li>
              <li><Link href="/client/submit-job" className="hover:text-white transition">Sheet Metal Fabrication & Bending</Link></li>
              <li><Link href="/client/submit-job" className="hover:text-white transition">Fiber Laser Cutting</Link></li>
              <li><Link href="/client/submit-job" className="hover:text-white transition">Industrial 3D Printing (SLA / SLS / DMLS)</Link></li>
              <li><Link href="/client/submit-job" className="hover:text-white transition">Surface Treatments & Anodizing</Link></li>
              <li><Link href="/client/submit-job" className="hover:text-white transition">CMM & Material Testing (HT/MT)</Link></li>
            </ul>
          </div>

          {/* Col 3: Regional MSME Hubs */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">
              Regional MSME Hubs
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>Indore (Pologround & Sanwer Road)</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>Pune (Bhosari & Chakan Auto Cluster)</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>Ahmedabad (Naroda & Vatva GIDC)</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>Bengaluru (Peenya Industrial Area)</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Founders */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">
              Direct Contact
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>+91-8766587742 / +91-9977999378</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>aayyuusshh.45@gmail.com</span>
              </li>
              <li className="pt-2 text-slate-500">
                Founders: <strong className="text-slate-300">Ayush Jain</strong> & <strong className="text-slate-300">Sarvesh Kale</strong>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Fabricaze Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-white transition">Terms & Conditions</Link>
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/admin/dashboard" className="text-blue-400 hover:text-blue-300 transition">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
