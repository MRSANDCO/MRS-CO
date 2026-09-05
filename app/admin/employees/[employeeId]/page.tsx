'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
    getAdminEmployeeById,
    updateAdminEmployee,
    resetEmployeePassword,
    setEmployeeActiveStatus,
    verifyEmployeeDocument,
    rejectEmployeeDocument,
    downloadEmployeeDocument,
    type EmployeeProfile,
    type UpdateProfileRequest,
} from '@/lib/api';
import { AmbientParticleCanvas } from '@/components/dashboard/AmbientParticleCanvas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import {
    ArrowLeft,
    Shield,
    LogOut,
    CheckCircle2,
    XCircle,
    Clock,
    User,
    Phone,
    Calendar,
    CreditCard,
    Home,
    FileText,
    Download,
    Eye,
    Check,
    X,
    KeyRound,
    Edit,
    Loader2,
    AlertCircle,
    Copy,
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

interface PageProps {
    params: Promise<{ employeeId: string }>;
}

export default function AdminSingleEmployeePage({ params }: PageProps) {
    const resolvedParams = use(params);
    const employeeId = decodeURIComponent(resolvedParams.employeeId);

    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuth();

    const [employee, setEmployee] = useState<EmployeeProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Edit state
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState<UpdateProfileRequest>({});
    const [saving, setSaving] = useState(false);

    // Document rejection modal
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [rejecting, setRejecting] = useState(false);

    // Reset password modal
    const [showResetModal, setShowResetModal] = useState(false);
    const [customPassword, setCustomPassword] = useState('');
    const [resetResult, setResetResult] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        if (user?.role !== 'admin') {
            router.push(user?.role === 'employee' ? '/employee/dashboard' : '/dashboard');
            return;
        }
    }, [isAuthenticated, user, router]);

    const loadEmployee = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAdminEmployeeById(employeeId);
            setEmployee(data);
            setEditFormData({
                name: data.name || '',
                fatherName: data.fatherName || '',
                mobileNumber: data.mobileNumber || '',
                aadhaarNumber: data.aadhaarNumber || '',
                panNumber: data.panNumber || '',
                dateOfJoining: data.dateOfJoining ? String(data.dateOfJoining).split('T')[0] : '',
                permanentAddress: data.permanentAddress || '',
                currentAddress: data.currentAddress || '',
            });
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to load employee details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role === 'admin' && employeeId) {
            loadEmployee();
        }
    }, [employeeId, user?.role]);

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await updateAdminEmployee(employeeId, editFormData);
            setEmployee(res.employee);
            setIsEditing(false);
            setFeedback({ type: 'success', text: 'Employee details updated successfully!' });
        } catch (err: unknown) {
            setFeedback({ type: 'error', text: err instanceof Error ? err.message : 'Update failed' });
        } finally {
            setSaving(false);
        }
    };

    const handleVerify = async () => {
        try {
            await verifyEmployeeDocument(employeeId);
            setFeedback({ type: 'success', text: 'Document verified successfully!' });
            loadEmployee();
        } catch (err: unknown) {
            setFeedback({ type: 'error', text: err instanceof Error ? err.message : 'Verification failed' });
        }
    };

    const handleConfirmReject = async () => {
        setRejecting(true);
        try {
            await rejectEmployeeDocument(employeeId, rejectionReason.trim());
            setShowRejectModal(false);
            setRejectionReason('');
            setFeedback({ type: 'success', text: 'Document rejected.' });
            loadEmployee();
        } catch (err: unknown) {
            setFeedback({ type: 'error', text: err instanceof Error ? err.message : 'Rejection failed' });
        } finally {
            setRejecting(false);
        }
    };

    const handleResetPassword = async () => {
        try {
            const res = await resetEmployeePassword(employeeId, customPassword.trim() || undefined);
            setResetResult(res.newPassword || 'Updated successfully');
            setShowResetModal(false);
            setCustomPassword('');
            setFeedback({ type: 'success', text: 'Password reset successfully!' });
        } catch (err: unknown) {
            setFeedback({ type: 'error', text: err instanceof Error ? err.message : 'Reset failed' });
        }
    };

    const handleToggleActive = async () => {
        if (!employee) return;
        const nextActive = employee.active === false ? true : false;
        try {
            await setEmployeeActiveStatus(employeeId, nextActive);
            setEmployee((prev) => (prev ? { ...prev, active: nextActive } : null));
            setFeedback({
                type: 'success',
                text: `Employee account ${nextActive ? 'activated' : 'deactivated'}.`,
            });
        } catch (err: unknown) {
            setFeedback({ type: 'error', text: err instanceof Error ? err.message : 'Status change failed' });
        }
    };

    const handleDownloadDoc = async () => {
        try {
            await downloadEmployeeDocument(employeeId, employee?.aadhaarFileName);
        } catch (err: unknown) {
            setFeedback({ type: 'error', text: err instanceof Error ? err.message : 'Download failed' });
        }
    };

    if (!user || user.role !== 'admin') return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-slate-100 relative overflow-x-hidden selection:bg-blue-500/30">
            <AmbientParticleCanvas />

            {/* Header */}
            <header className="relative z-20 border-b border-white/[0.08] bg-slate-950/70 backdrop-blur-xl sticky top-0">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                    <Link
                        href="/admin/employees"
                        className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>All Employees</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs">
                            <Shield className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-white font-medium">{user.fullName || user.userId}</span>
                        </div>
                        <Button
                            variant="ghost"
                            onClick={logout}
                            className="h-8 px-2.5 text-xs text-slate-400 hover:text-white hover:bg-white/[0.06]"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Feedback */}
                {feedback && (
                    <div
                        className={`mb-6 p-4 rounded-xl border text-xs sm:text-sm flex items-center justify-between shadow-lg backdrop-blur-xl ${
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
                    </div>
                )}

                {/* Loading / Error */}
                {loading && (
                    <div className="py-20 text-center text-slate-400 flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                        <span>Loading employee profile...</span>
                    </div>
                )}

                {!loading && error && (
                    <Card className="border-red-500/30 bg-red-950/20 backdrop-blur-xl p-8 text-center">
                        <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-2" />
                        <h2 className="text-base font-semibold text-white mb-2">Employee Not Found</h2>
                        <p className="text-xs text-red-300 mb-4">{error}</p>
                        <Button
                            onClick={() => router.push('/admin/employees')}
                            className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs"
                        >
                            Return to Employee List
                        </Button>
                    </Card>
                )}

                {!loading && !error && employee && (
                    <div className="space-y-6">
                        {/* Profile Summary Card */}
                        <Card className="border-white/[0.08] bg-slate-900/60 backdrop-blur-xl shadow-2xl overflow-hidden relative">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500" />
                            <CardContent className="p-6 sm:p-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-start sm:items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 border border-white/10 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                            {employee.name.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <h1 className="text-xl sm:text-2xl font-bold text-white">{employee.name}</h1>
                                                <span className="font-mono text-xs px-2.5 py-0.5 rounded-md font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                    {employee.employeeId}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-400 flex items-center gap-2">
                                                <span>Mobile: <strong className="text-slate-200">{employee.mobileNumber}</strong></span>
                                                {employee.dateOfJoining && (
                                                    <span>• Joined {new Date(employee.dateOfJoining).toLocaleDateString('en-GB')}</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Bar */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Button
                                            onClick={() => setIsEditing(!isEditing)}
                                            variant="outline"
                                            className="h-9 px-3 text-xs border-white/[0.1] text-blue-400 hover:text-white rounded-xl gap-1.5"
                                        >
                                            <Edit className="w-3.5 h-3.5" />
                                            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                                        </Button>

                                        <Button
                                            onClick={() => setShowResetModal(true)}
                                            variant="outline"
                                            className="h-9 px-3 text-xs border-white/[0.1] text-amber-400 hover:text-white rounded-xl gap-1.5"
                                        >
                                            <KeyRound className="w-3.5 h-3.5" />
                                            Reset Password
                                        </Button>

                                        <Button
                                            onClick={handleToggleActive}
                                            variant="outline"
                                            className={`h-9 px-3 text-xs rounded-xl gap-1.5 ${
                                                employee.active !== false
                                                    ? 'border-rose-500/20 text-rose-400 hover:bg-rose-500/10'
                                                    : 'border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10'
                                            }`}
                                        >
                                            {employee.active !== false ? 'Deactivate' : 'Activate'}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Edit Mode or View Mode */}
                        {isEditing ? (
                            <Card className="border-white/[0.08] bg-slate-900/60 backdrop-blur-xl shadow-xl">
                                <CardContent className="p-6 sm:p-8">
                                    <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                                        <Edit className="w-4 h-4 text-blue-400" />
                                        Edit Employee Information
                                    </h3>

                                    <form onSubmit={handleSaveEdit} className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                                                <Input
                                                    type="text"
                                                    value={editFormData.name || ''}
                                                    onChange={(e) => setEditFormData((p) => ({ ...p, name: e.target.value }))}
                                                    className="h-10 bg-white/[0.04] border-white/[0.1] text-white rounded-xl text-xs"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-slate-400 mb-1">Father&apos;s Name</label>
                                                <Input
                                                    type="text"
                                                    value={editFormData.fatherName || ''}
                                                    onChange={(e) => setEditFormData((p) => ({ ...p, fatherName: e.target.value }))}
                                                    className="h-10 bg-white/[0.04] border-white/[0.1] text-white rounded-xl text-xs"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-slate-400 mb-1">Mobile Number</label>
                                                <Input
                                                    type="tel"
                                                    value={editFormData.mobileNumber || ''}
                                                    onChange={(e) => setEditFormData((p) => ({ ...p, mobileNumber: e.target.value }))}
                                                    className="h-10 bg-white/[0.04] border-white/[0.1] text-white rounded-xl text-xs font-mono"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-slate-400 mb-1">Date of Joining</label>
                                                <Input
                                                    type="date"
                                                    value={editFormData.dateOfJoining || ''}
                                                    onChange={(e) => setEditFormData((p) => ({ ...p, dateOfJoining: e.target.value }))}
                                                    className="h-10 bg-white/[0.04] border-white/[0.1] text-white rounded-xl text-xs"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-slate-400 mb-1">Aadhaar Number</label>
                                                <Input
                                                    type="text"
                                                    value={editFormData.aadhaarNumber || ''}
                                                    onChange={(e) => setEditFormData((p) => ({ ...p, aadhaarNumber: e.target.value }))}
                                                    className="h-10 bg-white/[0.04] border-white/[0.1] text-white rounded-xl text-xs font-mono"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-slate-400 mb-1">PAN Number</label>
                                                <Input
                                                    type="text"
                                                    value={editFormData.panNumber || ''}
                                                    onChange={(e) => setEditFormData((p) => ({ ...p, panNumber: e.target.value.toUpperCase() }))}
                                                    className="h-10 bg-white/[0.04] border-white/[0.1] text-white rounded-xl text-xs font-mono uppercase"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs text-slate-400 mb-1">Permanent Address</label>
                                            <textarea
                                                rows={3}
                                                value={editFormData.permanentAddress || ''}
                                                onChange={(e) => setEditFormData((p) => ({ ...p, permanentAddress: e.target.value }))}
                                                className="w-full p-2.5 bg-white/[0.04] border border-white/[0.1] text-white rounded-xl text-xs"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs text-slate-400 mb-1">Current Address</label>
                                            <textarea
                                                rows={3}
                                                value={editFormData.currentAddress || ''}
                                                onChange={(e) => setEditFormData((p) => ({ ...p, currentAddress: e.target.value }))}
                                                className="w-full p-2.5 bg-white/[0.04] border border-white/[0.1] text-white rounded-xl text-xs"
                                            />
                                        </div>

                                        <div className="flex justify-end gap-3 pt-2">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => setIsEditing(false)}
                                                className="text-slate-400 hover:text-white text-xs"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={saving}
                                                className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs h-9 px-5"
                                            >
                                                {saving ? 'Saving...' : 'Save Profile'}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Personal Info Card */}
                                <Card className="border-white/[0.08] bg-slate-900/60 backdrop-blur-xl shadow-xl">
                                    <CardContent className="p-6">
                                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                            <User className="w-4 h-4 text-blue-400" />
                                            Personal Details
                                        </h3>
                                        <div className="space-y-3 text-xs">
                                            <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                                                <span className="text-slate-500">Employee ID</span>
                                                <span className="font-mono font-bold text-white">{employee.employeeId}</span>
                                            </div>
                                            <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                                                <span className="text-slate-500">Full Name</span>
                                                <span className="font-medium text-white">{employee.name}</span>
                                            </div>
                                            <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                                                <span className="text-slate-500">Father&apos;s Name</span>
                                                <span className="font-medium text-white">{employee.fatherName || '—'}</span>
                                            </div>
                                            <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                                                <span className="text-slate-500">Mobile</span>
                                                <span className="font-mono text-white">{employee.mobileNumber}</span>
                                            </div>
                                            <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                                                <span className="text-slate-500">Aadhaar (Masked)</span>
                                                <span className="font-mono text-cyan-300">{maskAadhaar(employee.aadhaarNumber)}</span>
                                            </div>
                                            <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                                                <span className="text-slate-500">PAN (Masked)</span>
                                                <span className="font-mono text-cyan-300">{maskPAN(employee.panNumber)}</span>
                                            </div>
                                            <div className="flex justify-between py-1.5">
                                                <span className="text-slate-500">Profile Status</span>
                                                <span className={employee.profileStatus === 'SUBMITTED' ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                                                    {employee.profileStatus}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Document Verification Card */}
                                <Card className="border-white/[0.08] bg-slate-900/60 backdrop-blur-xl shadow-xl">
                                    <CardContent className="p-6">
                                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-cyan-400" />
                                            Document Status
                                        </h3>

                                        {employee.aadhaarFileName ? (
                                            <div className="space-y-4 text-xs">
                                                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                                                    <div className="font-medium text-white mb-1">{employee.aadhaarFileName}</div>
                                                    <div className="text-slate-400">
                                                        Status:{' '}
                                                        <strong className={
                                                            employee.documentStatus === 'VERIFIED'
                                                                ? 'text-emerald-400'
                                                                : employee.documentStatus === 'REJECTED'
                                                                ? 'text-rose-400'
                                                                : 'text-amber-400'
                                                        }>
                                                            {employee.documentStatus || 'PENDING'}
                                                        </strong>
                                                    </div>
                                                    {employee.documentRejectionReason && (
                                                        <p className="text-rose-300 mt-2">
                                                            Reason: {employee.documentRejectionReason}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={handleDownloadDoc}
                                                        className="h-8 text-xs text-cyan-400 border-cyan-500/20 gap-1.5"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" /> View / Download PDF
                                                    </Button>

                                                    {employee.documentStatus !== 'VERIFIED' && (
                                                        <Button
                                                            size="sm"
                                                            onClick={handleVerify}
                                                            className="h-8 text-xs bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5"
                                                        >
                                                            <Check className="w-3.5 h-3.5" /> Verify Document
                                                        </Button>
                                                    )}

                                                    {employee.documentStatus !== 'REJECTED' && (
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => setShowRejectModal(true)}
                                                            className="h-8 text-xs gap-1.5"
                                                        >
                                                            <X className="w-3.5 h-3.5" /> Reject Document
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="py-8 text-center text-slate-500 text-xs">
                                                No verification document uploaded yet by this employee.
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Addresses */}
                                <Card className="border-white/[0.08] bg-slate-900/60 backdrop-blur-xl shadow-xl md:col-span-2">
                                    <CardContent className="p-6">
                                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                            <Home className="w-4 h-4 text-indigo-400" />
                                            Residential Addresses
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                                                <span className="text-slate-500 block mb-1.5 font-semibold uppercase tracking-wider text-[10px]">
                                                    Permanent Address
                                                </span>
                                                <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                                                    {employee.permanentAddress || 'Not specified'}
                                                </p>
                                            </div>
                                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                                                <span className="text-slate-500 block mb-1.5 font-semibold uppercase tracking-wider text-[10px]">
                                                    Current Address
                                                </span>
                                                <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                                                    {employee.currentAddress || 'Not specified'}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Document Rejection Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-white/[0.1] rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <h3 className="text-base font-bold text-white mb-2 text-rose-400">Reject Document</h3>
                        <p className="text-xs text-slate-300 mb-4">
                            Provide a reason for rejecting the document.
                        </p>
                        <textarea
                            rows={3}
                            placeholder="Rejection reason..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="w-full p-2.5 bg-white/[0.04] border border-white/[0.1] text-white rounded-xl text-xs mb-4"
                        />
                        <div className="flex justify-end gap-3">
                            <Button variant="ghost" onClick={() => setShowRejectModal(false)} className="text-xs">
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirmReject}
                                disabled={rejecting}
                                className="bg-rose-600 hover:bg-rose-500 text-white text-xs"
                            >
                                {rejecting ? 'Rejecting...' : 'Confirm Rejection'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reset Password Modal */}
            {showResetModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-white/[0.1] rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <h3 className="text-base font-bold text-white mb-2 text-amber-400">Reset Password</h3>
                        <p className="text-xs text-slate-300 mb-4">
                            Enter a new password or leave blank for an auto-generated password.
                        </p>
                        <Input
                            type="text"
                            placeholder="New password (optional)"
                            value={customPassword}
                            onChange={(e) => setCustomPassword(e.target.value)}
                            className="h-10 bg-white/[0.04] border-white/[0.1] text-white rounded-xl text-xs mb-4"
                        />
                        <div className="flex justify-end gap-3">
                            <Button variant="ghost" onClick={() => setShowResetModal(false)} className="text-xs">
                                Cancel
                            </Button>
                            <Button onClick={handleResetPassword} className="bg-amber-600 hover:bg-amber-500 text-white text-xs">
                                Reset Password
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reset Result Dialog */}
            {resetResult && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-white/[0.1] rounded-2xl p-6 max-w-md w-full shadow-2xl text-center">
                        <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                        <h3 className="text-base font-bold text-white mb-1">Password Reset Complete</h3>
                        <p className="text-xs text-slate-400 mb-4">New password:</p>
                        <div className="p-3 bg-white/[0.04] rounded-xl flex items-center justify-between font-mono text-amber-300 font-bold mb-4">
                            <span>{resetResult}</span>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                    navigator.clipboard.writeText(resetResult);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                }}
                                className="h-7 text-xs text-blue-400"
                            >
                                {copied ? 'Copied' : 'Copy'}
                            </Button>
                        </div>
                        <Button onClick={() => setResetResult(null)} className="w-full bg-blue-600 text-white text-xs h-9">
                            Done
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
