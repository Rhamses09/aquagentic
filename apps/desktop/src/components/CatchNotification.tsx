import { Component, Show } from 'solid-js';
import { GachaRollResult } from '@aquagentic/core-game';
import { t } from '../i18n';

interface CatchNotificationProps {
  catchResult: GachaRollResult | null;
  onDismiss: () => void;
}

export const CatchNotification: Component<CatchNotificationProps> = (props) => {
  return (
    <Show when={props.catchResult}>
      {(result) => (
        <div class="fixed top-16 right-6 z-50 animate-slideIn max-w-sm w-full">
          <div
            class={`bg-[#141622]/95 backdrop-blur-xl border rounded-2xl p-4 shadow-2xl flex flex-col gap-2 relative overflow-hidden ${
              result().instance.isShiny
                ? 'border-amber-400/60 shadow-amber-500/10'
                : 'border-white/[0.12] shadow-black/60'
            }`}
          >
            {/* Header: Title & Badges */}
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-xs font-semibold text-zinc-300">
                  {t('aquarium.caughtToast')}
                </span>
                {result().instance.isShiny && (
                  <span class="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[9px] font-bold px-1.5 py-0.2 rounded font-mono">
                    ★ SHINY x3 PPS
                  </span>
                )}
                {result().pityTriggered && (
                  <span class="bg-purple-500/20 text-purple-300 text-[9px] font-bold px-1.5 py-0.2 rounded font-mono">
                    PITY
                  </span>
                )}
              </div>

              <button
                onClick={props.onDismiss}
                class="text-zinc-500 hover:text-zinc-300 text-sm p-1 leading-none"
              >
                ✕
              </button>
            </div>

            {/* Fish Info Row */}
            <div class="flex items-center gap-3 pt-1">
              <div class="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0 text-2xl">
                {result().fish.rarity === 'mythic' ? '🐉' :
                 result().fish.rarity === 'legendary' ? '🐋' :
                 result().fish.rarity === 'epic' ? '🦈' :
                 result().fish.rarity === 'rare' ? '🦑' : '🐟'}
              </div>

              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-bold text-white truncate">
                  {t(result().fish.nameKey)}
                </h4>
                <div class="text-[11px] text-zinc-400 font-mono flex items-center gap-2 mt-0.5">
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

            {/* Passive description if any */}
            {result().fish.passive && (
              <div class="bg-white/[0.03] rounded-lg p-2 text-[10px] text-zinc-400 font-mono border border-white/[0.04] mt-1">
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
