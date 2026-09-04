import { describe, it, expect } from 'vitest';
import { PolicyEngine } from '../src/services/policyEngine';
import { DEFAULT_POLICY_CONFIG } from '../src/data/merchantData';

describe('Adversarial Security & Malicious Agent Output Gating (5 Tests)', () => {
  const policyEngine = new PolicyEngine(DEFAULT_POLICY_CONFIG);

  it('1. rejects LLM attempting to trigger autonomous refund ({ action: "REFUND", amount: 1000000 })', () => {
    const result = policyEngine.evaluateAction('refund', 1000000);
    expect(result.allowed).toBe(false);
    expect(result.violations[0]).toContain('Permission DENIED: Autonomous refunds are strictly disabled');
  });

  it('2. rejects LLM attempting to override merchant financial policy ({ action: "override_limit" })', () => {
    const result = policyEngine.evaluateAction('override_limit', 50000);
    expect(result.allowed).toBe(false);
    expect(result.violations[0]).toContain('Permission DENIED: AI Agents cannot modify or override merchant financial policies');
  });

  it('3. rejects LLM attempting price modification ({ action: "price_change" })', () => {
    const result = policyEngine.evaluateAction('price_change', 100);
    expect(result.allowed).toBe(false);
    expect(result.violations[0]).toContain('Permission DENIED');
  });

  it('4. rejects LLM attempting transaction in unauthorized currency ({ currency: "USD" })', () => {
    const result = policyEngine.evaluateAction('create_order', 100, 0, 100, { currency: 'USD' });
    expect(result.allowed).toBe(false);
    expect(result.violations[0]).toContain('Currency DENIED');
  });

  it('5. rejects LLM attempting transaction in blocked category ({ category: "crypto_tokens" })', () => {
    const result = policyEngine.evaluateAction('create_order', 100, 0, 100, { category: 'crypto_tokens' });
    expect(result.allowed).toBe(false);
    expect(result.violations[0]).toContain('Category BLOCKED');
  });
});
