'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SuccessPage() {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const confirmPayment = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) return;

            try {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/payment/confirm-mock-payment`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
            } catch (error) {
                console.error('Failed to confirm mock payment:', error);
            } finally {
                setLoading(false);
            }
        };

        confirmPayment();
    }, []);

    return (
        <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                    Paiement réussi !
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    {loading ? 'Finalisation de votre abonnement...' : 'Merci pour votre achat. Vous êtes maintenant membre Premium.'}
                </p>
                <div className="mt-6">
                    <Link
                        href="/workspaces"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Retour au tableau de bord
                    </Link>
                </div>
            </div>
        </div>
    );
}
