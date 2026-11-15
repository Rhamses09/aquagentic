import { Component, createSignal, onMount, onCleanup, createMemo } from 'solid-js';
import {
  createInitialState,
  rollGacha,
  applyCatchToInventory,
  detectBiome,
  Biome,
  Weather,
  GachaRollResult,
  FISH_MAP
} from '@aquagentic/core-game';
import { Sidebar } from './components/Sidebar';
import { ChatView, Message } from './components/ChatView';
import { AquariumDock } from './components/AquariumDock';
import { CatchNotification } from './components/CatchNotification';

export const App: Component = () => {
  const [gameState, setGameState] = createSignal(createInitialState('desktop'));
  const [currentBiome, setCurrentBiome] = createSignal<Biome>('default_ocean');
  const [currentWeather, setCurrentWeather] = createSignal<Weather>('clear');
  const [latestCatch, setLatestCatch] = createSignal<GachaRollResult | null>(null);

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
      content: '¡Hola! Soy tu asistente agéntico en Aquagentic. Cada prompt, código y token generado alimentará tu caña de pesca en el acuario inferior.',
      tokens: 42,
      timestamp: '12:00'
    }
  ]);

  // Passive PPS Economy Ticker
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

  // Calculate swimming fishes for the ambient dock
  const swimmingFishes = createMemo(() => {
    const aq = gameState().aquarium;
    return aq.activeTankFishIds.map((id, index) => {
      const def = FISH_MAP.get(id);
      const inv = aq.inventory[id];
      const isShiny = inv ? inv.shinyCount > 0 : false;
      return {
        id: `swim_${id}_${index}`,
        def: def!,
        inv,
        topPercent: 12 + ((index * 24) % 55),
        swimDuration: 8 + ((index * 2) % 6),
        swimDelay: (index * 1.5) % 4,
        isShiny,
        scale: 0.85 + ((index % 3) * 0.1)
      };
    }).filter(f => f.def !== undefined);
  });

  // Burn tokens engine
  const handleBurnTokens = (amount: number, promptText: string) => {
    // Detect biome from code or keywords
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
        // Auto-dismiss catch toast after 6 seconds
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

    // Prompt tokens estimate (approx 1 token per 4 chars)
    const promptTokens = Math.max(25, Math.round(text.length / 3));

    // Simulate Agent Streaming chunks
    let accumulatedTokens = 0;
    const interval = setInterval(() => {
      accumulatedTokens += 60;
      handleBurnTokens(60, text);

      if (accumulatedTokens >= 240) {
        clearInterval(interval);
        setIsStreaming(false);

        // Assistant reply with reasoning demo if model is DeepSeek/Thinking
        const isThinking = selectedModel().includes('Thinking') || selectedModel().includes('DeepSeek');
        const assistantMsg: Message = {
          id: `asst_${Date.now()}`,
          role: 'assistant',
          content: `Entendido. He analizado tu solicitud sobre:\n\`\`\`\n${text.substring(0, 120)}\n\`\`\`\nHe preparado la solución asegurando máxima eficiencia, bajo consumo de memoria y compatibilidad completa con el sistema.`,
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
    <div class="flex h-screen w-screen overflow-hidden bg-[#0c0d12] text-zinc-100 select-none">
      {/* Left Sidebar (Claude Desktop / Antigravity Style) */}
      <Sidebar
        currentSessionId={currentSessionId()}
        sessions={sessions()}
        selectedModel={selectedModel()}
        onSelectModel={setSelectedModel}
        onNewChat={handleNewChat}
        onSelectSession={setCurrentSessionId}
      />

      {/* Main Column */}
      <main class="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Chat Conversation View */}
        <ChatView
          messages={messages()}
          selectedModel={selectedModel()}
          isStreaming={isStreaming()}
          onSendMessage={handleSendMessage}
        />

        {/* Ambient Aquarium Dock (Dock Inferior Colapsable) */}
        <AquariumDock
          biome={currentBiome()}
          weather={currentWeather()}
          pearls={gameState().aquarium.pearls}
          pps={gameState().aquarium.pearlsPerSecond}
          currentBait={gameState().aquarium.currentBaitProgress}
          rodCost={gameState().aquarium.rodTokenCost}
          activeFishes={swimmingFishes()}
          onBurnTokens={handleBurnTokens}
          onSimulateStream={handleSendMessage}
          onSimulateGlitch={handleSimulateGlitch}
        />

        {/* Sleek Catch Notification Card */}
        <CatchNotification
          catchResult={latestCatch()}
          onDismiss={() => setLatestCatch(null)}
        />
      </main>
    </div>
  );
};
