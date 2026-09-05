'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import {
    getEmployeeProfile,
    updateEmployeeProfile,
    submitEmployeeProfile,
    uploadEmployeeDocument,
    downloadEmployeeDocument,
    type EmployeeProfile,
    type UpdateProfileRequest,
} from '@/lib/api';
import {
    Briefcase,
    User,
    Phone,
    CreditCard,
    FileText,
    Calendar,
    Home,
    MapPin,
    UploadCloud,
    CheckCircle,
    AlertCircle,
    Clock,
    Lock,
    Eye,
    Download,
    LogOut,
    Loader2,
    ShieldAlert,
    Sparkles,
    Check,
    AlertTriangle,
    RefreshCw,
    X,
    ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

// Masking helpers for sensitive data
function maskAadhaar(aadhaar?: string): string {
    if (!aadhaar) return 'Not provided';
    const cleaned = aadhaar.replace(/\D/g, '');
    if (cleaned.length < 4) return 'XXXX-XXXX-XXXX';
    const last4 = cleaned.slice(-4);
    return `XXXX-XXXX-${last4}`;
}

function maskPAN(pan?: string): string {
    if (!pan) return 'Not provided';
    const cleaned = pan.trim().toUpperCase();
    if (cleaned.length < 5) return 'XXXXXXXXXX';
    const firstPart = cleaned.slice(0, 2);
    const lastPart = cleaned.slice(-2);
    return `${firstPart}XXXXXX${lastPart}`;
}

export default function EmployeeDashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated, logout, updateUser } = useAuth();

    // Loading & Profile state
    const [profile, setProfile] = useState<EmployeeProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    // Form inputs for Incomplete state
    const [formData, setFormData] = useState({
        name: '',
        fatherName: '',
        mobileNumber: '',
        fatherMobileNumber: '',
        aadhaarNumber: '',
        panNumber: '',
        dateOfJoining: '',
        permanentAddress: '',
        currentAddress: '',
        resumeGoogleDriveLink: '',
    });

    const [sameAddress, setSameAddress] = useState(false);
    const [savingDraft, setSavingDraft] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [uploadingDoc, setUploadingDoc] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [docError, setDocError] = useState<string | null>(null);

    // Feedback messages
    const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Route Protection
    useEffect(() => {
        if (!isAuthenticated || !user) {
            router.push('/login');
            return;
        }
        if (user.role === 'admin') {
            router.push('/dashboard');
            return;
        }
        if (user.role === 'user') {
            router.push('/dashboard');
            return;
        }
    }, [isAuthenticated, user, router]);

    // Fetch Employee Profile
    const fetchProfile = async () => {
        setLoading(true);
        setLoadError(null);
        try {
            const data = await getEmployeeProfile();
            setProfile(data);

            // Populate form
            setFormData({
                name: data.name || '',
                fatherName: data.fatherName || '',
                mobileNumber: data.mobileNumber || '',
                fatherMobileNumber: data.fatherMobileNumber || '',
                aadhaarNumber: data.aadhaarNumber || '',
                panNumber: data.panNumber || '',
                dateOfJoining: data.dateOfJoining ? String(data.dateOfJoining).split('T')[0] : '',
                permanentAddress: data.permanentAddress || '',
                currentAddress: data.currentAddress || '',
                resumeGoogleDriveLink: data.resumeGoogleDriveLink || '',
            });

            if (data.permanentAddress && data.permanentAddress === data.currentAddress) {
                setSameAddress(true);
            }

            if (data.profileStatus) {
                updateUser({ profileStatus: data.profileStatus, fullName: data.name || user?.fullName });
            }
        } catch (err: unknown) {
            setLoadError(err instanceof Error ? err.message : 'Failed to load employee profile');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.role === 'employee') {
            fetchProfile();
        }
    }, [user?.role]);

    // Handle address synchronization
    const handleSameAddressToggle = (checked: boolean) => {
        setSameAddress(checked);
        if (checked) {
            setFormData((prev) => ({
                ...prev,
                currentAddress: prev.permanentAddress,
            }));
        }
    };

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => {
            const updated = { ...prev, [field]: value };
            if (field === 'permanentAddress' && sameAddress) {
                updated.currentAddress = value;
            }
            return updated;
        });

        // Clear field error on change
        if (fieldErrors[field]) {
            setFieldErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };

    // Validation
    const validateForm = (isFullSubmission = false): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.name.trim()) {
            errors.name = 'Full name is required';
        }

        if (!formData.fatherName.trim()) {
            errors.fatherName = "Father's name is required";
        }

        const cleanedMobile = formData.mobileNumber.replace(/\D/g, '');
        if (!cleanedMobile) {
            errors.mobileNumber = 'Mobile number is required';
        } else if (cleanedMobile.length !== 10) {
            errors.mobileNumber = 'Please enter a valid 10-digit mobile number';
        }

        const cleanedFatherMobile = formData.fatherMobileNumber.replace(/\D/g, '');
        if (!cleanedFatherMobile) {
            if (isFullSubmission) {
                errors.fatherMobileNumber = "Father's mobile number is required";
            }
        } else if (cleanedFatherMobile.length !== 10) {
            errors.fatherMobileNumber = "Please enter a valid 10-digit mobile number for father";
        }

        if (formData.aadhaarNumber) {
            const cleanedAadhaar = formData.aadhaarNumber.replace(/\D/g, '');
            if (cleanedAadhaar.length !== 12) {
                errors.aadhaarNumber = 'Aadhaar must be exactly 12 digits';
            }
        } else if (isFullSubmission) {
            errors.aadhaarNumber = 'Aadhaar number is required for profile submission';
        }

        if (formData.panNumber) {
            const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;
            if (!panRegex.test(formData.panNumber.trim())) {
                errors.panNumber = 'Invalid PAN format (e.g. ABCDE1234F)';
            }
        } else if (isFullSubmission) {
            errors.panNumber = 'PAN number is required for profile submission';
        }

        if (!formData.dateOfJoining) {
            errors.dateOfJoining = 'Date of joining is required';
        }

        if (!formData.permanentAddress.trim()) {
            errors.permanentAddress = 'Permanent address is required';
        }

        if (!formData.currentAddress.trim()) {
            errors.currentAddress = 'Current address is required';
        }

        if (formData.resumeGoogleDriveLink.trim()) {
            const link = formData.resumeGoogleDriveLink.trim();
            const driveRegex = /^https?:\/\/(drive\.google\.com|docs\.google\.com)\/.+$/i;
            if (!driveRegex.test(link)) {
                errors.resumeGoogleDriveLink = 'Must be a valid Google Drive or Google Docs link (e.g., https://drive.google.com/...)';
            }
        }

        if (isFullSubmission && !profile?.aadhaarFileName && !selectedFile) {
            errors.document = 'Aadhaar / ID proof PDF document upload is required before submission';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle File Selection (PDF only & size check)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDocError(null);
        const file = e.target.files?.[0];
        if (!file) return;

        // Check if PDF
        if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
            setDocError('Only PDF files are allowed. Please choose an Aadhaar / ID document in PDF format.');
            if (fileInputRef.current) fileInputRef.current.value = '';
            setSelectedFile(null);
            return;
        }

        // Max file size 10MB
        if (file.size > 10 * 1024 * 1024) {
            setDocError('File size exceeds the 10MB limit. Please upload a smaller PDF file.');
            if (fileInputRef.current) fileInputRef.current.value = '';
            setSelectedFile(null);
            return;
        }

        setSelectedFile(file);
    };

    // Upload Document
    const handleUploadDoc = async () => {
        if (!selectedFile) return;
        setUploadingDoc(true);
        setDocError(null);

        try {
            const res = await uploadEmployeeDocument(selectedFile);
            setToastMessage({ type: 'success', text: 'Document uploaded successfully!' });
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            // Refresh profile
            await fetchProfile();
        } catch (err: unknown) {
            setDocError(err instanceof Error ? err.message : 'Failed to upload document');
            setToastMessage({ type: 'error', text: 'Document upload failed. Please try again.' });
        } finally {
            setUploadingDoc(false);
        }
    };

    // Save Draft
    const handleSaveDraft = async () => {
        if (!validateForm(false)) {
            setToastMessage({ type: 'error', text: 'Please correct the highlighted errors before saving draft.' });
            return;
        }

        setSavingDraft(true);
        try {
            const payload: UpdateProfileRequest = {
                name: formData.name.trim(),
                fatherName: formData.fatherName.trim(),
                mobileNumber: formData.mobileNumber.trim(),
                fatherMobileNumber: formData.fatherMobileNumber.trim(),
                aadhaarNumber: formData.aadhaarNumber.trim(),
                panNumber: formData.panNumber.trim().toUpperCase(),
                dateOfJoining: formData.dateOfJoining,
                permanentAddress: formData.permanentAddress.trim(),
                currentAddress: formData.currentAddress.trim(),
                resumeGoogleDriveLink: formData.resumeGoogleDriveLink.trim(),
            };

            const res = await updateEmployeeProfile(payload);
            setProfile(res.profile);
            setToastMessage({ type: 'success', text: 'Draft profile saved successfully!' });
        } catch (err: unknown) {
            setToastMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to save draft' });
        } finally {
            setSavingDraft(false);
        }
    };

    // Execute Submit Profile
    const executeSubmitProfile = async () => {
        setShowSubmitConfirm(false);
        setSubmitting(true);

        try {
            // First upload document if one is selected
            if (selectedFile) {
                await uploadEmployeeDocument(selectedFile);
                setSelectedFile(null);
            }

            // Save details
            const payload: UpdateProfileRequest = {
                name: formData.name.trim(),
                fatherName: formData.fatherName.trim(),
                mobileNumber: formData.mobileNumber.trim(),
                fatherMobileNumber: formData.fatherMobileNumber.trim(),
                aadhaarNumber: formData.aadhaarNumber.trim(),
                panNumber: formData.panNumber.trim().toUpperCase(),
                dateOfJoining: formData.dateOfJoining,
                permanentAddress: formData.permanentAddress.trim(),
                currentAddress: formData.currentAddress.trim(),
                resumeGoogleDriveLink: formData.resumeGoogleDriveLink.trim(),
            };
            await updateEmployeeProfile(payload);

            // Call submit API
            const res = await submitEmployeeProfile();
            setProfile(res.profile);
            updateUser({ profileStatus: 'SUBMITTED' });

            setToastMessage({
                type: 'success',
                text: 'Profile submitted successfully! Your profile is now locked in read-only mode for administrative verification.',
            });
        } catch (err: unknown) {
            setToastMessage({
                type: 'error',
                text: err instanceof Error ? err.message : 'Submission failed. Please check your details and try again.',
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmitClick = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm(true)) {
            setToastMessage({
                type: 'error',
                text: 'Please complete all required fields and upload your Aadhaar document before submitting.',
            });
            return;
        }
        setShowSubmitConfirm(true);
    };

    // Download / View document
    const handleDownloadDocument = async () => {
        try {
            await downloadEmployeeDocument();
        } catch (err: unknown) {
            setToastMessage({
                type: 'error',
                text: err instanceof Error ? err.message : 'Could not view document.',
            });
        }
    };

    // Profile Status & Document Status badge styling
    const isSubmitted = profile?.profileStatus === 'SUBMITTED';

    const renderProfileStatusBadge = () => {
        if (isSubmitted) {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle className="w-3.5 h-3.5" />
                    SUBMITTED (Locked)
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <AlertTriangle className="w-3.5 h-3.5" />
                INCOMPLETE (Action Required)
            </span>
        );
    };

    const renderDocumentStatusBadge = () => {
        const docStatus = profile?.documentStatus || 'PENDING';
        if (!profile?.aadhaarFileName) {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
                    <Clock className="w-3.5 h-3.5" />
                    Not Uploaded
                </span>
            );
        }

        if (docStatus === 'VERIFIED') {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Document Verified
                </span>
            );
        }

        if (docStatus === 'REJECTED') {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Document Rejected
                </span>
            );
        }

        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Clock className="w-3.5 h-3.5" />
                Verification Pending
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-slate-100 relative overflow-x-hidden selection:bg-blue-500/30">
            {/* Ambient Background Lights */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-blue-600/[0.08] rounded-full blur-[140px]" />
                <div className="absolute top-1/2 -left-40 w-[600px] h-[600px] bg-indigo-600/[0.06] rounded-full blur-[160px]" />
                <div className="absolute -bottom-20 right-1/4 w-[450px] h-[450px] bg-cyan-600/[0.05] rounded-full blur-[130px]" />
            </div>

            {/* Top Navigation Bar */}
            <header className="relative z-20 border-b border-white/[0.08] bg-slate-950/70 backdrop-blur-xl sticky top-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* Logo & Brand */}
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div
                                className="relative w-9 h-9 rounded-full flex items-center justify-center transition-transform group-hover:scale-105"
                                style={{
                                    background: 'linear-gradient(145deg, #ffffff 0%, #dceeff 100%)',
                                    border: '1.5px solid rgba(255,255,255,0.85)',
                                    boxShadow: '0 0 0 1px rgba(59,130,246,0.3), 0 4px 16px rgba(59,130,246,0.35)',
                                }}
                            >
                                <img
                                    src="https://education21.in/wp-content/uploads/2023/12/CA-India-Logo-1024x762.png"
                                    alt="CA India Logo"
                                    className="w-6 h-6 object-contain"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span
                                    className="text-white font-bold text-sm sm:text-base tracking-wide leading-tight"
                                    style={{ fontFamily: 'Georgia, serif' }}
                                >
                                    MRS & Co.
                                </span>
                                <span className="text-[9px] text-cyan-400 font-semibold tracking-wider uppercase">
                                    Employee Portal
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Right action bar: User info & Logout */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="hidden sm:flex flex-col text-right">
                            <span className="text-xs font-semibold text-white">
                                {profile?.name || user?.fullName || 'Employee'}
                            </span>
                            <span className="text-[11px] text-blue-400 font-mono">
                                ID: {profile?.employeeId || user?.employeeId || user?.userId}
                            </span>
                        </div>

                        <Button
                            variant="ghost"
                            onClick={logout}
                            className="text-slate-400 hover:text-white hover:bg-white/[0.08] h-9 px-3 text-xs gap-1.5 rounded-lg transition-all"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Sign Out</span>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8">
                {/* Toast Notification */}
                <AnimatePresence>
                    {toastMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-6"
                        >
                            <div
                                className={`flex items-center justify-between p-4 rounded-xl border text-sm shadow-xl backdrop-blur-xl ${
                                    toastMessage.type === 'success'
                                        ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-200'
                                        : toastMessage.type === 'error'
                                        ? 'bg-rose-950/60 border-rose-500/30 text-rose-200'
                                        : 'bg-blue-950/60 border-blue-500/30 text-blue-200'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    {toastMessage.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                                    {toastMessage.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
                                    {toastMessage.type === 'info' && <Sparkles className="w-5 h-5 text-blue-400" />}
                                    <span>{toastMessage.text}</span>
                                </div>
                                <button
                                    onClick={() => setToastMessage(null)}
                                    className="text-slate-400 hover:text-white ml-3"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Loading Skeleton */}
                {loading && (
                    <div className="space-y-6">
                        <div className="h-32 rounded-2xl bg-white/[0.04] border border-white/[0.06] animate-pulse" />
                        <div className="h-96 rounded-2xl bg-white/[0.04] border border-white/[0.06] animate-pulse" />
                    </div>
                )}

                {/* Error State */}
                {!loading && loadError && (
                    <Card className="border-red-500/30 bg-red-950/20 backdrop-blur-xl p-8 text-center">
                        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                        <h2 className="text-lg font-semibold text-white mb-2">Unable to Load Profile</h2>
                        <p className="text-sm text-red-300 max-w-md mx-auto mb-6">{loadError}</p>
                        <Button
                            onClick={fetchProfile}
                            className="bg-blue-600 hover:bg-blue-500 text-white gap-2 px-5 py-2 rounded-xl"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Retry
                        </Button>
                    </Card>
                )}

                {!loading && !loadError && profile && (
                    <div className="space-y-8">
                        {/* ── Employee Header Card ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Card className="border-white/[0.08] bg-slate-900/60 backdrop-blur-xl shadow-2xl overflow-hidden relative">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500" />
                                <CardContent className="p-6 sm:p-8">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        {/* Avatar & Employee Basic Info */}
                                        <div className="flex items-start sm:items-center gap-4">
                                            <div
                                                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg border border-white/10"
                                                style={{
                                                    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                                                }}
                                            >
                                                {profile.name
                                                    ? profile.name.slice(0, 2).toUpperCase()
                                                    : profile.employeeId?.slice(0, 3)}
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <h1 className="text-xl sm:text-2xl font-bold text-white">
                                                        {profile.name || 'Employee Profile'}
                                                    </h1>
                                                    <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                        {profile.employeeId}
                                                    </span>
                                                </div>
                                                <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-2">
                                                    <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                                                    MRS & Co. Staff Member
                                                    {profile.dateOfJoining && (
                                                        <span className="text-slate-500">
                                                            • Joined{' '}
                                                            {new Date(profile.dateOfJoining).toLocaleDateString('en-GB', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric',
                                                            })}
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Status Indicators */}
                                        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-start md:items-end lg:items-center gap-3">
                                            <div>
                                                <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                                                    Profile Status
                                                </span>
                                                {renderProfileStatusBadge()}
                                            </div>
                                            <div>
                                                <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                                                    Document Status
                                                </span>
                                                {renderDocumentStatusBadge()}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notice for Document Rejection */}
                                    {profile.documentStatus === 'REJECTED' && (
                                        <div className="mt-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-start gap-3">
                                            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
                                            <div>
                                                <span className="font-semibold block text-rose-200">
                                                    Document Rejected by Admin:
                                                </span>
                                                <p className="mt-0.5 text-xs sm:text-sm">
                                                    {profile.documentRejectionReason ||
                                                        'The uploaded document did not meet verification criteria. Please contact administrative support.'}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* ── CONDITIONAL VIEW: READ-ONLY IF SUBMITTED ── */}
                        {isSubmitted ? (
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                className="space-y-6"
                            >
                                {/* Read-Only Locked Banner */}
                                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 text-sm flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <Lock className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                        <span>
                                            Your profile has been <strong>SUBMITTED</strong> and is locked from further employee edits. Administrative review is in progress.
                                        </span>
                                    </div>
                                    <span className="hidden sm:inline-block text-xs font-mono text-blue-300/80 bg-blue-500/10 px-2.5 py-1 rounded">
                                        READ-ONLY
                                    </span>
                                </div>

                                {/* Read-Only Personal Details */}
                                <Card className="border-white/[0.08] bg-slate-900/60 backdrop-blur-xl shadow-xl">
                                    <CardContent className="p-6 sm:p-8">
                                        <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-white/[0.06]">
                                            <User className="w-5 h-5 text-blue-400" />
                                            <h2 className="text-base sm:text-lg font-semibold text-white">
                                                Personal Information
                                            </h2>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            <div>
                                                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                                                    Employee ID
                                                </label>
                                                <div className="text-sm font-mono font-bold text-white flex items-center gap-2">
                                                    {profile.employeeId}
                                                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                                                    Full Name
                                                </label>
                                                <div className="text-sm font-medium text-white">
                                                    {profile.name || '—'}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                                                    Father&apos;s Name
                                                </label>
                                                <div className="text-sm font-medium text-white">
                                                    {profile.fatherName || '—'}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                                                    Mobile Number
                                                </label>
                                                <div className="text-sm font-mono text-white">
                                                    {profile.mobileNumber || '—'}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                                                    Aadhaar Number
                                                </label>
                                                <div className="text-sm font-mono text-cyan-300">
                                                    {maskAadhaar(profile.aadhaarNumber)}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                                                    PAN Number
                                                </label>
                                                <div className="text-sm font-mono text-cyan-300">
                                                    {maskPAN(profile.panNumber)}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                                                    Father&apos;s Mobile
                                                </label>
                                                <div className="text-sm font-mono text-white">
                                                    {profile.fatherMobileNumber || '—'}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                                                    Date of Joining
                                                </label>
                                                <div className="text-sm font-medium text-white">
                                                    {profile.dateOfJoining
                                                        ? new Date(profile.dateOfJoining).toLocaleDateString('en-GB')
                                                        : '—'}
                                                </div>
                                            </div>

                                            {profile.resumeGoogleDriveLink && (
                                                <div className="sm:col-span-2 lg:col-span-3">
                                                    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                                                        Resume / Portfolio (Google Drive)
                                                    </label>
                                                    <a
                                                        href={profile.resumeGoogleDriveLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 underline underline-offset-2 break-all"
                                                    >
                                                        <span>{profile.resumeGoogleDriveLink}</span>
                                                        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Read-Only Address */}
                                <Card className="border-white/[0.08] bg-slate-900/60 backdrop-blur-xl shadow-xl">
                                    <CardContent className="p-6 sm:p-8">
                                        <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-white/[0.06]">
                                            <Home className="w-5 h-5 text-indigo-400" />
                                            <h2 className="text-base sm:text-lg font-semibold text-white">
                                                Address Details
                                            </h2>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                                                    Permanent Address
                                                </span>
                                                <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                                                    {profile.permanentAddress || 'Not specified'}
                                                </p>
                                            </div>

                                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                                                    Current Address
                                                </span>
                                                <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                                                    {profile.currentAddress || 'Not specified'}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Read-Only Documents */}
                                <Card className="border-white/[0.08] bg-slate-900/60 backdrop-blur-xl shadow-xl">
                                    <CardContent className="p-6 sm:p-8">
                                        <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-white/[0.06]">
                                            <FileText className="w-5 h-5 text-cyan-400" />
                                            <h2 className="text-base sm:text-lg font-semibold text-white">
                                                Verification Documents
                                            </h2>
                                        </div>

                                        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-white">
                                                        {profile.aadhaarFileName || 'Aadhaar / ID Proof (PDF)'}
                                                    </div>
                                                    <div className="text-xs text-slate-400 mt-0.5">
                                                        {profile.aadhaarFileSize
                                                            ? `${(profile.aadhaarFileSize / 1024).toFixed(1)} KB`
                                                            : 'PDF Document'}
                                                        {' • '}
                                                        Status: <span className="font-medium text-slate-200">{profile.documentStatus || 'PENDING'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {profile.aadhaarFileName && (
                                                <Button
                                                    onClick={handleDownloadDocument}
                                                    className="bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/[0.1] rounded-xl text-xs gap-2 h-9 px-4"
                                                >
                                                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                                                    View / Download Document
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ) : (
                            /* ── CONDITIONAL VIEW: EDITABLE FORM IF INCOMPLETE ── */
                            <motion.form
                                onSubmit={handleSubmitClick}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                className="space-y-6"
                            >
                                {/* Callout Banner */}
                                <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900/50 border border-blue-500/30 backdrop-blur-xl shadow-lg">
                                    <div className="flex items-start gap-3.5">
                                        <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 mt-0.5">
                                            <AlertTriangle className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-base font-bold text-white">Complete Your Profile</h2>
                                            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                                                Please fill in your personal details, permanent and current address, and upload your Aadhaar / ID proof PDF.
                                                You can <strong>Save Draft</strong> at any time. Once you click <strong>Submit Profile</strong>, your profile will be locked for administrative verification.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Personal Details Card */}
                                <Card className="border-white/[0.08] bg-slate-900/60 backdrop-blur-xl shadow-xl">
                                    <CardContent className="p-6 sm:p-8">
                                        <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-white/[0.06]">
                                            <User className="w-5 h-5 text-blue-400" />
                                            <div>
                                                <h3 className="text-base font-semibold text-white">Personal Details</h3>
                                                <p className="text-xs text-slate-400">Official employment and identification information</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            {/* Employee ID (Read-only) */}
                                            <div>
                                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                                    Employee ID <span className="text-slate-500">(Permanent & Read-Only)</span>
                                                </label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                    <Input
                                                        type="text"
                                                        value={profile.employeeId}
                                                        readOnly
                                                        disabled
                                                        className="pl-10 h-11 bg-white/[0.02] border-white/[0.06] text-slate-400 rounded-xl cursor-not-allowed font-mono font-bold"
                                                    />
                                                </div>
                                                <p className="text-[11px] text-slate-500 mt-1">Generated and assigned by MRS & Co. administration.</p>
                                            </div>

                                            {/* Full Name */}
                                            <div>
                                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                                    Full Name <span className="text-rose-400">*</span>
                                                </label>
                                                <Input
                                                    type="text"
                                                    placeholder="Enter your full legal name"
                                                    value={formData.name}
                                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                                    required
                                                    className={`h-11 bg-white/[0.04] border-white/[0.1] text-white placeholder:text-slate-600 rounded-xl ${
                                                        fieldErrors.name ? 'border-rose-500 ring-1 ring-rose-500' : ''
                                                    }`}
                                                />
                                                {fieldErrors.name && <p className="text-xs text-rose-400 mt-1">{fieldErrors.name}</p>}
                                            </div>

                                            {/* Father's Name */}
                                            <div>
                                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                                    Father&apos;s Name <span className="text-rose-400">*</span>
                                                </label>
                                                <Input
                                                    type="text"
                                                    placeholder="Enter father's name"
                                                    value={formData.fatherName}
                                                    onChange={(e) => handleInputChange('fatherName', e.target.value)}
                                                    required
                                                    className={`h-11 bg-white/[0.04] border-white/[0.1] text-white placeholder:text-slate-600 rounded-xl ${
                                                        fieldErrors.fatherName ? 'border-rose-500 ring-1 ring-rose-500' : ''
                                                    }`}
                                                />
                                                {fieldErrors.fatherName && <p className="text-xs text-rose-400 mt-1">{fieldErrors.fatherName}</p>}
                                            </div>

                                            {/* Mobile Number */}
                                            <div>
                                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                                    Mobile Number <span className="text-rose-400">*</span>
                                                </label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                    <Input
                                                        type="tel"
                                                        maxLength={10}
                                                        placeholder="10-digit mobile number"
                                                        value={formData.mobileNumber}
                                                        onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                                                        required
                                                        className={`pl-10 h-11 bg-white/[0.04] border-white/[0.1] text-white placeholder:text-slate-600 rounded-xl ${
                                                            fieldErrors.mobileNumber ? 'border-rose-500 ring-1 ring-rose-500' : ''
                                                        }`}
                                                    />
                                                </div>
                                                {fieldErrors.mobileNumber && <p className="text-xs text-rose-400 mt-1">{fieldErrors.mobileNumber}</p>}
                                            </div>

                                            {/* Aadhaar Number */}
                                            <div>
                                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                                    Aadhaar Number <span className="text-rose-400">*</span>
                                                </label>
                                                <div className="relative">
                                                    <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                    <Input
                                                        type="text"
                                                        maxLength={12}
                                                        placeholder="12-digit Aadhaar number"
                                                        value={formData.aadhaarNumber}
                                                        onChange={(e) => handleInputChange('aadhaarNumber', e.target.value)}
                                                        className={`pl-10 h-11 bg-white/[0.04] border-white/[0.1] text-white placeholder:text-slate-600 rounded-xl ${
                                                            fieldErrors.aadhaarNumber ? 'border-rose-500 ring-1 ring-rose-500' : ''
                                                        }`}
                                                    />
                                                </div>
                                                {fieldErrors.aadhaarNumber && <p className="text-xs text-rose-400 mt-1">{fieldErrors.aadhaarNumber}</p>}
                                            </div>

                                            {/* PAN Number */}
                                            <div>
                                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                                    PAN Number <span className="text-rose-400">*</span>
                                                </label>
                                                <Input
                                                    type="text"
                                                    maxLength={10}
                                                    placeholder="10-character PAN (e.g. ABCDE1234F)"
                                                    value={formData.panNumber}
                                                    onChange={(e) => handleInputChange('panNumber', e.target.value.toUpperCase())}
                                                    className={`h-11 bg-white/[0.04] border-white/[0.1] text-white placeholder:text-slate-600 rounded-xl uppercase font-mono ${
                                                        fieldErrors.panNumber ? 'border-rose-500 ring-1 ring-rose-500' : ''
                                                    }`}
                                                />
                                                {fieldErrors.panNumber && <p className="text-xs text-rose-400 mt-1">{fieldErrors.panNumber}</p>}
                                            </div>

                                            {/* Date of Joining */}
                                            <div>
                                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                                    Date of Joining <span className="text-rose-400">*</span>
                                                </label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                    <Input
                                                        type="date"
                                                        value={formData.dateOfJoining}
                                                        onChange={(e) => handleInputChange('dateOfJoining', e.target.value)}
                                                        required
                                                        className={`pl-10 h-11 bg-white/[0.04] border-white/[0.1] text-white placeholder:text-slate-600 rounded-xl ${
                                                            fieldErrors.dateOfJoining ? 'border-rose-500 ring-1 ring-rose-500' : ''
                                                        }`}
                                                    />
                                                </div>
                                                {fieldErrors.dateOfJoining && <p className="text-xs text-rose-400 mt-1">{fieldErrors.dateOfJoining}</p>}
                                            </div>

                                            {/* Father's Mobile Number */}
                                            <div>
                                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                                    Father&apos;s Mobile Number <span className="text-rose-400">*</span>
                                                </label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                    <Input
                                                        type="tel"
                                                        maxLength={10}
                                                        placeholder="10-digit father's mobile"
                                                        value={formData.fatherMobileNumber}
                                                        onChange={(e) => handleInputChange('fatherMobileNumber', e.target.value)}
                                                        required
                                                        className={`pl-10 h-11 bg-white/[0.04] border-white/[0.1] text-white placeholder:text-slate-600 rounded-xl ${
                                                            fieldErrors.fatherMobileNumber ? 'border-rose-500 ring-1 ring-rose-500' : ''
                                                        }`}
                                                    />
                                                </div>
                                                {fieldErrors.fatherMobileNumber && (
                                                    <p className="text-xs text-rose-400 mt-1">{fieldErrors.fatherMobileNumber}</p>
                                                )}
                                            </div>

                                            {/* Resume Google Drive Link */}
                                            <div className="sm:col-span-2">
                                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                                    Resume / Portfolio (Google Drive Link) <span className="text-slate-500 font-normal">(Optional)</span>
                                                </label>
                                                <div className="relative">
                                                    <ExternalLink className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                    <Input
                                                        type="url"
                                                        placeholder="https://drive.google.com/file/d/..."
                                                        value={formData.resumeGoogleDriveLink}
                                                        onChange={(e) => handleInputChange('resumeGoogleDriveLink', e.target.value)}
                                                        className={`pl-10 h-11 bg-white/[0.04] border-white/[0.1] text-white placeholder:text-slate-600 rounded-xl ${
                                                            fieldErrors.resumeGoogleDriveLink ? 'border-rose-500 ring-1 ring-rose-500' : ''
                                                        }`}
                                                    />
                                                </div>
                                                <p className="text-[11px] text-slate-500 mt-1">Make sure the link sharing setting is set to &ldquo;Anyone with the link can view&rdquo;.</p>
                                                {fieldErrors.resumeGoogleDriveLink && (
                                                    <p className="text-xs text-rose-400 mt-1">{fieldErrors.resumeGoogleDriveLink}</p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Address Card */}
                                <Card className="border-white/[0.08] bg-slate-900/60 backdrop-blur-xl shadow-xl">
                                    <CardContent className="p-6 sm:p-8">
                                        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.06] flex-wrap gap-4">
                                            <div className="flex items-center gap-2.5">
                                                <Home className="w-5 h-5 text-indigo-400" />
                                                <div>
                                                    <h3 className="text-base font-semibold text-white">Address Information</h3>
                                                    <p className="text-xs text-slate-400">Residential and communication address</p>
                                                </div>
                                            </div>

                                            {/* Same as permanent checkbox */}
                                            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none bg-white/[0.04] hover:bg-white/[0.08] px-3 py-1.5 rounded-lg border border-white/[0.08] transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={sameAddress}
                                                    onChange={(e) => handleSameAddressToggle(e.target.checked)}
                                                    className="w-4 h-4 rounded border-slate-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                                                />
                                                <span>Same as Permanent Address</span>
                                            </label>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            {/* Permanent Address */}
                                            <div>
                                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                                    Permanent Address <span className="text-rose-400">*</span>
                                                </label>
                                                <textarea
                                                    rows={4}
                                                    placeholder="Enter full permanent address with pincode"
                                                    value={formData.permanentAddress}
                                                    onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
                                                    required
                                                    className={`w-full p-3 bg-white/[0.04] border border-white/[0.1] text-white placeholder:text-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                                                        fieldErrors.permanentAddress ? 'border-rose-500 ring-1 ring-rose-500' : ''
                                                    }`}
                                                />
                                                {fieldErrors.permanentAddress && (
                                                    <p className="text-xs text-rose-400 mt-1">{fieldErrors.permanentAddress}</p>
                                                )}
                                            </div>

                                            {/* Current Address */}
                                            <div>
                                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                                    Current Address <span className="text-rose-400">*</span>
                                                </label>
                                                <textarea
                                                    rows={4}
                                                    placeholder="Enter full current address with pincode"
                                                    value={formData.currentAddress}
                                                    onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                                                    disabled={sameAddress}
                                                    required
                                                    className={`w-full p-3 bg-white/[0.04] border border-white/[0.1] text-white placeholder:text-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                                                        sameAddress ? 'opacity-60 cursor-not-allowed' : ''
                                                    } ${fieldErrors.currentAddress ? 'border-rose-500 ring-1 ring-rose-500' : ''}`}
                                                />
                                                {fieldErrors.currentAddress && (
                                                    <p className="text-xs text-rose-400 mt-1">{fieldErrors.currentAddress}</p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Documents Upload Card */}
                                <Card className="border-white/[0.08] bg-slate-900/60 backdrop-blur-xl shadow-xl">
                                    <CardContent className="p-6 sm:p-8">
                                        <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-white/[0.06]">
                                            <FileText className="w-5 h-5 text-cyan-400" />
                                            <div>
                                                <h3 className="text-base font-semibold text-white">Upload Aadhaar / ID Proof</h3>
                                                <p className="text-xs text-slate-400">Only PDF files up to 10MB are permitted</p>
                                            </div>
                                        </div>

                                        {/* Upload area */}
                                        <div className="space-y-4">
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="border-2 border-dashed border-white/[0.12] hover:border-blue-500/50 rounded-2xl p-6 text-center cursor-pointer transition-all bg-white/[0.01] hover:bg-blue-500/[0.02]"
                                            >
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="application/pdf"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                                <UploadCloud className="w-10 h-10 text-blue-400 mx-auto mb-2" />
                                                <p className="text-sm font-semibold text-white">
                                                    {selectedFile ? selectedFile.name : 'Click to select or drop Aadhaar PDF'}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    PDF only, maximum 10MB
                                                </p>
                                            </div>

                                            {/* Selected file preview & direct upload button */}
                                            {selectedFile && (
                                                <div className="flex items-center justify-between p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                                    <div className="flex items-center gap-3">
                                                        <FileText className="w-5 h-5 text-blue-400" />
                                                        <div>
                                                            <div className="text-xs font-semibold text-white">{selectedFile.name}</div>
                                                            <div className="text-[11px] text-slate-400">
                                                                {(selectedFile.size / 1024).toFixed(1)} KB • Ready to upload
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <Button
                                                        type="button"
                                                        onClick={handleUploadDoc}
                                                        disabled={uploadingDoc}
                                                        className="bg-blue-600 hover:bg-blue-500 text-white text-xs h-8 px-3 rounded-lg gap-1.5"
                                                    >
                                                        {uploadingDoc ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
                                                        Upload Now
                                                    </Button>
                                                </div>
                                            )}

                                            {docError && (
                                                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                                                    <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                                                    <span>{docError}</span>
                                                </div>
                                            )}

                                            {/* Existing Uploaded Document Info */}
                                            {profile.aadhaarFileName && (
                                                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                                                        <div>
                                                            <span className="text-xs font-semibold text-white block">
                                                                Current Document: {profile.aadhaarFileName}
                                                            </span>
                                                            <span className="text-[11px] text-slate-400">
                                                                Status: <strong>{profile.documentStatus || 'PENDING'}</strong>
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <Button
                                                        type="button"
                                                        onClick={handleDownloadDocument}
                                                        variant="ghost"
                                                        className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 text-xs h-8 px-3 rounded-lg gap-1.5"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                        View Document
                                                    </Button>
                                                </div>
                                            )}

                                            {fieldErrors.document && (
                                                <p className="text-xs text-rose-400 mt-1">{fieldErrors.document}</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Action Buttons: [Save Draft] & [Submit Profile] */}
                                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                                    <Button
                                        type="button"
                                        onClick={handleSaveDraft}
                                        disabled={savingDraft || submitting}
                                        variant="outline"
                                        className="w-full sm:w-auto h-11 px-6 rounded-xl border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] text-white text-sm font-semibold transition-all"
                                    >
                                        {savingDraft ? (
                                            <span className="flex items-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Saving Draft...
                                            </span>
                                        ) : (
                                            'Save Draft'
                                        )}
                                    </Button>

                                    <Button
                                        type="submit"
                                        disabled={savingDraft || submitting}
                                        className="w-full sm:w-auto h-11 px-7 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all"
                                    >
                                        {submitting ? (
                                            <span className="flex items-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Submitting Profile...
                                            </span>
                                        ) : (
                                            'Submit Profile'
                                        )}
                                    </Button>
                                </div>
                            </motion.form>
                        )}
                    </div>
                )}
            </main>

            {/* ── Confirmation Modal Before Permanent Submission ── */}
            <AnimatePresence>
                {showSubmitConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-900 border border-white/[0.1] rounded-2xl p-6 max-w-md w-full shadow-2xl"
                        >
                            <div className="flex items-center gap-3 mb-4 text-amber-400">
                                <AlertTriangle className="w-6 h-6" />
                                <h3 className="text-lg font-bold text-white">Confirm Profile Submission</h3>
                            </div>

                            <p className="text-sm text-slate-300 leading-relaxed mb-6">
                                Once submitted, your profile will become <strong>permanently locked in read-only mode</strong>.
                                You will no longer be able to edit your personal details or documents without administrator approval.
                                <br /><br />
                                Are you sure all details are accurate and you wish to submit?
                            </p>

                            <div className="flex items-center justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setShowSubmitConfirm(false)}
                                    className="text-slate-400 hover:text-white"
                                >
                                    Cancel & Review
                                </Button>
                                <Button
                                    type="button"
                                    onClick={executeSubmitProfile}
                                    className="bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl px-5"
                                >
                                    Yes, Submit Profile
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
