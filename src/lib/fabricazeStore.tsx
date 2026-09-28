"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { IClient, IManufacturer, IEnquiry, IQuotation, IOrder, IDispute, IMachine } from "@/types";
import { STANDARD_INDUSTRIAL_MACHINES } from "./machineCatalog";

export const INITIAL_CLIENTS: IClient[] = [
  {
    id: "cli-1",
    fullName: "Ayush Jain",
    companyName: "Fabricaze Dynamics Ltd",
    email: "ayush@fabricaze.com",
    phoneNumber: "+91 98260 11223",
    city: "Indore",
    state: "Madhya Pradesh",
    industry: "Industrial Automation & Robotics",
    createdAt: "2026-09-01",
  },
  {
    id: "cli-2",
    fullName: "Rohan Verma",
    companyName: "AeroPrecision Systems Pvt Ltd",
    email: "rohan.v@aeroprecision.in",
    phoneNumber: "+91 94250 88990",
    city: "Pune",
    state: "Maharashtra",
    industry: "Aerospace & Defence Components",
    createdAt: "2026-09-10",
  },
  {
    id: "cli-3",
    fullName: "Vikram Singhania",
    companyName: "Titan Medical Devices",
    email: "vikram@titanmed.org",
    phoneNumber: "+91 98450 33441",
    city: "Bengaluru",
    state: "Karnataka",
    industry: "Surgical Instruments & Prosthetics",
    createdAt: "2026-09-15",
  },
];

export const INITIAL_MANUFACTURERS_MULTI: IManufacturer[] = [
  {
    id: "mfg-1",
    companyName: "Indore Precision CNC Works",
    pseudoName: "Precision MSME #IND-4102",
    city: "Indore",
    state: "Madhya Pradesh",
    rating: 4.9,
    reviewCount: 42,
    verificationStatus: "VERIFIED",
    distanceKm: 8,
    responseTime: "< 1 hour",
    priceRange: "₹₹",
    capabilities: ["CNC Machining", "Lathe Turning", "CMM Inspection"],
    certifications: ["ISO 9001:2015", "MSME ZED Gold"],
    specialties: ["Aluminum Turning", "Close Tolerance Shafts"],
  },
  {
    id: "mfg-2",
    companyName: "Metro AeroTech Fabricators",
    pseudoName: "Metro Fabricators #PUN-9821",
    city: "Pune",
    state: "Maharashtra",
    rating: 4.8,
    reviewCount: 68,
    verificationStatus: "VERIFIED",
    distanceKm: 14,
    responseTime: "< 2 hours",
    priceRange: "₹₹₹",
    capabilities: ["5-Axis CNC", "Fiber Laser Cutting", "Heat Treatment"],
    certifications: ["ISO 9001:2015", "AS9100D"],
    specialties: ["Titanium Machining", "Complex Impellers"],
  },
  {
    id: "mfg-3",
    companyName: "Gujarat Toolcraft Industries",
    pseudoName: "Apex Toolcraft #AHM-6503",
    city: "Ahmedabad",
    state: "Gujarat",
    rating: 4.7,
    reviewCount: 31,
    verificationStatus: "VERIFIED",
    distanceKm: 22,
    responseTime: "< 3 hours",
    priceRange: "₹₹",
    capabilities: ["Sheet Metal", "Press Brake", "Industrial 3D Printing"],
    certifications: ["ISO 9001:2015"],
    specialties: ["Enclosures", "Rapid Sheet Prototyping"],
  },
];

interface FabricazeStoreContextType {
  // Multitenancy & Active Persona
  activeRole: "CLIENT" | "MANUFACTURER" | "ADMIN";
  activeClientId: string;
  activeManufacturerId: string;
  setActiveRole: (role: "CLIENT" | "MANUFACTURER" | "ADMIN") => void;
  setActiveClientId: (id: string) => void;
  setActiveManufacturerId: (id: string) => void;

  // Active user objects
  activeClient: IClient;
  activeManufacturer: IManufacturer;

  // Database tables
  clients: IClient[];
  manufacturers: IManufacturer[];
  machines: IMachine[];
  rfqs: IEnquiry[];
  quotations: IQuotation[];
  orders: IOrder[];
  disputes: IDispute[];

  // Tenant-scoped lists
  myRfqs: IEnquiry[];
  myOrders: IOrder[];
  mfgSubmittedQuotes: IQuotation[];
  mfgAssignedOrders: IOrder[];

