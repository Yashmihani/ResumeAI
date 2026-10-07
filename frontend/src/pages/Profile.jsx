import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { User, Mail, Calendar, CheckCircle, AlertCircle, Save } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name cannot be blank.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');
      const res = await api.put('/users/me', { name: name.trim() });
      updateUser(res.data);
      setSuccess('Candidate name updated successfully.');
    } catch (err) {
      setError('Failed to update profile name.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout
      title="Candidate Profile"
      subtitle="Account Details, System Identity & Candidate Profile Configuration"
    >
      <div className="max-w-2xl space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <h3 className="font-bold text-base text-slate-900 pb-3 border-b border-slate-100">
            Candidate Profile Information
          </h3>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleUpdate} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Candidate Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Email Address (Read-only)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full text-xs pl-9 pr-3 py-2 bg-slate-100 border border-slate-200 text-slate-500 rounded-lg font-mono cursor-not-allowed"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Email serves as your unique primary authentication identifier.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Account Registration Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  disabled
                  value={user?.created_at ? new Date(user.created_at).toLocaleString() : 'Active'}
                  className="w-full text-xs pl-9 pr-3 py-2 bg-slate-100 border border-slate-200 text-slate-500 rounded-lg font-mono cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Updating...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
