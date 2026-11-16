import { Component, createSignal, Show, onMount, onCleanup, createMemo } from 'solid-js';
import { GachaRollResult, Rarity } from '@aquagentic/core-game';
import { PixelFish } from './PixelFish';
import { IconSparkles, IconChest } from './icons';
import { t } from '../i18n';

interface ChestOpeningModalProps {
  availableChests: number;
  onOpenOneChest: () => GachaRollResult | null;
  onClose: () => void;
}

export const ChestOpeningModal: Component<ChestOpeningModalProps> = (props) => {
  // 'idle' (chest waiting) | 'unlocking' (rumble + light rays) | 'revealed' (fish card displayed)
  const [stage, setStage] = createSignal<'idle' | 'unlocking' | 'revealed'>('idle');
  const [currentResult, setCurrentResult] = createSignal<GachaRollResult | null>(null);
  const [isSkipped, setIsSkipped] = createSignal(false);

  // Rarity color mappings
  const rarityColors: Record<Rarity, { text: string; bg: string; border: string; glow: string; beam: string }> = {
    common: {
      text: 'text-slate-300',
      bg: 'bg-slate-800/80',
      border: 'border-slate-500/40',
      glow: 'rgba(148, 163, 184, 0.4)',
      beam: 'from-slate-400/30'
    },
    uncommon: {
      text: 'text-emerald-300',
      bg: 'bg-emerald-950/80',
      border: 'border-emerald-500/40',
      glow: 'rgba(16, 185, 129, 0.5)',
      beam: 'from-emerald-400/40'
    },
    rare: {
      text: 'text-cyan-300',
      bg: 'bg-cyan-950/80',
      border: 'border-cyan-500/50',
      glow: 'rgba(6, 182, 212, 0.6)',
      beam: 'from-cyan-400/50'
    },
    epic: {
      text: 'text-purple-300',
      bg: 'bg-purple-950/80',
      border: 'border-purple-500/50',
      glow: 'rgba(168, 85, 247, 0.7)',
      beam: 'from-purple-500/60'
    },
    legendary: {
      text: 'text-amber-300',
      bg: 'bg-amber-950/80',
      border: 'border-amber-500/60',
      glow: 'rgba(245, 158, 11, 0.85)',
      beam: 'from-amber-400/70'
    },
    mythic: {
      text: 'text-rose-300',
      bg: 'bg-rose-950/80',
      border: 'border-rose-500/70',
      glow: 'rgba(244, 63, 94, 0.95)',
      beam: 'from-rose-500/80'
    }
  };

  const handleTriggerOpen = () => {
    if (stage() === 'unlocking') return;
    if (props.availableChests <= 0) return;

    const res = props.onOpenOneChest();
    if (!res) return;

    setCurrentResult(res);
    setStage('unlocking');

    // Sequence timing: 1.1s rumble & light explosion -> card reveal
    const timer = setTimeout(() => {
      setStage('revealed');
    }, 1100);

    onCleanup(() => clearTimeout(timer));
  };

  // Keyboard shortcut: Space or Enter to open chest or continue
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (stage() === 'idle') {
        handleTriggerOpen();
      } else if (stage() === 'revealed') {
        if (props.availableChests > 0) {
          setStage('idle');
          handleTriggerOpen();
        } else {
          props.onClose();
        }
      }
    } else if (e.key === 'Escape') {
      props.onClose();
    }
  };

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    onCleanup(() => window.removeEventListener('keydown', handleKeyDown));
  });

  const activeRarityConfig = createMemo(() => {
    const res = currentResult();
    if (!res) return rarityColors.common;
    return rarityColors[res.fish.rarity] || rarityColors.common;
  });

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md select-none animate-fade-in p-4">
      {/* Outer Click to Dismiss (only when in idle or revealed) */}
      <div
        class="absolute inset-0"
        onClick={() => {
          if (stage() !== 'unlocking') props.onClose();
        }}
      />

      {/* Main Gacha Box Container */}
      <div class="relative z-10 w-full max-w-lg bg-[#12141e] border border-white/[0.08] rounded-2xl p-7 shadow-2xl flex flex-col items-center overflow-hidden">
        {/* Background radial glow */}
        <div
          class="absolute inset-0 pointer-events-none transition-all duration-700 opacity-30"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${activeRarityConfig().glow} 0%, transparent 70%)`
          }}
        />

        {/* Modal Header */}
        <div class="w-full flex items-center justify-between pb-4 border-b border-white/[0.08] relative z-10">
          <div class="flex items-center gap-2">
            <IconChest class="text-cyan-400" size={18} />
            <h2 class="font-semibold text-sm tracking-wide text-zinc-100">
              {t('chest.title')}
            </h2>
          </div>

          <div class="flex items-center gap-3">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-950/80 border border-cyan-800/50 text-cyan-300">
              {props.availableChests} {t('chest.remaining')}
            </span>

            <button
              onClick={props.onClose}
              class="w-7 h-7 rounded-lg hover:bg-white/[0.08] text-zinc-400 hover:text-white flex items-center justify-center transition-colors text-sm"
              title="Cerrar (Esc)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ========================================================
            STAGE 1: IDLE / CHEST READY TO OPEN
            ======================================================== */}
        <Show when={stage() === 'idle'}>
          <div class="py-8 flex flex-col items-center text-center relative z-10">
            {/* Clickable Pixel Chest */}
            <button
              onClick={handleTriggerOpen}
              class="group relative p-6 focus:outline-none cursor-pointer transform hover:scale-105 active:scale-95 transition-transform"
              title={t('chest.tapToOpen')}
            >
              {/* Oceanic ambient particles */}
              <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div class="w-36 h-36 rounded-full bg-cyan-500/10 blur-xl group-hover:bg-cyan-500/25 transition-all animate-pulse" />
              </div>

              {/* Pixel Art Treasure Chest SVG */}
              <svg width="128" height="108" viewBox="0 0 32 27" shape-rendering="crispEdges" class="relative z-10 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                {/* Wood Base Body */}
                <rect x="3" y="10" width="26" height="15" fill="#78350f" />
                <rect x="4" y="11" width="24" height="13" fill="#92400e" />
                <rect x="5" y="13" width="22" height="9" fill="#b45309" />
                
                {/* Gold Trimmings & Corner Plates */}
                <rect x="3" y="10" width="2" height="15" fill="#d97706" />
                <rect x="27" y="10" width="2" height="15" fill="#d97706" />
                <rect x="3" y="23" width="26" height="2" fill="#d97706" />
                <rect x="3" y="10" width="26" height="2" fill="#d97706" />
                <rect x="15" y="10" width="2" height="15" fill="#d97706" />

                {/* Curved Chest Lid */}
                <rect x="4" y="5" width="24" height="6" fill="#78350f" />
                <rect x="6" y="3" width="20" height="3" fill="#92400e" />
                <rect x="7" y="2" width="18" height="2" fill="#b45309" />
                
                {/* Gold Lid Trim */}
                <rect x="4" y="5" width="2" height="6" fill="#d97706" />
                <rect x="26" y="5" width="2" height="6" fill="#d97706" />
                <rect x="6" y="3" width="2" height="3" fill="#f59e0b" />
                <rect x="24" y="3" width="2" height="3" fill="#f59e0b" />
                <rect x="15" y="2" width="2" height="9" fill="#f59e0b" />

                {/* Bioluminescent Lock Keyhole */}
                <rect x="14" y="13" width="4" height="5" fill="#0f172a" />
                <rect x="15" y="14" width="2" height="2" fill="#38bdf8" />
                <rect x="15.5" y="16" width="1" height="1.5" fill="#38bdf8" />
              </svg>
            </button>

            <p class="text-xs text-zinc-400 mt-2 font-mono">
              {t('chest.tapToOpen')}
            </p>

            <button
              onClick={handleTriggerOpen}
              class="mt-6 px-6 py-2.5 rounded-xl font-semibold text-xs tracking-wider uppercase bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <IconSparkles size={14} />
              <span>{t('chest.openChest')}</span>
            </button>
          </div>
        </Show>

        {/* ========================================================
            STAGE 2: UNLOCKING / RUMBLING + LIGHT BURST
            ======================================================== */}
        <Show when={stage() === 'unlocking'}>
          <div class="py-10 flex flex-col items-center justify-center relative z-10 w-full min-h-[260px]">
            {/* Radiant Rotating Light Beams in Rarity Color */}
            <div
              class="absolute w-72 h-72 rounded-full pointer-events-none animate-ray-spin opacity-75"
              style={{
                background: `conic-gradient(from 0deg, transparent 0deg, ${activeRarityConfig().glow} 45deg, transparent 90deg, ${activeRarityConfig().glow} 135deg, transparent 180deg, ${activeRarityConfig().glow} 225deg, transparent 270deg, ${activeRarityConfig().glow} 315deg, transparent 360deg)`
              }}
            />

            {/* Vertical Light Pillar */}
            <div
              class={`absolute top-0 bottom-0 w-24 bg-gradient-to-t ${activeRarityConfig().beam} to-white/80 blur-xl pointer-events-none animate-pulse`}
            />

            {/* Shaking Rumbling Chest */}
            <div class="relative z-10 animate-chest-rumble">
              <svg width="136" height="116" viewBox="0 0 32 27" shape-rendering="crispEdges" class="drop-shadow-[0_0_25px_rgba(255,255,255,0.8)]">
                {/* Wood Base Body */}
                <rect x="3" y="10" width="26" height="15" fill="#78350f" />
                <rect x="4" y="11" width="24" height="13" fill="#92400e" />
                <rect x="5" y="13" width="22" height="9" fill="#b45309" />
                
                {/* Golden bands */}
                <rect x="3" y="10" width="2" height="15" fill="#fbbf24" />
                <rect x="27" y="10" width="2" height="15" fill="#fbbf24" />
                <rect x="15" y="10" width="2" height="15" fill="#fbbf24" />

                {/* Bursting glowing keyhole */}
                <circle cx="16" cy="15" r="4" fill="#ffffff" />
              </svg>
            </div>

            <p class="text-xs font-mono font-semibold text-cyan-300 mt-6 animate-pulse relative z-10">
              {t('chest.opening')}
            </p>
          </div>
        </Show>

        {/* ========================================================
            STAGE 3: CARD REVEAL (GACHA REWARD)
            ======================================================== */}
        <Show when={stage() === 'revealed' && currentResult()}>
          {(() => {
            const res = currentResult()!;
            const fish = res.fish;
            const inst = res.instance;
            const cfg = activeRarityConfig();

            return (
              <div class="w-full py-2 flex flex-col items-center relative z-10 animate-fade-in">
                {/* Rarity & Discovery Pill */}
                <div class="flex items-center gap-2 mb-3">
                  <span class={`px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider border ${cfg.bg} ${cfg.text} ${cfg.border} shadow-lg`}>
                    {t(`chest.rarity${fish.rarity.charAt(0).toUpperCase() + fish.rarity.slice(1)}`)}
                  </span>

                  <Show when={res.isNew}>
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-950 border border-emerald-500/50 text-emerald-300 animate-pulse">
                      {t('chest.newDiscovery')}
                    </span>
                  </Show>
                </div>

                {/* Big Pixel Fish Display Card */}
                <div
                  class="relative p-6 rounded-2xl border border-white/[0.1] bg-[#080b12]/90 flex flex-col items-center justify-center my-2 shadow-2xl w-full max-w-sm"
                  style={{
                    "box-shadow": `0 0 30px ${cfg.glow}`
                  }}
                >
                  {/* Shiny Star Sparkle */}
                  <Show when={inst.isShiny}>
                    <div class="text-[10px] font-mono font-bold text-amber-300 mb-2 flex items-center gap-1 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40">
                      <IconSparkles size={11} />
                      <span>{t('chest.shinyVariant')}</span>
                    </div>
                  </Show>

                  {/* Fish Sprite */}
                  <div class="py-2 transform hover:scale-110 transition-transform">
                    <PixelFish
                      fishId={fish.id}
                      rarity={fish.rarity}
                      isShiny={inst.isShiny}
                      size={96}
                    />
                  </div>

                  {/* Real Species Name */}
                  <h3 class="text-base font-bold text-zinc-100 mt-3 text-center">
                    {t(fish.nameKey)}
                  </h3>

                  {/* Biological Description */}
                  <p class="text-xs text-zinc-400 text-center mt-1 px-2 italic line-clamp-2">
                    {t(fish.descriptionKey)}
                  </p>

                  {/* Fish Spec Sheet Grid */}
                  <div class="grid grid-cols-2 gap-2 w-full mt-4 pt-3 border-t border-white/[0.08] text-[11px] font-mono">
                    <div class="bg-white/[0.03] p-2 rounded-lg border border-white/[0.04] flex flex-col">
                      <span class="text-zinc-500 text-[9.5px] uppercase">{t('aquarium.weight')}</span>
                      <span class="font-bold text-zinc-200">{inst.weightFormatted}</span>
                    </div>

                    <div class="bg-white/[0.03] p-2 rounded-lg border border-white/[0.04] flex flex-col">
                      <span class="text-zinc-500 text-[9.5px] uppercase">PPS Boost</span>
                      <span class="font-bold text-emerald-400">+{fish.basePPS} /s</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Interactive Controls */}
                <div class="flex items-center gap-3 mt-4 w-full justify-center">
                  <Show when={props.availableChests > 0}>
                    <button
                      onClick={() => {
                        setStage('idle');
                        handleTriggerOpen();
                      }}
                      class="px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wider bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      <IconChest size={14} />
                      <span>{t('chest.openAnother')} ({props.availableChests})</span>
                    </button>
                  </Show>

                  <button
                    onClick={props.onClose}
                    class="px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wider bg-white/[0.08] hover:bg-white/[0.12] text-zinc-200 border border-white/[0.1] active:scale-95 transition-all"
                  >
                    {t('chest.sendToTank')}
                  </button>
                </div>
              </div>
            );
          })()}
        </Show>
      </div>
    </div>
  );
};
