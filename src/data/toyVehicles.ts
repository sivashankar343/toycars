import { ToyVehicle } from '../types/vehicle';

export const INITIAL_TOY_VEHICLES: ToyVehicle[] = [
  {
    id: 'apex-hyper-gt',
    name: 'Apex GT-99 Phantom',
    tagline: 'Die-cast track dominator with active rear wing',
    category: 'supercar',
    scale: '1:64',
    rarity: 'Mythic Gold',
    price: 18.99,
    rating: 4.9,
    reviewsCount: 342,
    inStock: true,
    material: 'Die-Cast Zinc Alloy & Rubber Slick Tires',
    features: [
      'Aerodynamic split-wing spoiler with downforce channels',
      'High-speed low-friction brass wheel axles',
      'Full interior cockpit with miniature roll-cage',
      'Collector display plinth with engraved plaque'
    ],
    description: 'Engineered for high-velocity loops and steep banks. Features precision die-cast weight balance (38.2g) that hugs orange stunt tracks at scale speeds exceeding 210 mph.',
    specs: {
      topSpeed: 215,
      acceleration: 2.1,
      handling: 96,
      toughness: 82,
      weightGrams: 42,
      stuntRating: 95
    },
    customization: {
      primaryColor: '#ef4444',
      secondaryColor: '#171717',
      finish: 'metallic',
      livery: 'racing-stripes',
      wheels: 'mag',
      spoiler: 'gt-wing',
      underglow: '#ef4444',
      engineTune: 'rocket-nitro',
      rimColor: '#eab308'
    }
  },
  {
    id: 'titan-crusher-4x4',
    name: 'Titan Crusher Mega-LUG',
    tagline: 'Heavy-tread monster truck with dual coil springs',
    category: 'monster-truck',
    scale: '1:24',
    rarity: 'Epic Chrome',
    price: 24.50,
    rating: 4.8,
    reviewsCount: 215,
    inStock: true,
    material: 'Reinforced Polycarbonate Chassis & Deep Chevron Lugs',
    features: [
      'Independent four-wheel coilover suspension system',
      'Oversized 2.5-inch hollow knobby rubber tires',
      'Crush-proof steel axle tubes with 45° articulation',
      'Rolls over obstacles, books, and mini toy cars effortlessly'
    ],
    description: 'The heavyweight king of the bedroom carpet. Built with heavy-duty steel spring towers and oversized chevron tires designed to obliterate any obstacle in its path.',
    specs: {
      topSpeed: 135,
      acceleration: 3.4,
      handling: 74,
      toughness: 99,
      weightGrams: 310,
      stuntRating: 91
    },
    customization: {
      primaryColor: '#22c55e',
      secondaryColor: '#0f172a',
      finish: 'matte',
      livery: 'cyber-hex',
      wheels: 'offroad',
      spoiler: 'wheelie-bar',
      underglow: '#10b981',
      engineTune: 'supercharger',
      rimColor: '#22c55e'
    }
  },
  {
    id: 'vortex-rc-drift',
    name: 'Vortex RC-10 NeoDrift',
    tagline: 'High-frequency 2.4GHz remote control speedster',
    category: 'rc-speedster',
    scale: '1:10',
    rarity: 'Epic Chrome',
    price: 49.99,
    rating: 5.0,
    reviewsCount: 189,
    inStock: true,
    material: 'Carbon-Reinforced Nylon & Slick Hard Compound Rims',
    features: [
      'Proportional digital throttle with counter-steer gyro',
      'Working functional LED projector headlights and taillights',
      'Replaceable quick-swap 7.4V rechargeable LiPo pack',
      'Includes ergonomic pistol-grip 2.4GHz transmitter'
    ],
    description: 'Precision drifting machine equipped with counter-steering electronic stability gyro. Pull off butter-smooth 360 drifts around table legs and hardwood floors.',
    specs: {
      topSpeed: 195,
      acceleration: 1.9,
      handling: 98,
      toughness: 78,
      weightGrams: 580,
      stuntRating: 89
    },
    customization: {
      primaryColor: '#06b6d4',
      secondaryColor: '#0f172a',
      finish: 'gloss',
      livery: 'lightning',
      wheels: 'aero',
      spoiler: 'gt-wing',
      underglow: '#06b6d4',
      engineTune: 'brushless-rc',
      rimColor: '#06b6d4'
    }
  },
  {
    id: 'flame-bandit-69',
    name: 'Bandit 1969 Flame Rod',
    tagline: 'Vintage American muscle with chrome blower intake',
    category: 'classic',
    scale: '1:64',
    rarity: 'Rare',
    price: 14.99,
    rating: 4.7,
    reviewsCount: 142,
    inStock: true,
    material: 'Cast Zinc Body & Polished Chrome Engine Block',
    features: [
      'Triple-plated mirror chrome dual-carburetor intake blower',
      'Deep-dish rear drag mag wheels with Goodyear tire lettering',
      'Hand-applied gradient orange lacquer flame livery',
      'Weighted chassis for straight-line quarter-mile drags'
    ],
    description: 'A tribute to the golden era of drag racing. Features an authentic blown V8 engine scoop bursting through the hood and staggered rear cheater slicks.',
    specs: {
      topSpeed: 185,
      acceleration: 2.2,
      handling: 78,
      toughness: 86,
      weightGrams: 48,
      stuntRating: 84
    },
    customization: {
      primaryColor: '#f97316',
      secondaryColor: '#1c1917',
      finish: 'gloss',
      livery: 'flames',
      wheels: 'deep-dish',
      spoiler: 'ducktail',
      underglow: '#f59e0b',
      engineTune: 'supercharger',
      rimColor: '#f59e0b'
    }
  },
  {
    id: 'titan-hauler-rig',
    name: 'Titan Long-Haul Transporter',
    tagline: 'Multi-level carrier rig holding up to 8 die-cast cars',
    category: 'work-machine',
    scale: '1:64',
    rarity: 'Rare',
    price: 29.99,
    rating: 4.8,
    reviewsCount: 97,
    inStock: true,
    material: 'Heavy Die-Cast Cab & Articulated Drop Ramps',
    features: [
      'Two-tier drive-on carrier ramps with quick snap latches',
      'Dual rear quad axles with authentic 18-wheel rubber rollers',
      'Detachable 5th-wheel semi cab with twin chrome exhaust stacks',
      'Integrated fold-down gravity launch ramp for drag starts'
    ],
    description: 'Every die-cast car collection needs an escort. This heavy hauler transports your finest cars between tracks and features a fold-down rear gravity speed ramp.',
    specs: {
      topSpeed: 120,
      acceleration: 4.1,
      handling: 65,
      toughness: 98,
      weightGrams: 280,
      stuntRating: 70
    },
    customization: {
      primaryColor: '#3b82f6',
      secondaryColor: '#1e293b',
      finish: 'metallic',
      livery: 'racing-stripes',
      wheels: 'spoke',
      spoiler: 'none',
      underglow: 'none',
      engineTune: 'stock',
      rimColor: '#94a3b8'
    }
  },
  {
    id: 'solar-aero-speedcraft',
    name: 'Aero-Star HyperGlider',
    tagline: 'Futuristic magnetic-drive stunt concept vehicle',
    category: 'aero-craft',
    scale: '1:64',
    rarity: 'Mythic Gold',
    price: 21.00,
    rating: 4.9,
    reviewsCount: 164,
    inStock: true,
    material: 'Titanium-Tone Zinc & Translucent Cyan Canopy Glass',
    features: [
      'Inverted canard winglets for 360-loop inverted lock',
      'Concealed ball-bearing rollers for minimum track drag',
      'Glow-in-the-dark photon body accents for nighttime racing',
      'Sculpted ventral air tunnel reducing scale aerodynamic drag'
    ],
    description: 'Designed for the future of toy racing. Features inverted winglets that keep the vehicle locked onto high-speed loop-de-loops and vertical corkscrews without flying off.',
    specs: {
      topSpeed: 230,
      acceleration: 1.8,
      handling: 99,
      toughness: 80,
      weightGrams: 36,
      stuntRating: 98
    },
    customization: {
      primaryColor: '#8b5cf6',
      secondaryColor: '#09090b',
      finish: 'chrome',
      livery: 'cyber-hex',
      wheels: 'aero',
      spoiler: 'gt-wing',
      underglow: '#a855f7',
      engineTune: 'rocket-nitro',
      rimColor: '#c084fc'
    }
  }
];

