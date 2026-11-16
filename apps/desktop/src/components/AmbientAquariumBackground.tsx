import { Component, For, createSignal, onMount, onCleanup, Show } from 'solid-js';
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
  animPattern: 'fish-patrol-shallow' | 'fish-patrol-deep' | 'fish-patrol-wide' | 'fish-patrol-dart';
  isShiny: boolean;
  scale: number;
}

interface AmbientAquariumBackgroundProps {
  biome: Biome;
  weather: Weather;
  activeFishes: SwimmingFishState[];
  onFishClick?: (fishId: string) => void;
}

interface BubbleParticle {
  id: number;
  drift: number;
}

interface FloatingPopup {
  id: number;
  text: string;
}

const InteractiveSwimmingFish: Component<{
  fish: SwimmingFishState;
  getMousePos: () => { x: number; y: number };
  onFishClick?: (fishId: string) => void;
}> = (props) => {
  let containerRef!: HTMLDivElement;
  let spriteWrapperRef!: HTMLDivElement;

  const [isFleeing, setIsFleeing] = createSignal(false);
  const [isHovered, setIsHovered] = createSignal(false);
  const [bubbles, setBubbles] = createSignal<BubbleParticle[]>([]);
  const [popups, setPopups] = createSignal<FloatingPopup[]>([]);

  // Species speed profiling
  const getBaseSpeed = () => {
    const id = props.fish.def.id;
    if (id === 'blue_whale' || id === 'giant_squid' || id === 'ocean_sunfish') return 36;
    if (id === 'atlantic_bluefin_tuna' || id === 'great_white_shark' || id === 'flying_fish') return 80;
    if (id === 'seahorse') return 38;
    return 52;
  };

  onMount(() => {
    // Initial random position based on percentage
    const w = window.innerWidth;
    const h = window.innerHeight;
    let x = (props.fish.leftPercent / 100) * w;
    let y = (props.fish.topPercent / 100) * h;

    let targetX = 80 + Math.random() * (w - 160);
    let targetY = 80 + Math.random() * (h - 200);

    let vx = (Math.random() - 0.5) * 30;
    let vy = (Math.random() - 0.5) * 20;

    let facingRight = vx > 0;
    let fleeTimer = 0;
    let nextWaypointTime = Date.now() + 3000 + Math.random() * 5000;
    const baseSpeed = getBaseSpeed();
    const phase = Math.random() * Math.PI * 2;

    let animFrameId: number;
    let lastTime = performance.now();

    const spawnBubble = () => {
      const bId = Date.now() + Math.random();
      const drift = (Math.random() - 0.5) * 40;
      setBubbles((prev) => [...prev.slice(-4), { id: bId, drift }]);
      setTimeout(() => {
        setBubbles((prev) => prev.filter((b) => b.id !== bId));
      }, 1200);
    };

    const update = (now: number) => {
      const dt = Math.min(0.08, (now - lastTime) / 1000);
      lastTime = now;

      const curW = window.innerWidth;
      const curH = window.innerHeight;

      // 1. Mouse Proximity Detection
      const mp = props.getMousePos();
      const dx = x - mp.x;
      const dy = y - mp.y;
      const dist = Math.hypot(dx, dy);

      // Startle & Flee if cursor gets close (< 120px)
      if (dist < 120) {
        if (!isFleeing()) {
          setIsFleeing(true);
          spawnBubble();
        }
        fleeTimer = 1.2;

        // Flee force away from cursor
        const angle = Math.atan2(dy, dx);
        const force = (1 - dist / 120) * 320;
        vx += Math.cos(angle) * force * dt;
        vy += Math.sin(angle) * force * dt;
      }

      if (fleeTimer > 0) {
        fleeTimer -= dt;
        if (fleeTimer <= 0) {
          setIsFleeing(false);
        }
      }

      // 2. Autonomous Waypoint Cruising
      if (!isFleeing()) {
        const distToTarget = Math.hypot(targetX - x, targetY - y);
        if (distToTarget < 50 || now > nextWaypointTime) {
          targetX = 70 + Math.random() * (curW - 140);
          targetY = 70 + Math.random() * (curH - 180);
          nextWaypointTime = now + 4000 + Math.random() * 6000;
        }

        // Steer towards target waypoint
        const targetAngle = Math.atan2(targetY - y, targetX - x);
        const cruiseAccel = 55;
        vx += Math.cos(targetAngle) * cruiseAccel * dt;
        vy += Math.sin(targetAngle) * cruiseAccel * dt;

        // Gentle sinusoidal wave bobbing
        vy += Math.sin(now * 0.0025 + phase) * 15 * dt;
      }

      // 3. Water resistance drag
      const drag = isFleeing() ? 0.94 : 0.91;
      vx *= Math.pow(drag, dt * 60);
      vy *= Math.pow(drag, dt * 60);

      // 4. Max speed clamp
      const maxSpd = isFleeing() ? baseSpeed * 2.6 : baseSpeed;
      const currentSpd = Math.hypot(vx, vy);
      if (currentSpd > maxSpd) {
        vx = (vx / currentSpd) * maxSpd;
        vy = (vy / currentSpd) * maxSpd;
      }

      // 5. Update Coordinates
      x += vx * dt;
      y += vy * dt;

      // 6. Aquarium Screen Boundaries Bounce
      const padX = 50;
      const padY = 50;
      if (x < padX) {
        x = padX;
        vx = Math.abs(vx) * 0.8;
        targetX = x + 250;
      } else if (x > curW - padX) {
        x = curW - padX;
        vx = -Math.abs(vx) * 0.8;
        targetX = x - 250;
      }

      if (y < padY) {
        y = padY;
        vy = Math.abs(vy) * 0.8;
        targetY = y + 150;
      } else if (y > curH - 100) {
        y = curH - 100;
        vy = -Math.abs(vy) * 0.8;
        targetY = y - 150;
      }

      // 7. Orientation (Base sprite faces LEFT)
      // Moving RIGHT -> scaleX(-1)
      // Moving LEFT -> scaleX(1)
      if (vx > 4) {
        facingRight = true;
      } else if (vx < -4) {
        facingRight = false;
      }

      // Dynamic tilt based on dive/rise angle
      const tilt = Math.max(-20, Math.min(20, (vy / maxSpd) * 22));

      // 8. 60 FPS Direct DOM GPU Transform (Zero SolidJS signal churn)
      if (containerRef) {
        containerRef.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      if (spriteWrapperRef) {
        const flip = facingRight ? -1 : 1;
        const finalTilt = facingRight ? -tilt : tilt;
        spriteWrapperRef.style.transform = `scaleX(${flip}) rotate(${finalTilt}deg)`;
      }

      animFrameId = requestAnimationFrame(update);
    };

    animFrameId = requestAnimationFrame(update);

    onCleanup(() => {
      cancelAnimationFrame(animFrameId);
    });
  });

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();

    // Somersault 360 Spin Animation
    if (spriteWrapperRef) {
      spriteWrapperRef.animate(
        [
          { transform: `${spriteWrapperRef.style.transform} rotate(0deg)` },
          { transform: `${spriteWrapperRef.style.transform} rotate(360deg)` }
        ],
        { duration: 550, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }
      );
    }

    // Spawn bonus pearls popup
    const popId = Date.now();
    setPopups((prev) => [...prev, { id: popId, text: '+1 💎' }]);
    setTimeout(() => {
      setPopups((prev) => prev.filter((p) => p.id !== popId));
    }, 900);

    // Spawn 3 rapid bubbles
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const bId = Date.now() + Math.random();
        const drift = (Math.random() - 0.5) * 50;
        setBubbles((prev) => [...prev, { id: bId, drift }]);
        setTimeout(() => setBubbles((prev) => prev.filter((b) => b.id !== bId)), 1200);
      }, i * 120);
    }

    props.onFishClick?.(props.fish.def.id);
  };

  return (
    <div
      ref={containerRef}
      class="absolute top-0 left-0 gpu-layer select-none pointer-events-auto"
      style={{
        "will-change": "transform",
        "touch-action": "none"
      }}
    >
      <div
        class="relative flex flex-col items-center group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {/* Floating Bubble Particles */}
        <For each={bubbles()}>
          {(bubble) => (
            <span
              class="absolute -top-3 text-xs animate-bubble-rise pointer-events-none select-none"
              style={{
                "--bubble-drift": `${bubble.drift}px`,
                left: '50%'
              }}
            >
              🫧
            </span>
          )}
        </For>

        {/* Floating Click Popup (+1 Pearl) */}
        <For each={popups()}>
          {(pop) => (
            <span class="absolute -top-6 text-[10px] font-mono font-medium text-amber-300 bg-[#181a24]/90 border border-amber-500/40 rounded-full px-2 py-0.5 animate-pearl-pop pointer-events-none shadow-md">
              {pop.text}
            </span>
          )}
        </For>

        {/* Startled Reaction Indicator */}
        <Show when={isFleeing()}>
          <span class="absolute -top-5 px-1.5 py-0.2 rounded-full bg-cyan-400 text-black text-[9px] font-bold font-mono tracking-tight animate-bounce pointer-events-none shadow-sm">
            !
          </span>
        </Show>

        {/* Fish Sprite Wrapper with Turn/Tilt Transform */}
        <div
          ref={spriteWrapperRef}
          class="transition-transform duration-75"
        >
          <PixelFish
            fishId={props.fish.def.id}
            rarity={props.fish.def.rarity}
            isShiny={props.fish.isShiny}
            size={44 * props.fish.scale}
            class={`transform transition-transform duration-150 ${
              isHovered() ? 'scale-115' : isFleeing() ? 'scale-105' : ''
            }`}
          />
        </div>

        {/* Identification Badge Pill (Graceful reveal on hover, invisible when idle) */}
        <span
          class={`mt-1.5 px-2 py-0.5 rounded-md text-[9px] font-mono whitespace-nowrap shadow-md transition-all duration-200 backdrop-blur-md pointer-events-none ${
            isHovered() || isFleeing()
              ? 'text-zinc-100 bg-[#13151f]/95 border border-white/[0.14] opacity-100 translate-y-0'
              : 'opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 text-zinc-300 bg-black/80 border border-white/[0.08]'
          }`}
        >
          {isFleeing() ? t('aquarium.fishStartled') : `${t(props.fish.def.nameKey)} (+${props.fish.def.basePPS} PPS)`}
        </span>
      </div>
    </div>
  );
};

