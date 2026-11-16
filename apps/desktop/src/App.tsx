import { Component, createSignal, onMount, onCleanup, createMemo, Show } from 'solid-js';
import {
  createInitialState,
  rollGacha,
  applyCatchToInventory,
  detectBiome,
  calculatePassivePPS,
  Biome,
  Weather,
  GachaRollResult,
  FISH_MAP,
  AquagenticSyncState,
  InventoryItem,
  AnglerQuest,
  generateAnglerQuest,
  checkQuestCompletion,
  claimQuestReward
} from '@aquagentic/core-game';
import { Sidebar } from './components/Sidebar';
import { ChatView, Message } from './components/ChatView';
import { AquariumDock } from './components/AquariumDock';
import { CatchNotification } from './components/CatchNotification';
import { BestiaryModal } from './components/BestiaryModal';
import { ChestOpeningModal } from './components/ChestOpeningModal';
import { AnglerQuestModal } from './components/AnglerQuestModal';
import { AmbientAquariumBackground, SwimmingFishState } from './components/AmbientAquariumBackground';

function loadInitialState(): AquagenticSyncState {
  try {
    const saved = localStorage.getItem('aquagentic_state_v1');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.aquarium) {
        // Ensure active tank fish are valid real species; migrate old legacy fish if needed
        const rawTankIds: string[] = Array.isArray(parsed.aquarium.activeTankFishIds)
          ? parsed.aquarium.activeTankFishIds
          : [];
        const validTankIds = rawTankIds.filter((id) => FISH_MAP.has(id));

        parsed.aquarium.inventory = parsed.aquarium.inventory || {};

        if (validTankIds.length === 0) {
          validTankIds.push('clownfish', 'blue_tang');
          if (!parsed.aquarium.inventory['clownfish']) {
            parsed.aquarium.inventory['clownfish'] = {
              count: 1,
              shinyCount: 0,
              starRank: 1,
              maxWeightBytes: 25000,
              firstCaughtAt: Date.now()
            };
          }
          if (!parsed.aquarium.inventory['blue_tang']) {
            parsed.aquarium.inventory['blue_tang'] = {
              count: 1,
              shinyCount: 0,
              starRank: 1,
              maxWeightBytes: 120000,
              firstCaughtAt: Date.now()
            };
          }
        }
        parsed.aquarium.activeTankFishIds = validTankIds;
        parsed.aquarium.availableChests = typeof parsed.aquarium.availableChests === 'number'
          ? parsed.aquarium.availableChests
          : 1;
        parsed.aquarium.pearls = typeof parsed.aquarium.pearls === 'number'
          ? parsed.aquarium.pearls
          : 50;
        parsed.aquarium.pearlsPerSecond = typeof parsed.aquarium.pearlsPerSecond === 'number'
          ? parsed.aquarium.pearlsPerSecond
          : 2.5;

        return parsed;
      }
    }
  } catch {}
  return createInitialState('desktop');
}

function buildSwimmingFishes(ids: string[], inv: Record<string, InventoryItem>): SwimmingFishState[] {
  const patterns: Array<'fish-patrol-shallow' | 'fish-patrol-deep' | 'fish-patrol-wide' | 'fish-patrol-dart'> = [
    'fish-patrol-shallow',
    'fish-patrol-deep',
    'fish-patrol-wide',
    'fish-patrol-dart'
  ];

  return ids.map((id, index) => {
    const def = FISH_MAP.get(id);
    const item = inv[id];
    const isShiny = item ? item.shinyCount > 0 : false;
    return {
      id: `ocean_fish_${id}_${index}`,
      def: def!,
      inv: item,
      // Distribute evenly across vertical depths: 18%, 38%, 56%, 74%
      topPercent: 18 + ((index * 20) % 58),
      // Distribute across horizontal positions: 15%, 38%, 62%, 82%
      leftPercent: 15 + ((index * 24) % 68),
      swimDuration: 12 + ((index * 3) % 7), // 12s to 18s per loop
      animPattern: patterns[index % patterns.length],
      isShiny,
      scale: 1.05 + ((index % 3) * 0.15)
    };
  }).filter(f => f.def !== undefined);
}

