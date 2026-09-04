import { Product, MerchantPassport, PolicyConfig, RevenueOpportunity, RevenueExperiment } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_whey_101',
    name: 'Whey Protein Isolate (1kg)',
    price: 2499,
    category: 'supplements',
    inventory: 142,
    description: 'Ultra-pure 100% whey protein isolate with 26g protein per serving and minimal carbs.',
    attributes: {
      proteinPerServing: '26g',
      servings: 30,
      weight: '1kg',
      flavors: ['Chocolate Fudge', 'Vanilla Bean', 'Unflavored']
    },
    shipping: {
      shipsTo: ['IN'],
      estimatedDeliveryDays: '2-3 days'
    },
    refundPolicy: {
      available: true,
      windowDays: 7
    },
    aiPurchasingRules: {
      autoApprove: true,
      maxDiscountAllowed: 250
    }
  },
  {
    id: 'prod_creatine_102',
    name: 'Micronized Creatine Monohydrate (250g)',
    price: 999,
    category: 'supplements',
    inventory: 89,
    description: '100% pure pharmaceutical grade creatine for explosive strength and muscle endurance.',
    attributes: {
      servings: 83,
      weight: '250g',
      flavors: ['Unflavored', 'Fruit Punch']
    },
    shipping: {
      shipsTo: ['IN'],
      estimatedDeliveryDays: '2-4 days'
    },
    refundPolicy: {
      available: true,
      windowDays: 7
    },
    aiPurchasingRules: {
      autoApprove: true,
      maxDiscountAllowed: 100
    }
  },
  {
    id: 'prod_shaker_103',
    name: 'Pro Stainless Steel Shaker Bottle (700ml)',
    price: 399,
    category: 'gear',
    inventory: 215,
    description: 'Leak-proof double-wall insulated shaker with blender ball for lump-free smooth shakes.',
    attributes: {
      material: 'BPA-Free Stainless Steel',
      weight: '300g'
    },
    shipping: {
      shipsTo: ['IN'],
      estimatedDeliveryDays: '2-5 days'
    },
    refundPolicy: {
      available: true,
      windowDays: 14
    },
    aiPurchasingRules: {
      autoApprove: true,
      maxDiscountAllowed: 50
    }
  },
  {
    id: 'prod_bars_104',
    name: 'High Protein Snack Bars (Pack of 6)',
    price: 599,
    category: 'nutrition',
    inventory: 64,
    description: 'Delicious zero-added-sugar protein bars with 20g protein and high dietary fiber.',
    attributes: {
      proteinPerServing: '20g',
      servings: 6,
      weight: '360g',
      flavors: ['Almond Crunch', 'Cookie Dough']
    },
    shipping: {
      shipsTo: ['IN'],
      estimatedDeliveryDays: '2-3 days'
    },
    refundPolicy: {
      available: false,
      windowDays: 0
    },
    aiPurchasingRules: {
      autoApprove: true,
      maxDiscountAllowed: 60
    }
  },
  {
    id: 'prod_gloves_105',
    name: 'Padded Leather Gym Gloves',
    price: 799,
    category: 'gear',
    inventory: 48,
    description: 'Breathable ergonomic weightlifting gloves with wrist support wrap for max grip.',
    attributes: {
      material: 'Genuine Leather & Mesh',
      weight: '150g'
    },
    shipping: {
      shipsTo: ['IN'],
      estimatedDeliveryDays: '3-5 days'
    },
    refundPolicy: {
      available: true,
      windowDays: 7
    },
    aiPurchasingRules: {
      autoApprove: true,
      maxDiscountAllowed: 100
    }
  }
];

export const INITIAL_MERCHANT_PASSPORT: MerchantPassport = {
  merchant: 'UrbanFit',
  currency: 'INR',
  categories: ['fitness', 'supplements', 'nutrition', 'gear'],
  capabilities: {
    checkout: true,
    payment_links: true,
    refunds: false,
    dynamic_bundling: true
  },
  policies: {
    max_auto_discount: 300,
    max_auto_transaction: 5000,
    human_approval_required_above: 5000
  },
  fulfillment: {
    ships_to: ['IN'],
    estimated_delivery: '2-5 days'
  },
  returns: {
    available: true,
    window_days: 7
  },
  aiReadinessScore: 82,
  missingFields: ['Shipping regions (State-level)', 'Detailed allergy metadata'],
  products: INITIAL_PRODUCTS
};

export const DEFAULT_POLICY_CONFIG: PolicyConfig = {
  maxAutoDiscount: 300,
  maxDiscountPercentage: 10,
  autoApproveThreshold: 5000,
  requireApprovalAbove: 5000,
  permissions: {
    analyzeSales: true,
    recommendDiscounts: true,
    createPaymentLinks: true,
    createOrders: true,
    recommendCrossSells: true,
    refundWithoutApproval: false,
    modifyProductPrice: false
  }
};

export const INITIAL_OPPORTUNITIES: RevenueOpportunity[] = [
  {
    id: 'opp_whey_shaker',
    title: 'Opportunity 1 — Cross-sell Whey + Shaker',
    type: 'cross-sell',
    description: '42% of customers buying Whey Protein don\'t buy a shaker. Propose a Whey + Shaker bundle @ ₹2,699 instead of ₹2,898 (bounded ₹199 discount).',
    baselineItem: 'Whey Protein Isolate (1kg)',
    targetItem: 'Pro Stainless Steel Shaker Bottle (700ml)',
    originalPrice: 2898,
    bundlePrice: 2699,
    discountAmount: 199,
    potentialMonthlyRevenue: 8400,
    impactLevel: 'high',
    status: 'active'
  },
  {
    id: 'opp_weekend_recovery',
    title: 'Opportunity 2 — Weekend Recovery Bundle',
    type: 'bundle',
    description: 'Combine Creatine + Protein Bars into an impulse workout recovery bundle at ₹1,449 instead of ₹1,598 (₹149 discount).',
    baselineItem: 'Micronized Creatine Monohydrate (250g)',
    targetItem: 'High Protein Snack Bars (Pack of 6)',
    originalPrice: 1598,
    bundlePrice: 1449,
    discountAmount: 149,
    potentialMonthlyRevenue: 5200,
    impactLevel: 'medium',
    status: 'proposed'
  }
];

export const INITIAL_EXPERIMENT: RevenueExperiment = {
  id: 'exp_whey_shaker_v1',
  title: 'Whey + Shaker Bundle A/B Test',
  controlConversion: 6.2,
  controlAOV: 2420,
  experimentConversion: 7.8,
  experimentAOV: 2690,
  winnerDetected: true,
  status: 'running',
  totalVisitors: 1240,
  totalOrders: 97,
  revenueLift: 18420
};
