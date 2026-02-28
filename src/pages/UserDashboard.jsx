import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Breadcrumb from '../components/Breadcrumb';
import { SkeletonLine, SkeletonCard } from '../components/Skeleton';
import { MessageCircle, Edit3, X } from 'lucide-react';
import { uploadFile, toMediaUrl } from '../utils/uploads';

const UserDashboard = () => {
    const [user, setUser] = useState({ username: '', email: '', profileImage: '', profileFile: '', donationHistory: [] });
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [editForm, setEditForm] = useState({ username: '', profileImage: '', profileFile: '' });
    const [saving, setSaving] = useState(false);
    const [editError, setEditError] = useState('');
    const [uploading, setUploading] = useState({ image: false, file: false });

    const fetchUser = async () => {
        try {
            const { data } = await api.get('/api/auth/me');
            if (!data) return setUser({ username: 'User', email: '', profileImage: '', profileFile: '', donationHistory: [] });
            setUser({
                username: data.username || 'User',
                email: data.email || '',
                profileImage: data.profileImage || '',
                profileFile: data.profileFile || '',
                donationHistory: data.donationHistory || [],
            });
            setEditForm({ username: data.username || '', profileImage: data.profileImage || '', profileFile: data.profileFile || '' });
        } catch (err) {
            if (err.response?.status !== 401) {
                setUser({ username: 'User', email: '', profileImage: '', profileFile: '', donationHistory: [] });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleUpload = async (file, type) => {
        if (!file) return;
        try {
            setUploading((s) => ({ ...s, [type]: true }));
            const uploaded = await uploadFile(file, 'users');
            if (type === 'image') setEditForm((f) => ({ ...f, profileImage: uploaded.url }));
            if (type === 'file') setEditForm((f) => ({ ...f, profileFile: uploaded.url }));
        } catch (err) {
            setEditError(err.response?.data?.message || err.message || 'Upload failed');
        } finally {
            setUploading((s) => ({ ...s, [type]: false }));
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        setEditError('');
        try {
            const payload = {
                username: (editForm.username || '').trim() || user.username,
                profileImage: (editForm.profileImage || '').trim(),
                profileFile: (editForm.profileFile || '').trim(),
            };
            const { data } = await api.put('/api/auth/profile', payload);
            setUser((prev) => ({
                ...prev,
                username: data?.username ?? prev.username,
                profileImage: data?.profileImage ?? prev.profileImage,
                profileFile: data?.profileFile ?? prev.profileFile,
            }));
            setEditForm((prev) => ({
                ...prev,
                username: data?.username ?? prev.username,
                profileImage: data?.profileImage ?? prev.profileImage,
                profileFile: data?.profileFile ?? prev.profileFile,
            }));
            setEditOpen(false);
        } catch (err) {
            setEditError(err.response?.data?.message || 'Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-4">
                <Breadcrumb items={[{ label: 'Dashboard' }]} />
                <div className="h-10 w-64 bg-dark-700 rounded animate-pulse mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="card">
                        <div className="w-24 h-24 bg-dark-700 rounded-full mx-auto mb-4 animate-pulse" />
                        <SkeletonLine className="w-3/4 mx-auto mb-2" />
                        <SkeletonLine className="w-1/2 mx-auto mb-4" />
                    </div>
                    <div className="md:col-span-2">
                        <SkeletonCard />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <Breadcrumb items={[{ label: 'My Dashboard' }]} />
            <h1 className="text-3xl font-bold mb-8 text-gold-500">My Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="card md:col-span-1 h-fit">
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-dark-700 flex items-center justify-center mb-4 border-2 border-gold-500/30">
                            {user.profileImage ? (
                                <img src={toMediaUrl(user.profileImage)} alt={user.username} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl font-bold text-gold-500">{user.username.charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                        <h2 className="text-xl font-bold">{user.username}</h2>
                        <p className="text-gray-400 text-sm mb-4">{user.email}</p>
                        {user.profileFile && (
                            <a href={toMediaUrl(user.profileFile)} target="_blank" rel="noreferrer" className="text-xs text-gold-500 mb-4 hover:underline">Open uploaded file</a>
                        )}
                        <button onClick={() => setEditOpen(true)} className="btn-outline w-full text-sm flex items-center justify-center gap-2">
                            <Edit3 size={16} /> Edit Profile
                        </button>
                        <Link to="/chat" className="btn-primary w-full text-sm mt-3 flex items-center justify-center gap-2">
                            <MessageCircle size={16} /> Open Chat
                        </Link>
                    </div>
                </div>

                <div className="card md:col-span-2">
                    <h2 className="text-xl font-bold mb-4">Donation History</h2>
                    {user.donationHistory.length === 0 ? (
                        <p className="text-gray-400">No donations yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-dark-700 text-gray-400 uppercase text-xs">
                                    <tr>
                                        <th className="p-3">Date</th>
                                        <th className="p-3">Amount</th>
                                        <th className="p-3">Method</th>
                                        <th className="p-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-dark-700">
                                    {user.donationHistory.map((d, idx) => (
                                        <tr key={d._id || idx}>
                                            <td className="p-3 text-gray-300">{d.date ? new Date(d.date).toLocaleDateString() : '—'}</td>
                                            <td className="p-3 font-bold">{d.amount}</td>
                                            <td className="p-3 text-gray-400 text-sm">{d.method}</td>
                                            <td className="p-3 text-green-400 text-sm">{d.status || 'Completed'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {editOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-dark-800 rounded-lg w-full max-w-md border border-gold-500/20">
                        <div className="flex justify-between items-center p-6 border-b border-dark-700">
                            <h2 className="text-xl font-bold">Edit Profile</h2>
                            <button onClick={() => setEditOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
                            {editError && <p className="text-red-500 text-sm">{editError}</p>}
                            <div>
                                <label className="block text-gray-400 mb-1">Username</label>
                                <input type="text" className="input-field" value={editForm.username} onChange={(e) => setEditForm((f) => ({ ...f, username: e.target.value }))} required />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-1">Profile image URL</label>
                                <input type="url" className="input-field" placeholder="https://..." value={editForm.profileImage} onChange={(e) => setEditForm((f) => ({ ...f, profileImage: e.target.value }))} />
                                <div className="mt-2 flex items-center gap-3">
                                    <input type="file" accept="image/*" onChange={(e) => handleUpload(e.target.files?.[0], 'image')} className="text-sm text-gray-400" />
                                    {uploading.image && <span className="text-xs text-gold-500">Uploading image...</span>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-1">Profile file URL</label>
                                <input className="input-field" value={editForm.profileFile} onChange={(e) => setEditForm((f) => ({ ...f, profileFile: e.target.value }))} placeholder="https://..." />
                                <div className="mt-2 flex items-center gap-3">
                                    <input type="file" accept=".pdf,.doc,.docx,.txt,.zip,image/*" onChange={(e) => handleUpload(e.target.files?.[0], 'file')} className="text-sm text-gray-400" />
                                    {uploading.file && <span className="text-xs text-gold-500">Uploading file...</span>}
                                </div>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button type="button" onClick={() => setEditOpen(false)} className="btn-outline flex-1">Cancel</button>
                                <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
