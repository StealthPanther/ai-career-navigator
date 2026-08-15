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
    { Icon: Brain, x: '8%', y: '22%', size: 44, delay: 0, duration: 26, color: 'hsl(var(--plum))' },
    { Icon: Rocket, x: '86%', y: '14%', size: 38, delay: 5, duration: 28, color: 'hsl(var(--stamp))' },
    { Icon: Code, x: '82%', y: '78%', size: 50, delay: 2, duration: 30, color: 'hsl(var(--seal))' },
    { Icon: Database, x: '14%', y: '74%', size: 34, delay: 7, duration: 22, color: 'hsl(var(--gold))' },
    { Icon: Cpu, x: '50%', y: '8%', size: 24, delay: 10, duration: 34, color: 'hsl(var(--ink-2))' },
    { Icon: Globe, x: '92%', y: '48%', size: 30, delay: 4, duration: 26, color: 'hsl(var(--seal))' },
    { Icon: BarChart, x: '4%', y: '48%', size: 38, delay: 1, duration: 24, color: 'hsl(var(--stamp))' },
    { Icon: Layers, x: '42%', y: '92%', size: 40, delay: 8, duration: 32, color: 'hsl(var(--plum))' },
];

export default function FloatingIcons() {
    return (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
            {icons.map((item, index) => (
                <motion.div
                    key={index}
                    className="absolute"
                    style={{
                        left: item.x,
                        top: item.y,
                        color: item.color,
                        filter: 'drop-shadow(0 1px 0 hsl(var(--paper)))',
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: [0.14, 0.32, 0.14],
                        scale: [0.85, 1.05, 0.85],
                        y: [0, -22, 0],
                        rotate: [0, 8, -6, 0],
                    }}
                    transition={{
                        duration: item.duration,
                        repeat: Infinity,
                        delay: item.delay,
                        ease: "easeInOut",
                    }}
                >
                    <item.Icon size={item.size} strokeWidth={1.4} />
                </motion.div>
            ))}
        </div>
    );
}
