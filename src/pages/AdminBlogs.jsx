import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Edit, Trash, X } from 'lucide-react';
import { uploadFile, toMediaUrl } from '../utils/uploads';

const initialForm = {
    title: '',
    content: '',
    author: '',
    image: '',
};

const AdminBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploadingImage, setUploadingImage] = useState(false);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/api/blogs');
            setBlogs(Array.isArray(data) ? data : data.items || []);
        } catch (error) {
            console.error('Error fetching blogs:', error);
            setBlogs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleImageUpload = async (file) => {
        if (!file) return;
        try {
            setUploadingImage(true);
            const uploaded = await uploadFile(file, 'blogs');
            setFormData((prev) => ({ ...prev, image: uploaded.url }));
        } catch (error) {
            alert(error.response?.data?.message || error.message || 'Image upload failed');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/api/blogs/${editingId}`, formData);
            } else {
                await api.post('/api/blogs', formData);
            }
            await fetchBlogs();
            closeModal();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to save blog');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this blog?')) return;
        try {
            await api.delete(`/api/blogs/${id}`);
            setBlogs((prev) => prev.filter((blog) => blog._id !== id));
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete blog');
        }
    };

    const openModal = (blog = null) => {
        if (blog) {
            setFormData({
                title: blog.title || '',
                content: blog.content || '',
                author: blog.author || '',
                image: blog.image || '',
            });
            setEditingId(blog._id);
        } else {
            setFormData(initialForm);
            setEditingId(null);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData(initialForm);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gold-500">Manage Blogs</h1>
                <button onClick={() => openModal()} className="btn-primary flex items-center">
                    <Plus size={20} className="mr-2" /> New Blog
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gold-500">Loading...</div>
            ) : (
                <div className="bg-dark-800 rounded-lg overflow-hidden border border-gold-500/10">
                    <table className="w-full text-left">
                        <thead className="bg-dark-700 text-gray-400 uppercase text-xs">
                            <tr>
                                <th className="p-4">Title</th>
                                <th className="p-4">Author</th>
                                <th className="p-4">Date</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-700">
                            {blogs.map((blog) => (
                                <tr key={blog._id} className="hover:bg-dark-700/50">
                                    <td className="p-4 font-medium">{blog.title}</td>
                                    <td className="p-4 text-gray-400">{blog.author}</td>
                                    <td className="p-4 text-gray-500">{blog.date ? new Date(blog.date).toLocaleDateString() : '—'}</td>
                                    <td className="p-4 flex justify-end gap-2">
                                        <button onClick={() => openModal(blog)} className="text-blue-400 hover:text-white p-1">
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(blog._id)} className="text-red-400 hover:text-white p-1">
                                            <Trash size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {blogs.length === 0 && <div className="text-center py-12 text-gray-500">No blogs yet.</div>}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-dark-800 rounded-lg w-full max-w-2xl border border-gold-500/20">
                        <div className="flex justify-between items-center p-6 border-b border-dark-700">
                            <h2 className="text-xl font-bold">{editingId ? 'Edit Blog' : 'New Blog'}</h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-gray-400 mb-1">Title</label>
                                <input
                                    className="input-field"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-1">Author</label>
                                <input
                                    className="input-field"
                                    value={formData.author}
                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-1">Image URL</label>
                                <input
                                    className="input-field"
                                    placeholder="https://... or uploaded image"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                />
                                <div className="mt-2 flex items-center gap-3">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e.target.files?.[0])}
                                        className="text-sm text-gray-400"
                                    />
                                    {uploadingImage && <span className="text-xs text-gold-500">Uploading image...</span>}
                                </div>
                                {formData.image && (
                                    <img
                                        src={toMediaUrl(formData.image)}
                                        alt="Blog preview"
                                        className="mt-3 h-28 w-full max-w-sm object-cover rounded"
                                    />
                                )}
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-1">Content</label>
                                <textarea
                                    className="input-field h-40"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex justify-end pt-4">
                                <button type="button" onClick={closeModal} className="btn-outline mr-4">Cancel</button>
                                <button type="submit" className="btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBlogs;
