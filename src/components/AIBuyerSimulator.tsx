import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Tag, 
  Clock, 
  Lock,
  MessageSquare
} from 'lucide-react';
import { aiAgentEngine } from '../services/aiAgentEngine';
import { PolicyEngine } from '../services/policyEngine';
import { DEFAULT_POLICY_CONFIG } from '../data/merchantData';
import { Product, AuditStep, Quote } from '../types';
import { auditLogger } from '../services/auditLogger';

interface AIBuyerSimulatorProps {
  onInitiateCheckout: (orderPayload: {
    bundleTitle: string;
    items: Product[];
    originalAmount: number;
    finalAmount: number;
    discountAmount: number;
    quoteId?: string;
    auditSteps: AuditStep[];
  }) => void;
}

export const AIBuyerSimulator: React.FC<AIBuyerSimulatorProps> = ({ onInitiateCheckout }) => {
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [lastGeminiIntent, setLastGeminiIntent] = useState<{ intent: string; keywords: string[]; maxPrice?: number; usedGemini: boolean } | null>(null);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string; quote?: Quote; items?: Product[] }>>([
    { sender: 'agent', text: 'Hello! I am your AI Buyer Agent. Ask me to search products, recommend items, or negotiate a policy-verified bounded quote for any product in the catalog.' }
  ]);

  const [activeQuote, setActiveQuote] = useState<Quote | null>(null);
  const [matchedProducts, setMatchedProducts] = useState<Product[]>([]);
  
  const getSavedPolicyConfig = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('agentboost_policy_config');
      if (saved) {
        try {
          return { ...DEFAULT_POLICY_CONFIG, ...JSON.parse(saved) };
        } catch (e) {}
      }
    }
    return DEFAULT_POLICY_CONFIG;
  };
  
  const policyEngine = new PolicyEngine(getSavedPolicyConfig());

  const allProducts = aiAgentEngine.getProducts();

  // Filter real-time as user types
  const liveRecommendations = inputQuery.trim()
    ? allProducts.filter(p => 
        p.name.toLowerCase().includes(inputQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(inputQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(inputQuery.toLowerCase()))
      ).slice(0, 4)
    : [];

  const handleSendQuery = async (queryText: string) => {
    const userText = queryText || inputQuery;
    if (!userText.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputQuery('');
    setIsThinking(true);
    setLastGeminiIntent(null);

    try {
      // Try Gemini-powered NL search first
      const res = await fetch('/api/agent-commerce/gemini-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userText })
      });

      if (res.ok) {
        const data = await res.json();
        const searchResult = data;
        setMatchedProducts(searchResult.matchedProducts || []);

        if (data.geminiIntent) {
          setLastGeminiIntent({ ...data.geminiIntent, usedGemini: data.usedGemini });
        }

        if (searchResult.quote) {
          setActiveQuote(searchResult.quote);
          setMessages(prev => [
            ...prev,
            {
              sender: 'agent',
              text: `🎯 Best Recommendation: ${searchResult.matchedProducts[0]?.name} (₹${searchResult.matchedProducts[0]?.price.toLocaleString()}) — Selected as optimal fit from merchant catalog. Generated Policy-Verified Bounded Quote #${searchResult.quote?.quoteNumber}. Total: ₹${searchResult.quote?.total.toLocaleString()}. Expires in 10 mins.`,
              quote: searchResult.quote,
              items: searchResult.matchedProducts
            }
          ]);
        } else {
          setMessages(prev => [
            ...prev,
            {
              sender: 'agent',
              text: searchResult.matchedProducts?.length
                ? `Matched ${searchResult.matchedProducts.length} item${searchResult.matchedProducts.length > 1 ? 's' : ''}: ${searchResult.matchedProducts.map((p: any) => p.name).join(', ')}.`
                : `No exact matches found for "${userText}". Try: protein, whey, creatine, gym bag, shoes.`
            }
          ]);
        }
        return;
      }
    } catch (_) {
      // API unreachable – fall back to local processing
    } finally {
      setIsThinking(false);
    }

    // Local fallback
    const activePolicyEngine = new PolicyEngine(getSavedPolicyConfig());
    const searchResult = aiAgentEngine.processBuyerQuery(userText, activePolicyEngine);
    setMatchedProducts(searchResult.matchedProducts);
    if (searchResult.quote) {
      setActiveQuote(searchResult.quote);
      setMessages(prev => [...prev, { sender: 'agent', text: `🎯 ${searchResult.matchedProducts[0]?.name} — Quote #${searchResult.quote?.quoteNumber} for ₹${searchResult.quote?.total.toLocaleString()}`, quote: searchResult.quote, items: searchResult.matchedProducts }]);
    } else {
      setMessages(prev => [...prev, { sender: 'agent', text: `Found ${searchResult.matchedProducts.length} items: ${searchResult.matchedProducts.map(p => p.name).join(', ')}` }]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-16">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <div>
          <span className="text-xs font-mono font-bold text-[#0f63ed] uppercase tracking-wider">AGENTIC COMMERCE CONVERSATIONAL ASSISTANT</span>
          <h1 className="text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans'] tracking-tight">
            AI Buyer Agent
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-[#0f63ed] border border-blue-200/80 px-3 py-1.5 rounded-xl text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini 1.5 Flash</span>
          </div>
          <div className="flex items-center space-x-2 bg-blue-50 text-[#0f63ed] border border-blue-200/80 px-3 py-1.5 rounded-xl text-xs font-mono font-bold">
            <ShieldCheck className="w-4 h-4 text-[#0f63ed]" />
            <span>Policy Engine Active</span>
          </div>
        </div>
      </div>

      {/* Gemini Intent Display */}
      {lastGeminiIntent && (
        <div className="flex items-start gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl animate-fadeIn">
          <Sparkles className="w-4 h-4 text-[#0f63ed] flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5">
            <div className="font-bold text-[#0f63ed]">{lastGeminiIntent.usedGemini ? '✨ Gemini AI parsed your intent:' : '🔍 Keyword search:'}</div>
            <div className="text-slate-700 font-medium">"{lastGeminiIntent.intent}"</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {lastGeminiIntent.keywords.map(k => (
                <span key={k} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold">{k}</span>
              ))}
              {lastGeminiIntent.maxPrice && (
                <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold">max ₹{lastGeminiIntent.maxPrice.toLocaleString()}</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Thinking indicator */}
      {isThinking && (
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-[#0f63ed]" />
          <span>Gemini is parsing your intent...</span>
        </div>
      )}

      {/* Main Chat & Quote Interface */}
      <div className="saas-card p-6 space-y-6">
        {/* Chat History */}
        <div className="space-y-4 min-h-[260px] max-h-[450px] overflow-y-auto pr-1">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xl rounded-2xl p-4 text-xs font-['Inter'] space-y-2 ${
                msg.sender === 'user' 
                  ? 'bg-[#0f63ed] text-white font-medium shadow-sm' 
                  : 'bg-slate-100/90 text-slate-800 border border-slate-200/60'
              }`}>
                <div className="flex items-center space-x-2">
                  <Bot className={`w-3.5 h-3.5 ${msg.sender === 'user' ? 'text-blue-200' : 'text-[#0f63ed]'}`} />
                  <span className="font-bold font-mono uppercase text-[10px] opacity-80">
                    {msg.sender === 'user' ? 'Customer Shopping Intent' : 'AI Buyer Assistant'}
                  </span>
                </div>
                <p className="leading-relaxed">{msg.text}</p>

                {msg.quote && msg.items && (
                  <div className="mt-3 p-3 bg-white rounded-xl border border-blue-200 text-slate-900 space-y-2 font-mono text-[11px]">
                    <div className="flex justify-between items-center font-bold text-blue-900 border-b border-blue-100 pb-1.5">
                      <span>QUOTE #{msg.quote.quoteNumber}</span>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">POLICY APPROVED</span>
                    </div>
                    {msg.items.map(i => (
                      <div key={i.id} className="flex justify-between">
                        <span>{i.name}</span>
                        <span className="font-bold">₹{i.price.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-xs text-[#0f63ed]">
                      <span>Final Total:</span>
                      <span>₹{msg.quote.total.toLocaleString()}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const q = msg.quote || activeQuote;
                        const items = msg.items || matchedProducts;
                        onInitiateCheckout({
                          bundleTitle: `Quote #${q?.quoteNumber || 'QT-1001'}`,
                          items: items && items.length > 0 ? items : [aiAgentEngine.getProducts()[0]],
                          originalAmount: q?.subtotal || 2499,
                          finalAmount: q?.total || 2299,
                          discountAmount: q?.discount || 200,
                          quoteId: q?.id || 'quote_1',
                          auditSteps: typeof auditLogger.getAuditSteps === 'function' ? auditLogger.getAuditSteps() : []
                        });
                      }}
                      className="mt-2 w-full saas-button-primary py-2.5 flex items-center justify-center space-x-1.5 text-xs shadow-md shadow-blue-500/20 cursor-pointer"
                    >
                      <span>Approve & Pay ₹{(msg.quote?.total || 2299).toLocaleString()}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Live As-You-Type Recommendations Dropdown */}
        {inputQuery.trim().length > 0 && liveRecommendations.length > 0 && (
          <div className="bg-white rounded-xl border border-blue-200 shadow-xl p-3 space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-500 uppercase border-b border-slate-100 pb-1.5">
              <span className="flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-[#0f63ed]" />
                <span>Live Catalog Recommendations ({liveRecommendations.length})</span>
              </span>
              <span className="text-blue-600">Click item to query AI</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {liveRecommendations.map(prod => (
                <button
                  key={prod.id}
                  type="button"
                  onClick={() => {
                    const qText = `I want to buy ${prod.name}`;
                    setInputQuery(qText);
                    handleSendQuery(qText);
                  }}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-left transition-all group cursor-pointer"
                >
                  <div className="truncate pr-2">
                    <div className="font-bold text-slate-900 text-xs truncate group-hover:text-[#0f63ed]">{prod.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono capitalize">{prod.category}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-mono font-extrabold text-xs text-[#0f63ed]">₹{prod.price.toLocaleString()}</div>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-bold">1-Click AI Quote</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="pt-2 border-t border-slate-100 flex items-center space-x-2">
          <input
            type="text"
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendQuery(inputQuery)}
            placeholder="Type any shopping query or product request..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0f63ed] focus:bg-white transition-all font-['Inter']"
          />
          <button
            onClick={() => handleSendQuery(inputQuery)}
            className="saas-button-primary py-2.5 px-4 flex items-center space-x-1.5"
          >
            <span>Ask AI</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
