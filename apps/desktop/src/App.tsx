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
  claimQuestReward,
  SHOP_UPGRADES,
  getUpgradeCost,
  buyUpgrade,
  calculateRodTokenCost,
  calculateMaxTankCapacity
} from '@aquagentic/core-game';
import { Sidebar, ProjectFolder, ProjectSession } from './components/Sidebar';
import { ChatView, Message } from './components/ChatView';
import { AquariumDock } from './components/AquariumDock';
import { CatchNotification } from './components/CatchNotification';
import { BestiaryModal } from './components/BestiaryModal';
import { ChestOpeningModal } from './components/ChestOpeningModal';
import { AnglerQuestModal } from './components/AnglerQuestModal';
import { AntigravityHeader } from './components/AntigravityHeader';
import { AmbientAquariumBackground, SwimmingFishState } from './components/AmbientAquariumBackground';
import { ShopModal } from './components/ShopModal';
import { SettingsModal } from './components/SettingsModal';
import { AutomationsModal } from './components/AutomationsModal';
import { CustomizationsModal } from './components/CustomizationsModal';
import { ReviewDiffModal } from './components/ReviewDiffModal';

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
        parsed.aquarium.upgrades = parsed.aquarium.upgrades || {};
        parsed.aquarium.maxTankCapacity = typeof parsed.aquarium.maxTankCapacity === 'number'
          ? parsed.aquarium.maxTankCapacity
          : 8;

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
      topPercent: 18 + ((index * 20) % 58),
      leftPercent: 15 + ((index * 24) % 68),
      swimDuration: 12 + ((index * 3) % 7),
      animPattern: patterns[index % patterns.length],
      isShiny,
      scale: 1.05 + ((index % 3) * 0.15)
    };
  }).filter(f => f.def !== undefined);
}

