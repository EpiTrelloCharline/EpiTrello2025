'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate processing
        setTimeout(() => {
            router.push(`/premium/success?session_id=${sessionId || 'mock_id'}`);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Payment Form */}
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors text-sm font-medium"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Retour
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Paiement</h2>

                    <div className="flex gap-4 mb-8">
                        <button
                            type="button"
                            onClick={() => setPaymentMethod('card')}
                            className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${paymentMethod === 'card'
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            Carte
                        </button>
                        <button
                            type="button"
                            onClick={() => setPaymentMethod('paypal')}
                            className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${paymentMethod === 'paypal'
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                }`}
                        >
                            <span className="font-bold italic text-blue-800">PayPal</span>
                        </button>
                    </div>

                    <form onSubmit={handlePayment} className="space-y-4">
                        {paymentMethod === 'card' ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom sur la carte</label>
                                    <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Jean Dupont" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de carte</label>
                                    <div className="relative">
                                        <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="0000 0000 0000 0000" />
                                        <div className="absolute right-3 top-2.5 flex gap-1">
                                            <div className="w-8 h-5 bg-gray-200 rounded"></div>
                                            <div className="w-8 h-5 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiration</label>
                                        <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="MM / AA" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                                        <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="123" />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-center py-12">
                                <p className="text-blue-800 mb-4">Vous allez être redirigé vers PayPal pour finaliser votre paiement en toute sécurité.</p>
                                <span className="text-3xl font-bold italic text-blue-800">PayPal</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full mt-6 bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : `Payer 10,00€`}
                        </button>
                    </form>

                    <p className="mt-4 text-xs text-indigo-600 text-center font-semibold">
                        Mode Simulation : Cliquez sur "Payer" pour activer immédiatement vos avantages Premium.
                    </p>
                </div>

                {/* Summary */}
                <div className="bg-indigo-900 text-white p-8 rounded-xl shadow-lg flex flex-col">
                    <h2 className="text-2xl font-bold mb-8">Récapitulatif</h2>

                    <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-center pb-4 border-b border-indigo-800">
                            <div>
                                <p className="font-semibold">EpiTrello Premium</p>
                                <p className="text-sm text-indigo-300">Paiement unique</p>
                            </div>
                            <p className="font-bold text-xl">10€</p>
                        </div>

                        <div className="space-y-3 pt-4">
                            <div className="flex items-center gap-3 text-indigo-200">
                                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Tableaux illimités
                            </div>
                            <div className="flex items-center gap-3 text-indigo-200">
                                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Custom backgrounds
                            </div>
                            <div className="flex items-center gap-3 text-indigo-200">
                                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Support Premium
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-indigo-800">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-xl">Total</span>
                            <span className="text-3xl font-bold">10,00€</span>
                        </div>
                        <div className="flex items-center justify-center gap-4 grayscale opacity-50">
                            <div className="h-8 w-12 bg-white rounded"></div>
                            <div className="h-8 w-12 bg-white rounded"></div>
                            <div className="h-8 w-12 bg-white rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