export const AmbientAquariumBackground: Component<AmbientAquariumBackgroundProps> = (props) => {
  // Global Window Pointer Coordinates Tracker
  let mousePos = { x: -1000, y: -1000 };

  onMount(() => {
    const handlePointerMove = (e: PointerEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    };

    const handlePointerLeave = () => {
      mousePos.x = -1000;
      mousePos.y = -1000;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('blur', handlePointerLeave);

    onCleanup(() => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('blur', handlePointerLeave);
    });
  });

  const getMousePos = () => mousePos;

  return (
    <div
      class={`fixed inset-0 pointer-events-none overflow-hidden transition-colors duration-1000 z-0 select-none biome-ambient-${props.biome} ${
        props.weather === 'storm' ? 'weather-storm-active' : ''
      }`}
    >
      {/* Oceanic Subtle Atmospheric Depth */}
      <div class="absolute inset-0 opacity-25 pointer-events-none">
        <div class="absolute top-[15%] left-[25%] w-[450px] h-[450px] rounded-full bg-cyan-600/10 blur-[140px]" />
        <div class="absolute bottom-[20%] right-[30%] w-[500px] h-[500px] rounded-full bg-indigo-900/15 blur-[160px]" />
      </div>

      {/* Floating Plankton Particles */}
      <div class="absolute inset-0 opacity-40 pointer-events-none">
        <div class="absolute top-[25%] left-[18%] w-1.5 h-1.5 rounded-full bg-cyan-300/60 animate-pulse" />
        <div
          class="absolute top-[70%] left-[65%] w-1 h-1 rounded-full bg-emerald-300/50 animate-pulse"
          style={{ "animation-delay": "1.2s" }}
        />
        <div
          class="absolute top-[45%] right-[15%] w-2 h-2 rounded-full bg-blue-300/40 animate-pulse"
          style={{ "animation-delay": "2.4s" }}
        />
      </div>

      {/* Autonomous Organic Swimming Fishes Layer with Mouse Hover/Proximity Reaction */}
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <For each={props.activeFishes}>
          {(fish) => (
            <InteractiveSwimmingFish
              fish={fish}
              getMousePos={getMousePos}
              onFishClick={props.onFishClick}
            />
          )}
        </For>
      </div>
    </div>
  );
};
