import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
    const testimonials = [
        {
            id: 1,
            name: "Abenezer Akalu.",
            role: "Member",
            text: "GraceLight Church has been a home for me. The sermons are life-changing and the community is so welcoming.",
            image: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        {
            id: 2,
            name: "Haset Dawit",
            role: "Member",
            text: "Serving in the media team has helped me grow spiritually and technically. I love the excellence here.",
            image: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
            id: 3,
            name: "Selmawit",
            role: "Member",
            text: "I visited Hawassa for a conference and attended Sunday service. The worship experience was heavenly.",
            image: "https://randomuser.me/api/portraits/women/68.jpg"
        }
    ];

    return (
        <section className="py-20 bg-dark-900 border-t border-dark-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white mb-4">What Our Family Says</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">Testimonies of God's grace and the impact of our ministry.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t) => (
                        <div key={t.id} className="bg-dark-800 p-8 rounded-lg border border-gold-500/5 relative">
                            <div className="absolute -top-6 left-8">
                                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full border-2 border-gold-500" />
                            </div>
                            <div className="flex mb-4 mt-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} className="text-gold-500 fill-gold-500" />
                                ))}
                            </div>
                            <p className="text-gray-300 italic mb-6">"{t.text}"</p>
                            <div>
                                <h4 className="font-bold text-white">{t.name}</h4>
                                <span className="text-xs text-gold-500 uppercase tracking-widest">{t.role}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
