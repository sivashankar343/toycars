import React from 'react';
import { ToyVehicle, VehicleCustomization, WheelStyle, TireStyle, SponsorLogo, WindowTint } from '../types/vehicle';

interface ToyVehicleRendererProps {
  vehicle: ToyVehicle;
  customizationOverride?: VehicleCustomization;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isSpinningWheels?: boolean;
  showUnderglow?: boolean;
  className?: string;
  viewMode?: 'side' | 'top';
}

export const ToyVehicleRenderer: React.FC<ToyVehicleRendererProps> = ({
  vehicle,
  customizationOverride,
  size = 'md',
  isSpinningWheels = false,
  showUnderglow = true,
  className = '',
  viewMode = 'side'
}) => {
  const cust = customizationOverride || vehicle.customization;
  const primary = cust.primaryColor || '#ef4444';
  const secondary = cust.secondaryColor || '#1e293b';
  const rim = cust.rimColor || '#e2e8f0';
  const decalColor = cust.decalColor || '#ffffff';
  const wheelStyle: WheelStyle = cust.wheels || 'mag';
  const tireStyle: TireStyle = cust.tireStyle || 'standard';
  const sponsorLogo: SponsorLogo = cust.sponsorLogo || 'none';
  const racingNumber = cust.racingNumber || '';
  const windowTint: WindowTint = cust.windowTint || 'crystal-blue';
  const category = vehicle.category;

  const sizeClasses = {
    sm: 'w-32 h-20',
    md: 'w-56 h-32',
    lg: 'w-72 h-44',
    xl: 'w-full max-w-lg h-64'
  };

  const finishId = `finish-${vehicle.id}-${cust.finish || 'gloss'}`;

  // Window tint colors
  const tintColors = {
    'crystal-blue': { start: '#38bdf8', mid: '#0284c7', end: '#0f172a' },
    'dark-smoke': { start: '#64748b', mid: '#334155', end: '#020617' },
    'amber-gold': { start: '#fde047', mid: '#d97706', end: '#451a03' },
    'neon-green': { start: '#4ade80', mid: '#16a34a', end: '#052e16' },
  }[windowTint];

  // Helper to render wheel rim according to selected style
  const renderWheelHub = (cx: number, cy: number, r: number, isFront: boolean) => {
    const rimRadius = r * 0.65;
    const innerRadius = rimRadius * 0.85;

    return (
      <g key={`wheel-${cx}-${cy}`}>
        {/* Outer Tire Rubber */}
        <circle cx={cx} cy={cy} r={r} fill="#18181b" stroke="#09090b" strokeWidth="2.5" />

        {/* Tire Sidewall Style */}
        {tireStyle === 'redline' && (
          <circle cx={cx} cy={cy} r={r * 0.82} fill="none" stroke="#ef4444" strokeWidth="1.8" />
        )}
        {tireStyle === 'gold-band' && (
          <circle cx={cx} cy={cy} r={r * 0.82} fill="none" stroke="#eab308" strokeWidth="1.8" />
        )}
        {tireStyle === 'white-lettering' && (
          <g>
            <circle cx={cx} cy={cy} r={r * 0.83} fill="none" stroke="#f8fafc" strokeWidth="1.5" strokeDasharray="6 8" />
          </g>
        )}

        {/* Rim Outer Lip */}
        <circle
          cx={cx}
          cy={cy}
          r={rimRadius}
          fill={wheelStyle === 'deep-dish' ? '#0f172a' : '#1e293b'}
          stroke={rim}
          strokeWidth={wheelStyle === 'deep-dish' ? '4.5' : '3'}
        />

        {/* Wheel Rims Spoke Styles */}
        <g
          className={isSpinningWheels ? 'animate-spin origin-center' : ''}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        >
          {wheelStyle === 'mag' && (
            /* 5-Star Classic Mag Wheels */
            <g stroke={rim} strokeWidth="3" strokeLinecap="round">
              {[0, 72, 144, 216, 288].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                return (
                  <line
                    key={i}
                    x1={cx}
                    y1={cy}
                    x2={cx + Math.cos(rad) * innerRadius}
                    y2={cy + Math.sin(rad) * innerRadius}
                  />
                );
              })}
            </g>
          )}

          {wheelStyle === 'spoke' && (
            /* Vintage Multispoke Wire Mesh */
            <g stroke={rim} strokeWidth="1.6">
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                return (
                  <line
                    key={i}
                    x1={cx}
                    y1={cy}
                    x2={cx + Math.cos(rad) * innerRadius}
                    y2={cy + Math.sin(rad) * innerRadius}
                  />
                );
              })}
            </g>
          )}

          {wheelStyle === 'aero' && (
            /* Aero Disc Flush Wheel */
            <g>
              <circle cx={cx} cy={cy} r={innerRadius} fill={rim} opacity="0.85" />
              <circle cx={cx} cy={cy} r={innerRadius * 0.4} fill="#0f172a" />
              <line x1={cx - innerRadius * 0.7} y1={cy} x2={cx + innerRadius * 0.7} y2={cy} stroke="#0f172a" strokeWidth="2" />
            </g>
          )}

          {wheelStyle === 'deep-dish' && (
            /* Deep Dish Stepped Lip */
            <g>
              <circle cx={cx} cy={cy} r={innerRadius} fill="#09090b" stroke={rim} strokeWidth="2" />
              <g stroke={rim} strokeWidth="2.5">
                <line x1={cx - 10} y1={cy - 10} x2={cx + 10} y2={cy + 10} />
                <line x1={cx - 10} y1={cy + 10} x2={cx + 10} y2={cy - 10} />
              </g>
            </g>
          )}

          {wheelStyle === 'offroad' && (
            /* Beadlock Rugged Outer Studs */
            <g>
              <circle cx={cx} cy={cy} r={innerRadius} fill="#1e293b" stroke={rim} strokeWidth="3" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                return (
                  <circle
                    key={i}
                    cx={cx + Math.cos(rad) * (rimRadius - 2.5)}
                    cy={cy + Math.sin(rad) * (rimRadius - 2.5)}
                    r="1.8"
                    fill="#f8fafc"
                  />
                );
              })}
              <circle cx={cx} cy={cy} r="4" fill={rim} />
            </g>
          )}

          {/* Center Lug Nut Cap */}
          <circle cx={cx} cy={cy} r="4.5" fill={rim} stroke="#09090b" strokeWidth="1" />
        </g>
      </g>
    );
  };

  // Helper to render Sponsor Logo Badge
  const renderSponsorBadge = (x: number, y: number) => {
    if (!sponsorLogo || sponsorLogo === 'none') return null;

    return (
      <g transform={`translate(${x}, ${y})`}>
        {sponsorLogo === 'apex-shield' && (
          <g>
            <polygon points="0,-8 7,-4 5,7 0,10 -5,7 -7,-4" fill="#0f172a" stroke="#facc15" strokeWidth="1.5" />
            <path d="M -3,-2 L 0,-6 L 3,-2 L 0,6 Z" fill="#facc15" />
          </g>
        )}
        {sponsorLogo === 'drift-star' && (
          <g>
            <polygon points="0,-8 2,-2 8,0 2,2 0,8 -2,2 -8,0 -2,-2" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
          </g>
        )}
        {sponsorLogo === 'turbo-claw' && (
          <g stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
            <line x1="-5" y1="-6" x2="-2" y2="6" />
            <line x1="-1" y1="-7" x2="2" y2="5" />
            <line x1="3" y1="-5" x2="6" y2="7" />
          </g>
        )}
        {sponsorLogo === 'hazard-cross' && (
          <g>
            <rect x="-6" y="-6" width="12" height="12" rx="2" fill="#eab308" />
            <line x1="-4" y1="-4" x2="4" y2="4" stroke="#0f172a" strokeWidth="2" />
            <line x1="4" y1="-4" x2="-4" y2="4" stroke="#0f172a" strokeWidth="2" />
          </g>
        )}
      </g>
    );
  };

  return (
    <div className={`relative flex items-center justify-center select-none ${sizeClasses[size]} ${className}`}>
      {/* Underglow Lighting */}
      {showUnderglow && cust.underglow && cust.underglow !== 'none' && (
        <div
          className="absolute -bottom-2 w-3/4 h-5 rounded-full filter blur-md opacity-85 pointer-events-none transition-all duration-300"
          style={{
            backgroundColor: cust.underglow,
            boxShadow: `0 0 28px 10px ${cust.underglow}`
          }}
        />
      )}

      {viewMode === 'side' ? (
        <svg
          viewBox="0 0 420 220"
          className="w-full h-full drop-shadow-2xl overflow-visible transition-all duration-300"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Custom finish gradient definitions */}
            <linearGradient id={finishId} x1="0%" y1="0%" x2="100%" y2="100%">
              {cust.finish === 'metallic' && (
                <>
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
                  <stop offset="35%" stopColor={primary} />
                  <stop offset="70%" stopColor={primary} />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.55" />
                </>
              )}
              {cust.finish === 'chrome' && (
                <>
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="30%" stopColor={primary} />
                  <stop offset="50%" stopColor="#ffffff" />
                  <stop offset="70%" stopColor={primary} />
                  <stop offset="100%" stopColor="#1e293b" />
                </>
              )}
              {cust.finish === 'matte' && (
                <>
                  <stop offset="0%" stopColor={primary} />
                  <stop offset="100%" stopColor={primary} />
                </>
              )}
              {cust.finish === 'neon' && (
                <>
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
                  <stop offset="40%" stopColor={primary} />
                  <stop offset="100%" stopColor={primary} />
                </>
              )}
              {(cust.finish === 'gloss' || !cust.finish) && (
                <>
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
                  <stop offset="45%" stopColor={primary} />
                  <stop offset="100%" stopColor="#09090b" stopOpacity="0.5" />
                </>
              )}
            </linearGradient>

            {/* Dynamic Glass Tint Gradient */}
            <linearGradient id={`glass-${vehicle.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={tintColors.start} stopOpacity="0.8" />
              <stop offset="50%" stopColor={tintColors.mid} stopOpacity="0.6" />
              <stop offset="100%" stopColor={tintColors.end} stopOpacity="0.9" />
            </linearGradient>

            {/* Underbody Shadow */}
            <radialGradient id="sideCarShadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Underbody Cast Shadow */}
          <ellipse cx="210" cy="195" rx="175" ry="14" fill="url(#sideCarShadow)" />

          {/* --- VEHICLE CHASSIS BODY --- */}
          {category === 'monster-truck' ? (
            <g id="monster-truck-body">
              {/* Lifted Steel Frame */}
              <path d="M 120 145 L 300 145 L 290 125 L 130 125 Z" fill="#334155" stroke="#0f172a" strokeWidth="3" />
              
              {/* Heavy Chrome Coilover Springs */}
              <g stroke="#94a3b8" strokeWidth="4">
                <line x1="120" y1="125" x2="105" y2="170" />
                <line x1="135" y1="125" x2="120" y2="170" stroke="#ef4444" strokeWidth="5" strokeDasharray="3 3" />
                <line x1="285" y1="125" x2="300" y2="170" stroke="#ef4444" strokeWidth="5" strokeDasharray="3 3" />
                <line x1="300" y1="125" x2="315" y2="170" />
              </g>

              {/* Main Monster Truck Cab */}
              <path
                d="M 70 120 L 110 80 L 175 75 L 245 75 L 310 100 L 340 120 L 335 135 L 75 135 Z"
                fill={`url(#${finishId})`}
                stroke="#0f172a"
                strokeWidth="3"
              />

              {/* Roof Light Bar */}
              <rect x="175" y="66" width="70" height="9" rx="3" fill="#1e293b" />
              <circle cx="185" cy="70" r="3.5" fill="#facc15" />
              <circle cx="200" cy="70" r="3.5" fill="#facc15" />
              <circle cx="215" cy="70" r="3.5" fill="#facc15" />
              <circle cx="230" cy="70" r="3.5" fill="#facc15" />

              {/* Windows with Custom Tint */}
              <path d="M 175 80 L 240 80 L 260 102 L 160 102 Z" fill={`url(#glass-${vehicle.id})`} stroke="#0f172a" strokeWidth="2" />

              {/* Liveries */}
              {cust.livery === 'cyber-hex' && (
                <path d="M 90 115 L 140 95 L 180 115 L 140 130 Z" fill="none" stroke={decalColor} strokeWidth="3" opacity="0.85" />
              )}
              {cust.livery === 'flames' && (
                <path d="M 80 125 Q 120 120 145 105 Q 170 122 205 110 Q 175 130 85 132 Z" fill={decalColor} opacity="0.9" />
              )}
              {cust.livery === 'racing-stripes' && (
                <g fill={decalColor} opacity="0.9">
                  <path d="M 70 120 L 110 80 L 115 80 L 75 120 Z" />
                  <path d="M 175 75 L 245 75 L 245 77 L 175 77 Z" />
                </g>
              )}
              {cust.livery === 'lightning' && (
                <path d="M 90 115 L 140 95 L 130 115 L 175 100 L 160 125" fill="none" stroke={decalColor} strokeWidth="3" />
              )}
              {cust.livery === 'drift-splatter' && (
                <g fill={decalColor} opacity="0.8">
                  <circle cx="120" cy="110" r="6" />
                  <circle cx="132" cy="106" r="3" />
                  <circle cx="115" cy="120" r="4" />
                  <circle cx="140" cy="115" r="5" />
                </g>
              )}

              {/* Racing Number Roundel */}
              {racingNumber && (
                <g>
                  <circle cx="145" cy="110" r="14" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
                  <text x="145" y="115" fill="#0f172a" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                    {racingNumber}
                  </text>
                </g>
              )}

              {/* Sponsor Logo Badge */}
              {renderSponsorBadge(285, 115)}

              {/* Front Bull Bar */}
              <path d="M 60 110 L 80 110 L 80 140 L 55 135 Z" fill="#475569" stroke="#0f172a" strokeWidth="2" />
              <circle cx="70" cy="116" r="5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />

              {/* Wheelie Bar */}
              {cust.spoiler === 'wheelie-bar' && (
                <g stroke="#334155" strokeWidth="3">
                  <line x1="330" y1="125" x2="370" y2="155" />
                  <circle cx="370" cy="155" r="7" fill="#0f172a" stroke="#ef4444" strokeWidth="2" />
                </g>
              )}
            </g>
          ) : category === 'classic' ? (
            <g id="classic-hotrod-body">
              {/* Slanted Rake Body */}
              <path
                d="M 60 150 L 125 150 L 130 118 L 195 108 L 275 108 L 320 140 L 345 145 L 345 160 L 60 160 Z"
                fill={`url(#${finishId})`}
                stroke="#0f172a"
                strokeWidth="3"
              />

              {/* Chrome Dual Blower Scoop */}
              <path d="M 125 105 L 155 88 L 165 118 L 125 120 Z" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
              <ellipse cx="140" cy="94" rx="8" ry="4" fill="#0f172a" />
              <ellipse cx="152" cy="94" rx="8" ry="4" fill="#0f172a" />

              {/* Chrome Side Zoomie Exhausts */}
              <path d="M 140 155 L 160 172 M 150 155 L 170 172 M 160 155 L 180 172 M 170 155 L 190 172" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />

              {/* Windows */}
              <path d="M 195 110 L 255 110 L 265 136 L 190 136 Z" fill={`url(#glass-${vehicle.id})`} stroke="#0f172a" strokeWidth="2" />

              {/* Decal Liveries */}
              {cust.livery === 'flames' && (
                <path
                  d="M 70 155 Q 110 148 135 130 Q 155 145 180 132 Q 220 148 190 157 Z"
                  fill={decalColor}
                  stroke="#facc15"
                  strokeWidth="1.5"
                />
              )}
              {cust.livery === 'racing-stripes' && (
                <g fill={decalColor} opacity="0.9">
                  <path d="M 60 150 L 125 150 L 125 153 L 60 153 Z" />
                  <path d="M 195 108 L 275 108 L 275 111 L 195 111 Z" />
                </g>
              )}
              {cust.livery === 'checkered' && (
                <g fill={decalColor} opacity="0.9">
                  <rect x="230" y="140" width="8" height="6" />
                  <rect x="246" y="140" width="8" height="6" />
                  <rect x="238" y="146" width="8" height="6" />
                </g>
              )}

              {/* Racing Number */}
              {racingNumber && (
                <g>
                  <circle cx="215" cy="144" r="12" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
                  <text x="215" y="148" fill="#0f172a" fontSize="10" fontWeight="bold" textAnchor="middle">
                    {racingNumber}
                  </text>
                </g>
              )}

              {/* Sponsor Logo */}
              {renderSponsorBadge(285, 140)}

              {/* Spoilers */}
              {cust.spoiler === 'ducktail' && (
                <path d="M 335 145 L 355 135 L 358 142 L 340 148 Z" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
              )}
            </g>
          ) : (
            /* SUPERCAR / RC / AERO / WORK HAULER */
            <g id="supercar-body">
              {/* Streamlined Body */}
              <path
                d="M 55 155 L 75 130 L 125 125 L 180 92 L 270 92 L 325 125 L 355 135 L 355 158 L 55 158 Z"
                fill={`url(#${finishId})`}
                stroke="#0f172a"
                strokeWidth="3"
              />

              {/* Glass Canopy with Window Tint */}
              <path
                d="M 175 95 L 265 95 L 290 122 L 150 122 Z"
                fill={`url(#glass-${vehicle.id})`}
                stroke="#0f172a"
                strokeWidth="2"
              />
              <line x1="180" y1="100" x2="250" y2="100" stroke="#ffffff" strokeWidth="2" opacity="0.6" strokeLinecap="round" />

              {/* Side Skirt / Lower Trim (uses secondary color) */}
              <path d="M 220 132 L 275 130 L 270 145 L 210 145 Z" fill={secondary} stroke="#0f172a" strokeWidth="1.5" />
              <rect x="75" y="152" width="260" height="5" fill="#0f172a" rx="2" />

              {/* DECALS & LIVERIES WITH CUSTOM DECAL COLOR */}
              {cust.livery === 'racing-stripes' && (
                <g fill={decalColor} opacity="0.95">
                  <path d="M 75 131 L 125 126 L 126 129 L 76 134 Z" />
                  <path d="M 180 93 L 270 93 L 270 96 L 180 96 Z" />
                  <path d="M 325 126 L 354 136 L 353 139 L 324 129 Z" />
                </g>
              )}
              {cust.livery === 'flames' && (
                <path
                  d="M 75 140 Q 115 132 145 115 Q 165 130 195 120 Q 235 135 200 145 Z"
                  fill={decalColor}
                  opacity="0.9"
                />
              )}
              {cust.livery === 'cyber-hex' && (
                <path d="M 100 140 L 130 125 L 160 140 L 130 152 Z M 165 140 L 195 125 L 225 140 L 195 152 Z" fill="none" stroke={decalColor} strokeWidth="2.5" opacity="0.85" />
              )}
              {cust.livery === 'checkered' && (
                <g opacity="0.9" fill={decalColor}>
                  <rect x="200" y="128" width="8" height="6" />
                  <rect x="216" y="128" width="8" height="6" />
                  <rect x="208" y="134" width="8" height="6" />
                  <rect x="224" y="134" width="8" height="6" />
                </g>
              )}
              {cust.livery === 'lightning' && (
                <path d="M 115 136 L 165 124 L 150 140 L 210 128 L 190 146 L 250 134" fill="none" stroke={decalColor} strokeWidth="3.5" strokeLinejoin="miter" />
              )}
              {cust.livery === 'drift-splatter' && (
                <g fill={decalColor} opacity="0.85">
                  <circle cx="150" cy="135" r="7" />
                  <circle cx="165" cy="130" r="4" />
                  <circle cx="140" cy="142" r="3" />
                  <circle cx="178" cy="138" r="5" />
                  <circle cx="190" cy="133" r="3" />
                </g>
              )}

              {/* Door Racing Number Badge */}
              {racingNumber && (
                <g>
                  <circle cx="185" cy="138" r="14" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
                  <text x="185" y="143" fill="#0f172a" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                    {racingNumber}
                  </text>
                </g>
              )}

              {/* Sponsor Logo */}
              {renderSponsorBadge(285, 138)}

              {/* Headlights & Taillights */}
              <path d="M 68 138 L 88 134 L 85 144 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
              <path d="M 345 136 L 355 138 L 354 146 L 344 144 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />

              {/* Spoilers */}
              {cust.spoiler === 'gt-wing' && (
                <g stroke="#0f172a" strokeWidth="2">
                  <path d="M 320 124 L 330 88 L 365 86 L 360 94 L 338 95 L 330 124 Z" fill="#1e293b" />
                  <rect x="315" y="84" width="55" height="7" rx="2" fill="#0f172a" stroke={primary} strokeWidth="1.5" />
                </g>
              )}
              {cust.spoiler === 'ducktail' && (
                <path d="M 340 130 L 362 116 L 364 124 L 345 134 Z" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
              )}
            </g>
          )}

          {/* --- WHEELS (RENDERED DYNAMICALLY WITH USER RIM & TIRE SELECTION) --- */}
          {/* Front Wheel */}
          {renderWheelHub(110, category === 'monster-truck' ? 170 : 158, category === 'monster-truck' ? 46 : 30, true)}

          {/* Rear Wheel (or Dual Rear Wheels for Work Hauler) */}
          {renderWheelHub(category === 'work-machine' ? 280 : 300, category === 'monster-truck' ? 170 : 158, category === 'monster-truck' ? 46 : 30, false)}

          {category === 'work-machine' && renderWheelHub(330, 158, 30, false)}
        </svg>
      ) : (
        /* --- TOP-DOWN AERO VIEW --- */
        <svg
          viewBox="0 0 160 300"
          className="w-full h-full drop-shadow-2xl overflow-visible transition-all duration-300"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Car Body Top-Down */}
          <path
            d="M 40 30 C 50 15, 110 15, 120 30 L 130 90 L 135 210 C 135 260, 120 280, 80 280 C 40 280, 25 260, 25 210 L 30 90 Z"
            fill={primary}
            stroke="#0f172a"
            strokeWidth="4"
          />

          {/* Windshield & Rear Window with Custom Tint */}
          <path d="M 45 75 Q 80 60 115 75 L 120 120 Q 80 130 40 120 Z" fill={tintColors.mid} stroke="#0f172a" strokeWidth="2" opacity="0.9" />
          <path d="M 45 190 Q 80 180 115 190 L 110 220 Q 80 225 50 220 Z" fill={tintColors.mid} stroke="#0f172a" strokeWidth="2" opacity="0.9" />
          <rect x="44" y="125" width="72" height="60" fill={secondary} opacity="0.6" rx="4" />

          {/* Decals Top-Down */}
          {cust.livery === 'racing-stripes' && (
            <g fill={decalColor} opacity="0.95">
              <rect x="72" y="20" width="6" height="255" />
              <rect x="82" y="20" width="6" height="255" />
            </g>
          )}
          {cust.livery === 'checkered' && (
            <g fill={decalColor} opacity="0.9">
              <rect x="65" y="135" width="10" height="10" />
              <rect x="85" y="135" width="10" height="10" />
              <rect x="75" y="145" width="10" height="10" />
            </g>
          )}

          {/* Racing Number on Roof */}
          {racingNumber && (
            <g>
              <circle cx="80" cy="155" r="16" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
              <text x="80" y="161" fill="#0f172a" fontSize="13" fontWeight="bold" textAnchor="middle">
                {racingNumber}
              </text>
            </g>
          )}

          {/* GT Wing Top-Down */}
          {cust.spoiler === 'gt-wing' && (
            <rect x="15" y="260" width="130" height="18" rx="4" fill="#0f172a" stroke={primary} strokeWidth="2" />
          )}

          {/* Wheels Top-Down */}
          <rect x="10" y="45" width="18" height="40" rx="4" fill="#18181b" stroke={rim} strokeWidth="2" />
          <rect x="132" y="45" width="18" height="40" rx="4" fill="#18181b" stroke={rim} strokeWidth="2" />
          <rect x="8" y="200" width="22" height="48" rx="4" fill="#18181b" stroke={rim} strokeWidth="2" />
          <rect x="130" y="200" width="22" height="48" rx="4" fill="#18181b" stroke={rim} strokeWidth="2" />

          {/* Headlights Top */}
          <ellipse cx="45" cy="28" rx="6" ry="10" fill="#fef08a" />
          <ellipse cx="115" cy="28" rx="6" ry="10" fill="#fef08a" />
        </svg>
      )}
    </div>
  );
};
