'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Sparkles,
    RefreshCw,
    Send,
    CheckCircle,
    XCircle,
    AlertCircle,
    Clock,
    Phone,
    Building2,
    User,
    Check,
    X,
    ChevronLeft,
    ChevronRight,
    Search,
    Filter,
    Shield,
    Info,
    ExternalLink,
    Play,
    Loader2,
    PartyPopper,
    MessageSquare,
    AlertTriangle,
    Eye,
    SlidersHorizontal,
    Copy,
    ArrowUpRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
    getTodayAnniversaryClients,
    getUpcomingAnniversaries,
    getAnniversaryHistory,
    updateClientAnniversarySettings,
    sendTestAnniversaryGreeting,
    triggerManualAnniversaryGreeting,
    triggerAnniversarySchedulerNow,
    getAllUsers,
    getUnverifiedClients,
    type AnniversaryClientDto,
    type AnniversaryNotificationLog,
    type AnniversaryNotificationStatus,
    type PageResponse,
    type UserProfile,
    type ClientType,
} from '@/lib/api';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function maskPhoneNumber(phone?: string): string {
    if (!phone) return '—';
    const cleaned = phone.trim();
    if (cleaned.length < 8) return cleaned;
    const start = cleaned.slice(0, 4);
    const end = cleaned.slice(-3);
    return `${start} •••• ••${end}`;
}

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
            second: '2-digit',
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
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500/10 border border-slate-500/20 text-slate-400">
                <Clock className="w-3 h-3" /> Not Sent
            </span>
        );
    }

    const s = status.toUpperCase();

    switch (s) {
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
                    <Check className="w-3 h-3 text-cyan-400" /> API Accepted
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
    // Tab state: 'today' | 'upcoming' | 'history' | 'all-clients'
    const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'history' | 'all-clients'>('today');

    // Data states
    const [todayClients, setTodayClients] = useState<AnniversaryClientDto[]>([]);
    const [upcomingClients, setUpcomingClients] = useState<AnniversaryClientDto[]>([]);
    const [upcomingDays, setUpcomingDays] = useState<number>(7);
    const [historyPage, setHistoryPage] = useState<PageResponse<AnniversaryNotificationLog> | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [allClients, setAllClients] = useState<UserProfile[]>([]);

    // Loading & error states
    const [loadingToday, setLoadingToday] = useState<boolean>(true);
    const [loadingUpcoming, setLoadingUpcoming] = useState<boolean>(false);
    const [loadingHistory, setLoadingHistory] = useState<boolean>(false);
    const [loadingAllClients, setLoadingAllClients] = useState<boolean>(false);
    const [globalError, setGlobalError] = useState<string>('');
    const [actionSuccess, setActionSuccess] = useState<string>('');

    // Filter states
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filterAutomation, setFilterAutomation] = useState<'all' | 'enabled' | 'disabled'>('all');
    const [filterClientType, setFilterClientType] = useState<'all' | 'COMPANY' | 'INDIVIDUAL' | 'UNVERIFIED'>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [unverifiedList, setUnverifiedList] = useState<AnniversaryClientDto[]>([]);

    // Modals
    const [testSendModalOpen, setTestSendModalOpen] = useState<boolean>(false);
    const [manualSendTarget, setManualSendTarget] = useState<AnniversaryClientDto | null>(null);
    const [triggerSchedulerModalOpen, setTriggerSchedulerModalOpen] = useState<boolean>(false);
    const [editSettingsClient, setEditSettingsClient] = useState<AnniversaryClientDto | null>(null);

    // Form states for test send
    const [testPhone, setTestPhone] = useState<string>('');
    const [testCompany, setTestCompany] = useState<string>('Test Firm Technologies Pvt. Ltd.');
    const [testContact, setTestContact] = useState<string>('Valued Client');
    const [testTemplate, setTestTemplate] = useState<string>('');
    const [sendingTest, setSendingTest] = useState<boolean>(false);
    const [testError, setTestError] = useState<string>('');
    const [testResult, setTestResult] = useState<string>('');

    // Manual send in progress
    const [sendingManual, setSendingManual] = useState<boolean>(false);
    const [manualSendError, setManualSendError] = useState<string>('');

    // Scheduler trigger in progress
    const [triggeringScheduler, setTriggeringScheduler] = useState<boolean>(false);
    const [schedulerResult, setSchedulerResult] = useState<any | null>(null);

    // Edit settings form
    const [editClientType, setEditClientType] = useState<ClientType | ''>('COMPANY');
    const [editFormationDate, setEditFormationDate] = useState<string>('');
    const [editAutomationEnabled, setEditAutomationEnabled] = useState<boolean>(false);
    const [editConsentGiven, setEditConsentGiven] = useState<boolean>(false);
    const [savingSettings, setSavingSettings] = useState<boolean>(false);
    const [settingsError, setSettingsError] = useState<string>('');

    // Toggle loading map for quick switches: userId -> boolean
    const [togglingMap, setTogglingMap] = useState<Record<string, boolean>>({});

    // ── Data Fetching ────────────────────────────────────────────────────────

    const fetchTodayData = useCallback(async () => {
        setLoadingToday(true);
        setGlobalError('');
        try {
            const data = await getTodayAnniversaryClients();
            setTodayClients(data || []);
        } catch (err: any) {
            setGlobalError(err?.message || 'Failed to load today\'s anniversaries');
        } finally {
            setLoadingToday(false);
        }
    }, []);

    const fetchUpcomingData = useCallback(async (days: number) => {
        setLoadingUpcoming(true);
        try {
            const data = await getUpcomingAnniversaries(days);
            setUpcomingClients(data || []);
        } catch (err: any) {
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
        } catch (err: any) {
            console.error('Error fetching anniversary history:', err);
        } finally {
            setLoadingHistory(false);
        }
    }, []);

    const fetchAllClientsData = useCallback(async () => {
        setLoadingAllClients(true);
        try {
            const [users, unverified] = await Promise.all([
                getAllUsers(),
                getUnverifiedClients().catch(() => []),
            ]);
            setAllClients(users || []);
            setUnverifiedList(unverified || []);
        } catch (err: any) {
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

    const handleToggleAutomation = async (client: AnniversaryClientDto) => {
        if (client.clientType === 'INDIVIDUAL') {
            setGlobalError(`Cannot enable automation for individual client "${client.fullName || client.userId}": Anniversary greetings are exclusively for Company / Firm clients.`);
            return;
        }
        if (!client.clientType) {
            setGlobalError(`Cannot toggle automation for legacy client "${client.companyName || client.userId}": Please verify the client type first using 'Edit Settings'.`);
            return;
        }

        const newStatus = !client.anniversaryAutomationEnabled;
        if (newStatus && !client.formationDate) {
            setGlobalError(`Cannot enable automation for "${client.companyName || client.userId}": Company Formation Date is required.`);
            return;
        }

        setTogglingMap(prev => ({ ...prev, [client.userId]: true }));
        setGlobalError('');

        try {
            await updateClientAnniversarySettings(client.userId, {
                clientType: client.clientType,
                formationDate: client.formationDate,
                anniversaryAutomationEnabled: newStatus,
                whatsappConsentGiven: client.whatsappConsentGiven,
            });

            // Update local state in todayClients
            setTodayClients(prev => prev.map(c =>
                c.userId === client.userId ? { ...c, anniversaryAutomationEnabled: newStatus } : c
            ));

            // Update in upcomingClients
            setUpcomingClients(prev => prev.map(c =>
                c.userId === client.userId ? { ...c, anniversaryAutomationEnabled: newStatus } : c
            ));

            // Update in allClients
            setAllClients(prev => prev.map(u =>
                u.userId === client.userId ? { ...u, anniversaryAutomationEnabled: newStatus } : u
            ));

            setActionSuccess(`Automation ${newStatus ? 'enabled' : 'disabled'} for ${client.companyName || client.userId}`);
            setTimeout(() => setActionSuccess(''), 4000);
        } catch (err: any) {
            setGlobalError(err?.message || 'Failed to update anniversary automation setting');
        } finally {
            setTogglingMap(prev => ({ ...prev, [client.userId]: false }));
        }
    };

    // ── Manual Send Greeting ─────────────────────────────────────────────────

    const handleConfirmManualSend = async () => {
        if (!manualSendTarget) return;
        setSendingManual(true);
        setManualSendError('');

        try {
            const res = await triggerManualAnniversaryGreeting(manualSendTarget.userId);
            setActionSuccess(`WhatsApp greeting dispatched to ${manualSendTarget.companyName || manualSendTarget.userId}! Meta Message ID: ${res.notificationLog.metaMessageId || 'Pending'}`);
            setManualSendTarget(null);
            // Refresh data
            fetchTodayData();
            fetchHistoryData(0);
        } catch (err: any) {
            setManualSendError(err?.message || 'Failed to send WhatsApp greeting');
        } finally {
            setSendingManual(false);
        }
    };

    // ── Test Greeting Send ───────────────────────────────────────────────────

    const handleSendTestGreeting = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!testPhone.trim()) {
            setTestError('Recipient phone number is required');
            return;
        }

        // Basic phone validation (10 to 15 digits)
        const digitsOnly = testPhone.replace(/\D/g, '');
        if (digitsOnly.length < 10) {
            setTestError('Please enter a valid phone number (at least 10 digits)');
            return;
        }

        setSendingTest(true);
        setTestError('');
        setTestResult('');

        try {
            const res = await sendTestAnniversaryGreeting({
                recipientPhone: testPhone.trim(),
                companyName: testCompany.trim() || undefined,
                contactPersonName: testContact.trim() || undefined,
                templateName: testTemplate.trim() || undefined,
            });

            if (res.status === 'SUCCESS') {
                setTestResult(`Success! Test greeting accepted by Meta WhatsApp API. (Meta Message ID: ${res.metaMessageId})`);
                fetchHistoryData(0);
            } else {
                setTestError(res.errorMessage || `Failed with code ${res.errorCode}`);
            }
        } catch (err: any) {
            setTestError(err?.message || 'Failed to send test WhatsApp greeting');
        } finally {
            setSendingTest(false);
        }
    };

    // ── Trigger Scheduler On-Demand ──────────────────────────────────────────

    const handleTriggerSchedulerNow = async () => {
        setTriggeringScheduler(true);
        setGlobalError('');
        try {
            const res = await triggerAnniversarySchedulerNow();
            setSchedulerResult(res.summary);
            setActionSuccess(`Anniversary scheduler executed for today! Processed: ${res.summary.processedCount}, Eligible: ${res.summary.eligibleCount}`);
            fetchTodayData();
            fetchHistoryData(0);
        } catch (err: any) {
            setGlobalError(err?.message || 'Failed to trigger scheduler');
        } finally {
            setTriggeringScheduler(false);
        }
    };

    // ── Open Edit Settings Modal ─────────────────────────────────────────────

    const handleOpenEditSettings = (client: AnniversaryClientDto) => {
        setEditSettingsClient(client);
        setEditClientType((client.clientType as ClientType) || '');
        setEditFormationDate(client.formationDate || '');
        setEditAutomationEnabled(client.clientType === 'INDIVIDUAL' ? false : (client.anniversaryAutomationEnabled || false));
        setEditConsentGiven(client.whatsappConsentGiven || false);
        setSettingsError('');
    };

    const handleSaveClientSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editSettingsClient) return;

        if (editClientType === 'INDIVIDUAL' && editAutomationEnabled) {
            setSettingsError('Anniversary automation cannot be enabled for Individual clients.');
            return;
        }

        if (editClientType === 'COMPANY' && editAutomationEnabled && !editFormationDate) {
            setSettingsError('Company formation date is required when enabling automated greetings.');
            return;
        }

        setSavingSettings(true);
        setSettingsError('');

        try {
            await updateClientAnniversarySettings(editSettingsClient.userId, {
                clientType: editClientType || undefined,
                formationDate: editClientType === 'INDIVIDUAL' ? undefined : (editFormationDate || undefined),
                anniversaryAutomationEnabled: editClientType === 'INDIVIDUAL' ? false : editAutomationEnabled,
                whatsappConsentGiven: editConsentGiven,
            });

            setActionSuccess(`Settings updated for ${editSettingsClient.companyName || editSettingsClient.userId}`);
            setEditSettingsClient(null);

            // Refresh
            fetchTodayData();
            fetchUpcomingData(upcomingDays);
            fetchAllClientsData();
        } catch (err: any) {
            setSettingsError(err?.message || 'Failed to update anniversary settings');
        } finally {
            setSavingSettings(false);
        }
    };

    // ── Derived Statistics ───────────────────────────────────────────────────

    const historyItems = historyPage?.content || [];

    const stats = useMemo(() => {
        const todayCount = todayClients.length;
        const upcomingCount = upcomingClients.length;
        const automationEnabledCount = allClients.filter(c => c.anniversaryAutomationEnabled).length;

        const acceptedCount = historyItems.filter(h =>
            ['ACCEPTED', 'DELIVERED', 'READ'].includes(h.status?.toUpperCase())
        ).length;

        const deliveredCount = historyItems.filter(h =>
            ['DELIVERED', 'READ'].includes(h.status?.toUpperCase())
        ).length;

        const failedCount = historyItems.filter(h =>
            h.status?.toUpperCase() === 'FAILED'
        ).length;

        return {
            todayCount,
            upcomingCount,
            acceptedCount,
            deliveredCount,
            failedCount,
            automationEnabledCount,
        };
    }, [todayClients, upcomingClients, allClients, historyItems]);

    // ── Filtered Lists ───────────────────────────────────────────────────────

    const filteredToday = useMemo(() => {
        return todayClients.filter(c => {
            const matchesSearch =
                (c.companyName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (c.contactPersonName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (c.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (c.userId || '').toLowerCase().includes(searchQuery.toLowerCase());

            const matchesAuto =
                filterAutomation === 'all'
                    ? true
                    : filterAutomation === 'enabled'
                    ? c.anniversaryAutomationEnabled
                    : !c.anniversaryAutomationEnabled;

            const matchesStatus =
                filterStatus === 'all'
                    ? true
                    : (c.latestNotificationStatus || 'NOT_SENT').toUpperCase() === filterStatus.toUpperCase();

            return matchesSearch && matchesAuto && matchesStatus;
        });
    }, [todayClients, searchQuery, filterAutomation, filterStatus]);

    const filteredUpcoming = useMemo(() => {
        return upcomingClients.filter(c => {
            const matchesSearch =
                (c.companyName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (c.contactPersonName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (c.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (c.userId || '').toLowerCase().includes(searchQuery.toLowerCase());

            const matchesAuto =
                filterAutomation === 'all'
                    ? true
                    : filterAutomation === 'enabled'
                    ? c.anniversaryAutomationEnabled
                    : !c.anniversaryAutomationEnabled;

            return matchesSearch && matchesAuto;
        });
    }, [upcomingClients, searchQuery, filterAutomation]);

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
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                    <Sparkles className="w-3 h-3" /> WhatsApp Automated
                                </span>
                            </h1>
                            <p className="text-sm text-slate-400 mt-0.5">
                                Automated annual WhatsApp congratulations on company formation dates via Meta Cloud API.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Timezone Indicator */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span>TZ: <strong className="text-white font-medium">Asia/Kolkata (IST)</strong></span>
                    </div>

                    {/* Refresh Button */}
                    <Button
                        variant="ghost"
                        onClick={handleRefreshAll}
                        disabled={loadingToday || loadingUpcoming || loadingHistory}
                        className="text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.08] text-xs h-9"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loadingToday || loadingUpcoming || loadingHistory ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>

                    {/* Run Scheduler Now */}
                    <Button
                        variant="ghost"
                        onClick={() => setTriggerSchedulerModalOpen(true)}
                        className="text-purple-300 hover:text-purple-200 hover:bg-purple-500/10 border border-purple-500/30 text-xs h-9"
                    >
                        <Play className="w-3.5 h-3.5 mr-1.5 text-purple-400" />
                        Run Scheduler Now
                    </Button>

                    {/* Send Test Message */}
                    <Button
                        onClick={() => {
                            setTestSendModalOpen(true);
                            setTestError('');
                            setTestResult('');
                        }}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-medium text-xs h-9 shadow-lg shadow-pink-500/20"
                    >
                        <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                        Send Test Message
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

            {/* ── Summary Cards ────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {/* 1. Today's Anniversaries */}
                <Card className="border-white/[0.08] bg-white/[0.03] backdrop-blur-md relative overflow-hidden">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-400">Today&apos;s Events</span>
                            <div className="p-1.5 rounded-lg bg-pink-500/15 text-pink-400">
                                <PartyPopper className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <div className="mt-2 text-2xl font-bold text-white">
                            {loadingToday ? <Loader2 className="w-5 h-5 animate-spin text-slate-500" /> : stats.todayCount}
                        </div>
                        <div className="text-[11px] text-pink-400/80 mt-1 font-medium">Scheduled Today</div>
                    </CardContent>
                </Card>

                {/* 2. Upcoming Anniversaries */}
                <Card className="border-white/[0.08] bg-white/[0.03] backdrop-blur-md relative overflow-hidden">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-400">Upcoming</span>
                            <div className="p-1.5 rounded-lg bg-blue-500/15 text-blue-400">
                                <Calendar className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <div className="mt-2 text-2xl font-bold text-white">
                            {loadingUpcoming ? <Loader2 className="w-5 h-5 animate-spin text-slate-500" /> : stats.upcomingCount}
                        </div>
                        <div className="text-[11px] text-blue-400/80 mt-1 font-medium">Next {upcomingDays} Days</div>
                    </CardContent>
                </Card>

                {/* 3. Messages Accepted */}
                <Card className="border-white/[0.08] bg-white/[0.03] backdrop-blur-md relative overflow-hidden">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-400">Accepted</span>
                            <div className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400">
                                <Check className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <div className="mt-2 text-2xl font-bold text-white">
                            {loadingHistory ? <Loader2 className="w-5 h-5 animate-spin text-slate-500" /> : stats.acceptedCount}
                        </div>
                        <div className="text-[11px] text-cyan-400/80 mt-1 font-medium">By Meta Cloud API</div>
                    </CardContent>
                </Card>

                {/* 4. Messages Delivered */}
                <Card className="border-white/[0.08] bg-white/[0.03] backdrop-blur-md relative overflow-hidden">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-400">Delivered</span>
                            <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400">
                                <CheckCircle className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <div className="mt-2 text-2xl font-bold text-white">
                            {loadingHistory ? <Loader2 className="w-5 h-5 animate-spin text-slate-500" /> : stats.deliveredCount}
                        </div>
                        <div className="text-[11px] text-emerald-400/80 mt-1 font-medium">Confirmed Webhook</div>
                    </CardContent>
                </Card>

                {/* 5. Failed Messages */}
                <Card className="border-white/[0.08] bg-white/[0.03] backdrop-blur-md relative overflow-hidden">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-400">Failed</span>
                            <div className="p-1.5 rounded-lg bg-red-500/15 text-red-400">
                                <XCircle className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <div className="mt-2 text-2xl font-bold text-white">
                            {loadingHistory ? <Loader2 className="w-5 h-5 animate-spin text-slate-500" /> : stats.failedCount}
                        </div>
                        <div className="text-[11px] text-red-400/80 mt-1 font-medium">Delivery Failures</div>
                    </CardContent>
                </Card>

                {/* 6. Automation Enabled */}
                <Card className="border-white/[0.08] bg-white/[0.03] backdrop-blur-md relative overflow-hidden">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-400">Auto Enabled</span>
                            <div className="p-1.5 rounded-lg bg-purple-500/15 text-purple-400">
                                <Sparkles className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <div className="mt-2 text-2xl font-bold text-white">
                            {loadingAllClients ? <Loader2 className="w-5 h-5 animate-spin text-slate-500" /> : stats.automationEnabledCount}
                        </div>
                        <div className="text-[11px] text-purple-400/80 mt-1 font-medium">Active Clients</div>
                    </CardContent>
                </Card>
            </div>

            {/* ── Navigation Tabs & Filters ─────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Tabs */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] self-start">
                    <button
                        onClick={() => setActiveTab('today')}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
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
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            activeTab === 'upcoming'
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-md shadow-blue-500/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                        }`}
                    >
                        <Calendar className="w-3.5 h-3.5" />
                        Upcoming
                        {upcomingClients.length > 0 && (
                            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white">
                                {upcomingClients.length}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            activeTab === 'history'
                                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                        }`}
                    >
                        <Clock className="w-3.5 h-3.5" />
                        Notification Logs
                    </button>

                    <button
                        onClick={() => setActiveTab('all-clients')}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            activeTab === 'all-clients'
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                        }`}
                    >
                        <Building2 className="w-3.5 h-3.5" />
                        All Formation Dates
                    </button>
                </div>

                {/* Search & Filters */}
                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Search */}
                    <div className="relative min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                        <Input
                            placeholder="Search company or contact..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-9 h-9 text-xs bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-cyan-500/50"
                        />
                    </div>

                    {/* Filter Client Type (for all-clients tab) */}
                    {activeTab === 'all-clients' && (
                        <select
                            value={filterClientType}
                            onChange={e => setFilterClientType(e.target.value as any)}
                            className="h-9 px-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300 focus:border-cyan-500/50 outline-none"
                        >
                            <option value="all" className="bg-slate-900 text-slate-300">All Client Types</option>
                            <option value="COMPANY" className="bg-slate-900 text-slate-300">Company / Firm</option>
                            <option value="INDIVIDUAL" className="bg-slate-900 text-slate-300">Individual</option>
                            <option value="UNVERIFIED" className="bg-slate-900 text-slate-300">Unverified (Legacy)</option>
                        </select>
                    )}

                    {/* Filter Automation */}
                    <select
                        value={filterAutomation}
                        onChange={e => setFilterAutomation(e.target.value as any)}
                        className="h-9 px-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300 focus:border-cyan-500/50 outline-none"
                    >
                        <option value="all" className="bg-slate-900 text-slate-300">All Automation</option>
                        <option value="enabled" className="bg-slate-900 text-slate-300">Auto Enabled Only</option>
                        <option value="disabled" className="bg-slate-900 text-slate-300">Auto Disabled Only</option>
                    </select>

                    {/* Days selector for Upcoming */}
                    {activeTab === 'upcoming' && (
                        <select
                            value={upcomingDays}
                            onChange={e => {
                                const days = parseInt(e.target.value, 10);
                                setUpcomingDays(days);
                                fetchUpcomingData(days);
                            }}
                            className="h-9 px-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300 focus:border-cyan-500/50 outline-none"
                        >
                            <option value={7} className="bg-slate-900 text-slate-300">Next 7 Days</option>
                            <option value={14} className="bg-slate-900 text-slate-300">Next 14 Days</option>
                            <option value={30} className="bg-slate-900 text-slate-300">Next 30 Days</option>
                            <option value={60} className="bg-slate-900 text-slate-300">Next 60 Days</option>
                        </select>
                    )}
                </div>
            </div>

            {/* ── TAB 1: Today's Anniversaries ──────────────────────────────── */}
            {activeTab === 'today' && (
                <Card className="border-white/[0.08] bg-white/[0.03] backdrop-blur-xl">
                    <CardContent className="p-0">
                        {loadingToday ? (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                                <Loader2 className="w-8 h-8 animate-spin text-pink-400" />
                                <span className="text-sm">Matching today&apos;s anniversaries against active clients...</span>
                            </div>
                        ) : filteredToday.length === 0 ? (
                            <div className="py-20 px-4 text-center">
                                <div className="w-14 h-14 mx-auto rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-500 mb-4">
                                    <PartyPopper className="w-7 h-7" />
                                </div>
                                <h3 className="text-base font-semibold text-white mb-1">
                                    No company anniversaries are scheduled for today.
                                </h3>
                                <p className="text-xs text-slate-400 max-w-md mx-auto">
                                    {todayClients.length > 0 && searchQuery
                                        ? 'No records match your active search filter.'
                                        : 'No registered clients have a company formation date matching today in the Asia/Kolkata timezone.'}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                                            <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Company & Client</th>
                                            <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Formation Date</th>
                                            <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">WhatsApp Phone</th>
                                            <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Milestone</th>
                                            <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Automation</th>
                                            <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Today&apos;s Status</th>
                                            <th className="py-3.5 px-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.04]">
                                        {filteredToday.map(client => {
                                            const isToggling = !!togglingMap[client.userId];
                                            return (
                                                <tr key={client.userId} className="hover:bg-white/[0.02] transition-colors">
                                                    {/* Company & Client */}
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 flex items-center justify-center text-pink-300 font-bold text-sm">
                                                                {(client.companyName || client.fullName || client.userId).charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div className="text-white font-medium text-sm flex items-center gap-2">
                                                                    {client.companyName || client.fullName || client.userId}
                                                                    {client.whatsappConsentGiven && (
                                                                        <span title="WhatsApp greeting consent confirmed">
                                                                            <Shield className="w-3.5 h-3.5 text-emerald-400" />
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                                                                    <User className="w-3 h-3 text-slate-500" />
                                                                    <span>{client.contactPersonName || client.fullName || '—'}</span>
                                                                    <span className="text-slate-600">•</span>
                                                                    <span className="text-slate-500 font-mono">@{client.userId}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Formation Date */}
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center gap-2 text-slate-300">
                                                            <Calendar className="w-3.5 h-3.5 text-pink-400" />
                                                            <span>{formatDate(client.formationDate)}</span>
                                                        </div>
                                                    </td>

                                                    {/* WhatsApp Phone */}
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300">
                                                            <Phone className="w-3.5 h-3.5 text-emerald-400" />
                                                            <span>{maskPhoneNumber(client.phone)}</span>
                                                        </div>
                                                    </td>

                                                    {/* Milestone */}
                                                    <td className="py-4 px-4">
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-300">
                                                            <PartyPopper className="w-3 h-3 text-pink-400" />
                                                            {getOrdinalSuffix(client.yearsCompleted)} Anniversary
                                                        </span>
                                                    </td>

                                                    {/* Automation Toggle */}
                                                    <td className="py-4 px-4">
                                                        <button
                                                            onClick={() => handleToggleAutomation(client)}
                                                            disabled={isToggling}
                                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                                                                client.anniversaryAutomationEnabled
                                                                    ? 'bg-purple-500/15 border-purple-500/30 text-purple-300 hover:bg-purple-500/25'
                                                                    : 'bg-slate-500/10 border-slate-500/20 text-slate-400 hover:bg-slate-500/20'
                                                            }`}
                                                        >
                                                            {isToggling ? (
                                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                            ) : client.anniversaryAutomationEnabled ? (
                                                                <Check className="w-3 h-3 text-purple-400" />
                                                            ) : (
                                                                <X className="w-3 h-3 text-slate-500" />
                                                            )}
                                                            {client.anniversaryAutomationEnabled ? 'Auto ON' : 'Auto OFF'}
                                                        </button>
                                                    </td>

                                                    {/* Today's Status */}
                                                    <td className="py-4 px-4">
                                                        <StatusBadge status={client.latestNotificationStatus} />
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="py-4 px-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleOpenEditSettings(client)}
                                                                className="h-8 px-2.5 text-xs text-slate-300 hover:text-white hover:bg-white/[0.08]"
                                                                title="Edit formation date or settings"
                                                            >
                                                                <SlidersHorizontal className="w-3.5 h-3.5 mr-1 text-slate-400" />
                                                                Edit
                                                            </Button>

                                                            <Button
                                                                size="sm"
                                                                onClick={() => setManualSendTarget(client)}
                                                                className="h-8 px-3 text-xs bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-medium shadow-md shadow-pink-500/15"
                                                            >
                                                                <Send className="w-3 h-3 mr-1.5" />
                                                                Send Greeting
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
                    </CardContent>
                </Card>
            )}

            {/* ── TAB 2: Upcoming Anniversaries ─────────────────────────────── */}
            {activeTab === 'upcoming' && (
                <Card className="border-white/[0.08] bg-white/[0.03] backdrop-blur-xl">
                    <CardContent className="p-0">
                        {loadingUpcoming ? (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                                <span className="text-sm">Calculating upcoming formation anniversaries...</span>
                            </div>
                        ) : filteredUpcoming.length === 0 ? (
                            <div className="py-20 px-4 text-center">
                                <div className="w-14 h-14 mx-auto rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-500 mb-4">
                                    <Calendar className="w-7 h-7" />
                                </div>
                                <h3 className="text-base font-semibold text-white mb-1">
                                    No company anniversaries found in the next {upcomingDays} days.
                                </h3>
                                <p className="text-xs text-slate-400 max-w-md mx-auto">
                                    Try extending the days selector (e.g. 30 or 60 days) or ensure clients have their formation dates recorded.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                                            <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Company & Client</th>
                                            <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Formation Date</th>
                                            <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Days Remaining</th>
                                            <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Next Milestone</th>
                                            <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Automation</th>
                                            <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">WhatsApp Phone</th>
                                            <th className="py-3.5 px-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Settings</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.04]">
                                        {filteredUpcoming.map(client => {
                                            const daysRemaining = calculateDaysRemaining(client.formationDate);
                                            const isToggling = !!togglingMap[client.userId];

                                            return (
                                                <tr key={client.userId} className="hover:bg-white/[0.02] transition-colors">
                                                    {/* Company */}
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center text-blue-300 font-bold text-sm">
                                                                {(client.companyName || client.fullName || client.userId).charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div className="text-white font-medium text-sm flex items-center gap-2">
                                                                    {client.companyName || client.fullName || client.userId}
                                                                    {client.whatsappConsentGiven && (
                                                                        <span title="Consent verified">
                                                                            <Shield className="w-3.5 h-3.5 text-emerald-400" />
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                                                                    <User className="w-3 h-3 text-slate-500" />
                                                                    <span>{client.contactPersonName || client.fullName || '—'}</span>
                                                                    <span className="text-slate-600">•</span>
                                                                    <span className="text-slate-500 font-mono">@{client.userId}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Formation Date */}
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center gap-2 text-slate-300">
                                                            <Calendar className="w-3.5 h-3.5 text-blue-400" />
                                                            <span>{formatDate(client.formationDate)}</span>
                                                        </div>
                                                    </td>

                                                    {/* Days Remaining */}
                                                    <td className="py-4 px-4">
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-300">
                                                            <Clock className="w-3 h-3 text-blue-400" />
                                                            {daysRemaining === 0 ? 'Today' : daysRemaining === 1 ? 'Tomorrow' : `In ${daysRemaining} days`}
                                                        </span>
                                                    </td>

                                                    {/* Milestone */}
                                                    <td className="py-4 px-4">
                                                        <span className="text-xs text-slate-300 font-medium">
                                                            {getOrdinalSuffix(client.yearsCompleted)} Anniversary
                                                        </span>
                                                    </td>

                                                    {/* Automation Toggle */}
                                                    <td className="py-4 px-4">
                                                        <button
                                                            onClick={() => handleToggleAutomation(client)}
                                                            disabled={isToggling}
                                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                                                                client.anniversaryAutomationEnabled
                                                                    ? 'bg-purple-500/15 border-purple-500/30 text-purple-300 hover:bg-purple-500/25'
                                                                    : 'bg-slate-500/10 border-slate-500/20 text-slate-400 hover:bg-slate-500/20'
                                                            }`}
                                                        >
                                                            {isToggling ? (
                                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                            ) : client.anniversaryAutomationEnabled ? (
                                                                <Check className="w-3 h-3 text-purple-400" />
                                                            ) : (
                                                                <X className="w-3 h-3 text-slate-500" />
                                                            )}
                                                            {client.anniversaryAutomationEnabled ? 'Auto ON' : 'Auto OFF'}
                                                        </button>
                                                    </td>

                                                    {/* Phone */}
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300">
                                                            <Phone className="w-3.5 h-3.5 text-emerald-400" />
                                                            <span>{maskPhoneNumber(client.phone)}</span>
                                                        </div>
                                                    </td>

                                                    {/* Edit */}
                                                    <td className="py-4 px-4 text-right">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleOpenEditSettings(client)}
                                                            className="h-8 px-2.5 text-xs text-slate-300 hover:text-white hover:bg-white/[0.08]"
                                                        >
                                                            <SlidersHorizontal className="w-3.5 h-3.5 mr-1 text-slate-400" />
                                                            Edit
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
            )}

            {/* ── TAB 3: Notification History ──────────────────────────────── */}
            {activeTab === 'history' && (
                <Card className="border-white/[0.08] bg-white/[0.03] backdrop-blur-xl">
                    <CardContent className="p-0">
                        {loadingHistory ? (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                                <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                                <span className="text-sm">Loading WhatsApp notification history...</span>
                            </div>
                        ) : historyItems.length === 0 ? (
                            <div className="py-20 px-4 text-center">
                                <div className="w-14 h-14 mx-auto rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-500 mb-4">
                                    <Clock className="w-7 h-7" />
                                </div>
                                <h3 className="text-base font-semibold text-white mb-1">
                                    No WhatsApp notification records yet.
                                </h3>
                                <p className="text-xs text-slate-400 max-w-md mx-auto">
                                    Logs will appear here once automated anniversary greetings or manual test messages are sent.
                                </p>
                            </div>
                        ) : (
                            <div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Company</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Recipient</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Template</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Year</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Trigger</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Timestamp</th>
                                                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Meta Message ID</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/[0.04]">
                                            {historyItems.map(log => (
                                                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                                                    {/* Company */}
                                                    <td className="py-3.5 px-4">
                                                        <div className="text-white font-medium text-xs">
                                                            {log.companyName || '—'}
                                                        </div>
                                                        <div className="text-[11px] text-slate-400">
                                                            {log.contactPersonName || '—'}
                                                        </div>
                                                    </td>

                                                    {/* Recipient */}
                                                    <td className="py-3.5 px-4">
                                                        <span className="font-mono text-xs text-slate-300">
                                                            {maskPhoneNumber(log.recipientPhone)}
                                                        </span>
                                                    </td>

                                                    {/* Status */}
                                                    <td className="py-3.5 px-4">
                                                        <div className="space-y-1">
                                                            <StatusBadge status={log.status} />
                                                            {log.lastErrorMessage && (
                                                                <div className="text-[11px] text-red-400 max-w-[200px] truncate" title={log.lastErrorMessage}>
                                                                    {log.lastErrorCode ? `[${log.lastErrorCode}] ` : ''}{log.lastErrorMessage}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Template */}
                                                    <td className="py-3.5 px-4">
                                                        <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                                                            {log.templateName || 'anniversary_greeting'}
                                                        </span>
                                                    </td>

                                                    {/* Year */}
                                                    <td className="py-3.5 px-4">
                                                        <span className="text-xs text-slate-300">
                                                            {log.anniversaryYear}
                                                        </span>
                                                    </td>

                                                    {/* Trigger */}
                                                    <td className="py-3.5 px-4">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${
                                                            log.manualTrigger
                                                                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                                                                : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/20'
                                                        }`}>
                                                            {log.manualTrigger ? 'MANUAL' : 'SCHEDULER'}
                                                        </span>
                                                    </td>

                                                    {/* Timestamp */}
                                                    <td className="py-3.5 px-4">
                                                        <div className="text-xs text-slate-300">
                                                            {formatDateTime(log.createdAt || log.lastAttemptAt)}
                                                        </div>
                                                        {log.deliveryAt && (
                                                            <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                                                                <CheckCircle className="w-2.5 h-2.5" /> Delivered: {formatDateTime(log.deliveryAt)}
                                                            </div>
                                                        )}
                                                    </td>

                                                    {/* Meta Message ID */}
                                                    <td className="py-3.5 px-4">
                                                        {log.metaMessageId ? (
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="font-mono text-[11px] text-slate-400 max-w-[120px] truncate" title={log.metaMessageId}>
                                                                    {log.metaMessageId}
                                                                </span>
                                                                <button
                                                                    onClick={() => {
                                                                        navigator.clipboard.writeText(log.metaMessageId || '');
                                                                        setActionSuccess('Meta Message ID copied to clipboard');
                                                                        setTimeout(() => setActionSuccess(''), 2500);
                                                                    }}
                                                                    className="text-slate-500 hover:text-slate-300 p-1"
                                                                    title="Copy Meta Message ID"
                                                                >
                                                                    <Copy className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span className="text-slate-600 text-xs">—</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
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
                                                    const newPage = Math.max(0, currentPage - 1);
                                                    setCurrentPage(newPage);
                                                    fetchHistoryData(newPage);
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
                                                    const newPage = currentPage + 1;
                                                    setCurrentPage(newPage);
                                                    fetchHistoryData(newPage);
                                                }}
                                                className="h-8 px-2.5 text-xs text-slate-300 hover:text-white"
                                            >
                                                Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* ── TAB 4: All Clients Formation Settings ─────────────────────── */}
            {activeTab === 'all-clients' && (() => {
                const unverifiedCount = allClients.filter(u => !u.clientType).length;

                return (
                    <div className="space-y-4">
                        {/* Unverified Legacy Notice */}
                        {unverifiedCount > 0 && (
                            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-amber-500/5">
                                <div className="flex items-start gap-2.5">
                                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-semibold text-amber-300">
                                            {unverifiedCount} Legacy Record{unverifiedCount > 1 ? 's' : ''} Require Client Type Verification:
                                        </span>
                                        <p className="mt-0.5 text-amber-200/80">
                                            These clients were created before client types were introduced. Please verify whether each is a Company / Firm or an Individual.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setFilterClientType(filterClientType === 'UNVERIFIED' ? 'all' : 'UNVERIFIED')}
                                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer"
                                >
                                    {filterClientType === 'UNVERIFIED' ? 'Show All Types' : `Filter ${unverifiedCount} Unverified`}
                                </button>
                            </div>
                        )}

                        <Card className="border-white/[0.08] bg-white/[0.03] backdrop-blur-xl">
                            <CardContent className="p-0">
                                {loadingAllClients ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                                        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                                        <span className="text-sm">Loading client directory...</span>
                                    </div>
                                ) : allClients.length === 0 ? (
                                    <div className="py-20 px-4 text-center">
                                        <h3 className="text-base font-semibold text-white mb-1">No clients found</h3>
                                        <p className="text-xs text-slate-400">Create clients in the Client Management section.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                                                    <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Client / Firm</th>
                                                    <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Client Type</th>
                                                    <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Formation Date</th>
                                                    <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Anniversary Automation</th>
                                                    <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">WhatsApp Consent</th>
                                                    <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone Number</th>
                                                    <th className="py-3.5 px-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/[0.04]">
                                                {allClients
                                                    .filter(u => {
                                                        const matchSearch =
                                                            (u.companyName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                            (u.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                            (u.userId || '').toLowerCase().includes(searchQuery.toLowerCase());
                                                        const matchAuto =
                                                            filterAutomation === 'all'
                                                                ? true
                                                                : filterAutomation === 'enabled'
                                                                ? u.anniversaryAutomationEnabled
                                                                : !u.anniversaryAutomationEnabled;
                                                        const matchType =
                                                            filterClientType === 'all'
                                                                ? true
                                                                : filterClientType === 'UNVERIFIED'
                                                                ? !u.clientType
                                                                : u.clientType === filterClientType;
                                                        return matchSearch && matchAuto && matchType;
                                                    })
                                                    .map(u => {
                                                        const dto: AnniversaryClientDto = {
                                                            userId: u.userId,
                                                            clientType: u.clientType || undefined,
                                                            fullName: u.fullName,
                                                            companyName: u.companyName,
                                                            contactPersonName: u.contactPersonName,
                                                            phone: u.phone,
                                                            formationDate: u.formationDate,
                                                            anniversaryAutomationEnabled: !!u.anniversaryAutomationEnabled,
                                                            whatsappConsentGiven: !!u.whatsappConsentGiven,
                                                            yearsCompleted: 0,
                                                            anniversaryToday: false,
                                                        };

                                                        const isToggling = !!togglingMap[u.userId];
                                                        const isIndividual = u.clientType === 'INDIVIDUAL';
                                                        const isCompany = u.clientType === 'COMPANY';
                                                        const isUnverified = !u.clientType;

                                                        return (
                                                            <tr key={u.userId} className="hover:bg-white/[0.02] transition-colors">
                                                                {/* Client */}
                                                                <td className="py-3.5 px-4">
                                                                    <div className="text-white font-medium text-xs">
                                                                        {isIndividual
                                                                            ? (u.fullName || u.userId)
                                                                            : (u.companyName || u.fullName || u.userId)}
                                                                    </div>
                                                                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                                                                        <span>@{u.userId}</span>
                                                                        {isCompany && u.contactPersonName && (
                                                                            <span>• Contact: {u.contactPersonName}</span>
                                                                        )}
                                                                        {u.email && <span>• {u.email}</span>}
                                                                    </div>
                                                                </td>

                                                                {/* Client Type */}
                                                                <td className="py-3.5 px-4">
                                                                    {isCompany ? (
                                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                                                                            <Building2 className="w-3 h-3 text-cyan-400" /> Company
                                                                        </span>
                                                                    ) : isIndividual ? (
                                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/15 border border-purple-500/30 text-purple-300">
                                                                            <User className="w-3 h-3 text-purple-400" /> Individual
                                                                        </span>
                                                                    ) : (
                                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/15 border border-amber-500/30 text-amber-300">
                                                                            <AlertTriangle className="w-3 h-3 text-amber-400" /> Unverified
                                                                        </span>
                                                                    )}
                                                                </td>

                                                                {/* Formation Date */}
                                                                <td className="py-3.5 px-4">
                                                                    {isIndividual ? (
                                                                        <span className="text-xs text-slate-500 italic">Excluded (Individual)</span>
                                                                    ) : u.formationDate ? (
                                                                        <span className="text-xs text-slate-300 font-medium">
                                                                            {formatDate(u.formationDate)}
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-xs text-slate-600 italic">Not configured</span>
                                                                    )}
                                                                </td>

                                                                {/* Automation */}
                                                                <td className="py-3.5 px-4">
                                                                    {isIndividual ? (
                                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800/60 border border-slate-700/50 text-slate-500">
                                                                            Excluded
                                                                        </span>
                                                                    ) : isUnverified ? (
                                                                        <button
                                                                            onClick={() => handleOpenEditSettings(dto)}
                                                                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 border border-amber-500/25 text-amber-300 hover:bg-amber-500/20 cursor-pointer transition-colors"
                                                                        >
                                                                            <AlertTriangle className="w-3 h-3 text-amber-400" /> Verify Type
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => handleToggleAutomation(dto)}
                                                                            disabled={isToggling}
                                                                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                                                                                u.anniversaryAutomationEnabled
                                                                                    ? 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                                                                                    : 'bg-slate-500/10 border-slate-500/20 text-slate-400'
                                                                            }`}
                                                                        >
                                                                            {isToggling ? (
                                                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                                            ) : u.anniversaryAutomationEnabled ? (
                                                                                <Check className="w-3 h-3 text-purple-400" />
                                                                            ) : (
                                                                                <X className="w-3 h-3 text-slate-500" />
                                                                            )}
                                                                            {u.anniversaryAutomationEnabled ? 'Enabled' : 'Disabled'}
                                                                        </button>
                                                                    )}
                                                                </td>

                                                                {/* Consent */}
                                                                <td className="py-3.5 px-4">
                                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                                                                        u.whatsappConsentGiven
                                                                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
                                                                            : 'bg-slate-500/10 border border-slate-500/20 text-slate-400'
                                                                    }`}>
                                                                        {u.whatsappConsentGiven ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-500" />}
                                                                        {u.whatsappConsentGiven ? 'Consent Given' : 'No Consent'}
                                                                    </span>
                                                                </td>

                                                                {/* Phone */}
                                                                <td className="py-3.5 px-4">
                                                                    <span className="text-xs font-mono text-slate-300">
                                                                        {maskPhoneNumber(u.phone)}
                                                                    </span>
                                                                </td>

                                                                {/* Action */}
                                                                <td className="py-3.5 px-4 text-right">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        onClick={() => handleOpenEditSettings(dto)}
                                                                        className="h-8 px-2.5 text-xs text-slate-300 hover:text-white hover:bg-white/[0.08]"
                                                                    >
                                                                        <SlidersHorizontal className="w-3.5 h-3.5 mr-1 text-slate-400" />
                                                                        Edit Settings
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
                );
            })()}

            {/* ── MODAL: Send Test Greeting ─────────────────────────────────── */}
            <AnimatePresence>
                {testSendModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-lg bg-[#0e1628] border border-white/[0.12] rounded-2xl shadow-2xl p-6 overflow-hidden relative"
                        >
                            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-white">Send WhatsApp Test Greeting</h3>
                                        <p className="text-xs text-slate-400">Test Meta WhatsApp Cloud API template dispatch</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setTestSendModalOpen(false)}
                                    className="text-slate-400 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSendTestGreeting} className="space-y-4 mt-4">
                                {testError && (
                                    <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                        <span>{testError}</span>
                                    </div>
                                )}

                                {testResult && (
                                    <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                                        <span>{testResult}</span>
                                    </div>
                                )}

                                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs">
                                    <strong className="font-semibold">Notice:</strong> This sends a real WhatsApp message using your configured Meta WhatsApp credentials. Test dispatch will not trigger the full daily scheduler or message existing clients.
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                        Recipient Phone Number *
                                    </label>
                                    <Input
                                        required
                                        placeholder="e.g. 9876543210 or +919876543210"
                                        value={testPhone}
                                        onChange={e => setTestPhone(e.target.value)}
                                        className="bg-white/[0.04] border-white/[0.08] text-white text-xs h-10 placeholder:text-slate-600 focus:border-cyan-500/50"
                                    />
                                    <p className="text-[11px] text-slate-500 mt-1">
                                        Must be registered or whitelisted in your Meta developer account if in sandbox mode.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                            Test Company Name
                                        </label>
                                        <Input
                                            value={testCompany}
                                            onChange={e => setTestCompany(e.target.value)}
                                            placeholder="Test Firm Technologies Pvt. Ltd."
                                            className="bg-white/[0.04] border-white/[0.08] text-white text-xs h-9 placeholder:text-slate-600 focus:border-cyan-500/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                            Test Contact Person
                                        </label>
                                        <Input
                                            value={testContact}
                                            onChange={e => setTestContact(e.target.value)}
                                            placeholder="Valued Client"
                                            className="bg-white/[0.04] border-white/[0.08] text-white text-xs h-9 placeholder:text-slate-600 focus:border-cyan-500/50"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                        Template Name (Optional override)
                                    </label>
                                    <Input
                                        value={testTemplate}
                                        onChange={e => setTestTemplate(e.target.value)}
                                        placeholder="Leave empty for backend default"
                                        className="bg-white/[0.04] border-white/[0.08] text-white text-xs h-9 placeholder:text-slate-600 focus:border-cyan-500/50"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setTestSendModalOpen(false)}
                                        className="text-xs text-slate-400 hover:text-white"
                                    >
                                        Close
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={sendingTest}
                                        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white text-xs font-medium shadow-md shadow-pink-500/20"
                                    >
                                        {sendingTest ? (
                                            <>
                                                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                                                Sending via Meta...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-3.5 h-3.5 mr-1.5" />
                                                Send Test Message
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── MODAL: Confirm Manual Send ────────────────────────────────── */}
            <AnimatePresence>
                {manualSendTarget && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md bg-[#0e1628] border border-white/[0.12] rounded-2xl shadow-2xl p-6"
                        >
                            <div className="flex items-center gap-3 pb-3 border-b border-white/[0.08]">
                                <div className="p-2.5 rounded-xl bg-pink-500/20 text-pink-400">
                                    <Send className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-white">Confirm Manual Greeting</h3>
                                    <p className="text-xs text-slate-400">Dispatch anniversary WhatsApp message</p>
                                </div>
                            </div>

                            <div className="py-4 space-y-3">
                                {manualSendError && (
                                    <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                        <span>{manualSendError}</span>
                                    </div>
                                )}

                                <p className="text-xs text-slate-300 leading-relaxed">
                                    Are you sure you want to send the company anniversary WhatsApp greeting to:
                                </p>

                                <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-400">Company:</span>
                                        <strong className="text-white font-medium">{manualSendTarget.companyName || manualSendTarget.fullName}</strong>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-400">Contact Person:</span>
                                        <span className="text-slate-200">{manualSendTarget.contactPersonName || manualSendTarget.fullName}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-400">WhatsApp Phone:</span>
                                        <span className="font-mono text-emerald-400">{maskPhoneNumber(manualSendTarget.phone)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-400">Milestone:</span>
                                        <span className="text-pink-300 font-semibold">{getOrdinalSuffix(manualSendTarget.yearsCompleted)} Anniversary</span>
                                    </div>
                                </div>

                                {manualSendTarget.latestNotificationStatus && ['ACCEPTED', 'DELIVERED', 'READ'].includes(manualSendTarget.latestNotificationStatus.toUpperCase()) && (
                                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2">
                                        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                                        <span>
                                            <strong>Warning:</strong> A message was already accepted or delivered for this client in the current anniversary year. Backend duplicate protection may prevent re-sending.
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
                                <Button
                                    variant="ghost"
                                    onClick={() => setManualSendTarget(null)}
                                    className="text-xs text-slate-400 hover:text-white"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleConfirmManualSend}
                                    disabled={sendingManual}
                                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white text-xs font-medium shadow-md shadow-pink-500/20"
                                >
                                    {sendingManual ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                                            Dispatching...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-3.5 h-3.5 mr-1.5" />
                                            Send Real WhatsApp Message
                                        </>
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── MODAL: Trigger Scheduler Now ──────────────────────────────── */}
            <AnimatePresence>
                {triggerSchedulerModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md bg-[#0e1628] border border-white/[0.12] rounded-2xl shadow-2xl p-6"
                        >
                            <div className="flex items-center gap-3 pb-3 border-b border-white/[0.08]">
                                <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
                                    <Play className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-white">Trigger Anniversary Scheduler</h3>
                                    <p className="text-xs text-slate-400">Run today&apos;s daily job on-demand</p>
                                </div>
                            </div>

                            <div className="py-4 space-y-3">
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    This will trigger the Spring Boot anniversary scheduler immediately for today&apos;s business date.
                                </p>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Clients whose formation date matches today and who have active automation, valid phone numbers, and WhatsApp consent will be processed. Idempotency guarantees clients will not be messaged twice in the same year.
                                </p>

                                {schedulerResult && (
                                    <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-1.5 text-xs">
                                        <div className="text-purple-300 font-semibold">Execution Summary:</div>
                                        <div className="text-slate-300">Clients Checked: <strong className="text-white">{schedulerResult.clientsChecked}</strong></div>
                                        <div className="text-slate-300">Eligible Clients: <strong className="text-emerald-400">{schedulerResult.eligibleCount}</strong></div>
                                        <div className="text-slate-300">Processed: <strong className="text-cyan-400">{schedulerResult.processedCount}</strong></div>
                                        <div className="text-slate-300">Execution Time: <strong className="text-slate-200">{schedulerResult.executionTimeMs} ms</strong></div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setTriggerSchedulerModalOpen(false);
                                        setSchedulerResult(null);
                                    }}
                                    className="text-xs text-slate-400 hover:text-white"
                                >
                                    Close
                                </Button>
                                <Button
                                    onClick={handleTriggerSchedulerNow}
                                    disabled={triggeringScheduler}
                                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white text-xs font-medium shadow-md shadow-purple-500/20"
                                >
                                    {triggeringScheduler ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                                            Running Job...
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-3.5 h-3.5 mr-1.5" />
                                            Run Job Now
                                        </>
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── MODAL: Edit Client Settings ───────────────────────────────── */}
            <AnimatePresence>
                {editSettingsClient && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md bg-[#0e1628] border border-white/[0.12] rounded-2xl shadow-2xl p-6"
                        >
                            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                                        <SlidersHorizontal className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-white">Anniversary Settings</h3>
                                        <p className="text-xs text-slate-400">{editSettingsClient.companyName || editSettingsClient.userId}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setEditSettingsClient(null)}
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

                                {!editSettingsClient.clientType && (
                                    <div className="p-3 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2">
                                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
                                        <div>
                                            <div className="font-semibold text-amber-300">Legacy Record</div>
                                            <div className="text-[11px] text-amber-200/80">Please select whether this client is a Company / Firm or an Individual.</div>
                                        </div>
                                    </div>
                                )}

                                {/* Client Type Selector */}
                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                        Client Type *
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setEditClientType('COMPANY')}
                                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                                editClientType === 'COMPANY'
                                                    ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-200 shadow-sm shadow-cyan-500/10'
                                                    : 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-slate-200'
                                            }`}
                                        >
                                            <div className="flex items-center gap-1.5 font-medium text-xs">
                                                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                                                Company / Firm
                                            </div>
                                            <p className="text-[10px] text-slate-400 mt-0.5">Eligible for anniversary greetings</p>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditClientType('INDIVIDUAL');
                                                setEditAutomationEnabled(false);
                                            }}
                                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                                editClientType === 'INDIVIDUAL'
                                                    ? 'bg-purple-500/15 border-purple-500/50 text-purple-200 shadow-sm shadow-purple-500/10'
                                                    : 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-slate-200'
                                            }`}
                                        >
                                            <div className="flex items-center gap-1.5 font-medium text-xs">
                                                <User className="w-3.5 h-3.5 text-purple-400" />
                                                Individual
                                            </div>
                                            <p className="text-[10px] text-slate-400 mt-0.5">Anniversaries excluded</p>
                                        </button>
                                    </div>
                                </div>

                                {editClientType === 'INDIVIDUAL' ? (
                                    <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-200 text-xs flex items-start gap-2.5">
                                        <Info className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                                        <div className="leading-relaxed">
                                            <div className="font-semibold text-purple-300">Anniversaries Excluded</div>
                                            <p className="mt-0.5 text-purple-200/80">
                                                Individual clients do not have a company formation date and cannot receive automated company anniversary greetings. Formation date and automation are disabled.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                                Company Formation Date
                                            </label>
                                            <Input
                                                type="date"
                                                value={editFormationDate}
                                                onChange={e => setEditFormationDate(e.target.value)}
                                                className="bg-white/[0.04] border-white/[0.08] text-white text-xs h-10 focus:border-cyan-500/50"
                                            />
                                            <p className="text-[11px] text-slate-500 mt-1">
                                                The company will receive an annual WhatsApp greeting on the anniversary of this date, subject to eligibility and consent.
                                            </p>
                                        </div>

                                        <div className="space-y-3 pt-2">
                                            {/* Enable Automation Toggle */}
                                            <label className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] cursor-pointer hover:bg-white/[0.05] transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={editAutomationEnabled}
                                                    onChange={e => setEditAutomationEnabled(e.target.checked)}
                                                    className="mt-0.5 rounded border-white/20 bg-white/10 text-pink-500 focus:ring-0"
                                                />
                                                <div>
                                                    <div className="text-xs font-semibold text-white">
                                                        Enable automatic anniversary greetings
                                                    </div>
                                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                                        Automatically send annual greetings on the company formation anniversary date via Meta WhatsApp.
                                                    </p>
                                                </div>
                                            </label>
                                        </div>
                                    </>
                                )}

                                <div className="pt-1">
                                    {/* WhatsApp Consent Toggle */}
                                    <label className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] cursor-pointer hover:bg-white/[0.05] transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={editConsentGiven}
                                            onChange={e => setEditConsentGiven(e.target.checked)}
                                            className="mt-0.5 rounded border-white/20 bg-white/10 text-emerald-500 focus:ring-0"
                                        />
                                        <div>
                                            <div className="text-xs font-semibold text-white">
                                                WhatsApp communication consent confirmed
                                            </div>
                                            <p className="text-[11px] text-slate-400 mt-0.5">
                                                Client has consented to receive notifications via WhatsApp.
                                            </p>
                                        </div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setEditSettingsClient(null)}
                                        className="text-xs text-slate-400 hover:text-white"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={savingSettings}
                                        className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 text-white text-xs font-medium shadow-md shadow-blue-500/20"
                                    >
                                        {savingSettings ? (
                                            <>
                                                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            'Save Settings'
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
