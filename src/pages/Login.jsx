import React, { useState, useEffect } from 'react';
import api from '../api';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
// Added Eye and EyeOff icons
import { LogIn, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // New state for toggle
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const bgImages = [
        'https://images.unsplash.com/photo-1507692049790-de58293a4697?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1543791187-df796fa1103d?q=80&w=1000&auto=format&fit=crop',
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % bgImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [bgImages.length]);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            try {
                const parsed = JSON.parse(userInfo);
                if (parsed?.token) {
                    navigate(parsed.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
                }
            } catch (e) {
                localStorage.removeItem('userInfo');
            }
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data } = await api.post('/api/auth/login', { identifier, password });

            if (data && data.token) {
                const userPayload = {
                    _id: data._id,
                    username: data.username,
                    email: data.email,
                    role: data.role || 'user',
                    token: data.token,
                    profileImage: data.profileImage || ''
                };
                localStorage.setItem('userInfo', JSON.stringify(userPayload));
                const redirectPath = userPayload.role === 'admin' ? '/admin' : '/dashboard';
                navigate(redirectPath, { replace: true });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-64px)] bg-dark-900 selection:bg-gold-500/30">
            {/* Left Side: Visual/Inspirational */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-black">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentImageIndex}
                        src={bgImages[currentImageIndex]}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 0.5, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </AnimatePresence>
                
                <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/40 to-transparent" />
                
                <div className="relative z-10 flex flex-col justify-center px-16 text-white">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <span className="text-gold-500 font-bold tracking-widest uppercase text-sm mb-4 block">
                            GraceLight Church Portal
                        </span>
                        <h2 className="text-5xl font-bold mb-6 font-serif leading-tight">
                            Experience the <br /> 
                            <span className="text-gold-500">Presence of God</span>
                        </h2>
                        <blockquote className="text-xl italic text-gray-300 mb-4 border-l-4 border-gold-500 pl-4">
                            &ldquo;I was glad when they said unto me, Let us go into the house of the Lord.&rdquo;
                        </blockquote>
                        <p className="text-gold-400 font-bold">— Psalm 122:1</p>
                    </motion.div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md bg-dark-800 p-10 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold-500/10 blur-3xl rounded-full" />

                    <div className="text-center mb-10">
                        <div className="inline-flex p-4 bg-gold-500/10 rounded-full mb-4">
                            <LogIn className="text-gold-500" size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">{t('Sign In')}</h2>
                        <p className="text-gray-400 mt-2">Access your church account</p>
                    </div>

                    {error && (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-3 text-sm"
                        >
                            <AlertCircle size={18} />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Email or Username</label>
                            <input
                                type="text"
                                className="w-full bg-dark-900 border border-white/10 rounded-xl p-4 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 outline-none transition-all text-white"
                                placeholder="name@example.com"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-medium text-gray-300">Password</label>
                                <Link to="/forgot-password" size="sm" className="text-xs text-gold-500 hover:text-gold-400 transition-colors">
                                    Forgot Password?
                                </Link>
                            </div>
                            
                            {/* Password input container */}
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"} // Dynamic type
                                    className="w-full bg-dark-900 border border-white/10 rounded-xl p-4 pr-12 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 outline-none transition-all text-white"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                                {/* Toggle Button */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gold-500 transition-colors"
                                    tabIndex="-1" // Don't let tab stop here
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gold-500 hover:bg-gold-600 text-black font-bold py-4 rounded-xl shadow-lg shadow-gold-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 mt-4"
                        >
                            {loading ? (
                                <><Loader2 size={20} className="animate-spin" /> Verifying...</>
                            ) : (
                                'Sign In to Account'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-gray-400 text-sm">
                            New to GraceLight?{' '}
                            <Link to="/register" className="text-gold-500 hover:text-white font-bold transition-colors">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;