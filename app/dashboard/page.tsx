
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import {
    getUserProfile,
    getUserDocuments,
    createUser,
    getAllUsers,
    getAdminEmployees,
    changeUserPassword,
    uploadDocument,
    getAdminDocuments,
    updateUser,
    deleteUser,
    deleteDocument,
    downloadDocument,
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
    MessageSquarePlus,
    MessageCircle,
    Send,
    ClipboardList,
    Menu,
    X,
    ChevronRight,
    LayoutDashboard,
    Paperclip,
    Sparkles,
    ShieldCheck,
    Activity,
    Layers,
    ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';
import { CardTilt3D } from '@/components/dashboard/CardTilt3D';
import { AmbientParticleCanvas } from '@/components/dashboard/AmbientParticleCanvas';
import { Interactive3DEmptyState } from '@/components/dashboard/Interactive3DEmptyState';
import { Tactile3DButton } from '@/components/dashboard/Tactile3DButton';
import { AdminEmployeeManagement } from '@/components/dashboard/AdminEmployeeManagement';


// ─── Logo ────────────────────────────────────────────────────────────────────

function MRSLogo({ collapsed }: { collapsed: boolean }) {
    return (
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-all duration-300 group select-none overflow-hidden">
            <div className="relative flex-shrink-0">
                <div
                    className="absolute inset-0 rounded-full opacity-60 group-hover:opacity-90 transition-opacity duration-500 blur-md"
                    style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.45) 0%, transparent 70%)', margin: '-6px' }}
                />
                <div
                    className="relative w-9 h-9 rounded-full flex items-center justify-center"
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
            </div>
            {!collapsed && (
                <div className="flex flex-col leading-none gap-[3px] min-w-0">
                    <div className="text-[13px] font-bold text-white tracking-[0.06em] whitespace-nowrap"
                        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                        MRS & Co.
                    </div>
                    <span className="text-[7px] tracking-[0.18em] uppercase whitespace-nowrap"
                        style={{
                            color: 'transparent',
                            background: 'linear-gradient(90deg, #93c5fd, #bfdbfe)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                        }}>
                        Chartered Accountants
                    </span>
                </div>
            )}
        </Link>
    );
}

// ─── Sidebar nav config ───────────────────────────────────────────────────────

type AdminSection =
    | 'overview'
    | 'create-client'
    | 'clients-list'
    | 'upload-document'
    | 'documents-list'
    | 'share-drive'
    | 'drive-list'
    | 'raise-query'
    | 'queries-list'
    | 'employees';

interface NavItem {
    id: AdminSection;
    label: string;
    icon: React.ReactNode;
    group: 'main' | 'actions' | 'lists';
}

const adminNavItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" />, group: 'main' },
    { id: 'create-client', label: 'Create Client', icon: <UserPlus className="w-4 h-4" />, group: 'actions' },
    { id: 'upload-document', label: 'Upload Document', icon: <UploadCloud className="w-4 h-4" />, group: 'actions' },
    { id: 'share-drive', label: 'Share Drive Folder', icon: <FolderOpen className="w-4 h-4" />, group: 'actions' },
    { id: 'raise-query', label: 'Raise a Query', icon: <MessageSquarePlus className="w-4 h-4" />, group: 'actions' },
    { id: 'employees', label: 'Employee Management', icon: <Users className="w-4 h-4" />, group: 'lists' },
    { id: 'clients-list', label: 'All Clients', icon: <Users className="w-4 h-4" />, group: 'lists' },
    { id: 'documents-list', label: 'Documents', icon: <FileText className="w-4 h-4" />, group: 'lists' },
    { id: 'drive-list', label: 'Drive Links', icon: <FolderOpen className="w-4 h-4" />, group: 'lists' },
    { id: 'queries-list', label: 'Queries', icon: <ClipboardList className="w-4 h-4" />, group: 'lists' },
];