export const App: Component = () => {
  const initial = loadInitialState();

  // Decoupled Fine-Grained Reactive Signals (100% immune to tick re-rendering bugs)
  const [pearls, setPearls] = createSignal<number>(initial.aquarium.pearls);
  const [pps, setPps] = createSignal<number>(initial.aquarium.pearlsPerSecond);
  const [totalTokens, setTotalTokens] = createSignal<number>(initial.aquarium.totalTokensBurned);
  const [currentBait, setCurrentBait] = createSignal<number>(initial.aquarium.currentBaitProgress);
  const [rodCost, setRodCost] = createSignal<number>(initial.aquarium.rodTokenCost);
  const [pityEpic, setPityEpic] = createSignal<number>(initial.aquarium.pityCounterEpic);
  const [pityLegendary, setPityLegendary] = createSignal<number>(initial.aquarium.pityCounterLegendary);
  const [inventory, setInventory] = createSignal<Record<string, InventoryItem>>(initial.aquarium.inventory || {});
  const [activeTankFishIds, setActiveTankFishIds] = createSignal<string[]>(initial.aquarium.activeTankFishIds || []);
  const [availableChests, setAvailableChests] = createSignal<number>(
    typeof (initial.aquarium as any).availableChests === 'number'
      ? (initial.aquarium as any).availableChests
      : 1
  );
  const [isChestModalOpen, setIsChestModalOpen] = createSignal<boolean>(false);

  // Terraria-style Angler NPC Quests State
  const [activeAnglerQuest, setActiveAnglerQuest] = createSignal<AnglerQuest | null>(
    initial.aquarium.activeAnglerQuest || generateAnglerQuest(0)
  );
  const [completedQuestsCount, setCompletedQuestsCount] = createSignal<number>(
    initial.aquarium.completedQuestsCount || 0
  );
  const [isAnglerModalOpen, setIsAnglerModalOpen] = createSignal<boolean>(false);

  // Check if current quest can be turned in
  const isAnglerQuestReady = createMemo(() => {
    const q = activeAnglerQuest();
    if (!q) return false;
    return checkQuestCompletion(q, inventory());
  });

  // STABLE SWIMMING FISH SIGNAL (Updated ONLY on catch / toggle, NEVER on 500ms economy ticks!)
  const [swimmingFishes, setSwimmingFishes] = createSignal<SwimmingFishState[]>(
    buildSwimmingFishes(initial.aquarium.activeTankFishIds || [], initial.aquarium.inventory || {})
  );

  const [currentBiome, setCurrentBiome] = createSignal<Biome>('default_ocean');
  const [currentWeather, setCurrentWeather] = createSignal<Weather>('clear');
  const [latestCatch, setLatestCatch] = createSignal<GachaRollResult | null>(null);
  const [isBestiaryOpen, setIsBestiaryOpen] = createSignal(false);

  // Chat Sessions & Active State
  const [currentSessionId, setCurrentSessionId] = createSignal('session_1');
  const [selectedModel, setSelectedModel] = createSignal('Claude 3.5 Sonnet');
  const [isStreaming, setIsStreaming] = createSignal(false);

  const [sessions, setSessions] = createSignal([
    { id: 'session_1', title: 'Axum Web Server in Rust', updatedAt: 'Hoy', model: 'Claude 3.5 Sonnet' },
    { id: 'session_2', title: 'Signal Reactivity in SolidJS', updatedAt: 'Ayer', model: 'Gemini 2.5 Flash' }
  ]);

  const [messages, setMessages] = createSignal<Message[]>([
    {
      id: 'msg_1',
      role: 'assistant',
      content: '¡Hola! Soy tu asistente agéntico en Aquagentic. Cada prompt, código y llamada MCP alimentará tu caña de pesca en el acuario de fondo.',
      tokens: 42,
      timestamp: '12:00'
    }
  ]);

  // Persist state changes to localStorage
  const persistState = () => {
    try {
      const stateToSave: AquagenticSyncState = {
        version: 1,
        lastUpdated: Date.now(),
        deviceOrigin: 'desktop',
        aquarium: {
          totalTokensBurned: totalTokens(),
          currentBaitProgress: currentBait(),
          rodTokenCost: rodCost(),
          pearls: pearls(),
          abyssalPearls: 0,
          coralFragments: 0,
          pearlsPerSecond: pps(),
          rodLevel: 1,
          pityCounterEpic: pityEpic(),
          pityCounterLegendary: pityLegendary(),
          activeTankFishIds: activeTankFishIds(),
          unlockedBiomes: ['default_ocean'],
          unlockedThemes: ['classic_dark'],
          inventory: inventory(),
          availableChests: availableChests(),
          activeAnglerQuest: activeAnglerQuest(),
          completedQuestsCount: completedQuestsCount()
        } as any,
        recentSessions: []
      };
      localStorage.setItem('aquagentic_state_v1', JSON.stringify(stateToSave));
    } catch {}
  };

  // Passive PPS Economy Ticker (Mutates pearls ONLY, zero effect on fish animations)
  onMount(() => {
    const timer = setInterval(() => {
      const rate = pps();
      if (rate > 0) {
        setPearls((p) => p + rate / 2);
      }
    }, 500);

    onCleanup(() => clearInterval(timer));
  });

  const discoveredCount = createMemo(() => {
    const inv = inventory();
    return Object.keys(inv).filter((id) => inv[id].count > 0).length;
  });

  // Burn tokens engine - Accumulates bait progress and awards Fishing Chests
  const handleBurnTokens = (amount: number, promptText: string) => {
    const detected = detectBiome({
      codeSnippet: promptText,
      modelName: selectedModel()
    });
    if (detected !== 'default_ocean') {
      setCurrentBiome(detected);
    }

    setTotalTokens((t) => t + amount);
    let newBait = currentBait() + amount;
    const currentCost = rodCost();

    let earnedChests = 0;
    while (newBait >= currentCost) {
      newBait -= currentCost;
      earnedChests += 1;
    }

    setCurrentBait(newBait);

    if (earnedChests > 0) {
      setAvailableChests((c) => c + earnedChests);
    }
    persistState();
  };

  // Open 1 Fishing Chest (Interactive Gacha Sequence)
  const handleOpenOneChest = (): GachaRollResult | null => {
    if (availableChests() <= 0) return null;

    setAvailableChests((c) => Math.max(0, c - 1));

    let curPityEpic = pityEpic();
    let curPityLegendary = pityLegendary();
    let updatedInv = { ...inventory() };
    let updatedTank = [...activeTankFishIds()];

    const dummyAquarium = {
      totalTokensBurned: totalTokens(),
      currentBaitProgress: currentBait(),
      rodTokenCost: rodCost(),
      pearls: pearls(),
      abyssalPearls: 0,
      coralFragments: 0,
      pearlsPerSecond: pps(),
      rodLevel: 1,
      pityCounterEpic: curPityEpic,
      pityCounterLegendary: curPityLegendary,
      activeTankFishIds: updatedTank,
      unlockedBiomes: ['default_ocean' as Biome],
      unlockedThemes: ['classic_dark'],
      inventory: updatedInv
    };

    const caughtFish = rollGacha(dummyAquarium, {
      weather: currentWeather()
    });

    applyCatchToInventory(dummyAquarium, caughtFish.instance);
    updatedInv = dummyAquarium.inventory;
    updatedTank = dummyAquarium.activeTankFishIds;

    if (caughtFish.fish.rarity === 'legendary' || caughtFish.fish.rarity === 'mythic') {
      curPityLegendary = 0;
      curPityEpic = 0;
    } else if (caughtFish.fish.rarity === 'epic') {
      curPityEpic = 0;
      curPityLegendary += 1;
    } else {
      curPityEpic += 1;
      curPityLegendary += 1;
    }

    setPityEpic(curPityEpic);
    setPityLegendary(curPityLegendary);
    setInventory(updatedInv);
    setActiveTankFishIds(updatedTank);

    // Recalculate passive PPS
    const newPPS = calculatePassivePPS({
      totalTokensBurned: totalTokens(),
      currentBaitProgress: currentBait(),
      rodTokenCost: rodCost(),
      pearls: pearls(),
      abyssalPearls: 0,
      coralFragments: 0,
      pearlsPerSecond: 0,
      rodLevel: 1,
      pityCounterEpic: curPityEpic,
      pityCounterLegendary: curPityLegendary,
      activeTankFishIds: updatedTank,
      unlockedBiomes: ['default_ocean'],
      unlockedThemes: ['classic_dark'],
      inventory: updatedInv
    });
    setPps(newPPS);

    // Update stable swimming fishes in background with new species
    setSwimmingFishes(buildSwimmingFishes(updatedTank, updatedInv));
    persistState();

    return caughtFish;
  };

  // Claim Terraria-style Angler NPC Quest Reward
  const handleClaimAnglerReward = () => {
    const quest = activeAnglerQuest();
    if (!quest) return;

    const dummyAquarium: any = {
      pearls: pearls(),
      availableChests: availableChests(),
      coralFragments: 0,
      completedQuestsCount: completedQuestsCount(),
      activeAnglerQuest: quest,
      inventory: inventory()
    };

    const result = claimQuestReward(dummyAquarium);
    if (result) {
      setPearls(dummyAquarium.pearls);
      setAvailableChests(dummyAquarium.availableChests);
      setCompletedQuestsCount(dummyAquarium.completedQuestsCount);
      setActiveAnglerQuest(result.nextQuest);
      persistState();
    }
  };

  // Reroll Angler Quest
  const handleRerollAnglerQuest = () => {
    const current = activeAnglerQuest();
    const next = generateAnglerQuest(completedQuestsCount(), current?.targetFishId);
    setActiveAnglerQuest(next);
    persistState();
  };

  // Toggle fish in/out of the active tank
  const handleToggleActiveTank = (fishId: string) => {
    let currentTank = [...activeTankFishIds()];
    const index = currentTank.indexOf(fishId);

    if (index >= 0) {
      if (currentTank.length > 1) {
        currentTank.splice(index, 1);
      }
    } else {
      if (currentTank.length < 8) {
        currentTank.push(fishId);
      }
    }

    const curInv = inventory();
    const newPPS = calculatePassivePPS({
      totalTokensBurned: totalTokens(),
      currentBaitProgress: currentBait(),
      rodTokenCost: rodCost(),
      pearls: pearls(),
      abyssalPearls: 0,
      coralFragments: 0,
      pearlsPerSecond: 0,
      rodLevel: 1,
      pityCounterEpic: pityEpic(),
      pityCounterLegendary: pityLegendary(),
      activeTankFishIds: currentTank,
      unlockedBiomes: ['default_ocean'],
      unlockedThemes: ['classic_dark'],
      inventory: curInv
    });

    setActiveTankFishIds(currentTank);
    setPps(newPPS);
    // UPDATE STABLE FISHES SIGNAL ONLY ON USER TOGGLE
    setSwimmingFishes(buildSwimmingFishes(currentTank, curInv));
    persistState();
  };

  // Handle user sending a prompt in the chat view
  const handleSendMessage = (text: string) => {
    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsStreaming(true);

    const promptTokens = Math.max(25, Math.round(text.length / 3));

    let accumulatedTokens = 0;
    const interval = setInterval(() => {
      accumulatedTokens += 60;
      handleBurnTokens(60, text);

      if (accumulatedTokens >= 240) {
        clearInterval(interval);
        setIsStreaming(false);

        const isThinking = selectedModel().includes('Thinking') || selectedModel().includes('DeepSeek');
        const assistantMsg: Message = {
          id: `asst_${Date.now()}`,
          role: 'assistant',
          content: `Entendido. He procesado tu solicitud sobre:\n\`\`\`\n${text.substring(0, 120)}\n\`\`\`\nHe preparado la solución asegurando máxima eficiencia, bajo consumo de memoria y compatibilidad completa con el sistema.`,
          reasoning: isThinking
            ? '1. Analizando requerimientos de tokens y complejidad algorítmica.\n2. Verificando que no haya bloqueos en el event loop.\n3. Despachando llamada a herramienta MCP.'
            : undefined,
          tokens: promptTokens + 240,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages((prev) => [...prev, assistantMsg]);
      }
    }, 200);
  };

  const handleNewChat = () => {
    const newId = `session_${Date.now()}`;
    setSessions((prev) => [
      { id: newId, title: 'Nueva conversación', updatedAt: 'Ahora', model: selectedModel() },
      ...prev
    ]);
    setCurrentSessionId(newId);
    setMessages([]);
  };

  const handleSimulateGlitch = () => {
    setCurrentWeather('storm');
    handleBurnTokens(500, 'CRITICAL: SIGSEGV (0x000000) Null pointer dereference in kernel thread');
    setTimeout(() => setCurrentWeather('clear'), 10000);
  };

  return (
    <div class="relative flex h-screen w-screen overflow-hidden bg-[#07090e] text-zinc-100 select-none">
      {/* 1. Fullscreen Ambient Living Aquarium Background (Z-0) */}
      <AmbientAquariumBackground
        biome={currentBiome()}
        weather={currentWeather()}
        activeFishes={swimmingFishes()}
      />

      {/* 2. Left Sidebar (Translucent Obsidian Glass, Z-20) */}
      <Sidebar
        currentSessionId={currentSessionId()}
        sessions={sessions()}
        selectedModel={selectedModel()}
        discoveredCount={discoveredCount()}
        isAnglerQuestReady={isAnglerQuestReady()}
        onSelectModel={setSelectedModel}
        onNewChat={handleNewChat}
        onSelectSession={setCurrentSessionId}
        onOpenBestiary={() => setIsBestiaryOpen(true)}
        onOpenAnglerQuest={() => setIsAnglerModalOpen(true)}
      />

      {/* 3. Main Workspace (Transparent container so background shows through, Z-10) */}
      <main class="flex-1 flex flex-col h-screen overflow-hidden relative z-10 bg-transparent">
        {/* Chat Conversation View with Translucent Glass Panels */}
        <ChatView
          messages={messages()}
          selectedModel={selectedModel()}
          isStreaming={isStreaming()}
          onSendMessage={handleSendMessage}
        />

        {/* Minimal Bottom Telemetry Strip */}
        <AquariumDock
          biome={currentBiome()}
          weather={currentWeather()}
          pearls={pearls()}
          pps={pps()}
          currentBait={currentBait()}
          rodCost={rodCost()}
          activeFishCount={swimmingFishes().length}
          availableChests={availableChests()}
          isAnglerQuestReady={isAnglerQuestReady()}
          onOpenAnglerQuest={() => setIsAnglerModalOpen(true)}
          onOpenChestModal={() => setIsChestModalOpen(true)}
          onBurnTokens={handleBurnTokens}
          onSimulateStream={handleSendMessage}
          onSimulateGlitch={handleSimulateGlitch}
          onOpenBestiary={() => setIsBestiaryOpen(true)}
        />

        {/* Terraria Angler NPC Quest Modal */}
        <Show when={isAnglerModalOpen()}>
          <AnglerQuestModal
            quest={activeAnglerQuest()}
            inventory={inventory()}
            completedQuestsCount={completedQuestsCount()}
            onClaimReward={handleClaimAnglerReward}
            onRerollQuest={handleRerollAnglerQuest}
            onClose={() => setIsAnglerModalOpen(false)}
          />
        </Show>

        {/* Gacha Fishing Chest Opening Modal */}
        <Show when={isChestModalOpen()}>
          <ChestOpeningModal
            availableChests={availableChests()}
            onOpenOneChest={handleOpenOneChest}
            onClose={() => setIsChestModalOpen(false)}
          />
        </Show>

        {/* Sleek Catch Notification Card */}
        <CatchNotification
          catchResult={latestCatch()}
          onDismiss={() => setLatestCatch(null)}
        />

        {/* Bestiario / Fishdex Modal */}
        <Show when={isBestiaryOpen()}>
          <BestiaryModal
            inventory={inventory()}
            activeTankIds={activeTankFishIds()}
            onToggleActiveTank={handleToggleActiveTank}
            onClose={() => setIsBestiaryOpen(false)}
          />
        </Show>
      </main>
    </div>
  );
};
