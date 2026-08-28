import React, { useState } from 'react';
import { ProspectLead, LeadStatus, LeadType, StoreSettings } from '../types';
import { PalhanasBadge } from './BrandGraphics';
import { PROSPECT_SCRIPTS, ProspectScript, createWhatsappUrl } from '../utils/whatsapp';
import {
  Users,
  Plus,
  Send,
  Coffee,
  Building2,
  Sparkles,
  Phone,
  Instagram,
  MapPin,
  Calendar,
  MessageSquare,
  ChevronRight,
  TrendingUp,
  FileText,
  CheckCircle,
  Tag
} from 'lucide-react';

interface ProspectingViewProps {
  leads: ProspectLead[];
  onAddLead: (lead: ProspectLead) => void;
  onUpdateLead: (lead: ProspectLead) => void;
  settings: StoreSettings;
}

export const ProspectingView: React.FC<ProspectingViewProps> = ({
  leads,
  onAddLead,
  onUpdateLead,
  settings,
}) => {
  const [selectedLeadId, setSelectedLeadId] = useState<string>(leads[0]?.id || '');
  const [selectedScriptId, setSelectedScriptId] = useState<string>('cafeteria_apresentacao');
  const [typeFilter, setTypeFilter] = useState<string>('todos');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);

  // New Lead Form State
  const [newName, setNewName] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newType, setNewType] = useState<LeadType>('cafeteria');
  const [newPhone, setNewPhone] = useState('');
  const [newInstagram, setNewInstagram] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newVolume, setNewVolume] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const selectedLead = leads.find((l) => l.id === selectedLeadId) || leads[0];
  const selectedScript =
    PROSPECT_SCRIPTS.find((s) => s.id === selectedScriptId) || PROSPECT_SCRIPTS[0];

  const filteredLeads = leads.filter((lead) => {
    if (typeFilter !== 'todos' && lead.type !== typeFilter) return false;
    if (statusFilter !== 'todos' && lead.status !== statusFilter) return false;
    return true;
  });

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    const newLead: ProspectLead = {
      id: `lead-${Date.now()}`,
      name: newName.trim(),
      companyOrPlace: newCompany.trim() || undefined,
      type: newType,
      phone: newPhone.trim(),
      instagram: newInstagram.trim() || undefined,
      address: newAddress.trim() || undefined,
      status: 'novo_lead',
      estimatedVolume: newVolume.trim() || undefined,
      lastContactDate: new Date().toISOString().split('T')[0],
      notes: newNotes.trim() || 'Cadastrado no app',
      totalOrdersCount: 0,
      totalSpent: 0,
    };

    onAddLead(newLead);
    setSelectedLeadId(newLead.id);
    setShowNewLeadModal(false);

    // Reset fields
    setNewName('');
    setNewCompany('');
    setNewPhone('');
    setNewInstagram('');
    setNewAddress('');
    setNewVolume('');
    setNewNotes('');
  };

  const handleSendScript = (lead: ProspectLead, script: ProspectScript) => {
    const text = script.generateText(lead, settings);
    const url = createWhatsappUrl(lead.phone, text);

    // Update last contact date
    const updatedLead: ProspectLead = {
      ...lead,
      lastContactDate: new Date().toISOString().split('T')[0],
      status: lead.status === 'novo_lead' ? 'contatado' : lead.status,
    };
    onUpdateLead(updatedLead);

    window.open(url, '_blank');
  };

  const getStatusLabel = (status: LeadStatus) => {
    switch (status) {
      case 'novo_lead':
        return { label: 'Novo Lead', color: 'bg-stone-100 text-stone-700' };
      case 'contatado':
        return { label: 'Contatado', color: 'bg-blue-100 text-blue-800' };
      case 'amostra_entregue':
        return { label: 'Amostra Entregue', color: 'bg-amber-100 text-amber-800' };
      case 'negociando':
        return { label: 'Negociando', color: 'bg-purple-100 text-purple-800' };
      case 'cliente_ativo':
        return { label: 'Cliente Ativo', color: 'bg-emerald-100 text-emerald-800' };
      case 'recorrente':
        return { label: 'Recorrente / Semanal', color: 'bg-teal-100 text-teal-800' };
      case 'sem_interesse':
        return { label: 'Standby', color: 'bg-stone-100 text-stone-500' };
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="bg-[#4B2E20] text-[#F5EDE3] p-6 sm:p-8 rounded-3xl border-2 border-[#D79A61] shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-[#D88A8A]/20 px-3 py-1 rounded-full text-xs font-bold text-[#D88A8A] border border-[#D88A8A]/40">
            <Users className="w-3.5 h-3.5" />
            <span>CRM & Parcerias Comerciais</span>
          </div>
          <h2 className="font-serif-brand font-bold text-2xl sm:text-3xl text-white">
            Prospecção de Pontos de Venda & Eventos
          </h2>
          <p className="text-xs sm:text-sm text-[#F5EDE3]/80 max-w-md">
            Aborde cafeterias, escritórios e noivas com roteiros de WhatsApp profissionais para expandir suas vendas de palhas italianas.
          </p>
        </div>

        <button
          id="btn-open-lead-modal"
          onClick={() => setShowNewLeadModal(true)}
          className="bg-[#D79A61] hover:bg-[#c6894e] text-[#4B2E20] font-black px-6 py-3 rounded-full text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2 flex-shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Contato/Lead</span>
        </button>
      </div>

      {/* Main Grid: Leads List + Lead Detail & Script Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Leads Funnel List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span className="font-bold text-xs uppercase tracking-wider text-[#4B2E20]">
              Oportunidades ({filteredLeads.length})
            </span>

            {/* Type Filters */}
            <div className="flex items-center gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="text-xs bg-white border border-[#D79A61]/40 rounded-xl px-2.5 py-1 text-[#4B2E20] focus:outline-none"
              >
                <option value="todos">Todos os Tipos</option>
                <option value="cafeteria">☕ Cafeterias</option>
                <option value="escritorio">🏢 Escritórios</option>
                <option value="evento">💍 Eventos/Festas</option>
                <option value="salao_beleza">💇‍♀️ Salões</option>
                <option value="mercadinho">🛒 Mercados</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs bg-white border border-[#D79A61]/40 rounded-xl px-2.5 py-1 text-[#4B2E20] focus:outline-none"
              >
                <option value="todos">Todos os Status</option>
                <option value="novo_lead">Novos Leads</option>
                <option value="amostra_entregue">Amostra Entregue</option>
                <option value="negociando">Negociando</option>
                <option value="cliente_ativo">Clientes Ativos</option>
              </select>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredLeads.map((lead) => {
              const isSelected = lead.id === selectedLeadId;
              const badge = getStatusLabel(lead.status);

              return (
                <div
                  key={lead.id}
                  id={`lead-card-${lead.id}`}
                  onClick={() => setSelectedLeadId(lead.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#4B2E20] bg-white shadow-md'
                      : 'border-[#D79A61]/30 hover:border-[#D79A61] bg-[#FFFDF9]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#4B2E20]">
                          {lead.name}
                        </span>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${badge.color}`}
                        >
                          {badge.label}
                        </span>
                      </div>
                      {lead.companyOrPlace && (
                        <p className="text-xs text-[#7A4A2E] mt-0.5 font-medium">
                          {lead.companyOrPlace}
                        </p>
                      )}
                    </div>

                    <span className="text-[11px] text-stone-400">
                      {lead.type === 'cafeteria' ? '☕' : lead.type === 'escritorio' ? '🏢' : '💍'}
                    </span>
                  </div>

                  <div className="mt-2 text-[11px] text-[#7A4A2E]/80 flex items-center justify-between border-t border-[#D79A61]/20 pt-2">
                    <span className="flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-[#D79A61]" />
                      {lead.phone}
                    </span>
                    <span>
                      Último contato: {new Date(lead.lastContactDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Lead Details & Ready-to-Send WhatsApp Scripts */}
        {selectedLead ? (
          <div className="lg:col-span-7 bg-white rounded-3xl border-2 border-[#D79A61]/30 p-6 sm:p-8 shadow-md space-y-6">
            {/* Top Contact Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D79A61]/20">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif-brand font-bold text-2xl text-[#4B2E20]">
                    {selectedLead.name}
                  </h3>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      getStatusLabel(selectedLead.status).color
                    }`}
                  >
                    {getStatusLabel(selectedLead.status).label}
                  </span>
                </div>
                {selectedLead.companyOrPlace && (
                  <p className="text-xs text-[#7A4A2E] font-medium mt-0.5">
                    {selectedLead.companyOrPlace} • {selectedLead.type.toUpperCase()}
                  </p>
                )}
              </div>

              {/* Status Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#7A4A2E]">Status:</span>
                <select
                  value={selectedLead.status}
                  onChange={(e) =>
                    onUpdateLead({
                      ...selectedLead,
                      status: e.target.value as LeadStatus,
                    })
                  }
                  className="text-xs font-bold bg-[#F5EDE3] border border-[#D79A61] rounded-xl px-3 py-1.5 text-[#4B2E20] focus:outline-none"
                >
                  <option value="novo_lead">1. Novo Lead</option>
                  <option value="contatado">2. Contatado</option>
                  <option value="amostra_entregue">3. Amostra Entregue</option>
                  <option value="negociando">4. Negociando Proposta</option>
                  <option value="cliente_ativo">5. Cliente Ativo</option>
                  <option value="recorrente">6. Cliente Recorrente</option>
                  <option value="sem_interesse">7. Standby</option>
                </select>
              </div>
            </div>

            {/* Quick Details Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-[#FFF9F2] p-4 rounded-2xl border border-[#D79A61]/30">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#7A4A2E] block">
                  WhatsApp:
                </span>
                <span className="font-bold text-[#4B2E20] font-mono">
                  {selectedLead.phone}
                </span>
              </div>

              {selectedLead.instagram && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#7A4A2E] block">
                    Instagram:
                  </span>
                  <span className="font-bold text-[#4B2E20]">
                    {selectedLead.instagram}
                  </span>
                </div>
              )}

              {selectedLead.estimatedVolume && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#7A4A2E] block">
                    Volume Estimado:
                  </span>
                  <span className="font-bold text-emerald-700">
                    {selectedLead.estimatedVolume}
                  </span>
                </div>
              )}

              {selectedLead.address && (
                <div className="col-span-2 sm:col-span-3 pt-1 border-t border-[#D79A61]/20">
                  <span className="text-[10px] uppercase font-bold text-[#7A4A2E] block">
                    Endereço / Localização:
                  </span>
                  <span className="text-[#4B2E20] font-medium">
                    {selectedLead.address}
                  </span>
                </div>
              )}
            </div>

            {/* Script Studio: Ready-to-Send WhatsApp Messages */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#D88A8A]" />
                  <h4 className="font-serif-brand font-bold text-lg text-[#4B2E20]">
                    Central de Scripts de Abordagem WhatsApp
                  </h4>
                </div>
                <span className="text-xs text-[#7A4A2E]">
                  Personalizado para {selectedLead.name.split(' ')[0]}
                </span>
              </div>

              {/* Script selector tabs */}
              <div className="flex flex-wrap gap-2">
                {PROSPECT_SCRIPTS.map((script) => {
                  const isSelected = script.id === selectedScriptId;
                  return (
                    <button
                      key={script.id}
                      onClick={() => setSelectedScriptId(script.id)}
                      className={`text-xs px-3 py-1.5 rounded-full font-bold transition-all border ${
                        isSelected
                          ? 'bg-[#4B2E20] text-white border-[#4B2E20] shadow-xs'
                          : 'bg-[#F5EDE3] text-[#4B2E20] border-[#D79A61]/40 hover:bg-[#FFF9F2]'
                      }`}
                    >
                      {script.title}
                    </button>
                  );
                })}
              </div>

              {/* Preview Box */}
              <div className="bg-[#FFFDF9] rounded-2xl border-2 border-dashed border-[#D79A61] p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-[#7A4A2E]">
                  <span className="font-bold flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{selectedScript.title}</span>
                  </span>
                  <span className="italic text-[11px]">{selectedScript.description}</span>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-stone-200 text-xs text-stone-800 whitespace-pre-line leading-relaxed font-sans shadow-inner">
                  {selectedScript.generateText(selectedLead, settings)}
                </div>

                {/* Send Button */}
                <button
                  id="btn-send-prospect-whatsapp"
                  onClick={() => handleSendScript(selectedLead, selectedScript)}
                  className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold py-3 px-6 rounded-full text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar este Script no WhatsApp de {selectedLead.name.split(' ')[0]}</span>
                </button>
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-2 pt-2 border-t border-[#D79A61]/20">
              <label className="text-xs font-bold text-[#4B2E20]">
                Anotações e Histórico da Negociação:
              </label>
              <textarea
                rows={2}
                value={selectedLead.notes}
                onChange={(e) =>
                  onUpdateLead({
                    ...selectedLead,
                    notes: e.target.value,
                  })
                }
                className="w-full text-xs p-3 rounded-xl border border-[#D79A61]/40 bg-[#FFFDF9] text-[#4B2E20] focus:outline-none focus:border-[#4B2E20]"
                placeholder="Ex: Degustou os 3 sabores e preferiu Tradicional. Quer fechar entrega toda terça-feira."
              />
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 p-12 text-center bg-white rounded-3xl border border-[#D79A61]/30">
            <p className="text-xs text-[#7A4A2E]">Nenhum lead selecionado.</p>
          </div>
        )}
      </div>

      {/* Modal for adding new Lead */}
      {showNewLeadModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#4B2E20]/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#D79A61] max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#D88A8A]" />
                <h3 className="font-serif-brand font-bold text-xl text-[#4B2E20]">
                  Novo Contato / Lead para Prospecção
                </h3>
              </div>
              <button
                onClick={() => setShowNewLeadModal(false)}
                className="text-stone-400 hover:text-[#4B2E20]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#4B2E20]">Nome do Contato *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Fernanda (Gerente)"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D79A61]/40 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#4B2E20]">Empresa / Estabelecimento</label>
                  <input
                    type="text"
                    placeholder="Ex: Café Bela Vista / Coworking"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D79A61]/40 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#4B2E20]">WhatsApp (com DDD) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ex: 11988776655"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D79A61]/40 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#4B2E20]">Tipo / Categoria</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as LeadType)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D79A61]/40 bg-white font-medium"
                  >
                    <option value="cafeteria">☕ Cafeteria / Bistrô</option>
                    <option value="escritorio">🏢 Escritório / Empresa</option>
                    <option value="evento">💍 Noiva / Casamento / Festa</option>
                    <option value="salao_beleza">💇‍♀️ Salão de Beleza / Spa</option>
                    <option value="mercadinho">🛒 Mercadinho Gourmet</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#4B2E20]">Instagram</label>
                  <input
                    type="text"
                    placeholder="Ex: @cafebelavista"
                    value={newInstagram}
                    onChange={(e) => setNewInstagram(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D79A61]/40 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#4B2E20]">Volume Estimado</label>
                  <input
                    type="text"
                    placeholder="Ex: 30 un/semana"
                    value={newVolume}
                    onChange={(e) => setNewVolume(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D79A61]/40 bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#4B2E20]">Endereço / Bairro</label>
                <input
                  type="text"
                  placeholder="Ex: Rua Pamplona, 400 - Jardim Paulista"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D79A61]/40 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#4B2E20]">Observações Iniciais</label>
                <input
                  type="text"
                  placeholder="Ex: Indicação do amigo Paulo. Tem grande fluxo de pessoas no almoço."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D79A61]/40 bg-white"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewLeadModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 font-bold hover:bg-stone-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#4B2E20] hover:bg-[#7A4A2E] text-white px-5 py-2.5 rounded-xl font-bold transition-colors shadow-xs"
                >
                  Salvar Oportunidade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
