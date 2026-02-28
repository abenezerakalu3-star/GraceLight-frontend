import React, { useEffect, useMemo, useState } from 'react';
import api from '../api';
import { Search, Shield, Trash, UserCheck, UserX, Edit2, X } from 'lucide-react';
import { uploadFile, toMediaUrl } from '../utils/uploads';

const initialForm = {
    username: '',
    email: '',
    role: 'user',
    isActive: true,
    profileImage: '',
    profileFile: '',
};

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null);
    const [form, setForm] = useState(initialForm);
    const [uploading, setUploading] = useState({ image: false, file: false });

    const currentUser = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem('userInfo') || 'null');
        } catch (_e) {
            return null;
        }
    }, []);
    const currentUserId = currentUser?._id || currentUser?.id || '';

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/api/users');
            setUsers(Array.isArray(data) ? data : data.items || []);
        } catch (error) {
            console.error(error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filtered = useMemo(() => {
        const term = query.toLowerCase();
        return users.filter((u) => `${u.username} ${u.email}`.toLowerCase().includes(term));
    }, [users, query]);

    const updateUser = async (id, payload) => {
        try {
            const { data } = await api.put(`/api/users/${id}`, payload);
            setUsers((prev) => prev.map((u) => (u._id === id ? data : u)));
            if (currentUser && currentUser._id === id && data.role) {
                localStorage.setItem('userInfo', JSON.stringify({ ...currentUser, role: data.role }));
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update user');
        }
    };

    const deleteUser = async (id) => {
        if (currentUserId && currentUserId === id) {
            alert('You cannot delete your own account.');
            return;
        }
        if (!window.confirm('Delete this user account?')) return;
        try {
            await api.delete(`/api/users/${id}`);
            setUsers((prev) => prev.filter((u) => u._id !== id));
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete user');
        }
    };

    const openEdit = (user) => {
        setEditingUserId(user._id);
        setForm({
            username: user.username || '',
            email: user.email || '',
            role: user.role || 'user',
            isActive: Boolean(user.isActive),
            profileImage: user.profileImage || '',
            profileFile: user.profileFile || '',
        });
        setModalOpen(true);
    };

    const handleUpload = async (file, type) => {
        if (!file) return;
        try {
            setUploading((s) => ({ ...s, [type]: true }));
            const uploaded = await uploadFile(file, 'users');
            if (type === 'image') setForm((f) => ({ ...f, profileImage: uploaded.url }));
            if (type === 'file') setForm((f) => ({ ...f, profileFile: uploaded.url }));
        } catch (error) {
            alert(error.response?.data?.message || error.message || 'Upload failed');
        } finally {
            setUploading((s) => ({ ...s, [type]: false }));
        }
    };

    const saveUser = async (e) => {
        e.preventDefault();
        await updateUser(editingUserId, form);
        setModalOpen(false);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gold-500">Manage Users</h1>
                <div className="text-sm text-gray-400">Total users: <span className="text-white font-bold">{users.length}</span></div>
            </div>

            <div className="card mb-5">
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-3 text-gray-500" />
                    <input
                        className="input-field pl-9"
                        placeholder="Search by username or email"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gold-500">Loading...</div>
            ) : (
                <div className="bg-dark-800 rounded-lg overflow-hidden border border-gold-500/10">
                    <table className="w-full text-left">
                        <thead className="bg-dark-700 text-xs uppercase text-gray-400">
                            <tr>
                                <th className="p-4">User</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Joined</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-700">
                            {filtered.map((u) => (
                                <tr key={u._id} className="hover:bg-dark-700/50">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            {u.profileImage ? (
                                                <img src={toMediaUrl(u.profileImage)} alt={u.username} className="h-9 w-9 rounded-full object-cover" />
                                            ) : (
                                                <div className="h-9 w-9 rounded-full bg-dark-700 flex items-center justify-center text-sm">{(u.username || '?')[0]?.toUpperCase()}</div>
                                            )}
                                            <div>
                                                <div className="font-medium">{u.username}</div>
                                                <div className="text-xs text-gray-500">{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-xs px-2 py-1 rounded uppercase ${u.role === 'admin' ? 'bg-gold-500/20 text-gold-400' : 'bg-blue-500/20 text-blue-300'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-xs px-2 py-1 rounded uppercase ${u.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {u.isActive ? 'active' : 'inactive'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-500">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                                    <td className="p-4">
                                        <div className="flex justify-end gap-2">
                                            <button className="text-gray-300 hover:text-white" title="Edit user" onClick={() => openEdit(u)}><Edit2 size={18} /></button>
                                            <button
                                                className="text-gold-400 hover:text-gold-300"
                                                title="Toggle role"
                                                onClick={() => updateUser(u._id, { role: u.role === 'admin' ? 'user' : 'admin' })}
                                            >
                                                <Shield size={18} />
                                            </button>
                                            <button
                                                className="text-cyan-400 hover:text-cyan-300"
                                                title="Toggle active status"
                                                onClick={() => updateUser(u._id, { isActive: !u.isActive })}
                                            >
                                                {u.isActive ? <UserX size={18} /> : <UserCheck size={18} />}
                                            </button>
                                            <button
                                                className="text-red-400 hover:text-red-300 disabled:opacity-40 disabled:cursor-not-allowed"
                                                title={currentUserId === u._id ? 'Cannot delete current account' : 'Delete user'}
                                                onClick={() => deleteUser(u._id)}
                                                disabled={currentUserId === u._id}
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && <div className="text-center py-12 text-gray-500">No users match your search.</div>}
                </div>
            )}

            {modalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-dark-800 rounded-lg w-full max-w-xl border border-gold-500/20">
                        <div className="p-6 border-b border-dark-700 flex items-center justify-between">
                            <h2 className="text-xl font-bold">Edit User</h2>
                            <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
                        </div>
                        <form onSubmit={saveUser} className="p-6 space-y-4">
                            <input className="input-field" placeholder="Username" value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} required />
                            <input className="input-field" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
                            <div className="grid grid-cols-2 gap-3">
                                <select className="input-field" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <label className="flex items-center gap-2 text-sm text-gray-300">
                                    <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} /> Active
                                </label>
                            </div>

                            <input className="input-field" placeholder="Profile image URL" value={form.profileImage} onChange={(e) => setForm((f) => ({ ...f, profileImage: e.target.value }))} />
                            <div className="flex items-center gap-3">
                                <input type="file" accept="image/*" onChange={(e) => handleUpload(e.target.files?.[0], 'image')} className="text-sm text-gray-400" />
                                {uploading.image && <span className="text-xs text-gold-500">Uploading image...</span>}
                            </div>
                            {form.profileImage && <img src={toMediaUrl(form.profileImage)} alt="Profile" className="h-16 w-16 rounded-full object-cover" />}

                            <input className="input-field" placeholder="Profile file URL" value={form.profileFile} onChange={(e) => setForm((f) => ({ ...f, profileFile: e.target.value }))} />
                            <div className="flex items-center gap-3">
                                <input type="file" accept=".pdf,.doc,.docx,.txt,.zip,image/*" onChange={(e) => handleUpload(e.target.files?.[0], 'file')} className="text-sm text-gray-400" />
                                {uploading.file && <span className="text-xs text-gold-500">Uploading file...</span>}
                            </div>

                            <div className="flex justify-end gap-2">
                                <button type="button" className="btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
