import React, { useState } from 'react';
import { Sparkles, Save, Play, RotateCcw, Volume2, Check, Shield, Star, Flame, AlertTriangle, Disc, Layers } from 'lucide-react';
import { 
  ToyVehicle, 
  VehicleCustomization, 
  PaintFinish, 
  LiveryStyle, 
  WheelStyle, 
  TireStyle, 
  SponsorLogo, 
  WindowTint, 
  SpoilerStyle, 
  UnderglowColor, 
  EngineTune 
} from '../types/vehicle';
import { ToyVehicleRenderer } from './ToyVehicleRenderer';
import { soundEngine } from '../utils/soundEngine';

interface CustomizerViewProps {
  vehicles: ToyVehicle[];
  selectedVehicle: ToyVehicle;
  onSelectVehicle: (v: ToyVehicle) => void;
  onSaveCustomVehicle: (customVehicle: ToyVehicle) => void;
  onSpeedway: (v: ToyVehicle) => void;
}

export const CustomizerView: React.FC<CustomizerViewProps> = ({
  vehicles,
  selectedVehicle,
  onSelectVehicle,
  onSaveCustomVehicle,
  onSpeedway
}) => {
  const [customState, setCustomState] = useState<VehicleCustomization>({
    ...selectedVehicle.customization,
    decalColor: selectedVehicle.customization.decalColor || '#ffffff',
    racingNumber: selectedVehicle.customization.racingNumber || '01',
    sponsorLogo: selectedVehicle.customization.sponsorLogo || 'apex-shield',
    tireStyle: selectedVehicle.customization.tireStyle || 'white-lettering',
    windowTint: selectedVehicle.customization.windowTint || 'crystal-blue'
  });

  const [customName, setCustomName] = useState<string>(`${selectedVehicle.name} Custom Spec`);
  const [viewAngle, setViewAngle] = useState<'side' | 'top'>('side');
  const [studioBackdrop, setStudioBackdrop] = useState<'dark-plinth' | 'pit-garage' | 'neon-grid'>('dark-plinth');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [activeTabSection, setActiveTabSection] = useState<'color' | 'decals' | 'wheels' | 'aero' | 'engine'>('color');

  // Synchronize when base vehicle changes
  React.useEffect(() => {
    setCustomState({
      ...selectedVehicle.customization,
      decalColor: selectedVehicle.customization.decalColor || '#ffffff',
      racingNumber: selectedVehicle.customization.racingNumber || '01',
      sponsorLogo: selectedVehicle.customization.sponsorLogo || 'apex-shield',
      tireStyle: selectedVehicle.customization.tireStyle || 'white-lettering',
      windowTint: selectedVehicle.customization.windowTint || 'crystal-blue'
    });
    setCustomName(`${selectedVehicle.name} Custom Spec`);
  }, [selectedVehicle.id]);

  // Color Palettes
  const primaryColors = [
    { label: 'Crimson Flame', hex: '#ef4444' },
    { label: 'Cyber Cyan', hex: '#06b6d4' },
    { label: 'Acid Lime', hex: '#22c55e' },
    { label: 'Solar Amber', hex: '#f59e0b' },
    { label: 'Royal Violet', hex: '#8b5cf6' },
    { label: 'Blaze Orange', hex: '#f97316' },
    { label: 'Racing Green', hex: '#15803d' },
    { label: 'Electric Blue', hex: '#2563eb' },
    { label: 'Sunset Magenta', hex: '#d946ef' },
    { label: 'Gunmetal Slate', hex: '#475569' },
    { label: 'Stealth Onyx', hex: '#18181b' },
    { label: 'Alpine White', hex: '#f8fafc' },
  ];

  const secondaryColors = [
    { label: 'Onyx Black', hex: '#0f172a' },
    { label: 'Carbon Grey', hex: '#334155' },
    { label: 'Bright Silver', hex: '#e2e8f0' },
    { label: 'Solar Amber', hex: '#f59e0b' },
    { label: 'Racing Red', hex: '#ef4444' },
    { label: 'Ice Cyan', hex: '#06b6d4' },
  ];

  const decalColors = [
    { label: 'Pure White', hex: '#ffffff' },
    { label: 'Matte Black', hex: '#0a0a0a' },
    { label: 'Competition Gold', hex: '#facc15' },
    { label: 'Fire Orange', hex: '#f97316' },
    { label: 'Lime Green', hex: '#4ade80' },
    { label: 'Hyper Cyan', hex: '#38bdf8' },
    { label: 'Crimson Red', hex: '#ef4444' },
  ];

  const finishes: { id: PaintFinish; label: string; desc: string }[] = [
    { id: 'gloss', label: 'High Gloss', desc: 'Mirror showroom lacquer shine' },
    { id: 'metallic', label: 'Metallic Flake', desc: 'Sparkling aluminum mineral flakes' },
    { id: 'matte', label: 'Velvet Matte', desc: 'Zero-reflection satin finish' },
    { id: 'chrome', label: 'Mirror Chrome', desc: 'High-polish chrome liquid metal' },
    { id: 'neon', label: 'Fluorescent Neon', desc: 'Vibrant high-visibility pigment' },
  ];

  const liveries: { id: LiveryStyle; label: string; icon: string }[] = [
    { id: 'clean', label: 'Clean Monotone', icon: '—' },
    { id: 'racing-stripes', label: 'Twin GT Stripes', icon: '||' },
    { id: 'flames', label: 'Hot Rod Flames', icon: '🔥' },
    { id: 'cyber-hex', label: 'Cyber Hex Grid', icon: '⬡' },
    { id: 'checkered', label: 'Checkered Flag', icon: '🏁' },
    { id: 'lightning', label: 'Volt Lightning', icon: '⚡' },
    { id: 'drift-splatter', label: 'Drift Splatter', icon: '✦' },
  ];

  const racingNumbers = ['none', '01', '07', '13', '24', '77', '99'];

  const sponsorLogos: { id: SponsorLogo; label: string; icon: any }[] = [
    { id: 'none', label: 'No Logo', icon: null },
    { id: 'apex-shield', label: 'Apex Shield', icon: Shield },
    { id: 'drift-star', label: 'Drift Star', icon: Star },
    { id: 'turbo-claw', label: 'Turbo Claw', icon: Flame },
    { id: 'hazard-cross', label: 'Hazard Cross', icon: AlertTriangle },
  ];

  const wheelStyles: { id: WheelStyle; label: string; desc: string }[] = [
    { id: 'mag', label: '5-Star Mag Wheels', desc: 'Iconic classic die-cast star pattern' },
    { id: 'spoke', label: 'Vintage Wire Spokes', desc: 'Multispoke polished racing mesh' },
    { id: 'deep-dish', label: 'Deep-Dish Drag Lip', desc: 'Stepped chrome lip with wide stance' },
    { id: 'aero', label: 'Aero Disc Covers', desc: 'Flush high-speed aerodynamic discs' },
    { id: 'offroad', label: 'Heavy Beadlock Lugs', desc: 'Rugged perimeter studs & deep lugs' },
  ];

  const rimColors = [
    { label: 'Chrome Silver', hex: '#e2e8f0' },
    { label: 'Gold Bronze', hex: '#eab308' },
    { label: 'Gloss Black', hex: '#0f172a' },
    { label: 'Ice Cyan', hex: '#06b6d4' },
    { label: 'Fire Red', hex: '#ef4444' },
  ];

  const tireStyles: { id: TireStyle; label: string; desc: string }[] = [
    { id: 'standard', label: 'Blackwall Standard', desc: 'Clean low-profile slick rubber' },
    { id: 'redline', label: '1968 Redline Stripe', desc: 'Collector vintage red sidewall stripe' },
    { id: 'white-lettering', label: 'White Race Lettering', desc: '"APEX GT RADIAL" stenciled text' },
    { id: 'gold-band', label: 'Gold Track Ring', desc: 'Competition series gold perimeter' },
  ];

  const windowTints: { id: WindowTint; label: string; color: string }[] = [
    { id: 'crystal-blue', label: 'Crystal Polarized Blue', color: '#0284c7' },
    { id: 'dark-smoke', label: 'Limo Dark Smoke', color: '#334155' },
    { id: 'amber-gold', label: 'Amber Gold Track Tint', color: '#d97706' },
    { id: 'neon-green', label: 'Neon Emerald Tint', color: '#16a34a' },
  ];

  const spoilers: { id: SpoilerStyle; label: string }[] = [
    { id: 'none', label: 'No Wing (Streamline)' },
    { id: 'ducktail', label: 'Sport Ducktail' },
    { id: 'gt-wing', label: 'High-Downforce GT Wing' },
    { id: 'wheelie-bar', label: 'Drag Wheelie Bar' },
  ];

  const underglows: { id: UnderglowColor; label: string; color: string }[] = [
    { id: 'none', label: 'Disabled', color: '#525252' },
    { id: '#06b6d4', label: 'Ice Cyan', color: '#06b6d4' },
    { id: '#ef4444', label: 'Thermal Red', color: '#ef4444' },
    { id: '#10b981', label: 'Emerald Glow', color: '#10b981' },
    { id: '#f59e0b', label: 'Amber Sun', color: '#f59e0b' },
    { id: '#a855f7', label: 'Neon Violet', color: '#a855f7' },
  ];

  const engineTunes: { id: EngineTune; label: string; desc: string; pitch: number }[] = [
    { id: 'stock', label: 'Stock Die-Cast Axle', desc: 'Friction-balanced precision brass bearings', pitch: 1.0 },
    { id: 'supercharger', label: 'Blower Supercharged V8', desc: 'Heavy throaty rumble & blower whine', pitch: 0.8 },
    { id: 'brushless-rc', label: 'High-RPM Brushless RC', desc: '12,000 RPM high-frequency electric scream', pitch: 1.4 },
    { id: 'rocket-nitro', label: 'Rocket Nitro Turbine', desc: 'Supersonic thrust with afterburner purge', pitch: 1.6 },
  ];

  // Wheel Spin & Audio Test
  const handleSpinWheels = () => {
    setIsSpinning(true);
    soundEngine.tireScreech();
    setTimeout(() => {
      const tuneObj = engineTunes.find((t) => t.id === customState.engineTune);
      soundEngine.revEngine(tuneObj ? tuneObj.pitch : 1.1);
    }, 200);
    setTimeout(() => setIsSpinning(false), 1200);
  };

  const handleSaveBuild = () => {
    const customVehicle: ToyVehicle = {
      ...selectedVehicle,
      id: `custom-${Date.now()}`,
      name: customName || `${selectedVehicle.name} Custom`,
      isCustom: true,
      customization: { ...customState }
    };
    onSaveCustomVehicle(customVehicle);
    soundEngine.unboxCelebration();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    soundEngine.clickSwitch();
    setCustomState({
      ...selectedVehicle.customization,
      decalColor: '#ffffff',
      racingNumber: '01',
      sponsorLogo: 'apex-shield',
      tireStyle: 'white-lettering',
      windowTint: 'crystal-blue'
    });
    setCustomName(`${selectedVehicle.name} Custom Spec`);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Title & Chassis Selector Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
            Toy Vehicle Customization Studio
          </span>
          <h1 className="text-3xl font-extrabold text-white font-display mt-0.5">
            Tuning Workshop & Livery Lab
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Pick custom paint lacquer, decals, racing numbers, wheel rim designs, and aero bodywork.
          </p>
        </div>

        {/* Chassis Selector Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-400 font-medium">Base Toy Chassis:</span>
          <select
            value={selectedVehicle.id}
            onChange={(e) => {
              const v = vehicles.find((x) => x.id === e.target.value);
              if (v) {
                soundEngine.clickSwitch();
                onSelectVehicle(v);
              }
            }}
            className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.scale} Scale)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 360 Interactive Customizer Stage (7 cols) */}
        <div className="lg:col-span-7 sticky top-20 space-y-4">
          <div
            className={`relative rounded-2xl border border-neutral-800 p-8 flex flex-col items-center justify-center min-h-[400px] shadow-2xl overflow-hidden transition-all duration-300 ${
              studioBackdrop === 'dark-plinth'
                ? 'bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950'
                : studioBackdrop === 'pit-garage'
                ? 'bg-gradient-to-b from-neutral-900 via-neutral-950 to-stone-950'
                : 'bg-gradient-to-b from-slate-950 via-indigo-950/40 to-neutral-950'
            }`}
          >
            {/* Top Stage Controls: Angle & Backdrop */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              {/* Studio backdrop toggle */}
              <div className="hidden sm:flex items-center gap-1 bg-neutral-900/90 border border-neutral-800 rounded-xl p-1 text-xs">
                <button
                  onClick={() => setStudioBackdrop('dark-plinth')}
                  className={`px-2.5 py-1 rounded-md text-[11px] transition-colors ${
                    studioBackdrop === 'dark-plinth' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400'
                  }`}
                >
                  Plinth
                </button>
                <button
                  onClick={() => setStudioBackdrop('pit-garage')}
                  className={`px-2.5 py-1 rounded-md text-[11px] transition-colors ${
                    studioBackdrop === 'pit-garage' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400'
                  }`}
                >
                  Garage
                </button>
                <button
                  onClick={() => setStudioBackdrop('neon-grid')}
                  className={`px-2.5 py-1 rounded-md text-[11px] transition-colors ${
                    studioBackdrop === 'neon-grid' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400'
                  }`}
                >
                  Neon
                </button>
              </div>

              {/* View angle toggle */}
              <div className="flex items-center gap-1 bg-neutral-900/90 border border-neutral-800 rounded-xl p-1 text-xs backdrop-blur-sm">
                <button
                  onClick={() => {
                    soundEngine.clickSwitch();
                    setViewAngle('side');
                  }}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    viewAngle === 'side' ? 'bg-amber-400 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Side
                </button>
                <button
                  onClick={() => {
                    soundEngine.clickSwitch();
                    setViewAngle('top');
                  }}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    viewAngle === 'top' ? 'bg-amber-400 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Top
                </button>
              </div>
            </div>

            {/* Custom vehicle name input inside stage */}
            <div className="absolute top-4 left-4 z-10">
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                aria-label="Custom build specification name"
                className="bg-neutral-900/80 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-amber-400 max-w-[200px] sm:max-w-xs"
              />
            </div>

            {/* Dynamic Car Vector Render */}
            <div className="my-8 w-full flex items-center justify-center">
              <ToyVehicleRenderer
                vehicle={selectedVehicle}
                customizationOverride={customState}
                viewMode={viewAngle}
                size="xl"
                isSpinningWheels={isSpinning}
              />
            </div>

            {/* Interactive Stage Sound & Action Bar */}
            <div className="flex items-center justify-between w-full pt-4 border-t border-neutral-800/80">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSpinWheels}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition-colors"
                >
                  <Disc className="w-3.5 h-3.5 text-amber-400" />
                  Spin Wheels & Rev
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-xs text-neutral-400 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Defaults
                </button>
              </div>

              {/* Zero-Pill spec badge */}
              <div className="text-xs text-neutral-400 font-mono tabular-nums">
                Scale {selectedVehicle.scale} · {selectedVehicle.specs.weightGrams}g
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
            <button
              onClick={handleSaveBuild}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs transition-colors shadow-sm"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved to Garage Shelf!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Custom Build to Garage
                </>
              )}
            </button>

            <button
              onClick={() => {
                soundEngine.clickSwitch();
                const tempCustom: ToyVehicle = {
                  ...selectedVehicle,
                  name: customName,
                  customization: { ...customState }
                };
                onSpeedway(tempCustom);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-colors"
            >
              <Play className="w-4 h-4 text-emerald-400" />
              Drive on Test Speedway
            </button>
          </div>
        </div>

        {/* Right: Customization Controls Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Customizer Sub-Navigation Segmented Buttons */}
          <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-xl overflow-x-auto">
            <button
              onClick={() => {
                soundEngine.clickSwitch();
                setActiveTabSection('color');
              }}
              className={`flex-1 py-1.5 px-2.5 text-xs rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTabSection === 'color' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Colors & Paint
            </button>
            <button
              onClick={() => {
                soundEngine.clickSwitch();
                setActiveTabSection('decals');
              }}
              className={`flex-1 py-1.5 px-2.5 text-xs rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTabSection === 'decals' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Decals & Logos
            </button>
            <button
              onClick={() => {
                soundEngine.clickSwitch();
                setActiveTabSection('wheels');
              }}
              className={`flex-1 py-1.5 px-2.5 text-xs rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTabSection === 'wheels' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Wheel Designs
            </button>
            <button
              onClick={() => {
                soundEngine.clickSwitch();
                setActiveTabSection('aero');
              }}
              className={`flex-1 py-1.5 px-2.5 text-xs rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTabSection === 'aero' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Aero & Glow
            </button>
            <button
              onClick={() => {
                soundEngine.clickSwitch();
                setActiveTabSection('engine');
              }}
              className={`flex-1 py-1.5 px-2.5 text-xs rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTabSection === 'engine' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Motor & Sound
            </button>
          </div>

          {/* TAB 1: COLORS & PAINT */}
          {activeTabSection === 'color' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Primary Paint Swatches */}
              <div className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
                    Primary Body Paint
                  </span>
                  <span className="text-[11px] text-amber-400 font-mono">
                    {customState.primaryColor.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {primaryColors.map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => {
                        soundEngine.clickSwitch();
                        setCustomState((prev) => ({ ...prev, primaryColor: color.hex }));
                      }}
                      className={`h-10 rounded-xl border flex items-center justify-center transition-all ${
                        customState.primaryColor === color.hex
                          ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105 shadow-md'
                          : 'border-neutral-700 hover:border-neutral-500'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.label}
                    >
                      {customState.primaryColor === color.hex && (
                        <Check className={`w-4 h-4 ${color.hex === '#f8fafc' ? 'text-neutral-900' : 'text-white'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Secondary Accent Trim Color */}
              <div className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/50 space-y-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 block">
                  Secondary Accent (Roof, Skirts & Intakes)
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {secondaryColors.map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => {
                        soundEngine.clickSwitch();
                        setCustomState((prev) => ({ ...prev, secondaryColor: color.hex }));
                      }}
                      className={`h-9 rounded-xl border flex items-center justify-center transition-all ${
                        customState.secondaryColor === color.hex
                          ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105'
                          : 'border-neutral-700 hover:border-neutral-500'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.label}
                    >
                      {customState.secondaryColor === color.hex && (
                        <Check className={`w-3.5 h-3.5 ${color.hex === '#e2e8f0' ? 'text-neutral-900' : 'text-white'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Surface Finish Types */}
              <div className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/50 space-y-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 block">
                  Lacquer Finish Quality
                </span>
                <div className="space-y-2">
                  {finishes.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        soundEngine.clickSwitch();
                        setCustomState((prev) => ({ ...prev, finish: f.id }));
                      }}
                      className={`w-full p-3 rounded-xl text-xs border text-left flex items-center justify-between transition-colors ${
                        customState.finish === f.id
                          ? 'bg-neutral-800 border-amber-400 text-white font-semibold'
                          : 'border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800/40'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-white block">{f.label}</span>
                        <span className="text-[11px] text-neutral-400">{f.desc}</span>
                      </div>
                      {customState.finish === f.id && <Check className="w-4 h-4 text-amber-400" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DECALS, RACING NUMBERS & LOGOS */}
          {activeTabSection === 'decals' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Livery Graphics Styles */}
              <div className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/50 space-y-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 block">
                  Body Decals & Liveries
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {liveries.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => {
                        soundEngine.clickSwitch();
                        setCustomState((prev) => ({ ...prev, livery: l.id }));
                      }}
                      className={`p-3 rounded-xl text-xs border text-left flex items-center gap-2 transition-colors ${
                        customState.livery === l.id
                          ? 'bg-neutral-800 border-amber-400 text-white font-bold'
                          : 'border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800/40'
                      }`}
                    >
                      <span className="text-sm">{l.icon}</span>
                      <span className="truncate">{l.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Decal Color Palette */}
              <div className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/50 space-y-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 block">
                  Decal Pigment Color
                </span>
                <div className="grid grid-cols-7 gap-2">
                  {decalColors.map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => {
                        soundEngine.clickSwitch();
                        setCustomState((prev) => ({ ...prev, decalColor: color.hex }));
                      }}
                      className={`h-9 rounded-lg border flex items-center justify-center transition-all ${
                        customState.decalColor === color.hex
                          ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105'
                          : 'border-neutral-700'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.label}
                    >
                      {customState.decalColor === color.hex && (
                        <Check className={`w-3.5 h-3.5 ${color.hex === '#ffffff' ? 'text-neutral-900' : 'text-white'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Racing Number Badge */}
              <div className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/50 space-y-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 block">
                  Competition Racing Number
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {racingNumbers.map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        soundEngine.clickSwitch();
                        setCustomState((prev) => ({ ...prev, racingNumber: num === 'none' ? '' : num }));
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        (num === 'none' && !customState.racingNumber) || customState.racingNumber === num
                          ? 'bg-amber-400 text-neutral-950 border-amber-400'
                          : 'border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {num === 'none' ? 'None' : `#${num}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Team / Sponsor Logos */}
              <div className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/50 space-y-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 block">
                  Team & Manufacturer Logo
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {sponsorLogos.map((s) => {
                    const IconComp = s.icon;
                    return (
                      <button
                        key={s.id}
                        onClick={() => {
                          soundEngine.clickSwitch();
                          setCustomState((prev) => ({ ...prev, sponsorLogo: s.id }));
                        }}
                        className={`p-3 rounded-xl text-xs border text-left flex items-center gap-2.5 transition-colors ${
                          customState.sponsorLogo === s.id
                            ? 'bg-neutral-800 border-amber-400 text-white font-bold'
                            : 'border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800/40'
                        }`}
                      >
                        {IconComp && <IconComp className="w-4 h-4 text-amber-400 shrink-0" />}
                        <span>{s.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WHEEL DESIGNS & TIRES */}
          {activeTabSection === 'wheels' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Wheel Designs */}
              <div className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/50 space-y-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 block">
                  Wheel Rim Architecture
                </span>
                <div className="space-y-2">
                  {wheelStyles.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => {
                        soundEngine.clickSwitch();
                        setCustomState((prev) => ({ ...prev, wheels: w.id }));
                      }}
                      className={`w-full p-3 rounded-xl text-xs border text-left flex items-center justify-between transition-colors ${
                        customState.wheels === w.id
                          ? 'bg-neutral-800 border-amber-400 text-white font-bold'
                          : 'border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800/40'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-white block">{w.label}</span>
                        <span className="text-[11px] text-neutral-400">{w.desc}</span>
                      </div>
                      {customState.wheels === w.id && <Check className="w-4 h-4 text-amber-400" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rim Colors */}
              <div className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/50 space-y-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 block">
                  Wheel Rim Finish Tone
                </span>
                <div className="flex items-center gap-2">
                  {rimColors.map((r) => (
                    <button
                      key={r.hex}
                      onClick={() => {
                        soundEngine.clickSwitch();
                        setCustomState((prev) => ({ ...prev, rimColor: r.hex }));
                      }}
                      className={`w-10 h-10 rounded-full border transition-all ${
                        customState.rimColor === r.hex ? 'ring-2 ring-amber-400 scale-110 shadow-md' : 'border-neutral-700'
                      }`}
                      style={{ backgroundColor: r.hex }}
                      title={r.label}
                    />
                  ))}
                </div>
              </div>

              {/* Tire Styles & Sidewalls */}
              <div className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/50 space-y-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 block">
                  Tire Compound & Sidewall Markings
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {tireStyles.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        soundEngine.clickSwitch();
                        setCustomState((prev) => ({ ...prev, tireStyle: t.id }));
                      }}
                      className={`p-3 rounded-xl text-xs border text-left transition-colors ${
                        customState.tireStyle === t.id
                          ? 'bg-neutral-800 border-amber-400 text-white font-bold'
                          : 'border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800/40'
                      }`}
                    >
                      <span className="font-bold block text-white">{t.label}</span>
                      <span className="text-[10px] text-neutral-400 block mt-0.5">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AERO & GLOW */}
          {activeTabSection === 'aero' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Spoilers & Wings */}
              <div className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/50 space-y-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 block">
                  Downforce Wings & Spoilers
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {spoilers.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        soundEngine.clickSwitch();
                        setCustomState((prev) => ({ ...prev, spoiler: s.id }));
                      }}
                      className={`p-3 rounded-xl text-xs border text-left transition-colors ${
                        customState.spoiler === s.id
                          ? 'bg-neutral-800 border-amber-400 text-white font-bold'
                          : 'border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800/40'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Window Tints */}
              <div className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/50 space-y-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 block">
                  Canopy Glass Tinting
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {windowTints.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => {
                        soundEngine.clickSwitch();
                        setCustomState((prev) => ({ ...prev, windowTint: w.id }));
                      }}
                      className={`p-2.5 rounded-xl text-xs border text-left flex items-center gap-2.5 transition-colors ${
                        customState.windowTint === w.id
                          ? 'bg-neutral-800 border-amber-400 text-white font-bold'
                          : 'border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: w.color }} />
                      <span className="truncate">{w.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Underglow LED */}
              <div className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/50 space-y-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 block">
                  Chassis Underglow LED
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {underglows.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        soundEngine.clickSwitch();
                        setCustomState((prev) => ({ ...prev, underglow: u.id }));
                      }}
                      className={`p-2.5 rounded-xl text-xs border text-left flex items-center gap-2 transition-colors ${
                        customState.underglow === u.id
                          ? 'bg-neutral-800 border-amber-400 text-white font-bold'
                          : 'border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: u.color }} />
                      <span className="truncate">{u.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MOTOR & SOUND */}
          {activeTabSection === 'engine' && (
            <div className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/50 space-y-3 animate-in fade-in duration-150">
              <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 block">
                Scale Powerplant & Engine Acoustics
              </span>
              <div className="space-y-2">
                {engineTunes.map((eng) => (
                  <button
                    key={eng.id}
                    onClick={() => {
                      soundEngine.clickSwitch();
                      setCustomState((prev) => ({ ...prev, engineTune: eng.id }));
                      soundEngine.revEngine(eng.pitch);
                    }}
                    className={`w-full p-3 rounded-xl text-xs border text-left flex items-center justify-between transition-colors ${
                      customState.engineTune === eng.id
                        ? 'bg-neutral-800 border-amber-400 text-white font-bold'
                        : 'border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800/40'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-white block">{eng.label}</span>
                      <span className="text-[11px] text-neutral-400">{eng.desc}</span>
                    </div>
                    <Volume2 className="w-4 h-4 text-amber-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
