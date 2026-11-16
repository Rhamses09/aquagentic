import { Component, Show } from 'solid-js';
import { Biome, Weather } from '@aquagentic/core-game';
import { t } from '../i18n';
import {
  IconZap,
  IconCompass,
  IconTerminal,
  IconPlus,
  IconFish,
  IconChest,
  IconAnchor
} from './icons';

interface AquariumDockProps {
  biome: Biome;
  weather: Weather;
  pearls: number;
  pps: number;
  currentBait: number;
  rodCost: number;
  activeFishCount: number;
  availableChests: number;
  isAnglerQuestReady?: boolean;
  onOpenAnglerQuest: () => void;
  onOpenChestModal: () => void;
  onBurnTokens: (amount: number, prompt: string) => void;
  onSimulateStream: (prompt: string) => void;
  onSimulateGlitch: () => void;
  onOpenBestiary: () => void;
}

export const AquariumDock: Component<AquariumDockProps> = (props) => {
  const progressPercent = () => Math.min(100, (props.currentBait / props.rodCost) * 100);

  return (
    <footer
      class={`h-11 px-5 border-t border-white/[0.08] bg-[#0a0c13]/85 backdrop-blur-xl flex items-center justify-between z-20 select-none font-mono text-xs shadow-2xl transition-colors ${
        props.weather === 'storm' ? 'weather-storm-active' : ''
      }`}
    >
      {/* Left: Economy & Biome Ticker */}
      <div class="flex items-center gap-4">
        {/* Pearls */}
        <div class="flex items-center gap-1.5 text-cyan-300 font-semibold">
          <span class="text-[9.5px] text-zinc-500 uppercase tracking-wider">Pearls</span>
          <span class="text-xs">{Math.floor(props.pearls).toLocaleString()}</span>
        </div>

        {/* PPS */}
        <div class="flex items-center gap-1 text-emerald-400 font-semibold">
          <IconZap size={10} />
          <span class="text-xs">+{props.pps.toFixed(1)}/s</span>
        </div>

        {/* Biome */}
        <div class="flex items-center gap-1.5 text-zinc-400 text-[10.5px]">
          <IconCompass size={11} class="text-zinc-500" />
          <span class="uppercase tracking-wider text-[9.5px] font-semibold">{t(`biome.${props.biome}`)}</span>
        </div>

        {/* Active Ocean Fish Count */}
        <button
          onClick={props.onOpenBestiary}
          class="flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 hover:bg-cyan-900/60 transition-colors text-[10.5px]"
          title={t('aquarium.viewBestiary')}
        >
          <IconFish size={12} />
          <span>{props.activeFishCount} {t('aquarium.activeTank')}</span>
        </button>
      </div>

      {/* Center: Token Cast / Bait Progress Gauge */}
      <div class="flex items-center gap-3 w-80">
        <div class="flex items-center justify-between text-[10px] text-zinc-400 w-full">
          <span class="text-cyan-400/90 font-semibold text-[9.5px] uppercase tracking-wider">
            {t('aquarium.baitProgress')}
          </span>
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

      {/* Right: Quick actions & Bestiary shortcut */}
      <div class="flex items-center gap-2">
        {/* Angler NPC Quest Button */}
        <button
          onClick={props.onOpenAnglerQuest}
          class={`px-2.5 py-1 rounded-md text-[10.5px] font-mono font-medium transition-all flex items-center gap-1.5 border ${
            props.isAnglerQuestReady
              ? 'bg-amber-950/80 hover:bg-amber-900/80 text-amber-300 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.35)] animate-pulse'
              : 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border-white/[0.06]'
          }`}
          title={t('angler.navButton')}
        >
          <IconAnchor size={12} class={props.isAnglerQuestReady ? "text-amber-300" : "text-zinc-400"} />
          <span>{props.isAnglerQuestReady ? t('angler.readyBadge') : t('angler.dockIndicator')}</span>
        </button>

        {/* Fishing Chest Gacha Button */}
        <button
          onClick={props.onOpenChestModal}
          class={`px-2.5 py-1 rounded-md text-[10.5px] font-mono font-medium transition-all flex items-center gap-1.5 border ${
            props.availableChests > 0
              ? 'bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.35)] animate-pulse'
              : 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border-white/[0.06]'
          }`}
          title={t('chest.title')}
        >
          <IconChest size={12} class={props.availableChests > 0 ? "text-cyan-300" : "text-zinc-400"} />
          <span>
            {props.availableChests > 0 ? `${props.availableChests} ${t('chest.openChest')}` : t('chest.openChest')}
          </span>
        </button>

        {/* Open Bestiary */}
        <button
          onClick={props.onOpenBestiary}
          class="px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white text-[10.5px] border border-white/[0.06] transition-colors flex items-center gap-1"
        >
          <IconFish size={11} />
          <span>{t('aquarium.viewBestiary')}</span>
        </button>

        {/* Quick Cast +100 */}
        <button
          onClick={() => props.onBurnTokens(100, 'Rust compiler token stream')}
          class="px-2 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white text-[10.5px] border border-white/[0.06] transition-colors flex items-center gap-1"
          title="Burn 100 test tokens"
        >
          <IconPlus size={9} />
          <span>100 tk</span>
        </button>

        {/* Glitch Storm Toggle */}
        <button
          onClick={props.onSimulateGlitch}
          class={`px-2 py-1 rounded-md text-[10.5px] transition-colors border flex items-center gap-1 ${
            props.weather === 'storm'
              ? 'bg-purple-950 text-purple-300 border-purple-600'
              : 'bg-white/[0.03] text-zinc-400 border-white/[0.06] hover:text-zinc-200'
          }`}
          title="Simulate glitch storm"
        >
          <IconTerminal size={10} />
          <span>Glitch</span>
        </button>
      </div>
    </footer>
  );
};
