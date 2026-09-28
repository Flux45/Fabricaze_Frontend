/**
 * @file index.ts (Frontend Domain Contracts)
 * @description Central TypeScript interfaces for Fabricaze Digital Marketplace.
 */

export type UserRole = 'PUBLIC' | 'CUSTOMER' | 'MANUFACTURER' | 'ADMIN';

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export type ProcessType =
  | 'CNC_MACHINING'
  | 'SHEET_METAL_FABRICATION'
  | 'LASER_CUTTING'
  | 'THREE_D_PRINTING'
  | 'ANODIZING_COATING'
  | 'HEAT_TREATMENT'
  | 'CASTING_FORGING'
  | 'WELDING_ASSEMBLY';

export type SurfaceFinish =
  | 'AS_MACHINED'
  | 'SMOOTH_BEAD_BLASTED'
  | 'ANODIZED_TYPE_II'
  | 'ANODIZED_HARDCOAT_TYPE_III'
  | 'POWDER_COATED'
  | 'ELECTROPOLISHED'
  | 'ZINC_PLATED';

export interface IClient {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  city: string;
  state: string;
  industry?: string;
  createdAt: string;
}

export interface IMachine {
  id: string;
  name: string;
  machineType: string;
  xAxisMm?: number;
  yAxisMm?: number;
  zAxisMm?: number;
  maxPartSizeMm?: number;
  hourlyRateInr?: number;
  isActive: boolean;
  supportedMaterials: string[];
}

export interface IManufacturer {
  id: string;
  companyName?: string; // Revealed only to Admin
  pseudoName: string;   // Shown to Customers (Disintermediation protection)
  city: string;
  state: string;
  rating: number;
  reviewCount: number;
  verificationStatus: VerificationStatus;
  distanceKm?: number;
  responseTime?: string;
  capabilities: string[];
  certifications: string[];
  machines?: IMachine[];
  specialties?: string[];
  priceRange?: string; // '₹₹' | '₹₹₹'
}

export interface IQuotation {
  id: string;
  quoteCode: string;
  enquiryId: string;
  manufacturerId: string;
  manufacturer: {
    pseudoName: string;
    city: string;
    rating: number;
    reviewCount?: number;
    certifications?: string[];
    capabilities?: string[];
  };
  totalCostInr: number;
  machiningCostInr?: number;
  materialCostInr?: number;
  toolingCostInr?: number;
  taxGstInr?: number;
  leadTimeDays: number;
  deliveryDate: string;
  notes?: string;
  isUnusualQuote?: boolean;
  budgetVariancePct?: number;
  status: 'PENDING' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED';
  createdAt?: string;
}

export interface IEnquiry {
  id: string;
  enquiryCode: string;
  clientId?: string;
  clientName?: string;
  title: string;
  description?: string;
  rawMaterialType: string;
  processType: ProcessType;
  surfaceFinish: SurfaceFinish;
  toleranceMm: string;
  quantity: number;
  requiredDeliveryDate: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  estimatedBudgetMin?: number;
  estimatedBudgetMax?: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'QUOTED' | 'IN_PRODUCTION' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  quotations?: IQuotation[];
}

export interface IOrder {
  id: string;
  orderNumber: string;
  enquiryId: string;
  clientId?: string;
  manufacturerId?: string;
  enquiryTitle: string;
  partSpecs: string;
  manufacturerPseudo: string;
  totalAmountInr: number;
  escrowStatus: 'HELD' | 'RELEASED' | 'REFUNDED' | 'DISPUTED';
  currentMilestone:
    | 'DRAWING_REVIEW'
    | 'MATERIAL_PROCUREMENT'
    | 'MACHINING_FABRICATION'
    | 'QC_INSPECTION'
    | 'DISPATCHED'
    | 'DELIVERED';
  testReportsUrls: string[];
  trackingNumber?: string;
  createdAt: string;
}

export interface IDispute {
  id: string;
  disputeCode: string;
  orderNumber: string;
  jobTitle: string;
  clientName: string;
  manufacturerPseudo: string;
  issueType: 'Quality Issue' | 'Delivery Delay' | 'Communication' | 'Spec Mismatch';
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved';
  valueInr: number;
  reportedDate: string;
}
