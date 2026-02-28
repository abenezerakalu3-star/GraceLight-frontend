import React, { useState, useEffect } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';

const Testimonies = () => {
    const [testimonies, setTestimonies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', content: '' });
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        const fetchTestimonies = async () => {
            try {
                const { data } = await api.get('/api/testimonies/approved');
                setTestimonies(data);
            } catch (error) {
                setTestimonies([]);
            } finally {
                setLoading(false);
            }
        };
        fetchTestimonies();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        setSubmitSuccess(false);
        try {
            await api.post('/api/testimonies', formData);
            setSubmitSuccess(true);
            setFormData({ name: '', content: '' });
        } catch (error) {
            alert('Failed to submit. Please try again.');
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-12 px-4">
            <Breadcrumb items={[{ label: 'Testimonies' }]} />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gold-500 font-serif">Testimonies</h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">Stories of faith and God&apos;s grace from our community.</p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    {loading ? (
                        <div className="text-center text-gold-500 py-20">Loading...</div>
                    ) : testimonies.length === 0 ? (
                        <div className="text-center py-20 bg-dark-800 rounded-lg border border-dashed border-gray-700">
                            <Quote size={48} className="mx-auto text-gray-600 mb-4 opacity-50" />
                            <p className="text-gray-500">No testimonies yet. Be the first to share!</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {testimonies.map((t, i) => (
                                <motion.div
                                    key={t._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="card border-l-4 border-l-gold-500"
                                >
                                    <Quote className="text-gold-500/30 mb-4" size={40} />
                                    <p className="text-gray-300 italic text-lg mb-6">&ldquo;{t.content}&rdquo;</p>
                                    <p className="text-gold-500 font-bold">— {t.name}</p>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <div className="card sticky top-24">
                        <h2 className="text-xl font-bold mb-4">Share Your Story</h2>
                        <p className="text-gray-400 text-sm mb-6">Has God done something amazing in your life? Share it to encourage others.</p>
                        {submitSuccess && <p className="text-green-500 text-sm mb-4">Thank you! Your testimony will be reviewed.</p>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <textarea
                                className="input-field h-32"
                                placeholder="Your testimony..."
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                required
                            />
                            <button type="submit" disabled={submitLoading} className="btn-primary w-full">
                                {submitLoading ? 'Submitting...' : 'Submit Testimony'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Testimonies;
