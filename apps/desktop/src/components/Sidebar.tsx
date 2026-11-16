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
  IconSearch,
  IconShop
} from './icons';

export interface ProjectSession {
  id: string;
  projectId: string;
  title: string;
  updatedAt: string;
  model: string;
  hasUnread?: boolean;
}

export interface ProjectFolder {
  id: string;
  name: string;
  sessions: ProjectSession[];
}

interface SidebarProps {
  currentProjectId: string;
  currentSessionId: string;
  projects: ProjectFolder[];
  selectedModel: string;
  discoveredCount: number;
  isAnglerQuestReady?: boolean;
  hasAffordableUpgrade?: boolean;
  onSelectModel: (model: string) => void;
  onNewChat: () => void;
  onSelectSession: (projectId: string, sessionId: string) => void;
  onOpenBestiary: () => void;
  onOpenAnglerQuest: () => void;
  onOpenShop: () => void;
  onOpenAutomations: () => void;
  onOpenCustomizations: () => void;
  onOpenSettings: () => void;
}

export const Sidebar: Component<SidebarProps> = (props) => {
  const [collapsed, setCollapsed] = createSignal(false);
  const [folderOpenState, setFolderOpenState] = createSignal<Record<string, boolean>>({
    aquagentic: true,
    TCS: true,
    minero: false,
    roblox: false,
    SmartBussingMobile: false
  });

  const toggleFolder = (folderId: string) => {
    setFolderOpenState((prev) => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  return (
    <aside
      class={`h-full bg-[#11131c] border-r border-white/[0.06] flex flex-col transition-all duration-200 z-30 select-none ${
        collapsed() ? 'w-12' : 'w-60'
      }`}
    >
      {/* Top Controls Row */}
      <div class="h-9 px-2.5 flex items-center justify-between border-b border-white/[0.05] text-zinc-400">
        {!collapsed() ? (
          <div class="flex items-center gap-1.5">
            <button class="p-1 rounded hover:bg-white/[0.06] hover:text-white transition-colors" title="Antigravity Home">
              <IconAntigravity size={13} class="text-zinc-300" />
            </button>
            <button
              onClick={() => setCollapsed(true)}
              class="p-1 rounded hover:bg-white/[0.06] hover:text-white transition-colors"
              title="Toggle Sidebar"
            >
              <IconSidebar size={12} />
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
            <IconAntigravity size={15} class="text-zinc-200" />
          </button>
        )}
      </div>

      {/* Button: + New Conversation */}
      <div class="p-2">
        <button
          onClick={props.onNewChat}
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#1a1d29] hover:bg-[#232737] text-zinc-200 hover:text-white text-xs font-medium transition-all border border-white/[0.06] shadow-sm group"
        >
          <div class="flex items-center gap-2">
            <IconPlus size={12} class="text-zinc-400 group-hover:text-white transition-colors" />
            {!collapsed() && <span>+ New Conversation</span>}
          </div>
          {!collapsed() && (
            <span class="text-[9.5px] font-mono text-zinc-500 group-hover:text-zinc-400">Ctrl N</span>
          )}
        </button>
      </div>

      {/* Core Agentic Nav Links: Automations, Customizations */}
      <div class="px-2 pb-1.5 flex flex-col gap-0.5 text-xs font-medium border-b border-white/[0.05]">
        {/* Automations */}
        <button
          onClick={props.onOpenAutomations}
          class="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04] transition-colors text-left"
          title="Automations"
        >
          <IconClock size={12} class="text-zinc-400" />
          {!collapsed() && <span>Automations</span>}
        </button>

        {/* Customizations / Skills */}
        <button
          onClick={props.onOpenCustomizations}
          class="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04] transition-colors text-left"
          title="Customizations"
        >
          <IconSliders size={12} class="text-zinc-400" />
          {!collapsed() && <span>Customizations</span>}
        </button>
      </div>

      {/* Dedicated Aquarium Companion Section */}
      <div class="px-2 py-2 flex flex-col gap-0.5 border-b border-white/[0.05] text-xs">
        {!collapsed() && (
          <div class="px-2 pb-1 text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Aquarium
          </div>
        )}

        {/* Bestiary (Fishdex) */}
        <button
          onClick={props.onOpenBestiary}
          class="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04] transition-colors text-left"
          title={t('nav.bestiary')}
        >
          <div class="flex items-center gap-2.5">
            <IconFish size={12} class="text-cyan-400/80" />
            {!collapsed() && <span>{t('nav.bestiary')}</span>}
          </div>
          {!collapsed() && (
            <span class="text-[9.5px] font-mono text-zinc-400 bg-white/[0.04] px-1.5 py-0.2 rounded border border-white/[0.06]">
              {props.discoveredCount}/22
            </span>
          )}
        </button>

        {/* Terraria Angler NPC Quests */}
        <button
          onClick={props.onOpenAnglerQuest}
          class={`w-full flex items-center justify-between px-2 py-1.5 rounded-md transition-colors text-left group ${
            props.isAnglerQuestReady
              ? 'text-amber-300 bg-amber-950/30 hover:bg-amber-900/30'
              : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]'
          }`}
          title={t('angler.navButton')}
        >
          <div class="flex items-center gap-2.5">
            <IconAnchor size={12} class={props.isAnglerQuestReady ? "text-amber-400" : "text-zinc-400"} />
            {!collapsed() && <span>{t('angler.navButton')}</span>}
          </div>
          {!collapsed() && props.isAnglerQuestReady && (
            <span class="text-[9px] font-mono font-medium text-amber-300 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-600/40">
              {t('angler.readyBadge')}
            </span>
          )}
        </button>

        {/* Shop / Incremental Upgrades */}
        <button
          onClick={props.onOpenShop}
          class="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04] transition-colors text-left"
          title={t('shop.title')}
        >
          <div class="flex items-center gap-2.5">
            <IconShop size={12} class={props.hasAffordableUpgrade ? "text-emerald-400" : "text-zinc-400"} />
            {!collapsed() && <span>{t('nav.shop')}</span>}
          </div>
          {!collapsed() && props.hasAffordableUpgrade && (
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </button>
      </div>

      {/* Projects Folders Tree */}
      <div class="flex-1 overflow-y-auto px-2 py-2.5 flex flex-col gap-1 text-xs">
        {!collapsed() && (
          <div class="flex items-center justify-between px-2 pb-1 text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            <span>Projects</span>
          </div>
        )}

        {/* Dynamic Project Tree */}
        <For each={props.projects}>
          {(project) => {
            const isOpen = () => folderOpenState()[project.id] ?? false;
            const isCurrentProject = () => props.currentProjectId === project.id;

            return (
              <div class="flex flex-col">
                <button
                  onClick={() => toggleFolder(project.id)}
                  class={`flex items-center justify-between px-2 py-1 rounded transition-colors text-xs text-left ${
                    isCurrentProject()
                      ? 'text-zinc-200 font-medium bg-white/[0.04]'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
                  }`}
                >
                  <div class="flex items-center gap-2 truncate">
                    <IconFolder size={11} class={isCurrentProject() ? "text-cyan-400/90" : "text-zinc-500"} />
                    {!collapsed() && <span class="truncate">{project.name}</span>}
                  </div>
                  {!collapsed() && (
                    <span class="text-[9px] text-zinc-600 font-mono">
                      {isOpen() ? '▾' : '▸'}
                    </span>
                  )}
                </button>

                <Show when={isOpen() && !collapsed()}>
                  <div class="pl-3.5 flex flex-col gap-0.5 mt-0.5">
                    <For each={project.sessions}>
                      {(session) => {
                        const isActive = props.currentSessionId === session.id;
                        return (
                          <button
                            onClick={() => props.onSelectSession(project.id, session.id)}
                            class={`flex items-center justify-between px-2 py-1 rounded-md text-[11px] text-left transition-colors truncate ${
                              isActive
                                ? 'bg-[#1e212f] text-zinc-100 font-medium border border-white/[0.05]'
                                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
                            }`}
                          >
                            <span class="truncate pr-2">{session.title}</span>
                            <div class="flex items-center gap-1.5 flex-shrink-0">
                              <Show when={session.hasUnread}>
                                <span class="w-1.5 h-1.5 rounded-full bg-blue-400" />
                              </Show>
                              <span class="text-[9px] text-zinc-500 font-mono">
                                {session.updatedAt}
                              </span>
                            </div>
                          </button>
                        );
                      }}
                    </For>
                  </div>
                </Show>
              </div>
            );
          }}
        </For>
      </div>

      {/* Pinned Bottom: Settings */}
      <div class="p-2 border-t border-white/[0.05] bg-[#0f1118]">
        <button
          onClick={props.onOpenSettings}
          class="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] transition-colors text-xs"
          title={t('nav.settings')}
        >
          <IconSettings size={12} class="text-zinc-400" />
          {!collapsed() && <span>Settings</span>}
        </button>
      </div>
    </aside>
  );
};
