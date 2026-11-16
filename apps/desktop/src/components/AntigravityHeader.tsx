import { Component } from 'solid-js';
import {
  IconAntigravity,
  IconSidebar,
  IconArrowLeft,
  IconArrowRight,
  IconSearch
} from './icons';

interface AntigravityHeaderProps {
  currentSessionTitle: string;
  projectName?: string;
}

export const AntigravityHeader: Component<AntigravityHeaderProps> = (props) => {
  return (
    <header class="h-9 w-full bg-[#13151f] border-b border-white/[0.07] flex items-center justify-between px-3 select-none text-xs z-30 font-sans">
      {/* Left: Window Menu Bar & Navigation Controls */}
      <div class="flex items-center gap-4">
        {/* Antigravity Desktop Menus */}
        <div class="flex items-center gap-3 text-zinc-400 text-[11px] font-medium">
          <span class="text-zinc-200 font-semibold cursor-pointer hover:text-white transition-colors">
            Antigravity
          </span>
          <span class="cursor-pointer hover:text-zinc-200 transition-colors">Workspace</span>
          <span class="cursor-pointer hover:text-zinc-200 transition-colors">View</span>
          <span class="cursor-pointer hover:text-zinc-200 transition-colors">Window</span>
        </div>

        <div class="h-3 w-px bg-white/[0.08]" />

        {/* Quick Back/Forward & Search Navigation */}
        <div class="flex items-center gap-1.5 text-zinc-500">
          <button class="p-1 rounded hover:bg-white/[0.06] hover:text-zinc-300 transition-colors" title="Back">
            <IconArrowLeft size={11} />
          </button>
          <button class="p-1 rounded hover:bg-white/[0.06] hover:text-zinc-300 transition-colors" title="Forward">
            <IconArrowRight size={11} />
          </button>
          <button class="p-1 rounded hover:bg-white/[0.06] hover:text-zinc-300 transition-colors" title="Search">
            <IconSearch size={11} />
          </button>
        </div>
      </div>

      {/* Center: Breadcrumb (e.g. aquagentic / Aquagentic Project Brainstorm Summary) */}
      <div class="flex items-center gap-1.5 text-[11px] text-zinc-400 font-sans max-w-md truncate">
        <span class="text-zinc-500 font-mono">{props.projectName || 'aquagentic'}</span>
        <span class="text-zinc-600">/</span>
        <span class="text-zinc-200 font-medium truncate">{props.currentSessionTitle}</span>
      </div>

      {/* Right: Window controls and IDE trigger */}
      <div class="flex items-center gap-3">
        {/* Open IDE pill button */}
        <button class="px-2 py-0.5 rounded text-[10.5px] font-sans font-medium text-zinc-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors flex items-center gap-1">
          <span>Open IDE</span>
        </button>

        {/* Split pane layout toggle icon */}
        <button class="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] transition-colors" title="Split Panel">
          <IconSidebar size={12} />
        </button>

        {/* Desktop Windows Native Controls */}
        <div class="flex items-center gap-2 pl-2 border-l border-white/[0.08] text-zinc-400">
          <button class="w-4 h-4 flex items-center justify-center hover:text-white" title="Minimize">
            −
          </button>
          <button class="w-4 h-4 flex items-center justify-center hover:text-white" title="Maximize">
            □
          </button>
          <button class="w-4 h-4 flex items-center justify-center hover:text-rose-400" title="Close">
            ✕
          </button>
        </div>
      </div>
    </header>
  );
};
