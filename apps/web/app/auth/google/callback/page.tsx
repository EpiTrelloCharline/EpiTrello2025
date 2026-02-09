'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // Stock the token in localStorage
      localStorage.setItem('accessToken', token);

      // Redirect to workspaces
      setTimeout(() => {
        router.push('/workspaces');
      }, 500);
    } else {
      setError('Authentification échouée. Aucun token reçu.');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">✗</div>
            <h1 className="text-xl font-bold mb-2">Erreur d&apos;authentification</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Redirection vers la page de connexion...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h1 className="text-xl font-bold mb-2">Authentification en cours...</h1>
          <p className="text-gray-600">Veuillez patienter</p>
        </div>
      </div>
    </div>
  );
}
