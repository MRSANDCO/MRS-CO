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
    Loader2,
    PartyPopper,
    AlertTriangle,
    Plus,
    Trash2,
    Edit,
    Cake,
    Crown,
    Search,
    Filter,
    ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
    getEligibleCompanies,
    getAllFounders,
    createFounder,
    getFoundersByCompany,
    updateFounder,
    setFounderBirthdayGreeting,
    deleteFounder,
    getTodayBirthdayFounders,
    getUpcomingBirthdayFounders,
    getBirthdayNotificationHistory,
    type Founder,
    type FounderRequest,
    type AnniversaryNotificationLog,
    type CompanyDropdownDto,
} from '@/lib/api';

export interface FounderWithCompany extends Founder {
    companyName?: string;
}

// ─── Date-Only Helpers (Zero Timezone Shift) ──────────────────────────────────

function parseIsoDateParts(isoString?: string): { year: number; month: number; day: number } | null {
    if (!isoString) return null;
    const match = isoString.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return null;
    return {
        year: parseInt(match[1], 10),
        month: parseInt(match[2], 10),
        day: parseInt(match[3], 10),
    };
}

function formatDateOnly(dateStr?: string): string {
    const parts = parseIsoDateParts(dateStr);
    if (!parts) return dateStr || '—';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = months[parts.month - 1] || `${parts.month}`;
    return `${parts.day} ${monthName} ${parts.year}`;
}

function calculateAge(dateOfBirth?: string, targetYear?: number): number | null {
    const parts = parseIsoDateParts(dateOfBirth);
    if (!parts) return null;
    const currentYear = targetYear || new Date().getFullYear();
    const age = currentYear - parts.year;
    return age >= 0 ? age : null;
}

