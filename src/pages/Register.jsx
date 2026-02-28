import React, { useState, useEffect } from 'react';
import api from '../api';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
// Added Eye and EyeOff icons
import { UserPlus, Loader2, Shield, AlertCircle, Eye, EyeOff } from 'lucide-react';

const Register = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Toggle state for password
    const [adminSecret, setAdminSecret] = useState('');
    const [showAdminSecret, setShowAdminSecret] = useState(false); // Toggle state for admin secret
    const [showAdminField, setShowAdminField] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const bgImages = [
        'https://images.unsplash.com/photo-1510936111840-65e151ad71bb?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=1000&auto=format&fit=crop',
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
            const payload = { username, email, password };
            if (showAdminField && adminSecret) payload.adminSecret = adminSecret;

            const { data } = await api.post('/api/auth/register', payload);
            
            const toStore = { 
                _id: data._id, 
                username: data.username, 
                email: data.email, 
                role: data.role || 'user', 
                token: data.token 
            };
            
            localStorage.setItem('userInfo', JSON.stringify(toStore));
            navigate(toStore.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. This email or username might already be taken.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-64px)] bg-dark-900 selection:bg-gold-500/30">
            {/* Left Side: Inspiration Slider */}
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
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <h2 className="text-5xl font-bold mb-6 font-serif leading-tight text-gold-500">Join Our Family</h2>
                        <blockquote className="text-xl italic text-gray-300 mb-4 border-l-4 border-gold-500 pl-4">
                            &ldquo;For where two or three are gathered together in my name, there am I in the midst of them.&rdquo;
                        </blockquote>
                        <p className="text-gold-400 font-bold">— Matthew 18:20</p>
                    </motion.div>
                </div>
            </div>

            {/* Right Side: Registration Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md bg-dark-800 p-8 sm:p-10 rounded-2xl border border-white/5 shadow-2xl relative"
                >
                    <div className="text-center mb-8">
                        <div className="inline-flex p-4 bg-gold-500/10 rounded-full mb-4">
                            <UserPlus className="text-gold-500" size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">{t('Create Account')}</h2>
                        <p className="text-gray-400 mt-2">Start your journey with us today</p>
                    </div>

                    {error && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-3 text-sm"
                        >
                            <AlertCircle size={18} />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-300 ml-1">Username</label>
                            <input
                                type="text"
                                className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 focus:border-gold-500/50 outline-none transition-all text-white"
                                placeholder="choose_username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                            <input
                                type="email"
                                className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 focus:border-gold-500/50 outline-none transition-all text-white"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Password Field with Toggle */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 pr-11 focus:border-gold-500/50 outline-none transition-all text-white"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    minLength={6}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gold-500 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-500 ml-1 italic">*Minimum 6 characters</p>
                        </div>

                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={() => setShowAdminField(!showAdminField)}
                                className="text-xs text-gold-500/70 hover:text-gold-500 flex items-center gap-1 transition-colors"
                            >
                                <Shield size={14} /> {showAdminField ? 'Register as standard member' : 'Staff or Admin?'}
                            </button>
                            
                            <AnimatePresence>
                                {showAdminField && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }} className="overflow-hidden"
                                    >
                                        <div className="relative mt-2">
                                            <input
                                                type={showAdminSecret ? "text" : "password"}
                                                className="w-full bg-dark-900 border border-gold-500/30 rounded-xl p-3 pr-11 outline-none text-white text-sm"
                                                placeholder="Enter Staff Invite Code"
                                                value={adminSecret}
                                                onChange={(e) => setAdminSecret(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowAdminSecret(!showAdminSecret)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gold-500 transition-colors"
                                            >
                                                {showAdminSecret ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gold-500 hover:bg-gold-600 text-black font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 mt-4"
                        >
                            {loading ? <><Loader2 size={20} className="animate-spin" /> Creating Account...</> : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-gray-400 text-sm">
                            Already part of the family?{' '}
                            <Link to="/login" className="text-gold-500 hover:text-white font-bold transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;