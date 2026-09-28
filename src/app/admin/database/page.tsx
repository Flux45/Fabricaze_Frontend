"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Database,
  Table,
  Layers,
  Key,
  Link as LinkIcon,
  Plus,
  Download,
  Search,
  ExternalLink,
  ShieldCheck,
  Factory,
  Users,
  Briefcase,
  FileCheck2,
  AlertTriangle,
  Wrench,
  Sparkles,
  Terminal,
  X,
  CheckCircle,
} from "lucide-react";
import { useFabricazeStore } from "@/lib/fabricazeStore";

// Complete Database Schema Metadata
const DATABASE_SCHEMA_TABLES = [
  {
    tableName: "Account",
    description: "Core authentication and credential store for multi-role security",
    columns: [
      { name: "id", type: "UUID", isPk: true, isFk: false, nullable: false, default: "uuid()" },
      { name: "email", type: "VARCHAR(255)", isPk: false, isFk: false, nullable: false, unique: true },
      { name: "passwordHash", type: "VARCHAR(255)", isPk: false, isFk: false, nullable: false },
      { name: "role", type: "ENUM('ADMIN', 'CUSTOMER', 'MANUFACTURER')", isPk: false, isFk: false, nullable: false },
      { name: "status", type: "ENUM('ACTIVE', 'PENDING', 'SUSPENDED')", isPk: false, isFk: false, nullable: false, default: "'ACTIVE'" },
      { name: "createdAt", type: "TIMESTAMP", isPk: false, isFk: false, nullable: false, default: "now()" },
      { name: "updatedAt", type: "TIMESTAMP", isPk: false, isFk: false, nullable: false },
    ],
    relations: ["1:1 Customer", "1:1 Manufacturer", "1:1 Admin"],
  },
  {
    tableName: "Customer (Client)",
    description: "Enterprise buyers, aerospace OEMs, and hardware startups who post RFQs",
    columns: [
      { name: "id", type: "UUID", isPk: true, isFk: false, nullable: false, default: "uuid()" },
      { name: "accountId", type: "UUID", isPk: false, isFk: true, fkRef: "Account.id", nullable: false },
      { name: "fullName", type: "VARCHAR(128)", isPk: false, isFk: false, nullable: false },
      { name: "companyName", type: "VARCHAR(128)", isPk: false, isFk: false, nullable: true },
      { name: "phoneNumber", type: "VARCHAR(32)", isPk: false, isFk: false, nullable: false },
      { name: "city", type: "VARCHAR(64)", isPk: false, isFk: false, nullable: false },
      { name: "state", type: "VARCHAR(64)", isPk: false, isFk: false, nullable: false },
      { name: "industry", type: "VARCHAR(64)", isPk: false, isFk: false, nullable: true },
      { name: "createdAt", type: "TIMESTAMP", isPk: false, isFk: false, nullable: false, default: "now()" },
    ],
    relations: ["1:N Enquiry (RFQs)", "1:N Order", "1:N Dispute"],
  },
  {
    tableName: "Manufacturer (MSME)",
    description: "Vetted machining workshops and precision fabrication vendors",
    columns: [
      { name: "id", type: "UUID", isPk: true, isFk: false, nullable: false, default: "uuid()" },
      { name: "accountId", type: "UUID", isPk: false, isFk: true, fkRef: "Account.id", nullable: false },
      { name: "companyName", type: "VARCHAR(128)", isPk: false, isFk: false, nullable: false, note: "Hidden from buyers" },
      { name: "pseudoName", type: "VARCHAR(128)", isPk: false, isFk: false, nullable: false, unique: true, note: "Anti-bypass identifier" },
      { name: "city", type: "VARCHAR(64)", isPk: false, isFk: false, nullable: false },
      { name: "state", type: "VARCHAR(64)", isPk: false, isFk: false, nullable: false },
      { name: "verificationStatus", type: "ENUM('PENDING', 'VERIFIED', 'REJECTED')", isPk: false, isFk: false, nullable: false },
      { name: "rating", type: "DECIMAL(3,2)", isPk: false, isFk: false, nullable: false, default: "5.00" },
      { name: "reviewCount", type: "INT", isPk: false, isFk: false, nullable: false, default: "0" },
      { name: "capabilities", type: "VARCHAR[]", isPk: false, isFk: false, nullable: false },
      { name: "certifications", type: "VARCHAR[]", isPk: false, isFk: false, nullable: false },
    ],
    relations: ["1:N Machine", "1:N Quotation", "1:N Order"],
  },
  {
    tableName: "Machine",
    description: "Shop capacity, CNC working envelopes, axis travels, and hourly rates",
    columns: [
      { name: "id", type: "UUID", isPk: true, isFk: false, nullable: false, default: "uuid()" },
      { name: "manufacturerId", type: "UUID", isPk: false, isFk: true, fkRef: "Manufacturer.id", nullable: false },
      { name: "name", type: "VARCHAR(128)", isPk: false, isFk: false, nullable: false },
      { name: "machineType", type: "VARCHAR(64)", isPk: false, isFk: false, nullable: false },
      { name: "xAxisMm", type: "INT", isPk: false, isFk: false, nullable: true },
      { name: "yAxisMm", type: "INT", isPk: false, isFk: false, nullable: true },
      { name: "zAxisMm", type: "INT", isPk: false, isFk: false, nullable: true },
      { name: "hourlyRateInr", type: "DECIMAL(10,2)", isPk: false, isFk: false, nullable: false },
      { name: "isActive", type: "BOOLEAN", isPk: false, isFk: false, nullable: false, default: "true" },
      { name: "supportedMaterials", type: "VARCHAR[]", isPk: false, isFk: false, nullable: false },
    ],
    relations: ["N:1 Manufacturer"],
  },
  {
    tableName: "Enquiry (RFQ)",
    description: "Client manufacturing requirements broadcasted to marketplace MSMEs",
    columns: [
      { name: "id", type: "UUID", isPk: true, isFk: false, nullable: false, default: "uuid()" },
      { name: "enquiryCode", type: "VARCHAR(32)", isPk: false, isFk: false, nullable: false, unique: true },
      { name: "customerId", type: "UUID", isPk: false, isFk: true, fkRef: "Customer.id", nullable: false },
      { name: "title", type: "VARCHAR(128)", isPk: false, isFk: false, nullable: false },
      { name: "rawMaterialType", type: "VARCHAR(64)", isPk: false, isFk: false, nullable: false },
      { name: "processType", type: "ENUM('CNC_MACHINING', 'SHEET_METAL', ...)", isPk: false, isFk: false, nullable: false },
      { name: "toleranceMm", type: "VARCHAR(32)", isPk: false, isFk: false, nullable: false },
      { name: "quantity", type: "INT", isPk: false, isFk: false, nullable: false },
      { name: "requiredDeliveryDate", type: "DATE", isPk: false, isFk: false, nullable: false },
      { name: "fileUrl", type: "VARCHAR(512)", isPk: false, isFk: false, nullable: false },
      { name: "status", type: "ENUM('OPEN', 'QUOTED', 'IN_PRODUCTION', 'COMPLETED')", isPk: false, isFk: false, default: "'OPEN'" },
    ],
    relations: ["1:N Quotation", "1:1 Order"],
  },
  {
    tableName: "Quotation (Bid)",
    description: "Manufacturer quotation including itemized machining, material, and lead time",
    columns: [
      { name: "id", type: "UUID", isPk: true, isFk: false, nullable: false, default: "uuid()" },
      { name: "quoteCode", type: "VARCHAR(32)", isPk: false, isFk: false, nullable: false, unique: true },
      { name: "enquiryId", type: "UUID", isPk: false, isFk: true, fkRef: "Enquiry.id", nullable: false },
      { name: "manufacturerId", type: "UUID", isPk: false, isFk: true, fkRef: "Manufacturer.id", nullable: false },
      { name: "totalCostInr", type: "DECIMAL(12,2)", isPk: false, isFk: false, nullable: false },
      { name: "machiningCostInr", type: "DECIMAL(12,2)", isPk: false, isFk: false, nullable: true },
      { name: "materialCostInr", type: "DECIMAL(12,2)", isPk: false, isFk: false, nullable: true },
      { name: "taxGstInr", type: "DECIMAL(12,2)", isPk: false, isFk: false, nullable: true },
      { name: "leadTimeDays", type: "INT", isPk: false, isFk: false, nullable: false },
      { name: "status", type: "ENUM('PENDING', 'ACCEPTED', 'REJECTED')", isPk: false, isFk: false, default: "'PENDING'" },
    ],
    relations: ["N:1 Enquiry", "N:1 Manufacturer"],
  },
  {
    tableName: "Order (Escrow & Milestones)",
    description: "Awarded manufacturing contract with escrow fund lock and production milestones",
    columns: [
      { name: "id", type: "UUID", isPk: true, isFk: false, nullable: false, default: "uuid()" },
      { name: "orderNumber", type: "VARCHAR(32)", isPk: false, isFk: false, nullable: false, unique: true },
      { name: "enquiryId", type: "UUID", isPk: false, isFk: true, fkRef: "Enquiry.id", nullable: false },
      { name: "customerId", type: "UUID", isPk: false, isFk: true, fkRef: "Customer.id", nullable: false },
      { name: "manufacturerId", type: "UUID", isPk: false, isFk: true, fkRef: "Manufacturer.id", nullable: false },
      { name: "totalAmountInr", type: "DECIMAL(12,2)", isPk: false, isFk: false, nullable: false },
      { name: "escrowStatus", type: "ENUM('HELD', 'RELEASED', 'REFUNDED', 'DISPUTED')", isPk: false, isFk: false, default: "'HELD'" },
      { name: "currentMilestone", type: "ENUM('DRAWING_REVIEW', 'MATERIAL_PROCUREMENT', ...)", isPk: false, isFk: false },
      { name: "trackingNumber", type: "VARCHAR(64)", isPk: false, isFk: false, nullable: true },
    ],
    relations: ["1:N Dispute", "1:N QCInspectionReport"],
  },
  {
    tableName: "Dispute",
    description: "Dimensional discrepancy, tolerance failure, or lead-time dispute record",
    columns: [
      { name: "id", type: "UUID", isPk: true, isFk: false, nullable: false, default: "uuid()" },
      { name: "disputeCode", type: "VARCHAR(32)", isPk: false, isFk: false, nullable: false, unique: true },
      { name: "orderNumber", type: "VARCHAR(32)", isPk: false, isFk: false, nullable: false },
      { name: "issueType", type: "ENUM('QUALITY_ISSUE', 'SPEC_MISMATCH', ...)", isPk: false, isFk: false, nullable: false },
      { name: "status", type: "ENUM('Open', 'In Progress', 'Resolved')", isPk: false, isFk: false, default: "'Open'" },
      { name: "valueInr", type: "DECIMAL(12,2)", isPk: false, isFk: false, nullable: false },
      { name: "reportedDate", type: "DATE", isPk: false, isFk: false, nullable: false },
    ],
    relations: ["N:1 Order"],
  },
];

