import { FishDefinition } from './types';

export const INITIAL_FISH_CATALOG: FishDefinition[] = [
  // --- COMÚN (basePPS: 1 - 2) ---
  {
    id: 'clownfish',
    nameKey: 'fish.clownfish.name',
    descriptionKey: 'fish.clownfish.desc',
    rarity: 'common',
    basePPS: 1.0,
    biome: 'frontend_reef',
    minWeightKB: 10,
    maxWeightKB: 60,
    sprite: 'sprites/clownfish.png'
  },
  {
    id: 'blue_tang',
    nameKey: 'fish.blue_tang.name',
    descriptionKey: 'fish.blue_tang.desc',
    rarity: 'common',
    basePPS: 1.5,
    biome: 'frontend_reef',
    minWeightKB: 50,
    maxWeightKB: 250,
    sprite: 'sprites/blue_tang.png'
  },
  {
    id: 'seahorse',
    nameKey: 'fish.seahorse.name',
    descriptionKey: 'fish.seahorse.desc',
    rarity: 'common',
    basePPS: 1.2,
    biome: 'default_ocean',
    minWeightKB: 5,
    maxWeightKB: 40,
    sprite: 'sprites/seahorse.png'
  },
  {
    id: 'french_angelfish',
    nameKey: 'fish.french_angelfish.name',
    descriptionKey: 'fish.french_angelfish.desc',
    rarity: 'common',
    basePPS: 2.0,
    biome: 'frontend_reef',
    minWeightKB: 80,
    maxWeightKB: 450,
    sprite: 'sprites/french_angelfish.png'
  },

  // --- POCO COMÚN (basePPS: 5 - 10) ---
  {
    id: 'lionfish',
    nameKey: 'fish.lionfish.name',
    descriptionKey: 'fish.lionfish.desc',
    rarity: 'uncommon',
    basePPS: 6.0,
    biome: 'frontend_reef',
    minWeightKB: 120,
    maxWeightKB: 800,
    sprite: 'sprites/lionfish.png'
  },
  {
    id: 'mandarin_dragonet',
    nameKey: 'fish.mandarin_dragonet.name',
    descriptionKey: 'fish.mandarin_dragonet.desc',
    rarity: 'uncommon',
    basePPS: 7.5,
    biome: 'frontend_reef',
    minWeightKB: 15,
    maxWeightKB: 90,
    sprite: 'sprites/mandarin_dragonet.png'
  },
  {
    id: 'copperband_butterfly',
    nameKey: 'fish.copperband_butterfly.name',
    descriptionKey: 'fish.copperband_butterfly.desc',
    rarity: 'uncommon',
    basePPS: 8.0,
    biome: 'default_ocean',
    minWeightKB: 60,
    maxWeightKB: 320,
    sprite: 'sprites/copperband_butterfly.png'
  },
  {
    id: 'pufferfish',
    nameKey: 'fish.pufferfish.name',
    descriptionKey: 'fish.pufferfish.desc',
    rarity: 'uncommon',
    basePPS: 9.0,
    biome: 'data_swamp',
    minWeightKB: 100,
    maxWeightKB: 650,
    sprite: 'sprites/pufferfish.png'
  },

  // --- RARO (basePPS: 25 - 50) ---
  {
    id: 'blue_ringed_octopus',
    nameKey: 'fish.blue_ringed_octopus.name',
    descriptionKey: 'fish.blue_ringed_octopus.desc',
    rarity: 'rare',
    basePPS: 32.0,
    biome: 'low_level',
    minWeightKB: 30,
    maxWeightKB: 120,
    sprite: 'sprites/blue_ringed_octopus.png',
    passive: {
      id: 'neuro_surge',
      nameKey: 'passive.neuro_surge.name',
      descriptionKey: 'passive.neuro_surge.desc',
      type: 'bait_charge',
      value: 0.25
    }
  },
  {
    id: 'anglerfish',
    nameKey: 'fish.anglerfish.name',
    descriptionKey: 'fish.anglerfish.desc',
    rarity: 'rare',
    basePPS: 38.0,
    biome: 'abyssal_zone',
    minWeightKB: 300,
    maxWeightKB: 2500,
    sprite: 'sprites/anglerfish.png',
    passive: {
      id: 'abyssal_lure',
      nameKey: 'passive.abyssal_lure.name',
      descriptionKey: 'passive.abyssal_lure.desc',
      type: 'pps_multiplier',
      value: 2.0
    }
  },
  {
    id: 'moray_eel',
    nameKey: 'fish.moray_eel.name',
    descriptionKey: 'fish.moray_eel.desc',
    rarity: 'rare',
    basePPS: 42.0,
    biome: 'low_level',
    minWeightKB: 1500,
    maxWeightKB: 12000,
    sprite: 'sprites/moray_eel.png'
  },
  {
    id: 'barracuda',
    nameKey: 'fish.barracuda.name',
    descriptionKey: 'fish.barracuda.desc',
    rarity: 'rare',
    basePPS: 45.0,
    biome: 'default_ocean',
    minWeightKB: 2000,
    maxWeightKB: 18000,
    sprite: 'sprites/barracuda.png'
  },

  // --- GLITCH / TORMENTA (Especies de aguas profundas) ---
  {
    id: 'goblin_shark',
    nameKey: 'fish.goblin_shark.name',
    descriptionKey: 'fish.goblin_shark.desc',
    rarity: 'rare',
    basePPS: 55.0,
    biome: 'abyssal_zone',
    minWeightKB: 4000,
    maxWeightKB: 35000,
    sprite: 'sprites/goblin_shark.png',
    stormOnly: true
  },
  {
    id: 'black_dragonfish',
    nameKey: 'fish.black_dragonfish.name',
    descriptionKey: 'fish.black_dragonfish.desc',
    rarity: 'epic',
    basePPS: 140.0,
    biome: 'abyssal_zone',
    minWeightKB: 80,
    maxWeightKB: 450,
    sprite: 'sprites/black_dragonfish.png',
    stormOnly: true
  },

  // --- ÉPICO (basePPS: 120 - 250) ---
  {
    id: 'hammerhead_shark',
    nameKey: 'fish.hammerhead_shark.name',
    descriptionKey: 'fish.hammerhead_shark.desc',
    rarity: 'epic',
    basePPS: 160.0,
    biome: 'low_level',
    minWeightKB: 15000,
    maxWeightKB: 120000,
    sprite: 'sprites/hammerhead_shark.png',
    passive: {
      id: 'electro_detection',
      nameKey: 'passive.electro_detection.name',
      descriptionKey: 'passive.electro_detection.desc',
      type: 'common_devourer',
      value: 1
    }
  },
  {
    id: 'manta_ray',
    nameKey: 'fish.manta_ray.name',
    descriptionKey: 'fish.manta_ray.desc',
    rarity: 'epic',
    basePPS: 190.0,
    biome: 'default_ocean',
    minWeightKB: 25000,
    maxWeightKB: 250000,
    sprite: 'sprites/manta_ray.png'
  },
  {
    id: 'ocean_sunfish',
    nameKey: 'fish.ocean_sunfish.name',
    descriptionKey: 'fish.ocean_sunfish.desc',
    rarity: 'epic',
    basePPS: 220.0,
    biome: 'default_ocean',
    minWeightKB: 50000,
    maxWeightKB: 500000,
    sprite: 'sprites/ocean_sunfish.png'
  },
  {
    id: 'great_white_shark',
    nameKey: 'fish.great_white_shark.name',
    descriptionKey: 'fish.great_white_shark.desc',
    rarity: 'epic',
    basePPS: 260.0,
    biome: 'low_level',
    minWeightKB: 80000,
    maxWeightKB: 800000,
    sprite: 'sprites/great_white_shark.png'
  },

  // --- LEGENDARIO (basePPS: 600 - 1500) ---
  {
    id: 'whale_shark',
    nameKey: 'fish.whale_shark.name',
    descriptionKey: 'fish.whale_shark.desc',
    rarity: 'legendary',
    basePPS: 850.0,
    biome: 'default_ocean',
    minWeightKB: 500000,
    maxWeightKB: 4000000,
    sprite: 'sprites/whale_shark.png'
  },
  {
    id: 'giant_oarfish',
    nameKey: 'fish.giant_oarfish.name',
    descriptionKey: 'fish.giant_oarfish.desc',
    rarity: 'legendary',
    basePPS: 1100.0,
    biome: 'abyssal_zone',
    minWeightKB: 100000,
    maxWeightKB: 900000,
    sprite: 'sprites/giant_oarfish.png'
  },
  {
    id: 'coelacanth',
    nameKey: 'fish.coelacanth.name',
    descriptionKey: 'fish.coelacanth.desc',
    rarity: 'legendary',
    basePPS: 1350.0,
    biome: 'abyssal_zone',
    minWeightKB: 45000,
    maxWeightKB: 350000,
    sprite: 'sprites/coelacanth.png'
  },

  // --- MÍTICO / ANOMALÍA (basePPS: 4000+) ---
  {
    id: 'colossal_squid',
    nameKey: 'fish.colossal_squid.name',
    descriptionKey: 'fish.colossal_squid.desc',
    rarity: 'mythic',
    basePPS: 5500.0,
    biome: 'abyssal_zone',
    minWeightKB: 350000,
    maxWeightKB: 2500000,
    sprite: 'sprites/colossal_squid.png'
  },
  {
    id: 'greenland_shark',
    nameKey: 'fish.greenland_shark.name',
    descriptionKey: 'fish.greenland_shark.desc',
    rarity: 'mythic',
    basePPS: 6200.0,
    biome: 'abyssal_zone',
    minWeightKB: 800000,
    maxWeightKB: 5000000,
    sprite: 'sprites/greenland_shark.png'
  }
];

export const FISH_MAP = new Map<string, FishDefinition>(
  INITIAL_FISH_CATALOG.map((fish) => [fish.id, fish])
);
