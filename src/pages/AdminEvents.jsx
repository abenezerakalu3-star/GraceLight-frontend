import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Edit, Trash, X, Calendar } from 'lucide-react';
import { uploadFile, toMediaUrl } from '../utils/uploads';

const EVENT_TYPES = ['service', 'meeting', 'special', 'conference'];

const AdminEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        endDate: '',
        location: '',
        image: '',
        type: 'service',
    });
    const [uploadingImage, setUploadingImage] = useState(false);

    const fetchEvents = async () => {
        try {
            const { data } = await api.get('/api/events');
            setEvents(Array.isArray(data) ? data : data.items || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const openModal = (event = null) => {
        if (event) {
            setFormData({
                title: event.title,
                description: event.description || '',
                date: event.date ? event.date.slice(0, 16) : '',
                endDate: event.endDate ? event.endDate.slice(0, 16) : '',
                location: event.location || '',
                image: event.image || '',
                type: event.type || 'service',
            });
            setEditingId(event._id);
        } else {
            setFormData({ title: '', description: '', date: '', endDate: '', location: '', image: '', type: 'service' });
            setEditingId(null);
        }
        setModalOpen(true);
    };

    const uploadEventImage = async (file) => {
        if (!file) return;
        try {
            setUploadingImage(true);
            const uploaded = await uploadFile(file, 'events');
            setFormData((prev) => ({ ...prev, image: uploaded.url }));
        } catch (error) {
            alert(error.response?.data?.message || error.message || 'Image upload failed');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/api/events/${editingId}`, formData);
            } else {
                await api.post('/api/events', formData);
            }
            fetchEvents();
            setModalOpen(false);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to save');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this event?')) return;
        try {
            await api.delete(`/api/events/${id}`);
            fetchEvents();
        } catch (error) {
            alert('Failed to delete');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gold-500">Manage Events</h1>
                <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
                    <Plus size={20} /> New Event
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gold-500">Loading...</div>
            ) : (
                <div className="space-y-4">
                    {events.map((event) => (
                        <div key={event._id} className="card flex items-center justify-between gap-3">
                            <div className="flex items-center gap-4 min-w-0">
                                {event.image ? (
                                    <img src={toMediaUrl(event.image)} alt={event.title} className="w-14 h-14 rounded object-cover" />
                                ) : (
                                    <Calendar className="text-gold-500" size={24} />
                                )}
                                <div className="min-w-0">
                                    <h3 className="font-bold truncate">{event.title}</h3>
                                    <p className="text-sm text-gray-500 truncate">{new Date(event.date).toLocaleString()} • {event.type}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => openModal(event)} className="text-blue-400 hover:text-white p-2">
                                    <Edit size={18} />
                                </button>
                                <button onClick={() => handleDelete(event._id)} className="text-red-400 hover:text-white p-2">
                                    <Trash size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {events.length === 0 && <div className="text-center py-12 text-gray-500">No events yet.</div>}
                </div>
            )}

            {modalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-dark-800 rounded-lg w-full max-w-lg border border-gold-500/20">
                        <div className="flex justify-between items-center p-6 border-b border-dark-700">
                            <h2 className="text-xl font-bold">{editingId ? 'Edit Event' : 'New Event'}</h2>
                            <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-gray-400 mb-1">Title *</label>
                                <input className="input-field" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-1">Type</label>
                                <select className="input-field" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                                    {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-1">Date & Time *</label>
                                <input type="datetime-local" className="input-field" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-1">Location</label>
                                <input className="input-field" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-1">Description</label>
                                <textarea className="input-field h-24" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-1">Image URL</label>
                                <input className="input-field" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
                                <div className="mt-2 flex items-center gap-3">
                                    <input type="file" accept="image/*" onChange={(e) => uploadEventImage(e.target.files?.[0])} className="text-sm text-gray-400" />
                                    {uploadingImage && <span className="text-xs text-gold-500">Uploading...</span>}
                                </div>
                                {formData.image && <img src={toMediaUrl(formData.image)} alt="Preview" className="mt-3 h-24 w-full object-cover rounded" />}
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

export default AdminEvents;
