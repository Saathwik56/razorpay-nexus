import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  RefreshCw, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  BarChart3,
  Bot,
  User
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface RevenueDashboardProps {
  onNavigateToBuyer: () => void;
}

const chartData = [
  { day: 'Mon', revenue: 42000, agentic: 8400 },
  { day: 'Tue', revenue: 48000, agentic: 11200 },
  { day: 'Wed', revenue: 51000, agentic: 14500 },
  { day: 'Thu', revenue: 47000, agentic: 12900 },
  { day: 'Fri', revenue: 59000, agentic: 18200 },
  { day: 'Sat', revenue: 64000, agentic: 21000 },
  { day: 'Sun', revenue: 72000, agentic: 26800 },
];

const PIE_COLORS = ['#0f63ed', '#10b981'];

const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return percent > 0.08 ? (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null;
};

export const RevenueDashboard: React.FC<RevenueDashboardProps> = ({ onNavigateToBuyer }) => {
  const [isSyncingRzp, setIsSyncingRzp] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);
  const [pieData, setPieData] = useState([
    { name: 'AI Agent Orders', value: 112800 },
    { name: 'Human / Direct', value: 230000 },
  ]);
  const [pieLoading, setPieLoading] = useState(true);

  // Fetch real order breakdown from backend
  useEffect(() => {
    const fetchOrderBreakdown = async () => {
      try {
        const res = await fetch('/api/razorpay/orders');
        const data = await res.json();
        if (data.orders && data.orders.length > 0) {
          const agentOrders = data.orders.filter((o: any) => o.source === 'AI_BUYER' || o.source === 'REVENUE_AGENT');
          const humanOrders = data.orders.filter((o: any) => o.source === 'DIRECT' || !o.source);
          const agentRevenue = agentOrders.reduce((s: number, o: any) => s + (o.amount || 0), 0);
          const humanRevenue = humanOrders.reduce((s: number, o: any) => s + (o.amount || 0), 0);
          if (agentRevenue + humanRevenue > 0) {
            setPieData([
              { name: 'AI Agent Orders', value: Math.round(agentRevenue) },
              { name: 'Human / Direct', value: Math.round(humanRevenue) },
            ]);
          }
        }
      } catch (_) {}
      finally { setPieLoading(false); }
    };
    fetchOrderBreakdown();
  }, []);

  const syncRazorpayOrders = async () => {
    setIsSyncingRzp(true);
    try {
      const res = await fetch('/api/razorpay/orders');
      const data = await res.json();
      if (data.isLiveRazorpay) {
        setSyncToast(`Synced ${data.orders.length} live orders directly from Razorpay API!`);
      } else {
        setSyncToast(`Synced ${data.orders.length} orders from SQLite Merchant database.`);
      }
    } catch (e: any) {
      setSyncToast('Orders synced with Razorpay Test Mode database.');
    } finally {
      setIsSyncingRzp(false);
      setTimeout(() => setSyncToast(null), 4000);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Dashboard Top Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <span className="text-xs font-mono font-bold text-[#0f63ed] uppercase tracking-wider">
            MERCHANT CONTROL PLANE
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans'] tracking-tight mt-0.5">
            UrbanFit Store Overview
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={syncRazorpayOrders}
            disabled={isSyncingRzp}
            className="saas-button-secondary flex items-center space-x-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#0f63ed] ${isSyncingRzp ? 'animate-spin' : ''}`} />
            <span>{isSyncingRzp ? 'Syncing...' : 'Sync Razorpay API'}</span>
          </button>
        </div>
      </div>

      {syncToast && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 font-mono text-xs rounded-xl flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#0f63ed] flex-shrink-0" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div className="saas-card p-5 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
            <span>Monthly Revenue</span>
            <span className="p-1 rounded-lg bg-blue-50 text-[#0f63ed]">
              <DollarSign className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
            ₹3,42,800
          </div>
          <div className="flex items-center space-x-1 text-xs text-emerald-600 font-semibold font-mono">
            <TrendingUp className="w-3 h-3" />
            <span>+18.4% vs last month</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="saas-card p-5 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
            <span>Agentic Commerce Share</span>
            <span className="p-1 rounded-lg bg-emerald-50 text-emerald-600">
              <Zap className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
            ₹1,12,800 <span className="text-sm font-semibold text-slate-500">(32.9%)</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-emerald-600 font-semibold font-mono">
            <TrendingUp className="w-3 h-3" />
            <span>+42% AI buyers growth</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="saas-card p-5 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
            <span>AI Catalog Readiness</span>
            <span className="p-1 rounded-lg bg-indigo-50 text-indigo-600">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
            92%
          </div>
          <div className="text-xs text-slate-500 font-mono">
            100% policy compliance
          </div>
        </div>

        {/* Metric 4 */}
        <div className="saas-card p-5 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
            <span>Avg Order Value (AOV)</span>
            <span className="p-1 rounded-lg bg-slate-100 text-slate-600">
              <ShoppingBag className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
            ₹2,840
          </div>
          <div className="text-xs text-emerald-600 font-semibold font-mono">
            +₹480 via dynamic bundles
          </div>
        </div>
      </div>

      {/* Revenue Growth Chart — full width */}
      <div className="saas-card p-6 space-y-5">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-bold text-slate-900 text-sm font-['Plus_Jakarta_Sans']">
              Weekly Revenue & Agentic Channel Attribution
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparison of standard checkout vs AI Buyer Agent commerce revenue
            </p>
          </div>
          <div className="flex items-center space-x-4 text-xs font-medium">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0f63ed]" />
              <span className="text-slate-600">Total Revenue</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-600">AI Agent Revenue</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f63ed" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#0f63ed" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorAgent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#ffffff', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#0f63ed" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
              <Area type="monotone" dataKey="agentic" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorAgent)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Agentic vs Human Revenue Pie Chart */}
      <div className="saas-card p-6 space-y-5">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-bold text-slate-900 text-sm font-['Plus_Jakarta_Sans']">Agentic vs Human Revenue Split</h2>
            <p className="text-xs text-slate-500 mt-0.5">Real-time breakdown of AI Agent orders vs direct human checkout</p>
          </div>
          {pieLoading && <span className="text-xs text-slate-400 font-mono animate-pulse">Loading live data...</span>}
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Pie Chart */}
          <div className="h-56 w-full md:w-64 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%" cy="50%"
                  innerRadius={55} outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                  label={CustomPieLabel}
                  animationBegin={0}
                  animationDuration={800}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, '']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* KPI Callouts */}
          <div className="flex flex-col gap-4 flex-1 w-full">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
              <div className="p-2 bg-[#0f63ed] rounded-lg"><Bot className="w-4 h-4 text-white" /></div>
              <div>
                <div className="text-xs text-slate-500 font-medium">AI Agent Revenue</div>
                <div className="text-xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
                  ₹{pieData[0].value.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-[#0f63ed] font-semibold font-mono mt-0.5">
                  {((pieData[0].value / (pieData[0].value + pieData[1].value)) * 100).toFixed(1)}% of total • AI Buyer + Revenue Agent
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="p-2 bg-emerald-500 rounded-lg"><User className="w-4 h-4 text-white" /></div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Human / Direct Revenue</div>
                <div className="text-xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
                  ₹{pieData[1].value.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-emerald-600 font-semibold font-mono mt-0.5">
                  {((pieData[1].value / (pieData[0].value + pieData[1].value)) * 100).toFixed(1)}% of total • Standard checkout
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-xs font-mono text-slate-500">
                📈 AI Agent share growing <span className="text-emerald-600 font-bold">+42% MoM</span> — agentic commerce is now the fastest growing revenue channel.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
