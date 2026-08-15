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
        animation: `rotate3d ${animationDuration}s linear infinite, float 7s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        zIndex: 1,
        opacity: 0.5,
    };

    const faceStyle: CSSProperties = {
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: 'hsl(var(--paper-2) / 0.5)',
        border: '1.5px solid hsl(var(--ink) / 0.35)',
        boxShadow: '0 0 0 1px hsl(var(--paper) / 0.4)',
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
