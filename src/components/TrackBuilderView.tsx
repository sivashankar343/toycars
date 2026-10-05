import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, Plus, Trash2, Zap, ArrowRight, Flag, Sparkles } from 'lucide-react';
import { ToyVehicle, TrackPiece } from '../types/vehicle';
import { soundEngine } from '../utils/soundEngine';

interface TrackBuilderViewProps {
  vehicle: ToyVehicle;
  onSwitchVehicle: () => void;
}

export const TrackBuilderView: React.FC<TrackBuilderViewProps> = ({
  vehicle,
  onSwitchVehicle
}) => {
  const availableTiles: TrackPiece[] = [
    { id: 'str-1', type: 'straight', name: 'Straight Runway (2ft)', length: 40, icon: '━', speedModifier: 1.0 },
    { id: 'bst-1', type: 'booster', name: 'Flywheel Booster (+40mph)', length: 30, icon: '⚡', speedModifier: 1.5 },
    { id: 'lop-1', type: 'loop', name: '360° Gravity Stunt Loop', length: 50, icon: '🔄', speedModifier: 0.9 },
    { id: 'jmp-1', type: 'jump-ramp', name: 'Airborne Launch Ramp', length: 35, icon: '▲', speedModifier: 1.2 },
    { id: 'crv-l', type: 'curve-left', name: 'Banked Curve Left', length: 35, icon: '◜', speedModifier: 0.85 },
    { id: 'crv-r', type: 'curve-right', name: 'Banked Curve Right', length: 35, icon: '◝', speedModifier: 0.85 },
    { id: 'fin-1', type: 'finish', name: 'Checkered Finish Gate', length: 25, icon: '🏁', speedModifier: 1.0 }
  ];

  const presets: { name: string; pieces: TrackPiece[] }[] = [
    {
      name: 'Mega Stunt Circuit',
      pieces: [
        { ...availableTiles[0], id: 'p1' },
        { ...availableTiles[1], id: 'p2' },
        { ...availableTiles[2], id: 'p3' },
        { ...availableTiles[0], id: 'p4' },
        { ...availableTiles[3], id: 'p5' },
        { ...availableTiles[6], id: 'p6' }
      ]
    },
    {
      name: 'Twin Loop Velocity',
      pieces: [
        { ...availableTiles[1], id: 'p1' },
        { ...availableTiles[2], id: 'p2' },
        { ...availableTiles[1], id: 'p3' },
        { ...availableTiles[2], id: 'p4' },
        { ...availableTiles[6], id: 'p5' }
      ]
    },
    {
      name: 'Canyon Daredevil Jump',
      pieces: [
        { ...availableTiles[0], id: 'p1' },
        { ...availableTiles[1], id: 'p2' },
        { ...availableTiles[3], id: 'p3' },
        { ...availableTiles[0], id: 'p4' },
        { ...availableTiles[6], id: 'p5' }
      ]
    }
  ];

  const [track, setTrack] = useState<TrackPiece[]>(presets[0].pieces);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [carProgress, setCarProgress] = useState<number>(0);
  const [simMessage, setSimMessage] = useState<string>('');

  const addPiece = (tile: TrackPiece) => {
    soundEngine.clickSwitch();
    setTrack((prev) => [...prev, { ...tile, id: `tile-${Date.now()}-${Math.random()}` }]);
  };

  const removePiece = (index: number) => {
    soundEngine.clickSwitch();
    setTrack((prev) => prev.filter((_, i) => i !== index));
  };

  const clearTrack = () => {
    soundEngine.clickSwitch();
    setTrack([]);
  };

  const loadPreset = (preset: typeof presets[0]) => {
    soundEngine.clickSwitch();
    setTrack(preset.pieces);
  };

  // Run Simulation
  const handleLaunch = () => {
    if (track.length === 0 || isSimulating) return;

    setIsSimulating(true);
    setCarProgress(0);
    setSimMessage('Car launched down gravity drop!');
    soundEngine.revEngine(1.2);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setCarProgress(progress);

      // Check current segment for audio & feedback
      const currentSegmentIndex = Math.min(
        Math.floor((progress / 100) * track.length),
        track.length - 1
      );
      const piece = track[currentSegmentIndex];

      if (piece) {
        if (piece.type === 'booster') {
          soundEngine.turboBoost();
          setSimMessage('Flywheel Boost Engaged! +40 mph');
        } else if (piece.type === 'loop') {
          setSimMessage('Defying gravity through the 360° Loop!');
        } else if (piece.type === 'jump-ramp') {
          soundEngine.revEngine(1.4);
          setSimMessage('Soaring through the air!');
        }
      }

      if (progress >= 100) {
        clearInterval(interval);
        setIsSimulating(false);
        soundEngine.unboxCelebration();
        setSimMessage('🏁 Finish Gate Passed! Clean Run!');
      }
    }, 45);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
            Modular Track Architect
          </span>
          <h1 className="text-3xl font-extrabold text-white font-display mt-0.5">
            Stunt Track Builder
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Snap together orange stunt tracks, motorized boosters, and 360 loops. Test run <span className="text-white font-semibold">{vehicle.name}</span> in real time!
          </p>
        </div>

        {/* Preset Layouts */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-neutral-400 font-medium">Presets:</span>
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => loadPreset(preset)}
              className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Track Visualization Runway */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 sm:p-8 space-y-6 shadow-2xl overflow-hidden">
        {/* Track Header & Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-white uppercase tracking-wider font-display">
              Track Course ({track.length} Segments)
            </span>
            {simMessage && (
              <span className="text-xs text-amber-400 font-semibold animate-pulse">
                {simMessage}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearTrack}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-xs text-neutral-400 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
            <button
              onClick={handleLaunch}
              disabled={isSimulating || track.length === 0}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-neutral-950 font-bold text-xs transition-colors shadow-sm"
            >
              <Play className="w-4 h-4 fill-current" />
              {isSimulating ? 'Testing Run...' : 'Launch Car on Track'}
            </button>
          </div>
        </div>

        {/* Modular Orange Track Canvas/Grid */}
        <div className="relative min-h-[160px] bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 flex items-center gap-3 overflow-x-auto">
          {/* Gravity Drop Launch Tower */}
          <div className="shrink-0 w-24 h-28 rounded-lg bg-neutral-900 border border-neutral-700 flex flex-col items-center justify-center p-2 text-center">
            <span className="text-xs font-bold text-amber-400">Launch Gate</span>
            <span className="text-[10px] text-neutral-400 mt-1">Gravity Tower</span>
            <span className="text-xs mt-2 font-mono">0 mph</span>
          </div>

          {track.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-neutral-500 text-xs">
              <span>Track runway is empty. Click any segment tile below to snap together your stunt course!</span>
            </div>
          ) : (
            track.map((piece, index) => {
              const segmentStart = (index / track.length) * 100;
              const segmentEnd = ((index + 1) / track.length) * 100;
              const isCarHere = isSimulating && carProgress >= segmentStart && carProgress <= segmentEnd;

              return (
                <div
                  key={piece.id}
                  className={`group relative shrink-0 w-32 h-28 rounded-xl border flex flex-col justify-between p-3 transition-all ${
                    isCarHere
                      ? 'border-amber-400 bg-amber-500/20 shadow-lg shadow-amber-500/20 scale-105'
                      : piece.type === 'booster'
                      ? 'border-cyan-500/50 bg-cyan-950/30'
                      : piece.type === 'loop'
                      ? 'border-orange-500/50 bg-orange-950/30'
                      : 'border-orange-600/40 bg-orange-950/20'
                  }`}
                >
                  {/* Remove Button on Hover */}
                  <button
                    onClick={() => removePiece(index)}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-neutral-800 hover:bg-red-500 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove piece"
                  >
                    ×
                  </button>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-400 font-mono">#{index + 1}</span>
                    <span className="text-lg">{piece.icon}</span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white block truncate">{piece.name}</span>
                    <span className="text-[10px] text-neutral-400 block">{piece.length}cm</span>
                  </div>

                  {/* Car presence indicator */}
                  {isCarHere && (
                    <div className="absolute inset-x-2 -bottom-2 py-0.5 bg-amber-400 text-neutral-950 text-[10px] font-black uppercase text-center rounded">
                      CAR PASSING
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Simulation Progress Line */}
        {isSimulating && (
          <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-400 h-full transition-all duration-75"
              style={{ width: `${carProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Available Track Segment Palette */}
      <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
          Snap-In Track Pieces Palette
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {availableTiles.map((tile) => (
            <button
              key={tile.id}
              onClick={() => addPiece(tile)}
              className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-950/80 hover:border-amber-400/80 hover:bg-neutral-900 transition-all text-left flex items-center justify-between group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{tile.icon}</span>
                  <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                    {tile.name}
                  </span>
                </div>
                <span className="text-[11px] text-neutral-400 block">{tile.length}cm track segment</span>
              </div>
              <Plus className="w-4 h-4 text-neutral-500 group-hover:text-amber-400 transition-colors shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
