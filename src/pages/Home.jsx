import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Video, Heart, BookOpen, Book, Pin, Paperclip } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import { toMediaUrl } from '../utils/uploads';

const Home = () => {
    const { t } = useTranslation();

    const [dailyVerse, setDailyVerse] = React.useState(null);
    const [featuredCourse, setFeaturedCourse] = React.useState(null);
    const [announcements, setAnnouncements] = React.useState([]);
    const [siteConfig, setSiteConfig] = React.useState({ bannerImage: '' });

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [versesRes, coursesRes, announcementsRes, configRes] = await Promise.all([
                    api.get('/api/verses'),
                    api.get('/api/courses'),
                    api.get('/api/announcements/active'),
                    api.get('/api/config'),
                ]);
                const verses = Array.isArray(versesRes.data) ? versesRes.data : versesRes.data.items || [];
                const courses = Array.isArray(coursesRes.data) ? coursesRes.data : coursesRes.data.items || [];
                const anns = Array.isArray(announcementsRes.data) ? announcementsRes.data : announcementsRes.data.items || [];

                if (verses.length > 0) setDailyVerse(verses[0]);
                if (courses.length > 0) setFeaturedCourse(courses[0]);
                if (anns.length > 0) setAnnouncements(anns);
                setSiteConfig(configRes.data || { bannerImage: '' });
            } catch (error) {
                console.error('Error fetching homepage data:', error);
            }
        };
        fetchData();
    }, []);

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    return (
        <div className="flex flex-col">
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src={toMediaUrl(siteConfig.bannerImage) || 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?section=hero'}
                        alt="Worship Background"
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-dark-900/80 via-dark-900/50 to-dark-900" />
                </div>

                <motion.div initial="hidden" animate="visible" variants={fadeIn} className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                    <h2 className="text-gold-500 text-lg md:text-xl font-serif italic mb-4">"Let there be light" - Genesis 1:3</h2>
                    <h1 className="text-5xl md:text-8xl font-bold mb-6 text-white tracking-tight">{t('Welcome')}</h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-10 font-light max-w-3xl mx-auto leading-relaxed">
                        Experience God's presence, connect with a loving community, and grow in your faith journey.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link to="/sermons" className="btn-primary flex items-center justify-center px-8 py-4 text-lg group">
                            Watch Live <Video className="ml-2 group-hover:scale-110 transition-transform" size={24} />
                        </Link>
                        <Link to="/give" className="btn-outline flex items-center justify-center px-8 py-4 text-lg group bg-transparent hover:bg-gold-500/10">
                            Give Offering <Heart className="ml-2 group-hover:text-red-500 transition-colors" size={24} />
                        </Link>
                    </div>
                </motion.div>
            </section>

            {announcements.length > 0 && (
                <section className="py-8 px-4 bg-gold-500/5 border-y border-gold-500/10">
                    <div className="max-w-7xl mx-auto">
                        <div className="space-y-3">
                            {announcements.slice(0, 3).map((a) => (
                                <div key={a._id} className="p-4 rounded-lg bg-dark-800/50 border border-gold-500/10">
                                    <div className="flex items-start gap-3">
                                        {a.isPinned && <Pin className="text-gold-500 shrink-0 mt-0.5" size={18} />}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gold-500">{a.title}</h3>
                                            <p className="text-gray-400 text-sm">{a.content}</p>
                                        </div>
                                    </div>
                                    {a.image && <img src={toMediaUrl(a.image)} alt={a.title} className="mt-3 h-44 w-full object-cover rounded" />}
                                    {a.attachmentUrl && (
                                        <a href={toMediaUrl(a.attachmentUrl)} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-sm items-center gap-2 text-gold-500 hover:underline">
                                            <Paperclip size={14} /> Open attachment
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <Link to="/announcements" className="text-sm text-gold-500 hover:underline">View all announcements</Link>
                        </div>
                    </div>
                </section>
            )}

            <section className="py-24 px-4 bg-dark-900 relative">
                <div className="max-w-7xl mx-auto">
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4 text-white">Latest from GraceLight</h2>
                        <div className="h-1 w-24 bg-gold-500 mx-auto" />
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <motion.div whileHover={{ y: -10 }} className="card group hover:border-gold-500 transition-all duration-300 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><BookOpen size={100} /></div>
                            <BookOpen className="text-gold-500 mb-6" size={40} />
                            <h3 className="text-2xl font-bold mb-3">Daily Inspiration</h3>
                            {dailyVerse ? (
                                <>
                                    <p className="text-gray-300 italic mb-6 text-lg">"{dailyVerse.text}"</p>
                                    <p className="text-gold-500 text-sm font-bold mb-6">- {dailyVerse.reference}</p>
                                </>
                            ) : (
                                <p className="text-gray-400 mb-6">Loading verse...</p>
                            )}
                            <Link to="/verses" className="text-white group-hover:text-gold-500 flex items-center font-bold tracking-wide">
                                Read More <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                            </Link>
                        </motion.div>

                        <motion.div whileHover={{ y: -10 }} className="card group hover:border-gold-500 transition-all duration-300 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Video size={100} /></div>
                            <Video className="text-gold-500 mb-6" size={40} />
                            <h3 className="text-2xl font-bold mb-3">Sunday Service</h3>
                            <p className="text-gray-300 mb-6">Join us this Sunday at 10:00 AM for a powerful word and worship experience.</p>
                            <Link to="/sermons" className="text-white group-hover:text-gold-500 flex items-center font-bold tracking-wide">
                                Join Online <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                            </Link>
                        </motion.div>

                        <motion.div whileHover={{ y: -10 }} className="card group hover:border-gold-500 transition-all duration-300 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Book size={100} /></div>
                            <Book className="text-gold-500 mb-6" size={40} />
                            <h3 className="text-2xl font-bold mb-3">Featured Course</h3>
                            {featuredCourse ? (
                                <p className="text-gray-300 mb-6">{featuredCourse.title}: {featuredCourse.description}</p>
                            ) : (
                                <p className="text-gray-300 mb-6">Strengthen your spiritual foundation with our new series.</p>
                            )}
                            <Link to="/courses" className="text-white group-hover:text-gold-500 flex items-center font-bold tracking-wide">
                                Enroll Now <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Testimonials />
            <FAQ />
        </div>
    );
};

export default Home;
