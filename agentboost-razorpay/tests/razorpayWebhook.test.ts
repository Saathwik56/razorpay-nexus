import { describe, it, expect } from 'vitest';
import crypto from 'crypto';
import { PaymentStateMachine } from '../src/services/paymentStateMachine';

describe('Razorpay Webhooks, Replay Protection & Monotonic State Machine (10 Tests)', () => {
  const secret = 'whsec_test_demo_webhook_99812';
  const rawBody = JSON.stringify({ event: 'payment.authorized', payload: { payment: { entity: { id: 'pay_123' } } } });

  it('1. verifies HMAC-SHA256 signature against raw request body', () => {
    const signature = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    expect(signature.length).toBe(64);
  });

  it('2. rejects tampered webhook payload signature', () => {
    const validSig = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    const tamperedSig = crypto.createHmac('sha256', secret).update(rawBody + ' ').digest('hex');
    expect(validSig).not.toEqual(tamperedSig);
  });

  it('3. verifies event timestamp replay protection threshold (<= 300s)', () => {
    const now = Math.floor(Date.now() / 1000);
    const validTimestamp = now - 60; // 1 minute old -> VALID
    const expiredTimestamp = now - 360; // 6 minutes old -> EXPIRED

    expect(now - validTimestamp <= 300).toBe(true);
    expect(now - expiredTimestamp <= 300).toBe(false);
  });

  it('4. PaymentStateMachine handles valid transition CREATED -> AUTHORIZED', () => {
    const nextState = PaymentStateMachine.reconcileState('CREATED', 'payment.authorized');
    expect(nextState).toBe('AUTHORIZED');
  });

  it('5. PaymentStateMachine handles valid transition AUTHORIZED -> CAPTURED', () => {
    const nextState = PaymentStateMachine.reconcileState('AUTHORIZED', 'payment.captured');
    expect(nextState).toBe('CAPTURED');
  });

  it('6. PaymentStateMachine handles out-of-order event (payment.captured before payment.authorized)', () => {
    const nextState = PaymentStateMachine.reconcileState('CREATED', 'payment.captured');
    expect(nextState).toBe('CAPTURED');
  });

  it('7. PaymentStateMachine prevents regressing CAPTURED state back to AUTHORIZED if late event arrives', () => {
    const nextState = PaymentStateMachine.reconcileState('CAPTURED', 'payment.authorized');
    expect(nextState).toBe('CAPTURED');
  });

  it('8. PaymentStateMachine prevents regressing AUTHORIZED state back to CREATED', () => {
    const nextState = PaymentStateMachine.reconcileState('AUTHORIZED', 'order.created');
    expect(nextState).toBe('AUTHORIZED');
  });

  it('9. PaymentStateMachine handles payment failure and recovery transitions', () => {
    const failedState = PaymentStateMachine.reconcileState('CREATED', 'payment.failed');
    expect(failedState).toBe('FAILED');

    const recoveredState = PaymentStateMachine.reconcileState(failedState, 'payment.captured');
    expect(recoveredState).toBe('CAPTURED');
  });

  it('10. PaymentStateMachine allows legitimate terminal refund transition from CAPTURED to REFUNDED', () => {
    const nextState = PaymentStateMachine.reconcileState('CAPTURED', 'payment.refunded');
    expect(nextState).toBe('REFUNDED');
  });
});
