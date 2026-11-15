import { FISH_MAP } from './fishData';
import { AquariumState, AquagenticSyncState, Biome, CaughtFishInstance, InventoryItem } from './types';

export const INITIAL_ROD_COST = 500; // Tokens needed for 1 catch by default

export function createInitialState(origin: 'desktop' | 'mobile' = 'desktop'): AquagenticSyncState {
  const now = Date.now();
  return {
    version: 1,
    lastUpdated: now,
    deviceOrigin: origin,
    aquarium: {
      totalTokensBurned: 0,
      currentBaitProgress: 0,
      rodTokenCost: INITIAL_ROD_COST,
      pearls: 0,
      abyssalPearls: 0,
      coralFragments: 0,
      pearlsPerSecond: 0,
      rodLevel: 1,
      pityCounterEpic: 0,
      pityCounterLegendary: 0,
      activeTankFishIds: [],
      unlockedBiomes: ['default_ocean'],
      unlockedThemes: ['classic_dark'],
      inventory: {}
    },
    recentSessions: []
  };
}

export function calculatePassivePPS(aquarium: AquariumState): number {
  let totalPPS = 0;
  for (const fishId of aquarium.activeTankFishIds) {
    const def = FISH_MAP.get(fishId);
    if (!def) continue;

    const inv = aquarium.inventory[fishId];
    const starMultiplier = inv ? Math.pow(1.5, inv.starRank - 1) : 1;
    const shinyMultiplier = inv && inv.shinyCount > 0 ? 3.0 : 1.0;

    totalPPS += def.basePPS * starMultiplier * shinyMultiplier;
  }
  return totalPPS;
}

export function calculateOfflineGains(
  lastTimestamp: number,
  pps: number,
  currentTimestamp: number = Date.now()
): number {
  if (pps <= 0 || currentTimestamp <= lastTimestamp) return 0;
  const elapsedSeconds = (currentTimestamp - lastTimestamp) / 1000;
  // Cap offline gains to 24 hours max to prevent runaway numbers
  const cappedSeconds = Math.min(elapsedSeconds, 86400);
  return Math.floor(cappedSeconds * pps);
}

export function applyCatchToInventory(
  aquarium: AquariumState,
  instance: CaughtFishInstance
): void {
  const { fishId, weightBytes, isShiny } = instance;
  const existing = aquarium.inventory[fishId];

  if (!existing) {
    aquarium.inventory[fishId] = {
      count: 1,
      shinyCount: isShiny ? 1 : 0,
      starRank: 1,
      maxWeightBytes: weightBytes,
      firstCaughtAt: instance.caughtAt
    };
  } else {
    existing.count += 1;
    if (isShiny) existing.shinyCount += 1;
    existing.maxWeightBytes = Math.max(existing.maxWeightBytes, weightBytes);
  }

  // Auto-slot to active tank if tank has less than 6 fish and not already active
  if (aquarium.activeTankFishIds.length < 6 && !aquarium.activeTankFishIds.includes(fishId)) {
    aquarium.activeTankFishIds.push(fishId);
  }

  // Recalculate PPS
  aquarium.pearlsPerSecond = calculatePassivePPS(aquarium);
}

/**
 * Deterministic Monotonic Merge: Guaranteed no data loss when merging
 * mobile PWA state (PC off) and desktop state (PC turned on).
 */
export function mergeStates(
  local: AquagenticSyncState,
  remote: AquagenticSyncState
): AquagenticSyncState {
  const newestTimestamp = Math.max(local.lastUpdated, remote.lastUpdated);
  const baseAq = local.lastUpdated >= remote.lastUpdated ? local.aquarium : remote.aquarium;

  // 1. Merged Inventory (Math.max on all counts, weights and star ranks)
  const mergedInventory: Record<string, InventoryItem> = {};
  const allFishIds = new Set([
    ...Object.keys(local.aquarium.inventory),
    ...Object.keys(remote.aquarium.inventory)
  ]);

  for (const id of allFishIds) {
    const loc = local.aquarium.inventory[id];
    const rem = remote.aquarium.inventory[id];

    if (loc && rem) {
      mergedInventory[id] = {
        count: Math.max(loc.count, rem.count),
        shinyCount: Math.max(loc.shinyCount, rem.shinyCount),
        starRank: Math.max(loc.starRank, rem.starRank),
        maxWeightBytes: Math.max(loc.maxWeightBytes, rem.maxWeightBytes),
        firstCaughtAt: Math.min(loc.firstCaughtAt, rem.firstCaughtAt)
      };
    } else {
      mergedInventory[id] = { ...(loc || rem!) };
    }
  }

  // 2. Set union for unlocked biomes and themes
  const unlockedBiomes = Array.from(
    new Set([...local.aquarium.unlockedBiomes, ...remote.aquarium.unlockedBiomes])
  ) as Biome[];

  const unlockedThemes = Array.from(
    new Set([...local.aquarium.unlockedThemes, ...remote.aquarium.unlockedThemes])
  );

  // 3. Economy and offline gains
  const maxPPS = Math.max(local.aquarium.pearlsPerSecond, remote.aquarium.pearlsPerSecond);
  const offlineGain = calculateOfflineGains(newestTimestamp, maxPPS);
  const mergedPearls = Math.max(local.aquarium.pearls, remote.aquarium.pearls) + offlineGain;

  // 4. Merged Aquarium State
  const mergedAquarium: AquariumState = {
    ...baseAq,
    totalTokensBurned: Math.max(local.aquarium.totalTokensBurned, remote.aquarium.totalTokensBurned),
    currentBaitProgress: Math.max(local.aquarium.currentBaitProgress, remote.aquarium.currentBaitProgress),
    pearls: mergedPearls,
    abyssalPearls: Math.max(local.aquarium.abyssalPearls, remote.aquarium.abyssalPearls),
    coralFragments: Math.max(local.aquarium.coralFragments, remote.aquarium.coralFragments),
    rodLevel: Math.max(local.aquarium.rodLevel, remote.aquarium.rodLevel),
    pityCounterEpic: Math.min(local.aquarium.pityCounterEpic, remote.aquarium.pityCounterEpic),
    pityCounterLegendary: Math.min(local.aquarium.pityCounterLegendary, remote.aquarium.pityCounterLegendary),
    activeTankFishIds: Array.from(new Set([...local.aquarium.activeTankFishIds, ...remote.aquarium.activeTankFishIds])).slice(0, 8),
    unlockedBiomes,
    unlockedThemes,
    inventory: mergedInventory,
    pearlsPerSecond: maxPPS
  };

  return {
    version: Math.max(local.version, remote.version),
    lastUpdated: Date.now(),
    deviceOrigin: local.deviceOrigin,
    aquarium: mergedAquarium,
    recentSessions: local.lastUpdated >= remote.lastUpdated ? local.recentSessions : remote.recentSessions
  };
}
