// 'use client';

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent } from '@/components/ui/card';
// import { useAuth } from '@/lib/auth-context';
// import { loginUser, loginAdmin } from '@/lib/api';
// import {
//     Shield,
//     User,
//     Lock,
//     ArrowLeft,
//     AlertCircle,
//     CheckCircle,
//     Loader2,
//     Eye,
//     EyeOff,
// } from 'lucide-react';
// import Link from 'next/link';

// type TabType = 'user' | 'admin';

// export default function LoginPage() {
//     const router = useRouter();
//     const { login } = useAuth();

//     const [activeTab, setActiveTab] = useState<TabType>('user');
//     const [userId, setUserId] = useState('');
//     const [password, setPassword] = useState('');
//     const [showPassword, setShowPassword] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setError('');
//         setSuccess('');
//         setLoading(true);

//         try {
//             if (activeTab === 'user') {
//                 const res = await loginUser(userId, password);
//                 login({ userId: res.userId || userId, fullName: res.fullName || '', role: 'user', token: res.token });
//                 setSuccess('Login successful! Redirecting...');
//                 setTimeout(() => router.push('/dashboard'), 800);
//             } else {
//                 const res = await loginAdmin(userId, password);
//                 login({ userId, fullName: 'Administrator', role: 'admin', token: res.token });
//                 setSuccess('Admin login successful! Redirecting...');
//                 setTimeout(() => router.push('/dashboard'), 800);
//             }
//         } catch (err: unknown) {
//             setError(err instanceof Error ? err.message : 'Login failed');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen relative flex items-center justify-center px-4">
//             {/* Background */}
//             <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950" />
//             <div className="absolute inset-0 overflow-hidden pointer-events-none">
//                 <motion.div
//                     animate={{ x: [0, 100, 0], y: [0, -30, 0], opacity: [0.15, 0.3, 0.15] }}
//                     transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
//                     className="absolute top-20 right-[10%] w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
//                 />
//                 <motion.div
//                     animate={{ x: [0, -80, 0], y: [0, 20, 0], opacity: [0.1, 0.25, 0.1] }}
//                     transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
//                     className="absolute bottom-20 left-[10%] w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl"
//                 />
//                 <motion.div
//                     animate={{ y: [0, -20, 0], rotate: [12, 15, 12] }}
//                     transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
//                     className="absolute top-24 right-[15%] w-32 h-44 bg-white/[0.03] border border-white/[0.06] rounded-sm"
//                 />
//                 <motion.div
//                     animate={{ x: [-10, 10, -10] }}
//                     transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
//                     className="absolute bottom-40 left-[5%] w-64 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
//                 />
//             </div>

//             {/* Content */}
//             <motion.div
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6 }}
//                 className="relative z-10 w-full max-w-md"
//             >
//                 {/* Back link */}
//                 <Link
//                     href="/"
//                     className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm"
//                 >
//                     <ArrowLeft className="w-4 h-4" />
//                     Back to Home
//                 </Link>

//                 {/* Logo */}
//                 <div className="text-center mb-8">
//                     <div className="inline-flex items-center gap-3 mb-4">
//                          <img
//                       src="https://education21.in/wp-content/uploads/2023/12/CA-India-Logo-1024x762.png"
//                       alt="CA India Logo"
//                       className="w-12 h-12 object-contain"
//                     />
//                         <div>
//                             <div className="text-xl font-bold text-white">MRS & Co.</div>
//                             <div className="text-xs text-cyan-400 font-semibold tracking-wide">Chartered Accountants</div>
//                         </div>
//                     </div>
                     
//                     <h1 className="text-2xl font-semibold text-white">Welcome Back</h1>
//                     <p className="text-slate-400 mt-1 text-sm">Sign in to access your dashboard</p>
//                 </div>

