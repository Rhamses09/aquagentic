import { Component } from 'solid-js';
import { currentLanguage, setCurrentLanguage, t } from '../i18n';
import { Biome, Weather } from '@aquagentic/core-game';

interface HeaderProps {
  pearls: number;
  pps: number;
  tokensBurned: number;
  biome: Biome;
  weather: Weather;
  onBiomeChange: (biome: Biome) => void;
  onWeatherToggle: () => void;
}

export const Header: Component<HeaderProps> = (props) => {
  return (
    <header class="h-16 border-b border-cyan-900/40 bg-ocean-deep/90 backdrop-blur-md px-6 flex items-center justify-between z-20">
      {/* Brand */}
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <span class="text-xl">🐟</span>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-lg font-bold tracking-tight text-white">Aquagentic</h1>
            <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800/60">
              v0.1.0 BYOK
            </span>
          </div>
          <p class="text-xs text-slate-400 font-medium">{t('game.tagline')}</p>
        </div>
      </div>

      {/* Live Economy Stats */}
      <div class="flex items-center gap-4">
        {/* Pearls */}
        <div class="flex items-center gap-2 bg-slate-900/80 border border-cyan-950 rounded-xl px-3.5 py-1.5 shadow-inner">
          <span class="text-base">🔮</span>
          <div>
            <div class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{t('stats.pearls')}</div>
            <div class="text-sm font-bold text-cyan-300 font-mono leading-none">
              {Math.floor(props.pearls).toLocaleString()}
            </div>
          </div>
        </div>

        {/* PPS */}
        <div class="flex items-center gap-2 bg-slate-900/80 border border-cyan-950 rounded-xl px-3.5 py-1.5 shadow-inner">
          <span class="text-base">⚡</span>
          <div>
            <div class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{t('stats.pps')}</div>
            <div class="text-sm font-bold text-emerald-400 font-mono leading-none">
              +{props.pps.toFixed(1)}/s
            </div>
          </div>
        </div>

        {/* Tokens */}
        <div class="flex items-center gap-2 bg-slate-900/80 border border-cyan-950 rounded-xl px-3.5 py-1.5 shadow-inner">
          <span class="text-base">🔥</span>
          <div>
            <div class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{t('stats.tokensBurned')}</div>
            <div class="text-sm font-bold text-amber-300 font-mono leading-none">
              {props.tokensBurned.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Controls & i18n */}
      <div class="flex items-center gap-3">
        {/* Biome Selector */}
        <select
          value={props.biome}
          onChange={(e) => props.onBiomeChange(e.currentTarget.value as Biome)}
          class="bg-slate-900/90 border border-cyan-900/50 rounded-lg text-xs px-2.5 py-1.5 text-cyan-200 focus:outline-none focus:border-cyan-400"
        >
          <option value="default_ocean">{t('biome.default_ocean')}</option>
          <option value="frontend_reef">{t('biome.frontend_reef')}</option>
          <option value="low_level">{t('biome.low_level')}</option>
          <option value="data_swamp">{t('biome.data_swamp')}</option>
          <option value="abyssal_zone">{t('biome.abyssal_zone')}</option>
        </select>

        {/* Weather Toggle */}
        <button
          onClick={props.onWeatherToggle}
          class={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
            props.weather === 'storm'
              ? 'bg-purple-950 text-purple-300 border-purple-600 shadow-md shadow-purple-900/50'
              : 'bg-slate-900 text-slate-300 border-slate-700/60 hover:border-slate-500'
          }`}
        >
          <span>{props.weather === 'storm' ? '⚡' : '☀️'}</span>
          <span>{props.weather === 'storm' ? t('weather.storm') : t('weather.clear')}</span>
        </button>

        {/* Language Switcher */}
        <div class="flex rounded-lg overflow-hidden border border-cyan-900/50 bg-slate-950 text-xs font-semibold">
          <button
            onClick={() => setCurrentLanguage('es')}
            class={`px-2.5 py-1 transition-colors ${
              currentLanguage() === 'es' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            ES
          </button>
          <button
            onClick={() => setCurrentLanguage('en')}
            class={`px-2.5 py-1 transition-colors ${
              currentLanguage() === 'en' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            EN
          </button>
        </div>
      </div>
    </header>
  );
};
