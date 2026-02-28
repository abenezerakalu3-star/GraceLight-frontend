import React, { useState, useEffect } from 'react';
import api from '../api';
import { Trash, Download } from 'lucide-react';

const AdminNewsletter = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubscribers = async () => {
            try {
                const { data } = await api.get('/api/newsletter');
                setSubscribers(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchSubscribers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Remove this subscriber?')) return;
        try {
            await api.delete(`/api/newsletter/${id}`);
            setSubscribers((prev) => prev.filter((s) => s._id !== id));
        } catch (error) {
            alert('Failed to delete');
        }
    };

    const exportCSV = () => {
        const headers = ['Email', 'Name', 'Status', 'Subscribed At'];
        const rows = subscribers.map((s) => [s.email, s.name || '', s.status, new Date(s.subscribedAt).toLocaleDateString()]);
        const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'newsletter-subscribers.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    const activeCount = subscribers.filter((s) => s.status === 'active').length;

    return (
        <div>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h1 className="text-3xl font-bold text-gold-500">Newsletter Subscribers</h1>
                <button onClick={exportCSV} className="btn-outline flex items-center gap-2">
                    <Download size={18} /> Export CSV
                </button>
            </div>

            <div className="mb-4 p-4 bg-dark-700 rounded-lg">
                <p className="text-gray-400"><strong className="text-white">{activeCount}</strong> active subscribers</p>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gold-500">Loading...</div>
            ) : (
                <div className="bg-dark-800 rounded-lg overflow-hidden border border-gold-500/10">
                    <table className="w-full text-left">
                        <thead className="bg-dark-700 text-gray-400 uppercase text-xs">
                            <tr>
                                <th className="p-4">Email</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Subscribed</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-700">
                            {subscribers.map((s) => (
                                <tr key={s._id} className="hover:bg-dark-700/50">
                                    <td className="p-4 font-medium">{s.email}</td>
                                    <td className="p-4 text-gray-400">{s.name || '—'}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs ${s.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-gray-600 text-gray-400'}`}>
                                            {s.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-500">{new Date(s.subscribedAt).toLocaleDateString()}</td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => handleDelete(s._id)} className="text-red-400 hover:text-red-300 p-1">
                                            <Trash size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {subscribers.length === 0 && (
                        <div className="p-12 text-center text-gray-500">No subscribers yet.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminNewsletter;
