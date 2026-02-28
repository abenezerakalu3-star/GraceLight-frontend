import React, { useEffect, useState } from 'react';
import api from '../api';
import { Edit, Plus, Trash, X } from 'lucide-react';

const initialForm = {
    title: '',
    description: '',
    instructor: '',
    thumbnail: '',
    isPaid: false,
    price: 0,
    lessons: [],
};

const AdminCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(initialForm);

    const fetchCourses = async () => {
        try {
            const { data } = await api.get('/api/courses');
            setCourses(Array.isArray(data) ? data : data.items || []);
        } catch (error) {
            console.error(error);
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const openModal = (course = null) => {
        if (course) {
            setForm({
                title: course.title || '',
                description: course.description || '',
                instructor: course.instructor || '',
                thumbnail: course.thumbnail || '',
                isPaid: Boolean(course.isPaid),
                price: Number(course.price || 0),
                lessons: Array.isArray(course.lessons) ? course.lessons : [],
            });
            setEditingId(course._id);
        } else {
            setForm(initialForm);
            setEditingId(null);
        }
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setForm(initialForm);
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const lessons = (form.lessons || []).map((lesson) => ({
            title: String(lesson.title || '').trim(),
            videoUrl: String(lesson.videoUrl || '').trim(),
            content: String(lesson.content || '').trim(),
        }));
        const hasInvalidLesson = lessons.some((lesson) => (lesson.videoUrl || lesson.content) && !lesson.title);
        if (hasInvalidLesson) {
            alert('Each lesson must have a title.');
            return;
        }

        const payload = {
            ...form,
            price: form.isPaid ? Number(form.price || 0) : 0,
            lessons: lessons.filter((lesson) => lesson.title || lesson.videoUrl || lesson.content),
        };

        try {
            if (editingId) {
                await api.put(`/api/courses/${editingId}`, payload);
            } else {
                await api.post('/api/courses', payload);
            }
            closeModal();
            fetchCourses();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to save course');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this course?')) return;
        try {
            await api.delete(`/api/courses/${id}`);
            setCourses((prev) => prev.filter((course) => course._id !== id));
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete course');
        }
    };

    const addLesson = () => {
        setForm((f) => ({
            ...f,
            lessons: [...(f.lessons || []), { title: '', videoUrl: '', content: '' }],
        }));
    };

    const updateLesson = (index, updates) => {
        setForm((f) => ({
            ...f,
            lessons: (f.lessons || []).map((lesson, i) => (i === index ? { ...lesson, ...updates } : lesson)),
        }));
    };

    const removeLesson = (index) => {
        setForm((f) => ({
            ...f,
            lessons: (f.lessons || []).filter((_, i) => i !== index),
        }));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gold-500">Manage Courses</h1>
                <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
                    <Plus size={20} /> New Course
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gold-500">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {courses.map((course) => (
                        <div key={course._id} className="card flex flex-col">
                            <img
                                src={course.thumbnail || 'https://placehold.co/600x350'}
                                alt={course.title}
                                className="w-full h-40 object-cover rounded mb-4"
                            />
                            <h3 className="font-bold text-lg">{course.title}</h3>
                            <p className="text-sm text-gray-400 mb-2">{course.instructor}</p>
                            <p className="text-sm text-gray-300 line-clamp-3 flex-1">{course.description}</p>
                            <div className="mt-4 flex items-center justify-between">
                                <span className={`text-xs px-2 py-1 rounded ${course.isPaid ? 'bg-gold-500 text-black' : 'bg-green-500/20 text-green-400'}`}>
                                    {course.isPaid ? `Paid (ETB ${Number(course.price || 0).toLocaleString()})` : 'Free'}
                                </span>
                                <div className="flex gap-2">
                                    <button onClick={() => openModal(course)} className="text-blue-400 hover:text-blue-300"><Edit size={18} /></button>
                                    <button onClick={() => handleDelete(course._id)} className="text-red-400 hover:text-red-300"><Trash size={18} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && courses.length === 0 && <div className="text-center py-12 text-gray-500">No courses yet.</div>}

            {modalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-dark-800 rounded-lg w-full max-w-xl border border-gold-500/20">
                        <div className="p-6 border-b border-dark-700 flex items-center justify-between">
                            <h2 className="text-xl font-bold">{editingId ? 'Edit Course' : 'Create Course'}</h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-white"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <input className="input-field" placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
                            <input className="input-field" placeholder="Instructor" value={form.instructor} onChange={(e) => setForm((f) => ({ ...f, instructor: e.target.value }))} required />
                            <input className="input-field" placeholder="Thumbnail URL" value={form.thumbnail} onChange={(e) => setForm((f) => ({ ...f, thumbnail: e.target.value }))} />
                            <textarea className="input-field h-24" placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} required />
                            <div className="flex items-center gap-3">
                                <label className="text-sm text-gray-300">Paid course?</label>
                                <input type="checkbox" checked={form.isPaid} onChange={(e) => setForm((f) => ({ ...f, isPaid: e.target.checked }))} />
                            </div>
                            {form.isPaid && (
                                <input type="number" min="0" className="input-field" placeholder="Price (ETB)" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} required />
                            )}
                            <div className="border-t border-dark-700 pt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold">Lessons</h3>
                                    <button type="button" className="btn-outline" onClick={addLesson}>Add Lesson</button>
                                </div>
                                {(form.lessons || []).length === 0 && <p className="text-sm text-gray-500">No lessons added yet.</p>}
                                <div className="space-y-4">
                                    {(form.lessons || []).map((lesson, idx) => (
                                        <div key={idx} className="bg-dark-900 border border-dark-700 rounded-lg p-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="text-xs text-gray-400 uppercase tracking-wider">Lesson {idx + 1}</div>
                                                <button type="button" className="text-red-400 hover:text-red-300 text-sm" onClick={() => removeLesson(idx)}>Remove</button>
                                            </div>
                                            <input
                                                className="input-field"
                                                placeholder="Lesson Title"
                                                value={lesson.title || ''}
                                                onChange={(e) => updateLesson(idx, { title: e.target.value })}
                                            />
                                            <input
                                                className="input-field"
                                                placeholder="Video URL (optional)"
                                                value={lesson.videoUrl || ''}
                                                onChange={(e) => updateLesson(idx, { videoUrl: e.target.value })}
                                            />
                                            <textarea
                                                className="input-field h-20"
                                                placeholder="Lesson Content (optional)"
                                                value={lesson.content || ''}
                                                onChange={(e) => updateLesson(idx, { content: e.target.value })}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" className="btn-outline" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCourses;
