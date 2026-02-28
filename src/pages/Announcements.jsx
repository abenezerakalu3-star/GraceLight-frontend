import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Pin, Paperclip } from 'lucide-react';
import api from '../api';
import Breadcrumb from '../components/Breadcrumb';
import { toMediaUrl } from '../utils/uploads';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const { data } = await api.get('/api/announcements/active');
                setAnnouncements(Array.isArray(data) ? data : data.items || []);
            } catch (error) {
                console.error('Error fetching announcements:', error);
                setAnnouncements([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    return (
        <div className="max-w-6xl mx-auto py-12 px-4">
            <Breadcrumb items={[{ label: 'Announcements' }]} />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-gold-500 font-serif mb-3">Announcements</h1>
                <p className="text-gray-400">Latest church updates, schedules, and notices.</p>
            </motion.div>

            {loading ? (
                <div className="text-center py-20 text-gold-500">Loading announcements...</div>
            ) : announcements.length === 0 ? (
                <div className="text-center py-20 text-gray-500">No active announcements right now.</div>
            ) : (
                <div className="space-y-6">
                    {announcements.map((announcement, index) => (
                        <motion.article
                            key={announcement._id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08 }}
                            className="card"
                        >
                            <div className="flex items-start gap-3 mb-3">
                                {announcement.isPinned ? (
                                    <Pin className="text-gold-500 mt-1" size={18} />
                                ) : (
                                    <Calendar className="text-gray-500 mt-1" size={18} />
                                )}
                                <div>
                                    <h2 className="text-xl md:text-2xl font-bold text-white">{announcement.title}</h2>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Posted {announcement.createdAt ? new Date(announcement.createdAt).toLocaleDateString() : 'recently'}
                                    </p>
                                </div>
                            </div>

                            <p className="text-gray-300 whitespace-pre-line">{announcement.content}</p>

                            {announcement.image && (
                                <img
                                    src={toMediaUrl(announcement.image)}
                                    alt={announcement.title}
                                    className="w-full h-56 md:h-80 object-cover rounded mt-4"
                                />
                            )}

                            {announcement.attachmentUrl && (
                                <a
                                    href={toMediaUrl(announcement.attachmentUrl)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 mt-4 text-sm text-gold-500 hover:underline"
                                >
                                    <Paperclip size={14} /> Open attachment
                                </a>
                            )}
                        </motion.article>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Announcements;
