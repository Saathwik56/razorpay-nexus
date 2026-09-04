import { describe, it, expect } from 'vitest';
import { AIAgentEngine } from '../src/services/aiAgentEngine';
import { PolicyEngine } from '../src/services/policyEngine';
import { agentCommerceService } from '../src/services/agentCommerceService';
import { razorpayService } from '../src/services/razorpayClient';
import { PaymentStateMachine } from '../src/services/paymentStateMachine';
import { DEFAULT_POLICY_CONFIG } from '../src/data/merchantData';

describe('Flagship Agentic Commerce E2E Integration Test (9-Step Lifecycle)', () => {
  const aiEngine = new AIAgentEngine();
  const policyEngine = new PolicyEngine(DEFAULT_POLICY_CONFIG);

  it('executes full end-to-end flow: Buyer Intent → Search → Quote → Policy → Consent → Order → Webhook → State Machine → Audit', async () => {
    // 1. Natural Language Buyer Intent Query
    const query = 'I need something for muscle recovery under ₹3,000';
    const searchResult = aiEngine.processBuyerQuery(query, policyEngine);

    expect(searchResult.matchedProducts.length).toBeGreaterThan(0);
    expect(searchResult.recommendedBundle).toBeDefined();
    expect(searchResult.quote).toBeDefined();

    // 2. Quote Verification
    const quote = searchResult.quote!;
    expect(quote.status).toBe('ACTIVE');
    expect(quote.total).toBe(2699);
    expect(quote.discount).toBe(199);

    // 3. Policy Engine Guardrail Verification
    const policyCheck = policyEngine.evaluateAction(
      'create_order',
      quote.total,
      quote.discount,
      quote.subtotal,
      { category: 'supplements', userConsentGiven: true }
    );
    expect(policyCheck.allowed).toBe(true);
    expect(policyCheck.requiresHumanApproval).toBe(false);

    // 4. Explicit Customer Consent Approval
    const acceptResult = agentCommerceService.acceptQuote(quote.id);
    expect(acceptResult.success).toBe(true);
    expect(acceptResult.quote?.status).toBe('ACCEPTED');

    // 5. Razorpay Test Mode Order Creation (POST /v1/orders)
    const rzpOrder = await razorpayService.createOrder(quote.total, `rcpt_${Date.now()}`);
    expect(rzpOrder.id).toMatch(/^order_/);
    expect(rzpOrder.amount).toBe(269900); // 2699 INR in paisa

    // 6. Razorpay Webhook Event Delivery Simulation
    const webhookEvent = {
      event: 'payment.authorized',
      created_at: Math.floor(Date.now() / 1000),
      payload: {
        payment: {
          entity: {
            id: 'pay_test_e2e_123',
            order_id: rzpOrder.id,
            amount: 269900,
            status: 'authorized'
          }
        }
      }
    };

    // 7. Payment State Machine Reconciliation
    const nextState = PaymentStateMachine.reconcileState('CREATED', webhookEvent.event);
    expect(nextState).toBe('AUTHORIZED');

    const capturedState = PaymentStateMachine.reconcileState(nextState, 'payment.captured');
    expect(capturedState).toBe('CAPTURED');

    // 8. Order Payment Verification API (fetchOrderPayments)
    const orderPayments = await razorpayService.fetchOrderPayments(rzpOrder.id);
    expect(orderPayments.length).toBeGreaterThan(0);

    // 9. Audit Trail Steps Recorded
    expect(searchResult.auditSteps.length).toBeGreaterThanOrEqual(4);
  });
});
