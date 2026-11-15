import { Component, For, createSignal } from 'solid-js';
import { currentLanguage, setCurrentLanguage, t } from '../i18n';

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
  onOpenBestiary?: () => void;
}

export const Sidebar: Component<SidebarProps> = (props) => {
  const [collapsed, setCollapsed] = createSignal(false);

  const models = [
    { id: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
    { id: 'gemini-2-5-flash', label: 'Gemini 2.5 Flash', provider: 'Google' },
    { id: 'gpt-4o', label: 'GPT-4o', provider: 'OpenAI' },
    { id: 'deepseek-r1', label: 'DeepSeek R1 (Thinking)', provider: 'DeepSeek' },
    { id: 'ollama-local', label: 'Ollama Local (0 Cost)', provider: 'Local' }
  ];

  return (
    <aside
      class={`h-screen bg-[#10121a] border-r border-white/[0.07] flex flex-col transition-all duration-200 z-20 ${
        collapsed() ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header / Brand */}
      <div class="h-14 px-4 flex items-center justify-between border-b border-white/[0.06]">
        {!collapsed() ? (
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
              <span class="text-sm">🐟</span>
            </div>
            <div>
              <span class="font-bold text-sm text-zinc-100 tracking-tight">Aquagentic</span>
              <span class="ml-1.5 px-1.5 py-0.2 text-[9px] font-semibold bg-cyan-950/80 text-cyan-300 rounded border border-cyan-800/40">
                BYOK
              </span>
            </div>
          </div>
        ) : (
          <div class="w-7 h-7 mx-auto rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center">
            <span class="text-sm">🐟</span>
          </div>
        )}

        {/* Toggle Collapse */}
        <button
          onClick={() => setCollapsed(!collapsed())}
          class="text-zinc-400 hover:text-white p-1 rounded-md hover:bg-white/[0.05] transition-colors"
          title={collapsed() ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Action: New Chat */}
      <div class="p-3">
        <button
          onClick={props.onNewChat}
          class="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-zinc-200 hover:text-white text-xs font-medium transition-all border border-white/[0.08] shadow-sm group"
        >
          <div class="flex items-center gap-2">
            <svg class="w-3.5 h-3.5 text-zinc-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            {!collapsed() && <span>{t('nav.newChat')}</span>}
          </div>
          {!collapsed() && (
            <kbd class="text-[10px] text-zinc-500 font-mono bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.06]">
              Ctrl+N
            </kbd>
          )}
        </button>
      </div>

      {/* Model Selector Pill */}
      {!collapsed() && (
        <div class="px-3 pb-2">
          <label class="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold px-1 block mb-1">
            Model Engine
          </label>
          <div class="relative">
            <select
              value={props.selectedModel}
              onChange={(e) => props.onSelectModel(e.currentTarget.value)}
              class="w-full bg-[#161822] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 font-medium appearance-none focus:outline-none focus:border-cyan-500/60 transition-colors pr-7 cursor-pointer"
            >
              <For each={models}>
                {(m) => <option value={m.id}>{m.label}</option>}
              </For>
            </select>
            <div class="absolute right-2.5 top-2.5 pointer-events-none text-zinc-500">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Session History */}
      <div class="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-1">
        {!collapsed() && (
          <span class="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold px-1 mb-1">
            {t('nav.recentChats')}
          </span>
        )}

        <For each={props.sessions}>
          {(session) => {
            const isActive = session.id === props.currentSessionId;
            return (
              <button
                onClick={() => props.onSelectSession(session.id)}
                class={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors flex items-center justify-between group ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-300 font-medium border border-cyan-500/20'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                }`}
                title={session.title}
              >
                <div class="flex items-center gap-2 truncate">
                  <svg class="w-3.5 h-3.5 shrink-0 text-zinc-400 group-hover:text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {!collapsed() && <span class="truncate">{session.title}</span>}
                </div>
              </button>
            );
          }}
        </For>
      </div>

      {/* Footer Info: MCP Status & Settings */}
      <div class="p-3 border-t border-white/[0.06] flex flex-col gap-2">
        {/* MCP Status */}
        <div class="flex items-center justify-between px-2 py-1.5 rounded-lg bg-emerald-500/[0.07] border border-emerald-500/20 text-emerald-400 text-xs">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {!collapsed() && <span class="text-[11px] font-medium">{t('app.mcpActive')}</span>}
          </div>
          {!collapsed() && <span class="text-[10px] text-emerald-500/80 font-mono">v0.1</span>}
        </div>

        {/* Bottom Options & Language Toggle */}
        <div class="flex items-center justify-between pt-1">
          <div class="flex rounded-md bg-white/[0.05] p-0.5 border border-white/[0.08] text-[11px] font-semibold">
            <button
              onClick={() => setCurrentLanguage('es')}
              class={`px-2 py-0.5 rounded transition-colors ${
                currentLanguage() === 'es' ? 'bg-cyan-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              ES
            </button>
            <button
              onClick={() => setCurrentLanguage('en')}
              class={`px-2 py-0.5 rounded transition-colors ${
                currentLanguage() === 'en' ? 'bg-cyan-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          {!collapsed() && (
            <span class="text-[10px] text-zinc-400 font-mono">
              Desktop Native
            </span>
          )}
        </div>
      </div>
    </aside>
  );
};
