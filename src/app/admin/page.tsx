'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Admin() {
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('adminAuth');
    if (isAuthenticated) {
      router.push('/admin/dashboard');
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[var(--border-light)] border-t-[var(--text-primary)] rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[var(--text-tertiary)]">Redirecting...</p>
      </div>
    </div>
  );
}