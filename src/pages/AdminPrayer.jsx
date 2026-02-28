import React, { useState, useEffect } from 'react';
import api from '../api';
import { Trash, CheckCircle, Archive } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminPrayer = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('new');

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const { data } = await api.get('/api/prayer-requests');
                setRequests(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/api/prayer-requests/${id}`, { status });
            setRequests((prev) => prev.map((r) => (r._id === id ? { ...r, status } : r)));
        } catch (error) {
            alert('Failed to update');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this prayer request?')) return;
        try {
            await api.delete(`/api/prayer-requests/${id}`);
            setRequests((prev) => prev.filter((r) => r._id !== id));
        } catch (error) {
            alert('Failed to delete');
        }
    };

    const filtered = requests.filter((r) => (filter === 'all' ? true : r.status === filter));

    return (
        <div>
            <h1 className="text-3xl font-bold text-gold-500 mb-6">Prayer Requests</h1>
            <div className="flex gap-2 mb-6">
                {['new', 'prayed', 'archived', 'all'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded text-sm font-medium capitalize ${filter === f ? 'bg-gold-500 text-black' : 'bg-dark-700 text-gray-400 hover:text-white'}`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="text-center py-20 text-gold-500">Loading...</div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {filtered.map((r) => (
                            <motion.div
                                key={r._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className={`card border-l-4 ${r.status === 'new' ? 'border-l-gold-500' : r.status === 'prayed' ? 'border-l-green-500' : 'border-l-gray-600'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold">{r.isAnonymous ? 'Anonymous' : r.name}</h3>
                                        <p className="text-sm text-gray-500">{r.email}</p>
                                    </div>
                                    <span className="text-xs text-gray-500">{new Date(r.date).toLocaleDateString()}</span>
                                </div>
                                <p className="text-gray-300 mb-4 whitespace-pre-wrap">&ldquo;{r.request}&rdquo;</p>
                                <div className="flex gap-2">
                                    {r.status === 'new' && (
                                        <button onClick={() => updateStatus(r._id, 'prayed')} className="btn-outline text-sm flex items-center gap-1">
                                            <CheckCircle size={16} /> Mark Prayed
                                        </button>
                                    )}
                                    {r.status !== 'archived' && (
                                        <button onClick={() => updateStatus(r._id, 'archived')} className="btn-outline text-sm flex items-center gap-1">
                                            <Archive size={16} /> Archive
                                        </button>
                                    )}
                                    <button onClick={() => handleDelete(r._id)} className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1">
                                        <Trash size={16} /> Delete
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {filtered.length === 0 && <div className="text-center py-12 text-gray-500">No prayer requests.</div>}
                </div>
            )}
        </div>
    );
};

export default AdminPrayer;