//                 {/* Login Card */}
//                 <Card className="border-white/[0.08] bg-white/[0.04] backdrop-blur-xl shadow-2xl">
//                     <CardContent className="p-6">
//                         {/* Tabs */}
//                         <div className="flex rounded-xl bg-white/[0.05] p-1 mb-6">
//                             <button
//                                 onClick={() => { setActiveTab('user'); setError(''); setSuccess(''); }}
//                                 className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300
//                   ${activeTab === 'user'
//                                         ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
//                                         : 'text-slate-400 hover:text-white'
//                                     }`}
//                             >
//                                 <User className="w-4 h-4" />
//                                 Client
//                             </button>
//                             <button
//                                 onClick={() => { setActiveTab('admin'); setError(''); setSuccess(''); }}
//                                 className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300
//                   ${activeTab === 'admin'
//                                         ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
//                                         : 'text-slate-400 hover:text-white'
//                                     }`}
//                             >
//                                 <Shield className="w-4 h-4" />
//                                 Admin
//                             </button>
//                         </div>

//                         {/* Form */}
//                         <form onSubmit={handleSubmit} className="space-y-4">
//                             <div>
//                                 <label className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1.5 block">
//                                     {activeTab === 'user' ? 'User ID' : 'Username'}
//                                 </label>
//                                 <div className="relative">
//                                     <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
//                                     <Input
//                                         type="text"
//                                         placeholder={activeTab === 'user' ? 'Enter your User ID' : 'Enter admin username'}
//                                         value={userId}
//                                         onChange={(e) => setUserId(e.target.value)}
//                                         required
//                                         className="pl-10 bg-white/[0.06] border-white/[0.1] text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20 h-11"
//                                     />
//                                 </div>
//                             </div>

//                             <div>
//                                 <label className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1.5 block">
//                                     Password
//                                 </label>
//                                 <div className="relative">
//                                     <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
//                                     <Input
//                                         type={showPassword ? 'text' : 'password'}
//                                         placeholder="Enter your password"
//                                         value={password}
//                                         onChange={(e) => setPassword(e.target.value)}
//                                         required
//                                         className="pl-10 pr-10 bg-white/[0.06] border-white/[0.1] text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20 h-11"
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => setShowPassword(!showPassword)}
//                                         className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
//                                     >
//                                         {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* Error */}
//                             {error && (
//                                 <motion.div
//                                     initial={{ opacity: 0, y: -5 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
//                                 >
//                                     <AlertCircle className="w-4 h-4 flex-shrink-0" />
//                                     {error}
//                                 </motion.div>
//                             )}

//                             {/* Success */}
//                             {success && (
//                                 <motion.div
//                                     initial={{ opacity: 0, y: -5 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm"
//                                 >
//                                     <CheckCircle className="w-4 h-4 flex-shrink-0" />
//                                     {success}
//                                 </motion.div>
//                             )}

//                             {/* Submit */}
//                             <Button
//                                 type="submit"
//                                 disabled={loading}
//                                 className="w-full h-11 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02]"
//                             >
//                                 {loading ? (
//                                     <span className="flex items-center gap-2">
//                                         <Loader2 className="w-4 h-4 animate-spin" />
//                                         Signing in...
//                                     </span>
//                                 ) : (
//                                     `Sign in as ${activeTab === 'user' ? 'Client' : 'Admin'}`
//                                 )}
//                             </Button>
//                         </form>

//                         {/* Footer info */}
//                         <div className="mt-6 pt-4 border-t border-white/[0.06] text-center">
//                             <p className="text-xs text-slate-500">
//                                 Credentials provided by MRS & Co. administration.
//                                 <br />
//                                 Contact{' '}
//                                 <a href="mailto:camrsandco@gmail.com" className="text-blue-400 hover:text-blue-300 transition-colors">
//                                     camrsandco@gmail.com
//                                 </a>{' '}
//                                 for access.
//                             </p>
//                         </div>
//                     </CardContent>
//                 </Card>
//             </motion.div>
//         </div>
//     );
// }
 
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { loginUser, loginAdmin } from '@/lib/api';
import {
    Shield,
    User,
    Lock,
    ArrowLeft,
    AlertCircle,
    CheckCircle,
    Loader2,
    Eye,
    EyeOff,
} from 'lucide-react';
import Link from 'next/link';

