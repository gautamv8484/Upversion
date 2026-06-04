import { useState } from 'react';
import { Search, Ban, CheckCircle, Trash2, Shield } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { formatDate } from '@/utils/cn';

export default function AdminUsers() {
  const { users, banUser, unbanUser, deleteUser } = useApp();
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  let filtered = users.filter(u => u.role !== 'admin');
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  }
  if (roleFilter) filtered = filtered.filter(u => u.role === roleFilter);
  if (statusFilter === 'banned') filtered = filtered.filter(u => u.isBanned);
  if (statusFilter === 'active') filtered = filtered.filter(u => !u.isBanned);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] font-[family-name:var(--font-heading)]">
            Manage Users
          </h1>
          <p className="text-sm text-[#5F6368] mt-0.5">
            {filtered.length} user{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5F6368]" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#111111] transition-colors"
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="px-3 py-2.5 border border-[#E5E7EB] rounded-xl text-sm bg-white focus:outline-none focus:border-[#111111] transition-colors"
        >
          <option value="">All Roles</option>
          <option value="candidate">Candidates</option>
          <option value="recruiter">Recruiters</option>
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 border border-[#E5E7EB] rounded-xl text-sm bg-white focus:outline-none focus:border-[#111111] transition-colors"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="banned">Banned</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 text-center">
            <Search size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-600">No users found</p>
            <p className="text-xs text-gray-500 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#FAFAFA]">
                  <th className="text-left text-xs font-semibold text-[#5F6368] px-5 py-3.5">User</th>
                  <th className="text-left text-xs font-semibold text-[#5F6368] px-5 py-3.5 hidden sm:table-cell">Email</th>
                  <th className="text-left text-xs font-semibold text-[#5F6368] px-5 py-3.5">Role</th>
                  <th className="text-left text-xs font-semibold text-[#5F6368] px-5 py-3.5 hidden md:table-cell">Joined</th>
                  <th className="text-left text-xs font-semibold text-[#5F6368] px-5 py-3.5">Status</th>
                  <th className="text-right text-xs font-semibold text-[#5F6368] px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {filtered.map(u => (
                  <tr key={u.id} className={'hover:bg-[#FAFAFA] transition-colors' + (u.isBanned ? ' opacity-60' : '')}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#1A1A1A] rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                          {(u.avatarFile || u.avatarUrl) ? (
                            <img src={u.avatarFile || u.avatarUrl} alt={u.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-white text-xs font-medium">{u.name.charAt(0)}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#111111] truncate">{u.name}</p>
                          <p className="text-xs text-[#5F6368] sm:hidden">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-[#5F6368] hidden sm:table-cell">{u.email}</td>
                    <td className="px-5 py-3.5">
                      <span className={'text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ' +
                        (u.role === 'candidate' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600')
                      }>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-[#5F6368] hidden md:table-cell">{formatDate(u.createdAt)}</td>
                    <td className="px-5 py-3.5">
                      {u.isBanned ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-red-100 text-red-700 px-2.5 py-1 rounded-full">
                          <Ban size={10} /> Banned
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-green-50 text-green-700 px-2.5 py-1 rounded-full">
                          <CheckCircle size={10} /> Active
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {u.isBanned ? (
                          <button
                            onClick={() => unbanUser(u.id)}
                            className="flex items-center gap-1 text-xs font-medium text-green-600 hover:text-green-700 px-2.5 py-1.5 rounded-lg hover:bg-green-50 transition-colors"
                          >
                            <Shield size={12} /> Unban
                          </button>
                        ) : (
                          <button
                            onClick={() => { if (confirm('Ban user ' + u.name + '?')) banUser(u.id); }}
                            className="flex items-center gap-1 text-xs font-medium text-amber-600 hover:text-amber-700 px-2.5 py-1.5 rounded-lg hover:bg-amber-50 transition-colors"
                          >
                            <Ban size={12} /> Ban
                          </button>
                        )}
                        <button
                          onClick={() => { if (confirm('Permanently delete ' + u.name + '? This cannot be undone.')) deleteUser(u.id); }}
                          className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}