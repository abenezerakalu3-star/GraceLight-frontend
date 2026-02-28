import React, { useEffect, useState } from 'react';
import { Users, DollarSign, Calendar, BookOpen, Mail, Clock } from 'lucide-react';
import api from '../api';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-dark-800 p-6 rounded-lg border border-gold-500/10 flex items-center">
        <div className={`p-4 rounded-full mr-4 bg-dark-700 ${color}`}>
            <Icon size={24} />
        </div>
        <div>
            <h3 className="text-gray-400 text-sm">{title}</h3>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/api/admin/stats');
                setStats(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const cards = stats?.cards || {};

    return (
        <div>
            <div className="mb-8 relative overflow-hidden rounded-xl bg-gradient-to-r from-gold-600 to-gold-400 p-8 text-white shadow-lg">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                    <p className="text-gold-100">Track members, offerings, and church content in one place.</p>
                </div>
                <Users className="absolute right-4 bottom-[-20px] text-white/20" size={120} />
            </div>

            {loading ? (
                <div className="text-center py-16 text-gold-500">Loading dashboard...</div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard title="Total Members" value={cards.usersCount || 0} icon={Users} color="text-blue-400" />
                        <StatCard
                            title="Offerings Total"
                            value={`ETB ${Number(cards.offeringsAmount || 0).toLocaleString()}`}
                            icon={DollarSign}
                            color="text-green-400"
                        />
                        <StatCard title="Total Events" value={cards.eventsCount || 0} icon={Calendar} color="text-red-400" />
                        <StatCard
                            title="Courses + Books"
                            value={(cards.coursesCount || 0) + (cards.booksCount || 0)}
                            icon={BookOpen}
                            color="text-gold-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="card">
                            <h2 className="text-xl font-bold mb-4">Recent Contact Messages</h2>
                            {(stats?.recentContacts || []).length === 0 ? (
                                <p className="text-gray-500">No recent contact messages.</p>
                            ) : (
                                <ul className="space-y-4">
                                    {stats.recentContacts.map((contact) => (
                                        <li key={contact._id} className="border-b border-dark-700 pb-3">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-medium flex items-center gap-2"><Mail size={14} /> {contact.name}</span>
                                                <span className="text-xs text-gray-500">{new Date(contact.createdAt || contact.date).toLocaleString()}</span>
                                            </div>
                                            <p className="text-sm text-gray-400 line-clamp-2">{contact.message}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="card">
                            <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
                            {(stats?.upcomingEvents || []).length === 0 ? (
                                <p className="text-gray-500">No events scheduled.</p>
                            ) : (
                                <ul className="space-y-4">
                                    {stats.upcomingEvents.map((event) => (
                                        <li key={event._id} className="flex justify-between border-b border-dark-700 pb-3">
                                            <span>{event.title}</span>
                                            <span className="text-gray-500 text-sm flex items-center gap-1">
                                                <Clock size={14} />
                                                {event.date ? new Date(event.date).toLocaleDateString() : '—'}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
