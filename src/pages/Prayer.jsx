import React, { useState } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { Heart, Send } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';

const Prayer = () => {
    const [formData, setFormData] = useState({ name: '', email: '', request: '', isAnonymous: false });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/api/prayer-requests', formData);
            setSubmitted(true);
            setFormData({ name: '', email: '', request: '', isAnonymous: false });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <Breadcrumb items={[{ label: 'Prayer' }]} />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                <div className="inline-flex p-4 rounded-full bg-gold-500/10 mb-4">
                    <Heart className="text-gold-500" size={48} />
                </div>
                <h1 className="text-4xl font-bold mb-4 text-gold-500 font-serif">Prayer Requests</h1>
                <p className="text-gray-400">Submit your prayer request. Our prayer team will lift you up in prayer.</p>
            </motion.div>

            {submitted ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16 bg-green-500/10 rounded-lg border border-green-500/20"
                >
                    <p className="text-xl text-white mb-2">Thank you for sharing.</p>
                    <p className="text-gray-400">We will pray for you. May God bless you.</p>
                    <button onClick={() => setSubmitted(false)} className="mt-6 text-gold-500 hover:text-white">
                        Submit another request
                    </button>
                </motion.div>
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && <div className="p-4 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-sm">{error}</div>}
                        <div>
                            <label className="block text-gray-400 mb-2">Name *</label>
                            <input
                                type="text"
                                className="input-field"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                disabled={formData.isAnonymous}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">Email *</label>
                            <input
                                type="email"
                                className="input-field"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">Prayer Request *</label>
                            <textarea
                                className="input-field h-40"
                                value={formData.request}
                                onChange={(e) => setFormData({ ...formData, request: e.target.value })}
                                placeholder="Share your prayer need..."
                                required
                            />
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isAnonymous}
                                onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                                className="rounded text-gold-500"
                            />
                            <span className="text-gray-400 text-sm">Submit anonymously</span>
                        </label>
                        <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                            {loading ? 'Submitting...' : <><Send size={18} /> Submit Request</>}
                        </button>
                    </form>
                </motion.div>
            )}
        </div>
    );
};

export default Prayer;
