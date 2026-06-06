export function RobotMascot({ size = 150 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.28} viewBox="0 0 160 205" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="80" cy="200" rx="36" ry="6" fill="rgba(139,92,246,0.22)"/>
      <rect x="32" y="98" width="96" height="80" rx="22" fill="white" opacity=".93"/>
      <rect x="37" y="26" width="86" height="76" rx="22" fill="white" opacity=".93"/>
      <rect x="76" y="6" width="8" height="22" rx="4" fill="white" opacity=".82"/>
      <circle cx="80" cy="5" r="9" fill="#F59E0B"/>
      <circle cx="80" cy="5" r="4.5" fill="#FDE68A"/>
      <circle cx="60" cy="60" r="14" fill="#7C3AED"/>
      <circle cx="100" cy="60" r="14" fill="#7C3AED"/>
      <circle cx="63" cy="58" r="5.5" fill="white"/>
      <circle cx="103" cy="58" r="5.5" fill="white"/>
      <circle cx="62" cy="57" r="3" fill="#1a0b4b"/>
      <circle cx="102" cy="57" r="3" fill="#1a0b4b"/>
      <circle cx="64" cy="55" r="1.5" fill="white"/>
      <circle cx="104" cy="55" r="1.5" fill="white"/>
      <path d="M60 80 Q80 95 100 80" stroke="#7C3AED" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <rect x="39" y="110" width="58" height="50" rx="7" fill="#8B5CF6"/>
      <rect x="39" y="110" width="28" height="50" rx="7" fill="#6D28D9"/>
      <line x1="67" y1="110" x2="67" y2="160" stroke="white" strokeWidth="1.5" opacity=".4"/>
      <line x1="73" y1="123" x2="91" y2="123" stroke="white" strokeWidth="2" opacity=".75"/>
      <line x1="73" y1="132" x2="91" y2="132" stroke="white" strokeWidth="2" opacity=".75"/>
      <line x1="73" y1="141" x2="91" y2="141" stroke="white" strokeWidth="2" opacity=".75"/>
      <rect x="7" y="108" width="28" height="16" rx="8" fill="white" opacity=".88"/>
      <rect x="125" y="108" width="28" height="16" rx="8" fill="white" opacity=".88"/>
      <rect x="49" y="175" width="22" height="22" rx="11" fill="white" opacity=".88"/>
      <rect x="89" y="175" width="22" height="22" rx="11" fill="white" opacity=".88"/>
    </svg>
  )
}
