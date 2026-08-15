'use client';

import { CSSProperties } from 'react';

export default function AnimatedOrbs() {
    const orbs = [
        {
            size: 420,
            top: '8%',
            left: '4%',
            gradient: 'radial-gradient(circle, hsl(8 71% 45% / 0.12) 0%, transparent 70%)',
            duration: 22,
        },
        {
            size: 520,
            top: '58%',
            right: '8%',
            gradient: 'radial-gradient(circle, hsl(218 56% 42% / 0.11) 0%, transparent 70%)',
            duration: 26,
        },
        {
            size: 380,
            bottom: '16%',
            left: '38%',
            gradient: 'radial-gradient(circle, hsl(40 52% 42% / 0.14) 0%, transparent 70%)',
            duration: 30,
        },
    ];

    return (
        <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
            {orbs.map((orb, idx) => {
                const orbStyle: CSSProperties = {
                    position: 'absolute',
                    width: `${orb.size}px`,
                    height: `${orb.size}px`,
                    top: orb.top,
                    left: orb.left,
                    right: orb.right,
                    bottom: orb.bottom,
                    background: orb.gradient,
                    borderRadius: '50%',
                    filter: 'blur(50px)',
                    animation: `drift ${orb.duration}s ease-in-out infinite`,
                    animationDelay: `${idx * 2}s`,
                };

                return <div key={idx} style={orbStyle} />;
            })}
        </div>
    );
}
