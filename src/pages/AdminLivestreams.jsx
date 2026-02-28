import React, { useEffect, useMemo, useRef, useState } from 'react';
import api from '../api';
import { uploadFile, toMediaUrl } from '../utils/uploads';

const AdminLivestreams = () => {
    const [stream, setStream] = useState({
        title: '',
        url: '',
        recordingUrl: '',
        thumbnail: '',
        description: '',
        chatEnabled: true,
    });
    const [loading, setLoading] = useState(true);
    const [streamId, setStreamId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [recording, setRecording] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState(null);
    const [uploading, setUploading] = useState({ video: false, thumb: false });

    const mediaRecorderRef = useRef(null);
    const liveStreamRef = useRef(null);
    const chunksRef = useRef([]);
    const previewRef = useRef(null);
    const previewUrlRef = useRef(null);

    const canRecord = useMemo(() => typeof window !== 'undefined' && !!window.MediaRecorder, []);

    useEffect(() => {
        const fetchStream = async () => {
            try {
                const { data } = await api.get('/api/livestreams');
                const list = Array.isArray(data) ? data : data.items || [];
                if (list.length > 0) {
                    setStream({
                        title: list[0].title || '',
                        url: list[0].url || '',
                        recordingUrl: list[0].recordingUrl || '',
                        thumbnail: list[0].thumbnail || '',
                        description: list[0].description || '',
                        chatEnabled: list[0].chatEnabled !== false,
                    });
                    setStreamId(list[0]._id);
                }
            } catch (error) {
                console.error('Error fetching livestream:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStream();

        return () => {
            if (liveStreamRef.current) {
                liveStreamRef.current.getTracks().forEach((track) => track.stop());
            }
            if (previewUrlRef.current) {
                URL.revokeObjectURL(previewUrlRef.current);
                previewUrlRef.current = null;
            }
        };
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            if (streamId) {
                await api.put(`/api/livestreams/${streamId}`, stream);
            } else {
                const { data } = await api.post('/api/livestreams', stream);
                setStreamId(data._id);
            }
            alert('Stream configuration updated');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update stream');
        } finally {
            setSaving(false);
        }
    };

    const uploadThumbnail = async (file) => {
        if (!file) return;
        try {
            setUploading((s) => ({ ...s, thumb: true }));
            const uploaded = await uploadFile(file, 'livestreams');
            setStream((s) => ({ ...s, thumbnail: uploaded.url }));
        } catch (error) {
            alert(error.response?.data?.message || error.message || 'Thumbnail upload failed');
        } finally {
            setUploading((s) => ({ ...s, thumb: false }));
        }
    };

    const startRecording = async () => {
        if (!canRecord) {
            alert('MediaRecorder is not supported in this browser');
            return;
        }

        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            liveStreamRef.current = mediaStream;
            chunksRef.current = [];
            if (previewRef.current) {
                if (previewUrlRef.current) {
                    URL.revokeObjectURL(previewUrlRef.current);
                    previewUrlRef.current = null;
                }
                previewRef.current.srcObject = mediaStream;
                previewRef.current.muted = true;
                previewRef.current.play().catch(() => {});
            }

            mediaRecorderRef.current = new MediaRecorder(mediaStream, {
                mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
                    ? 'video/webm;codecs=vp9,opus'
                    : 'video/webm',
            });

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) chunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'video/webm' });
                setRecordedBlob(blob);
                if (previewRef.current) {
                    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
                    previewUrlRef.current = URL.createObjectURL(blob);
                    previewRef.current.srcObject = null;
                    previewRef.current.src = previewUrlRef.current;
                    previewRef.current.load();
                }
                if (liveStreamRef.current) {
                    liveStreamRef.current.getTracks().forEach((track) => track.stop());
                    liveStreamRef.current = null;
                }
            };

            mediaRecorderRef.current.start(1000);
            setRecording(true);
        } catch (error) {
            alert(error.message || 'Failed to start camera recording');
        }
    };

    const stopRecording = () => {
        if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') return;
        mediaRecorderRef.current.stop();
        setRecording(false);
    };

    const uploadRecording = async () => {
        if (!recordedBlob) return;
        try {
            setUploading((s) => ({ ...s, video: true }));
            const file = new File([recordedBlob], `livestream-${Date.now()}.webm`, { type: 'video/webm' });
            const uploaded = await uploadFile(file, 'livestreams');
            setStream((s) => ({ ...s, recordingUrl: uploaded.url }));
            alert('Recorded video uploaded. Save stream settings to persist.');
        } catch (error) {
            alert(error.response?.data?.message || error.message || 'Video upload failed');
        } finally {
            setUploading((s) => ({ ...s, video: false }));
        }
    };

    if (loading) {
        return <div className="text-center py-20 text-gold-500">Loading livestream settings...</div>;
    }

    return (
        <div className="max-w-3xl">
            <h1 className="text-3xl font-bold mb-8 text-gold-500">Manage Livestream</h1>

            <div className="card">
                <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                        <label className="block text-gray-300 mb-2">Stream Title</label>
                        <input className="input-field" value={stream.title} onChange={(e) => setStream({ ...stream, title: e.target.value })} />
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">Live Stream URL (YouTube/Facebook/etc)</label>
                        <input className="input-field" value={stream.url} onChange={(e) => setStream({ ...stream, url: e.target.value })} />
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">Recorded Video URL</label>
                        <input className="input-field" value={stream.recordingUrl || ''} onChange={(e) => setStream({ ...stream, recordingUrl: e.target.value })} />
                        {stream.recordingUrl && (
                            <video className="mt-3 w-full rounded" controls src={toMediaUrl(stream.recordingUrl)} />
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">Thumbnail URL</label>
                        <input className="input-field" value={stream.thumbnail || ''} onChange={(e) => setStream({ ...stream, thumbnail: e.target.value })} />
                        <div className="mt-2 flex items-center gap-3">
                            <input type="file" accept="image/*" onChange={(e) => uploadThumbnail(e.target.files?.[0])} className="text-sm text-gray-400" />
                            {uploading.thumb && <span className="text-xs text-gold-500">Uploading thumbnail...</span>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">Description</label>
                        <textarea className="input-field h-24" value={stream.description} onChange={(e) => setStream({ ...stream, description: e.target.value })} />
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={stream.chatEnabled}
                                onChange={(e) => setStream({ ...stream, chatEnabled: e.target.checked })}
                                className="w-5 h-5 text-gold-500 rounded focus:ring-gold-500 bg-dark-700 border-gray-600"
                            />
                            <span className="text-gray-300">Enable Chat</span>
                        </label>
                    </div>

                    <div className="border-t border-dark-700 pt-6">
                        <h2 className="text-lg font-semibold mb-3 text-gray-200">Local Camera Recording</h2>
                        <p className="text-sm text-gray-500 mb-3">Record directly from your camera, upload the video, then click Save.</p>
                        <div className="flex gap-2 mb-3">
                            <button type="button" onClick={startRecording} disabled={recording} className="btn-outline disabled:opacity-50">Start Recording</button>
                            <button type="button" onClick={stopRecording} disabled={!recording} className="btn-outline disabled:opacity-50">Stop</button>
                            <button type="button" onClick={uploadRecording} disabled={!recordedBlob || uploading.video} className="btn-primary disabled:opacity-50">
                                {uploading.video ? 'Uploading video...' : 'Upload Recording'}
                            </button>
                        </div>
                        <video ref={previewRef} className="w-full rounded bg-black" controls muted />
                    </div>

                    <div className="pt-4 border-t border-dark-700">
                        <button type="submit" disabled={saving} className="btn-primary w-full md:w-auto disabled:opacity-50">
                            {saving ? 'Saving...' : 'Update Stream Settings'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLivestreams;
