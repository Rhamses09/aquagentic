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
import { Header } from './components/Header';
import { AquariumTank } from './components/AquariumTank';
import { TokenDock } from './components/TokenDock';

export const App: Component = () => {
  const [gameState, setGameState] = createSignal(createInitialState('desktop'));
  const [currentBiome, setCurrentBiome] = createSignal<Biome>('default_ocean');
  const [currentWeather, setCurrentWeather] = createSignal<Weather>('clear');
  const [latestCatch, setLatestCatch] = createSignal<GachaRollResult | null>(null);

  // Economy ticker: Pearls incremented every second based on passive PPS
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

  // Calculate visual swimming fishes with random float paths
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
        topPercent: 18 + ((index * 22) % 65),
        swimDuration: 9 + ((index * 3) % 7),
        swimDelay: (index * 1.8) % 4,
        isShiny,
        scale: 0.9 + ((index % 3) * 0.15)
      };
    }).filter(f => f.def !== undefined);
  });

  // Burn tokens handler
  const handleBurnTokens = (amount: number, promptText: string) => {
    // 1. Auto-detect biome if code or keywords are in prompt
    const detected = detectBiome({ codeSnippet: promptText });
    if (detected !== 'default_ocean') {
      setCurrentBiome(detected);
    }

    setGameState((prev) => {
      const aq = { ...prev.aquarium };
      aq.totalTokensBurned += amount;
      aq.currentBaitProgress += amount;

      // Check for catches (can loop if multiple catches occur from large token burn)
      let catchResult: GachaRollResult | null = null;
      while (aq.currentBaitProgress >= aq.rodTokenCost) {
        aq.currentBaitProgress -= aq.rodTokenCost;

        catchResult = rollGacha(aq, {
          prompt: promptText,
          weather: currentWeather()
        });

        // Apply catch to inventory & active tank
        applyCatchToInventory(aq, catchResult.instance);

        // Update Pity Counters
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
      }

      return {
        ...prev,
        lastUpdated: Date.now(),
        aquarium: aq
      };
    });
  };

  // Simulate streaming chunks (5 chunks of 100 tokens with 250ms interval)
  const handleSimulateStream = (promptText: string) => {
    let chunks = 0;
    const interval = setInterval(() => {
      handleBurnTokens(100, promptText);
      chunks++;
      if (chunks >= 5) {
        clearInterval(interval);
      }
    }, 250);
  };

  // Simulate Glitch error storm
  const handleSimulateGlitch = () => {
    setCurrentWeather('storm');
    // Summon a guaranteed glitch encounter prompt
    handleBurnTokens(500, 'FATAL: Segmentation fault (core dumped) in memory address 0x00000000');
    setTimeout(() => setCurrentWeather('clear'), 12000); // 12 seconds storm
  };

  return (
    <div class="flex flex-col h-screen w-screen overflow-hidden bg-ocean-deep select-none">
      {/* Top Header & Stats */}
      <Header
        pearls={gameState().aquarium.pearls}
        pps={gameState().aquarium.pearlsPerSecond}
        tokensBurned={gameState().aquarium.totalTokensBurned}
        biome={currentBiome()}
        weather={currentWeather()}
        onBiomeChange={(b) => setCurrentBiome(b)}
        onWeatherToggle={() => setCurrentWeather(w => w === 'clear' ? 'storm' : 'clear')}
      />

      {/* Main Aquarium Viewport */}
      <AquariumTank
        biome={currentBiome()}
        weather={currentWeather()}
        activeFishes={swimmingFishes()}
      />

      {/* Token Burning Dock & Catch Modal */}
      <TokenDock
        currentBait={gameState().aquarium.currentBaitProgress}
        rodCost={gameState().aquarium.rodTokenCost}
        rodLevel={gameState().aquarium.rodLevel}
        onBurnTokens={handleBurnTokens}
        onSimulateStream={handleSimulateStream}
        onSimulateGlitch={handleSimulateGlitch}
        latestCatch={latestCatch()}
        onDismissCatch={() => setLatestCatch(null)}
      />
    </div>
  );
};
