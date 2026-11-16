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
  IconAnchor,
  IconShop
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
  hasAffordableUpgrade?: boolean;
  onOpenAnglerQuest: () => void;
  onOpenChestModal: () => void;
  onOpenShop: () => void;
  onBurnTokens: (amount: number, prompt: string) => void;
  onSimulateStream: (prompt: string) => void;
  onSimulateGlitch: () => void;
  onOpenBestiary: () => void;
}

export const AquariumDock: Component<AquariumDockProps> = (props) => {
  const progressPercent = () => Math.min(100, (props.currentBait / props.rodCost) * 100);

  return (
    <footer
      class={`h-8 px-3 border-t border-white/[0.06] bg-[#0c0e17]/90 backdrop-blur-xl flex items-center justify-between z-20 select-none text-[11px] font-sans transition-colors ${
        props.weather === 'storm' ? 'weather-storm-active' : ''
      }`}
    >
      {/* Left: Economy & Status Ticker */}
      <div class="flex items-center gap-3">
        {/* Status Ready Indicator */}
        <div class="flex items-center gap-1.5 text-zinc-400">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span class="font-mono text-[10.5px]">Ready</span>
        </div>

        <span class="text-white/[0.1] font-thin">|</span>

        {/* Pearls */}
        <div class="flex items-center gap-1 font-mono font-medium text-zinc-200">
          <span class="text-[10px] text-zinc-500 uppercase tracking-wider">💎</span>
          <span>{Math.floor(props.pearls).toLocaleString()}</span>
        </div>

        {/* PPS */}
        <div class="flex items-center gap-1 font-mono text-emerald-400/90 text-[10.5px]">
          <IconZap size={9} />
          <span>+{props.pps.toFixed(1)}/s</span>
        </div>

        <span class="text-white/[0.1] font-thin">|</span>

        {/* Biome */}
        <div class="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer text-[10.5px]">
          <IconCompass size={11} class="text-zinc-500" />
          <span>{t(`biome.${props.biome}`)}</span>
        </div>

        {/* Active Ocean Fish Count */}
        <button
          onClick={props.onOpenBestiary}
          class="flex items-center gap-1 px-1.5 py-0.5 rounded text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] transition-colors text-[10.5px]"
          title={t('aquarium.viewBestiary')}
        >
          <IconFish size={11} class="text-cyan-400/80" />
          <span>{props.activeFishCount} {t('aquarium.activeTank')}</span>
        </button>
      </div>

      {/* Center: Token Cast / Bait Progress Gauge */}
      <div class="flex items-center gap-2.5 w-64 max-w-xs">
        <span class="text-[10px] text-zinc-500 font-mono tracking-tight flex-shrink-0">
          🎣 {props.currentBait}/{props.rodCost} tk
        </span>
        <div class="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden border border-white/[0.03]">
          <div
            class="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent()}%` }}
          />
        </div>
      </div>

      {/* Right: Quick actions & Navigation triggers */}
      <div class="flex items-center gap-1.5">
        {/* Fishing Chest Gacha Trigger (Only highlighted when available) */}
        <Show when={props.availableChests > 0}>
          <button
            onClick={props.onOpenChestModal}
            class="px-2 py-0.5 rounded text-[10.5px] font-medium text-cyan-300 bg-cyan-950/70 hover:bg-cyan-900/70 border border-cyan-700/50 transition-colors flex items-center gap-1 shadow-sm animate-pulse"
            title={t('chest.title')}
          >
            <IconChest size={11} class="text-cyan-300" />
            <span>{props.availableChests} {t('chest.openChest')}</span>
          </button>
        </Show>

        {/* Angler NPC Quest Trigger */}
        <Show when={props.isAnglerQuestReady}>
          <button
            onClick={props.onOpenAnglerQuest}
            class="px-2 py-0.5 rounded text-[10.5px] font-medium text-amber-300 bg-amber-950/70 hover:bg-amber-900/70 border border-amber-700/50 transition-colors flex items-center gap-1 shadow-sm"
            title={t('angler.navButton')}
          >
            <IconAnchor size={11} class="text-amber-300" />
            <span>{t('angler.readyBadge')}</span>
          </button>
        </Show>

        {/* Shop Upgrade Button */}
        <button
          onClick={props.onOpenShop}
          class="px-2 py-0.5 rounded text-[10.5px] text-zinc-300 hover:text-white hover:bg-white/[0.05] transition-colors flex items-center gap-1.5"
          title={t('shop.title')}
        >
          <IconShop size={11} class="text-zinc-400" />
          <span>{t('nav.shop')}</span>
          <Show when={props.hasAffordableUpgrade}>
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </Show>
        </button>

        {/* Open Bestiary */}
        <button
          onClick={props.onOpenBestiary}
          class="px-2 py-0.5 rounded text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05] text-[10.5px] transition-colors flex items-center gap-1"
          title={t('aquarium.viewBestiary')}
        >
          <IconFish size={11} />
          <span>{t('nav.bestiary')}</span>
        </button>

        {/* Quick Cast +100 */}
        <button
          onClick={() => props.onBurnTokens(100, 'Rust compiler token stream')}
          class="px-1.5 py-0.5 rounded text-[10px] font-mono text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] transition-colors"
          title="Burn 100 test tokens"
        >
          +100
        </button>

        {/* Glitch Storm Toggle */}
        <button
          onClick={props.onSimulateGlitch}
          class={`p-1 rounded text-[10px] transition-colors flex items-center ${
            props.weather === 'storm'
              ? 'text-purple-300 bg-purple-950/80 border border-purple-600/60'
              : 'text-zinc-500 hover:text-purple-300 hover:bg-white/[0.04]'
          }`}
          title="Simulate glitch storm"
        >
          <IconTerminal size={11} />
        </button>
      </div>
    </footer>
  );
};
