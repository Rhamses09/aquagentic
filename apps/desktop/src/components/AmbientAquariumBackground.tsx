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
      <div class="absolute inset-0 opacity-40">
        <div class="absolute top-[10%] left-[20%] w-[550px] h-[550px] rounded-full bg-cyan-500/15 blur-[130px]" />
        <div class="absolute bottom-[15%] right-[25%] w-[650px] h-[650px] rounded-full bg-indigo-600/15 blur-[150px]" />
        <div class="absolute top-[60%] left-[45%] w-[400px] h-[400px] rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      {/* Subtle Floating Plankton Particles */}
      <div class="absolute inset-0 opacity-40">
        <div class="absolute top-[25%] left-[18%] w-1.5 h-1.5 rounded-full bg-cyan-300/60 animate-pulse" />
        <div class="absolute top-[70%] left-[65%] w-1 h-1 rounded-full bg-emerald-300/50 animate-pulse" style={{ "animation-delay": "1.2s" }} />
        <div class="absolute top-[45%] right-[15%] w-2 h-2 rounded-full bg-blue-300/40 animate-pulse" style={{ "animation-delay": "2.4s" }} />
      </div>

      {/* Swimming Pixel Fishes - Positioned 100% Inside the Visible Screen */}
      <div class="absolute inset-0 overflow-hidden">
        <For each={props.activeFishes}>
          {(fish) => (
            <div
              class="absolute gpu-layer transition-transform"
              style={{
                top: `${fish.topPercent}%`,
                left: `${fish.leftPercent}%`,
                animation: `fish-swim-patrol ${fish.swimDuration}s ease-in-out infinite`
              }}
            >
              <div class="flex flex-col items-center group pointer-events-auto cursor-pointer">
                <PixelFish
                  fishId={fish.def.id}
                  rarity={fish.def.rarity}
                  isShiny={fish.isShiny}
                  size={46 * fish.scale}
                  class="transform hover:scale-125 transition-transform"
                />

                {/* Subtle Glow Tag */}
                <span class="mt-1 px-1.5 py-0.5 rounded text-[8.5px] font-mono text-cyan-300/80 bg-black/60 border border-cyan-800/30 backdrop-blur-sm opacity-60 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                  {t(fish.def.nameKey)} (+{fish.def.basePPS} PPS)
                </span>
              </div>
            </div>
          )}
        </For>
      </div>

      <style>{`
        @keyframes fish-swim-patrol {
          0%, 100% {
            transform: translate3d(0, 0, 0) scaleX(1);
          }
          48% {
            transform: translate3d(140px, -20px, 0) scaleX(1);
          }
          50% {
            transform: translate3d(140px, -20px, 0) scaleX(-1);
          }
          98% {
            transform: translate3d(-120px, 15px, 0) scaleX(-1);
          }
        }
      `}</style>
    </div>
  );
};
