import { Component, For, createMemo, onMount, onCleanup } from 'solid-js';
import {
  SHOP_UPGRADES,
  getUpgradeCost,
  calculateRodTokenCost,
  calculateMaxTankCapacity,
  calculateUpgradesPPSMultiplier
} from '@aquagentic/core-game';
import { IconZap, IconSparkles, IconPlus, IconChest } from './icons';
import { t } from '../i18n';

interface ShopModalProps {
  pearls: number;
  upgrades: Record<string, number>;
  onBuyUpgrade: (upgradeId: string) => void;
  onClose: () => void;
}

export const ShopModal: Component<ShopModalProps> = (props) => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') props.onClose();
  };

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    onCleanup(() => window.removeEventListener('keydown', handleKeyDown));
  });

  const currentRodCost = createMemo(() => calculateRodTokenCost(props.upgrades));
  const currentTankCap = createMemo(() => calculateMaxTankCapacity(props.upgrades));
  const currentMultiplier = createMemo(() => calculateUpgradesPPSMultiplier(props.upgrades));

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md select-none animate-fade-in p-4">
      {/* Backdrop click to dismiss */}
      <div class="absolute inset-0" onClick={props.onClose} />

      {/* Main Shop Container */}
      <div class="relative z-10 w-full max-w-2xl bg-[#12141e] border border-white/[0.08] rounded-2xl p-6 shadow-2xl flex flex-col overflow-hidden max-h-[85vh]">
        {/* Modal Header */}
        <div class="flex items-center justify-between pb-4 border-b border-white/[0.06] relative z-10">
          <div>
            <h2 class="font-semibold text-sm tracking-tight text-zinc-100 font-sans">
              {t('shop.title')}
            </h2>
            <p class="text-xs text-zinc-400 mt-0.5">
              {t('shop.subtitle')}
            </p>
          </div>

          <div class="flex items-center gap-3">
            {/* Live Pearl Balance Indicator */}
            <div class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-200 font-mono text-xs font-medium">
              <span>💎</span>
              <span>{Math.floor(props.pearls).toLocaleString()} Perlas</span>
            </div>

            <button
              onClick={props.onClose}
              class="w-7 h-7 rounded-lg hover:bg-white/[0.08] text-zinc-400 hover:text-white flex items-center justify-center transition-colors text-sm"
              title="Cerrar (Esc)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Real-time Stat Modifiers Banner */}
        <div class="grid grid-cols-3 gap-2.5 my-4 p-3 rounded-xl bg-[#131623]/80 border border-white/[0.06] text-xs font-mono">
          <div class="flex flex-col">
            <span class="text-zinc-500 text-[10px] uppercase">{t('shop.rodTokenCostLabel')}</span>
            <span class="font-bold text-cyan-300 text-sm">{currentRodCost()} tokens</span>
          </div>

          <div class="flex flex-col">
            <span class="text-zinc-500 text-[10px] uppercase">{t('shop.tankCapacityLabel')}</span>
            <span class="font-bold text-emerald-400 text-sm">{currentTankCap()} peces</span>
          </div>

          <div class="flex flex-col">
            <span class="text-zinc-500 text-[10px] uppercase">{t('shop.ppsMultiplierLabel')}</span>
            <span class="font-bold text-amber-300 text-sm">{currentMultiplier().toFixed(2)}x PPS</span>
          </div>
        </div>

        {/* Upgrade Cards List */}
        <div class="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5">
          <For each={SHOP_UPGRADES}>
            {(upgrade) => {
              const currentLvl = props.upgrades[upgrade.id] || 0;
              const isMax = currentLvl >= upgrade.maxLevel;
              const cost = getUpgradeCost(upgrade.id, currentLvl);
              const canAfford = props.pearls >= cost;

              return (
                <div class="p-3.5 rounded-xl bg-[#141724]/90 hover:bg-[#181c2c] border border-white/[0.06] hover:border-white/[0.12] transition-all flex items-center justify-between gap-4">
                  <div class="flex items-start gap-3 flex-1">
                    <div class="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-cyan-400 flex-shrink-0 mt-0.5">
                      {upgrade.id === 'rod_efficiency' && <IconChest size={16} />}
                      {upgrade.id === 'bioluminescent_algae' && <IconZap size={16} class="text-amber-400" />}
                      {upgrade.id === 'tank_expansion' && <span class="text-base">🐠</span>}
                      {upgrade.id === 'chum_bucket' && <IconSparkles size={16} class="text-emerald-400" />}
                      {upgrade.id === 'pearl_magnet' && <span class="text-base">🧲</span>}
                    </div>

                    <div class="flex flex-col">
                      <div class="flex items-center gap-2">
                        <span class="font-semibold text-xs text-zinc-100 font-sans">
                          {t(upgrade.nameKey)}
                        </span>
                        <span class="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-white/[0.05] text-zinc-400 border border-white/[0.06]">
                          Lvl {currentLvl} / {upgrade.maxLevel}
                        </span>
                      </div>
                      <p class="text-[11.5px] text-zinc-400 mt-0.5 font-sans leading-relaxed">
                        {t(upgrade.descriptionKey)}
                      </p>
                    </div>
                  </div>

                  {/* Purchase Button */}
                  <div class="flex-shrink-0">
                    <Show
                      when={!isMax}
                      fallback={
                        <span class="px-3 py-1.5 rounded-lg text-[10.5px] font-mono font-bold bg-white/[0.04] text-zinc-500 border border-white/[0.06]">
                          {t('shop.maxLevelReached')}
                        </span>
                      }
                    >
                      <button
                        onClick={() => props.onBuyUpgrade(upgrade.id)}
                        disabled={!canAfford}
                        class={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-md ${
                          canAfford
                            ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-cyan-500/20 active:scale-95 cursor-pointer'
                            : 'bg-white/[0.04] text-zinc-500 border border-white/[0.06] cursor-not-allowed'
                        }`}
                      >
                        <span>💎</span>
                        <span>{cost.toLocaleString()}</span>
                      </button>
                    </Show>
                  </div>
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </div>
  );
};
