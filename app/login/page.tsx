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
        <div className="min-h-screen relative flex items-center justify-center px-4">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950" />
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ x: [0, 100, 0], y: [0, -30, 0], opacity: [0.15, 0.3, 0.15] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-20 right-[10%] w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ x: [0, -80, 0], y: [0, 20, 0], opacity: [0.1, 0.25, 0.1] }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
                    className="absolute bottom-20 left-[10%] w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ y: [0, -20, 0], rotate: [12, 15, 12] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-24 right-[15%] w-32 h-44 bg-white/[0.03] border border-white/[0.06] rounded-sm"
                />
                <motion.div
                    animate={{ x: [-10, 10, -10] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute bottom-40 left-[5%] w-64 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
                />
            </div>

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Back link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <img
                            src="https://education21.in/wp-content/uploads/2023/12/CA-India-Logo-1024x762.png"
                            alt="CA Logo"
                            className="w-12 h-12 object-contain brightness-0 invert"
                        />
                        <div>
                            <div className="text-xl font-bold text-white">MRS & Co.</div>
                            <div className="text-xs text-cyan-400 font-semibold tracking-wide">Chartered Accountants</div>
                        </div>
                    </div>
                    <h1 className="text-2xl font-semibold text-white">Welcome Back</h1>
                    <p className="text-slate-400 mt-1 text-sm">Sign in to access your dashboard</p>
                </div>

                {/* Login Card */}
                <Card className="border-white/[0.08] bg-white/[0.04] backdrop-blur-xl shadow-2xl">
                    <CardContent className="p-6">
                        {/* Tabs */}
                        <div className="flex rounded-xl bg-white/[0.05] p-1 mb-6">
                            <button
                                onClick={() => { setActiveTab('user'); setError(''); setSuccess(''); }}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300
                  ${activeTab === 'user'
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                                        : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                <User className="w-4 h-4" />
                                Client
                            </button>
                            <button
                                onClick={() => { setActiveTab('admin'); setError(''); setSuccess(''); }}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300
                  ${activeTab === 'admin'
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                                        : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                <Shield className="w-4 h-4" />
                                Admin
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1.5 block">
                                    {activeTab === 'user' ? 'User ID' : 'Username'}
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <Input
                                        type="text"
                                        placeholder={activeTab === 'user' ? 'Enter your User ID' : 'Enter admin username'}
                                        value={userId}
                                        onChange={(e) => setUserId(e.target.value)}
                                        required
                                        className="pl-10 bg-white/[0.06] border-white/[0.1] text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20 h-11"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1.5 block">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="pl-10 pr-10 bg-white/[0.06] border-white/[0.1] text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20 h-11"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                                >
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    {error}
                                </motion.div>
                            )}

                            {/* Success */}
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm"
                                >
                                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                                    {success}
                                </motion.div>
                            )}

                            {/* Submit */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-11 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02]"
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

                        {/* Footer info */}
                        <div className="mt-6 pt-4 border-t border-white/[0.06] text-center">
                            <p className="text-xs text-slate-500">
                                Credentials provided by MRS & Co. administration.
                                <br />
                                Contact{' '}
                                <a href="mailto:camrsandco@gmail.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                                    camrsandco@gmail.com
                                </a>{' '}
                                for access.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
