import React from 'react';
import { ShieldCheck, Truck, RotateCcw } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'showroom' | 'customizer' | 'speedway' | 'builder' | 'garage') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full border-t border-neutral-800 bg-neutral-950 text-neutral-400 text-xs">
      {/* Value props strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 border-b border-neutral-900 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <h4 className="font-semibold text-white">Zinc Die-Cast Certified</h4>
            <p className="text-[11px] text-neutral-500">True weighted balance for high-G loop stability</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Truck className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <h4 className="font-semibold text-white">Collector Track Fast Shipping</h4>
            <p className="text-[11px] text-neutral-500">Dispatched in foam display boxes with certificates</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <RotateCcw className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <h4 className="font-semibold text-white">Tuning Guarantee</h4>
            <p className="text-[11px] text-neutral-500">100% modular parts and wheel swap compatibility</p>
          </div>
        </div>
      </div>

      {/* Main links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-base font-extrabold text-white font-display">Apex Toys Garage</span>
          <p className="text-[11px] text-neutral-500">
            Scale toy automotive workshop, customizer, and stunt speedway simulator.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs font-medium">
          <button onClick={() => onNavigate('showroom')} className="hover:text-white transition-colors">
            Showroom
          </button>
          <button onClick={() => onNavigate('customizer')} className="hover:text-white transition-colors">
            Workshop
          </button>
          <button onClick={() => onNavigate('speedway')} className="hover:text-white transition-colors">
            Speedway
          </button>
          <button onClick={() => onNavigate('builder')} className="hover:text-white transition-colors">
            Builder
          </button>
          <button onClick={() => onNavigate('garage')} className="hover:text-white transition-colors">
            Garage
          </button>
        </div>
      </div>

      {/* Copyright row */}
      <div className="border-t border-neutral-900 py-4 text-center text-[11px] text-neutral-600">
        © {new Date().getFullYear()} Apex Toys Garage. All rights reserved.
      </div>
    </footer>
  );
};
