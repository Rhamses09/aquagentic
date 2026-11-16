export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

export type Biome = 'low_level' | 'data_swamp' | 'frontend_reef' | 'abyssal_zone' | 'default_ocean';

export type Weather = 'clear' | 'storm';

export interface FishPassive {
  id: string;
  nameKey: string;
  descriptionKey: string;
  type: 'pps_multiplier' | 'bait_charge' | 'common_devourer' | 'local_model_boost';
  value: number;
}

export interface FishDefinition {
  id: string;
  nameKey: string;
  descriptionKey: string;
  rarity: Rarity;
  basePPS: number;
  biome: Biome;
  minWeightKB: number;
  maxWeightKB: number;
  sprite: string;
  stormOnly?: boolean;
  passive?: FishPassive;
}

export interface CaughtFishInstance {
  id: string;
  fishId: string;
  weightBytes: number;
  weightFormatted: string;
  isShiny: boolean;
  starRank: number;
  caughtAt: number;
  promptHash: string;
}

export interface InventoryItem {
  count: number;
  shinyCount: number;
  starRank: number;
  maxWeightBytes: number;
  firstCaughtAt: number;
}

export interface AnglerQuestReward {
  pearls: number;
  chests: number;
  coralFragments?: number;
}

export interface AnglerQuest {
  id: string;
  targetFishId: string;
  requiredBiome?: Biome;
  minWeightKB?: number;
  dialogueKey: string;
  reward: AnglerQuestReward;
  isCompleted: boolean;
}

export interface AquariumState {
  totalTokensBurned: number;
  currentBaitProgress: number;
  rodTokenCost: number;
  pearls: number;
  abyssalPearls: number;
  coralFragments: number;
  pearlsPerSecond: number;
  rodLevel: number;
  pityCounterEpic: number;
  pityCounterLegendary: number;
  activeTankFishIds: string[];
  unlockedBiomes: Biome[];
  unlockedThemes: string[];
  inventory: Record<string, InventoryItem>;
  availableChests?: number;
  activeAnglerQuest?: AnglerQuest | null;
  completedQuestsCount: number;
}

export interface ChatSessionMessage {
  role: 'user' | 'assistant';
  content: string;
  tokens?: number;
}

export interface ChatSession {
  id: string;
  title: string;
  model: string;
  updatedAt: number;
  messages: ChatSessionMessage[];
}

export interface AquagenticSyncState {
  version: number;
  lastUpdated: number;
  deviceOrigin: 'desktop' | 'mobile';
  aquarium: AquariumState;
  recentSessions: ChatSession[];
}

export interface GachaRollResult {
  fish: FishDefinition;
  instance: CaughtFishInstance;
  isNew: boolean;
  pityTriggered: 'epic' | 'legendary' | null;
  baitOverflow: number;
}
