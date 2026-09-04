export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  inventory: number;
  description: string;
  attributes: {
    proteinPerServing?: string;
    servings?: number;
    weight?: string;
    material?: string;
    flavors?: string[];
  };
  shipping: {
    shipsTo: string[];
    estimatedDeliveryDays: string;
  };
  refundPolicy: {
    available: boolean;
    windowDays: number;
  };
  aiPurchasingRules: {
    autoApprove: boolean;
    maxDiscountAllowed: number;
  };
}

export interface MerchantPassport {
  merchant: string;
  currency: string;
  categories: string[];
  capabilities: {
    checkout: boolean;
    payment_links: boolean;
    refunds: boolean;
    dynamic_bundling: boolean;
  };
  policies: {
    max_auto_discount: number;
    max_auto_transaction: number;
    human_approval_required_above: number;
  };
  fulfillment: {
    ships_to: string[];
    estimated_delivery: string;
  };
  returns: {
    available: boolean;
    window_days: number;
  };
  aiReadinessScore: number;
  missingFields: string[];
  products: Product[];
}

export interface PolicyConfig {
  maxAutoDiscount: number; // e.g. 300 INR
  maxDiscountPercentage: number; // e.g. 10%
  autoApproveThreshold: number; // e.g. 5000 INR
  requireApprovalAbove: number; // e.g. 5000 INR
  permissions: {
    analyzeSales: boolean;
    recommendDiscounts: boolean;
    createPaymentLinks: boolean;
    createOrders: boolean;
    recommendCrossSells: boolean;
    refundWithoutApproval: boolean;
    modifyProductPrice: boolean;
  };
}

export type AuditStage = 
  | 'USER INTENT'
  | 'CATALOG SEARCH'
  | 'FILTER'
  | 'RECOMMENDATION'
  | 'UPSELL'
  | 'POLICY CHECK'
  | 'USER CONSENT'
  | 'RAZORPAY ORDER'
  | 'PAYMENT'
  | 'FAILURE RECOVERY';

export interface AuditStep {
  id: string;
  timestamp: string;
  stage: AuditStage;
  label: string;
  details: string;
  status: 'success' | 'failed' | 'pending' | 'warning';
  metadata?: Record<string, any>;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
}

export interface RevenueOpportunity {
  id: string;
  title: string;
  type: 'cross-sell' | 'bundle' | 'abandoned-cart';
  description: string;
  baselineItem: string;
  targetItem: string;
  originalPrice: number;
  bundlePrice: number;
  discountAmount: number;
  potentialMonthlyRevenue: number;
  impactLevel: 'high' | 'medium' | 'low';
  status: 'active' | 'proposed' | 'dismissed';
}

export interface RevenueExperiment {
  id: string;
  title: string;
  controlConversion: number; // e.g. 6.2%
  controlAOV: number; // e.g. ₹2,420
  experimentConversion: number; // e.g. 7.8%
  experimentAOV: number; // e.g. ₹2,690
  winnerDetected: boolean;
  status: 'running' | 'completed' | 'draft';
  totalVisitors: number;
  totalOrders: number;
  revenueLift: number; // e.g. +₹18,420
}

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: 'created' | 'attempted' | 'paid' | 'failed';
  attempts: number;
  created_at: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  bundleOffer?: {
    items: Product[];
    originalPrice: number;
    discountPrice: number;
    savings: number;
  };
  orderId?: string;
  paymentStatus?: 'none' | 'pending' | 'paid' | 'failed' | 'retrying';
}
