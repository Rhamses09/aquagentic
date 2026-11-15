import en from './en.json';
import es from './es.json';

export type SupportedLanguage = 'en' | 'es';

export const translations = {
  en,
  es
} as const;

export function getTranslation(lang: SupportedLanguage, path: string): string {
  const dict = translations[lang] || translations.en;
  const parts = path.split('.');
  let current: any = dict;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      // Fallback to English
      let fallback: any = translations.en;
      for (const p of parts) {
        if (fallback && typeof fallback === 'object' && p in fallback) {
          fallback = fallback[p];
        } else {
          return path;
        }
      }
      return typeof fallback === 'string' ? fallback : path;
    }
  }

  return typeof current === 'string' ? current : path;
}
