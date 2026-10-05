import React, { useState } from 'react';
import { Search, SlidersHorizontal, Play, Sliders, ShoppingBag, Volume2, ArrowRight } from 'lucide-react';
import { ToyVehicle, VehicleCategory } from '../types/vehicle';
import { ACCESSORY_ITEMS } from '../data/toyVehicles';
import { ToyVehicleRenderer } from './ToyVehicleRenderer';
import { soundEngine } from '../utils/soundEngine';

interface ShowroomViewProps {
  vehicles: ToyVehicle[];
  onSelectVehicle: (v: ToyVehicle) => void;
  onCustomizeVehicle: (v: ToyVehicle) => void;
  onSpeedwayVehicle: (v: ToyVehicle) => void;
  onAddToCart: (v: ToyVehicle) => void;
  onAddAccessoryToCart: (acc: typeof ACCESSORY_ITEMS[0]) => void;
}

export const ShowroomView: React.FC<ShowroomViewProps> = ({
  vehicles,
  onSelectVehicle,
  onCustomizeVehicle,
  onSpeedwayVehicle,
  onAddToCart,
  onAddAccessoryToCart
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'speed' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [revvingId, setRevvingId] = useState<string | null>(null);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Vehicles' },
    { id: 'supercar', label: 'Supercars & GTs' },
    { id: 'monster-truck', label: 'Monster Trucks' },
    { id: 'rc-speedster', label: 'RC Speedsters' },
    { id: 'classic', label: 'Classic Rods' },
    { id: 'work-machine', label: 'Haulers & Work' },
    { id: 'aero-craft', label: 'Aero Stunt Craft' },
  ];

  // Filtering
  const filteredVehicles = vehicles
    .filter((v) => {
      const matchesCategory = selectedCategory === 'all' || v.category === selectedCategory;
      const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.material.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'speed') return b.specs.topSpeed - a.specs.topSpeed;
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured
    });

  const handleRev = (e: React.MouseEvent, v: ToyVehicle) => {
    e.stopPropagation();
    setRevvingId(v.id);
    soundEngine.revEngine(v.category === 'monster-truck' ? 0.75 : 1.15);
    setTimeout(() => setRevvingId(null), 700);
  };

  const featuredCar = vehicles[0];

  return (
    <div className="space-y-12 pb-16">
      {/* 1 Bold Campaign Hero Section */}
      <section className="relative rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-6 p-8 sm:p-12 space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
                Die-Cast & RC Excellence
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display text-balance leading-tight">
                Built for High-G Loops and Pure Adrenaline.
              </h1>
            </div>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Precision die-cast zinc supercars, high-lift monster trucks, and 2.4GHz RC speedsters.
              Test drive on our physics speedway, tune custom paint and liveries in the workshop, or stage your dream garage.
            </p>

            {/* Hero Quick CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  soundEngine.clickSwitch();
                  onSpeedwayVehicle(featuredCar);
                }}
                className="flex items-center gap-2 px-5 py-3 text-sm font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow-lg shadow-amber-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <Play className="w-4 h-4 fill-current" />
                Launch Test Speedway
              </button>
              <button
                onClick={() => {
                  soundEngine.clickSwitch();
                  onCustomizeVehicle(featuredCar);
                }}
                className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl transition-colors"
              >
                <Sliders className="w-4 h-4 text-amber-400" />
                Enter Tuning Workshop
              </button>
            </div>

            {/* Zero-Pill Metadata row */}
            <div className="flex items-center gap-3 text-xs text-neutral-400 pt-2 border-t border-neutral-800/80">
              <span>Weighted Zinc Alloy</span>
              <span aria-hidden="true">·</span>
              <span>215 mph Scale Velocity</span>
              <span aria-hidden="true">·</span>
              <span>100% Track Compatible</span>
            </div>
          </div>

          {/* Hero Right Visual Showcase */}
          <div className="lg:col-span-6 p-8 flex flex-col items-center justify-center bg-gradient-to-tr from-neutral-950 via-neutral-900 to-neutral-800/40 min-h-[320px]">
            <div className="relative w-full max-w-md flex flex-col items-center">
              <ToyVehicleRenderer
                vehicle={featuredCar}
                size="xl"
                isSpinningWheels={revvingId === featuredCar.id}
              />
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={(e) => handleRev(e, featuredCar)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition-colors"
                >
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  Rev Engine
                </button>
                <button
                  onClick={() => onSelectVehicle(featuredCar)}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4"
                >
                  Inspect Specifications →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar Controls */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Segmented Category Buttons (allowed interactive filter tabs) */}
          <div className="flex items-center gap-1 p-1 bg-neutral-900/90 border border-neutral-800 rounded-xl overflow-x-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  soundEngine.clickSwitch();
                  setSelectedCategory(cat.id);
                }}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-neutral-800 text-white shadow-sm font-semibold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Search cars, series, materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort vehicles by"
                className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-300 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="speed">Sort: Top Speed</option>
                <option value="rating">Sort: Highest Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
          <span>Showing {filteredVehicles.length} of {vehicles.length} models</span>
          <span>Official Die-Cast & RC Catalog</span>
        </div>
      </section>

      {/* Featured Collection Grid (3-column desktop) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => {
          const isRevving = revvingId === vehicle.id;

          return (
            <div
              key={vehicle.id}
              onClick={() => onSelectVehicle(vehicle)}
              className="group relative flex flex-col rounded-2xl border border-neutral-800/80 bg-neutral-900/50 hover:bg-neutral-900 hover:border-neutral-700 transition-all duration-200 cursor-pointer overflow-hidden shadow-sm"
            >
              {/* Product Visual Frame (65-75% height focus) */}
              <div className="relative h-56 w-full bg-gradient-to-b from-neutral-950/80 to-neutral-900/40 p-6 flex flex-col items-center justify-center border-b border-neutral-800/60 overflow-hidden">
                <ToyVehicleRenderer
                  vehicle={vehicle}
                  size="md"
                  isSpinningWheels={isRevving}
                  className="group-hover:scale-105 transition-transform duration-300"
                />

                {/* Quick Audio Rev Button */}
                <button
                  onClick={(e) => handleRev(e, vehicle)}
                  className="absolute bottom-3 right-3 p-2 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-amber-400 transition-colors backdrop-blur-sm"
                  title="Rev Engine"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Card Metadata & Actions */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  {/* Clean unboxed metadata with separators (NO BADGE SANDWICH) */}
                  <div className="flex items-center gap-2 text-xs text-neutral-400 uppercase tracking-wider font-semibold">
                    <span>{vehicle.scale}</span>
                    <span aria-hidden="true">·</span>
                    <span>{vehicle.category.replace('-', ' ')}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-amber-400">{vehicle.rarity}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors font-display">
                    {vehicle.name}
                  </h3>
                  <p className="text-xs text-neutral-400 line-clamp-2">
                    {vehicle.tagline}
                  </p>
                </div>

                {/* Performance Mini Bar (Scale Specs) */}
                <div className="grid grid-cols-3 gap-2 py-2 border-y border-neutral-800/70 text-center">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block">Scale Speed</span>
                    <span className="text-xs font-bold text-white tabular-nums">{vehicle.specs.topSpeed} mph</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block">0-60 Time</span>
                    <span className="text-xs font-bold text-white tabular-nums">{vehicle.specs.acceleration}s</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block">Stunt Score</span>
                    <span className="text-xs font-bold text-amber-400 tabular-nums">{vehicle.specs.stuntRating}/100</span>
                  </div>
                </div>

                {/* Price Baseline and Direct Handlers */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-lg font-bold text-white tabular-nums font-mono">
                      ${vehicle.price.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-neutral-500 block">Die-Cast Certified</span>
                  </div>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        soundEngine.clickSwitch();
                        onSpeedwayVehicle(vehicle);
                      }}
                      className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                      title="Test Drive on Speedway"
                    >
                      <Play className="w-4 h-4 text-emerald-400" />
                    </button>
                    <button
                      onClick={() => {
                        soundEngine.clickSwitch();
                        onCustomizeVehicle(vehicle);
                      }}
                      className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                      title="Customize in Workshop"
                    >
                      <Sliders className="w-4 h-4 text-amber-400" />
                    </button>
                    <button
                      onClick={() => {
                        soundEngine.clickSwitch();
                        onAddToCart(vehicle);
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-xs font-bold text-neutral-950 transition-colors shadow-sm"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Track & Tuning Accessories Rail */}
      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              Official Track Hardware & Spares
            </span>
            <h2 className="text-2xl font-bold text-white font-display mt-0.5">
              Speedway Expansion Packs & Custom Wheels
            </h2>
          </div>
          <span className="text-xs text-neutral-400">High-Durability Track Connectors</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ACCESSORY_ITEMS.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/70 flex flex-col justify-between space-y-3 hover:border-neutral-700 transition-colors"
            >
              <div className="space-y-1">
                <span className="text-[11px] text-amber-400 font-semibold block">{item.category}</span>
                <h4 className="text-sm font-bold text-white">{item.name}</h4>
                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">{item.description}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80">
                <span className="text-sm font-bold text-white font-mono tabular-nums">${item.price.toFixed(2)}</span>
                <button
                  onClick={() => {
                    soundEngine.clickSwitch();
                    onAddAccessoryToCart(item);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-amber-400 hover:text-neutral-950 text-xs font-semibold text-neutral-200 transition-colors"
                >
                  Add Pack
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
