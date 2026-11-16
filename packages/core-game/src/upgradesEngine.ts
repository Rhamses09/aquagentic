import { AquariumState, ShopUpgradeDefinition } from './types';

export const SHOP_UPGRADES: ShopUpgradeDefinition[] = [
  {
    id: 'rod_efficiency',
    category: 'rod',
    nameKey: 'upgrade.rod_efficiency.name',
    descriptionKey: 'upgrade.rod_efficiency.desc',
    baseCostPearls: 150,
    costMultiplier: 2.4,
    maxLevel: 5,
    icon: 'rod'
  },
  {
    id: 'bioluminescent_algae',
    category: 'passive',
    nameKey: 'upgrade.algae.name',
    descriptionKey: 'upgrade.algae.desc',
    baseCostPearls: 100,
    costMultiplier: 1.8,
    maxLevel: 10,
    icon: 'zap'
  },
  {
    id: 'tank_expansion',
    category: 'tank',
    nameKey: 'upgrade.tank.name',
    descriptionKey: 'upgrade.tank.desc',
    baseCostPearls: 500,
    costMultiplier: 3.2,
    maxLevel: 4,
    icon: 'tank'
  },
  {
    id: 'chum_bucket',
    category: 'bait',
    nameKey: 'upgrade.chum.name',
    descriptionKey: 'upgrade.chum.desc',
    baseCostPearls: 350,
    costMultiplier: 2.2,
    maxLevel: 5,
    icon: 'sparkles'
  },
  {
    id: 'pearl_magnet',
    category: 'passive',
    nameKey: 'upgrade.magnet.name',
    descriptionKey: 'upgrade.magnet.desc',
    baseCostPearls: 200,
    costMultiplier: 2.0,
    maxLevel: 5,
    icon: 'magnet'
  }
];

export const UPGRADES_MAP = new Map<string, ShopUpgradeDefinition>(
  SHOP_UPGRADES.map((u) => [u.id, u])
);

/**
 * Calculates the exact pearl cost for the next upgrade level
 */
export function getUpgradeCost(upgradeId: string, currentLevel: number): number {
  const def = UPGRADES_MAP.get(upgradeId);
  if (!def) return Infinity;
  if (currentLevel >= def.maxLevel) return Infinity;

  return Math.round(def.baseCostPearls * Math.pow(def.costMultiplier, currentLevel));
}

/**
 * Calculates effective rod cost in tokens after applying rod efficiency upgrades
 * Base 500 tokens -> reduces down to 120 tokens per catch
 */
export function calculateRodTokenCost(upgrades?: Record<string, number>): number {
  const level = (upgrades && upgrades['rod_efficiency']) || 0;
  // Level 0: 500, 1: 420, 2: 340, 3: 260, 4: 190, 5: 120
  const reductions = [0, 80, 160, 240, 310, 380];
  const reduction = reductions[Math.min(level, reductions.length - 1)] || 0;
  return Math.max(100, 500 - reduction);
}

/**
 * Calculates max swimming fish allowed in the background tank
 * Base 8 fish -> increases up to 16 fish
 */
export function calculateMaxTankCapacity(upgrades?: Record<string, number>): number {
  const level = (upgrades && upgrades['tank_expansion']) || 0;
  return 8 + level * 2; // 8, 10, 12, 14, 16
}

/**
 * Calculates global multiplier for all fish PPS from algae upgrades
 */
export function calculateUpgradesPPSMultiplier(upgrades?: Record<string, number>): number {
  const algaeLvl = (upgrades && upgrades['bioluminescent_algae']) || 0;
  return 1 + algaeLvl * 0.15; // +15% PPS per level
}

/**
 * Buys an incremental shop upgrade if the player has sufficient pearls
 */
export function buyUpgrade(aquarium: AquariumState, upgradeId: string): boolean {
  const def = UPGRADES_MAP.get(upgradeId);
  if (!def) return false;

  aquarium.upgrades = aquarium.upgrades || {};
  const currentLevel = aquarium.upgrades[upgradeId] || 0;

  if (currentLevel >= def.maxLevel) return false;

  const cost = getUpgradeCost(upgradeId, currentLevel);
  if (aquarium.pearls < cost) return false;

  // Deduct pearls and increment level
  aquarium.pearls -= cost;
  aquarium.upgrades[upgradeId] = currentLevel + 1;

  // Dynamically update derived properties
  aquarium.rodTokenCost = calculateRodTokenCost(aquarium.upgrades);
  aquarium.maxTankCapacity = calculateMaxTankCapacity(aquarium.upgrades);

  return true;
}
