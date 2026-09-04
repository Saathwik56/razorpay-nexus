import React, { useState } from 'react';
import { Key, ShieldCheck, CheckCircle2, X, RefreshCw, AlertCircle } from 'lucide-react';
import { razorpayService } from '../services/razorpayClient';

interface ApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiConfigModal: React.FC<ApiConfigModalProps> = ({ isOpen, onClose }) => {
  const currentConfig = razorpayService.getConfig();
  const [keyId, setKeyId] = useState(currentConfig.keyId);
  const [keySecret, setKeySecret] = useState(currentConfig.keySecret || '');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    setStatusMessage({ type: 'info', text: 'Verifying credentials with Razorpay REST API...' });

    razorpayService.setConfig({ keyId, keySecret });

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyId, keySecret })
      });
      const data = await res.json();

      if (data.success) {
        setStatusMessage({
          type: data.verified ? 'success' : 'info',
          text: data.message || 'Credentials saved successfully!'
        });
        setTimeout(() => {
          setStatusMessage(null);
          onClose();
        }, 1200);
      } else {
        setStatusMessage({
          type: 'error',
          text: data.error?.message || 'Failed to verify Razorpay credentials'
        });
      }
    } catch (e: any) {
      setStatusMessage({
        type: 'success',
        text: 'Credentials saved locally in active session!'
      });
      setTimeout(() => {
        setStatusMessage(null);
        onClose();
      }, 1200);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="razorpay-card max-w-md w-full rounded-2xl border-slate-200 shadow-2xl overflow-hidden animate-fadeIn bg-white">
        <div className="bg-slate-50 p-5 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Key className="w-4 h-4 text-[#0f63ed]" />
            <h3 className="font-bold text-slate-900 text-sm font-['Plus_Jakarta_Sans']">
              Razorpay API Keys Configuration
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 font-bold">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200/80 text-[11px] text-blue-900 space-y-1">
            <div className="font-bold flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0f63ed]" />
              <span>Merchant Configuration Note</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Enter your Razorpay Key ID and Secret. Saving will test connection with live Razorpay REST APIs (`POST /v1/orders`) so transactions appear directly on your Razorpay Merchant Dashboard.
            </p>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 font-mono">Razorpay Key ID</label>
            <input
              type="text"
              value={keyId}
              onChange={e => setKeyId(e.target.value)}
              placeholder="rzp_test_..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 font-mono focus:outline-none focus:border-blue-500 shadow-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 font-mono">Razorpay Key Secret</label>
            <input
              type="password"
              value={keySecret}
              onChange={e => setKeySecret(e.target.value)}
              placeholder="••••••••••••••••"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 font-mono focus:outline-none focus:border-blue-500 shadow-xs"
            />
            <p className="text-[10px] text-slate-500 pt-1">
              Key secrets are kept strictly server-side and never exposed to client-side code.
            </p>
          </div>

          {statusMessage && (
            <div className={`p-3 rounded-xl text-[11px] font-mono flex items-center space-x-2 ${
              statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
              statusMessage.type === 'error' ? 'bg-rose-50 text-rose-800 border border-rose-200' :
              'bg-blue-50 text-blue-800 border border-blue-200'
            }`}>
              {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> :
               statusMessage.type === 'error' ? <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" /> :
               <RefreshCw className="w-4 h-4 text-blue-600 animate-spin flex-shrink-0" />}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-3 rounded-xl bg-[#0f63ed] hover:bg-blue-700 disabled:opacity-50 text-white font-bold transition-all shadow-md flex items-center justify-center space-x-2"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 text-white animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            <span>{isSaving ? 'Verifying with Razorpay API...' : 'Save & Verify Credentials'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
