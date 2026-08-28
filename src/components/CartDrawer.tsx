import React from 'react';
import { CartItem, StoreSettings } from '../types';
import { PalhanasBadge } from './BrandGraphics';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Gift, Truck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onOpenCheckout: () => void;
  settings: StoreSettings;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onOpenCheckout,
  settings,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const isFreeDeliveryEligible = subtotal >= settings.freeDeliveryThreshold;
  const remainingForFreeDelivery = Math.max(0, settings.freeDeliveryThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#4B2E20]/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFDF9] border-l-2 border-[#D79A61]/40 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 bg-[#F5EDE3] border-b border-[#D79A61]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PalhanasBadge size={38} />
              <div>
                <h3 className="font-serif-brand font-bold text-lg text-[#4B2E20]">
                  Sua Sacola de Doces
                </h3>
                <span className="text-xs text-[#7A4A2E]">
                  {items.length} {items.length === 1 ? 'item' : 'itens'} selecionado(s)
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white text-[#4B2E20] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free delivery bar */}
          <div className="bg-[#FFF9F2] px-4 py-2.5 border-b border-[#D79A61]/20 flex items-center gap-2 text-xs">
            <Truck className="w-4 h-4 text-[#D79A61] flex-shrink-0" />
            {isFreeDeliveryEligible ? (
              <span className="text-emerald-700 font-bold">
                🎉 Parabéns! Você ganhou Entrega Grátis!
              </span>
            ) : (
              <span className="text-[#7A4A2E]">
                Faltam <strong>R$ {remainingForFreeDelivery.toFixed(2)}</strong> para{' '}
                <strong>Frete Grátis</strong> (a partir de R$ {settings.freeDeliveryThreshold.toFixed(2)})
              </span>
            )}
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F5EDE3] flex items-center justify-center text-2xl">
                  🍫
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif-brand font-bold text-base text-[#4B2E20]">
                    Sua sacola está vazia
                  </h4>
                  <p className="text-xs text-[#7A4A2E] max-w-xs">
                    Que tal escolher um saquinho kraft ou uma caixinha com seus sabores preferidos?
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="bg-[#4B2E20] text-[#F5EDE3] px-5 py-2 rounded-full text-xs font-bold shadow-xs hover:bg-[#7A4A2E]"
                >
                  Ver Catálogo de Sabores
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-white border border-[#D79A61]/30 shadow-xs space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-[#4B2E20]">
                        {item.packagingName}
                      </h4>
                      <span className="text-xs font-serif-brand font-bold text-[#7A4A2E]">
                        R$ {item.unitPrice.toFixed(2)} un
                      </span>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                      title="Remover item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Selected Flavors Breakdown */}
                  <div className="bg-[#FFF9F2] p-2 rounded-xl text-xs space-y-1 border border-[#D79A61]/20">
                    <span className="text-[10px] uppercase font-bold text-[#7A4A2E] block">
                      Sabores no kit:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.selectedFlavors.map((sf) => (
                        <span
                          key={sf.flavorId}
                          className="bg-white text-[#4B2E20] border border-[#D79A61]/40 px-2 py-0.5 rounded-md text-[11px] font-medium"
                        >
                          {sf.quantity}x {sf.flavorId}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Gift Note if present */}
                  {item.giftNote && (
                    <div className="flex items-center gap-1.5 text-xs text-[#D88A8A] font-medium italic">
                      <Gift className="w-3 h-3 flex-shrink-0" />
                      <span className="line-clamp-1">"{item.giftNote}"</span>
                    </div>
                  )}

                  {/* Quantity adjustment & Subtotal */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full border border-[#D79A61] flex items-center justify-center text-[#4B2E20] hover:bg-[#F5EDE3]"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-xs w-4 text-center text-[#4B2E20]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full bg-[#4B2E20] text-white flex items-center justify-center hover:bg-[#7A4A2E]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-serif-brand font-bold text-sm text-[#4B2E20]">
                      R$ {(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          {items.length > 0 && (
            <div className="p-5 bg-[#F5EDE3] border-t border-[#D79A61]/30 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#7A4A2E]">
                  <span>Subtotal:</span>
                  <span className="font-bold text-sm text-[#4B2E20]">
                    R$ {subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-[#7A4A2E]">
                  <span>Entrega:</span>
                  <span>{isFreeDeliveryEligible ? 'Grátis' : 'Calculada no próximo passo'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#D79A61]/30 flex justify-between items-center">
                <span className="font-bold text-sm text-[#4B2E20]">Total Previsto:</span>
                <span className="font-serif-brand font-black text-2xl text-[#4B2E20]">
                  R$ {subtotal.toFixed(2)}
                </span>
              </div>

              <button
                id="btn-go-to-checkout"
                onClick={() => {
                  onClose();
                  onOpenCheckout();
                }}
                className="w-full bg-[#4B2E20] hover:bg-[#7A4A2E] text-white font-bold py-3.5 px-6 rounded-full text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                <span>Finalizar Pedido no WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
