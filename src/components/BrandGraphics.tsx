import React from 'react';

// The reduced circular 'P' badge from the brand sheet
export const PalhanasBadge: React.FC<{ size?: number; className?: string }> = ({
  size = 56,
  className = '',
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center rounded-full bg-[#4B2E20] text-[#F5EDE3] shadow-md border-2 border-[#D79A61]/40 select-none flex-shrink-0 ${className}`}
    >
      {/* Dashed outer ring */}
      <div className="absolute inset-1 rounded-full border border-dashed border-[#F5EDE3]/30 pointer-events-none" />
      
      {/* Letter 'P' stylized */}
      <span
        style={{ fontSize: `${size * 0.58}px` }}
        className="font-serif-brand font-black leading-none tracking-tighter text-[#FFFDF9] transform -translate-x-[2%]"
      >
        P
      </span>

      {/* Tiny sweet pink heart at bottom-right of P */}
      <svg
        style={{ width: `${size * 0.28}px`, height: `${size * 0.28}px` }}
        viewBox="0 0 24 24"
        fill="#D88A8A"
        className="absolute bottom-[14%] right-[18%] drop-shadow-sm rotate-12"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </div>
  );
};

// Full brand header typography with heart & chocolate sprinkles
export const PalhanasLogo: React.FC<{
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  showTagline?: boolean;
  lightMode?: boolean;
}> = ({
  size = 'md',
  showSubtitle = true,
  showTagline = false,
  lightMode = false,
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';
  const isXl = size === 'xl';

  const textColor = lightMode ? 'text-[#F5EDE3]' : 'text-[#4B2E20]';
  const subtitleColor = lightMode ? 'text-[#D79A61]' : 'text-[#7A4A2E]';

  return (
    <div className="inline-flex flex-col items-center select-none text-center">
      {/* Heart with sprinkles on top */}
      <div className="flex items-center gap-1.5 mb-0.5">
        <span className="text-[#4B2E20] text-xs opacity-60">✦</span>
        <svg
          className="w-5 h-5 text-[#D88A8A] fill-current animate-pulse"
          viewBox="0 0 24 24"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <span className="text-[#4B2E20] text-xs opacity-60">✦</span>
      </div>

      {/* Main Title */}
      <div className="relative">
        {/* Floating chocolate crumbs */}
        <div className="absolute -top-2 -left-3 flex gap-1 pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4B2E20]" />
          <span className="w-1 h-1 rounded-full bg-[#7A4A2E]" />
        </div>

        <h1
          className={`font-serif-brand font-extrabold tracking-tight ${textColor} ${
            isSm
              ? 'text-2xl'
              : isLg
              ? 'text-4xl md:text-5xl'
              : isXl
              ? 'text-5xl md:text-6xl'
              : 'text-3xl md:text-4xl'
          }`}
          style={{ letterSpacing: '0.02em' }}
        >
          PALHANAS
        </h1>
      </div>

      {/* Subtitle with hearts */}
      {showSubtitle && (
        <div
          className={`flex items-center gap-2 font-bold uppercase tracking-widest ${subtitleColor} ${
            isSm ? 'text-[9px]' : 'text-[11px] md:text-xs'
          }`}
        >
          <span className="text-[#D88A8A]">♥</span>
          <span>PALHA ITALIANA ARTESANAL</span>
          <span className="text-[#D88A8A]">♥</span>
        </div>
      )}

      {/* Slogan */}
      {showTagline && (
        <p className="font-handwriting text-lg md:text-xl text-[#7A4A2E] mt-1 italic">
          O difícil é comer só uma.
        </p>
      )}
    </div>
  );
};

// Sticker seal for flavors like on the brand sheet
export const FlavorSticker: React.FC<{
  flavorName: string;
  badgeColor?: string;
  textColor?: string;
  size?: 'sm' | 'md';
}> = ({ flavorName, badgeColor = '#4B2E20', textColor = '#FFFFFF', size = 'md' }) => {
  const isSm = size === 'sm';

  return (
    <div
      style={{ backgroundColor: badgeColor, color: textColor }}
      className={`relative inline-flex flex-col items-center justify-center rounded-full text-center shadow-md border-2 border-white/20 select-none ${
        isSm ? 'w-16 h-16 p-1' : 'w-20 h-20 p-2'
      }`}
    >
      <div className="absolute inset-0.5 rounded-full border border-dashed border-white/40 pointer-events-none" />
      <span className="text-[7px] tracking-widest uppercase opacity-80 mb-0.5 font-bold">
        Palhanas
      </span>
      <span className={`font-serif-brand font-bold leading-tight ${isSm ? 'text-[9px]' : 'text-[11px]'}`}>
        {flavorName.toUpperCase()}
      </span>
      <span className="text-[#D88A8A] text-[8px] mt-0.5">♥</span>
    </div>
  );
};

// Decorative artisanal packaging visual cards
export const PackagingVisual: React.FC<{
  type: 'bag_kraft' | 'box_acrylic' | 'single_seal' | 'box_tasting' | 'jar_mini';
  className?: string;
}> = ({ type, className = '' }) => {
  if (type === 'bag_kraft') {
    return (
      <div
        className={`relative w-full h-44 rounded-2xl bg-[#E8C8A3] border-2 border-[#D79A61]/50 p-4 flex flex-col items-center justify-between overflow-hidden shadow-sm ${className}`}
      >
        {/* Kraft bag paper top crease */}
        <div className="w-full flex justify-between items-center border-b-2 border-dashed border-[#B88B5D]/40 pb-2">
          <div className="w-4 h-1 rounded bg-[#B88B5D]/30" />
          <span className="text-[10px] font-bold text-[#7A4A2E] tracking-wider uppercase">
            Embalagem Kraft
          </span>
          <div className="w-4 h-1 rounded bg-[#B88B5D]/30" />
        </div>

        {/* Circular Seal Badge on Kraft bag */}
        <div className="relative my-auto flex flex-col items-center">
          <PalhanasBadge size={46} className="shadow-lg transform -rotate-6" />
          {/* Transparent cutout window with chocolate treat inside */}
          <div className="mt-2 w-28 h-12 bg-[#4B2E20] rounded-lg border-2 border-[#D79A61]/60 flex items-center justify-center p-1.5 shadow-inner">
            <div className="w-full h-full bg-[#3B2215] rounded flex items-center justify-around px-2">
              <div className="w-5 h-5 bg-[#4B2E20] border border-[#F5EDE3]/20 rounded rotate-6 flex items-center justify-center text-[8px] text-white/60">
                🍫
              </div>
              <div className="w-5 h-5 bg-[#7A4A2E] border border-[#F5EDE3]/20 rounded -rotate-3 flex items-center justify-center text-[8px] text-white/60">
                🍪
              </div>
              <div className="w-5 h-5 bg-[#D79A61] border border-[#F5EDE3]/20 rounded rotate-12 flex items-center justify-center text-[8px] text-white/60">
                ✨
              </div>
            </div>
          </div>
        </div>

        {/* Bag bottom stamp */}
        <div className="text-center">
          <span className="font-serif-brand font-bold text-xs text-[#4B2E20]">
            PALHANAS
          </span>
          <p className="text-[9px] text-[#7A4A2E] font-handwriting">
            O difícil é comer só uma.
          </p>
        </div>
      </div>
    );
  }

  if (type === 'box_acrylic') {
    return (
      <div
        className={`relative w-full h-44 rounded-2xl bg-[#FCFBF8] border-2 border-[#D79A61]/40 p-3 flex flex-col items-center justify-between shadow-sm overflow-hidden ${className}`}
      >
        {/* Acrylic glossy reflection overlay */}
        <div className="absolute top-0 right-0 w-32 h-44 bg-gradient-to-bl from-white/80 via-transparent to-transparent pointer-events-none" />

        {/* Content treats inside box */}
        <div className="w-full grid grid-cols-3 gap-1.5 my-auto px-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-8 rounded bg-[#4B2E20] border border-[#D79A61]/30 flex items-center justify-center shadow-xs"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#F5EDE3]/20" />
            </div>
          ))}
        </div>

        {/* Decorative Brand Sleeve Wrapper */}
        <div className="w-full bg-[#FFF9F2] border-y-2 border-[#D79A61] py-1.5 px-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-[#D88A8A] text-xs">♥</span>
            <span className="font-serif-brand font-extrabold text-xs text-[#4B2E20] tracking-tight">
              PALHANAS
            </span>
          </div>
          <span className="text-[10px] font-handwriting text-[#7A4A2E]">
            Artesanal
          </span>
        </div>
      </div>
    );
  }

  if (type === 'box_tasting') {
    return (
      <div
        className={`relative w-full h-44 rounded-2xl bg-[#4B2E20] border-2 border-[#D79A61] p-4 flex flex-col items-center justify-between shadow-sm text-white overflow-hidden ${className}`}
      >
        {/* Ribbon decoration */}
        <div className="absolute top-0 left-6 w-5 h-full bg-[#D88A8A]/30 border-x border-[#D88A8A]/50 pointer-events-none" />
        <div className="flex items-center justify-between w-full z-10">
          <span className="text-[9px] uppercase tracking-wider text-[#D79A61] font-bold">
            Caixa Presente Luxo
          </span>
          <span className="text-xs text-[#D88A8A]">♥ 12 unidades</span>
        </div>

        {/* Treats grid */}
        <div className="w-full grid grid-cols-4 gap-1.5 my-auto z-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-6 rounded bg-[#7A4A2E] border border-[#D79A61]/40 flex items-center justify-center text-[9px]"
            >
              {i % 2 === 0 ? '🍫' : '✨'}
            </div>
          ))}
        </div>

        <div className="w-full bg-[#361E14] rounded-lg py-1 px-3 flex items-center justify-between z-10 border border-[#D79A61]/30">
          <span className="font-serif-brand text-xs font-bold text-[#F5EDE3]">
            Degustação Completa
          </span>
          <span className="text-[9px] text-[#D79A61]">Fita & Tag Presente</span>
        </div>
      </div>
    );
  }

  // Single seal or mini jar
  return (
    <div
      className={`relative w-full h-44 rounded-2xl bg-[#FFF9F2] border-2 border-[#D79A61]/40 p-4 flex flex-col items-center justify-center shadow-sm ${className}`}
    >
      <div className="relative">
        <div className="w-20 h-20 rounded-xl bg-[#4B2E20] border-2 border-[#D79A61] flex items-center justify-center shadow-md transform rotate-3">
          <PalhanasBadge size={54} />
        </div>
      </div>
      <span className="font-serif-brand font-bold text-sm text-[#4B2E20] mt-3">
        Palha Individual 65g
      </span>
      <span className="text-xs text-[#7A4A2E] font-handwriting">
        Feito com carinho para adoçar seu dia
      </span>
    </div>
  );
};
