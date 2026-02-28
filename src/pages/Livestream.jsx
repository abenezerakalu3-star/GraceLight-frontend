import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Video, Send, PlayCircle } from 'lucide-react';
import api from '../api';
import Breadcrumb from '../components/Breadcrumb';
import { toMediaUrl } from '../utils/uploads';

const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    const clean = String(url).trim();
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/\s]+)/i,
        /youtube\.com\/embed\/([^&?/\s]+)/i,
        /youtube\.com\/live\/([^&?/\s]+)/i,
        /youtube\.com\/shorts\/([^&?/\s]+)/i,
    ];

    for (const pattern of patterns) {
        const match = clean.match(pattern);
        if (match?.[1]) return `https://www.youtube.com/embed/${match[1]}?autoplay=0`;
    }
    return null;
};

const isDirectVideoUrl = (url) => {
    if (!url) return false;
    const clean = String(url).trim().toLowerCase();
    return /(\.m3u8|\.mp4|\.webm|\.mov|\.m4v|\.ogg)(\?.*)?$/.test(clean) || clean.startsWith('/uploads/');
};

const getStreamSource = (url) => {
    if (!url) return { kind: null, src: '' };
    const clean = String(url).trim();

    const youtubeEmbed = getYoutubeEmbedUrl(clean);
    if (youtubeEmbed) return { kind: 'youtube', src: youtubeEmbed };

    if (isDirectVideoUrl(clean)) return { kind: 'video', src: toMediaUrl(clean) };

    if (/^https?:\/\//i.test(clean)) return { kind: 'iframe', src: clean };

    return { kind: 'video', src: toMediaUrl(clean) };
};

const Livestream = () => {
    const [stream, setStream] = useState({ title: 'Sunday Worship Service', url: '', recordingUrl: '', description: 'Live from GraceLight Church', chatEnabled: true });
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStream = async () => {
            try {
                const { data } = await api.get('/api/livestreams');
                const list = Array.isArray(data) ? data : data.items || [];
                if (list.length > 0) setStream(list[0]);
            } catch (error) {
                console.error('Error fetching livestream:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStream();
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            setMessages((prev) => [...prev, { user: 'You', text: newMessage }]);
            setNewMessage('');
        }
    };

    const source = getStreamSource(stream?.url);
    const recordingUrl = stream?.recordingUrl ? toMediaUrl(stream.recordingUrl) : '';

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="max-w-7xl mx-auto py-8 px-4 flex flex-col lg:flex-row gap-8 h-[calc(100vh-64px)]">
            <div className="lg:hidden mb-2"><Breadcrumb items={[{ label: 'Sermons' }]} /></div>
            <div className="lg:w-3/4 flex flex-col gap-4">
                <div className="aspect-video bg-black rounded-lg overflow-hidden border border-dark-700 shadow-xl flex items-center justify-center relative">
                    {loading ? (
                        <div className="text-gold-500">Loading...</div>
                    ) : source.kind === 'youtube' ? (
                        <iframe
                            src={source.src}
                            title={stream.title}
                            className="w-full h-full"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                    ) : source.kind === 'iframe' ? (
                        <iframe
                            src={source.src}
                            title={stream.title}
                            className="w-full h-full"
                            allowFullScreen
                        />
                    ) : source.kind === 'video' ? (
                        <video className="w-full h-full" controls src={source.src} poster={stream.thumbnail ? toMediaUrl(stream.thumbnail) : undefined} />
                    ) : recordingUrl ? (
                        <video className="w-full h-full" controls src={recordingUrl} poster={stream.thumbnail ? toMediaUrl(stream.thumbnail) : undefined} />
                    ) : (
                        <div className="text-center p-4">
                            <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-400">Stream Offline</h3>
                            <p className="text-gray-500">Next Service: Sunday 10:00 AM</p>
                        </div>
                    )}
                </div>

                {recordingUrl && (
                    <div className="card">
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><PlayCircle size={18} /> Latest Recorded Service</h3>
                        <video className="w-full rounded" controls src={recordingUrl} />
                    </div>
                )}

                <div>
                    <h1 className="text-2xl font-bold mb-2">{stream.title || 'Sunday Worship Service'}</h1>
                    <p className="text-gray-400">{stream.description || 'Live from GraceLight Church.'}</p>
                </div>
            </div>

            {stream.chatEnabled !== false && (
                <div className="lg:w-1/4 bg-dark-800 rounded-lg flex flex-col border border-dark-700 h-full max-h-[600px] lg:max-h-full">
                    <div className="p-4 border-b border-dark-700">
                        <h3 className="font-bold text-lg">Live Chat</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, idx) => (
                            <motion.div key={idx} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="bg-dark-700/50 p-2 rounded">
                                <span className="text-gold-500 font-bold text-xs block">{msg.user}</span>
                                <p className="text-sm">{msg.text}</p>
                            </motion.div>
                        ))}
                    </div>
                    <form onSubmit={sendMessage} className="p-4 border-t border-dark-700 flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Say something..."
                            className="input-field text-sm"
                        />
                        <button type="submit" className="btn-primary px-3">
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}
        </motion.div>
    );
};

export default Livestream;
