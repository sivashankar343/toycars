import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, RotateCcw, Zap, Volume2, Trophy, Flame, Flag, Compass, ChevronRight } from 'lucide-react';
import { ToyVehicle } from '../types/vehicle';
import { soundEngine } from '../utils/soundEngine';

interface SpeedwayGameViewProps {
  vehicle: ToyVehicle;
  onSwitchVehicle: () => void;
}

type TrackEnvironment = 'hot-stunt-loop' | 'monster-mud-arena' | 'drag-drift-oval';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface SkidMark {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  alpha: number;
}

interface CollectibleStar {
  x: number;
  y: number;
  collected: boolean;
}

export const SpeedwayGameView: React.FC<SpeedwayGameViewProps> = ({
  vehicle,
  onSwitchVehicle
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [activeTrack, setActiveTrack] = useState<TrackEnvironment>('hot-stunt-loop');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMph, setSpeedMph] = useState<number>(0);
  const [nitroFuel, setNitroFuel] = useState<number>(100);
  const [score, setScore] = useState<number>(0);
  const [topSpeedRecord, setTopSpeedRecord] = useState<number>(0);
  const [lapTime, setLapTime] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [stuntMessage, setStuntMessage] = useState<string>('');

  // Car Physics Simulation State (stored in ref for smooth 60fps canvas loop)
  const carState = useRef({
    x: 400,
    y: 450,
    vx: 0,
    vy: 0,
    speed: 0,
    angle: -Math.PI / 2, // Facing upward
    angularVelocity: 0,
    isNitroActive: false,
    isInLoop: false,
    loopProgress: 0,
    isJumping: false,
    jumpAltitude: 0
  });

  // Track & Environment items
  const particles = useRef<Particle[]>([]);
  const skidMarks = useRef<SkidMark[]>([]);
  const stars = useRef<CollectibleStar[]>([
    { x: 400, y: 180, collected: false },
    { x: 680, y: 240, collected: false },
    { x: 250, y: 350, collected: false },
    { x: 500, y: 520, collected: false },
    { x: 180, y: 220, collected: false }
  ]);

  // Key controls map
  const keys = useRef<{ [key: string]: boolean }>({});

  const trackConfigs = {
    'hot-stunt-loop': {
      name: 'Mega Loop-de-Loop Stunt Canyon',
      description: 'Hot-wheels orange ribbon track with 360-degree gravity loop and booster pads',
      accentColor: '#f97316',
      bgType: 'orange-ribbon'
    },
    'monster-mud-arena': {
      name: 'Crusher Arena & Mud Bogs',
      description: 'Rough terrain with mud pools, jump mounds, and crushable mini cars',
      accentColor: '#22c55e',
      bgType: 'dirt-arena'
    },
    'drag-drift-oval': {
      name: 'Downtown Drag & Drift Speedway',
      description: 'Asphalt hairpins, Christmas tree launch lights, and high-speed drift zones',
      accentColor: '#06b6d4',
      bgType: 'asphalt-speedway'
    }
  };

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      if (e.key.toLowerCase() === 'h') {
        soundEngine.honkHorn();
      }
      if (e.key === ' ' && nitroFuel > 10) {
        soundEngine.turboBoost();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nitroFuel]);

  // Reset Car Position
  const resetRun = useCallback(() => {
    carState.current = {
      x: 400,
      y: 450,
      vx: 0,
      vy: 0,
      speed: 0,
      angle: -Math.PI / 2,
      angularVelocity: 0,
      isNitroActive: false,
      isInLoop: false,
      loopProgress: 0,
      isJumping: false,
      jumpAltitude: 0
    };
    particles.current = [];
    skidMarks.current = [];
    stars.current = stars.current.map((s) => ({ ...s, collected: false }));
    setNitroFuel(100);
    setScore(0);
    setLapTime(0);
    setIsGameOver(false);
    setStuntMessage('');
    soundEngine.clickSwitch();
  }, []);

  // Main 60FPS Game Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
      lastTime = currentTime;

      const canvas = canvasRef.current;
      if (!canvas) {
        animId = requestAnimationFrame(loop);
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const car = carState.current;

      // Handle Inputs if Playing
      if (isPlaying && !isGameOver) {
        setLapTime((prev) => prev + dt);

        const isUp = keys.current['arrowup'] || keys.current['w'];
        const isDown = keys.current['arrowdown'] || keys.current['s'];
        const isLeft = keys.current['arrowleft'] || keys.current['a'];
        const isRight = keys.current['arrowright'] || keys.current['d'];
        const isNitro = keys.current[' '] && nitroFuel > 0;

        // Vehicle acceleration characteristics
        const maxScaleSpeed = (vehicle.specs.topSpeed / 100) * 11;
        const accelRate = (10 / vehicle.specs.acceleration) * 2.2;
        const turnSpeed = (vehicle.specs.handling / 100) * 3.2;

        if (isNitro && nitroFuel > 0) {
          car.isNitroActive = true;
          setNitroFuel((prev) => Math.max(0, prev - dt * 25));
        } else {
          car.isNitroActive = false;
          // Slowly regenerate nitro
          setNitroFuel((prev) => Math.min(100, prev + dt * 4));
        }

        const nitroMultiplier = car.isNitroActive ? 1.6 : 1.0;

        // Acceleration
        if (isUp) {
          car.speed += accelRate * nitroMultiplier * dt;
          if (car.speed > maxScaleSpeed * nitroMultiplier) {
            car.speed = maxScaleSpeed * nitroMultiplier;
          }
        } else if (isDown) {
          // Brake / Reverse
          if (car.speed > 0) {
            car.speed -= accelRate * 2.5 * dt;
            if (car.speed < 0) car.speed = 0;
            soundEngine.tireScreech();
          } else {
            car.speed -= accelRate * 0.8 * dt;
            if (car.speed < -maxScaleSpeed * 0.3) car.speed = -maxScaleSpeed * 0.3;
          }
        } else {
          // Natural rolling friction
          const friction = 0.985;
          car.speed *= friction;
          if (Math.abs(car.speed) < 0.05) car.speed = 0;
        }

        // Steering
        if (Math.abs(car.speed) > 0.1) {
          const dir = car.speed > 0 ? 1 : -1;
          if (isLeft) car.angle -= turnSpeed * dir * dt;
          if (isRight) car.angle += turnSpeed * dir * dt;

          // Skid marks when hard turning at speed
          if ((isLeft || isRight) && Math.abs(car.speed) > 4) {
            const cos = Math.cos(car.angle);
            const sin = Math.sin(car.angle);
            skidMarks.current.push({
              x1: car.x - cos * 15 - sin * 10,
              y1: car.y - sin * 15 + cos * 10,
              x2: car.x - cos * 15 + sin * 10,
              y2: car.y - sin * 15 - cos * 10,
              alpha: 0.6
            });
            if (skidMarks.current.length > 150) skidMarks.current.shift();
          }
        }

        // Update Position
        const oldX = car.x;
        const oldY = car.y;
        car.x += Math.cos(car.angle) * car.speed * 60 * dt;
        car.y += Math.sin(car.angle) * car.speed * 60 * dt;

        // Boundary walls clamp
        const pad = 35;
        if (car.x < pad || car.x > canvas.width - pad || car.y < pad || car.y > canvas.height - pad) {
          car.x = Math.max(pad, Math.min(canvas.width - pad, car.x));
          car.y = Math.max(pad, Math.min(canvas.height - pad, car.y));
          car.speed *= -0.3; // bounce off cushion wall
          soundEngine.crashThud();
        }

        // Check Stunt Loop Trigger (if on Hot Stunt Loop track)
        if (activeTrack === 'hot-stunt-loop') {
          const loopZone = { x: 580, y: 320, r: 60 };
          const distToLoop = Math.hypot(car.x - loopZone.x, car.y - loopZone.y);
          if (distToLoop < loopZone.r && !car.isInLoop && car.speed > 4) {
            car.isInLoop = true;
            setScore((s) => s + 500);
            setStuntMessage('360° GRAVITY LOOP CLEARED! +500 PTS');
            soundEngine.turboBoost();
            setTimeout(() => {
              car.isInLoop = false;
              setStuntMessage('');
            }, 1200);
          }
        }

        // Check Jump Ramp Trigger
        const rampZone = { x: 300, y: 220, w: 70, h: 50 };
        if (
          car.x > rampZone.x &&
          car.x < rampZone.x + rampZone.w &&
          car.y > rampZone.y &&
          car.y < rampZone.y + rampZone.h &&
          !car.isJumping &&
          car.speed > 3
        ) {
          car.isJumping = true;
          setScore((s) => s + 350);
          setStuntMessage('AIRBORNE CANYON JUMP! +350 PTS');
          soundEngine.revEngine(1.5);
          setTimeout(() => {
            car.isJumping = false;
            setStuntMessage('');
          }, 800);
        }

        // Check Star Collectibles
        stars.current.forEach((star) => {
          if (!star.collected && Math.hypot(car.x - star.x, car.y - star.y) < 35) {
            star.collected = true;
            setScore((s) => s + 100);
            soundEngine.unboxCelebration();
            // Emit sparkle particles
            for (let i = 0; i < 8; i++) {
              particles.current.push({
                x: star.x,
                y: star.y,
                vx: (Math.random() - 0.5) * 80,
                vy: (Math.random() - 0.5) * 80,
                life: 1,
                maxLife: 1,
                color: '#facc15',
                size: 4
              });
            }
          }
        });

        // Emit Exhaust / Nitro / Tire Particles
        if (car.speed > 1) {
          const rearX = car.x - Math.cos(car.angle) * 22;
          const rearY = car.y - Math.sin(car.angle) * 22;
          particles.current.push({
            x: rearX,
            y: rearY,
            vx: -Math.cos(car.angle) * 20 + (Math.random() - 0.5) * 10,
            vy: -Math.sin(car.angle) * 20 + (Math.random() - 0.5) * 10,
            life: 0.6,
            maxLife: 0.6,
            color: car.isNitroActive ? '#38bdf8' : '#71717a',
            size: car.isNitroActive ? 5 : 3
          });
        }

        // Update live stats
        const currentMph = Math.round((Math.abs(car.speed) / maxScaleSpeed) * vehicle.specs.topSpeed);
        setSpeedMph(currentMph);
        if (currentMph > topSpeedRecord) {
          setTopSpeedRecord(currentMph);
        }
      }

      // Update Particles
      particles.current = particles.current
        .map((p) => ({
          ...p,
          x: p.x + p.vx * dt,
          y: p.y + p.vy * dt,
          life: p.life - dt
        }))
        .filter((p) => p.life > 0);

      // Fading Skidmarks
      skidMarks.current = skidMarks.current
        .map((sm) => ({ ...sm, alpha: sm.alpha - dt * 0.05 }))
        .filter((sm) => sm.alpha > 0.05);

      // --- RENDERING CANVAS ---
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Arena Background
      if (activeTrack === 'hot-stunt-loop') {
        // Wooden floor / dark room tabletop
        ctx.fillStyle = '#18181b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Grid lines (like bedroom tile floor)
        ctx.strokeStyle = '#27272a';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 50) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 50) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }

        // Orange Hot Track Ribbon Path
        ctx.strokeStyle = '#ea580c';
        ctx.lineWidth = 60;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.arc(400, 300, 220, 0, Math.PI * 2);
        ctx.stroke();

        // Track Blue Side Guardrails
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(400, 300, 250, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(400, 300, 190, 0, Math.PI * 2);
        ctx.stroke();

        // 360 Loop Visual Target
        ctx.save();
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(580, 320, 48, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('360° LOOP', 580, 324);
        ctx.restore();

        // Jump Ramp
        ctx.fillStyle = '#eab308';
        ctx.fillRect(300, 220, 70, 50);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('▲ JUMP ▲', 335, 250);
      } else if (activeTrack === 'monster-mud-arena') {
        // Dirt / Mud Arena
        ctx.fillStyle = '#291e13';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Mud puddles
        ctx.fillStyle = '#1c130a';
        ctx.beginPath();
        ctx.ellipse(300, 250, 90, 60, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(550, 380, 80, 50, -Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();

        // Dirt mounds
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(400, 300, 160, 0, Math.PI * 2);
        ctx.stroke();

        // Crushable mini cars
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(450, 200, 24, 14);
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(480, 200, 24, 14);
      } else {
        // Asphalt Speedway Oval
        ctx.fillStyle = '#09090b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Asphalt Track Ribbon
        ctx.fillStyle = '#18181b';
        ctx.beginPath();
        ctx.roundRect(100, 80, 600, 440, 180);
        ctx.fill();

        // Infield Grass
        ctx.fillStyle = '#052e16';
        ctx.beginPath();
        ctx.roundRect(220, 180, 360, 240, 90);
        ctx.fill();

        // Finish Line Checkered Strip
        ctx.save();
        for (let i = 0; i < 10; i++) {
          ctx.fillStyle = i % 2 === 0 ? '#ffffff' : '#000000';
          ctx.fillRect(380 + (i % 2) * 8, 420 + i * 8, 8, 8);
        }
        ctx.restore();
      }

      // Draw Skidmarks
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#09090b';
      skidMarks.current.forEach((sm) => {
        ctx.save();
        ctx.globalAlpha = sm.alpha;
        ctx.beginPath();
        ctx.moveTo(sm.x1, sm.y1);
        ctx.lineTo(sm.x2, sm.y2);
        ctx.stroke();
        ctx.restore();
      });

      // Draw Star Collectibles
      stars.current.forEach((star) => {
        if (!star.collected) {
          ctx.save();
          ctx.fillStyle = '#facc15';
          ctx.shadowColor = '#facc15';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(star.x, star.y, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      // Draw Particles
      particles.current.forEach((p) => {
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / p.maxLife;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw Car (Top-Down Vector Sprite)
      ctx.save();
      ctx.translate(car.x, car.y);
      ctx.rotate(car.angle + Math.PI / 2); // align forward orientation

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.beginPath();
      ctx.ellipse(0, 4, 18, 28, 0, 0, Math.PI * 2);
      ctx.fill();

      // Car Body
      ctx.fillStyle = vehicle.customization.primaryColor;
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-14, -26, 28, 52, 6);
      ctx.fill();
      ctx.stroke();

      // Canopy Glass
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-10, -10, 20, 18);

      // Headlight Beams
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(-11, -26, 6, 4);
      ctx.fillRect(5, -26, 6, 4);

      // Tail Lights / Nitro Exhaust
      if (car.isNitroActive) {
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(-6, 26);
        ctx.lineTo(0, 36);
        ctx.lineTo(6, 26);
        ctx.fill();
      } else {
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-11, 24, 6, 3);
        ctx.fillRect(5, 24, 6, 3);
      }

      // Wheels
      ctx.fillStyle = '#18181b';
      ctx.fillRect(-18, -20, 4, 12);
      ctx.fillRect(14, -20, 4, 12);
      ctx.fillRect(-18, 10, 4, 12);
      ctx.fillRect(14, 10, 4, 12);

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isGameOver, activeTrack, nitroFuel, vehicle]);

  // Touch virtual buttons
  const setKeyTouch = (key: string, pressed: boolean) => {
    keys.current[key] = pressed;
    if (pressed) {
      if (key === ' ') {
        soundEngine.turboBoost();
      } else if (key === 'arrowup') {
        soundEngine.revEngine(1.1);
      }
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Title & Track Selector Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
            Real Physics Toy Speedway
          </span>
          <h1 className="text-3xl font-extrabold text-white font-display mt-0.5">
            Test Track Simulator
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Drive <span className="text-white font-semibold">{vehicle.name}</span> ({vehicle.scale}). Arrow Keys / WASD to steer, Spacebar for Nitro Boost, H to honk!
          </p>
        </div>

        {/* Vehicle Switch & Track Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              soundEngine.clickSwitch();
              onSwitchVehicle();
            }}
            className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
          >
            Switch Car ({vehicle.name.split(' ')[0]})
          </button>

          {/* Track Environment Selector */}
          <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-xl">
            {(Object.keys(trackConfigs) as TrackEnvironment[]).map((tKey) => (
              <button
                key={tKey}
                onClick={() => {
                  soundEngine.clickSwitch();
                  setActiveTrack(tKey);
                  resetRun();
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeTrack === tKey
                    ? 'bg-neutral-800 text-white font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tKey === 'hot-stunt-loop' ? 'Hot Loops' : tKey === 'monster-mud-arena' ? 'Mud Arena' : 'Drag Strip'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Game Stage */}
      <div className="relative rounded-2xl border border-neutral-800 bg-neutral-950 overflow-hidden shadow-2xl">
        {/* Top HUD Overlay (Unobtrusive HUD per constitution) */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          {/* Speedometer & Gear */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl px-4 py-2.5 backdrop-blur-md flex items-center gap-4">
            <div>
              <span className="text-[10px] text-neutral-500 uppercase block font-medium">Scale Velocity</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white tabular-nums font-mono">
                  {speedMph}
                </span>
                <span className="text-xs text-neutral-400">mph</span>
              </div>
            </div>
            <div className="h-8 w-px bg-neutral-800" />
            <div>
              <span className="text-[10px] text-neutral-500 uppercase block font-medium">Max Record</span>
              <span className="text-sm font-bold text-amber-400 tabular-nums font-mono">
                {topSpeedRecord} mph
              </span>
            </div>
          </div>

          {/* Stunt & Score Center Banner */}
          {stuntMessage && (
            <div className="bg-amber-500/90 text-neutral-950 px-4 py-1.5 rounded-lg font-black text-xs uppercase tracking-wider animate-bounce shadow-lg">
              {stuntMessage}
            </div>
          )}

          {/* Score & Nitro HUD */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl px-4 py-2.5 backdrop-blur-md flex items-center gap-4">
            <div>
              <span className="text-[10px] text-neutral-500 uppercase block font-medium">Stunt Points</span>
              <span className="text-lg font-black text-white tabular-nums font-mono">{score}</span>
            </div>
            <div className="h-8 w-px bg-neutral-800" />
            <div className="w-24">
              <div className="flex justify-between text-[10px] text-neutral-400 mb-1">
                <span>NITRO</span>
                <span>{Math.round(nitroFuel)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-100"
                  style={{ width: `${nitroFuel}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Start Game Title Screen Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-neutral-950/85 backdrop-blur-sm p-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-white font-display mb-2">
              {trackConfigs[activeTrack].name}
            </h2>
            <p className="text-sm text-neutral-300 max-w-md mb-6">
              {trackConfigs[activeTrack].description}. Use keyboard arrows or WASD to control throttle and counter-steer drifts!
            </p>

            <button
              onClick={() => {
                soundEngine.revEngine(1.2);
                setIsPlaying(true);
              }}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-sm transition-transform hover:scale-105 shadow-xl shadow-amber-500/20"
            >
              <Play className="w-5 h-5 fill-current" />
              Press Gas to Start Race
            </button>

            <div className="flex items-center gap-4 mt-8 text-xs text-neutral-400">
              <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded">W / ↑ Gas</span>
              <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded">S / ↓ Brake / Reverse</span>
              <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded">A / D Steer</span>
              <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded">Space Nitro</span>
              <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded">H Horn</span>
            </div>
          </div>
        )}

        {/* 2D Canvas Viewport */}
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full h-[450px] sm:h-[550px] object-cover cursor-crosshair"
        />

        {/* Bottom Game Controls & On-Screen Touch Buttons */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                resetRun();
                soundEngine.revEngine(1.0);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Position
            </button>
            <button
              onClick={() => soundEngine.honkHorn()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              Honk (H)
            </button>
          </div>

          {/* On-screen tactile touch controls for mobile / tablet */}
          <div className="flex items-center gap-2 select-none">
            <button
              onMouseDown={() => setKeyTouch('arrowleft', true)}
              onMouseUp={() => setKeyTouch('arrowleft', false)}
              onTouchStart={() => setKeyTouch('arrowleft', true)}
              onTouchEnd={() => setKeyTouch('arrowleft', false)}
              className="w-10 h-10 rounded-lg bg-neutral-800 active:bg-neutral-700 text-white font-bold text-sm flex items-center justify-center border border-neutral-700"
            >
              ◀
            </button>
            <button
              onMouseDown={() => setKeyTouch('arrowright', true)}
              onMouseUp={() => setKeyTouch('arrowright', false)}
              onTouchStart={() => setKeyTouch('arrowright', true)}
              onTouchEnd={() => setKeyTouch('arrowright', false)}
              className="w-10 h-10 rounded-lg bg-neutral-800 active:bg-neutral-700 text-white font-bold text-sm flex items-center justify-center border border-neutral-700"
            >
              ▶
            </button>
            <button
              onMouseDown={() => setKeyTouch('arrowdown', true)}
              onMouseUp={() => setKeyTouch('arrowdown', false)}
              onTouchStart={() => setKeyTouch('arrowdown', true)}
              onTouchEnd={() => setKeyTouch('arrowdown', false)}
              className="px-3 h-10 rounded-lg bg-neutral-800 active:bg-neutral-700 text-red-400 font-bold text-xs flex items-center justify-center border border-neutral-700"
            >
              Brake
            </button>
            <button
              onMouseDown={() => setKeyTouch('arrowup', true)}
              onMouseUp={() => setKeyTouch('arrowup', false)}
              onTouchStart={() => setKeyTouch('arrowup', true)}
              onTouchEnd={() => setKeyTouch('arrowup', false)}
              className="px-4 h-10 rounded-lg bg-amber-400 active:bg-amber-300 text-neutral-950 font-bold text-xs flex items-center justify-center"
            >
              GAS ▲
            </button>
            <button
              onMouseDown={() => setKeyTouch(' ', true)}
              onMouseUp={() => setKeyTouch(' ', false)}
              onTouchStart={() => setKeyTouch(' ', true)}
              onTouchEnd={() => setKeyTouch(' ', false)}
              className="px-3 h-10 rounded-lg bg-cyan-500 active:bg-cyan-400 text-neutral-950 font-bold text-xs flex items-center justify-center"
            >
              NITRO ⚡
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
