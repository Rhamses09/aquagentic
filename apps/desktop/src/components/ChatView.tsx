import { Component, For, createSignal, Show } from 'solid-js';
import { t } from '../i18n';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  reasoning?: string;
  tokens?: number;
  timestamp: string;
}

interface ChatViewProps {
  messages: Message[];
  selectedModel: string;
  isStreaming: boolean;
  onSendMessage: (content: string) => void;
}

export const ChatView: Component<ChatViewProps> = (props) => {
  const [inputText, setInputText] = createSignal('');
  const [copiedId, setCopiedId] = createSignal<string | null>(null);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const text = inputText().trim();
    if (!text || props.isStreaming) return;
    props.onSendMessage(text);
    setInputText('');
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div class="flex-1 flex flex-col h-full bg-[#0c0d12] relative overflow-hidden">
      {/* Top Session Bar */}
      <div class="h-14 border-b border-white/[0.06] px-6 flex items-center justify-between bg-[#0e1017]/80 backdrop-blur-md z-10">
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold text-zinc-300">Workspace / Default Session</span>
          <span class="text-zinc-600">•</span>
          <span class="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
            {props.selectedModel}
          </span>
        </div>

        <div class="flex items-center gap-2 text-xs text-zinc-400">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span class="text-[11px] font-medium">{t('app.statusOnline')}</span>
        </div>
      </div>

      {/* Messages Scroll Container */}
      <div class="flex-1 overflow-y-auto px-4 md:px-12 py-8 flex flex-col gap-6 max-w-4xl w-full mx-auto">
        {/* Empty State / Welcome Screen */}
        <Show when={props.messages.length === 0}>
          <div class="my-auto flex flex-col items-center text-center max-w-lg mx-auto py-12">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-indigo-600/20 border border-white/[0.08] flex items-center justify-center mb-4 shadow-xl">
              <span class="text-2xl">✨</span>
            </div>

            <h2 class="text-xl font-bold text-zinc-100 tracking-tight mb-2">
              {t('chat.welcomeTitle')}
            </h2>
            <p class="text-xs text-zinc-400 leading-relaxed mb-8">
              {t('chat.welcomeSubtitle')}
            </p>

            {/* Quick Prompt Cards */}
            <div class="grid grid-cols-1 gap-2.5 w-full text-left">
              <button
                onClick={() => setInputText(t('chat.suggestion1'))}
                class="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.12] transition-all text-xs text-zinc-300 group flex items-center justify-between"
              >
                <span>{t('chat.suggestion1')}</span>
                <span class="text-zinc-500 group-hover:text-cyan-400 transition-colors">→</span>
              </button>

              <button
                onClick={() => setInputText(t('chat.suggestion2'))}
                class="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.12] transition-all text-xs text-zinc-300 group flex items-center justify-between"
              >
                <span>{t('chat.suggestion2')}</span>
                <span class="text-zinc-500 group-hover:text-cyan-400 transition-colors">→</span>
              </button>

              <button
                onClick={() => setInputText(t('chat.suggestion3'))}
                class="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.12] transition-all text-xs text-zinc-300 group flex items-center justify-between"
              >
                <span>{t('chat.suggestion3')}</span>
                <span class="text-zinc-500 group-hover:text-cyan-400 transition-colors">→</span>
              </button>
            </div>
          </div>
        </Show>

        {/* Message Stream */}
        <For each={props.messages}>
          {(msg) => (
            <div class={`flex gap-3.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {/* Assistant Avatar */}
              {msg.role === 'assistant' && (
                <div class="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <span class="text-xs">🤖</span>
                </div>
              )}

              {/* Message Content Container */}
              <div
                class={`flex flex-col gap-1.5 max-w-[85%] ${
                  msg.role === 'user'
                    ? 'items-end'
                    : 'items-start'
                }`}
              >
                {/* Thinking / Reasoning Box (DeepSeek / Thinking models) */}
                {msg.reasoning && (
                  <details class="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-3.5 py-2 text-xs text-zinc-400 mb-1 group">
                    <summary class="cursor-pointer font-medium text-[11px] text-zinc-400 hover:text-zinc-200 list-none flex items-center gap-1.5">
                      <span class="text-xs">💭</span>
                      <span>{t('chat.reasoning')}</span>
                      <span class="text-[10px] text-zinc-500 font-mono">(thinking tokens)</span>
                    </summary>
                    <div class="mt-2 text-[11px] text-zinc-400 font-mono border-t border-white/[0.04] pt-2 whitespace-pre-wrap leading-relaxed">
                      {msg.reasoning}
                    </div>
                  </details>
                )}

                {/* Bubble Body */}
                <div
                  class={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#1e2230] text-zinc-100 border border-white/[0.08] shadow-sm'
                      : 'bg-[#14161f] text-zinc-200 border border-white/[0.06] w-full shadow-sm'
                  }`}
                >
                  <div class="whitespace-pre-wrap font-sans text-[13px] leading-relaxed">
                    {msg.content}
                  </div>

                  {/* Actions & Token Badge for Assistant Messages */}
                  {msg.role === 'assistant' && (
                    <div class="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-500">
                      <div class="flex items-center gap-1.5 font-mono text-cyan-400/90">
                        <span>⚡</span>
                        <span>{msg.tokens || 150} {t('chat.tokensBurned')}</span>
                      </div>

                      <button
                        onClick={() => copyToClipboard(msg.id, msg.content)}
                        class="hover:text-zinc-300 transition-colors flex items-center gap-1 text-[11px]"
                      >
                        <span>{copiedId() === msg.id ? '✓ ' + t('chat.copied') : t('chat.copy')}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* User Avatar */}
              {msg.role === 'user' && (
                <div class="w-7 h-7 rounded-lg bg-zinc-800 border border-white/[0.1] flex items-center justify-center shrink-0 mt-0.5">
                  <span class="text-xs">👤</span>
                </div>
              )}
            </div>
          )}
        </For>

        {/* Streaming Indicator */}
        {props.isStreaming && (
          <div class="flex gap-3 items-center text-xs text-zinc-400">
            <div class="w-7 h-7 rounded-lg bg-cyan-900/40 border border-cyan-700/40 flex items-center justify-center shrink-0 animate-pulse">
              <span class="text-xs">🤖</span>
            </div>
            <div class="flex items-center gap-1 font-mono text-cyan-400 text-xs">
              <span class="animate-bounce">●</span>
              <span class="animate-bounce" style={{ "animation-delay": "0.15s" }}>●</span>
              <span class="animate-bounce" style={{ "animation-delay": "0.3s" }}>●</span>
              <span class="ml-1 text-zinc-500">Streaming tokens...</span>
            </div>
          </div>
        )}
      </div>

      {/* Floating Prompt Bar (Claude / Antigravity Style) */}
      <div class="px-4 md:px-12 pb-4 pt-2 max-w-4xl w-full mx-auto z-10">
        <div class="bg-[#141620] border border-white/[0.09] rounded-2xl p-2.5 shadow-2xl focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/30 transition-all">
          <textarea
            value={inputText()}
            onInput={(e) => setInputText(e.currentTarget.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('chat.inputPlaceholder')}
            rows="2"
            class="w-full bg-transparent text-xs text-zinc-100 placeholder-zinc-500 resize-none focus:outline-none px-2 py-1 leading-relaxed font-sans"
          />

          {/* Bar Footer Actions */}
          <div class="flex items-center justify-between pt-1 border-t border-white/[0.05] mt-1 px-1">
            <div class="flex items-center gap-2">
              <span class="text-[11px] font-mono text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
                {props.selectedModel}
              </span>
              <span class="text-[10px] text-zinc-500 font-mono">
                Tokens feed Aquarium Cast Bar
              </span>
            </div>

            <div class="flex items-center gap-2">
              <button
                onClick={handleSubmit}
                disabled={!inputText().trim() || props.isStreaming}
                class={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                  inputText().trim() && !props.isStreaming
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-md shadow-cyan-500/30 cursor-pointer'
                    : 'bg-white/[0.05] text-zinc-600 cursor-not-allowed'
                }`}
                title="Send (Enter)"
              >
                <svg class="w-4 h-4 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 19V5m0 0l-7 7m7-7l7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
