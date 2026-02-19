'use client';

import { CSSProperties } from 'react';

interface Floating3DCubeProps {
    size?: number;
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    animationDuration?: number;
    delay?: number;
}

export default function Floating3DCube({
    size = 120,
    top,
    left,
    right,
    bottom,
    animationDuration = 30,
    delay = 0,
}: Floating3DCubeProps) {
    const cubeStyle: CSSProperties = {
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        top,
        left,
        right,
        bottom,
        transformStyle: 'preserve-3d',
        animation: `rotate3d ${animationDuration}s linear infinite, float 6s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        zIndex: 1,
    };

    const faceStyle: CSSProperties = {
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: 'rgba(168, 85, 247, 0.1)',
        border: '2px solid rgba(168, 85, 247, 0.3)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 0 20px rgba(168, 85, 247, 0.2)',
    };

    return (
        <div style={cubeStyle} className="perspective-1000">
            <div style={{ ...faceStyle, transform: `translateZ(${size / 2}px)` }} />
            <div style={{ ...faceStyle, transform: `rotateY(90deg) translateZ(${size / 2}px)` }} />
            <div style={{ ...faceStyle, transform: `rotateY(180deg) translateZ(${size / 2}px)` }} />
            <div style={{ ...faceStyle, transform: `rotateY(-90deg) translateZ(${size / 2}px)` }} />
            <div style={{ ...faceStyle, transform: `rotateX(90deg) translateZ(${size / 2}px)` }} />
            <div style={{ ...faceStyle, transform: `rotateX(-90deg) translateZ(${size / 2}px)` }} />
        </div>
    );
}
