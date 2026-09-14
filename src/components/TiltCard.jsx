import React, { useRef, useState } from 'react';

export default function TiltCard({ children, className = '', glowColor, dataCursor, ...props }) {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({});
  const [glow, setGlow] = useState({ x: '50%', y: '50%', opacity: 0 });

  const onMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -4.0;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 4.0;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`,
      transition: 'transform 0.08s ease-out',
    });
    setGlow({ x: `${(x / rect.width) * 100}%`, y: `${(y / rect.height) * 100}%`, opacity: 0.18 });
  };

  const onMouseLeave = () => {
    setStyle({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)', transition: 'transform 0.35s ease-out' });
    setGlow((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={style}
      data-cursor={dataCursor}
      className={`relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0d14]/80 backdrop-blur-md transition-shadow hover:shadow-[0_12px_40px_-10px_rgba(225,29,116,0.25)] ${className}`}
      {...props}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 260px at ${glow.x} ${glow.y}, rgba(225, 29, 116, ${glow.opacity}), transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
}
