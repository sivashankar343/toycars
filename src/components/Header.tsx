import React from 'react';
import { Volume2, VolumeX, ShoppingBag } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export type ActiveTab = 'showroom' | 'customizer' | 'speedway' | 'builder' | 'garage';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  cartCount: number;
  openCart: () => void;
  isMuted: boolean;
  toggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  openCart,
  isMuted,
  toggleMute
}) => {
  const handleNavClick = (tab: ActiveTab) => {
    soundEngine.clickSwitch();
    setActiveTab(tab);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => handleNavClick('showroom')}
          className="text-xl sm:text-2xl font-extrabold tracking-tight text-white hover:text-amber-400 transition-colors shrink-0 font-display"
        >
          Apex Toys
        </button>

        {/* Zone 2: 5 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
          <button
            onClick={() => handleNavClick('showroom')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
              activeTab === 'showroom'
                ? 'border-amber-500 text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Showroom
          </button>
          <button
            onClick={() => handleNavClick('customizer')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
              activeTab === 'customizer'
                ? 'border-amber-500 text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Tuning Workshop
          </button>
          <button
            onClick={() => handleNavClick('speedway')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
              activeTab === 'speedway'
                ? 'border-amber-500 text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Test Speedway
          </button>
          <button
            onClick={() => handleNavClick('builder')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
              activeTab === 'builder'
                ? 'border-amber-500 text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Track Builder
          </button>
          <button
            onClick={() => handleNavClick('garage')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
              activeTab === 'garage'
                ? 'border-amber-500 text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Garage & Battle
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Sound Synthesizer Mute Toggle */}
          <button
            onClick={() => {
              toggleMute();
              soundEngine.clickSwitch();
            }}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
            aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-neutral-500" /> : <Volume2 className="w-5 h-5 text-amber-400" />}
          </button>

          {/* Cart Action Button */}
          <button
            onClick={() => {
              soundEngine.clickSwitch();
              openCart();
            }}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-neutral-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Toy Bag</span>
            <span className="px-1.5 py-0.5 rounded-full bg-neutral-950 text-amber-400 font-bold text-[11px] tabular-nums">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-neutral-800/80 bg-neutral-900/90 px-2 py-1 text-xs">
        <button
          onClick={() => handleNavClick('showroom')}
          className={`px-2 py-1.5 font-medium ${activeTab === 'showroom' ? 'text-amber-400 font-semibold' : 'text-neutral-400'}`}
        >
          Showroom
        </button>
        <button
          onClick={() => handleNavClick('customizer')}
          className={`px-2 py-1.5 font-medium ${activeTab === 'customizer' ? 'text-amber-400 font-semibold' : 'text-neutral-400'}`}
        >
          Workshop
        </button>
        <button
          onClick={() => handleNavClick('speedway')}
          className={`px-2 py-1.5 font-medium ${activeTab === 'speedway' ? 'text-amber-400 font-semibold' : 'text-neutral-400'}`}
        >
          Speedway
        </button>
        <button
          onClick={() => handleNavClick('builder')}
          className={`px-2 py-1.5 font-medium ${activeTab === 'builder' ? 'text-amber-400 font-semibold' : 'text-neutral-400'}`}
        >
          Builder
        </button>
        <button
          onClick={() => handleNavClick('garage')}
          className={`px-2 py-1.5 font-medium ${activeTab === 'garage' ? 'text-amber-400 font-semibold' : 'text-neutral-400'}`}
        >
          Garage
        </button>
      </div>
    </header>
  );
};
