import { Component, For, createSignal, Show } from 'solid-js';
import { currentLanguage, setCurrentLanguage, t } from '../i18n';
import {
  IconPlus,
  IconSidebar,
  IconFish,
  IconSettings,
  IconAnchor,
  IconClock,
  IconSliders,
  IconFolder,
  IconAntigravity,
  IconArrowLeft,
  IconArrowRight,
  IconSearch
} from './icons';

interface SidebarProps {
  currentSessionId: string;
  sessions: Array<{ id: string; title: string; updatedAt: string; model: string }>;
  selectedModel: string;
  discoveredCount: number;
  isAnglerQuestReady?: boolean;
  onSelectModel: (model: string) => void;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onOpenBestiary: () => void;
  onOpenAnglerQuest: () => void;
}

export const Sidebar: Component<SidebarProps> = (props) => {
  const [collapsed, setCollapsed] = createSignal(false);
  const [tcsOpen, setTcsOpen] = createSignal(true);
  const [aquagenticOpen, setAquagenticOpen] = createSignal(true);

  return (
    <aside
      class={`h-full bg-[#13151f] border-r border-white/[0.07] flex flex-col transition-all duration-200 z-30 select-none ${
        collapsed() ? 'w-14' : 'w-64'
      }`}
    >
      {/* Top Controls Row */}
      <div class="h-10 px-3 flex items-center justify-between border-b border-white/[0.06] text-zinc-400">
        {!collapsed() ? (
          <div class="flex items-center gap-2">
            <button class="p-1 rounded hover:bg-white/[0.06] hover:text-white transition-colors" title="Antigravity Home">
              <IconAntigravity size={14} class="text-zinc-300" />
            </button>
            <button
              onClick={() => setCollapsed(true)}
              class="p-1 rounded hover:bg-white/[0.06] hover:text-white transition-colors"
              title="Toggle Sidebar"
            >
              <IconSidebar size={13} />
            </button>
            <button class="p-1 rounded hover:bg-white/[0.06] hover:text-white transition-colors" title="Back">
              <IconArrowLeft size={11} />
            </button>
            <button class="p-1 rounded hover:bg-white/[0.06] hover:text-white transition-colors" title="Forward">
              <IconArrowRight size={11} />
            </button>
            <button class="p-1 rounded hover:bg-white/[0.06] hover:text-white transition-colors" title="Search">
              <IconSearch size={11} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setCollapsed(false)}
            class="mx-auto p-1 rounded hover:bg-white/[0.06] text-zinc-400 hover:text-white"
            title="Expand Sidebar"
          >
            <IconAntigravity size={16} class="text-zinc-200" />
          </button>
        )}
      </div>

      {/* Button: + New Conversation */}
      <div class="p-2.5">
        <button
          onClick={props.onNewChat}
          class="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1f2230] hover:bg-[#272b3d] text-zinc-200 hover:text-white text-xs font-medium transition-all border border-white/[0.08] shadow-sm group"
        >
          <IconPlus size={13} class="text-zinc-400 group-hover:text-white transition-colors" />
          {!collapsed() && <span>+ New Conversation</span>}
        </button>
      </div>

      {/* Core Nav Links: Automations, Customizations, Angler, Bestiary */}
      <div class="px-2 pb-2 flex flex-col gap-0.5 border-b border-white/[0.06] text-xs font-medium">
        {/* Automations */}
        <button class="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04] transition-colors">
          <IconClock size={13} class="text-zinc-400" />
          {!collapsed() && <span>Automations</span>}
        </button>

        {/* Customizations / Skills */}
        <button class="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04] transition-colors">
          <IconSliders size={13} class="text-zinc-400" />
          {!collapsed() && <span>Customizations</span>}
        </button>

        {/* Terraria Angler NPC Quests */}
        <button
          onClick={props.onOpenAnglerQuest}
          class={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors group ${
            props.isAnglerQuestReady
              ? 'bg-amber-950/40 border border-amber-500/40 text-amber-300'
              : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]'
          }`}
          title={t('angler.navButton')}
        >
          <div class="flex items-center gap-2.5">
            <IconAnchor size={13} class={props.isAnglerQuestReady ? "text-amber-400" : "text-zinc-400"} />
            {!collapsed() && <span>{t('angler.navButton')}</span>}
          </div>
          {!collapsed() && (
            <Show when={props.isAnglerQuestReady}>
              <span class="text-[9px] font-mono font-bold text-amber-300 bg-amber-950 px-1.5 py-0.5 rounded border border-amber-500/40 animate-pulse">
                {t('angler.readyBadge')}
              </span>
            </Show>
          )}
        </button>

        {/* Bestiary (Fishdex) */}
        <button
          onClick={props.onOpenBestiary}
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04] transition-colors"
          title={t('nav.bestiary')}
        >
          <div class="flex items-center gap-2.5">
            <IconFish size={13} class="text-cyan-400" />
            {!collapsed() && <span>{t('nav.bestiary')}</span>}
          </div>
          {!collapsed() && (
            <span class="text-[9px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
              {props.discoveredCount}
            </span>
          )}
        </button>
      </div>

      {/* Projects Folders Tree (Antigravity Style) */}
      <div class="flex-1 overflow-y-auto px-2 py-3 flex flex-col gap-1 text-xs">
        {!collapsed() && (
          <div class="flex items-center justify-between px-2 pb-1 text-[11px] text-zinc-400 font-medium">
            <span>Projects</span>
            <span class="text-zinc-500 text-[10px]">📁</span>
          </div>
        )}

        {/* Project 1: aquagentic */}
        <div class="flex flex-col">
          <button
            onClick={() => setAquagenticOpen(!aquagenticOpen())}
            class="flex items-center gap-2 px-2 py-1 rounded text-zinc-300 hover:text-white hover:bg-white/[0.04] transition-colors font-medium text-xs text-left"
          >
            <IconFolder size={12} class="text-zinc-500" />
            {!collapsed() && <span class="truncate">aquagentic</span>}
          </button>

          <Show when={aquagenticOpen() && !collapsed()}>
            <div class="pl-5 flex flex-col gap-0.5 mt-0.5">
              <For each={props.sessions}>
                {(session) => {
                  const isActive = props.currentSessionId === session.id;
                  return (
                    <button
                      onClick={() => props.onSelectSession(session.id)}
                      class={`flex items-center justify-between px-2.5 py-1 rounded-lg text-[11px] text-left transition-colors truncate ${
                        isActive
                          ? 'bg-[#212435] text-zinc-100 font-medium'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
                      }`}
                    >
                      <span class="truncate pr-2">{session.title}</span>
                      <span class="text-[9.5px] text-zinc-500 font-mono flex-shrink-0">
                        {session.updatedAt}
                      </span>
                    </button>
                  );
                }}
              </For>
            </div>
          </Show>
        </div>

        {/* Project 2: TCS (Workspace group) */}
        {!collapsed() && (
          <div class="flex flex-col mt-1">
            <button
              onClick={() => setTcsOpen(!tcsOpen())}
              class="flex items-center gap-2 px-2 py-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] transition-colors font-medium text-xs text-left"
            >
              <IconFolder size={12} class="text-zinc-500" />
              <span>TCS</span>
            </button>

            <Show when={tcsOpen()}>
              <div class="pl-5 flex flex-col gap-0.5 mt-0.5 text-[11px] text-zinc-400">
                <div class="flex items-center justify-between px-2.5 py-1 rounded hover:bg-white/[0.03] cursor-pointer">
                  <span class="truncate">Project Valuation And Audit</span>
                  <span class="text-[9.5px] text-zinc-500 font-mono">2h</span>
                </div>
                <div class="flex items-center justify-between px-2.5 py-1 rounded hover:bg-white/[0.03] cursor-pointer">
                  <span class="truncate">Scouting UI/UX Skills Online</span>
                  <span class="text-[9.5px] text-zinc-500 font-mono">2d</span>
                </div>
                <div class="flex items-center justify-between px-2.5 py-1 rounded hover:bg-white/[0.03] cursor-pointer">
                  <span class="truncate">Guía de Uso de Skills</span>
                  <span class="w-1.5 h-1.5 rounded-full bg-blue-400" />
                </div>
                <div class="flex items-center justify-between px-2.5 py-1 rounded hover:bg-white/[0.03] cursor-pointer">
                  <span class="truncate">Actualización de Formulari...</span>
                  <span class="text-[9.5px] text-zinc-500 font-mono">4d</span>
                </div>
                <div class="px-2.5 py-1 text-[10.5px] text-zinc-500 hover:text-zinc-400 cursor-pointer">
                  See all (9)
                </div>
              </div>
            </Show>
          </div>
        )}

        {/* Other Projects listed in screenshot */}
        {!collapsed() && (
          <div class="flex flex-col gap-1 mt-1 text-zinc-400">
            <div class="flex items-center gap-2 px-2 py-1 text-xs hover:text-zinc-200 cursor-pointer">
              <IconFolder size={12} class="text-zinc-500" />
              <span>minero</span>
            </div>
            <div class="flex items-center gap-2 px-2 py-1 text-xs hover:text-zinc-200 cursor-pointer">
              <IconFolder size={12} class="text-zinc-500" />
              <span>roblox</span>
            </div>
            <div class="flex items-center gap-2 px-2 py-1 text-xs hover:text-zinc-200 cursor-pointer">
              <IconFolder size={12} class="text-zinc-500" />
              <span>SmartBussingMobile</span>
            </div>
          </div>
        )}
      </div>

      {/* Pinned Bottom: Settings */}
      <div class="p-2 border-t border-white/[0.06] bg-[#10121a]">
        <button
          class="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] transition-colors text-xs"
          title={t('nav.settings')}
        >
          <IconSettings size={13} class="text-zinc-400" />
          {!collapsed() && <span>Settings</span>}
        </button>
      </div>
    </aside>
  );
};
