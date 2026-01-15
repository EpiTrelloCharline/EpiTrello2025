'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { InviteMemberModal } from '../components/InviteMemberModal';
import { MembersList } from '../components/MembersList';

type WorkspaceMember = {
    id: string;
    role: string;
    user: {
        id: string;
        name: string | null;
        email: string;
        avatar: string | null;
    };
};

type Workspace = {
    id: string;
    name: string;
    description: string | null;
    members: WorkspaceMember[];
};

export default function WorkspaceSettingsPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const [workspace, setWorkspace] = useState<Workspace | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [currentUser, setCurrentUser] = useState<{ id: string; role: string } | null>(null);

    const fetchWorkspace = useCallback(async () => {
        console.log('--- fetchWorkspace started ---');
        console.log('Params ID:', params?.id);

        if (!params?.id || params.id === '[id]') {
            console.log('Workspace ID not ready yet or invalid:', params?.id);
            return;
        }

        try {
            const token = localStorage.getItem('accessToken');
            console.log('Access Token exists:', !!token);

            if (!token) {
                console.error('No accessToken found in localStorage');
                setError('Vous devez être connecté pour accéder à cette page. Redirection annulée pour debug.');
                setLoading(false);
                return;
            }

            // Get user info to identify role
            const userStr = localStorage.getItem('user');
            let user = userStr ? JSON.parse(userStr) : null;
            console.log('User in localStorage:', user?.id || 'null');

            if (!user) {
                console.log('User missing in localStorage, fetching from /auth/me...');
                try {
                    const meRes = await fetch('http://localhost:3001/auth/me', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (meRes.ok) {
                        user = await meRes.json();
                        console.log('User fetched successfully:', user.id);
                        localStorage.setItem('user', JSON.stringify(user));
                    } else {
                        console.error('Failed to fetch user from /auth/me:', meRes.status);
                    }
                } catch (e) {
                    console.error('Network error fetching user profile:', e);
                }
            }

            // Fetch workspace data
            console.log('Fetching workspace data...');
            const response = await fetch(`http://localhost:3001/workspaces/${params.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log('Workspace Response Status:', response.status);

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    setError('Session expirée ou accès refusé (401/403).');
                } else {
                    throw new Error(`Erreur serveur: ${response.status}`);
                }
                setLoading(false);
                return;
            }

            const data = await response.json();
            console.log('Workspace data received:', data.name);
            setWorkspace(data);

            if (user && data.members) {
                const currentMember = data.members.find((m: WorkspaceMember) => m.user.id === user.id);
                console.log('Current user member role:', currentMember?.role || 'not found');
                if (currentMember) {
                    setCurrentUser({ id: user.id, role: currentMember.role });
                }
            }

            setError(null);
        } catch (err) {
            console.error('CRITICAL Error fetching workspace:', err);
            setError(err instanceof Error ? err.message : 'Une erreur est survenue lors du chargement.');
        } finally {
            setLoading(false);
            console.log('--- fetchWorkspace finished ---');
        }
    }, [params?.id, router]);

    useEffect(() => {
        fetchWorkspace();
    }, [fetchWorkspace]);

    const handleInviteSuccess = () => {
        fetchWorkspace();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                        <div className="bg-white rounded-lg p-6">
                            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                            <div className="space-y-3">
                                <div className="h-16 bg-gray-200 rounded"></div>
                                <div className="h-16 bg-gray-200 rounded"></div>
                                <div className="h-16 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !workspace) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                        {error || 'Workspace not found'}
                    </div>
                </div>
            </div>
        );
    }

    const canManageMembers = currentUser && ['OWNER', 'ADMIN'].includes(currentUser.role);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push('/workspaces')}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Retour aux workspaces"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{workspace.name}</h1>
                                <p className="text-sm text-gray-500">Paramètres du workspace</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Workspace Info Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations</h2>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                            <p className="text-gray-900">{workspace.name}</p>
                        </div>
                        {workspace.description && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <p className="text-gray-600">{workspace.description}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Members Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Membres</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {workspace.members.length} membre{workspace.members.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                        {canManageMembers && (
                            <button
                                onClick={() => setShowInviteModal(true)}
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Inviter un membre
                            </button>
                        )}
                    </div>

                    <MembersList
                        members={workspace.members}
                        workspaceId={workspace.id}
                        currentUserRole={currentUser?.role || ''}
                        currentUserId={currentUser?.id || ''}
                        onMemberUpdated={fetchWorkspace}
                    />
                </div>
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <InviteMemberModal
                    workspaceId={workspace.id}
                    onClose={() => setShowInviteModal(false)}
                    onInviteSuccess={handleInviteSuccess}
                />
            )}
        </div>
    );
}
