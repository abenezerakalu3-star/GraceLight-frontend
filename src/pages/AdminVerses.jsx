import React, { useEffect, useState } from 'react';
import api from '../api';
import { Plus, Edit, Trash, X } from 'lucide-react';
import { uploadFile, toMediaUrl } from '../utils/uploads';

const initialForm = {
    text: '',
    reference: '',
    theme: '',
    image: '',
    date: '',
};

const AdminVerses = () => {
    const [verses, setVerses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(initialForm);
    const [uploadingImage, setUploadingImage] = useState(false);

    const fetchVerses = async () => {
        try {
            const { data } = await api.get('/api/verses');
            setVerses(Array.isArray(data) ? data : data.items || []);
        } catch (error) {
            console.error(error);
            setVerses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVerses();
    }, []);

    const openModal = (verse = null) => {
        if (verse) {
            setForm({
                text: verse.text || '',
                reference: verse.reference || '',
                theme: verse.theme || '',
                image: verse.image || '',
                date: verse.date ? verse.date.slice(0, 10) : '',
            });
            setEditingId(verse._id);
        } else {
            setForm(initialForm);
            setEditingId(null);
        }
        setModalOpen(true);
    };

    const uploadVerseImage = async (file) => {
        if (!file) return;
        try {
            setUploadingImage(true);
            const uploaded = await uploadFile(file, 'verses');
            setForm((f) => ({ ...f, image: uploaded.url }));
        } catch (error) {
            alert(error.response?.data?.message || error.message || 'Image upload failed');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            date: form.date ? new Date(form.date).toISOString() : new Date().toISOString(),
        };

        try {
            if (editingId) {
                await api.put(`/api/verses/${editingId}`, payload);
            } else {
                await api.post('/api/verses', payload);
            }
            fetchVerses();
            setModalOpen(false);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to save verse');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this verse?')) return;
        try {
            await api.delete(`/api/verses/${id}`);
            fetchVerses();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete verse');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gold-500">Manage Verses</h1>
                <button onClick={() => openModal()} className="btn-primary flex items-center gap-2"><Plus size={20} /> New Verse</button>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gold-500">Loading...</div>
            ) : (
                <div className="space-y-4">
                    {verses.map((verse) => (
                        <div key={verse._id} className="card flex items-center justify-between gap-3">
                            <div className="min-w-0 flex-1">
                                <div className="font-bold truncate">{verse.reference}</div>
                                <p className="text-sm text-gray-400 line-clamp-1">{verse.text}</p>
                                {verse.theme && <span className="text-xs text-gold-500 uppercase">{verse.theme}</span>}
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => openModal(verse)} className="text-blue-400 hover:text-white p-2"><Edit size={18} /></button>
                                <button onClick={() => handleDelete(verse._id)} className="text-red-400 hover:text-white p-2"><Trash size={18} /></button>
                            </div>
                        </div>
                    ))}
                    {verses.length === 0 && <div className="text-center py-12 text-gray-500">No verses yet.</div>}
                </div>
            )}

            {modalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-dark-800 rounded-lg w-full max-w-2xl border border-gold-500/20">
                        <div className="flex justify-between items-center p-6 border-b border-dark-700">
                            <h2 className="text-xl font-bold">{editingId ? 'Edit Verse' : 'New Verse'}</h2>
                            <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <textarea className="input-field h-32" placeholder="Verse text" value={form.text} onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))} required />
                            <input className="input-field" placeholder="Reference (e.g. John 3:16)" value={form.reference} onChange={(e) => setForm((f) => ({ ...f, reference: e.target.value }))} required />
                            <input className="input-field" placeholder="Theme" value={form.theme} onChange={(e) => setForm((f) => ({ ...f, theme: e.target.value }))} />
                            <input type="date" className="input-field" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />

                            <input className="input-field" placeholder="Image URL" value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} />
                            <div className="flex items-center gap-3">
                                <input type="file" accept="image/*" onChange={(e) => uploadVerseImage(e.target.files?.[0])} className="text-sm text-gray-400" />
                                {uploadingImage && <span className="text-xs text-gold-500">Uploading image...</span>}
                            </div>
                            {form.image && <img src={toMediaUrl(form.image)} alt="Verse" className="h-24 rounded object-cover" />}

                            <div className="flex justify-end gap-2 pt-2">
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

export default AdminVerses;
