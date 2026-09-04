import React, { useState } from 'react';
import { 
  Zap, 
  Key, 
  FlaskConical,
  Menu,
  X,
  LayoutDashboard,
  BookOpen,
  ShoppingCart,
  ShieldCheck,
  ClipboardList,
  Activity,
  TestTube2
} from 'lucide-react';

type TabId = 'dashboard' | 'catalog' | 'buyer' | 'policy' | 'audit' | 'health' | 'test-lab';

interface NavbarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  onOpenConfig: () => void;
}

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard',  label: 'Dashboard',   icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'catalog',    label: 'AI Catalog',   icon: <BookOpen className="w-4 h-4" /> },
  { id: 'buyer',      label: 'AI Buyer',     icon: <ShoppingCart className="w-4 h-4" /> },
  { id: 'policy',     label: 'Policies',     icon: <ShieldCheck className="w-4 h-4" /> },
  { id: 'audit',      label: 'Audit Trail',  icon: <ClipboardList className="w-4 h-4" /> },
  { id: 'test-lab',   label: 'Test Lab',     icon: <FlaskConical className="w-4 h-4" /> },
  { id: 'health',     label: 'Health',       icon: <Activity className="w-4 h-4" /> },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenConfig,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (id: TabId) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">

            {/* Brand */}
            <div
              className="flex items-center space-x-2.5 cursor-pointer group flex-shrink-0"
              onClick={() => handleTabClick('dashboard')}
            >
              <div className="w-8 h-8 rounded-xl bg-[#0f63ed] flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 font-['Plus_Jakarta_Sans'] leading-tight whitespace-nowrap">
                Razorpay <span className="text-[#0f63ed]">Nexus</span>
              </span>
            </div>

            {/* Desktop nav tabs */}
            <nav className="hidden lg:flex items-center space-x-1 mx-6">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                    activeTab === tab.id
                      ? 'bg-slate-100/80 text-[#0f63ed] font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span className={activeTab === tab.id ? 'text-[#0f63ed]' : 'text-slate-400'}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-mono font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Test Mode</span>
              </div>

              <button
                onClick={onOpenConfig}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors"
                title="Razorpay API Credentials"
              >
                <Key className="w-4 h-4 text-slate-600" />
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
                aria-label="Open navigation menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4 text-slate-600" /> : <Menu className="w-4 h-4 text-slate-600" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white">
            <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-2 gap-1.5">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all w-full text-left ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-[#0f63ed] border border-blue-200/80'
                      : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <span className={activeTab === tab.id ? 'text-[#0f63ed]' : 'text-slate-400'}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Mobile status bar */}
            <div className="px-4 pb-3 flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-emerald-700 font-mono font-medium">Razorpay Test Mode Active</span>
            </div>
          </div>
        )}
      </header>

      {/* Mobile bottom tab bar — always visible on mobile for quick switching */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 flex items-center justify-around px-1 py-1 safe-bottom">
        {tabs.slice(0, 5).map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex flex-col items-center py-1.5 px-2 rounded-xl transition-all flex-1 ${
              activeTab === tab.id
                ? 'text-[#0f63ed]'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab.icon}
            <span className="text-[9px] font-semibold mt-0.5 leading-tight">{tab.label.replace(' ', '\n')}</span>
          </button>
        ))}
        {/* More button for remaining tabs */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`flex flex-col items-center py-1.5 px-2 rounded-xl transition-all flex-1 ${
            ['test-lab', 'health'].includes(activeTab)
              ? 'text-[#0f63ed]'
              : 'text-slate-400'
          }`}
        >
          <Menu className="w-4 h-4" />
          <span className="text-[9px] font-semibold mt-0.5">More</span>
        </button>
      </nav>
    </>
  );
};