type TabType = 'user' | 'admin';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();

    const [activeTab, setActiveTab] = useState<TabType>('user');
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            if (activeTab === 'user') {
                const res = await loginUser(userId, password);
                login({ userId: res.userId || userId, fullName: res.fullName || '', role: 'user', token: res.token });
                setSuccess('Login successful! Redirecting...');
                setTimeout(() => router.push('/dashboard'), 800);
            } else {
                const res = await loginAdmin(userId, password);
                login({ userId, fullName: 'Administrator', role: 'admin', token: res.token });
                setSuccess('Admin login successful! Redirecting...');
                setTimeout(() => router.push('/dashboard'), 800);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden">

            {/* ── Rich multi-layer background ── */}
            <div className="absolute inset-0 bg-[#060c18]" />

            {/* Radial glow – top right */}
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(56,107,235,0.18) 0%, transparent 70%)' }} />

            {/* Radial glow – bottom left */}
            <div className="absolute -bottom-40 -left-20 w-[500px] h-[500px] rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(99,67,220,0.14) 0%, transparent 70%)' }} />

            {/* Subtle grid overlay */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px'
                }} />

            {/* Animated orbs */}
            <motion.div
                animate={{ x: [0, 80, 0], y: [0, -40, 0], opacity: [0.12, 0.22, 0.12] }}
                transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-[15%] right-[12%] w-80 h-80 rounded-full blur-3xl pointer-events-none"
                style={{ background: 'rgba(59,130,246,0.25)' }}
            />
            <motion.div
                animate={{ x: [0, -60, 0], y: [0, 30, 0], opacity: [0.08, 0.18, 0.08] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
                className="absolute bottom-[10%] left-[8%] w-96 h-96 rounded-full blur-3xl pointer-events-none"
                style={{ background: 'rgba(99,67,220,0.2)' }}
            />

            {/* Floating decorative card silhouette */}
            <motion.div
                animate={{ y: [0, -14, 0], rotate: [12, 14, 12] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-[18%] right-[14%] w-28 h-40 rounded-md pointer-events-none"
                style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                }}
            />
            {/* Horizontal accent line */}
            <motion.div
                animate={{ x: [-12, 12, -12] }}
                transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-[28%] left-[4%] w-56 h-px pointer-events-none"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(99,210,255,0.35), transparent)' }}
            />

            {/* ── Main card ── */}
            <motion.div
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-full max-w-[420px]"
            >
                {/* Back link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-200 transition-colors mb-8 text-sm tracking-wide"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                {/* Logo / brand */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: -10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-col items-center mb-5"
                    >
                        {/* Outer glow halo */}
                        <div className="relative mb-4">
                            {/* Pulsing outer ring */}
                            <motion.div
                                animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.55, 0.3] }}
                                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute inset-0 rounded-full"
                                style={{
                                    background: 'radial-gradient(circle, rgba(59,130,246,0.55) 0%, transparent 70%)',
                                    margin: '-18px',
                                }}
                            />
                            {/* Static outer ring border */}
                            <div
                                className="absolute inset-0 rounded-full"
                                style={{
                                    margin: '-7px',
                                    border: '1px solid rgba(99,160,255,0.2)',
                                    boxShadow: '0 0 18px rgba(59,130,246,0.18)',
                                }}
                            />
                            {/* Logo container */}
                            <div
                                className="relative w-20 h-20 rounded-full flex items-center justify-center"
                                style={{
                                    background: 'linear-gradient(150deg, #ffffff 0%, #e8f0ff 100%)',
                                    border: '2px solid rgba(255,255,255,0.9)',
                                    boxShadow: [
                                        '0 0 0 1px rgba(59,130,246,0.35)',
                                        '0 8px 32px rgba(59,130,246,0.45)',
                                        '0 2px 12px rgba(0,0,0,0.6)',
                                        'inset 0 1px 0 rgba(255,255,255,1)',
                                    ].join(', '),
                                }}
                            >
                                <img
                                    src="https://education21.in/wp-content/uploads/2023/12/CA-India-Logo-1024x762.png"
                                    alt="CA India Logo"
                                    className="w-12 h-12 object-contain"
                                    style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.15))' }}
                                />
                            </div>
                        </div>
 
                        {/* Brand name */}
                        <div
                            className="text-2xl font-bold text-white mb-1"
                            style={{
                                fontFamily: 'Georgia, serif',
                                letterSpacing: '0.04em',
                                textShadow: '0 2px 16px rgba(59,130,246,0.4), 0 1px 3px rgba(0,0,0,0.5)',
                            }}
                        >
                            MRS & Co.
                        </div>
                        <div
                            className="text-[10px] font-bold tracking-[0.28em] uppercase"
                            style={{
                                color: 'transparent',
                                background: 'linear-gradient(90deg, #60a5fa, #a5c8ff, #60a5fa)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                backgroundSize: '200% 100%',
                            }}
                        >
                            Chartered Accountants
                        </div>
                    </motion.div>
 
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.45 }}
                    >
                        {/* Thin decorative rule */}
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="h-px w-10 opacity-20" style={{ background: 'linear-gradient(90deg, transparent, #60c8ff)' }} />
                            <div className="w-1 h-1 rounded-full opacity-40" style={{ background: '#60c8ff' }} />
                            <div className="h-px w-10 opacity-20" style={{ background: 'linear-gradient(90deg, #60c8ff, transparent)' }} />
                        </div>
                        <h1 className="text-2xl font-semibold text-white mb-1" style={{ letterSpacing: '-0.01em' }}>Welcome Back</h1>
                        <p className="text-sm text-slate-500">Sign in to access your dashboard</p>
                    </motion.div>
                </div>

                {/* Card */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <Card
                        className="border-0 shadow-2xl overflow-hidden"
                        style={{
                            background: 'linear-gradient(160deg, rgba(255,255,255,0.065) 0%, rgba(255,255,255,0.03) 100%)',
                            backdropFilter: 'blur(24px)',
                            border: '1px solid rgba(255,255,255,0.09)',
                            boxShadow: '0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.08)'
                        }}
                    >
                        {/* Top edge shimmer */}
                        <div className="h-px w-full"
                            style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.15) 40%, rgba(99,210,255,0.2) 60%, transparent 95%)' }} />

                        <CardContent className="p-7">

                            {/* Tabs */}
                            <div className="flex rounded-xl p-1 mb-7"
                                style={{
                                    background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid rgba(255,255,255,0.06)'
                                }}>
                                {(['user', 'admin'] as TabType[]).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => { setActiveTab(tab); setError(''); setSuccess(''); }}
                                        className="flex-1 relative flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300"
                                        style={{
                                            color: activeTab === tab ? '#ffffff' : 'rgba(148,163,184,0.7)',
                                        }}
                                    >
                                        {activeTab === tab && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 rounded-lg"
                                                style={{
                                                    background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                                                    boxShadow: '0 4px 16px rgba(59,130,246,0.4), inset 0 1px 0 rgba(255,255,255,0.15)'
                                                }}
                                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                            />
                                        )}
                                        <span className="relative z-10 flex items-center gap-2">
                                            {tab === 'user' ? <User className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                                            {tab === 'user' ? 'Client' : 'Admin'}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* User ID / Username */}
                                <div>
                                    <label className="block text-[10px] font-semibold uppercase tracking-[0.14em] mb-2"
                                        style={{ color: 'rgba(148,163,184,0.7)' }}>
                                        {activeTab === 'user' ? 'User ID' : 'Username'}
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
                                            style={{ color: 'rgba(100,116,139,0.8)' }} />
                                        <Input
                                            type="text"
                                            placeholder={activeTab === 'user' ? 'Enter your User ID' : 'Enter admin username'}
                                            value={userId}
                                            onChange={(e) => setUserId(e.target.value)}
                                            required
                                            className="pl-10 h-11 text-sm text-white placeholder:text-slate-600 rounded-xl transition-all duration-200"
                                            style={{
                                                background: 'rgba(0,0,0,0.35)',
                                                border: '1px solid rgba(255,255,255,0.09)',
                                                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.border = '1px solid rgba(59,130,246,0.5)';
                                                e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2), 0 0 0 3px rgba(59,130,246,0.1)';
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.border = '1px solid rgba(255,255,255,0.09)';
                                                e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)';
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-[10px] font-semibold uppercase tracking-[0.14em] mb-2"
                                        style={{ color: 'rgba(148,163,184,0.7)' }}>
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
                                            style={{ color: 'rgba(100,116,139,0.8)' }} />
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="pl-10 pr-11 h-11 text-sm text-white placeholder:text-slate-600 rounded-xl transition-all duration-200"
                                            style={{
                                                background: 'rgba(0,0,0,0.35)',
                                                border: '1px solid rgba(255,255,255,0.09)',
                                                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.border = '1px solid rgba(59,130,246,0.5)';
                                                e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2), 0 0 0 3px rgba(59,130,246,0.1)';
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.border = '1px solid rgba(255,255,255,0.09)';
                                                e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)';
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-150"
                                            style={{ color: 'rgba(100,116,139,0.8)' }}
                                            onMouseEnter={(e) => (e.currentTarget.style.color = '#94a3b8')}
                                            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(100,116,139,0.8)')}
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Error */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className="flex items-center gap-2.5 p-3.5 rounded-xl text-sm"
                                        style={{
                                            background: 'rgba(239,68,68,0.08)',
                                            border: '1px solid rgba(239,68,68,0.2)',
                                            color: '#fca5a5'
                                        }}
                                    >
                                        <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                                        {error}
                                    </motion.div>
                                )}

                                {/* Success */}
                                {success && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className="flex items-center gap-2.5 p-3.5 rounded-xl text-sm"
                                        style={{
                                            background: 'rgba(16,185,129,0.08)',
                                            border: '1px solid rgba(16,185,129,0.2)',
                                            color: '#6ee7b7'
                                        }}
                                    >
                                        <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                                        {success}
                                    </motion.div>
                                )}

                                {/* Submit button */}
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-11 text-white font-semibold rounded-xl text-sm tracking-wide transition-all duration-300 hover:scale-[1.015] active:scale-[0.985] disabled:opacity-60 disabled:scale-100 mt-1"
                                    style={{
                                        background: 'linear-gradient(135deg, #1d4ed8 0%, #4338ca 50%, #1d4ed8 100%)',
                                        backgroundSize: '200% 100%',
                                        boxShadow: '0 4px 20px rgba(59,130,246,0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
                                        border: '1px solid rgba(99,130,255,0.3)',
                                        letterSpacing: '0.03em'
                                    }}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 28px rgba(59,130,246,0.5), inset 0 1px 0 rgba(255,255,255,0.18)';
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(59,130,246,0.35), inset 0 1px 0 rgba(255,255,255,0.15)';
                                    }}
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Signing in...
                                        </span>
                                    ) : (
                                        `Sign in as ${activeTab === 'user' ? 'Client' : 'Admin'}`
                                    )}
                                </Button>
                            </form>

                            {/* Footer */}
                            <div className="mt-6 pt-5 text-center"
                                style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <p className="text-xs leading-relaxed" style={{ color: 'rgba(100,116,139,0.75)' }}>
                                    Credentials provided by MRS & Co. administration.
                                    <br />
                                    Contact{' '}
                                    <a
                                        href="mailto:camrsandco@gmail.com"
                                        className="transition-colors duration-150"
                                        style={{ color: '#60a5fa' }}
                                        onMouseEnter={(e) => (e.currentTarget.style.color = '#93c5fd')}
                                        onMouseLeave={(e) => (e.currentTarget.style.color = '#60a5fa')}
                                    >
                                        camrsandco@gmail.com
                                    </a>{' '}
                                    for access.
                                </p>
                            </div>
                        </CardContent>

                        {/* Bottom edge shimmer */}
                        <div className="h-px w-full"
                            style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(99,130,255,0.1) 50%, transparent 90%)' }} />
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    );
}