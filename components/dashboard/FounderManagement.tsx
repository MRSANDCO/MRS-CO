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
    Info,
    Loader2,
    PartyPopper,
    AlertTriangle,
    Eye,
    Plus,
    Trash2,
    Edit,
    Cake,
    Crown,
    Play,
    MessageCircle,
    BadgeCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
    getAllUsers,
    createFounder,
    getFoundersByCompany,
    updateFounder,
    setFounderBirthdayGreeting,
    setFounderActive,
    deleteFounder,
    getTodayBirthdayFounders,
    getUpcomingBirthdayFounders,
    triggerBirthdayJobNow,
    triggerBirthdayForFounder,
    sendTestBirthdayGreeting,
    getBirthdayNotificationHistory,
    getBirthdayNotificationLog,
    type Founder,
    type FounderRequest,
    type FounderBirthdayTriggerSummary,
    type FounderTestSendResponse,
    type AnniversaryNotificationLog,
    type UserProfile,
} from '@/lib/api';
import { Interactive3DEmptyState } from '@/components/dashboard/Interactive3DEmptyState';
import { CardTilt3D } from '@/components/dashboard/CardTilt3D';
import { Tactile3DButton } from '@/components/dashboard/Tactile3DButton';

// ─── Date-Only Helpers (Zero Timezone Shift) ──────────────────────────────────

/**
 * Safely parse YYYY-MM-DD components without timezone conversion.
 */
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

/**
 * Format a date-only string without timezone shift (e.g. "15 Jun 1980").
 */
function formatDateOnly(dateStr?: string): string {
    const parts = parseIsoDateParts(dateStr);
    if (!parts) return dateStr || '—';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = months[parts.month - 1] || `${parts.month}`;
    return `${parts.day} ${monthName} ${parts.year}`;
}

/**
 * Format day and month without year (e.g. "15 Jun").
 */
function formatBirthdayDate(month: number, day: number): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = months[month - 1] || `${month}`;
    return `${day} ${monthName}`;
}

/**
 * Calculate age turning or current age without timezone shift.
 */
function calculateAge(dateOfBirth?: string, targetYear?: number): number | null {
    const parts = parseIsoDateParts(dateOfBirth);
    if (!parts) return null;
    const currentYear = targetYear || new Date().getFullYear();
    const age = currentYear - parts.year;
    return age >= 0 ? age : null;
}

/**
 * Days remaining until next birthday based on calendar day difference.
 */
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
            second: '2-digit',
        });
    } catch {
        return dateTimeStr;
    }
}

// ─── Status Badge Component ──────────────────────────────────────────────────

function NotificationStatusBadge({ status }: { status?: string }) {
    if (!status) {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500/10 border border-slate-500/20 text-slate-400">
                <Clock className="w-3 h-3" /> Unknown
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
                    <Check className="w-3 h-3 text-cyan-400" /> Accepted by WhatsApp API
                </span>
            );
        case 'PROCESSING':
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                    <Loader2 className="w-3 h-3 animate-spin text-cyan-400" /> Processing
                </span>
            );
        case 'RETRY_PENDING':
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                    <Clock className="w-3 h-3 text-amber-400" /> Retry Pending
                </span>
            );
        case 'AMBIGUOUS':
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-500/15 border border-yellow-500/30 text-yellow-300">
                    <AlertTriangle className="w-3 h-3 text-yellow-400" /> Requires Verification
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

// ─── Main FounderManagement Component ─────────────────────────────────────────

