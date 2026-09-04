import { PolicyEngine } from './policyEngine';
import { razorpayService } from './razorpayClient';
import { Product } from '../types';

export interface QuoteItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  discount: number;
  finalPrice: number;
}

export interface CommerceQuote {
  id: string;
  quoteNumber: string;
  merchantId: string;
  merchantName: string;
  items: QuoteItem[];
  subtotal: number;
  discount: number;
  total: number;
  currency: string;
  status: 'ACTIVE' | 'EXPIRED' | 'ACCEPTED' | 'CANCELLED';
  policyCheck: {
    allowed: boolean;
    requiresApproval: boolean;
    reason: string;
    rulesEvaluated: any[];
  };
  expiresAt: string;
  createdAt: string;
}

export class AgentCommerceService {
  private quotes: Map<string, CommerceQuote> = new Map();

  /**
   * Creates a formal Bounded Quote ("Quote before Checkout")
   */
  public createQuote(
    merchantId: string,
    merchantName: string,
    products: { product: Product; quantity: number; discount: number }[],
    policyEngine: PolicyEngine
  ): CommerceQuote {
    const quoteId = `quote_${Math.random().toString(36).substring(2, 10)}`;
    const quoteNumber = `QT-${Math.floor(10000 + Math.random() * 90000)}`;

    let subtotal = 0;
    let totalDiscount = 0;

    const items: QuoteItem[] = products.map(p => {
      const itemSubtotal = p.product.price * p.quantity;
      subtotal += itemSubtotal;
      totalDiscount += p.discount;
      return {
        productId: p.product.id,
        name: p.product.name,
        unitPrice: p.product.price,
        quantity: p.quantity,
        discount: p.discount,
        finalPrice: itemSubtotal - p.discount
      };
    });

    const finalTotal = subtotal - totalDiscount;

    // Evaluate against Policy Engine
    const policyResult = policyEngine.evaluateAction(
      'create_order',
      finalTotal,
      totalDiscount,
      subtotal,
      {
        category: products[0]?.product.category,
        currency: 'INR',
        userConsentGiven: true
      }
    );

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 minute quote expiry

    const quote: CommerceQuote = {
      id: quoteId,
      quoteNumber,
      merchantId,
      merchantName,
      items,
      subtotal,
      discount: totalDiscount,
      total: finalTotal,
      currency: 'INR',
      status: 'ACTIVE',
      policyCheck: {
        allowed: policyResult.allowed,
        requiresApproval: policyResult.requiresHumanApproval,
        reason: policyResult.reason,
        rulesEvaluated: policyResult.rulesEvaluated
      },
      expiresAt: expiresAt.toISOString(),
      createdAt: now.toISOString()
    };

    this.quotes.set(quoteId, quote);
    this.quotes.set(quoteNumber, quote);

    return quote;
  }

  /**
   * Retrieves and verifies a quote, checking expiry status
   */
  public getQuote(quoteIdOrNumber: string): CommerceQuote | null {
    const quote = this.quotes.get(quoteIdOrNumber);
    if (!quote) return null;

    // Check expiry
    if (quote.status === 'ACTIVE' && new Date(quote.expiresAt) < new Date()) {
      quote.status = 'EXPIRED';
    }

    return quote;
  }

  /**
   * Accepts a valid active quote
   */
  public acceptQuote(quoteIdOrNumber: string): { success: boolean; quote?: CommerceQuote; error?: string } {
    const quote = this.getQuote(quoteIdOrNumber);
    if (!quote) return { success: false, error: 'Quote not found' };

    if (quote.status === 'EXPIRED') {
      return { success: false, error: 'Quote EXPIRED. Please request a new quote.', quote };
    }

    if (quote.status !== 'ACTIVE') {
      return { success: false, error: `Quote is in ${quote.status} state.`, quote };
    }

    quote.status = 'ACCEPTED';
    return { success: true, quote };
  }
}

export const agentCommerceService = new AgentCommerceService();
