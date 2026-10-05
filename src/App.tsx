import React, { useState, useEffect } from 'react';
import { INITIAL_TOY_VEHICLES, ACCESSORY_ITEMS } from './data/toyVehicles';
import { ToyVehicle, CartItem } from './types/vehicle';
import { Header, ActiveTab } from './components/Header';
import { ShowroomView } from './components/ShowroomView';
import { CustomizerView } from './components/CustomizerView';
import { SpeedwayGameView } from './components/SpeedwayGameView';
import { TrackBuilderView } from './components/TrackBuilderView';
import { GarageAndBattleView } from './components/GarageAndBattleView';
import { VehicleDetailModal } from './components/VehicleDetailModal';
import { CartCheckoutModal } from './components/CartCheckoutModal';
import { Footer } from './components/Footer';
import { soundEngine } from './utils/soundEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('showroom');
  const [vehicles, setVehicles] = useState<ToyVehicle[]>(INITIAL_TOY_VEHICLES);
  const [garageVehicles, setGarageVehicles] = useState<ToyVehicle[]>([
    INITIAL_TOY_VEHICLES[0],
    INITIAL_TOY_VEHICLES[1]
  ]);
  const [selectedVehicle, setSelectedVehicle] = useState<ToyVehicle>(INITIAL_TOY_VEHICLES[0]);
  const [inspectingVehicle, setInspectingVehicle] = useState<ToyVehicle | null>(null);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([
    { vehicle: INITIAL_TOY_VEHICLES[0], quantity: 1 }
  ]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Load custom vehicles and garage from localStorage if available
  useEffect(() => {
    try {
      const savedGarage = localStorage.getItem('apex_toy_garage');
      if (savedGarage) {
        const parsed = JSON.parse(savedGarage);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setGarageVehicles(parsed);
        }
      }
    } catch {
      // LocalStorage access failsafe
    }
  }, []);

  // Save garage vehicles to localStorage on update
  const saveGarage = (updated: ToyVehicle[]) => {
    setGarageVehicles(updated);
    try {
      localStorage.setItem('apex_toy_garage', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Add / Save Custom Vehicle
  const handleSaveCustomVehicle = (customVehicle: ToyVehicle) => {
    // Add to all vehicles & garage
    setVehicles((prev) => [customVehicle, ...prev]);
    saveGarage([customVehicle, ...garageVehicles]);
    setSelectedVehicle(customVehicle);
  };

  const handleAddNewToGarage = (car: ToyVehicle) => {
    if (!garageVehicles.some((v) => v.id === car.id)) {
      saveGarage([car, ...garageVehicles]);
    }
  };

  // Cart Handlers
  const handleAddToCart = (car: ToyVehicle) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.vehicle.id === car.id);
      if (existing) {
        return prev.map((item) =>
          item.vehicle.id === car.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { vehicle: car, quantity: 1 }];
    });
    soundEngine.unboxCelebration();
  };

  const handleAddAccessoryToCart = (acc: typeof ACCESSORY_ITEMS[0]) => {
    const accAsToy: ToyVehicle = {
      id: acc.id,
      name: acc.name,
      tagline: acc.tagline,
      category: 'work-machine',
      scale: '1:64',
      rarity: 'Rare',
      price: acc.price,
      rating: acc.rating,
      reviewsCount: 42,
      inStock: true,
      material: 'Impact ABS Track Polymer',
      features: ['Interlocking track joints', 'High flex resistance'],
      description: acc.description,
      specs: { topSpeed: 100, acceleration: 3, handling: 80, toughness: 95, weightGrams: 90, stuntRating: 85 },
      customization: {
        primaryColor: '#f97316',
        secondaryColor: '#1e293b',
        finish: 'gloss',
        livery: 'clean',
        wheels: 'mag',
        spoiler: 'none',
        underglow: 'none',
        engineTune: 'stock',
        rimColor: '#e2e8f0'
      }
    };
    handleAddToCart(accAsToy);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.vehicle.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.vehicle.id !== id));
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    soundEngine.setMuted(newMuted);
  };

  // Navigations with vehicle selection
  const handleLaunchSpeedway = (car: ToyVehicle) => {
    setSelectedVehicle(car);
    setActiveTab('speedway');
    if (inspectingVehicle) setInspectingVehicle(null);
  };

  const handleLaunchCustomizer = (car: ToyVehicle) => {
    setSelectedVehicle(car);
    setActiveTab('customizer');
    if (inspectingVehicle) setInspectingVehicle(null);
  };

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500 selection:text-neutral-950">
      {/* Top Bar Header adhering to 3-zone contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartItemCount}
        openCart={() => setIsCartOpen(true)}
        isMuted={isMuted}
        toggleMute={toggleMute}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {activeTab === 'showroom' && (
          <ShowroomView
            vehicles={vehicles}
            onSelectVehicle={(v) => setInspectingVehicle(v)}
            onCustomizeVehicle={handleLaunchCustomizer}
            onSpeedwayVehicle={handleLaunchSpeedway}
            onAddToCart={handleAddToCart}
            onAddAccessoryToCart={handleAddAccessoryToCart}
          />
        )}

        {activeTab === 'customizer' && (
          <CustomizerView
            vehicles={vehicles}
            selectedVehicle={selectedVehicle}
            onSelectVehicle={(v) => setSelectedVehicle(v)}
            onSaveCustomVehicle={handleSaveCustomVehicle}
            onSpeedway={handleLaunchSpeedway}
          />
        )}

        {activeTab === 'speedway' && (
          <SpeedwayGameView
            vehicle={selectedVehicle}
            onSwitchVehicle={() => setActiveTab('showroom')}
          />
        )}

        {activeTab === 'builder' && (
          <TrackBuilderView
            vehicle={selectedVehicle}
            onSwitchVehicle={() => setActiveTab('showroom')}
          />
        )}

        {activeTab === 'garage' && (
          <GarageAndBattleView
            garageVehicles={garageVehicles}
            allVehicles={vehicles}
            onSelectForSpeedway={handleLaunchSpeedway}
            onSelectForCustomize={handleLaunchCustomizer}
            onAddNewVehicleToGarage={handleAddNewToGarage}
          />
        )}
      </main>

      {/* Vehicle Specification Inspect Modal */}
      <VehicleDetailModal
        vehicle={inspectingVehicle}
        onClose={() => setInspectingVehicle(null)}
        onSelectForCustomize={handleLaunchCustomizer}
        onSelectForSpeedway={handleLaunchSpeedway}
        onAddToCart={handleAddToCart}
        onAddToGarage={handleAddNewToGarage}
        isInGarage={inspectingVehicle ? garageVehicles.some((v) => v.id === inspectingVehicle.id) : false}
      />

      {/* Cart & Checkout Modal */}
      <CartCheckoutModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={() => setCart([])}
      />

      {/* Clean Footer */}
      <Footer onNavigate={(tab) => setActiveTab(tab)} />
    </div>
  );
}
