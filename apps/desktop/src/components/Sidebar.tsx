import { Component, For, createSignal } from 'solid-js';
import { currentLanguage, setCurrentLanguage, t } from '../i18n';
import {
  IconPlus,
  IconSidebar,
  IconTerminal,
  IconCpu,
  IconFish,
  IconChevronDown,
  IconMessage,
  IconShield
} from './icons';

interface ChatItem {
  id: string;
  title: string;
  updatedAt: string;
  model: string;
}

interface SidebarProps {
  currentSessionId: string;
  sessions: ChatItem[];
  selectedModel: string;
  onSelectModel: (model: string) => void;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
}

export const Sidebar: Component<SidebarProps> = (props) => {
  const [collapsed, setCollapsed] = createSignal(false);

  const models = [
    { id: 'Claude 3.5 Sonnet', label: 'Claude 3.5 Sonnet', badge: 'Anthropic' },
    { id: 'Gemini 2.5 Flash', label: 'Gemini 2.5 Flash', badge: 'Google' },
    { id: 'GPT-4o', label: 'GPT-4o', badge: 'OpenAI' },
    { id: 'DeepSeek R1 (Thinking)', label: 'DeepSeek R1', badge: 'Reasoning' },
    { id: 'Ollama Local (0 Cost)', label: 'Ollama Local', badge: 'Local BYOK' }
  ];

  return (
    <aside
      class={`h-screen bg-[#0d0f17] border-r border-white/[0.07] flex flex-col transition-all duration-200 z-30 select-none ${
        collapsed() ? 'w-14' : 'w-64'
      }`}
    >
      {/* Top Header / App Brand */}
      <div class="h-13 px-3.5 flex items-center justify-between border-b border-white/[0.06]">
        {!collapsed() ? (
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-700/50 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-950">
              <IconFish size={15} />
            </div>
            <div class="flex flex-col">
              <div class="flex items-center gap-1.5 leading-none">
                <span class="font-bold text-xs text-zinc-100 tracking-tight font-mono">Aquagentic</span>
                <span class="px-1.5 py-0.5 text-[8.5px] font-mono font-semibold bg-white/[0.05] text-zinc-400 rounded border border-white/[0.08]">
                  v0.1
                </span>
              </div>
              <span class="text-[9.5px] text-zinc-400 font-mono mt-0.5">Desktop BYOK Client</span>
            </div>
          </div>
        ) : (
          <div class="w-7 h-7 mx-auto rounded-lg bg-cyan-950/80 border border-cyan-700/50 flex items-center justify-center text-cyan-400">
            <IconFish size={15} />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed())}
          class="text-zinc-500 hover:text-zinc-200 p-1 rounded-md hover:bg-white/[0.05] transition-colors"
          title={collapsed() ? "Expand (Ctrl+B)" : "Collapse (Ctrl+B)"}
        >
          <IconSidebar size={14} />
        </button>
      </div>

      {/* Action: New Session */}
      <div class="p-2.5">
        <button
          onClick={props.onNewChat}
          class="w-full flex items-center justify-between px-2.5 py-2 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 text-zinc-200 hover:text-white text-xs font-medium transition-all border border-white/[0.08] shadow-sm group"
        >
          <div class="flex items-center gap-2">
            <IconPlus size={13} class="text-zinc-400 group-hover:text-white transition-colors" />
            {!collapsed() && <span>{t('nav.newChat')}</span>}
          </div>
          {!collapsed() && (
            <kbd class="text-[9px] text-zinc-400 font-mono bg-black/40 px-1 py-0.5 rounded border border-white/[0.08]">
              Ctrl+N
            </kbd>
          )}
        </button>
      </div>

      {/* Model Engine Selector */}
      {!collapsed() && (
        <div class="px-3 pb-2 pt-1">
          <div class="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold px-0.5 mb-1.5">
            <span>Model Engine</span>
            <IconCpu size={11} />
          </div>
          <div class="relative">
            <select
              value={props.selectedModel}
              onChange={(e) => props.onSelectModel(e.currentTarget.value)}
              class="w-full bg-[#141722] hover:bg-[#181b29] border border-white/[0.08] hover:border-white/[0.14] rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 font-mono appearance-none focus:outline-none focus:border-cyan-500/60 transition-colors pr-7 cursor-pointer"
            >
              <For each={models}>
                {(m) => <option value={m.id}>{m.label}</option>}
              </For>
            </select>
            <div class="absolute right-2.5 top-2.5 pointer-events-none text-zinc-500">
              <IconChevronDown size={12} />
            </div>
          </div>
        </div>
      )}

      {/* Session History */}
      <div class="flex-1 overflow-y-auto px-2.5 py-1 flex flex-col gap-0.5">
        {!collapsed() && (
          <span class="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-semibold px-1 py-1">
            {t('nav.recentChats')}
          </span>
        )}

        <For each={props.sessions}>
          {(session) => {
            const isActive = session.id === props.currentSessionId;
            return (
              <button
                onClick={() => props.onSelectSession(session.id)}
                class={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between group ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-300 font-medium border border-cyan-500/20 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                }`}
                title={session.title}
              >
                <div class="flex items-center gap-2 truncate">
                  <IconMessage size={12} class={isActive ? 'text-cyan-400' : 'text-zinc-500 group-hover:text-zinc-400'} />
                  {!collapsed() && <span class="truncate">{session.title}</span>}
                </div>
              </button>
            );
          }}
        </For>
      </div>

      {/* Footer Status & Language */}
      <div class="p-2.5 border-t border-white/[0.06] flex flex-col gap-2">
        {/* MCP Status Badge */}
        <div class="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#141722] border border-white/[0.06] text-xs">
          <div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
            {!collapsed() && (
              <span class="text-[11px] font-mono text-zinc-300">{t('app.mcpActive')}</span>
            )}
          </div>
          {!collapsed() && (
            <span class="text-[9.5px] text-zinc-500 font-mono flex items-center gap-1">
              <IconTerminal size={10} />
              <span>3 tools</span>
            </span>
          )}
        </div>

        {/* Security & Language Switcher */}
        <div class="flex items-center justify-between pt-0.5">
          {!collapsed() ? (
            <div class="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
              <IconShield size={11} class="text-emerald-400" />
              <span>OS Keychain: Safe</span>
            </div>
          ) : (
            <IconShield size={11} class="text-emerald-400 mx-auto" />
          )}

          {!collapsed() && (
            <div class="flex rounded-md bg-white/[0.04] p-0.5 border border-white/[0.08] text-[10px] font-mono font-semibold">
              <button
                onClick={() => setCurrentLanguage('es')}
                class={`px-1.5 py-0.5 rounded transition-colors ${
                  currentLanguage() === 'es' ? 'bg-cyan-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                ES
              </button>
              <button
                onClick={() => setCurrentLanguage('en')}
                class={`px-1.5 py-0.5 rounded transition-colors ${
                  currentLanguage() === 'en' ? 'bg-cyan-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
