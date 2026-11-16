import { Component, For, onMount, onCleanup } from 'solid-js';
import { IconSliders, IconTerminal, IconCheck } from './icons';
import { t } from '../i18n';

interface CustomizationsModalProps {
  onClose: () => void;
}

export const CustomizationsModal: Component<CustomizationsModalProps> = (props) => {
  const mcpServers = [
    { name: 'mcp-filesystem', desc: 'Acceso seguro al sistema de archivos local para lectura/edición.', status: 'Connected' },
    { name: 'mcp-git', desc: 'Inspección de ramas, commits, staged diffs y revisiones.', status: 'Connected' },
    { name: 'mcp-terminal', desc: 'Ejecutor de comandos en entorno de shell controlado.', status: 'Connected' }
  ];

  const installedSkills = [
    { name: 'ui-ux-pro-max', desc: 'Inteligencia de diseño UI/UX, paletas OLED, tipografía y auditoría.' },
    { name: 'antigravity-guide', desc: 'Guía y documentación integral de flujos de trabajo de Antigravity.' },
    { name: 'responsive-craft', desc: 'Diseño adaptable a múltiples resoluciones y vistas previas.' }
  ];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') props.onClose();
  };

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    onCleanup(() => window.removeEventListener('keydown', handleKeyDown));
  });

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md select-none animate-fade-in p-4 font-sans">
      <div class="absolute inset-0" onClick={props.onClose} />

      <div class="relative z-10 w-full max-w-xl bg-[#12141e] border border-white/[0.08] rounded-2xl p-6 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div class="flex items-center justify-between pb-4 border-b border-white/[0.06]">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-300">
              <IconSliders size={15} />
            </div>
            <div>
              <h2 class="font-semibold text-sm text-zinc-100">
                {t('customizations.title')}
              </h2>
              <p class="text-xs text-zinc-400">
                {t('customizations.subtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={props.onClose}
            class="w-7 h-7 rounded-lg hover:bg-white/[0.08] text-zinc-400 hover:text-white flex items-center justify-center text-sm font-mono"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div class="py-4 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
          {/* Section 1: Active MCP Servers */}
          <div>
            <h3 class="text-xs font-semibold text-zinc-200 mb-2 font-mono uppercase tracking-wider">
              {t('customizations.activeTools')}
            </h3>
            <div class="flex flex-col gap-2">
              <For each={mcpServers}>
                {(mcp) => (
                  <div class="p-3 rounded-xl bg-[#141724] border border-white/[0.06] flex items-center justify-between">
                    <div class="flex flex-col">
                      <div class="flex items-center gap-2">
                        <IconTerminal size={12} class="text-cyan-400" />
                        <span class="font-mono text-xs font-semibold text-zinc-100">{mcp.name}</span>
                      </div>
                      <p class="text-[11.5px] text-zinc-400 mt-1">{mcp.desc}</p>
                    </div>
                    <span class="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                      {mcp.status}
                    </span>
                  </div>
                )}
              </For>
            </div>
          </div>

          {/* Section 2: Installed Skills */}
          <div>
            <h3 class="text-xs font-semibold text-zinc-200 mb-2 font-mono uppercase tracking-wider">
              {t('customizations.installedSkills')}
            </h3>
            <div class="flex flex-col gap-2">
              <For each={installedSkills}>
                {(skill) => (
                  <div class="p-3 rounded-xl bg-[#141724] border border-white/[0.06] flex items-center justify-between">
                    <div class="flex flex-col">
                      <span class="font-mono text-xs font-semibold text-zinc-100">{skill.name}</span>
                      <p class="text-[11.5px] text-zinc-400 mt-1">{skill.desc}</p>
                    </div>
                    <span class="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">
                      Active
                    </span>
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
