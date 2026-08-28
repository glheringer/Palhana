import React, { useState } from 'react';
import { Flavor, PackagingOption, CartItem, StoreSettings } from '../types';
import { PalhanasLogo, PalhanasBadge, FlavorSticker, PackagingVisual } from './BrandGraphics';
import { MobileStories } from './MobileStories';
import { Plus, Minus, Heart, ShoppingBag, Sparkles, Check, Gift, Info } from 'lucide-react';

interface CatalogViewProps {
  flavors: Flavor[];
  packagings: PackagingOption[];
  settings: StoreSettings;
  onAddToCart: (item: CartItem) => void;
  openCart: () => void;
  onNavigateToTracking: (code?: string) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  flavors,
  packagings,
  settings,
  onAddToCart,
  openCart,
  onNavigateToTracking,
}) => {
  // Customizer state for "Monte seu Kit"
  const [selectedPackagingId, setSelectedPackagingId] = useState<string>('saquinho_kraft_3');
  const [flavorSelections, setFlavorSelections] = useState<Record<string, number>>({
    tradicional: 1,
    ninho: 1,
    oreo: 1,
  });
  const [customGiftNote, setCustomGiftNote] = useState('');
  const [feedbackAdded, setFeedbackAdded] = useState(false);

  const currentPackaging = packagings.find((p) => p.id === selectedPackagingId) || packagings[0];
  const capacity = currentPackaging.capacity;

  const totalSelectedFlavorsCount = (Object.values(flavorSelections) as number[]).reduce(
    (a: number, b: number) => a + b,
    0
  );
  const remainingSlots = capacity - totalSelectedFlavorsCount;

  const handlePackagingChange = (pkg: PackagingOption) => {
    setSelectedPackagingId(pkg.id);
    // Adjust flavor distribution to match new capacity
    const availableFlavors = flavors.filter((f) => f.stock > 0);
    const newSelections: Record<string, number> = {};

    let allocated = 0;
    for (const f of availableFlavors) {
      if (allocated < pkg.capacity) {
        newSelections[f.id] = (newSelections[f.id] || 0) + 1;
        allocated++;
      }
    }
    setFlavorSelections(newSelections);
  };

  const handleIncreaseFlavor = (flavorId: string) => {
    const currentStock = flavors.find((f) => f.id === flavorId)?.stock || 0;
    const currentCount = flavorSelections[flavorId] || 0;

    if (totalSelectedFlavorsCount < capacity && currentCount < currentStock) {
      setFlavorSelections((prev) => ({
        ...prev,
        [flavorId]: (prev[flavorId] || 0) + 1,
      }));
    }
  };

  const handleDecreaseFlavor = (flavorId: string) => {
    if ((flavorSelections[flavorId] || 0) > 0) {
      setFlavorSelections((prev) => ({
        ...prev,
        [flavorId]: Math.max(0, (prev[flavorId] || 0) - 1),
      }));
    }
  };

  const handleAddCustomKitToBag = () => {
    if (totalSelectedFlavorsCount === 0) return;

    const selectedFlavorsList = Object.entries(flavorSelections)
      .filter(([_, count]) => (count as number) > 0)
      .map(([flavorId, quantity]) => ({
        flavorId: flavorId as any,
        quantity: quantity as number,
      }));

    const newItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      packagingId: currentPackaging.id,
      packagingName: currentPackaging.name,
      selectedFlavors: selectedFlavorsList,
      unitPrice: currentPackaging.price,
      quantity: 1,
      giftNote: customGiftNote.trim() ? customGiftNote.trim() : undefined,
    };

    onAddToCart(newItem);
    setFeedbackAdded(true);
    setTimeout(() => setFeedbackAdded(false), 2200);
  };

  const handleQuickAddSingle = (flavor: Flavor) => {
    const unitPkg = packagings.find((p) => p.id === 'unidade') || packagings[0];
    const newItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      packagingId: unitPkg.id,
      packagingName: `${flavor.name} (Avulsa)`,
      selectedFlavors: [{ flavorId: flavor.id, quantity: 1 }],
      unitPrice: flavor.price,
      quantity: 1,
    };
    onAddToCart(newItem);
    setFeedbackAdded(true);
    setTimeout(() => setFeedbackAdded(false), 2200);
  };

  return (
    <div className="space-y-8 sm:space-y-12 pb-16">
      {/* Mobile Highlights / Stories (React Native App Style) */}
      <div className="bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-[#D79A61]/30 shadow-xs">
        <div className="flex items-center justify-between px-1 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A4A2E]">
            Destaques da Cozinha
          </span>
          <span className="text-[9px] text-[#D88A8A] font-bold">Toque para ver</span>
        </div>
        <MobileStories flavors={flavors} onSelectFlavor={() => {}} />
      </div>

      {/* Brand Hero Showcase */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FDF7F0] to-[#F5EDE3] pt-10 pb-12 px-4 sm:px-6 rounded-3xl border border-[#D79A61]/30 shadow-sm text-center">
        {/* Subtle decorative background badges */}
        <div className="absolute -top-6 -left-6 opacity-10 pointer-events-none transform -rotate-12">
          <PalhanasBadge size={140} />
        </div>
        <div className="absolute -bottom-6 -right-6 opacity-10 pointer-events-none transform rotate-12">
          <PalhanasBadge size={140} />
        </div>

        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <PalhanasLogo size="lg" showSubtitle={true} showTagline={true} />

          {/* 3 Seal Badges from the brand sheet */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-2">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-[#D79A61]/40 text-xs font-bold text-[#4B2E20] shadow-xs">
              <span className="text-[#D88A8A] text-sm">♥</span>
              <span>FEITO COM CARINHO</span>
            </div>

            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-[#D79A61]/40 text-xs font-bold text-[#4B2E20] shadow-xs">
              <span className="text-[#D79A61] text-sm">✦</span>
              <span>RECEITA ARTESANAL</span>
            </div>

            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-[#D79A61]/40 text-xs font-bold text-[#4B2E20] shadow-xs">
              <span className="text-[#7A4A2E] text-sm">★</span>
              <span>INGREDIENTES DE QUALIDADE</span>
            </div>
          </div>

          <p className="text-sm md:text-base text-[#7A4A2E] max-w-xl mx-auto leading-relaxed pt-2">
            Palhas italianas gourmet produzidas diariamente com corte perfeito, textura aveludada e biscoito crocante. Monte seu kit ou faça seu pedido rápido para entrega no WhatsApp!
          </p>

          {/* Quick action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <a
              href="#monte-seu-kit"
              className="inline-flex items-center gap-2 bg-[#4B2E20] hover:bg-[#7A4A2E] text-[#F5EDE3] px-6 py-2.5 rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-[#D88A8A]" />
              <span>Montar Meu Kit Favorito</span>
            </a>

            <button
              onClick={openCart}
              className="inline-flex items-center gap-2 bg-white hover:bg-[#FFFDF9] text-[#4B2E20] border-2 border-[#D79A61] px-5 py-2.5 rounded-full font-bold text-sm shadow-xs transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-[#7A4A2E]" />
              <span>Ver Sacola & WhatsApp</span>
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Builder Section: "Monte Seu Kit Palhanas" */}
      <section id="monte-seu-kit" className="max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#7A4A2E]">
            <span>Personalize do seu jeito</span>
            <span className="text-[#D88A8A]">♥</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-brand font-bold text-[#4B2E20]">
            Monte Seu Kit Palhanas
          </h2>
          <p className="text-sm text-[#7A4A2E] max-w-lg mx-auto">
            Escolha a embalagem artesanal (Saquinho Kraft ou Caixa de Acrílico) e combine seus sabores favoritos!
          </p>
        </div>

        {/* Builder Container */}
        <div className="bg-white rounded-3xl border-2 border-[#D79A61]/30 p-6 sm:p-8 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Packaging selector & Preview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4B2E20]">
                1. Escolha a Embalagem:
              </label>

              <div className="grid grid-cols-1 gap-2.5">
                {packagings.map((pkg) => {
                  const isSelected = pkg.id === selectedPackagingId;
                  return (
                    <div
                      key={pkg.id}
                      id={`pkg-select-${pkg.id}`}
                      onClick={() => handlePackagingChange(pkg)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#4B2E20] bg-[#FFF9F2] shadow-sm'
                          : 'border-[#D79A61]/30 hover:border-[#D79A61] bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected
                              ? 'border-[#4B2E20] bg-[#4B2E20] text-white'
                              : 'border-[#D79A61]'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-[#4B2E20]">
                              {pkg.name}
                            </span>
                            {pkg.isBestSeller && (
                              <span className="px-1.5 py-0.2 bg-[#D88A8A] text-white text-[9px] font-bold rounded-full">
                                Mais Pedido
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-[#7A4A2E]">
                            {pkg.subtitle}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-serif-brand font-bold text-base text-[#4B2E20]">
                          R$ {pkg.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Visual Packaging Render */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#7A4A2E] uppercase tracking-wider block">
                Visual da Embalagem Selecionada:
              </span>
              <PackagingVisual type={currentPackaging.imageType} />
              <p className="text-xs text-[#7A4A2E] text-center italic">
                {currentPackaging.description}
              </p>
            </div>
          </div>

          {/* Right Column: Flavor distribution counter */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4B2E20]">
                  2. Escolha os Sabores ({totalSelectedFlavorsCount}/{capacity} selecionados):
                </label>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    remainingSlots === 0
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-[#FFF3E6] text-[#7A4A2E] border border-[#D79A61]'
                  }`}
                >
                  {remainingSlots === 0
                    ? '✓ Kit Completo!'
                    : `Faltam ${remainingSlots} palha(s)`}
                </span>
              </div>
              <p className="text-xs text-[#7A4A2E] mt-1">
                Adicione as quantidades de cada sabor para completar a capacidade da embalagem.
              </p>
            </div>

            {/* Flavors interactive rows */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {flavors.map((flavor) => {
                const count = flavorSelections[flavor.id] || 0;
                const isOutOfStock = flavor.stock <= 0;

                return (
                  <div
                    key={flavor.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-colors ${
                      count > 0
                        ? 'border-[#4B2E20] bg-[#FFF9F2]'
                        : 'border-[#D79A61]/30 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Flavor badge mini sticker */}
                      <div
                        style={{ backgroundColor: flavor.badgeColor }}
                        className="w-10 h-10 rounded-full flex flex-col items-center justify-center text-white flex-shrink-0 shadow-xs border border-white/40"
                      >
                        <span className="text-[7px] uppercase font-bold tracking-tighter">
                          {flavor.id.slice(0, 3)}
                        </span>
                        <span className="text-[#D88A8A] text-[9px] leading-none">♥</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#4B2E20]">
                            {flavor.name}
                          </span>
                          {flavor.isPopular && (
                            <span className="text-[10px] bg-[#D79A61]/20 text-[#7A4A2E] px-1.5 py-0.2 rounded font-bold">
                              Favorito
                            </span>
                          )}
                          {flavor.isNew && (
                            <span className="text-[10px] bg-[#D88A8A]/20 text-[#4B2E20] px-1.5 py-0.2 rounded font-bold">
                              Novo
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-[#7A4A2E] line-clamp-1">
                          {flavor.description}
                        </span>
                        <div className="text-[11px] text-[#7A4A2E]/80 mt-0.5">
                          Estoque disponível: <strong className={flavor.stock < 5 ? 'text-amber-600' : 'text-[#4B2E20]'}>{flavor.stock} un</strong>
                        </div>
                      </div>
                    </div>

                    {/* Counter Buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        id={`btn-dec-${flavor.id}`}
                        onClick={() => handleDecreaseFlavor(flavor.id)}
                        disabled={count <= 0}
                        className="w-8 h-8 rounded-full border border-[#D79A61] flex items-center justify-center text-[#4B2E20] hover:bg-[#F5EDE3] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <span className="w-6 text-center font-bold text-sm text-[#4B2E20]">
                        {count}
                      </span>

                      <button
                        id={`btn-inc-${flavor.id}`}
                        onClick={() => handleIncreaseFlavor(flavor.id)}
                        disabled={
                          totalSelectedFlavorsCount >= capacity ||
                          count >= flavor.stock ||
                          isOutOfStock
                        }
                        className="w-8 h-8 rounded-full bg-[#4B2E20] text-white flex items-center justify-center hover:bg-[#7A4A2E] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Gift Note Customization */}
            <div className="space-y-1.5 pt-2 border-t border-[#D79A61]/20">
              <label className="flex items-center gap-1.5 text-xs font-bold text-[#4B2E20]">
                <Gift className="w-3.5 h-3.5 text-[#D88A8A]" />
                <span>É para presente? Adicione uma mensagem no cartãozinho (Opcional):</span>
              </label>
              <input
                type="text"
                value={customGiftNote}
                onChange={(e) => setCustomGiftNote(e.target.value)}
                placeholder="Ex: De: Lucas | Para: Amor da minha vida ❤️ Parabéns!"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#D79A61]/40 focus:outline-none focus:border-[#4B2E20] bg-[#FFFDF9]"
              />
            </div>

            {/* Summary & Add to Bag button */}
            <div className="bg-[#F5EDE3] p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#D79A61]/40">
              <div>
                <span className="text-xs text-[#7A4A2E] block">
                  Total do kit com {capacity} palhas:
                </span>
                <span className="font-serif-brand font-black text-2xl text-[#4B2E20]">
                  R$ {currentPackaging.price.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  id="btn-add-kit-to-cart"
                  onClick={handleAddCustomKitToBag}
                  disabled={totalSelectedFlavorsCount === 0}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all shadow-md active:scale-95 ${
                    feedbackAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#4B2E20] hover:bg-[#7A4A2E] text-white disabled:opacity-40 disabled:cursor-not-allowed'
                  }`}
                >
                  {feedbackAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Adicionado à Sacola!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Adicionar à Sacola</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flavors Showcase: Stickers & Individual Quick Add */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-[#7A4A2E]">
            <Heart className="w-3.5 h-3.5 fill-[#D88A8A] text-[#D88A8A]" />
            <span>Nossos Sabores Artesanais</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-brand font-bold text-[#4B2E20]">
            Sabores Feitos com Ingredientes Nobres
          </h2>
          <p className="text-sm text-[#7A4A2E] max-w-lg mx-auto">
            Cada sabor é produzido artesanalmente em pequenos lotes para garantir a crocância do biscoito e a cremosidade do brigadeiro.
          </p>
        </div>

        {/* Flavors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {flavors.map((flavor) => (
            <div
              key={flavor.id}
              className="kraft-card rounded-3xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              {/* Top Accent Line */}
              <div
                style={{ backgroundColor: flavor.badgeColor }}
                className="absolute top-0 left-0 right-0 h-1.5"
              />

              <div className="space-y-4">
                {/* Round Sticker matching Brand Graphic Sheet */}
                <div className="flex justify-center py-2">
                  <div className="transform group-hover:scale-105 transition-transform">
                    <FlavorSticker
                      flavorName={flavor.name.split(' ')[0]}
                      badgeColor={flavor.badgeColor}
                      textColor={flavor.textColor}
                    />
                  </div>
                </div>

                <div className="text-center space-y-1.5">
                  <div className="flex items-center justify-center gap-1.5">
                    <h3 className="font-serif-brand font-bold text-lg text-[#4B2E20]">
                      {flavor.name}
                    </h3>
                  </div>
                  <p className="text-xs text-[#7A4A2E] leading-relaxed line-clamp-3">
                    {flavor.description}
                  </p>
                </div>
              </div>

              {/* Price & Quick Add */}
              <div className="pt-4 mt-4 border-t border-[#D79A61]/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#7A4A2E] block">
                    Unidade 65g
                  </span>
                  <span className="font-serif-brand font-bold text-base text-[#4B2E20]">
                    R$ {flavor.price.toFixed(2)}
                  </span>
                </div>

                <button
                  id={`btn-quick-add-${flavor.id}`}
                  onClick={() => handleQuickAddSingle(flavor)}
                  disabled={flavor.stock <= 0}
                  className="flex items-center gap-1.5 bg-[#FFF9F2] hover:bg-[#4B2E20] text-[#4B2E20] hover:text-white border border-[#D79A61] px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{flavor.stock <= 0 ? 'Esgotado' : 'Pedir 1 un'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* B2B / Lembrancinhas Callout */}
      <section className="bg-[#4B2E20] text-[#F5EDE3] rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-lg border-2 border-[#D79A61]">
        {/* Background decorative typography */}
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <PalhanasBadge size={220} />
        </div>

        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#D88A8A]/20 px-3 py-1 rounded-full text-xs font-bold text-[#D88A8A] border border-[#D88A8A]/40">
            <span>☕ Para Cafeterias, Casamentos & Empresas</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-serif-brand font-bold text-white leading-tight">
            Quer revender a Palhanas ou encomendar lembrancinhas para seu evento?
          </h3>

          <p className="text-sm text-[#F5EDE3]/80 leading-relaxed">
            Oferecemos valores diferenciados para pedidos em lote, cafeterias parceiras com reposição semanal e caixas com personalização de tags para casamentos, maternidade e eventos corporativos.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href={`https://wa.me/${settings.whatsappPhone}?text=${encodeURIComponent(
                'Olá! Gostaria de saber mais sobre encomendas corporativas e condições de revenda para cafeterias da Palhanas! 🍫✨'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#D79A61] hover:bg-[#c48850] text-[#4B2E20] font-black px-6 py-3 rounded-full text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
            >
              <span>Falar com a Palhanas no WhatsApp</span>
              <span className="text-[#4B2E20]">→</span>
            </a>

            <button
              onClick={() => onNavigateToTracking()}
              className="inline-flex items-center gap-2 bg-transparent hover:bg-white/10 text-white border border-[#D79A61]/60 px-5 py-3 rounded-full text-xs font-bold transition-colors"
            >
              <span>Já tem pedido? Acompanhar Entrega</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
