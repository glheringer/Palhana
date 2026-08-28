import React from 'react';
import { ActiveTab } from './Navbar';
import { ShoppingBag, Truck, Package, DollarSign, Users, Sparkles } from 'lucide-react';

interface MobileBottomTabBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingOrdersCount: number;
  lowStockCount: number;
}

export const MobileBottomTabBar: React.FC<MobileBottomTabBarProps> = ({
  activeTab,
  setActiveTab,
  pendingOrdersCount,
  lowStockCount,
}) => {
  const tabs = [
    {
      id: 'catalogo' as ActiveTab,
      label: 'Vitrine',
      icon: ShoppingBag,
    },
    {
      id: 'rastreio' as ActiveTab,
      label: 'Rastreio',
      icon: Truck,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
    },
    {
      id: 'estoque' as ActiveTab,
      label: 'Estoque',
      icon: Package,
      badge: lowStockCount > 0 ? '!' : undefined,
    },
    {
      id: 'pagamentos' as ActiveTab,
      label: 'Caixa',
      icon: DollarSign,
    },
    {
      id: 'prospeccao' as ActiveTab,
      label: 'Leads',
      icon: Users,
    },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#D79A61]/30 pb-safe shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around py-1.5 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex-1 flex flex-col items-center justify-center py-1 relative group focus:outline-none"
            >
              {/* Active Pill Indicator */}
              <div
                className={`w-10 h-8 rounded-full flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-[#4B2E20] text-white shadow-xs scale-105'
                    : 'text-[#7A4A2E] hover:bg-[#F5EDE3]/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.badge && (
                  <span className="absolute -top-0.5 right-1.5 w-4 h-4 rounded-full bg-[#D88A8A] text-white text-[9px] font-black flex items-center justify-center border border-white">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] tracking-tight mt-0.5 transition-colors ${
                  isActive ? 'font-black text-[#4B2E20]' : 'font-medium text-[#7A4A2E]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
