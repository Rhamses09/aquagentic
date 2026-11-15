import { createSignal } from 'solid-js';
import en from './en.json';
import es from './es.json';
import { getTranslation as getCoreTranslation } from '@aquagentic/core-game';

export type Language = 'en' | 'es';

const [currentLanguage, setCurrentLanguage] = createSignal<Language>('es');

export { currentLanguage, setCurrentLanguage };

const desktopTranslations = {
  en,
  es
} as const;

export function t(path: string): string {
  const lang = currentLanguage();
  const dict = desktopTranslations[lang] || desktopTranslations.en;
  const parts = path.split('.');
  let current: any = dict;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      // Try core game translation fallback (e.g. fish names, biomes)
      return getCoreTranslation(lang, path);
    }
  }

  return typeof current === 'string' ? current : getCoreTranslation(lang, path);
}
