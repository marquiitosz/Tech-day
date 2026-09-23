import { useState } from 'react'

type BrandMarkProps = {
  compact?: boolean
  variant?: 'hero' | 'arrow'
  framed?: boolean
}

function BrandMark({ compact = false, variant = 'arrow', framed = true }: BrandMarkProps) {
  const isHero = variant === 'hero'
  const [pointer, setPointer] = useState({ x: 50, y: 50, active: false })

  function handlePointerMove(event: React.PointerEvent<HTMLSpanElement>) {
    const bounds = event.currentTarget.getBoundingClientRect()
    setPointer({
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
      active: true,
    })
  }

  const rotateX = (50 - pointer.y) * 0.12
  const rotateY = (pointer.x - 50) * 0.12
  const arrowX = (pointer.x - 50) * 0.12
  const arrowY = (pointer.y - 50) * 0.08
  const scale = pointer.active ? 1.04 : 1

  return (
    <span
      className={`group relative inline-flex [perspective:900px] ${compact ? 'h-10 w-10' : isHero ? 'h-60 w-60 md:h-80 md:w-80' : 'h-20 w-20 md:h-24 md:w-24'}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setPointer((current) => ({ ...current, active: false }))}
      aria-hidden="true"
    >
      {framed && <span
          className={`absolute inset-0 rounded-[2rem] border border-blue-300/20 bg-[#020817] shadow-2xl transition duration-300 ${compact ? 'rounded-lg' : ''} group-hover:border-cyan-300/60`}
          style={{
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
            boxShadow: pointer.active ? '0 0 46px rgba(14, 165, 233, 0.3)' : '0 25px 50px rgba(2, 8, 23, 0.45)',
          }}
        />}
      <svg viewBox="0 0 300 300" className="relative z-10 h-full w-full overflow-visible transition-transform duration-100" style={{ transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})` }} fill="none">
        <defs>
          <linearGradient id="brand-arrow" x1="50" y1="250" x2="250" y2="55" gradientUnits="userSpaceOnUse">
            <stop stopColor="#126BFF" />
            <stop offset="1" stopColor="#11C9EA" />
          </linearGradient>
          <filter id="brand-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="center-blue-light" cx="50%" cy="50%" r="50%">
            <stop stopColor="#22D3EE" stopOpacity="0.7" />
            <stop offset="1" stopColor="#0EA5E9" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="center-purple-light" cx="50%" cy="50%" r="50%">
            <stop stopColor="#C084FC" stopOpacity="0.62" />
            <stop offset="1" stopColor="#7C3AED" stopOpacity="0" />
          </radialGradient>
        </defs>

        {isHero && (
          <>
            <g className="brand-center-light" pointerEvents="none">
              <ellipse cx="150" cy="150" rx="96" ry="78" fill="url(#center-blue-light)" />
              <ellipse cx="150" cy="157" rx="70" ry="62" fill="url(#center-purple-light)" />
            </g>
            <path d="M75 48C75 39 82 32 91 32H253L232 70H113V100H219L174 136H113V166H174L113 205V245H91C82 245 75 238 75 229V48Z" fill="#F8FAFC" className="transition duration-500 group-hover:fill-white" />
            <path d="M75 205L113 195V245H91C82 245 75 238 75 229V205Z" fill="#F8FAFC" />
          </>
        )}

        {isHero && <g className="transition duration-500 group-hover:-translate-y-1">
          <path d="M132 199L153 190V247L132 242V199Z" fill="url(#brand-arrow)" />
          <path d="M162 181L183 170V254L162 249V181Z" fill="url(#brand-arrow)" />
          <path d="M192 160L214 148V262L192 256V160Z" fill="url(#brand-arrow)" />
        </g>}

        <g filter="url(#brand-glow)" style={{ transform: `translate(${arrowX}px, ${arrowY}px) rotate(${rotateY * 0.3}deg)` }} className="transition duration-100">
          <path d="M52 190C82 213 143 192 198 143C216 127 230 111 240 96" stroke="url(#brand-arrow)" strokeWidth="15" strokeLinecap="round" />
          <path d="M216 88L252 70L245 110" stroke="url(#brand-arrow)" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </span>
  )
}

export default BrandMark
