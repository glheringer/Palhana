import React, { useState, useEffect } from 'react';
import {
  Flavor,
  PackagingOption,
  Order,
  CartItem,
  ProspectLead,
  BatchProductionLog,
  StoreSettings,
  OrderStatus,
  PaymentStatus,
  FlavorId,
} from './types';
import {
  getSettings,
  saveSettings,
  getFlavors,
  saveFlavors,
  getPackagings,
  savePackagings,
  getOrders,
  saveOrders,
  getLeads,
  saveLeads,
  getBatches,
  saveBatches,
} from './utils/storage';
import { Navbar, ActiveTab } from './components/Navbar';
import { CatalogView } from './components/CatalogView';
import { TrackingView } from './components/TrackingView';
import { StockView } from './components/StockView';
import { PaymentsView } from './components/PaymentsView';
import { ProspectingView } from './components/ProspectingView';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SettingsModal } from './components/SettingsModal';
import { ReactNativeCodeModal } from './components/ReactNativeCodeModal';
import { MobileBottomTabBar } from './components/MobileBottomTabBar';
import { MobileSimulatorFrame } from './components/MobileSimulatorFrame';
import { PalhanasBadge, PalhanasLogo } from './components/BrandGraphics';
import { Heart, Instagram, Phone, MapPin, Sparkles, Smartphone, Code, Monitor } from 'lucide-react';

