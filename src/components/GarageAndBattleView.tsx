import React, { useState } from 'react';
import { Trophy, Swords, Sparkles, Volume2, Package, Play, Sliders, CheckCircle } from 'lucide-react';
import { ToyVehicle } from '../types/vehicle';
import { ToyVehicleRenderer } from './ToyVehicleRenderer';
import { soundEngine } from '../utils/soundEngine';

interface GarageAndBattleViewProps {
  garageVehicles: ToyVehicle[];
  allVehicles: ToyVehicle[];
  onSelectForSpeedway: (v: ToyVehicle) => void;
  onSelectForCustomize: (v: ToyVehicle) => void;
  onAddNewVehicleToGarage: (v: ToyVehicle) => void;
}

export const GarageAndBattleView: React.FC<GarageAndBattleViewProps> = ({
  garageVehicles,
  allVehicles,
  onSelectForSpeedway,
  onSelectForCustomize,
  onAddNewVehicleToGarage
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'shelf' | 'battle'>('shelf');

  // Battle Arena State
  const [playerCar, setPlayerCar] = useState<ToyVehicle>(garageVehicles[0] || allVehicles[0]);
  const [rivalCar, setRivalCar] = useState<ToyVehicle>(allVehicles[1] || allVehicles[0]);
  const [selectedStat, setSelectedStat] = useState<string | null>(null);
  const [roundResult, setRoundResult] = useState<string | null>(null);
  const [playerWins, setPlayerWins] = useState<number>(0);
  const [rivalWins, setRivalWins] = useState<number>(0);

  // Unboxing State
  const [isUnboxing, setIsUnboxing] = useState<boolean>(false);
  const [unboxedCar, setUnboxedCar] = useState<ToyVehicle | null>(null);

  const handleUnboxMystery = () => {
    setIsUnboxing(true);
    soundEngine.unboxCelebration();

    setTimeout(() => {
      // Pick random vehicle
      const randomIdx = Math.floor(Math.random() * allVehicles.length);
      const chosen = allVehicles[randomIdx];
      const newMystery: ToyVehicle = {
        ...chosen,
        id: `mystery-${Date.now()}`,
        name: `Special Edition ${chosen.name}`,
        rarity: 'Mythic Gold',
        isCustom: true,
        customization: {
          ...chosen.customization,
          finish: 'chrome',
          underglow: '#f59e0b'
        }
      };
      setUnboxedCar(newMystery);
      onAddNewVehicleToGarage(newMystery);
      setIsUnboxing(false);
    }, 1200);
  };

  const handleDuelStat = (statKey: 'topSpeed' | 'acceleration' | 'stuntRating' | 'toughness' | 'weightGrams') => {
    soundEngine.clickSwitch();
    setSelectedStat(statKey);

    let playerVal = playerCar.specs[statKey];
    let rivalVal = rivalCar.specs[statKey];

    // For acceleration, lower number is better (faster 0-60)
    let pWin = statKey === 'acceleration' ? playerVal < rivalVal : playerVal > rivalVal;
    let tie = playerVal === rivalVal;

    if (tie) {
      setRoundResult('Tie round! Equal scale engineering.');
    } else if (pWin) {
      setRoundResult(`${playerCar.name} Wins the duel!`);
      setPlayerWins((w) => w + 1);
      soundEngine.unboxCelebration();
    } else {
      setRoundResult(`${rivalCar.name} takes this round!`);
      setRivalWins((w) => w + 1);
      soundEngine.revEngine(0.9);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header & Sub-Tab Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
            Collector Showcase & Head-to-Head Duels
          </span>
          <h1 className="text-3xl font-extrabold text-white font-display mt-0.5">
            Collector Garage & Battle Arena
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Display your customized models on the collector shelf or challenge rivals to Top Trumps stat showdowns.
          </p>
        </div>

        {/* Sub-tab segmented buttons */}
        <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-xl">
          <button
            onClick={() => {
              soundEngine.clickSwitch();
              setActiveSubTab('shelf');
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeSubTab === 'shelf'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            My Garage Shelf ({garageVehicles.length})
          </button>
          <button
            onClick={() => {
              soundEngine.clickSwitch();
              setActiveSubTab('battle');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeSubTab === 'battle'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Swords className="w-3.5 h-3.5 text-amber-400" />
            Stat Battle Arena
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: GARAGE SHELF */}
      {activeSubTab === 'shelf' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Unbox Mystery Action Banner */}
          <div className="rounded-2xl border border-neutral-800 bg-gradient-to-r from-amber-500/10 via-neutral-900 to-neutral-900 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                <Package className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">Unbox Mystery Die-Cast Blind Box</h3>
                <p className="text-xs text-neutral-400">Crack open a surprise sealed box with rare custom metallic finish.</p>
              </div>
            </div>

            <button
              onClick={handleUnboxMystery}
              disabled={isUnboxing}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-neutral-950 font-bold text-xs transition-colors shrink-0 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              {isUnboxing ? 'Unboxing...' : 'Open Mystery Box'}
            </button>
          </div>

          {/* Unboxed Banner Confirmation */}
          {unboxedCar && (
            <div className="p-4 rounded-xl border border-amber-400/60 bg-amber-950/30 flex items-center justify-between gap-4 animate-in fade-in">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-xs text-neutral-200">
                  Congratulations! You unlocked <strong className="text-white font-bold">{unboxedCar.name}</strong> ({unboxedCar.scale} Scale, {unboxedCar.rarity}).
                </span>
              </div>
              <button
                onClick={() => setUnboxedCar(null)}
                className="text-xs text-neutral-400 hover:text-white"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Shelf Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
              <span>Display Stand · {garageVehicles.length} Models in Garage</span>
              <span>All Scale Models Authenticated</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {garageVehicles.map((car) => (
                <div
                  key={car.id}
                  className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 flex flex-col justify-between space-y-4 hover:border-neutral-700 transition-all shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white font-display">{car.name}</h4>
                      {/* Zero-Pill text metadata */}
                      <div className="text-[11px] text-neutral-400 mt-0.5">
                        <span>{car.scale}</span> · <span>{car.rarity}</span> · <span>{car.specs.weightGrams}g</span>
                      </div>
                    </div>
                    {car.isCustom && (
                      <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                        Custom Spec
                      </span>
                    )}
                  </div>

                  {/* Render Visual */}
                  <div className="h-40 w-full bg-neutral-950/70 border border-neutral-800/80 rounded-xl p-4 flex items-center justify-center">
                    <ToyVehicleRenderer vehicle={car} size="md" />
                  </div>

                  {/* Quick specs */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs py-1 border-t border-neutral-800/60">
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase block">Speed</span>
                      <span className="font-bold text-white tabular-nums">{car.specs.topSpeed} mph</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase block">0-60</span>
                      <span className="font-bold text-white tabular-nums">{car.specs.acceleration}s</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase block">Stunt</span>
                      <span className="font-bold text-amber-400 tabular-nums">{car.specs.stuntRating}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-neutral-800/60">
                    <button
                      onClick={() => {
                        soundEngine.clickSwitch();
                        onSelectForCustomize(car);
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition-colors"
                    >
                      <Sliders className="w-3.5 h-3.5 text-amber-400" />
                      Tune
                    </button>
                    <button
                      onClick={() => {
                        soundEngine.clickSwitch();
                        onSelectForSpeedway(car);
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-xs font-bold text-neutral-950 transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Drive
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: STAT BATTLE ARENA */}
      {activeSubTab === 'battle' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Arena Scoreboard */}
          <div className="flex items-center justify-around p-4 rounded-2xl border border-neutral-800 bg-neutral-900/60">
            <div className="text-center">
              <span className="text-xs text-neutral-400 block font-medium">Your Garage Score</span>
              <span className="text-3xl font-black text-amber-400 tabular-nums font-mono">{playerWins}</span>
            </div>
            <div className="flex items-center gap-2">
              <Swords className="w-6 h-6 text-neutral-500" />
              <span className="text-xs font-bold uppercase text-neutral-400">Head-to-Head</span>
            </div>
            <div className="text-center">
              <span className="text-xs text-neutral-400 block font-medium">Rival Score</span>
              <span className="text-3xl font-black text-neutral-300 tabular-nums font-mono">{rivalWins}</span>
            </div>
          </div>

          {/* Versus Visual Stage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Player Car Card */}
            <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-950 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Your Toy Vehicle</span>
                <select
                  value={playerCar.id}
                  onChange={(e) => {
                    const found = garageVehicles.find((x) => x.id === e.target.value);
                    if (found) {
                      soundEngine.clickSwitch();
                      setPlayerCar(found);
                    }
                  }}
                  className="bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1 text-xs text-white"
                >
                  {garageVehicles.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="h-44 flex items-center justify-center bg-neutral-900/40 rounded-xl p-4">
                <ToyVehicleRenderer vehicle={playerCar} size="md" />
              </div>

              <div className="text-center">
                <h3 className="text-lg font-bold text-white font-display">{playerCar.name}</h3>
                <span className="text-xs text-neutral-400">{playerCar.scale} · {playerCar.rarity}</span>
              </div>
            </div>

            {/* Rival AI Car Card */}
            <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-950 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Challenger Rival</span>
                <select
                  value={rivalCar.id}
                  onChange={(e) => {
                    const found = allVehicles.find((x) => x.id === e.target.value);
                    if (found) {
                      soundEngine.clickSwitch();
                      setRivalCar(found);
                    }
                  }}
                  className="bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1 text-xs text-white"
                >
                  {allVehicles.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="h-44 flex items-center justify-center bg-neutral-900/40 rounded-xl p-4">
                <ToyVehicleRenderer vehicle={rivalCar} size="md" />
              </div>

              <div className="text-center">
                <h3 className="text-lg font-bold text-white font-display">{rivalCar.name}</h3>
                <span className="text-xs text-neutral-400">{rivalCar.scale} · {rivalCar.rarity}</span>
              </div>
            </div>
          </div>

          {/* Stat Selectors to Duel */}
          <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                Select Stat to Duel Against Rival
              </h4>
              {roundResult && (
                <span className="text-xs font-bold text-amber-400 animate-in fade-in">
                  {roundResult}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <button
                onClick={() => handleDuelStat('topSpeed')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedStat === 'topSpeed' ? 'border-amber-400 bg-amber-500/10' : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                }`}
              >
                <span className="text-xs text-neutral-400 block">Top Scale Speed</span>
                <div className="flex items-baseline justify-between mt-2 font-mono">
                  <span className="text-base font-bold text-white">{playerCar.specs.topSpeed} mph</span>
                  <span className="text-xs text-neutral-500">vs {rivalCar.specs.topSpeed}</span>
                </div>
              </button>

              <button
                onClick={() => handleDuelStat('acceleration')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedStat === 'acceleration' ? 'border-amber-400 bg-amber-500/10' : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                }`}
              >
                <span className="text-xs text-neutral-400 block">0-60 Scale Launch</span>
                <div className="flex items-baseline justify-between mt-2 font-mono">
                  <span className="text-base font-bold text-white">{playerCar.specs.acceleration}s</span>
                  <span className="text-xs text-neutral-500">vs {rivalCar.specs.acceleration}s</span>
                </div>
              </button>

              <button
                onClick={() => handleDuelStat('stuntRating')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedStat === 'stuntRating' ? 'border-amber-400 bg-amber-500/10' : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                }`}
              >
                <span className="text-xs text-neutral-400 block">Stunt & Loop Rating</span>
                <div className="flex items-baseline justify-between mt-2 font-mono">
                  <span className="text-base font-bold text-white">{playerCar.specs.stuntRating}/100</span>
                  <span className="text-xs text-neutral-500">vs {rivalCar.specs.stuntRating}</span>
                </div>
              </button>

              <button
                onClick={() => handleDuelStat('toughness')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedStat === 'toughness' ? 'border-amber-400 bg-amber-500/10' : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                }`}
              >
                <span className="text-xs text-neutral-400 block">Chassis Toughness</span>
                <div className="flex items-baseline justify-between mt-2 font-mono">
                  <span className="text-base font-bold text-white">{playerCar.specs.toughness}/100</span>
                  <span className="text-xs text-neutral-500">vs {rivalCar.specs.toughness}</span>
                </div>
              </button>

              <button
                onClick={() => handleDuelStat('weightGrams')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedStat === 'weightGrams' ? 'border-amber-400 bg-amber-500/10' : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                }`}
              >
                <span className="text-xs text-neutral-400 block">Die-Cast Weight</span>
                <div className="flex items-baseline justify-between mt-2 font-mono">
                  <span className="text-base font-bold text-white">{playerCar.specs.weightGrams}g</span>
                  <span className="text-xs text-neutral-500">vs {rivalCar.specs.weightGrams}g</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
