'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import {
    getUserProfile,
    getUserDocuments,
    createUser,
    getAllUsers,
    changeUserPassword,
    uploadDocument,
    getAdminDocuments,
    updateUser,
    deleteUser,
    deleteDocument,
    type UserProfile,
    type UserDocument,
    type CreateUserRequest,
} from '@/lib/api';
import {
    User,
    Mail,
    Phone,
    FileText,
    Calendar,
    LogOut,
    ArrowLeft,
    Shield,
    CheckCircle,
    XCircle,
    Loader2,
    FolderOpen,
    Download,
    Tag,
    Clock,
    Home,
    UserPlus,
    Users,
    Eye,
    EyeOff,
    AlertCircle,
    RefreshCw,
    KeyRound,
    Upload,
    Trash2,
    File,
    UploadCloud,
    Edit,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuth();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [documents, setDocuments] = useState<UserDocument[]>([]);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingDocs, setLoadingDocs] = useState(true);
    const [profileError, setProfileError] = useState('');
    const [docsError, setDocsError] = useState('');

    // Admin state
    const [adminUsers, setAdminUsers] = useState<UserProfile[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [usersError, setUsersError] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState('');
    const [createSuccess, setCreateSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [newUser, setNewUser] = useState<CreateUserRequest>({
        userId: '',
        password: '',
        fullName: '',
        email: '',
        phone: '',
    });

    // Password change state
    const [changingPasswordFor, setChangingPasswordFor] = useState<string | null>(null);
    const [newPasswordValue, setNewPasswordValue] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');
    const [passwordChangeError, setPasswordChangeError] = useState('');

    // Edit User state
    const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
    const [editFullName, setEditFullName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [updatingUser, setUpdatingUser] = useState(false);

    // Delete User state
    const [userToDelete, setUserToDelete] = useState<string | null>(null);
    const [deletingUser, setDeletingUser] = useState(false);

    // Delete Doc state
    const [docToDelete, setDocToDelete] = useState<string | null>(null);
    const [deletingDoc, setDeletingDoc] = useState(false);

    // Document upload state
    const [uploadUserId, setUploadUserId] = useState('');
    const [uploadFiles, setUploadFiles] = useState<File[]>([]);
    const [uploadTitle, setUploadTitle] = useState('');
    const [uploadDescription, setUploadDescription] = useState('');
    const [uploadCategory, setUploadCategory] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState('');
    const [uploadError, setUploadError] = useState('');
    const [isDragOver, setIsDragOver] = useState(false);
    const [adminDocs, setAdminDocs] = useState<UserDocument[]>([]);
    const [loadingDocs2, setLoadingDocs2] = useState(false);
    const [docsFilterUser, setDocsFilterUser] = useState('');

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    // Fetch profile data
    useEffect(() => {
        if (!user?.userId) return;
        if (user.role === 'admin') {
            setLoadingProfile(false);
            setLoadingDocs(false);
            fetchUsers();
            return;
        }

        (async () => {
            try {
                const p = await getUserProfile(user.userId);
                setProfile(p);
            } catch (err: unknown) {
                setProfileError(err instanceof Error ? err.message : 'Failed to load profile');
            } finally {
                setLoadingProfile(false);
            }
        })();

        (async () => {
            try {
                const docs = await getUserDocuments(user.userId);
                setDocuments(docs.filter((d) => !d.deleted));
            } catch (err: unknown) {
                setDocsError(err instanceof Error ? err.message : 'Failed to load documents');
            } finally {
                setLoadingDocs(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // Admin helpers
    const fetchUsers = async () => {
        setLoadingUsers(true);
        setUsersError('');
        try {
            const users = await getAllUsers();
            setAdminUsers(users);
        } catch (err: unknown) {
            setUsersError(err instanceof Error ? err.message : 'Failed to load users');
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateError('');
        setCreateSuccess('');
        setCreating(true);
        try {
            const res = await createUser(newUser);
            setCreateSuccess(`User "${res.userId}" created successfully!`);
            setNewUser({ userId: '', password: '', fullName: '', email: '', phone: '' });
            setShowCreateForm(false);
            fetchUsers();
        } catch (err: unknown) {
            setCreateError(err instanceof Error ? err.message : 'Failed to create user');
        } finally {
            setCreating(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!changingPasswordFor) return;
        setPasswordChangeError('');
        setPasswordChangeSuccess('');
        setChangingPassword(true);
        try {
            await changeUserPassword(changingPasswordFor, newPasswordValue);
            setPasswordChangeSuccess(`Password for "${changingPasswordFor}" changed successfully!`);
            setChangingPasswordFor(null);
            setNewPasswordValue('');
        } catch (err: unknown) {
            setPasswordChangeError(err instanceof Error ? err.message : 'Failed to change password');
        } finally {
            setChangingPassword(false);
        }
    };

    // Document upload handlers
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        setUploadFiles(prev => [...prev, ...droppedFiles]);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setUploadFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeFile = (index: number) => {
        setUploadFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUploadDocuments = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadUserId || uploadFiles.length === 0) return;
        setUploadError('');
        setUploadSuccess('');
        setUploading(true);
        try {
            let uploaded = 0;
            for (const file of uploadFiles) {
                const title = uploadTitle || file.name.replace(/\.[^.]+$/, '');
                await uploadDocument(uploadUserId, file, title, uploadDescription || undefined, uploadCategory || undefined);
                uploaded++;
            }
            setUploadSuccess(`Successfully uploaded ${uploaded} file${uploaded > 1 ? 's' : ''} for user "${uploadUserId}"!`);
            setUploadFiles([]);
            setUploadTitle('');
            setUploadDescription('');
            setUploadCategory('');
            fetchDocs();
        } catch (err: unknown) {
            setUploadError(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const fetchDocs = async () => {
        setLoadingDocs2(true);
        try {
            const docs = await getAdminDocuments(docsFilterUser || undefined);
            setAdminDocs(docs);
        } catch {
            // silent
        } finally {
            setLoadingDocs2(false);
        }
    };

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchDocs();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.role, docsFilterUser]);

    const handleUpdateUser = async () => {
        if (!editingUser) return;
        setUpdatingUser(true);
        try {
            await updateUser(editingUser.userId, { fullName: editFullName, email: editEmail, phone: editPhone });
            setCreateSuccess(`User "${editingUser.userId}" updated successfully!`);
            setEditingUser(null);
            fetchUsers();
        } catch (err: unknown) {
            setCreateError(err instanceof Error ? err.message : 'Update failed');
        } finally {
            setUpdatingUser(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        setDeletingUser(true);
        try {
            await deleteUser(userToDelete);
            setCreateSuccess(`User "${userToDelete}" deleted successfully!`);
            setUserToDelete(null);
            fetchUsers();
        } catch (err: unknown) {
            setCreateError(err instanceof Error ? err.message : 'Delete failed');
        } finally {
            setDeletingUser(false);
        }
    };

    const handleDeleteDoc = async () => {
        if (!docToDelete) return;
        setDeletingDoc(true);
        try {
            await deleteDocument(docToDelete);
            fetchDocs();
            setDocToDelete(null);
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : 'Delete document failed');
        } finally {
            setDeletingDoc(false);
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    if (!isAuthenticated || !user) {
        return null;
    }

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            });
        } catch {
            return dateStr;
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            tax: 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30 text-emerald-400',
            audit: 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400',
            compliance: 'from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400',
            legal: 'from-amber-500/20 to-amber-600/20 border-amber-500/30 text-amber-400',
            financial: 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30 text-cyan-400',
        };
        return colors[category?.toLowerCase()] || 'from-slate-500/20 to-slate-600/20 border-slate-500/30 text-slate-400';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
            {/* Background effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-[20%] w-[500px] h-[500px] bg-blue-500/[0.07] rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-[10%] w-[400px] h-[400px] bg-indigo-500/[0.05] rounded-full blur-[100px]" />
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <img
                                src="https://education21.in/wp-content/uploads/2023/12/CA-India-Logo-1024x762.png"
                                alt="CA Logo"
                                className="w-10 h-10 object-contain rounded-full bg-white/10 border border-white/[0.08] p-1"
                            />
                            <div>
                                <div className="text-sm font-bold text-white">MRS & Co.</div>
                                <div className="text-[9px] text-cyan-400 font-semibold tracking-wide">Chartered Accountants</div>
                            </div>
                        </Link>
                        <div className="hidden sm:block h-6 w-px bg-white/10" />
                        <span className="hidden sm:block text-sm text-slate-400 font-medium">Dashboard</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
                        >
                            <Home className="w-3.5 h-3.5" />
                            Home
                        </Link>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                            {user.role === 'admin' ? (
                                <Shield className="w-3.5 h-3.5 text-amber-400" />
                            ) : (
                                <User className="w-3.5 h-3.5 text-blue-400" />
                            )}
                            <span className="text-sm text-white font-medium">{user.fullName || user.userId}</span>
                        </div>
                        <Button
                            onClick={handleLogout}
                            variant="ghost"
                            className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all px-3"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline ml-1.5 text-sm">Logout</span>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8">
                {/* Welcome Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-white mb-1">
                        Welcome back, <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">{user.fullName || user.userId}</span>
                    </h1>
                    <p className="text-slate-400 text-sm">
                        {user.role === 'admin' ? 'Administrator Dashboard' : 'View your profile and documents below'}
                    </p>
                </motion.div>

                {/* Admin View */}
                {user.role === 'admin' && (
                    <div className="space-y-6">
                        {/* Feedback Messages */}
                        {createSuccess && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm"
                            >
                                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                                {createSuccess}
                                <button onClick={() => setCreateSuccess('')} className="ml-auto text-emerald-400/60 hover:text-emerald-400">
                                    <XCircle className="w-4 h-4" />
                                </button>
                            </motion.div>
                        )}
                        {passwordChangeSuccess && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm"
                            >
                                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                                {passwordChangeSuccess}
                                <button onClick={() => setPasswordChangeSuccess('')} className="ml-auto text-emerald-400/60 hover:text-emerald-400">
                                    <XCircle className="w-4 h-4" />
                                </button>
                            </motion.div>
                        )}
                        {passwordChangeError && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                            >
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {passwordChangeError}
                                <button onClick={() => setPasswordChangeError('')} className="ml-auto text-red-400/60 hover:text-red-400">
                                    <XCircle className="w-4 h-4" />
                                </button>
                            </motion.div>
                        )}
                        {createError && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                            >
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {createError}
                                <button onClick={() => setCreateError('')} className="ml-auto text-red-400/60 hover:text-red-400">
                                    <XCircle className="w-4 h-4" />
                                </button>
                            </motion.div>
                        )}

                        {/* Stats Row */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                        >
                            <Card className="border-white/[0.08] bg-white/[0.04] backdrop-blur-xl">
                                <CardContent className="p-5 flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/20 flex items-center justify-center">
                                        <Users className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-white">{adminUsers.length}</div>
                                        <div className="text-xs text-slate-400">Total Users</div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-white/[0.08] bg-white/[0.04] backdrop-blur-xl">
                                <CardContent className="p-5 flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/20 flex items-center justify-center">
                                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-white">{adminUsers.filter(u => u.active).length}</div>
                                        <div className="text-xs text-slate-400">Active Users</div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-white/[0.08] bg-white/[0.04] backdrop-blur-xl">
                                <CardContent className="p-5 flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-amber-400" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-white">Admin</div>
                                        <div className="text-xs text-slate-400">Your Role</div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Create User Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.15 }}
                        >
                            <Card className="border-white/[0.08] bg-white/[0.04] backdrop-blur-xl">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-5">
                                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                            <UserPlus className="w-5 h-5 text-cyan-400" />
                                            Create New User
                                        </h2>
                                        <Button
                                            variant="ghost"
                                            onClick={() => { setShowCreateForm(!showCreateForm); setCreateError(''); }}
                                            className={`text-sm px-3 py-1.5 transition-all ${showCreateForm
                                                ? 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                                                : 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10'
                                                }`}
                                        >
                                            {showCreateForm ? 'Cancel' : '+ New User'}
                                        </Button>
                                    </div>

                                    {showCreateForm && (
                                        <motion.form
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            onSubmit={handleCreateUser}
                                            className="space-y-4"
                                        >
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {/* User ID */}
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">User ID *</label>
                                                    <div className="relative">
                                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                        <Input
                                                            required
                                                            placeholder="e.g. john_doe"
                                                            value={newUser.userId}
                                                            onChange={(e) => setNewUser({ ...newUser, userId: e.target.value })}
                                                            className="pl-10 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                                                        />
                                                    </div>
                                                </div>
                                                {/* Password */}
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Password *</label>
                                                    <div className="relative">
                                                        <Input
                                                            required
                                                            type={showPassword ? 'text' : 'password'}
                                                            placeholder="Enter password"
                                                            value={newUser.password}
                                                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                                            className="pr-10 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                                        >
                                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                </div>
                                                {/* Full Name */}
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Full Name</label>
                                                    <Input
                                                        placeholder="e.g. John Doe"
                                                        value={newUser.fullName}
                                                        onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                                                        className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                                                    />
                                                </div>
                                                {/* Email */}
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email</label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                        <Input
                                                            type="email"
                                                            placeholder="e.g. john@example.com"
                                                            value={newUser.email}
                                                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                                            className="pl-10 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                                                        />
                                                    </div>
                                                </div>
                                                {/* Phone */}
                                                <div className="space-y-1.5 sm:col-span-2">
                                                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Phone</label>
                                                    <div className="relative">
                                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                        <Input
                                                            placeholder="e.g. +91 98765 43210"
                                                            value={newUser.phone}
                                                            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                                                            className="pl-10 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-end pt-2">
                                                <Button
                                                    type="submit"
                                                    disabled={creating}
                                                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium px-6 shadow-lg shadow-cyan-500/20 transition-all"
                                                >
                                                    {creating ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                            Creating...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <UserPlus className="w-4 h-4 mr-2" />
                                                            Create User
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </motion.form>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Users List */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Card className="border-white/[0.08] bg-white/[0.04] backdrop-blur-xl">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-5">
                                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                            <Users className="w-5 h-5 text-blue-400" />
                                            Registered Users
                                        </h2>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-500 bg-white/[0.04] px-2.5 py-1 rounded-full">
                                                {adminUsers.length} {adminUsers.length === 1 ? 'user' : 'users'}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                onClick={fetchUsers}
                                                disabled={loadingUsers}
                                                className="text-slate-400 hover:text-white hover:bg-white/[0.06] px-2"
                                            >
                                                <RefreshCw className={`w-4 h-4 ${loadingUsers ? 'animate-spin' : ''}`} />
                                            </Button>
                                        </div>
                                    </div>

                                    {loadingUsers ? (
                                        <div className="flex items-center justify-center py-16">
                                            <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                                        </div>
                                    ) : usersError ? (
                                        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                            {usersError}
                                        </div>
                                    ) : adminUsers.length === 0 ? (
                                        <div className="text-center py-16">
                                            <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                                            <p className="text-slate-400 font-medium">No users yet</p>
                                            <p className="text-slate-500 text-sm mt-1">
                                                Click &ldquo;+ New User&rdquo; above to create the first user.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b border-white/[0.06]">
                                                        <th className="text-left py-3 px-3 text-slate-400 font-medium text-xs uppercase tracking-wider">User</th>
                                                        <th className="text-left py-3 px-3 text-slate-400 font-medium text-xs uppercase tracking-wider hidden sm:table-cell">Email</th>
                                                        <th className="text-left py-3 px-3 text-slate-400 font-medium text-xs uppercase tracking-wider hidden md:table-cell">Phone</th>
                                                        <th className="text-left py-3 px-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Status</th>
                                                        <th className="text-left py-3 px-3 text-slate-400 font-medium text-xs uppercase tracking-wider hidden lg:table-cell">Created</th>
                                                        <th className="text-right py-3 px-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {adminUsers.map((u, index) => (
                                                        <motion.tr
                                                            key={u.id || u.userId}
                                                            initial={{ opacity: 0, y: 5 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 0.2, delay: index * 0.03 }}
                                                            className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors"
                                                        >
                                                            <td className="py-3 px-3">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/30 to-indigo-500/30 border border-blue-500/20 flex items-center justify-center text-blue-300 text-xs font-bold">
                                                                        {(u.fullName || u.userId).charAt(0).toUpperCase()}
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-white font-medium">{u.fullName || u.userId}</div>
                                                                        <div className="text-slate-500 text-xs">@{u.userId}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-3 px-3 text-slate-300 hidden sm:table-cell">
                                                                {u.email || <span className="text-slate-600">—</span>}
                                                            </td>
                                                            <td className="py-3 px-3 text-slate-300 hidden md:table-cell">
                                                                {u.phone || <span className="text-slate-600">—</span>}
                                                            </td>
                                                            <td className="py-3 px-3">
                                                                {u.active ? (
                                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                                                                        <CheckCircle className="w-3 h-3" />
                                                                        Active
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                                                                        <XCircle className="w-3 h-3" />
                                                                        Inactive
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="py-3 px-3 text-slate-400 text-xs hidden lg:table-cell">
                                                                {u.createdAt ? formatDate(u.createdAt) : '—'}
                                                            </td>
                                                            <td className="py-3 px-3 text-right">
                                                                {changingPasswordFor === u.userId ? (
                                                                    <form onSubmit={handleChangePassword} className="flex items-center gap-2 justify-end">
                                                                        <div className="relative">
                                                                            <Input
                                                                                required
                                                                                type={showNewPassword ? 'text' : 'password'}
                                                                                placeholder="New password"
                                                                                value={newPasswordValue}
                                                                                onChange={(e) => setNewPasswordValue(e.target.value)}
                                                                                className="h-8 w-36 text-xs bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-cyan-500/20 pr-8"
                                                                                autoFocus
                                                                            />
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                                                            >
                                                                                {showNewPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                                                            </button>
                                                                        </div>
                                                                        <Button
                                                                            type="submit"
                                                                            disabled={changingPassword}
                                                                            className="h-8 px-3 text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white"
                                                                        >
                                                                            {changingPassword ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Save'}
                                                                        </Button>
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            onClick={() => { setChangingPasswordFor(null); setNewPasswordValue(''); setPasswordChangeError(''); }}
                                                                            className="h-8 px-2 text-slate-400 hover:text-white hover:bg-white/[0.06]"
                                                                        >
                                                                            <XCircle className="w-3.5 h-3.5" />
                                                                        </Button>
                                                                    </form>
                                                                ) : (
                                                                    <div className="flex items-center justify-end gap-1">
                                                                        <Button
                                                                            variant="ghost"
                                                                            onClick={() => { setChangingPasswordFor(u.userId); setNewPasswordValue(''); setPasswordChangeError(''); setPasswordChangeSuccess(''); }}
                                                                            className="h-8 px-2 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-all"
                                                                            title="Change password"
                                                                        >
                                                                            <KeyRound className="w-4 h-4" />
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            onClick={() => { setEditingUser(u); setEditFullName(u.fullName || ''); setEditEmail(u.email || ''); setEditPhone(u.phone || ''); }}
                                                                            className="h-8 px-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                                                                            title="Edit User"
                                                                        >
                                                                            <Edit className="w-4 h-4" />
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            onClick={() => setUserToDelete(u.userId)}
                                                                            className="h-8 px-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                                                            title="Delete User"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </td>
                                                        </motion.tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Document Upload Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <Card className="border-white/[0.08] bg-white/[0.04] backdrop-blur-xl">
                                <CardContent className="p-6">
                                    <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-5">
                                        <UploadCloud className="w-5 h-5 text-violet-400" />
                                        Upload Documents
                                    </h2>

                                    {uploadSuccess && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-4">
                                            <CheckCircle className="w-4 h-4 flex-shrink-0" />
                                            {uploadSuccess}
                                            <button onClick={() => setUploadSuccess('')} className="ml-auto text-emerald-400/60 hover:text-emerald-400"><XCircle className="w-4 h-4" /></button>
                                        </motion.div>
                                    )}
                                    {uploadError && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
                                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                            {uploadError}
                                            <button onClick={() => setUploadError('')} className="ml-auto text-red-400/60 hover:text-red-400"><XCircle className="w-4 h-4" /></button>
                                        </motion.div>
                                    )}

                                    <form onSubmit={handleUploadDocuments} className="space-y-4">
                                        {/* Select User */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Assign to User *</label>
                                            <select
                                                required
                                                value={uploadUserId}
                                                onChange={(e) => setUploadUserId(e.target.value)}
                                                className="w-full h-10 px-3 rounded-md bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 outline-none appearance-none"
                                            >
                                                <option value="" className="bg-slate-900">Select a user...</option>
                                                {adminUsers.map(u => (
                                                    <option key={u.userId} value={u.userId} className="bg-slate-900">
                                                        {u.fullName || u.userId} (@{u.userId})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Drag & Drop Zone */}
                                        <div
                                            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                                            onDragLeave={() => setIsDragOver(false)}
                                            onDrop={handleDrop}
                                            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${isDragOver
                                                ? 'border-violet-400 bg-violet-500/10 scale-[1.01]'
                                                : 'border-white/[0.1] bg-white/[0.02] hover:border-white/[0.2] hover:bg-white/[0.04]'
                                                }`}
                                            onClick={() => document.getElementById('file-upload-input')?.click()}
                                        >
                                            <input
                                                id="file-upload-input"
                                                type="file"
                                                multiple
                                                onChange={handleFileSelect}
                                                className="hidden"
                                            />
                                            <Upload className={`w-10 h-10 mx-auto mb-3 transition-colors ${isDragOver ? 'text-violet-400' : 'text-slate-500'}`} />
                                            <p className="text-sm font-medium text-slate-300">
                                                {isDragOver ? 'Drop files here!' : 'Drag & drop files here'}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">or click to browse files</p>
                                        </div>

                                        {/* Selected Files Preview */}
                                        {uploadFiles.length > 0 && (
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                                                    {uploadFiles.length} file{uploadFiles.length > 1 ? 's' : ''} selected
                                                </label>
                                                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                                                    {uploadFiles.map((file, index) => (
                                                        <div key={index} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                                                            <File className="w-4 h-4 text-violet-400 flex-shrink-0" />
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm text-white truncate">{file.name}</p>
                                                                <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                                                                className="text-slate-500 hover:text-red-400 transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Title, Description, Category */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Title</label>
                                                <Input
                                                    placeholder="Auto-filled from filename"
                                                    value={uploadTitle}
                                                    onChange={(e) => setUploadTitle(e.target.value)}
                                                    className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Category</label>
                                                <Input
                                                    placeholder="e.g. Tax, Legal"
                                                    value={uploadCategory}
                                                    onChange={(e) => setUploadCategory(e.target.value)}
                                                    className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Description</label>
                                                <Input
                                                    placeholder="Optional description"
                                                    value={uploadDescription}
                                                    onChange={(e) => setUploadDescription(e.target.value)}
                                                    className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-2">
                                            <Button
                                                type="submit"
                                                disabled={uploading || uploadFiles.length === 0 || !uploadUserId}
                                                className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-medium px-6 shadow-lg shadow-violet-500/20 transition-all disabled:opacity-40"
                                            >
                                                {uploading ? (
                                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Uploading...</>
                                                ) : (
                                                    <><Upload className="w-4 h-4 mr-2" />Upload {uploadFiles.length > 0 ? `${uploadFiles.length} File${uploadFiles.length > 1 ? 's' : ''}` : 'Files'}</>
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Documents List */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <Card className="border-white/[0.08] bg-white/[0.04] backdrop-blur-xl">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-5">
                                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-orange-400" />
                                            Documents
                                        </h2>
                                        <div className="flex items-center gap-2">
                                            <select
                                                value={docsFilterUser}
                                                onChange={(e) => setDocsFilterUser(e.target.value)}
                                                className="h-8 px-2 rounded-md bg-white/[0.04] border border-white/[0.08] text-slate-300 text-xs focus:border-cyan-500/50 outline-none appearance-none"
                                            >
                                                <option value="" className="bg-slate-900">All Users</option>
                                                {adminUsers.map(u => (
                                                    <option key={u.userId} value={u.userId} className="bg-slate-900">
                                                        {u.fullName || u.userId}
                                                    </option>
                                                ))}
                                            </select>
                                            <span className="text-xs text-slate-500 bg-white/[0.04] px-2.5 py-1 rounded-full">
                                                {adminDocs.length} doc{adminDocs.length !== 1 ? 's' : ''}
                                            </span>
                                            <Button variant="ghost" onClick={fetchDocs} disabled={loadingDocs2} className="text-slate-400 hover:text-white hover:bg-white/[0.06] px-2">
                                                <RefreshCw className={`w-4 h-4 ${loadingDocs2 ? 'animate-spin' : ''}`} />
                                            </Button>
                                        </div>
                                    </div>

                                    {loadingDocs2 ? (
                                        <div className="flex items-center justify-center py-16">
                                            <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
                                        </div>
                                    ) : adminDocs.length === 0 ? (
                                        <div className="text-center py-16">
                                            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                                            <p className="text-slate-400 font-medium">No documents yet</p>
                                            <p className="text-slate-500 text-sm mt-1">Upload files above to get started.</p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b border-white/[0.06]">
                                                        <th className="text-left py-3 px-3 text-slate-400 font-medium text-xs uppercase tracking-wider">File</th>
                                                        <th className="text-left py-3 px-3 text-slate-400 font-medium text-xs uppercase tracking-wider hidden sm:table-cell">Category</th>
                                                        <th className="text-left py-3 px-3 text-slate-400 font-medium text-xs uppercase tracking-wider hidden md:table-cell">Size</th>
                                                        <th className="text-left py-3 px-3 text-slate-400 font-medium text-xs uppercase tracking-wider hidden lg:table-cell">Uploaded</th>
                                                        <th className="text-right py-3 px-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {adminDocs.map((doc, index) => (
                                                        <motion.tr
                                                            key={doc.id}
                                                            initial={{ opacity: 0, y: 5 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 0.2, delay: index * 0.03 }}
                                                            className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors"
                                                        >
                                                            <td className="py-3 px-3">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/30 to-red-500/30 border border-orange-500/20 flex items-center justify-center">
                                                                        <File className="w-4 h-4 text-orange-300" />
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-white font-medium truncate max-w-[200px]">{doc.title || doc.originalFileName}</div>
                                                                        <div className="text-slate-500 text-xs">{doc.originalFileName}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-3 px-3 hidden sm:table-cell">
                                                                {doc.category ? (
                                                                    <span className="inline-flex px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs">{doc.category}</span>
                                                                ) : (
                                                                    <span className="text-slate-600">&mdash;</span>
                                                                )}
                                                            </td>
                                                            <td className="py-3 px-3 text-slate-400 text-xs hidden md:table-cell">
                                                                {doc.fileSize ? `${(doc.fileSize / 1024).toFixed(1)} KB` : '—'}
                                                            </td>
                                                            <td className="py-3 px-3 text-slate-400 text-xs hidden lg:table-cell">
                                                                {doc.createdAt ? formatDate(doc.createdAt) : '—'}
                                                            </td>
                                                            <td className="py-3 px-3 text-right">
                                                                <Button
                                                                    variant="ghost"
                                                                    onClick={() => setDocToDelete(doc.id)}
                                                                    className="h-8 px-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                                                    title="Delete Document"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </td>
                                                        </motion.tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                )}

                {/* User View: Profile + Documents */}
                {user.role === 'user' && (
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Profile Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="lg:col-span-1"
                        >
                            <Card className="border-white/[0.08] bg-white/[0.04] backdrop-blur-xl h-full">
                                <CardContent className="p-6">
                                    <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                                        <User className="w-5 h-5 text-blue-400" />
                                        Profile
                                    </h2>

                                    {loadingProfile ? (
                                        <div className="flex items-center justify-center py-10">
                                            <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                                        </div>
                                    ) : profileError ? (
                                        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                            <XCircle className="w-4 h-4 flex-shrink-0" />
                                            {profileError}
                                        </div>
                                    ) : profile ? (
                                        <div className="space-y-4">
                                            {/* Avatar */}
                                            <div className="flex items-center gap-4 pb-4 border-b border-white/[0.06]">
                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/25">
                                                    {(profile.fullName || profile.userId).charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-white font-semibold">{profile.fullName}</div>
                                                    <div className="text-slate-400 text-xs">@{profile.userId}</div>
                                                </div>
                                            </div>

                                            {/* Details */}
                                            <div className="space-y-3">
                                                {profile.email && (
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
                                                        <span className="text-slate-300 truncate">{profile.email}</span>
                                                    </div>
                                                )}
                                                {profile.phone && (
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <Phone className="w-4 h-4 text-slate-500 flex-shrink-0" />
                                                        <span className="text-slate-300">{profile.phone}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-3 text-sm">
                                                    <Calendar className="w-4 h-4 text-slate-500 flex-shrink-0" />
                                                    <span className="text-slate-300">
                                                        Joined {profile.createdAt ? formatDate(profile.createdAt) : 'N/A'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm">
                                                    {profile.active ? (
                                                        <>
                                                            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                                            <span className="text-emerald-400 font-medium">Active</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                                                            <span className="text-red-400 font-medium">Inactive</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Documents */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="lg:col-span-2"
                        >
                            <Card className="border-white/[0.08] bg-white/[0.04] backdrop-blur-xl">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-5">
                                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                            <FolderOpen className="w-5 h-5 text-cyan-400" />
                                            Your Documents
                                        </h2>
                                        {!loadingDocs && (
                                            <span className="text-xs text-slate-500 bg-white/[0.04] px-2.5 py-1 rounded-full">
                                                {documents.length} {documents.length === 1 ? 'file' : 'files'}
                                            </span>
                                        )}
                                    </div>

                                    {loadingDocs ? (
                                        <div className="flex items-center justify-center py-16">
                                            <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
                                        </div>
                                    ) : docsError ? (
                                        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                            <XCircle className="w-4 h-4 flex-shrink-0" />
                                            {docsError}
                                        </div>
                                    ) : documents.length === 0 ? (
                                        <div className="text-center py-16">
                                            <FolderOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                                            <p className="text-slate-400 font-medium">No documents yet</p>
                                            <p className="text-slate-500 text-sm mt-1">
                                                Documents uploaded by admin will appear here.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {documents.map((doc, index) => (
                                                <motion.div
                                                    key={doc.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                                    className="group flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-300"
                                                >
                                                    {/* File Icon */}
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                                                        <FileText className="w-5 h-5 text-blue-400" />
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-white font-medium text-sm truncate">
                                                            {doc.title}
                                                        </div>
                                                        {doc.description && (
                                                            <p className="text-slate-400 text-xs mt-0.5 line-clamp-2">
                                                                {doc.description}
                                                            </p>
                                                        )}
                                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                                            {doc.category && (
                                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gradient-to-r border text-[10px] font-medium uppercase tracking-wider ${getCategoryColor(doc.category)}`}>
                                                                    <Tag className="w-2.5 h-2.5" />
                                                                    {doc.category}
                                                                </span>
                                                            )}
                                                            <span className="text-slate-500 text-xs flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {formatDate(doc.createdAt)}
                                                            </span>
                                                            <span className="text-slate-600 text-xs">
                                                                {formatFileSize(doc.fileSize)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Download Button */}
                                                    <Button
                                                        variant="ghost"
                                                        onClick={async () => {
                                                            try {
                                                                const token = localStorage.getItem('mrs_auth_user');
                                                                const parsed = token ? JSON.parse(token) : null;
                                                                const res = await fetch(`/backend/user/${user.userId}/documents/${doc.id}/download`, {
                                                                    headers: parsed?.token ? { 'Authorization': `Bearer ${parsed.token}` } : {},
                                                                });
                                                                if (!res.ok) throw new Error('Download failed');
                                                                const blob = await res.blob();
                                                                const url = window.URL.createObjectURL(blob);
                                                                const link = document.createElement('a');
                                                                link.href = url;
                                                                link.download = doc.originalFileName || doc.title;
                                                                document.body.appendChild(link);
                                                                link.click();
                                                                document.body.removeChild(link);
                                                                window.URL.revokeObjectURL(url);
                                                            } catch {
                                                                // silent fail
                                                            }
                                                        }}
                                                        className="text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all opacity-0 group-hover:opacity-100 px-2"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </Button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                )}
            </main>

            {/* Modals */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Edit className="w-5 h-5 text-blue-400" /> Edit User: {editingUser.userId}
                            </h3>
                            <Button variant="ghost" onClick={() => setEditingUser(null)} className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-white/10 rounded-full"><XCircle className="w-5 h-5" /></Button>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs text-slate-400 uppercase tracking-wider">Full Name</label>
                                <Input value={editFullName} onChange={e => setEditFullName(e.target.value)} className="bg-white/[0.04] text-white border-white/10 focus:border-cyan-500/50" placeholder="e.g. John Doe" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs text-slate-400 uppercase tracking-wider">Email</label>
                                <Input value={editEmail} onChange={e => setEditEmail(e.target.value)} type="email" className="bg-white/[0.04] text-white border-white/10 focus:border-cyan-500/50" placeholder="john@example.com" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs text-slate-400 uppercase tracking-wider">Phone</label>
                                <Input value={editPhone} onChange={e => setEditPhone(e.target.value)} className="bg-white/[0.04] text-white border-white/10 focus:border-cyan-500/50" placeholder="+91 98765 43210" />
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end mt-6">
                            <Button variant="ghost" onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white">Cancel</Button>
                            <Button onClick={handleUpdateUser} disabled={updatingUser} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20">
                                {updatingUser ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {userToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-red-500/20 rounded-2xl p-6 w-full max-w-sm">
                        <div className="flex items-center gap-3 mb-4 text-red-400">
                            <AlertCircle className="w-6 h-6" />
                            <h3 className="text-lg font-bold">Delete User</h3>
                        </div>
                        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                            Are you sure you want to delete user <strong className="text-white">{userToDelete}</strong>? This will also permanently delete all their assigned documents. This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <Button variant="ghost" onClick={() => setUserToDelete(null)} className="text-slate-400 hover:text-white">Cancel</Button>
                            <Button variant="destructive" onClick={handleDeleteUser} disabled={deletingUser} className="bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20">
                                {deletingUser ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />} Delete User
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {docToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-red-500/20 rounded-2xl p-6 w-full max-w-sm">
                        <div className="flex items-center gap-3 mb-4 text-red-400">
                            <AlertCircle className="w-6 h-6" />
                            <h3 className="text-lg font-bold">Delete Document</h3>
                        </div>
                        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                            Are you sure you want to delete this document? The file will be permanently removed from the server.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <Button variant="ghost" onClick={() => setDocToDelete(null)} className="text-slate-400 hover:text-white">Cancel</Button>
                            <Button variant="destructive" onClick={handleDeleteDoc} disabled={deletingDoc} className="bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20">
                                {deletingDoc ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />} Delete Document
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
