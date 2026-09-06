'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
    getAdminEmployees,
    getAdminEmployeeById,
    createAdminEmployee,
    updateAdminEmployee,
    resetEmployeePassword,
    setEmployeeActiveStatus,
    verifyEmployeeDocument,
    rejectEmployeeDocument,
    downloadEmployeeDocument,
    deleteAdminEmployee,
    type EmployeeProfile,
    type CreateEmployeeRequest,
    type UpdateProfileRequest,
} from '@/lib/api';
import {
    Users,
    UserPlus,
    Search,
    Filter,
    Eye,
    Edit,
    Trash2,
    FileText,
    CheckCircle2,
    XCircle,
    KeyRound,
    Power,
    Check,
    Copy,
    RefreshCw,
    AlertCircle,
    Clock,
    Shield,
    Loader2,
    Calendar,
    Phone,
    MapPin,
    Lock,
    Download,
    X,
    ChevronLeft,
    ChevronRight,
    SlidersHorizontal,
    ExternalLink,
} from 'lucide-react';

function maskAadhaar(aadhaar?: string): string {
    if (!aadhaar) return 'Not provided';
    const cleaned = aadhaar.replace(/\D/g, '');
    if (cleaned.length < 4) return 'XXXX-XXXX-XXXX';
    return `XXXX-XXXX-${cleaned.slice(-4)}`;
}

function maskPAN(pan?: string): string {
    if (!pan) return 'Not provided';
    const cleaned = pan.trim().toUpperCase();
    if (cleaned.length < 5) return 'XXXXXXXXXX';
    return `${cleaned.slice(0, 2)}XXXXXX${cleaned.slice(-2)}`;
}

export interface AdminEmployeeManagementProps {
    onEmployeeChange?: () => void;
}

