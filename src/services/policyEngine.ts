import { PolicyConfig } from '../types';

export interface ExtendedPolicyConfig extends PolicyConfig {
  allowedCategories?: string[];
  blockedCategories?: string[];
  maxOrdersPerCustomer?: number;
  maxAutoTxPerHour?: number;
  allowedCurrency?: string;
  merchantMode?: 'TEST_ONLY' | 'LIVE_RESTRICTED';
  requireUserConsent?: boolean;
}

export interface RuleEvaluationDetail {
  ruleName: string;
  passed: boolean;
  message: string;
}

export interface PolicyEvaluationResult {
  allowed: boolean;
  requiresHumanApproval: boolean;
  reason: string;
  violations: string[];
  passedChecks: string[];
  rulesEvaluated: RuleEvaluationDetail[];
}

export class PolicyEngine {
  private config: ExtendedPolicyConfig;
  private txCountCurrentHour: number = 0;

  constructor(config: ExtendedPolicyConfig) {
    this.config = {
      allowedCategories: ['supplements', 'gear', 'nutrition'],
      blockedCategories: [],
      maxOrdersPerCustomer: 5,
      maxAutoTxPerHour: 10,
      allowedCurrency: 'INR',
      merchantMode: 'TEST_ONLY',
      requireUserConsent: true,
      ...config
    };
  }