export default function App() {
  // App state
  const [settings, setSettingsState] = useState<StoreSettings>(getSettings);
  const [flavors, setFlavorsState] = useState<Flavor[]>(getFlavors);
  const [packagings, setPackagingsState] = useState<PackagingOption[]>(getPackagings);
  const [orders, setOrdersState] = useState<Order[]>(getOrders);
  const [leads, setLeadsState] = useState<ProspectLead[]>(getLeads);
  const [batches, setBatchesState] = useState<BatchProductionLog[]>(getBatches);

  // Active view tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('catalogo');
  const [initialTrackingCode, setInitialTrackingCode] = useState<string>('');

  // Mobile App Format Mode & Modals
  const [isMobileSimulator, setIsMobileSimulator] = useState<boolean>(false);
  const [isReactNativeCodeOpen, setIsReactNativeCodeOpen] = useState<boolean>(false);

  // Cart & Modals
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Check URL parameters for direct order tracking link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const trackCode = params.get('track') || params.get('pedido') || params.get('rastreio');
    if (trackCode) {
      setInitialTrackingCode(trackCode);
      setActiveTab('rastreio');
    }
  }, []);

  // Listen to cross-component storage changes
  useEffect(() => {
    const handleStorageUpdate = () => {
      setSettingsState(getSettings());
      setFlavorsState(getFlavors());
      setPackagingsState(getPackagings());
      setOrdersState(getOrders());
      setLeadsState(getLeads());
      setBatchesState(getBatches());
    };

    window.addEventListener('palhanas_storage_update', handleStorageUpdate);
    return () => window.removeEventListener('palhanas_storage_update', handleStorageUpdate);
  }, []);

  // Cart handlers
  const handleAddToCart = (item: CartItem) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (i) =>
          i.packagingId === item.packagingId &&
          i.giftNote === item.giftNote &&
          JSON.stringify(i.selectedFlavors) === JSON.stringify(item.selectedFlavors)
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += item.quantity;
        return updated;
      }
      return [...prev, item];
    });
  };

  const handleUpdateCartQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      setCart((prev) => prev.filter((i) => i.id !== itemId));
    } else {
      setCart((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, quantity: newQty } : i))
      );
    }
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Order creation from checkout modal
  const handleOrderCreated = (newOrder: Order) => {
    // Deduct stock for all items in order
    const updatedFlavors = [...flavors];
    newOrder.items.forEach((item) => {
      item.flavorsBreakdown.forEach(({ flavorId, count }) => {
        const flavorIdx = updatedFlavors.findIndex((f) => f.id === flavorId);
        if (flavorIdx > -1) {
          const totalUnits = count * item.quantity;
          updatedFlavors[flavorIdx].stock = Math.max(
            0,
            updatedFlavors[flavorIdx].stock - totalUnits
          );
        }
      });
    });

    setFlavorsState(updatedFlavors);
    saveFlavors(updatedFlavors);

    // Save order
    const updatedOrders = [newOrder, ...orders];
    setOrdersState(updatedOrders);
    saveOrders(updatedOrders);

    // Also auto-add client to leads/CRM if not already registered
    const existingLead = leads.find((l) => l.phone.includes(newOrder.customerPhone.slice(-8)));
    if (!existingLead && newOrder.customerName) {
      const newLead: ProspectLead = {
        id: 'lead_' + Date.now(),
        name: newOrder.customerName,
        companyOrPlace: newOrder.customerName + ' (Cliente Final)',
        type: 'consumidor_final',
        phone: newOrder.customerPhone,
        address: newOrder.customerAddress || 'Retirada / Entrega',
        status: 'cliente_ativo',
        notes: `Cliente realizou pedido online #${newOrder.trackingCode} no valor de R$ ${newOrder.total.toFixed(2)}.`,
        lastContactDate: new Date().toISOString().split('T')[0],
        totalOrdersCount: 1,
        totalSpent: newOrder.total,
      };
      const updatedLeads = [newLead, ...leads];
      setLeadsState(updatedLeads);
      saveLeads(updatedLeads);
    }
  };

  // Order status update handler
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    setOrdersState(updated);
    saveOrders(updated);
  };

  // Payment status update handler
  const handleUpdatePaymentStatus = (
    orderId: string,
    newPaymentStatus: PaymentStatus,
    amountPaid?: number
  ) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          paymentStatus: newPaymentStatus,
          paidAmount: amountPaid !== undefined ? amountPaid : o.paidAmount,
        };
      }
      return o;
    });
    setOrdersState(updated);
    saveOrders(updated);
  };

  // Flavor stock update handler
  const handleUpdateFlavorStock = (flavorId: string, newStock: number) => {
    const updated = flavors.map((f) => (f.id === flavorId ? { ...f, stock: newStock } : f));
    setFlavorsState(updated);
    saveFlavors(updated);
  };

  // Batch production log handler
  const handleAddBatch = (newBatch: BatchProductionLog) => {
    const updatedBatches = [newBatch, ...batches];
    setBatchesState(updatedBatches);
    saveBatches(updatedBatches);

    // Increase stock for the produced flavor
    const flavorIdx = flavors.findIndex((f) => f.id === newBatch.flavorId);
    if (flavorIdx > -1) {
      const updatedFlavors = [...flavors];
      updatedFlavors[flavorIdx].stock += newBatch.quantityProduced;
      setFlavorsState(updatedFlavors);
      saveFlavors(updatedFlavors);
    }
  };

  // Leads handlers
  const handleAddLead = (newLead: ProspectLead) => {
    const updated = [newLead, ...leads];
    setLeadsState(updated);
    saveLeads(updated);
  };

  const handleUpdateLead = (updatedLead: ProspectLead) => {
    const updated = leads.map((l) => (l.id === updatedLead.id ? updatedLead : l));
    setLeadsState(updated);
    saveLeads(updated);
  };

  // Settings save handler
  const handleSaveSettings = (newSettings: StoreSettings) => {
    setSettingsState(newSettings);
    saveSettings(newSettings);
  };

  // Navigate directly to tracking view
  const handleNavigateToTracking = (orderCode?: string) => {
    if (orderCode) {
      setInitialTrackingCode(orderCode);
    }
    setActiveTab('rastreio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const pendingOrdersCount = orders.filter(
    (o) => o.status !== 'entregue' && o.status !== 'cancelado'
  ).length;
  const lowStockCount = flavors.filter((f) => f.stock <= f.minStockAlert).length;

  const getTabTitle = () => {
    switch (activeTab) {
      case 'catalogo':
        return 'Vitrine & Pedidos';
      case 'rastreio':
        return 'Rastreio de Entregas';
      case 'estoque':
        return 'Estoque & Fornadas';
      case 'pagamentos':
        return 'Caixa & Pix';
      case 'prospeccao':
        return 'Prospecção (CRM)';
      default:
        return 'Palhanas Artesanal';
    }
  };

  // Render view component
  const renderCurrentView = () => (
    <>
      {activeTab === 'catalogo' && (
        <CatalogView
          flavors={flavors}
          packagings={packagings}
          settings={settings}
          onAddToCart={handleAddToCart}
          openCart={() => setIsCartOpen(true)}
          onNavigateToTracking={handleNavigateToTracking}
        />
      )}

      {activeTab === 'rastreio' && (
        <TrackingView
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          settings={settings}
          initialTrackingCode={initialTrackingCode}
        />
      )}

      {activeTab === 'estoque' && (
        <StockView
          flavors={flavors}
          batches={batches}
          onUpdateFlavorStock={handleUpdateFlavorStock}
          onAddBatch={handleAddBatch}
        />
      )}

      {activeTab === 'pagamentos' && (
        <PaymentsView
          orders={orders}
          onUpdatePaymentStatus={handleUpdatePaymentStatus}
          settings={settings}
        />
      )}

      {activeTab === 'prospeccao' && (
        <ProspectingView
          leads={leads}
          onAddLead={handleAddLead}
          onUpdateLead={handleUpdateLead}
          settings={settings}
        />
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-[#F5EDE3] text-[#4B2E20] flex flex-col font-sans selection:bg-[#D88A8A] selection:text-white pb-16 lg:pb-0">
      {/* Brand Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={cartTotalItems}
        openCart={() => setIsCartOpen(true)}
        openSettings={() => setIsSettingsOpen(true)}
        openReactNativeCode={() => setIsReactNativeCodeOpen(true)}
        isMobileSimulator={isMobileSimulator}
        setIsMobileSimulator={setIsMobileSimulator}
        pendingOrdersCount={pendingOrdersCount}
        lowStockCount={lowStockCount}
      />

      {/* Floating React Native App Banner Bar */}
      <div className="bg-[#4B2E20] text-white px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs border-b border-[#D79A61]/30">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-[#D79A61] text-[#4B2E20] flex items-center justify-center font-black text-[10px]">
            RN
          </div>
          <span className="font-bold">Formato Aplicativo React Native (Expo)</span>
          <span className="hidden sm:inline text-[#D79A61]">• Mobile-First UI pronto para iOS e Android</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileSimulator(!isMobileSimulator)}
            className="flex items-center gap-1 bg-[#D79A61] hover:bg-[#c78b53] text-[#4B2E20] px-3 py-1 rounded-full text-xs font-bold transition-all shadow-xs"
          >
            {isMobileSimulator ? (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span>Alternar para Tela Cheia</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span>Ver no Simulador Smartphone</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsReactNativeCodeOpen(true)}
            className="flex items-center gap-1 bg-white/15 hover:bg-white/25 text-white px-3 py-1 rounded-full text-xs font-bold transition-all border border-white/20"
          >
            <Code className="w-3.5 h-3.5 text-[#D88A8A]" />
            <span>Código-Fonte Expo</span>
          </button>
        </div>
      </div>

      {/* Main Content Area: Switch between Simulator Frame and Responsive Web */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2 sm:px-6 pt-4 sm:pt-6">
        {isMobileSimulator ? (
          <MobileSimulatorFrame activeTabTitle={getTabTitle()}>
            {renderCurrentView()}
          </MobileSimulatorFrame>
        ) : (
          renderCurrentView()
        )}
      </main>

      {/* Mobile Native Bottom Tab Navigation Bar (Always available on mobile or simulator) */}
      <MobileBottomTabBar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        pendingOrdersCount={pendingOrdersCount}
        lowStockCount={lowStockCount}
      />

      {/* Cart Sidebar */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        settings={settings}
      />

      {/* WhatsApp Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        flavors={flavors}
        settings={settings}
        onOrderCreated={handleOrderCreated}
        onClearCart={handleClearCart}
        onViewTracking={handleNavigateToTracking}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />

      {/* React Native Expo Code Modal */}
      <ReactNativeCodeModal
        isOpen={isReactNativeCodeOpen}
        onClose={() => setIsReactNativeCodeOpen(false)}
      />

      {/* Artisanal Brand Footer */}
      {!isMobileSimulator && (
        <footer className="bg-[#4B2E20] text-[#F5EDE3] border-t-2 border-[#D79A61] mt-auto pt-12 pb-16 lg:pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Column 1: Brand & Slogan */}
              <div className="md:col-span-2 space-y-3 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <PalhanasBadge size={48} />
                  <div className="flex flex-col">
                    <span className="font-serif-brand font-black text-2xl tracking-tight text-white">
                      PALHANAS
                    </span>
                    <span className="text-[10px] tracking-widest uppercase font-bold text-[#D79A61]">
                      Palha Italiana Artesanal • App Mobile
                    </span>
                  </div>
                </div>

                <p className="font-handwriting text-xl text-[#D79A61]">
                  "O difícil é comer só uma."
                </p>

                <p className="text-xs text-[#F5EDE3]/80 max-w-md leading-relaxed">
                  Feita artesanalmente com carinho para adoçar o seu dia. Pequena no tamanho, gigante na vontade. Pedidos rápidos pelo WhatsApp com acompanhamento em tempo real.
                </p>
              </div>

              {/* Column 2: Quick Links */}
              <div className="space-y-2 text-xs">
                <span className="font-bold uppercase tracking-wider text-[#D79A61] block mb-3">
                  Módulos do Aplicativo
                </span>
                <ul className="space-y-2 text-[#F5EDE3]/90">
                  <li>
                    <button
                      onClick={() => {
                        setActiveTab('catalogo');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-white transition-colors"
                    >
                      • Vitrine & Montador de Kits
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setActiveTab('rastreio');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-white transition-colors"
                    >
                      • Acompanhar Entrega do Cliente
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setActiveTab('estoque');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-white transition-colors"
                    >
                      • Controle de Estoque & Fornadas
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setActiveTab('pagamentos');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-white transition-colors"
                    >
                      • Painel Financeiro & Pix
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setActiveTab('prospeccao');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-white transition-colors"
                    >
                      • Prospecção de Cafeterias (CRM)
                    </button>
                  </li>
                </ul>
              </div>

              {/* Column 3: Contact & React Native Export */}
              <div className="space-y-3 text-xs">
                <span className="font-bold uppercase tracking-wider text-[#D79A61] block mb-2">
                  Aplicativo React Native
                </span>

                <div className="space-y-2 text-[#F5EDE3]/80">
                  <p className="text-[11px]">
                    Compatível com <strong>Expo Go</strong>, iOS e Android com navegação por abas nativa.
                  </p>
                  <button
                    onClick={() => setIsReactNativeCodeOpen(true)}
                    className="w-full bg-[#D79A61] hover:bg-[#c78b53] text-[#4B2E20] font-bold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>Ver Código Expo / React Native</span>
                  </button>
                </div>

                {/* Brand Color Chips */}
                <div className="pt-2">
                  <span className="text-[10px] text-[#D79A61] uppercase font-bold block mb-1.5">
                    Paleta Oficial:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-4 h-4 rounded-full bg-[#4B2E20] border border-white/20"
                      title="#4B2E20 - Chocolate Escuro"
                    />
                    <span
                      className="w-4 h-4 rounded-full bg-[#7A4A2E] border border-white/20"
                      title="#7A4A2E - Avelã / Marrom"
                    />
                    <span
                      className="w-4 h-4 rounded-full bg-[#D79A61] border border-white/20"
                      title="#D79A61 - Caramelo"
                    />
                    <span
                      className="w-4 h-4 rounded-full bg-[#F5EDE3] border border-white/20"
                      title="#F5EDE3 - Creme Baunilha"
                    />
                    <span
                      className="w-4 h-4 rounded-full bg-[#D88A8A] border border-white/20"
                      title="#D88A8A - Rosa Doce"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Copyright */}
            <div className="pt-6 border-t border-[#D79A61]/30 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#F5EDE3]/60">
              <span>
                © 2026 Palhanas - Palha Italiana Artesanal (React Native App). Todos os direitos reservados.
              </span>
              <span className="flex items-center gap-1">
                Feito com carinho <Heart className="w-3 h-3 text-[#D88A8A] fill-[#D88A8A]" /> para adoçar o seu dia.
              </span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
