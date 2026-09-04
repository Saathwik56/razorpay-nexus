import { AuditStep } from '../types';

export interface DBLogEntry {
  id: string;
  merchantId: string;
  sessionId?: string;
  actionId?: string;
  transactionId?: string;
  quoteId?: string;
  razorpayOrderId?: string;
  paymentId?: string;
  actor: string;
  eventType: string;
  actionName: string;
  description: string;
  inputSnapshot: string;
  decision: string;
  reason: string;
  previousState?: string;
  newState?: string;
  requestId?: string;
  razorpayEntityType?: string;
  razorpayEntityId?: string;
  status: string;
  createdAt: string;
}

class AuditLoggerService {
  private auditSteps: AuditStep[] = [];
  private dbLogs: DBLogEntry[] = [];
  private listeners: Array<(steps: AuditStep[]) => void> = [];
  private dbListeners: Array<(logs: DBLogEntry[]) => void> = [];
  private pollTimer: any = null;

  constructor() {
    this.seedInitialAuditTrail();
    this.startPolling();
  }

  private startPolling() {
    if (typeof window !== 'undefined') {
      this.fetchFromBackend();
      this.pollTimer = setInterval(() => this.fetchFromBackend(), 5000);
    }
  }

  private getDeletedIds(): Set<string> {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('agentboost_deleted_audit_ids');
      if (saved) {
        try {
          return new Set(JSON.parse(saved));
        } catch (e) {}
      }
    }
    return new Set();
  }

  private saveDeletedId(id: string) {
    if (typeof window !== 'undefined') {
      const current = this.getDeletedIds();
      current.add(id);
      localStorage.setItem('agentboost_deleted_audit_ids', JSON.stringify(Array.from(current)));
    }
  }

  private isClearedAll(): boolean {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('agentboost_audit_cleared') === 'true';
    }
    return false;
  }

  public async fetchFromBackend(): Promise<DBLogEntry[]> {
    const deletedIds = this.getDeletedIds();
    const isCleared = this.isClearedAll();

    try {
      const res = await fetch('/api/audit?limit=100');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.logs) {
          if (isCleared) {
            this.dbLogs = [];
          } else {
            this.dbLogs = data.logs.filter((l: DBLogEntry) => !deletedIds.has(l.id));
          }
          this.notifyDbListeners();
          return this.dbLogs;
        }
      }
    } catch (e) {
      // Off-network or dev server starting
    }

    if (isCleared) {
      this.dbLogs = [];
    } else {
      this.dbLogs = this.dbLogs.filter(l => !deletedIds.has(l.id));
    }
    this.notifyDbListeners();
    return this.dbLogs;
  }

  private seedInitialAuditTrail() {
    const deletedIds = this.getDeletedIds();
    if (this.isClearedAll()) {
      this.auditSteps = [];
      return;
    }

    const now = new Date();
    const t = (minsAgo: number) => {
      const d = new Date(now.getTime() - minsAgo * 60000);
      return d.toLocaleTimeString('en-US', { hour12: false });
    };

    const initial = [
      {
        id: 'step_seed_1',
        timestamp: t(12),
        stage: 'AI BUYER',
        label: 'Buyer Query Received',
        details: 'Buyer query: "I need a protein supplement under ₹3,000". Matched 2 products.',
        status: 'success'
      },
      {
        id: 'step_seed_2',
        timestamp: t(11),
        stage: 'QUOTE ENGINE',
        label: 'Bounded Quote QT-45251 Created',
        details: 'Selected Whey Protein (₹2,499) + Pro Shaker (₹399) - ₹199 discount. Total: ₹2,699.',
        status: 'success',
        quoteId: 'QT-45251'
      },
      {
        id: 'step_seed_3',
        timestamp: t(10),
        stage: 'POLICY ENGINE',
        label: 'Policy Engine Check ALLOWED',
        details: '✓ Amount ₹2,699 ≤ ₹5,000 auto limit. ✓ Discount ₹199 ≤ ₹300 max cap.',
        status: 'success'
      },
      {
        id: 'step_seed_4',
        timestamp: t(9),
        stage: 'USER CONSENT',
        label: 'User Explicit Approval Granted',
        details: 'Buyer confirmed purchase of Whey + Shaker Bundle for ₹2,699.',
        status: 'success'
      },
      {
        id: 'step_seed_5',
        timestamp: t(9),
        stage: 'RAZORPAY',
        label: 'Razorpay Test Mode Order Created',
        details: 'Order ID order_LKKVRA6J4Q created via Razorpay REST API.',
        status: 'success',
        razorpayOrderId: 'order_LKKVRA6J4Q'
      },
      {
        id: 'step_seed_6',
        timestamp: t(8),
        stage: 'WEBHOOK & STATE MACHINE',
        label: 'Payment Captured & HMAC Signature Verified',
        details: 'Razorpay Payment ID pay_LKKVRA6J4Q captured ₹2,699. State Machine ➔ CAPTURED.',
        status: 'success',
        razorpayOrderId: 'order_LKKVRA6J4Q',
        razorpayPaymentId: 'pay_LKKVRA6J4Q'
      }
    ];

    this.auditSteps = initial.filter(s => !deletedIds.has(s.id));
  }

  public getSteps(): AuditStep[] {
    const deletedIds = this.getDeletedIds();
    return this.auditSteps.filter(s => !deletedIds.has(s.id));
  }

  public getAuditSteps(): AuditStep[] {
    return this.getSteps();
  }

  public getLogs(): AuditStep[] {
    return this.getSteps();
  }

  public getDBLogs(): DBLogEntry[] {
    const deletedIds = this.getDeletedIds();
    if (this.isClearedAll()) return [];
    return this.dbLogs.filter(l => !deletedIds.has(l.id));
  }

  public addStep(step: Partial<AuditStep>) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('agentboost_audit_cleared');
    }
    const fullStep: AuditStep = {
      id: step.id || `step_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: step.timestamp || new Date().toLocaleTimeString('en-US', { hour12: false }),
      stage: step.stage || 'AUDIT EVENT',
      label: step.label || 'Event Logged',
      details: step.details || '',
      status: step.status || 'success',
      razorpayOrderId: step.razorpayOrderId,
      razorpayPaymentId: step.razorpayPaymentId
    };

    this.auditSteps.unshift(fullStep);
    this.notify();
    this.fetchFromBackend();
    return fullStep;
  }

  public addAuditStep(step: AuditStep) {
    this.addStep(step);
  }

  public async deleteLog(id: string) {
    this.saveDeletedId(id);
    this.auditSteps = this.auditSteps.filter(s => s.id !== id);
    this.dbLogs = this.dbLogs.filter(l => l.id !== id);
    this.notify();
    this.notifyDbListeners();

    try {
      await fetch(`/api/audit/entry/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Backend log deletion fallback:', e);
    }
  }

  public async clearLogs() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('agentboost_audit_cleared', 'true');
    }
    this.auditSteps.forEach(s => this.saveDeletedId(s.id));
    this.dbLogs.forEach(l => this.saveDeletedId(l.id));
    this.auditSteps = [];
    this.dbLogs = [];
    this.notify();
    this.notifyDbListeners();

    try {
      await fetch('/api/audit/clear', { method: 'DELETE' });
    } catch (e) {
      console.warn('Backend clear logs fallback:', e);
    }
  }

  public subscribe(listener: (steps: AuditStep[]) => void) {
    this.listeners.push(listener);
    listener([...this.auditSteps]);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public subscribeDB(listener: (logs: DBLogEntry[]) => void) {
    this.dbListeners.push(listener);
    listener([...this.dbLogs]);
    return () => {
      this.dbListeners = this.dbListeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l([...this.auditSteps]));
  }

  private notifyDbListeners() {
    this.dbListeners.forEach(l => l([...this.dbLogs]));
  }
}

export const auditLogger = new AuditLoggerService();
