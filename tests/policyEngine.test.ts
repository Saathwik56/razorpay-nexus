import { describe, it, expect } from 'vitest';
import { PolicyEngine } from '../src/services/policyEngine';
import { DEFAULT_POLICY_CONFIG } from '../src/data/merchantData';

describe('PolicyEngine Deterministic Money-Action Guardrails (10 Tests)', () => {
  const policyEngine = new PolicyEngine(DEFAULT_POLICY_CONFIG);

  it('1. allows transactions <= max_auto_transaction (₹5,000)', () => {
    const result = policyEngine.evaluateAction('create_order', 2699);
    expect(result.allowed).toBe(true);
    expect(result.requiresHumanApproval).toBe(false);
  });

  it('2. triggers Human Approval GATE for transactions > ₹5,000', () => {
    const result = policyEngine.evaluateAction('create_order', 8000);
    expect(result.allowed).toBe(true);
    expect(result.requiresHumanApproval).toBe(true);
    expect(result.reason).toContain('Merchant Approval');
  });

  it('3. enforces max_auto_discount cap (₹300)', () => {
    const valid = policyEngine.evaluateAction('create_order', 2699, 199, 2898);
    expect(valid.allowed).toBe(true);

    const invalid = policyEngine.evaluateAction('create_order', 2699, 350, 3049);
    expect(invalid.allowed).toBe(false);
    expect(invalid.violations[0]).toContain('Discount Cap EXCEEDED');
  });

  it('4. enforces max_discount_percentage cap (10%)', () => {
    // 250 is <= 300 maxAutoDiscount, but 250/2000 = 12.5% > 10% max discount percentage
    const invalid = policyEngine.evaluateAction('create_order', 1750, 250, 2000);
    expect(invalid.allowed).toBe(false);
    expect(invalid.violations[0]).toContain('Discount % EXCEEDED');
  });

  it('5. allows autonomous payment link creation when enabled', () => {
    const result = policyEngine.evaluateAction('create_payment_link', 1500);
    expect(result.allowed).toBe(true);
  });

  it('6. strictly denies unapproved refunds', () => {
    const result = policyEngine.evaluateAction('refund', 1000);
    expect(result.allowed).toBe(false);
    expect(result.violations[0]).toContain('Permission DENIED');
  });

  it('7. strictly denies autonomous product price modifications', () => {
    const result = policyEngine.evaluateAction('price_change', 500);
    expect(result.allowed).toBe(false);
    expect(result.violations[0]).toContain('Permission DENIED');
  });

  it('8. enforces allowed product categories restriction', () => {
    const validCat = policyEngine.evaluateAction('create_order', 1000, 0, 1000, { category: 'supplements' });
    expect(validCat.allowed).toBe(true);

    const invalidCat = policyEngine.evaluateAction('create_order', 1000, 0, 1000, { category: 'crypto_tokens' });
    expect(invalidCat.allowed).toBe(false);
    expect(invalidCat.violations[0]).toContain('Category BLOCKED');
  });

  it('9. restricts currency to allowed_currency (INR)', () => {
    const validCurr = policyEngine.evaluateAction('create_order', 1000, 0, 1000, { currency: 'INR' });
    expect(validCurr.allowed).toBe(true);

    const invalidCurr = policyEngine.evaluateAction('create_order', 100, 0, 100, { currency: 'USD' });
    expect(invalidCurr.allowed).toBe(false);
    expect(invalidCurr.violations[0]).toContain('Currency DENIED');
  });

  it('10. denies AI agent policy override attempts', () => {
    const overrideAttempt = policyEngine.evaluateAction('override_limit', 50000);
    expect(overrideAttempt.allowed).toBe(false);
    expect(overrideAttempt.violations[0]).toContain('Permission DENIED');
  });
});
