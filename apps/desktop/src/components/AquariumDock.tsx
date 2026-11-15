import { Component, For, createSignal } from 'solid-js';
import { Biome, FishDefinition, InventoryItem, Weather } from '@aquagentic/core-game';
import { t } from '../i18n';
import { FishGlyph } from './FishGlyph';
import {
  IconZap,
  IconCompass,
  IconChevronDown,
  IconChevronUp,
  IconTerminal,
  IconPlus,
  IconFish
} from './icons';

interface SwimmingFish {
  id: string;
  def: FishDefinition;
  inv?: InventoryItem;
  topPercent: number;
  leftPercent: number;
  swimDuration: number;
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
  onOpenBestiary: () => void;
  onFishClick?: (fish: SwimmingFish) => void;
}

export const AquariumDock: Component<AquariumDockProps> = (props) => {
  const [isExpanded, setIsExpanded] = createSignal(false);

  const progressPercent = () => Math.min(100, (props.currentBait / props.rodCost) * 100);

  return (
    <div
      class={`border-t border-white/[0.08] transition-all duration-300 relative flex flex-col z-20 select-none ${
        isExpanded() ? 'h-64' : 'h-28'
      } biome-ambient-${props.biome} ${
        props.weather === 'storm' ? 'weather-storm-active' : ''
      }`}
    >
      {/* Top Dock Bar (Telemetry Strip & Controls) */}
      <div class="h-9 px-4 flex items-center justify-between border-b border-white/[0.05] bg-black/40 backdrop-blur-md shrink-0 font-mono text-xs">
        {/* Left: Telemetry Ticker & Bestiary Shortcut */}
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-1.5 text-cyan-300 font-semibold">
            <span class="text-[10px] text-zinc-500 uppercase">Pearls</span>
            <span class="text-xs">{Math.floor(props.pearls).toLocaleString()}</span>
          </div>

          <div class="flex items-center gap-1 text-emerald-400 font-semibold">
            <IconZap size={10} />
            <span class="text-xs">+{props.pps.toFixed(1)}/s</span>
          </div>

          <div class="flex items-center gap-1.5 text-zinc-400 text-[10.5px]">
            <IconCompass size={11} class="text-zinc-500" />
            <span class="uppercase tracking-wider text-[9.5px] font-semibold">{t(`biome.${props.biome}`)}</span>
          </div>

          {/* Active Tank Fish Count Badge (Clickable to open Bestiary) */}
          <button
            onClick={props.onOpenBestiary}
            class="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 hover:bg-cyan-900/60 transition-colors text-[10.5px]"
            title={t('aquarium.viewBestiary')}
          >
            <IconFish size={12} />
            <span>{props.activeFishes.length} {t('aquarium.activeTank')}</span>
          </button>
        </div>

        {/* Center: Token Cast / Bait Progress Gauge */}
        <div class="flex items-center gap-2.5 w-72">
          <div class="flex items-center justify-between text-[10px] text-zinc-400 w-full">
            <span class="text-cyan-400/90 font-semibold text-[9.5px] uppercase tracking-wider">{t('aquarium.baitProgress')}</span>
            <span>
              {props.currentBait} / {props.rodCost} tk
            </span>
          </div>
          <div class="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden border border-white/[0.04] relative">
            <div
              class="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent()}%` }}
            />
          </div>
        </div>

        {/* Right: Actions & Drawer Toggle */}
        <div class="flex items-center gap-2">
          {/* Open Bestiary Button */}
          <button
            onClick={props.onOpenBestiary}
            class="px-2 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white text-[10px] border border-white/[0.06] transition-colors flex items-center gap-1"
          >
            <IconFish size={11} />
            <span>{t('aquarium.viewBestiary')}</span>
          </button>

          {/* Quick Cast +100 */}
          <button
            onClick={() => props.onBurnTokens(100, 'Rust compiler token stream')}
            class="px-2 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white text-[10px] border border-white/[0.06] transition-colors flex items-center gap-1"
            title="Burn 100 test tokens"
          >
            <IconPlus size={9} />
            <span>100 tk</span>
          </button>

          {/* Glitch Storm Toggle */}
          <button
            onClick={props.onSimulateGlitch}
            class={`px-2 py-0.5 rounded text-[10px] transition-colors border flex items-center gap-1 ${
              props.weather === 'storm'
                ? 'bg-purple-950 text-purple-300 border-purple-600'
                : 'bg-white/[0.03] text-zinc-400 border-white/[0.06] hover:text-zinc-200'
            }`}
            title="Simulate glitch storm"
          >
            <IconTerminal size={10} />
            <span>Glitch</span>
          </button>

          {/* Expand / Minimize Drawer */}
          <button
            onClick={() => setIsExpanded(!isExpanded())}
            class="px-1.5 py-0.5 rounded text-zinc-400 hover:text-white text-[10px] hover:bg-white/[0.05] transition-colors flex items-center gap-1"
          >
            {isExpanded() ? <IconChevronDown size={12} /> : <IconChevronUp size={12} />}
            <span>{isExpanded() ? t('aquarium.collapse') : t('aquarium.expand')}</span>
          </button>
        </div>
      </div>

      {/* Swimming Aquarium Telemetry Viewport (0% CPU CSS GPU Transforms) */}
      <div class="flex-1 relative overflow-hidden">
        {/* Subtle Water Particles */}
        <div class="absolute inset-0 pointer-events-none opacity-20">
          <div class="absolute top-1/3 left-1/4 w-48 h-48 rounded-full bg-cyan-500/20 blur-3xl" />
        </div>

        {/* Empty State */}
        {props.activeFishes.length === 0 && (
          <div class="absolute inset-0 flex items-center justify-center text-zinc-400 text-xs font-mono">
            {t('tank.empty')}
          </div>
        )}

        {/* Swimming Fishes Layer - 100% visible inside the tank */}
        <div class="absolute inset-0 overflow-hidden">
          <For each={props.activeFishes}>
            {(fish) => (
              <div
                class="absolute gpu-layer cursor-pointer transition-transform hover:scale-125"
                style={{
                  top: `${fish.topPercent}%`,
                  left: `${fish.leftPercent}%`,
                  animation: `fish-drift ${fish.swimDuration}s ease-in-out infinite`
                }}
                onClick={() => props.onFishClick?.(fish)}
              >
                <div class="relative group flex items-center gap-1">
                  <FishGlyph
                    rarity={fish.def.rarity}
                    isShiny={fish.isShiny}
                    size={28 * fish.scale}
                  />

                  {/* Tooltip on hover */}
                  <div class="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 bg-[#090b10] border border-white/[0.12] text-zinc-200 rounded px-2 py-0.5 text-[9.5px] font-mono whitespace-nowrap shadow-xl z-30 flex items-center gap-1.5">
                    <span class="font-bold">{t(fish.def.nameKey)}</span>
                    <span class="text-emerald-400">+{fish.def.basePPS} PPS</span>
                    {fish.isShiny && <span class="text-amber-400 font-bold">★ SHINY</span>}
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>

      <style>{`
        @keyframes fish-drift {
          0%, 100% {
            transform: translate3d(0, 0, 0) scaleX(1);
          }
          49% {
            transform: translate3d(80px, -12px, 0) scaleX(1);
          }
          50% {
            transform: translate3d(80px, -12px, 0) scaleX(-1);
          }
          99% {
            transform: translate3d(0, 0, 0) scaleX(-1);
          }
        }
      `}</style>
    </div>
  );
};
