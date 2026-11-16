import { FISH_MAP, INITIAL_FISH_CATALOG } from './fishData';
import { AnglerQuest, AnglerQuestReward, AquariumState, InventoryItem, Rarity } from './types';

export interface QuestTemplate {
  fishId: string;
  dialogueKey: string;
}

export const ANGLER_QUEST_TEMPLATES: QuestTemplate[] = [
  { fishId: 'clownfish', dialogueKey: 'angler.quest.clownfish' },
  { fishId: 'blue_tang', dialogueKey: 'angler.quest.blue_tang' },
  { fishId: 'seahorse', dialogueKey: 'angler.quest.seahorse' },
  { fishId: 'french_angelfish', dialogueKey: 'angler.quest.french_angelfish' },
  { fishId: 'lionfish', dialogueKey: 'angler.quest.lionfish' },
  { fishId: 'mandarin_dragonet', dialogueKey: 'angler.quest.mandarin_dragonet' },
  { fishId: 'copperband_butterfly', dialogueKey: 'angler.quest.copperband_butterfly' },
  { fishId: 'pufferfish', dialogueKey: 'angler.quest.pufferfish' },
  { fishId: 'blue_ringed_octopus', dialogueKey: 'angler.quest.blue_ringed_octopus' },
  { fishId: 'anglerfish', dialogueKey: 'angler.quest.anglerfish' },
  { fishId: 'moray_eel', dialogueKey: 'angler.quest.moray_eel' },
  { fishId: 'hammerhead_shark', dialogueKey: 'angler.quest.hammerhead_shark' },
  { fishId: 'manta_ray', dialogueKey: 'angler.quest.manta_ray' },
  { fishId: 'sailfish', dialogueKey: 'angler.quest.sailfish' },
  { fishId: 'whale_shark', dialogueKey: 'angler.quest.whale_shark' },
  { fishId: 'coelacanth', dialogueKey: 'angler.quest.coelacanth' }
];

function calculateRewardForRarity(rarity: Rarity, completedCount: number): AnglerQuestReward {
  const questBonusMultiplier = 1 + Math.min(2.0, completedCount * 0.05);

  switch (rarity) {
    case 'common':
      return {
        pearls: Math.round(250 * questBonusMultiplier),
        chests: 1
      };
    case 'uncommon':
      return {
        pearls: Math.round(500 * questBonusMultiplier),
        chests: 1
      };
    case 'rare':
      return {
        pearls: Math.round(1000 * questBonusMultiplier),
        chests: 2
      };
    case 'epic':
      return {
        pearls: Math.round(2000 * questBonusMultiplier),
        chests: 2,
        coralFragments: 1
      };
    case 'legendary':
    case 'mythic':
      return {
        pearls: Math.round(4500 * questBonusMultiplier),
        chests: 3,
        coralFragments: 3
      };
    default:
      return { pearls: 250, chests: 1 };
  }
}

/**
 * Generates an Angler Quest inspired by Terraria's Angler NPC
 */
export function generateAnglerQuest(completedCount: number, excludeFishId?: string): AnglerQuest {
  const eligible = ANGLER_QUEST_TEMPLATES.filter((t) => t.fishId !== excludeFishId);
  const choice = eligible[Math.floor(Math.random() * eligible.length)] || ANGLER_QUEST_TEMPLATES[0];
  const def = FISH_MAP.get(choice.fishId) || INITIAL_FISH_CATALOG[0];

  const reward = calculateRewardForRarity(def.rarity, completedCount);

  return {
    id: `quest_${Date.now()}_${choice.fishId}`,
    targetFishId: choice.fishId,
    requiredBiome: def.biome,
    dialogueKey: choice.dialogueKey,
    reward,
    isCompleted: false
  };
}

/**
 * Checks if the user currently holds the required fish in their inventory
 */
export function checkQuestCompletion(
  quest: AnglerQuest,
  inventory: Record<string, InventoryItem>
): boolean {
  if (!quest || !quest.targetFishId) return false;
  const item = inventory[quest.targetFishId];
  return !!item && item.count > 0;
}

/**
 * Claims the current quest reward and automatically rolls the next quest
 */
export function claimQuestReward(
  aquarium: AquariumState
): { reward: AnglerQuestReward; nextQuest: AnglerQuest } | null {
  const quest = aquarium.activeAnglerQuest;
  if (!quest) return null;

  const isEligible = checkQuestCompletion(quest, aquarium.inventory);
  if (!isEligible) return null;

  // Award pearls and chests
  aquarium.pearls += quest.reward.pearls;
  aquarium.availableChests = (aquarium.availableChests || 0) + quest.reward.chests;
  if (quest.reward.coralFragments) {
    aquarium.coralFragments = (aquarium.coralFragments || 0) + quest.reward.coralFragments;
  }

  aquarium.completedQuestsCount = (aquarium.completedQuestsCount || 0) + 1;

  // Roll next quest
  const nextQuest = generateAnglerQuest(aquarium.completedQuestsCount, quest.targetFishId);
  aquarium.activeAnglerQuest = nextQuest;

  return {
    reward: quest.reward,
    nextQuest
  };
}
