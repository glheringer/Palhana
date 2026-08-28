import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Order, PaymentStatus, StoreSettings } from '../types';
import { PalhanasBadge } from './BrandGraphics';
import { generatePixReminderMessage, createWhatsappUrl } from '../utils/whatsapp';
import {
  DollarSign,
  CheckCircle2,
  Clock,
  Send,
  Download,
  Search,
  Filter,
  CreditCard,
  QrCode,
  TrendingUp,
  Receipt,
  Check,
  AlertCircle,
  Copy
} from 'lucide-react';

interface PaymentsViewProps {
  orders: Order[];
  onUpdatePaymentStatus: (orderId: string, status: PaymentStatus) => void;
  settings: StoreSettings;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  orders,
  onUpdatePaymentStatus,
  settings,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPayment, setFilterPayment] = useState<string>('todos');
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Financial calculations
  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'cancelado' ? sum + o.total : sum), 0);
  const totalReceived = orders.reduce(
    (sum, o) => (o.paymentStatus === 'pago' && o.status !== 'cancelado' ? sum + o.total : sum),
    0
  );
  const totalPending = orders.reduce(
    (sum, o) => (o.paymentStatus === 'pendente' && o.status !== 'cancelado' ? sum + o.total : sum),
    0
  );
  const validOrdersCount = orders.filter((o) => o.status !== 'cancelado').length;
  const avgTicket = validOrdersCount > 0 ? totalRevenue / validOrdersCount : 0;
  
  const totalPalhasSold = orders.reduce((acc, o) => {
    if (o.status === 'cancelado') return acc;
    return (
      acc +
      o.items.reduce(
        (iAcc, item) =>
          iAcc + item.flavorsBreakdown.reduce((fAcc, f) => fAcc + f.count, 0),
        0
      )
    );
  }, 0);

  // Filtering
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm);

    if (!matchesSearch) return false;
    if (filterPayment === 'todos') return true;
    return order.paymentStatus === filterPayment;
  });

  const handleConfirmPixPayment = (orderId: string) => {
    onUpdatePaymentStatus(orderId, 'pago');
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#25D366', '#D79A61', '#4B2E20'],
      });
    } catch {
      // Ignore if confetti unavailable
    }
  };

  const handleSendReminderWhatsapp = (order: Order) => {
    const text = generatePixReminderMessage(order, settings);
    const url = createWhatsappUrl(order.customerPhone, text);
    window.open(url, '_blank');
  };

  const handleCopyFinancialReport = () => {
    const reportText = `📊 *RESUMO FINANCEIRO - PALHANAS ARTESANAL* 📊
Data: ${new Date().toLocaleDateString()}
-----------------------------------
💰 Total Faturado: R$ ${totalRevenue.toFixed(2)}
✅ Recebido (Pix/Cartão): R$ ${totalReceived.toFixed(2)}
⏳ Pendente a Receber: R$ ${totalPending.toFixed(2)}
📈 Ticket Médio: R$ ${avgTicket.toFixed(2)}
🍫 Total de Palhas Vendidas: ${totalPalhasSold} unidades
📦 Total de Pedidos: ${validOrdersCount}
-----------------------------------
Palhanas - O difícil é comer só uma. ❤️`;

    navigator.clipboard.writeText(reportText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Data', 'Cliente', 'WhatsApp', 'Forma', 'Status Pagamento', 'Total', 'Status Pedido'];
    const rows = orders.map((o) => [
      o.id,
      new Date(o.createdAt).toLocaleDateString(),
      `"${o.customerName}"`,
      o.customerPhone,
      o.paymentMethod,
      o.paymentStatus,
      o.total.toFixed(2),
      o.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `palhanas_relatorio_financeiro_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="bg-[#4B2E20] text-[#F5EDE3] p-6 sm:p-8 rounded-3xl border-2 border-[#D79A61] shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-[#D88A8A]/20 px-3 py-1 rounded-full text-xs font-bold text-[#D88A8A] border border-[#D88A8A]/40">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Fluxo de Caixa & Recebíveis</span>
          </div>
          <h2 className="font-serif-brand font-bold text-2xl sm:text-3xl text-white">
            Gestão de Pagamentos & Faturamento
          </h2>
          <p className="text-xs sm:text-sm text-[#F5EDE3]/80 max-w-md">
            Acompanhe pagamentos em Pix, concilie comprovantes, envie lembretes amigáveis e visualize seu faturamento real.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleCopyFinancialReport}
            className="bg-white/10 hover:bg-white/20 text-white border border-[#D79A61]/60 px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5"
          >
            {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSummary ? 'Copiado para WhatsApp!' : 'Copiar Resumo'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="bg-[#D79A61] hover:bg-[#c48850] text-[#4B2E20] font-black px-4 py-2.5 rounded-full text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#D79A61]/30 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#7A4A2E]">
            <span>Total Recebido (Pago)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-serif-brand font-black text-2xl sm:text-3xl text-emerald-700">
            R$ {totalReceived.toFixed(2)}
          </p>
          <span className="text-[11px] text-stone-500 block">
            Dinheiro em caixa / Pix
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D79A61]/30 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#7A4A2E]">
            <span>Pendente (A Receber)</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="font-serif-brand font-black text-2xl sm:text-3xl text-amber-700">
            R$ {totalPending.toFixed(2)}
          </p>
          <span className="text-[11px] text-amber-800 font-medium block">
            Aguardando comprovante Pix
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D79A61]/30 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#7A4A2E]">
            <span>Ticket Médio</span>
            <TrendingUp className="w-4 h-4 text-[#4B2E20]" />
          </div>
          <p className="font-serif-brand font-black text-2xl sm:text-3xl text-[#4B2E20]">
            R$ {avgTicket.toFixed(2)}
          </p>
          <span className="text-[11px] text-[#7A4A2E] block">
            Média por pedido
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D79A61]/30 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#7A4A2E]">
            <span>Palhas Vendidas</span>
            <Receipt className="w-4 h-4 text-[#D79A61]" />
          </div>
          <p className="font-serif-brand font-black text-2xl sm:text-3xl text-[#7A4A2E]">
            {totalPalhasSold} <span className="text-sm font-normal">un</span>
          </p>
          <span className="text-[11px] text-stone-500 block">
            Em todos os pedidos
          </span>
        </div>
      </div>

      {/* Filter and Table Container */}
      <div className="bg-white rounded-3xl border-2 border-[#D79A61]/30 p-6 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-serif-brand font-bold text-xl text-[#4B2E20]">
              Histórico de Pagamentos
            </h3>
            <p className="text-xs text-[#7A4A2E]">
              Clique para confirmar recebimentos ou enviar cobrança amigável via WhatsApp.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar cliente ou #ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-9 pr-3.5 py-2 rounded-xl border border-[#D79A61]/40 bg-[#FFFDF9] text-[#4B2E20] focus:outline-none focus:border-[#4B2E20]"
              />
            </div>

            {/* Filter */}
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="text-xs bg-[#FFFDF9] border border-[#D79A61]/40 rounded-xl px-3 py-2 text-[#4B2E20] font-medium focus:outline-none"
            >
              <option value="todos">Todos os Pagamentos</option>
              <option value="pago">✓ Pagos (Confirmados)</option>
              <option value="pendente">⏳ Pendentes (Pix)</option>
              <option value="cartao_entrega">💳 Cartão na Entrega</option>
              <option value="fiado_consignado">📝 Consignado/Fiado</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F5EDE3] text-[#4B2E20] uppercase font-bold">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Pedido</th>
                <th className="py-3 px-4">Cliente / WhatsApp</th>
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-4">Forma</th>
                <th className="py-3 px-4">Valor Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 rounded-r-xl text-right">Ações Rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D79A61]/20">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-500">
                    Nenhum registro de pagamento encontrado com os filtros atuais.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isPaid = order.paymentStatus === 'pago';

                  return (
                    <tr key={order.id} className="hover:bg-[#FFF9F2] transition-colors">
                      <td className="py-3.5 px-4 font-serif-brand font-black text-sm text-[#4B2E20]">
                        #{order.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#4B2E20]">{order.customerName}</div>
                        <span className="text-[11px] text-stone-500">{order.customerPhone}</span>
                      </td>
                      <td className="py-3.5 px-4 text-stone-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 font-medium uppercase text-[#7A4A2E]">
                        <span className="inline-flex items-center gap-1">
                          {order.paymentMethod === 'pix' ? (
                            <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <CreditCard className="w-3.5 h-3.5 text-[#7A4A2E]" />
                          )}
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-serif-brand font-black text-sm text-[#4B2E20]">
                        R$ {order.total.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            isPaid
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isPaid ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {isPaid ? 'Pago' : 'Pendente'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        {!isPaid ? (
                          <>
                            <button
                              id={`btn-confirm-pix-${order.id}`}
                              onClick={() => handleConfirmPixPayment(order.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 shadow-xs"
                              title="Confirmar que o Pix caiu na conta"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Confirmar Pix</span>
                            </button>

                            <button
                              onClick={() => handleSendReminderWhatsapp(order)}
                              className="bg-[#25D366] hover:bg-[#1EBE5D] text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                              title="Mandar lembrete amigável no WhatsApp"
                            >
                              <Send className="w-3 h-3" />
                              <span>Cobrar</span>
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => onUpdatePaymentStatus(order.id, 'pendente')}
                            className="text-stone-400 hover:text-amber-700 text-[11px] underline"
                          >
                            Desfazer
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