const groupLabels: Record<string, string> = {
    main: 'Dashboard',
    actions: 'Actions',
    lists: 'Lists',
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuth();

    // Sidebar state
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<AdminSection>('overview');

    // ── Profile / docs (client) ──
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [documents, setDocuments] = useState<UserDocument[]>([]);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingDocs, setLoadingDocs] = useState(true);
    const [profileError, setProfileError] = useState('');
    const [docsError, setDocsError] = useState('');

    // ── Admin: users ──
    const [adminUsers, setAdminUsers] = useState<UserProfile[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [usersError, setUsersError] = useState('');
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState('');
    const [createSuccess, setCreateSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [newUser, setNewUser] = useState<CreateUserRequest>({
        userId: '', password: '', fullName: '', email: '', phone: '',
    });

    // ── Admin: drive links ──
    const [driveLinks, setDriveLinks] = useState<any[]>([]);
    const [loadingDriveLinks, setLoadingDriveLinks] = useState(false);
    const [driveUserId, setDriveUserId] = useState('');
    const [driveYear, setDriveYear] = useState('');
    const [driveUrl, setDriveUrl] = useState('');
    const [driveTitle, setDriveTitle] = useState('');
    const [driveDescription, setDriveDescription] = useState('');
    const [driveSaving, setDriveSaving] = useState(false);
    const [driveSuccess, setDriveSuccess] = useState('');
    const [driveError, setDriveError] = useState('');
    const [clientDriveLinks, setClientDriveLinks] = useState<any[]>([]);
    const [loadingClientDriveLinks, setLoadingClientDriveLinks] = useState(false);

    // ── Admin: edit drive link ──
    const [editingDriveLink, setEditingDriveLink] = useState<any | null>(null);
    const [editDriveUserId, setEditDriveUserId] = useState('');
    const [editDriveYear, setEditDriveYear] = useState('');
    const [editDriveUrl, setEditDriveUrl] = useState('');
    const [editDriveTitle, setEditDriveTitle] = useState('');
    const [editDriveDescription, setEditDriveDescription] = useState('');
    const [editDriveSaving, setEditDriveSaving] = useState(false);

    // ── Admin: queries ──
    const [queryUserId, setQueryUserId] = useState('');
    const [querySubject, setQuerySubject] = useState('');
    const [queryMessage, setQueryMessage] = useState('');
    const [queryAttachment, setQueryAttachment] = useState<File | null>(null);
    const [queryAttachmentDragOver, setQueryAttachmentDragOver] = useState(false);
    const [querySaving, setQuerySaving] = useState(false);
    const [querySuccess, setQuerySuccess] = useState('');
    const [queryError, setQueryError] = useState('');
    const [adminQueries, setAdminQueries] = useState<any[]>([]);
    const [loadingAdminQueries, setLoadingAdminQueries] = useState(false);
    const [viewingQuery, setViewingQuery] = useState<any | null>(null);
    const [queryToDelete, setQueryToDelete] = useState<string | null>(null);
    const [deletingQuery, setDeletingQuery] = useState(false);
    const [downloadingQueryId, setDownloadingQueryId] = useState<string | null>(null);

    // ── Client: queries ──
    const [clientQueries, setClientQueries] = useState<any[]>([]);
    const [loadingClientQueries, setLoadingClientQueries] = useState(false);
    const [clientActiveTab, setClientActiveTab] = useState<'documents' | 'drive' | 'queries'>('documents');
    const [queryResponses, setQueryResponses] = useState<any[]>([]);
    const [loadingQueryResponses, setLoadingQueryResponses] = useState(false);
    const [queryReplyMessage, setQueryReplyMessage] = useState('');
    const [submittingQueryReply, setSubmittingQueryReply] = useState(false);
    const [queryReplySuccess, setQueryReplySuccess] = useState('');
    const [queryReplyError, setQueryReplyError] = useState('');
    const [updatingQueryStatus, setUpdatingQueryStatus] = useState(false);

    // ── Client: document upload (send to admin) ──
    const [clientUploadExpanded, setClientUploadExpanded] = useState(false);
    const [clientUploadFiles, setClientUploadFiles] = useState<File[]>([]);
    const [clientUploadNote, setClientUploadNote] = useState('');
    const [clientUploading, setClientUploading] = useState(false);
    const [clientUploadSuccess, setClientUploadSuccess] = useState('');
    const [clientUploadError, setClientUploadError] = useState('');
    const [clientUploadDragOver, setClientUploadDragOver] = useState(false);

    // ── Password change ──
    const [changingPasswordFor, setChangingPasswordFor] = useState<string | null>(null);
    const [newPasswordValue, setNewPasswordValue] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');
    const [passwordChangeError, setPasswordChangeError] = useState('');

    // ── Edit user ──
    const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
    const [editFullName, setEditFullName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [updatingUser, setUpdatingUser] = useState(false);

    // ── Delete user ──
    const [userToDelete, setUserToDelete] = useState<string | null>(null);
    const [deletingUser, setDeletingUser] = useState(false);

    // ── Delete doc ──
    const [docToDelete, setDocToDelete] = useState<string | null>(null);
    const [deletingDoc, setDeletingDoc] = useState(false);

    // ── Download doc ──
    const [downloadingDocId, setDownloadingDocId] = useState<string | null>(null);
    const [downloadError, setDownloadError] = useState('');

    // ── Document upload ──
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

    // ── Helpers ──
    const getToken = () => {
        try { return JSON.parse(localStorage.getItem('mrs_auth_user') || '{}')?.token || ''; }
        catch { return ''; }
    };

    // ── Auth guard ──
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        if (user?.role === 'employee') {
            router.push('/employee/dashboard');
            return;
        }
    }, [isAuthenticated, user, router]);

    // ── Initial data load ──
    useEffect(() => {
        if (!user?.userId) return;
        if (user.role === 'admin') {
            setLoadingProfile(false);
            setLoadingDocs(false);
            fetchUsers();
            fetchDocs();
            fetchDriveLinks();
            fetchAdminQueries();
            return;
        }
        fetchClientProfile();
        fetchClientDocs();
        fetchClientDriveLinks();
        fetchClientQueries();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const fetchClientProfile = async () => {
        if (!user?.userId) return;
        setLoadingProfile(true);
        setProfileError('');
        try {
            const p = await getUserProfile(user.userId);
            setProfile(p);
        } catch (err: unknown) {
            setProfileError(err instanceof Error ? err.message : 'Failed to load profile');
        } finally {
            setLoadingProfile(false);
        }
    };

    const fetchClientDocs = async () => {
        if (!user?.userId) return;
        setLoadingDocs(true);
        setDocsError('');
        try {
            const docs = await getUserDocuments(user.userId);
            setDocuments(docs.filter(d => !d.deleted));
        } catch (err: unknown) {
            setDocsError(err instanceof Error ? err.message : 'Failed to load documents');
        } finally {
            setLoadingDocs(false);
        }
    };

    useEffect(() => {
        if (user?.role === 'admin') fetchDocs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [docsFilterUser]);

    // ─── Fetch functions ─────────────────────────────────────────────────────

    const fetchUsers = async () => {
        setLoadingUsers(true);
        setUsersError('');
        try {
            const [allUsersRes, employeesRes] = await Promise.allSettled([
                getAllUsers(),
                getAdminEmployees('', 0, 1000),
            ]);

            const allUsers = allUsersRes.status === 'fulfilled' ? allUsersRes.value : [];
            const employeeIds = new Set<string>();
            const employeeMobiles = new Set<string>();

            if (employeesRes.status === 'fulfilled' && employeesRes.value?.content) {
                for (const emp of employeesRes.value.content) {
                    if (emp.employeeId) employeeIds.add(emp.employeeId.toLowerCase().trim());
                    if (emp.mobileNumber) employeeMobiles.add(emp.mobileNumber.trim());
                }
            }

            // Exclude employees and admins from the client list
            const filteredClients = allUsers.filter((u) => {
                const uid = (u.userId || '').toLowerCase().trim();
                const uRole = (u.role || (u as any).userType || '').toLowerCase().trim();
                const uEmpId = ((u as any).employeeId || '').toLowerCase().trim();
                const uPhone = (u.phone || '').trim();

                if (uRole.includes('employee') || uRole.includes('admin')) return false;
                if (uEmpId) return false;
                if (employeeIds.has(uid) || (uEmpId && employeeIds.has(uEmpId))) return false;
                if (uPhone && employeeMobiles.has(uPhone)) return false;
                if (uid.startsWith('emp') || uid.startsWith('admin')) return false;

                return true;
            });

            setAdminUsers(filteredClients);
        } catch (err: unknown) {
            setUsersError(err instanceof Error ? err.message : 'Failed to load users');
        } finally {
            setLoadingUsers(false);
        }
    };

    const fetchDocs = async () => {
        setLoadingDocs2(true);
        try { setAdminDocs(await getAdminDocuments(docsFilterUser || undefined)); }
        catch { }
        finally { setLoadingDocs2(false); }
    };

    const fetchDriveLinks = async () => {
        setLoadingDriveLinks(true);
        try {
            const res = await fetch('/backend/admin/drive-links', { headers: { Authorization: `Bearer ${getToken()}` } });
            const data = await res.json();
            setDriveLinks(Array.isArray(data) ? data : []);
        } catch { }
        finally { setLoadingDriveLinks(false); }
    };

    const fetchClientDriveLinks = async () => {
        if (!user?.userId) return;
        setLoadingClientDriveLinks(true);
        try {
            const res = await fetch(`/backend/user/${user.userId}/drive-links`, { headers: { Authorization: `Bearer ${getToken()}` } });
            const data = await res.json();
            setClientDriveLinks(Array.isArray(data) ? data : []);
        } catch { }
        finally { setLoadingClientDriveLinks(false); }
    };

    const fetchAdminQueries = async () => {
        setLoadingAdminQueries(true);
        try {
            const res = await fetch('/backend/admin/queries', { headers: { Authorization: `Bearer ${getToken()}` } });
            const data = await res.json();
            setAdminQueries(Array.isArray(data) ? data : []);
        } catch { }
        finally { setLoadingAdminQueries(false); }
    };

    const fetchClientQueries = async () => {
        if (!user?.userId) return;
        setLoadingClientQueries(true);
        try {
            const res = await fetch(`/backend/user/${user.userId}/queries`, { headers: { Authorization: `Bearer ${getToken()}` } });
            const data = await res.json();
            setClientQueries(Array.isArray(data) ? data : []);
        } catch { }
        finally { setLoadingClientQueries(false); }
    };

    const handleOpenDriveUrl = (url?: string) => {
        if (!url) return;
        const trimmed = url.trim();
        const target = trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`;
        window.open(target, '_blank', 'noopener,noreferrer');
    };

    // ─── Handlers ────────────────────────────────────────────────────────────

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault(); setCreateError(''); setCreateSuccess(''); setCreating(true);
        try {
            const res = await createUser(newUser);
            setCreateSuccess(`Client "${res.userId}" created successfully!`);
            setNewUser({ userId: '', password: '', fullName: '', email: '', phone: '' });
            fetchUsers();
        } catch (err: unknown) { setCreateError(err instanceof Error ? err.message : 'Failed to create client'); }
        finally { setCreating(false); }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!changingPasswordFor) return;
        setPasswordChangeError(''); setPasswordChangeSuccess(''); setChangingPassword(true);
        try {
            await changeUserPassword(changingPasswordFor, newPasswordValue);
            setPasswordChangeSuccess(`Password changed for "${changingPasswordFor}".`);
            setChangingPasswordFor(null); setNewPasswordValue('');
        } catch (err: unknown) { setPasswordChangeError(err instanceof Error ? err.message : 'Failed to change password'); }
        finally { setChangingPassword(false); }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); setIsDragOver(false);
        setUploadFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setUploadFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    };

    const removeFile = (index: number) => setUploadFiles(prev => prev.filter((_, i) => i !== index));

    const handleUploadDocuments = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadUserId || uploadFiles.length === 0) return;
        setUploadError(''); setUploadSuccess(''); setUploading(true);
        try {
            let uploaded = 0;
            for (const file of uploadFiles) {
                const title = uploadTitle || file.name.replace(/\.[^.]+$/, '');
                await uploadDocument(uploadUserId, file, title, uploadDescription || undefined, uploadCategory || undefined);
                uploaded++;
            }
            setUploadSuccess(`Uploaded ${uploaded} file${uploaded > 1 ? 's' : ''} for "${uploadUserId}"!`);
            setUploadFiles([]); setUploadTitle(''); setUploadDescription(''); setUploadCategory('');
            fetchDocs();
        } catch (err: unknown) { setUploadError(err instanceof Error ? err.message : 'Upload failed'); }
        finally { setUploading(false); }
    };

    // ── Client: send document to MRS & Co. ──
    const handleClientDocUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.userId || clientUploadFiles.length === 0) return;
        setClientUploadError(''); setClientUploadSuccess(''); setClientUploading(true);
        try {
            // Find the most recent open query to attach to
            const openQuery = clientQueries.find((q: any) => String(q?.status || 'OPEN').toUpperCase() === 'OPEN');
            if (!openQuery) {
                throw new Error('No open query found. Please contact MRS & Co. to initiate a query first, then you can attach documents to it.');
            }
            let uploaded = 0;
            for (const file of clientUploadFiles) {
                const fd = new FormData();
                if (clientUploadNote.trim()) fd.append('message', clientUploadNote.trim());
                fd.append('file', file);
                const res = await fetch(`/backend/user/${user.userId}/queries/${openQuery.id}/responses`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${getToken()}` },
                    body: fd,
                });
                if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    throw new Error(err.error || err.message || 'Upload failed');
                }
                uploaded++;
            }
            setClientUploadSuccess(`${uploaded} document${uploaded > 1 ? 's' : ''} sent to MRS & Co. successfully!`);
            setClientUploadFiles([]); setClientUploadNote('');
            fetchClientQueries();
        } catch (err: unknown) { setClientUploadError(err instanceof Error ? err.message : 'Upload failed'); }
        finally { setClientUploading(false); }
    };

    const handleSaveDriveLink = async (e: React.FormEvent) => {
        e.preventDefault(); setDriveError(''); setDriveSuccess(''); setDriveSaving(true);
        try {
            const res = await fetch('/backend/admin/drive-links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ userId: driveUserId, year: driveYear, driveUrl, title: driveTitle, description: driveDescription }),
            });
            if (!res.ok) throw new Error('Failed to save link');
            setDriveSuccess(`Drive folder shared with "${driveUserId}"!`);
            setDriveUserId(''); setDriveYear(''); setDriveUrl(''); setDriveTitle(''); setDriveDescription('');
            fetchDriveLinks();
        } catch (err: unknown) { setDriveError(err instanceof Error ? err.message : 'Failed to save link'); }
        finally { setDriveSaving(false); }
    };

    const handleDeleteDriveLink = async (id: string) => {
        if (!confirm('Delete this Drive link?')) return;
        try {
            await fetch(`/backend/admin/drive-links/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${getToken()}` } });
            fetchDriveLinks();
        } catch (err: unknown) { alert(err instanceof Error ? err.message : 'Delete failed'); }
    };

    const handleUpdateDriveLink = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingDriveLink) return;
        setDriveError(''); setDriveSuccess(''); setEditDriveSaving(true);
        try {
            const res = await fetch(`/backend/admin/drive-links/${editingDriveLink.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ userId: editDriveUserId, year: editDriveYear, driveUrl: editDriveUrl, title: editDriveTitle, description: editDriveDescription }),
            });
            if (!res.ok) throw new Error('Failed to update link');
            setDriveSuccess('Drive link updated!');
            setEditingDriveLink(null);
            fetchDriveLinks();
        } catch (err: unknown) { setDriveError(err instanceof Error ? err.message : 'Failed to update link'); }
        finally { setEditDriveSaving(false); }
    };

    const handleRaiseQuery = async (e: React.FormEvent) => {
        e.preventDefault(); setQueryError(''); setQuerySuccess(''); setQuerySaving(true);
        try {
            let res: Response;
            if (queryAttachment) {
                // Multipart request when a file is attached
                const fd = new FormData();
                fd.append('userId', queryUserId);
                fd.append('subject', querySubject);
                if (queryMessage.trim()) fd.append('message', queryMessage);
                fd.append('file', queryAttachment);
                res = await fetch('/backend/admin/queries/mixed', {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${getToken()}` },
                    body: fd,
                });
            } else {
                // Plain JSON when no file
                res = await fetch('/backend/admin/queries/text', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                    body: JSON.stringify({ userId: queryUserId, subject: querySubject, message: queryMessage }),
                });
            }
            if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || err.message || 'Failed to raise query'); }
            setQuerySuccess(`Query raised for "${queryUserId}"!`);
            setQueryUserId(''); setQuerySubject(''); setQueryMessage(''); setQueryAttachment(null);
            fetchAdminQueries();
        } catch (err: unknown) { setQueryError(err instanceof Error ? err.message : 'Failed to raise query'); }
        finally { setQuerySaving(false); }
    };

    const handleDownloadQueryAttachment = async (queryId: string, fileName: string) => {
        if (!user) return;
        setDownloadingQueryId(queryId);
        try {
            const path = user.role === 'admin'
                ? `/backend/admin/queries/${queryId}/download`
                : `/backend/user/${user.userId}/queries/${queryId}/download`;
            const res = await fetch(path, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (!res.ok) throw new Error('Download failed');
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = fileName; a.click();
            URL.revokeObjectURL(url);
        } catch (err: unknown) { alert(err instanceof Error ? err.message : 'Download failed'); }
        finally { setDownloadingQueryId(null); }
    };

    const handleDeleteQuery = async () => {
        if (!queryToDelete) return;
        setDeletingQuery(true);
        try {
            const res = await fetch(`/backend/admin/queries/${queryToDelete}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || err.message || 'Failed to delete query'); }
            setQueryToDelete(null);
            fetchAdminQueries();
        } catch (err: unknown) { alert(err instanceof Error ? err.message : 'Failed to delete query'); }
        finally { setDeletingQuery(false); }
    };

    const handleUpdateUser = async () => {
        if (!editingUser) return;
        setUpdatingUser(true);
        try {
            await updateUser(editingUser.userId, { fullName: editFullName, email: editEmail, phone: editPhone });
            setCreateSuccess(`Client "${editingUser.userId}" updated!`);
            setEditingUser(null);
            fetchUsers();
        } catch (err: unknown) { setCreateError(err instanceof Error ? err.message : 'Update failed'); }
        finally { setUpdatingUser(false); }
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        setDeletingUser(true);
        try {
            await deleteUser(userToDelete);
            setCreateSuccess(`Client "${userToDelete}" deleted!`);
            setUserToDelete(null);
            fetchUsers();
        } catch (err: unknown) { setCreateError(err instanceof Error ? err.message : 'Delete failed'); }
        finally { setDeletingUser(false); }
    };

    const handleDeleteDoc = async () => {
        if (!docToDelete) return;
        setDeletingDoc(true);
        try { await deleteDocument(docToDelete); fetchDocs(); setDocToDelete(null); }
        catch (err: unknown) { alert(err instanceof Error ? err.message : 'Delete document failed'); }
        finally { setDeletingDoc(false); }
    };

    const handleDownloadDoc = async (doc: UserDocument) => {
        setDownloadingDocId(doc.id); setDownloadError('');
        try { await downloadDocument(doc.id, doc.originalFileName || doc.title || 'document'); }
        catch (err: unknown) { setDownloadError(err instanceof Error ? err.message : 'Download failed'); }
        finally { setDownloadingDocId(null); }
    };

    const loadQueryConversation = async (queryId: string) => {
        setLoadingQueryResponses(true);
        try {
            const url = user?.role === 'admin'
                ? `/backend/admin/queries/${queryId}/conversation`
                : `/backend/user/${user?.userId}/queries/${queryId}/conversation`;
            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (res.ok) {
                const data = await res.json();
                setQueryResponses(data.responses || []);
                if (data.query) {
                    setViewingQuery(data.query);
                }
            } else {
                setQueryResponses([]);
            }
        } catch (err) {
            console.error('Failed to load query conversation:', err);
            setQueryResponses([]);
        } finally {
            setLoadingQueryResponses(false);
        }
    };

    const handleViewQuery = async (q: any) => {
        setViewingQuery(q);
        setQueryResponses([]);
        setQueryReplyMessage('');
        setQueryReplySuccess('');
        setQueryReplyError('');
        loadQueryConversation(q.id);

        if (user && user.role !== 'admin' && q.status === 'OPEN') {
            try {
                const res = await fetch(`/backend/user/${user.userId}/queries/${q.id}/seen`, {
                    method: 'PUT',
                    headers: { Authorization: `Bearer ${getToken()}` },
                });
                if (res.ok) {
                    // Update local query status in clientQueries list
                    setClientQueries(prev =>
                        prev.map(item => (item.id === q.id ? { ...item, status: 'SEEN' } : item))
                    );
                }
            } catch (err) {
                console.error('Failed to mark query as seen:', err);
            }
        }
    };

    const handleSendQueryReply = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!viewingQuery || !queryReplyMessage.trim()) return;

        setSubmittingQueryReply(true);
        setQueryReplyError('');
        setQueryReplySuccess('');

        try {
            const url = user?.role === 'admin'
                ? `/backend/admin/queries/${viewingQuery.id}/responses`
                : `/backend/user/${user?.userId}/queries/${viewingQuery.id}/responses`;

            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ message: queryReplyMessage.trim() }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Failed to submit response');
            }

            if (data.response) {
                setQueryResponses(prev => [...prev, data.response]);
            }

            const newStatus = user?.role === 'admin' ? 'ADMIN_RESPONDED' : 'CLIENT_RESPONDED';
            setViewingQuery((prev: any) => prev ? { ...prev, status: newStatus } : prev);

            if (user?.role === 'admin') {
                setAdminQueries(prev => prev.map(item => item.id === viewingQuery.id ? { ...item, status: newStatus } : item));
                fetchAdminQueries();
            } else {
                setClientQueries(prev => prev.map(item => item.id === viewingQuery.id ? { ...item, status: newStatus } : item));
                fetchClientQueries();
            }

            setQueryReplyMessage('');
            setQueryReplySuccess(user?.role === 'admin' ? 'Reply sent to client!' : 'Response submitted! Admin received notification at camrsandco@gmail.com.');
            setTimeout(() => setQueryReplySuccess(''), 5000);
        } catch (err: any) {
            setQueryReplyError(err.message || 'Failed to send response');
        } finally {
            setSubmittingQueryReply(false);
        }
    };

    const handleUpdateQueryStatus = async (status: string) => {
        if (!viewingQuery) return;
        setUpdatingQueryStatus(true);
        try {
            const res = await fetch(`/backend/admin/queries/${viewingQuery.id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                setViewingQuery((prev: any) => prev ? { ...prev, status } : prev);
                setAdminQueries(prev => prev.map(item => item.id === viewingQuery.id ? { ...item, status } : item));
            }
        } catch (err) {
            console.error('Failed to update query status:', err);
        } finally {
            setUpdatingQueryStatus(false);
        }
    };

    const handleLogout = () => { logout(); router.push('/login'); };

    if (!isAuthenticated || !user) return null;

    // ─── Formatters ──────────────────────────────────────────────────────────

    const formatDate = (dateStr: string) => {
        try { return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
        catch { return dateStr; }
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

    const statusBadge = (status: string) => {
        const map: Record<string, string> = {
            RESOLVED: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]',
            CLOSED: 'bg-slate-500/15 border-slate-500/30 text-slate-400',
            IN_PROGRESS: 'bg-amber-500/15 border-amber-500/30 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)] animate-pulse',
            CLIENT_RESPONDED: 'bg-amber-500/20 border-amber-400/40 text-amber-300 shadow-[0_0_16px_rgba(245,158,11,0.35)] animate-pulse',
            ADMIN_RESPONDED: 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300 shadow-[0_0_16px_rgba(6,182,212,0.35)] animate-pulse',
            SEEN: 'bg-blue-500/15 border-blue-500/30 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.2)]',
            OPEN: 'bg-rose-500/20 border-rose-400/40 text-rose-300 shadow-[0_0_16px_rgba(244,63,94,0.4)] animate-pulse',
        };
        return map[status] || 'bg-rose-500/20 border-rose-400/40 text-rose-300 shadow-[0_0_16px_rgba(244,63,94,0.4)] animate-pulse';
    };

    // ─── Sidebar nav helper ───────────────────────────────────────────────────

    const navigate = (section: AdminSection) => {
        setActiveSection(section);
        setMobileSidebarOpen(false);
    };

    const groups = ['main', 'actions', 'lists'] as const;

    // ─── Section accent colours ───────────────────────────────────────────────
    const sectionAccent: Record<AdminSection, string> = {
        'overview': 'text-blue-400',
        'create-client': 'text-cyan-400',
        'clients-list': 'text-blue-400',
        'upload-document': 'text-violet-400',
        'documents-list': 'text-orange-400',
        'share-drive': 'text-blue-400',
        'drive-list': 'text-indigo-400',
        'raise-query': 'text-rose-400',
        'queries-list': 'text-rose-400',
        'employees': 'text-emerald-400',
    };

    const navItemAccent: Record<AdminSection, string> = {
        'overview': 'bg-blue-500/10 border-blue-500/20 text-blue-300',
        'create-client': 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300',
        'clients-list': 'bg-blue-500/10 border-blue-500/20 text-blue-300',
        'upload-document': 'bg-violet-500/10 border-violet-500/20 text-violet-300',
        'documents-list': 'bg-orange-500/10 border-orange-500/20 text-orange-300',
        'share-drive': 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300',
        'drive-list': 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300',
        'raise-query': 'bg-rose-500/10 border-rose-500/20 text-rose-300',
        'queries-list': 'bg-rose-500/10 border-rose-500/20 text-rose-300',
        'employees': 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // ADMIN SECTION CONTENT
    // ═══════════════════════════════════════════════════════════════════════════

    const renderAdminSection = () => {
        switch (activeSection) {

            // ── Overview ──────────────────────────────────────────────────────
            case 'overview':
                return (
                    <div className="space-y-6">
                        <h1 className="text-2xl font-bold text-white">Overview</h1>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { label: 'Total Clients', value: adminUsers.length, icon: <Users className="w-5 h-5 text-blue-400" />, color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/20' },
                                { label: 'Active Clients', value: adminUsers.filter(u => u.active).length, icon: <CheckCircle className="w-5 h-5 text-emerald-400" />, color: 'from-emerald-500/20 to-green-500/20 border-emerald-500/20' },
                                { label: 'Documents', value: adminDocs.length, icon: <FileText className="w-5 h-5 text-orange-400" />, color: 'from-orange-500/20 to-amber-500/20 border-orange-500/20' },
                                { label: 'Queries', value: adminQueries.length, icon: <MessageCircle className="w-5 h-5 text-rose-400" />, color: 'from-rose-500/20 to-pink-500/20 border-rose-500/20' },
                            ].map((stat, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                                    <Card className="border-white/[0.08] bg-white/[0.04] backdrop-blur-xl">
                                        <CardContent className="p-5 flex items-center gap-4">
                                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br border flex items-center justify-center ${stat.color}`}>{stat.icon}</div>
                                            <div>
                                                <div className="text-2xl font-bold text-white">{stat.value}</div>
                                                <div className="text-xs text-slate-400">{stat.label}</div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {adminNavItems.filter(n => n.group === 'actions').map((item, i) => (
                                <motion.button key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.06 }}
                                    onClick={() => navigate(item.id)}
                                    className={`flex items-center gap-3 p-4 rounded-xl border ${navItemAccent[item.id]} hover:scale-[1.02] transition-all duration-200 text-left`}>
                                    <div className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center">{item.icon}</div>
                                    <span className="font-medium text-sm">{item.label}</span>
                                    <ChevronRight className="w-4 h-4 ml-auto opacity-60" />
                                </motion.button>
                            ))}
                        </div>
                    </div>
                );

            // ── Create Client ─────────────────────────────────────────────────
            case 'create-client':
                return (
                    <div className="max-w-2xl space-y-6">
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <UserPlus className="w-6 h-6 text-cyan-400" /> Create New Client
                        </h1>
                        {createSuccess && <Alert type="success" msg={createSuccess} onClose={() => setCreateSuccess('')} />}
                        {createError && <Alert type="error" msg={createError} onClose={() => setCreateError('')} />}
                        <Card className="border-white/[0.08] bg-white/[0.04] backdrop-blur-xl">
                            <CardContent className="p-6">
                                <form onSubmit={handleCreateUser} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Field label="Client ID *">
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                <Input required placeholder="e.g. acme_corp" value={newUser.userId}
                                                    onChange={e => setNewUser({ ...newUser, userId: e.target.value })}
                                                    className="pl-10 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-cyan-500/50" />
                                            </div>
                                        </Field>
                                        <Field label="Password *">
                                            <div className="relative">
                                                <Input required type={showPassword ? 'text' : 'password'} placeholder="Enter password"
                                                    value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                                    className="pr-10 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-cyan-500/50" />
                                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </Field>
                                        <Field label="Full Name">
                                            <Input placeholder="e.g. Acme Corporation" value={newUser.fullName}
                                                onChange={e => setNewUser({ ...newUser, fullName: e.target.value })}
                                                className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-cyan-500/50" />
                                        </Field>
                                        <Field label="Email">
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                <Input type="email" placeholder="contact@example.com" value={newUser.email}
                                                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                                    className="pl-10 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-cyan-500/50" />
                                            </div>
                                        </Field>
                                        <Field label="Phone" className="sm:col-span-2">
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                <Input placeholder="+91 98765 43210" value={newUser.phone}
                                                    onChange={e => setNewUser({ ...newUser, phone: e.target.value })}
                                                    className="pl-10 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-cyan-500/50" />
                                            </div>
                                        </Field>
                                    </div>
                                    <div className="flex justify-end pt-2">
                                        <Button type="submit" disabled={creating}
                                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium px-6 shadow-lg shadow-cyan-500/20">
                                            {creating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating...</> : <><UserPlus className="w-4 h-4 mr-2" />Create Client</>}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                );

            // ── Clients List ──────────────────────────────────────────────────
            case 'clients-list':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Users className="w-6 h-6 text-blue-400" /> All Clients
                            </h1>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 bg-white/[0.04] px-2.5 py-1 rounded-full">{adminUsers.length} clients</span>
                                <Button variant="ghost" onClick={fetchUsers} disabled={loadingUsers} className="text-slate-400 hover:text-white hover:bg-white/[0.06] px-2">
                                    <RefreshCw className={`w-4 h-4 ${loadingUsers ? 'animate-spin' : ''}`} />
                                </Button>
                            </div>
                        </div>
                        {passwordChangeSuccess && <Alert type="success" msg={passwordChangeSuccess} onClose={() => setPasswordChangeSuccess('')} />}
                        {passwordChangeError && <Alert type="error" msg={passwordChangeError} onClose={() => setPasswordChangeError('')} />}
                        {createSuccess && <Alert type="success" msg={createSuccess} onClose={() => setCreateSuccess('')} />}
                        {createError && <Alert type="error" msg={createError} onClose={() => setCreateError('')} />}
                        <Card className="border-white/[0.08] bg-white/[0.04] backdrop-blur-xl">
                            <CardContent className="p-0">
                                {loadingUsers ? (
                                    <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-blue-400 animate-spin" /></div>
                                ) : usersError ? (
                                    <div className="p-6"><Alert type="error" msg={usersError} onClose={() => setUsersError('')} /></div>
                                ) : adminUsers.length === 0 ? (
                                    <EmptyState icon={<Users className="w-12 h-12" />} title="No clients yet" subtitle='Go to "Create Client" to add the first one.' />
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-white/[0.06]">
                                                    {['Client', 'Email', 'Phone', 'Status', 'Created', 'Actions'].map(h => (
                                                        <th key={h} className={`py-3 px-4 text-slate-400 font-medium text-xs uppercase tracking-wider text-left ${h === 'Actions' ? 'text-right' : ''} ${h === 'Email' ? 'hidden sm:table-cell' : ''} ${h === 'Phone' ? 'hidden md:table-cell' : ''} ${h === 'Created' ? 'hidden lg:table-cell' : ''}`}>{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {adminUsers.map((u, index) => (
                                                    <motion.tr key={u.id || u.userId}
                                                        initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}
                                                        className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors">
                                                        <td className="py-3 px-4">
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
                                                        <td className="py-3 px-4 text-slate-300 hidden sm:table-cell">{u.email || <span className="text-slate-600">—</span>}</td>
                                                        <td className="py-3 px-4 text-slate-300 hidden md:table-cell">{u.phone || <span className="text-slate-600">—</span>}</td>
                                                        <td className="py-3 px-4">
                                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${u.active ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                                                                {u.active ? <><CheckCircle className="w-3 h-3" />Active</> : <><XCircle className="w-3 h-3" />Inactive</>}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4 text-slate-400 text-xs hidden lg:table-cell">{u.createdAt ? formatDate(u.createdAt) : '—'}</td>
                                                        <td className="py-3 px-4 text-right">
                                                            {changingPasswordFor === u.userId ? (
                                                                <form onSubmit={handleChangePassword} className="flex items-center gap-2 justify-end">
                                                                    <div className="relative">
                                                                        <Input required type={showNewPassword ? 'text' : 'password'} placeholder="New password"
                                                                            value={newPasswordValue} onChange={e => setNewPasswordValue(e.target.value)}
                                                                            className="h-8 w-32 text-xs bg-white/[0.04] border-white/[0.08] text-white pr-8" autoFocus />
                                                                        <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}
                                                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                                                                            {showNewPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                                                        </button>
                                                                    </div>
                                                                    <Button type="submit" disabled={changingPassword} className="h-8 px-3 text-xs bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                                                                        {changingPassword ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Save'}
                                                                    </Button>
                                                                    <Button type="button" variant="ghost" onClick={() => { setChangingPasswordFor(null); setNewPasswordValue(''); }}
                                                                        className="h-8 px-2 text-slate-400 hover:text-white hover:bg-white/[0.06]"><XCircle className="w-3.5 h-3.5" /></Button>
                                                                </form>
                                                            ) : (
                                                                <div className="flex items-center justify-end gap-1">
                                                                    <Button variant="ghost" onClick={() => { setChangingPasswordFor(u.userId); setNewPasswordValue(''); setPasswordChangeError(''); setPasswordChangeSuccess(''); }}
                                                                        className="h-8 px-2 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10" title="Change password"><KeyRound className="w-4 h-4" /></Button>
                                                                    <Button variant="ghost" onClick={() => { setEditingUser(u); setEditFullName(u.fullName || ''); setEditEmail(u.email || ''); setEditPhone(u.phone || ''); }}
                                                                        className="h-8 px-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10" title="Edit"><Edit className="w-4 h-4" /></Button>
                                                                    <Button variant="ghost" onClick={() => setUserToDelete(u.userId)}
                                                                        className="h-8 px-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10" title="Delete"><Trash2 className="w-4 h-4" /></Button>
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
                    </div>
                );

            // ── Upload Document ───────────────────────────────────────────────
            case 'upload-document':
                return (
                    <div className="max-w-2xl space-y-6">
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <UploadCloud className="w-6 h-6 text-violet-400" /> Upload Document
                        </h1>
                        {uploadSuccess && <Alert type="success" msg={uploadSuccess} onClose={() => setUploadSuccess('')} />}
                        {uploadError && <Alert type="error" msg={uploadError} onClose={() => setUploadError('')} />}
                        <Card className="border-white/[0.08] bg-white/[0.04] backdrop-blur-xl">
                            <CardContent className="p-6">
                                <form onSubmit={handleUploadDocuments} className="space-y-4">
                                    <Field label="Assign to Client *">
                                        <select required value={uploadUserId} onChange={e => setUploadUserId(e.target.value)}
                                            className="w-full h-10 px-3 rounded-md bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:border-violet-500/50 outline-none appearance-none">
                                            <option value="" className="bg-slate-900">Select a client...</option>
                                            {adminUsers.map(u => <option key={u.userId} value={u.userId} className="bg-slate-900">{u.fullName || u.userId} (@{u.userId})</option>)}
                                        </select>
                                    </Field>
                                    <div onDragOver={e => { e.preventDefault(); setIsDragOver(true); }} onDragLeave={() => setIsDragOver(false)} onDrop={handleDrop}
                                        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${isDragOver ? 'border-violet-400 bg-violet-500/10 scale-[1.01]' : 'border-white/[0.1] bg-white/[0.02] hover:border-white/[0.2] hover:bg-white/[0.04]'}`}
                                        onClick={() => document.getElementById('file-upload-input')?.click()}>
                                        <input id="file-upload-input" type="file" multiple onChange={handleFileSelect} className="hidden" />
                                        <Upload className={`w-10 h-10 mx-auto mb-3 transition-colors ${isDragOver ? 'text-violet-400' : 'text-slate-500'}`} />
                                        <p className="text-sm font-medium text-slate-300">{isDragOver ? 'Drop files here!' : 'Drag & drop files here'}</p>
                                        <p className="text-xs text-slate-500 mt-1">or click to browse files</p>
                                    </div>
                                    {uploadFiles.length > 0 && (
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">{uploadFiles.length} file{uploadFiles.length > 1 ? 's' : ''} selected</label>
                                            <div className="space-y-1.5 max-h-40 overflow-y-auto">
                                                {uploadFiles.map((file, index) => (
                                                    <div key={index} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                                                        <File className="w-4 h-4 text-violet-400 flex-shrink-0" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm text-white truncate">{file.name}</p>
                                                            <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                                                        </div>
                                                        <button type="button" onClick={e => { e.stopPropagation(); removeFile(index); }} className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <Field label="Title"><Input placeholder="Auto-filled from filename" value={uploadTitle} onChange={e => setUploadTitle(e.target.value)} className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-violet-500/50" /></Field>
                                        <Field label="Category"><Input placeholder="e.g. Tax, Legal" value={uploadCategory} onChange={e => setUploadCategory(e.target.value)} className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-violet-500/50" /></Field>
                                        <Field label="Description"><Input placeholder="Optional" value={uploadDescription} onChange={e => setUploadDescription(e.target.value)} className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-violet-500/50" /></Field>
                                    </div>
                                    <div className="flex justify-end pt-2">
                                        <Button type="submit" disabled={uploading || uploadFiles.length === 0 || !uploadUserId}
                                            className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-medium px-6 shadow-lg shadow-violet-500/20 disabled:opacity-40">
                                            {uploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Uploading...</> : <><Upload className="w-4 h-4 mr-2" />Upload {uploadFiles.length > 0 ? `${uploadFiles.length} File${uploadFiles.length > 1 ? 's' : ''}` : 'Files'}</>}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                );

            // ── Documents List ────────────────────────────────────────────────
            case 'documents-list':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                <FileText className="w-6 h-6 text-orange-400" /> Documents
                            </h1>
                            <div className="flex items-center gap-2">
                                <select value={docsFilterUser} onChange={e => setDocsFilterUser(e.target.value)}
                                    className="h-8 px-2 rounded-md bg-white/[0.04] border border-white/[0.08] text-slate-300 text-xs focus:border-cyan-500/50 outline-none appearance-none">
                                    <option value="" className="bg-slate-900">All Clients</option>
                                    {adminUsers.map(u => <option key={u.userId} value={u.userId} className="bg-slate-900">{u.fullName || u.userId}</option>)}
                                </select>
                                <span className="text-xs text-slate-500 bg-white/[0.04] px-2.5 py-1 rounded-full">{adminDocs.length} docs</span>
                                <Button variant="ghost" onClick={fetchDocs} disabled={loadingDocs2} className="text-slate-400 hover:text-white hover:bg-white/[0.06] px-2">
                                    <RefreshCw className={`w-4 h-4 ${loadingDocs2 ? 'animate-spin' : ''}`} />
                                </Button>
                            </div>
                        </div>
                        {downloadError && <Alert type="error" msg={downloadError} onClose={() => setDownloadError('')} />}
                        <Card className="border-white/[0.08] bg-white/[0.04] backdrop-blur-xl">
                            <CardContent className="p-0">
                                {loadingDocs2 ? (
                                    <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-violet-400 animate-spin" /></div>
                                ) : adminDocs.length === 0 ? (
                                    <EmptyState icon={<FileText className="w-12 h-12" />} title="No documents yet" subtitle='Upload files via "Upload Document".' />
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-white/[0.06]">
                                                    {['File', 'Category', 'Size', 'Uploaded', 'Actions'].map(h => (
                                                        <th key={h} className={`py-3 px-4 text-slate-400 font-medium text-xs uppercase tracking-wider text-left ${h === 'Actions' ? 'text-right' : ''} ${h === 'Category' ? 'hidden sm:table-cell' : ''} ${h === 'Size' ? 'hidden md:table-cell' : ''} ${h === 'Uploaded' ? 'hidden lg:table-cell' : ''}`}>{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {adminDocs.map((doc, index) => (
                                                    <motion.tr key={doc.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}
                                                        className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors">
                                                        <td className="py-3 px-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/30 to-red-500/30 border border-orange-500/20 flex items-center justify-center">
                                                                    <File className="w-4 h-4 text-orange-300" />
                                                                </div>
                                                                <div>
                                                                    <div className="text-white font-medium truncate max-w-[180px]">{doc.title || doc.originalFileName}</div>
                                                                    <div className="text-slate-500 text-xs truncate max-w-[180px]">{doc.originalFileName}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4 hidden sm:table-cell">
                                                            {doc.category ? <span className="inline-flex px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs">{doc.category}</span> : <span className="text-slate-600">—</span>}
                                                        </td>
                                                        <td className="py-3 px-4 text-slate-400 text-xs hidden md:table-cell">{doc.fileSize ? `${(doc.fileSize / 1024).toFixed(1)} KB` : '—'}</td>
                                                        <td className="py-3 px-4 text-slate-400 text-xs hidden lg:table-cell">{doc.createdAt ? formatDate(doc.createdAt) : '—'}</td>
                                                        <td className="py-3 px-4 text-right">
                                                            <div className="flex items-center justify-end gap-1">
                                                                <Button variant="ghost" onClick={() => handleDownloadDoc(doc)} disabled={downloadingDocId === doc.id}
                                                                    className="h-8 px-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10" title="Download">
                                                                    {downloadingDocId === doc.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                                                </Button>
                                                                <Button variant="ghost" onClick={() => setDocToDelete(doc.id)} className="h-8 px-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10" title="Delete"><Trash2 className="w-4 h-4" /></Button>
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                );

            // ── Share Drive Folder ────────────────────────────────────────────
            case 'share-drive':
                return (
                    <div className="max-w-2xl space-y-6">
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <FolderOpen className="w-6 h-6 text-blue-400" /> Share Google Drive Folder
                        </h1>
                        {driveSuccess && <Alert type="success" msg={driveSuccess} onClose={() => setDriveSuccess('')} />}
                        {driveError && <Alert type="error" msg={driveError} onClose={() => setDriveError('')} />}
                        <Card className="border-white/[0.08] bg-white/[0.04] backdrop-blur-xl">
                            <CardContent className="p-6">
                                <form onSubmit={handleSaveDriveLink} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Field label="Assign to Client *">
                                            <select required value={driveUserId} onChange={e => setDriveUserId(e.target.value)}
                                                className="w-full h-10 px-3 rounded-md bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:border-blue-500/50 outline-none appearance-none">
                                                <option value="" className="bg-slate-900">Select a client...</option>
                                                {adminUsers.map(u => <option key={u.userId} value={u.userId} className="bg-slate-900">{u.fullName || u.userId} (@{u.userId})</option>)}
                                            </select>
                                        </Field>
                                        <Field label="Year *">
                                            <Input required placeholder="e.g. 2024-25" value={driveYear} onChange={e => setDriveYear(e.target.value)}
                                                className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-blue-500/50" />
                                        </Field>
                                    </div>
                                    <Field label="Google Drive Link *">
                                        <Input required placeholder="https://drive.google.com/drive/folders/..." value={driveUrl} onChange={e => setDriveUrl(e.target.value)}
                                            className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-blue-500/50" />
                                    </Field>
                                    <Field label="Folder Name">
                                        <Input placeholder="e.g. Tax Documents 2024" value={driveTitle} onChange={e => setDriveTitle(e.target.value)}
                                            className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-blue-500/50" />
                                    </Field>
                                    <Field label="Description">
                                        <textarea rows={3} placeholder="Optional description for the client..." value={driveDescription} onChange={e => setDriveDescription(e.target.value)}
                                            className="w-full px-3 py-2 rounded-md bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none text-sm resize-none" />
                                    </Field>
                                    <div className="flex justify-end pt-2">
                                        <Button type="submit" disabled={driveSaving}
                                            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-medium px-6 shadow-lg shadow-blue-500/20 disabled:opacity-40">
                                            {driveSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : <><FolderOpen className="w-4 h-4 mr-2" />Share Folder</>}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                );

            // ── Drive Links List ──────────────────────────────────────────────
            case 'drive-list':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                <FolderOpen className="w-6 h-6 text-indigo-400" /> Shared Drive Links
                            </h1>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 bg-white/[0.04] px-2.5 py-1 rounded-full">{driveLinks.length} link{driveLinks.length !== 1 ? 's' : ''}</span>
                                <Button variant="ghost" onClick={fetchDriveLinks} disabled={loadingDriveLinks} className="text-slate-400 hover:text-white hover:bg-white/[0.06] px-2">
                                    <RefreshCw className={`w-4 h-4 ${loadingDriveLinks ? 'animate-spin' : ''}`} />
                                </Button>
                            </div>
                        </div>
                        <Card className="border-white/[0.08] bg-white/[0.04] backdrop-blur-xl">
                            <CardContent className="p-0">
                                {loadingDriveLinks ? (
                                    <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-blue-400 animate-spin" /></div>
                                ) : driveLinks.length === 0 ? (
                                    <EmptyState icon={<FolderOpen className="w-12 h-12" />} title="No drive links yet" subtitle='Share a folder via "Share Drive Folder".' />
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-white/[0.06]">
                                                    {['Folder', 'Client', 'Year', 'Description', 'Actions'].map(h => (
                                                        <th key={h} className={`py-3 px-4 text-slate-400 font-medium text-xs uppercase tracking-wider text-left ${h === 'Actions' ? 'text-right' : ''} ${h === 'Client' ? 'hidden sm:table-cell' : ''} ${h === 'Year' ? 'hidden md:table-cell' : ''} ${h === 'Description' ? 'hidden lg:table-cell' : ''}`}>{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {driveLinks.map((link, index) => (
                                                    <motion.tr key={link.id || index} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}
                                                        className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors">
                                                        <td className="py-3 px-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/30 to-indigo-500/30 border border-blue-500/20 flex items-center justify-center">
                                                                    <FolderOpen className="w-4 h-4 text-blue-300" />
                                                                </div>
                                                                <div>
                                                                    <div className="text-white font-medium truncate max-w-[160px]">{link.title || 'Drive Folder'}</div>
                                                                    <a href={link.driveUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-xs truncate max-w-[160px] block">{link.driveUrl}</a>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4 text-slate-300 hidden sm:table-cell">
                                                            <span className="flex items-center gap-1.5"><User className="w-3 h-3 text-slate-500" />{link.userId}</span>
                                                        </td>
                                                        <td className="py-3 px-4 hidden md:table-cell">
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
                                                                <Calendar className="w-3 h-3" />{link.year}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4 text-slate-400 text-xs hidden lg:table-cell max-w-[180px]"><span className="truncate block">{link.description || '—'}</span></td>
                                                        <td className="py-3 px-4 text-right">
                                                            <div className="flex items-center justify-end gap-1">
                                                                <Button variant="ghost" onClick={() => window.open(link.driveUrl, '_blank')} className="h-8 px-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10" title="Open"><Download className="w-4 h-4" /></Button>
                                                                <Button variant="ghost" onClick={() => { setEditingDriveLink(link); setEditDriveUserId(link.userId || ''); setEditDriveYear(link.year || ''); setEditDriveUrl(link.driveUrl || ''); setEditDriveTitle(link.title || ''); setEditDriveDescription(link.description || ''); }}
                                                                    className="h-8 px-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10" title="Edit"><Edit className="w-4 h-4" /></Button>
                                                                <Button variant="ghost" onClick={() => handleDeleteDriveLink(link.id)} className="h-8 px-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10" title="Delete"><Trash2 className="w-4 h-4" /></Button>
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                );

            // ── Raise Query ───────────────────────────────────────────────────
            case 'raise-query':
                return (
                    <div className="max-w-2xl space-y-6">
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <MessageSquarePlus className="w-6 h-6 text-rose-400" /> Raise a Query
                        </h1>
                        {querySuccess && <Alert type="success" msg={querySuccess} onClose={() => setQuerySuccess('')} />}
                        {queryError && <Alert type="error" msg={queryError} onClose={() => setQueryError('')} />}
                        <Card className="border-white/[0.08] bg-white/[0.04] backdrop-blur-xl">
                            <CardContent className="p-6">
                                <form onSubmit={handleRaiseQuery} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Field label="Send to Client *">
                                            <select required value={queryUserId} onChange={e => setQueryUserId(e.target.value)}
                                                className="w-full h-10 px-3 rounded-md bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:border-rose-500/50 outline-none appearance-none">
                                                <option value="" className="bg-slate-900">Select a client...</option>
                                                {adminUsers.map(u => <option key={u.userId} value={u.userId} className="bg-slate-900">{u.fullName || u.userId} (@{u.userId})</option>)}
                                            </select>
                                        </Field>
                                        <Field label="Subject *">
                                            <Input required placeholder="e.g. Missing GST Returns" value={querySubject} onChange={e => setQuerySubject(e.target.value)}
                                                className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-rose-500/50" />
                                        </Field>
                                    </div>
                                    <Field label={`Message${queryAttachment ? '' : ' *'}`}>
                                        <textarea
                                            required={!queryAttachment}
                                            rows={5}
                                            placeholder="Describe the query in detail..."
                                            value={queryMessage}
                                            onChange={e => setQueryMessage(e.target.value)}
                                            className="w-full px-3 py-2 rounded-md bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-slate-600 focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20 outline-none text-sm resize-none" />
                                    </Field>

                                    {/* ── Optional Attachment ── */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <Paperclip className="w-3.5 h-3.5" /> Attachment <span className="normal-case font-normal text-slate-600">(optional · PDF, JPEG, PNG)</span>
                                        </label>

                                        {queryAttachment ? (
                                            /* Selected file chip */
                                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/25">
                                                <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center flex-shrink-0">
                                                    <Paperclip className="w-4 h-4 text-rose-400" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-white font-medium truncate">{queryAttachment.name}</p>
                                                    <p className="text-xs text-slate-500">{(queryAttachment.size / 1024).toFixed(1)} KB</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setQueryAttachment(null)}
                                                    className="flex-shrink-0 text-slate-500 hover:text-red-400 transition-colors p-1 rounded"
                                                    title="Remove attachment">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            /* Drop zone */
                                            <div
                                                onDragOver={e => { e.preventDefault(); setQueryAttachmentDragOver(true); }}
                                                onDragLeave={() => setQueryAttachmentDragOver(false)}
                                                onDrop={e => {
                                                    e.preventDefault(); setQueryAttachmentDragOver(false);
                                                    const f = e.dataTransfer.files[0];
                                                    if (f) setQueryAttachment(f);
                                                }}
                                                onClick={() => document.getElementById('query-attachment-input')?.click()}
                                                className={`relative border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer ${
                                                    queryAttachmentDragOver
                                                        ? 'border-rose-400 bg-rose-500/10 scale-[1.01]'
                                                        : 'border-white/[0.1] bg-white/[0.02] hover:border-rose-500/40 hover:bg-rose-500/5'
                                                }`}>
                                                <input
                                                    id="query-attachment-input"
                                                    type="file"
                                                    accept="application/pdf,image/jpeg,image/png"
                                                    className="hidden"
                                                    onChange={e => {
                                                        const f = e.target.files?.[0];
                                                        if (f) setQueryAttachment(f);
                                                        e.target.value = '';
                                                    }}
                                                />
                                                <Paperclip className={`w-8 h-8 mx-auto mb-2 transition-colors ${queryAttachmentDragOver ? 'text-rose-400' : 'text-slate-600'}`} />
                                                <p className="text-sm text-slate-400">
                                                    {queryAttachmentDragOver ? 'Drop file here!' : 'Drag & drop or click to attach'}
                                                </p>
                                                <p className="text-xs text-slate-600 mt-0.5">PDF, JPEG, PNG</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-end pt-2">
                                        <Button type="submit" disabled={querySaving}
                                            className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-medium px-6 shadow-lg shadow-rose-500/20 disabled:opacity-40">
                                            {querySaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending...</> : <><Send className="w-4 h-4 mr-2" />Raise Query</>}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                );

            // ── Queries List ──────────────────────────────────────────────────
            case 'queries-list':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                <ClipboardList className="w-6 h-6 text-rose-400" /> Raised Queries
                            </h1>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 bg-white/[0.04] px-2.5 py-1 rounded-full">{adminQueries.length} {adminQueries.length === 1 ? 'query' : 'queries'}</span>
                                <Button variant="ghost" onClick={fetchAdminQueries} disabled={loadingAdminQueries} className="text-slate-400 hover:text-white hover:bg-white/[0.06] px-2">
                                    <RefreshCw className={`w-4 h-4 ${loadingAdminQueries ? 'animate-spin' : ''}`} />
                                </Button>
                            </div>
                        </div>
                        {loadingAdminQueries ? (
                            <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-rose-400 animate-spin" /></div>
                        ) : adminQueries.length === 0 ? (
                            <div className="flex items-center justify-center py-20">
                                <EmptyState icon={<MessageCircle className="w-12 h-12" />} title="No queries raised yet" subtitle='Use "Raise a Query" to send a query to a client.' />
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {adminQueries.map((q: any, index: number) => (
                                    <motion.div key={q.id || index} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}
                                        className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] hover:border-rose-500/20 transition-all duration-300">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 border border-rose-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <MessageCircle className="w-5 h-5 text-rose-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-white font-semibold">{q.subject || 'No Subject'}</span>
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider border ${statusBadge(q.status)}`}>{q.status || 'OPEN'}</span>
                                                    {q.fileName && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 border border-amber-500/20 text-amber-400">
                                                            <Paperclip className="w-2.5 h-2.5" /> Attachment
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-slate-400 text-sm mt-1.5 leading-relaxed line-clamp-2">{q.messageText || <span className="italic text-slate-600">{q.fileName ? 'See attachment' : 'No message content'}</span>}</p>
                                                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                                    <span className="flex items-center gap-1"><User className="w-3 h-3" />Sent to: <strong className="text-slate-400 ml-0.5">{q.targetUser?.userId || q.targetUser?.fullName || '—'}</strong></span>
                                                    {q.createdAt && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(q.createdAt)}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.05]">
                                            <Button size="sm" variant="ghost" onClick={() => handleViewQuery(q)}
                                                className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-3 py-1.5 h-auto flex items-center gap-1.5">
                                                <MessageCircle className="w-3.5 h-3.5" /> View & Reply
                                            </Button>
                                            {q.fileName && (
                                                <Button size="sm" variant="ghost"
                                                    onClick={() => handleDownloadQueryAttachment(q.id, q.fileName)}
                                                    disabled={downloadingQueryId === q.id}
                                                    className="text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 px-3 py-1.5 h-auto flex items-center gap-1.5">
                                                    {downloadingQueryId === q.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />} Download
                                                </Button>
                                            )}
                                            <Button size="sm" variant="ghost" onClick={() => setQueryToDelete(q.id)}
                                                className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1.5 h-auto flex items-center gap-1.5 ml-auto">
                                                <Trash2 className="w-3.5 h-3.5" /> Delete
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                );

            // ── Employee Management ──────────────────────────────────────────
            case 'employees':
                return <AdminEmployeeManagement onEmployeeChange={fetchUsers} />;

            default:
                return null;
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // SIDEBAR COMPONENT
    // ═══════════════════════════════════════════════════════════════════════════

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className={`flex items-center justify-between px-4 py-4 border-b border-white/[0.06] ${sidebarCollapsed ? 'justify-center' : ''}`}>
                <MRSLogo collapsed={sidebarCollapsed} />
                <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all flex-shrink-0">
                    {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </button>
            </div>

            {/* Nav Groups */}
            <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6 scrollbar-thin">
                {groups.map(group => {
                    const items = adminNavItems.filter(n => n.group === group);
                    return (
                        <div key={group}>
                            {!sidebarCollapsed && (
                                <p className="px-3 mb-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">{groupLabels[group]}</p>
                            )}
                            <div className="space-y-0.5">
                                {items.map(item => {
                                    const isActive = activeSection === item.id;
                                    return (
                                        <button key={item.id} onClick={() => navigate(item.id)}
                                            title={sidebarCollapsed ? item.label : undefined}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${isActive
                                                ? `${navItemAccent[item.id]} border`
                                                : 'text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent'
                                                } ${sidebarCollapsed ? 'justify-center' : ''}`}>
                                            <span className="flex-shrink-0">{item.icon}</span>
                                            {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                                            {!sidebarCollapsed && isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </nav>

            {/* Bottom: user info + logout */}
            <div className={`border-t border-white/[0.06] p-3 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
                {sidebarCollapsed ? (
                    <button onClick={handleLogout} className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Logout">
                        <LogOut className="w-4 h-4" />
                    </button>
                ) : (
                    <div className="flex items-center gap-2 px-1">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/30 to-orange-500/30 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                            <Shield className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-white text-xs font-semibold truncate">{user.fullName || user.userId}</div>
                            <div className="text-slate-500 text-[10px]">Administrator</div>
                        </div>
                        <button onClick={handleLogout} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0" title="Logout">
                            <LogOut className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    // ═══════════════════════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════════════════════

    return (
        <div className={`bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 relative selection:bg-cyan-500/30 min-h-screen ${
            user.role === 'admin' ? 'flex overflow-x-hidden' : 'lg:h-screen lg:overflow-hidden flex flex-col'
        }`}>
            {/* Animated Canvas Mesh & Particle Background */}
            <AmbientParticleCanvas />

            {/* Background lighting ambient glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[15%] w-[600px] h-[600px] bg-blue-600/[0.07] rounded-full blur-[140px] transform-gpu" />
                <div className="absolute bottom-[-10%] left-[5%] w-[500px] h-[500px] bg-indigo-600/[0.06] rounded-full blur-[130px] transform-gpu" />
                <div className="absolute top-[40%] right-[5%] w-[450px] h-[450px] bg-cyan-600/[0.04] rounded-full blur-[120px] transform-gpu" />
            </div>

            {/* ── ADMIN LAYOUT ── */}
            {user.role === 'admin' && (
                <>
                    {/* Mobile overlay */}
                    <AnimatePresence>
                        {mobileSidebarOpen && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
                                onClick={() => setMobileSidebarOpen(false)} />
                        )}
                    </AnimatePresence>

                    {/* Mobile sidebar */}
                    <AnimatePresence>
                        {mobileSidebarOpen && (
                            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                                className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/95 border-r border-white/[0.06] backdrop-blur-xl lg:hidden">
                                <SidebarContent />
                            </motion.aside>
                        )}
                    </AnimatePresence>

                    {/* Desktop sidebar */}
                    <aside className={`relative z-10 hidden lg:flex flex-col flex-shrink-0 border-r border-white/[0.06] bg-slate-900/60 backdrop-blur-xl transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-60'}`}>
                        <SidebarContent />
                    </aside>

                    {/* Main content */}
                    <div className="flex-1 flex flex-col min-w-0 relative z-10">
                        {/* Topbar */}
                        <header className="flex items-center gap-3 px-4 md:px-6 h-14 border-b border-white/[0.06] bg-white/[0.02] backdrop-blur-xl flex-shrink-0">
                            <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all">
                                <Menu className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-1.5 text-sm text-slate-400">
                                <span>Dashboard</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                                <span className="text-white font-medium">{adminNavItems.find(n => n.id === activeSection)?.label || 'Overview'}</span>
                            </div>
                            <div className="ml-auto">
                                <Link href="/" className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all">
                                    <Home className="w-3.5 h-3.5" />Home
                                </Link>
                            </div>
                        </header>

                        {/* Section content */}
                        <main className="flex-1 overflow-y-auto p-4 md:p-8">
                            <AnimatePresence mode="wait">
                                <motion.div key={activeSection}
                                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.22 }}>
                                    {renderAdminSection()}
                                </motion.div>
                            </AnimatePresence>
                        </main>
                    </div>
                </>
            )}

            {/* ── CLIENT / USER SINGLE-SCREEN WORKSPACE ── */}
            {user.role === 'user' && (() => {
                const openQueriesCount = clientQueries.filter((q: any) => {
                    const s = String(q?.status || 'OPEN').toUpperCase();
                    return s === 'OPEN' || s === 'PENDING' || s === 'SEEN';
                }).length;

                return (
                    <div className="flex-1 flex flex-col relative z-10 w-full min-h-screen lg:min-h-0 lg:h-screen lg:overflow-hidden">
                        {/* Compact Top Header */}
                        <motion.header
                            initial={{ opacity: 0, y: -12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                            className="border-b border-white/[0.08] bg-slate-950/70 backdrop-blur-2xl flex-shrink-0 z-30 shadow-md shadow-black/30"
                        >
                            <div className="max-w-[1700px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Link href="/" className="flex items-center gap-2.5 group">
                                        <div className="relative w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                                            style={{ background: 'linear-gradient(145deg, #ffffff 0%, #dceeff 100%)', border: '1.5px solid rgba(255,255,255,0.85)', boxShadow: '0 0 0 1px rgba(59,130,246,0.3), 0 3px 12px rgba(59,130,246,0.3)' }}>
                                            <img src="https://education21.in/wp-content/uploads/2023/12/CA-India-Logo-1024x762.png" alt="CA India Logo" className="w-5 h-5 object-contain" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-white font-bold text-xs sm:text-sm tracking-wide leading-tight" style={{ fontFamily: 'Georgia, serif' }}>MRS & Co.</span>
                                            <span className="text-[9px] text-cyan-400 font-medium tracking-wider uppercase leading-none">Chartered Accountants</span>
                                        </div>
                                    </Link>
                                    <div className="hidden sm:block h-5 w-px bg-white/10" />
                                    <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium text-slate-300 bg-white/[0.04] border border-white/[0.06]">
                                        <Sparkles className="w-3 h-3 text-cyan-400" /> Client Workspace
                                    </span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <Link href="/" className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all">
                                        <Home className="w-3.5 h-3.5" />Home
                                    </Link>
                                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] shadow-inner text-xs">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                                        <User className="w-3.5 h-3.5 text-cyan-400" />
                                        <span className="text-white font-medium truncate max-w-[130px] sm:max-w-[180px]">{user.fullName || user.userId}</span>
                                    </div>
                                    <Tactile3DButton onClick={handleLogout} variant="ghost" size="sm" className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 h-8 px-2.5 text-xs">
                                        <LogOut className="w-3.5 h-3.5" /><span className="hidden sm:inline ml-1">Logout</span>
                                    </Tactile3DButton>
                                </div>
                            </div>
                        </motion.header>

                        {/* Responsive Workspace Layout (Scrollable on mobile/tablet, single-screen on desktop) */}
                        <div className="flex-1 max-w-[1700px] w-full mx-auto p-3 sm:p-4 flex flex-col gap-3 min-h-0 lg:overflow-hidden overflow-y-auto">
                            
                            {/* Zone 1: Top Pill Stats Bar */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, delay: 0.05 }}
                                className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 flex-shrink-0"
                            >
                                {/* Stat 1: Pending Queries */}
                                <button
                                    type="button"
                                    onClick={() => setClientActiveTab('queries')}
                                    className={`w-full text-left p-3 sm:py-2.5 sm:px-4 rounded-xl border transition-all duration-200 flex items-center justify-between cursor-pointer group ${
                                        clientActiveTab === 'queries'
                                            ? 'bg-rose-500/15 border-rose-500/40 shadow-[0_0_16px_rgba(244,63,94,0.2)] ring-1 ring-rose-500/30'
                                            : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] hover:border-rose-500/30'
                                    }`}
                                >
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-1.5">
                                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Queries</p>
                                            {openQueriesCount > 0 && (
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-lg sm:text-xl font-bold text-white mt-0.5 flex items-baseline gap-1.5">
                                            {loadingClientQueries ? (
                                                <Loader2 className="w-4 h-4 animate-spin text-rose-400 inline" />
                                            ) : (
                                                <span className={openQueriesCount > 0 ? 'text-rose-400' : 'text-white'}>{openQueriesCount}</span>
                                            )}
                                            <span className="text-[10px] text-slate-400 font-normal">({clientQueries.length} total)</span>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center flex-shrink-0 ml-2 shadow-[0_0_12px_rgba(244,63,94,0.2)] group-hover:scale-105 transition-transform">
                                        <MessageCircle className="w-4 h-4 text-rose-400" />
                                    </div>
                                </button>

                                {/* Stat 2: Verified Documents */}
                                <button
                                    type="button"
                                    onClick={() => setClientActiveTab('documents')}
                                    className={`w-full text-left p-3 sm:py-2.5 sm:px-4 rounded-xl border transition-all duration-200 flex items-center justify-between cursor-pointer group ${
                                        clientActiveTab === 'documents'
                                            ? 'bg-cyan-500/15 border-cyan-500/40 shadow-[0_0_16px_rgba(6,182,212,0.2)] ring-1 ring-cyan-500/30'
                                            : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] hover:border-cyan-500/30'
                                    }`}
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Documents</p>
                                        <div className="text-lg sm:text-xl font-bold text-white mt-0.5 flex items-baseline gap-1.5">
                                            {loadingDocs ? <Loader2 className="w-4 h-4 animate-spin text-cyan-400 inline" /> : documents.length}
                                            <span className="text-[10px] text-slate-400 font-normal">verified files</span>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 ml-2 shadow-[0_0_12px_rgba(6,182,212,0.2)] group-hover:scale-105 transition-transform">
                                        <FileText className="w-4 h-4 text-cyan-400" />
                                    </div>
                                </button>

                                {/* Stat 3: Drive Folders */}
                                <button
                                    type="button"
                                    onClick={() => setClientActiveTab('drive')}
                                    className={`w-full text-left p-3 sm:py-2.5 sm:px-4 rounded-xl border transition-all duration-200 flex items-center justify-between cursor-pointer group ${
                                        clientActiveTab === 'drive'
                                            ? 'bg-blue-500/15 border-blue-500/40 shadow-[0_0_16px_rgba(59,130,246,0.2)] ring-1 ring-blue-500/30'
                                            : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] hover:border-blue-500/30'
                                    }`}
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Drive Folders</p>
                                        <div className="text-lg sm:text-xl font-bold text-white mt-0.5 flex items-baseline gap-1.5">
                                            {loadingClientDriveLinks ? <Loader2 className="w-4 h-4 animate-spin text-blue-400 inline" /> : clientDriveLinks.length}
                                            <span className="text-[10px] text-slate-400 font-normal">cloud folders</span>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 ml-2 shadow-[0_0_12px_rgba(59,130,246,0.2)] group-hover:scale-105 transition-transform">
                                        <FolderOpen className="w-4 h-4 text-blue-400" />
                                    </div>
                                </button>

                                {/* Stat 4: Account Status */}
                                <div className="p-3 sm:py-2.5 sm:px-4 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</p>
                                        <div className="text-sm sm:text-base font-bold text-emerald-400 mt-0.5 flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"></span>
                                            {profile?.active !== false ? 'Verified Client' : 'Inactive'}
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 ml-2 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Zone 2: Viewport Grid Split (Left Profile Dock + Right Tabbed Workspace) */}
                            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0 lg:overflow-hidden pb-4 lg:pb-0">
                                
                                {/* Left Column: Compact Profile & Controls Dock */}
                                <motion.div
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.35, delay: 0.1 }}
                                    className="col-span-1 lg:col-span-3 flex flex-col lg:h-full min-h-0"
                                >
                                    <div className="border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl rounded-2xl h-full flex flex-col justify-between p-4 overflow-hidden shadow-lg">
                                        <div className="space-y-3 min-h-0 lg:overflow-y-auto micro-scroll pr-0.5">
                                            {/* Avatar & User Details */}
                                            <div className="flex items-center gap-3 pb-3 border-b border-white/[0.06]">
                                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-600 flex items-center justify-center text-white text-base font-bold shadow-md shadow-blue-500/30 border border-white/20 flex-shrink-0">
                                                    {(profile?.fullName || user.fullName || user.userId).charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-white font-semibold text-sm truncate">{profile?.fullName || user.fullName || 'Client'}</div>
                                                    <div className="text-cyan-400 font-mono text-xs truncate">@{user.userId}</div>
                                                    <div className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400 mt-0.5">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                                        CA Portal Access
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Compact Info List */}
                                            <div className="space-y-2 text-xs">
                                                {profile?.email && (
                                                    <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                                                        <Mail className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                                                        <span className="text-slate-300 truncate" title={profile.email}>{profile.email}</span>
                                                    </div>
                                                )}
                                                {profile?.phone && (
                                                    <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                                                        <Phone className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                                                        <span className="text-slate-300 truncate">{profile.phone}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                                                    <Calendar className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                                                    <span className="text-slate-300 truncate">Joined {profile?.createdAt ? formatDate(profile.createdAt) : 'Recently'}</span>
                                                </div>
                                            </div>

                                            {/* Quick Status Card */}
                                            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/[0.05] to-blue-500/[0.05] border border-cyan-500/15">
                                                <div className="flex items-center justify-between text-[11px] mb-1">
                                                    <span className="text-slate-400 font-medium flex items-center gap-1">
                                                        <Shield className="w-3 h-3 text-cyan-400" /> Account Security
                                                    </span>
                                                    <span className="text-cyan-400 font-bold">256-bit SSL</span>
                                                </div>
                                                <p className="text-[10px] text-slate-400 leading-snug">All documents &amp; audit queries are encrypted end-to-end.</p>
                                            </div>
                                        </div>

                                        {/* Bottom Action Dock */}
                                        <div className="pt-3 border-t border-white/[0.06] mt-2">
                                            <Tactile3DButton
                                                variant="glass"
                                                size="sm"
                                                className="w-full text-xs text-slate-300 hover:text-white h-8"
                                                onClick={() => {
                                                    fetchClientProfile();
                                                    fetchClientDocs();
                                                    fetchClientDriveLinks();
                                                    fetchClientQueries();
                                                }}
                                                icon={<RefreshCw className={`w-3.5 h-3.5 ${loadingProfile || loadingDocs || loadingClientDriveLinks || loadingClientQueries ? 'animate-spin text-cyan-400' : 'text-slate-400'}`} />}
                                            >
                                                Sync All Data
                                            </Tactile3DButton>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Right Column: Tabbed Section Workspace Container */}
                                <motion.div
                                    initial={{ opacity: 0, x: 12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.35, delay: 0.1 }}
                                    className="col-span-1 lg:col-span-9 flex flex-col min-h-[480px] lg:min-h-0 lg:h-full"
                                >
                                    <div className="border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl rounded-2xl h-full flex flex-col p-3 sm:p-4 overflow-hidden shadow-xl">
                                        
                                        {/* Tab Navigation Bar with Framer Motion layoutId */}
                                        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/[0.08] flex-shrink-0">
                                            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950/50 border border-white/[0.06]">
                                                {/* Tab 1: Documents */}
                                                <button
                                                    type="button"
                                                    onClick={() => setClientActiveTab('documents')}
                                                    className={`relative px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer z-10 ${
                                                        clientActiveTab === 'documents' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                                                    }`}
                                                >
                                                    {clientActiveTab === 'documents' && (
                                                        <motion.div
                                                            layoutId="clientActiveTabIndicator"
                                                            className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/25 via-blue-500/25 to-indigo-500/25 border border-cyan-400/40 shadow-[0_0_14px_rgba(6,182,212,0.25)]"
                                                            transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                                                        />
                                                    )}
                                                    <FileText className={`w-3.5 h-3.5 relative z-10 ${clientActiveTab === 'documents' ? 'text-cyan-400' : 'text-slate-400'}`} />
                                                    <span className="relative z-10">Documents</span>
                                                    <span className={`relative z-10 text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                                                        clientActiveTab === 'documents' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30' : 'bg-white/[0.05] text-slate-400'
                                                    }`}>
                                                        {documents.length}
                                                    </span>
                                                </button>

                                                {/* Tab 2: Drive Folders */}
                                                <button
                                                    type="button"
                                                    onClick={() => setClientActiveTab('drive')}
                                                    className={`relative px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer z-10 ${
                                                        clientActiveTab === 'drive' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                                                    }`}
                                                >
                                                    {clientActiveTab === 'drive' && (
                                                        <motion.div
                                                            layoutId="clientActiveTabIndicator"
                                                            className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/25 via-indigo-500/25 to-cyan-500/25 border border-blue-400/40 shadow-[0_0_14px_rgba(59,130,246,0.25)]"
                                                            transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                                                        />
                                                    )}
                                                    <FolderOpen className={`w-3.5 h-3.5 relative z-10 ${clientActiveTab === 'drive' ? 'text-blue-400' : 'text-slate-400'}`} />
                                                    <span className="relative z-10">Drive Folders</span>
                                                    <span className={`relative z-10 text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                                                        clientActiveTab === 'drive' ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' : 'bg-white/[0.05] text-slate-400'
                                                    }`}>
                                                        {clientDriveLinks.length}
                                                    </span>
                                                </button>

                                                {/* Tab 3: Queries */}
                                                <button
                                                    type="button"
                                                    onClick={() => setClientActiveTab('queries')}
                                                    className={`relative px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer z-10 ${
                                                        clientActiveTab === 'queries' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                                                    }`}
                                                >
                                                    {clientActiveTab === 'queries' && (
                                                        <motion.div
                                                            layoutId="clientActiveTabIndicator"
                                                            className="absolute inset-0 rounded-lg bg-gradient-to-r from-rose-500/25 via-pink-500/25 to-orange-500/25 border border-rose-400/40 shadow-[0_0_14px_rgba(244,63,94,0.25)]"
                                                            transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                                                        />
                                                    )}
                                                    <MessageCircle className={`w-3.5 h-3.5 relative z-10 ${clientActiveTab === 'queries' ? 'text-rose-400' : 'text-slate-400'}`} />
                                                    <span className="relative z-10">Queries</span>
                                                    {openQueriesCount > 0 ? (
                                                        <span className="relative z-10 text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-rose-500/30 text-rose-300 border border-rose-400/50 animate-pulse">
                                                            {openQueriesCount} new
                                                        </span>
                                                    ) : (
                                                        <span className={`relative z-10 text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                                                            clientActiveTab === 'queries' ? 'bg-rose-500/20 text-rose-300 border border-rose-400/30' : 'bg-white/[0.05] text-slate-400'
                                                        }`}>
                                                            {clientQueries.length}
                                                        </span>
                                                    )}
                                                </button>
                                            </div>

                                            {/* Tab-Specific Refresh Action */}
                                            <div className="flex items-center gap-2">
                                                {clientActiveTab === 'documents' && (
                                                    <Tactile3DButton
                                                        variant="glass"
                                                        size="sm"
                                                        onClick={fetchClientDocs}
                                                        disabled={loadingDocs}
                                                        icon={<RefreshCw className={`w-3 h-3 ${loadingDocs ? 'animate-spin text-cyan-400' : 'text-slate-400'}`} />}
                                                        className="text-xs h-8 px-2.5"
                                                    >
                                                        Refresh Files
                                                    </Tactile3DButton>
                                                )}
                                                {clientActiveTab === 'drive' && (
                                                    <Tactile3DButton
                                                        variant="glass"
                                                        size="sm"
                                                        onClick={fetchClientDriveLinks}
                                                        disabled={loadingClientDriveLinks}
                                                        icon={<RefreshCw className={`w-3 h-3 ${loadingClientDriveLinks ? 'animate-spin text-blue-400' : 'text-slate-400'}`} />}
                                                        className="text-xs h-8 px-2.5"
                                                    >
                                                        Refresh Drive
                                                    </Tactile3DButton>
                                                )}
                                                {clientActiveTab === 'queries' && (
                                                    <Tactile3DButton
                                                        variant="glass"
                                                        size="sm"
                                                        onClick={fetchClientQueries}
                                                        disabled={loadingClientQueries}
                                                        icon={<RefreshCw className={`w-3 h-3 ${loadingClientQueries ? 'animate-spin text-rose-400' : 'text-slate-400'}`} />}
                                                        className="text-xs h-8 px-2.5"
                                                    >
                                                        Refresh Queries
                                                    </Tactile3DButton>
                                                )}
                                            </div>
                                        </div>

                                        {/* Tab Panels Area */}
                                        <div className="flex-1 min-h-0 overflow-hidden relative mt-2">
                                            <AnimatePresence mode="wait">
                                                {/* TAB 1: DOCUMENTS */}
                                                {clientActiveTab === 'documents' && (
                                                    <motion.div
                                                        key="documents"
                                                        initial={{ opacity: 0, scale: 0.98 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.98 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="h-full overflow-y-auto micro-scroll pr-1 sm:pr-1.5 space-y-2.5"
                                                    >
                                                        {/* ── Client: Send Document Panel ── */}
                                                        <div className="rounded-xl border border-dashed border-violet-500/40 bg-gradient-to-br from-violet-500/[0.06] to-purple-600/[0.04] overflow-hidden mb-1">
                                                            {/* Header toggle */}
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setClientUploadExpanded(v => !v);
                                                                    setClientUploadSuccess('');
                                                                    setClientUploadError('');
                                                                }}
                                                                className="w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-white/[0.03] transition-colors duration-150 group"
                                                            >
                                                                <div className="flex items-center gap-2.5">
                                                                    <div className="w-7 h-7 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shadow-[0_0_10px_rgba(139,92,246,0.2)] group-hover:scale-105 transition-transform">
                                                                        <Paperclip className="w-3.5 h-3.5 text-violet-400" />
                                                                    </div>
                                                                    <div className="text-left">
                                                                        <p className="text-xs font-semibold text-violet-300 leading-none">Send Document to MRS & Co.</p>
                                                                        <p className="text-[10px] text-slate-400 mt-0.5">Attach files to your open query</p>
                                                                    </div>
                                                                </div>
                                                                <div className={`w-5 h-5 rounded-full border border-violet-500/30 bg-violet-500/10 flex items-center justify-center transition-transform duration-200 ${clientUploadExpanded ? 'rotate-180' : ''}`}>
                                                                    <ChevronRight className="w-3 h-3 text-violet-400 rotate-90" />
                                                                </div>
                                                            </button>

                                                            {/* Expandable Form */}
                                                            <AnimatePresence>
                                                                {clientUploadExpanded && (
                                                                    <motion.div
                                                                        key="client-upload-panel"
                                                                        initial={{ height: 0, opacity: 0 }}
                                                                        animate={{ height: 'auto', opacity: 1 }}
                                                                        exit={{ height: 0, opacity: 0 }}
                                                                        transition={{ duration: 0.22, ease: 'easeInOut' }}
                                                                        className="overflow-hidden"
                                                                    >
                                                                        <form
                                                                            onSubmit={handleClientDocUpload}
                                                                            className="px-3.5 pb-3.5 pt-1 space-y-3"
                                                                        >
                                                                            {/* Dropzone */}
                                                                            <div
                                                                                onDragOver={e => { e.preventDefault(); setClientUploadDragOver(true); }}
                                                                                onDragLeave={() => setClientUploadDragOver(false)}
                                                                                onDrop={e => {
                                                                                    e.preventDefault();
                                                                                    setClientUploadDragOver(false);
                                                                                    const files = Array.from(e.dataTransfer.files);
                                                                                    setClientUploadFiles(prev => [...prev, ...files]);
                                                                                }}
                                                                                onClick={() => document.getElementById('client-doc-input')?.click()}
                                                                                className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center py-5 gap-2 ${
                                                                                    clientUploadDragOver
                                                                                        ? 'border-violet-400 bg-violet-500/15 scale-[1.01]'
                                                                                        : 'border-violet-500/30 bg-white/[0.02] hover:border-violet-400/60 hover:bg-violet-500/[0.07]'
                                                                                }`}
                                                                            >
                                                                                <input
                                                                                    id="client-doc-input"
                                                                                    type="file"
                                                                                    multiple
                                                                                    className="hidden"
                                                                                    onChange={e => {
                                                                                        const files = Array.from(e.target.files || []);
                                                                                        setClientUploadFiles(prev => [...prev, ...files]);
                                                                                        e.target.value = '';
                                                                                    }}
                                                                                />
                                                                                <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
                                                                                    <UploadCloud className="w-4.5 h-4.5 text-violet-400" />
                                                                                </div>
                                                                                <div className="text-center">
                                                                                    <p className="text-xs font-medium text-violet-300">
                                                                                        {clientUploadDragOver ? 'Drop files here' : 'Click or drag files here'}
                                                                                    </p>
                                                                                    <p className="text-[10px] text-slate-500 mt-0.5">PDF, Excel, Word, Images — any format</p>
                                                                                </div>
                                                                            </div>

                                                                            {/* File chips */}
                                                                            {clientUploadFiles.length > 0 && (
                                                                                <div className="flex flex-wrap gap-1.5">
                                                                                    {clientUploadFiles.map((f, i) => (
                                                                                        <div key={i} className="flex items-center gap-1 bg-violet-500/10 border border-violet-500/20 rounded-lg px-2 py-1 text-[10px] text-violet-300 max-w-[140px]">
                                                                                            <File className="w-2.5 h-2.5 flex-shrink-0" />
                                                                                            <span className="truncate">{f.name}</span>
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() => setClientUploadFiles(prev => prev.filter((_, j) => j !== i))}
                                                                                                className="ml-0.5 text-violet-400 hover:text-rose-400 transition-colors flex-shrink-0"
                                                                                            >
                                                                                                <X className="w-2.5 h-2.5" />
                                                                                            </button>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            )}

                                                                            {/* Note field */}
                                                                            <textarea
                                                                                value={clientUploadNote}
                                                                                onChange={e => setClientUploadNote(e.target.value)}
                                                                                placeholder="Add a note for MRS & Co. (optional)…"
                                                                                rows={2}
                                                                                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 resize-none focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all"
                                                                            />

                                                                            {/* Status messages */}
                                                                            {clientUploadSuccess && (
                                                                                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs">
                                                                                    <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                                                                    {clientUploadSuccess}
                                                                                </div>
                                                                            )}
                                                                            {clientUploadError && (
                                                                                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs">
                                                                                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                                                                    {clientUploadError}
                                                                                </div>
                                                                            )}

                                                                            {/* Submit */}
                                                                            <Tactile3DButton
                                                                                type="submit"
                                                                                variant="cyan"
                                                                                size="sm"
                                                                                disabled={clientUploading || clientUploadFiles.length === 0}
                                                                                icon={clientUploading
                                                                                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                                                    : <Send className="w-3.5 h-3.5" />
                                                                                }
                                                                                className="w-full justify-center text-xs h-9 bg-gradient-to-r from-violet-600/80 to-purple-600/80 hover:from-violet-500/90 hover:to-purple-500/90 border-violet-500/40"
                                                                            >
                                                                                {clientUploading
                                                                                    ? `Sending ${clientUploadFiles.length} file${clientUploadFiles.length > 1 ? 's' : ''}…`
                                                                                    : `Send ${clientUploadFiles.length > 0 ? clientUploadFiles.length + ' ' : ''}Document${clientUploadFiles.length !== 1 ? 's' : ''} to MRS & Co.`
                                                                                }
                                                                            </Tactile3DButton>
                                                                        </form>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>

                                                        {loadingDocs ? (

                                                            <div className="flex flex-col items-center justify-center py-20 gap-2">
                                                                <Loader2 className="w-7 h-7 text-cyan-400 animate-spin" />
                                                                <p className="text-xs text-slate-400">Loading documents...</p>
                                                            </div>
                                                        ) : docsError ? (
                                                            <Alert type="error" msg={docsError} />
                                                        ) : documents.length === 0 ? (
                                                            <Interactive3DEmptyState
                                                                type="documents"
                                                                title="No documents uploaded yet"
                                                                subtitle="Signed tax filings, balance sheets, and audit reports shared by MRS & Co. will securely appear here."
                                                                actionLabel="Refresh Sync"
                                                                onAction={fetchClientDocs}
                                                            />
                                                        ) : (
                                                            <div className="space-y-2">
                                                                {documents.map((doc, index) => (
                                                                    <motion.div
                                                                        key={doc.id}
                                                                        initial={{ opacity: 0, y: 8 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        transition={{ delay: index * 0.03 }}
                                                                        className="group flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-cyan-500/30 transition-all duration-200"
                                                                    >
                                                                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.15)]">
                                                                            <FileText className="w-4 h-4 text-cyan-400" />
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="text-white font-medium text-xs sm:text-sm truncate group-hover:text-cyan-300 transition-colors">{doc.title}</div>
                                                                            {doc.description && <p className="text-slate-400 text-[11px] truncate mt-0.5">{doc.description}</p>}
                                                                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                                                                {doc.category && (
                                                                                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-gradient-to-r border text-[9px] font-medium uppercase tracking-wider ${getCategoryColor(doc.category)}`}>
                                                                                        <Tag className="w-2 h-2" />{doc.category}
                                                                                    </span>
                                                                                )}
                                                                                <span className="text-slate-400 text-[11px] flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{formatDate(doc.createdAt)}</span>
                                                                                <span className="text-slate-500 text-[11px] font-mono">{formatFileSize(doc.fileSize)}</span>
                                                                            </div>
                                                                        </div>
                                                                        <Tactile3DButton
                                                                            variant="glass"
                                                                            size="sm"
                                                                            onClick={async () => {
                                                                                try {
                                                                                    const parsed = JSON.parse(localStorage.getItem('mrs_auth_user') || 'null');
                                                                                    const res = await fetch(`/backend/user/${user.userId}/documents/${doc.id}/download`, {
                                                                                        headers: parsed?.token ? { Authorization: `Bearer ${parsed.token}` } : {},
                                                                                    });
                                                                                    if (!res.ok) throw new Error('Download failed');
                                                                                    const blob = await res.blob();
                                                                                    const url = window.URL.createObjectURL(blob);
                                                                                    const a = document.createElement('a');
                                                                                    a.href = url; a.download = doc.originalFileName || doc.title;
                                                                                    document.body.appendChild(a); a.click(); a.remove();
                                                                                    window.URL.revokeObjectURL(url);
                                                                                } catch { }
                                                                            }}
                                                                            className="opacity-90 group-hover:opacity-100 text-cyan-400 hover:text-cyan-300 text-xs h-8 px-2.5"
                                                                            icon={<Download className="w-3.5 h-3.5" />}
                                                                        >
                                                                            <span className="hidden sm:inline">Download</span>
                                                                        </Tactile3DButton>
                                                                    </motion.div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                )}

                                                {/* TAB 2: DRIVE FOLDERS */}
                                                {clientActiveTab === 'drive' && (
                                                    <motion.div
                                                        key="drive"
                                                        initial={{ opacity: 0, scale: 0.98 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.98 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="h-full overflow-y-auto micro-scroll pr-1 sm:pr-1.5 space-y-2.5"
                                                    >
                                                        {loadingClientDriveLinks ? (
                                                            <div className="flex flex-col items-center justify-center py-20 gap-2">
                                                                <Loader2 className="w-7 h-7 text-blue-400 animate-spin" />
                                                                <p className="text-xs text-slate-400">Loading drive folders...</p>
                                                            </div>
                                                        ) : clientDriveLinks.length === 0 ? (
                                                            <Interactive3DEmptyState
                                                                type="folders"
                                                                title="No shared folders yet"
                                                                subtitle="Google Drive archive links assigned to your account will automatically appear here."
                                                                actionLabel="Refresh Sync"
                                                                onAction={fetchClientDriveLinks}
                                                            />
                                                        ) : (
                                                            <div className="space-y-2">
                                                                {clientDriveLinks.map((link, index) => (
                                                                    <motion.div
                                                                        key={link.id || index}
                                                                        initial={{ opacity: 0, y: 8 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        transition={{ delay: index * 0.03 }}
                                                                        className="group flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-blue-500/30 transition-all duration-200"
                                                                    >
                                                                        <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.15)]">
                                                                            <FolderOpen className="w-4 h-4 text-blue-400" />
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <div
                                                                                onClick={() => handleOpenDriveUrl(link.driveUrl)}
                                                                                className="text-white font-medium text-xs sm:text-sm group-hover:text-blue-300 transition-colors truncate cursor-pointer"
                                                                            >
                                                                                {link.title || 'Drive Folder'}
                                                                            </div>
                                                                            {link.description && <p className="text-slate-400 text-[11px] truncate mt-0.5">{link.description}</p>}
                                                                            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[9px] font-medium uppercase tracking-wider mt-1">
                                                                                <Calendar className="w-2 h-2" />{link.year}
                                                                            </span>
                                                                        </div>
                                                                        <Tactile3DButton
                                                                            variant="cyan"
                                                                            size="sm"
                                                                            onClick={() => handleOpenDriveUrl(link.driveUrl)}
                                                                            icon={<ArrowUpRight className="w-3.5 h-3.5" />}
                                                                            className="text-xs h-8 px-2.5"
                                                                        >
                                                                            Open Drive
                                                                        </Tactile3DButton>
                                                                    </motion.div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                )}

                                                {/* TAB 3: QUERIES */}
                                                {clientActiveTab === 'queries' && (
                                                    <motion.div
                                                        key="queries"
                                                        initial={{ opacity: 0, scale: 0.98 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.98 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="h-full overflow-y-auto micro-scroll pr-1 sm:pr-1.5 space-y-2.5"
                                                    >
                                                        {loadingClientQueries ? (
                                                            <div className="flex flex-col items-center justify-center py-20 gap-2">
                                                                <Loader2 className="w-7 h-7 text-rose-400 animate-spin" />
                                                                <p className="text-xs text-slate-400">Loading queries...</p>
                                                            </div>
                                                        ) : clientQueries.length === 0 ? (
                                                            <Interactive3DEmptyState
                                                                type="queries"
                                                                title="No active queries"
                                                                subtitle="Inquiries or clarifications requested by your audit and tax partners at MRS & Co. will appear here."
                                                                actionLabel="Check for Queries"
                                                                onAction={fetchClientQueries}
                                                            />
                                                        ) : (
                                                            <div className="space-y-2.5">
                                                                {clientQueries.map((q: any, index: number) => {
                                                                    const isOpen = String(q?.status || 'OPEN').toUpperCase() === 'OPEN';
                                                                    return (
                                                                        <motion.div
                                                                            key={q.id || index}
                                                                            initial={{ opacity: 0, y: 8 }}
                                                                            animate={{ opacity: 1, y: 0 }}
                                                                            transition={{ delay: index * 0.03 }}
                                                                            className={`p-3 sm:p-3.5 rounded-xl border transition-all duration-200 relative ${
                                                                                isOpen
                                                                                    ? 'bg-gradient-to-r from-rose-500/[0.08] to-pink-500/[0.04] border-rose-500/30 hover:border-rose-400/50 shadow-[0_2px_14px_rgba(244,63,94,0.08)]'
                                                                                    : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/15'
                                                                            }`}
                                                                        >
                                                                            {isOpen && (
                                                                                <span className="absolute top-3 right-3 flex h-2.5 w-2.5">
                                                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                                                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span>
                                                                                </span>
                                                                            )}

                                                                            <div className="flex items-start gap-3">
                                                                                <div className="w-9 h-9 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_10px_rgba(244,63,94,0.2)] mt-0.5">
                                                                                    <MessageCircle className="w-4 h-4 text-rose-400" />
                                                                                </div>
                                                                                <div className="flex-1 min-w-0 pr-6">
                                                                                    <div className="flex items-center gap-2 flex-wrap">
                                                                                        <span
                                                                                            onClick={() => handleViewQuery(q)}
                                                                                            className="text-white font-semibold text-xs sm:text-sm tracking-tight truncate cursor-pointer hover:text-rose-300 transition-colors"
                                                                                        >
                                                                                            {q.subject || 'Query'}
                                                                                        </span>
                                                                                        <span className={`inline-flex items-center px-2 py-0.2 rounded-full text-[9px] font-semibold uppercase tracking-wider border ${statusBadge(q.status)}`}>
                                                                                            {q.status || 'OPEN'}
                                                                                        </span>
                                                                                        {q.fileName && (
                                                                                            <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[9px] font-medium bg-amber-500/15 border border-amber-500/30 text-amber-300">
                                                                                                <Paperclip className="w-2.5 h-2.5" /> Attachment
                                                                                            </span>
                                                                                        )}
                                                                                    </div>
                                                                                    <p className="text-slate-300 text-xs mt-1.5 leading-relaxed line-clamp-2">
                                                                                        {q.messageText || <span className="italic text-slate-500">{q.fileName ? 'See attachment below' : 'No message content'}</span>}
                                                                                    </p>
                                                                                    {q.createdAt && (
                                                                                        <div className="flex items-center gap-1 mt-1.5 text-[10px] text-slate-400">
                                                                                            <Clock className="w-2.5 h-2.5 text-slate-500" />
                                                                                            <span>Raised on {formatDate(q.createdAt)}</span>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>

                                                                            {/* Action Buttons */}
                                                                            <div className="mt-3 pt-2.5 border-t border-white/[0.05] flex items-center gap-2 flex-wrap">
                                                                                <Tactile3DButton
                                                                                    variant="rose"
                                                                                    size="sm"
                                                                                    onClick={() => handleViewQuery(q)}
                                                                                    icon={<Send className="w-3 h-3" />}
                                                                                    className="text-xs h-7 px-2.5 cursor-pointer"
                                                                                >
                                                                                    Respond
                                                                                </Tactile3DButton>
                                                                                <Tactile3DButton
                                                                                    variant="glass"
                                                                                    size="sm"
                                                                                    onClick={() => handleViewQuery(q)}
                                                                                    icon={<Eye className="w-3 h-3" />}
                                                                                    className="text-xs h-7 px-2.5 cursor-pointer"
                                                                                >
                                                                                    View History
                                                                                </Tactile3DButton>
                                                                                {q.fileName && (
                                                                                    <Tactile3DButton
                                                                                        variant="glass"
                                                                                        size="sm"
                                                                                        onClick={() => handleDownloadQueryAttachment(q.id, q.fileName)}
                                                                                        disabled={downloadingQueryId === q.id}
                                                                                        icon={downloadingQueryId === q.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                                                                                        className="text-amber-300 hover:text-amber-200 text-xs h-7 px-2.5 cursor-pointer"
                                                                                    >
                                                                                        Download File
                                                                                    </Tactile3DButton>
                                                                                )}
                                                                            </div>
                                                                        </motion.div>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* ── MODALS ── */}


            {/* Edit User */}
            {editingUser && (
                <Modal onClose={() => setEditingUser(null)} title={<><Edit className="w-5 h-5 text-blue-400" /> Edit: {editingUser.userId}</>}>
                    <div className="space-y-4">
                        <Field label="Full Name"><Input value={editFullName} onChange={e => setEditFullName(e.target.value)} className="bg-white/[0.04] text-white border-white/10 focus:border-cyan-500/50" placeholder="e.g. Acme Corp" /></Field>
                        <Field label="Email"><Input value={editEmail} onChange={e => setEditEmail(e.target.value)} type="email" className="bg-white/[0.04] text-white border-white/10 focus:border-cyan-500/50" placeholder="email@example.com" /></Field>
                        <Field label="Phone"><Input value={editPhone} onChange={e => setEditPhone(e.target.value)} className="bg-white/[0.04] text-white border-white/10 focus:border-cyan-500/50" placeholder="+91 98765 43210" /></Field>
                    </div>
                    <div className="flex gap-3 justify-end mt-6">
                        <Button variant="ghost" onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white">Cancel</Button>
                        <Button onClick={handleUpdateUser} disabled={updatingUser} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20">
                            {updatingUser ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : 'Save Changes'}
                        </Button>
                    </div>
                </Modal>
            )}

            {/* Delete User */}
            {userToDelete && (
                <Modal onClose={() => setUserToDelete(null)} title={<><AlertCircle className="w-5 h-5 text-red-400" /> Delete Client</>} danger>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        Are you sure you want to delete client <strong className="text-white">{userToDelete}</strong>? This will permanently delete all their documents. This action cannot be undone.
                    </p>
                    <div className="flex gap-3 justify-end mt-6">
                        <Button variant="ghost" onClick={() => setUserToDelete(null)} className="text-slate-400 hover:text-white">Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteUser} disabled={deletingUser} className="bg-red-500 hover:bg-red-600 text-white">
                            {deletingUser ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}Delete Client
                        </Button>
                    </div>
                </Modal>
            )}

            {/* Delete Document */}
            {docToDelete && (
                <Modal onClose={() => setDocToDelete(null)} title={<><AlertCircle className="w-5 h-5 text-red-400" /> Delete Document</>} danger>
                    <p className="text-slate-300 text-sm leading-relaxed">Are you sure? The file will be permanently removed from the server.</p>
                    <div className="flex gap-3 justify-end mt-6">
                        <Button variant="ghost" onClick={() => setDocToDelete(null)} className="text-slate-400 hover:text-white">Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteDoc} disabled={deletingDoc} className="bg-red-500 hover:bg-red-600 text-white">
                            {deletingDoc ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}Delete Document
                        </Button>
                    </div>
                </Modal>
            )}

            {/* Edit Drive Link */}
            {editingDriveLink && (
                <Modal onClose={() => setEditingDriveLink(null)} title={<><FolderOpen className="w-5 h-5 text-blue-400" /> Edit Drive Link</>}>
                    <form onSubmit={handleUpdateDriveLink} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Assign to Client *">
                                <select required value={editDriveUserId} onChange={e => setEditDriveUserId(e.target.value)}
                                    className="w-full h-10 px-3 rounded-md bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:border-cyan-500/50 outline-none appearance-none">
                                    <option value="" className="bg-slate-900">Select...</option>
                                    {adminUsers.map(u => <option key={u.userId} value={u.userId} className="bg-slate-900">{u.fullName || u.userId} (@{u.userId})</option>)}
                                </select>
                            </Field>
                            <Field label="Year *"><Input required placeholder="e.g. 2024" value={editDriveYear} onChange={e => setEditDriveYear(e.target.value)} className="bg-white/[0.04] text-white border-white/10 focus:border-cyan-500/50" /></Field>
                        </div>
                        <Field label="Google Drive Link *"><Input required placeholder="https://drive.google.com/..." value={editDriveUrl} onChange={e => setEditDriveUrl(e.target.value)} className="bg-white/[0.04] text-white border-white/10 focus:border-cyan-500/50" /></Field>
                        <Field label="Folder Name"><Input placeholder="e.g. Tax Documents 2024" value={editDriveTitle} onChange={e => setEditDriveTitle(e.target.value)} className="bg-white/[0.04] text-white border-white/10 focus:border-cyan-500/50" /></Field>
                        <Field label="Description">
                            <textarea rows={3} placeholder="Optional description..." value={editDriveDescription} onChange={e => setEditDriveDescription(e.target.value)}
                                className="w-full px-3 py-2 rounded-md bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-slate-600 focus:border-cyan-500/50 outline-none text-sm resize-none" />
                        </Field>
                        <div className="flex gap-3 justify-end pt-2">
                            <Button type="button" variant="ghost" onClick={() => setEditingDriveLink(null)} className="text-slate-400 hover:text-white">Cancel</Button>
                            <Button type="submit" disabled={editDriveSaving} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20">
                                {editDriveSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* View Query & Interactive Conversation Thread Modal */}
            {viewingQuery && (
                <Modal onClose={() => setViewingQuery(null)} maxWidth="max-w-2xl" title={<><MessageCircle className="w-5 h-5 text-rose-400" /> Query #{viewingQuery.id || ''}</>}>
                    <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
                        {/* Query Header Info */}
                        <div className="p-4 bg-white/[0.03] border border-white/[0.08] rounded-xl flex flex-col gap-3">
                            <div className="flex items-start justify-between gap-2 flex-wrap">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Subject</p>
                                    <p className="text-white font-semibold text-base">{viewingQuery.subject || 'No Subject'}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider border ${statusBadge(viewingQuery.status)}`}>
                                        {viewingQuery.status || 'OPEN'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap pt-1 border-t border-white/[0.05]">
                                {user?.role === 'admin' ? (
                                    <span>Sent to: <strong className="text-slate-200">{viewingQuery.targetUser?.fullName || viewingQuery.targetUser?.userId || 'Client'}</strong></span>
                                ) : (
                                    <span>Raised by: <strong className="text-slate-200">Admin ({viewingQuery.raisedByAdmin || 'MRS & Co.'})</strong></span>
                                )}
                                {viewingQuery.createdAt && (
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(viewingQuery.createdAt)}</span>
                                )}
                            </div>

                            {/* Admin Status Quick Actions */}
                            {user?.role === 'admin' && (
                                <div className="flex items-center gap-2 pt-2 border-t border-white/[0.05] flex-wrap">
                                    <span className="text-xs text-slate-500 font-medium">Change Status:</span>
                                    <button
                                        type="button"
                                        disabled={updatingQueryStatus || viewingQuery.status === 'RESOLVED'}
                                        onClick={() => handleUpdateQueryStatus('RESOLVED')}
                                        className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 disabled:opacity-40 transition-colors">
                                        Mark Resolved
                                    </button>
                                    <button
                                        type="button"
                                        disabled={updatingQueryStatus || viewingQuery.status === 'CLOSED'}
                                        onClick={() => handleUpdateQueryStatus('CLOSED')}
                                        className="text-xs px-2.5 py-1 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 border border-slate-600 disabled:opacity-40 transition-colors">
                                        Close Query
                                    </button>
                                    {viewingQuery.status !== 'OPEN' && (
                                        <button
                                            type="button"
                                            disabled={updatingQueryStatus}
                                            onClick={() => handleUpdateQueryStatus('OPEN')}
                                            className="text-xs px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 disabled:opacity-40 transition-colors">
                                            Reopen
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Conversation Thread */}
                        <div className="space-y-2">
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Conversation History</p>
                            
                            <div className="space-y-3 p-3.5 bg-black/25 border border-white/[0.08] rounded-xl max-h-72 overflow-y-auto">
                                {/* Initial Query by Admin */}
                                <div className="p-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl">
                                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                                        <span className="font-semibold text-cyan-400">Admin ({viewingQuery.raisedByAdmin || 'MRS & Co.'})</span>
                                        {viewingQuery.createdAt && <span>{formatDate(viewingQuery.createdAt)}</span>}
                                    </div>
                                    <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                                        {viewingQuery.messageText || <span className="italic text-slate-500">No message content attached.</span>}
                                    </p>
                                    {viewingQuery.fileName && (
                                        <div className="mt-2.5 pt-2 border-t border-white/[0.05] flex items-center justify-between">
                                            <span className="text-xs text-amber-400 flex items-center gap-1 truncate"><Paperclip className="w-3.5 h-3.5" />{viewingQuery.fileName}</span>
                                            <Button size="sm" variant="ghost"
                                                onClick={() => handleDownloadQueryAttachment(viewingQuery.id, viewingQuery.fileName)}
                                                disabled={downloadingQueryId === viewingQuery.id}
                                                className="text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 px-2.5 py-1 h-auto flex items-center gap-1">
                                                {downloadingQueryId === viewingQuery.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />} Download
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {/* Loading responses indicator */}
                                {loadingQueryResponses && (
                                    <div className="text-center py-3 text-xs text-slate-400 flex items-center justify-center gap-2">
                                        <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" /> Loading replies...
                                    </div>
                                )}

                                {/* Replies list */}
                                {!loadingQueryResponses && queryResponses.map((r: any) => {
                                    const isClient = r.senderRole === 'CLIENT';
                                    return (
                                        <div
                                            key={r.id}
                                            className={`p-3.5 rounded-xl border ${
                                                isClient
                                                    ? 'bg-blue-600/15 border-blue-500/30 text-white ml-4'
                                                    : 'bg-cyan-600/15 border-cyan-500/30 text-white mr-4'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between text-xs mb-1">
                                                <span className={`font-semibold ${isClient ? 'text-blue-400' : 'text-cyan-400'}`}>
                                                    {isClient
                                                        ? (user?.role === 'admin' ? `Client (${r.senderName || r.senderId})` : 'You')
                                                        : (user?.role === 'admin' ? 'You (Admin)' : `Admin (${r.senderName || 'MRS & Co.'})`)}
                                                </span>
                                                {r.createdAt && <span className="text-slate-400 text-[11px]">{formatDate(r.createdAt)}</span>}
                                            </div>
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-200">{r.message}</p>
                                        </div>
                                    );
                                })}

                                {!loadingQueryResponses && queryResponses.length === 0 && (
                                    <p className="text-center py-2 text-xs text-slate-500 italic">No responses recorded yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Reply Input Box */}
                        <form onSubmit={handleSendQueryReply} className="space-y-3 pt-2">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                    <Send className="w-3.5 h-3.5 text-rose-400" />
                                    {user?.role === 'admin' ? 'Reply as Admin' : 'Write your response'}
                                </label>
                                <span className="text-[11px] text-slate-500">{queryReplyMessage.length} / 5000</span>
                            </div>

                            <textarea
                                rows={3}
                                value={queryReplyMessage}
                                onChange={(e) => setQueryReplyMessage(e.target.value)}
                                placeholder={user?.role === 'admin' ? 'Type admin reply to client...' : 'Write your response to MRS & Co. here...'}
                                disabled={submittingQueryReply}
                                className="w-full p-3 bg-white/[0.04] text-white text-sm border border-white/10 rounded-xl focus:outline-none focus:border-rose-500/50 resize-none transition"
                            />

                            {queryReplySuccess && (
                                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{queryReplySuccess}</span>
                                </div>
                            )}

                            {queryReplyError && (
                                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{queryReplyError}</span>
                                </div>
                            )}

                            <div className="flex justify-between items-center pt-1">
                                <Button type="button" variant="ghost" onClick={() => setViewingQuery(null)} className="text-slate-400 hover:text-white text-xs">
                                    Close
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={submittingQueryReply || !queryReplyMessage.trim()}
                                    className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white text-xs font-semibold shadow-lg shadow-rose-500/20 px-5">
                                    {submittingQueryReply ? (
                                        <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Sending...</>
                                    ) : (
                                        <><Send className="w-3.5 h-3.5 mr-1.5" /> Send Response</>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </Modal>
            )}

            {/* Delete Query Confirmation Modal (admin only) */}
            {queryToDelete && (
                <Modal onClose={() => setQueryToDelete(null)} title={<><AlertCircle className="w-5 h-5 text-red-400" /> Delete Query</>} danger>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        Are you sure you want to permanently delete this query? This action cannot be undone.
                    </p>
                    <div className="flex gap-3 justify-end mt-6">
                        <Button variant="ghost" onClick={() => setQueryToDelete(null)} className="text-slate-400 hover:text-white">Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteQuery} disabled={deletingQuery} className="bg-red-500 hover:bg-red-600 text-white">
                            {deletingQuery ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}Delete Query
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
}

// ─── Shared mini components ────────────────────────────────────────────────────

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
    return (
        <div className={`space-y-1.5 ${className}`}>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</label>
            {children}
        </div>
    );
}

function Alert({ type, msg, onClose }: { type: 'success' | 'error'; msg: string; onClose?: () => void }) {
    const isSuccess = type === 'success';
    return (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-2 p-3 rounded-lg text-sm border ${isSuccess ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
            {isSuccess ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
            <span>{msg}</span>
            {onClose && <button onClick={onClose} className="ml-auto opacity-60 hover:opacity-100"><XCircle className="w-4 h-4" /></button>}
        </motion.div>
    );
}

function EmptyState({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="text-slate-600 mb-3">{icon}</div>
            <p className="text-slate-400 font-medium">{title}</p>
            <p className="text-slate-500 text-sm mt-1">{subtitle}</p>
        </div>
    );
}

function Modal({ children, onClose, title, danger, maxWidth = 'max-w-md' }: { children: React.ReactNode; onClose: () => void; title: React.ReactNode; danger?: boolean; maxWidth?: string }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className={`bg-slate-900 border rounded-2xl p-6 w-full ${maxWidth} ${danger ? 'border-red-500/20' : 'border-white/10'} shadow-2xl my-8`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">{title}</h3>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                        <XCircle className="w-5 h-5" />
                    </button>
                </div>
                {children}
            </motion.div>
        </div>
    );
}