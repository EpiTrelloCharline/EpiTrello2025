'use client';

import { useState, useEffect } from 'react';

interface Workspace {
  id: string;
  name: string;
  description: string | null;
  members: Array<{
    id: string;
    role: string;
    user: {
      id: string;
      email: string;
    };
  }>;
}

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const getToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  };

  const fetchWorkspaces = async () => {
    try {
      const token = getToken();
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:3001/workspaces', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch workspaces');
      }

      const data = await response.json();
      setWorkspaces(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = getToken();
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch('http://localhost:3001/workspaces', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create workspace');
      }

      const newWorkspace = await response.json();
      setWorkspaces([...workspaces, newWorkspace]);
      setFormData({ name: '', description: '' });
      setShowCreateForm(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create workspace');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Workspaces</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Workspaces</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {showCreateForm ? 'Cancel' : 'Create Workspace'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showCreateForm && (
        <form onSubmit={handleCreateWorkspace} className="bg-gray-50 p-4 rounded mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </form>
      )}

      {workspaces.length === 0 ? (
        <p className="text-gray-500">No workspaces found. Create your first workspace!</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((workspace) => (
            <div
              key={workspace.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{workspace.name}</h2>
              {workspace.description && (
                <p className="text-gray-600 mb-4">{workspace.description}</p>
              )}
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  {workspace.members.length} member{workspace.members.length !== 1 ? 's' : ''}
                </p>
                <div className="mt-2">
                  {workspace.members.slice(0, 3).map((member) => (
                    <span
                      key={member.id}
                      className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2 mb-1"
                    >
                      {member.user.email} ({member.role})
                    </span>
                  ))}
                  {workspace.members.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{workspace.members.length - 3} more
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <a
                    href={`/workspaces/${workspace.id}/boards`}
                    className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
                  >
                    Voir les tableaux
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

