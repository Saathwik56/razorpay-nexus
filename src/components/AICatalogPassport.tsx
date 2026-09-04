import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  Code, 
  Eye, 
  Zap, 
  Check,
  Plus,
  X,
  PackagePlus,
  ShieldCheck,
  Trash2
} from 'lucide-react';
import { aiAgentEngine } from '../services/aiAgentEngine';
import { MerchantPassport, Product } from '../types';

export const AICatalogPassport: React.FC = () => {
  const [passport, setPassport] = useState<MerchantPassport>(aiAgentEngine.getPassport());
  const [activeView, setActiveView] = useState<'human' | 'machine'>('human');
  const [copied, setCopied] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizeMessage, setOptimizeMessage] = useState<string | null>(null);

  // Add Product Modal State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('supplements');
  const [newPrice, setNewPrice] = useState('1499');
  const [newStock, setNewStock] = useState('100');
  const [newDescription, setNewDescription] = useState('');

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(passport, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOptimizeCatalog = async () => {
    setIsOptimizing(true);
    try {
      await fetch('/api/catalog/optimize', { method: 'POST' });
    } catch (e) {
      console.warn('Catalog optimize API call fallback:', e);
    }

    const updated = aiAgentEngine.optimizeCatalogForAI();
    setPassport(updated);
    setIsOptimizing(false);
    setOptimizeMessage('⚡ Catalog Metadata Successfully Optimized! Added ACP JSON-LD schemas, standardized category tags, and discount limits. Score set to 100%.');
    setTimeout(() => setOptimizeMessage(null), 5000);
  };

  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newProd: Product = {
      id: `prod_${Date.now()}`,
      name: newTitle,
      category: newCategory,
      price: Number(newPrice) || 999,
      inventory: Number(newStock) || 50,
      description: newDescription || 'High performance item ready for AI agent discovery.',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300',
      attributes: {
        aiDiscountCap: 150,
        proteinPerServing: newTitle.toLowerCase().includes('protein') ? '25g' : undefined
      }
    };

    // Always index into local AI Agent Engine
    aiAgentEngine.addProduct(newProd);

    try {
      await fetch('/api/catalog/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd)
      });
    } catch (err) {
      console.warn('Backend catalog sync notice:', err);
    }

    setPassport(aiAgentEngine.getPassport());
    setIsAddProductOpen(false);
    setNewTitle('');
    setNewDescription('');
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!window.confirm(`Are you sure you want to remove "${productName}" from the catalog?`)) {
      return;
    }

    aiAgentEngine.deleteProduct(productId);

    try {
      await fetch(`/api/catalog/product/${productId}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn('Backend delete sync notice:', err);
    }

    setPassport(aiAgentEngine.getPassport());
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-mono font-semibold text-[#0f63ed] uppercase tracking-wider">AI DISCOVERY & SPECIFICATION</span>
          <h1 className="text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans'] tracking-tight">
            AI Merchant Passport & Catalog
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="saas-button-primary flex items-center space-x-1.5 shadow-md shadow-blue-500/20"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Add New Product</span>
          </button>

          <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 text-xs">
            <button
              onClick={() => setActiveView('human')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeView === 'human' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Human View
            </button>
            <button
              onClick={() => setActiveView('machine')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeView === 'machine' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Machine JSON
            </button>
          </div>

          <button
            onClick={handleCopyJSON}
            className="saas-button-secondary flex items-center space-x-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
          </button>
        </div>
      </div>

      {/* AI Readiness Bar & Explanation */}
      <div className="saas-card p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <div className="text-xs font-mono text-slate-500 font-semibold uppercase">AI Readiness Score</div>
            <div className="text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
              {passport.aiReadinessScore}% Optimized
            </div>
          </div>

          <button
            onClick={handleOptimizeCatalog}
            disabled={isOptimizing}
            className={`saas-button-primary flex items-center space-x-1.5 ${
              passport.aiReadinessScore === 100 ? 'bg-emerald-600 hover:bg-emerald-700' : ''
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>{isOptimizing ? 'Optimizing Metadata...' : passport.aiReadinessScore === 100 ? 'Re-Optimize Catalog' : '⚡ 1-Click Optimize Catalog'}</span>
          </button>
        </div>

        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0f63ed] transition-all duration-500"
            style={{ width: `${passport.aiReadinessScore}%` }}
          />
        </div>

        <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200/80 text-[11px] text-blue-900 space-y-1">
          <div className="font-bold flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0f63ed]" />
            <span>What does "Optimize Catalog" do?</span>
          </div>
          <p className="text-slate-600 leading-relaxed font-['Inter']">
            Catalog Optimization attaches standardized JSON-LD schema metadata, populates missing agent capability tags (ACP/AP2/x402), sets bounded discount rules, and normalizes catalog structure for 100% AI Agent readability.
          </p>
        </div>

        {optimizeMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs rounded-xl flex items-center space-x-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{optimizeMessage}</span>
          </div>
        )}
      </div>

      {/* Table / Machine View */}
      {activeView === 'human' ? (
        <div className="saas-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-['Inter'] min-w-[600px]">
            <thead className="bg-slate-50 text-slate-500 font-mono uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Product Name</th>
                <th className="px-5 py-3.5 font-semibold">Category</th>
                <th className="px-5 py-3.5 font-semibold">Price</th>
                <th className="px-5 py-3.5 font-semibold">Stock</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {passport.products.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4 font-semibold text-slate-900">{p.name}</td>
                  <td className="px-5 py-4 font-mono text-slate-600 capitalize">{p.category}</td>
                  <td className="px-5 py-4 font-mono font-bold text-[#0f63ed]">₹{p.price.toLocaleString()}</td>
                  <td className="px-5 py-4 font-mono text-slate-600">{p.inventory} units</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-semibold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>AI Ready</span>
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => handleDeleteProduct(p.id, p.name)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
                      title={`Remove ${p.name} from catalog`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      ) : (
        <div className="saas-card p-6 font-mono text-xs text-slate-800 bg-slate-900 text-cyan-300 overflow-x-auto">
          <pre>{JSON.stringify(passport, null, 2)}</pre>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="saas-card max-w-md w-full p-6 space-y-4 bg-white shadow-2xl border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2 font-bold text-slate-900 text-sm">
                <PackagePlus className="w-4 h-4 text-[#0f63ed]" />
                <span>Add Product to Merchant Catalog</span>
              </div>
              <button onClick={() => setIsAddProductOpen(false)} className="text-slate-400 hover:text-slate-900 font-bold">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Product Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Smart Fitness Tracker Band"
                  className="w-full mt-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full mt-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    <option value="supplements">Supplements</option>
                    <option value="fitness">Fitness Gear</option>
                    <option value="wearables">Wearables</option>
                    <option value="apparel">Apparel</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={e => setNewPrice(e.target.value)}
                    className="w-full mt-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700">Stock Inventory</label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={e => setNewStock(e.target.value)}
                    className="w-full mt-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">AI Readiness</label>
                  <input
                    type="text"
                    disabled
                    value="✓ Auto-Indexed"
                    className="w-full mt-1 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-emerald-700 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Description</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="Describe item features for AI Agent discovery..."
                  className="w-full mt-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="saas-button-secondary py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="saas-button-primary py-2 px-5"
                >
                  Save & Index Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