export function AdminEmployeeManagement({ onEmployeeChange }: AdminEmployeeManagementProps = {}) {
    // State
    const [employees, setEmployees] = useState<EmployeeProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [profileFilter, setProfileFilter] = useState<'ALL' | 'INCOMPLETE' | 'SUBMITTED'>('ALL');
    const [docFilter, setDocFilter] = useState<'ALL' | 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NONE'>('ALL');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);

    // Modals
    const [showAddModal, setShowAddModal] = useState(false);
    const [createdEmployeeResult, setCreatedEmployeeResult] = useState<{
        employeeId: string;
        initialPassword?: string;
        name: string;
    } | null>(null);

    const [viewingEmployee, setViewingEmployee] = useState<EmployeeProfile | null>(null);
    const [editingEmployee, setEditingEmployee] = useState<EmployeeProfile | null>(null);
    const [deletingEmployee, setDeletingEmployee] = useState<EmployeeProfile | null>(null);
    const [rejectingDocId, setRejectingDocId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [resettingPasswordId, setResettingPasswordId] = useState<string | null>(null);
    const [customNewPassword, setCustomNewPassword] = useState('');
    const [resetResult, setResetResult] = useState<{ employeeId: string; newPassword?: string } | null>(null);

    // Action loaders
    const [actionLoading, setActionLoading] = useState(false);
    const [copiedPassword, setCopiedPassword] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // New employee form state
    const [newEmpData, setNewEmpData] = useState<CreateEmployeeRequest>({
        name: '',
        mobileNumber: '',
        initialPassword: '',
    });

    // Edit employee form state
    const [editFormData, setEditFormData] = useState<UpdateProfileRequest>({});

    const fetchEmployees = async (searchTerm = searchQuery, pageNum = page) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAdminEmployees(searchTerm, pageNum, 20);
            setEmployees(data.content || []);
            setTotalPages(data.totalPages || 1);
            setTotalElements(data.totalElements || 0);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to fetch employees');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees(searchQuery, page);
    }, [page]);

    // Handle search submit or debounce
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(0);
        fetchEmployees(searchQuery, 0);
    };

    // Client-side filtering on the fetched page
    const filteredEmployees = useMemo(() => {
        return employees.filter((emp) => {
            if (profileFilter !== 'ALL' && emp.profileStatus !== profileFilter) return false;

            if (docFilter === 'NONE') {
                if (emp.aadhaarFileName) return false;
            } else if (docFilter !== 'ALL') {
                if (emp.documentStatus !== docFilter) return false;
            }

            if (statusFilter === 'ACTIVE' && emp.active === false) return false;
            if (statusFilter === 'INACTIVE' && emp.active !== false) return false;

            return true;
        });
    }, [employees, profileFilter, docFilter, statusFilter]);

    // Copy to clipboard helper
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedPassword(true);
        setTimeout(() => setCopiedPassword(false), 2000);
    };

    // Add employee
    const handleCreateEmployee = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEmpData.name.trim() || !newEmpData.mobileNumber.trim()) {
            setFeedback({ type: 'error', text: 'Name and mobile number are required.' });
            return;
        }

        setActionLoading(true);
        try {
            const res = await createAdminEmployee({
                name: newEmpData.name.trim(),
                mobileNumber: newEmpData.mobileNumber.trim(),
                initialPassword: newEmpData.initialPassword?.trim() || undefined,
            });

            setCreatedEmployeeResult({
                employeeId: res.employeeId,
                initialPassword: res.initialPassword,
                name: res.name,
            });

            setNewEmpData({ name: '', mobileNumber: '', initialPassword: '' });
            fetchEmployees();
            onEmployeeChange?.();
            setFeedback({ type: 'success', text: `Employee ${res.employeeId} created successfully!` });
        } catch (err: unknown) {
            setFeedback({ type: 'error', text: err instanceof Error ? err.message : 'Failed to create employee.' });
        } finally {
            setActionLoading(false);
        }
    };

    // View employee details
    const handleOpenView = async (emp: EmployeeProfile) => {
        setViewingEmployee(emp);
        try {
            const fresh = await getAdminEmployeeById(emp.employeeId);
            setViewingEmployee(fresh);
        } catch {
            // retain existing snapshot
        }
    };

    // Open edit modal
    const handleOpenEdit = (emp: EmployeeProfile) => {
        setEditingEmployee(emp);
        setEditFormData({
            name: emp.name || '',
            fatherName: emp.fatherName || '',
            mobileNumber: emp.mobileNumber || '',
            fatherMobileNumber: emp.fatherMobileNumber || '',
            aadhaarNumber: emp.aadhaarNumber || '',
            panNumber: emp.panNumber || '',
            dateOfJoining: emp.dateOfJoining ? String(emp.dateOfJoining).split('T')[0] : '',
            permanentAddress: emp.permanentAddress || '',
            currentAddress: emp.currentAddress || '',
            resumeGoogleDriveLink: emp.resumeGoogleDriveLink || '',
        });
    };

    // Save edit
    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingEmployee) return;

        setActionLoading(true);
        try {
            const res = await updateAdminEmployee(editingEmployee.employeeId, editFormData);
            setFeedback({ type: 'success', text: `Employee ${editingEmployee.employeeId} updated successfully!` });
            setEditingEmployee(null);
            fetchEmployees();
            onEmployeeChange?.();
            if (viewingEmployee?.employeeId === editingEmployee.employeeId) {
                setViewingEmployee(res.employee);
            }
        } catch (err: unknown) {
            setFeedback({ type: 'error', text: err instanceof Error ? err.message : 'Failed to update employee.' });
        } finally {
            setActionLoading(false);
        }
    };

    // Delete employee
    const handleConfirmDeleteEmployee = async () => {
        if (!deletingEmployee) return;
        setActionLoading(true);
        try {
            const res = await deleteAdminEmployee(deletingEmployee.employeeId);
            setFeedback({
                type: 'success',
                text: res.message || `Employee ${deletingEmployee.employeeId} deleted successfully.`,
            });
            setDeletingEmployee(null);
            if (viewingEmployee?.employeeId === deletingEmployee.employeeId) {
                setViewingEmployee(null);
            }
            fetchEmployees();
            onEmployeeChange?.();
        } catch (err: unknown) {
            setFeedback({
                type: 'error',
                text: err instanceof Error ? err.message : 'Failed to delete employee.',
            });
        } finally {
            setActionLoading(false);
        }
    };

    // Toggle active status
    const handleToggleStatus = async (emp: EmployeeProfile) => {
        const nextActive = emp.active === false ? true : false;
        try {
            await setEmployeeActiveStatus(emp.employeeId, nextActive);
            setFeedback({
                type: 'success',
                text: `Employee ${emp.employeeId} account ${nextActive ? 'activated' : 'deactivated'}.`,
            });
            fetchEmployees();
            onEmployeeChange?.();
            if (viewingEmployee?.employeeId === emp.employeeId) {
                setViewingEmployee((prev) => (prev ? { ...prev, active: nextActive } : null));
            }
        } catch (err: unknown) {
            setFeedback({ type: 'error', text: err instanceof Error ? err.message : 'Failed to change status.' });
        }
    };

    // Verify document
    const handleVerifyDocument = async (employeeId: string) => {
        try {
            await verifyEmployeeDocument(employeeId);
            setFeedback({ type: 'success', text: `Document for employee ${employeeId} verified!` });
            fetchEmployees();
            if (viewingEmployee?.employeeId === employeeId) {
                setViewingEmployee((prev) => (prev ? { ...prev, documentStatus: 'VERIFIED' } : null));
            }
        } catch (err: unknown) {
            setFeedback({ type: 'error', text: err instanceof Error ? err.message : 'Failed to verify document.' });
        }
    };

    // Reject document
    const handleConfirmRejectDoc = async () => {
        if (!rejectingDocId) return;
        setActionLoading(true);
        try {
            await rejectEmployeeDocument(rejectingDocId, rejectionReason.trim());
            setFeedback({ type: 'success', text: `Document for employee ${rejectingDocId} rejected.` });
            setRejectingDocId(null);
            setRejectionReason('');
            fetchEmployees();
            if (viewingEmployee?.employeeId === rejectingDocId) {
                setViewingEmployee((prev) =>
                    prev
                        ? { ...prev, documentStatus: 'REJECTED', documentRejectionReason: rejectionReason.trim() }
                        : null
                );
            }
        } catch (err: unknown) {
            setFeedback({ type: 'error', text: err instanceof Error ? err.message : 'Failed to reject document.' });
        } finally {
            setActionLoading(false);
        }
    };

    // Reset password
    const handleConfirmResetPassword = async () => {
        if (!resettingPasswordId) return;
        setActionLoading(true);
        try {
            const res = await resetEmployeePassword(
                resettingPasswordId,
                customNewPassword.trim() || undefined
            );
            setResetResult({
                employeeId: res.employeeId,
                newPassword: res.newPassword,
            });
            setResettingPasswordId(null);
            setCustomNewPassword('');
            setFeedback({ type: 'success', text: `Password for ${res.employeeId} has been reset.` });
        } catch (err: unknown) {
            setFeedback({ type: 'error', text: err instanceof Error ? err.message : 'Failed to reset password.' });
        } finally {
            setActionLoading(false);
        }
    };

    // Download / view document
    const handleDownloadDoc = async (employeeId: string, fileName?: string) => {
        try {
            await downloadEmployeeDocument(employeeId, fileName || `${employeeId}_document.pdf`);
        } catch (err: unknown) {
            setFeedback({ type: 'error', text: err instanceof Error ? err.message : 'Document download failed.' });
        }
    };

    // Stats calculations
    const stats = useMemo(() => {
        const submitted = employees.filter((e) => e.profileStatus === 'SUBMITTED').length;
        const incomplete = employees.filter((e) => e.profileStatus === 'INCOMPLETE').length;
        const pendingDoc = employees.filter((e) => e.documentStatus === 'PENDING' && e.aadhaarFileName).length;
        return { submitted, incomplete, pendingDoc };
    }, [employees]);

    return (
        <div className="space-y-6">
            {/* Header & Quick Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
                        <Users className="w-6 h-6 text-blue-400" />
                        Employee Management
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                        Manage employee profiles, onboarding, document verification, and credentials
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => fetchEmployees()}
                        variant="outline"
                        className="h-10 px-3.5 border-white/[0.1] bg-white/[0.04] text-slate-300 hover:text-white rounded-xl text-xs gap-2"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>

                    <Button
                        onClick={() => {
                            setCreatedEmployeeResult(null);
                            setShowAddModal(true);
                        }}
                        className="h-10 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold gap-2 shadow-lg shadow-blue-500/20"
                    >
                        <UserPlus className="w-4 h-4" />
                        Add Employee
                    </Button>
                </div>
            </div>

            {/* Feedback Alert */}
            <AnimatePresence>
                {feedback && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-4 rounded-xl border text-xs sm:text-sm flex items-center justify-between shadow-lg backdrop-blur-xl ${
                            feedback.type === 'success'
                                ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-200'
                                : 'bg-rose-950/60 border-rose-500/30 text-rose-200'
                        }`}
                    >
                        <div className="flex items-center gap-2.5">
                            {feedback.type === 'success' ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                                <AlertCircle className="w-4 h-4 text-rose-400" />
                            )}
                            <span>{feedback.text}</span>
                        </div>
                        <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white">
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    {
                        label: 'Total Registered',
                        value: totalElements,
                        icon: <Users className="w-5 h-5 text-blue-400" />,
                        color: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20',
                    },
                    {
                        label: 'Submitted Profiles',
                        value: stats.submitted,
                        icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
                        color: 'from-emerald-500/10 to-green-500/10 border-emerald-500/20',
                    },
                    {
                        label: 'Incomplete Profiles',
                        value: stats.incomplete,
                        icon: <Clock className="w-5 h-5 text-amber-400" />,
                        color: 'from-amber-500/10 to-orange-500/10 border-amber-500/20',
                    },
                    {
                        label: 'Pending Documents',
                        value: stats.pendingDoc,
                        icon: <FileText className="w-5 h-5 text-cyan-400" />,
                        color: 'from-cyan-500/10 to-blue-500/10 border-cyan-500/20',
                    },
                ].map((stat, i) => (
                    <Card key={i} className="border-white/[0.08] bg-white/[0.03] backdrop-blur-xl">
                        <CardContent className="p-4 sm:p-5 flex items-center gap-3.5">
                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br border flex items-center justify-center ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <div>
                                <div className="text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
                                <div className="text-[11px] text-slate-400">{stat.label}</div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filter & Search Bar */}
            <Card className="border-white/[0.08] bg-white/[0.02] backdrop-blur-xl">
                <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="flex-1 relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <Input
                                type="text"
                                placeholder="Search by Employee ID, Name, or Mobile..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-10 bg-white/[0.04] border-white/[0.1] text-white placeholder:text-slate-500 rounded-xl text-xs sm:text-sm"
                            />
                        </form>

                        {/* Filter Dropdowns */}
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Profile status filter */}
                            <select
                                value={profileFilter}
                                onChange={(e) => setProfileFilter(e.target.value as any)}
                                className="h-10 px-3 bg-slate-900 border border-white/[0.1] text-slate-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="ALL">Profile: All</option>
                                <option value="SUBMITTED">Profile: Submitted</option>
                                <option value="INCOMPLETE">Profile: Incomplete</option>
                            </select>

                            {/* Document status filter */}
                            <select
                                value={docFilter}
                                onChange={(e) => setDocFilter(e.target.value as any)}
                                className="h-10 px-3 bg-slate-900 border border-white/[0.1] text-slate-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="ALL">Doc: All</option>
                                <option value="PENDING">Doc: Pending</option>
                                <option value="VERIFIED">Doc: Verified</option>
                                <option value="REJECTED">Doc: Rejected</option>
                                <option value="NONE">Doc: Not Uploaded</option>
                            </select>

                            {/* Account status filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as any)}
                                className="h-10 px-3 bg-slate-900 border border-white/[0.1] text-slate-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="ALL">Account: All</option>
                                <option value="ACTIVE">Account: Active</option>
                                <option value="INACTIVE">Account: Inactive</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Employee Table */}
            <Card className="border-white/[0.08] bg-slate-900/60 backdrop-blur-xl shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="border-b border-white/[0.08] bg-white/[0.02] text-slate-400 font-semibold tracking-wider uppercase text-[10px]">
                                <th className="p-3.5 sm:p-4">Employee ID</th>
                                <th className="p-3.5 sm:p-4">Name</th>
                                <th className="p-3.5 sm:p-4">Mobile</th>
                                <th className="p-3.5 sm:p-4">Profile Status</th>
                                <th className="p-3.5 sm:p-4">Document Status</th>
                                <th className="p-3.5 sm:p-4">Account</th>
                                <th className="p-3.5 sm:p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.05]">
                            {loading && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-400">
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                                            <span>Loading employees...</span>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {!loading && filteredEmployees.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-400">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Users className="w-8 h-8 text-slate-600" />
                                            <p className="text-sm font-medium text-slate-300">No employees found</p>
                                            <p className="text-xs text-slate-500">
                                                Try adjusting your search criteria or add a new employee.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {!loading &&
                                filteredEmployees.map((emp) => {
                                    const isSub = emp.profileStatus === 'SUBMITTED';
                                    const hasDoc = Boolean(emp.aadhaarFileName);
                                    const docStatus = emp.documentStatus || 'PENDING';
                                    const isActive = emp.active !== false;

                                    return (
                                        <tr
                                            key={emp.employeeId}
                                            className="hover:bg-white/[0.02] transition-colors duration-150"
                                        >
                                            {/* Employee ID */}
                                            <td className="p-3.5 sm:p-4 font-mono font-bold text-white whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-blue-400">{emp.employeeId}</span>
                                                </div>
                                            </td>

                                            {/* Name */}
                                            <td className="p-3.5 sm:p-4 font-medium text-slate-200 whitespace-nowrap">
                                                {emp.name}
                                            </td>

                                            {/* Mobile */}
                                            <td className="p-3.5 sm:p-4 font-mono text-slate-300 whitespace-nowrap">
                                                {emp.mobileNumber}
                                            </td>

                                            {/* Profile Status */}
                                            <td className="p-3.5 sm:p-4 whitespace-nowrap">
                                                {isSub ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        Submitted
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                        <Clock className="w-3 h-3" />
                                                        Incomplete
                                                    </span>
                                                )}
                                            </td>

                                            {/* Document Status */}
                                            <td className="p-3.5 sm:p-4 whitespace-nowrap">
                                                {!hasDoc ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
                                                        No Document
                                                    </span>
                                                ) : docStatus === 'VERIFIED' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        Verified
                                                    </span>
                                                ) : docStatus === 'REJECTED' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                                        <XCircle className="w-3 h-3" />
                                                        Rejected
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                        <Clock className="w-3 h-3" />
                                                        Pending
                                                    </span>
                                                )}
                                            </td>

                                            {/* Account Status */}
                                            <td className="p-3.5 sm:p-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleToggleStatus(emp)}
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all ${
                                                        isActive
                                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                                                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20'
                                                    }`}
                                                    title="Click to toggle active/inactive status"
                                                >
                                                    <span
                                                        className={`w-1.5 h-1.5 rounded-full ${
                                                            isActive ? 'bg-emerald-400' : 'bg-rose-400'
                                                        }`}
                                                    />
                                                    {isActive ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>

                                            {/* Action Buttons */}
                                            <td className="p-3.5 sm:p-4 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {/* View */}
                                                    <button
                                                        onClick={() => handleOpenView(emp)}
                                                        className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white transition-colors"
                                                        title="View Profile"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </button>

                                                    {/* Edit */}
                                                    <button
                                                        onClick={() => handleOpenEdit(emp)}
                                                        className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-blue-400 hover:text-blue-300 transition-colors"
                                                        title="Edit Profile"
                                                    >
                                                        <Edit className="w-3.5 h-3.5" />
                                                    </button>

                                                    {/* View Document */}
                                                    {hasDoc && (
                                                        <button
                                                            onClick={() =>
                                                                handleDownloadDoc(emp.employeeId, emp.aadhaarFileName)
                                                            }
                                                            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-cyan-400 hover:text-cyan-300 transition-colors"
                                                            title="View / Download Document"
                                                        >
                                                            <FileText className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}

                                                    {/* Verify Document */}
                                                    {hasDoc && docStatus !== 'VERIFIED' && (
                                                        <button
                                                            onClick={() => handleVerifyDocument(emp.employeeId)}
                                                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                                                            title="Verify Document"
                                                        >
                                                            <Check className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}

                                                    {/* Reject Document */}
                                                    {hasDoc && docStatus !== 'REJECTED' && (
                                                        <button
                                                            onClick={() => {
                                                                setRejectingDocId(emp.employeeId);
                                                                setRejectionReason('');
                                                            }}
                                                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                                                            title="Reject Document"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}

                                                    {/* Reset Password */}
                                                    <button
                                                        onClick={() => {
                                                            setResettingPasswordId(emp.employeeId);
                                                            setCustomNewPassword('');
                                                        }}
                                                        className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-amber-400 hover:text-amber-300 transition-colors"
                                                        title="Reset Password"
                                                    >
                                                        <KeyRound className="w-3.5 h-3.5" />
                                                    </button>

                                                    {/* Delete Employee */}
                                                    <button
                                                        onClick={() => setDeletingEmployee(emp)}
                                                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                                                        title="Delete Employee"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                    <div>
                        Showing {filteredEmployees.length} of {totalElements} employees
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            disabled={page <= 0 || loading}
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                            className="h-8 px-2.5 text-xs text-slate-400 hover:text-white"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Prev
                        </Button>
                        <span className="font-mono text-slate-300">
                            Page {page + 1} of {Math.max(1, totalPages)}
                        </span>
                        <Button
                            variant="ghost"
                            disabled={page >= totalPages - 1 || loading}
                            onClick={() => setPage((p) => p + 1)}
                            className="h-8 px-2.5 text-xs text-slate-400 hover:text-white"
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </Card>

            {/* ── Modal: Add Employee ── */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-900 border border-white/[0.1] rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
                        >
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="absolute right-4 top-4 text-slate-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* State 1: Success Creation Box */}
                            {createdEmployeeResult ? (
                                <div className="text-center py-2">
                                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto mb-4">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-1">Employee Created Successfully</h3>
                                    <p className="text-xs text-slate-400 mb-5">
                                        The employee account has been created with the following initial credentials.
                                    </p>

                                    <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-left space-y-2 mb-6">
                                        <div>
                                            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                                                Employee Name
                                            </span>
                                            <span className="text-sm font-semibold text-white">
                                                {createdEmployeeResult.name}
                                            </span>
                                        </div>

                                        <div>
                                            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                                                Generated Employee ID
                                            </span>
                                            <span className="text-base font-mono font-bold text-blue-400">
                                                {createdEmployeeResult.employeeId}
                                            </span>
                                        </div>

                                        {createdEmployeeResult.initialPassword && (
                                            <div>
                                                <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                                                    Temporary Password
                                                </span>
                                                <div className="flex items-center justify-between mt-0.5">
                                                    <span className="text-sm font-mono font-bold text-amber-300">
                                                        {createdEmployeeResult.initialPassword}
                                                    </span>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() =>
                                                            handleCopy(createdEmployeeResult.initialPassword || '')
                                                        }
                                                        className="h-7 text-xs text-blue-400 hover:text-blue-300 gap-1"
                                                    >
                                                        {copiedPassword ? (
                                                            <>
                                                                <Check className="w-3 h-3 text-emerald-400" /> Copied
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Copy className="w-3 h-3" /> Copy
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-[11px] text-slate-500 mb-6">
                                        The employee can now log in at <code>/login</code> under the <strong>Employee</strong> tab using their Employee ID and Temporary Password.
                                    </p>

                                    <Button
                                        onClick={() => {
                                            setShowAddModal(false);
                                            setCreatedEmployeeResult(null);
                                        }}
                                        className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl"
                                    >
                                        Done
                                    </Button>
                                </div>
                            ) : (
                                /* State 2: Creation Form */
                                <form onSubmit={handleCreateEmployee} className="space-y-4">
                                    <div className="flex items-center gap-2.5 mb-2">
                                        <UserPlus className="w-5 h-5 text-blue-400" />
                                        <h3 className="text-lg font-bold text-white">Add New Employee</h3>
                                    </div>

                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Provide the employee&apos;s name and mobile number. A unique Employee ID and temporary login credentials will be generated automatically.
                                    </p>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                                            Employee Name <span className="text-rose-400">*</span>
                                        </label>
                                        <Input
                                            type="text"
                                            placeholder="Full name (e.g. Rahul Sharma)"
                                            value={newEmpData.name}
                                            onChange={(e) => setNewEmpData((p) => ({ ...p, name: e.target.value }))}
                                            required
                                            className="h-11 bg-white/[0.04] border-white/[0.1] text-white placeholder:text-slate-600 rounded-xl"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                                            Mobile Number <span className="text-rose-400">*</span>
                                        </label>
                                        <Input
                                            type="tel"
                                            maxLength={10}
                                            placeholder="10-digit mobile number"
                                            value={newEmpData.mobileNumber}
                                            onChange={(e) =>
                                                setNewEmpData((p) => ({ ...p, mobileNumber: e.target.value }))
                                            }
                                            required
                                            className="h-11 bg-white/[0.04] border-white/[0.1] text-white placeholder:text-slate-600 rounded-xl"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                                            Custom Initial Password <span className="text-slate-500 font-normal">(Optional)</span>
                                        </label>
                                        <Input
                                            type="text"
                                            placeholder="Leave empty for auto-generated password"
                                            value={newEmpData.initialPassword}
                                            onChange={(e) =>
                                                setNewEmpData((p) => ({ ...p, initialPassword: e.target.value }))
                                            }
                                            className="h-11 bg-white/[0.04] border-white/[0.1] text-white placeholder:text-slate-600 rounded-xl"
                                        />
                                    </div>

                                    <div className="flex items-center justify-end gap-3 pt-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => setShowAddModal(false)}
                                            className="text-slate-400 hover:text-white"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={actionLoading}
                                            className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-5 font-semibold"
                                        >
                                            {actionLoading ? (
                                                <span className="flex items-center gap-2">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Creating...
                                                </span>
                                            ) : (
                                                'Create Employee'
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── Modal: View Employee Details ── */}
            <AnimatePresence>
                {viewingEmployee && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-900 border border-white/[0.1] rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto relative"
                        >
                            <button
                                onClick={() => setViewingEmployee(null)}
                                className="absolute right-4 top-4 text-slate-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.08]">
                                <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-lg">
                                    {viewingEmployee.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-bold text-white">{viewingEmployee.name}</h3>
                                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                            {viewingEmployee.employeeId}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Profile: <strong>{viewingEmployee.profileStatus}</strong> • Document:{' '}
                                        <strong>{viewingEmployee.documentStatus || 'NONE'}</strong>
                                    </p>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="space-y-6 text-xs">
                                <div>
                                    <h4 className="font-semibold uppercase tracking-wider text-slate-400 mb-3">
                                        Personal Information
                                    </h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                                        <div>
                                            <span className="text-slate-500 block mb-1">Father&apos;s Name</span>
                                            <span className="font-medium text-white">{viewingEmployee.fatherName || '—'}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 block mb-1">Mobile</span>
                                            <span className="font-mono text-white">{viewingEmployee.mobileNumber || '—'}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 block mb-1">Date of Joining</span>
                                            <span className="font-medium text-white">
                                                {viewingEmployee.dateOfJoining
                                                    ? new Date(viewingEmployee.dateOfJoining).toLocaleDateString('en-GB')
                                                    : '—'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 block mb-1">Aadhaar Number</span>
                                            <span className="font-mono text-cyan-300">
                                                {maskAadhaar(viewingEmployee.aadhaarNumber)}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 block mb-1">PAN Number</span>
                                            <span className="font-mono text-cyan-300">
                                                {maskPAN(viewingEmployee.panNumber)}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 block mb-1">Father&apos;s Mobile</span>
                                            <span className="font-mono text-white">
                                                {viewingEmployee.fatherMobileNumber || '—'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 block mb-1">Account Status</span>
                                            <span className={viewingEmployee.active !== false ? 'text-emerald-400' : 'text-rose-400'}>
                                                {viewingEmployee.active !== false ? 'Active' : 'Inactive / Deactivated'}
                                            </span>
                                        </div>
                                        {viewingEmployee.resumeGoogleDriveLink && (
                                            <div className="col-span-2 sm:col-span-3">
                                                <span className="text-slate-500 block mb-1">Resume / Drive Link</span>
                                                <a
                                                    href={viewingEmployee.resumeGoogleDriveLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 underline underline-offset-2 break-all"
                                                >
                                                    <span>{viewingEmployee.resumeGoogleDriveLink}</span>
                                                    <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold uppercase tracking-wider text-slate-400 mb-3">
                                        Address Details
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                                            <span className="text-slate-500 block mb-1">Permanent Address</span>
                                            <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                                                {viewingEmployee.permanentAddress || 'Not provided'}
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                                            <span className="text-slate-500 block mb-1">Current Address</span>
                                            <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                                                {viewingEmployee.currentAddress || 'Not provided'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold uppercase tracking-wider text-slate-400 mb-3">
                                        Document Verification
                                    </h4>
                                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                                        {viewingEmployee.aadhaarFileName ? (
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                <div>
                                                    <span className="font-medium text-white block">
                                                        {viewingEmployee.aadhaarFileName}
                                                    </span>
                                                    <span className="text-slate-500">
                                                        Status: <strong>{viewingEmployee.documentStatus}</strong>
                                                        {viewingEmployee.documentRejectionReason && (
                                                            <span className="text-rose-400 block mt-1">
                                                                Reason: {viewingEmployee.documentRejectionReason}
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleDownloadDoc(
                                                                viewingEmployee.employeeId,
                                                                viewingEmployee.aadhaarFileName
                                                            )
                                                        }
                                                        className="h-8 text-xs text-cyan-400 border-cyan-500/20 gap-1.5"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" /> View / Download
                                                    </Button>

                                                    {viewingEmployee.documentStatus !== 'VERIFIED' && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() =>
                                                                handleVerifyDocument(viewingEmployee.employeeId)
                                                            }
                                                            className="h-8 text-xs bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5"
                                                        >
                                                            <Check className="w-3.5 h-3.5" /> Verify
                                                        </Button>
                                                    )}

                                                    {viewingEmployee.documentStatus !== 'REJECTED' && (
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => {
                                                                setRejectingDocId(viewingEmployee.employeeId);
                                                                setRejectionReason('');
                                                            }}
                                                            className="h-8 text-xs gap-1.5"
                                                        >
                                                            <X className="w-3.5 h-3.5" /> Reject
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-slate-500">No document uploaded by this employee yet.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/[0.08]">
                                <Button
                                    variant="outline"
                                    onClick={() => handleOpenEdit(viewingEmployee)}
                                    className="border-white/[0.1] text-blue-400 hover:text-white gap-1.5 text-xs h-9"
                                >
                                    <Edit className="w-3.5 h-3.5" /> Edit Profile
                                </Button>

                                <Button
                                    variant="ghost"
                                    onClick={() => setViewingEmployee(null)}
                                    className="text-slate-400 hover:text-white text-xs h-9"
                                >
                                    Close
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── Modal: Edit Employee ── */}
            <AnimatePresence>
                {editingEmployee && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-900 border border-white/[0.1] rounded-2xl p-6 max-w-xl w-full shadow-2xl max-h-[90vh] overflow-y-auto relative"
                        >
                            <button
                                onClick={() => setEditingEmployee(null)}
                                className="absolute right-4 top-4 text-slate-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-2.5 mb-4">
                                <Edit className="w-5 h-5 text-blue-400" />
                                <h3 className="text-lg font-bold text-white">
                                    Edit Employee ({editingEmployee.employeeId})
                                </h3>
                            </div>

                            <form onSubmit={handleSaveEdit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                                            Full Name
                                        </label>
                                        <Input
                                            type="text"
                                            value={editFormData.name || ''}
                                            onChange={(e) =>
                                                setEditFormData((p) => ({ ...p, name: e.target.value }))
                                            }
                                            className="h-10 bg-white/[0.04] border-white/[0.1] text-white rounded-xl text-xs"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                                            Father&apos;s Name
                                        </label>
                                        <Input
                                            type="text"
                                            value={editFormData.fatherName || ''}
                                            onChange={(e) =>
                                                setEditFormData((p) => ({ ...p, fatherName: e.target.value }))
                                            }
                                            className="h-10 bg-white/[0.04] border-white/[0.1] text-white rounded-xl text-xs"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                                            Mobile Number
                                        </label>
                                        <Input
                                            type="tel"
                                            maxLength={10}
                                            value={editFormData.mobileNumber || ''}
                                            onChange={(e) =>
                                                setEditFormData((p) => ({ ...p, mobileNumber: e.target.value }))
                                            }
                                            className="h-10 bg-white/[0.04] border-white/[0.1] text-white rounded-xl text-xs font-mono"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                                            Date of Joining
                                        </label>
                                        <Input
                                            type="date"
                                            value={editFormData.dateOfJoining || ''}
                                            onChange={(e) =>
                                                setEditFormData((p) => ({ ...p, dateOfJoining: e.target.value }))
                                            }
                                            className="h-10 bg-white/[0.04] border-white/[0.1] text-white rounded-xl text-xs"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                                            Aadhaar Number
                                        </label>
                                        <Input
                                            type="text"
                                            maxLength={12}
                                            value={editFormData.aadhaarNumber || ''}
                                            onChange={(e) =>
                                                setEditFormData((p) => ({ ...p, aadhaarNumber: e.target.value }))
                                            }
                                            className="h-10 bg-white/[0.04] border-white/[0.1] text-white rounded-xl text-xs font-mono"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                                            PAN Number
                                        </label>
                                        <Input
                                            type="text"
                                            maxLength={10}
                                            value={editFormData.panNumber || ''}
                                            onChange={(e) =>
                                                setEditFormData((p) => ({
                                                    ...p,
                                                    panNumber: e.target.value.toUpperCase(),
                                                }))
                                            }
                                            className="h-10 bg-white/[0.04] border-white/[0.1] text-white rounded-xl text-xs font-mono uppercase"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                                            Father&apos;s Mobile Number
                                        </label>
                                        <Input
                                            type="tel"
                                            maxLength={10}
                                            placeholder="10-digit mobile"
                                            value={editFormData.fatherMobileNumber || ''}
                                            onChange={(e) =>
                                                setEditFormData((p) => ({
                                                    ...p,
                                                    fatherMobileNumber: e.target.value,
                                                }))
                                            }
                                            className="h-10 bg-white/[0.04] border-white/[0.1] text-white rounded-xl text-xs font-mono"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                                            Resume Google Drive Link
                                        </label>
                                        <Input
                                            type="url"
                                            placeholder="https://drive.google.com/..."
                                            value={editFormData.resumeGoogleDriveLink || ''}
                                            onChange={(e) =>
                                                setEditFormData((p) => ({
                                                    ...p,
                                                    resumeGoogleDriveLink: e.target.value,
                                                }))
                                            }
                                            className="h-10 bg-white/[0.04] border-white/[0.1] text-white rounded-xl text-xs"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                                        Permanent Address
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={editFormData.permanentAddress || ''}
                                        onChange={(e) =>
                                            setEditFormData((p) => ({ ...p, permanentAddress: e.target.value }))
                                        }
                                        className="w-full p-2.5 bg-white/[0.04] border border-white/[0.1] text-white rounded-xl text-xs"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                                        Current Address
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={editFormData.currentAddress || ''}
                                        onChange={(e) =>
                                            setEditFormData((p) => ({ ...p, currentAddress: e.target.value }))
                                        }
                                        className="w-full p-2.5 bg-white/[0.04] border border-white/[0.1] text-white rounded-xl text-xs"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setEditingEmployee(null)}
                                        className="text-slate-400 hover:text-white"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={actionLoading}
                                        className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-5 font-semibold text-xs h-10"
                                    >
                                        {actionLoading ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── Modal: Document Rejection Reason ── */}
            <AnimatePresence>
                {rejectingDocId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-900 border border-white/[0.1] rounded-2xl p-6 max-w-md w-full shadow-2xl"
                        >
                            <div className="flex items-center gap-2.5 mb-3 text-rose-400">
                                <XCircle className="w-5 h-5" />
                                <h3 className="text-base font-bold text-white">Reject Document</h3>
                            </div>

                            <p className="text-xs text-slate-300 mb-4">
                                Provide an optional rejection reason for employee <strong>{rejectingDocId}</strong>.
                                The employee will see this feedback in their portal.
                            </p>

                            <textarea
                                rows={3}
                                placeholder="E.g. Blurred document, invalid signature, mismatched PAN name..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="w-full p-3 bg-white/[0.04] border border-white/[0.1] text-white placeholder:text-slate-600 rounded-xl text-xs mb-5"
                            />

                            <div className="flex items-center justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setRejectingDocId(null)}
                                    className="text-slate-400 hover:text-white text-xs"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleConfirmRejectDoc}
                                    disabled={actionLoading}
                                    className="bg-rose-600 hover:bg-rose-500 text-white text-xs rounded-xl px-4"
                                >
                                    {actionLoading ? 'Rejecting...' : 'Reject Document'}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── Modal: Reset Password ── */}
            <AnimatePresence>
                {resettingPasswordId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-900 border border-white/[0.1] rounded-2xl p-6 max-w-md w-full shadow-2xl"
                        >
                            <div className="flex items-center gap-2.5 mb-3 text-amber-400">
                                <KeyRound className="w-5 h-5" />
                                <h3 className="text-base font-bold text-white">Reset Employee Password</h3>
                            </div>

                            <p className="text-xs text-slate-300 mb-4">
                                Reset login password for employee <strong>{resettingPasswordId}</strong>.
                                You may provide a specific password below, or leave it blank to auto-generate a secure temporary password.
                            </p>

                            <Input
                                type="text"
                                placeholder="New password (optional)"
                                value={customNewPassword}
                                onChange={(e) => setCustomNewPassword(e.target.value)}
                                className="h-10 bg-white/[0.04] border-white/[0.1] text-white rounded-xl text-xs mb-5"
                            />

                            <div className="flex items-center justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setResettingPasswordId(null)}
                                    className="text-slate-400 hover:text-white text-xs"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleConfirmResetPassword}
                                    disabled={actionLoading}
                                    className="bg-amber-600 hover:bg-amber-500 text-white text-xs rounded-xl px-4 font-semibold"
                                >
                                    {actionLoading ? 'Resetting...' : 'Reset Password'}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── Modal: Reset Password Result ── */}
            <AnimatePresence>
                {resetResult && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-900 border border-white/[0.1] rounded-2xl p-6 max-w-md w-full shadow-2xl text-center"
                        >
                            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto mb-3">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-bold text-white mb-1">Password Reset Complete</h3>
                            <p className="text-xs text-slate-400 mb-4">
                                The new password for <strong>{resetResult.employeeId}</strong> is:
                            </p>

                            <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between mb-5">
                                <span className="font-mono font-bold text-amber-300 text-sm">
                                    {resetResult.newPassword || 'Updated to custom password'}
                                </span>
                                {resetResult.newPassword && (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleCopy(resetResult.newPassword || '')}
                                        className="h-7 text-xs text-blue-400 hover:text-blue-300 gap-1"
                                    >
                                        {copiedPassword ? (
                                            <>
                                                <Check className="w-3 h-3 text-emerald-400" /> Copied
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-3 h-3" /> Copy
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>

                            <Button
                                onClick={() => setResetResult(null)}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs h-10"
                            >
                                Done
                            </Button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── Modal: Confirm Delete Employee ── */}
            <AnimatePresence>
                {deletingEmployee && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-900 border border-rose-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
                        >
                            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto mb-4">
                                <Trash2 className="w-6 h-6" />
                            </div>

                            <h3 className="text-lg font-bold text-white text-center mb-2">Delete Employee</h3>
                            <p className="text-xs sm:text-sm text-slate-300 text-center mb-5 leading-relaxed">
                                Are you sure you want to permanently delete employee{' '}
                                <strong className="text-white font-mono">{deletingEmployee.employeeId}</strong> (
                                <span className="text-slate-100 font-semibold">{deletingEmployee.name}</span>)?
                            </p>

                            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs mb-6 space-y-1">
                                <div className="font-semibold flex items-center gap-1.5 text-rose-300">
                                    <AlertCircle className="w-4 h-4 text-rose-400" />
                                    Permanent & Irreversible Action
                                </div>
                                <p className="text-[11px] text-rose-300/80 leading-normal pl-5">
                                    This will delete their employee profile record, remove their login account, and purge all uploaded Aadhaar documents from the database.
                                </p>
                            </div>

                            <div className="flex items-center justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    disabled={actionLoading}
                                    onClick={() => setDeletingEmployee(null)}
                                    className="text-slate-400 hover:text-white text-xs h-10 px-4"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleConfirmDeleteEmployee}
                                    disabled={actionLoading}
                                    className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl h-10 px-5 gap-2 shadow-lg shadow-rose-600/30"
                                >
                                    {actionLoading ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="w-3.5 h-3.5" /> Yes, Delete Employee
                                        </>
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
