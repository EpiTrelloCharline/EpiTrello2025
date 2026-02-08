'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Link from 'next/link';

// Make sure to add this env variable
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function PremiumPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCheckout = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                // Rediriger vers login si non connecté
                window.location.href = '/login';
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/payment/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || 'Erreur lors de la création de la session de paiement. Vérifiez que le backend tourne.');
            }

            const data = await response.json() as { url: string };
            const { url } = data;

            if (url) {
                window.location.href = url;
            } else {
                throw new Error("L'URL de redirection Stripe est manquante.");
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Une erreur est survenue.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl transform transition-all hover:scale-105 duration-300">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                        Devenez Premium
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Débloquez tout le potentiel d'EpiTrello
                    </p>
                </div>

                <div className="mt-8 space-y-6">
                    <div className="rounded-md bg-purple-50 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-purple-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-purple-800">
                                    Avantages exclusifs
                                </h3>
                                <div className="mt-2 text-sm text-purple-700">
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Nombre illimité de tableaux</li>
                                        <li>Arrière-plans personnalisés</li>
                                        <li>Support prioritaire</li>
                                        <li>Badge Premium exclusif</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center">
                        <span className="text-5xl font-extrabold text-gray-900">10€</span>
                        <span className="ml-2 text-xl font-medium text-gray-500">/ unique</span>
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleCheckout}
                        disabled={loading}
                        className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-lg ${loading ? 'opacity-75 cursor-wait' : ''
                            }`}
                    >
                        {loading ? (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : null}
                        {loading ? 'Redirection vers Stripe...' : 'Obtenir Premium maintenant'}
                    </button>

                    <div className="text-center mt-4">
                        <Link href="/workspaces" className="text-sm text-gray-500 hover:text-gray-900 underline">
                            Retour aux espaces de travail
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
