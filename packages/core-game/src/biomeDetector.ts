import { Biome, Weather } from './types';

export interface ContextAnalysisInput {
  codeSnippet?: string;
  detectedLanguage?: string;
  modelName?: string;
  isThinkingModel?: boolean;
  reasoningTokens?: number;
  hasErrorOrException?: boolean;
  httpStatus?: number;
}

const LOW_LEVEL_REGEX = /\b(fn\s+main|unsafe|std::|#include|malloc|free|pointer|mut\s+|impl\s+|u32|i64|usize|pub\s+struct)\b/i;
const DATA_SWAMP_REGEX = /\b(import\s+pandas|import\s+numpy|def\s+|SELECT\s+.*FROM|WHERE\s+|GROUP\s+BY|pd\.DataFrame|plt\.)\b/i;
const FRONTEND_REEF_REGEX = /\b(const\s+.*=\s*\(|function|import\s+React|export\s+default|<div|className|tailwind|addEventListener|querySelector)\b/i;

export function detectBiome(input: ContextAnalysisInput): Biome {
  // 1. Thinking / Abyssal priority
  if (
    input.isThinkingModel ||
    (input.reasoningTokens && input.reasoningTokens > 0) ||
    (input.modelName && /thinking|o1|o3|r1/i.test(input.modelName))
  ) {
    return 'abyssal_zone';
  }

  // 2. Language metadata if explicitly provided
  const lang = input.detectedLanguage?.toLowerCase() || '';
  if (['rust', 'c', 'cpp', 'c++', 'zig', 'assembly', 'asm'].includes(lang)) {
    return 'low_level';
  }
  if (['python', 'sql', 'r', 'json', 'csv'].includes(lang)) {
    return 'data_swamp';
  }
  if (['typescript', 'javascript', 'ts', 'js', 'html', 'css', 'svelte', 'solid'].includes(lang)) {
    return 'frontend_reef';
  }

  // 3. Ultra-fast regex parsing over code snippet (0ms execution)
  const snippet = input.codeSnippet || '';
  if (LOW_LEVEL_REGEX.test(snippet)) {
    return 'low_level';
  }
  if (DATA_SWAMP_REGEX.test(snippet)) {
    return 'data_swamp';
  }
  if (FRONTEND_REEF_REGEX.test(snippet)) {
    return 'frontend_reef';
  }

  return 'default_ocean';
}

export function detectWeather(input: ContextAnalysisInput): Weather {
  if (input.hasErrorOrException) return 'storm';
  if (input.httpStatus && input.httpStatus >= 400) return 'storm';
  if (input.codeSnippet && /(Error:|Exception:|Traceback \(most recent call last\)|panic!|SEGFAULT)/i.test(input.codeSnippet)) {
    return 'storm';
  }
  return 'clear';
}
