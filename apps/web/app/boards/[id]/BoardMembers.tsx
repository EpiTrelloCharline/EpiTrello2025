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
  const [showMembersList, setShowMembersList] = useState(false);
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
    // Generate a consistent color based on the user ID
    const colors = [
      '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7',
      '#a29bfe', '#fd79a8', '#fdcb6e', '#e17055', '#74b9ff',
      '#00b894', '#55efc4', '#81ecec', '#fab1a0', '#dfe6e9'
    ];
    const index = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const getRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
      'ADMIN': 'Administrateur',
      'MEMBER': 'Membre',
      'VIEWER': 'Observateur'
    };
    return roleMap[role] || role;
  };

  const getRoleBadgeColor = (role: string) => {
    const colorMap: Record<string, string> = {
      'ADMIN': 'bg-purple-100 text-purple-700',
      'MEMBER': 'bg-blue-100 text-blue-700',
      'VIEWER': 'bg-gray-100 text-gray-700'
    };
    return colorMap[role] || 'bg-gray-100 text-gray-700';
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
      
      // Reload members after a short delay to show success message
      setTimeout(() => {
        onMemberAdded();
        setSuccess('');
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      
      // Error messages 
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
    <div className="flex items-center gap-3">
      {/* Members avatars */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium opacity-90">Membres:</span>
        <div className="flex -space-x-2 overflow-hidden">
          {members.slice(0, 5).map((member) => (
            <div
              key={member.id}
              className="relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm transition-transform hover:z-10 hover:scale-110 cursor-pointer"
              style={{ backgroundColor: getAvatarColor(member.userId) }}
              title={`${member.user.name || member.user.email} (${getRoleLabel(member.role)})`}
              onClick={() => setShowMembersList(!showMembersList)}
            >
              {getInitials(member.user.name, member.user.email)}
            </div>
          ))}
          {members.length > 5 && (
            <div
              className="relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white bg-gray-400 text-white shadow-sm cursor-pointer hover:scale-110 transition-transform"
              title={`+${members.length - 5} autres membres`}
              onClick={() => setShowMembersList(!showMembersList)}
            >
              +{members.length - 5}
            </div>
          )}
        </div>
      </div>

      {/* Button to display all members */}
      <button
        onClick={() => setShowMembersList(!showMembersList)}
        className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded text-sm font-medium transition-all flex items-center gap-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        Voir tous ({members.length})
      </button>

      {/* Invite button */}
      <button
        onClick={() => setIsInviting(true)}
        className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded text-sm font-medium transition-all flex items-center gap-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Inviter
      </button>

      {/* Modal full members list */}
      {showMembersList && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowMembersList(false)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl p-6 min-w-[400px] max-w-[500px] max-h-[600px] overflow-y-auto z-50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Membres du board ({members.length})
              </h2>
              <button
                onClick={() => setShowMembersList(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md"
                    style={{ backgroundColor: getAvatarColor(member.userId) }}
                  >
                    {getInitials(member.user.name, member.user.email)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800 truncate">
                      {member.user.name || 'Sans nom'}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {member.user.email}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(member.role)}`}>
                    {getRoleLabel(member.role)}
                  </span>
                </div>
              ))}
            </div>

            {members.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucun membre dans ce board
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal d'invitation */}
      {isInviting && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => {
              setIsInviting(false);
              setError('');
              setEmail('');
              setSuccess('');
            }}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl p-6 min-w-[400px] z-50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Inviter un membre</h2>
              <button
                onClick={() => {
                  setIsInviting(false);
                  setError('');
                  setEmail('');
                  setSuccess('');
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </label>
                <input
                  type="email"
                  placeholder="exemple@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-start gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{success}</span>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Invitation...
                    </>
                  ) : (
                    'Envoyer l\'invitation'
                  )}
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
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p>
                  L'utilisateur doit déjà avoir un compte pour être invité au workspace et accéder au board.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
