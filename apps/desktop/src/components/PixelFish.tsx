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
 * Authentic Retro Pixel Art Sprites for REAL Marine Species
 * All base SVGs face LEFT (Head on left, tail on right).
 */
export const PixelFish: Component<PixelFishProps> = (props) => {
  const size = () => props.size || 40;
  const isShiny = () => props.isShiny || false;

  return (
    <div
      class={`inline-flex items-center justify-center select-none ${props.class || ''}`}
      style={{
        filter: isShiny()
          ? 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.75)) drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
          : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.45))'
      }}
    >
      {/* 1. PEZ PAYASO (Clownfish) - Orange & White Bands */}
      {props.fishId === 'clownfish' && (
        <svg width={size()} height={size() * 0.6} viewBox="0 0 24 14" shape-rendering="crispEdges">
          {/* Orange Body */}
          <rect x="4" y="4" width="14" height="6" fill={isShiny() ? "#fbbf24" : "#f97316"} />
          <rect x="2" y="5" width="2" height="4" fill={isShiny() ? "#d97706" : "#ea580c"} />
          {/* White vertical bands with black borders */}
          <rect x="6" y="3" width="2" height="8" fill="#ffffff" />
          <rect x="5" y="3" width="1" height="8" fill="#09090b" />
          <rect x="8" y="3" width="1" height="8" fill="#09090b" />
          <rect x="12" y="4" width="2" height="6" fill="#ffffff" />
          <rect x="11" y="4" width="1" height="6" fill="#09090b" />
          <rect x="14" y="4" width="1" height="6" fill="#09090b" />
          {/* Fins */}
          <rect x="8" y="2" width="4" height="2" fill={isShiny() ? "#f59e0b" : "#ea580c"} />
          <rect x="9" y="10" width="3" height="2" fill={isShiny() ? "#f59e0b" : "#ea580c"} />
          {/* Tail */}
          <rect x="18" y="5" width="2" height="4" fill="#ffffff" />
          <rect x="17" y="5" width="1" height="4" fill="#09090b" />
          <rect x="20" y="4" width="2" height="6" fill={isShiny() ? "#fbbf24" : "#f97316"} />
          {/* Eye */}
          <rect x="3" y="5" width="1" height="1" fill="#000000" />
        </svg>
      )}

      {/* 2. CIRUJANO AZUL (Blue Tang) - Sapphire Blue & Bright Yellow Tail */}
      {props.fishId === 'blue_tang' && (
        <svg width={size()} height={size() * 0.65} viewBox="0 0 24 15" shape-rendering="crispEdges">
          {/* Royal Blue Body */}
          <rect x="4" y="3" width="13" height="8" fill={isShiny() ? "#fbbf24" : "#2563eb"} />
          <rect x="2" y="5" width="2" height="4" fill={isShiny() ? "#d97706" : "#1d4ed8"} />
          {/* Black curved palette pattern */}
          <rect x="7" y="4" width="8" height="2" fill="#0f172a" />
          <rect x="6" y="6" width="3" height="4" fill="#0f172a" />
          {/* Bright Yellow Tail Fin */}
          <rect x="17" y="5" width="2" height="4" fill="#facc15" />
          <rect x="19" y="3" width="3" height="8" fill="#eab308" />
          <rect x="22" y="2" width="1" height="10" fill="#ca8a04" />
          {/* Eye */}
          <rect x="3" y="5" width="1" height="1" fill="#fef08a" />
          <rect x="4" y="5" width="1" height="1" fill="#000000" />
        </svg>
      )}

      {/* 3. CABALLITO DE MAR (Seahorse) - Golden/Amber upright */}
      {props.fishId === 'seahorse' && (
        <svg width={size() * 0.6} height={size()} viewBox="0 0 14 24" shape-rendering="crispEdges">
          {/* Snout */}
          <rect x="1" y="4" width="3" height="2" fill={isShiny() ? "#facc15" : "#f59e0b"} />
          {/* Crown Head */}
          <rect x="4" y="2" width="4" height="2" fill={isShiny() ? "#eab308" : "#d97706"} />
          <rect x="4" y="4" width="5" height="4" fill={isShiny() ? "#facc15" : "#f59e0b"} />
          {/* Curved Body */}
          <rect x="5" y="8" width="5" height="6" fill={isShiny() ? "#facc15" : "#f59e0b"} />
          <rect x="6" y="14" width="4" height="4" fill={isShiny() ? "#eab308" : "#d97706"} />
          {/* Coiled Tail */}
          <rect x="4" y="18" width="4" height="3" fill={isShiny() ? "#eab308" : "#d97706"} />
          <rect x="3" y="19" width="2" height="2" fill={isShiny() ? "#b45309" : "#b45309"} />
          {/* Eye */}
          <rect x="5" y="4" width="1" height="1" fill="#000000" />
        </svg>
      )}

      {/* 4. PEZ ÁNGEL FRANCÉS (French Angelfish) - Black Disc with Gold Lace */}
      {props.fishId === 'french_angelfish' && (
        <svg width={size() * 0.9} height={size() * 0.8} viewBox="0 0 22 20" shape-rendering="crispEdges">
          {/* Deep Dark Body */}
          <rect x="4" y="4" width="12" height="12" fill="#18181b" />
          <rect x="2" y="8" width="2" height="4" fill="#27272a" />
          {/* Golden scale rims */}
          <rect x="6" y="6" width="1" height="2" fill="#facc15" />
          <rect x="9" y="8" width="1" height="2" fill="#facc15" />
          <rect x="7" y="11" width="1" height="2" fill="#facc15" />
          <rect x="11" y="12" width="1" height="2" fill="#facc15" />
          {/* Yellow dorsal & tail edge */}
          <rect x="8" y="2" width="6" height="2" fill="#eab308" />
          <rect x="16" y="7" width="2" height="6" fill="#facc15" />
          <rect x="18" y="8" width="2" height="4" fill="#ca8a04" />
          {/* Eye */}
          <rect x="3" y="8" width="1" height="1" fill="#fef08a" />
        </svg>
      )}

      {/* 5. PEZ LEÓN ROJO (Lionfish) - Radiating Spines */}
      {props.fishId === 'lionfish' && (
        <svg width={size() * 1.2} height={size() * 0.8} viewBox="0 0 28 18" shape-rendering="crispEdges">
          {/* Radiating Spines */}
          <rect x="6" y="1" width="1" height="4" fill="#dc2626" />
          <rect x="9" y="0" width="1" height="5" fill="#ef4444" />
          <rect x="12" y="1" width="1" height="4" fill="#dc2626" />
          <rect x="15" y="2" width="1" height="4" fill="#ef4444" />
          {/* Striped Body */}
          <rect x="3" y="6" width="16" height="7" fill="#fecaca" />
          <rect x="5" y="6" width="2" height="7" fill="#b91c1c" />
          <rect x="9" y="6" width="2" height="7" fill="#b91c1c" />
          <rect x="13" y="6" width="2" height="7" fill="#b91c1c" />
          {/* Spreading pectoral fan */}
          <rect x="7" y="10" width="5" height="5" fill="#f87171" />
          {/* Tail */}
          <rect x="19" y="7" width="4" height="5" fill="#ef4444" />
          <rect x="23" y="6" width="2" height="7" fill="#fca5a5" />
          {/* Eye */}
          <rect x="4" y="7" width="1" height="1" fill="#000000" />
        </svg>
      )}

      {/* 6. PEZ MANDARÍN (Mandarin Dragonet) - Turquoise & Orange Psychedelic */}
      {props.fishId === 'mandarin_dragonet' && (
        <svg width={size() * 1.1} height={size() * 0.65} viewBox="0 0 26 15" shape-rendering="crispEdges">
          {/* Psychedelic Body */}
          <rect x="3" y="4" width="15" height="7" fill="#0284c7" />
          <rect x="6" y="5" width="2" height="5" fill="#f97316" />
          <rect x="10" y="4" width="2" height="6" fill="#10b981" />
          <rect x="13" y="6" width="2" height="4" fill="#f97316" />
          {/* Flowing blue/orange fins */}
          <rect x="8" y="1" width="4" height="3" fill="#38bdf8" />
          <rect x="7" y="11" width="5" height="3" fill="#38bdf8" />
          {/* Tail */}
          <rect x="18" y="5" width="3" height="5" fill="#0284c7" />
          <rect x="21" y="3" width="3" height="9" fill="#06b6d4" />
          {/* Big Orange Eye */}
          <rect x="4" y="5" width="2" height="2" fill="#fb923c" />
          <rect x="4" y="5" width="1" height="1" fill="#000000" />
        </svg>
      )}

      {/* 7. PEZ MARIPOSA PICO LARGO (Copperband Butterflyfish) */}
      {props.fishId === 'copperband_butterfly' && (
        <svg width={size()} height={size() * 0.8} viewBox="0 0 24 18" shape-rendering="crispEdges">
          {/* Elongated Snout */}
          <rect x="1" y="9" width="4" height="1" fill="#fed7aa" />
          {/* Tall Compressed Body */}
          <rect x="5" y="3" width="12" height="12" fill="#ffffff" />
          {/* Copper vertical bands */}
          <rect x="6" y="3" width="2" height="12" fill="#ea580c" />
          <rect x="11" y="4" width="2" height="10" fill="#ea580c" />
          <rect x="15" y="5" width="2" height="8" fill="#ea580c" />
          {/* False Eye spot on dorsal fin */}
          <rect x="14" y="3" width="2" height="2" fill="#000000" />
          {/* Tail */}
          <rect x="17" y="7" width="4" height="4" fill="#fed7aa" />
          {/* Real Eye */}
          <rect x="5" y="8" width="1" height="1" fill="#000000" />
        </svg>
      )}

      {/* 8. PEZ GLOBO ENANO (Pufferfish) - Round Spiky */}
      {props.fishId === 'pufferfish' && (
        <svg width={size() * 0.85} height={size() * 0.75} viewBox="0 0 20 16" shape-rendering="crispEdges">
          {/* Bulbous Body */}
          <rect x="3" y="3" width="12" height="10" fill="#facc15" />
          <rect x="2" y="5" width="2" height="6" fill="#eab308" />
          <rect x="15" y="5" width="2" height="6" fill="#eab308" />
          {/* Spots */}
          <rect x="5" y="5" width="2" height="2" fill="#713f12" />
          <rect x="9" y="7" width="2" height="2" fill="#713f12" />
          <rect x="6" y="9" width="2" height="2" fill="#713f12" />
          {/* Tiny Tail */}
          <rect x="17" y="6" width="2" height="4" fill="#ca8a04" />
          {/* Big Cute Eye */}
          <rect x="3" y="5" width="2" height="2" fill="#ffffff" />
          <rect x="3" y="5" width="1" height="1" fill="#000000" />
        </svg>
      )}

      {/* 9. PULPO DE ANILLOS AZULES (Blue-Ringed Octopus) */}
      {props.fishId === 'blue_ringed_octopus' && (
        <svg width={size()} height={size() * 0.8} viewBox="0 0 24 18" shape-rendering="crispEdges">
          {/* Golden Mantle */}
          <rect x="3" y="3" width="10" height="7" fill="#d97706" />
          {/* Glowing Blue Rings */}
          <rect x="5" y="4" width="2" height="2" fill="#38bdf8" />
          <rect x="9" y="5" width="2" height="2" fill="#38bdf8" />
          <rect x="6" y="7" width="2" height="2" fill="#38bdf8" />
          {/* Tentacles */}
          <rect x="13" y="5" width="4" height="2" fill="#b45309" />
          <rect x="17" y="4" width="4" height="2" fill="#38bdf8" />
          <rect x="13" y="9" width="6" height="2" fill="#b45309" />
          <rect x="19" y="10" width="3" height="2" fill="#38bdf8" />
          <rect x="11" y="12" width="6" height="2" fill="#b45309" />
          <rect x="17" y="13" width="4" height="2" fill="#38bdf8" />
          {/* Eye */}
          <rect x="4" y="6" width="1" height="1" fill="#000000" />
        </svg>
      )}

      {/* 10. PEZ RAPE ABISAL (Deep Sea Anglerfish) - Glowing Lure */}
      {props.fishId === 'anglerfish' && (
        <svg width={size() * 1.1} height={size() * 0.8} viewBox="0 0 26 18" shape-rendering="crispEdges">
          {/* Glowing Bioluminescent Lure (Esca) */}
          <rect x="2" y="1" width="3" height="3" fill="#fef08a" />
          {/* Curved stalk */}
          <rect x="5" y="2" width="2" height="2" fill="#71717a" />
          <rect x="7" y="4" width="2" height="2" fill="#71717a" />
          {/* Dark Midnight Body */}
          <rect x="5" y="6" width="14" height="9" fill="#18181b" />
          {/* Jaws & Needle Teeth */}
          <rect x="2" y="8" width="4" height="5" fill="#27272a" />
          <rect x="2" y="8" width="1" height="2" fill="#ffffff" />
          <rect x="4" y="8" width="1" height="2" fill="#ffffff" />
          <rect x="3" y="12" width="1" height="2" fill="#ffffff" />
          {/* Tail */}
          <rect x="19" y="8" width="3" height="4" fill="#3f3f46" />
          {/* Eye */}
          <rect x="6" y="8" width="1" height="1" fill="#38bdf8" />
        </svg>
      )}

      {/* 11. MORENA GIGANTE (Giant Moray Eel) - Serpentine Predator */}
      {props.fishId === 'moray_eel' && (
        <svg width={size() * 1.3} height={size() * 0.55} viewBox="0 0 32 14" shape-rendering="crispEdges">
          {/* Long Muscular Body with Leopard Spots */}
          <rect x="2" y="5" width="24" height="5" fill="#78350f" />
          <rect x="6" y="6" width="2" height="2" fill="#451a03" />
          <rect x="12" y="7" width="2" height="2" fill="#451a03" />
          <rect x="18" y="6" width="2" height="2" fill="#451a03" />
          {/* Dorsal Ribbon Fin */}
          <rect x="4" y="3" width="22" height="2" fill="#92400e" />
          {/* Open Jaws */}
          <rect x="1" y="5" width="3" height="2" fill="#451a03" />
          <rect x="1" y="8" width="3" height="2" fill="#451a03" />
          <rect x="2" y="6" width="1" height="1" fill="#ffffff" />
          {/* Tail */}
          <rect x="26" y="6" width="4" height="3" fill="#92400e" />
          {/* Piercing Eye */}
          <rect x="4" y="5" width="1" height="1" fill="#facc15" />
        </svg>
      )}

      {/* 12. GRAN BARRACUDA (Great Barracuda) - Torpedo Silver */}
      {props.fishId === 'barracuda' && (
        <svg width={size() * 1.35} height={size() * 0.5} viewBox="0 0 32 12" shape-rendering="crispEdges">
          {/* Slender Torpedo Body */}
          <rect x="2" y="4" width="22" height="4" fill="#94a3b8" />
          <rect x="1" y="5" width="2" height="2" fill="#64748b" />
          {/* Dark vertical crossbars */}
          <rect x="8" y="4" width="1" height="4" fill="#334155" />
          <rect x="12" y="4" width="1" height="4" fill="#334155" />
          <rect x="16" y="4" width="1" height="4" fill="#334155" />
          {/* Forked Tail */}
          <rect x="24" y="4" width="2" height="4" fill="#64748b" />
          <rect x="26" y="2" width="2" height="3" fill="#475569" />
          <rect x="26" y="7" width="2" height="3" fill="#475569" />
          {/* Eye */}
          <rect x="3" y="5" width="1" height="1" fill="#000000" />
        </svg>
      )}

      {/* 13. TIBURÓN DUENDE (Goblin Shark) */}
      {props.fishId === 'goblin_shark' && (
        <svg width={size() * 1.35} height={size() * 0.65} viewBox="0 0 32 15" shape-rendering="crispEdges">
          {/* Elongated Blade Snout */}
          <rect x="0" y="4" width="6" height="2" fill="#f472b6" />
          {/* Protruding Slingshot Jaw */}
          <rect x="4" y="7" width="5" height="3" fill="#cbd5e1" />
          <rect x="5" y="8" width="1" height="1" fill="#ffffff" />
          {/* Pinkish Deep-Sea Body */}
          <rect x="6" y="5" width="18" height="6" fill="#ec4899" />
          {/* Tail */}
          <rect x="24" y="6" width="3" height="4" fill="#db2777" />
          <rect x="27" y="3" width="3" height="4" fill="#be185d" />
          {/* Eye */}
          <rect x="5" y="4" width="1" height="1" fill="#000000" />
        </svg>
      )}

      {/* 14. TIBURÓN MARTILLO (Great Hammerhead Shark) */}
      {props.fishId === 'hammerhead_shark' && (
        <svg width={size() * 1.35} height={size() * 0.7} viewBox="0 0 32 16" shape-rendering="crispEdges">
          {/* T-Shaped Cephalofoil Head */}
          <rect x="2" y="2" width="3" height="12" fill="#64748b" />
          <rect x="1" y="2" width="1" height="2" fill="#38bdf8" />
          <rect x="1" y="12" width="1" height="2" fill="#38bdf8" />
          {/* Shark Body */}
          <rect x="5" y="5" width="16" height="6" fill="#475569" />
          {/* Tall Sickle Dorsal Fin */}
          <rect x="11" y="1" width="4" height="4" fill="#334155" />
          <rect x="12" y="0" width="2" height="1" fill="#334155" />
          {/* Tail */}
          <rect x="21" y="6" width="3" height="4" fill="#334155" />
          <rect x="24" y="2" width="3" height="5" fill="#1e293b" />
          <rect x="24" y="9" width="2" height="3" fill="#1e293b" />
        </svg>
      )}

      {/* 15. MANTA RAYA GIGANTE (Manta Ray) - Broad Diamond Wings */}
      {props.fishId === 'manta_ray' && (
        <svg width={size() * 1.3} height={size() * 0.9} viewBox="0 0 30 22" shape-rendering="crispEdges">
          {/* Cephalic Horn Lobes */}
          <rect x="2" y="7" width="2" height="3" fill="#38bdf8" />
          <rect x="2" y="12" width="2" height="3" fill="#38bdf8" />
          {/* Broad Diamond Body */}
          <rect x="4" y="6" width="16" height="10" fill="#0f172a" />
          {/* Wings spreading up and down */}
          <rect x="7" y="2" width="6" height="4" fill="#1e293b" />
          <rect x="9" y="0" width="4" height="2" fill="#334155" />
          <rect x="7" y="16" width="6" height="4" fill="#1e293b" />
          <rect x="9" y="20" width="4" height="2" fill="#334155" />
          {/* Whip Tail */}
          <rect x="20" y="10" width="8" height="2" fill="#475569" />
        </svg>
      )}

      {/* 16. PEZ LUNA GIGANTE (Ocean Sunfish / Mola Mola) - Massive Disc */}
      {props.fishId === 'ocean_sunfish' && (
        <svg width={size()} height={size() * 1.15} viewBox="0 0 22 26" shape-rendering="crispEdges">
          {/* Tall Dorsal & Anal fins */}
          <rect x="10" y="1" width="4" height="6" fill="#64748b" />
          <rect x="10" y="19" width="4" height="6" fill="#64748b" />
          {/* Circular Round Body */}
          <rect x="3" y="6" width="14" height="14" fill="#94a3b8" />
          <rect x="1" y="10" width="2" height="6" fill="#cbd5e1" />
          {/* Truncated clavus tail */}
          <rect x="17" y="7" width="2" height="12" fill="#475569" />
          {/* Calm Round Eye */}
          <rect x="3" y="10" width="2" height="2" fill="#000000" />
        </svg>
      )}

      {/* 17. GRAN TIBURÓN BLANCO (Great White Shark) */}
      {props.fishId === 'great_white_shark' && (
        <svg width={size() * 1.4} height={size() * 0.75} viewBox="0 0 32 16" shape-rendering="crispEdges">
          {/* Dark Slate Back */}
          <rect x="5" y="4" width="17" height="4" fill="#334155" />
          <rect x="2" y="6" width="3" height="3" fill="#475569" />
          {/* White Underbelly */}
          <rect x="5" y="8" width="17" height="4" fill="#f8fafc" />
          {/* Dorsal Fin */}
          <rect x="12" y="1" width="4" height="3" fill="#1e293b" />
          <rect x="14" y="0" width="2" height="1" fill="#1e293b" />
          {/* Tail */}
          <rect x="22" y="6" width="3" height="4" fill="#334155" />
          <rect x="25" y="2" width="3" height="5" fill="#1e293b" />
          <rect x="25" y="9" width="3" height="5" fill="#1e293b" />
          {/* Black Eye */}
          <rect x="4" y="6" width="1" height="1" fill="#000000" />
        </svg>
      )}

      {/* 18. TIBURÓN BALLENA (Whale Shark) - Constellation Dotted Colossus */}
      {props.fishId === 'whale_shark' && (
        <svg width={size() * 1.55} height={size() * 0.8} viewBox="0 0 34 17" shape-rendering="crispEdges">
          {/* Broad Navy Body */}
          <rect x="4" y="4" width="20" height="9" fill="#1e3a8a" />
          <rect x="1" y="6" width="3" height="5" fill="#172554" />
          {/* Star-like Constellation White Dots */}
          <rect x="8" y="6" width="1" height="1" fill="#ffffff" />
          <rect x="11" y="8" width="1" height="1" fill="#ffffff" />
          <rect x="14" y="6" width="1" height="1" fill="#ffffff" />
          <rect x="17" y="9" width="1" height="1" fill="#ffffff" />
          <rect x="20" y="7" width="1" height="1" fill="#ffffff" />
          {/* Dorsal Fin */}
          <rect x="16" y="2" width="3" height="2" fill="#172554" />
          {/* Tail */}
          <rect x="24" y="7" width="3" height="4" fill="#172554" />
          <rect x="27" y="3" width="3" height="5" fill="#1e3a8a" />
          <rect x="27" y="10" width="3" height="4" fill="#1e3a8a" />
        </svg>
      )}

      {/* 19. PEZ REMO GIGANTE (Giant Oarfish) - Silver Ribbon with Crimson Crest */}
      {props.fishId === 'giant_oarfish' && (
        <svg width={size() * 1.6} height={size() * 0.6} viewBox="0 0 36 14" shape-rendering="crispEdges">
          {/* Crimson Crown / Crest */}
          <rect x="1" y="0" width="2" height="4" fill="#ef4444" />
          <rect x="3" y="1" width="2" height="3" fill="#dc2626" />
          {/* Long Undulating Silver Ribbon Body */}
          <rect x="1" y="4" width="28" height="4" fill="#e2e8f0" />
          <rect x="2" y="8" width="24" height="2" fill="#cbd5e1" />
          {/* Crimson dorsal fin running entire length */}
          <rect x="4" y="3" width="26" height="1" fill="#f87171" />
          {/* Tapered Tail */}
          <rect x="29" y="5" width="5" height="2" fill="#ef4444" />
          {/* Luminous Eye */}
          <rect x="2" y="5" width="1" height="1" fill="#000000" />
        </svg>
      )}

      {/* 20. CELACANTO (Coelacanth) - Prehistoric Living Fossil */}
      {props.fishId === 'coelacanth' && (
        <svg width={size() * 1.3} height={size() * 0.7} viewBox="0 0 30 16" shape-rendering="crispEdges">
          {/* Steel Blue Body with Pale Spots */}
          <rect x="4" y="4" width="16" height="7" fill="#1e293b" />
          <rect x="2" y="6" width="2" height="4" fill="#0f172a" />
          <rect x="8" y="6" width="1" height="1" fill="#94a3b8" />
          <rect x="13" y="7" width="1" height="1" fill="#94a3b8" />
          {/* Unique Prehistoric Lobed Fins */}
          <rect x="7" y="11" width="3" height="3" fill="#334155" />
          <rect x="13" y="11" width="3" height="3" fill="#334155" />
          <rect x="11" y="2" width="3" height="2" fill="#334155" />
          {/* Tri-lobed Primitive Tail */}
          <rect x="20" y="5" width="3" height="5" fill="#1e293b" />
          <rect x="23" y="4" width="3" height="7" fill="#334155" />
          <rect x="26" y="6" width="2" height="3" fill="#64748b" />
          {/* Eye */}
          <rect x="4" y="6" width="1" height="1" fill="#facc15" />
        </svg>
      )}

      {/* 21. CALAMAR COLOSAL (Colossal Squid) - Crimson Deep Sea Titan */}
      {props.fishId === 'colossal_squid' && (
        <svg width={size() * 1.45} height={size() * 0.8} viewBox="0 0 32 18" shape-rendering="crispEdges">
          {/* Massive Crimson Mantle */}
          <rect x="2" y="4" width="14" height="9" fill="#be123c" />
          <rect x="1" y="6" width="1" height="5" fill="#881337" />
          {/* Giant Luminous Eye */}
          <rect x="10" y="7" width="3" height="3" fill="#fef08a" />
          <rect x="11" y="7" width="2" height="2" fill="#000000" />
          {/* Thick Hooked Tentacles */}
          <rect x="16" y="4" width="5" height="2" fill="#e11d48" />
          <rect x="21" y="3" width="6" height="2" fill="#fda4af" />
          <rect x="16" y="8" width="7" height="2" fill="#e11d48" />
          <rect x="23" y="7" width="6" height="2" fill="#fda4af" />
          <rect x="16" y="12" width="5" height="2" fill="#e11d48" />
          <rect x="21" y="13" width="6" height="2" fill="#fda4af" />
        </svg>
      )}

      {/* 22. TIBURÓN DE GROENLANDIA (Greenland Shark) - Ancient 400yr Ghost */}
      {(props.fishId === 'greenland_shark' || props.rarity === 'mythic') && (
        <svg width={size() * 1.55} height={size() * 0.75} viewBox="0 0 34 16" shape-rendering="crispEdges">
          {/* Ancient Mottled Slate Body */}
          <rect x="4" y="4" width="20" height="8" fill="#334155" />
          <rect x="2" y="6" width="2" height="4" fill="#1e293b" />
          {/* Ghostly Skin Texture */}
          <rect x="8" y="5" width="2" height="2" fill="#475569" />
          <rect x="14" y="7" width="2" height="2" fill="#475569" />
          <rect x="18" y="6" width="2" height="2" fill="#475569" />
          {/* Small Ancient Dorsal Fin */}
          <rect x="16" y="2" width="3" height="2" fill="#1e293b" />
          {/* Tail */}
          <rect x="24" y="6" width="3" height="4" fill="#1e293b" />
          <rect x="27" y="3" width="3" height="5" fill="#334155" />
          <rect x="27" y="9" width="3" height="4" fill="#334155" />
          {/* Pale Ghostly Eye */}
          <rect x="4" y="6" width="1" height="1" fill="#e2e8f0" />
        </svg>
      )}
    </div>
  );
};
