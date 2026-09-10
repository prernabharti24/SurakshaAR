import React from 'react';

interface SurakshaLogoProps {
  variant?: 'full' | 'compact' | 'icon' | 'hero';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
  showTagline?: boolean;
  showSince?: boolean;
}

export const SurakshaLogo: React.FC<SurakshaLogoProps> = ({
  variant = 'compact',
  size = 'md',
  className = '',
  showTagline = false,
  showSince = true
}) => {
  // Dimension mapping for icon
  const getIconDimensions = () => {
    switch (size) {
      case 'sm':
        return { w: 26, h: 26, viewBoxSize: 64 };
      case 'md':
        return { w: 34, h: 34, viewBoxSize: 64 };
      case 'lg':
        return { w: 46, h: 46, viewBoxSize: 64 };
      case 'xl':
        return { w: 60, h: 60, viewBoxSize: 64 };
      case 'hero':
        return { w: 92, h: 92, viewBoxSize: 64 };
      default:
        return { w: 34, h: 34, viewBoxSize: 64 };
    }
  };

  const getTypographyClasses = () => {
    switch (size) {
      case 'sm':
        return {
          title: 'text-sm font-black tracking-wider',
          sub: 'text-[9px] tracking-widest',
          since: 'text-[8px] px-1 py-0.2',
          tagline: 'text-[10px]'
        };
      case 'md':
        return {
          title: 'text-base sm:text-lg font-black tracking-wider',
          sub: 'text-[10px] tracking-widest',
          since: 'text-[9px] px-1.5 py-0.5',
          tagline: 'text-xs'
        };
      case 'lg':
        return {
          title: 'text-xl sm:text-2xl font-black tracking-wider',
          sub: 'text-xs tracking-widest',
          since: 'text-[10px] px-2 py-0.5',
          tagline: 'text-sm'
        };
      case 'xl':
        return {
          title: 'text-3xl sm:text-4xl font-black tracking-widest',
          sub: 'text-xs sm:text-sm tracking-widest',
          since: 'text-xs px-2.5 py-0.5',
          tagline: 'text-sm sm:text-base'
        };
      case 'hero':
        return {
          title: 'text-4xl sm:text-5xl md:text-6xl font-black tracking-widest',
          sub: 'text-sm sm:text-base tracking-[0.25em]',
          since: 'text-xs sm:text-sm px-3 py-1 font-bold',
          tagline: 'text-sm sm:text-lg font-medium'
        };
    }
  };

  const dim = getIconDimensions();
  const typo = getTypographyClasses();

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Precision Industrial AR Shield Logo Mark */}
      <div className="relative shrink-0 flex items-center justify-center">
        {/* Glow backdrop on dark surfaces */}
        <div className="absolute inset-0 bg-red-600/25 blur-lg rounded-xl pointer-events-none" />

        <svg
          width={dim.w}
          height={dim.h}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative drop-shadow-[0_4px_12px_rgba(220,38,38,0.4)]"
        >
          {/* Hexagonal / Shield Outer Industrial Armor */}
          <polygon
            points="32,3 58,16 58,45 32,61 6,45 6,16"
            fill="#0B0F19"
            stroke="#1E293B"
            strokeWidth="2.5"
          />

          {/* Inner Safety Red Accent Boundary */}
          <polygon
            points="32,7 54,18 54,43 32,57 10,43 10,18"
            stroke="#DC2626"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#121827"
          />

          {/* AR Target Reticle Brackets [ + ] */}
          {/* Top-Left Bracket */}
          <path d="M15 22 L15 16 L22 16" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
          {/* Top-Right Bracket */}
          <path d="M42 16 L49 16 L49 22" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
          {/* Bottom-Left Bracket */}
          <path d="M15 39 L15 45 L22 45" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
          {/* Bottom-Right Bracket */}
          <path d="M42 45 L49 45 L49 39" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />

          {/* Safety Hardhat / Industrial Shield Center Silhouette */}
          <path
            d="M20 33 C20 24 44 24 44 33 L46 35 C46 36 44 37 42 37 L22 37 C20 37 18 36 18 35 Z"
            fill="#FFFFFF"
          />
          {/* Hardhat Crest Rib */}
          <path d="M32 23 L32 34" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />

          {/* AI Neural / Spatial Core Reticle Center Cross */}
          <circle cx="32" cy="45" r="2.5" fill="#EF4444" />
          <line x1="32" y1="40" x2="32" y2="42" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="32" y1="48" x2="32" y2="50" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="27" y1="45" x2="29" y2="45" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="35" y1="45" x2="37" y2="45" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Typography Block */}
      {variant !== 'icon' && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`text-white uppercase ${typo.title} leading-none flex items-center`}>
              SURAKSHA
              <span className="text-red-500 font-extrabold ml-0.5 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                AR
              </span>
            </span>

            {(showSince || variant === 'hero') && (
              <span
                className={`font-mono font-bold uppercase bg-red-950/80 border border-red-500/50 text-red-300 rounded-md tracking-wider ${typo.since}`}
              >
                SINCE 2026
              </span>
            )}
          </div>

          {(variant === 'full' || variant === 'hero' || showTagline) && (
            <p className={`text-slate-300 mt-1 ${typo.tagline} font-sans leading-snug tracking-normal`}>
              Train Safer. Work Smarter. Build a Safer Tomorrow.
            </p>
          )}

          {variant === 'compact' && !showTagline && (
            <span className={`text-slate-400 font-mono uppercase ${typo.sub} mt-0.5`}>
              Industrial Safety &bull; AR &bull; AI
            </span>
          )}
        </div>
      )}
    </div>
  );
};
