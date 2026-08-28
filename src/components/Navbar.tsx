import React from 'react';
import { PalhanasBadge } from './BrandGraphics';
import {
  ShoppingBag,
  Truck,
  Package,
  DollarSign,
  Users,
  Settings,
  Sparkles,
  Smartphone,
  Monitor,
  Code
} from 'lucide-react';

export type ActiveTab = 'catalogo' | 'rastreio' | 'estoque' | 'pagamentos' | 'prospeccao';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  cartCount: number;
  openCart: () => void;
  openSettings: () => void;
  openReactNativeCode: () => void;
  isMobileSimulator: boolean;
  setIsMobileSimulator: (val: boolean) => void;
  pendingOrdersCount: number;
  lowStockCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  openCart,
  openSettings,
  openReactNativeCode,
  isMobileSimulator,
  setIsMobileSimulator,
  pendingOrdersCount,
  lowStockCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#F5EDE3]/95 backdrop-blur-md border-b border-[#D79A61]/30 shadow-xs">
      {/* Top artisanal strip with React Native badge & phone toggle */}
      <div className="bg-[#4B2E20] text-[#F5EDE3] text-xs py-1 px-4 text-center flex items-center justify-between font-medium">
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-[#D88A8A]">♥</span>
          <span>App Palhanas Artesanal • WhatsApp & Estoque</span>
        </div>

        <div className="mx-auto sm:mx-0 flex items-center gap-2">
          <span className="font-handwriting text-base text-[#D79A61]">
            "O difícil é comer só uma."
          </span>
          <span className="text-[#D88A8A]">♥</span>
        </div>

        <div className="flex items-center gap-2">
          {/* React Native Code Button */}
          <button
            onClick={openReactNativeCode}
            className="inline-flex items-center gap-1 bg-[#D79A61] hover:bg-[#c6894e] text-[#4B2E20] px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-tight transition-colors shadow-xs"
            title="Ver arquivos do projeto em React Native / Expo"
          >
            <Smartphone className="w-3 h-3" />
            <span>Código React Native</span>
          </button>

          {/* Toggle Simulator */}
          <button
            onClick={() => setIsMobileSimulator(!isMobileSimulator)}
            className="hidden md:inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 text-[#F5EDE3] px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-colors border border-white/20"
            title="Alternar entre simulador de celular e tela cheia"
          >
            {isMobileSimulator ? (
              <>
                <Monitor className="w-3 h-3 text-[#D79A61]" />
                <span>Modo Tela Cheia</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3 h-3 text-[#D88A8A]" />
                <span>Modo Celular</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand identity lockup */}
        <div
          id="nav-brand"
          onClick={() => setActiveTab('catalogo')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <PalhanasBadge size={44} className="group-hover:scale-105 transition-transform" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-serif-brand font-black text-2xl tracking-tight text-[#4B2E20] group-hover:text-[#7A4A2E] transition-colors">
                PALHANAS
              </span>
              <span className="text-[#D88A8A] text-sm">♥</span>
            </div>
            <span className="text-[10px] tracking-widest font-bold uppercase text-[#7A4A2E] -mt-1">
              Palha Italiana Artesanal
            </span>
          </div>
        </div>

        {/* Tab buttons for desktop & tablet */}
        {!isMobileSimulator && (
          <nav className="hidden lg:flex items-center gap-1 bg-white/70 p-1.5 rounded-full border border-[#D79A61]/30 shadow-xs">
            <button
              id="tab-btn-catalogo"
              onClick={() => setActiveTab('catalogo')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'catalogo'
                  ? 'bg-[#4B2E20] text-[#F5EDE3] shadow-sm'
                  : 'text-[#4B2E20] hover:bg-[#F5EDE3]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Vitrine & Pedidos</span>
            </button>

            <button
              id="tab-btn-rastreio"
              onClick={() => setActiveTab('rastreio')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all relative ${
                activeTab === 'rastreio'
                  ? 'bg-[#4B2E20] text-[#F5EDE3] shadow-sm'
                  : 'text-[#4B2E20] hover:bg-[#F5EDE3]'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Rastreio de Entregas</span>
              {pendingOrdersCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#D88A8A] animate-ping" />
              )}
            </button>

            <button
              id="tab-btn-estoque"
              onClick={() => setActiveTab('estoque')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all relative ${
                activeTab === 'estoque'
                  ? 'bg-[#4B2E20] text-[#F5EDE3] shadow-sm'
                  : 'text-[#4B2E20] hover:bg-[#F5EDE3]'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Estoque & Fornadas</span>
              {lowStockCount > 0 && (
                <span className="px-1.5 py-0.2 bg-[#D88A8A] text-white rounded-full text-[10px] font-bold">
                  {lowStockCount}
                </span>
              )}
            </button>

            <button
              id="tab-btn-pagamentos"
              onClick={() => setActiveTab('pagamentos')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'pagamentos'
                  ? 'bg-[#4B2E20] text-[#F5EDE3] shadow-sm'
                  : 'text-[#4B2E20] hover:bg-[#F5EDE3]'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Gestão de Pagamentos</span>
            </button>

            <button
              id="tab-btn-prospeccao"
              onClick={() => setActiveTab('prospeccao')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'prospeccao'
                  ? 'bg-[#4B2E20] text-[#F5EDE3] shadow-sm'
                  : 'text-[#4B2E20] hover:bg-[#F5EDE3]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Prospecção (CRM)</span>
            </button>
          </nav>
        )}

        {/* Action icons (Cart & Settings) */}
        <div className="flex items-center gap-2.5">
          {/* Cart Button */}
          <button
            id="btn-open-cart"
            onClick={openCart}
            className="relative flex items-center gap-2 bg-[#7A4A2E] hover:bg-[#4B2E20] text-white px-4 py-2 rounded-full text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Sacola</span>
            {cartCount > 0 && (
              <span className="bg-[#D88A8A] text-white font-extrabold text-[11px] px-2 py-0.5 rounded-full border border-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* Settings button */}
          <button
            id="btn-open-settings"
            onClick={openSettings}
            title="Configurações da Palhanas (Chave Pix, WhatsApp, etc.)"
            className="p-2 rounded-full bg-white/80 hover:bg-white text-[#4B2E20] border border-[#D79A61]/40 transition-colors shadow-xs"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
