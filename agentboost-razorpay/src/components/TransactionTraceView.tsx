import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Bot, 
  Sparkles, 
  AlertOctagon, 
  RefreshCw, 
  Lock, 
  Zap,
  DollarSign,
  FileCheck,
  Code,
  Layers,
  ChevronDown,
  Info
} from 'lucide-react';

interface TransactionOption {
  id: string;
  orderId: string;
  quoteNumber: string;
  amount: number;
  status: 'CAPTURED' | 'BLOCKED' | 'CREATED' | 'FAILED';
  date: string;
  nodes: Array<{
    step: number;
    title: string;
    agent: string;
    details: string;
    status: 'SUCCESS' | 'BLOCKED' | 'FAILED' | 'RUNNING';
  }>;
}

interface TransactionTraceViewProps {
  selectedTransactionId?: string;
}

export const TransactionTraceView: React.FC<TransactionTraceViewProps> = ({ selectedTransactionId }) => {
  const transactions: TransactionOption[] = [
    {
      id: 'tx_1',
      orderId: 'order_LKKVRA6J4Q',
      quoteNumber: 'QT-45251',
      amount: 2699,
      status: 'CAPTURED',
      date: 'Today, 18:42',
      nodes: [
        { step: 1, title: 'USER INTENT PARSING', agent: 'Buyer Agent', details: 'Parsed intent: "I need Whey Protein & Shaker under ₹3,000".', status: 'SUCCESS' },
        { step: 2, title: 'CATALOG SEARCH', agent: 'AI Passport Search', details: 'Matched 2 items in UrbanFit AI Passport: Whey Protein (₹2,499) + Pro Shaker (₹399).', status: 'SUCCESS' },
        { step: 3, title: 'REVENUE OPTIMIZATION', agent: 'Revenue Agent', details: 'Applied dynamic cross-sell bundle discount: -₹199.', status: 'SUCCESS' },
        { step: 4, title: 'BOUNDED QUOTE CREATION', agent: 'Quote Engine', details: 'Generated Quote #QT-45251 @ ₹2,699 (10-min expiry).', status: 'SUCCESS' },
        { step: 5, title: 'USER CONSENT APPROVAL', agent: 'Buyer Agent UI', details: 'Customer explicitly clicked "Approve & Pay ₹2,699". Status: ACCEPTED.', status: 'SUCCESS' },
        { step: 6, title: 'POLICY ENGINE EVALUATION', agent: 'Policy Guard', details: '✓ Amount ₹2,699 ≤ ₹5,000 auto limit. ✓ Discount ₹199 ≤ ₹300 cap. Result: ALLOWED.', status: 'SUCCESS' },
        { step: 7, title: 'RAZORPAY ORDER CREATION', agent: 'Razorpay REST API', details: 'Executed POST /v1/orders. Order ID generated: order_LKKVRA6J4Q.', status: 'SUCCESS' },
        { step: 8, title: 'WEBHOOK & STATE MACHINE', agent: 'Razorpay Webhook', details: 'Webhook payment.captured received. Verified HMAC signature & state CAPTURED.', status: 'SUCCESS' }
      ]
    },
    {
      id: 'tx_2',
      orderId: 'order_DENIED_8K',
      quoteNumber: 'QT-88190',
      amount: 8000,
      status: 'BLOCKED',
      date: 'Today, 18:38',
      nodes: [
        { step: 1, title: 'USER INTENT PARSING', agent: 'Buyer Agent', details: 'Parsed intent: "Buy Mass Gainer for ₹8,000".', status: 'SUCCESS' },
        { step: 2, title: 'POLICY ENGINE EVALUATION', agent: 'Policy Guard', details: '✕ Transaction amount ₹8,000 exceeds ₹5,000 limit by ₹3,000. Result: BLOCKED.', status: 'BLOCKED' },
        { step: 3, title: 'RAZORPAY API CALL SKIPPED', agent: 'Razorpay REST API', details: 'Razorpay Order Creation skipped due to policy boundary enforcement.', status: 'BLOCKED' },
        { step: 4, title: 'AUDIT LOGGED', agent: 'Audit Trail', details: 'Logged ACTION_BLOCKED event to SQLite audit database.', status: 'SUCCESS' }
      ]
    },
    {
      id: 'tx_3',
      orderId: 'order_ATTACK_PREVENTED',
      quoteNumber: 'QT-99120',
      amount: 50000,
      status: 'BLOCKED',
      date: 'Today, 18:30',
      nodes: [
        { step: 1, title: 'MALICIOUS AI PAYLOAD', agent: 'Security Monitor', details: 'Agent attempted { action: "OVERRIDE_POLICY", max_transaction: 50000 }.', status: 'FAILED' },
        { step: 2, title: 'SECURITY BOUNDARY CHECK', agent: 'Policy Guard', details: 'Security Policy Check: AI Agents cannot modify merchant policies. Result: REJECTED.', status: 'BLOCKED' },
        { step: 3, title: 'RAZORPAY API SKIPPED', agent: 'Razorpay REST API', details: 'Order creation blocked completely. No API credentials exposed.', status: 'BLOCKED' }
      ]
    }
  ];

  const [selectedTxId, setSelectedTxId] = useState<string>(selectedTransactionId || 'tx_1');
  const [viewMode, setViewMode] = useState<'visual' | 'json'>('visual');

  useEffect(() => {
    if (selectedTransactionId) {
      const matched = transactions.find(
        t => t.id === selectedTransactionId || t.orderId === selectedTransactionId || t.quoteNumber === selectedTransactionId
      );
      if (matched) setSelectedTxId(matched.id);
    }
  }, [selectedTransactionId]);

  const selectedTx = transactions.find(t => t.id === selectedTxId) || transactions[0];

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Merchant / Auditor Purpose Explanation Banner */}
      <div className="p-4 bg-blue-50/80 rounded-2xl border border-blue-200 text-xs font-['Inter'] space-y-1">
        <div className="font-bold text-blue-900 flex items-center space-x-1.5">
          <Info className="w-4 h-4 text-[#0f63ed]" />
          <span>Why does the Transaction Trace exist? (Financial Governance & Compliance)</span>
        </div>
        <p className="text-slate-600 leading-relaxed">
          For machine-to-machine AI agent transactions, merchants and financial auditors require complete forensic proof of how buyer intent became a Razorpay order. This view proves every policy check, signature, and state transition step-by-step.
        </p>
      </div>

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-mono font-bold text-[#0f63ed] uppercase tracking-wider">END-TO-END TRANSACTION TRACE</span>
          <h1 className="text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans'] tracking-tight">
            System Architecture & Dynamic Trace
          </h1>
        </div>

        {/* Transaction Selector Dropdown & View Mode Switch */}
        <div className="flex items-center space-x-3">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 text-xs font-mono font-bold">
            <button
              onClick={() => setViewMode('visual')}
              className={`px-3 py-1.5 rounded-lg transition-all ${viewMode === 'visual' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
            >
              Visual Flow
            </button>
            <button
              onClick={() => setViewMode('json')}
              className={`px-3 py-1.5 rounded-lg transition-all ${viewMode === 'json' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
            >
              Raw Payload
            </button>
          </div>

          <div className="relative">
            <select
              value={selectedTxId}
              onChange={e => setSelectedTxId(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#0f63ed] shadow-xs cursor-pointer"
            >
              {transactions.map(t => (
                <option key={t.id} value={t.id}>
                  {t.orderId} ({t.quoteNumber} - ₹{t.amount.toLocaleString()} - {t.status})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Architecture Flowchart Diagram */}
      <div className="saas-card p-6 border-slate-200 space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
          <Code className="w-4 h-4 text-[#0f63ed]" />
          <h2 className="font-extrabold text-slate-900 text-sm font-['Plus_Jakarta_Sans']">
            System Architecture Flowchart
          </h2>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl text-cyan-300 font-mono text-[11px] overflow-x-auto leading-relaxed">
          <pre>{`BUYER AGENT ➔ AGENT COMMERCE API ➔ MERCHANT AI PASSPORT ➔ REVENUE AGENT ➔ QUOTE ENGINE ➔ POLICY ENGINE
                                                                                                 │
                                                                                        ┌─────────┴─────────┐
                                                                                        │                   │
                                                                                     DENIED              ALLOWED
                                                                                        │                   │
                                                                                        ▼                   ▼
                                                                                  HUMAN REVIEW        USER CONSENT
                                                                                                            │
                                                                                                            ▼
                                                                                                    RAZORPAY TEST API
                                                                                                            │
                                                                                                            ▼
                                                                                                     WEBHOOK HANDLER
                                                                                                            │
                                                                                                            ▼
                                                                                                     STATE MACHINE
                                                                                                            │
                                                                                                            ▼
                                                                                                      AUDIT LOG`}</pre>
        </div>
      </div>

      {/* Selected Transaction Trace Nodes */}
      <div className="saas-card p-6 rounded-2xl border-slate-200 space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans'] flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-[#0f63ed]" />
              <span>Real Execution Lifecycle: {selectedTx.orderId}</span>
            </h2>
            <span className="text-xs font-mono text-slate-500">Quote: {selectedTx.quoteNumber} | Amount: ₹{selectedTx.amount.toLocaleString()}</span>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
            selectedTx.status === 'CAPTURED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
          }`}>
            STATUS: {selectedTx.status}
          </span>
        </div>

        <div className="space-y-4 relative before:absolute before:left-5 before:top-6 before:bottom-6 before:w-0.5 before:bg-slate-200">
          {selectedTx.nodes.map(node => (
            <div key={node.step} className="relative flex items-start space-x-4">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-xs flex-shrink-0 z-10 shadow-xs ${
                node.status === 'SUCCESS' ? 'border-emerald-300 text-emerald-700 bg-emerald-50' : 'border-rose-300 text-rose-700 bg-rose-50'
              }`}>
                {node.status === 'SUCCESS' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertOctagon className="w-4 h-4 text-rose-600" />}
              </div>

              <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-mono font-bold text-[#0f63ed]">STEP {node.step}</span>
                    <span className="text-[11px] text-slate-500 font-mono">| {node.agent}</span>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                    node.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {node.status}
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-xs font-['Plus_Jakarta_Sans']">{node.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-['Inter']">{node.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
