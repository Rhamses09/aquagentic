import { Component } from 'solid-js';
import { Rarity } from '@aquagentic/core-game';

interface PixelFishProps {
  fishId: string;
  rarity: Rarity;
  isShiny?: boolean;
  size?: number;
  class?: string;
}

/**
 * Authentic Retro Pixel Art Sprites rendered via SVG crispEdges
 */
export const PixelFish: Component<PixelFishProps> = (props) => {
  const size = () => props.size || 36;

  const isShiny = () => props.isShiny || false;

  return (
    <div
      class={`inline-flex items-center justify-center select-none ${props.class || ''}`}
      style={{
        filter: isShiny()
          ? 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.9))'
          : 'drop-shadow(0 0 6px rgba(0, 229, 255, 0.3))'
      }}
    >
      {/* 1. SARDINA / MINNOW (common) */}
      {(props.fishId === 'syntax_sardine' || props.rarity === 'common') && (
        <svg
          width={size()}
          height={size() * 0.5}
          viewBox="0 0 24 12"
          shape-rendering="crispEdges"
        >
          {/* Body */}
          <rect x="4" y="4" width="12" height="4" fill={isShiny() ? "#fbbf24" : "#38bdf8"} />
          <rect x="2" y="5" width="2" height="2" fill={isShiny() ? "#f59e0b" : "#0284c7"} />
          <rect x="16" y="5" width="2" height="2" fill={isShiny() ? "#f59e0b" : "#0284c7"} />
          {/* Dorsal & Belly fins */}
          <rect x="8" y="3" width="4" height="1" fill={isShiny() ? "#d97706" : "#0369a1"} />
          <rect x="8" y="8" width="4" height="1" fill={isShiny() ? "#d97706" : "#0369a1"} />
          {/* Tail */}
          <rect x="18" y="4" width="2" height="4" fill={isShiny() ? "#f59e0b" : "#38bdf8"} />
          <rect x="20" y="3" width="2" height="2" fill={isShiny() ? "#d97706" : "#0284c7"} />
          <rect x="20" y="7" width="2" height="2" fill={isShiny() ? "#d97706" : "#0284c7"} />
          {/* Eye */}
          <rect x="5" y="5" width="1" height="1" fill="#ffffff" />
          <rect x="6" y="5" width="1" height="1" fill="#000000" />
        </svg>
      )}

      {/* 2. CARPA / SALMÓN (uncommon) */}
      {(props.fishId === 'compiler_carp' || props.fishId === 'recursive_salmon' || (props.rarity === 'uncommon' && props.fishId !== 'syntax_sardine')) && (
        <svg
          width={size() * 1.1}
          height={size() * 0.6}
          viewBox="0 0 26 14"
          shape-rendering="crispEdges"
        >
          {/* Body */}
          <rect x="4" y="3" width="14" height="8" fill={isShiny() ? "#fbbf24" : "#34d399"} />
          <rect x="2" y="5" width="2" height="4" fill={isShiny() ? "#d97706" : "#059669"} />
          <rect x="18" y="5" width="2" height="4" fill={isShiny() ? "#d97706" : "#059669"} />
          {/* Fins */}
          <rect x="9" y="2" width="6" height="1" fill={isShiny() ? "#b45309" : "#047857"} />
          <rect x="8" y="11" width="5" height="1" fill={isShiny() ? "#b45309" : "#047857"} />
          {/* Scales detail */}
          <rect x="8" y="5" width="2" height="2" fill={isShiny() ? "#fef08a" : "#6ee7b7"} />
          <rect x="12" y="7" width="2" height="2" fill={isShiny() ? "#fef08a" : "#6ee7b7"} />
          {/* Tail */}
          <rect x="20" y="5" width="2" height="4" fill={isShiny() ? "#f59e0b" : "#10b981"} />
          <rect x="22" y="3" width="2" height="3" fill={isShiny() ? "#d97706" : "#059669"} />
          <rect x="22" y="8" width="2" height="3" fill={isShiny() ? "#d97706" : "#059669"} />
          {/* Eye */}
          <rect x="5" y="5" width="2" height="2" fill="#ffffff" />
          <rect x="6" y="5" width="1" height="1" fill="#000000" />
        </svg>
      )}

      {/* 3. CALAMAR GIT / SQUID (rare) */}
      {(props.fishId === 'git_squid' || (props.rarity === 'rare' && props.fishId !== 'null_pointer_eel')) && (
        <svg
          width={size()}
          height={size() * 0.75}
          viewBox="0 0 24 18"
          shape-rendering="crispEdges"
        >
          {/* Head Mantle */}
          <rect x="2" y="5" width="12" height="8" fill={isShiny() ? "#f59e0b" : "#818cf8"} />
          <rect x="1" y="6" width="1" height="6" fill={isShiny() ? "#d97706" : "#6366f1"} />
          {/* Tentacles */}
          <rect x="14" y="4" width="4" height="2" fill={isShiny() ? "#fbbf24" : "#a5b4fc"} />
          <rect x="18" y="3" width="4" height="2" fill={isShiny() ? "#f59e0b" : "#818cf8"} />
          <rect x="14" y="8" width="5" height="2" fill={isShiny() ? "#fbbf24" : "#a5b4fc"} />
          <rect x="19" y="8" width="4" height="2" fill={isShiny() ? "#f59e0b" : "#818cf8"} />
          <rect x="14" y="12" width="4" height="2" fill={isShiny() ? "#fbbf24" : "#a5b4fc"} />
          <rect x="18" y="13" width="4" height="2" fill={isShiny() ? "#f59e0b" : "#818cf8"} />
          {/* Eye */}
          <rect x="10" y="7" width="2" height="2" fill="#ffffff" />
          <rect x="11" y="7" width="1" height="1" fill="#000000" />
        </svg>
      )}

      {/* 4. ANGUILA NULLPOINTER / GLITCH (glitch rare) */}
      {props.fishId === 'null_pointer_eel' && (
        <svg
          width={size() * 1.3}
          height={size() * 0.5}
          viewBox="0 0 28 10"
          shape-rendering="crispEdges"
        >
          {/* Jagged electric body */}
          <rect x="2" y="4" width="6" height="3" fill="#c084fc" />
          <rect x="8" y="2" width="6" height="3" fill="#a855f7" />
          <rect x="14" y="5" width="6" height="3" fill="#c084fc" />
          <rect x="20" y="3" width="6" height="2" fill="#e879f9" />
          {/* Electric sparks */}
          <rect x="6" y="1" width="1" height="1" fill="#fbcfe8" />
          <rect x="16" y="8" width="1" height="1" fill="#fbcfe8" />
          {/* Eye */}
          <rect x="4" y="4" width="1" height="1" fill="#ffffff" />
          <rect x="3" y="4" width="1" height="1" fill="#ef4444" />
        </svg>
      )}

      {/* 5. TIBURÓN KERNEL / SHARK (epic) */}
      {props.rarity === 'epic' && (
        <svg
          width={size() * 1.35}
          height={size() * 0.7}
          viewBox="0 0 30 16"
          shape-rendering="crispEdges"
        >
          {/* Shark Body */}
          <rect x="4" y="6" width="16" height="6" fill={isShiny() ? "#f59e0b" : "#64748b"} />
          <rect x="2" y="7" width="2" height="4" fill={isShiny() ? "#d97706" : "#475569"} />
          <rect x="20" y="7" width="3" height="4" fill={isShiny() ? "#d97706" : "#475569"} />
          {/* Dorsal Fin */}
          <rect x="11" y="2" width="4" height="4" fill={isShiny() ? "#b45309" : "#334155"} />
          <rect x="13" y="1" width="2" height="1" fill={isShiny() ? "#b45309" : "#334155"} />
          {/* Belly */}
          <rect x="6" y="10" width="12" height="2" fill="#cbd5e1" />
          {/* Tail */}
          <rect x="23" y="7" width="2" height="4" fill={isShiny() ? "#f59e0b" : "#64748b"} />
          <rect x="25" y="3" width="3" height="4" fill={isShiny() ? "#d97706" : "#475569"} />
          <rect x="25" y="11" width="3" height="4" fill={isShiny() ? "#d97706" : "#475569"} />
          {/* Eye */}
          <rect x="6" y="7" width="1" height="1" fill="#ffffff" />
          <rect x="5" y="7" width="1" height="1" fill="#000000" />
        </svg>
      )}

      {/* 6. BALLENA DOCKER / WHALE (legendary) */}
      {props.rarity === 'legendary' && (
        <svg
          width={size() * 1.5}
          height={size() * 0.8}
          viewBox="0 0 32 18"
          shape-rendering="crispEdges"
        >
          {/* Whale Body */}
          <rect x="4" y="5" width="18" height="9" fill={isShiny() ? "#fbbf24" : "#0284c7"} />
          <rect x="2" y="7" width="2" height="6" fill={isShiny() ? "#f59e0b" : "#0369a1"} />
          {/* Docker Containers on back */}
          <rect x="8" y="2" width="3" height="3" fill="#38bdf8" />
          <rect x="12" y="2" width="3" height="3" fill="#38bdf8" />
          <rect x="16" y="2" width="3" height="3" fill="#38bdf8" />
          {/* Belly lines */}
          <rect x="6" y="12" width="14" height="2" fill="#bae6fd" />
          {/* Tail */}
          <rect x="22" y="8" width="4" height="3" fill={isShiny() ? "#f59e0b" : "#0284c7"} />
          <rect x="26" y="4" width="3" height="4" fill={isShiny() ? "#d97706" : "#0369a1"} />
          <rect x="26" y="11" width="3" height="4" fill={isShiny() ? "#d97706" : "#0369a1"} />
          {/* Eye */}
          <rect x="6" y="7" width="2" height="2" fill="#ffffff" />
          <rect x="7" y="7" width="1" height="1" fill="#000000" />
        </svg>
      )}

      {/* 7. LEVIATÁN ASÍNCRONO / MYTHIC */}
      {props.rarity === 'mythic' && (
        <svg
          width={size() * 1.6}
          height={size() * 0.9}
          viewBox="0 0 36 20"
          shape-rendering="crispEdges"
        >
          {/* Serpentine Dragon Body */}
          <rect x="2" y="8" width="6" height="5" fill="#f43f5e" />
          <rect x="8" y="6" width="6" height="5" fill="#e11d48" />
          <rect x="14" y="9" width="6" height="5" fill="#f43f5e" />
          <rect x="20" y="6" width="6" height="5" fill="#e11d48" />
          <rect x="26" y="8" width="4" height="4" fill="#be123c" />
          <rect x="30" y="6" width="4" height="4" fill="#fda4af" />
          {/* Glowing Horns / Spikes */}
          <rect x="3" y="5" width="2" height="3" fill="#fb7185" />
          <rect x="9" y="3" width="2" height="3" fill="#fb7185" />
          <rect x="15" y="6" width="2" height="3" fill="#fb7185" />
          {/* Eye */}
          <rect x="4" y="9" width="2" height="2" fill="#fef08a" />
          <rect x="5" y="9" width="1" height="1" fill="#ef4444" />
        </svg>
      )}
    </div>
  );
};
