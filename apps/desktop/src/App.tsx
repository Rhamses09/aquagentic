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
  FISH_MAP
} from '@aquagentic/core-game';
import { Sidebar } from './components/Sidebar';
import { ChatView, Message } from './components/ChatView';
import { AquariumDock } from './components/AquariumDock';
import { CatchNotification } from './components/CatchNotification';
import { BestiaryModal } from './components/BestiaryModal';
import { AmbientAquariumBackground, SwimmingFishState } from './components/AmbientAquariumBackground';

export const App: Component = () => {
  const initial = createInitialState('desktop');
  const [gameState, setGameState] = createSignal(initial);
  const [currentBiome, setCurrentBiome] = createSignal<Biome>('default_ocean');
  const [currentWeather, setCurrentWeather] = createSignal<Weather>('clear');
  const [latestCatch, setLatestCatch] = createSignal<GachaRollResult | null>(null);
  const [isBestiaryOpen, setIsBestiaryOpen] = createSignal(false);

  // Active tank occupants isolated signal (to NEVER trigger animation resets during 500ms pearl ticks)
  const [activeTankFishIds, setActiveTankFishIds] = createSignal<string[]>(initial.aquarium.activeTankFishIds);

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

  // Passive PPS Economy Ticker (Isolated to ONLY mutate pearls, zero DOM or animation restarts)
  onMount(() => {
    const timer = setInterval(() => {
      setGameState((prev) => {
        const pps = prev.aquarium.pearlsPerSecond;
        if (pps <= 0) return prev;
        return {
          ...prev,
          lastUpdated: Date.now(),
          aquarium: {
            ...prev.aquarium,
            pearls: prev.aquarium.pearls + pps / 2
          }
        };
      });
    }, 500);

    onCleanup(() => clearInterval(timer));
  });

  // Calculate stable swimming fishes: ONLY updates when fish are added/removed, NEVER on pearl ticks
  const swimmingFishes = createMemo<SwimmingFishState[]>(() => {
    const ids = activeTankFishIds();
    const inv = gameState().aquarium.inventory;

    return ids.map((id, index) => {
      const def = FISH_MAP.get(id);
      const item = inv[id];
      const isShiny = item ? item.shinyCount > 0 : false;
      return {
        id: `ocean_fish_${id}_${index}`,
        def: def!,
        inv: item,
        // Spread evenly across heights: 16%, 34%, 52%, 70%, 84%
        topPercent: 16 + ((index * 22) % 65),
        // Peaceful, natural drifting speed
        swimDuration: 22 + ((index * 4) % 14),
        swimDelay: (index * 2.5) % 8,
        isShiny,
        scale: 0.95 + ((index % 3) * 0.12)
      };
    }).filter(f => f.def !== undefined);
  });

  const discoveredCount = createMemo(() => {
    const inv = gameState().aquarium.inventory;
    return Object.keys(inv).filter(id => inv[id].count > 0).length;
  });

  // Burn tokens engine
  const handleBurnTokens = (amount: number, promptText: string) => {
    const detected = detectBiome({
      codeSnippet: promptText,
      modelName: selectedModel()
    });
    if (detected !== 'default_ocean') {
      setCurrentBiome(detected);
    }

    setGameState((prev) => {
      const aq = { ...prev.aquarium };
      aq.totalTokensBurned += amount;
      aq.currentBaitProgress += amount;

      let catchResult: GachaRollResult | null = null;
      while (aq.currentBaitProgress >= aq.rodTokenCost) {
        aq.currentBaitProgress -= aq.rodTokenCost;

        catchResult = rollGacha(aq, {
          prompt: promptText,
          weather: currentWeather()
        });

        applyCatchToInventory(aq, catchResult.instance);

        if (catchResult.fish.rarity === 'legendary' || catchResult.fish.rarity === 'mythic') {
          aq.pityCounterLegendary = 0;
          aq.pityCounterEpic = 0;
        } else if (catchResult.fish.rarity === 'epic') {
          aq.pityCounterEpic = 0;
          aq.pityCounterLegendary += 1;
        } else {
          aq.pityCounterEpic += 1;
          aq.pityCounterLegendary += 1;
        }
      }

      if (catchResult) {
        setLatestCatch(catchResult);
        // Sync active tank occupants
        setActiveTankFishIds([...aq.activeTankFishIds]);

        setTimeout(() => {
          setLatestCatch(curr => (curr === catchResult ? null : curr));
        }, 6000);
      }

      return {
        ...prev,
        lastUpdated: Date.now(),
        aquarium: aq
      };
    });
  };

  // Toggle fish in/out of the active tank
  const handleToggleActiveTank = (fishId: string) => {
    setGameState((prev) => {
      const aq = { ...prev.aquarium };
      const currentTank = [...aq.activeTankFishIds];
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

      aq.activeTankFishIds = currentTank;
      aq.pearlsPerSecond = calculatePassivePPS(aq);

      // Sync active tank occupants
      setActiveTankFishIds([...currentTank]);

      return {
        ...prev,
        lastUpdated: Date.now(),
        aquarium: aq
      };
    });
  };

  // Handle user sending a prompt in the chat view
  const handleSendMessage = (text: string) => {
    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
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

        setMessages(prev => [...prev, assistantMsg]);
      }
    }, 200);
  };

  const handleNewChat = () => {
    const newId = `session_${Date.now()}`;
    setSessions(prev => [
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
      {/* 1. Fullscreen Ambient Living Aquarium Background */}
      <AmbientAquariumBackground
        biome={currentBiome()}
        weather={currentWeather()}
        activeFishes={swimmingFishes()}
      />

      {/* 2. Left Sidebar (Translucent Obsidian Glass) */}
      <Sidebar
        currentSessionId={currentSessionId()}
        sessions={sessions()}
        selectedModel={selectedModel()}
        discoveredCount={discoveredCount()}
        onSelectModel={setSelectedModel}
        onNewChat={handleNewChat}
        onSelectSession={setCurrentSessionId}
        onOpenBestiary={() => setIsBestiaryOpen(true)}
      />

      {/* 3. Main Workspace */}
      <main class="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
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
          pearls={gameState().aquarium.pearls}
          pps={gameState().aquarium.pearlsPerSecond}
          currentBait={gameState().aquarium.currentBaitProgress}
          rodCost={gameState().aquarium.rodTokenCost}
          activeFishCount={swimmingFishes().length}
          onBurnTokens={handleBurnTokens}
          onSimulateStream={handleSendMessage}
          onSimulateGlitch={handleSimulateGlitch}
          onOpenBestiary={() => setIsBestiaryOpen(true)}
        />

        {/* Sleek Catch Notification Card */}
        <CatchNotification
          catchResult={latestCatch()}
          onDismiss={() => setLatestCatch(null)}
        />

        {/* Bestiario / Fishdex Modal */}
        <Show when={isBestiaryOpen()}>
          <BestiaryModal
            inventory={gameState().aquarium.inventory}
            activeTankIds={activeTankFishIds()}
            onToggleActiveTank={handleToggleActiveTank}
            onClose={() => setIsBestiaryOpen(false)}
          />
        </Show>
      </main>
    </div>
  );
};
