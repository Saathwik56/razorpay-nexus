import { describe, it, expect } from 'vitest';
import { AIAgentEngine } from '../src/services/aiAgentEngine';
import { PolicyEngine } from '../src/services/policyEngine';
import { DEFAULT_POLICY_CONFIG } from '../src/data/merchantData';

describe('AI Buyer Agent Intent Parsing & Quote Generation (6 Tests)', () => {
  const engine = new AIAgentEngine();
  const policyEngine = new PolicyEngine(DEFAULT_POLICY_CONFIG);

  it('1. parses muscle recovery query under ₹3,000 and generates bundle offer', () => {
    const result = engine.processBuyerQuery('I need something for muscle recovery under ₹3,000', policyEngine);
    expect(result.matchedProducts.length).toBeGreaterThan(0);
    expect(result.recommendedBundle).toBeDefined();
    expect(result.recommendedBundle?.bundlePrice).toBe(2699);
  });

  it('2. generates a formal Bounded Quote (QT-XXXXX) for the buyer recommendation', () => {
    const result = engine.processBuyerQuery('I need something for muscle recovery under ₹3,000', policyEngine);
    expect(result.quote).toBeDefined();
    expect(result.quote?.quoteNumber).toMatch(/^QT-\d+/);
    expect(result.quote?.total).toBe(2699);
    expect(result.quote?.discount).toBe(199);
  });

  it('3. includes data-backed reasoning metrics in bundle recommendation', () => {
    const result = engine.processBuyerQuery('Whey protein under ₹3000', policyEngine);
    expect(result.recommendedBundle?.reasoning.coOccurrenceRate).toContain('42% of Whey buyers');
    expect(result.recommendedBundle?.reasoning.historicalConversion).toBeDefined();
  });

  it('4. records complete explainable audit steps for every buyer action', () => {
    const result = engine.processBuyerQuery('Whey protein under ₹3000', policyEngine);
    expect(result.auditSteps.length).toBeGreaterThanOrEqual(4);

    const stages = result.auditSteps.map(s => s.stage);
    expect(stages).toContain('USER INTENT');
    expect(stages).toContain('CATALOG SEARCH');
    expect(stages).toContain('QUOTE GENERATION');
    expect(stages).toContain('POLICY CHECK');
  });

  it('5. returns merchant Agent Commerce capabilities in AI Passport', () => {
    const passport = engine.getPassport();
    expect(passport.agent_commerce).toBeDefined();
    expect(passport.agent_commerce.discoverable).toBe(true);
    expect(passport.agent_commerce.refunds).toBe(false);
  });

  it('6. returns merchant transaction policy in AI Passport', () => {
    const passport = engine.getPassport();
    expect(passport.transaction_policy).toBeDefined();
    expect(passport.transaction_policy.max_transaction).toBe(5000);
    expect(passport.transaction_policy.requires_user_consent).toBe(true);
  });
});
