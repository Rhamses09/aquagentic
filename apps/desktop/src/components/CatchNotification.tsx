import { Component, Show } from 'solid-js';
import { GachaRollResult } from '@aquagentic/core-game';
import { t } from '../i18n';
import { FishGlyph } from './FishGlyph';
import { PixelFish } from './PixelFish';
import { IconSparkles } from './icons';

interface CatchNotificationProps {
  catchResult: GachaRollResult | null;
  onDismiss: () => void;
}

export const CatchNotification: Component<CatchNotificationProps> = (props) => {
  return (
    <Show when={props.catchResult}>
      {(result) => (
        <div class="fixed top-14 right-5 z-50 animate-slideIn max-w-sm w-full font-mono select-none">
          <div
            class={`bg-[#0d0f17]/95 backdrop-blur-xl border rounded-xl p-3.5 shadow-2xl flex flex-col gap-2 relative overflow-hidden ${
              result().instance.isShiny
                ? 'border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                : 'border-white/[0.12] shadow-black/80'
            }`}
          >
            {/* Header: Title & Badges */}
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <IconSparkles size={12} class="text-cyan-400" />
                  <span>{t('aquarium.caughtToast')}</span>
                </span>
                {result().instance.isShiny && (
                  <span class="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[9px] font-bold px-1.5 py-0.2 rounded">
                    ★ SHINY x3 PPS
                  </span>
                )}
                {result().pityTriggered && (
                  <span class="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[9px] font-bold px-1.5 py-0.2 rounded">
                    PITY
                  </span>
                )}
              </div>

              <button
                onClick={props.onDismiss}
                class="text-zinc-500 hover:text-zinc-200 text-xs p-1 leading-none"
              >
                ✕
              </button>
            </div>

            {/* Fish Info Row */}
            <div class="flex items-center gap-3 pt-0.5">
              <div class="w-12 h-12 rounded-lg bg-[#141722] border border-white/[0.08] flex items-center justify-center shrink-0 shadow-inner">
                <PixelFish
                  fishId={result().fish.id}
                  rarity={result().fish.rarity}
                  isShiny={result().instance.isShiny}
                  size={34}
                />
              </div>

              <div class="flex-1 min-w-0">
                <h4 class="text-xs font-bold text-white truncate font-sans">
                  {t(result().fish.nameKey)}
                </h4>
                <div class="text-[10px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
                  <span class="text-cyan-400 uppercase font-semibold">
                    {t(`rarity.${result().fish.rarity}`)}
                  </span>
                  <span>•</span>
                  <span>+{result().fish.basePPS} PPS</span>
                  <span>•</span>
                  <span>{result().instance.weightFormatted}</span>
                </div>
              </div>
            </div>

            {/* Passive Description if any */}
            {result().fish.passive && (
              <div class="bg-white/[0.03] rounded-md p-2 text-[10px] text-zinc-400 border border-white/[0.04]">
                <span class="text-amber-400 font-semibold mr-1">
                  ★ {t(result().fish.passive!.nameKey)}:
                </span>
                <span>{t(result().fish.passive!.descriptionKey)}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </Show>
  );
};
