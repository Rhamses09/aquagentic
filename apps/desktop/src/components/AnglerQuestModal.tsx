import { Component, Show, createMemo, onMount, onCleanup } from 'solid-js';
import {
  AnglerQuest,
  FISH_MAP,
  InventoryItem,
  checkQuestCompletion
} from '@aquagentic/core-game';
import { PixelFish } from './PixelFish';
import { IconFish, IconSparkles, IconChest, IconZap } from './icons';
import { t } from '../i18n';

interface AnglerQuestModalProps {
  quest: AnglerQuest | null;
  inventory: Record<string, InventoryItem>;
  completedQuestsCount: number;
  onClaimReward: () => void;
  onRerollQuest: () => void;
  onClose: () => void;
}

export const AnglerQuestModal: Component<AnglerQuestModalProps> = (props) => {
  const isReadyToClaim = createMemo(() => {
    if (!props.quest) return false;
    return checkQuestCompletion(props.quest, props.inventory);
  });

  const targetFishDef = createMemo(() => {
    if (!props.quest) return null;
    return FISH_MAP.get(props.quest.targetFishId) || null;
  });

  // Keyboard shortcut: Escape to close, Enter/Space to claim if ready
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      props.onClose();
    } else if ((e.key === 'Enter' || e.key === ' ') && isReadyToClaim()) {
      e.preventDefault();
      props.onClaimReward();
    }
  };

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    onCleanup(() => window.removeEventListener('keydown', handleKeyDown));
  });

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md select-none animate-fade-in p-4">
      {/* Backdrop click to dismiss */}
      <div class="absolute inset-0" onClick={props.onClose} />

      {/* Main Angler Quest Dialogue Card */}
      <div class="relative z-10 w-full max-w-xl bg-[#12141e] border border-white/[0.08] rounded-2xl p-6 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div class="flex items-center justify-between pb-4 border-b border-white/[0.06] relative z-10">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <IconFish size={16} />
            </div>
            <div>
              <h2 class="font-semibold text-sm tracking-tight text-zinc-100 flex items-center gap-2">
                <span>{t('angler.modalTitle')}</span>
              </h2>
              <p class="text-[11.5px] text-zinc-400">
                {t('angler.modalSubtitle')}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <span class="px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-white/[0.04] border border-white/[0.08] text-zinc-300">
              {props.completedQuestsCount} {t('angler.completedBounties')}
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

        {/* NPC Profile & Speech Bubble Section */}
        <div class="flex items-start gap-4 my-5 relative z-10">
          {/* Authentic Retro Pixel Art Angler Avatar */}
          <div class="flex-shrink-0 flex flex-col items-center">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-b from-amber-500/20 to-cyan-500/10 border border-amber-500/40 flex items-center justify-center shadow-lg relative overflow-hidden group">
              <svg width="48" height="48" viewBox="0 0 24 24" shape-rendering="crispEdges">
                {/* Yellow Fisherman Cap */}
                <rect x="5" y="3" width="14" height="4" fill="#f59e0b" />
                <rect x="3" y="6" width="18" height="2" fill="#d97706" />
                <rect x="18" y="5" width="2" height="1" fill="#ffffff" />
                
                {/* Face & Eyes */}
                <rect x="6" y="8" width="12" height="7" fill="#fed7aa" />
                <rect x="7" y="10" width="2" height="2" fill="#0f172a" />
                <rect x="13" y="10" width="2" height="2" fill="#0f172a" />
                <rect x="9" y="13" width="4" height="1" fill="#b45309" />
                
                {/* Fishing Vest */}
                <rect x="5" y="15" width="14" height="6" fill="#0284c7" />
                <rect x="8" y="16" width="2" height="4" fill="#38bdf8" />
                <rect x="14" y="16" width="2" height="4" fill="#38bdf8" />
                <rect x="10" y="17" width="4" height="4" fill="#e0f2fe" />
                
                {/* Fishing Rod Over Shoulder */}
                <rect x="19" y="2" width="1" height="18" fill="#78350f" />
                <rect x="20" y="2" width="2" height="1" fill="#94a3b8" />
              </svg>
            </div>
            <span class="mt-1 text-[10px] font-mono font-semibold text-amber-400">
              {t('angler.name')}
            </span>
          </div>

          {/* Dialogue Speech Balloon */}
          <div class="flex-1 p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] relative">
            <div class="text-xs leading-relaxed text-zinc-200 italic font-mono">
              "{props.quest ? t(props.quest.dialogueKey) : '...'}"
            </div>
          </div>
        </div>

        {/* Target Fish Bounty Sheet */}
        <Show when={props.quest && targetFishDef()}>
          {(() => {
            const def = targetFishDef()!;
            const q = props.quest!;
            const ready = isReadyToClaim();

            return (
              <div class="w-full flex flex-col gap-3 relative z-10">
                <div class="p-4 rounded-xl bg-[#080b12]/90 border border-white/[0.08] flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <div class="w-16 h-14 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center p-2">
                      <PixelFish
                        fishId={def.id}
                        rarity={def.rarity}
                        size={56}
                      />
                    </div>

                    <div>
                      <div class="flex items-center gap-2">
                        <h4 class="font-bold text-sm text-zinc-100">
                          {t(def.nameKey)}
                        </h4>
                        <span class="px-2 py-0.5 rounded text-[9.5px] font-mono uppercase bg-cyan-950/80 border border-cyan-800/40 text-cyan-300">
                          {t(`biome.${def.biome}`)}
                        </span>
                      </div>
                      <p class="text-xs text-zinc-400 mt-0.5 line-clamp-1 italic">
                        {t(def.descriptionKey)}
                      </p>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div class="text-right">
                    <Show when={ready}>
                      <span class="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.35)] animate-pulse">
                        {t('angler.statusReady')}
                      </span>
                    </Show>
                    <Show when={!ready}>
                      <span class="px-3 py-1 rounded-full text-[11px] font-mono text-zinc-400 bg-white/[0.04] border border-white/[0.08]">
                        {t('angler.statusSearching')}
                      </span>
                    </Show>
                  </div>
                </div>

                {/* Bounty Rewards Preview */}
                <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                  <span class="text-xs text-zinc-400 font-mono">
                    {t('angler.rewardTitle')}
                  </span>

                  <div class="flex items-center gap-2.5 font-mono text-xs">
                    {/* Pearls Reward */}
                    <div class="flex items-center gap-1 text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-800/40">
                      <IconZap size={12} />
                      <span class="font-bold">+{q.reward.pearls.toLocaleString()} Perlas</span>
                    </div>

                    {/* Chests Reward */}
                    <div class="flex items-center gap-1 text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-800/40">
                      <IconChest size={12} />
                      <span class="font-bold">+{q.reward.chests} Cofre{q.reward.chests > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div class="flex items-center justify-between mt-2 pt-2">
                  <button
                    onClick={props.onRerollQuest}
                    class="px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] transition-colors"
                  >
                    ↻ {t('angler.rerollButton')}
                  </button>

                  <div class="flex items-center gap-3">
                    <Show when={ready}>
                      <button
                        onClick={props.onClaimReward}
                        class="px-6 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <IconSparkles size={14} />
                        <span>{t('angler.claimButton')}</span>
                      </button>
                    </Show>

                    <Show when={!ready}>
                      <button
                        disabled
                        class="px-5 py-2.5 rounded-xl font-semibold text-xs text-zinc-500 bg-white/[0.04] border border-white/[0.06] cursor-not-allowed"
                      >
                        {t('angler.statusSearching')}
                      </button>
                    </Show>
                  </div>
                </div>
              </div>
            );
          })()}
        </Show>
      </div>
    </div>
  );
};
