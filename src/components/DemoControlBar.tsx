import React from 'react';
import { 
  Play, 
  Sparkles, 
  Bot, 
  AlertOctagon, 
  RefreshCw, 
  ShieldCheck, 
  XCircle,
  ShieldAlert
} from 'lucide-react';

interface DemoControlBarProps {
  onLoadDemoMerchant: () => void;
  onRunRevenueAnalysis: () => void;
  onSimulateAIBuyer: () => void;
  onSimulatePaymentFailure: () => void;
  onRetryPayment: () => void;
  onViewAuditTrail: () => void;
  onViewTransactionTrace: () => void;
  onTriggerDeniedScenario: () => void;
  onTriggerMaliciousAttackScenario: () => void;
}

export const DemoControlBar: React.FC<DemoControlBarProps> = ({
  onLoadDemoMerchant,
  onRunRevenueAnalysis,
  onSimulateAIBuyer,
  onSimulatePaymentFailure,
  onRetryPayment,
  onViewTransactionTrace,
  onTriggerDeniedScenario,
  onTriggerMaliciousAttackScenario,
}) => {
  return (
    <div className="bg-slate-900 text-slate-200 border-b border-slate-800 py-2 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 font-mono text-[11px] text-slate-400">
          <Play className="w-3 h-3 text-[#0f63ed] fill-[#0f63ed]" />
          <span className="font-semibold text-slate-300">DEMO SCENARIO CONTROLLER:</span>
          <span className="text-emerald-400">UrbanFit Store</span>
        </div>

        <div className="flex items-center flex-wrap gap-2 font-mono text-[11px]">
          <button
            onClick={onLoadDemoMerchant}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors font-medium"
          >
            Load Merchant
          </button>
          <button
            onClick={onRunRevenueAnalysis}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors font-medium"
          >
            Revenue Agent
          </button>
          <button
            onClick={onSimulateAIBuyer}
            className="px-2.5 py-1 rounded bg-[#0f63ed] hover:bg-blue-600 text-white transition-colors font-bold"
          >
            Buyer Quote
          </button>

          {/* DENIED / Approval Required Scenario (₹8,000 > ₹5,000) */}
          <button
            onClick={onTriggerDeniedScenario}
            className="px-2.5 py-1 rounded bg-amber-950/90 hover:bg-amber-900 text-amber-300 border border-amber-800 transition-colors font-bold flex items-center space-x-1"
          >
            <XCircle className="w-3 h-3 text-amber-400" />
            <span>Test DENIED (₹8k)</span>
          </button>

          {/* Malicious AI Attack Scenario (Override Policy) */}
          <button
            onClick={onTriggerMaliciousAttackScenario}
            className="px-2.5 py-1 rounded bg-rose-950/90 hover:bg-rose-900 text-rose-300 border border-rose-800 transition-colors font-bold flex items-center space-x-1"
          >
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            <span>Test AI Attack</span>
          </button>

          <button
            onClick={onSimulatePaymentFailure}
            className="px-2.5 py-1 rounded bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 transition-colors font-medium"
          >
            [DEMO] Fail
          </button>
          <button
            onClick={onRetryPayment}
            className="px-2.5 py-1 rounded bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 transition-colors font-medium"
          >
            [DEMO] Retry
          </button>
          <button
            onClick={onViewTransactionTrace}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors font-medium"
          >
            View Trace
          </button>
        </div>
      </div>
    </div>
  );
};
