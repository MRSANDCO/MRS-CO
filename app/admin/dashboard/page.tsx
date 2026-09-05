'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import DashboardPage from '../../dashboard/page';

export default function AdminDashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();

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

    return <DashboardPage />;
}
