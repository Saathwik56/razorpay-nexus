import { describe, it, expect } from 'vitest';
import { AgentCommerceService } from '../src/services/agentCommerceService';
import { PolicyEngine } from '../src/services/policyEngine';
import { DEFAULT_POLICY_CONFIG } from '../src/data/merchantData';
import { Product } from '../src/types';

describe('Bounded Quote System & Expiry ("Quote before Checkout") (5 Tests)', () => {
  const service = new AgentCommerceService();
  const policyEngine = new PolicyEngine(DEFAULT_POLICY_CONFIG);

  const mockProduct: Product = {
    id: 'prod_1',
    name: 'Whey Protein Isolate (1kg)',
    price: 2499,
    category: 'supplements',
    inventory: 100,
    description: 'Protein powder',
    attributes: {},
    shipping: { shipsTo: ['IN'], estimatedDeliveryDays: '2 days' },
    refundPolicy: { available: true, windowDays: 7 },
    aiPurchasingRules: { autoApprove: true, maxDiscountAllowed: 250 }
  };

  it('1. creates a formal bounded quote with subtotal, discount, total and 10m expiry', () => {
    const quote = service.createQuote(
      'merchant_urbanfit_1',
      'UrbanFit',
      [{ product: mockProduct, quantity: 1, discount: 199 }],
      policyEngine
    );

    expect(quote.quoteNumber).toMatch(/^QT-\d+/);
    expect(quote.subtotal).toBe(2499);
    expect(quote.discount).toBe(199);
    expect(quote.total).toBe(2300);
    expect(quote.status).toBe('ACTIVE');
    expect(new Date(quote.expiresAt).getTime()).toBeGreaterThan(Date.now());
  });

  it('2. evaluates policy rules during quote creation', () => {
    const quote = service.createQuote(
      'merchant_urbanfit_1',
      'UrbanFit',
      [{ product: mockProduct, quantity: 1, discount: 199 }],
      policyEngine
    );

    expect(quote.policyCheck.allowed).toBe(true);
    expect(quote.policyCheck.rulesEvaluated.length).toBeGreaterThan(0);
  });

  it('3. allows accepting an ACTIVE quote', () => {
    const quote = service.createQuote(
      'merchant_urbanfit_1',
      'UrbanFit',
      [{ product: mockProduct, quantity: 1, discount: 199 }],
      policyEngine
    );

    const result = service.acceptQuote(quote.id);
    expect(result.success).toBe(true);
    expect(result.quote?.status).toBe('ACCEPTED');
  });

  it('4. rejects accepting an EXPIRED quote', () => {
    const quote = service.createQuote(
      'merchant_urbanfit_1',
      'UrbanFit',
      [{ product: mockProduct, quantity: 1, discount: 199 }],
      policyEngine
    );

    // Force quote to be expired
    quote.expiresAt = new Date(Date.now() - 1000).toISOString();

    const result = service.acceptQuote(quote.id);
    expect(result.success).toBe(false);
    expect(result.error).toContain('EXPIRED');
  });

  it('5. retrieves quote by quote ID or quote number', () => {
    const quote = service.createQuote(
      'merchant_urbanfit_1',
      'UrbanFit',
      [{ product: mockProduct, quantity: 1, discount: 199 }],
      policyEngine
    );

    const byId = service.getQuote(quote.id);
    const byNum = service.getQuote(quote.quoteNumber);

    expect(byId).toBeDefined();
    expect(byNum).toBeDefined();
    expect(byId?.id).toBe(byNum?.id);
  });
});