  // Action methods
  createClient: (clientData: Partial<IClient>) => IClient;
  createRfq: (rfqData: Partial<IEnquiry>) => IEnquiry;
  submitQuotation: (quoteData: Partial<IQuotation>) => IQuotation;
  awardQuotation: (rfqId: string, quoteId: string) => IOrder;
  advanceOrderMilestone: (orderId: string, milestone: IOrder["currentMilestone"]) => void;
  raiseDispute: (disputeData: Partial<IDispute>) => IDispute;
  resolveDispute: (disputeId: string, action: string) => void;
  onboardManufacturer: (mfgData: Partial<IManufacturer>) => IManufacturer;
  addMachine: (machineData: Partial<IMachine>) => IMachine;
  resetAllToZero: () => void;
}

const FabricazeStoreContext = createContext<FabricazeStoreContextType | null>(null);

const STORAGE_KEY = "fabricaze_platform_clean_state_v2";

export function FabricazeStoreProvider({ children }: { children: React.ReactNode }) {
  // Multitenancy persona state
  const [activeRole, setActiveRole] = useState<"CLIENT" | "MANUFACTURER" | "ADMIN">("CLIENT");
  const [activeClientId, setActiveClientId] = useState<string>("cli-1");
  const [activeManufacturerId, setActiveManufacturerId] = useState<string>("mfg-1");

  // Database entities
  const [clients, setClients] = useState<IClient[]>(INITIAL_CLIENTS);
  const [manufacturers, setManufacturers] = useState<IManufacturer[]>(INITIAL_MANUFACTURERS_MULTI);
  const [machines, setMachines] = useState<IMachine[]>(STANDARD_INDUSTRIAL_MACHINES);
  const [rfqs, setRfqs] = useState<IEnquiry[]>([]);
  const [quotations, setQuotations] = useState<IQuotation[]>([]);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [disputes, setDisputes] = useState<IDispute[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.clients && parsed.clients.length > 0) setClients(parsed.clients);
        if (parsed.manufacturers && parsed.manufacturers.length > 0) setManufacturers(parsed.manufacturers);
        if (parsed.machines) setMachines(parsed.machines);
        if (parsed.rfqs) setRfqs(parsed.rfqs);
        if (parsed.quotations) setQuotations(parsed.quotations);
        if (parsed.orders) setOrders(parsed.orders);
        if (parsed.disputes) setDisputes(parsed.disputes);
        if (parsed.activeRole) setActiveRole(parsed.activeRole);
        if (parsed.activeClientId) setActiveClientId(parsed.activeClientId);
        if (parsed.activeManufacturerId) setActiveManufacturerId(parsed.activeManufacturerId);
      }
    } catch (e) {
      console.error("Failed to load store from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          activeRole,
          activeClientId,
          activeManufacturerId,
          clients,
          manufacturers,
          machines,
          rfqs,
          quotations,
          orders,
          disputes,
        })
      );
    } catch (e) {
      console.error("Failed to save store to localStorage", e);
    }
  }, [
    isLoaded,
    activeRole,
    activeClientId,
    activeManufacturerId,
    clients,
    manufacturers,
    machines,
    rfqs,
    quotations,
    orders,
    disputes,
  ]);

  // Derived active objects
  const activeClient = clients.find((c) => c.id === activeClientId) || clients[0] || INITIAL_CLIENTS[0];
  const activeManufacturer =
    manufacturers.find((m) => m.id === activeManufacturerId) || manufacturers[0] || INITIAL_MANUFACTURERS_MULTI[0];

  // Scoped lists for Multi-Tenancy
  // Client only sees RFQs posted by their own account
  const myRfqs = rfqs.filter((r) => !r.clientId || r.clientId === activeClient.id);
  // Client only sees Orders belonging to their RFQs or client ID
  const myOrders = orders.filter((o) => !o.clientId || o.clientId === activeClient.id);

  // Manufacturer only sees quotes they submitted
  const mfgSubmittedQuotes = quotations.filter((q) => q.manufacturerId === activeManufacturer.id);
  // Manufacturer only sees orders awarded to them
  const mfgAssignedOrders = orders.filter((o) => o.manufacturerId === activeManufacturer.id);

  // Actions
  const createClient = (clientData: Partial<IClient>): IClient => {
    const newClient: IClient = {
      id: `cli-${Date.now()}`,
      fullName: clientData.fullName || "New Enterprise Client",
      companyName: clientData.companyName || "Innovations Inc",
      email: clientData.email || `client-${Date.now()}@domain.com`,
      phoneNumber: clientData.phoneNumber || "+91 99000 00000",
      city: clientData.city || "Indore",
      state: clientData.state || "Madhya Pradesh",
      industry: clientData.industry || "General Engineering",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setClients((prev) => [newClient, ...prev]);
    setActiveClientId(newClient.id);
    return newClient;
  };

  const createRfq = (rfqData: Partial<IEnquiry>): IEnquiry => {
    const code = `FAB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRfq: IEnquiry = {
      id: `enq-${Date.now()}`,
      enquiryCode: code,
      clientId: activeClient.id,
      clientName: `${activeClient.fullName} (${activeClient.companyName})`,
      title: rfqData.title || "Custom Machined Part",
      description: rfqData.description || "",
      rawMaterialType: rfqData.rawMaterialType || "Aluminum 6061-T6",
      processType: rfqData.processType || "CNC_MACHINING",
      surfaceFinish: rfqData.surfaceFinish || "AS_MACHINED",
      toleranceMm: rfqData.toleranceMm || "±0.05 mm",
      quantity: rfqData.quantity || 10,
      requiredDeliveryDate: rfqData.requiredDeliveryDate || "2026-10-15",
      fileName: rfqData.fileName || "custom_part_drawing.step",
      fileUrl: rfqData.fileUrl || "/cad/sample.step",
      fileType: rfqData.fileType || "step",
      estimatedBudgetMin: rfqData.estimatedBudgetMin || 2500,
      estimatedBudgetMax: rfqData.estimatedBudgetMax || 8500,
      priority: rfqData.priority || "HIGH",
      status: "OPEN",
      createdAt: new Date().toISOString().split("T")[0],
      quotations: [],
    };

    setRfqs((prev) => [newRfq, ...prev]);
    return newRfq;
  };

  const submitQuotation = (quoteData: Partial<IQuotation>): IQuotation => {
    const quoteCode = `QUO-${Math.floor(100 + Math.random() * 900)}`;
    const newQuote: IQuotation = {
      id: `quote-${Date.now()}`,
      quoteCode,
      enquiryId: quoteData.enquiryId || "",
      manufacturerId: activeManufacturer.id,
      manufacturer: {
        pseudoName: activeManufacturer.pseudoName,
        city: `${activeManufacturer.city}, ${activeManufacturer.state}`,
        rating: activeManufacturer.rating,
        reviewCount: activeManufacturer.reviewCount,
        capabilities: activeManufacturer.capabilities,
        certifications: activeManufacturer.certifications,
      },
      totalCostInr: quoteData.totalCostInr || 3200,
      machiningCostInr: Math.round((quoteData.totalCostInr || 3200) * 0.6),
      materialCostInr: Math.round((quoteData.totalCostInr || 3200) * 0.3),
      toolingCostInr: Math.round((quoteData.totalCostInr || 3200) * 0.1),
      taxGstInr: Math.round((quoteData.totalCostInr || 3200) * 0.18),
      leadTimeDays: quoteData.leadTimeDays || 7,
      deliveryDate: `${quoteData.leadTimeDays || 7} business days`,
      notes: quoteData.notes || "Ready for immediate machining. CMM inspection reports provided.",
      status: "PENDING",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setQuotations((prev) => [newQuote, ...prev]);

    setRfqs((prev) =>
      prev.map((r) =>
        r.id === quoteData.enquiryId
          ? {
              ...r,
              status: "QUOTED" as const,
              quotations: [...(r.quotations || []), newQuote],
            }
          : r
      )
    );

    return newQuote;
  };

  const awardQuotation = (rfqId: string, quoteId: string): IOrder => {
    const targetRfq = rfqs.find((r) => r.id === rfqId);
    const targetQuote = quotations.find((q) => q.id === quoteId);

    const orderNumber = `ORD-${targetRfq ? targetRfq.enquiryCode.replace("FAB-", "") : "8821"}`;
    const newOrder: IOrder = {
      id: `ord-${Date.now()}`,
      orderNumber,
      enquiryId: rfqId,
      clientId: targetRfq?.clientId || activeClient.id,
      manufacturerId: targetQuote?.manufacturerId || activeManufacturer.id,
      enquiryTitle: targetRfq?.title || "Custom CNC Batch",
      partSpecs: `${targetRfq?.quantity || 10} pcs • ${targetRfq?.rawMaterialType || "Alloy"} • ${targetRfq?.toleranceMm || "±0.05mm"}`,
      manufacturerPseudo: targetQuote?.manufacturer.pseudoName || "Verified MSME Partner",
      totalAmountInr: targetQuote
        ? targetQuote.totalCostInr + (targetQuote.taxGstInr || Math.round(targetQuote.totalCostInr * 0.18))
        : 3776,
      escrowStatus: "HELD",
      currentMilestone: "DRAWING_REVIEW",
      testReportsUrls: [
        "https://storage.fabricaze.com/reports/cmm_inspection_certificate.pdf",
        "https://storage.fabricaze.com/reports/hardness_ht_test.pdf",
      ],
      trackingNumber: "DELHIVERY-FAB-" + Math.floor(10000 + Math.random() * 90000),
      createdAt: new Date().toISOString().split("T")[0],
    };

    setQuotations((prev) =>
      prev.map((q) => (q.id === quoteId ? { ...q, status: "ACCEPTED" as const } : q))
    );

    setRfqs((prev) =>
      prev.map((r) => (r.id === rfqId ? { ...r, status: "IN_PRODUCTION" as const } : r))
    );

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const advanceOrderMilestone = (orderId: string, milestone: IOrder["currentMilestone"]) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              currentMilestone: milestone,
              escrowStatus: milestone === "DELIVERED" ? "RELEASED" : o.escrowStatus,
            }
          : o
      )
    );
  };

  const raiseDispute = (disputeData: Partial<IDispute>): IDispute => {
    const code = `DIS-${Math.floor(100 + Math.random() * 900)}`;
    const newDispute: IDispute = {
      id: `dis-${Date.now()}`,
      disputeCode: code,
      orderNumber: disputeData.orderNumber || "ORD-2024-001",
      jobTitle: disputeData.jobTitle || "Custom Precision Part",
      clientName: disputeData.clientName || activeClient.fullName,
      manufacturerPseudo: disputeData.manufacturerPseudo || "MSME Vendor",
      issueType: disputeData.issueType || "Quality Issue",
      priority: disputeData.priority || "High",
      status: "Open",
      valueInr: disputeData.valueInr || 15000,
      reportedDate: new Date().toISOString().split("T")[0],
    };

    setDisputes((prev) => [newDispute, ...prev]);
    return newDispute;
  };

  const resolveDispute = (disputeId: string, action: string) => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === disputeId ? { ...d, status: "Resolved" as const } : d))
    );
  };

  const onboardManufacturer = (mfgData: Partial<IManufacturer>): IManufacturer => {
    const city = mfgData.city || "Indore";
    const cityCode = city.slice(0, 3).toUpperCase();
    const pseudoName = `${mfgData.companyName || "Vendor"} #${cityCode}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newMfg: IManufacturer = {
      id: `mfg-${Date.now()}`,
      companyName: mfgData.companyName || "New MSME Facility",
      pseudoName,
      city,
      state: mfgData.state || "Madhya Pradesh",
      rating: 5.0,
      reviewCount: 0,
      verificationStatus: mfgData.verificationStatus || "VERIFIED",
      distanceKm: Math.floor(2 + Math.random() * 15),
      responseTime: "< 2 hours",
      priceRange: "₹₹",
      capabilities: mfgData.capabilities || ["CNC Machining", "Laser Cutting"],
      certifications: mfgData.certifications || ["ISO 9001:2015"],
      specialties: ["Precision Machining", "Prototyping"],
      machines: [],
    };

    setManufacturers((prev) => [newMfg, ...prev]);
    setActiveManufacturerId(newMfg.id);
    return newMfg;
  };

  const addMachine = (machineData: Partial<IMachine>): IMachine => {
    const newMachine: IMachine = {
      id: `mac-${Date.now()}`,
      name: machineData.name || "Custom CNC Lathe",
      machineType: machineData.machineType || "CNC Turning",
      xAxisMm: machineData.xAxisMm || 500,
      yAxisMm: machineData.yAxisMm || 300,
      zAxisMm: machineData.zAxisMm || 400,
      maxPartSizeMm: machineData.maxPartSizeMm || 500,
      hourlyRateInr: machineData.hourlyRateInr || 1200,
      isActive: true,
      supportedMaterials: machineData.supportedMaterials || ["Aluminum", "Mild Steel"],
    };

    setMachines((prev) => [newMachine, ...prev]);
    return newMachine;
  };

  const resetAllToZero = () => {
    setRfqs([]);
    setQuotations([]);
    setOrders([]);
    setDisputes([]);
    setClients(INITIAL_CLIENTS);
    setManufacturers(INITIAL_MANUFACTURERS_MULTI);
    setMachines(STANDARD_INDUSTRIAL_MACHINES);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <FabricazeStoreContext.Provider
      value={{
        activeRole,
        activeClientId,
        activeManufacturerId,
        setActiveRole,
        setActiveClientId,
        setActiveManufacturerId,
        activeClient,
        activeManufacturer,
        clients,
        manufacturers,
        machines,
        rfqs,
        quotations,
        orders,
        disputes,
        myRfqs,
        myOrders,
        mfgSubmittedQuotes,
        mfgAssignedOrders,
        createClient,
        createRfq,
        submitQuotation,
        awardQuotation,
        advanceOrderMilestone,
        raiseDispute,
        resolveDispute,
        onboardManufacturer,
        addMachine,
        resetAllToZero,
      }}
    >
      {children}
    </FabricazeStoreContext.Provider>
  );
}

export function useFabricazeStore() {
  const context = useContext(FabricazeStoreContext);
  if (!context) {
    throw new Error("useFabricazeStore must be used within a FabricazeStoreProvider");
  }
  return context;
}
