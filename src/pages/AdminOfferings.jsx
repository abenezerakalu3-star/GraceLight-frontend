import React, { useEffect, useMemo, useState } from 'react';
import api from '../api';
import { CheckCircle, Clock3, Search, Trash, XCircle } from 'lucide-react';

const statuses = ['all', 'pending', 'verified', 'failed'];

const AdminOfferings = () => {
    const [offerings, setOfferings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('all');

    const fetchOfferings = async () => {
        try {
            const { data } = await api.get('/api/offerings');
            setOfferings(Array.isArray(data) ? data : data.items || []);
        } catch (error) {
            console.error(error);
            setOfferings([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOfferings();
    }, []);

    const filtered = useMemo(() => {
        return offerings.filter((o) => {
            const text = `${o.donorName || ''} ${o.donorEmail || ''} ${o.transactionId || ''}`.toLowerCase();
            const matchesSearch = text.includes(search.toLowerCase());
            const matchesStatus = status === 'all' ? true : o.status === status;
            return matchesSearch && matchesStatus;
        });
    }, [offerings, search, status]);

    const totals = useMemo(() => {
        const total = offerings.reduce((sum, item) => sum + Number(item.amount || 0), 0);
        const verified = offerings
            .filter((item) => item.status === 'verified')
            .reduce((sum, item) => sum + Number(item.amount || 0), 0);
        return { total, verified };
    }, [offerings]);

    const updateStatus = async (id, nextStatus) => {
        try {
            const { data } = await api.put(`/api/offerings/${id}`, { status: nextStatus });
            setOfferings((prev) => prev.map((item) => (item._id === id ? data : item)));
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update offering status');
        }
    };

    const removeOffering = async (id) => {
        if (!window.confirm('Delete this offering record?')) return;
        try {
            await api.delete(`/api/offerings/${id}`);
            setOfferings((prev) => prev.filter((item) => item._id !== id));
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete offering');
        }
    };

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h1 className="text-3xl font-bold text-gold-500">Manage Offerings</h1>
                <div className="text-sm text-gray-300">
                    Total: <span className="text-white font-bold">ETB {totals.total.toLocaleString()}</span>
                    <span className="mx-2 text-gray-600">|</span>
                    Verified: <span className="text-green-400 font-bold">ETB {totals.verified.toLocaleString()}</span>
                </div>
            </div>

            <div className="card mb-5 flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-3 text-gray-500" />
                    <input
                        className="input-field pl-9"
                        placeholder="Search donor, email, transaction id"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select className="input-field md:w-56" value={status} onChange={(e) => setStatus(e.target.value)}>
                    {statuses.map((s) => (
                        <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gold-500">Loading...</div>
            ) : (
                <div className="bg-dark-800 rounded-lg overflow-hidden border border-gold-500/10">
                    <table className="w-full text-left">
                        <thead className="bg-dark-700 text-xs uppercase text-gray-400">
                            <tr>
                                <th className="p-4">Donor</th>
                                <th className="p-4">Type</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Method</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Date</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-700">
                            {filtered.map((offering) => (
                                <tr key={offering._id} className="hover:bg-dark-700/50">
                                    <td className="p-4">
                                        <div className="font-medium">{offering.donorName || 'Guest'}</div>
                                        <div className="text-xs text-gray-500">{offering.donorEmail || offering.transactionId || '—'}</div>
                                    </td>
                                    <td className="p-4 capitalize text-gray-300">{offering.type}</td>
                                    <td className="p-4 font-bold">ETB {Number(offering.amount || 0).toLocaleString()}</td>
                                    <td className="p-4 text-gray-400">{offering.paymentMethod || '—'}</td>
                                    <td className="p-4">
                                        <span className={`text-xs px-2 py-1 rounded uppercase ${offering.status === 'verified'
                                            ? 'bg-green-500/20 text-green-400'
                                            : offering.status === 'failed'
                                                ? 'bg-red-500/20 text-red-400'
                                                : 'bg-yellow-500/20 text-yellow-300'
                                            }`}>
                                            {offering.status || 'pending'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-500 text-sm">
                                        {offering.date ? new Date(offering.date).toLocaleDateString() : '—'}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => updateStatus(offering._id, 'verified')}
                                                className="text-green-400 hover:text-green-300"
                                                title="Mark verified"
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                            <button
                                                onClick={() => updateStatus(offering._id, 'pending')}
                                                className="text-yellow-300 hover:text-yellow-200"
                                                title="Mark pending"
                                            >
                                                <Clock3 size={18} />
                                            </button>
                                            <button
                                                onClick={() => updateStatus(offering._id, 'failed')}
                                                className="text-red-400 hover:text-red-300"
                                                title="Mark failed"
                                            >
                                                <XCircle size={18} />
                                            </button>
                                            <button
                                                onClick={() => removeOffering(offering._id)}
                                                className="text-gray-400 hover:text-red-400"
                                                title="Delete"
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filtered.length === 0 && (
                        <div className="text-center py-12 text-gray-500">No offerings match this filter.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminOfferings;
