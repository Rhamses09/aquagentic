import { Component, createSignal, Show } from 'solid-js';
import { GachaRollResult } from '@aquagentic/core-game';
import { t } from '../i18n';

interface TokenDockProps {
  currentBait: number;
  rodCost: number;
  rodLevel: number;
  onBurnTokens: (amount: number, prompt: string) => void;
  onSimulateStream: (prompt: string) => void;
  onSimulateGlitch: () => void;
  latestCatch: GachaRollResult | null;
  onDismissCatch: () => void;
}

export const TokenDock: Component<TokenDockProps> = (props) => {
  const [promptInput, setPromptInput] = createSignal('');
  const [isStreaming, setIsStreaming] = createSignal(false);

  const progressPercent = () => Math.min(100, (props.currentBait / props.rodCost) * 100);

  const handleQuickBurn = (amount: number) => {
    props.onBurnTokens(amount, promptInput() || 'Quick Token Cast');
  };

  const handleStreamClick = () => {
    if (isStreaming()) return;
    setIsStreaming(true);
    props.onSimulateStream(promptInput() || 'Explain async event loops in Rust');
    setTimeout(() => setIsStreaming(false), 2000);
  };

  return (
    <div class="border-t border-cyan-950 bg-slate-950/95 backdrop-blur-md p-4 flex flex-col gap-3 z-10 shadow-2xl">
      {/* Rod Progress & Bait Bar */}
      <div class="flex flex-col gap-1.5">
        <div class="flex items-center justify-between text-xs">
          <div class="flex items-center gap-2">
            <span class="font-bold text-cyan-400">🎣 {t('stats.currentBait')}</span>
            <span class="text-slate-400 font-mono text-[11px]">
              {props.currentBait} / {props.rodCost} tokens
            </span>
          </div>
          <span class="text-xs font-semibold text-cyan-300 font-mono">
            {progressPercent().toFixed(1)}%
          </span>
        </div>

        {/* Outer Bar */}
        <div class="w-full h-3 bg-slate-900 rounded-full border border-cyan-900/40 overflow-hidden relative shadow-inner">
          <div
            class="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 rounded-full transition-all duration-300 relative"
            style={{ width: `${progressPercent()}%` }}
          >
            {/* Sparkle highlight */}
            <div class="absolute inset-0 bg-white/20 animate-pulse pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Interactive Controls */}
      <div class="flex items-center gap-3">
        {/* Prompt Input */}
        <input
          type="text"
          value={promptInput()}
          onInput={(e) => setPromptInput(e.currentTarget.value)}
          placeholder={t('dock.inputPlaceholder')}
          class="flex-1 bg-slate-900/90 border border-cyan-900/50 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"
        />

        {/* Burn +100 */}
        <button
          onClick={() => handleQuickBurn(100)}
          class="bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-800/60 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all hover:scale-105 active:scale-95 whitespace-nowrap shadow-md"
        >
          {t('dock.burn100Tokens')}
        </button>

        {/* Burn +500 (Instant Catch) */}
        <button
          onClick={() => handleQuickBurn(500)}
          class="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl px-4 py-2 text-xs transition-all hover:scale-105 active:scale-95 whitespace-nowrap shadow-lg shadow-cyan-600/30"
        >
          {t('dock.burn500Tokens')}
        </button>

        {/* Simulate AI Streaming */}
        <button
          onClick={handleStreamClick}
          disabled={isStreaming()}
          class={`bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-800/60 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap shadow-md ${
            isStreaming() ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
          }`}
        >
          <span class={isStreaming() ? 'animate-spin' : ''}>⚡</span>
          <span>{isStreaming() ? 'Streaming...' : t('dock.simulateStream')}</span>
        </button>

        {/* Trigger Glitch Storm */}
        <button
          onClick={props.onSimulateGlitch}
          title="Simulate rate limit / compiler error to summon Glitch fish"
          class="bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-800/50 rounded-xl px-3 py-2 text-xs font-semibold transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
        >
          👾
        </button>
      </div>

      {/* Catch Modal Dialog */}
      <Show when={props.latestCatch}>
        {(catchResult) => (
          <div class="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div class="bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/50 rounded-2xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
              {/* Shiny Aura */}
              {catchResult().instance.isShiny && (
                <div class="absolute inset-0 bg-amber-400/10 pointer-events-none animate-pulse" />
              )}

              {/* Badges */}
              <div class="flex items-center gap-2 mb-3">
                {catchResult().isNew && (
                  <span class="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {t('catchModal.newBadge')}
                  </span>
                )}
                {catchResult().instance.isShiny && (
                  <span class="bg-amber-400/20 text-amber-300 border border-amber-400/60 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-sparkle">
                    ★ SHINY x3 PPS
                  </span>
                )}
                {catchResult().pityTriggered && (
                  <span class="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {t('catchModal.pityBadge')}
                  </span>
                )}
              </div>

              {/* Fish Sprite Avatar */}
              <div class="w-24 h-24 rounded-2xl bg-cyan-950/50 border border-cyan-700/40 flex items-center justify-center mb-3 shadow-inner relative">
                <span class="text-6xl animate-bob">
                  {catchResult().fish.rarity === 'mythic' ? '🐉' :
                   catchResult().fish.rarity === 'legendary' ? '🐋' :
                   catchResult().fish.rarity === 'epic' ? '🦈' :
                   catchResult().fish.rarity === 'rare' ? '🦑' : '🐟'}
                </span>
              </div>

              {/* Fish Name & Rarity */}
              <h3 class="text-lg font-bold text-white mb-1">
                {t(catchResult().fish.nameKey)}
              </h3>
              <div class="text-xs font-semibold uppercase tracking-wider mb-2 font-mono text-cyan-400">
                {t(`rarity.${catchResult().fish.rarity}`)} • +{catchResult().fish.basePPS} PPS
              </div>

              <p class="text-xs text-slate-400 mb-4 max-w-xs">
                {t(catchResult().fish.descriptionKey)}
              </p>

              {/* Stats Box */}
              <div class="w-full bg-slate-900/80 rounded-xl p-3 border border-slate-800 text-left text-xs flex flex-col gap-1.5 mb-4 font-mono">
                <div class="flex justify-between">
                  <span class="text-slate-400">{t('catchModal.weight')}:</span>
                  <span class="text-white font-bold">{catchResult().instance.weightFormatted}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-slate-400">{t('catchModal.promptHash')}:</span>
                  <span class="text-cyan-400 text-[10px] truncate max-w-[160px]" title={catchResult().instance.promptHash}>
                    {catchResult().instance.promptHash.substring(0, 16)}...
                  </span>
                </div>
                {catchResult().fish.passive && (
                  <div class="pt-1.5 border-t border-slate-800/80 flex flex-col">
                    <span class="text-amber-400 font-bold text-[11px]">
                      ★ {t(catchResult().fish.passive!.nameKey)}
                    </span>
                    <span class="text-slate-400 text-[10px]">
                      {t(catchResult().fish.passive!.descriptionKey)}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={props.onDismissCatch}
                class="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-cyan-600/30"
              >
                {t('catchModal.continue')}
              </button>
            </div>
          </div>
        )}
      </Show>
    </div>
  );
};
