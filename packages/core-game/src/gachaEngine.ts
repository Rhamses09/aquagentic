import { INITIAL_FISH_CATALOG } from './fishData';
import { AquariumState, CaughtFishInstance, FishDefinition, GachaRollResult, Rarity, Weather } from './types';

// Synchronous SHA-256 with native crypto in Node and hardware-accelerated async in browser
export function sha256Sync(input: string): string {
  try {
    if (typeof process !== 'undefined' && process.versions?.node) {
      // Node.js environment
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const nodeCrypto = require('crypto');
      return nodeCrypto.createHash('sha256').update(input).digest('hex');
    }
  } catch {
    // fallback if require fails in browser bundle
  }

  // Fast 64-char deterministic hash fallback for browser synchronous loops
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57, h3 = 0x9e3779b9, h4 = 0x85ebca6b;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
    h3 = Math.imul(h3 ^ ch, 2246822507);
    h4 = Math.imul(h4 ^ ch, 3266489909);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h3 ^ (h3 >>> 13), 3266489909);
  h3 = Math.imul(h3 ^ (h3 >>> 16), 2246822507) ^ Math.imul(h4 ^ (h4 >>> 13), 3266489909);
  h4 = Math.imul(h4 ^ (h4 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  const hex1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const hex2 = (h2 >>> 0).toString(16).padStart(8, '0');
  const hex3 = (h3 >>> 0).toString(16).padStart(8, '0');
  const hex4 = (h4 >>> 0).toString(16).padStart(8, '0');
  return `${hex1}${hex2}${hex3}${hex4}${hex4}${hex3}${hex2}${hex1}`;
}

export async function sha256(text: string): Promise<string> {
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle) {
    const enc = new TextEncoder().encode(text);
    const buf = await globalThis.crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  return sha256Sync(text);
}

export function formatWeight(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(2)} MB`;
  const gb = mb / 1024;
  if (gb < 1024) return `${gb.toFixed(2)} GB`;
  const tb = gb / 1024;
  return `${tb.toFixed(2)} TB`;
}

// Pity limits
export const PITY_THRESHOLD_EPIC = 30;
export const PITY_THRESHOLD_LEGENDARY = 90;

export interface RollOptions {
  prompt: string;
  weather?: Weather;
  goldenBaitActive?: boolean;
}

export function rollGacha(state: AquariumState, options: RollOptions): GachaRollResult {
  const { prompt, weather = 'clear', goldenBaitActive = false } = options;

  const promptHash = sha256Sync(prompt || `seed_${Date.now()}`);
  const hashSeedInt = parseInt(promptHash.substring(0, 8), 16) || Date.now();

  // Pseudo-random value derived from hash + timestamp
  const rollVal = Math.random();

  let pityTriggered: 'epic' | 'legendary' | null = null;
  let targetRarity: Rarity = 'common';

  // Check Pity
  const currentEpicPity = state.pityCounterEpic + 1;
  const currentLegendaryPity = state.pityCounterLegendary + 1;

  if (currentLegendaryPity >= PITY_THRESHOLD_LEGENDARY) {
    targetRarity = 'legendary';
    pityTriggered = 'legendary';
  } else if (currentEpicPity >= PITY_THRESHOLD_EPIC) {
    targetRarity = 'epic';
    pityTriggered = 'epic';
  } else {
    // Standard Gacha Rates (Golden Bait multiplies high rarity chances)
    const luckMultiplier = goldenBaitActive ? 2.0 : 1.0;
    const mythicRate = 0.001 * luckMultiplier;
    const legendaryRate = 0.009 * luckMultiplier;
    const epicRate = 0.03 * luckMultiplier;
    const rareRate = 0.09 * luckMultiplier;
    const uncommonRate = 0.22 * luckMultiplier;

    if (rollVal < mythicRate) {
      targetRarity = 'mythic';
    } else if (rollVal < mythicRate + legendaryRate) {
      targetRarity = 'legendary';
    } else if (rollVal < mythicRate + legendaryRate + epicRate) {
      targetRarity = 'epic';
    } else if (rollVal < mythicRate + legendaryRate + epicRate + rareRate) {
      targetRarity = 'rare';
    } else if (rollVal < mythicRate + legendaryRate + epicRate + rareRate + uncommonRate) {
      targetRarity = 'uncommon';
    } else {
      targetRarity = 'common';
    }
  }

  // Filter available pool matching rarity and weather
  let pool = INITIAL_FISH_CATALOG.filter((fish) => {
    if (fish.rarity !== targetRarity) return false;
    if (fish.stormOnly && weather !== 'storm') return false;
    return true;
  });

  // Fallback to any fish of that rarity if storm restriction leaves pool empty
  if (pool.length === 0) {
    pool = INITIAL_FISH_CATALOG.filter((f) => f.rarity === targetRarity);
  }

  // Pick deterministically using hashSeedInt
  const selectedFish = pool[hashSeedInt % pool.length];

  // Weight Calculation: deterministic using seed between minWeightKB and maxWeightKB
  const weightSeed = (hashSeedInt % 10000) / 10000;
  const weightKB = selectedFish.minWeightKB + weightSeed * (selectedFish.maxWeightKB - selectedFish.minWeightKB);
  const weightBytes = Math.round(weightKB * 1024);

  // Shiny Chance: 1 in 512 base
  const shinyRoll = Math.floor(Math.random() * 512);
  const isShiny = shinyRoll === 0;

  const caughtAt = Date.now();
  const instance: CaughtFishInstance = {
    id: `catch_${caughtAt}_${hashSeedInt.toString(36)}`,
    fishId: selectedFish.id,
    weightBytes,
    weightFormatted: formatWeight(weightBytes),
    isShiny,
    starRank: 1,
    caughtAt,
    promptHash
  };

  const isNew = !state.inventory[selectedFish.id] || state.inventory[selectedFish.id].count === 0;

  return {
    fish: selectedFish,
    instance,
    isNew,
    pityTriggered,
    baitOverflow: Math.max(0, state.currentBaitProgress - state.rodTokenCost)
  };
}
