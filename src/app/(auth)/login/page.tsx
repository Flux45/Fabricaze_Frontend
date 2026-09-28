"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Factory, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"CUSTOMER" | "MANUFACTURER" | "ADMIN">("CUSTOMER");
  const [email, setEmail] = useState("contact@techcorp.com");
  const [password, setPassword] = useState("Fabricaze@2026");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "ADMIN") {
      router.push("/admin/dashboard");
    } else if (role === "MANUFACTURER") {
      router.push("/manufacturer/dashboard");
    } else {
      router.push("/client/bids");
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
            <Factory className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign In to Fabricaze
          </h1>
          <p className="text-xs text-slate-500">
            Gateway to Digital Manufacturing in India
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 p-1 bg-gray-100 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setRole("CUSTOMER");
              setEmail("contact@techcorp.com");
            }}
            className={`py-1.5 rounded-lg transition ${
              role === "CUSTOMER"
                ? "bg-white text-blue-600 shadow-2xs"
                : "text-gray-600 hover:text-slate-900"
            }`}
          >
            Buyer
          </button>
          <button
            type="button"
            onClick={() => {
              setRole("MANUFACTURER");
              setEmail("precision@indoremfg.com");
            }}
            className={`py-1.5 rounded-lg transition ${
              role === "MANUFACTURER"
                ? "bg-white text-blue-600 shadow-2xs"
                : "text-gray-600 hover:text-slate-900"
            }`}
          >
            MSME Shop
          </button>
          <button
            type="button"
            onClick={() => {
              setRole("ADMIN");
              setEmail("admin@fabricaze.com");
            }}
            className={`py-1.5 rounded-lg transition ${
              role === "ADMIN"
                ? "bg-white text-blue-600 shadow-2xs"
                : "text-gray-600 hover:text-slate-900"
            }`}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-gray-700">Password</label>
              <Link href="#" className="text-blue-600 hover:underline text-[11px]">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 active:scale-[0.99] transition cursor-pointer"
          >
            <span>Sign In to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-gray-500">
          New to Fabricaze?{" "}
          <Link href="/signup" className="text-blue-600 font-semibold hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
