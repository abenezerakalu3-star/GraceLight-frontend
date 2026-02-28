import React, { useState, useEffect } from 'react';
import api from '../api';
import { Check, X, Trash } from 'lucide-react';

const AdminTestimonies = () => {
    const [testimonies, setTestimonies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');

    useEffect(() => {
        const fetchTestimonies = async () => {
            try {
                const { data } = await api.get('/api/testimonies');
                setTestimonies(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchTestimonies();
    }, []);

    const approve = async (id) => {
        try {
            await api.put(`/api/testimonies/${id}`, { approved: true });
            setTestimonies((prev) => prev.map((t) => (t._id === id ? { ...t, approved: true } : t)));
        } catch (error) {
            alert('Failed');
        }
    };

    const reject = async (id) => {
        try {
            await api.put(`/api/testimonies/${id}`, { approved: false });
            setTestimonies((prev) => prev.map((t) => (t._id === id ? { ...t, approved: false } : t)));
        } catch (error) {
            alert('Failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this testimony?')) return;
        try {
            await api.delete(`/api/testimonies/${id}`);
            setTestimonies((prev) => prev.filter((t) => t._id !== id));
        } catch (error) {
            alert('Failed');
        }
    };

    const filtered = filter === 'all' ? testimonies : testimonies.filter((t) => (filter === 'pending' ? !t.approved : t.approved));

    return (
        <div>
            <h1 className="text-3xl font-bold text-gold-500 mb-6">Testimonies</h1>
            <div className="flex gap-2 mb-6">
                {['pending', 'approved', 'all'].map((f) => (
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
                    {filtered.map((t) => (
                        <div key={t._id} className={`card ${!t.approved ? 'border-l-4 border-l-amber-500' : ''}`}>
                            <p className="text-gray-300 mb-4">&ldquo;{t.content}&rdquo;</p>
                            <div className="flex justify-between items-center">
                                <p className="text-gold-500 font-bold">— {t.name}</p>
                                <div className="flex gap-2">
                                    {!t.approved && (
                                        <button onClick={() => approve(t._id)} className="text-green-500 hover:text-green-400 flex items-center gap-1">
                                            <Check size={18} /> Approve
                                        </button>
                                    )}
                                    {t.approved && (
                                        <button onClick={() => reject(t._id)} className="text-amber-500 hover:text-amber-400 flex items-center gap-1">
                                            <X size={18} /> Unapprove
                                        </button>
                                    )}
                                    <button onClick={() => handleDelete(t._id)} className="text-red-400 hover:text-red-300">
                                        <Trash size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filtered.length === 0 && <div className="text-center py-12 text-gray-500">No testimonies.</div>}
                </div>
            )}
        </div>
    );
};

export default AdminTestimonies;
