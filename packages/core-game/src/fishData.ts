import { FishDefinition } from './types';

export const INITIAL_FISH_CATALOG: FishDefinition[] = [
  // --- COMÚN (basePPS: 1 - 2) ---
  {
    id: 'syntax_sardine',
    nameKey: 'fish.syntax_sardine.name',
    descriptionKey: 'fish.syntax_sardine.desc',
    rarity: 'common',
    basePPS: 1,
    biome: 'frontend_reef',
    minWeightKB: 4,
    maxWeightKB: 32,
    sprite: 'sprites/syntax_sardine.png'
  },
  {
    id: 'console_log_carp',
    nameKey: 'fish.console_log_carp.name',
    descriptionKey: 'fish.console_log_carp.desc',
    rarity: 'common',
    basePPS: 1.5,
    biome: 'default_ocean',
    minWeightKB: 8,
    maxWeightKB: 64,
    sprite: 'sprites/console_log_carp.png'
  },
  {
    id: 'bit_shrimp',
    nameKey: 'fish.bit_shrimp.name',
    descriptionKey: 'fish.bit_shrimp.desc',
    rarity: 'common',
    basePPS: 1,
    biome: 'low_level',
    minWeightKB: 1,
    maxWeightKB: 8,
    sprite: 'sprites/bit_shrimp.png'
  },
  {
    id: 'json_jellyfish',
    nameKey: 'fish.json_jellyfish.name',
    descriptionKey: 'fish.json_jellyfish.desc',
    rarity: 'common',
    basePPS: 2,
    biome: 'data_swamp',
    minWeightKB: 12,
    maxWeightKB: 96,
    sprite: 'sprites/json_jellyfish.png'
  },

  // --- POCO COMÚN (basePPS: 5 - 10) ---
  {
    id: 'compiler_carp',
    nameKey: 'fish.compiler_carp.name',
    descriptionKey: 'fish.compiler_carp.desc',
    rarity: 'uncommon',
    basePPS: 6,
    biome: 'low_level',
    minWeightKB: 64,
    maxWeightKB: 512,
    sprite: 'sprites/compiler_carp.png'
  },
  {
    id: 'recursive_salmon',
    nameKey: 'fish.recursive_salmon.name',
    descriptionKey: 'fish.recursive_salmon.desc',
    rarity: 'uncommon',
    basePPS: 8,
    biome: 'default_ocean',
    minWeightKB: 128,
    maxWeightKB: 1024,
    sprite: 'sprites/recursive_salmon.png'
  },
  {
    id: 'regex_ray',
    nameKey: 'fish.regex_ray.name',
    descriptionKey: 'fish.regex_ray.desc',
    rarity: 'uncommon',
    basePPS: 7,
    biome: 'data_swamp',
    minWeightKB: 80,
    maxWeightKB: 720,
    sprite: 'sprites/regex_ray.png'
  },

  // --- RARO (basePPS: 25 - 45) ---
  {
    id: 'git_squid',
    nameKey: 'fish.git_squid.name',
    descriptionKey: 'fish.git_squid.desc',
    rarity: 'rare',
    basePPS: 30,
    biome: 'default_ocean',
    minWeightKB: 512,
    maxWeightKB: 4096,
    sprite: 'sprites/git_squid.png',
    passive: {
      id: 'git_commit_surge',
      nameKey: 'passive.git_commit_surge.name',
      descriptionKey: 'passive.git_commit_surge.desc',
      type: 'bait_charge',
      value: 0.25 // llena 25% de la barra con acciones Git
    }
  },
  {
    id: 'context_remora',
    nameKey: 'fish.context_remora.name',
    descriptionKey: 'fish.context_remora.desc',
    rarity: 'rare',
    basePPS: 35,
    biome: 'abyssal_zone',
    minWeightKB: 256,
    maxWeightKB: 2048,
    sprite: 'sprites/context_remora.png',
    passive: {
      id: 'deep_context_boost',
      nameKey: 'passive.deep_context_boost.name',
      descriptionKey: 'passive.deep_context_boost.desc',
      type: 'pps_multiplier',
      value: 2.0 // x2 si el contexto supera 20k tokens
    }
  },
  {
    id: 'local_lantern_fish',
    nameKey: 'fish.local_lantern_fish.name',
    descriptionKey: 'fish.local_lantern_fish.desc',
    rarity: 'rare',
    basePPS: 40,
    biome: 'abyssal_zone',
    minWeightKB: 500,
    maxWeightKB: 3500,
    sprite: 'sprites/local_lantern_fish.png',
    passive: {
      id: 'ollama_saver',
      nameKey: 'passive.ollama_saver.name',
      descriptionKey: 'passive.ollama_saver.desc',
      type: 'local_model_boost',
      value: 3.0 // x3 mientras se usa modelo local
    }
  },

  // --- GLITCH / TORMENTA (Raros especiales) ---
  {
    id: 'null_pointer_eel',
    nameKey: 'fish.null_pointer_eel.name',
    descriptionKey: 'fish.null_pointer_eel.desc',
    rarity: 'rare',
    basePPS: 50,
    biome: 'default_ocean',
    minWeightKB: 404,
    maxWeightKB: 4040,
    sprite: 'sprites/null_pointer_eel.png',
    stormOnly: true
  },
  {
    id: 'segfault_puffer',
    nameKey: 'fish.segfault_puffer.name',
    descriptionKey: 'fish.segfault_puffer.desc',
    rarity: 'epic',
    basePPS: 120,
    biome: 'low_level',
    minWeightKB: 1390,
    maxWeightKB: 13900,
    sprite: 'sprites/segfault_puffer.png',
    stormOnly: true
  },

  // --- ÉPICO (basePPS: 100 - 250) ---
  {
    id: 'kernel_shark',
    nameKey: 'fish.kernel_shark.name',
    descriptionKey: 'fish.kernel_shark.desc',
    rarity: 'epic',
    basePPS: 150,
    biome: 'low_level',
    minWeightKB: 4096,
    maxWeightKB: 32768,
    sprite: 'sprites/kernel_shark.png',
    passive: {
      id: 'common_refiner',
      nameKey: 'passive.common_refiner.name',
      descriptionKey: 'passive.common_refiner.desc',
      type: 'common_devourer',
      value: 1 // Convierte comunes repetidos en fragmentos de coral
    }
  },

  // --- LEGENDARIO (basePPS: 500 - 1200) ---
  {
    id: 'docker_whale',
    nameKey: 'fish.docker_whale.name',
    descriptionKey: 'fish.docker_whale.desc',
    rarity: 'legendary',
    basePPS: 800,
    biome: 'default_ocean',
    minWeightKB: 32768,
    maxWeightKB: 524288,
    sprite: 'sprites/docker_whale.png'
  },

  // --- MÍTICO / ANOMALÍA (basePPS: 3000+) ---
  {
    id: 'async_leviathan',
    nameKey: 'fish.async_leviathan.name',
    descriptionKey: 'fish.async_leviathan.desc',
    rarity: 'mythic',
    basePPS: 5000,
    biome: 'abyssal_zone',
    minWeightKB: 1048576, // 1 GB+
    maxWeightKB: 16777216, // 16 GB+
    sprite: 'sprites/async_leviathan.png'
  }
];

export const FISH_MAP = new Map<string, FishDefinition>(
  INITIAL_FISH_CATALOG.map((fish) => [fish.id, fish])
);
