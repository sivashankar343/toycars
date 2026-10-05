export type VehicleCategory = 
  | 'supercar' 
  | 'monster-truck' 
  | 'rc-speedster' 
  | 'work-machine' 
  | 'classic' 
  | 'aero-craft';

export type VehicleScale = '1:64' | '1:24' | '1:18' | '1:10';

export type RarityTier = 'Common' | 'Rare' | 'Epic Chrome' | 'Mythic Gold';

export type PaintFinish = 'gloss' | 'matte' | 'metallic' | 'chrome' | 'neon';

export type LiveryStyle = 'clean' | 'racing-stripes' | 'flames' | 'cyber-hex' | 'checkered' | 'lightning' | 'drift-splatter';

export type WheelStyle = 'mag' | 'spoke' | 'offroad' | 'aero' | 'deep-dish';

export type TireStyle = 'standard' | 'redline' | 'white-lettering' | 'gold-band';

export type SponsorLogo = 'none' | 'apex-shield' | 'drift-star' | 'turbo-claw' | 'hazard-cross';

export type WindowTint = 'crystal-blue' | 'dark-smoke' | 'amber-gold' | 'neon-green';

export type SpoilerStyle = 'none' | 'ducktail' | 'gt-wing' | 'wheelie-bar';

export type UnderglowColor = 'none' | '#06b6d4' | '#f59e0b' | '#ef4444' | '#10b981' | '#a855f7';

export type EngineTune = 'stock' | 'supercharger' | 'brushless-rc' | 'rocket-nitro';

export interface VehicleCustomization {
  primaryColor: string;
  secondaryColor: string;
  finish: PaintFinish;
  livery: LiveryStyle;
  decalColor?: string;
  racingNumber?: string;
  sponsorLogo?: SponsorLogo;
  wheels: WheelStyle;
  rimColor: string;
  tireStyle?: TireStyle;
  windowTint?: WindowTint;
  spoiler: SpoilerStyle;
  underglow: UnderglowColor;
  engineTune: EngineTune;
}

export interface VehicleSpecs {
  topSpeed: number; // in mph scale (e.g. 180)
  acceleration: number; // 0-60 in seconds (e.g. 2.4)
  handling: number; // 1-100
  toughness: number; // 1-100
  weightGrams: number; // e.g. 45g (die-cast) or 650g (RC)
  stuntRating: number; // 1-100
}

export interface ToyVehicle {
  id: string;
  name: string;
  tagline: string;
  category: VehicleCategory;
  scale: VehicleScale;
  rarity: RarityTier;
  price: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  material: string;
  features: string[];
  description: string;
  specs: VehicleSpecs;
  customization: VehicleCustomization;
  isCustom?: boolean;
}

export interface CartItem {
  vehicle: ToyVehicle;
  quantity: number;
  selectedColor?: string;
}

export interface TrackPiece {
  id: string;
  type: 'straight' | 'curve-left' | 'curve-right' | 'loop' | 'jump-ramp' | 'booster' | 'hazard' | 'finish';
  name: string;
  length: number;
  icon: string;
  speedModifier?: number;
}
