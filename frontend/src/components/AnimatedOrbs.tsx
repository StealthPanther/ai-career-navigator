'use client';

import { CSSProperties } from 'react';

export default function AnimatedOrbs() {
    const orbs = [
        {
            size: 400,
            top: '10%',
            left: '5%',
            gradient: 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, rgba(168,85,247,0) 70%)',
            duration: 20,
        },
        {
            size: 500,
            top: '60%',
            right: '10%',
            gradient: 'radial-gradient(circle, rgba(236,72,153,0.25) 0%, rgba(236,72,153,0) 70%)',
            duration: 25,
        },
        {
            size: 350,
            bottom: '20%',
            left: '40%',
            gradient: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, rgba(139,92,246,0) 70%)',
            duration: 30,
        },
    ];

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
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
                    filter: 'blur(60px)',
                    animation: `floatSlow ${orb.duration}s ease-in-out infinite, pulse ${orb.duration / 2}s ease-in-out infinite`,
                    animationDelay: `${idx * 2}s`,
                };

                return <div key={idx} style={orbStyle} />;
            })}
        </div>
    );
}
