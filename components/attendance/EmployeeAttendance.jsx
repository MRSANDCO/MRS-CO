'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    getTodayAttendance,
    getEmployeeAttendanceHistory,
    markEmployeeAttendance,
} from '@/lib/api';
import {
    Calendar,
    Clock,
    CheckCircle2,
    AlertCircle,
    Loader2,
    RefreshCw,
    Check,
    History,
    X,
    TrendingUp,
    BadgeCheck,
    Timer,
    Activity,
    ChevronRight,
    Zap,
} from 'lucide-react';

/* ─────────────────────────────────────────
   3-D tilt card hook
───────────────────────────────────────── */
function useTilt(maxDeg = 8) {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-1, 1], [maxDeg, -maxDeg]);
    const rotateY = useTransform(x, [-1, 1], [-maxDeg, maxDeg]);
    const sx = useSpring(rotateX, { stiffness: 200, damping: 20 });
    const sy = useSpring(rotateY, { stiffness: 200, damping: 20 });

    const onMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
        y.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    const onMouseLeave = () => { x.set(0); y.set(0); };
    return { ref, style: { rotateX: sx, rotateY: sy, transformStyle: 'preserve-3d' }, onMouseMove, onMouseLeave };
}

/* ─────────────────────────────────────────
   Animated number counter
───────────────────────────────────────── */
function AnimatedNumber({ value }) {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        let start = 0;
        const end = Number(value) || 0;
        if (start === end) return;
        const step = Math.max(1, Math.ceil(end / 30));
        const timer = setInterval(() => {
            start = Math.min(start + step, end);
            setDisplay(start);
            if (start >= end) clearInterval(timer);
        }, 30);
        return () => clearInterval(timer);
    }, [value]);
    return <span>{display}</span>;
}

/* ─────────────────────────────────────────
   Floating ambient orb decorations
───────────────────────────────────────── */
function FloatingOrbs() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <motion.div
                className="absolute -top-32 -right-32 w-96 h-96 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)' }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)' }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            />
            <motion.div
                className="absolute top-8 right-8 w-32 h-32 rounded-full border border-blue-500/10"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
                className="absolute top-12 right-12 w-20 h-20 rounded-full border border-cyan-500/10"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            />
        </div>
    );
}

/* ─────────────────────────────────────────
   Live 3-D CSS clock visual
───────────────────────────────────────── */
function Clock3D() {
    const [tick, setTick] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setTick(t => t + 1), 1000);
        return () => clearInterval(id);
    }, []);

    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours() % 12;
    const secDeg = seconds * 6;
    const minDeg = (minutes + seconds / 60) * 6;
    const hrDeg = (hours + minutes / 60) * 30;

    return (
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0">
            <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                    background: 'conic-gradient(from 0deg, rgba(59,130,246,0.3), rgba(99,102,241,0.2), rgba(6,182,212,0.3), rgba(59,130,246,0.3))',
                    boxShadow: '0 0 30px rgba(59,130,246,0.2), inset 0 0 20px rgba(59,130,246,0.05)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            />
            <div
                className="absolute inset-2 rounded-full flex items-center justify-center"
                style={{
                    background: 'radial-gradient(circle at 35% 35%, rgba(30,41,59,0.95), rgba(15,23,42,0.98))',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.4)',
                }}
            >
                {/* Hour hand */}
                <div
                    className="absolute bottom-1/2 rounded-full bg-white/80 origin-bottom"
                    style={{ width: '2px', height: '28%', transformOrigin: 'bottom center', transform: `translateX(-50%) rotate(${hrDeg}deg)`, left: 'calc(50% - 1px)' }}
                />
                {/* Minute hand */}
                <div
                    className="absolute bottom-1/2 rounded-full bg-blue-400 origin-bottom"
                    style={{ width: '1px', height: '36%', transformOrigin: 'bottom center', transform: `translateX(-50%) rotate(${minDeg}deg)`, left: 'calc(50%)' }}
                />
                {/* Second hand */}
                <div
                    className="absolute bottom-1/2 rounded-full bg-red-500 origin-bottom"
                    style={{ width: '1px', height: '38%', transformOrigin: 'bottom center', transform: `translateX(-50%) rotate(${secDeg}deg)`, left: 'calc(50%)' }}
                />
                {/* Center dot */}
                <div className="absolute w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_6px_2px_rgba(59,130,246,0.6)]" style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
                {/* Hour markers */}
                {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg) => (
                    <div key={deg} className="absolute inset-0 flex justify-center" style={{ transform: `rotate(${deg}deg)` }}>
                        <div className={`rounded-full ${deg % 90 === 0 ? 'w-0.5 h-1.5 mt-1 bg-white/50' : 'w-px h-1 mt-1.5 bg-white/20'}`} />
                    </div>
                ))}
            </div>
            <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.15), transparent)' }}
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
        </div>
    );
}

