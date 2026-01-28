'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

type Step = 'email' | 'code' | 'password';

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Request reset code
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Une erreur est survenue');
      }

      setStep('code');
    } catch (err) {
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Impossible de se connecter au serveur. Vérifiez que l\'API est démarrée.');
      } else {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify code (just validate format, actual verification happens on password submit)
  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      setError('Le code doit contenir exactement 6 chiffres');
      return;
    }

    setStep('password');
  };

  // Step 3: Reset password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      const response = await api('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, code, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Une erreur est survenue');
      }

      // Success - redirect to login
      setTimeout(() => {
        router.push('/login?reset=success');
      }, 2000);
    } catch (err) {
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Impossible de se connecter au serveur. Vérifiez que l\'API est démarrée.');
      } else {
        setError(err instanceof Error ? err.message : 'Code invalide ou expiré');
      }
      // Go back to code step if error
      setStep('code');
      setCode('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        {/* Step 1: Enter Email */}
        {step === 'email' && (
          <>
            <h1 className="text-2xl font-bold mb-2 text-center">
              Mot de passe oublié
            </h1>
            <p className="text-gray-600 text-center mb-6">
              Entrez votre adresse email pour recevoir un code de vérification.
            </p>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleRequestCode} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="email@example.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {loading ? 'Envoi en cours...' : 'Envoyer le code'}
              </button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-blue-500 hover:text-blue-600 text-sm"
                >
                  Retour à la connexion
                </Link>
              </div>
            </form>
          </>
        )}

        {/* Step 2: Enter Code */}
        {step === 'code' && (
          <>
            <h1 className="text-2xl font-bold mb-2 text-center">
              Code de vérification
            </h1>
            <p className="text-gray-600 text-center mb-2">
              Un code à 6 chiffres a été envoyé à <strong>{email}</strong>
            </p>
            <p className="text-sm text-blue-600 text-center mb-6">
              <a href="http://localhost:8025" target="_blank" rel="noopener noreferrer" className="underline">
                Consultez Mailhog (dev)
              </a>
            </p>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Code de vérification</label>
                <input
                  type="text"
                  name="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-3 py-2 border rounded text-center text-2xl tracking-widest font-mono"
                  placeholder="000000"
                  maxLength={6}
                  autoFocus
                  required
                />
                <p className="text-xs text-gray-500 mt-1 text-center">Entrez le code à 6 chiffres</p>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Vérifier le code
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="text-gray-500 hover:text-gray-600 text-sm"
                >
                  ← Changer d'email
                </button>
              </div>
            </form>
          </>
        )}

        {/* Step 3: Enter New Password */}
        {step === 'password' && (
          <>
            <h1 className="text-2xl font-bold mb-2 text-center">
              Nouveau mot de passe
            </h1>
            <p className="text-gray-600 text-center mb-6">
              Choisissez un nouveau mot de passe pour <strong>{email}</strong>
            </p>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nouveau mot de passe</label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="••••••••"
                  minLength={6}
                  autoFocus
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 6 caractères</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Confirmer le mot de passe</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => { setStep('code'); setPassword(''); setConfirmPassword(''); }}
                  className="text-gray-500 hover:text-gray-600 text-sm"
                >
                  ← Retour au code
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
