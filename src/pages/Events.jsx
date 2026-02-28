import React, { useMemo, useState, useEffect } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Search } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { SkeletonCard } from '../components/Skeleton';
import { toMediaUrl } from '../utils/uploads';

const EVENT_TYPES = { service: 'Service', meeting: 'Meeting', special: 'Special Event', conference: 'Conference' };

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [type, setType] = useState('all');
    const [bucket, setBucket] = useState('upcoming');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await api.get('/api/events');
                setEvents(Array.isArray(data) ? data : data.items || []);
            } catch (error) {
                setEvents([]);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const filtered = useMemo(() => {
        const now = new Date();
        return events.filter((event) => {
            const eventDate = new Date(event.date);
            const inBucket = bucket === 'upcoming' ? eventDate >= now : eventDate < now;
            const matchesType = type === 'all' ? true : event.type === type;
            const text = `${event.title} ${event.description || ''} ${event.location || ''}`.toLowerCase();
            const matchesSearch = text.includes(search.toLowerCase());
            return inBucket && matchesType && matchesSearch;
        }).sort((a, b) => bucket === 'upcoming' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date));
    }, [events, search, type, bucket]);

    const formatDate = (d) =>
        new Date(d).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

    return (
        <div className="max-w-7xl mx-auto py-12 px-4">
            <Breadcrumb items={[{ label: 'Events' }]} />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gold-500 font-serif">Church Events</h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">Join us for worship, fellowship, and special gatherings.</p>
            </motion.div>

            <div className="card mb-8 flex flex-col lg:flex-row gap-3">
                <div className="flex gap-2">
                    <button onClick={() => setBucket('upcoming')} className={`px-4 py-2 rounded text-sm ${bucket === 'upcoming' ? 'bg-gold-500 text-black' : 'bg-dark-700 text-gray-300'}`}>Upcoming</button>
                    <button onClick={() => setBucket('past')} className={`px-4 py-2 rounded text-sm ${bucket === 'past' ? 'bg-gold-500 text-black' : 'bg-dark-700 text-gray-300'}`}>Past</button>
                </div>
                <select className="input-field lg:w-56" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="all">All event types</option>
                    <option value="service">Service</option>
                    <option value="meeting">Meeting</option>
                    <option value="special">Special</option>
                    <option value="conference">Conference</option>
                </select>
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-3 text-gray-500" />
                    <input className="input-field pl-9" placeholder="Search title, location, details" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
            </div>

            {loading ? (
                <div className="grid gap-6"><SkeletonCard /><SkeletonCard /></div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 bg-dark-800 rounded-lg border border-dashed border-gray-700">
                    <Calendar size={48} className="mx-auto text-gray-600 mb-4 opacity-50" />
                    <p className="text-gray-500">No {bucket} events match this filter.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {filtered.map((event, i) => (
                        <motion.div
                            key={event._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="card hover:border-gold-500 transition-all flex flex-col md:flex-row gap-6 overflow-hidden"
                        >
                            {event.image && (
                                <img src={toMediaUrl(event.image)} alt={event.title} className="w-full md:w-64 h-48 object-cover rounded-lg" />
                            )}
                            <div className="flex-1">
                                <span className="text-xs font-bold text-gold-500 uppercase tracking-wider">
                                    {EVENT_TYPES[event.type] || event.type}
                                </span>
                                <h2 className="text-2xl font-bold mt-1 mb-3">{event.title}</h2>
                                {event.description && <p className="text-gray-400 mb-4">{event.description}</p>}
                                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1"><Calendar size={16} />{formatDate(event.date)}</span>
                                    {event.location && <span className="flex items-center gap-1"><MapPin size={16} />{event.location}</span>}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Events;
