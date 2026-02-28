import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import api from '../api';
import Breadcrumb from '../components/Breadcrumb';
import { Send, MessageCircle, Search, Phone, MoreVertical, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const rawApiBase = import.meta.env.VITE_API_URL || window.location.origin;
const SOCKET_URL = rawApiBase.replace(/\/+$/, '').replace(/\/api$/, '') || window.location.origin;
const buildMessageKey = (msg) => msg?._id || `${msg?.createdAt || ''}-${msg?.username || ''}-${msg?.text || ''}`;
const parseUserInfo = () => {
    try {
        return JSON.parse(localStorage.getItem('userInfo') || 'null');
    } catch (_) {
        return null;
    }
};

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    const appendMessage = (msg) => {
        if (!msg) return;
        const key = buildMessageKey(msg);
        setMessages((prev) => {
            if (prev.some((existing) => buildMessageKey(existing) === key)) return prev;
            return [...prev, msg];
        });
    };

    useEffect(() => {
        let mounted = true;
        const user = parseUserInfo();
        setUserInfo(user);
        if (!user?.token) {
            setError('Please log in to use chat.');
            setLoading(false);
            return;
        }

        const load = async () => {
            try {
                const { data } = await api.get('/api/chat');
                if (mounted) setMessages(Array.isArray(data) ? data : []);
            } catch (_err) {
                if (mounted) setError('Failed to load messages.');
            } finally {
                if (mounted) setLoading(false);
            }
        };
        load();

        try {
            const socket = io(SOCKET_URL.replace(/\/$/, ''), { path: '/socket.io', transports: ['websocket', 'polling'] });
            socket.emit('join_chat');
            socket.on('chat_message', (msg) => {
                if (mounted) appendMessage(msg);
            });
            return () => {
                mounted = false;
                socket.off('chat_message');
                socket.disconnect();
            };
        } catch (_e) {
            return () => {
                mounted = false;
            };
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        const text = input.trim();
        if (!text || sending) return;
        setSending(true);
        setInput('');
        try {
            const { data } = await api.post('/api/chat', { text });
            appendMessage(data);
        } catch (_err) {
            setError('Failed to send message.');
            setInput(text);
        } finally {
            setSending(false);
        }
    };

    const deleteMessage = async (msg) => {
        if (!msg?._id) return;
        if (!window.confirm('Delete this message?')) return;
        try {
            await api.delete(`/api/chat/${msg._id}`);
            setMessages((prev) => prev.filter((item) => item._id !== msg._id));
        } catch (_error) {
            alert('Failed to delete message');
        }
    };

    if (error && !loading) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-4">
                <Breadcrumb items={[{ label: 'Chat' }]} />
                <div className="card text-center py-12">
                    <MessageCircle className="mx-auto text-gray-500 mb-4" size={48} />
                    <p className="text-gray-400 mb-4">{error}</p>
                    <Link to="/login" className="btn-primary inline-block">Log in</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 flex flex-col h-[calc(100vh-7rem)]">
            <Breadcrumb items={[{ label: 'Church Chat' }]} />
            <div className="flex-1 min-h-0 rounded-2xl overflow-hidden border border-dark-700 shadow-2xl bg-[#0f1722] flex">
                <aside className="hidden md:flex w-72 border-r border-[#1f2d3b] bg-[#111b2a] flex-col">
                    <div className="p-4 border-b border-[#1f2d3b]">
                        <h1 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                            <MessageCircle size={20} className="text-sky-400" /> Grace Chat
                        </h1>
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input className="w-full bg-[#0f1722] border border-[#1f2d3b] rounded-lg pl-9 pr-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-sky-500" placeholder="Search" />
                        </div>
                    </div>
                    <div className="p-2">
                        <div className="flex items-center gap-3 rounded-xl bg-[#1b2738] px-3 py-3 border border-[#2a3b50]">
                            <div className="h-11 w-11 rounded-full bg-sky-600 flex items-center justify-center text-white font-semibold">GC</div>
                            <div className="min-w-0">
                                <p className="font-semibold text-white truncate">GraceLight Community</p>
                                <p className="text-xs text-gray-400 truncate">{messages.length} messages</p>
                            </div>
                        </div>
                    </div>
                </aside>

                <section className="flex-1 flex flex-col min-h-0">
                    <header className="px-4 py-3 border-b border-[#1f2d3b] bg-[#111b2a] flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="h-10 w-10 rounded-full bg-sky-600 flex items-center justify-center text-white font-semibold">GC</div>
                            <div className="min-w-0">
                                <p className="font-semibold text-white truncate">GraceLight Community</p>
                                <p className="text-xs text-gray-400 truncate">Be kind and respectful</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <button className="p-2 rounded-lg hover:bg-[#1b2738]" type="button" aria-label="Call"><Phone size={18} /></button>
                            <button className="p-2 rounded-lg hover:bg-[#1b2738]" type="button" aria-label="More"><MoreVertical size={18} /></button>
                        </div>
                    </header>

                    {loading ? (
                        <div className="flex-1 flex items-center justify-center text-sky-400">Loading messages...</div>
                    ) : (
                        <>
                            <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-6 bg-[#0f1722]">
                                {messages.length === 0 && <p className="text-gray-500 text-center py-8">No messages yet. Say hello!</p>}
                                <div className="space-y-3">
                                    {messages.map((msg) => {
                                        const senderId = msg.user?._id || msg.user;
                                        const own = userInfo?._id && senderId && String(senderId) === String(userInfo._id);
                                        const canDelete = own || userInfo?.role === 'admin';
                                        return (
                                            <div key={buildMessageKey(msg)} className={`flex ${own ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2 shadow ${own ? 'bg-sky-600 text-white rounded-br-md' : 'bg-[#1b2738] text-gray-100 rounded-bl-md border border-[#2a3b50]'}`}>
                                                    {!own && <p className="text-xs font-semibold text-sky-300 mb-1">{msg.username || 'User'}</p>}
                                                    <p className="break-words text-sm">{msg.text}</p>
                                                    <div className="mt-1 flex items-center justify-between gap-2">
                                                        <p className={`text-[11px] ${own ? 'text-sky-100/80' : 'text-gray-400'}`}>
                                                            {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                        </p>
                                                        {canDelete && (
                                                            <button type="button" onClick={() => deleteMessage(msg)} className={`${own ? 'text-sky-100/90' : 'text-gray-300'} hover:text-red-300`}>
                                                                <Trash2 size={12} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div ref={messagesEndRef} />
                            </div>

                            <form onSubmit={handleSend} className="p-3 border-t border-[#1f2d3b] bg-[#111b2a] flex gap-2">
                                <input
                                    type="text"
                                    className="flex-1 rounded-xl bg-[#0f1722] border border-[#243447] px-4 py-2 text-white focus:outline-none focus:border-sky-500"
                                    placeholder="Write a message..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    maxLength={1000}
                                    disabled={sending}
                                />
                                <button type="submit" disabled={sending || !input.trim()} className="h-11 w-11 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white">
                                    <Send size={18} />
                                </button>
                            </form>
                        </>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Chat;
