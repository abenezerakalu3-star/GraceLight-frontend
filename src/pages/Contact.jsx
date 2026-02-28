import api from '../api';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/api/contacts', formData);
            setSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-12 px-4">
            <Breadcrumb items={[{ label: 'Contact' }]} />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gold-500 font-serif">Contact Us</h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">We'd love to hear from you. Reach out for prayer, questions, or just to say hello.</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Info */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-8"
                >
                    <div className="card flex items-start space-x-4 p-6 hover:border-gold-500 transition-colors">
                        <div className="bg-gold-500/10 p-3 rounded-full text-gold-500">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Visit Us</h3>
                            <p className="text-gray-300">Atote street</p>
                            <p className="text-gray-300">Hawassa, Ethiopia</p>
                        </div>
                    </div>

                    <div className="card flex items-start space-x-4 p-6 hover:border-gold-500 transition-colors">
                        <div className="bg-gold-500/10 p-3 rounded-full text-gold-500">
                            <Phone size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Call Us</h3>
                            <p className="text-gray-300">251912105409</p>
                            <p className="text-gray-300">Mon-Fri, 9am - 5pm</p>
                        </div>
                    </div>

                    <div className="card flex items-start space-x-4 p-6 hover:border-gold-500 transition-colors">
                        <div className="bg-gold-500/10 p-3 rounded-full text-gold-500">
                            <Mail size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Email Us</h3>
                            <p className="text-gray-300">gracelighteth@gmail.com</p>
                        </div>
                    </div>
                </motion.div>

                {/* Contact Form */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-dark-800 p-8 rounded-lg border border-gold-500/20"
                >
                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-sm">
                                    {error}
                                </div>
                            )}
                            <div>
                                <label className="block text-gray-400 mb-2">Name</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="Your Name"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-2">Email</label>
                                <input
                                    type="email"
                                    className="input-field"
                                    placeholder="your@email.com"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-2">Message</label>
                                <textarea
                                    className="input-field h-32"
                                    placeholder="How can we help you?"
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full py-3 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending...' : 'Send Message'} <Send size={18} className="ml-2" />
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                                <Send className="text-green-500" size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Message Sent!</h3>
                            <p className="text-gray-400">Thank you for reaching out. We will get back to you as soon as possible.</p>
                            <button onClick={() => setSubmitted(false)} className="mt-8 text-gold-500 hover:text-white">Send another message</button>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;
