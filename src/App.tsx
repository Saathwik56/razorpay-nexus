import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { RevenueDashboard } from './components/RevenueDashboard';
import { AICatalogPassport } from './components/AICatalogPassport';
import { AIBuyerSimulator } from './components/AIBuyerSimulator';
import { PolicyCenter } from './components/PolicyCenter';
import { AuditTrailView } from './components/AuditTrailView';
import { SystemHealthView } from './components/SystemHealthView';
import { TestLabView } from './components/TestLabView';
import { RazorpayModal } from './components/RazorpayModal';
import { FailureRecoveryModal } from './components/FailureRecoveryModal';
import { ApiConfigModal } from './components/ApiConfigModal';
import { Product, AuditStep } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTabState] = useState<
    'dashboard' | 'catalog' | 'buyer' | 'policy' | 'audit' | 'health' | 'test-lab'
  >(() => {
    const saved = localStorage.getItem('agentboost_active_tab');
    if (saved && ['dashboard', 'catalog', 'buyer', 'policy', 'audit', 'health', 'test-lab'].includes(saved)) {
      return saved as any;
    }
    return 'dashboard';
  });

  const setActiveTab = (tab: 'dashboard' | 'catalog' | 'buyer' | 'policy' | 'audit' | 'health' | 'test-lab') => {
    localStorage.setItem('agentboost_active_tab', tab);
    setActiveTabState(tab);
  };

  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [isFailureModalOpen, setIsFailureModalOpen] = useState(false);
  const [isApiConfigOpen, setIsApiConfigOpen] = useState(false);

  const [checkoutOrderData, setCheckoutOrderData] = useState<{
    bundleTitle: string;
    items: Product[];
    originalAmount: number;
    finalAmount: number;
    discountAmount: number;
  } | null>(null);

  const handleInitiateCheckout = (orderPayload: {
    bundleTitle: string;
    items: Product[];
    originalAmount: number;
    finalAmount: number;
    discountAmount: number;
    quoteId?: string;
    auditSteps: AuditStep[];
  }) => {
    setCheckoutOrderData(orderPayload);
    setIsRazorpayModalOpen(true);
  };


  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-['Inter'] selection:bg-blue-100">
      {/* Streamlined Minimal Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenConfig={() => setIsApiConfigOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-24 sm:pb-12">
        {activeTab === 'dashboard' && (
          <RevenueDashboard onNavigateToBuyer={() => setActiveTab('buyer')} />
        )}
        {activeTab === 'catalog' && <AICatalogPassport />}
        {activeTab === 'buyer' && (
          <AIBuyerSimulator onInitiateCheckout={handleInitiateCheckout} />
        )}
        {activeTab === 'policy' && <PolicyCenter />}
        {activeTab === 'audit' && <AuditTrailView />}
        {activeTab === 'test-lab' && <TestLabView />}
        {activeTab === 'health' && <SystemHealthView />}
      </main>

      {/* Razorpay Test Mode Checkout Modal */}
      <RazorpayModal
        isOpen={isRazorpayModalOpen}
        onClose={() => setIsRazorpayModalOpen(false)}
        orderData={checkoutOrderData}
      />

      {/* Payment Failure & Recovery Modal */}
      <FailureRecoveryModal
        isOpen={isFailureModalOpen}
        onClose={() => setIsFailureModalOpen(false)}
      />

      {/* API Key Configuration Modal */}
      <ApiConfigModal
        isOpen={isApiConfigOpen}
        onClose={() => setIsApiConfigOpen(false)}
      />


    </div>
  );
};

export default App;
