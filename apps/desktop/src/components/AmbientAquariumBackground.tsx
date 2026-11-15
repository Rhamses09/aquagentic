import { Component, For } from 'solid-js';
import { Biome, FishDefinition, InventoryItem, Weather } from '@aquagentic/core-game';
import { PixelFish } from './PixelFish';
import { t } from '../i18n';

export interface SwimmingFishState {
  id: string;
  def: FishDefinition;
  inv?: InventoryItem;
  topPercent: number;
  leftPercent: number;
  swimDuration: number;
  direction: 'right' | 'left';
  isShiny: boolean;
  scale: number;
}

interface AmbientAquariumBackgroundProps {
  biome: Biome;
  weather: Weather;
  activeFishes: SwimmingFishState[];
}

export const AmbientAquariumBackground: Component<AmbientAquariumBackgroundProps> = (props) => {
  return (
    <div
      class={`fixed inset-0 pointer-events-none overflow-hidden transition-colors duration-1000 z-0 select-none biome-ambient-${props.biome} ${
        props.weather === 'storm' ? 'weather-storm-active' : ''
      }`}
    >
      {/* Oceanic Bioluminescent Ambient Spheres */}
      <div class="absolute inset-0 opacity-40 pointer-events-none">
        <div class="absolute top-[10%] left-[20%] w-[550px] h-[550px] rounded-full bg-cyan-500/15 blur-[130px]" />
        <div class="absolute bottom-[15%] right-[25%] w-[650px] h-[650px] rounded-full bg-indigo-600/15 blur-[150px]" />
        <div class="absolute top-[60%] left-[45%] w-[400px] h-[400px] rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      {/* Floating Plankton Particles */}
      <div class="absolute inset-0 opacity-40 pointer-events-none">
        <div class="absolute top-[25%] left-[18%] w-1.5 h-1.5 rounded-full bg-cyan-300/60 animate-pulse" />
        <div class="absolute top-[70%] left-[65%] w-1 h-1 rounded-full bg-emerald-300/50 animate-pulse" style={{ "animation-delay": "1.2s" }} />
        <div class="absolute top-[45%] right-[15%] w-2 h-2 rounded-full bg-blue-300/40 animate-pulse" style={{ "animation-delay": "2.4s" }} />
      </div>

      {/* Living Swimming Pixel Fishes (Uninterrupted 60 FPS GPU Composited Movement) */}
      <div class="absolute inset-0 overflow-hidden">
        <For each={props.activeFishes}>
          {(fish) => {
            const animName = fish.direction === 'right' ? 'fish-swim-right' : 'fish-swim-left';
            return (
              <div
                class="absolute gpu-layer"
                style={{
                  top: `${fish.topPercent}%`,
                  left: `${fish.leftPercent}%`,
                  animation: `${animName} ${fish.swimDuration}s ease-in-out infinite`
                }}
              >
                <div
                  class="flex flex-col items-center group pointer-events-auto cursor-pointer"
                  style={{ animation: `fish-float-gentle 3.5s ease-in-out infinite` }}
                >
                  <PixelFish
                    fishId={fish.def.id}
                    rarity={fish.def.rarity}
                    isShiny={fish.isShiny}
                    size={48 * fish.scale}
                    class="transform hover:scale-125 transition-transform"
                  />

                  {/* Identification Pill */}
                  <span class="mt-1 px-1.5 py-0.5 rounded text-[8.5px] font-mono text-cyan-300/90 bg-black/70 border border-cyan-800/40 backdrop-blur-sm opacity-60 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                    {t(fish.def.nameKey)} (+{fish.def.basePPS} PPS)
                  </span>
                </div>
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
};
