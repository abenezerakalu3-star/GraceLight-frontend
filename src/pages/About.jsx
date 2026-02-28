import React from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, Globe, BookOpen } from 'lucide-react';

const About = () => {
    return (
        <div className="flex flex-col">
            {/* Hero */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=1000&auto=format&fit=crop"
                        alt="Church Congregation"
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-dark-900/80 via-dark-900/50 to-dark-900"></div>
                </div>
                <div className="relative z-10 text-center px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold text-white mb-6 font-serif"
                    >
                        About <span className="text-gold-500">GraceLight</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-300 max-w-3xl mx-auto"
                    >
                        A community dedicated to spreading the light of God's love to the world.
                    </motion.p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-24 px-4 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold text-gold-500 mb-6 font-serif">Our Story</h2>
                        <p className="text-gray-300 mb-4 leading-relaxed">
                            Founded in 2010, GraceLight Church started as a small bible study group and has grown into a vibrant community of believers. We are driven by a passion to see lives transformed by the Gospel.
                        </p>
                        <p className="text-gray-300 leading-relaxed">
                            We believe in the power of community, the authority of Scripture, and the active presence of the Holy Spirit in our daily lives.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-2 gap-6"
                    >
                        <div className="card text-center p-6">
                            <Heart className="text-gold-500 mx-auto mb-4" size={32} />
                            <h3 className="text-xl font-bold mb-2">Love</h3>
                            <p className="text-sm text-gray-400">Loving God and loving people intentionally.</p>
                        </div>
                        <div className="card text-center p-6">
                            <Globe className="text-gold-500 mx-auto mb-4" size={32} />
                            <h3 className="text-xl font-bold mb-2">Outreach</h3>
                            <p className="text-sm text-gray-400">Impacting our city and the nations.</p>
                        </div>
                        <div className="card text-center p-6">
                            <BookOpen className="text-gold-500 mx-auto mb-4" size={32} />
                            <h3 className="text-xl font-bold mb-2">Truth</h3>
                            <p className="text-sm text-gray-400">Anchored in the unshakeable Word of God.</p>
                        </div>
                        <div className="card text-center p-6">
                            <Users className="text-gold-500 mx-auto mb-4" size={32} />
                            <h3 className="text-xl font-bold mb-2">Community</h3>
                            <p className="text-sm text-gray-400">Doing life together in authentic fellowship.</p>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default About;
