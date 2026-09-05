'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    baseAlpha: number;
    color: string;
}

export function AmbientParticleCanvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const colors = [
            'rgba(59, 130, 246, ',   // Blue
            'rgba(147, 51, 234, ',   // Purple
            'rgba(6, 182, 212, ',    // Cyan
            'rgba(244, 63, 94, ',    // Rose
        ];

        // Create particles
        const particleCount = Math.min(Math.floor((width * height) / 22000), 55);
        const particles: Particle[] = [];

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.45,
                vy: (Math.random() - 0.5) * 0.45,
                radius: Math.random() * 2.2 + 1,
                baseAlpha: Math.random() * 0.4 + 0.15,
                color: colors[Math.floor(Math.random() * colors.length)],
            });
        }

        // Mouse interaction position
        const mouse = { x: -1000, y: -1000, radius: 150 };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);

        // Render Loop
        const render = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw ambient mesh lines between close particles
            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 130) {
                        const alpha = (1 - dist / 130) * 0.12;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(147, 197, 253, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }

                // Mouse connection lines
                const mdx = p1.x - mouse.x;
                const mdy = p1.y - mouse.y;
                const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                if (mdist < mouse.radius) {
                    const mAlpha = (1 - mdist / mouse.radius) * 0.25;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(56, 189, 248, ${mAlpha})`;
                    ctx.lineWidth = 1.2;
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }

                // Update particle position
                p1.x += p1.vx;
                p1.y += p1.vy;

                // Bounce off edges gently
                if (p1.x < 0 || p1.x > width) p1.vx *= -1;
                if (p1.y < 0 || p1.y > height) p1.vy *= -1;

                // Draw Particle Glow
                ctx.beginPath();
                ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
                ctx.fillStyle = `${p1.color}${p1.baseAlpha})`;
                ctx.shadowBlur = 10;
                ctx.shadowColor = `${p1.color}0.6)`;
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0 opacity-80"
        />
    );
}
