import { Component, createSignal, onMount, onCleanup, Show } from 'solid-js';
import { currentLanguage, setCurrentLanguage, t } from '../i18n';
import { IconSettings, IconShield, IconCheck, IconCopy } from './icons';

interface SettingsModalProps {
  onClose: () => void;
  onResetData: () => void;
}

export const SettingsModal: Component<SettingsModalProps> = (props) => {
  const [activeTab, setActiveTab] = createSignal<'keys' | 'prefs' | 'data'>('keys');

  // Load saved keys from localStorage
  const savedVault = () => {
    try {
      const v = localStorage.getItem('aquagentic_vault_keys');
      return v ? JSON.parse(v) : {};
    } catch {
      return {};
    }
  };

  const initialVault = savedVault();
  const [anthropicKey, setAnthropicKey] = createSignal(initialVault.anthropic || '');
  const [openaiKey, setOpenaiKey] = createSignal(initialVault.openai || '');
  const [googleKey, setGoogleKey] = createSignal(initialVault.google || '');
  const [ollamaUrl, setOllamaUrl] = createSignal(initialVault.ollama || 'http://localhost:11434');
  const [savedSuccess, setSavedSuccess] = createSignal(false);

  const handleSaveKeys = () => {
    const vault = {
      anthropic: anthropicKey().trim(),
      openai: openaiKey().trim(),
      google: googleKey().trim(),
      ollama: ollamaUrl().trim()
    };
    localStorage.setItem('aquagentic_vault_keys', JSON.stringify(vault));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') props.onClose();
  };

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    onCleanup(() => window.removeEventListener('keydown', handleKeyDown));
  });

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md select-none animate-fade-in p-4">
      {/* Backdrop click to dismiss */}
      <div class="absolute inset-0" onClick={props.onClose} />

      {/* Main Settings Container */}
      <div class="relative z-10 w-full max-w-xl bg-[#0d0f19]/95 border border-white/[0.1] rounded-2xl p-6 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div class="flex items-center justify-between pb-4 border-b border-white/[0.08] relative z-10">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-zinc-800 border border-white/[0.08] flex items-center justify-center text-zinc-300">
              <IconSettings size={16} />
            </div>
            <div>
              <h2 class="font-bold text-sm tracking-wide text-zinc-100 font-sans">
                {t('settings.title')}
              </h2>
              <p class="text-xs text-zinc-400">
                {t('settings.subtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={props.onClose}
            class="w-7 h-7 rounded-lg hover:bg-white/[0.08] text-zinc-400 hover:text-white flex items-center justify-center transition-colors text-sm font-mono"
            title="Cerrar (Esc)"
          >
            ✕
          </button>
        </div>

        {/* Tab Buttons */}
        <div class="flex items-center gap-2 pt-4 pb-2 border-b border-white/[0.06] text-xs font-sans">
          <button
            onClick={() => setActiveTab('keys')}
            class={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab() === 'keys'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            {t('settings.apiKeysTab')}
          </button>

          <button
            onClick={() => setActiveTab('prefs')}
            class={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab() === 'prefs'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            {t('settings.preferencesTab')}
          </button>

          <button
            onClick={() => setActiveTab('data')}
            class={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab() === 'data'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            {t('settings.dataTab')}
          </button>
        </div>

        {/* Tab 1: BYOK API Keys */}
        <Show when={activeTab() === 'keys'}>
          <div class="py-4 flex flex-col gap-3.5 text-xs font-sans">
            <div class="flex items-center gap-2 p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-cyan-300 text-[11.5px]">
              <IconShield size={16} class="flex-shrink-0" />
              <span>
                Tus claves se guardan únicamente en el almacenamiento local cifrado de tu máquina (BYOK). Nunca se transmiten a servidores de terceros.
              </span>
            </div>

            <div>
              <label class="block text-zinc-300 font-medium mb-1">{t('settings.anthropicKey')}</label>
              <input
                type="password"
                value={anthropicKey()}
                onInput={(e) => setAnthropicKey(e.currentTarget.value)}
                placeholder="sk-ant-api03-..."
                class="w-full px-3 py-2 rounded-xl bg-[#141622] border border-white/[0.08] text-zinc-100 font-mono text-xs focus:outline-none focus:border-cyan-500/60"
              />
            </div>

            <div>
              <label class="block text-zinc-300 font-medium mb-1">{t('settings.googleKey')}</label>
              <input
                type="password"
                value={googleKey()}
                onInput={(e) => setGoogleKey(e.currentTarget.value)}
                placeholder="AIzaSy..."
                class="w-full px-3 py-2 rounded-xl bg-[#141622] border border-white/[0.08] text-zinc-100 font-mono text-xs focus:outline-none focus:border-cyan-500/60"
              />
            </div>

            <div>
              <label class="block text-zinc-300 font-medium mb-1">{t('settings.openaiKey')}</label>
              <input
                type="password"
                value={openaiKey()}
                onInput={(e) => setOpenaiKey(e.currentTarget.value)}
                placeholder="sk-proj-..."
                class="w-full px-3 py-2 rounded-xl bg-[#141622] border border-white/[0.08] text-zinc-100 font-mono text-xs focus:outline-none focus:border-cyan-500/60"
              />
            </div>

            <div>
              <label class="block text-zinc-300 font-medium mb-1">{t('settings.ollamaUrl')}</label>
              <input
                type="text"
                value={ollamaUrl()}
                onInput={(e) => setOllamaUrl(e.currentTarget.value)}
                placeholder="http://localhost:11434"
                class="w-full px-3 py-2 rounded-xl bg-[#141622] border border-white/[0.08] text-zinc-100 font-mono text-xs focus:outline-none focus:border-cyan-500/60"
              />
            </div>

            <div class="flex items-center justify-between pt-2">
              <Show when={savedSuccess()}>
                <span class="text-emerald-400 font-medium text-xs flex items-center gap-1">
                  <IconCheck size={13} />
                  <span>{t('settings.keysSaved')}</span>
                </span>
              </Show>
              <div class="ml-auto">
                <button
                  onClick={handleSaveKeys}
                  class="px-5 py-2 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-black shadow-md shadow-cyan-500/30 transition-all cursor-pointer"
                >
                  {t('settings.saveKeys')}
                </button>
              </div>
            </div>
          </div>
        </Show>

        {/* Tab 2: Preferences */}
        <Show when={activeTab() === 'prefs'}>
          <div class="py-4 flex flex-col gap-4 text-xs font-sans">
            <div>
              <label class="block text-zinc-300 font-medium mb-1.5">{t('settings.language')}</label>
              <div class="flex items-center gap-2">
                <button
                  onClick={() => setCurrentLanguage('es')}
                  class={`px-4 py-2 rounded-xl font-medium transition-all ${
                    currentLanguage() === 'es'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-white/[0.04] text-zinc-400 hover:text-white border border-white/[0.06]'
                  }`}
                >
                  Español (ES)
                </button>

                <button
                  onClick={() => setCurrentLanguage('en')}
                  class={`px-4 py-2 rounded-xl font-medium transition-all ${
                    currentLanguage() === 'en'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-white/[0.04] text-zinc-400 hover:text-white border border-white/[0.06]'
                  }`}
                >
                  English (EN)
                </button>
              </div>
            </div>
          </div>
        </Show>

        {/* Tab 3: Data & Reset */}
        <Show when={activeTab() === 'data'}>
          <div class="py-4 flex flex-col gap-4 text-xs font-sans">
            <div class="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/30 flex flex-col gap-2">
              <span class="font-bold text-rose-300">{t('settings.resetData')}</span>
              <p class="text-zinc-400 text-xs leading-relaxed">
                {t('settings.resetWarning')}
              </p>
              <button
                onClick={() => {
                  if (confirm('¿Estás seguro de que deseas restablecer el progreso del acuario local?')) {
                    props.onResetData();
                  }
                }}
                class="w-fit px-4 py-2 mt-1 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white shadow-md transition-all cursor-pointer"
              >
                {t('settings.resetData')}
              </button>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
};
