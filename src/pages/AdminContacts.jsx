import React, { useState, useEffect, useMemo } from 'react';
import api from '../api';
import { Mail, Trash, CheckCircle, Clock, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminContacts = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionLoading, setActionLoading] = useState({}); // Track per-message actions

    // Fetch all messages
    const fetchMessages = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/api/contacts');
            setMessages(data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    // Delete a message
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;

        setActionLoading((prev) => ({ ...prev, [id]: 'deleting' }));
        try {
            await api.delete(`/api/contacts/${id}`);
            // Optimistically remove from state
            setMessages((prev) => prev.filter(msg => msg._id !== id));
        } catch (error) {
            alert("Failed to delete message");
            console.error(error);
        } finally {
            setActionLoading((prev) => ({ ...prev, [id]: undefined }));
        }
    };

    // Update message status
    const handleUpdateStatus = async (id, newStatus) => {
        setActionLoading((prev) => ({ ...prev, [id]: 'updating' }));
        try {
            await api.put(`/api/contacts/${id}`, { status: newStatus });
            // Optimistically update state
            setMessages((prev) =>
                prev.map((msg) =>
                    msg._id === id ? { ...msg, status: newStatus } : msg
                )
            );
        } catch (error) {
            alert("Failed to update status");
            console.error(error);
        } finally {
            setActionLoading((prev) => ({ ...prev, [id]: undefined }));
        }
    };

    // Filter messages based on search term
    const filteredMessages = useMemo(() =>
        messages.filter(msg =>
            msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.message.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        [messages, searchTerm]
    );

    return (
        <div className="p-4">
            {/* Header and Search */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gold-500 font-serif">Inbox</h1>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search messages..."
                        className="input-field pl-10 py-2 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Loading Spinner */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    <AnimatePresence>
                        {filteredMessages.length > 0 ? filteredMessages.map((msg) => {
                            const isLoading = actionLoading[msg._id];
                            return (
                                <motion.div
                                    key={msg._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className={`card p-6 border-l-4 ${msg.status === 'new' ? 'border-l-gold-500 bg-gold-500/5' : 'border-l-gray-700'}`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${msg.status === 'new' ? 'bg-gold-500/20 text-gold-500' : 'bg-gray-800 text-gray-500'}`}>
                                                <Mail size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white">{msg.name}</h3>
                                                <p className="text-sm text-gray-400">{msg.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Clock size={14} />
                                            {msg.date ? new Date(msg.date).toLocaleString() : '—'}
                                        </div>
                                    </div>
                                    <p className="text-gray-300 bg-dark-900/50 p-4 rounded mb-6 italic leading-relaxed whitespace-pre-wrap">
                                        "{msg.message}"
                                    </p>
                                    <div className="flex justify-between items-center pt-4 border-t border-dark-700">
                                        <span className={`text-xs px-2 py-1 rounded-full uppercase font-bold ${msg.status === 'new' ? 'bg-gold-500/20 text-gold-500' :
                                                msg.status === 'read' ? 'bg-blue-500/20 text-blue-500' :
                                                    'bg-green-500/20 text-green-500'
                                            }`}>
                                            {msg.status}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            {msg.status !== 'replied' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(msg._id, msg.status === 'new' ? 'read' : 'replied')}
                                                    className={`text-gray-400 hover:text-green-500 transition-colors p-2 ${isLoading === 'updating' ? 'opacity-50 pointer-events-none' : ''}`}
                                                    title="Mark as handled"
                                                >
                                                    <CheckCircle size={20} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(msg._id)}
                                                className={`text-gray-400 hover:text-red-500 transition-colors p-2 ${isLoading === 'deleting' ? 'opacity-50 pointer-events-none' : ''}`}
                                                title="Delete message"
                                            >
                                                <Trash size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        }) : (
                            <div className="text-center py-20 bg-dark-800 rounded-lg border border-dashed border-gray-700">
                                <Mail size={48} className="mx-auto text-gray-600 mb-4 opacity-20" />
                                <p className="text-gray-500">No messages found.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default AdminContacts;
