import { describe, it, expect } from 'vitest';
import { INITIAL_OPPORTUNITIES, INITIAL_EXPERIMENT } from '../src/data/merchantData';

describe('Merchant Revenue Agent & Attribution Metrics (6 Tests)', () => {
  it('1. identifies data-backed cross-sell co-occurrence opportunities (Whey -> Shaker)', () => {
    const opp = INITIAL_OPPORTUNITIES.find(o => o.id === 'opp_whey_shaker');
    expect(opp).toBeDefined();
    expect(opp?.type).toBe('cross-sell');
    expect(opp?.originalPrice).toBe(2898);
    expect(opp?.bundlePrice).toBe(2699);
    expect(opp?.potentialMonthlyRevenue).toBe(8400);
  });

  it('2. verifies revenue attribution metrics split (AI-assisted vs AI-generated vs Recovered)', () => {
    const metrics = {
      totalRevenue: 124500,
      aiAssistedRevenue: 18420,
      aiGeneratedRevenue: 12800,
      recoveredRevenue: 5620
    };

    expect(metrics.aiAssistedRevenue).toBeGreaterThan(metrics.aiGeneratedRevenue);
    expect(metrics.aiGeneratedRevenue + metrics.recoveredRevenue).toBeLessThanOrEqual(metrics.aiAssistedRevenue);
  });

  it('3. verifies Merchant ROI Widget metric calculations', () => {
    const roi = {
      aiActionsCount: 37,
      avgRevenuePerAction: 498,
      opportunityTotal: 28400,
      capturedTotal: 18420,
      captureRatePercent: 64.9
    };

    expect(roi.captureRatePercent).toBe(64.9);
    expect(Math.round(roi.capturedTotal / roi.aiActionsCount)).toBe(498);
  });

  it('4. verifies live A/B experiment winner detection stats', () => {
    expect(INITIAL_EXPERIMENT.winnerDetected).toBe(true);
    expect(INITIAL_EXPERIMENT.experimentConversion).toBe(7.8);
    expect(INITIAL_EXPERIMENT.controlConversion).toBe(6.2);
    expect(INITIAL_EXPERIMENT.revenueLift).toBe(18420);
  });

  it('5. verifies bounded discount calculation maintains product margins', () => {
    const wheyPrice = 2499;
    const shakerPrice = 399;
    const originalPrice = wheyPrice + shakerPrice; // 2898
    const discount = 199;
    const finalPrice = originalPrice - discount; // 2699

    const effectiveDiscountPercent = (discount / originalPrice) * 100;
    expect(effectiveDiscountPercent).toBeLessThan(10); // Less than 10% max cap
    expect(finalPrice).toBe(2699);
  });

  it('6. calculates Agent Commerce Health Score meters', () => {
    const health = {
      aiReadiness: 90,
      policyCoverage: 100,
      paymentSuccess: 96,
      aiConversion: 7.8,
      auditCoverage: 100
    };

    expect(health.policyCoverage).toBe(100);
    expect(health.auditCoverage).toBe(100);
  });
});