function calculateDaysUntilBirthday(month: number, day: number): number {
    const now = new Date();
    const currentYear = now.getFullYear();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let nextBirthday = new Date(currentYear, month - 1, day);
    if (nextBirthday.getTime() < today.getTime()) {
        nextBirthday = new Date(currentYear + 1, month - 1, day);
    }
    const diffMs = nextBirthday.getTime() - today.getTime();
    return Math.round(diffMs / (1000 * 60 * 60 * 24));
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

// ─── Status Badge Component ──────────────────────────────────────────────────

function StatusBadge({ status }: { status?: string }) {
    if (!status) {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500/10 border border-slate-500/20 text-slate-400">
                <Clock className="w-3 h-3" /> None
            </span>
        );
    }

    const s = status.toUpperCase();
    switch (s) {
        case 'SENT':
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
                    <Check className="w-3 h-3 text-indigo-400" /> Sent
                </span>
            );
        case 'DELIVERED':
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                    <CheckCircle className="w-3 h-3 text-emerald-400" /> Delivered
                </span>
            );
        case 'READ':
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 border border-blue-500/30 text-blue-300">
                    <CheckCircle className="w-3 h-3 text-blue-400" /> Read
                </span>
            );
        case 'ACCEPTED':
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                    <Check className="w-3 h-3 text-cyan-400" /> Accepted
                </span>
            );
        case 'PROCESSING':
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/15 border border-purple-500/30 text-purple-300">
                    <Loader2 className="w-3 h-3 animate-spin text-purple-400" /> Processing
                </span>
            );
        case 'PENDING':
        case 'RETRY_PENDING':
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                    <Clock className="w-3 h-3 text-amber-400" /> {s === 'RETRY_PENDING' ? 'Retry Pending' : 'Pending'}
                </span>
            );
        case 'FAILED':
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/15 border border-red-500/30 text-red-300">
                    <XCircle className="w-3 h-3 text-red-400" /> Failed
                </span>
            );
        default:
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/15 border border-slate-500/30 text-slate-300">
                    {s}
                </span>
            );
    }
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function FounderManagement() {
    // 4 sections: 'today' | 'upcoming' | 'all-founders' | 'history'
    const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'all-founders' | 'history'>('today');

    // Data states
    const [companies, setCompanies] = useState<CompanyDropdownDto[]>([]);
    const [allFounders, setAllFounders] = useState<FounderWithCompany[]>([]);
    const [todayBirthdays, setTodayBirthdays] = useState<Founder[]>([]);
    const [upcomingBirthdays, setUpcomingBirthdays] = useState<Founder[]>([]);
    const [upcomingDays, setUpcomingDays] = useState(7);
    const [historyLogs, setHistoryLogs] = useState<AnniversaryNotificationLog[]>([]);
    const [historyPage, setHistoryPage] = useState(0);

    // Loaders & feedback
    const [loadingCompanies, setLoadingCompanies] = useState(false);
    const [companiesError, setCompaniesError] = useState<string | null>(null);
    const [loadingFounders, setLoadingFounders] = useState(false);
    const [loadingToday, setLoadingToday] = useState(false);
    const [loadingUpcoming, setLoadingUpcoming] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Search and pagination for all-founders
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCompanyFilter, setSelectedCompanyFilter] = useState('ALL');
    const [page, setPage] = useState(0);
    const pageSize = 10;

    // Create / Edit Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingFounder, setEditingFounder] = useState<Founder | null>(null);
    const [formData, setFormData] = useState<{
        companyClientId: string;
        fullName: string;
        dateOfBirth: string;
        whatsappNumber: string;
        birthdayGreetingEnabled: boolean;
    }>({
        companyClientId: '',
        fullName: '',
        dateOfBirth: '',
        whatsappNumber: '',
        birthdayGreetingEnabled: true,
    });
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    // Delete modal
    const [founderToDelete, setFounderToDelete] = useState<FounderWithCompany | null>(null);
    const [deletingFounder, setDeletingFounder] = useState(false);

    // Toggle loading map
    const [togglingMap, setTogglingMap] = useState<Record<string, boolean>>({});

    // ─── Fetch Companies & Founders ──────────────────────────────────────────

    const fetchCompanies = useCallback(async () => {
        setLoadingCompanies(true);
        setCompaniesError(null);
        try {
            const list = await getEligibleCompanies();
            setCompanies(list || []);
        } catch (err: unknown) {
            setCompaniesError(err instanceof Error ? err.message : 'Failed to load companies');
        } finally {
            setLoadingCompanies(false);
        }
    }, []);

    const fetchAllData = useCallback(async () => {
        setLoadingFounders(true);
        setErrorMessage(null);

        try {
            // Use the single GET /api/admin/founders endpoint to retrieve all founders at once
            const founders = await getAllFounders();
            // Attach company names from already-loaded companies list (or companyClientId fallback)
            setAllFounders(
                founders.map((f) => ({
                    ...f,
                    companyName: undefined, // will be resolved via companyMap
                }))
            );
        } catch (err: unknown) {
            setErrorMessage(err instanceof Error ? err.message : 'Failed to fetch founders');
        } finally {
            setLoadingFounders(false);
        }
    }, []);

    const fetchToday = useCallback(async () => {
        setLoadingToday(true);
        try {
            const list = await getTodayBirthdayFounders();
            setTodayBirthdays(list || []);
        } catch (err: unknown) {
            console.error("Error fetching today's birthdays:", err);
        } finally {
            setLoadingToday(false);
        }
    }, []);

    const fetchUpcoming = useCallback(async (days: number) => {
        setLoadingUpcoming(true);
        try {
            const list = await getUpcomingBirthdayFounders(days);
            setUpcomingBirthdays(list || []);
        } catch (err: unknown) {
            console.error('Error fetching upcoming birthdays:', err);
        } finally {
            setLoadingUpcoming(false);
        }
    }, []);

    const fetchHistory = useCallback(async (p: number) => {
        setLoadingHistory(true);
        try {
            const res = await getBirthdayNotificationHistory(p, 15) as unknown as AnniversaryNotificationLog[] | { content?: AnniversaryNotificationLog[] };
            if (Array.isArray(res)) {
                setHistoryLogs(res);
            } else if (res && Array.isArray(res.content)) {
                setHistoryLogs(res.content);
            } else {
                setHistoryLogs([]);
            }
        } catch (err: unknown) {
            console.error('Error fetching birthday history:', err);
        } finally {
            setLoadingHistory(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        fetchCompanies();
        fetchAllData();
        fetchToday();
        fetchUpcoming(upcomingDays);
        fetchHistory(0);
    }, [fetchCompanies, fetchAllData, fetchToday, fetchUpcoming, upcomingDays, fetchHistory]);

    const handleRefresh = () => {
        setSuccessMessage(null);
        setErrorMessage(null);
        fetchCompanies();
        fetchAllData();
        fetchToday();
        fetchUpcoming(upcomingDays);
        fetchHistory(historyPage);
    };

    // ─── Company Map for fast lookup ─────────────────────────────────────────

    const companyMap = useMemo(() => {
        const map: Record<string, string> = {};
        for (const c of companies) {
            const id = c.userId || c.companyId;
            const name = c.companyName || c.fullName || id;
            if (id) map[id] = name;
        }
        return map;
    }, [companies]);

    // ─── Latest Status Mapping ───────────────────────────────────────────────

    const latestStatusMap = useMemo(() => {
        const map: Record<string, string> = {};
        for (const log of historyLogs) {
            if (log.recipientPhone && !map[log.recipientPhone]) {
                map[log.recipientPhone] = log.status;
            }
        }
        return map;
    }, [historyLogs]);

    // ─── Quick Automation Toggle ─────────────────────────────────────────────

    const handleToggleGreeting = async (founder: Founder, nextVal: boolean) => {
        setTogglingMap((prev) => ({ ...prev, [founder.id]: true }));
        try {
            await setFounderBirthdayGreeting(founder.id, nextVal);
            setSuccessMessage(`Birthday greeting ${nextVal ? 'enabled' : 'disabled'} for ${founder.fullName}.`);
            setTimeout(() => setSuccessMessage(null), 3500);

            // In-place updates
            setAllFounders((prev) =>
                prev.map((f) => (f.id === founder.id ? { ...f, birthdayGreetingEnabled: nextVal } : f))
            );
            setTodayBirthdays((prev) =>
                prev.map((f) => (f.id === founder.id ? { ...f, birthdayGreetingEnabled: nextVal } : f))
            );
            setUpcomingBirthdays((prev) =>
                prev.map((f) => (f.id === founder.id ? { ...f, birthdayGreetingEnabled: nextVal } : f))
            );
        } catch (err: unknown) {
            setErrorMessage(err instanceof Error ? err.message : 'Failed to update greeting preference');
        } finally {
            setTogglingMap((prev) => ({ ...prev, [founder.id]: false }));
        }
    };

    // ─── Create & Edit Modals ────────────────────────────────────────────────

    const openCreateModal = () => {
        setFormError(null);
        setFormData({
            companyClientId: '',  // force user to explicitly select
            fullName: '',
            dateOfBirth: '',
            whatsappNumber: '',
            birthdayGreetingEnabled: true,
        });
        // Refresh companies when opening modal to ensure dropdown is fresh
        if (companies.length === 0 && !loadingCompanies) {
            fetchCompanies();
        }
        setIsCreateModalOpen(true);
    };

    const openEditModal = (founder: Founder) => {
        setFormError(null);
        setEditingFounder(founder);
        setFormData({
            companyClientId: founder.companyClientId,
            fullName: founder.fullName,
            dateOfBirth: founder.dateOfBirth,
            whatsappNumber: founder.whatsappNumber,
            birthdayGreetingEnabled: founder.birthdayGreetingEnabled,
        });
        setIsEditModalOpen(true);
    };

    const handleCreateFounder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.companyClientId) {
            setFormError('Please select an associated company.');
            return;
        }
        if (!formData.fullName.trim()) {
            setFormError("Founder's full name is required.");
            return;
        }
        if (!formData.dateOfBirth) {
            setFormError('Date of birth is required.');
            return;
        }
        if (!formData.whatsappNumber.trim()) {
            setFormError('WhatsApp number is required.');
            return;
        }

        setFormSubmitting(true);
        setFormError(null);

        try {
            const req: FounderRequest = {
                companyClientId: formData.companyClientId,
                fullName: formData.fullName.trim(),
                dateOfBirth: formData.dateOfBirth,
                whatsappNumber: formData.whatsappNumber.trim(),
                active: true,
                birthdayGreetingEnabled: formData.birthdayGreetingEnabled,
            };

            const res = await createFounder(req);
            setSuccessMessage(`Founder '${res.founder.fullName}' added successfully!`);
            setTimeout(() => setSuccessMessage(null), 3500);

            setIsCreateModalOpen(false);
            fetchAllData();
            fetchToday();
            fetchUpcoming(upcomingDays);
        } catch (err: unknown) {
            setFormError(err instanceof Error ? err.message : 'Failed to create founder');
        } finally {
            setFormSubmitting(false);
        }
    };

    const handleUpdateFounder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingFounder) return;
        if (!formData.fullName.trim()) {
            setFormError("Founder's full name is required.");
            return;
        }
        if (!formData.dateOfBirth) {
            setFormError('Date of birth is required.');
            return;
        }

        setFormSubmitting(true);
        setFormError(null);

        try {
            const req: FounderRequest = {
                fullName: formData.fullName.trim(),
                dateOfBirth: formData.dateOfBirth,
                whatsappNumber: formData.whatsappNumber.trim(),
                active: true,
                birthdayGreetingEnabled: formData.birthdayGreetingEnabled,
            };

            const res = await updateFounder(editingFounder.id, req);
            setSuccessMessage(`Founder '${res.founder.fullName}' updated successfully!`);
            setTimeout(() => setSuccessMessage(null), 3500);

            setIsEditModalOpen(false);
            setEditingFounder(null);
            fetchAllData();
            fetchToday();
            fetchUpcoming(upcomingDays);
        } catch (err: unknown) {
            setFormError(err instanceof Error ? err.message : 'Failed to update founder');
        } finally {
            setFormSubmitting(false);
        }
    };

    const handleDeleteFounder = async () => {
        if (!founderToDelete) return;
        setDeletingFounder(true);
        try {
            await deleteFounder(founderToDelete.id);
            setSuccessMessage(`Founder '${founderToDelete.fullName}' deleted.`);
            setTimeout(() => setSuccessMessage(null), 3500);
            setFounderToDelete(null);
            fetchAllData();
            fetchToday();
            fetchUpcoming(upcomingDays);
        } catch (err: unknown) {
            setErrorMessage(err instanceof Error ? err.message : 'Failed to delete founder');
        } finally {
            setDeletingFounder(false);
        }
    };

    // ─── Filtered All Founders ───────────────────────────────────────────────

    const filteredFounders = useMemo(() => {
        return allFounders.filter((f) => {
            const q = searchQuery.toLowerCase().trim();
            const matchesSearch =
                !q ||
                f.fullName.toLowerCase().includes(q) ||
                (f.companyName || '').toLowerCase().includes(q) ||
                f.companyClientId.toLowerCase().includes(q) ||
                f.whatsappNumber.includes(q);

            const matchesCompany =
                selectedCompanyFilter === 'ALL' || f.companyClientId === selectedCompanyFilter;

            return matchesSearch && matchesCompany;
        });
    }, [allFounders, searchQuery, selectedCompanyFilter]);

    const paginatedFounders = useMemo(() => {
        const start = page * pageSize;
        return filteredFounders.slice(start, start + pageSize);
    }, [filteredFounders, page, pageSize]);

    const totalPages = Math.ceil(filteredFounders.length / pageSize) || 1;

    return (
        <div className="space-y-6">
            {/* ── Page Header ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-yellow-500/20 border border-amber-500/30 text-amber-300 shadow-lg shadow-amber-500/10">
                            <Crown className="w-6 h-6 text-amber-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                                Founder Birthday Management
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                    <Sparkles className="w-3 h-3" /> WhatsApp Automated
                                </span>
                            </h1>
                            <p className="text-sm text-slate-400 mt-0.5">
                                Automated WhatsApp birthday greetings to company founders on their birthdays.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    <Button
                        onClick={openCreateModal}
                        className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-medium text-xs h-9 px-3.5 shadow-lg shadow-amber-500/20"
                    >
                        <Plus className="w-3.5 h-3.5 mr-1.5" />
                        Add Founder
                    </Button>

                    <Button
                        variant="ghost"
                        onClick={handleRefresh}
                        disabled={loadingFounders || loadingToday || loadingUpcoming || loadingHistory}
                        className="text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.08] text-xs h-9"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loadingFounders || loadingToday || loadingUpcoming ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* ── Alerts ── */}
            {successMessage && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm flex items-center justify-between shadow-lg shadow-emerald-500/5"
                >
                    <div className="flex items-center gap-2.5">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>{successMessage}</span>
                    </div>
                    <button onClick={() => setSuccessMessage(null)} className="text-emerald-400 hover:text-emerald-200">
                        <X className="w-4 h-4" />
                    </button>
                </motion.div>
            )}

            {errorMessage && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-sm flex items-center justify-between shadow-lg shadow-red-500/5"
                >
                    <div className="flex items-center gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                        <span>{errorMessage}</span>
                    </div>
                    <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-red-200">
                        <X className="w-4 h-4" />
                    </button>
                </motion.div>
            )}

            {/* ── 4 Navigation Tabs ── */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] overflow-x-auto">
                <button
                    onClick={() => setActiveTab('today')}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                        activeTab === 'today'
                            ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20'
                            : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                >
                    <Cake className="w-3.5 h-3.5" />
                    Today&apos;s Birthdays
                    {todayBirthdays.length > 0 && (
                        <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white">
                            {todayBirthdays.length}
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
                    Upcoming Birthdays
                    {upcomingBirthdays.length > 0 && (
                        <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white">
                            {upcomingBirthdays.length}
                        </span>
                    )}
                </button>

                <button
                    onClick={() => setActiveTab('all-founders')}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                        activeTab === 'all-founders'
                            ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/20'
                            : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                >
                    <Crown className="w-3.5 h-3.5" />
                    All Founder Birthday Dates
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/10 text-slate-300">
                        {allFounders.length}
                    </span>
                </button>

                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                        activeTab === 'history'
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                            : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                >
                    <Clock className="w-3.5 h-3.5" />
                    Greeting History
                </button>
            </div>

            {/* ── SECTION 1: Today's Birthdays ── */}
            {activeTab === 'today' && (
                <div className="space-y-4">
                    <Card className="border-white/[0.08] bg-white/[0.03] backdrop-blur-xl">
                        <CardContent className="p-0">
                            {loadingToday ? (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                                    <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
                                    <span className="text-sm">Scanning for today&apos;s birthdays...</span>
                                </div>
                            ) : todayBirthdays.length === 0 ? (
                                <div className="py-20 px-4 text-center">
                                    <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-3 text-slate-500">
                                        <Cake className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-base font-semibold text-white mb-1">No founder birthdays today</h3>
                                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                                        No founders celebrate their birthday on today&apos;s date.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Founder Name</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Associated Company</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">WhatsApp Number</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Age Turning</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Automation</th>
                                                <th className="py-3.5 px-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/[0.04]">
                                            {todayBirthdays.map((founder) => {
                                                const age = calculateAge(founder.dateOfBirth);
                                                return (
                                                    <tr key={founder.id} className="hover:bg-white/[0.02] transition-colors">
                                                        <td className="py-3.5 px-4">
                                                            <div className="font-medium text-white flex items-center gap-2">
                                                                <Cake className="w-4 h-4 text-amber-400 flex-shrink-0" />
                                                                <span>{founder.fullName}</span>
                                                            </div>
                                                            <div className="text-[11px] text-slate-400 mt-0.5">
                                                                DOB: {formatDateOnly(founder.dateOfBirth)}
                                                            </div>
                                                        </td>
                                                        <td className="py-3.5 px-4 text-slate-300">
                                                            <div className="flex items-center gap-1.5">
                                                                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                                                                <span>{companyMap[founder.companyClientId] || founder.companyClientId}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3.5 px-4 text-slate-300 font-mono text-xs">
                                                            {founder.whatsappNumber}
                                                        </td>
                                                        <td className="py-3.5 px-4">
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                                                                <Sparkles className="w-3 h-3 text-amber-400" />
                                                                {age !== null ? `Turning ${age}` : 'Today'}
                                                            </span>
                                                        </td>
                                                        <td className="py-3.5 px-4">
                                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                founder.birthdayGreetingEnabled
                                                                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                                                                    : 'bg-slate-500/15 border border-slate-500/30 text-slate-400'
                                                            }`}>
                                                                {founder.birthdayGreetingEnabled ? 'Active' : 'Disabled'}
                                                            </span>
                                                        </td>
                                                        <td className="py-3.5 px-4 text-right">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => openEditModal(founder)}
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

            {/* ── SECTION 2: Upcoming Birthdays ── */}
            {activeTab === 'upcoming' && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Time window:</span>
                        {[7, 14, 30].map((d) => (
                            <button
                                key={d}
                                onClick={() => {
                                    setUpcomingDays(d);
                                    fetchUpcoming(d);
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

                    <Card className="border-white/[0.08] bg-white/[0.03] backdrop-blur-xl">
                        <CardContent className="p-0">
                            {loadingUpcoming ? (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                                    <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                                    <span className="text-sm">Loading upcoming birthdays...</span>
                                </div>
                            ) : upcomingBirthdays.length === 0 ? (
                                <div className="py-20 px-4 text-center">
                                    <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-3 text-slate-500">
                                        <Calendar className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-base font-semibold text-white mb-1">No upcoming birthdays</h3>
                                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                                        No founders have birthdays in the next {upcomingDays} days.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Founder Name</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Associated Company</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">WhatsApp Number</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Date of Birth</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Timing</th>
                                                <th className="py-3.5 px-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/[0.04]">
                                            {upcomingBirthdays.map((founder) => {
                                                const daysUntil = calculateDaysUntilBirthday(founder.birthdayMonth, founder.birthdayDay);
                                                return (
                                                    <tr key={founder.id} className="hover:bg-white/[0.02] transition-colors">
                                                        <td className="py-3.5 px-4">
                                                            <div className="font-medium text-white flex items-center gap-2">
                                                                <Cake className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                                                <span>{founder.fullName}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3.5 px-4 text-slate-300">
                                                            {companyMap[founder.companyClientId] || founder.companyClientId}
                                                        </td>
                                                        <td className="py-3.5 px-4 text-slate-300 font-mono text-xs">
                                                            {founder.whatsappNumber}
                                                        </td>
                                                        <td className="py-3.5 px-4 text-slate-300">
                                                            {formatDateOnly(founder.dateOfBirth)}
                                                        </td>
                                                        <td className="py-3.5 px-4">
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/15 border border-blue-500/30 text-blue-300">
                                                                <Clock className="w-3 h-3 text-blue-400" />
                                                                {daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`}
                                                            </span>
                                                        </td>
                                                        <td className="py-3.5 px-4 text-right">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => openEditModal(founder)}
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

            {/* ── SECTION 3: All Founder Birthday Dates ── */}
            {activeTab === 'all-founders' && (
                <div className="space-y-4">
                    {/* Search & Filter Toolbar */}
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <Input
                                placeholder="Search founder, company, phone..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setPage(0);
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
                                value={selectedCompanyFilter}
                                onChange={(e) => {
                                    setSelectedCompanyFilter(e.target.value);
                                    setPage(0);
                                }}
                                className="bg-[#0e1628] border border-white/[0.08] text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500/50"
                            >
                                <option value="ALL">All Companies ({companies.length})</option>
                                {companies.map((c) => (
                                    <option key={c.userId} value={c.userId}>
                                        {c.companyName || c.fullName || c.userId}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <Card className="border-white/[0.08] bg-white/[0.03] backdrop-blur-xl">
                        <CardContent className="p-0">
                            {loadingFounders ? (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                                    <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                                    <span className="text-sm">Loading all founders directory...</span>
                                </div>
                            ) : filteredFounders.length === 0 ? (
                                <div className="py-20 px-4 text-center">
                                    <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-3 text-slate-500">
                                        <Crown className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-base font-semibold text-white mb-1">No founder records found</h3>
                                    <p className="text-xs text-slate-400 mb-4">Add your company founders to enable automated WhatsApp birthday greetings.</p>
                                    <Button
                                        onClick={openCreateModal}
                                        className="bg-amber-500 hover:bg-amber-600 text-white text-xs h-9 px-4"
                                    >
                                        <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Founder
                                    </Button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Founder Name</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Associated Company</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">WhatsApp Number</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Date of Birth</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Automation Status</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Last Greeting Status</th>
                                                <th className="py-3.5 px-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/[0.04]">
                                            {paginatedFounders.map((founder) => {
                                                const isToggling = !!togglingMap[founder.id];
                                                const lastStatus = latestStatusMap[founder.whatsappNumber];

                                                return (
                                                    <tr key={founder.id} className="hover:bg-white/[0.02] transition-colors">
                                                        {/* Name */}
                                                        <td className="py-3.5 px-4">
                                                            <div className="font-medium text-white flex items-center gap-2">
                                                                <Crown className="w-4 h-4 text-amber-400 flex-shrink-0" />
                                                                <span>{founder.fullName}</span>
                                                            </div>
                                                        </td>

                                                        {/* Company */}
                                                        <td className="py-3.5 px-4 text-slate-300">
                                                            <div className="flex items-center gap-1.5">
                                                                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                                                                <span>{companyMap[founder.companyClientId] || founder.companyName || founder.companyClientId}</span>
                                                            </div>
                                                        </td>

                                                        {/* WhatsApp */}
                                                        <td className="py-3.5 px-4 text-slate-300 font-mono text-xs">
                                                            {founder.whatsappNumber}
                                                        </td>

                                                        {/* DOB */}
                                                        <td className="py-3.5 px-4">
                                                            {founder.dateOfBirth ? (
                                                                <span className="text-xs text-slate-200 font-medium">
                                                                    {formatDateOnly(founder.dateOfBirth)}
                                                                </span>
                                                            ) : (
                                                                <span className="text-xs text-amber-400 italic">Date not added</span>
                                                            )}
                                                        </td>

                                                        {/* Automation */}
                                                        <td className="py-3.5 px-4">
                                                            <button
                                                                onClick={() => handleToggleGreeting(founder, !founder.birthdayGreetingEnabled)}
                                                                disabled={isToggling}
                                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                                                                    founder.birthdayGreetingEnabled
                                                                        ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25'
                                                                        : 'bg-slate-500/15 border border-slate-500/30 text-slate-400 hover:bg-slate-500/25'
                                                                }`}
                                                                title="Click to toggle birthday greetings"
                                                            >
                                                                {isToggling ? (
                                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                                ) : founder.birthdayGreetingEnabled ? (
                                                                    <Check className="w-3 h-3 text-emerald-400" />
                                                                ) : (
                                                                    <X className="w-3 h-3 text-slate-400" />
                                                                )}
                                                                {founder.birthdayGreetingEnabled ? 'Enabled' : 'Disabled'}
                                                            </button>
                                                        </td>

                                                        {/* Last Greeting */}
                                                        <td className="py-3.5 px-4">
                                                            <StatusBadge status={lastStatus} />
                                                        </td>

                                                        {/* Edit Action */}
                                                        <td className="py-3.5 px-4 text-right">
                                                            <div className="flex items-center justify-end gap-1">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => openEditModal(founder)}
                                                                    className="text-slate-400 hover:text-white hover:bg-white/[0.06] text-xs h-8 px-2.5"
                                                                    title="Edit founder details and birthday date"
                                                                >
                                                                    <Edit className="w-3.5 h-3.5 mr-1 text-cyan-400" /> Edit
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => setFounderToDelete(founder)}
                                                                    className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 text-xs h-8 px-2"
                                                                    title="Delete founder"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.08] bg-white/[0.01]">
                                    <div className="text-xs text-slate-400">
                                        Showing <strong className="text-white">{page * pageSize + 1}</strong> to{' '}
                                        <strong className="text-white">
                                            {Math.min((page + 1) * pageSize, filteredFounders.length)}
                                        </strong>{' '}
                                        of <strong className="text-white">{filteredFounders.length}</strong> founders
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            disabled={page === 0}
                                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                                            className="h-8 px-2.5 text-xs text-slate-300 hover:text-white"
                                        >
                                            <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Previous
                                        </Button>
                                        <span className="text-xs text-slate-400">
                                            Page {page + 1} of {totalPages}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            disabled={page >= totalPages - 1}
                                            onClick={() => setPage((p) => p + 1)}
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

            {/* ── SECTION 4: Greeting History ── */}
            {activeTab === 'history' && (
                <div className="space-y-4">
                    <Card className="border-white/[0.08] bg-white/[0.03] backdrop-blur-xl">
                        <CardContent className="p-0">
                            {loadingHistory ? (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                                    <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                                    <span className="text-sm">Loading birthday greeting history...</span>
                                </div>
                            ) : historyLogs.length === 0 ? (
                                <div className="py-20 px-4 text-center">
                                    <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-3 text-slate-500">
                                        <Clock className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-base font-semibold text-white mb-1">No birthday greetings recorded</h3>
                                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                                        When automated birthday greetings are sent to founders via WhatsApp, audit logs will be displayed here.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Founder Name</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Company</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">WhatsApp Number</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Date Sent</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/[0.04]">
                                            {historyLogs.map((log) => (
                                                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                                                    <td className="py-3.5 px-4 font-medium text-white">
                                                        {log.contactPersonName || 'Valued Founder'}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-slate-300">
                                                        {log.companyName}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-slate-300 font-mono text-xs">
                                                        {log.recipientPhone}
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
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ── MODAL: Create Founder ── */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md bg-[#0e1628] border border-white/[0.12] rounded-2xl shadow-2xl p-6"
                        >
                            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                                        <Crown className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-white">Add Founder</h3>
                                        <p className="text-xs text-slate-400">Register founder for automated birthday greetings</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="text-slate-400 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateFounder} className="space-y-4 mt-4">
                                {formError && (
                                    <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                        <span>{formError}</span>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                        Associated Company / Firm *
                                    </label>
                                    {loadingCompanies ? (
                                        <div className="flex items-center gap-2 text-xs text-slate-400 py-2.5 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                                            <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                                            Loading companies…
                                        </div>
                                    ) : companiesError ? (
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2 text-xs text-red-300 py-2 px-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                                                <span>{companiesError}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={fetchCompanies}
                                                className="text-xs text-amber-400 hover:text-amber-300 underline"
                                            >
                                                Retry
                                            </button>
                                        </div>
                                    ) : companies.length === 0 ? (
                                        <div className="flex flex-col gap-2 py-3 px-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                            <p className="text-xs text-amber-300 flex items-center gap-1.5">
                                                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                                No company clients are registered yet.
                                            </p>
                                            <a
                                                href="/admin/employees"
                                                className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 underline"
                                            >
                                                <ExternalLink className="w-3 h-3" />
                                                Go to Client Management to register a company
                                            </a>
                                        </div>
                                    ) : (
                                        <select
                                            value={formData.companyClientId}
                                            onChange={(e) => setFormData({ ...formData, companyClientId: e.target.value })}
                                            className="w-full bg-white/[0.04] border border-white/[0.08] text-white text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-amber-500/50"
                                            required
                                        >
                                            <option value="" disabled className="bg-slate-900 text-slate-400">— Select company client —</option>
                                            {companies.map((c) => (
                                                <option key={c.userId || c.companyId} value={c.userId || c.companyId} className="bg-slate-900 text-white">
                                                    {c.companyName || c.fullName || c.userId}
                                                    {c.contactPersonName ? ` · ${c.contactPersonName}` : ''}
                                                    {` (@${c.userId || c.companyId})`}
                                                    {c.founderCount > 0 ? ` [${c.founderCount} founder${c.founderCount > 1 ? 's' : ''}]` : ''}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                        Founder&apos;s Full Name *
                                    </label>
                                    <Input
                                        placeholder="e.g. Ramesh Patel"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="bg-white/[0.04] border-white/[0.08] text-white text-xs h-10 focus:border-amber-500/50"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                        WhatsApp Number *
                                    </label>
                                    <Input
                                        placeholder="e.g. +91 98765 43210"
                                        value={formData.whatsappNumber}
                                        onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                                        className="bg-white/[0.04] border-white/[0.08] text-white text-xs h-10 focus:border-amber-500/50"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                        Date of Birth *
                                    </label>
                                    <Input
                                        type="date"
                                        value={formData.dateOfBirth}
                                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                        className="bg-white/[0.04] border-white/[0.08] text-white text-xs h-10 focus:border-amber-500/50"
                                        required
                                    />
                                    <p className="text-[11px] text-slate-400 mt-1">
                                        Annual WhatsApp birthday greetings will be sent on this date.
                                    </p>
                                </div>

                                <div className="pt-2">
                                    <label className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] cursor-pointer hover:bg-white/[0.05] transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={formData.birthdayGreetingEnabled}
                                            onChange={(e) => setFormData({ ...formData, birthdayGreetingEnabled: e.target.checked })}
                                            className="mt-0.5 rounded border-white/20 bg-white/10 text-amber-500 focus:ring-0"
                                        />
                                        <div>
                                            <div className="text-xs font-semibold text-white">
                                                Enable automated WhatsApp birthday greetings
                                            </div>
                                            <p className="text-[11px] text-slate-400 mt-0.5">
                                                Automatically send greetings every year on this birthday.
                                            </p>
                                        </div>
                                    </label>
                                </div>

                                <div className="flex gap-2 justify-end pt-3 border-t border-white/[0.08]">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="text-slate-400 hover:text-white text-xs h-9"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={formSubmitting}
                                        className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-xs h-9 px-4 font-medium"
                                    >
                                        {formSubmitting ? (
                                            <>
                                                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                                                Adding...
                                            </>
                                        ) : (
                                            'Add Founder'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── MODAL: Edit Founder ── */}
            <AnimatePresence>
                {isEditModalOpen && editingFounder && (
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
                                        <Edit className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-white">Edit Founder Details</h3>
                                        <p className="text-xs text-slate-400">{editingFounder.fullName}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsEditModalOpen(false);
                                        setEditingFounder(null);
                                    }}
                                    className="text-slate-400 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleUpdateFounder} className="space-y-4 mt-4">
                                {formError && (
                                    <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                        <span>{formError}</span>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">
                                        Associated Company
                                    </label>
                                    <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-slate-300 flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-slate-500" />
                                        <span>{companyMap[editingFounder.companyClientId] || editingFounder.companyClientId}</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                        Founder&apos;s Full Name *
                                    </label>
                                    <Input
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="bg-white/[0.04] border-white/[0.08] text-white text-xs h-10 focus:border-cyan-500/50"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                        WhatsApp Number *
                                    </label>
                                    <Input
                                        value={formData.whatsappNumber}
                                        onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                                        className="bg-white/[0.04] border-white/[0.08] text-white text-xs h-10 focus:border-cyan-500/50"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                        Date of Birth *
                                    </label>
                                    <Input
                                        type="date"
                                        value={formData.dateOfBirth}
                                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                        className="bg-white/[0.04] border-white/[0.08] text-white text-xs h-10 focus:border-cyan-500/50"
                                        required
                                    />
                                    <p className="text-[11px] text-slate-400 mt-1">
                                        Annual WhatsApp birthday greetings will be sent on this date.
                                    </p>
                                </div>

                                <div className="pt-2">
                                    <label className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] cursor-pointer hover:bg-white/[0.05] transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={formData.birthdayGreetingEnabled}
                                            onChange={(e) => setFormData({ ...formData, birthdayGreetingEnabled: e.target.checked })}
                                            className="mt-0.5 rounded border-white/20 bg-white/10 text-cyan-500 focus:ring-0"
                                        />
                                        <div>
                                            <div className="text-xs font-semibold text-white">
                                                Enable automated WhatsApp birthday greetings
                                            </div>
                                            <p className="text-[11px] text-slate-400 mt-0.5">
                                                Automatically send greetings every year on this birthday.
                                            </p>
                                        </div>
                                    </label>
                                </div>

                                <div className="flex gap-2 justify-end pt-3 border-t border-white/[0.08]">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => {
                                            setIsEditModalOpen(false);
                                            setEditingFounder(null);
                                        }}
                                        className="text-slate-400 hover:text-white text-xs h-9"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={formSubmitting}
                                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs h-9 px-4 font-medium"
                                    >
                                        {formSubmitting ? (
                                            <>
                                                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            'Save Birthday Date'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── MODAL: Delete Confirmation ── */}
            <AnimatePresence>
                {founderToDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-sm bg-[#0e1628] border border-red-500/30 rounded-2xl shadow-2xl p-6"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 rounded-xl bg-red-500/15 text-red-400 border border-red-500/30">
                                    <AlertTriangle className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-white">Delete Founder</h3>
                                    <p className="text-xs text-slate-400">{founderToDelete.fullName}</p>
                                </div>
                            </div>

                            <p className="text-xs text-slate-300 leading-relaxed mb-6">
                                Are you sure you want to delete founder record <strong>{founderToDelete.fullName}</strong>? Automated birthday greetings for this founder will stop.
                            </p>

                            <div className="flex gap-2 justify-end">
                                <Button
                                    variant="ghost"
                                    onClick={() => setFounderToDelete(null)}
                                    className="text-slate-400 hover:text-white text-xs h-9"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleDeleteFounder}
                                    disabled={deletingFounder}
                                    className="bg-red-500 hover:bg-red-600 text-white text-xs h-9 px-4"
                                >
                                    {deletingFounder ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5 mr-1.5" />}
                                    Delete
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
