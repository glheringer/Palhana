import React, { useState } from 'react';
import { Flavor } from '../types';
import { Sparkles, Heart, ChefHat, Award, Star, X, Coffee } from 'lucide-react';

interface MobileStoriesProps {
  flavors: Flavor[];
  onSelectFlavor: (flavorId: string) => void;
}

interface StoryItem {
  id: string;
  title: string;
  tag: string;
  icon: string;
  badgeBg: string;
  storyImageText: string;
  description: string;
}

export const MobileStories: React.FC<MobileStoriesProps> = ({ flavors, onSelectFlavor }) => {
  const [activeStory, setActiveStory] = useState<StoryItem | null>(null);

  const stories: StoryItem[] = [
    {
      id: 'fornada_dia',
      title: 'Fornada',
      tag: 'Fresquinha',
      icon: '🔥',
      badgeBg: 'from-[#D79A61] to-[#4B2E20]',
      storyImageText: 'Fornada Especial do Dia!',
      description: 'Palhas acabadas de cortar e enrolar com brigadeiro aveludado e biscoito crocante.',
    },
    {
      id: 'ninho_nutella',
      title: 'Ninho/Nutella',
      tag: 'Mais Pedido',
      icon: '🍫',
      badgeBg: 'from-[#D88A8A] to-[#7A4A2E]',
      storyImageText: 'O Queridinho da Galera!',
      description: 'Massa cremosa de Ninho com recheio caprichado de Nutella pura.',
    },
    {
      id: 'degustacao',
      title: 'Kits Presente',
      tag: 'Caixas',
      icon: '🎁',
      badgeBg: 'from-[#7A4A2E] to-[#4B2E20]',
      storyImageText: 'Caixas com Laço & Cartãozinho',
      description: 'Ideal para surpreender amigos, aniversários ou lembrancinhas corporativas.',
    },
    {
      id: 'pistache',
      title: 'Pistache',
      tag: 'Gourmet',
      icon: '✨',
      badgeBg: 'from-[#728C52] to-[#4B2E20]',
      storyImageText: 'Pistache Italiano Selecionado',
      description: 'Pasta pura de pistache com pedacinhos tostados e finalização artesanal.',
    },
    {
      id: 'receita',
      title: 'Artesanal',
      tag: '100% Caseiro',
      icon: '❤️',
      badgeBg: 'from-[#D88A8A] to-[#D79A61]',
      storyImageText: 'Receita de Família com Amor',
      description: '"O difícil é comer só uma." Pequena no tamanho, gigante na vontade!',
    },
  ];

  return (
    <div className="pt-2 pb-1">
      {/* Stories Scroll Container */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1 px-1">
        {stories.map((story) => (
          <button
            key={story.id}
            onClick={() => setActiveStory(story)}
            className="flex flex-col items-center gap-1 flex-shrink-0 group focus:outline-none"
          >
            {/* Gradient Ring */}
            <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-[#D79A61] via-[#D88A8A] to-[#4B2E20] group-hover:scale-105 transition-transform shadow-xs">
              <div className="w-full h-full rounded-full bg-white p-[2px] flex items-center justify-center">
                <div
                  className={`w-full h-full rounded-full bg-gradient-to-b ${story.badgeBg} flex items-center justify-center text-white text-lg shadow-inner`}
                >
                  <span>{story.icon}</span>
                </div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#4B2E20] max-w-[60px] truncate tracking-tight text-center">
              {story.title}
            </span>
          </button>
        ))}
      </div>

      {/* Story Fullscreen Preview Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-[#4B2E20]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#D79A61] max-w-sm w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setActiveStory(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#4B2E20]/10 hover:bg-[#4B2E20]/20 text-[#4B2E20]"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Story Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#4B2E20] text-white flex items-center justify-center text-xl shadow-xs">
                {activeStory.icon}
              </div>
              <div>
                <h4 className="font-serif-brand font-bold text-base text-[#4B2E20]">
                  {activeStory.title}
                </h4>
                <span className="text-[10px] uppercase font-bold text-[#D79A61]">
                  Destaque Palhanas • {activeStory.tag}
                </span>
              </div>
            </div>

            {/* Visual Card */}
            <div className="bg-[#4B2E20] text-[#F5EDE3] p-6 rounded-2xl border border-[#D79A61] text-center space-y-3 shadow-inner">
              <span className="text-4xl block animate-bounce">{activeStory.icon}</span>
              <h3 className="font-serif-brand font-bold text-xl text-white">
                {activeStory.storyImageText}
              </h3>
              <p className="text-xs text-[#F5EDE3]/90 leading-relaxed">
                {activeStory.description}
              </p>
              <div className="pt-2 border-t border-[#D79A61]/30">
                <span className="font-handwriting text-sm text-[#D79A61]">
                  "O difícil é comer só uma." ❤️
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveStory(null)}
              className="w-full bg-[#4B2E20] hover:bg-[#7A4A2E] text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-xs"
            >
              Ver no Cardápio
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
