import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CartItem, Order, StoreSettings, PaymentMethod, DeliveryType, Flavor } from '../types';
import { PalhanasBadge, PalhanasLogo } from './BrandGraphics';
import { generateOrderWhatsappMessage, createWhatsappUrl } from '../utils/whatsapp';
import {
  X,
  Check,
  Copy,
  ExternalLink,
  QrCode,
  MapPin,
  Clock,
  CreditCard,
  Banknote,
  Send,
  Sparkles,
  ShoppingBag,
  Gift
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  flavors: Flavor[];
  settings: StoreSettings;
  onOrderCreated: (newOrder: Order) => void;
  onClearCart: () => void;
  onViewTracking: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  flavors,
  settings,
  onOrderCreated,
  onClearCart,
  onViewTracking,
}) => {
  if (!isOpen) return null;

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('entrega');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerNeighborhood, setCustomerNeighborhood] = useState('');
  const [deliveryTimeWindow, setDeliveryTimeWindow] = useState('Hoje (Horário Comercial)');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [giftTagMessage, setGiftTagMessage] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  // Step state: 'form' | 'success'
  const [isCompleted, setIsCompleted] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [copiedPix, setCopiedPix] = useState(false);

  // Financial calculations
  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const isFreeDelivery = deliveryType === 'retirada' || subtotal >= settings.freeDeliveryThreshold;
  const deliveryFee = isFreeDelivery ? 0 : settings.defaultDeliveryFee;
  const total = subtotal + deliveryFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Por favor, informe seu nome e WhatsApp para contato!');
      return;
    }

    if (deliveryType === 'entrega' && !customerAddress.trim()) {
      alert('Por favor, informe o endereço para entrega!');
      return;
    }

    const orderId = `PLH-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderItemsSummary = items.map((item) => {
      const breakdown = item.selectedFlavors.map((sf) => {
        const flv = flavors.find((f) => f.id === sf.flavorId);
        return {
          flavorId: sf.flavorId,
          flavorName: flv?.name || sf.flavorId,
          count: sf.quantity * item.quantity,
        };
      });

      return {
        packagingId: item.packagingId,
        packagingName: item.packagingName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.unitPrice * item.quantity,
        flavorsBreakdown: breakdown,
        giftNote: item.giftNote,
      };
    });

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerAddress: deliveryType === 'entrega' ? customerAddress.trim() : undefined,
      customerNeighborhood: deliveryType === 'entrega' ? customerNeighborhood.trim() : undefined,
      deliveryType,
      deliveryDate: new Date().toISOString().split('T')[0],
      deliveryTimeWindow,
      deliveryFee,
      discount: 0,
      subtotal,
      total,
      status: 'recebido',
      paymentStatus: 'pendente',
      paymentMethod,
      giftTagMessage: giftTagMessage.trim() ? giftTagMessage.trim() : undefined,
      notes: orderNotes.trim() ? orderNotes.trim() : undefined,
      items: orderItemsSummary,
      trackingCode: orderId,
      source: 'catalogo_whatsapp',
    };

    // Save and pop confetti celebration
    onOrderCreated(newOrder);
    setCreatedOrder(newOrder);
    setIsCompleted(true);
    onClearCart();

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4B2E20', '#D79A61', '#D88A8A', '#F5EDE3'],
      });
    } catch {
      // Ignored if canvas not ready
    }
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(settings.pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const handleOpenWhatsapp = () => {
    if (!createdOrder) return;
    const message = generateOrderWhatsappMessage(createdOrder, settings);
    const url = createWhatsappUrl(settings.whatsappPhone, message);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#4B2E20]/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#D79A61]/40 max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#F5EDE3] text-[#4B2E20] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isCompleted ? (
          /* FORM VIEW */
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <PalhanasBadge size={46} className="mx-auto mb-2" />
              <h3 className="font-serif-brand font-bold text-2xl text-[#4B2E20]">
                Finalizar Pedido Palhanas
              </h3>
              <p className="text-xs text-[#7A4A2E]">
                Preencha seus dados para enviarmos diretamente no WhatsApp e prepararmos suas palhas!
              </p>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-4">
              {/* Customer Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#4B2E20]">Seu Nome Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Amanda Silva"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#D79A61]/40 bg-white focus:outline-none focus:border-[#4B2E20]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#4B2E20]">Seu WhatsApp (com DDD) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ex: 11999887766"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#D79A61]/40 bg-white focus:outline-none focus:border-[#4B2E20]"
                  />
                </div>
              </div>

              {/* Delivery Type Toggle */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-[#4B2E20] block">Forma de Recebimento:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('entrega')}
                    className={`p-3 rounded-2xl border-2 text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      deliveryType === 'entrega'
                        ? 'border-[#4B2E20] bg-[#FFF9F2] text-[#4B2E20]'
                        : 'border-[#D79A61]/30 bg-white text-[#7A4A2E]'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Entrega no Endereço</span>
                    <span className="text-[10px] opacity-75 font-normal">
                      {subtotal >= settings.freeDeliveryThreshold ? 'Frete Grátis' : `Taxa R$ ${settings.defaultDeliveryFee.toFixed(2)}`}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('retirada')}
                    className={`p-3 rounded-2xl border-2 text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      deliveryType === 'retirada'
                        ? 'border-[#4B2E20] bg-[#FFF9F2] text-[#4B2E20]'
                        : 'border-[#D79A61]/30 bg-white text-[#7A4A2E]'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Retirada no Ateliê</span>
                    <span className="text-[10px] text-emerald-700 font-normal">Sem Taxa</span>
                  </button>
                </div>
              </div>

              {/* Address details if Delivery */}
              {deliveryType === 'entrega' ? (
                <div className="space-y-3 p-3.5 rounded-2xl bg-[#F5EDE3]/50 border border-[#D79A61]/30">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#4B2E20]">Endereço Completo *</label>
                    <input
                      type="text"
                      required={deliveryType === 'entrega'}
                      placeholder="Rua, Número, Complemento / Apto"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#D79A61]/40 bg-white focus:outline-none focus:border-[#4B2E20]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#4B2E20]">Bairro</label>
                      <input
                        type="text"
                        placeholder="Ex: Pinheiros / Jardins"
                        value={customerNeighborhood}
                        onChange={(e) => setCustomerNeighborhood(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#D79A61]/40 bg-white focus:outline-none focus:border-[#4B2E20]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#4B2E20]">Horário Preferencial</label>
                      <input
                        type="text"
                        placeholder="Ex: Tarde após 14h"
                        value={deliveryTimeWindow}
                        onChange={(e) => setDeliveryTimeWindow(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#D79A61]/40 bg-white focus:outline-none focus:border-[#4B2E20]"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-[#FFF9F2] border border-[#D79A61]/30 text-xs text-[#7A4A2E] flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#D79A61] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#4B2E20]">Endereço para Retirada:</strong>
                    <p className="mt-0.5">{settings.pickupAddress}</p>
                    <span className="text-[11px] text-amber-800 font-medium block mt-1">
                      * Avisaremos pelo WhatsApp assim que sua embalagem estiver pronta!
                    </span>
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-[#4B2E20] block">Forma de Pagamento:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'pix'
                        ? 'border-[#4B2E20] bg-[#FFF9F2] text-[#4B2E20]'
                        : 'border-[#D79A61]/30 bg-white text-[#7A4A2E]'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    <span>Pix Instantâneo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cartao')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'cartao'
                        ? 'border-[#4B2E20] bg-[#FFF9F2] text-[#4B2E20]'
                        : 'border-[#D79A61]/30 bg-white text-[#7A4A2E]'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-[#7A4A2E]" />
                    <span>Cartão na Entrega</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('dinheiro')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'dinheiro'
                        ? 'border-[#4B2E20] bg-[#FFF9F2] text-[#4B2E20]'
                        : 'border-[#D79A61]/30 bg-white text-[#7A4A2E]'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-amber-700" />
                    <span>Dinheiro</span>
                  </button>
                </div>
              </div>

              {/* Observações / Cartão de Presente */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#4B2E20] flex items-center gap-1">
                  <Gift className="w-3 h-3 text-[#D88A8A]" />
                  <span>Mensagem para Cartãozinho ou Observação (Opcional):</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: Escrever no bilhete 'Com carinho, Lucas ❤️'"
                  value={giftTagMessage}
                  onChange={(e) => setGiftTagMessage(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-[#D79A61]/40 bg-white focus:outline-none focus:border-[#4B2E20]"
                />
              </div>

              {/* Price summary & CTA */}
              <div className="bg-[#F5EDE3] p-4 rounded-2xl space-y-2 border border-[#D79A61]/30">
                <div className="flex justify-between text-xs text-[#7A4A2E]">
                  <span>Subtotal ({items.length} itens):</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-[#7A4A2E]">
                  <span>Taxa de Entrega:</span>
                  <span>{deliveryFee === 0 ? 'Grátis' : `R$ ${deliveryFee.toFixed(2)}`}</span>
                </div>
                <div className="pt-2 border-t border-[#D79A61]/30 flex justify-between items-center">
                  <span className="font-bold text-sm text-[#4B2E20]">Total a Pagar:</span>
                  <span className="font-serif-brand font-black text-2xl text-[#4B2E20]">
                    R$ {total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                id="btn-confirm-order-modal"
                className="w-full bg-[#4B2E20] hover:bg-[#7A4A2E] text-white font-bold py-3.5 px-6 rounded-full text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                <Send className="w-4 h-4 text-[#D88A8A]" />
                <span>Confirmar & Abrir no WhatsApp</span>
              </button>
            </form>
          </div>
        ) : (
          /* SUCCESS CONFIRMATION VIEW */
          <div className="text-center space-y-6 py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto text-2xl shadow-sm">
              ✓
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#7A4A2E]">
                Pedido Registrado com Sucesso!
              </span>
              <h3 className="font-serif-brand font-bold text-2xl text-[#4B2E20]">
                Pedido #{createdOrder?.id}
              </h3>
              <p className="text-xs text-[#7A4A2E] max-w-sm mx-auto">
                Obrigado, <strong>{createdOrder?.customerName}</strong>! Suas palhas italianas estão aguardando confirmação no WhatsApp.
              </p>
            </div>

            {/* Pix Box if Pix method */}
            {createdOrder?.paymentMethod === 'pix' && (
              <div className="bg-[#FFF9F2] p-5 rounded-2xl border-2 border-dashed border-[#D79A61] space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#4B2E20] flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    <span>Pagamento via Pix</span>
                  </span>
                  <span className="font-serif-brand font-bold text-sm text-[#4B2E20]">
                    R$ {createdOrder.total.toFixed(2)}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#D79A61]/30 flex items-center justify-between gap-2">
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-[#7A4A2E] uppercase font-bold block">
                      Chave Pix ({settings.pixKeyType.toUpperCase()}):
                    </span>
                    <p className="font-mono text-xs font-bold text-[#4B2E20] truncate select-all">
                      {settings.pixKey}
                    </p>
                    <span className="text-[10px] text-stone-500 block">
                      Favorecido: {settings.pixReceiverName}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyPix}
                    className="flex-shrink-0 flex items-center gap-1 bg-[#4B2E20] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#7A4A2E] transition-colors"
                  >
                    {copiedPix ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* WhatsApp CTA Action */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                id="btn-open-whatsapp-direct"
                onClick={handleOpenWhatsapp}
                className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold py-3.5 px-6 rounded-full text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Detalhes no WhatsApp da Palhanas</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (createdOrder) {
                    onViewTracking(createdOrder.trackingCode);
                  }
                }}
                className="w-full bg-white hover:bg-[#F5EDE3] text-[#4B2E20] border border-[#D79A61] py-2.5 px-6 rounded-full text-xs font-bold transition-colors"
              >
                <span>Acompanhar Status da Entrega em Tempo Real</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
