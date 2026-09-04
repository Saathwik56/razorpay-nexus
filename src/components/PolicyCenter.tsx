import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Save, 
  DollarSign,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { PolicyEngine } from '../services/policyEngine';
import { DEFAULT_POLICY_CONFIG } from '../data/merchantData';
import { PolicyConfig } from '../types';

export const PolicyCenter: React.FC = () => {
  // Load initial persisted policy config from localStorage (or fallback default)
  const [savedConfig, setSavedConfig] = useState<PolicyConfig>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('agentboost_policy_config');
      if (saved) {
        try {
          return { ...DEFAULT_POLICY_CONFIG, ...JSON.parse(saved) };
        } catch (e) {}
      }
    }
    return DEFAULT_POLICY_CONFIG;
  });

  // Local draft state for interactive controls - changes are NOT saved until "Save Guardrails" is clicked
  const [draftConfig, setDraftConfig] = useState<PolicyConfig>(savedConfig);
  const [isSaved, setIsSaved] = useState(false);

  const hasUnsavedChanges = JSON.stringify(draftConfig) !== JSON.stringify(savedConfig);

  const policyEngine = new PolicyEngine(savedConfig);

  const handleDiscard = () => {
    setDraftConfig(savedConfig);
  };

  const handleSave = async () => {
    setSavedConfig(draftConfig);
    policyEngine.updateConfig(draftConfig);

    if (typeof window !== 'undefined') {
      localStorage.setItem('agentboost_policy_config', JSON.stringify(draftConfig));
    }

    try {
      await fetch('/api/policies/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draftConfig)
      });
    } catch (e) {
      console.warn('Policy update API call fallback:', e);
    }

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#ebf3ff] via-[#f0f6ff] to-[#eef5ff] p-6 rounded-2xl border border-blue-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-emerald-600">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>DETERMINISTIC POLICY CONTROL PLANE</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans'] tracking-tight">
            Revenue Guard & Policy Engine
          </h1>
          <p className="text-xs text-slate-600 font-medium">
            Configure transaction limits, dynamic discount caps, and money-action gates. Policy parameters persist to database only when saved.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {hasUnsavedChanges && (
            <button
              onClick={handleDiscard}
              className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-all"
              title="Discard unsaved edits"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Discard Edits</span>
            </button>
          )}

          <button
            onClick={handleSave}
            className={`flex items-center space-x-2.5 px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all transform hover:-translate-y-0.5 whitespace-nowrap shrink-0 ${
              isSaved
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                : hasUnsavedChanges
                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20 ring-2 ring-amber-400/50'
                : 'bg-[#0f63ed] hover:bg-blue-700 text-white shadow-blue-500/20'
            }`}
          >
            {isSaved ? (
              <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
            ) : hasUnsavedChanges ? (
              <AlertTriangle className="w-4 h-4 text-white animate-pulse shrink-0" />
            ) : (
              <Save className="w-4 h-4 shrink-0" />
            )}
            <span className="flex items-center space-x-1.5 leading-none">
              <span>Save Guardrails</span>
              {hasUnsavedChanges && !isSaved && (
                <span className="text-[11px] font-semibold opacity-95 tracking-tight bg-amber-700/40 px-1.5 py-0.5 rounded border border-amber-300/30">
                  (Unsaved Changes)
                </span>
              )}
              {isSaved && (
                <span className="text-[11px] font-semibold opacity-95 tracking-tight">
                  Saved to DB!
                </span>
              )}
            </span>
          </button>
        </div>
      </div>

      {hasUnsavedChanges && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between font-medium animate-fadeIn">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>You have unsaved policy modifications. Click <strong>"Save Guardrails"</strong> above to commit these changes to active policy rules.</span>
          </div>
        </div>
      )}

      {/* Main Grid: Policy Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Transaction & Discount Controls */}
        <div className="space-y-6">
          <div className="saas-card p-6 rounded-2xl border-slate-200 space-y-6">
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-4">
              <DollarSign className="w-4 h-4 text-[#0f63ed]" />
              <h2 className="font-bold text-slate-900 text-sm font-['Plus_Jakarta_Sans']">
                Monetary Limits & Human Approval Gates
              </h2>
            </div>

            {/* Threshold 1: Auto Approval Cap */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-800">Max Autonomous Transaction Limit</span>
                <span className="font-mono font-bold text-[#0f63ed]">₹{draftConfig.requireApprovalAbove.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="25000"
                step="500"
                value={draftConfig.requireApprovalAbove}
                onChange={e => setDraftConfig(prev => ({
                  ...prev,
                  requireApprovalAbove: Number(e.target.value),
                  autoApproveThreshold: Number(e.target.value)
                }))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0f63ed]"
              />
              <p className="text-[11px] text-slate-500">
                Transactions up to ₹{draftConfig.requireApprovalAbove.toLocaleString()} execute automatically. Transactions above trigger Merchant Approval.
              </p>
            </div>

            {/* Threshold 2: Max Auto Discount */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-800">Maximum Auto Discount Cap</span>
                <span className="font-mono font-bold text-emerald-600">₹{draftConfig.maxAutoDiscount}</span>
              </div>
              <input
                type="range"
                min="50"
                max="1000"
                step="50"
                value={draftConfig.maxAutoDiscount}
                onChange={e => setDraftConfig(prev => ({ ...prev, maxAutoDiscount: Number(e.target.value) }))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <p className="text-[11px] text-slate-500">
                Revenue Agent cannot recommend dynamic discounts exceeding ₹{draftConfig.maxAutoDiscount}.
              </p>
            </div>

            {/* Threshold 3: Max Discount Percentage */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-800">Maximum Discount Percentage</span>
                <span className="font-mono font-bold text-indigo-600">{draftConfig.maxDiscountPercentage}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                step="1"
                value={draftConfig.maxDiscountPercentage}
                onChange={e => setDraftConfig(prev => ({ ...prev, maxDiscountPercentage: Number(e.target.value) }))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Feature Capability Gates */}
        <div className="space-y-6">
          <div className="saas-card p-6 rounded-2xl border-slate-200 space-y-5">
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-4">
              <Lock className="w-4 h-4 text-emerald-600" />
              <h2 className="font-bold text-slate-900 text-sm font-['Plus_Jakarta_Sans']">
                Autonomous Action Gates
              </h2>
            </div>

            <div className="space-y-3 text-xs font-['Inter']">
              {/* Gate 1: Create Orders */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="font-bold text-slate-900">Create Razorpay Orders</div>
                  <div className="text-[11px] text-slate-500">Allow AI Buyer Agent to generate test mode orders</div>
                </div>
                <input
                  type="checkbox"
                  checked={draftConfig.permissions.createOrders}
                  onChange={e => setDraftConfig(prev => ({
                    ...prev,
                    permissions: { ...prev.permissions, createOrders: e.target.checked }
                  }))}
                  className="w-4 h-4 rounded text-blue-600 bg-white border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              {/* Gate 2: Create Payment Links */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="font-bold text-slate-900">Create Payment Links</div>
                  <div className="text-[11px] text-slate-500">Allow AI Agent to generate POST /v1/payment_links URLs</div>
                </div>
                <input
                  type="checkbox"
                  checked={draftConfig.permissions.createPaymentLinks}
                  onChange={e => setDraftConfig(prev => ({
                    ...prev,
                    permissions: { ...prev.permissions, createPaymentLinks: e.target.checked }
                  }))}
                  className="w-4 h-4 rounded text-blue-600 bg-white border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              {/* Gate 3: Automatic Refunds */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                    <span>Autonomous Refunds</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono border font-bold ${
                      draftConfig.permissions.refundWithoutApproval 
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}>
                      {draftConfig.permissions.refundWithoutApproval ? 'AUTONOMOUS ALLOWED' : 'HUMAN APPROVAL REQUIRED'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {draftConfig.permissions.refundWithoutApproval 
                      ? 'AI agent is permitted to execute automated refunds under policy caps'
                      : 'Merchant policy requires explicit manual approval for issuing refunds'}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={draftConfig.permissions.refundWithoutApproval}
                  onChange={e => setDraftConfig(prev => ({
                    ...prev,
                    permissions: { ...prev.permissions, refundWithoutApproval: e.target.checked }
                  }))}
                  className="w-4 h-4 rounded text-blue-600 bg-white border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              {/* Action Gates Explanation Info Box */}
              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200/80 text-[11px] text-blue-900 space-y-1">
                <div className="font-bold flex items-center space-x-1">
                  <Lock className="w-3.5 h-3.5 text-[#0f63ed]" />
                  <span>What are Autonomous Action Gates?</span>
                </div>
                <p className="text-slate-600 leading-relaxed font-['Inter']">
                  Action Gates dictate which money-moving actions (creating orders, generating payment links, issuing refunds) an AI agent is permitted to execute autonomously without manual merchant sign-off.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

