export type PaymentState = 
  | 'CREATED' 
  | 'AUTHORIZED' 
  | 'CAPTURED' 
  | 'FAILED' 
  | 'REFUNDED' 
  | 'UNKNOWN';

export class PaymentStateMachine {
  // Rank hierarchy ensuring state transition monotonicity toward terminal state
  private static stateRank: Record<PaymentState, number> = {
    UNKNOWN: 0,
    CREATED: 1,
    AUTHORIZED: 2,
    CAPTURED: 3,
    FAILED: 4,
    REFUNDED: 5
  };

  private static validTransitions: Record<PaymentState, PaymentState[]> = {
    CREATED: ['AUTHORIZED', 'CAPTURED', 'FAILED'],
    AUTHORIZED: ['CAPTURED', 'FAILED', 'REFUNDED'],
    CAPTURED: ['REFUNDED'], // Cannot regress to AUTHORIZED or CREATED
    FAILED: ['CREATED', 'AUTHORIZED', 'CAPTURED'], // Allows cart recovery & payment retry
    REFUNDED: [],
    UNKNOWN: ['CREATED', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED']
  };

  /**
   * Evaluates if a state transition is valid.
   */
  public static canTransition(currentState: PaymentState, targetState: PaymentState): boolean {
    if (currentState === targetState) return true;

    // Prevent lower-rank events from demoting higher-rank established states (Monotonic rule)
    if (this.stateRank[targetState] < this.stateRank[currentState] && currentState === 'CAPTURED') {
      return false;
    }

    const allowed = this.validTransitions[currentState] || [];
    return allowed.includes(targetState);
  }

  /**
   * Resolves the final state when out-of-order webhooks occur.
   * Ensures monotonic behavior toward the highest valid state.
   */
  public static reconcileState(currentState: PaymentState, eventType: string): PaymentState {
    const eventStateMap: Record<string, PaymentState> = {
      'payment.authorized': 'AUTHORIZED',
      'payment.captured': 'CAPTURED',
      'order.paid': 'CAPTURED',
      'payment.failed': 'FAILED',
      'payment.refunded': 'REFUNDED',
      'payment_link.paid': 'CAPTURED'
    };

    const targetState = eventStateMap[eventType] || 'UNKNOWN';

    // Monotonic Protection: CAPTURED or AUTHORIZED cannot be demoted by out-of-order lower events
    if (currentState === 'CAPTURED' && (targetState === 'AUTHORIZED' || targetState === 'CREATED')) {
      return 'CAPTURED';
    }

    if (currentState === 'AUTHORIZED' && targetState === 'CREATED') {
      return 'AUTHORIZED';
    }

    if (this.canTransition(currentState, targetState)) {
      return targetState;
    }

    return currentState;
  }
}
