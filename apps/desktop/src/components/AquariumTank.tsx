import { Component, For, createSignal, onMount, onCleanup } from 'solid-js';
import { Biome, FishDefinition, InventoryItem, Weather } from '@aquagentic/core-game';
import { t } from '../i18n';

interface SwimmingFish {
  id: string;
  def: FishDefinition;
  inv?: InventoryItem;
  topPercent: number;
  swimDuration: number;
  swimDelay: number;
  isShiny: boolean;
  scale: number;
}

interface AquariumTankProps {
  biome: Biome;
  weather: Weather;
  activeFishes: SwimmingFish[];
  onFishClick?: (fish: SwimmingFish) => void;
}

export const AquariumTank: Component<AquariumTankProps> = (props) => {
  const [isTabHidden, setIsTabHidden] = createSignal(false);

  // Page Visibility API to halt GPU workload and save 100% CPU in background
  const handleVisibilityChange = () => {
    setIsTabHidden(document.hidden);
  };

  onMount(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
  });

  onCleanup(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  });

  // Get color accents based on rarity
  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'drop-shadow(0 2px 4px rgba(148, 163, 184, 0.4))';
      case 'uncommon': return 'drop-shadow(0 2px 6px rgba(52, 211, 153, 0.5))';
      case 'rare': return 'drop-shadow(0 3px 8px rgba(56, 189, 248, 0.7))';
      case 'epic': return 'drop-shadow(0 4px 12px rgba(192, 132, 252, 0.8))';
      case 'legendary': return 'drop-shadow(0 4px 16px rgba(251, 191, 36, 0.9))';
      case 'mythic': return 'drop-shadow(0 4px 20px rgba(244, 63, 94, 1))';
      default: return 'none';
    }
  };

  return (
    <div
      class={`relative w-full flex-1 overflow-hidden transition-colors duration-700 biome-${props.biome} ${
        props.weather === 'storm' ? 'weather-storm' : ''
      }`}
    >
      {/* Background Water Particles / Ambient Depth */}
      <div class="absolute inset-0 pointer-events-none opacity-20">
        <div class="absolute top-1/4 left-1/5 w-64 h-64 rounded-full bg-cyan-500/30 blur-3xl" />
        <div class="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl" />
      </div>

      {/* Paused Banner when hidden via Page Visibility API */}
      {isTabHidden() && (
        <div class="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/90 text-cyan-400 text-xs px-4 py-2 rounded-full border border-cyan-800/60 shadow-lg z-30">
          💤 {t('tank.paused')}
        </div>
      )}

      {/* Empty State */}
      {props.activeFishes.length === 0 && (
        <div class="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-slate-500 pointer-events-none">
          <div class="text-5xl mb-3 animate-bob">🎣</div>
          <p class="text-sm font-medium max-w-sm">{t('tank.empty')}</p>
        </div>
      )}

      {/* Swimming Fishes Layer (0% CPU CSS GPU Compositing) */}
      <div class="absolute inset-0 overflow-hidden">
        <For each={props.activeFishes}>
          {(fish) => {
            const glowStyle = getRarityGlow(fish.def.rarity);
            return (
              <div
                class="absolute gpu-layer cursor-pointer transition-transform hover:scale-125"
                style={{
                  top: `${fish.topPercent}%`,
                  left: '-120px',
                  animation: `swim-across ${fish.swimDuration}s linear infinite`,
                  'animation-delay': `${fish.swimDelay}s`,
                  filter: glowStyle,
                  transform: `scale(${fish.scale})`
                }}
                onClick={() => props.onFishClick?.(fish)}
              >
                {/* Fish Graphic & Name Tag */}
                <div class="relative group flex flex-col items-center">
                  {/* Tooltip on Hover */}
                  <div class="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-950/95 border border-cyan-700/60 text-white rounded-md px-2 py-0.5 text-[10px] whitespace-nowrap shadow-xl pointer-events-none z-20 flex items-center gap-1 font-mono">
                    <span>{t(fish.def.nameKey)}</span>
                    <span class="text-cyan-400 font-bold">+{fish.def.basePPS} PPS</span>
                    {fish.isShiny && (
                      <span class="bg-amber-400/20 text-amber-300 font-bold px-1 rounded text-[9px]">
                        ★ SHINY
                      </span>
                    )}
                  </div>

                  {/* Fish Visual Avatar */}
                  <div class="relative flex items-center justify-center w-14 h-14">
                    {fish.isShiny && (
                      <div class="absolute inset-0 rounded-full bg-amber-400/30 blur-md animate-sparkle pointer-events-none" />
                    )}
                    <span class="text-4xl filter drop-shadow-md select-none transform transition-transform group-hover:scale-110">
                      {fish.def.rarity === 'mythic' ? '🐉' :
                       fish.def.rarity === 'legendary' ? '🐋' :
                       fish.def.rarity === 'epic' ? '🦈' :
                       fish.def.rarity === 'rare' ? '🦑' : '🐟'}
                    </span>
                  </div>
                </div>
              </div>
            );
          }}
        </For>
      </div>

      <style>{`
        @keyframes swim-across {
          0% {
            transform: translate3d(-100px, 0, 0) scaleX(1);
          }
          49% {
            transform: translate3d(calc(100vw + 100px), 0, 0) scaleX(1);
          }
          50% {
            transform: translate3d(calc(100vw + 100px), 0, 0) scaleX(-1);
          }
          99% {
            transform: translate3d(-100px, 0, 0) scaleX(-1);
          }
          100% {
            transform: translate3d(-100px, 0, 0) scaleX(1);
          }
        }
      `}</style>
    </div>
  );
};
