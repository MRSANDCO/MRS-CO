'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Sparkles,
    RefreshCw,
    CheckCircle,
    XCircle,
    AlertCircle,
    Clock,
    Phone,
    Building2,
    Check,
    X,
    ChevronLeft,
    ChevronRight,
    Search,
    Filter,
    Info,
    Loader2,
    PartyPopper,
    AlertTriangle,
    SlidersHorizontal,
    Copy,
    Edit,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
    getTodayAnniversaryClients,
    getUpcomingAnniversaries,
    getAnniversaryHistory,
    updateClientAnniversarySettings,
    getAllUsers,
    type AnniversaryClientDto,
    type AnniversaryNotificationLog,
    type PageResponse,
    type UserProfile,
} from '@/lib/api';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr?: string): string {
    if (!dateStr) return '—';
    try {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            const year = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const day = parseInt(parts[2], 10);
            const d = new Date(year, month, day);
            return d.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            });
        }
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    } catch {
        return dateStr;
    }
}

function formatDateTime(dateTimeStr?: string): string {
    if (!dateTimeStr) return '—';
    try {
        return new Date(dateTimeStr).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return dateTimeStr;
    }
}

function getOrdinalSuffix(n: number): string {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function calculateDaysRemaining(formationDateStr?: string): number | null {
    if (!formationDateStr) return null;
    try {
        const [fYear, fMonth, fDay] = formationDateStr.split('-').map(Number);
        const now = new Date();
        const currentYear = now.getFullYear();

        let target = new Date(currentYear, fMonth - 1, fDay);
        const todayReset = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (target.getTime() < todayReset.getTime()) {
            target = new Date(currentYear + 1, fMonth - 1, fDay);
        }

        const diffTime = target.getTime() - todayReset.getTime();
        return Math.round(diffTime / (1000 * 60 * 60 * 24));
    } catch {
        return null;
    }
}

// ─── Status Badge Component ──────────────────────────────────────────────────

function StatusBadge({ status }: { status?: string }) {
    if (!status) {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500/15 border border-slate-500/30 text-slate-400">
                <Clock className="w-3 h-3" /> None
            </span>
        );
    }

    const s = status.toUpperCase();
    switch (s) {
        case 'SENT':
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
                    <Check className="w-3 h-3 text-indigo-400" /> Sent
                </span>
            );
        case 'DELIVERED':
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                    <CheckCircle className="w-3 h-3 text-emerald-400" /> Delivered
                </span>
            );
        case 'READ':
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/15 border border-blue-500/30 text-blue-300">
                    <CheckCircle className="w-3 h-3 text-blue-400" /> Read
                </span>
            );
        case 'ACCEPTED':
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                    <Check className="w-3 h-3 text-cyan-400" /> Accepted
                </span>
            );
        case 'PROCESSING':
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/15 border border-purple-500/30 text-purple-300">
                    <Loader2 className="w-3 h-3 animate-spin text-purple-400" /> Processing
                </span>
            );
        case 'PENDING':
        case 'RETRY_PENDING':
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/15 border border-amber-500/30 text-amber-300">
                    <Clock className="w-3 h-3 text-amber-400" /> {s === 'RETRY_PENDING' ? 'Retry Pending' : 'Pending'}
                </span>
            );
        case 'FAILED':
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/15 border border-red-500/30 text-red-300">
                    <XCircle className="w-3 h-3 text-red-400" /> Failed
                </span>
            );
        case 'AMBIGUOUS':
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/15 border border-orange-500/30 text-orange-300">
                    <AlertCircle className="w-3 h-3 text-orange-400" /> Ambiguous
                </span>
            );
        case 'SKIPPED':
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500/15 border border-slate-500/30 text-slate-400">
                    <Check className="w-3 h-3 text-slate-400" /> Skipped — Already Sent
                </span>
            );
        default:
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500/15 border border-slate-500/30 text-slate-300">
                    <Info className="w-3 h-3 text-slate-400" /> {s}
                </span>
            );
    }
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function CompanyAnniversariesManagement() {
    // 4 sections: 'today' | 'upcoming' | 'all-company' | 'history'
    const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'all-company' | 'history'>('today');

    // Data states
    const [todayClients, setTodayClients] = useState<AnniversaryClientDto[]>([]);
    const [upcomingClients, setUpcomingClients] = useState<AnniversaryClientDto[]>([]);
    const [upcomingDays, setUpcomingDays] = useState<number>(7);
    const [historyPage, setHistoryPage] = useState<PageResponse<AnniversaryNotificationLog> | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [allClients, setAllClients] = useState<UserProfile[]>([]);

    // Loading & feedback
    const [loadingToday, setLoadingToday] = useState<boolean>(true);
    const [loadingUpcoming, setLoadingUpcoming] = useState<boolean>(false);
    const [loadingHistory, setLoadingHistory] = useState<boolean>(false);
    const [loadingAllClients, setLoadingAllClients] = useState<boolean>(false);
    const [globalError, setGlobalError] = useState<string>('');
    const [actionSuccess, setActionSuccess] = useState<string>('');

    // Search and filter for All Companies
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filterFormationStatus, setFilterFormationStatus] = useState<'all' | 'configured' | 'missing'>('all');
    const [companyPage, setCompanyPage] = useState<number>(0);
    const pageSize = 10;

    // Edit Formation Date Modal
    const [editModalClient, setEditModalClient] = useState<{
        userId: string;
        companyName?: string;
        contactPersonName?: string;
        phone?: string;
        formationDate?: string;
        anniversaryAutomationEnabled?: boolean;
    } | null>(null);
    const [editFormationDate, setEditFormationDate] = useState<string>('');
    const [editAutomationEnabled, setEditAutomationEnabled] = useState<boolean>(true);
    const [savingSettings, setSavingSettings] = useState<boolean>(false);
    const [settingsError, setSettingsError] = useState<string>('');

    // Toggle loading map for quick switches
    const [togglingMap, setTogglingMap] = useState<Record<string, boolean>>({});

    // ── Data Fetching ────────────────────────────────────────────────────────

    const fetchTodayData = useCallback(async () => {
        setLoadingToday(true);
        setGlobalError('');
        try {
            const data = await getTodayAnniversaryClients();
            setTodayClients(data || []);
        } catch (err: unknown) {
            setGlobalError(err instanceof Error ? err.message : "Failed to load today's anniversaries");
        } finally {
            setLoadingToday(false);
        }
    }, []);

    const fetchUpcomingData = useCallback(async (days: number) => {
        setLoadingUpcoming(true);
        try {
            const data = await getUpcomingAnniversaries(days);
            setUpcomingClients(data || []);
        } catch (err: unknown) {
            console.error('Error fetching upcoming anniversaries:', err);
        } finally {
            setLoadingUpcoming(false);
        }
    }, []);

    const fetchHistoryData = useCallback(async (page: number) => {
        setLoadingHistory(true);
        try {
            const data = await getAnniversaryHistory(page, 15);
            setHistoryPage(data);
        } catch (err: unknown) {
            console.error('Error fetching anniversary history:', err);
        } finally {
            setLoadingHistory(false);
        }
    }, []);

    const fetchAllClientsData = useCallback(async () => {
        setLoadingAllClients(true);
        try {
            const users = await getAllUsers();
            setAllClients(users || []);
        } catch (err: unknown) {
            console.error('Error fetching all clients:', err);
        } finally {
            setLoadingAllClients(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        fetchTodayData();
        fetchUpcomingData(upcomingDays);
        fetchHistoryData(0);
        fetchAllClientsData();
    }, [fetchTodayData, fetchUpcomingData, upcomingDays, fetchHistoryData, fetchAllClientsData]);

    const handleRefreshAll = () => {
        setActionSuccess('');
        setGlobalError('');
        fetchTodayData();
        fetchUpcomingData(upcomingDays);
        fetchHistoryData(currentPage);
        fetchAllClientsData();
    };

    // ── Quick Automation Toggle ──────────────────────────────────────────────

    const handleToggleAutomation = async (userId: string, currentEnabled: boolean, formationDate?: string) => {
        if (!currentEnabled && !formationDate) {
            setGlobalError('Please add a Company Formation Date before enabling automated greetings.');
            return;
        }

        const newStatus = !currentEnabled;
        setTogglingMap(prev => ({ ...prev, [userId]: true }));
        setGlobalError('');

        try {
            await updateClientAnniversarySettings(userId, {
                anniversaryAutomationEnabled: newStatus,
                formationDate: formationDate || undefined,
            });

            setActionSuccess(`Automated anniversary greetings ${newStatus ? 'enabled' : 'disabled'} successfully.`);
            setTimeout(() => setActionSuccess(''), 3500);

            // Update local state
            setAllClients(prev =>
                prev.map(u => (u.userId === userId ? { ...u, anniversaryAutomationEnabled: newStatus } : u))
            );
            setTodayClients(prev =>
                prev.map(c => (c.userId === userId ? { ...c, anniversaryAutomationEnabled: newStatus } : c))
            );
            setUpcomingClients(prev =>
                prev.map(c => (c.userId === userId ? { ...c, anniversaryAutomationEnabled: newStatus } : c))
            );
        } catch (err: unknown) {
            setGlobalError(err instanceof Error ? err.message : 'Failed to update automation status');
        } finally {
            setTogglingMap(prev => ({ ...prev, [userId]: false }));
        }
    };

    // ── Edit Settings Handlers ───────────────────────────────────────────────

    const handleOpenEdit = (client: {
        userId: string;
        companyName?: string;
        contactPersonName?: string;
        phone?: string;
        formationDate?: string;
        anniversaryAutomationEnabled?: boolean;
    }) => {
        setEditModalClient(client);
        setEditFormationDate(client.formationDate || '');
        setEditAutomationEnabled(client.anniversaryAutomationEnabled !== false);
        setSettingsError('');
    };

    const handleSaveClientSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editModalClient) return;

        setSavingSettings(true);
        setSettingsError('');

        try {
            await updateClientAnniversarySettings(editModalClient.userId, {
                formationDate: editFormationDate || undefined,
                anniversaryAutomationEnabled: editAutomationEnabled,
                companyName: editModalClient.companyName,
                contactPersonName: editModalClient.contactPersonName,
            });

            setActionSuccess(`Formation date updated successfully for ${editModalClient.companyName || editModalClient.userId}!`);
            setTimeout(() => setActionSuccess(''), 3500);

            setEditModalClient(null);

            // Refresh data
            fetchTodayData();
            fetchUpcomingData(upcomingDays);
            fetchAllClientsData();
        } catch (err: unknown) {
            setSettingsError(err instanceof Error ? err.message : 'Failed to save formation date');
        } finally {
            setSavingSettings(false);
        }
    };

    // ── All Company Clients Computation ──────────────────────────────────────

    // Filter to companies / firms (excludes pure INDIVIDUAL clients)
    const companyClients = useMemo(() => {
        return allClients.filter(u => u.clientType === 'COMPANY' || (!u.clientType && (u.companyName || u.formationDate)));
    }, [allClients]);

    const filteredCompanyClients = useMemo(() => {
        return companyClients.filter(c => {
            const q = searchQuery.toLowerCase().trim();
            const matchesSearch =
                !q ||
                (c.companyName || '').toLowerCase().includes(q) ||
                (c.contactPersonName || '').toLowerCase().includes(q) ||
                (c.fullName || '').toLowerCase().includes(q) ||
                (c.userId || '').toLowerCase().includes(q) ||
                (c.phone || '').includes(q);

            const matchesStatus =
                filterFormationStatus === 'all'
                    ? true
                    : filterFormationStatus === 'configured'
                    ? !!c.formationDate
                    : !c.formationDate;

            return matchesSearch && matchesStatus;
        });
    }, [companyClients, searchQuery, filterFormationStatus]);

    // Paginated company clients
    const paginatedCompanies = useMemo(() => {
        const start = companyPage * pageSize;
        return filteredCompanyClients.slice(start, start + pageSize);
    }, [filteredCompanyClients, companyPage, pageSize]);

    const totalCompanyPages = Math.ceil(filteredCompanyClients.length / pageSize) || 1;

    // Latest status mapping from history
    const latestStatusMap = useMemo(() => {
        const map: Record<string, string> = {};
        if (historyPage?.content) {
            for (const log of historyPage.content) {
                if (log.clientId && !map[log.clientId]) {
                    map[log.clientId] = log.status;
                }
            }
        }
        return map;
    }, [historyPage]);

    return (
        <div className="space-y-6">
            {/* ── Page Header ──────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-white/[0.08]">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 border border-pink-500/30 text-pink-300 shadow-lg shadow-pink-500/10">
                            <PartyPopper className="w-6 h-6 text-pink-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                                Company Anniversaries
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                    <Sparkles className="w-3 h-3" /> WhatsApp Automated
                                </span>
                            </h1>
                            <p className="text-sm text-slate-400 mt-0.5">
                                Automated annual WhatsApp greetings on company formation anniversaries.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    <Button
                        variant="ghost"
                        onClick={handleRefreshAll}
                        disabled={loadingToday || loadingUpcoming || loadingHistory || loadingAllClients}
                        className="text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.08] text-xs h-9"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loadingToday || loadingUpcoming || loadingHistory || loadingAllClients ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* ── Alerts & Notifications ───────────────────────────────────── */}
            {actionSuccess && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm flex items-center justify-between shadow-lg shadow-emerald-500/5"
                >
                    <div className="flex items-center gap-2.5">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>{actionSuccess}</span>
                    </div>
                    <button onClick={() => setActionSuccess('')} className="text-emerald-400 hover:text-emerald-200">
                        <X className="w-4 h-4" />
                    </button>
                </motion.div>
            )}

            {globalError && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-sm flex items-center justify-between shadow-lg shadow-red-500/5"
                >
                    <div className="flex items-center gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                        <span>{globalError}</span>
                    </div>
                    <button onClick={() => setGlobalError('')} className="text-red-400 hover:text-red-200">
                        <X className="w-4 h-4" />
                    </button>
                </motion.div>
            )}

            {/* ── 4 Navigation Tabs ────────────────────────────────────────── */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] overflow-x-auto">
                <button
                    onClick={() => setActiveTab('today')}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                        activeTab === 'today'
                            ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/20'
                            : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                >
                    <PartyPopper className="w-3.5 h-3.5" />
                    Today&apos;s Anniversaries
                    {todayClients.length > 0 && (
                        <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white">
                            {todayClients.length}
                        </span>
                    )}
                </button>

                <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                        activeTab === 'upcoming'
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-md shadow-blue-500/20'
                            : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                >
                    <Calendar className="w-3.5 h-3.5" />
                    Upcoming Anniversaries
                    {upcomingClients.length > 0 && (
                        <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white">
                            {upcomingClients.length}
                        </span>
                    )}
                </button>

                <button
                    onClick={() => setActiveTab('all-company')}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                        activeTab === 'all-company'
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                            : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                >
                    <Building2 className="w-3.5 h-3.5" />
                    All Company Formation Dates
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/10 text-slate-300">
                        {companyClients.length}
                    </span>
                </button>

                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                        activeTab === 'history'
                            ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/20'
                            : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                >
                    <Clock className="w-3.5 h-3.5" />
                    Greeting History
                </button>
            </div>

            {/* ── SECTION 1: Today's Anniversaries ─────────────────────────── */}
            {activeTab === 'today' && (
                <div className="space-y-4">
                    <Card className="border-white/[0.08] bg-white/[0.03] backdrop-blur-xl">
                        <CardContent className="p-0">
                            {loadingToday ? (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                                    <Loader2 className="w-8 h-8 animate-spin text-pink-400" />
                                    <span className="text-sm">Scanning for today&apos;s anniversaries...</span>
                                </div>
                            ) : todayClients.length === 0 ? (
                                <div className="py-20 px-4 text-center">
                                    <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-3 text-slate-500">
                                        <PartyPopper className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-base font-semibold text-white mb-1">No company anniversaries today</h3>
                                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                                        No registered companies celebrate their formation anniversary on today&apos;s date.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Company / Firm</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact Person</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">WhatsApp Number</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Anniversary</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Delivery Status</th>
                                                <th className="py-3.5 px-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/[0.04]">
                                            {todayClients.map((client) => (
                                                <tr key={client.userId} className="hover:bg-white/[0.02] transition-colors">
                                                    <td className="py-3.5 px-4">
                                                        <div className="font-medium text-white flex items-center gap-2">
                                                            <Building2 className="w-4 h-4 text-pink-400 flex-shrink-0" />
                                                            <span>{client.companyName || client.fullName || client.userId}</span>
                                                        </div>
                                                        <div className="text-[11px] text-slate-400 mt-0.5">@{client.userId}</div>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-slate-300">
                                                        {client.contactPersonName || client.fullName || '—'}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-slate-300 font-mono text-xs">
                                                        {client.phone || '—'}
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-500/15 border border-pink-500/30 text-pink-300">
                                                            <Sparkles className="w-3 h-3 text-pink-400" />
                                                            {getOrdinalSuffix(client.yearsCompleted || 1)} Anniversary
                                                        </span>
                                                        {client.formationDate && (
                                                            <div className="text-[11px] text-slate-400 mt-1">
                                                                Formed: {formatDate(client.formationDate)}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <StatusBadge status={client.latestNotificationStatus} />
                                                    </td>
                                                    <td className="py-3.5 px-4 text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleOpenEdit({
                                                                userId: client.userId,
                                                                companyName: client.companyName,
                                                                contactPersonName: client.contactPersonName,
                                                                formationDate: client.formationDate,
                                                                anniversaryAutomationEnabled: client.anniversaryAutomationEnabled,
                                                            })}
                                                            className="text-slate-400 hover:text-white hover:bg-white/[0.06] text-xs h-8 px-2.5"
                                                        >
                                                            <Edit className="w-3.5 h-3.5 mr-1" /> Edit
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ── SECTION 2: Upcoming Anniversaries ────────────────────────── */}
            {activeTab === 'upcoming' && (
                <div className="space-y-4">
                    {/* Days selector toolbar */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">Time window:</span>
                            {[7, 14, 30].map((d) => (
                                <button
                                    key={d}
                                    onClick={() => {
                                        setUpcomingDays(d);
                                        fetchUpcomingData(d);
                                    }}
                                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                                        upcomingDays === d
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06]'
                                    }`}
                                >
                                    Next {d} Days
                                </button>
                            ))}
                        </div>
                    </div>

                    <Card className="border-white/[0.08] bg-white/[0.03] backdrop-blur-xl">
                        <CardContent className="p-0">
                            {loadingUpcoming ? (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                                    <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                                    <span className="text-sm">Loading upcoming formation dates...</span>
                                </div>
                            ) : upcomingClients.length === 0 ? (
                                <div className="py-20 px-4 text-center">
                                    <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-3 text-slate-500">
                                        <Calendar className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-base font-semibold text-white mb-1">No upcoming anniversaries</h3>
                                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                                        No companies have formation dates coming up in the next {upcomingDays} days.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Company / Firm</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact Person</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">WhatsApp Number</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Formation Date</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Timing</th>
                                                <th className="py-3.5 px-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/[0.04]">
                                            {upcomingClients.map((client) => {
                                                const daysRemaining = calculateDaysRemaining(client.formationDate);
                                                return (
                                                    <tr key={client.userId} className="hover:bg-white/[0.02] transition-colors">
                                                        <td className="py-3.5 px-4">
                                                            <div className="font-medium text-white flex items-center gap-2">
                                                                <Building2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                                                <span>{client.companyName || client.fullName || client.userId}</span>
                                                            </div>
                                                            <div className="text-[11px] text-slate-400 mt-0.5">@{client.userId}</div>
                                                        </td>
                                                        <td className="py-3.5 px-4 text-slate-300">
                                                            {client.contactPersonName || client.fullName || '—'}
                                                        </td>
                                                        <td className="py-3.5 px-4 text-slate-300 font-mono text-xs">
                                                            {client.phone || '—'}
                                                        </td>
                                                        <td className="py-3.5 px-4 text-slate-300">
                                                            {formatDate(client.formationDate)}
                                                        </td>
                                                        <td className="py-3.5 px-4">
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/15 border border-blue-500/30 text-blue-300">
                                                                <Clock className="w-3 h-3 text-blue-400" />
                                                                {daysRemaining === 1 ? 'Tomorrow' : `In ${daysRemaining} days`}
                                                            </span>
                                                        </td>
                                                        <td className="py-3.5 px-4 text-right">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleOpenEdit({
                                                                    userId: client.userId,
                                                                    companyName: client.companyName,
                                                                    contactPersonName: client.contactPersonName,
                                                                    formationDate: client.formationDate,
                                                                    anniversaryAutomationEnabled: client.anniversaryAutomationEnabled,
                                                                })}
                                                                className="text-slate-400 hover:text-white hover:bg-white/[0.06] text-xs h-8 px-2.5"
                                                            >
                                                                <Edit className="w-3.5 h-3.5 mr-1" /> Edit
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ── SECTION 3: All Company Formation Dates ───────────────────── */}
            {activeTab === 'all-company' && (
                <div className="space-y-4">
                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <Input
                                placeholder="Search company name, contact, phone, ID..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCompanyPage(0);
                                }}
                                className="pl-9 bg-white/[0.04] border-white/[0.08] text-white text-xs h-9"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <Filter className="w-3.5 h-3.5 text-slate-400" />
                            <select
                                value={filterFormationStatus}
                                onChange={(e) => {
                                    setFilterFormationStatus(e.target.value as 'all' | 'configured' | 'missing');
                                    setCompanyPage(0);
                                }}
                                className="bg-[#0e1628] border border-white/[0.08] text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500/50"
                            >
                                <option value="all">All Dates ({companyClients.length})</option>
                                <option value="configured">Date Added ({companyClients.filter(c => c.formationDate).length})</option>
                                <option value="missing">Date Not Added ({companyClients.filter(c => !c.formationDate).length})</option>
                            </select>
                        </div>
                    </div>

                    <Card className="border-white/[0.08] bg-white/[0.03] backdrop-blur-xl">
                        <CardContent className="p-0">
                            {loadingAllClients ? (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                                    <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                                    <span className="text-sm">Loading all company clients...</span>
                                </div>
                            ) : filteredCompanyClients.length === 0 ? (
                                <div className="py-20 px-4 text-center">
                                    <h3 className="text-base font-semibold text-white mb-1">No company clients found</h3>
                                    <p className="text-xs text-slate-400">Try adjusting your search query or filter.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Company / Firm Name</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact Person</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">WhatsApp Number</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Formation Date</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Automation Status</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Last Greeting Status</th>
                                                <th className="py-3.5 px-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Edit</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/[0.04]">
                                            {paginatedCompanies.map((c) => {
                                                const isToggling = !!togglingMap[c.userId];
                                                const lastStatus = latestStatusMap[c.userId];

                                                return (
                                                    <tr key={c.userId} className="hover:bg-white/[0.02] transition-colors">
                                                        {/* Company Name */}
                                                        <td className="py-3.5 px-4">
                                                            <div className="font-medium text-white flex items-center gap-2">
                                                                <Building2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                                                                <span>{c.companyName || c.fullName || c.userId}</span>
                                                            </div>
                                                            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                                                                <span>@{c.userId}</span>
                                                                {c.email && <span>• {c.email}</span>}
                                                            </div>
                                                        </td>

                                                        {/* Contact Person */}
                                                        <td className="py-3.5 px-4 text-slate-300">
                                                            {c.contactPersonName || c.fullName || '—'}
                                                        </td>

                                                        {/* WhatsApp Number */}
                                                        <td className="py-3.5 px-4 text-slate-300 font-mono text-xs">
                                                            {c.phone || '—'}
                                                        </td>

                                                        {/* Formation Date */}
                                                        <td className="py-3.5 px-4">
                                                            {c.formationDate ? (
                                                                <span className="text-xs text-slate-200 font-medium">
                                                                    {formatDate(c.formationDate)}
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-medium bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                                                                    Date not added
                                                                    <button
                                                                        onClick={() => handleOpenEdit({
                                                                            userId: c.userId,
                                                                            companyName: c.companyName,
                                                                            contactPersonName: c.contactPersonName,
                                                                            formationDate: c.formationDate,
                                                                            anniversaryAutomationEnabled: c.anniversaryAutomationEnabled,
                                                                        })}
                                                                        className="underline text-cyan-400 hover:text-cyan-300 ml-1 font-semibold"
                                                                    >
                                                                        Add
                                                                    </button>
                                                                </span>
                                                            )}
                                                        </td>

                                                        {/* Automation Status */}
                                                        <td className="py-3.5 px-4">
                                                            <button
                                                                onClick={() => handleToggleAutomation(c.userId, !!c.anniversaryAutomationEnabled, c.formationDate)}
                                                                disabled={isToggling}
                                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                                                                    c.anniversaryAutomationEnabled
                                                                        ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25'
                                                                        : 'bg-slate-500/15 border border-slate-500/30 text-slate-400 hover:bg-slate-500/25'
                                                                }`}
                                                                title="Click to toggle automation"
                                                            >
                                                                {isToggling ? (
                                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                                ) : c.anniversaryAutomationEnabled ? (
                                                                    <Check className="w-3 h-3 text-emerald-400" />
                                                                ) : (
                                                                    <X className="w-3 h-3 text-slate-400" />
                                                                )}
                                                                {c.anniversaryAutomationEnabled ? 'Enabled' : 'Disabled'}
                                                            </button>
                                                        </td>

                                                        {/* Last Greeting Status */}
                                                        <td className="py-3.5 px-4">
                                                            <StatusBadge status={lastStatus} />
                                                        </td>

                                                        {/* Edit Action */}
                                                        <td className="py-3.5 px-4 text-right">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleOpenEdit({
                                                                    userId: c.userId,
                                                                    companyName: c.companyName,
                                                                    contactPersonName: c.contactPersonName,
                                                                    formationDate: c.formationDate,
                                                                    anniversaryAutomationEnabled: c.anniversaryAutomationEnabled,
                                                                })}
                                                                className="text-slate-400 hover:text-white hover:bg-white/[0.06] text-xs h-8 px-2.5"
                                                            >
                                                                <Edit className="w-3.5 h-3.5 mr-1 text-cyan-400" /> Edit
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Pagination */}
                            {totalCompanyPages > 1 && (
                                <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.08] bg-white/[0.01]">
                                    <div className="text-xs text-slate-400">
                                        Showing <strong className="text-white">{companyPage * pageSize + 1}</strong> to{' '}
                                        <strong className="text-white">
                                            {Math.min((companyPage + 1) * pageSize, filteredCompanyClients.length)}
                                        </strong>{' '}
                                        of <strong className="text-white">{filteredCompanyClients.length}</strong> companies
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            disabled={companyPage === 0}
                                            onClick={() => setCompanyPage(p => Math.max(0, p - 1))}
                                            className="h-8 px-2.5 text-xs text-slate-300 hover:text-white"
                                        >
                                            <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Previous
                                        </Button>
                                        <span className="text-xs text-slate-400">
                                            Page {companyPage + 1} of {totalCompanyPages}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            disabled={companyPage >= totalCompanyPages - 1}
                                            onClick={() => setCompanyPage(p => p + 1)}
                                            className="h-8 px-2.5 text-xs text-slate-300 hover:text-white"
                                        >
                                            Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ── SECTION 4: Greeting History ──────────────────────────────── */}
            {activeTab === 'history' && (
                <div className="space-y-4">
                    <Card className="border-white/[0.08] bg-white/[0.03] backdrop-blur-xl">
                        <CardContent className="p-0">
                            {loadingHistory ? (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                                    <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                                    <span className="text-sm">Loading greeting history...</span>
                                </div>
                            ) : !historyPage || historyPage.content.length === 0 ? (
                                <div className="py-20 px-4 text-center">
                                    <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-3 text-slate-500">
                                        <Clock className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-base font-semibold text-white mb-1">No greeting history recorded</h3>
                                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                                        When automated anniversary greetings are delivered via WhatsApp, audit logs will appear here.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Company</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Recipient</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Anniversary</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Timestamp</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/[0.04]">
                                            {historyPage.content.map((log) => (
                                                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                                                    <td className="py-3.5 px-4">
                                                        <div className="font-medium text-white">{log.companyName}</div>
                                                        <div className="text-[11px] text-slate-400 mt-0.5">@{log.clientId}</div>
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <div className="text-xs text-slate-200">{log.contactPersonName}</div>
                                                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">{log.recipientPhone}</div>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-slate-300">
                                                        {getOrdinalSuffix(log.anniversaryYear)} Year ({formatDate(log.anniversaryDate)})
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <StatusBadge status={log.status} />
                                                    </td>
                                                    <td className="py-3.5 px-4 text-slate-400 text-xs">
                                                        {formatDateTime(log.createdAt || log.lastAttemptAt)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* History Pagination */}
                            {historyPage && historyPage.totalPages > 1 && (
                                <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.08] bg-white/[0.01]">
                                    <div className="text-xs text-slate-400">
                                        Page <strong className="text-white">{historyPage.number + 1}</strong> of <strong className="text-white">{historyPage.totalPages}</strong> ({historyPage.totalElements} records)
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            disabled={historyPage.first}
                                            onClick={() => {
                                                const p = Math.max(0, currentPage - 1);
                                                setCurrentPage(p);
                                                fetchHistoryData(p);
                                            }}
                                            className="h-8 px-2.5 text-xs text-slate-300 hover:text-white"
                                        >
                                            <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Previous
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            disabled={historyPage.last}
                                            onClick={() => {
                                                const p = currentPage + 1;
                                                setCurrentPage(p);
                                                fetchHistoryData(p);
                                            }}
                                            className="h-8 px-2.5 text-xs text-slate-300 hover:text-white"
                                        >
                                            Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ── MODAL: Edit Company Formation Date ────────────────────────── */}
            <AnimatePresence>
                {editModalClient && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md bg-[#0e1628] border border-white/[0.12] rounded-2xl shadow-2xl p-6"
                        >
                            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-white">Edit Formation Date</h3>
                                        <p className="text-xs text-slate-400">{editModalClient.companyName || editModalClient.userId}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setEditModalClient(null)}
                                    className="text-slate-400 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveClientSettings} className="space-y-4 mt-4">
                                {settingsError && (
                                    <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                        <span>{settingsError}</span>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                        Company Formation Date
                                    </label>
                                    <Input
                                        type="date"
                                        value={editFormationDate}
                                        onChange={(e) => setEditFormationDate(e.target.value)}
                                        className="bg-white/[0.04] border-white/[0.08] text-white text-xs h-10 focus:border-cyan-500/50"
                                    />
                                    <p className="text-[11px] text-slate-400 mt-1">
                                        The company will receive an automated WhatsApp greeting on the anniversary of this date.
                                    </p>
                                </div>

                                <div className="pt-2">
                                    <label className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] cursor-pointer hover:bg-white/[0.05] transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={editAutomationEnabled}
                                            onChange={(e) => setEditAutomationEnabled(e.target.checked)}
                                            className="mt-0.5 rounded border-white/20 bg-white/10 text-cyan-500 focus:ring-0"
                                        />
                                        <div>
                                            <div className="text-xs font-semibold text-white">
                                                Enable automated WhatsApp anniversary greetings
                                            </div>
                                            <p className="text-[11px] text-slate-400 mt-0.5">
                                                Automatically send greetings on the company formation anniversary.
                                            </p>
                                        </div>
                                    </label>
                                </div>

                                <div className="flex gap-2 justify-end pt-3 border-t border-white/[0.08]">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setEditModalClient(null)}
                                        className="text-slate-400 hover:text-white text-xs h-9"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={savingSettings}
                                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs h-9 px-4 font-medium"
                                    >
                                        {savingSettings ? (
                                            <>
                                                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            'Save Formation Date'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
