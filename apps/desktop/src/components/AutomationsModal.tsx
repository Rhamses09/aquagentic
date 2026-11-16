import { Component, For, createSignal, onMount, onCleanup } from 'solid-js';
import { IconClock, IconZap, IconCheck } from './icons';
import { t } from '../i18n';

interface AutomationsModalProps {
  onClose: () => void;
  onTriggerJob: (jobName: string) => void;
}

export const AutomationsModal: Component<AutomationsModalProps> = (props) => {
  const [activeJobs, setActiveJobs] = createSignal([
    {
      id: 'job_review',
      nameKey: 'automations.cronReview',
      descKey: 'automations.cronReviewDesc',
      schedule: 'On git commit',
      enabled: true,
      lastRun: '12m ago',
      tokensUsed: 420
    },
    {
      id: 'job_regression',
      nameKey: 'automations.cronRegression',
      descKey: 'automations.cronRegressionDesc',
      schedule: 'Daily at 02:00 AM',
      enabled: true,
      lastRun: 'Yesterday',
      tokensUsed: 1250
    },
    {
      id: 'job_compaction',
      nameKey: 'automations.cronCompaction',
      descKey: 'automations.cronCompactionDesc',
      schedule: 'Hourly',
      enabled: false,
      lastRun: 'Never',
      tokensUsed: 0
    }
  ]);

  const toggleJob = (id: string) => {
    setActiveJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, enabled: !j.enabled } : j))
    );
  };

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
              <IconClock size={15} />
            </div>
            <div>
              <h2 class="font-semibold text-sm text-zinc-100">
                {t('automations.title')}
              </h2>
              <p class="text-xs text-zinc-400">
                {t('automations.subtitle')}
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

        {/* Jobs List */}
        <div class="py-4 flex flex-col gap-3">
          <For each={activeJobs()}>
            {(job) => (
              <div class="p-3.5 rounded-xl bg-[#141724] border border-white/[0.06] flex items-center justify-between gap-4">
                <div class="flex flex-col flex-1">
                  <div class="flex items-center gap-2">
                    <span class="font-semibold text-xs text-zinc-100">
                      {t(job.nameKey)}
                    </span>
                    <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-zinc-400 border border-white/[0.06]">
                      {job.schedule}
                    </span>
                  </div>
                  <p class="text-[11.5px] text-zinc-400 mt-1 leading-relaxed">
                    {t(job.descKey)}
                  </p>
                  <div class="flex items-center gap-3 mt-2 text-[10.5px] font-mono text-zinc-500">
                    <span>Last run: {job.lastRun}</span>
                    <span>•</span>
                    <span class="text-cyan-400 font-medium">⚡ {job.tokensUsed} tokens</span>
                  </div>
                </div>

                <div class="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => props.onTriggerJob(job.id)}
                    class="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 border border-white/[0.08] transition-colors"
                  >
                    Run
                  </button>

                  <button
                    onClick={() => toggleJob(job.id)}
                    class={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                      job.enabled ? 'bg-cyan-600' : 'bg-zinc-700'
                    }`}
                  >
                    <div
                      class={`w-4 h-4 rounded-full bg-white transition-transform ${
                        job.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};