export default function DatabaseVisualizerPage() {
  const {
    clients,
    manufacturers,
    machines,
    rfqs,
    quotations,
    orders,
    disputes,
    createClient,
  } = useFabricazeStore();

  const [activeTab, setActiveTab] = useState<"schema" | "data" | "prisma">("schema");
  const [selectedTable, setSelectedTable] = useState<string>("Customer (Client)");
  const [dataSearchTerm, setDataSearchTerm] = useState("");
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);

  const [newClientForm, setNewClientForm] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phoneNumber: "+91 ",
    city: "Indore",
    state: "Madhya Pradesh",
    industry: "Industrial Manufacturing",
  });

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientForm.fullName.trim()) return;

    createClient({
      fullName: newClientForm.fullName,
      companyName: newClientForm.companyName,
      email: newClientForm.email,
      phoneNumber: newClientForm.phoneNumber,
      city: newClientForm.city,
      state: newClientForm.state,
      industry: newClientForm.industry,
    });

    setIsNewClientModalOpen(false);
    setNewClientForm({
      fullName: "",
      companyName: "",
      email: "",
      phoneNumber: "+91 ",
      city: "Indore",
      state: "Madhya Pradesh",
      industry: "Industrial Manufacturing",
    });
  };

  const exportEntireDatabaseJson = () => {
    const dump = {
      exportedAt: new Date().toISOString(),
      platform: "Fabricaze Digital Manufacturing Marketplace",
      version: "2.0.0",
      tables: {
        clients,
        manufacturers,
        machines,
        rfqs,
        quotations,
        orders,
        disputes,
      },
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dump, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `fabricaze_db_dump_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
            <Database className="w-4 h-4" />
            <span>Fabricaze Architecture & Data Layer</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Database & Schema Visualizer
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Inspect relational tables, entity relationships, entry options, and explore live database records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportEntireDatabaseJson}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Database (JSON)</span>
          </button>

          <button
            onClick={() => setIsNewClientModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-2xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Client</span>
          </button>
        </div>
      </div>

      {/* Primary Mode Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("schema")}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            activeTab === "schema"
              ? "bg-slate-900 text-white shadow-2xs"
              : "bg-white text-slate-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Schema & ERD Structure (8 Tables)</span>
        </button>

        <button
          onClick={() => setActiveTab("data")}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            activeTab === "data"
              ? "bg-slate-900 text-white shadow-2xs"
              : "bg-white text-slate-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          <Table className="w-4 h-4" />
          <span>Live Data Records Browser</span>
        </button>

        <button
          onClick={() => setActiveTab("prisma")}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            activeTab === "prisma"
              ? "bg-slate-900 text-white shadow-2xs"
              : "bg-white text-slate-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Prisma Studio (PostgreSQL GUI)</span>
        </button>
      </div>

      {/* MODE 1: SCHEMA & ERD STRUCTURE */}
      {activeTab === "schema" && (
        <div className="space-y-6">
          {/* Quick Architecture Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Entities</span>
              <div className="text-2xl font-black text-slate-900 mt-1">8 Core Tables</div>
              <span className="text-[11px] text-blue-600 font-semibold">Relational Architecture</span>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Multi-Tenancy</span>
              <div className="text-2xl font-black text-slate-900 mt-1">3 Distinct Roles</div>
              <span className="text-[11px] text-emerald-600 font-semibold">Client • MSME • Admin</span>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Security Rule</span>
              <div className="text-2xl font-black text-slate-900 mt-1">Anti-Bypass ID</div>
              <span className="text-[11px] text-indigo-600 font-semibold">MSME Pseudonyms</span>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Financial Integrity</span>
              <div className="text-2xl font-black text-slate-900 mt-1">Escrow State Machine</div>
              <span className="text-[11px] text-amber-600 font-semibold">HELD ➔ RELEASED ➔ DISPUTE</span>
            </div>
          </div>

          {/* Tables Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {DATABASE_SCHEMA_TABLES.map((table) => (
              <div
                key={table.tableName}
                className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Table Header */}
                  <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Table className="w-4 h-4 text-blue-400" />
                        <h3 className="font-bold text-sm tracking-wide font-mono">{table.tableName}</h3>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{table.description}</p>
                    </div>
                    <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-400/30">
                      {table.columns.length} columns
                    </span>
                  </div>

                  {/* Columns List */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-gray-200 text-gray-500 uppercase text-[9px] font-bold tracking-wider">
                        <tr>
                          <th className="px-4 py-2">Column Name</th>
                          <th className="px-4 py-2">Data Type</th>
                          <th className="px-4 py-2">Constraint</th>
                          <th className="px-4 py-2">Default</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
                        {table.columns.map((col) => (
                          <tr key={col.name} className="hover:bg-slate-50/50">
                            <td className="px-4 py-2.5 font-bold text-slate-900 flex items-center gap-1.5">
                              {col.isPk && (
                                <span title="Primary Key">
                                  <Key className="w-3 h-3 text-amber-500" />
                                </span>
                              )}
                              {col.isFk && (
                                <span title="Foreign Key">
                                  <LinkIcon className="w-3 h-3 text-blue-500" />
                                </span>
                              )}
                              <span>{col.name}</span>
                            </td>
                            <td className="px-4 py-2.5 text-blue-700">{col.type}</td>
                            <td className="px-4 py-2.5">
                              {col.isPk ? (
                                <span className="text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded">
                                  PRIMARY KEY
                                </span>
                              ) : col.isFk ? (
                                <span className="text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded">
                                  FK ➔ {col.fkRef}
                                </span>
                              ) : col.unique ? (
                                <span className="text-[9px] font-bold bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.5 rounded">
                                  UNIQUE
                                </span>
                              ) : (
                                <span className="text-gray-400 text-[10px]">None</span>
                              )}
                            </td>
                            <td className="px-4 py-2.5 text-gray-500 text-[10px]">{col.default || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Relational Links */}
                <div className="p-3 bg-slate-50 border-t border-gray-100 flex flex-wrap gap-1.5 text-[10px] font-medium text-slate-600">
                  <span className="font-bold text-gray-400 uppercase text-[9px] mr-1">Foreign Relations:</span>
                  {table.relations.map((rel) => (
                    <span key={rel} className="bg-white border border-gray-200 px-2 py-0.5 rounded text-blue-700">
                      {rel}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODE 2: LIVE DATA RECORDS BROWSER */}
      {activeTab === "data" && (
        <div className="space-y-6">
          {/* Table Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
            {[
              { id: "Customer (Client)", label: "Clients", count: clients.length, icon: Users },
              { id: "Manufacturer", label: "Manufacturers (MSMEs)", count: manufacturers.length, icon: Factory },
              { id: "Machine", label: "Machines", count: machines.length, icon: Wrench },
              { id: "Enquiry", label: "Enquiries (RFQs)", count: rfqs.length, icon: Briefcase },
              { id: "Quotation", label: "Quotations (Bids)", count: quotations.length, icon: FileCheck2 },
              { id: "Order", label: "Orders (Escrow)", count: orders.length, icon: ShieldCheck },
              { id: "Dispute", label: "Disputes", count: disputes.length, icon: AlertTriangle },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTable(tab.id)}
                  className={`px-3.5 py-2 rounded-xl font-bold shrink-0 transition flex items-center gap-2 ${
                    selectedTable === tab.id
                      ? "bg-blue-600 text-white shadow-2xs"
                      : "bg-white text-slate-700 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      selectedTable === tab.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={dataSearchTerm}
              onChange={(e) => setDataSearchTerm(e.target.value)}
              placeholder={`Search records in table ${selectedTable}...`}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
            />
          </div>

          {/* Table Data View */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
            {/* 1. Clients Table */}
            {selectedTable === "Customer (Client)" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="px-6 py-3.5">ID (PK)</th>
                      <th className="px-6 py-3.5">Full Name</th>
                      <th className="px-6 py-3.5">Company Name</th>
                      <th className="px-6 py-3.5">Email</th>
                      <th className="px-6 py-3.5">Phone</th>
                      <th className="px-6 py-3.5">City & State</th>
                      <th className="px-6 py-3.5">Industry</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {clients.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-mono font-bold text-blue-600">{c.id}</td>
                        <td className="px-6 py-4 font-bold text-slate-900">{c.fullName}</td>
                        <td className="px-6 py-4 text-slate-700">{c.companyName}</td>
                        <td className="px-6 py-4 text-gray-500">{c.email}</td>
                        <td className="px-6 py-4 text-gray-500">{c.phoneNumber}</td>
                        <td className="px-6 py-4 text-slate-600">{c.city}, {c.state}</td>
                        <td className="px-6 py-4">
                          <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] px-2 py-0.5 rounded font-semibold">
                            {c.industry || "General Manufacturing"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 2. Manufacturers Table */}
            {selectedTable === "Manufacturer" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="px-6 py-3.5">ID (PK)</th>
                      <th className="px-6 py-3.5">Legal Facility Name</th>
                      <th className="px-6 py-3.5">Public Pseudonym (Anti-Bypass)</th>
                      <th className="px-6 py-3.5">Location</th>
                      <th className="px-6 py-3.5">Verification</th>
                      <th className="px-6 py-3.5">Rating</th>
                      <th className="px-6 py-3.5">Capabilities</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {manufacturers.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-mono font-bold text-blue-600">{m.id}</td>
                        <td className="px-6 py-4 font-bold text-slate-900">{m.companyName || "MSME Facility"}</td>
                        <td className="px-6 py-4 font-mono font-semibold text-emerald-700">{m.pseudoName}</td>
                        <td className="px-6 py-4 text-slate-600">{m.city}, {m.state}</td>
                        <td className="px-6 py-4">
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] px-2 py-0.5 rounded font-bold">
                            {m.verificationStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-amber-600 font-bold">★ {m.rating}</td>
                        <td className="px-6 py-4 text-slate-600 text-[11px]">{m.capabilities.join(", ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 3. Machines Table */}
            {selectedTable === "Machine" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="px-6 py-3.5">ID</th>
                      <th className="px-6 py-3.5">Machine Make & Model</th>
                      <th className="px-6 py-3.5">Category</th>
                      <th className="px-6 py-3.5">Travels (X / Y / Z)</th>
                      <th className="px-6 py-3.5">Hourly Rate</th>
                      <th className="px-6 py-3.5">Supported Materials</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {machines.map((mac) => (
                      <tr key={mac.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-mono font-bold text-blue-600">{mac.id}</td>
                        <td className="px-6 py-4 font-bold text-slate-900">{mac.name}</td>
                        <td className="px-6 py-4">
                          <span className="bg-slate-100 text-slate-800 text-[10px] px-2 py-0.5 rounded font-semibold">
                            {mac.machineType}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-700">
                          {mac.xAxisMm} × {mac.yAxisMm || "—"} × {mac.zAxisMm} mm
                        </td>
                        <td className="px-6 py-4 font-extrabold text-slate-900">
                          ₹{(mac.hourlyRateInr || 1200).toLocaleString()}/hr
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-[11px]">
                          {(mac.supportedMaterials || []).join(", ")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 4. Enquiries Table */}
            {selectedTable === "Enquiry" && (
              <div className="overflow-x-auto">
                {rfqs.length === 0 ? (
                  <div className="p-8 text-center text-xs text-gray-400">0 RFQ records in database.</div>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                      <tr>
                        <th className="px-6 py-3.5">Enquiry Code (PK)</th>
                        <th className="px-6 py-3.5">Client Owner (FK)</th>
                        <th className="px-6 py-3.5">Part Title</th>
                        <th className="px-6 py-3.5">Material & Quantity</th>
                        <th className="px-6 py-3.5">Tolerance</th>
                        <th className="px-6 py-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {rfqs.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 font-mono font-bold text-blue-600">{r.enquiryCode}</td>
                          <td className="px-6 py-4 text-slate-800 font-semibold">{r.clientName || r.clientId || "Client Account"}</td>
                          <td className="px-6 py-4 font-bold text-slate-900">{r.title}</td>
                          <td className="px-6 py-4 text-slate-600">{r.quantity} pcs • {r.rawMaterialType}</td>
                          <td className="px-6 py-4 font-mono text-slate-700">{r.toleranceMm}</td>
                          <td className="px-6 py-4">
                            <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] px-2 py-0.5 rounded font-bold">
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* 5. Quotations Table */}
            {selectedTable === "Quotation" && (
              <div className="overflow-x-auto">
                {quotations.length === 0 ? (
                  <div className="p-8 text-center text-xs text-gray-400">0 quotation records in database.</div>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                      <tr>
                        <th className="px-6 py-3.5">Quote Code</th>
                        <th className="px-6 py-3.5">Manufacturer</th>
                        <th className="px-6 py-3.5">Total Amount</th>
                        <th className="px-6 py-3.5">Lead Time</th>
                        <th className="px-6 py-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {quotations.map((q) => (
                        <tr key={q.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 font-mono font-bold text-blue-600">{q.quoteCode}</td>
                          <td className="px-6 py-4 font-semibold text-slate-900">{q.manufacturer.pseudoName}</td>
                          <td className="px-6 py-4 font-extrabold text-slate-900">
                            ₹{(q.totalCostInr + (q.taxGstInr || Math.round(q.totalCostInr * 0.18))).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-slate-600">{q.deliveryDate}</td>
                          <td className="px-6 py-4">
                            <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] px-2 py-0.5 rounded font-bold">
                              {q.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* 6. Orders Table */}
            {selectedTable === "Order" && (
              <div className="overflow-x-auto">
                {orders.length === 0 ? (
                  <div className="p-8 text-center text-xs text-gray-400">0 order records in database.</div>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                      <tr>
                        <th className="px-6 py-3.5">Order Number</th>
                        <th className="px-6 py-3.5">Part Title</th>
                        <th className="px-6 py-3.5">Manufacturer</th>
                        <th className="px-6 py-3.5">Escrow Amount</th>
                        <th className="px-6 py-3.5">Escrow Status</th>
                        <th className="px-6 py-3.5">Current Milestone</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 font-mono font-bold text-blue-600">{o.orderNumber}</td>
                          <td className="px-6 py-4 font-bold text-slate-900">{o.enquiryTitle}</td>
                          <td className="px-6 py-4 text-slate-700">{o.manufacturerPseudo}</td>
                          <td className="px-6 py-4 font-extrabold text-slate-900">₹{o.totalAmountInr.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] px-2 py-0.5 rounded font-bold">
                              {o.escrowStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] px-2 py-0.5 rounded font-bold">
                              {o.currentMilestone}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* 7. Disputes Table */}
            {selectedTable === "Dispute" && (
              <div className="overflow-x-auto">
                {disputes.length === 0 ? (
                  <div className="p-8 text-center text-xs text-gray-400">0 dispute records in database.</div>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                      <tr>
                        <th className="px-6 py-3.5">Dispute Code</th>
                        <th className="px-6 py-3.5">Order</th>
                        <th className="px-6 py-3.5">Issue Category</th>
                        <th className="px-6 py-3.5">Escrow Amount</th>
                        <th className="px-6 py-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {disputes.map((d) => (
                        <tr key={d.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 font-mono font-bold text-red-600">{d.disputeCode}</td>
                          <td className="px-6 py-4 font-semibold text-slate-900">{d.orderNumber}</td>
                          <td className="px-6 py-4 text-red-700">{d.issueType}</td>
                          <td className="px-6 py-4 font-extrabold text-slate-900">₹{d.valueInr.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] px-2 py-0.5 rounded font-bold">
                              {d.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODE 3: PRISMA STUDIO (POSTGRESQL GUI) GUIDE */}
      {activeTab === "prisma" && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-2xs space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Visualizing with Prisma Studio (Native Database GUI)
              </h2>
              <p className="text-xs text-slate-500">
                Prisma Studio provides a rich, visual web client directly connected to your PostgreSQL database.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <p className="text-slate-600 leading-relaxed">
              In your <code>fabricaze-backend</code> project, we have defined the complete relational Prisma schema at{" "}
              <code>prisma/schema.prisma</code> with all models (<code>Account</code>, <code>Customer</code>,{" "}
              <code>Manufacturer</code>, <code>Machine</code>, <code>Enquiry</code>, <code>Quotation</code>,{" "}
              <code>Order</code>, <code>Dispute</code>).
            </p>

            <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono space-y-2">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">
                Run this command in the backend terminal:
              </span>
              <div className="text-emerald-400 font-bold">npx prisma studio</div>
              <span className="text-[11px] text-slate-400 block mt-2">
                This launches Prisma Studio at <strong>http://localhost:5555</strong>, allowing visual spreadsheet-style editing, relationship traversal, and row creation!
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Client */}
      {isNewClientModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-gray-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Create New Client Account</h3>
                  <span className="text-[10px] text-gray-500">Adds an independent buyer profile</span>
                </div>
              </div>
              <button onClick={() => setIsNewClientModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddClient} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Contact Name</label>
                <input
                  type="text"
                  required
                  value={newClientForm.fullName}
                  onChange={(e) => setNewClientForm({ ...newClientForm, fullName: e.target.value })}
                  placeholder="e.g. Siddharth Malhotra"
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Company / Enterprise Name</label>
                <input
                  type="text"
                  required
                  value={newClientForm.companyName}
                  onChange={(e) => setNewClientForm({ ...newClientForm, companyName: e.target.value })}
                  placeholder="e.g. Apex Drone Technologies Pvt Ltd"
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newClientForm.email}
                    onChange={(e) => setNewClientForm({ ...newClientForm, email: e.target.value })}
                    placeholder="contact@company.com"
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">City</label>
                  <select
                    value={newClientForm.city}
                    onChange={(e) => setNewClientForm({ ...newClientForm, city: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Indore</option>
                    <option>Pune</option>
                    <option>Bengaluru</option>
                    <option>Ahmedabad</option>
                    <option>Chennai</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Industry Vertical</label>
                <input
                  type="text"
                  value={newClientForm.industry}
                  onChange={(e) => setNewClientForm({ ...newClientForm, industry: e.target.value })}
                  placeholder="Aerospace, Robotics, Automotive..."
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-[11px] leading-relaxed">
                <strong>Data Isolation:</strong> Inquiries submitted by this client will belong exclusively to their account and remain separate from other buyers.
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
                >
                  Create Client
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewClientModalOpen(false)}
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
  );
}
