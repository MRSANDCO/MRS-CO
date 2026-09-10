'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    Sparkles,
    X,
} from 'lucide-react';

export default function EmployeeAttendance() {
    const [todayData, setTodayData] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

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

    useEffect(() => {
        fetchAttendanceData();
    }, []);

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

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                <p className="text-sm text-slate-400 font-medium">Loading attendance details...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
                        <Calendar className="w-6 h-6 text-blue-400" />
                        Employee Attendance
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                        Track your daily check-ins and view attendance logs
                    </p>
                </div>
                <Button
                    onClick={fetchAttendanceData}
                    variant="outline"
                    className="h-10 px-3.5 border-white/[0.1] bg-white/[0.04] text-slate-300 hover:text-white rounded-xl text-xs gap-2 self-start sm:self-auto"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Toast Notifications */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/60 text-rose-200 text-sm flex items-center justify-between backdrop-blur-xl shadow-lg"
                    >
                        <div className="flex items-center gap-2.5">
                            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                        <button onClick={() => setError('')} className="text-slate-400 hover:text-white">
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}

                {successMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/60 text-emerald-200 text-sm flex items-center justify-between backdrop-blur-xl shadow-lg"
                    >
                        <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            <span>{successMsg}</span>
                        </div>
                        <button onClick={() => setSuccessMsg('')} className="text-slate-400 hover:text-white">
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Today's Attendance Card */}
            <Card className="border-white/[0.08] bg-slate-900/60 backdrop-blur-xl shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500" />
                <CardContent className="p-6 sm:p-8">
                    <h2 className="text-base sm:text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-cyan-400" />
                        Today&apos;s Attendance Status
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Date */}
                        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                                Date
                            </span>
                            <span className="text-base font-medium text-white">
                                {todayData?.todayDate || new Date().toLocaleDateString('en-GB')}
                            </span>
                        </div>

                        {/* Status */}
                        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                                Status
                            </span>
                            <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${
                                    todayData?.marked
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                }`}
                            >
                                <span className={`w-1.5 h-1.5 rounded-full ${todayData?.marked ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                                {todayData?.status || (todayData?.marked ? 'PRESENT' : 'NOT MARKED')}
                            </span>
                        </div>

                        {/* Check-in Time */}
                        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                                Check-in Time
                            </span>
                            <span className="text-base font-mono font-medium text-cyan-300">
                                {todayData?.marked
                                    ? todayData?.attendance?.formattedCheckInTime || todayData?.attendance?.checkInTime || '--'
                                    : '--'}
                            </span>
                        </div>
                    </div>

                    {/* Action Button / Success Indicator */}
                    {!todayData?.marked ? (
                        <Button
                            onClick={handleMarkAttendance}
                            disabled={submitting}
                            className="px-6 py-2.5 h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 transition gap-2"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Marking...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    Mark Attendance Now
                                </>
                            )}
                        </Button>
                    ) : (
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold flex items-center gap-2">
                            <Check className="w-5 h-5 text-emerald-400" />
                            Attendance Marked for Today ({todayData?.attendance?.formattedCheckInTime})
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Attendance History */}
            <Card className="border-white/[0.08] bg-slate-900/60 backdrop-blur-xl shadow-2xl overflow-hidden">
                <CardContent className="p-6">
                    <h2 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <History className="w-5 h-5 text-indigo-400" />
                        Attendance History
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="border-b border-white/[0.08] bg-white/[0.02] text-slate-400 font-semibold tracking-wider uppercase text-[10px]">
                                    <th className="py-3 px-4">Date</th>
                                    <th className="py-3 px-4">Check-in Time</th>
                                    <th className="py-3 px-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.05]">
                                {history.length > 0 ? (
                                    history.map((record, index) => (
                                        <tr key={record.attendanceId || index} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="py-3.5 px-4 text-white font-medium">
                                                {record.formattedDate || record.date}
                                            </td>
                                            <td className="py-3.5 px-4 font-mono text-cyan-300">
                                                {record.formattedCheckInTime || record.checkInTime || '--'}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span
                                                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border ${
                                                        record.status === 'PRESENT'
                                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                            : record.status === 'LATE'
                                                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                    }`}
                                                >
                                                    {record.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="py-8 text-center text-slate-500">
                                            No attendance history records found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
