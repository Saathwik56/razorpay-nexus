import React, { useState } from 'react';
import { 
  AlertTriangle, 
  RefreshCw, 
  CheckCircle2, 
  X, 
  ShieldCheck
} from 'lucide-react';
import { auditLogger } from '../services/auditLogger';

interface FailureRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FailureRecoveryModal: React.FC<FailureRecoveryModalProps> = ({ isOpen, onClose }) => {
  const [retryState, setRetryState] = useState<'failed' | 'retrying' | 'success'>('failed');

  if (!isOpen) return null;

  const handleRetry = () => {
    setRetryState('retrying');

    auditLogger.addStep({
      stage: 'RECOVERY',
      label: 'AI Payment Recovery Initiated',
      details: 'Agent detected payment failure, preserved cart (Whey Protein + Shaker @ ₹2,699), and offered 1-click retry.',
      status: 'success'
    });

    setTimeout(() => {
      auditLogger.addStep({
        stage: 'PAYMENT',
        label: 'Payment Retry Successful',
        details: 'Payment retry authorized successfully via Razorpay Test Mode. Order marked PAID.',
        status: 'success'
      });
      setRetryState('success');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="razorpay-card max-w-md w-full rounded-2xl border-slate-200 shadow-2xl overflow-hidden animate-fadeIn bg-white space-y-0">
        {/* Header */}
        <div className="bg-rose-50 p-5 border-b border-rose-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span className="font-extrabold text-slate-900 text-sm font-['Plus_Jakarta_Sans']">
              Simulated Payment Failure Mode
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {retryState === 'failed' && (
            <>
              <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-200 space-y-2 text-xs">
                <div className="text-rose-700 font-mono font-bold">
                  BAD_REQUEST_ERROR: Payment declined by issuing bank.
                </div>
                <p className="text-slate-700 leading-relaxed font-['Inter']">
                  No money was captured. Your cart (Whey Protein + Shaker @ ₹2,699) is preserved safely.
                </p>
              </div>

              <div className="flex items-center space-x-2 text-[11px] text-[#0f63ed] bg-blue-50 p-2.5 rounded-xl border border-blue-200 font-mono">
                <ShieldCheck className="w-4 h-4 flex-shrink-0 text-[#0f63ed]" />
                <span>Revenue Recovery Agent preserving cart context for retry.</span>
              </div>

              <button
                onClick={handleRetry}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry Payment (₹2,699)</span>
              </button>
            </>
          )}

          {retryState === 'retrying' && (
            <div className="text-center py-6 space-y-3 font-mono text-xs text-[#0f63ed] animate-pulse">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#0f63ed]" />
              <div>Retrying payment authorization safely...</div>
            </div>
          )}

          {retryState === 'success' && (
            <div className="text-center space-y-4 py-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 border border-emerald-300 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                  Payment Recovered Successfully!
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  Razorpay Order Settled: ₹2,699
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs"
              >
                Close & View Trace
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
