import { Component, For, createSignal } from 'solid-js';
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

interface AquariumDockProps {
  biome: Biome;
  weather: Weather;
  pearls: number;
  pps: number;
  currentBait: number;
  rodCost: number;
  activeFishes: SwimmingFish[];
  onBurnTokens: (amount: number, prompt: string) => void;
  onSimulateStream: (prompt: string) => void;
  onSimulateGlitch: () => void;
  onFishClick?: (fish: SwimmingFish) => void;
}

export const AquariumDock: Component<AquariumDockProps> = (props) => {
  const [isExpanded, setIsExpanded] = createSignal(false);

  const progressPercent = () => Math.min(100, (props.currentBait / props.rodCost) * 100);

  return (
    <div
      class={`border-t border-white/[0.08] transition-all duration-300 relative flex flex-col z-20 ${
        isExpanded() ? 'h-64' : 'h-24'
      } biome-ambient-${props.biome} ${
        props.weather === 'storm' ? 'weather-storm-active' : ''
      }`}
    >
      {/* Top Dock Bar (HUD & Controls) */}
      <div class="h-10 px-6 flex items-center justify-between border-b border-white/[0.05] bg-black/30 backdrop-blur-sm shrink-0">
        {/* Left: Economy Ticker */}
        <div class="flex items-center gap-4 text-xs font-mono">
          <div class="flex items-center gap-1.5 text-cyan-300 font-bold">
            <span class="text-sm">🔮</span>
            <span>{Math.floor(props.pearls).toLocaleString()}</span>
            <span class="text-[10px] text-zinc-400 font-normal">{t('aquarium.pearls')}</span>
          </div>

          <div class="flex items-center gap-1 text-emerald-400 font-bold">
            <span class="text-xs">⚡</span>
            <span>+{props.pps.toFixed(1)}/s</span>
            <span class="text-[10px] text-zinc-400 font-normal">{t('aquarium.pps')}</span>
          </div>

          <div class="flex items-center gap-1 text-zinc-400 text-[11px]">
            <span class="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>{t(`biome.${props.biome}`)}</span>
          </div>
        </div>

        {/* Center: Cast / Bait Progress Bar */}
        <div class="flex items-center gap-3 w-80">
          <div class="flex items-center justify-between text-[11px] font-mono text-zinc-400 w-full mb-1">
            <span class="text-cyan-400 text-[10px] font-semibold">{t('aquarium.baitProgress')}</span>
            <span class="text-[10px] text-zinc-400">
              {props.currentBait} / {props.rodCost}
            </span>
          </div>
          <div class="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden border border-white/[0.05] relative">
            <div
              class="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent()}%` }}
            />
          </div>
        </div>

        {/* Right: Quick actions & Expand Toggle */}
        <div class="flex items-center gap-2">
          {/* Quick Cast */}
          <button
            onClick={() => props.onBurnTokens(100, 'Rust compiler token stream')}
            class="px-2.5 py-1 rounded-md bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white text-[11px] font-medium border border-white/[0.06] transition-colors"
            title="Burn 100 test tokens"
          >
            +100 tk
          </button>

          {/* Glitch test button */}
          <button
            onClick={props.onSimulateGlitch}
            class="p-1 rounded-md bg-purple-950/40 hover:bg-purple-900/60 text-purple-300 border border-purple-800/40 text-[11px] transition-colors"
            title="Simulate glitch storm"
          >
            👾
          </button>

          {/* Expand/Collapse Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded())}
            class="px-2 py-1 rounded-md text-zinc-400 hover:text-white text-[11px] hover:bg-white/[0.06] transition-colors flex items-center gap-1 font-mono"
          >
            <span>{isExpanded() ? '▼' : '▲'}</span>
            <span>{isExpanded() ? t('aquarium.collapse') : t('aquarium.expand')}</span>
          </button>
        </div>
      </div>

      {/* Aquarium Swimming Viewport */}
      <div class="flex-1 relative overflow-hidden">
        {/* Empty Tank Hint */}
        {props.activeFishes.length === 0 && (
          <div class="absolute inset-0 flex items-center justify-center text-zinc-400 text-xs font-mono">
            {t('tank.empty')}
          </div>
        )}

        {/* Animated Fishes (0% CPU CSS GPU Transforms) */}
        <div class="absolute inset-0 overflow-hidden">
          <For each={props.activeFishes}>
            {(fish) => (
              <div
                class="absolute gpu-layer cursor-pointer transition-transform hover:scale-125"
                style={{
                  top: `${fish.topPercent}%`,
                  left: '-100px',
                  animation: `dock-swim ${fish.swimDuration}s linear infinite`,
                  'animation-delay': `${fish.swimDelay}s`,
                  transform: `scale(${fish.scale})`
                }}
                onClick={() => props.onFishClick?.(fish)}
                title={`${t(fish.def.nameKey)} (+${fish.def.basePPS} PPS)`}
              >
                <div class="relative group flex items-center gap-1">
                  {fish.isShiny && (
                    <span class="text-[10px] text-amber-400 animate-pulse font-bold">★</span>
                  )}
                  <span class="text-2xl filter drop-shadow select-none">
                    {fish.def.rarity === 'mythic' ? '🐉' :
                     fish.def.rarity === 'legendary' ? '🐋' :
                     fish.def.rarity === 'epic' ? '🦈' :
                     fish.def.rarity === 'rare' ? '🦑' : '🐟'}
                  </span>
                  <div class="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 left-1/2 -translate-x-1/2 bg-black/90 border border-white/10 text-white rounded px-1.5 py-0.5 text-[9px] font-mono whitespace-nowrap z-30">
                    {t(fish.def.nameKey)}
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>

      <style>{`
        @keyframes dock-swim {
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
