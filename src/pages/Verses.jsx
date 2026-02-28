import React, { useState, useEffect } from 'react';
import api from '../api';
import { Share2, Copy } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { toMediaUrl } from '../utils/uploads';

const Verses = () => {
    const [verses, setVerses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVerses = async () => {
            try {
                const { data } = await api.get('/api/verses');
                setVerses(Array.isArray(data) ? data : data.items || []);
            } catch (error) {
                setVerses([]);
            } finally {
                setLoading(false);
            }
        };
        fetchVerses();
    }, []);

    const copyVerse = async (verse) => {
        const text = `"${verse.text}" — ${verse.reference}`;
        await navigator.clipboard.writeText(text);
        alert('Verse copied');
    };

    const shareVerse = async (verse) => {
        const text = `"${verse.text}" — ${verse.reference}`;
        if (navigator.share) {
            await navigator.share({ text, title: verse.reference });
            return;
        }
        await navigator.clipboard.writeText(text);
        alert('Share not supported on this device. Verse copied instead.');
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <Breadcrumb items={[{ label: 'Verses' }]} />
            <h1 className="text-4xl font-bold mb-8 text-center text-gold-500">Daily Verses</h1>
            {loading ? (
                <div className="text-center text-gold-500 py-12">Loading...</div>
            ) : (
                <div className="space-y-6">
                    {verses.map((verse) => (
                        <div key={verse._id} className="card border-l-4 border-l-gold-500 overflow-hidden">
                            {verse.image && (
                                <img src={toMediaUrl(verse.image)} alt={verse.reference} className="w-full h-52 object-cover rounded mb-4" />
                            )}
                            <p className="text-2xl font-serif italic mb-4">"{verse.text}"</p>
                            <div className="flex justify-between items-center gap-4">
                                <span className="text-xl font-bold text-gray-300">- {verse.reference}</span>
                                <div className="flex space-x-2">
                                    <button className="p-2 hover:text-gold-500" title="Copy" onClick={() => copyVerse(verse)}><Copy size={20} /></button>
                                    <button className="p-2 hover:text-gold-500" title="Share" onClick={() => shareVerse(verse)}><Share2 size={20} /></button>
                                </div>
                            </div>
                            {verse.theme && <div className="mt-2 text-sm text-gray-500 uppercase tracking-widest">{verse.theme}</div>}
                        </div>
                    ))}
                    {verses.length === 0 && <div className="text-center py-10 text-gray-500">No verses available.</div>}
                </div>
            )}
        </div>
    );
};

export default Verses;
