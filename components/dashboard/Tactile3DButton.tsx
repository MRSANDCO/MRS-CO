'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface Tactile3DButtonProps extends HTMLMotionProps<'button'> {
    variant?: 'primary' | 'rose' | 'cyan' | 'ghost' | 'glass';
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
    children: React.ReactNode;
}

export function Tactile3DButton({
    variant = 'primary',
    size = 'md',
    icon,
    children,
    className = '',
    disabled,
    ...props
}: Tactile3DButtonProps) {
    const getVariantStyles = () => {
        switch (variant) {
            case 'rose':
                return 'bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 text-white shadow-[0_4px_14px_rgba(244,63,94,0.39)] border-t border-white/20 active:shadow-[0_1px_5px_rgba(244,63,94,0.4)]';
            case 'cyan':
                return 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_4px_14px_rgba(6,182,212,0.35)] border-t border-white/20 active:shadow-[0_1px_5px_rgba(6,182,212,0.35)]';
            case 'glass':
                return 'bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.2)] active:shadow-none';
            case 'ghost':
                return 'text-slate-300 hover:text-white hover:bg-white/[0.06] border border-transparent';
            case 'primary':
            default:
                return 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)] border-t border-white/20 active:shadow-[0_1px_5px_rgba(37,99,235,0.4)]';
        }
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'sm':
                return 'text-xs px-3 py-1.5 rounded-lg gap-1.5 font-medium';
            case 'lg':
                return 'text-base px-6 py-3 rounded-xl gap-2.5 font-semibold';
            case 'md':
            default:
                return 'text-sm px-4 py-2 rounded-xl gap-2 font-medium';
        }
    };

    return (
        <motion.button
            whileHover={disabled ? {} : { scale: 1.025, y: -1.5 }}
            whileTap={disabled ? {} : { scale: 0.96, y: 1 }}
            transition={{
                type: 'spring',
                stiffness: 400,
                damping: 17,
            }}
            disabled={disabled}
            className={`relative inline-flex items-center justify-center select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none transition-colors ${getVariantStyles()} ${getSizeStyles()} ${className}`}
            {...props}
        >
            {icon && <span className="flex-shrink-0">{icon}</span>}
            <span>{children}</span>
        </motion.button>
    );
}