/* ─────────────────────────────────────────
   Status config helper
───────────────────────────────────────── */
function getStatusConfig(todayData) {
    if (!todayData) return {
        label: 'Loading', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', dot: 'bg-slate-400',
        Icon: Loader2,
    };
    if (todayData.marked) {
        const st = todayData.status || 'PRESENT';
        if (st === 'LATE') return { label: 'Late', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/25', dot: 'bg-amber-400', Icon: Timer };
        return { label: 'Present', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', dot: 'bg-emerald-400', Icon: BadgeCheck };
    }
    return { label: 'Not Marked', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/25', dot: 'bg-amber-400', Icon: AlertCircle };
}

/* ─────────────────────────────────────────
   Summary stat card
───────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, accentClass, delay }) {
    const tilt = useTilt(6);
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            style={{ perspective: '800px' }}
        >
            <motion.div
                ref={tilt.ref}
                style={tilt.style}
                onMouseMove={tilt.onMouseMove}
                onMouseLeave={tilt.onMouseLeave}
                whileHover={{ y: -3 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative p-4 rounded-2xl border border-white/[0.07] bg-slate-900/50 backdrop-blur-xl overflow-hidden cursor-default"
            >
                <div className={`absolute top-0 left-0 right-0 h-px ${accentClass}`} />
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/[0.05] border border-white/[0.06]">
                        <Icon className="w-4 h-4 text-slate-300" />
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-0.5">{label}</p>
                        <p className="text-xl font-bold text-white tabular-nums">
                            <AnimatedNumber value={value} />
                        </p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function EmployeeAttendance() {
    // ── EXISTING STATE (unchanged) ──
    const [todayData, setTodayData] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // ── EXISTING DATA FETCH (unchanged) ──
    const fetchAttendanceData = async () => {
        setLoading(true);
        setError('');
        try {
            const [todayRes, historyRes] = await Promise.all([
                getTodayAttendance(),
                getEmployeeAttendanceHistory(),
            ]);
            setTodayData(todayRes);
            setHistory(Array.isArray(historyRes) ? historyRes : []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load attendance details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAttendanceData(); }, []);

    // ── EXISTING HANDLER (unchanged) ──
    const handleMarkAttendance = async () => {
        setSubmitting(true);
        setError('');
        setSuccessMsg('');
        try {
            const res = await markEmployeeAttendance();
            setSuccessMsg(res.message || 'Attendance marked successfully!');
            await fetchAttendanceData();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to mark attendance');
        } finally {
            setSubmitting(false);
        }
    };

    // Derived stats from existing history data (read-only, no new logic)
    const presentDays = history.filter(r => r.status === 'PRESENT').length;
    const lateDays = history.filter(r => r.status === 'LATE').length;
    const totalDays = history.length;
    const pct = totalDays > 0 ? Math.round(((presentDays + lateDays) / totalDays) * 100) : 0;

    const statusCfg = getStatusConfig(todayData);
    const { Icon: StatusIcon } = statusCfg;

    const now = new Date();
    const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
    const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // ── LOADING STATE ──
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
                <div className="relative w-16 h-16">
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-blue-500/30"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.div
                        className="absolute inset-2 rounded-full border-2 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-blue-400" />
                    </div>
                </div>
                <div className="text-center">
                    <p className="text-sm font-semibold text-white">Loading Attendance</p>
                    <p className="text-xs text-slate-500 mt-1">Fetching your records...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-8" style={{ perspective: '1200px' }}>

            {/* ══ HERO HEADER ══ */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative rounded-3xl overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(17,24,39,0.9) 50%, rgba(15,23,42,0.95) 100%)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
                }}
            >
                <FloatingOrbs />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />

                <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex-1 min-w-0">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 text-xs font-semibold text-blue-300"
                            style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}
                        >
                            <Activity className="w-3 h-3" />
                            {dayName}
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-3xl sm:text-4xl font-bold text-white leading-tight"
                            style={{ letterSpacing: '-0.02em' }}
                        >
                            Attendance
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-sm text-slate-400 mt-1.5"
                        >
                            Track your daily attendance and maintain your work records.
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.35 }}
                            className="text-xs text-slate-500 mt-1 font-mono"
                        >
                            {dateStr}
                        </motion.p>

                        {todayData && (
                            <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className={`inline-flex items-center gap-2 mt-4 px-3.5 py-1.5 rounded-full border text-xs font-semibold ${statusCfg.color} ${statusCfg.bg} ${statusCfg.border}`}
                            >
                                <motion.span
                                    className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}
                                    animate={{ opacity: [1, 0.3, 1] }}
                                    transition={{ duration: 1.8, repeat: Infinity }}
                                />
                                Today: {statusCfg.label}
                            </motion.div>
                        )}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.25, type: 'spring', stiffness: 200 }}
                        className="flex-shrink-0"
                    >
                        <Clock3D />
                    </motion.div>
                </div>
            </motion.div>

            {/* ══ TOAST NOTIFICATIONS (existing logic preserved) ══ */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.97 }}
                        className="p-4 rounded-2xl border border-rose-500/30 bg-rose-950/50 text-rose-200 text-sm flex items-center justify-between backdrop-blur-xl shadow-xl"
                    >
                        <div className="flex items-center gap-2.5">
                            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                        <button onClick={() => setError('')} className="text-slate-400 hover:text-white transition-colors ml-4" aria-label="Dismiss error">
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
                {successMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.97 }}
                        className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/50 text-emerald-200 text-sm flex items-center justify-between backdrop-blur-xl shadow-xl"
                    >
                        <div className="flex items-center gap-2.5">
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            </motion.div>
                            <span>{successMsg}</span>
                        </div>
                        <button onClick={() => setSuccessMsg('')} className="text-slate-400 hover:text-white transition-colors ml-4" aria-label="Dismiss message">
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ══ SUMMARY STATS (derived from existing history, read-only) ══ */}
            {totalDays > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatCard icon={Calendar} label="Total Days" value={totalDays} accentClass="bg-gradient-to-r from-blue-500 to-blue-600" delay={0.1} />
                    <StatCard icon={BadgeCheck} label="Present" value={presentDays} accentClass="bg-gradient-to-r from-emerald-500 to-emerald-600" delay={0.15} />
                    <StatCard icon={Timer} label="Late" value={lateDays} accentClass="bg-gradient-to-r from-amber-500 to-amber-600" delay={0.2} />
                    <StatCard icon={TrendingUp} label="Attendance %" value={pct} accentClass="bg-gradient-to-r from-indigo-500 to-indigo-600" delay={0.25} />
                </div>
            )}

            {/* ══ TODAY'S STATUS CARD ══ */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative rounded-3xl overflow-hidden"
                style={{
                    background: 'linear-gradient(145deg, rgba(15,23,42,0.98) 0%, rgba(17,24,39,0.95) 100%)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
                }}
            >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600" />
                <div
                    className="absolute inset-0 opacity-[0.025] pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                    }}
                />

                <div className="relative z-10 p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center">
                                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                            </div>
                            Today&apos;s Attendance
                        </h2>
                        <Button
                            onClick={fetchAttendanceData}
                            variant="outline"
                            className="h-8 px-3 border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-white rounded-xl text-xs gap-1.5 transition-all"
                            aria-label="Refresh attendance data"
                        >
                            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    </div>

                    {/* Info grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        {/* Date */}
                        <motion.div
                            whileHover={{ y: -2, scale: 1.01 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className="p-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] flex flex-col gap-1"
                        >
                            <div className="flex items-center gap-1.5 mb-1">
                                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Date</span>
                            </div>
                            <span className="text-sm font-semibold text-white">
                                {todayData?.todayDate || new Date().toLocaleDateString('en-GB')}
                            </span>
                        </motion.div>

                        {/* Status */}
                        <motion.div
                            whileHover={{ y: -2, scale: 1.01 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className={`p-4 rounded-2xl border flex flex-col gap-1 ${statusCfg.bg} ${statusCfg.border}`}
                        >
                            <div className="flex items-center gap-1.5 mb-1">
                                <StatusIcon className={`w-3.5 h-3.5 ${statusCfg.color}`} />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</span>
                            </div>
                            <span className={`text-sm font-bold ${statusCfg.color} flex items-center gap-2`}>
                                <motion.span
                                    className={`w-2 h-2 rounded-full ${statusCfg.dot} flex-shrink-0`}
                                    animate={todayData?.marked ? {} : { opacity: [1, 0.3, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                                {todayData?.status || (todayData?.marked ? 'PRESENT' : 'NOT MARKED')}
                            </span>
                        </motion.div>

                        {/* Check-in Time */}
                        <motion.div
                            whileHover={{ y: -2, scale: 1.01 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className="p-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] flex flex-col gap-1"
                        >
                            <div className="flex items-center gap-1.5 mb-1">
                                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Check-in</span>
                            </div>
                            <span className="text-sm font-mono font-semibold text-cyan-300">
                                {todayData?.marked
                                    ? (todayData?.attendance?.formattedCheckInTime || todayData?.attendance?.checkInTime || '--')
                                    : '--'}
                            </span>
                        </motion.div>
                    </div>

                    {/* ── ACTION BUTTON / SUCCESS STATE (existing logic preserved) ── */}
                    <AnimatePresence mode="wait">
                        {!todayData?.marked ? (
                            <motion.div
                                key="mark-btn"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.25 }}
                            >
                                <motion.button
                                    onClick={handleMarkAttendance}
                                    disabled={submitting}
                                    whileHover={submitting ? {} : { y: -2, boxShadow: '0 16px 40px rgba(59,130,246,0.4)' }}
                                    whileTap={submitting ? {} : { scale: 0.97, y: 0 }}
                                    className="relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl text-sm font-bold text-white overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed transition-shadow"
                                    style={{
                                        background: submitting ? 'linear-gradient(135deg, #2d4a8a, #1a6b6b)' : 'linear-gradient(135deg, #2563eb, #0891b2)',
                                        boxShadow: '0 8px 24px rgba(59,130,246,0.3)',
                                    }}
                                    aria-label="Mark attendance"
                                >
                                    {!submitting && (
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                                            animate={{ x: ['-200%', '200%'] }}
                                            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                                        />
                                    )}
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Marking Attendance…
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="w-4 h-4" />
                                            Mark Attendance Now
                                            <ChevronRight className="w-4 h-4 opacity-70" />
                                        </>
                                    )}
                                </motion.button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="marked-success"
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.96 }}
                                transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
                                className="flex items-center gap-3 p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.08]"
                            >
                                <motion.div
                                    initial={{ scale: 0, rotate: -20 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
                                    className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0"
                                >
                                    <Check className="w-4 h-4 text-emerald-400" />
                                </motion.div>
                                <div>
                                    <p className="text-sm font-bold text-emerald-400">Attendance Marked</p>
                                    <p className="text-xs text-emerald-500/80 mt-0.5">
                                        Checked in at {todayData?.attendance?.formattedCheckInTime || todayData?.attendance?.checkInTime}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* ══ ATTENDANCE HISTORY (existing data, existing logic) ══ */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative rounded-3xl overflow-hidden"
                style={{
                    background: 'rgba(15,23,42,0.95)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                }}
            >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
                <div className="p-6 sm:p-8">
                    <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5 mb-6">
                        <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center">
                            <History className="w-3.5 h-3.5 text-indigo-400" />
                        </div>
                        Attendance History
                        {history.length > 0 && (
                            <span className="text-xs font-semibold text-slate-500 ml-1">({history.length} records)</span>
                        )}
                    </h2>

                    {history.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-16 gap-3"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-slate-600" />
                            </div>
                            <p className="text-sm font-semibold text-slate-500">No attendance records found</p>
                            <p className="text-xs text-slate-600">Records will appear once you start marking attendance</p>
                        </motion.div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr>
                                        <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 border-b border-white/[0.06]">Date</th>
                                        <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 border-b border-white/[0.06]">Check-in Time</th>
                                        <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 border-b border-white/[0.06]">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((record, index) => (
                                        <motion.tr
                                            key={record.attendanceId || index}
                                            initial={{ opacity: 0, x: -8 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.35, delay: index * 0.04, ease: 'easeOut' }}
                                            className="group border-b border-white/[0.04] last:border-b-0"
                                        >
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-blue-500/60 transition-colors flex-shrink-0" />
                                                    <span className="text-slate-200 font-medium group-hover:text-white transition-colors">
                                                        {record.formattedDate || record.date}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 font-mono text-cyan-400 text-xs">
                                                {record.formattedCheckInTime || record.checkInTime || (
                                                    <span className="text-slate-600">—</span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                                                        record.status === 'PRESENT'
                                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                            : record.status === 'LATE'
                                                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                    }`}
                                                >
                                                    <span className={`w-1 h-1 rounded-full ${
                                                        record.status === 'PRESENT' ? 'bg-emerald-400' :
                                                        record.status === 'LATE' ? 'bg-amber-400' : 'bg-rose-400'
                                                    }`} />
                                                    {record.status}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* prefers-reduced-motion override */}
            <style>{`
                @media (prefers-reduced-motion: reduce) {
                    *, *::before, *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                }
            `}</style>
        </div>
    );
}
