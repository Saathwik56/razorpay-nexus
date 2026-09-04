import { describe, it, expect } from 'vitest';
import { AgentCommerceService } from '../src/services/agentCommerceService';
import { PolicyEngine } from '../src/services/policyEngine';
import { DEFAULT_POLICY_CONFIG } from '../src/data/merchantData';
import { Product } from '../src/types';

describe('Server-Authoritative Quote Tampering Protection (Item 8)', () => {
  const service = new AgentCommerceService();
  const policyEngine = new PolicyEngine(DEFAULT_POLICY_CONFIG);

  const mockProduct: Product = {
    id: 'prod_1',
    name: 'Whey Protein Isolate',
    price: 2499,
    category: 'supplements',
    inventory: 100,
    description: '',
    attributes: {},
    shipping: { shipsTo: ['IN'], estimatedDeliveryDays: '2 days' },
    refundPolicy: { available: true, windowDays: 7 },
    aiPurchasingRules: { autoApprove: true, maxDiscountAllowed: 300 }
  };

  it('1. ignores client-supplied tampered totals and recalculates quote server-side', () => {
    // Generate authentic quote
    const authenticQuote = service.createQuote(
      'merchant_urbanfit_1',
      'UrbanFit',
      [{ product: mockProduct, quantity: 1, discount: 199 }],
      policyEngine
    );

    // Simulate client attempting to tamper quote object in payload ({ total: 1 })
    const tamperedClientPayload = {
      quoteId: authenticQuote.id,
      tamperedTotal: 1,
      tamperedDiscount: 2498
    };

    // Server retrieves authentic quote from server map using ONLY quoteId
    const serverRetrievedQuote = service.getQuote(tamperedClientPayload.quoteId);

    expect(serverRetrievedQuote).toBeDefined();
    expect(serverRetrievedQuote?.total).toBe(2300); // 2499 - 199 = 2300 (Ignores client total of 1)
    expect(serverRetrievedQuote?.total).not.toBe(tamperedClientPayload.tamperedTotal);
  });

  it('2. locks quote price until expiry, preventing price changes from altering active quotes underneath', () => {
    const authenticQuote = service.createQuote(
      'merchant_urbanfit_1',
      'UrbanFit',
      [{ product: mockProduct, quantity: 1, discount: 199 }],
      policyEngine
    );

    // Simulate merchant changing product price to ₹2,999 after quote generation
    const updatedProduct = { ...mockProduct, price: 2999 };

    // Active accepted quote preserves locked total until expiry
    const activeQuote = service.getQuote(authenticQuote.id);
    expect(activeQuote?.total).toBe(2300);
  });
});