export const App: Component = () => {
  const initial = loadInitialState();

  // Fine-grained Reactive Signals
  const [pearls, setPearls] = createSignal<number>(initial.aquarium.pearls);
  const [pps, setPps] = createSignal<number>(initial.aquarium.pearlsPerSecond);
  const [totalTokens, setTotalTokens] = createSignal<number>(initial.aquarium.totalTokensBurned);
  const [currentBait, setCurrentBait] = createSignal<number>(initial.aquarium.currentBaitProgress);
  const [upgrades, setUpgrades] = createSignal<Record<string, number>>(initial.aquarium.upgrades || {});
  const [rodCost, setRodCost] = createSignal<number>(
    calculateRodTokenCost(initial.aquarium.upgrades || {})
  );
  const [maxTankCapacity, setMaxTankCapacity] = createSignal<number>(
    calculateMaxTankCapacity(initial.aquarium.upgrades || {})
  );
  const [pityEpic, setPityEpic] = createSignal<number>(initial.aquarium.pityCounterEpic);
  const [pityLegendary, setPityLegendary] = createSignal<number>(initial.aquarium.pityCounterLegendary);
  const [inventory, setInventory] = createSignal<Record<string, InventoryItem>>(initial.aquarium.inventory || {});
  const [activeTankFishIds, setActiveTankFishIds] = createSignal<string[]>(initial.aquarium.activeTankFishIds || []);
  const [availableChests, setAvailableChests] = createSignal<number>(
    typeof (initial.aquarium as any).availableChests === 'number'
      ? (initial.aquarium as any).availableChests
      : 1
  );

  // Modals visibility signals
  const [isChestModalOpen, setIsChestModalOpen] = createSignal<boolean>(false);
  const [isBestiaryOpen, setIsBestiaryOpen] = createSignal<boolean>(false);
  const [isAnglerModalOpen, setIsAnglerModalOpen] = createSignal<boolean>(false);
  const [isShopOpen, setIsShopOpen] = createSignal<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = createSignal<boolean>(false);
  const [isAutomationsOpen, setIsAutomationsOpen] = createSignal<boolean>(false);
  const [isCustomizationsOpen, setIsCustomizationsOpen] = createSignal<boolean>(false);
  const [isReviewDiffOpen, setIsReviewDiffOpen] = createSignal<boolean>(false);

  // Terraria-style Angler NPC Quests State
  const [activeAnglerQuest, setActiveAnglerQuest] = createSignal<AnglerQuest | null>(
    initial.aquarium.activeAnglerQuest || generateAnglerQuest(0)
  );
  const [completedQuestsCount, setCompletedQuestsCount] = createSignal<number>(
    initial.aquarium.completedQuestsCount || 0
  );

  const isAnglerQuestReady = createMemo(() => {
    const q = activeAnglerQuest();
    if (!q) return false;
    return checkQuestCompletion(q, inventory());
  });

  // Check if player has enough pearls to buy any upgrade
  const hasAffordableUpgrade = createMemo(() => {
    const p = pearls();
    const upg = upgrades();
    return SHOP_UPGRADES.some((u) => {
      const lvl = upg[u.id] || 0;
      if (lvl >= u.maxLevel) return false;
      return p >= getUpgradeCost(u.id, lvl);
    });
  });

  // Swimming fish state
  const [swimmingFishes, setSwimmingFishes] = createSignal<SwimmingFishState[]>(
    buildSwimmingFishes(initial.aquarium.activeTankFishIds || [], initial.aquarium.inventory || {})
  );

  const [currentBiome, setCurrentBiome] = createSignal<Biome>('default_ocean');
  const [currentWeather, setCurrentWeather] = createSignal<Weather>('clear');
  const [latestCatch, setLatestCatch] = createSignal<GachaRollResult | null>(null);

  // Multi-Project & Multi-Session Real Architecture
  const [currentProjectId, setCurrentProjectId] = createSignal<string>('aquagentic');
  const [currentSessionId, setCurrentSessionId] = createSignal<string>('session_aquagentic_1');
  const [selectedModel, setSelectedModel] = createSignal<string>('Gemini 2.5 Flash');
  const [isStreaming, setIsStreaming] = createSignal<boolean>(false);

  const [projects, setProjects] = createSignal<ProjectFolder[]>([
    {
      id: 'aquagentic',
      name: 'aquagentic',
      sessions: [
        {
          id: 'session_aquagentic_1',
          projectId: 'aquagentic',
          title: 'Aquagentic Project Brainstorm Summary',
          updatedAt: 'now',
          model: 'Gemini 2.5 Flash'
        },
        {
          id: 'session_aquagentic_2',
          projectId: 'aquagentic',
          title: 'Monorepo Workspace & Core Game Setup',
          updatedAt: '1h',
          model: 'Claude 3.5 Sonnet'
        }
      ]
    },
    {
      id: 'TCS',
      name: 'TCS',
      sessions: [
        {
          id: 'session_tcs_1',
          projectId: 'TCS',
          title: 'Project Valuation And Audit',
          updatedAt: '2h',
          model: 'Claude 3.5 Sonnet'
        },
        {
          id: 'session_tcs_2',
          projectId: 'TCS',
          title: 'Scouting UI/UX Skills Online',
          updatedAt: '2d',
          model: 'Claude 3.5 Sonnet'
        },
        {
          id: 'session_tcs_3',
          projectId: 'TCS',
          title: 'Guía de Uso de Skills',
          updatedAt: '3d',
          model: 'Gemini 2.5 Flash',
          hasUnread: true
        },
        {
          id: 'session_tcs_4',
          projectId: 'TCS',
          title: 'Actualización de Formularios...',
          updatedAt: '4d',
          model: 'Claude 3.5 Sonnet'
        },
        {
          id: 'session_tcs_5',
          projectId: 'TCS',
          title: 'Cloud Deployment Strategy',
          updatedAt: '5d',
          model: 'GPT-4o',
          hasUnread: true
        },
        {
          id: 'session_tcs_6',
          projectId: 'TCS',
          title: 'Configuración De Correos...',
          updatedAt: '1w',
          model: 'Claude 3.5 Sonnet'
        }
      ]
    },
    {
      id: 'minero',
      name: 'minero',
      sessions: [
        {
          id: 'session_minero_1',
          projectId: 'minero',
          title: 'Algoritmo de Minería y Hashrate',
          updatedAt: '3d',
          model: 'DeepSeek R1'
        },
        {
          id: 'session_minero_2',
          projectId: 'minero',
          title: 'Worker Pool Optimization',
          updatedAt: '1w',
          model: 'Claude 3.5 Sonnet'
        }
      ]
    },
    {
      id: 'roblox',
      name: 'roblox',
      sessions: [
        {
          id: 'session_roblox_1',
          projectId: 'roblox',
          title: 'Luau Event Dispatcher',
          updatedAt: '1w',
          model: 'Claude 3.5 Sonnet'
        },
        {
          id: 'session_roblox_2',
          projectId: 'roblox',
          title: 'Procedural Terrain Generator',
          updatedAt: '2w',
          model: 'Claude 3.5 Sonnet'
        }
      ]
    },
    {
      id: 'SmartBussingMobile',
      name: 'SmartBussingMobile',
      sessions: [
        {
          id: 'session_smart_1',
          projectId: 'SmartBussingMobile',
          title: 'Route Optimization Engine',
          updatedAt: '3w',
          model: 'GPT-4o'
        },
        {
          id: 'session_smart_2',
          projectId: 'SmartBussingMobile',
          title: 'Driver Geofencing Background Service',
          updatedAt: '1mo',
          model: 'Claude 3.5 Sonnet'
        }
      ]
    }
  ]);

  const [messagesBySession, setMessagesBySession] = createSignal<Record<string, Message[]>>({
    session_aquagentic_1: [
      {
        id: 'msg_u1',
        role: 'user',
        content: 'Crea una función reactiva con señales en TypeScript',
        timestamp: '12:04'
      },
      {
        id: 'msg_a1',
        role: 'assistant',
        content: 'Entendido. He procesado tu solicitud sobre:\n```typescript\nCrea una función reactiva con señales en TypeScript\n```\nHe preparado la solución asegurando máxima eficiencia, bajo consumo de memoria y compatibilidad completa con el sistema.',
        tokens: 265,
        timestamp: '12:05'
      },
      {
        id: 'msg_u2',
        role: 'user',
        content: 'y porque la app me sale en blanco ahora mismo',
        timestamp: '12:12'
      },
      {
        id: 'msg_a2',
        role: 'assistant',
        content: `La pantalla en blanco ocurría por dos motivos:\n\n1. **Resolución de Módulo en Vite**: El servidor dev de Vite estaba resolviendo \`@aquagentic/core-game\` contra la carpeta compilada \`dist/index.js\`. Al compilarse con \`tsc\`, la línea \`export * from './types'\` generaba un import en tiempo de ejecución hacia un archivo JS de tipos inexistente (\`ERR_MODULE_NOT_FOUND\`), lo que interrumpía la ejecución del bundle antes de montar SolidJS.\n\n2. **Estado Residual en LocalStorage**: El navegador conservaba en \`localStorage\` IDs de peces antiguos de versiones previas que ya no existían en el nuevo catálogo real de 22 especies marinas.\n\n**Solución aplicada**:\n- **Alias directo de monorepo en Vite**: Ahora Vite apunta directamente a los archivos fuente \`packages/core-game/src/index.ts\`, habilitando Hot Module Replacement (HMR) instantáneo sin depender de compilaciones intermedias.\n- **Migración y Sanitización Automática**: El loader valida las especies marinas contra \`FISH_MAP\` y autoselecciona especies iniciales reales.`,
        reasoning: `1. Analizando stack trace del navegador: ERR_MODULE_NOT_FOUND en dist/types.\n2. Verificando configuración de vite.config.ts y alias de monorepo.\n3. Añadiendo resolución directa a packages/core-game/src/index.ts.`,
        filesChanged: '15 files changed',
        tokens: 480,
        timestamp: '8m ago'
      }
    ],
    session_tcs_1: [
      {
        id: 'msg_tcs_1',
        role: 'user',
        content: 'Revisa la auditoría del proyecto TCS y la estimación de tiempos de entrega para el siguiente sprint.',
        timestamp: '2h ago'
      },
      {
        id: 'msg_tcs_2',
        role: 'assistant',
        content: 'He auditado las métricas de rendimiento y dependencias del proyecto TCS. Las rutas críticas están cubiertas en un 94% y no se detectaron cuellos de botella en la sincronización agéntica.',
        tokens: 195,
        timestamp: '2h ago'
      }
    ],
    session_minero_1: [
      {
        id: 'msg_min_1',
        role: 'user',
        content: 'Optimiza la distribución de carga en los worker threads para el cálculo de hash.',
        timestamp: '3d ago'
      },
      {
        id: 'msg_min_2',
        role: 'assistant',
        content: 'Se implementó un pool dinámico con `SharedArrayBuffer` y `Atomics` para sincronizar el estado sin serialización JSON, reduciendo la latencia de CPU en un 42%.',
        tokens: 220,
        timestamp: '3d ago'
      }
    ]
  });

  const currentMessages = createMemo(() => {
    return messagesBySession()[currentSessionId()] || [];
  });

  const currentSessionTitle = createMemo(() => {
    for (const proj of projects()) {
      const match = proj.sessions.find((s) => s.id === currentSessionId());
      if (match) return match.title;
    }
    return 'Aquagentic Project Brainstorm Summary';
  });

  const currentProjectName = createMemo(() => {
    const proj = projects().find((p) => p.id === currentProjectId());
    return proj ? proj.name : 'aquagentic';
  });

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
          completedQuestsCount: completedQuestsCount(),
          upgrades: upgrades(),
          maxTankCapacity: maxTankCapacity()
        } as any,
        recentSessions: []
      };
      localStorage.setItem('aquagentic_state_v1', JSON.stringify(stateToSave));
    } catch {}
  };

  // Passive PPS Economy Ticker
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

  // Incremental Upgrade Purchase Handler
  const handleBuyUpgrade = (upgradeId: string) => {
    const curPearls = pearls();
    const curUpgrades = { ...upgrades() };
    const curLvl = curUpgrades[upgradeId] || 0;
    const cost = getUpgradeCost(upgradeId, curLvl);
    if (curPearls < cost) return;

    const dummyAquarium: any = {
      pearls: curPearls,
      upgrades: curUpgrades,
      rodTokenCost: rodCost(),
      maxTankCapacity: maxTankCapacity(),
      inventory: inventory(),
      activeTankFishIds: activeTankFishIds(),
      totalTokensBurned: totalTokens(),
      currentBaitProgress: currentBait(),
      pearlsPerSecond: pps(),
      rodLevel: 1,
      pityCounterEpic: pityEpic(),
      pityCounterLegendary: pityLegendary(),
      unlockedBiomes: ['default_ocean'],
      unlockedThemes: ['classic_dark']
    };

    const success = buyUpgrade(dummyAquarium, upgradeId);
    if (success) {
      setPearls(dummyAquarium.pearls);
      setUpgrades({ ...dummyAquarium.upgrades });
      setRodCost(dummyAquarium.rodTokenCost);
      setMaxTankCapacity(dummyAquarium.maxTankCapacity);

      const newPPS = calculatePassivePPS(dummyAquarium);
      setPps(newPPS);
      persistState();
    }
  };

  // Burn tokens engine - Accumulates bait progress, awards chests, gives magnet bonus
  const handleBurnTokens = (amount: number, promptText: string) => {
    const detected = detectBiome({
      codeSnippet: promptText,
      modelName: selectedModel()
    });
    if (detected !== 'default_ocean') {
      setCurrentBiome(detected);
    }

    setTotalTokens((t) => t + amount);

    // Pearl Magnet Upgrade Bonus
    const magnetLvl = upgrades()['pearl_magnet'] || 0;
    if (magnetLvl > 0) {
      const bonusPearls = Math.round(amount * (magnetLvl * 0.05));
      if (bonusPearls > 0) {
        setPearls((p) => p + bonusPearls);
      }
    }

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
      inventory: updatedInv,
      upgrades: upgrades(),
      maxTankCapacity: maxTankCapacity()
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
      inventory: updatedInv,
      upgrades: upgrades(),
      maxTankCapacity: maxTankCapacity()
    });
    setPps(newPPS);

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

  // Toggle fish in/out of the active tank (respecting maxTankCapacity from upgrades)
  const handleToggleActiveTank = (fishId: string) => {
    let currentTank = [...activeTankFishIds()];
    const index = currentTank.indexOf(fishId);

    if (index >= 0) {
      if (currentTank.length > 1) {
        currentTank.splice(index, 1);
      }
    } else {
      if (currentTank.length < maxTankCapacity()) {
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
      inventory: curInv,
      upgrades: upgrades(),
      maxTankCapacity: maxTankCapacity()
    });

    setActiveTankFishIds(currentTank);
    setPps(newPPS);
    setSwimmingFishes(buildSwimmingFishes(currentTank, curInv));
    persistState();
  };

  // Switch active session and project
  const handleSelectSession = (projectId: string, sessionId: string) => {
    setCurrentProjectId(projectId);
    setCurrentSessionId(sessionId);

    // Clear unread indicator
    setProjects((prev) =>
      prev.map((proj) => ({
        ...proj,
        sessions: proj.sessions.map((s) => (s.id === sessionId ? { ...s, hasUnread: false } : s))
      }))
    );
  };

  // New Chat inside current project
  const handleNewChat = () => {
    const newId = `session_${Date.now()}`;
    const pId = currentProjectId();

    const newSession: ProjectSession = {
      id: newId,
      projectId: pId,
      title: 'Nueva conversación',
      updatedAt: 'ahora',
      model: selectedModel()
    };

    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === pId ? { ...proj, sessions: [newSession, ...proj.sessions] } : proj
      )
    );

    setCurrentSessionId(newId);
    setMessagesBySession((prev) => ({
      ...prev,
      [newId]: []
    }));
  };

  // Send message in the active session
  const handleSendMessage = (text: string) => {
    const sId = currentSessionId();
    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessagesBySession((prev) => ({
      ...prev,
      [sId]: [...(prev[sId] || []), userMsg]
    }));

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

        setMessagesBySession((prev) => ({
          ...prev,
          [sId]: [...(prev[sId] || []), assistantMsg]
        }));
      }
    }, 200);
  };

  // Trigger automation job
  const handleTriggerJob = (jobName: string) => {
    handleBurnTokens(180, `Agentic Automation trigger: ${jobName}`);
    const notificationMsg: Message = {
      id: `auto_${Date.now()}`,
      role: 'assistant',
      content: `⚙️ **Automatización Ejecutada**: \`${jobName}\`\n\n- Estado: Completado con éxito\n- Tareas procesadas: 12 verificaciones de integridad\n- Tokens procesados: +180 tk convertidos en progreso de pesca`,
      tokens: 180,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const sId = currentSessionId();
    setMessagesBySession((prev) => ({
      ...prev,
      [sId]: [...(prev[sId] || []), notificationMsg]
    }));
  };

  // Reset local state
  const handleResetData = () => {
    localStorage.removeItem('aquagentic_state_v1');
    localStorage.removeItem('aquagentic_vault_keys');
    window.location.reload();
  };

  const handleSimulateGlitch = () => {
    setCurrentWeather('storm');
    handleBurnTokens(500, 'CRITICAL: SIGSEGV (0x000000) Null pointer dereference in kernel thread');
    setTimeout(() => setCurrentWeather('clear'), 10000);
  };

  return (
    <div class="relative flex flex-col h-screen w-screen overflow-hidden bg-[#0d0f17] text-zinc-100 select-none font-sans">
      {/* 1. Fullscreen Ambient Living Aquarium Background (Z-0) */}
      <AmbientAquariumBackground
        biome={currentBiome()}
        weather={currentWeather()}
        activeFishes={swimmingFishes()}
      />

      {/* 2. Antigravity Desktop Native Header & Breadcrumbs (Z-30) */}
      <AntigravityHeader
        currentSessionTitle={currentSessionTitle()}
        projectName={currentProjectName()}
        onOpenReviewDiff={() => setIsReviewDiffOpen(true)}
      />

      {/* 3. Main Workspace Row (Sidebar + Workspace Container) */}
      <div class="flex-1 flex overflow-hidden relative z-10 bg-transparent">
        {/* Antigravity Left Sidebar (Z-20) */}
        <Sidebar
          currentProjectId={currentProjectId()}
          currentSessionId={currentSessionId()}
          projects={projects()}
          selectedModel={selectedModel()}
          discoveredCount={discoveredCount()}
          isAnglerQuestReady={isAnglerQuestReady()}
          hasAffordableUpgrade={hasAffordableUpgrade()}
          onSelectModel={setSelectedModel}
          onNewChat={handleNewChat}
          onSelectSession={handleSelectSession}
          onOpenBestiary={() => setIsBestiaryOpen(true)}
          onOpenAnglerQuest={() => setIsAnglerModalOpen(true)}
          onOpenShop={() => setIsShopOpen(true)}
          onOpenAutomations={() => setIsAutomationsOpen(true)}
          onOpenCustomizations={() => setIsCustomizationsOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Central Workspace */}
        <main class="flex-1 flex flex-col h-full overflow-hidden relative bg-transparent">
          {/* Antigravity Chat Conversation & Floating Input Capsule */}
          <ChatView
            messages={currentMessages()}
            selectedModel={selectedModel()}
            isStreaming={isStreaming()}
            onSendMessage={handleSendMessage}
            onSelectModel={setSelectedModel}
            onOpenReviewDiff={() => setIsReviewDiffOpen(true)}
          />

          {/* Minimal Bottom IDE Status Bar / Aquarium Dock */}
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
            hasAffordableUpgrade={hasAffordableUpgrade()}
            onOpenAnglerQuest={() => setIsAnglerModalOpen(true)}
            onOpenChestModal={() => setIsChestModalOpen(true)}
            onOpenShop={() => setIsShopOpen(true)}
            onBurnTokens={handleBurnTokens}
            onSimulateStream={handleSendMessage}
            onSimulateGlitch={handleSimulateGlitch}
            onOpenBestiary={() => setIsBestiaryOpen(true)}
          />

          {/* Incremental Pearl Upgrades Shop Modal */}
          <Show when={isShopOpen()}>
            <ShopModal
              pearls={pearls()}
              upgrades={upgrades()}
              onBuyUpgrade={handleBuyUpgrade}
              onClose={() => setIsShopOpen(false)}
            />
          </Show>

          {/* Settings BYOK Modal */}
          <Show when={isSettingsOpen()}>
            <SettingsModal
              onClose={() => setIsSettingsOpen(false)}
              onResetData={handleResetData}
            />
          </Show>

          {/* Automations Modal */}
          <Show when={isAutomationsOpen()}>
            <AutomationsModal
              onClose={() => setIsAutomationsOpen(false)}
              onTriggerJob={handleTriggerJob}
            />
          </Show>

          {/* Customizations / MCP Tools Modal */}
          <Show when={isCustomizationsOpen()}>
            <CustomizationsModal
              onClose={() => setIsCustomizationsOpen(false)}
            />
          </Show>

          {/* Review Diff Modal */}
          <Show when={isReviewDiffOpen()}>
            <ReviewDiffModal
              onClose={() => setIsReviewDiffOpen(false)}
            />
          </Show>

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
              maxTankCapacity={maxTankCapacity()}
              onToggleActiveTank={handleToggleActiveTank}
              onClose={() => setIsBestiaryOpen(false)}
            />
          </Show>
        </main>
      </div>
    </div>
  );
};
