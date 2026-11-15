import { Component } from 'solid-js';
import { Rarity } from '@aquagentic/core-game';

interface FishGlyphProps {
  rarity: Rarity;
  isShiny?: boolean;
  size?: number;
  class?: string;
}

export const FishGlyph: Component<FishGlyphProps> = (props) => {
  const size = () => props.size || 28;

  // Rarity color mappings according to UI/UX Pro Max Dark Mode palette
  const strokeColor = () => {
    if (props.isShiny) return '#f59e0b'; // Amber Gold
    switch (props.rarity) {
      case 'common': return '#94a3b8'; // Slate
      case 'uncommon': return '#34d399'; // Emerald
      case 'rare': return '#38bdf8'; // Sky Cyan
      case 'epic': return '#a855f7'; // Purple
      case 'legendary': return '#fbbf24'; // Amber Gold
      case 'mythic': return '#f43f5e'; // Crimson Rose
      default: return '#38bdf8';
    }
  };

  return (
    <div
      class={`inline-flex items-center justify-center transition-all select-none ${props.class || ''}`}
      style={{
        filter: props.isShiny
          ? 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.8))'
          : `drop-shadow(0 0 4px ${strokeColor()}60)`
      }}
    >
      {/* Dynamic SVG Shapes per Rarity */}
      {props.rarity === 'common' && (
        <svg width={size()} height={size() * 0.55} viewBox="0 0 32 18" fill="none">
          <path
            d="M2 9C7 5 16 3 24 9C27 11 30 14 30 14L24 9L30 4C30 4 27 7 24 9C16 15 7 13 2 9Z"
            stroke={strokeColor()}
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill={props.isShiny ? 'rgba(245,158,11,0.2)' : 'rgba(148,163,184,0.1)'}
          />
          <circle cx="7" cy="8" r="1.2" fill={strokeColor()} />
        </svg>
      )}

      {props.rarity === 'uncommon' && (
        <svg width={size()} height={size() * 0.65} viewBox="0 0 34 22" fill="none">
          <path
            d="M3 11C8 4 19 3 26 11C29 13 32 17 32 17L26 11L32 5C32 5 29 9 26 11C19 19 8 18 3 11Z"
            stroke={strokeColor()}
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="rgba(52,211,153,0.15)"
          />
          <path d="M14 6C16 3 19 3 20 6" stroke={strokeColor()} stroke-width="1.5" stroke-linecap="round" />
          <circle cx="8" cy="9" r="1.5" fill={strokeColor()} />
        </svg>
      )}

      {props.rarity === 'rare' && (
        <svg width={size()} height={size() * 0.75} viewBox="0 0 36 26" fill="none">
          {/* Squid Shape */}
          <path
            d="M4 13C8 6 18 6 22 13C25 15 28 19 29 17L22 13L29 9C28 7 25 11 22 13C18 20 8 20 4 13Z"
            stroke={strokeColor()}
            stroke-width="2"
            fill="rgba(56,189,248,0.15)"
          />
          <path d="M26 13C29 13 32 12 34 10M26 13C29 14 32 16 34 18M25 13H33" stroke={strokeColor()} stroke-width="1.6" stroke-linecap="round" />
          <circle cx="9" cy="11" r="1.5" fill={strokeColor()} />
        </svg>
      )}

      {props.rarity === 'epic' && (
        <svg width={size() * 1.1} height={size() * 0.7} viewBox="0 0 40 24" fill="none">
          {/* Predatory Shark silhouette */}
          <path
            d="M2 12C9 7 20 4 28 10L36 3L32 11L38 18L28 14C20 20 9 17 2 12Z"
            stroke={strokeColor()}
            stroke-width="2"
            fill="rgba(168,85,247,0.18)"
            stroke-linejoin="round"
          />
          <path d="M18 6L21 2L24 6" stroke={strokeColor()} stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="8" cy="10" r="1.5" fill={strokeColor()} />
        </svg>
      )}

      {props.rarity === 'legendary' && (
        <svg width={size() * 1.25} height={size() * 0.8} viewBox="0 0 46 28" fill="none">
          {/* Majestic Whale silhouette */}
          <path
            d="M3 16C7 8 24 5 34 14C38 10 42 7 44 8L39 15L43 22C41 22 37 19 34 16C24 25 7 24 3 16Z"
            stroke={strokeColor()}
            stroke-width="2.2"
            fill="rgba(251,191,36,0.2)"
            stroke-linejoin="round"
          />
          <circle cx="10" cy="13" r="2" fill={strokeColor()} />
          <path d="M19 16C23 18 27 18 30 16" stroke={strokeColor()} stroke-width="1.5" stroke-linecap="round" />
        </svg>
      )}

      {props.rarity === 'mythic' && (
        <svg width={size() * 1.35} height={size() * 0.85} viewBox="0 0 50 30" fill="none">
          {/* Mythic Leviathan Serpent */}
          <path
            d="M2 15C6 7 15 8 20 15C25 22 34 21 38 14L46 6L42 16L48 24L37 17C33 24 24 25 19 17C15 9 6 10 2 15Z"
            stroke={strokeColor()}
            stroke-width="2.2"
            fill="rgba(244,63,94,0.25)"
            stroke-linejoin="round"
          />
          <circle cx="7" cy="13" r="2" fill={strokeColor()} />
          <path d="M19 11L21 7L24 11M29 11L31 7L34 11" stroke={strokeColor()} stroke-width="1.8" stroke-linecap="round" />
        </svg>
      )}
    </div>
  );
};