export default function FounderManagement() {
    // Top-level navigation tabs
    const [activeTab, setActiveTab] = useState<'company-founders' | 'today' | 'upcoming' | 'history'>('company-founders');

    // Feedback notifications
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // COMPANY clients list
    const [companies, setCompanies] = useState<UserProfile[]>([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');

    // Founders for the selected company
    const [companyFounders, setCompanyFounders] = useState<Founder[]>([]);
    const [loadingFounders, setLoadingFounders] = useState(false);

    // Today's birthdays
    const [todayBirthdays, setTodayBirthdays] = useState<Founder[]>([]);
    const [loadingToday, setLoadingToday] = useState(false);

    // Upcoming birthdays
    const [upcomingBirthdays, setUpcomingBirthdays] = useState<Founder[]>([]);
    const [upcomingDays, setUpcomingDays] = useState<number>(7);
    const [loadingUpcoming, setLoadingUpcoming] = useState(false);

    // History logs
    const [historyLogs, setHistoryLogs] = useState<AnniversaryNotificationLog[]>([]);
    const [historyPage, setHistoryPage] = useState<number>(0);
    const [historySize] = useState<number>(20);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [selectedLog, setSelectedLog] = useState<AnniversaryNotificationLog | null>(null);

    // Modals state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingFounder, setEditingFounder] = useState<Founder | null>(null);

    // Manual single trigger modal
    const [isTriggerModalOpen, setIsTriggerModalOpen] = useState(false);
    const [triggerFounder, setTriggerFounder] = useState<Founder | null>(null);
    const [triggerOverrideDate, setTriggerOverrideDate] = useState<string>('');
    const [triggeringSingle, setTriggeringSingle] = useState(false);

    // Test send modal
    const [isTestSendModalOpen, setIsTestSendModalOpen] = useState(false);
    const [testPhone, setTestPhone] = useState('');
    const [testFounderName, setTestFounderName] = useState('');
    const [testSending, setTestSending] = useState(false);
    const [testSendResult, setTestSendResult] = useState<FounderTestSendResponse | null>(null);

    // Trigger today job modal
    const [isTriggerJobModalOpen, setIsTriggerJobModalOpen] = useState(false);
    const [triggeringJob, setTriggeringJob] = useState(false);
    const [jobSummary, setJobSummary] = useState<FounderBirthdayTriggerSummary | null>(null);

    // Delete confirmation modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [founderToDelete, setFounderToDelete] = useState<Founder | null>(null);
    const [deletingFounder, setDeletingFounder] = useState(false);

    // Create/Edit form state
    const [formData, setFormData] = useState<{
        companyClientId: string;
        fullName: string;
        dateOfBirth: string; // YYYY-MM-DD
        whatsappNumber: string;
        active: boolean;
        birthdayGreetingEnabled: boolean;
        whatsappConsentGiven: boolean;
    }>({
        companyClientId: '',
        fullName: '',
        dateOfBirth: '',
        whatsappNumber: '',
        active: true,
        birthdayGreetingEnabled: false,
        whatsappConsentGiven: false,
    });
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [formValidationError, setFormValidationError] = useState<string | null>(null);

    // Toggling in-progress IDs for active/greeting
    const [togglingGreetingId, setTogglingGreetingId] = useState<string | null>(null);
    const [togglingActiveId, setTogglingActiveId] = useState<string | null>(null);

    // Clear feedback timer
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => setErrorMessage(null), 7000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    // ─── Data Loading ─────────────────────────────────────────────────────────

    // Fetch COMPANY clients
    const fetchCompanies = useCallback(async () => {
        try {
            const users = await getAllUsers();
            // Filter to active COMPANY clients
            const companyList = users.filter((u) => u.clientType === 'COMPANY');
            setCompanies(companyList);
            if (!selectedCompanyId && companyList.length > 0) {
                setSelectedCompanyId(companyList[0].userId);
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to fetch companies';
            setErrorMessage(msg);
        }
    }, [selectedCompanyId]);

    // Fetch founders for selected company
    const fetchFoundersForCompany = useCallback(async (companyClientId: string) => {
        if (!companyClientId) return;
        setLoadingFounders(true);
        try {
            const list = await getFoundersByCompany(companyClientId);
            setCompanyFounders(list);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to fetch founders for company';
            setErrorMessage(msg);
        } finally {
            setLoadingFounders(false);
        }
    }, []);

    // Fetch today's birthdays
    const fetchTodayBirthdays = useCallback(async () => {
        setLoadingToday(true);
        try {
            const list = await getTodayBirthdayFounders();
            setTodayBirthdays(list);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to fetch today's birthdays";
            setErrorMessage(msg);
        } finally {
            setLoadingToday(false);
        }
    }, []);

    // Fetch upcoming birthdays
    const fetchUpcomingBirthdays = useCallback(async (days: number) => {
        setLoadingUpcoming(true);
        try {
            const list = await getUpcomingBirthdayFounders(days);
            setUpcomingBirthdays(list);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to fetch upcoming birthdays';
            setErrorMessage(msg);
        } finally {
            setLoadingUpcoming(false);
        }
    }, []);

    // Fetch notification history
    const fetchNotificationHistory = useCallback(async (page: number) => {
        setLoadingHistory(true);
        try {
            const list = await getBirthdayNotificationHistory(page, historySize);
            setHistoryLogs(list);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to fetch notification history';
            setErrorMessage(msg);
        } finally {
            setLoadingHistory(false);
        }
    }, [historySize]);

    // Initial load
    useEffect(() => {
        fetchCompanies();
        fetchTodayBirthdays();
    }, [fetchCompanies, fetchTodayBirthdays]);

    // When company selection changes
    useEffect(() => {
        if (selectedCompanyId) {
            fetchFoundersForCompany(selectedCompanyId);
        }
    }, [selectedCompanyId, fetchFoundersForCompany]);

    // When tab changes
    useEffect(() => {
        if (activeTab === 'today') {
            fetchTodayBirthdays();
        } else if (activeTab === 'upcoming') {
            fetchUpcomingBirthdays(upcomingDays);
        } else if (activeTab === 'history') {
            fetchNotificationHistory(historyPage);
        }
    }, [activeTab, upcomingDays, historyPage, fetchTodayBirthdays, fetchUpcomingBirthdays, fetchNotificationHistory]);

    // Selected company details
    const selectedCompany = useMemo(() => {
        return companies.find((c) => c.userId === selectedCompanyId) || null;
    }, [companies, selectedCompanyId]);

    // Refresh active tab
    const handleRefresh = () => {
        if (activeTab === 'company-founders') {
            fetchCompanies();
            if (selectedCompanyId) fetchFoundersForCompany(selectedCompanyId);
        } else if (activeTab === 'today') {
            fetchTodayBirthdays();
        } else if (activeTab === 'upcoming') {
            fetchUpcomingBirthdays(upcomingDays);
        } else if (activeTab === 'history') {
            fetchNotificationHistory(historyPage);
        }
    };

    // ─── Form Handlers ────────────────────────────────────────────────────────

    const openCreateModal = () => {
        setFormValidationError(null);
        setFormData({
            companyClientId: selectedCompanyId || (companies[0]?.userId || ''),
            fullName: '',
            dateOfBirth: '',
            whatsappNumber: '',
            active: true,
            birthdayGreetingEnabled: true,
            whatsappConsentGiven: true,
        });
        setIsCreateModalOpen(true);
    };

    const openEditModal = (founder: Founder) => {
        setFormValidationError(null);
        setEditingFounder(founder);
        setFormData({
            companyClientId: founder.companyClientId,
            fullName: founder.fullName,
            dateOfBirth: founder.dateOfBirth,
            whatsappNumber: founder.whatsappNumber,
            active: founder.active,
            birthdayGreetingEnabled: founder.birthdayGreetingEnabled,
            whatsappConsentGiven: founder.whatsappConsentGiven,
        });
        setIsEditModalOpen(true);
    };

    const validateForm = (): boolean => {
        if (!formData.companyClientId) {
            setFormValidationError('Please select a company client.');
            return false;
        }
        if (!formData.fullName.trim()) {
            setFormValidationError("Founder's full legal name is required.");
            return false;
        }
        if (!formData.dateOfBirth) {
            setFormValidationError('Date of birth is required.');
            return false;
        }
        // Verify date is not in future
        const parts = parseIsoDateParts(formData.dateOfBirth);
        if (!parts) {
            setFormValidationError('Invalid date format. Use YYYY-MM-DD.');
            return false;
        }
        const today = new Date();
        const dobDate = new Date(parts.year, parts.month - 1, parts.day);
        if (dobDate > today) {
            setFormValidationError('Date of birth cannot be in the future.');
            return false;
        }

        const phoneDigits = formData.whatsappNumber.replace(/\D/g, '');
        if (phoneDigits.length < 10 || phoneDigits.length > 15) {
            setFormValidationError('WhatsApp number must have 10 to 15 digits including country code (e.g. 919876543210).');
            return false;
        }

        setFormValidationError(null);
        return true;
    };

    const handleCreateFounder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setFormSubmitting(true);
        try {
            const req: FounderRequest = {
                companyClientId: formData.companyClientId,
                fullName: formData.fullName.trim(),
                dateOfBirth: formData.dateOfBirth,
                whatsappNumber: formData.whatsappNumber.trim(),
                active: formData.active,
                birthdayGreetingEnabled: formData.birthdayGreetingEnabled,
                whatsappConsentGiven: formData.whatsappConsentGiven,
            };
            const res = await createFounder(req);
            setSuccessMessage(`Founder '${res.founder.fullName}' created successfully!`);
            setIsCreateModalOpen(false);
            if (formData.companyClientId === selectedCompanyId) {
                fetchFoundersForCompany(selectedCompanyId);
            } else {
                setSelectedCompanyId(formData.companyClientId);
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to create founder';
            setFormValidationError(msg);
        } finally {
            setFormSubmitting(false);
        }
    };

    const handleUpdateFounder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingFounder) return;
        if (!validateForm()) return;

        setFormSubmitting(true);
        try {
            const req: FounderRequest = {
                fullName: formData.fullName.trim(),
                dateOfBirth: formData.dateOfBirth,
                whatsappNumber: formData.whatsappNumber.trim(),
                active: formData.active,
                birthdayGreetingEnabled: formData.birthdayGreetingEnabled,
                whatsappConsentGiven: formData.whatsappConsentGiven,
            };
            const res = await updateFounder(editingFounder.id, req);
            setSuccessMessage(`Founder '${res.founder.fullName}' updated successfully!`);
            setIsEditModalOpen(false);
            setEditingFounder(null);
            fetchFoundersForCompany(selectedCompanyId);
            if (activeTab === 'today') fetchTodayBirthdays();
            if (activeTab === 'upcoming') fetchUpcomingBirthdays(upcomingDays);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to update founder';
            setFormValidationError(msg);
        } finally {
            setFormSubmitting(false);
        }
    };

    // ─── Toggle Greeting Preference ──────────────────────────────────────────

    const handleToggleGreeting = async (founder: Founder, nextVal: boolean) => {
        setTogglingGreetingId(founder.id);
        try {
            const res = await setFounderBirthdayGreeting(founder.id, nextVal);
            setSuccessMessage(res.message);
            // Optimistic in-place update
            setCompanyFounders((prev) =>
                prev.map((f) => (f.id === founder.id ? { ...f, birthdayGreetingEnabled: nextVal } : f))
            );
            setTodayBirthdays((prev) =>
                prev.map((f) => (f.id === founder.id ? { ...f, birthdayGreetingEnabled: nextVal } : f))
            );
            setUpcomingBirthdays((prev) =>
                prev.map((f) => (f.id === founder.id ? { ...f, birthdayGreetingEnabled: nextVal } : f))
            );
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to update greeting preference';
            setErrorMessage(msg);
        } finally {
            setTogglingGreetingId(null);
        }
    };

    // ─── Toggle Active Status ────────────────────────────────────────────────

    const handleToggleActive = async (founder: Founder, nextVal: boolean) => {
        setTogglingActiveId(founder.id);
        try {
            const res = await setFounderActive(founder.id, nextVal);
            setSuccessMessage(res.message);
            // Optimistic update
            setCompanyFounders((prev) =>
                prev.map((f) =>
                    f.id === founder.id
                        ? {
                              ...f,
                              active: nextVal,
                              birthdayGreetingEnabled: nextVal ? f.birthdayGreetingEnabled : false,
                          }
                        : f
                )
            );
            if (activeTab === 'today') fetchTodayBirthdays();
            if (activeTab === 'upcoming') fetchUpcomingBirthdays(upcomingDays);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to update active status';
            setErrorMessage(msg);
        } finally {
            setTogglingActiveId(null);
        }
    };

    // ─── Delete Founder ──────────────────────────────────────────────────────

    const confirmDeleteFounder = async () => {
        if (!founderToDelete) return;
        setDeletingFounder(true);
        try {
            const res = await deleteFounder(founderToDelete.id);
            setSuccessMessage(res.message);
            setIsDeleteModalOpen(false);
            setFounderToDelete(null);
            fetchFoundersForCompany(selectedCompanyId);
            if (activeTab === 'today') fetchTodayBirthdays();
            if (activeTab === 'upcoming') fetchUpcomingBirthdays(upcomingDays);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to delete founder';
            setErrorMessage(msg);
        } finally {
            setDeletingFounder(false);
        }
    };

    // ─── Manual Trigger for Single Founder ────────────────────────────────────

    const openTriggerModal = (founder: Founder) => {
        setTriggerFounder(founder);
        setTriggerOverrideDate('');
        setIsTriggerModalOpen(true);
    };

    const handleTriggerSingleGreeting = async () => {
        if (!triggerFounder) return;
        setTriggeringSingle(true);
        try {
            const res = await triggerBirthdayForFounder(
                triggerFounder.id,
                triggerOverrideDate ? triggerOverrideDate : undefined
            );
            setSuccessMessage(
                `Birthday greeting dispatched successfully! Status: ${res.notificationLog.status}`
            );
            setIsTriggerModalOpen(false);
            setTriggerFounder(null);
            // Refresh history
            fetchNotificationHistory(0);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to trigger greeting';
            setErrorMessage(msg);
        } finally {
            setTriggeringSingle(false);
        }
    };

    // ─── Test Send Handler ────────────────────────────────────────────────────

    const handleSendTestGreeting = async (e: React.FormEvent) => {
        e.preventDefault();
        const digits = testPhone.replace(/\D/g, '');
        if (digits.length < 10 || digits.length > 15) {
            setErrorMessage('Recipient phone must be 10 to 15 digits including country code.');
            return;
        }

        setTestSending(true);
        setTestSendResult(null);
        try {
            const res = await sendTestBirthdayGreeting({
                recipientPhone: digits,
                founderName: testFounderName.trim() || undefined,
            });
            setTestSendResult(res);
            setSuccessMessage(res.message || 'Test message accepted by Meta API!');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Test send failed';
            setErrorMessage(msg);
        } finally {
            setTestSending(false);
        }
    };

    // ─── Scheduler Trigger Handler ───────────────────────────────────────────

    const handleTriggerJobNow = async () => {
        setTriggeringJob(true);
        setJobSummary(null);
        try {
            const res = await triggerBirthdayJobNow();
            setJobSummary(res.summary);
            setSuccessMessage(`Birthday job completed: ${res.summary.dispatched} dispatched!`);
            fetchTodayBirthdays();
            fetchNotificationHistory(0);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to run birthday job';
            setErrorMessage(msg);
        } finally {
            setTriggeringJob(false);
        }
    };

    // ─── View Single Log Details ─────────────────────────────────────────────

    const openLogDetails = async (logId: string) => {
        try {
            const log = await getBirthdayNotificationLog(logId);
            setSelectedLog(log);
        } catch {
            const fallback = historyLogs.find((l) => l.id === logId);
            if (fallback) setSelectedLog(fallback);
        }
    };

    return (
        <div className="space-y-6">
            {/* ── Top Header Banner ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/[0.06] rounded-full blur-[100px] pointer-events-none" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center">
                            <Crown className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                                Founder Birthday Management
                                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                                    WhatsApp Cloud API
                                </span>
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-400">
                                Manage founders per company client, automated WhatsApp birthday greetings, scheduler controls & audit logs.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex flex-wrap items-center gap-2.5">
                    <Tactile3DButton
                        onClick={() => {
                            setTestSendResult(null);
                            setIsTestSendModalOpen(true);
                        }}
                        className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs px-3.5 py-2"
                    >
                        <Send className="w-3.5 h-3.5 mr-1.5" />
                        Test Send
                    </Tactile3DButton>

                    <Tactile3DButton
                        onClick={() => {
                            setJobSummary(null);
                            setIsTriggerJobModalOpen(true);
                        }}
                        className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs px-3.5 py-2"
                    >
                        <Play className="w-3.5 h-3.5 mr-1.5 fill-amber-300" />
                        Run Today&apos;s Job
                    </Tactile3DButton>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        className="border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.06] text-xs h-9 px-3"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </div>

            {/* ── Feedback Banners ── */}
            <AnimatePresence>
                {successMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm"
                    >
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span className="flex-1">{successMessage}</span>
                        <button
                            onClick={() => setSuccessMessage(null)}
                            className="text-emerald-400 hover:text-emerald-200"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
                {errorMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm"
                    >
                        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                        <span className="flex-1">{errorMessage}</span>
                        <button
                            onClick={() => setErrorMessage(null)}
                            className="text-red-400 hover:text-red-200"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Key Metrics Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <CardTilt3D intensity={6}>
                    <Card className="bg-slate-900/60 border-white/[0.08] backdrop-blur-xl hover:border-amber-500/30 transition-all">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Today&apos;s Birthdays</p>
                                <p className="text-2xl font-bold text-white mt-1">{todayBirthdays.length}</p>
                                <p className="text-[11px] text-amber-400/80 mt-0.5">Eligible for automated dispatch</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                <Cake className="w-5 h-5 text-amber-400" />
                            </div>
                        </CardContent>
                    </Card>
                </CardTilt3D>

                <CardTilt3D intensity={6}>
                    <Card className="bg-slate-900/60 border-white/[0.08] backdrop-blur-xl hover:border-blue-500/30 transition-all">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Upcoming ({upcomingDays} Days)</p>
                                <p className="text-2xl font-bold text-white mt-1">{upcomingBirthdays.length}</p>
                                <p className="text-[11px] text-blue-400/80 mt-0.5">Next in queue</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-blue-400" />
                            </div>
                        </CardContent>
                    </Card>
                </CardTilt3D>

                <CardTilt3D intensity={6}>
                    <Card className="bg-slate-900/60 border-white/[0.08] backdrop-blur-xl hover:border-purple-500/30 transition-all">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Company Clients</p>
                                <p className="text-2xl font-bold text-white mt-1">{companies.length}</p>
                                <p className="text-[11px] text-purple-400/80 mt-0.5">Registered company entities</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-purple-400" />
                            </div>
                        </CardContent>
                    </Card>
                </CardTilt3D>

                <CardTilt3D intensity={6}>
                    <Card className="bg-slate-900/60 border-white/[0.08] backdrop-blur-xl hover:border-emerald-500/30 transition-all">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Notification Logs</p>
                                <p className="text-2xl font-bold text-white mt-1">{historyLogs.length}</p>
                                <p className="text-[11px] text-emerald-400/80 mt-0.5">Audit history available</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                <BadgeCheck className="w-5 h-5 text-emerald-400" />
                            </div>
                        </CardContent>
                    </Card>
                </CardTilt3D>
            </div>

            {/* ── Navigation Tabs ── */}
            <div className="flex border-b border-white/[0.08] overflow-x-auto gap-2">
                <button
                    onClick={() => setActiveTab('company-founders')}
                    className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                        activeTab === 'company-founders'
                            ? 'border-amber-400 text-amber-300 bg-amber-500/[0.04]'
                            : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                >
                    <Building2 className="w-4 h-4" />
                    Company Founders
                    {selectedCompany && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-300">
                            {companyFounders.length}
                        </span>
                    )}
                </button>

                <button
                    onClick={() => setActiveTab('today')}
                    className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                        activeTab === 'today'
                            ? 'border-amber-400 text-amber-300 bg-amber-500/[0.04]'
                            : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                >
                    <PartyPopper className="w-4 h-4" />
                    Today&apos;s Birthdays
                    {todayBirthdays.length > 0 && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold animate-pulse">
                            {todayBirthdays.length}
                        </span>
                    )}
                </button>

                <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                        activeTab === 'upcoming'
                            ? 'border-amber-400 text-amber-300 bg-amber-500/[0.04]'
                            : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                >
                    <Calendar className="w-4 h-4" />
                    Upcoming Birthdays
                    {upcomingBirthdays.length > 0 && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold">
                            {upcomingBirthdays.length}
                        </span>
                    )}
                </button>

                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                        activeTab === 'history'
                            ? 'border-amber-400 text-amber-300 bg-amber-500/[0.04]'
                            : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                >
                    <Clock className="w-4 h-4" />
                    Notification History
                </button>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════════
                 TAB 1: COMPANY FOUNDERS
                 ═══════════════════════════════════════════════════════════════════════ */}
            {activeTab === 'company-founders' && (
                <div className="space-y-6">
                    {/* Company Client Selector Card */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-white/[0.08] backdrop-blur-xl">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1 max-w-md">
                                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                                    Select Company Client
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedCompanyId}
                                        onChange={(e) => setSelectedCompanyId(e.target.value)}
                                        className="w-full bg-slate-800/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled>Select a COMPANY client...</option>
                                        {companies.map((c) => (
                                            <option key={c.userId} value={c.userId}>
                                                {c.companyName || c.fullName} ({c.userId})
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                                        ▼
                                    </div>
                                </div>
                            </div>

                            {selectedCompany && (
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs">
                                        <span className="text-slate-400">Contact: </span>
                                        <span className="text-white font-medium">
                                            {selectedCompany.contactPersonName || selectedCompany.fullName || '—'}
                                        </span>
                                    </div>
                                    <div className="px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs">
                                        <span className="text-slate-400">Company ID: </span>
                                        <span className="text-amber-300 font-mono font-medium">{selectedCompany.userId}</span>
                                    </div>

                                    <Tactile3DButton
                                        onClick={openCreateModal}
                                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs px-4 py-2"
                                    >
                                        <Plus className="w-3.5 h-3.5 mr-1" />
                                        Add Founder
                                    </Tactile3DButton>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Founders List for Selected Company */}
                    {loadingFounders ? (
                        <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
                            <p className="text-sm">Loading founders for {selectedCompany?.companyName || selectedCompanyId}...</p>
                        </div>
                    ) : companyFounders.length === 0 ? (
                        <Interactive3DEmptyState
                            title="No founders registered yet"
                            subtitle={`Add founders for ${selectedCompany?.companyName || 'this company'} to enable automated birthday WhatsApp greetings.`}
                            actionLabel="Add First Founder"
                            onAction={openCreateModal}
                        />
                    ) : (
                        <div className="rounded-2xl border border-white/[0.08] overflow-hidden bg-slate-900/40 backdrop-blur-xl">
                            <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                    <Crown className="w-4 h-4 text-amber-400" />
                                    Founders of {selectedCompany?.companyName || selectedCompanyId}
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-300">
                                        {companyFounders.length}
                                    </span>
                                </h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={openCreateModal}
                                    className="text-xs text-amber-300 hover:text-amber-200 hover:bg-amber-500/10"
                                >
                                    <Plus className="w-3.5 h-3.5 mr-1" />
                                    Add Another Founder
                                </Button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs sm:text-sm">
                                    <thead className="bg-white/[0.02] text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/[0.06]">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold">Founder Name</th>
                                            <th className="px-4 py-3 font-semibold">Date of Birth</th>
                                            <th className="px-4 py-3 font-semibold">WhatsApp Number</th>
                                            <th className="px-4 py-3 font-semibold">Consent</th>
                                            <th className="px-4 py-3 font-semibold">Automation</th>
                                            <th className="px-4 py-3 font-semibold">Status</th>
                                            <th className="px-4 py-3 font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.04]">
                                        {companyFounders.map((founder) => {
                                            const age = calculateAge(founder.dateOfBirth);
                                            const daysUntil = calculateDaysUntilBirthday(founder.birthdayMonth, founder.birthdayDay);
                                            const isToday = daysUntil === 0;

                                            return (
                                                <tr
                                                    key={founder.id}
                                                    className="hover:bg-white/[0.02] transition-colors group"
                                                >
                                                    <td className="px-4 py-3.5">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/15 to-orange-500/15 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                                                                <User className="w-4 h-4 text-amber-300" />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-white flex items-center gap-1.5">
                                                                    {founder.fullName}
                                                                    {isToday && (
                                                                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                                                            Today! 🎂
                                                                        </span>
                                                                    )}
                                                                </p>
                                                                <p className="text-[11px] text-slate-500">
                                                                    Next: {formatBirthdayDate(founder.birthdayMonth, founder.birthdayDay)} ({daysUntil === 0 ? 'Today' : `in ${daysUntil}d`})
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                                        <div className="text-white font-medium">
                                                            {formatDateOnly(founder.dateOfBirth)}
                                                        </div>
                                                        {age !== null && (
                                                            <div className="text-[11px] text-slate-500">
                                                                Age: {age} yrs
                                                            </div>
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                                        <div className="flex items-center gap-1.5 text-white font-mono">
                                                            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                                                            <span>+{founder.whatsappNumber}</span>
                                                        </div>
                                                    </td>

                                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                                        {founder.whatsappConsentGiven ? (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                                                                <BadgeCheck className="w-3 h-3 text-emerald-400" />
                                                                Consent Given
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                                                                <AlertTriangle className="w-3 h-3 text-amber-400" />
                                                                Consent Missing
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                                        <button
                                                            onClick={() => handleToggleGreeting(founder, !founder.birthdayGreetingEnabled)}
                                                            disabled={togglingGreetingId === founder.id || !founder.active}
                                                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                                founder.birthdayGreetingEnabled ? 'bg-amber-500' : 'bg-slate-700'
                                                            } ${(!founder.active || togglingGreetingId === founder.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            title={founder.active ? 'Toggle greeting automation' : 'Founder is inactive'}
                                                        >
                                                            <span
                                                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                                                    founder.birthdayGreetingEnabled ? 'translate-x-4' : 'translate-x-0'
                                                                }`}
                                                            />
                                                        </button>
                                                        <span className="ml-2 text-[11px] text-slate-400">
                                                            {founder.birthdayGreetingEnabled ? 'Enabled' : 'Disabled'}
                                                        </span>
                                                    </td>

                                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                                        <button
                                                            onClick={() => handleToggleActive(founder, !founder.active)}
                                                            disabled={togglingActiveId === founder.id}
                                                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border transition-colors ${
                                                                founder.active
                                                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                                                                    : 'bg-slate-700/50 border-slate-600 text-slate-400 hover:bg-slate-700'
                                                            }`}
                                                        >
                                                            {togglingActiveId === founder.id ? (
                                                                <Loader2 className="w-3 h-3 animate-spin inline" />
                                                            ) : founder.active ? (
                                                                'Active'
                                                            ) : (
                                                                'Inactive'
                                                            )}
                                                        </button>
                                                    </td>

                                                    <td className="px-4 py-3.5 whitespace-nowrap text-right">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => openTriggerModal(founder)}
                                                                className="h-8 px-2 text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 text-xs"
                                                                title="Manually trigger greeting message"
                                                            >
                                                                <Send className="w-3.5 h-3.5 mr-1" />
                                                                Trigger
                                                            </Button>

                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => openEditModal(founder)}
                                                                className="h-8 px-2 text-slate-400 hover:text-blue-300 hover:bg-blue-500/10 text-xs"
                                                                title="Edit founder"
                                                            >
                                                                <Edit className="w-3.5 h-3.5" />
                                                            </Button>

                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setFounderToDelete(founder);
                                                                    setIsDeleteModalOpen(true);
                                                                }}
                                                                className="h-8 px-2 text-slate-400 hover:text-red-300 hover:bg-red-500/10 text-xs"
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
                        </div>
                    )}
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════════════
                 TAB 2: TODAY'S BIRTHDAYS
                 ═══════════════════════════════════════════════════════════════════════ */}
            {activeTab === 'today' && (
                <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-amber-500/[0.05] border border-amber-500/20 text-xs sm:text-sm text-amber-200/90 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                            <span>
                                Active founders celebrating birthdays today with WhatsApp greeting enabled and consent given.
                            </span>
                        </div>
                        <Button
                            size="sm"
                            onClick={() => {
                                setJobSummary(null);
                                setIsTriggerJobModalOpen(true);
                            }}
                            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs h-8"
                        >
                            <Play className="w-3 h-3 mr-1 fill-slate-950" />
                            Run Scheduler Now
                        </Button>
                    </div>

                    {loadingToday ? (
                        <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
                            <p className="text-sm">Scanning for today&apos;s birthdays...</p>
                        </div>
                    ) : todayBirthdays.length === 0 ? (
                        <Interactive3DEmptyState
                            title="No birthdays today"
                            subtitle="No active founders with greetings enabled celebrate their birthday on today's business date."
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {todayBirthdays.map((founder) => {
                                const ageTurning = calculateAge(founder.dateOfBirth);
                                return (
                                    <CardTilt3D key={founder.id} intensity={8}>
                                        <Card className="bg-gradient-to-br from-amber-500/[0.08] via-slate-900/80 to-slate-900/90 border border-amber-500/30 backdrop-blur-xl relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                                            <CardContent className="p-5 space-y-4">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                                            Birthday Today! 🎂
                                                        </span>
                                                        <h4 className="text-lg font-bold text-white mt-1.5">{founder.fullName}</h4>
                                                        <p className="text-xs text-slate-400 font-mono">
                                                            Company: {founder.companyClientId}
                                                        </p>
                                                    </div>
                                                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-xl">
                                                        🎁
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                                        <span className="text-slate-500 text-[10px] block">TURNING</span>
                                                        <span className="text-white font-bold text-sm">
                                                            {ageTurning !== null ? `${ageTurning} years` : '—'}
                                                        </span>
                                                    </div>
                                                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                                        <span className="text-slate-500 text-[10px] block">DOB</span>
                                                        <span className="text-white font-medium text-xs">
                                                            {formatDateOnly(founder.dateOfBirth)}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between text-xs">
                                                    <div className="flex items-center gap-1.5 font-mono text-slate-300">
                                                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                                                        +{founder.whatsappNumber}
                                                    </div>
                                                    <span className="text-[10px] text-emerald-400 font-medium">Consent Active</span>
                                                </div>

                                                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                                                    <span className="text-xs text-slate-400">Automated Scheduler Ready</span>
                                                    <Tactile3DButton
                                                        onClick={() => openTriggerModal(founder)}
                                                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3 py-1.5"
                                                    >
                                                        <Send className="w-3 h-3 mr-1" />
                                                        Trigger Now
                                                    </Tactile3DButton>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </CardTilt3D>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════════════
                 TAB 3: UPCOMING BIRTHDAYS
                 ═══════════════════════════════════════════════════════════════════════ */}
            {activeTab === 'upcoming' && (
                <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.08] backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                            <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0" />
                            <span>Showing founders with birthdays in the next</span>
                            <select
                                value={upcomingDays}
                                onChange={(e) => setUpcomingDays(parseInt(e.target.value, 10))}
                                className="bg-slate-800 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-blue-500 font-semibold"
                            >
                                <option value={7}>7 days</option>
                                <option value={14}>14 days</option>
                                <option value={30}>30 days</option>
                                <option value={60}>60 days</option>
                            </select>
                        </div>

                        <span className="text-xs text-slate-400">
                            Found: <strong className="text-white">{upcomingBirthdays.length}</strong> upcoming birthdays
                        </span>
                    </div>

                    {loadingUpcoming ? (
                        <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                            <p className="text-sm">Calculating upcoming birthdays...</p>
                        </div>
                    ) : upcomingBirthdays.length === 0 ? (
                        <Interactive3DEmptyState
                            title="No upcoming birthdays found"
                            subtitle={`No founders have birthdays in the next ${upcomingDays} days with active status and greeting enabled.`}
                        />
                    ) : (
                        <div className="rounded-2xl border border-white/[0.08] overflow-hidden bg-slate-900/40 backdrop-blur-xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs sm:text-sm">
                                    <thead className="bg-white/[0.02] text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/[0.06]">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold">Founder Name</th>
                                            <th className="px-4 py-3 font-semibold">Company Client</th>
                                            <th className="px-4 py-3 font-semibold">Birthday Date</th>
                                            <th className="px-4 py-3 font-semibold">Days Remaining</th>
                                            <th className="px-4 py-3 font-semibold">WhatsApp Number</th>
                                            <th className="px-4 py-3 font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.04]">
                                        {upcomingBirthdays.map((founder) => {
                                            const daysUntil = calculateDaysUntilBirthday(founder.birthdayMonth, founder.birthdayDay);
                                            const ageTurning = calculateAge(founder.dateOfBirth);

                                            return (
                                                <tr key={founder.id} className="hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-4 py-3.5">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center text-blue-300">
                                                                <User className="w-3.5 h-3.5" />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-white">{founder.fullName}</p>
                                                                <p className="text-[11px] text-slate-500">
                                                                    Age turning: {ageTurning !== null ? `${ageTurning} yrs` : '—'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                                        <span className="font-mono text-slate-300 font-medium">
                                                            {founder.companyClientId}
                                                        </span>
                                                    </td>

                                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                                        <div className="text-white font-medium">
                                                            {formatBirthdayDate(founder.birthdayMonth, founder.birthdayDay)}
                                                        </div>
                                                        <div className="text-[11px] text-slate-500">
                                                            Born {formatDateOnly(founder.dateOfBirth)}
                                                        </div>
                                                    </td>

                                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/25">
                                                            in {daysUntil} {daysUntil === 1 ? 'day' : 'days'}
                                                        </span>
                                                    </td>

                                                    <td className="px-4 py-3.5 whitespace-nowrap font-mono text-slate-300">
                                                        +{founder.whatsappNumber}
                                                    </td>

                                                    <td className="px-4 py-3.5 whitespace-nowrap text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => openTriggerModal(founder)}
                                                            className="h-8 px-2.5 text-xs text-amber-300 hover:text-amber-200 hover:bg-amber-500/10"
                                                        >
                                                            <Send className="w-3.5 h-3.5 mr-1" />
                                                            Test / Trigger
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════════════
                 TAB 4: NOTIFICATION HISTORY
                 ═══════════════════════════════════════════════════════════════════════ */}
            {activeTab === 'history' && (
                <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.08] backdrop-blur-xl flex items-center justify-between text-xs sm:text-sm">
                        <div className="flex items-center gap-2 text-slate-300">
                            <Clock className="w-4 h-4 text-emerald-400" />
                            <span>Audit log of dispatched founder birthday greetings (Meta WhatsApp API).</span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchNotificationHistory(historyPage)}
                            className="text-xs h-8 border-white/10"
                        >
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Refresh Logs
                        </Button>
                    </div>

                    {loadingHistory ? (
                        <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                            <p className="text-sm">Loading notification history...</p>
                        </div>
                    ) : historyLogs.length === 0 ? (
                        <Interactive3DEmptyState
                            title="No birthday notification logs yet"
                            subtitle="Dispatched WhatsApp birthday greetings will appear here with delivery timestamps, status updates, and Meta Message IDs."
                        />
                    ) : (
                        <div className="rounded-2xl border border-white/[0.08] overflow-hidden bg-slate-900/40 backdrop-blur-xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs sm:text-sm">
                                    <thead className="bg-white/[0.02] text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/[0.06]">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold">Founder / Company</th>
                                            <th className="px-4 py-3 font-semibold">Recipient Phone</th>
                                            <th className="px-4 py-3 font-semibold">Birthday Year</th>
                                            <th className="px-4 py-3 font-semibold">Status</th>
                                            <th className="px-4 py-3 font-semibold">Triggered By</th>
                                            <th className="px-4 py-3 font-semibold">Timestamp</th>
                                            <th className="px-4 py-3 font-semibold text-right">Details</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.04]">
                                        {historyLogs.map((log) => (
                                            <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="px-4 py-3.5">
                                                    <div>
                                                        <p className="font-semibold text-white">{log.contactPersonName || log.companyName}</p>
                                                        <p className="text-[11px] text-slate-500 font-mono">
                                                            Company ID: {log.userDocId || '—'}
                                                        </p>
                                                    </div>
                                                </td>

                                                <td className="px-4 py-3.5 whitespace-nowrap font-mono text-slate-300">
                                                    +{log.recipientPhone}
                                                </td>

                                                <td className="px-4 py-3.5 whitespace-nowrap">
                                                    <span className="font-mono text-amber-300 font-medium">
                                                        {log.anniversaryYear}
                                                    </span>
                                                </td>

                                                <td className="px-4 py-3.5 whitespace-nowrap">
                                                    <NotificationStatusBadge status={log.status} />
                                                </td>

                                                <td className="px-4 py-3.5 whitespace-nowrap">
                                                    <span className="text-[11px] px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/[0.06]">
                                                        {log.triggeredBy || (log.manualTrigger ? 'ADMIN_MANUAL' : 'SCHEDULER')}
                                                    </span>
                                                </td>

                                                <td className="px-4 py-3.5 whitespace-nowrap text-slate-400 text-xs">
                                                    {formatDateTime(log.createdAt || log.updatedAt)}
                                                </td>

                                                <td className="px-4 py-3.5 whitespace-nowrap text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openLogDetails(log.id)}
                                                        className="h-8 px-2 text-xs text-blue-300 hover:text-blue-200 hover:bg-blue-500/10"
                                                    >
                                                        <Eye className="w-3.5 h-3.5 mr-1" />
                                                        Inspect
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Controls */}
                            <div className="p-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                                <span>Page {historyPage + 1}</span>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setHistoryPage((p) => Math.max(0, p - 1))}
                                        disabled={historyPage === 0}
                                        className="h-8 px-2 border-white/10"
                                    >
                                        <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setHistoryPage((p) => p + 1)}
                                        disabled={historyLogs.length < historySize}
                                        className="h-8 px-2 border-white/10"
                                    >
                                        Next
                                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════════════
                 MODAL 1: CREATE FOUNDER
                 ═══════════════════════════════════════════════════════════════════════ */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-lg rounded-2xl bg-slate-900 border border-white/[0.1] shadow-2xl overflow-hidden"
                        >
                            <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <User className="w-4 h-4 text-amber-400" />
                                    Add Founder for Company
                                </h3>
                                <button
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="text-slate-400 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateFounder} className="p-5 space-y-4">
                                {formValidationError && (
                                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                                        <span>{formValidationError}</span>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                                        Company Client <span className="text-red-400">*</span>
                                    </label>
                                    <select
                                        value={formData.companyClientId}
                                        onChange={(e) => setFormData({ ...formData, companyClientId: e.target.value })}
                                        className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                                        required
                                    >
                                        <option value="" disabled>Select company client...</option>
                                        {companies.map((c) => (
                                            <option key={c.userId} value={c.userId}>
                                                {c.companyName || c.fullName} ({c.userId})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                                        Founder Full Legal Name <span className="text-red-400">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        placeholder="e.g. Ravi Shankar"
                                        className="bg-slate-800 border-white/10 text-white text-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                                        Date of Birth <span className="text-red-400">*</span> (Date-only, no timezone shift)
                                    </label>
                                    <Input
                                        type="date"
                                        value={formData.dateOfBirth}
                                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                        className="bg-slate-800 border-white/10 text-white text-sm"
                                        required
                                    />
                                    <p className="text-[11px] text-slate-500 mt-1">
                                        Standard ISO date (YYYY-MM-DD). Handled strictly date-only.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                                        WhatsApp Phone Number <span className="text-red-400">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        value={formData.whatsappNumber}
                                        onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                                        placeholder="e.g. 919876543210 (include country code)"
                                        className="bg-slate-800 border-white/10 text-white text-sm font-mono"
                                        required
                                    />
                                    <p className="text-[11px] text-slate-500 mt-1">
                                        Must include country code without leading &apos;+&apos; or spaces. 10–15 digits.
                                    </p>
                                </div>

                                <div className="space-y-3 pt-2 border-t border-white/[0.06]">
                                    <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.whatsappConsentGiven}
                                            onChange={(e) => setFormData({ ...formData, whatsappConsentGiven: e.target.checked })}
                                            className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-0 w-4 h-4"
                                        />
                                        <span>Founder has provided WhatsApp messaging consent (Required for delivery)</span>
                                    </label>

                                    <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.birthdayGreetingEnabled}
                                            onChange={(e) => setFormData({ ...formData, birthdayGreetingEnabled: e.target.checked })}
                                            className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-0 w-4 h-4"
                                        />
                                        <span>Enable automated birthday greeting for this founder</span>
                                    </label>

                                    <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.active}
                                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                            className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-0 w-4 h-4"
                                        />
                                        <span>Founder record is active</span>
                                    </label>
                                </div>

                                <div className="p-4 border-t border-white/[0.08] flex items-center justify-end gap-2 -mx-5 -mb-5 bg-slate-950/50">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="text-xs text-slate-400 hover:text-white"
                                    >
                                        Cancel
                                    </Button>
                                    <Tactile3DButton
                                        type="submit"
                                        disabled={formSubmitting}
                                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2"
                                    >
                                        {formSubmitting ? (
                                            <>
                                                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            'Create Founder'
                                        )}
                                    </Tactile3DButton>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ═══════════════════════════════════════════════════════════════════════
                 MODAL 2: EDIT FOUNDER
                 ═══════════════════════════════════════════════════════════════════════ */}
            <AnimatePresence>
                {isEditModalOpen && editingFounder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-lg rounded-2xl bg-slate-900 border border-white/[0.1] shadow-2xl overflow-hidden"
                        >
                            <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <Edit className="w-4 h-4 text-blue-400" />
                                    Edit Founder: {editingFounder.fullName}
                                </h3>
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

                            <form onSubmit={handleUpdateFounder} className="p-5 space-y-4">
                                {formValidationError && (
                                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                                        <span>{formValidationError}</span>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                                        Company Client ID
                                    </label>
                                    <Input
                                        type="text"
                                        value={editingFounder.companyClientId}
                                        disabled
                                        className="bg-slate-800/50 border-white/5 text-slate-400 text-sm font-mono cursor-not-allowed"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                                        Founder Full Legal Name <span className="text-red-400">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="bg-slate-800 border-white/10 text-white text-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                                        Date of Birth <span className="text-red-400">*</span> (Date-only)
                                    </label>
                                    <Input
                                        type="date"
                                        value={formData.dateOfBirth}
                                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                        className="bg-slate-800 border-white/10 text-white text-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                                        WhatsApp Phone Number <span className="text-red-400">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        value={formData.whatsappNumber}
                                        onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                                        className="bg-slate-800 border-white/10 text-white text-sm font-mono"
                                        required
                                    />
                                </div>

                                <div className="space-y-3 pt-2 border-t border-white/[0.06]">
                                    <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.whatsappConsentGiven}
                                            onChange={(e) => setFormData({ ...formData, whatsappConsentGiven: e.target.checked })}
                                            className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-0 w-4 h-4"
                                        />
                                        <span>Founder has provided WhatsApp messaging consent</span>
                                    </label>

                                    <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.birthdayGreetingEnabled}
                                            onChange={(e) => setFormData({ ...formData, birthdayGreetingEnabled: e.target.checked })}
                                            className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-0 w-4 h-4"
                                        />
                                        <span>Enable automated birthday greeting</span>
                                    </label>

                                    <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.active}
                                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                            className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-0 w-4 h-4"
                                        />
                                        <span>Founder record is active</span>
                                    </label>
                                </div>

                                <div className="p-4 border-t border-white/[0.08] flex items-center justify-end gap-2 -mx-5 -mb-5 bg-slate-950/50">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => {
                                            setIsEditModalOpen(false);
                                            setEditingFounder(null);
                                        }}
                                        className="text-xs text-slate-400 hover:text-white"
                                    >
                                        Cancel
                                    </Button>
                                    <Tactile3DButton
                                        type="submit"
                                        disabled={formSubmitting}
                                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2"
                                    >
                                        {formSubmitting ? (
                                            <>
                                                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                                                Updating...
                                            </>
                                        ) : (
                                            'Save Changes'
                                        )}
                                    </Tactile3DButton>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ═══════════════════════════════════════════════════════════════════════
                 MODAL 3: MANUAL TRIGGER SINGLE FOUNDER (WITH CONFIRMATION & WARNING)
                 ═══════════════════════════════════════════════════════════════════════ */}
            <AnimatePresence>
                {isTriggerModalOpen && triggerFounder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md rounded-2xl bg-slate-900 border border-amber-500/30 shadow-2xl overflow-hidden"
                        >
                            <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-amber-500/[0.06]">
                                <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                                    <Send className="w-4 h-4 text-amber-400" />
                                    Manual Birthday Greeting Dispatch
                                </h3>
                                <button
                                    onClick={() => {
                                        setIsTriggerModalOpen(false);
                                        setTriggerFounder(null);
                                    }}
                                    className="text-slate-400 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-5 space-y-4">
                                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs space-y-1.5">
                                    <div className="flex items-center gap-1.5 font-bold">
                                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                                        LIVE WHATSAPP DISPATCH WARNING
                                    </div>
                                    <p className="text-amber-200/90 leading-relaxed">
                                        This will immediately send a real WhatsApp birthday greeting via Meta Cloud API to
                                        the founder&apos;s registered phone number.
                                    </p>
                                </div>

                                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1.5 text-xs">
                                    <p className="text-slate-400">
                                        Founder: <strong className="text-white">{triggerFounder.fullName}</strong>
                                    </p>
                                    <p className="text-slate-400">
                                        Company Client: <strong className="text-white">{triggerFounder.companyClientId}</strong>
                                    </p>
                                    <p className="text-slate-400 font-mono">
                                        WhatsApp: <strong className="text-emerald-400">+{triggerFounder.whatsappNumber}</strong>
                                    </p>
                                    <p className="text-slate-400">
                                        Date of Birth: <strong className="text-white">{formatDateOnly(triggerFounder.dateOfBirth)}</strong>
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                                        Override Business Date (Optional, YYYY-MM-DD)
                                    </label>
                                    <Input
                                        type="date"
                                        value={triggerOverrideDate}
                                        onChange={(e) => setTriggerOverrideDate(e.target.value)}
                                        className="bg-slate-800 border-white/10 text-white text-sm"
                                    />
                                    <p className="text-[11px] text-slate-500 mt-1">
                                        Leave blank to use current business date. Useful for testing or backfill.
                                    </p>
                                </div>

                                <p className="text-[11px] text-slate-500 italic">
                                    Note: Exactly-once delivery per calendar year is enforced by the backend. If already sent,
                                    the dispatch will be safely rejected.
                                </p>
                            </div>

                            <div className="p-4 border-t border-white/[0.08] flex items-center justify-end gap-2 bg-slate-950/50">
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setIsTriggerModalOpen(false);
                                        setTriggerFounder(null);
                                    }}
                                    className="text-xs text-slate-400 hover:text-white"
                                >
                                    Cancel
                                </Button>
                                <Tactile3DButton
                                    onClick={handleTriggerSingleGreeting}
                                    disabled={triggeringSingle}
                                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2"
                                >
                                    {triggeringSingle ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                                            Dispatching...
                                        </>
                                    ) : (
                                        'Confirm & Send Greeting'
                                    )}
                                </Tactile3DButton>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ═══════════════════════════════════════════════════════════════════════
                 MODAL 4: TEST SEND BIRTHDAY MESSAGE (META WHATSAPP)
                 ═══════════════════════════════════════════════════════════════════════ */}
            <AnimatePresence>
                {isTestSendModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md rounded-2xl bg-slate-900 border border-blue-500/30 shadow-2xl overflow-hidden"
                        >
                            <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-blue-500/[0.06]">
                                <h3 className="text-base font-bold text-blue-300 flex items-center gap-2">
                                    <Send className="w-4 h-4 text-blue-400" />
                                    Test Send Birthday WhatsApp Greeting
                                </h3>
                                <button
                                    onClick={() => setIsTestSendModalOpen(false)}
                                    className="text-slate-400 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSendTestGreeting} className="p-5 space-y-4">
                                <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs space-y-1">
                                    <div className="font-bold flex items-center gap-1.5">
                                        <Info className="w-4 h-4" />
                                        SAFE TEST DISPATCH
                                    </div>
                                    <p className="text-blue-200/90">
                                        Sends the approved Meta template message directly without creating a database log.
                                        Use your own WhatsApp number to verify layout and parameters.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                                        Recipient Phone Number <span className="text-red-400">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        value={testPhone}
                                        onChange={(e) => setTestPhone(e.target.value)}
                                        placeholder="e.g. 919876543210 (with country code)"
                                        className="bg-slate-800 border-white/10 text-white text-sm font-mono"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                                        Founder Name Parameter (Optional)
                                    </label>
                                    <Input
                                        type="text"
                                        value={testFounderName}
                                        onChange={(e) => setTestFounderName(e.target.value)}
                                        placeholder="Defaults to 'Valued Founder'"
                                        className="bg-slate-800 border-white/10 text-white text-sm"
                                    />
                                </div>

                                {testSendResult && (
                                    <div
                                        className={`p-3.5 rounded-xl text-xs space-y-1 ${
                                            testSendResult.status === 'SUCCESS'
                                                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                                                : 'bg-red-500/10 border border-red-500/30 text-red-300'
                                        }`}
                                    >
                                        <p className="font-bold">
                                            Status: {testSendResult.status}
                                        </p>
                                        {testSendResult.metaMessageId && (
                                            <p className="font-mono text-[11px] break-all">
                                                Meta Message ID: {testSendResult.metaMessageId}
                                            </p>
                                        )}
                                        {testSendResult.errorMessage && (
                                            <p>Error: {testSendResult.errorMessage}</p>
                                        )}
                                        {testSendResult.note && (
                                            <p className="text-slate-400 italic mt-1">{testSendResult.note}</p>
                                        )}
                                    </div>
                                )}

                                <div className="p-4 border-t border-white/[0.08] flex items-center justify-end gap-2 -mx-5 -mb-5 bg-slate-950/50">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setIsTestSendModalOpen(false)}
                                        className="text-xs text-slate-400 hover:text-white"
                                    >
                                        Close
                                    </Button>
                                    <Tactile3DButton
                                        type="submit"
                                        disabled={testSending}
                                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2"
                                    >
                                        {testSending ? (
                                            <>
                                                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                                                Sending Test...
                                            </>
                                        ) : (
                                            'Send Test Message'
                                        )}
                                    </Tactile3DButton>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ═══════════════════════════════════════════════════════════════════════
                 MODAL 5: TRIGGER TODAY JOB NOW CONFIRMATION
                 ═══════════════════════════════════════════════════════════════════════ */}
            <AnimatePresence>
                {isTriggerJobModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md rounded-2xl bg-slate-900 border border-amber-500/30 shadow-2xl overflow-hidden"
                        >
                            <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-amber-500/[0.06]">
                                <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                                    <Play className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    Run Today&apos;s Birthday Greeting Job
                                </h3>
                                <button
                                    onClick={() => setIsTriggerJobModalOpen(false)}
                                    className="text-slate-400 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-5 space-y-4">
                                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs space-y-1.5">
                                    <div className="font-bold flex items-center gap-1.5">
                                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                                        SCHEDULER RUN CONFIRMATION
                                    </div>
                                    <p className="text-amber-200/90 leading-relaxed">
                                        This will immediately execute the birthday scheduler service for today&apos;s business date.
                                        It will query all active founders whose birthday is today (with greeting enabled and consent given),
                                        claim processing leases, and dispatch live WhatsApp greetings.
                                    </p>
                                </div>

                                {jobSummary && (
                                    <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] space-y-2 text-xs">
                                        <div className="font-bold text-white text-sm">Execution Summary</div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>Date: <strong className="text-amber-300">{jobSummary.executionDate}</strong></div>
                                            <div>Scanned: <strong className="text-white">{jobSummary.foundersScanned}</strong></div>
                                            <div>Eligible: <strong className="text-blue-300">{jobSummary.eligible}</strong></div>
                                            <div>Dispatched: <strong className="text-emerald-300">{jobSummary.dispatched}</strong></div>
                                            <div>Skipped / Failed: <strong className="text-slate-400">{jobSummary.skippedOrFailed}</strong></div>
                                            <div>Duration: <strong className="text-slate-400">{jobSummary.durationMillis} ms</strong></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t border-white/[0.08] flex items-center justify-end gap-2 bg-slate-950/50">
                                <Button
                                    variant="ghost"
                                    onClick={() => setIsTriggerJobModalOpen(false)}
                                    className="text-xs text-slate-400 hover:text-white"
                                >
                                    {jobSummary ? 'Close' : 'Cancel'}
                                </Button>
                                {!jobSummary && (
                                    <Tactile3DButton
                                        onClick={handleTriggerJobNow}
                                        disabled={triggeringJob}
                                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2"
                                    >
                                        {triggeringJob ? (
                                            <>
                                                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                                                Running Job...
                                            </>
                                        ) : (
                                            'Execute Scheduler Now'
                                        )}
                                    </Tactile3DButton>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ═══════════════════════════════════════════════════════════════════════
                 MODAL 6: DELETE FOUNDER CONFIRMATION
                 ═══════════════════════════════════════════════════════════════════════ */}
            <AnimatePresence>
                {isDeleteModalOpen && founderToDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md rounded-2xl bg-slate-900 border border-red-500/30 shadow-2xl overflow-hidden"
                        >
                            <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-red-500/[0.06]">
                                <h3 className="text-base font-bold text-red-300 flex items-center gap-2">
                                    <Trash2 className="w-4 h-4 text-red-400" />
                                    Delete Founder Record
                                </h3>
                                <button
                                    onClick={() => {
                                        setIsDeleteModalOpen(false);
                                        setFounderToDelete(null);
                                    }}
                                    className="text-slate-400 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-5 space-y-3 text-xs">
                                <p className="text-slate-300 leading-relaxed">
                                    Are you sure you want to delete founder{' '}
                                    <strong className="text-white">{founderToDelete.fullName}</strong> from company{' '}
                                    <strong className="text-white">{founderToDelete.companyClientId}</strong>?
                                </p>
                                <p className="text-slate-500">
                                    This action cannot be undone. Any historical WhatsApp notification logs will be retained
                                    for compliance auditing.
                                </p>
                            </div>

                            <div className="p-4 border-t border-white/[0.08] flex items-center justify-end gap-2 bg-slate-950/50">
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setIsDeleteModalOpen(false);
                                        setFounderToDelete(null);
                                    }}
                                    className="text-xs text-slate-400 hover:text-white"
                                >
                                    Cancel
                                </Button>
                                <Tactile3DButton
                                    onClick={confirmDeleteFounder}
                                    disabled={deletingFounder}
                                    className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2"
                                >
                                    {deletingFounder ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        'Confirm Delete'
                                    )}
                                </Tactile3DButton>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ═══════════════════════════════════════════════════════════════════════
                 MODAL 7: NOTIFICATION LOG DETAILS INSPECTOR
                 ═══════════════════════════════════════════════════════════════════════ */}
            <AnimatePresence>
                {selectedLog && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-lg rounded-2xl bg-slate-900 border border-white/[0.1] shadow-2xl overflow-hidden"
                        >
                            <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <Eye className="w-4 h-4 text-emerald-400" />
                                    Notification Log Audit
                                </h3>
                                <button
                                    onClick={() => setSelectedLog(null)}
                                    className="text-slate-400 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-5 space-y-3 text-xs max-h-[70vh] overflow-y-auto">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                    <span className="text-slate-400">Current Status</span>
                                    <NotificationStatusBadge status={selectedLog.status} />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                        <span className="text-slate-500 block text-[10px]">FOUNDER NAME</span>
                                        <span className="text-white font-medium">{selectedLog.contactPersonName || selectedLog.companyName}</span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                        <span className="text-slate-500 block text-[10px]">COMPANY CLIENT ID</span>
                                        <span className="text-white font-mono">{selectedLog.userDocId || '—'}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                        <span className="text-slate-500 block text-[10px]">RECIPIENT PHONE</span>
                                        <span className="text-emerald-400 font-mono">+{selectedLog.recipientPhone}</span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                        <span className="text-slate-500 block text-[10px]">BIRTHDAY YEAR</span>
                                        <span className="text-amber-300 font-mono">{selectedLog.anniversaryYear}</span>
                                    </div>
                                </div>

                                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                    <span className="text-slate-500 block text-[10px]">META MESSAGE ID</span>
                                    <span className="text-white font-mono break-all text-[11px]">
                                        {selectedLog.metaMessageId || 'Pending acceptance'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                        <span className="text-slate-500 block text-[10px]">ATTEMPT COUNT</span>
                                        <span className="text-white font-medium">
                                            {selectedLog.attemptCount} / {selectedLog.maxAttempts}
                                        </span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                        <span className="text-slate-500 block text-[10px]">TRIGGERED BY</span>
                                        <span className="text-white font-medium">{selectedLog.triggeredBy || 'SCHEDULER'}</span>
                                    </div>
                                </div>

                                {selectedLog.lastErrorCode && (
                                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300">
                                        <span className="block font-bold">Error: {selectedLog.lastErrorCode}</span>
                                        <span className="text-[11px]">{selectedLog.lastErrorMessage || '—'}</span>
                                    </div>
                                )}

                                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1 text-[11px] text-slate-400">
                                    <div>Created At: <span className="text-slate-300">{formatDateTime(selectedLog.createdAt)}</span></div>
                                    <div>Accepted At: <span className="text-slate-300">{formatDateTime(selectedLog.apiAcceptanceAt)}</span></div>
                                    <div>Delivered At: <span className="text-slate-300">{formatDateTime(selectedLog.deliveryAt)}</span></div>
                                    <div>Read At: <span className="text-slate-300">{formatDateTime(selectedLog.readAt)}</span></div>
                                </div>
                            </div>

                            <div className="p-4 border-t border-white/[0.08] flex items-center justify-end bg-slate-950/50">
                                <Button
                                    variant="ghost"
                                    onClick={() => setSelectedLog(null)}
                                    className="text-xs text-slate-400 hover:text-white"
                                >
                                    Close
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
