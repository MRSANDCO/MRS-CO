'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FolderOpen, FileText, MessageSquare, Sparkles } from 'lucide-react';

interface Interactive3DEmptyStateProps {
    type?: 'documents' | 'folders' | 'queries' | 'default';
    title: string;
    subtitle: string;
    actionLabel?: string;
    onAction?: () => void;
}

export function Interactive3DEmptyState({
    type = 'default',
    title,
    subtitle,
    actionLabel,
    onAction,
}: Interactive3DEmptyStateProps) {
    const boxRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Dynamic rotation on cursor hover
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 250, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 250, damping: 20 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [20, -20]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-25, 25]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!boxRef.current) return;
        const rect = boxRef.current.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
    };

    const getThemeConfig = () => {
        switch (type) {
            case 'documents':
                return {
                    icon: <FileText className="w-10 h-10 text-cyan-400" />,
                    gradient: 'from-cyan-500/30 via-blue-500/20 to-indigo-600/30',
                    border: 'border-cyan-500/40',
                    glow: 'shadow-[0_0_40px_rgba(6,182,212,0.25)]',
                    accentColor: 'text-cyan-400',
                };
            case 'folders':
                return {
                    icon: <FolderOpen className="w-10 h-10 text-blue-400" />,
                    gradient: 'from-blue-500/30 via-indigo-500/20 to-violet-600/30',
                    border: 'border-blue-500/40',
                    glow: 'shadow-[0_0_40px_rgba(59,130,246,0.25)]',
                    accentColor: 'text-blue-400',
                };
            case 'queries':
                return {
                    icon: <MessageSquare className="w-10 h-10 text-rose-400" />,
                    gradient: 'from-rose-500/30 via-pink-500/20 to-purple-600/30',
                    border: 'border-rose-500/40',
                    glow: 'shadow-[0_0_40px_rgba(244,63,94,0.25)]',
                    accentColor: 'text-rose-400',
                };
            default:
                return {
                    icon: <Sparkles className="w-10 h-10 text-slate-400" />,
                    gradient: 'from-slate-500/30 via-blue-500/20 to-slate-700/30',
                    border: 'border-slate-500/40',
                    glow: 'shadow-[0_0_40px_rgba(148,163,184,0.15)]',
                    accentColor: 'text-slate-400',
                };
        }
    };

    const theme = getThemeConfig();

    return (
        <div
            ref={boxRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            className="flex flex-col items-center justify-center py-14 px-4 text-center select-none"
            style={{ perspective: 1000 }}
        >
            {/* 3D Isometric Floating Glass Object */}
            <motion.div
                animate={{
                    y: [0, -10, 0],
                    rotateZ: [0, 2, -2, 0],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d',
                }}
                className="relative cursor-pointer group mb-6"
            >
                {/* Back 3D Layer (Depth effect) */}
                <div
                    className={`absolute -inset-2 rounded-3xl bg-gradient-to-br ${theme.gradient} blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* 3D Glass Box / Cube Container */}
                <div
                    className={`relative w-24 h-24 rounded-2xl bg-white/[0.06] backdrop-blur-2xl border ${theme.border} ${theme.glow} flex items-center justify-center p-4 transition-all duration-300 transform-gpu group-hover:scale-105`}
                    style={{
                        transform: 'translateZ(30px)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
                    }}
                >
                    {/* Inner 3D Icon */}
                    <motion.div
                        style={{ transform: 'translateZ(40px)' }}
                        className="relative z-10 flex items-center justify-center"
                    >
                        {theme.icon}
                    </motion.div>

                    {/* Corner shine highlight */}
                    <div className="absolute top-1 left-2 right-2 h-1/3 bg-gradient-to-b from-white/20 to-transparent rounded-t-xl pointer-events-none" />

                    {/* Orbiting particle ring */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-[-8px] rounded-full border border-dashed border-white/20 pointer-events-none"
                    />
                </div>

                {/* Floating Shadow beneath */}
                <motion.div
                    animate={{
                        scale: [1, 0.85, 1],
                        opacity: [0.4, 0.2, 0.4],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="w-20 h-4 bg-black/50 blur-md rounded-full mx-auto mt-4"
                />
            </motion.div>

            {/* Typography with high contrast */}
            <h3 className="text-white font-semibold text-base tracking-tight mb-1.5">{title}</h3>
            <p className="text-slate-400 text-xs sm:text-sm max-w-sm leading-relaxed mb-4">{subtitle}</p>

            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-white/[0.06] hover:bg-white/10 border border-white/10 transition-all"
                >
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
