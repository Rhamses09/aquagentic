import assert from 'node:assert';
import test from 'node:test';
import {
  sha256Sync,
  formatWeight,
  rollGacha,
  detectBiome,
  detectWeather,
  createInitialState,
  applyCatchToInventory,
  mergeStates,
  getTranslation,
  calculatePassivePPS,
  INITIAL_FISH_CATALOG
} from '../index';

test('SHA-256 produces deterministic hash', () => {
  const hash1 = sha256Sync('hello world');
  const hash2 = sha256Sync('hello world');
  assert.strictEqual(hash1, hash2);
  assert.strictEqual(hash1.length, 64);
});

test('Format weight handles bytes to TB correctly', () => {
  assert.strictEqual(formatWeight(500), '500 B');
  assert.strictEqual(formatWeight(1024), '1.0 KB');
  assert.strictEqual(formatWeight(1024 * 1024 * 5), '5.00 MB');
  assert.strictEqual(formatWeight(1024 * 1024 * 1024 * 2.5), '2.50 GB');
});

test('Gacha roll catches valid fish from catalog', () => {
  const state = createInitialState('desktop').aquarium;
  const result = rollGacha(state, { prompt: 'Write a fast rust parser' });

  assert.ok(result.fish);
  assert.ok(INITIAL_FISH_CATALOG.some(f => f.id === result.fish.id));
  assert.ok(result.instance.weightBytes > 0);
  assert.ok(result.instance.promptHash.length === 64);
});

test('Gacha triggers Epic Pity after 30 rolls', () => {
  const state = createInitialState('desktop').aquarium;
  state.pityCounterEpic = 29; // Next roll reaches threshold 30
  const result = rollGacha(state, { prompt: 'pity test' });

  assert.strictEqual(result.pityTriggered, 'epic');
  assert.strictEqual(result.fish.rarity, 'epic');
});

test('Biome detection maps language and patterns to correct biomes', () => {
  assert.strictEqual(detectBiome({ detectedLanguage: 'rust' }), 'low_level');
  assert.strictEqual(detectBiome({ detectedLanguage: 'python' }), 'data_swamp');
  assert.strictEqual(detectBiome({ detectedLanguage: 'typescript' }), 'frontend_reef');
  assert.strictEqual(detectBiome({ isThinkingModel: true }), 'abyssal_zone');
  assert.strictEqual(detectBiome({ codeSnippet: 'fn main() { unsafe { } }' }), 'low_level');
  assert.strictEqual(detectBiome({ codeSnippet: 'SELECT * FROM users WHERE active = 1' }), 'data_swamp');
});

test('Weather detection triggers storm on errors or 429', () => {
  assert.strictEqual(detectWeather({ hasErrorOrException: true }), 'storm');
  assert.strictEqual(detectWeather({ httpStatus: 429 }), 'storm');
  assert.strictEqual(detectWeather({ codeSnippet: 'Traceback (most recent call last):\nValueError: bad input' }), 'storm');
  assert.strictEqual(detectWeather({ codeSnippet: 'console.log("all good");' }), 'clear');
});

test('Monotonic Merge preserves highest counts, weights, and star ranks without data loss', () => {
  const local = createInitialState('desktop');
  const remote = createInitialState('mobile');

  // Local caught 2 sardines
  local.aquarium.inventory['syntax_sardine'] = {
    count: 2,
    shinyCount: 0,
    starRank: 1,
    maxWeightBytes: 15000,
    firstCaughtAt: 1000
  };
  local.aquarium.totalTokensBurned = 1000;
  local.aquarium.pearls = 100;
  local.lastUpdated = 5000;

  // Remote (mobile while PC was off) caught 5 sardines, 1 shiny, and a bigger one
  remote.aquarium.inventory['syntax_sardine'] = {
    count: 5,
    shinyCount: 1,
    starRank: 2,
    maxWeightBytes: 25000,
    firstCaughtAt: 1000
  };
  remote.aquarium.totalTokensBurned = 3500;
  remote.aquarium.pearls = 400;
  remote.lastUpdated = 8000;

  const merged = mergeStates(local, remote);

  assert.strictEqual(merged.aquarium.inventory['syntax_sardine'].count, 5);
  assert.strictEqual(merged.aquarium.inventory['syntax_sardine'].shinyCount, 1);
  assert.strictEqual(merged.aquarium.inventory['syntax_sardine'].starRank, 2);
  assert.strictEqual(merged.aquarium.inventory['syntax_sardine'].maxWeightBytes, 25000);
  assert.strictEqual(merged.aquarium.totalTokensBurned, 3500);
  assert.ok(merged.aquarium.pearls >= 400);
});

test('i18n translates seamlessly in English and Spanish', () => {
  assert.strictEqual(getTranslation('es', 'game.title'), 'Aquagentic');
  assert.strictEqual(getTranslation('es', 'rarity.legendary'), 'Legendario');
  assert.strictEqual(getTranslation('en', 'rarity.legendary'), 'Legendary');
  assert.strictEqual(getTranslation('es', 'fish.syntax_sardine.name'), 'Sardina de Sintaxis');
  assert.strictEqual(getTranslation('en', 'fish.syntax_sardine.name'), 'Syntax Sardine');
  assert.strictEqual(getTranslation('es', 'biome.abyssal_zone'), 'Zona Abisal de Pensamiento');
  assert.strictEqual(getTranslation('en', 'biome.abyssal_zone'), 'Abyssal Reasoning Trench');
});
