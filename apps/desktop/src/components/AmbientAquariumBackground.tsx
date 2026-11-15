import { Component, For } from 'solid-js';
import { Biome, FishDefinition, InventoryItem, Weather } from '@aquagentic/core-game';
import { PixelFish } from './PixelFish';

export interface SwimmingFishState {
  id: string;
  def: FishDefinition;
  inv?: InventoryItem;
  topPercent: number;
  swimDuration: number;
  swimDelay: number;
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
      {/* Oceanic Depth Gradient Spheres */}
      <div class="absolute inset-0 opacity-25">
        <div class="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-600/20 blur-[120px]" />
        <div class="absolute bottom-10 right-1/4 w-[600px] h-[600px] rounded-full bg-indigo-700/15 blur-[140px]" />
      </div>

      {/* Floating subtle ambient plankton particles */}
      <div class="absolute inset-0 opacity-30">
        <div class="absolute top-[20%] left-[15%] w-1.5 h-1.5 rounded-full bg-cyan-300/40 animate-pulse" />
        <div class="absolute top-[65%] left-[70%] w-1 h-1 rounded-full bg-emerald-300/30 animate-pulse" style={{ "animation-delay": "1s" }} />
        <div class="absolute top-[40%] right-[10%] w-2 h-2 rounded-full bg-blue-300/20 animate-pulse" style={{ "animation-delay": "2s" }} />
      </div>

      {/* Roaming Pixel Fishes Across the Full Application Canvas */}
      <div class="absolute inset-0 overflow-hidden">
        <For each={props.activeFishes}>
          {(fish) => (
            <div
              class="absolute gpu-layer opacity-80 hover:opacity-100 transition-opacity"
              style={{
                top: `${fish.topPercent}%`,
                left: '-120px',
                animation: `fullscreen-swim ${fish.swimDuration}s linear infinite`,
                'animation-delay': `${fish.swimDelay}s`,
                transform: `scale(${fish.scale})`
              }}
            >
              <div class="flex items-center gap-1.5">
                <PixelFish
                  fishId={fish.def.id}
                  rarity={fish.def.rarity}
                  isShiny={fish.isShiny}
                  size={34 * fish.scale}
                />
              </div>
            </div>
          )}
        </For>
      </div>

      <style>{`
        @keyframes fullscreen-swim {
          0% {
            transform: translate3d(-120px, 0, 0) scaleX(1);
          }
          48% {
            transform: translate3d(calc(100vw + 120px), -25px, 0) scaleX(1);
          }
          50% {
            transform: translate3d(calc(100vw + 120px), -25px, 0) scaleX(-1);
          }
          98% {
            transform: translate3d(-120px, 0, 0) scaleX(-1);
          }
          100% {
            transform: translate3d(-120px, 0, 0) scaleX(1);
          }
        }
      `}</style>
    </div>
  );
};
