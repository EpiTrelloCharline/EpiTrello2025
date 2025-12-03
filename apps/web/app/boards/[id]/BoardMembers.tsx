'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

type Member = {
  id: string;
  userId: string;
  role: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
};

type Board = {
  id: string;
  workspaceId: string;
};

interface BoardMembersProps {
  board: Board | null;
  members: Member[];
  onMemberAdded: () => void;
}

export function BoardMembers({ board, members, onMemberAdded }: BoardMembersProps) {
  const [isInviting, setIsInviting] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return name[0].toUpperCase();
    }
    return email[0].toUpperCase();
  };

  const getAvatarColor = (userId: string) => {
    // Générer une couleur consistante basée sur l'ID
    const colors = [
      '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7',
      '#a29bfe', '#fd79a8', '#fdcb6e', '#e17055', '#74b9ff',
      '#00b894', '#55efc4', '#81ecec', '#fab1a0', '#dfe6e9'
    ];
    const index = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!email.trim()) {
      setError('Veuillez entrer une adresse email');
      setLoading(false);
      return;
    }

    if (!board?.workspaceId) {
      setError('Impossible de trouver l\'identifiant du workspace');
      setLoading(false);
      return;
    }

    try {
      const response = await api(`/workspaces/${board.workspaceId}/invite`, {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim(),
          role: 'MEMBER'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Une erreur est survenue' }));
        throw new Error(errorData.message || 'Échec de l\'invitation');
      }

      setSuccess('Membre invité avec succès!');
      setEmail('');
      setIsInviting(false);

      // Rafraîchir la liste des membres
      setTimeout(() => {
        onMemberAdded();
        setSuccess('');
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';

      // Messages d'erreur plus conviviaux
      if (errorMessage.includes('not found') || errorMessage.includes('User not found')) {
        setError('Utilisateur non trouvé. Cet email n\'existe pas dans le système.');
      } else if (errorMessage.includes('already')) {
        setError('Cet utilisateur est déjà membre du workspace.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Liste des membres */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium opacity-90">Membres:</span>
        <div className="flex -space-x-2 overflow-hidden">
          {members.slice(0, 5).map((member) => (
            <div
              key={member.id}
              className="relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm transition-transform hover:z-10 hover:scale-110"
              style={{ backgroundColor: getAvatarColor(member.userId) }}
              title={`${member.user.name || member.user.email} (${member.role})`}
            >
              {getInitials(member.user.name, member.user.email)}
            </div>
          ))}
          {members.length > 5 && (
            <div
              className="relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white bg-gray-400 text-white shadow-sm"
              title={`+${members.length - 5} autres membres`}
            >
              +{members.length - 5}
            </div>
          )}
        </div>
      </div>

      {/* Bouton Invite */}
      <div className="relative">
        {!isInviting ? (
          <button
            onClick={() => setIsInviting(true)}
            className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded text-sm font-medium transition-all flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Inviter
          </button>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-3 min-w-[280px] absolute right-0 top-0 z-50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-800 text-sm">Inviter un membre</h3>
              <button
                onClick={() => {
                  setIsInviting(false);
                  setError('');
                  setEmail('');
                  setSuccess('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-2">
              <div>
                <input
                  type="email"
                  placeholder="Email du membre"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}

              {success && (
                <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                  {success}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Invitation...' : 'Inviter'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsInviting(false);
                    setError('');
                    setEmail('');
                    setSuccess('');
                  }}
                  disabled={loading}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>

            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                💡 L&apos;utilisateur doit déjà avoir un compte pour être invité.
              </p>
            </div>
          </div>
        )}

        {/* Click outside overlay */}
        {isInviting && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setIsInviting(false);
              setError('');
              setEmail('');
              setSuccess('');
            }}
          />
        )}
      </div>
    </div>
  );
}
