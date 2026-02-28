import React, { useState, useEffect } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { SkeletonCard } from '../components/Skeleton';
import { toMediaUrl } from '../utils/uploads';

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const { data } = await api.get('/api/blogs');
                setBlogs(Array.isArray(data) ? data : data.items || []);
            } catch (error) {
                console.error("Error fetching blogs:", error);
                // Fallback mock data if API fails or is empty
                setBlogs([
                    { _id: '1', title: 'Walking in Faith', content: 'Faith is the substance of things hoped for...', author: 'Pastor John', date: new Date(), image: 'https://images.unsplash.com/photo-1507692049790-de58293a4697?q=80&w=1000&auto=format&fit=crop' },
                    { _id: '2', title: 'The Power of Prayer', content: 'Prayer changes things...', author: 'Sarah James', date: new Date(Date.now() - 86400000), image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1000&auto=format&fit=crop' }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    return (
        <div className="max-w-7xl mx-auto py-12 px-4">
            <Breadcrumb items={[{ label: 'Blog' }]} />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gold-500 font-serif">Our Blog</h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">Spiritual insights, church news, and words of encouragement.</p>
            </motion.div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <SkeletonCard /><SkeletonCard /><SkeletonCard />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.map((blog, index) => (
                        <motion.div
                            key={blog._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="card group hover:border-gold-500 transition-all duration-300 overflow-hidden flex flex-col"
                        >
                            <div className="relative h-48 overflow-hidden rounded-t-lg mb-4">
                                <img
                                    src={blog.image ? toMediaUrl(blog.image) : 'https://placehold.co/600x400'}
                                    alt={blog.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>
                            </div>

                            <div className="p-4 flex-grow flex flex-col">
                                <div className="flex items-center text-xs text-gold-500 mb-2 gap-4">
                                    <span className="flex items-center"><Calendar size={14} className="mr-1" /> {new Date(blog.date).toLocaleDateString()}</span>
                                    <span className="flex items-center"><User size={14} className="mr-1" /> {blog.author}</span>
                                </div>
                                <h2 className="text-2xl font-bold mb-3 text-white group-hover:text-gold-500 transition-colors">{blog.title}</h2>
                                <p className="text-gray-400 mb-4 line-clamp-3">{String(blog.content || '').substring(0, 150)}...</p>

                                <div className="mt-auto pt-4 border-t border-gray-800">
                                    <button className="text-gold-500 hover:text-white text-sm font-bold flex items-center">
                                        Read Full Article <ArrowRight size={16} className="ml-1" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Blog;
