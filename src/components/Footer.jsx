import React, { useState } from 'react';
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail, Loader2, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleNewsletterSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        setLoading(true);
        setMessage(null);
        try {
            await api.post('/api/newsletter/subscribe', { email: email.trim(), name: name.trim(), source: 'footer' });
            setMessage({ type: 'success', text: 'Thank you for subscribing!' });
            setEmail('');
            setName('');
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Subscription failed. Try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <footer className="bg-dark-900 border-t border-gold-500/10 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="text-2xl font-serif font-bold text-gold-500 mb-4 block">
                            GraceLight
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Illuminating lives with the word of God. Join us for worship, fellowship, and spiritual growth.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-gold-500 transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-gold-500 transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-gold-500 transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-red-500 transition-colors"><Youtube size={20} /></a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-6">Quick Links</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link to="/about" className="hover:text-gold-500 transition-colors">About Us</Link></li>
                            <li><Link to="/sermons" className="hover:text-gold-500 transition-colors">Sermons</Link></li>
                            <li><Link to="/events" className="hover:text-gold-500 transition-colors">Events</Link></li>
                            <li><Link to="/announcements" className="hover:text-gold-500 transition-colors">Announcements</Link></li>
                            <li><Link to="/give" className="hover:text-gold-500 transition-colors">Give Offering</Link></li>
                            <li><Link to="/courses" className="hover:text-gold-500 transition-colors">Courses</Link></li>
                            <li><Link to="/prayer" className="hover:text-gold-500 transition-colors">Prayer</Link></li>
                            <li><Link to="/testimonies" className="hover:text-gold-500 transition-colors">Testimonies</Link></li>
                            <li><Link to="/chat" className="hover:text-gold-500 transition-colors">Chat</Link></li>
                            <li><Link to="/contact" className="hover:text-gold-500 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-6">Contact Us</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-start">
                                <MapPin size={18} className="mr-2 text-gold-500 shrink-0 mt-0.5" />
                                <span>Hawassa, Ethiopia<br />GraceLight Center</span>
                            </li>
                            <li className="flex items-center">
                                <Phone size={18} className="mr-2 text-gold-500 shrink-0" />
                                <span>+251912105409</span>
                            </li>
                            <li className="flex items-center">
                                <Mail size={18} className="mr-2 text-gold-500 shrink-0" />
                                <span>gracelighteth@gmail.com</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-6">Newsletter</h3>
                        <p className="text-gray-400 text-sm mb-4">Subscribe for updates, verses, and church news.</p>
                        <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
                            <input
                                type="text"
                                placeholder="Your Name (optional)"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-field text-sm"
                            />
                            <input
                                type="email"
                                placeholder="Your Email *"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field text-sm"
                                required
                            />
                            <button type="submit" disabled={loading} className="btn-primary py-2 text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                                {loading ? <><Loader2 size={16} className="animate-spin" /> Subscribing...</> : <><Check size={16} /> Subscribe</>}
                            </button>
                            {message && (
                                <p className={`text-xs ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                    {message.text}
                                </p>
                            )}
                        </form>
                    </div>
                </div>

                <div className="border-t border-dark-700 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} GraceLight Church. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link to="/privacy" className="hover:text-gray-300">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-gray-300">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
