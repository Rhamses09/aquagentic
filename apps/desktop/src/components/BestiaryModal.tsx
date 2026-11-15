import { Component, For, createSignal, Show } from 'solid-js';
import {
  INITIAL_FISH_CATALOG,
  InventoryItem,
  Rarity,
  formatWeight
} from '@aquagentic/core-game';
import { t } from '../i18n';
import { FishGlyph } from './FishGlyph';
import { IconSparkles, IconCheck, IconPlus } from './icons';

interface BestiaryModalProps {
  inventory: Record<string, InventoryItem>;
  activeTankIds: string[];
  onToggleActiveTank: (fishId: string) => void;
  onClose: () => void;
}

export const BestiaryModal: Component<BestiaryModalProps> = (props) => {
  const [selectedRarity, setSelectedRarity] = createSignal<Rarity | 'all'>('all');

  const rarities: Array<Rarity | 'all'> = ['all', 'common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];

  const discoveredCount = () =>
    INITIAL_FISH_CATALOG.filter((f) => props.inventory[f.id] && props.inventory[f.id].count > 0).length;

  const filteredCatalog = () => {
    if (selectedRarity() === 'all') return INITIAL_FISH_CATALOG;
    return INITIAL_FISH_CATALOG.filter((f) => f.rarity === selectedRarity());
  };

  return (
    <div class="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div class="bg-[#0c0e17] border border-white/[0.12] rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div class="p-5 border-b border-white/[0.07] flex items-center justify-between bg-[#10121d]">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-base font-bold text-white tracking-tight">
                {t('bestiary.title')}
              </h3>
              <span class="px-2 py-0.5 text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 rounded border border-cyan-800/40">
                {discoveredCount()} / {INITIAL_FISH_CATALOG.length} {t('bestiary.discovered')}
              </span>
            </div>
            <p class="text-xs text-zinc-400 mt-0.5 font-sans">
              {t('bestiary.subtitle')}
            </p>
          </div>

          <button
            onClick={props.onClose}
            class="text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-white/[0.06] transition-colors text-sm font-mono"
            title="Cerrar (Esc)"
          >
            ✕
          </button>
        </div>

        {/* Filter Tabs by Rarity */}
        <div class="px-5 py-2.5 border-b border-white/[0.06] bg-[#0e1019] flex items-center gap-1.5 overflow-x-auto">
          <For each={rarities}>
            {(rarity) => {
              const isSelected = selectedRarity() === rarity;
              return (
                <button
                  onClick={() => setSelectedRarity(rarity)}
                  class={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                    isSelected
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  {rarity === 'all' ? t('bestiary.all') : t(`rarity.${rarity}`)}
                </button>
              );
            }}
          </For>
        </div>

        {/* Fish Collection Grid */}
        <div class="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <For each={filteredCatalog()}>
            {(fish) => {
              const inv = props.inventory[fish.id];
              const isDiscovered = inv && inv.count > 0;
              const isInTank = props.activeTankIds.includes(fish.id);

              return (
                <div
                  class={`rounded-xl border p-3.5 flex flex-col justify-between transition-all ${
                    isDiscovered
                      ? 'bg-[#121522]/90 border-white/[0.08] hover:border-white/[0.16]'
                      : 'bg-black/30 border-white/[0.04] opacity-55'
                  }`}
                >
                  {/* Top: Icon + Name */}
                  <div>
                    <div class="flex items-start justify-between gap-2 mb-2">
                      <div class="w-12 h-12 rounded-lg bg-black/40 border border-white/[0.06] flex items-center justify-center shrink-0">
                        {isDiscovered ? (
                          <FishGlyph rarity={fish.rarity} isShiny={inv.shinyCount > 0} size={28} />
                        ) : (
                          <span class="text-zinc-600 font-mono text-base font-bold">?</span>
                        )}
                      </div>

                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-1.5">
                          <h4 class="text-xs font-bold text-white truncate font-sans">
                            {isDiscovered ? t(fish.nameKey) : t('bestiary.undiscovered')}
                          </h4>
                        </div>
                        <div class="text-[10px] font-mono uppercase tracking-wider text-cyan-400/90 font-semibold mt-0.5">
                          {t(`rarity.${fish.rarity}`)} • +{fish.basePPS} PPS
                        </div>
                      </div>
                    </div>

                    {/* Description or Biome Hint */}
                    <p class="text-[11px] text-zinc-400 leading-relaxed mb-3">
                      {isDiscovered ? t(fish.descriptionKey) : `${t('bestiary.biomeHint')} ${t(`biome.${fish.biome}`)}`}
                    </p>
                  </div>

                  {/* Discovered Stats & Passive */}
                  <Show when={isDiscovered}>
                    <div class="pt-2.5 border-t border-white/[0.06] flex flex-col gap-1.5 font-mono text-[10px]">
                      <div class="flex justify-between text-zinc-400">
                        <span>{t('bestiary.caughtCount')}</span>
                        <span class="text-zinc-200 font-bold">x{inv.count}</span>
                      </div>

                      <div class="flex justify-between text-zinc-400">
                        <span>{t('bestiary.maxWeight')}</span>
                        <span class="text-white font-bold">{formatWeight(inv.maxWeightBytes)}</span>
                      </div>

                      {inv.shinyCount > 0 && (
                        <div class="text-amber-400 font-bold flex items-center gap-1">
                          <IconSparkles size={10} />
                          <span>★ {inv.shinyCount} Shiny Variants (x3 PPS)</span>
                        </div>
                      )}

                      {fish.passive && (
                        <div class="bg-white/[0.02] p-1.5 rounded border border-white/[0.04] text-[9.5px] text-zinc-400 mt-1">
                          <span class="text-amber-300 font-semibold mr-1">
                            ★ {t(fish.passive.nameKey)}:
                          </span>
                          <span>{t(fish.passive.descriptionKey)}</span>
                        </div>
                      )}

                      {/* Add/Remove from Active Tank Button */}
                      <button
                        onClick={() => props.onToggleActiveTank(fish.id)}
                        class={`mt-2 w-full py-1.5 rounded-lg text-xs font-mono font-medium transition-colors flex items-center justify-center gap-1.5 ${
                          isInTank
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25'
                            : 'bg-white/[0.05] text-zinc-300 border border-white/[0.08] hover:bg-white/[0.1] hover:text-white'
                        }`}
                      >
                        {isInTank ? (
                          <>
                            <IconCheck size={12} />
                            <span>{t('bestiary.inTank')}</span>
                          </>
                        ) : (
                          <>
                            <IconPlus size={12} />
                            <span>{t('bestiary.addToTank')}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </Show>
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </div>
  );
};
