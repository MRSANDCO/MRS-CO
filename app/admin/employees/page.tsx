'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { AdminEmployeeManagement } from '@/components/dashboard/AdminEmployeeManagement';
import { AmbientParticleCanvas } from '@/components/dashboard/AmbientParticleCanvas';
import Link from 'next/link';
import { LayoutDashboard, ArrowLeft, Shield, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminEmployeesPage() {
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        if (user?.role === 'employee') {
            router.push('/employee/dashboard');
            return;
        }
        if (user?.role === 'user') {
            router.push('/dashboard');
            return;
        }
    }, [isAuthenticated, user, router]);

    if (!user || user.role !== 'admin') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-slate-100 relative overflow-x-hidden selection:bg-blue-500/30">
            <AmbientParticleCanvas />

            {/* Ambient glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[15%] w-[600px] h-[600px] bg-blue-600/[0.07] rounded-full blur-[140px]" />
                <div className="absolute bottom-[-10%] left-[5%] w-[500px] h-[500px] bg-indigo-600/[0.06] rounded-full blur-[130px]" />
            </div>

            {/* Header */}
            <header className="relative z-20 border-b border-white/[0.08] bg-slate-950/70 backdrop-blur-xl sticky top-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard" className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 hover:text-white transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Admin Dashboard</span>
                        </Link>
                    </div>

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
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <AdminEmployeeManagement />
            </main>
        </div>
    );
}
