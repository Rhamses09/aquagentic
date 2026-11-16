import { Component, For, createSignal, Show } from 'solid-js';
import { t } from '../i18n';
import {
  IconSend,
  IconCopy,
  IconCheck,
  IconPlus,
  IconZap,
  IconChevronDown,
  IconMic,
  IconThumbsUp,
  IconThumbsDown,
  IconSparkles
} from './icons';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  reasoning?: string;
  tokens?: number;
  filesChanged?: string;
  timestamp: string;
}

interface ChatViewProps {
  messages: Message[];
  selectedModel: string;
  isStreaming: boolean;
  onSendMessage: (content: string) => void;
  onSelectModel?: (model: string) => void;
}

export const ChatView: Component<ChatViewProps> = (props) => {
  const [inputText, setInputText] = createSignal('');
  const [copiedId, setCopiedId] = createSignal<string | null>(null);
  const [expandedReasoning, setExpandedReasoning] = createSignal<Record<string, boolean>>({});
  const [speedMode, setSpeedMode] = createSignal<'Turbo' | 'Thinking'>('Turbo');

  const models = [
    'Claude 3.5 Sonnet',
    'Gemini 2.5 Flash',
    'GPT-4o',
    'DeepSeek R1',
    'Ollama Local'
  ];

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

  const toggleReasoning = (msgId: string) => {
    setExpandedReasoning((prev) => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  return (
    <div class="flex-1 flex flex-col h-full bg-transparent relative overflow-hidden select-text font-sans">
      {/* Messages Scroll Container */}
      <div class="flex-1 overflow-y-auto px-4 md:px-12 py-8 flex flex-col gap-6 max-w-3xl w-full mx-auto">
        {/* Empty State / Antigravity Welcome */}
        <Show when={props.messages.length === 0}>
          <div class="my-auto flex flex-col items-center text-center max-w-md mx-auto py-12 select-none">
            <div class="w-10 h-10 rounded-xl bg-[#1c1e2a] border border-white/[0.08] flex items-center justify-center text-zinc-300 mb-3.5 shadow-md">
              <IconSparkles size={18} class="text-cyan-400" />
            </div>

            <h2 class="text-base font-semibold text-zinc-100 tracking-tight mb-1">
              {t('chat.welcomeTitle')}
            </h2>
            <p class="text-xs text-zinc-400 leading-relaxed mb-6">
              {t('chat.welcomeSubtitle')}
            </p>

            {/* Quick Suggestions */}
            <div class="flex flex-col gap-2 w-full text-left font-sans">
              <button
                onClick={() => setInputText(t('chat.suggestion1'))}
                class="px-3.5 py-2.5 rounded-xl bg-[#181a24]/85 hover:bg-[#202331] border border-white/[0.06] hover:border-white/[0.12] transition-all text-xs text-zinc-300 flex items-center justify-between group shadow-sm"
              >
                <span>{t('chat.suggestion1')}</span>
                <span class="text-zinc-500 group-hover:text-zinc-300 font-mono text-[10px]">↵</span>
              </button>
              <button
                onClick={() => setInputText(t('chat.suggestion2'))}
                class="px-3.5 py-2.5 rounded-xl bg-[#181a24]/85 hover:bg-[#202331] border border-white/[0.06] hover:border-white/[0.12] transition-all text-xs text-zinc-300 flex items-center justify-between group shadow-sm"
              >
                <span>{t('chat.suggestion2')}</span>
                <span class="text-zinc-500 group-hover:text-zinc-300 font-mono text-[10px]">↵</span>
              </button>
            </div>
          </div>
        </Show>

        {/* Message Stream */}
        <For each={props.messages}>
          {(msg) => (
            <div class="w-full flex flex-col gap-2">
              {/* USER MESSAGE: Sleek Dark Capsule Right-Aligned (Antigravity Style) */}
              <Show when={msg.role === 'user'}>
                <div class="flex justify-end">
                  <div class="bg-[#212433] border border-white/[0.08] text-zinc-100 rounded-2xl px-4 py-2.5 max-w-xl text-[13px] leading-relaxed shadow-sm">
                    <p class="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              </Show>

              {/* ASSISTANT MESSAGE: Clean Unboxed Document Layout (Antigravity Style) */}
              <Show when={msg.role === 'assistant'}>
                <div class="w-full flex flex-col gap-2 text-zinc-200">
                  {/* Top Bar for Assistant: Files Changed Badge (Like in screenshot: 15 files changed +754 -7) */}
                  <Show when={msg.filesChanged || (msg.tokens && msg.tokens > 100)}>
                    <div class="flex items-center justify-between p-2 px-3 rounded-lg bg-[#181a26]/90 border border-white/[0.06] text-xs">
                      <div class="flex items-center gap-2 text-zinc-400 font-mono text-[11px]">
                        <span class="text-zinc-300 font-medium">{msg.filesChanged || '15 files changed'}</span>
                        <span class="text-emerald-400">+754</span>
                        <span class="text-rose-400">-7</span>
                        <span class="text-zinc-600">›</span>
                      </div>

                      <div class="flex items-center gap-3">
                        <button class="px-2 py-0.5 rounded text-[10.5px] font-medium text-zinc-300 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] transition-colors flex items-center gap-1">
                          Review
                        </button>

                        <div class="flex items-center gap-2 text-zinc-500 text-[11px]">
                          <span>{msg.timestamp}</span>
                          <button
                            onClick={() => copyToClipboard(msg.id, msg.content)}
                            class="hover:text-zinc-300 transition-colors"
                            title="Copy message"
                          >
                            <Show when={copiedId() === msg.id} fallback={<IconCopy size={12} />}>
                              <IconCheck size={12} class="text-emerald-400" />
                            </Show>
                          </button>
                          <button class="hover:text-zinc-300 transition-colors" title="Good response">
                            <IconThumbsUp size={12} />
                          </button>
                          <button class="hover:text-zinc-300 transition-colors" title="Bad response">
                            <IconThumbsDown size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Show>

                  {/* Reasoning Process Accordion (Like in screenshot: Worked for 3m >) */}
                  <Show when={msg.reasoning}>
                    <div class="flex flex-col">
                      <button
                        onClick={() => toggleReasoning(msg.id)}
                        class="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors py-1 w-fit cursor-pointer font-sans"
                      >
                        <span class="font-medium text-zinc-400">Worked for 3m</span>
                        <span class="text-zinc-500 text-[10px]">›</span>
                      </button>

                      <Show when={expandedReasoning()[msg.id]}>
                        <div class="mt-1 p-3 rounded-lg bg-[#141620] border border-white/[0.06] text-xs text-zinc-400 font-mono whitespace-pre-wrap leading-relaxed animate-fade-in">
                          {msg.reasoning}
                        </div>
                      </Show>
                    </div>
                  </Show>

                  {/* Assistant Body Prose */}
                  <div class="text-[13px] leading-relaxed text-zinc-200 whitespace-pre-wrap font-sans">
                    {msg.content}
                  </div>

                  {/* Token counter bottom strip */}
                  <div class="flex items-center gap-3 pt-1 text-[11px] text-zinc-500 font-mono select-none">
                    <span class="flex items-center gap-1 text-cyan-400">
                      <IconZap size={10} />
                      <span>{msg.tokens || 140} tokens</span>
                    </span>
                  </div>
                </div>
              </Show>
            </div>
          )}
        </For>

        {/* Streaming Pulse */}
        <Show when={props.isStreaming}>
          <div class="flex items-center gap-2 text-xs text-zinc-400 py-2">
            <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span class="text-zinc-400 font-sans text-xs">Worked for 12s...</span>
          </div>
        </Show>
      </div>

      {/* Floating Centered Input Capsule (Exact Antigravity Style from Screenshot) */}
      <div class="max-w-3xl w-full mx-auto px-4 pb-4 select-none z-20">
        <div class="bg-[#1a1c27]/95 border border-[#2d3246] rounded-2xl p-2.5 shadow-2xl focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/30 transition-all backdrop-blur-xl">
          {/* Textarea */}
          <textarea
            value={inputText()}
            onInput={(e) => setInputText(e.currentTarget.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything, @ to mention, / for actions"
            rows="2"
            class="w-full bg-transparent text-[13px] text-zinc-100 placeholder-zinc-500 resize-none focus:outline-none px-2 py-1 leading-relaxed font-sans select-text"
          />

          {/* Capsule Bottom Control Row */}
          <div class="flex items-center justify-between pt-1.5 px-1 border-t border-white/[0.04] text-xs">
            {/* Left Controls: + and Model Selector */}
            <div class="flex items-center gap-2">
              <button
                class="w-6 h-6 rounded-md hover:bg-white/[0.08] text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
                title="Add attachment"
              >
                <IconPlus size={13} />
              </button>

              {/* Model Picker Pill */}
              <div class="relative flex items-center gap-1 text-zinc-300 hover:text-white cursor-pointer px-2 py-0.5 rounded hover:bg-white/[0.05] transition-colors text-[11px] font-sans">
                <span>{props.selectedModel}</span>
                <IconChevronDown size={10} class="text-zinc-500" />
              </div>
            </div>

            {/* Right Controls: Mode Toggle, Mic, Send Button */}
            <div class="flex items-center gap-2 text-zinc-400">
              {/* Speed Mode (Turbo / Reasoning) */}
              <button
                onClick={() => setSpeedMode(speedMode() === 'Turbo' ? 'Thinking' : 'Turbo')}
                class="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded hover:bg-white/[0.05] text-zinc-300 hover:text-white transition-colors"
              >
                <IconZap size={10} class={speedMode() === 'Turbo' ? "text-amber-400" : "text-cyan-400"} />
                <span>{speedMode()}</span>
                <IconChevronDown size={10} class="text-zinc-500" />
              </button>

              {/* Mic Icon */}
              <button class="w-6 h-6 rounded-md hover:bg-white/[0.08] text-zinc-400 hover:text-white flex items-center justify-center transition-colors" title="Voice Input">
                <IconMic size={13} />
              </button>

              {/* Action / Send Capsule Button */}
              <button
                onClick={handleSubmit}
                disabled={!inputText().trim() || props.isStreaming}
                class={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  inputText().trim() && !props.isStreaming
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-md shadow-cyan-500/30 cursor-pointer active:scale-95'
                    : 'bg-white/[0.05] text-zinc-600 cursor-not-allowed'
                }`}
                title="Send"
              >
                <IconSend size={11} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
