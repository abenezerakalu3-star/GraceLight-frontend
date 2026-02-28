import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Edit, Trash, X, Pin } from 'lucide-react';
import { uploadFile, toMediaUrl } from '../utils/uploads';

const AdminAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [uploading, setUploading] = useState({ image: false, file: false });
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image: '',
        attachmentUrl: '',
        isPinned: false,
        expiresAt: '',
    });

    const fetchAnnouncements = async () => {
        try {
            const { data } = await api.get('/api/announcements');
            setAnnouncements(Array.isArray(data) ? data : data.items || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const openModal = (a = null) => {
        if (a) {
            setFormData({
                title: a.title,
                content: a.content,
                image: a.image || '',
                attachmentUrl: a.attachmentUrl || '',
                isPinned: a.isPinned || false,
                expiresAt: a.expiresAt ? a.expiresAt.slice(0, 16) : '',
            });
            setEditingId(a._id);
        } else {
            setFormData({ title: '', content: '', image: '', attachmentUrl: '', isPinned: false, expiresAt: '' });
            setEditingId(null);
        }
        setModalOpen(true);
    };

    const handleUpload = async (file, type) => {
        if (!file) return;
        try {
            setUploading((s) => ({ ...s, [type]: true }));
            const uploaded = await uploadFile(file, 'announcements');
            if (type === 'image') setFormData((f) => ({ ...f, image: uploaded.url }));
            if (type === 'file') setFormData((f) => ({ ...f, attachmentUrl: uploaded.url }));
        } catch (error) {
            alert(error.response?.data?.message || error.message || 'Upload failed');
        } finally {
            setUploading((s) => ({ ...s, [type]: false }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData };
            if (!payload.expiresAt) payload.expiresAt = null;
            if (editingId) {
                await api.put(`/api/announcements/${editingId}`, payload);
            } else {
                await api.post('/api/announcements', payload);
            }
            fetchAnnouncements();
            setModalOpen(false);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to save');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this announcement?')) return;
        try {
            await api.delete(`/api/announcements/${id}`);
            fetchAnnouncements();
        } catch (error) {
            alert('Failed to delete');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gold-500">Announcements</h1>
                <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
                    <Plus size={20} /> New
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gold-500">Loading...</div>
            ) : (
                <div className="space-y-4">
                    {announcements.map((a) => (
                        <div key={a._id} className="card flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                                {a.image ? <img src={toMediaUrl(a.image)} alt={a.title} className="h-12 w-12 rounded object-cover" /> : a.isPinned && <Pin className="text-gold-500" size={20} />}
                                <div className="min-w-0">
                                    <h3 className="font-bold truncate">{a.title}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-1">{a.content}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => openModal(a)} className="text-blue-400 hover:text-white p-2"><Edit size={18} /></button>
                                <button onClick={() => handleDelete(a._id)} className="text-red-400 hover:text-white p-2"><Trash size={18} /></button>
                            </div>
                        </div>
                    ))}
                    {announcements.length === 0 && <div className="text-center py-12 text-gray-500">No announcements.</div>}
                </div>
            )}

            {modalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-dark-800 rounded-lg w-full max-w-lg border border-gold-500/20">
                        <div className="flex justify-between items-center p-6 border-b border-dark-700">
                            <h2 className="text-xl font-bold">{editingId ? 'Edit' : 'New'} Announcement</h2>
                            <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-gray-400 mb-1">Title *</label>
                                <input className="input-field" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-1">Content *</label>
                                <textarea className="input-field h-32" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-1">Image URL</label>
                                <input className="input-field" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
                                <div className="mt-2 flex items-center gap-3">
                                    <input type="file" accept="image/*" onChange={(e) => handleUpload(e.target.files?.[0], 'image')} className="text-sm text-gray-400" />
                                    {uploading.image && <span className="text-xs text-gold-500">Uploading image...</span>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-1">Attachment URL</label>
                                <input className="input-field" value={formData.attachmentUrl} onChange={(e) => setFormData({ ...formData, attachmentUrl: e.target.value })} />
                                <div className="mt-2 flex items-center gap-3">
                                    <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip,image/*" onChange={(e) => handleUpload(e.target.files?.[0], 'file')} className="text-sm text-gray-400" />
                                    {uploading.file && <span className="text-xs text-gold-500">Uploading attachment...</span>}
                                </div>
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={formData.isPinned} onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })} className="rounded text-gold-500" />
                                <span className="text-gray-400">Pin to top</span>
                            </label>
                            <div>
                                <label className="block text-gray-400 mb-1">Expires At (optional)</label>
                                <input type="datetime-local" className="input-field" value={formData.expiresAt} onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })} />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <button type="button" onClick={() => setModalOpen(false)} className="btn-outline">Cancel</button>
                                <button type="submit" className="btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAnnouncements;
