import { Component, For, createSignal, onMount, onCleanup } from 'solid-js';
import { IconCheck, IconCopy, IconCode } from './icons';

interface ReviewDiffModalProps {
  onClose: () => void;
}

export const ReviewDiffModal: Component<ReviewDiffModalProps> = (props) => {
  const [selectedFile, setSelectedFile] = createSignal('packages/core-game/src/upgradesEngine.ts');

  const changedFiles = [
    { path: 'packages/core-game/src/upgradesEngine.ts', added: 110, removed: 0 },
    { path: 'packages/core-game/src/stateEngine.ts', added: 24, removed: 4 },
    { path: 'packages/core-game/src/anglerEngine.ts', added: 98, removed: 0 },
    { path: 'packages/core-game/src/fishData.ts', added: 185, removed: 120 },
    { path: 'apps/desktop/src/components/ShopModal.tsx', added: 145, removed: 0 },
    { path: 'apps/desktop/src/components/Sidebar.tsx', added: 84, removed: 45 },
    { path: 'apps/desktop/src/components/ChatView.tsx', added: 112, removed: 85 }
  ];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') props.onClose();
  };

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    onCleanup(() => window.removeEventListener('keydown', handleKeyDown));
  });

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md select-none animate-fade-in p-4 font-sans">
      <div class="absolute inset-0" onClick={props.onClose} />

      <div class="relative z-10 w-full max-w-4xl bg-[#0d0f19]/95 border border-white/[0.1] rounded-2xl p-6 shadow-2xl flex flex-col h-[75vh] overflow-hidden">
        {/* Header */}
        <div class="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div class="flex items-center gap-3">
            <h2 class="font-bold text-sm text-zinc-100 flex items-center gap-2">
              <IconCode size={16} class="text-cyan-400" />
              <span>Review Workspace Changes</span>
            </h2>
            <span class="text-xs font-mono text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
              {changedFiles.length} files • <span class="text-emerald-400">+754</span> <span class="text-rose-400">-7</span>
            </span>
          </div>

          <button
            onClick={props.onClose}
            class="w-7 h-7 rounded-lg hover:bg-white/[0.08] text-zinc-400 hover:text-white flex items-center justify-center text-sm font-mono"
          >
            ✕
          </button>
        </div>

        {/* Diff Workspace Split */}
        <div class="flex-1 flex overflow-hidden pt-3 gap-3">
          {/* Left: Files List */}
          <div class="w-72 border-r border-white/[0.06] pr-2 overflow-y-auto flex flex-col gap-1 text-xs font-mono">
            <For each={changedFiles}>
              {(file) => {
                const isSelected = selectedFile() === file.path;
                return (
                  <button
                    onClick={() => setSelectedFile(file.path)}
                    class={`flex items-center justify-between p-2 rounded-lg text-left transition-colors truncate ${
                      isSelected
                        ? 'bg-[#1b1e2c] text-zinc-100 font-semibold border border-cyan-500/30'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
                    }`}
                  >
                    <span class="truncate pr-2">{file.path.split('/').pop()}</span>
                    <span class="text-[10px] flex items-center gap-1">
                      <span class="text-emerald-400">+{file.added}</span>
                      <Show when={file.removed > 0}>
                        <span class="text-rose-400">-{file.removed}</span>
                      </Show>
                    </span>
                  </button>
                );
              }}
            </For>
          </div>

          {/* Right: Code Diff Inspector */}
          <div class="flex-1 bg-[#090b12] rounded-xl border border-white/[0.06] p-4 overflow-y-auto font-mono text-xs text-zinc-300 flex flex-col gap-1">
            <div class="text-[11px] text-zinc-500 pb-2 border-b border-white/[0.04]">
              Showing diff for: <span class="text-zinc-300">{selectedFile()}</span>
            </div>

            <div class="pt-2 flex flex-col gap-0.5">
              <span class="text-zinc-500">@@ -1,15 +1,24 @@</span>
              <span class="text-zinc-400"> import &#123; AquariumState &#125; from './types';</span>
              <span class="text-emerald-400 bg-emerald-950/30 px-1 rounded">+ export const SHOP_UPGRADES = [</span>
              <span class="text-emerald-400 bg-emerald-950/30 px-1 rounded">+   &#123; id: 'rod_efficiency', baseCostPearls: 150 &#125;,</span>
              <span class="text-emerald-400 bg-emerald-950/30 px-1 rounded">+   &#123; id: 'bioluminescent_algae', baseCostPearls: 100 &#125;,</span>
              <span class="text-emerald-400 bg-emerald-950/30 px-1 rounded">+   &#123; id: 'tank_expansion', baseCostPearls: 500 &#125;</span>
              <span class="text-emerald-400 bg-emerald-950/30 px-1 rounded">+ ];</span>
              <span class="text-zinc-400"> export function calculateRodTokenCost(upgrades) &#123;</span>
              <span class="text-rose-400 bg-rose-950/30 px-1 rounded">-   return 500;</span>
              <span class="text-emerald-400 bg-emerald-950/30 px-1 rounded">+   const level = (upgrades && upgrades['rod_efficiency']) || 0;</span>
              <span class="text-emerald-400 bg-emerald-950/30 px-1 rounded">+   return Math.max(100, 500 - level * 75);</span>
              <span class="text-zinc-400"> &#125;</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div class="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
          <span class="text-zinc-500">All diffs checked and tested</span>
          <button
            onClick={props.onClose}
            class="px-4 py-1.5 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-400 text-black shadow-md transition-all cursor-pointer"
          >
            Done Reviewing
          </button>
        </div>
      </div>
    </div>
  );
};
