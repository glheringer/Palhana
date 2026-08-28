import React, { useState } from 'react';
import { Order, OrderStatus, StoreSettings } from '../types';
import { PalhanasBadge } from './BrandGraphics';
import { generateStatusUpdateWhatsappMessage, createWhatsappUrl } from '../utils/whatsapp';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  Send,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  Gift,
  QrCode,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface TrackingViewProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  settings: StoreSettings;
  initialTrackingCode?: string;
}

export const TrackingView: React.FC<TrackingViewProps> = ({
  orders,
  onUpdateOrderStatus,
  settings,
  initialTrackingCode,
}) => {
  const [searchCode, setSearchCode] = useState(initialTrackingCode || '');
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    initialTrackingCode
      ? orders.find((o) => o.trackingCode.toLowerCase() === initialTrackingCode.toLowerCase())?.id || orders[0]?.id || ''
      : orders[0]?.id || ''
  );
  const [filterStatus, setFilterStatus] = useState<string>('todos');

  // Search logic
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.find(
      (o) =>
        o.trackingCode.toLowerCase().includes(searchCode.trim().toLowerCase()) ||
        o.id.toLowerCase().includes(searchCode.trim().toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchCode.trim().toLowerCase())
    );
    if (found) {
      setSelectedOrderId(found.id);
    } else {
      alert('Nenhum pedido encontrado com esse código ou nome.');
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'todos') return true;
    if (filterStatus === 'em_andamento') return o.status !== 'entregue' && o.status !== 'cancelado';
    return o.status === filterStatus;
  });

  const currentOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const getStatusStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'recebido':
        return 0;
      case 'preparando':
        return 1;
      case 'saiu_entrega':
        return 2;
      case 'entregue':
        return 3;
      case 'cancelado':
        return -1;
      default:
        return 0;
    }
  };

  const currentStep = currentOrder ? getStatusStepIndex(currentOrder.status) : 0;

  const handleSendStatusWhatsapp = (order: Order) => {
    const text = generateStatusUpdateWhatsappMessage(order, settings);
    const url = createWhatsappUrl(order.customerPhone, text);
    window.open(url, '_blank');
  };

  const steps = [
    {
      title: 'Pedido Recebido',
      desc: 'Confirmado no sistema e aguardando preparo artesanal.',
      icon: Clock,
    },
    {
      title: 'Em Preparação & Fornada',
      desc: 'Palhas italianas na fornada e sendo cortadas no ponto certo.',
      icon: Sparkles,
    },
    {
      title:
        currentOrder?.deliveryType === 'retirada'
          ? 'Pronto para Retirada'
          : 'Saiu para Entrega',
      desc:
        currentOrder?.deliveryType === 'retirada'
          ? 'Embalado e disponível no ateliê Palhanas.'
          : 'Entregador em trânsito até o endereço.',
      icon: Truck,
    },
    {
      title: 'Entregue & Saboreado',
      desc: 'Pedido entregue com sucesso! Bom apetite.',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header & Search Bar */}
      <div className="bg-gradient-to-r from-[#4B2E20] via-[#7A4A2E] to-[#4B2E20] text-white p-6 sm:p-8 rounded-3xl border-2 border-[#D79A61] shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-[#D88A8A]/20 px-3 py-1 rounded-full text-xs font-bold text-[#D88A8A] border border-[#D88A8A]/40">
            <Truck className="w-3.5 h-3.5" />
            <span>Rastreamento em Tempo Real</span>
          </div>
          <h2 className="font-serif-brand font-bold text-2xl sm:text-3xl text-white">
            Acompanhamento de Entregas
          </h2>
          <p className="text-xs sm:text-sm text-[#F5EDE3]/80 max-w-md">
            Consulte o status exato da fornada, embalagem e rota de entrega das palhas italianas.
          </p>
        </div>

        {/* Search by Code Input */}
        <form
          onSubmit={handleSearchSubmit}
          className="w-full md:w-auto flex items-center bg-white rounded-full p-1.5 shadow-md border-2 border-[#D79A61]"
        >
          <input
            type="text"
            placeholder="Digite o código (ex: PLH-1042) ou nome..."
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="text-xs text-[#4B2E20] px-4 py-2 bg-transparent focus:outline-none w-full sm:w-64"
          />
          <button
            type="submit"
            className="bg-[#4B2E20] hover:bg-[#7A4A2E] text-white px-4 py-2 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 flex-shrink-0"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Buscar</span>
          </button>
        </form>
      </div>

      {/* Main Grid: Orders selector list & Active Order Timeline Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Quick Order Selector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs uppercase tracking-wider text-[#4B2E20]">
              Lista de Pedidos ({filteredOrders.length})
            </span>

            {/* Filter Pills */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs bg-white border border-[#D79A61]/40 rounded-xl px-2 py-1 text-[#4B2E20] focus:outline-none"
            >
              <option value="todos">Todos os Pedidos</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="preparando">Na Fornada</option>
              <option value="saiu_entrega">Em Entrega</option>
              <option value="entregue">Entregues</option>
            </select>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredOrders.map((order) => {
              const isSelected = order.id === selectedOrderId;
              return (
                <div
                  key={order.id}
                  id={`order-card-${order.id}`}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#4B2E20] bg-white shadow-md'
                      : 'border-[#D79A61]/30 hover:border-[#D79A61] bg-[#FFFDF9]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif-brand font-black text-sm text-[#4B2E20]">
                          #{order.id}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            order.status === 'entregue'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === 'saiu_entrega'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'preparando'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {order.status === 'preparando'
                            ? 'Fornada/Preparo'
                            : order.status === 'saiu_entrega'
                            ? 'A Caminho'
                            : order.status === 'entregue'
                            ? 'Entregue'
                            : 'Recebido'}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-[#7A4A2E] mt-1">
                        {order.customerName}
                      </h4>
                    </div>

                    <span className="font-serif-brand font-bold text-xs text-[#4B2E20]">
                      R$ {order.total.toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-2 text-[11px] text-[#7A4A2E]/80 flex items-center justify-between border-t border-[#D79A61]/20 pt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#D79A61]" />
                      {order.deliveryType === 'entrega'
                        ? order.customerNeighborhood || 'Entrega'
                        : 'Retirada Ateliê'}
                    </span>
                    <span>
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Tracking Card for Selected Order */}
        {currentOrder ? (
          <div className="lg:col-span-8 bg-white rounded-3xl border-2 border-[#D79A61]/30 p-6 sm:p-8 shadow-md space-y-8">
            {/* Top Order Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D79A61]/20">
              <div className="flex items-center gap-3">
                <PalhanasBadge size={48} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif-brand font-black text-2xl text-[#4B2E20]">
                      Pedido #{currentOrder.id}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                        currentOrder.paymentStatus === 'pago'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {currentOrder.paymentStatus === 'pago' ? '✓ Pago' : 'Pix Pendente'}
                    </span>
                  </div>
                  <p className="text-xs text-[#7A4A2E]">
                    Cliente: <strong>{currentOrder.customerName}</strong> ({currentOrder.customerPhone})
                  </p>
                </div>
              </div>

              {/* Status Update Quick Action Dropdown for Seller */}
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-[#7A4A2E] block">
                    Alterar Status:
                  </span>
                  <select
                    id={`select-status-${currentOrder.id}`}
                    value={currentOrder.status}
                    onChange={(e) =>
                      onUpdateOrderStatus(currentOrder.id, e.target.value as OrderStatus)
                    }
                    className="text-xs font-bold bg-[#F5EDE3] border border-[#D79A61] rounded-xl px-3 py-1.5 text-[#4B2E20] focus:outline-none"
                  >
                    <option value="recebido">1. Pedido Recebido</option>
                    <option value="preparando">2. Em Preparo / Fornada</option>
                    <option value="saiu_entrega">3. Saiu p/ Entrega / Pronto</option>
                    <option value="entregue">4. Entregue com Sucesso</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>

                <button
                  id="btn-whatsapp-status"
                  onClick={() => handleSendStatusWhatsapp(currentOrder)}
                  title="Enviar atualização de entrega no WhatsApp do cliente"
                  className="bg-[#25D366] hover:bg-[#1EBE5D] text-white p-2.5 rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1.5 text-xs font-bold mt-3"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Avisar no WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Visual Step-by-Step Delivery Timeline */}
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4B2E20] block">
                Progresso da Entrega:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
                {steps.map((step, idx) => {
                  const isDone = currentStep >= idx;
                  const isCurrent = currentStep === idx;
                  const Icon = step.icon;

                  return (
                    <div
                      key={step.title}
                      className={`p-4 rounded-2xl border-2 transition-all relative ${
                        isCurrent
                          ? 'border-[#4B2E20] bg-[#FFF9F2] shadow-sm'
                          : isDone
                          ? 'border-emerald-500/40 bg-emerald-50/50'
                          : 'border-stone-200 bg-stone-50/50 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            isCurrent
                              ? 'bg-[#4B2E20] text-white'
                              : isDone
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-200 text-stone-600'
                          }`}
                        >
                          {isDone && !isCurrent ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <Icon
                          className={`w-4 h-4 ${
                            isCurrent
                              ? 'text-[#7A4A2E]'
                              : isDone
                              ? 'text-emerald-600'
                              : 'text-stone-400'
                          }`}
                        />
                      </div>

                      <h4 className="font-bold text-xs text-[#4B2E20]">
                        {step.title}
                      </h4>
                      <p className="text-[11px] text-[#7A4A2E] mt-1 leading-snug">
                        {step.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery / Pickup Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F5EDE3]/60 p-4 rounded-2xl border border-[#D79A61]/30">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#7A4A2E] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#D79A61]" />
                  <span>
                    {currentOrder.deliveryType === 'entrega' ? 'Local de Entrega' : 'Local de Retirada'}
                  </span>
                </span>
                <p className="text-xs font-bold text-[#4B2E20]">
                  {currentOrder.deliveryType === 'entrega'
                    ? `${currentOrder.customerAddress} - ${currentOrder.customerNeighborhood || ''}`
                    : settings.pickupAddress}
                </p>
                {currentOrder.deliveryTimeWindow && (
                  <span className="text-[11px] text-[#7A4A2E] block">
                    Horário: {currentOrder.deliveryTimeWindow}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#7A4A2E] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#D79A61]" />
                  <span>Informações do Pedido</span>
                </span>
                <p className="text-xs text-[#4B2E20]">
                  Criado em: <strong>{new Date(currentOrder.createdAt).toLocaleDateString()} às {new Date(currentOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
                </p>
                <p className="text-xs text-[#4B2E20]">
                  Forma de Pagamento: <strong className="uppercase">{currentOrder.paymentMethod}</strong>
                </p>
              </div>
            </div>

            {/* Items in the order */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4B2E20] block">
                Itens e Sabores Selecionados:
              </span>

              <div className="space-y-2.5">
                {currentOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-[#FFFDF9] rounded-2xl border border-[#D79A61]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <h5 className="font-bold text-sm text-[#4B2E20]">
                        {item.quantity}x {item.packagingName}
                      </h5>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {item.flavorsBreakdown.map((f, i) => (
                          <span
                            key={i}
                            className="bg-[#FFF9F2] text-[#4B2E20] border border-[#D79A61]/40 px-2 py-0.5 rounded-md text-xs font-medium"
                          >
                            {f.count}x {f.flavorName}
                          </span>
                        ))}
                      </div>

                      {item.giftNote && (
                        <div className="text-xs text-[#D88A8A] font-medium italic mt-1.5 flex items-center gap-1">
                          <Gift className="w-3 h-3" />
                          <span>"{item.giftNote}"</span>
                        </div>
                      )}
                    </div>

                    <span className="font-serif-brand font-bold text-sm text-[#4B2E20]">
                      R$ {item.total.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total calculation */}
              <div className="bg-[#F5EDE3] p-4 rounded-2xl space-y-1.5 text-xs text-[#7A4A2E] border border-[#D79A61]/30">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>R$ {currentOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de Entrega:</span>
                  <span>R$ {currentOrder.deliveryFee.toFixed(2)}</span>
                </div>
                {currentOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Desconto:</span>
                    <span>-R$ {currentOrder.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-[#D79A61]/30 flex justify-between font-bold text-sm text-[#4B2E20]">
                  <span>Total Geral:</span>
                  <span className="font-serif-brand font-black text-lg">
                    R$ {currentOrder.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center bg-white rounded-3xl border border-[#D79A61]/30">
            <p className="text-xs text-[#7A4A2E]">Nenhum pedido selecionado.</p>
          </div>
        )}
      </div>
    </div>
  );
};
