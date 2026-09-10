'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    getAdminAttendanceRecords,
} from '@/lib/api';
import {
    Calendar,
    Search,
    Filter,
    Loader2,
    RefreshCw,
    CheckCircle2,
    Clock,
    AlertCircle,
    UserCheck,
} from 'lucide-react';

export default function AdminAttendanceDashboard() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        employeeId: '',
        date: '',
        status: '',
        month: '',
        year: '',
    });

    const fetchAttendanceRecords = async () => {
        setLoading(true);
        try {
            const data = await getAdminAttendanceRecords(filters);
            setRecords(data.content || []);
        } catch (err) {
            console.error('Error fetching admin attendance:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendanceRecords();
    }, [filters]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
                        <UserCheck className="w-6 h-6 text-emerald-400" />
                        All Employee Attendance
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                        Monitor, search, and filter employee attendance logs across the organization
                    </p>
                </div>
                <Button
                    onClick={fetchAttendanceRecords}
                    variant="outline"
                    className="h-10 px-3.5 border-white/[0.1] bg-white/[0.04] text-slate-300 hover:text-white rounded-xl text-xs gap-2 self-start sm:self-auto"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Filter Bar */}
            <Card className="border-white/[0.08] bg-white/[0.03] backdrop-blur-xl">
                <CardContent className="p-4 sm:p-5">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {/* Employee ID filter */}
                        <div>
                            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                                Employee ID
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <Input
                                    type="text"
                                    name="employeeId"
                                    placeholder="Search EMP..."
                                    value={filters.employeeId || ''}
                                    onChange={handleFilterChange}
                                    className="pl-9 h-10 bg-slate-900/80 border-white/[0.1] text-white text-xs placeholder:text-slate-500 rounded-xl"
                                />
                            </div>
                        </div>

                        {/* Date filter */}
                        <div>
                            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                                Date
                            </label>
                            <Input
                                type="date"
                                name="date"
                                value={filters.date || ''}
                                onChange={handleFilterChange}
                                className="h-10 bg-slate-900/80 border-white/[0.1] text-white text-xs rounded-xl"
                            />
                        </div>

                        {/* Status filter */}
                        <div>
                            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                                Status
                            </label>
                            <select
                                name="status"
                                value={filters.status || ''}
                                onChange={handleFilterChange}
                                className="w-full h-10 px-3 bg-slate-900 border border-white/[0.1] text-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">All Statuses</option>
                                <option value="PRESENT">PRESENT</option>
                                <option value="ABSENT">ABSENT</option>
                                <option value="LATE">LATE</option>
                            </select>
                        </div>

                        {/* Month filter */}
                        <div>
                            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                                Month
                            </label>
                            <select
                                name="month"
                                value={filters.month || ''}
                                onChange={handleFilterChange}
                                className="w-full h-10 px-3 bg-slate-900 border border-white/[0.1] text-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">Select Month</option>
                                {[...Array(12)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Year filter */}
                        <div>
                            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                                Year
                            </label>
                            <Input
                                type="number"
                                name="year"
                                placeholder="2026"
                                value={filters.year || ''}
                                onChange={handleFilterChange}
                                className="h-10 bg-slate-900/80 border-white/[0.1] text-white text-xs placeholder:text-slate-500 rounded-xl"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Attendance Records Table */}
            <Card className="border-white/[0.08] bg-slate-900/60 backdrop-blur-xl shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="border-b border-white/[0.08] bg-white/[0.02] text-slate-400 font-semibold tracking-wider uppercase text-[10px]">
                                <th className="py-3.5 px-4">Employee ID</th>
                                <th className="py-3.5 px-4">Employee Name</th>
                                <th className="py-3.5 px-4">Date</th>
                                <th className="py-3.5 px-4">Check-in Time</th>
                                <th className="py-3.5 px-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.05]">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-slate-400">
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                                            <span>Fetching attendance records...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : records.length > 0 ? (
                                records.map((item, index) => (
                                    <tr key={item.attendanceId || index} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="py-3.5 px-4 font-mono font-bold text-blue-400">
                                            {item.employeeId}
                                        </td>
                                        <td className="py-3.5 px-4 font-medium text-white">
                                            {item.employeeName || '--'}
                                        </td>
                                        <td className="py-3.5 px-4 text-slate-300">
                                            {item.formattedDate || item.date}
                                        </td>
                                        <td className="py-3.5 px-4 font-mono text-cyan-300">
                                            {item.formattedCheckInTime || item.checkInTime || '--'}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span
                                                className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border ${
                                                    item.status === 'PRESENT'
                                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                        : item.status === 'LATE'
                                                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                }`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-slate-500">
                                        No attendance records found matching filters
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
