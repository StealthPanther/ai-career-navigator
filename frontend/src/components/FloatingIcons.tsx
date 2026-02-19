'use client';

import { motion } from 'framer-motion';
import {
    Brain,
    Code,
    Rocket,
    Database,
    Cpu,
    Globe,
    BarChart,
    Layers
} from 'lucide-react';

const icons = [
    { Icon: Brain, x: '10%', y: '20%', size: 48, delay: 0, duration: 25, color: '#a855f7' }, // Purple
    { Icon: Rocket, x: '85%', y: '15%', size: 40, delay: 5, duration: 28, color: '#f59e0b' }, // Amber
    { Icon: Code, x: '80%', y: '80%', size: 56, delay: 2, duration: 30, color: '#3b82f6' },   // Blue
    { Icon: Database, x: '15%', y: '75%', size: 36, delay: 7, duration: 22, color: '#ec4899' }, // Pink
    { Icon: Cpu, x: '50%', y: '10%', size: 24, delay: 10, duration: 35, color: '#10b981' }, // Emerald
    { Icon: Globe, x: '90%', y: '50%', size: 32, delay: 4, duration: 26, color: '#6366f1' }, // Indigo
    { Icon: BarChart, x: '5%', y: '50%', size: 40, delay: 1, duration: 24, color: '#ef4444' }, // Red
    { Icon: Layers, x: '40%', y: '90%', size: 44, delay: 8, duration: 32, color: '#8b5cf6' }, // Violet
];

export default function FloatingIcons() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {icons.map((item, index) => (
                <motion.div
                    key={index}
                    className="absolute"
                    style={{
                        left: item.x,
                        top: item.y,
                        color: item.color,
                        filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.1))'
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: [0.2, 0.5, 0.2],
                        scale: [0.8, 1.1, 0.8],
                        y: [0, -30, 0],
                        rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                        duration: item.duration,
                        repeat: Infinity,
                        delay: item.delay,
                        ease: "easeInOut",
                    }}
                >
                    <div
                        className="backdrop-blur-[1px]"
                        style={{
                            transform: `perspective(500px) rotateX(${(index * 37) % 20}deg) rotateY(${(index * 41) % 20}deg)`,
                        }}
                    >
                        <item.Icon size={item.size} strokeWidth={1.5} />
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
