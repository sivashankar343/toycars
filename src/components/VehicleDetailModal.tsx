import React, { useState } from 'react';
import { X, Play, Sliders, ShoppingBag, Volume2, ShieldCheck, Gauge, Zap, Sparkles } from 'lucide-react';
import { ToyVehicle } from '../types/vehicle';
import { ToyVehicleRenderer } from './ToyVehicleRenderer';
import { soundEngine } from '../utils/soundEngine';

interface VehicleDetailModalProps {
  vehicle: ToyVehicle | null;
  onClose: () => void;
  onSelectForCustomize: (vehicle: ToyVehicle) => void;
  onSelectForSpeedway: (vehicle: ToyVehicle) => void;
  onAddToCart: (vehicle: ToyVehicle) => void;
  onAddToGarage: (vehicle: ToyVehicle) => void;
  isInGarage: boolean;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  vehicle,
  onClose,
  onSelectForCustomize,
  onSelectForSpeedway,
  onAddToCart,
  onAddToGarage,
  isInGarage
}) => {
  const [viewMode, setViewMode] = useState<'side' | 'top'>('side');
  const [isRevving, setIsRevving] = useState(false);

  if (!vehicle) return null;

  const handleRevSound = () => {
    setIsRevving(true);
    soundEngine.revEngine(vehicle.category === 'monster-truck' ? 0.7 : 1.2);
    setTimeout(() => setIsRevving(false), 800);
  };

  const handleHonk = () => {
    soundEngine.honkHorn();
  };

  const handleTurbo = () => {
    soundEngine.turboBoost();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/60">
          <div>
            <h2 className="text-xl font-bold text-white font-display">{vehicle.name}</h2>
            {/* Zero-Pill text metadata per constitution */}
            <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
              <span>{vehicle.scale} Scale</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{vehicle.category.replace('-', ' ')}</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400 font-semibold">{vehicle.rarity}</span>
            </div>
          </div>
          <button
            onClick={() => {
              soundEngine.clickSwitch();
              onClose();
            }}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Main Showcase Stage */}
          <div className="relative rounded-xl border border-neutral-800 bg-gradient-to-b from-neutral-950 to-neutral-900/50 p-6 flex flex-col items-center justify-center min-h-[220px]">
            {/* View angle toggle */}
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-lg p-1 text-xs">
              <button
                onClick={() => setViewMode('side')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  viewMode === 'side' ? 'bg-amber-400 text-neutral-950' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Side Profile
              </button>
              <button
                onClick={() => setViewMode('top')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  viewMode === 'top' ? 'bg-amber-400 text-neutral-950' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Top-Down
              </button>
            </div>

            {/* Vehicle Vector Render */}
            <div className="my-2">
              <ToyVehicleRenderer
                vehicle={vehicle}
                viewMode={viewMode}
                size="xl"
                isSpinningWheels={isRevving}
              />
            </div>

            {/* Soundboard Buttons */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-neutral-800/80 w-full justify-center">
              <span className="text-xs text-neutral-500 font-medium mr-2">Audio FX:</span>
              <button
                onClick={handleRevSound}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                Rev Engine
              </button>
              <button
                onClick={handleHonk}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Honk Horn
              </button>
              <button
                onClick={handleTurbo}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Turbo Purge
              </button>
            </div>
          </div>

          {/* Description & Toy Craftsmanship */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">Toy Craftsmanship & Materials</h3>
            <p className="text-sm text-neutral-300 leading-relaxed">{vehicle.description}</p>
            <div className="mt-3 text-xs text-neutral-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Composition: {vehicle.material}</span>
            </div>
          </div>

          {/* Precision Scale Performance Specs */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Scale Performance Metrics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-xs text-neutral-500 block">Scale Top Speed</span>
                <span className="text-lg font-bold text-white tabular-nums">{vehicle.specs.topSpeed} mph</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-xs text-neutral-500 block">0-60 Scale Launch</span>
                <span className="text-lg font-bold text-white tabular-nums">{vehicle.specs.acceleration}s</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-xs text-neutral-500 block">Stunt / Loop Rating</span>
                <span className="text-lg font-bold text-amber-400 tabular-nums">{vehicle.specs.stuntRating}/100</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-xs text-neutral-500 block">Grip / Handling</span>
                <span className="text-lg font-bold text-white tabular-nums">{vehicle.specs.handling}/100</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-xs text-neutral-500 block">Chassis Toughness</span>
                <span className="text-lg font-bold text-white tabular-nums">{vehicle.specs.toughness}/100</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-xs text-neutral-500 block">Die-Cast Weight</span>
                <span className="text-lg font-bold text-white tabular-nums">{vehicle.specs.weightGrams}g</span>
              </div>
            </div>
          </div>

          {/* Key Toy Features */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">Toy Build Highlights</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-300">
              {vehicle.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0">✓</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white tabular-nums font-mono">${vehicle.price.toFixed(2)}</span>
            <span className="text-xs text-neutral-400">In Stock · Official Licensed</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEngine.clickSwitch();
                onSelectForSpeedway(vehicle);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition-colors"
            >
              <Play className="w-4 h-4 text-emerald-400" />
              Test Drive
            </button>
            <button
              onClick={() => {
                soundEngine.clickSwitch();
                onSelectForCustomize(vehicle);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition-colors"
            >
              <Sliders className="w-4 h-4 text-amber-400" />
              Customize
            </button>
            <button
              onClick={() => {
                soundEngine.clickSwitch();
                onAddToCart(vehicle);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-xs font-bold text-neutral-950 transition-colors shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Bag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
