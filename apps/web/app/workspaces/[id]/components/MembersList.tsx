'use client';

import React, { useState } from 'react';

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

type MembersListProps = {
    members: WorkspaceMember[];
    workspaceId: string;
    currentUserRole: string;
    currentUserId: string;
    onMemberUpdated: () => void;
};

export function MembersList({ members, workspaceId, currentUserRole, currentUserId, onMemberUpdated }: MembersListProps) {
    const [updatingMemberId, setUpdatingMemberId] = useState<string | null>(null);
    const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);

    const canManageMembers = ['OWNER', 'ADMIN'].includes(currentUserRole);

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'OWNER':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'ADMIN':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'MEMBER':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'OBSERVER':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'OWNER':
                return 'Propriétaire';
            case 'ADMIN':
                return 'Admin';
            case 'MEMBER':
                return 'Membre';
            case 'OBSERVER':
                return 'Observateur';
            default:
                return role;
        }
    };

    const handleRoleChange = async (memberId: string, newRole: string) => {
        setUpdatingMemberId(memberId);
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`http://localhost:3001/workspaces/${workspaceId}/members/${memberId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role: newRole }),
            });

            if (!response.ok) {
                throw new Error('Failed to update role');
            }

            onMemberUpdated();
        } catch (error) {
            console.error('Error updating role:', error);
            alert('Échec de la mise à jour du rôle');
        } finally {
            setUpdatingMemberId(null);
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        if (!confirm('Êtes-vous sûr de vouloir retirer ce membre ?')) {
            return;
        }

        setRemovingMemberId(memberId);
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`http://localhost:3001/workspaces/${workspaceId}/members/${memberId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to remove member');
            }

            onMemberUpdated();
        } catch (error) {
            console.error('Error removing member:', error);
            alert('Échec de la suppression du membre');
        } finally {
            setRemovingMemberId(null);
        }
    };

    return (
        <div className="space-y-3">
            {members.map((member) => {
                const isCurrentUser = member.user.id === currentUserId;
                const isOwner = member.role === 'OWNER';
                const canModify = canManageMembers && !isOwner;

                return (
                    <div
                        key={member.id}
                        className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                    >
                        <div className="flex items-center gap-3 flex-1">
                            {/* Avatar */}
                            {member.user.avatar ? (
                                <img
                                    src={member.user.avatar}
                                    alt={member.user.name || member.user.email}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                    {(member.user.name || member.user.email).charAt(0).toUpperCase()}
                                </div>
                            )}

                            {/* User Info */}
                            <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                    {member.user.name || member.user.email}
                                    {isCurrentUser && (
                                        <span className="ml-2 text-xs text-gray-500">(Vous)</span>
                                    )}
                                </div>
                                <div className="text-sm text-gray-500">{member.user.email}</div>
                            </div>
                        </div>

                        {/* Role and Actions */}
                        <div className="flex items-center gap-3">
                            {canModify ? (
                                <select
                                    value={member.role}
                                    onChange={(e) => handleRoleChange(member.id, e.target.value)}
                                    disabled={updatingMemberId === member.id}
                                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:opacity-50"
                                >
                                    <option value="ADMIN">Admin</option>
                                    <option value="MEMBER">Membre</option>
                                    <option value="OBSERVER">Observateur</option>
                                </select>
                            ) : (
                                <span className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${getRoleBadgeColor(member.role)}`}>
                                    {getRoleLabel(member.role)}
                                </span>
                            )}

                            {canModify && (
                                <button
                                    onClick={() => handleRemoveMember(member.id)}
                                    disabled={removingMemberId === member.id}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                    title="Retirer ce membre"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
