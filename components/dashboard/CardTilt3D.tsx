'use client';

import React, { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface CardTilt3DProps {
    children: React.ReactNode;
    className?: string;
    intensity?: number;
    spotlightColor?: string;
    glareOpacity?: number;
    bordered?: boolean;
}

export function CardTilt3D({
    children,
    className = '',
    intensity = 12,
    spotlightColor = 'rgba(59, 130, 246, 0.15)',
    glareOpacity = 0.12,
    bordered = true,
}: CardTilt3DProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Mouse coordinates relative to card center [-0.5, 0.5]
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth physics springs
    const mouseXSpring = useSpring(x, { stiffness: 350, damping: 25 });
    const mouseYSpring = useSpring(y, { stiffness: 350, damping: 25 });

    // 3D rotation transforms
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [intensity, -intensity]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-intensity, intensity]);

    // Raw cursor position for spotlight gradient
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Normalized [-0.5, 0.5]
        x.set((mouseX / width) - 0.5);
        y.set((mouseY / height) - 0.5);

        setCursorPos({ x: mouseX, y: mouseY });
    }, [x, y]);

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
    }, [x, y]);

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective: 1200,
                transformStyle: 'preserve-3d',
            }}
            className={`relative group ${className}`}
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d',
                }}
                className={`relative w-full h-full rounded-2xl transition-all duration-300 ${
                    isHovered ? 'shadow-[0_20px_50px_rgba(0,0,0,0.6)]' : 'shadow-lg'
                } ${bordered ? 'border border-white/10 hover:border-cyan-500/30' : ''}`}
            >
                {/* Content */}
                <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden">
                    {children}
                </div>

                {/* Spotlight Cursor Glow Overlay */}
                <motion.div
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="pointer-events-none absolute inset-0 rounded-2xl z-20 overflow-hidden"
                    style={{
                        background: `radial-gradient(500px circle at ${cursorPos.x}px ${cursorPos.y}px, ${spotlightColor}, transparent 60%)`,
                    }}
                />

                {/* Subtle Glare reflection */}
                <motion.div
                    animate={{ opacity: isHovered ? glareOpacity : 0 }}
                    transition={{ duration: 0.2 }}
                    className="pointer-events-none absolute inset-0 rounded-2xl z-20 overflow-hidden bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent"
                />
            </motion.div>
        </motion.div>
    );
}