export const ACCESSORY_ITEMS = [
  {
    id: 'track-pack-orange',
    name: 'Pro Stunt Track Expansion (12ft)',
    tagline: 'Classic high-flex track connectors + 2 table clamps',
    price: 15.99,
    category: 'Track Parts',
    icon: 'track',
    rating: 4.9,
    description: '12 feet of modular high-velocity track with reinforced interlocking tongues that do not separate during hard high-G cornering.'
  },
  {
    id: 'loop-booster-pack',
    name: 'Dual Motorized Speed Boosters',
    tagline: 'Battery powered flywheel kickers for infinite loops',
    price: 22.50,
    category: 'Power Units',
    icon: 'zap',
    rating: 4.8,
    description: 'Dual counter-rotating foam flywheels that rocket your toy cars into supersonic speeds as they pass through.'
  },
  {
    id: 'wheel-swap-kit',
    name: 'Tuning Garage Wheel Swap Kit',
    tagline: '16 Custom alloy rims, rubber slicks & axle tool',
    price: 12.99,
    category: 'Custom Parts',
    icon: 'disc',
    rating: 4.7,
    description: 'Includes 4 sets of precision metal wheels (Mag, Deep-Dish, Off-Road, Aero) with miniature axle pin tool.'
  },
  {
    id: 'jump-fire-ring',
    name: 'Ring of Fire Stunt Jump Ramp',
    tagline: 'Adjustable launch angle with breakaway flame ring',
    price: 16.50,
    category: 'Stunt Sets',
    icon: 'flame',
    rating: 4.9,
    description: 'Test your launch velocity! Features height-adjustable ramp and spring-loaded breakaway flaming hoop target.'
  }
];
