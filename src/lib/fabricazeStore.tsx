"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { IManufacturer, IEnquiry, IQuotation, IOrder, IDispute, IMachine } from "@/types";
import { STANDARD_INDUSTRIAL_MACHINES } from "./machineCatalog";

interface FabricazeStoreContextType {
  // Data lists
  manufacturers: IManufacturer[];
  machines: IMachine[];
  rfqs: IEnquiry[];
  quotations: IQuotation[];
  orders: IOrder[];
  disputes: IDispute[];

  // Action methods
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

const STORAGE_KEY = "fabricaze_platform_clean_state_v1";

export function FabricazeStoreProvider({ children }: { children: React.ReactNode }) {
  // Clean slate states (starts strictly at ZERO)
  const [manufacturers, setManufacturers] = useState<IManufacturer[]>([]);
  const [machines, setMachines] = useState<IMachine[]>(STANDARD_INDUSTRIAL_MACHINES);
  const [rfqs, setRfqs] = useState<IEnquiry[]>([]);
  const [quotations, setQuotations] = useState<IQuotation[]>([]);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [disputes, setDisputes] = useState<IDispute[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage or initialize clean zero state
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setManufacturers(parsed.manufacturers || []);
        setMachines(parsed.machines || STANDARD_INDUSTRIAL_MACHINES);
        setRfqs(parsed.rfqs || []);
        setQuotations(parsed.quotations || []);
        setOrders(parsed.orders || []);
        setDisputes(parsed.disputes || []);
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
  }, [isLoaded, manufacturers, machines, rfqs, quotations, orders, disputes]);

  // Actions
  const createRfq = (rfqData: Partial<IEnquiry>): IEnquiry => {
    const code = `FAB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRfq: IEnquiry = {
      id: `enq-${Date.now()}`,
      enquiryCode: code,
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
      manufacturerId: quoteData.manufacturerId || "mfg-active",
      manufacturer: quoteData.manufacturer || {
        pseudoName: "Precision MSME #IND-4102",
        city: "Indore, MP",
        rating: 4.8,
        reviewCount: 42,
        capabilities: ["CNC Machining", "Lathe Turning", "Laser Cutting"],
        certifications: ["ISO 9001:2015"],
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

    // Update parent RFQ status to QUOTED
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

    // Update quotation status to ACCEPTED
    setQuotations((prev) =>
      prev.map((q) => (q.id === quoteId ? { ...q, status: "ACCEPTED" as const } : q))
    );

    // Update RFQ status to IN_PRODUCTION
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
      clientName: disputeData.clientName || "Buyer (Active Session)",
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
      certifications: mfgData.certifications || ["ISO 9001"],
      specialties: ["Precision Machining", "Prototyping"],
      machines: [],
    };

    setManufacturers((prev) => [newMfg, ...prev]);
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
    localStorage.removeItem(STORAGE_KEY);
    setManufacturers([]);
    setMachines(STANDARD_INDUSTRIAL_MACHINES);
    setRfqs([]);
    setQuotations([]);
    setOrders([]);
    setDisputes([]);
    alert("Platform reset to ZERO clean state successfully! All RFQs, bids, orders, and manufacturers cleared.");
  };

  return (
    <FabricazeStoreContext.Provider
      value={{
        manufacturers,
        machines,
        rfqs,
        quotations,
        orders,
        disputes,
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
