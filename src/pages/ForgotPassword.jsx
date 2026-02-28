import api from '../api';
import { useState } from 'react';
import {motion} from 'framer-motion'
import {Link} from 'react-router-dom'
const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/auth/forgot-password', { email });
            setSubmitted(true);
            setError('');
        } catch (error) {
            setError(error.response?.data?.message || "Failed to send reset link");
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-64px)] bg-dark-900 items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-dark-800 p-8 rounded-lg border border-gold-500/20 shadow-2xl relative overflow-hidden"
            >
                {/* Background decorative element */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gold-600 to-gold-400"></div>

                {!submitted ? (
                    <>
                        <h2 className="text-2xl font-bold text-center text-gold-500 mb-2">Forgot Password?</h2>
                        <p className="text-gray-400 text-center mb-8 text-sm">Enter your email address and we'll send you a link to reset your password.</p>
                        {error && (
                            <div className="mb-4 rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-400 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    className="input-field"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn-primary w-full py-3 text-lg">
                                Send Reset Link
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Check your email</h3>
                        <p className="text-gray-400 mb-6">We've sent a password reset link to <span className="text-gold-500">{email}</span>.</p>
                        <button
                            onClick={() => setSubmitted(false)}
                            className="text-gray-500 hover:text-white text-sm"
                        >
                            Try with another email
                        </button>
                    </div>
                )}

                <div className="mt-8 text-center pt-6 border-t border-gold-500/10">
                    <Link to="/login" className="text-gold-500 hover:text-white flex items-center justify-center gap-2">
                        ← Back to Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
