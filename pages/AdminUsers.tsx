import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import Layout from '../components/Layout';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  ecoPoints?: number;
  createdAt: string;
  isVerified?: boolean;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (roleFilter !== 'all') params.role = roleFilter;
      
      const response = await api.get('/admin/users', { params });
      console.log('Users response:', response.data);
      const userList = response.data?.data?.users || response.data?.users || [];
      setUsers(userList);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    const roleStyles = {
      user: 'bg-green-500/10 text-green-400 border-green-500/20',
      business: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      agency: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      admin: 'bg-pink-500/10 text-pink-400 border-pink-500/20'
    };
    return roleStyles[role as keyof typeof roleStyles] || roleStyles.user;
  };

  return (
    <Layout title="" role="Admin" fullWidth hideSidebar>
      <div className="bg-gradient-to-br from-[#1a0b1e] via-[#0B1116] to-[#1a0b1e] min-h-screen">
        {/* Pink gradient effects */}
        <div className="fixed top-0 left-0 w-full h-[500px] bg-pink-500/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
        <div className="fixed bottom-0 right-0 w-full h-[500px] bg-purple-500/10 rounded-full blur-[120px] translate-y-1/2 pointer-events-none"></div>

        <div className="relative z-10">
          {/* Header */}
          <header className="border-b border-white/5 bg-[#0B1116]/80 backdrop-blur-md px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => window.location.hash = '#/admin'}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-pink-400">arrow_back</span>
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-white">User Management</h1>
                  <p className="text-sm text-gray-400">Manage all platform users</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[20px]">search</span>
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 w-64"
                  />
                </div>
              </div>
            </div>

            {/* Role Filters */}
            <div className="flex gap-2 mt-4">
              {['all', 'user', 'business', 'agency', 'admin'].map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    roleFilter === role
                      ? 'bg-pink-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>
          </header>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
              </div>
            ) : (
              <>
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-[#1E293B]/60 backdrop-blur-sm border border-pink-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-pink-500/20 rounded-lg">
                        <span className="material-symbols-outlined text-pink-400">group</span>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{users.length}</p>
                        <p className="text-sm text-gray-400">Total Users</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#1E293B]/60 backdrop-blur-sm border border-green-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <span className="material-symbols-outlined text-green-400">person</span>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{users.filter(u => u.role === 'user').length}</p>
                        <p className="text-sm text-gray-400">Residents</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#1E293B]/60 backdrop-blur-sm border border-blue-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <span className="material-symbols-outlined text-blue-400">business</span>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{users.filter(u => u.role === 'business').length}</p>
                        <p className="text-sm text-gray-400">Businesses</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#1E293B]/60 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <span className="material-symbols-outlined text-purple-400">recycling</span>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{users.filter(u => u.role === 'agency').length}</p>
                        <p className="text-sm text-gray-400">Partners</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Users Table */}
                <div className="bg-[#1E293B]/60 backdrop-blur-sm border border-pink-500/20 rounded-2xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Eco Points</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user._id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="size-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-medium text-white">{user.name}</p>
                                  <p className="text-xs text-gray-400">{user._id.slice(-8)}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-300">{user.email}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRoleBadge(user.role)}`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-pink-400 font-bold">{user.ecoPoints || 0}</span>
                            </td>
                            <td className="px-6 py-4 text-gray-300 text-sm">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => window.location.hash = `#/admin/users/${user._id}`}
                                className="px-3 py-1.5 bg-pink-500/10 text-pink-400 rounded-lg hover:bg-pink-500/20 transition-colors text-sm font-medium"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>

        {/* User Details Modal */}
        {showModal && selectedUser && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#1E293B] border border-pink-500/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-[#1E293B] border-b border-white/10 px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">User Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* User Info */}
                <div className="flex items-center gap-4">
                  <div className="size-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedUser.name}</h3>
                    <p className="text-gray-400">{selectedUser.email}</p>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold border ${getRoleBadge(selectedUser.role)}`}>
                      {selectedUser.role}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Eco Points</p>
                    <p className="text-2xl font-bold text-pink-400">{selectedUser.ecoPoints || 0}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Member Since</p>
                    <p className="text-lg font-bold text-white">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-white/5 p-4 rounded-lg">
                  <h4 className="font-bold text-white mb-2">Account Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">User ID:</span>
                      <span className="text-white font-mono">{selectedUser._id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Verified:</span>
                      <span className={selectedUser.isVerified ? 'text-green-400' : 'text-gray-400'}>
                        {selectedUser.isVerified ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <button className="flex-1 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors border border-blue-500/20">
                    Send Message
                  </button>
                  <button className="flex-1 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors border border-red-500/20">
                    Suspend User
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminUsers;
