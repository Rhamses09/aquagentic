import { Component, For, createSignal, Show } from 'solid-js';
import { t } from '../i18n';
import {
  IconSend,
  IconCopy,
  IconCheck,
  IconSparkles,
  IconTerminal,
  IconCpu,
  IconZap,
  IconCode
} from './icons';

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
    <div class="flex-1 flex flex-col h-full bg-transparent relative overflow-hidden select-text">
      {/* Top Session Bar (Client Titlebar Style) */}
      <div class="h-13 border-b border-white/[0.06] px-5 flex items-center justify-between bg-[#0d0f17]/80 backdrop-blur-md z-10 select-none">
        <div class="flex items-center gap-2 text-xs">
          <span class="font-semibold text-zinc-300 font-mono">session_main</span>
          <span class="text-zinc-600">/</span>
          <span class="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
            {props.selectedModel}
          </span>
        </div>

        <div class="flex items-center gap-3 text-xs">
          <div class="flex items-center gap-1.5 text-zinc-400 text-[11px] font-mono">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_#34d399]" />
            <span>Ready</span>
          </div>
          <span class="text-zinc-700">|</span>
          <div class="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
            <IconTerminal size={12} class="text-zinc-400" />
            <span>MCP Sandboxed</span>
          </div>
        </div>
      </div>

      {/* Messages Scroll Container */}
      <div class="flex-1 overflow-y-auto px-4 md:px-10 py-6 flex flex-col gap-5 max-w-4xl w-full mx-auto">
        {/* Empty State / Welcome Screen */}
        <Show when={props.messages.length === 0}>
          <div class="my-auto flex flex-col items-center text-center max-w-lg mx-auto py-10 select-none">
            <div class="w-11 h-11 rounded-xl bg-zinc-900 border border-white/[0.08] flex items-center justify-center text-cyan-400 mb-3.5 shadow-md">
              <IconSparkles size={20} />
            </div>

            <h2 class="text-lg font-bold text-zinc-100 tracking-tight font-sans mb-1.5">
              {t('chat.welcomeTitle')}
            </h2>
            <p class="text-xs text-zinc-400 leading-relaxed mb-6 max-w-md">
              {t('chat.welcomeSubtitle')}
            </p>

            {/* Quick Prompt Cards */}
            <div class="grid grid-cols-1 gap-2 w-full text-left font-mono">
              <button
                onClick={() => setInputText(t('chat.suggestion1'))}
                class="p-3 rounded-xl bg-[#12141e]/90 hover:bg-[#181b29] border border-white/[0.06] hover:border-white/[0.12] transition-all text-xs text-zinc-300 flex items-center justify-between group shadow-sm"
              >
                <div class="flex items-center gap-2.5 truncate">
                  <IconCode size={13} class="text-zinc-500 group-hover:text-cyan-400 transition-colors" />
                  <span class="truncate">{t('chat.suggestion1')}</span>
                </div>
                <span class="text-zinc-600 group-hover:text-cyan-400 transition-colors text-sm">→</span>
              </button>

              <button
                onClick={() => setInputText(t('chat.suggestion2'))}
                class="p-3 rounded-xl bg-[#12141e]/90 hover:bg-[#181b29] border border-white/[0.06] hover:border-white/[0.12] transition-all text-xs text-zinc-300 flex items-center justify-between group shadow-sm"
              >
                <div class="flex items-center gap-2.5 truncate">
                  <IconTerminal size={13} class="text-zinc-500 group-hover:text-cyan-400 transition-colors" />
                  <span class="truncate">{t('chat.suggestion2')}</span>
                </div>
                <span class="text-zinc-600 group-hover:text-cyan-400 transition-colors text-sm">→</span>
              </button>

              <button
                onClick={() => setInputText(t('chat.suggestion3'))}
                class="p-3 rounded-xl bg-[#12141e]/90 hover:bg-[#181b29] border border-white/[0.06] hover:border-white/[0.12] transition-all text-xs text-zinc-300 flex items-center justify-between group shadow-sm"
              >
                <div class="flex items-center gap-2.5 truncate">
                  <IconCpu size={13} class="text-zinc-500 group-hover:text-cyan-400 transition-colors" />
                  <span class="truncate">{t('chat.suggestion3')}</span>
                </div>
                <span class="text-zinc-600 group-hover:text-cyan-400 transition-colors text-sm">→</span>
              </button>
            </div>
          </div>
        </Show>

        {/* Message Stream */}
        <For each={props.messages}>
          {(msg) => (
            <div class={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {/* Assistant Glyph Avatar */}
              {msg.role === 'assistant' && (
                <div class="w-6 h-6 rounded-md bg-zinc-900 border border-white/[0.08] flex items-center justify-center shrink-0 mt-0.5 text-cyan-400 shadow-sm">
                  <IconSparkles size={13} />
                </div>
              )}

              {/* Message Content Container */}
              <div
                class={`flex flex-col gap-1 max-w-[85%] ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                {/* Thinking Process Block (DeepSeek / Reasoning models) */}
                {msg.reasoning && (
                  <details class="w-full bg-[#10131d] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-zinc-400 mb-1">
                    <summary class="cursor-pointer font-medium text-[11px] text-zinc-400 hover:text-zinc-200 list-none flex items-center gap-1.5 font-mono select-none">
                      <IconZap size={11} class="text-amber-400" />
                      <span>{t('chat.reasoning')}</span>
                      <span class="text-[9.5px] text-zinc-500 font-normal">(thinking tokens)</span>
                    </summary>
                    <div class="mt-2 text-[11px] text-zinc-400 font-mono border-t border-white/[0.05] pt-2 whitespace-pre-wrap leading-relaxed">
                      {msg.reasoning}
                    </div>
                  </details>
                )}

                {/* Bubble Body */}
                <div
                  class={`rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#181b26] text-zinc-100 border border-white/[0.08] shadow-sm'
                      : 'bg-[#12141e] text-zinc-200 border border-white/[0.06] w-full shadow-sm'
                  }`}
                >
                  <div class="whitespace-pre-wrap text-[12.5px] leading-relaxed">
                    {msg.content}
                  </div>

                  {/* Actions & Token Badge for Assistant Messages */}
                  {msg.role === 'assistant' && (
                    <div class="mt-2.5 pt-2 border-t border-white/[0.05] flex items-center justify-between text-[10.5px] text-zinc-500 font-mono select-none">
                      <div class="flex items-center gap-1 text-cyan-400">
                        <IconZap size={10} />
                        <span>{msg.tokens || 140} {t('chat.tokensBurned')}</span>
                      </div>

                      <button
                        onClick={() => copyToClipboard(msg.id, msg.content)}
                        class="hover:text-zinc-300 transition-colors flex items-center gap-1 text-[10.5px]"
                      >
                        {copiedId() === msg.id ? (
                          <>
                            <IconCheck size={11} class="text-emerald-400" />
                            <span class="text-emerald-400">{t('chat.copied')}</span>
                          </>
                        ) : (
                          <>
                            <IconCopy size={11} />
                            <span>{t('chat.copy')}</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* User Avatar */}
              {msg.role === 'user' && (
                <div class="w-6 h-6 rounded-md bg-zinc-800 border border-white/[0.1] flex items-center justify-center shrink-0 mt-0.5 text-zinc-300 text-[10px] font-mono">
                  U
                </div>
              )}
            </div>
          )}
        </For>

        {/* Streaming Indicator */}
        {props.isStreaming && (
          <div class="flex gap-2.5 items-center text-xs text-zinc-400 select-none">
            <div class="w-6 h-6 rounded-md bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center shrink-0 text-cyan-400 animate-pulse">
              <IconSparkles size={12} />
            </div>
            <div class="flex items-center gap-1.5 font-mono text-cyan-400 text-xs">
              <span class="animate-pulse">●</span>
              <span class="text-zinc-500 text-[11px]">Streaming tokens to aquarium cast bar...</span>
            </div>
          </div>
        )}
      </div>

      {/* Floating Prompt Bar (Claude / Antigravity Style) */}
      <div class="px-4 md:px-10 pb-4 pt-1 max-w-4xl w-full mx-auto z-10 select-none">
        <div class="bg-[#12141f] border border-white/[0.08] rounded-xl p-2 shadow-2xl focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/30 transition-all">
          <textarea
            value={inputText()}
            onInput={(e) => setInputText(e.currentTarget.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('chat.inputPlaceholder')}
            rows="2"
            class="w-full bg-transparent text-xs text-zinc-100 placeholder-zinc-500 resize-none focus:outline-none px-2 py-1 leading-relaxed font-sans select-text"
          />

          {/* Bar Footer Actions */}
          <div class="flex items-center justify-between pt-1 border-t border-white/[0.04] px-1 font-mono">
            <div class="flex items-center gap-2">
              <span class="text-[10px] text-zinc-400 bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.06]">
                {props.selectedModel}
              </span>
              <span class="text-[9.5px] text-zinc-500">
                ↵ Send • ⇧↵ New line
              </span>
            </div>

            <div class="flex items-center gap-1.5">
              <button
                onClick={handleSubmit}
                disabled={!inputText().trim() || props.isStreaming}
                class={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                  inputText().trim() && !props.isStreaming
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-sm shadow-cyan-500/30 cursor-pointer'
                    : 'bg-white/[0.04] text-zinc-600 cursor-not-allowed'
                }`}
                title="Send message"
              >
                <IconSend size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
