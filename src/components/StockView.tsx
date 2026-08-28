import React, { useState } from 'react';
import { Flavor, BatchProductionLog, FlavorId } from '../types';
import { PalhanasBadge, FlavorSticker } from './BrandGraphics';
import {
  Package,
  Plus,
  Minus,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  History,
  Check,
  DollarSign,
  Layers,
  ChefHat
} from 'lucide-react';

interface StockViewProps {
  flavors: Flavor[];
  batches: BatchProductionLog[];
  onUpdateFlavorStock: (flavorId: FlavorId, newStock: number) => void;
  onAddBatch: (batch: BatchProductionLog) => void;
}

export const StockView: React.FC<StockViewProps> = ({
  flavors,
  batches,
  onUpdateFlavorStock,
  onAddBatch,
}) => {
  // Modal for new batch
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchFlavorId, setBatchFlavorId] = useState<FlavorId>('tradicional');
  const [batchQuantity, setBatchQuantity] = useState<number>(20);
  const [batchCost, setBatchCost] = useState<number>(44.0);
  const [batchNotes, setBatchNotes] = useState('');

  // Overview metrics
  const totalInStock = flavors.reduce((sum, f) => sum + f.stock, 0);
  const totalReserved = flavors.reduce((sum, f) => sum + f.reserved, 0);
  const lowStockFlavors = flavors.filter((f) => f.stock <= f.minStockAlert);
  const avgProfitMargin =
    flavors.reduce((acc, f) => acc + ((f.price - f.cost) / f.price) * 100, 0) / (flavors.length || 1);

  const handleRegisterBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const flavor = flavors.find((f) => f.id === batchFlavorId);
    if (!flavor) return;

    const newBatch: BatchProductionLog = {
      id: `batch-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      flavorId: batchFlavorId,
      quantityProduced: Number(batchQuantity),
      batchCostTotal: Number(batchCost),
      notes: batchNotes.trim() || undefined,
    };

    onAddBatch(newBatch);
    onUpdateFlavorStock(batchFlavorId, flavor.stock + Number(batchQuantity));

    setShowBatchModal(false);
    setBatchNotes('');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="bg-[#4B2E20] text-[#F5EDE3] p-6 sm:p-8 rounded-3xl border-2 border-[#D79A61] shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-[#D88A8A]/20 px-3 py-1 rounded-full text-xs font-bold text-[#D88A8A] border border-[#D88A8A]/40">
            <ChefHat className="w-3.5 h-3.5" />
            <span>Controle de Cozinha & Fornadas</span>
          </div>
          <h2 className="font-serif-brand font-bold text-2xl sm:text-3xl text-white">
            Estoque & Produção Artesanal
          </h2>
          <p className="text-xs sm:text-sm text-[#F5EDE3]/80 max-w-md">
            Gerencie o estoque em tempo real por sabor, registre novas fornadas e acompanhe a margem de lucro por unidade.
          </p>
        </div>

        <button
          id="btn-open-batch-modal"
          onClick={() => setShowBatchModal(true)}
          className="bg-[#D79A61] hover:bg-[#c6894e] text-[#4B2E20] font-black px-6 py-3 rounded-full text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2 flex-shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Nova Fornada</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#D79A61]/30 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#7A4A2E]">
            <span>Total em Estoque</span>
            <Package className="w-4 h-4 text-[#4B2E20]" />
          </div>
          <p className="font-serif-brand font-black text-2xl sm:text-3xl text-[#4B2E20]">
            {totalInStock} <span className="text-sm font-normal">un</span>
          </p>
          <span className="text-[11px] text-emerald-700 font-medium block">
            Prontas para entrega
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D79A61]/30 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#7A4A2E]">
            <span>Reservadas (Pedidos)</span>
            <Layers className="w-4 h-4 text-[#D79A61]" />
          </div>
          <p className="font-serif-brand font-black text-2xl sm:text-3xl text-[#7A4A2E]">
            {totalReserved} <span className="text-sm font-normal">un</span>
          </p>
          <span className="text-[11px] text-[#7A4A2E] block">
            Aguardando despacho
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D79A61]/30 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#7A4A2E]">
            <span>Estoque Baixo</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="font-serif-brand font-black text-2xl sm:text-3xl text-amber-700">
            {lowStockFlavors.length} <span className="text-sm font-normal">sabores</span>
          </p>
          <span className="text-[11px] text-amber-800 font-medium block">
            {lowStockFlavors.length > 0 ? 'Fornada recomendada' : 'Estoque equilibrado'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D79A61]/30 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#7A4A2E]">
            <span>Margem Média</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-serif-brand font-black text-2xl sm:text-3xl text-emerald-700">
            {avgProfitMargin.toFixed(0)}%
          </p>
          <span className="text-[11px] text-stone-500 block">
            Lucro bruto sobre venda
          </span>
        </div>
      </div>

      {/* Low Stock Warning Banner if any */}
      {lowStockFlavors.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-xs text-amber-900">
                Alerta de Reposição de Fornada:
              </h4>
              <p className="text-xs text-amber-800">
                Os seguintes sabores estão com estoque abaixo do mínimo de segurança:{' '}
                <strong>{lowStockFlavors.map((f) => `${f.name} (${f.stock} un)`).join(', ')}</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setBatchFlavorId(lowStockFlavors[0].id);
              setShowBatchModal(true);
            }}
            className="bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold px-4 py-2 rounded-xl flex-shrink-0 transition-colors"
          >
            Produzir {lowStockFlavors[0].name.split(' ')[0]}
          </button>
        </div>
      )}

      {/* Flavors Stock Table / Grid */}
      <div className="bg-white rounded-3xl border-2 border-[#D79A61]/30 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif-brand font-bold text-xl text-[#4B2E20]">
              Grade de Sabores & Estoque Disponível
            </h3>
            <p className="text-xs text-[#7A4A2E]">
              Ajuste rapidamente o saldo de palhas disponíveis ou produza novas fornadas.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {flavors.map((flavor) => {
            const margin = (((flavor.price - flavor.cost) / flavor.price) * 100).toFixed(0);
            const isLow = flavor.stock <= flavor.minStockAlert;

            return (
              <div
                key={flavor.id}
                className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                  isLow ? 'border-amber-300 bg-amber-50/40' : 'border-[#D79A61]/30 bg-[#FFFDF9]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Flavor Color Ball */}
                  <div
                    style={{ backgroundColor: flavor.badgeColor }}
                    className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center text-white flex-shrink-0 shadow-xs border border-white/40"
                  >
                    <span className="text-[8px] font-bold uppercase tracking-tighter">
                      {flavor.id.slice(0, 3)}
                    </span>
                    <span className="text-[#D88A8A] text-xs">♥</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#4B2E20]">
                        {flavor.name}
                      </h4>
                      {isLow && (
                        <span className="bg-amber-200 text-amber-900 text-[10px] font-bold px-1.5 py-0.2 rounded-md">
                          Estoque Baixo
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#7A4A2E] mt-0.5">
                      <span>Venda: <strong>R$ {flavor.price.toFixed(2)}</strong></span>
                      <span>Custo: <strong>R$ {flavor.cost.toFixed(2)}</strong></span>
                      <span className="text-emerald-700 font-bold">Margem: {margin}%</span>
                    </div>
                  </div>
                </div>

                {/* Stock Controls */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => onUpdateFlavorStock(flavor.id, Math.max(0, flavor.stock - 1))}
                    className="w-8 h-8 rounded-full border border-[#D79A61] flex items-center justify-center text-[#4B2E20] hover:bg-[#F5EDE3] transition-colors"
                    title="Diminuir 1 unidade"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <div className="text-center w-12">
                    <span className="font-serif-brand font-black text-lg text-[#4B2E20] block leading-none">
                      {flavor.stock}
                    </span>
                    <span className="text-[9px] text-[#7A4A2E] uppercase font-bold">
                      prontas
                    </span>
                  </div>

                  <button
                    onClick={() => onUpdateFlavorStock(flavor.id, flavor.stock + 1)}
                    className="w-8 h-8 rounded-full bg-[#4B2E20] text-white flex items-center justify-center hover:bg-[#7A4A2E] transition-colors"
                    title="Adicionar 1 unidade"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Batch Logs Table */}
      <div className="bg-white rounded-3xl border-2 border-[#D79A61]/30 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#7A4A2E]" />
            <h3 className="font-serif-brand font-bold text-lg text-[#4B2E20]">
              Histórico de Fornadas Recentes
            </h3>
          </div>
          <span className="text-xs text-[#7A4A2E]">
            {batches.length} registros
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F5EDE3] text-[#4B2E20] uppercase font-bold">
              <tr>
                <th className="py-2.5 px-4 rounded-l-xl">Data</th>
                <th className="py-2.5 px-4">Sabor</th>
                <th className="py-2.5 px-4">Qtd Produzida</th>
                <th className="py-2.5 px-4">Custo Total</th>
                <th className="py-2.5 px-4 rounded-r-xl">Anotações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D79A61]/20">
              {batches.map((b) => {
                const flv = flavors.find((f) => f.id === b.flavorId);
                return (
                  <tr key={b.id} className="hover:bg-[#FFF9F2] transition-colors">
                    <td className="py-3 px-4 font-medium text-[#4B2E20]">
                      {new Date(b.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#4B2E20]">
                      {flv?.name || b.flavorId}
                    </td>
                    <td className="py-3 px-4 text-emerald-700 font-bold">
                      +{b.quantityProduced} un
                    </td>
                    <td className="py-3 px-4 text-[#7A4A2E]">
                      R$ {b.batchCostTotal.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-stone-500 italic">
                      {b.notes || 'Fornada padrão'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal to register new batch */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#4B2E20]/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#D79A61] max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-[#D88A8A]" />
                <h3 className="font-serif-brand font-bold text-xl text-[#4B2E20]">
                  Registrar Nova Fornada
                </h3>
              </div>
              <button
                onClick={() => setShowBatchModal(false)}
                className="text-stone-400 hover:text-[#4B2E20]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterBatch} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#4B2E20]">Selecione o Sabor:</label>
                <select
                  value={batchFlavorId}
                  onChange={(e) => {
                    const fid = e.target.value as FlavorId;
                    setBatchFlavorId(fid);
                    const flv = flavors.find((f) => f.id === fid);
                    if (flv) {
                      setBatchCost(flv.cost * batchQuantity);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D79A61]/40 bg-white font-medium text-[#4B2E20] focus:outline-none"
                >
                  {flavors.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} (Atual: {f.stock} un)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#4B2E20]">Quantidade (unidades):</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={batchQuantity}
                    onChange={(e) => {
                      const qty = Number(e.target.value);
                      setBatchQuantity(qty);
                      const flv = flavors.find((f) => f.id === batchFlavorId);
                      if (flv) {
                        setBatchCost(flv.cost * qty);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D79A61]/40 bg-white font-medium text-[#4B2E20]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#4B2E20]">Custo dos Insumos (R$):</label>
                  <input
                    type="number"
                    step="0.10"
                    min="0"
                    required
                    value={batchCost}
                    onChange={(e) => setBatchCost(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D79A61]/40 bg-white font-medium text-[#4B2E20]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#4B2E20]">Observações do Lote (Opcional):</label>
                <input
                  type="text"
                  placeholder="Ex: Cacau 50% extra, ponto de corte mais firme"
                  value={batchNotes}
                  onChange={(e) => setBatchNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D79A61]/40 bg-white text-[#4B2E20]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowBatchModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 font-bold hover:bg-stone-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#4B2E20] hover:bg-[#7A4A2E] text-white px-5 py-2.5 rounded-xl font-bold transition-colors shadow-xs"
                >
                  Adicionar ao Estoque
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