  public updateConfig(newConfig: ExtendedPolicyConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  public getConfig(): ExtendedPolicyConfig {
    return this.config;
  }

  /**
   * Evaluates a money action against 10 deterministic merchant policy guardrails.
   */
  public evaluateAction(
    actionType: 'create_order' | 'create_payment_link' | 'apply_discount' | 'refund' | 'price_change' | 'override_limit',
    totalAmount: number,
    discountAmount: number = 0,
    originalAmount: number = totalAmount,
    context: {
      category?: string;
      customerOrdersCount?: number;
      currency?: string;
      userConsentGiven?: boolean;
    } = {}
  ): PolicyEvaluationResult {
    const passedChecks: string[] = [];
    const violations: string[] = [];
    const rulesEvaluated: RuleEvaluationDetail[] = [];
    let requiresHumanApproval = false;

    // 1. Transaction Amount & Auto-Approval Threshold
    const maxThreshold = this.config.requireApprovalAbove || 5000;
    if (totalAmount > maxThreshold) {
      requiresHumanApproval = true;
      rulesEvaluated.push({
        ruleName: `Transaction ≤ ₹${maxThreshold}`,
        passed: true,
        message: `Amount ₹${totalAmount} > auto threshold ₹${maxThreshold}. Requires Merchant Approval.`
      });
      passedChecks.push(`Human Approval Triggered: Amount ₹${totalAmount} > limit ₹${maxThreshold}.`);
    } else {
      rulesEvaluated.push({
        ruleName: `Transaction ≤ ₹${maxThreshold}`,
        passed: true,
        message: `Amount ₹${totalAmount} ≤ auto limit ₹${maxThreshold}.`
      });
      passedChecks.push(`Amount Check PASSED: ₹${totalAmount} ≤ limit ₹${maxThreshold}.`);
    }

    // 2. Action Capabilities Gating
    if (actionType === 'create_order' && !this.config.permissions.createOrders) {
      violations.push('Permission DENIED: Autonomous order creation is disabled.');
      rulesEvaluated.push({ ruleName: 'Order Creation Permission', passed: false, message: 'Disabled by merchant policy.' });
    } else if (actionType === 'create_order') {
      passedChecks.push('Permission APPROVED: Order creation permitted.');
      rulesEvaluated.push({ ruleName: 'Order Creation Permission', passed: true, message: 'Action permitted.' });
    }

    if (actionType === 'create_payment_link' && !this.config.permissions.createPaymentLinks) {
      violations.push('Permission DENIED: Payment link creation is disabled.');
      rulesEvaluated.push({ ruleName: 'Payment Link Permission', passed: false, message: 'Disabled by merchant policy.' });
    }

    if (actionType === 'refund' && !this.config.permissions.refundWithoutApproval) {
      violations.push('Permission DENIED: Autonomous refunds are strictly disabled.');
      rulesEvaluated.push({ ruleName: 'Autonomous Refund Permission', passed: false, message: 'Refund capability disabled.' });
    }

    if (actionType === 'price_change' && !this.config.permissions.modifyProductPrice) {
      violations.push('Permission DENIED: Autonomous product price modification is forbidden.');
      rulesEvaluated.push({ ruleName: 'Price Modification Permission', passed: false, message: 'Price modification forbidden.' });
    }

    if (actionType === 'override_limit') {
      violations.push('Permission DENIED: AI Agents cannot modify or override merchant financial policies.');
      rulesEvaluated.push({ ruleName: 'Policy Override Security', passed: false, message: 'Agents cannot alter security boundary.' });
    }

    // 3. Discount Amount & Percentage Caps
    if (discountAmount > 0) {
      if (discountAmount > this.config.maxAutoDiscount) {
        violations.push(`Discount Cap EXCEEDED: Requested discount ₹${discountAmount} > max cap ₹${this.config.maxAutoDiscount}.`);
        rulesEvaluated.push({ ruleName: `Discount ≤ ₹${this.config.maxAutoDiscount}`, passed: false, message: `Exceeds max cap ₹${this.config.maxAutoDiscount}.` });
      } else {
        passedChecks.push(`Discount Cap PASSED: ₹${discountAmount} ≤ cap ₹${this.config.maxAutoDiscount}.`);
        rulesEvaluated.push({ ruleName: `Discount ≤ ₹${this.config.maxAutoDiscount}`, passed: true, message: `Discount ₹${discountAmount} compliant.` });
      }

      const calculatedPercent = originalAmount > 0 ? (discountAmount / originalAmount) * 100 : 0;
      if (calculatedPercent > this.config.maxDiscountPercentage) {
        violations.push(`Discount % EXCEEDED: ${calculatedPercent.toFixed(1)}% > max allowed ${this.config.maxDiscountPercentage}%.`);
        rulesEvaluated.push({ ruleName: `Discount ≤ ${this.config.maxDiscountPercentage}%`, passed: false, message: `Exceeds ${this.config.maxDiscountPercentage}%.` });
      } else {
        passedChecks.push(`Discount % PASSED: ${calculatedPercent.toFixed(1)}% ≤ ${this.config.maxDiscountPercentage}%.`);
        rulesEvaluated.push({ ruleName: `Discount ≤ ${this.config.maxDiscountPercentage}%`, passed: true, message: `${calculatedPercent.toFixed(1)}% compliant.` });
      }
    }

    // 4. Product Category Restrictions
    if (context.category) {
      const allowed = this.config.allowedCategories || ['supplements', 'gear', 'nutrition'];
      const blocked = this.config.blockedCategories || [];
      if (blocked.includes(context.category) || (!allowed.includes(context.category) && allowed.length > 0)) {
        violations.push(`Category BLOCKED: Category '${context.category}' is not permitted.`);
        rulesEvaluated.push({ ruleName: 'Product Category Restriction', passed: false, message: `Category '${context.category}' restricted.` });
      } else {
        rulesEvaluated.push({ ruleName: 'Product Category Restriction', passed: true, message: `Category '${context.category}' permitted.` });
      }
    }

    // 5. Currency Check
    const currency = context.currency || 'INR';
    if (currency !== (this.config.allowedCurrency || 'INR')) {
      violations.push(`Currency DENIED: ${currency} is not allowed. Only ${this.config.allowedCurrency} supported.`);
      rulesEvaluated.push({ ruleName: 'Currency Restriction', passed: false, message: `Currency ${currency} forbidden.` });
    } else {
      rulesEvaluated.push({ ruleName: 'Currency Restriction', passed: true, message: `Currency ${currency} compliant.` });
    }

    // 6. User Consent Requirement
    if (this.config.requireUserConsent && context.userConsentGiven === false) {
      violations.push('User Consent REQUIRED: Explicit customer approval missing.');
      rulesEvaluated.push({ ruleName: 'User Consent Check', passed: false, message: 'Customer approval required before checkout.' });
    } else {
      rulesEvaluated.push({ ruleName: 'User Consent Check', passed: true, message: 'Explicit consent verified.' });
    }

    // 7. Hourly Frequency Rate Limit
    const maxTx = this.config.maxAutoTxPerHour || 10;
    if (this.txCountCurrentHour >= maxTx) {
      violations.push(`Rate Limit EXCEEDED: Hourly rate limit (${maxTx} tx/hr) reached.`);
      rulesEvaluated.push({ ruleName: 'Hourly Frequency Limit', passed: false, message: `Exceeded ${maxTx} tx/hr.` });
    } else {
      rulesEvaluated.push({ ruleName: 'Hourly Frequency Limit', passed: true, message: 'Rate limit compliant.' });
    }

    const isAllowed = violations.length === 0;
    if (isAllowed) this.txCountCurrentHour++;

    return {
      allowed: isAllowed,
      requiresHumanApproval: isAllowed && requiresHumanApproval,
      reason: isAllowed
        ? (requiresHumanApproval ? 'Transaction passes bounds but requires Merchant Approval.' : 'Transaction is within merchant-configured autonomous limits and user explicitly approved.')
        : `Transaction REJECTED by Policy Engine: ${violations.join(' ')}`,
      violations,
      passedChecks,
      rulesEvaluated
    };
  }
}
