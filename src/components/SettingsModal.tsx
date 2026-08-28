import React, { useState } from 'react';
import { StoreSettings } from '../types';
import { PalhanasBadge } from './BrandGraphics';
import { resetToDemoData } from '../utils/storage';
import { Settings, Save, RotateCcw, X, Phone, QrCode, MapPin, Truck, Instagram } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StoreSettings;
  onSaveSettings: (settings: StoreSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  if (!isOpen) return null;

  const [form, setForm] = useState<StoreSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(form);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleResetData = () => {
    if (
      confirm(
        'Deseja restaurar todos os dados de demonstração da Palhanas (sabores, estoque, pedidos e leads)?'
      )
    ) {
      resetToDemoData();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#4B2E20]/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#D79A61] max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#F5EDE3] text-[#4B2E20] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <PalhanasBadge size={44} />
          <div>
            <h3 className="font-serif-brand font-bold text-xl text-[#4B2E20]">
              Configurações da Palhanas
            </h3>
            <p className="text-xs text-[#7A4A2E]">
              Configure o número do WhatsApp e a chave Pix para onde os pedidos serão enviados.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* WhatsApp Number */}
          <div className="space-y-1 bg-[#FFF9F2] p-3.5 rounded-2xl border border-[#D79A61]/30">
            <label className="font-bold text-[#4B2E20] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Número de WhatsApp da Proprietária (com DDD) *</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ex: 5511999887766 ou 11999887766"
              value={form.whatsappPhone}
              onChange={(e) => setForm({ ...form, whatsappPhone: e.target.value })}
              className="w-full text-xs px-3.5 py-2 rounded-xl border border-[#D79A61]/40 bg-white font-mono"
            />
            <span className="text-[10px] text-[#7A4A2E] block">
              Todos os pedidos montados pelos clientes serão abertos diretamente neste WhatsApp.
            </span>
          </div>

          {/* Pix Info */}
          <div className="space-y-3 bg-[#FFF9F2] p-3.5 rounded-2xl border border-[#D79A61]/30">
            <label className="font-bold text-[#4B2E20] flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5 text-[#4B2E20]" />
              <span>Dados para Pagamento Pix:</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#7A4A2E]">
                  Tipo de Chave:
                </span>
                <select
                  value={form.pixKeyType}
                  onChange={(e) => setForm({ ...form, pixKeyType: e.target.value as any })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#D79A61]/40 bg-white"
                >
                  <option value="email">E-mail</option>
                  <option value="cpf">CPF / CNPJ</option>
                  <option value="telefone">Celular / Telefone</option>
                  <option value="aleatoria">Chave Aleatória (EVP)</option>
                </select>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#7A4A2E]">Chave Pix:</span>
                <input
                  type="text"
                  required
                  placeholder="Ex: palhana.artesanal@gmail.com"
                  value={form.pixKey}
                  onChange={(e) => setForm({ ...form, pixKey: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#D79A61]/40 bg-white font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#7A4A2E]">
                Nome do Favorecido / Titular:
              </span>
              <input
                type="text"
                placeholder="Ex: Palhanas Doces Artesanais"
                value={form.pixReceiverName}
                onChange={(e) => setForm({ ...form, pixReceiverName: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-xl border border-[#D79A61]/40 bg-white"
              />
            </div>
          </div>

          {/* Delivery & Pickup */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-[#4B2E20] flex items-center gap-1">
                <Truck className="w-3 h-3 text-[#D79A61]" />
                <span>Taxa Padrão de Entrega (R$):</span>
              </label>
              <input
                type="number"
                step="0.50"
                value={form.defaultDeliveryFee}
                onChange={(e) =>
                  setForm({ ...form, defaultDeliveryFee: Number(e.target.value) })
                }
                className="w-full px-3 py-2 rounded-xl border border-[#D79A61]/40 bg-white font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#4B2E20] flex items-center gap-1">
                <Truck className="w-3 h-3 text-emerald-600" />
                <span>Frete Grátis a partir de (R$):</span>
              </label>
              <input
                type="number"
                step="1"
                value={form.freeDeliveryThreshold}
                onChange={(e) =>
                  setForm({ ...form, freeDeliveryThreshold: Number(e.target.value) })
                }
                className="w-full px-3 py-2 rounded-xl border border-[#D79A61]/40 bg-white font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#4B2E20] flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#D88A8A]" />
              <span>Endereço do Ateliê (Para Retiradas):</span>
            </label>
            <input
              type="text"
              value={form.pickupAddress}
              onChange={(e) => setForm({ ...form, pickupAddress: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#D79A61]/40 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#4B2E20] flex items-center gap-1">
              <Instagram className="w-3 h-3 text-[#D88A8A]" />
              <span>Instagram da Marca:</span>
            </label>
            <input
              type="text"
              value={form.instagramHandle}
              onChange={(e) => setForm({ ...form, instagramHandle: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#D79A61]/40 bg-white"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-[#D79A61]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResetData}
              className="text-[11px] text-stone-500 hover:text-red-700 flex items-center gap-1 underline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restaurar dados de demonstração</span>
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto bg-[#4B2E20] hover:bg-[#7A4A2E] text-white px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savedSuccess ? 'Salvo com Sucesso!' : 'Salvar Alterações'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
