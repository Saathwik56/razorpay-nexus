import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding AgentBoost UrbanFit Merchant Data...');

  // 1. Clean existing records
  await prisma.auditLog.deleteMany();
  await prisma.agentAction.deleteMany();
  await prisma.agentSession.deleteMany();
  await prisma.recommendation.deleteMany();
  await prisma.experiment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.policy.deleteMany();
  await prisma.product.deleteMany();
  await prisma.merchant.deleteMany();
  await prisma.webhookEvent.deleteMany();

  // 2. Create Merchant
  const merchant = await prisma.merchant.create({
    data: {
      id: 'merchant_urbanfit_1',
      name: 'UrbanFit',
      email: 'admin@urbanfit.in',
      businessName: 'UrbanFit Sports Nutrition Ltd',
      description: 'Premium fitness supplements, workout gear, and performance nutrition.',
      currency: 'INR',
      aiReadinessScore: 90,
      razorpayKeyId: 'rzp_test_agentboost_urbanfit',
      razorpayAccountStatus: 'TEST_MODE_ACTIVE',
    }
  });

  // 3. Create Policy
  await prisma.policy.create({
    data: {
      merchantId: merchant.id,
      maxAutoTransaction: 5000,
      maxAutoDiscount: 300,
      maxDiscountPercentage: 10,
      allowCreateOrder: true,
      allowCreatePaymentLink: true,
      allowCapturePayment: true,
      allowRefund: false,
      allowPriceChange: false,
      humanApprovalAbove: 5000,
    }
  });

  // 4. Create Products (10 realistic items)
  const productsData = [
    {
      id: 'prod_1',
      name: 'Whey Protein Isolate (1kg)',
      slug: 'whey-protein-isolate-1kg',
      description: 'Ultra-pure 100% whey protein isolate with 26g protein per serving.',
      category: 'supplements',
      price: 2499,
      inventory: 142,
      sku: 'UF-WHEY-101',
      attributes: JSON.stringify({ protein: '26g', servings: 30, weight: '1kg', flavor: 'Chocolate Fudge' }),
      shippingInfo: JSON.stringify({ shipsTo: ['IN'], estimatedDeliveryDays: '2-3 days' }),
      returnPolicy: JSON.stringify({ available: true, windowDays: 7 }),
    },
    {
      id: 'prod_2',
      name: 'Pro Stainless Steel Shaker (700ml)',
      slug: 'pro-stainless-steel-shaker',
      description: 'Leak-proof double-wall insulated shaker with blender ball.',
      category: 'gear',
      price: 399,
      inventory: 215,
      sku: 'UF-SHAKER-102',
      attributes: JSON.stringify({ material: 'BPA-Free Stainless Steel', capacity: '700ml' }),
      shippingInfo: JSON.stringify({ shipsTo: ['IN'], estimatedDeliveryDays: '2-5 days' }),
      returnPolicy: JSON.stringify({ available: true, windowDays: 14 }),
    },
    {
      id: 'prod_3',
      name: 'Micronized Creatine Monohydrate (250g)',
      slug: 'micronized-creatine-250g',
      description: '100% pure pharmaceutical grade creatine monohydrate for strength.',
      category: 'supplements',
      price: 999,
      inventory: 89,
      sku: 'UF-CREATINE-103',
      attributes: JSON.stringify({ servings: 83, weight: '250g', flavor: 'Unflavored' }),
      shippingInfo: JSON.stringify({ shipsTo: ['IN'], estimatedDeliveryDays: '2-4 days' }),
      returnPolicy: JSON.stringify({ available: true, windowDays: 7 }),
    },
    {
      id: 'prod_4',
      name: 'High Protein Snack Bars (Pack of 6)',
      slug: 'high-protein-bars-pack-6',
      description: 'Delicious zero-added-sugar protein bars with 20g protein.',
      category: 'nutrition',
      price: 599,
      inventory: 64,
      sku: 'UF-BARS-104',
      attributes: JSON.stringify({ protein: '20g', count: 6, flavor: 'Almond Crunch' }),
      shippingInfo: JSON.stringify({ shipsTo: ['IN'], estimatedDeliveryDays: '2-3 days' }),
      returnPolicy: JSON.stringify({ available: false, windowDays: 0 }),
    },
    {
      id: 'prod_5',
      name: 'Padded Leather Gym Gloves',
      slug: 'padded-leather-gym-gloves',
      description: 'Ergonomic weightlifting gloves with wrist support wrap.',
      category: 'gear',
      price: 799,
      inventory: 48,
      sku: 'UF-GLOVES-105',
      attributes: JSON.stringify({ material: 'Leather & Mesh', size: 'L' }),
      shippingInfo: JSON.stringify({ shipsTo: ['IN'], estimatedDeliveryDays: '3-5 days' }),
      returnPolicy: JSON.stringify({ available: true, windowDays: 7 }),
    },
    {
      id: 'prod_6',
      name: 'BCAA 2:1:1 Intra-Workout Powder (300g)',
      slug: 'bcaa-intra-workout-300g',
      description: 'Branched-chain amino acids for reduced fatigue during workout.',
      category: 'supplements',
      price: 1299,
      inventory: 75,
      sku: 'UF-BCAA-106',
      attributes: JSON.stringify({ servings: 30, flavor: 'Watermelon Burst' }),
      shippingInfo: JSON.stringify({ shipsTo: ['IN'], estimatedDeliveryDays: '2-4 days' }),
      returnPolicy: JSON.stringify({ available: true, windowDays: 7 }),
    },
    {
      id: 'prod_7',
      name: 'Pre-Workout Energy Matrix (250g)',
      slug: 'pre-workout-energy-250g',
      description: 'High stimulant formula with Beta-Alanine and L-Citrulline.',
      category: 'supplements',
      price: 1899,
      inventory: 50,
      sku: 'UF-PRE-107',
      attributes: JSON.stringify({ caffeine: '250mg', servings: 30, flavor: 'Blue Raspberry' }),
      shippingInfo: JSON.stringify({ shipsTo: ['IN'], estimatedDeliveryDays: '2-3 days' }),
      returnPolicy: JSON.stringify({ available: true, windowDays: 7 }),
    },
    {
      id: 'prod_8',
      name: 'Lean Mass Gainer (2kg)',
      slug: 'lean-mass-gainer-2kg',
      description: 'Complex carbohydrate and protein formula for muscle bulk.',
      category: 'supplements',
      price: 3199,
      inventory: 30,
      sku: 'UF-GAINER-108',
      attributes: JSON.stringify({ protein: '50g', calories: '650kcal', weight: '2kg' }),
      shippingInfo: JSON.stringify({ shipsTo: ['IN'], estimatedDeliveryDays: '3-5 days' }),
      returnPolicy: JSON.stringify({ available: true, windowDays: 7 }),
    },
    {
      id: 'prod_9',
      name: 'Heavy Duty Neoprene Lifting Belt',
      slug: 'neoprene-lifting-belt',
      description: '6-inch wide lumbar support belt with quick-release buckle.',
      category: 'gear',
      price: 1499,
      inventory: 40,
      sku: 'UF-BELT-109',
      attributes: JSON.stringify({ material: 'Neoprene & Steel Buckle', waistSize: '32-36 in' }),
      shippingInfo: JSON.stringify({ shipsTo: ['IN'], estimatedDeliveryDays: '2-4 days' }),
      returnPolicy: JSON.stringify({ available: true, windowDays: 14 }),
    },
    {
      id: 'prod_10',
      name: 'Loop Resistance Bands (Set of 5)',
      slug: 'loop-resistance-bands-set-5',
      description: 'Latex resistance loop bands with varying resistance levels.',
      category: 'gear',
      price: 499,
      inventory: 110,
      sku: 'UF-BANDS-110',
      attributes: JSON.stringify({ resistanceLevels: 'Extra Light to Extra Heavy', count: 5 }),
      shippingInfo: JSON.stringify({ shipsTo: ['IN'], estimatedDeliveryDays: '2-5 days' }),
      returnPolicy: JSON.stringify({ available: true, windowDays: 14 }),
    }
  ];

  for (const p of productsData) {
    await prisma.product.create({ data: { ...p, merchantId: merchant.id } });
  }

  // 5. Create Customers (50 records)
  const customers = [];
  for (let i = 1; i <= 50; i++) {
    const cust = await prisma.customer.create({
      data: {
        id: `cust_${i}`,
        name: `Fitness Enthusiast ${i}`,
        email: `customer${i}@example.com`,
        phone: `+9198765${10000 + i}`,
      }
    });
    customers.push(cust);
  }

  // 6. Create Historical Orders (200 orders, including cross-sells and 20 failed payments)
  console.log('Generating 200 orders & cross-sell patterns...');
  for (let i = 1; i <= 200; i++) {
    const customer = customers[i % 50];
    const isAiBuyer = i % 4 === 0;
    const isFailed = i % 10 === 0; // 20 failed payments
    const source = isAiBuyer ? 'AI_BUYER' : (i % 7 === 0 ? 'REVENUE_AGENT' : 'DIRECT');

    const order = await prisma.order.create({
      data: {
        id: `order_seed_${i}`,
        merchantId: merchant.id,
        customerId: customer.id,
        razorpayOrderId: `order_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        amount: isAiBuyer ? 2699 : (i % 2 === 0 ? 2499 : 999),
        currency: 'INR',
        status: isFailed ? 'FAILED' : 'PAID',
        source,
        createdAt: new Date(Date.now() - (200 - i) * 3600 * 1000 * 4),
      }
    });

    // Add order item (Whey Protein for 42% pattern)
    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: 'prod_1', // Whey
        quantity: 1,
        unitPrice: 2499,
        discount: isAiBuyer ? 199 : 0,
        finalPrice: isAiBuyer ? 2300 : 2499,
      }
    });

    // Cross-sell Shaker for AI_BUYER or some DIRECT orders
    if (isAiBuyer || i % 3 === 0) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: 'prod_2', // Shaker
          quantity: 1,
          unitPrice: 399,
          discount: 0,
          finalPrice: 399,
        }
      });
    }
  }

  // 7. Seed Recommendations (10 records)
  await prisma.recommendation.createMany({
    data: [
      {
        id: 'rec_1',
        merchantId: merchant.id,
        type: 'CROSS_SELL',
        title: '🔥 Cross-sell Whey + Shaker Bundle',
        description: '42% of Whey buyers purchase a shaker within 7 days. Offer dynamic ₹199 discount bundle @ ₹2,699.',
        estimatedRevenue: 8400,
        confidence: 0.87,
        status: 'ACTIVE',
        metadata: JSON.stringify({ baseProduct: 'prod_1', targetProduct: 'prod_2', discount: 199 })
      },
      {
        id: 'rec_2',
        merchantId: merchant.id,
        type: 'BUNDLE',
        title: 'Weekend Recovery Stack (Creatine + Bars)',
        description: 'Combine Micronized Creatine + Protein Bars for ₹1,449 (₹149 bundle discount).',
        estimatedRevenue: 5200,
        confidence: 0.79,
        status: 'PROPOSED',
        metadata: JSON.stringify({ baseProduct: 'prod_3', targetProduct: 'prod_4', discount: 149 })
      },
      {
        id: 'rec_3',
        merchantId: merchant.id,
        type: 'RECOVERY',
        title: 'Automated Failed Payment Recovery Campaign',
        description: '20 failed payments detected in last 30 days. Send instant WhatsApp 1-click retry payment link.',
        estimatedRevenue: 49800,
        confidence: 0.92,
        status: 'ACTIVE',
        metadata: JSON.stringify({ targetSegment: 'failed_payments_24h' })
      },
      {
        id: 'rec_4',
        merchantId: merchant.id,
        type: 'UPSELL',
        title: 'Upgrade Whey Isolate to Lean Mass Gainer',
        description: 'Suggest Mass Gainer upgrade for high-calorie bulking queries.',
        estimatedRevenue: 3600,
        confidence: 0.74,
        status: 'PROPOSED',
        metadata: JSON.stringify({ baseProduct: 'prod_1', upsellProduct: 'prod_8' })
      },
      {
        id: 'rec_5',
        merchantId: merchant.id,
        type: 'CATALOG',
        title: 'Optimize Product Attributes for AI Readiness',
        description: 'Add state-level shipping regions and allergy flags to achieve 100% AI Readiness.',
        estimatedRevenue: 12000,
        confidence: 0.95,
        status: 'PROPOSED',
        metadata: JSON.stringify({ missingFields: ['allergyAlerts', 'dietaryFlags'] })
      }
    ]
  });

  // 8. Seed Experiments (5 records)
  await prisma.experiment.create({
    data: {
      id: 'exp_1',
      merchantId: merchant.id,
      name: 'Whey + Shaker Bundle A/B Test',
      hypothesis: 'Offering Whey + Shaker at ₹2,699 will increase conversion by +25% while maintaining AOV.',
      controlConfig: JSON.stringify({ price: 2898, offer: 'None' }),
      variantConfig: JSON.stringify({ price: 2699, offer: '₹199 Bundle Discount' }),
      status: 'RUNNING',
      controlConversion: 6.2,
      variantConversion: 7.8,
      controlAov: 2420,
      variantAov: 2690,
      winner: 'VARIANT_AI_BUNDLE',
    }
  });

  // 9. Initial Audit Logs
  await prisma.auditLog.create({
    data: {
      merchantId: merchant.id,
      eventType: 'MERCHANT_INITIALIZED',
      description: 'UrbanFit Merchant AI Passport initialized with policy limits.',
      inputSnapshot: JSON.stringify({ merchant: 'UrbanFit', currency: 'INR' }),
      decision: 'ALLOW',
      reason: 'System bootstrap completed.',
      status: 'SUCCESS',
    }
  });

  console.log('✅ Seed completed successfully!');
}

main()
  .catch(e => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
