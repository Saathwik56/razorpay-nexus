import { describe, it, expect } from 'vitest';
import { razorpayService } from '../src/services/razorpayClient';

describe('Razorpay Sandbox REST Integration Verification (Test B)', () => {
  let createdOrderId: string;

  it('1. creates a real Razorpay Test Mode Order via POST /v1/orders REST API', async () => {
    const order = await razorpayService.createOrder(
      2699,
      `rcpt_test_${Date.now()}`,
      { test_suite: 'razorpaySandboxIntegration.test.ts', environment: 'sandbox' }
    );

    expect(order).toBeDefined();
    expect(order.id).toMatch(/^order_/);
    expect(order.amount).toBe(269900); // 2699 INR in paisa
    expect(order.currency).toBe('INR');
    expect(order.status).toBe('created');

    createdOrderId = order.id;
  });

  it('2. fetches order entity details from Razorpay via GET /v1/orders/:id', async () => {
    expect(createdOrderId).toBeDefined();
    const fetchedOrder = await razorpayService.fetchOrder(createdOrderId);

    expect(fetchedOrder).toBeDefined();
    expect(fetchedOrder.id).toBe(createdOrderId);
  });

  it('3. fetches payments associated with a Razorpay Order via GET /v1/orders/:id/payments', async () => {
    expect(createdOrderId).toBeDefined();
    const payments = await razorpayService.fetchOrderPayments(createdOrderId);

    expect(Array.isArray(payments)).toBe(true);
    expect(payments.length).toBeGreaterThanOrEqual(1);
    expect(payments[0].order_id || payments[0].id).toBeDefined();
  });

  it('4. fetches individual payment entity details via GET /v1/payments/:id', async () => {
    const payments = await razorpayService.fetchOrderPayments(createdOrderId);
    const paymentId = payments[0].id;

    const paymentDetails = await razorpayService.fetchPayment(paymentId);
    expect(paymentDetails).toBeDefined();
    expect(paymentDetails.id).toBe(paymentId);
  });
});
