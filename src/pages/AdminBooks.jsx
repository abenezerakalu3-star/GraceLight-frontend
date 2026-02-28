import React, { useEffect, useState } from 'react';
import api from '../api';
import { Edit, Plus, Trash, X } from 'lucide-react';
import { uploadFile, toMediaUrl } from '../utils/uploads';

const initialForm = {
    title: '',
    author: '',
    description: '',
    coverImage: '',
    fileUrl: '',
    isPaid: false,
    price: 0,
};

const AdminBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(initialForm);
    const [uploading, setUploading] = useState({ cover: false, file: false });

    const fetchBooks = async () => {
        try {
            const { data } = await api.get('/api/books');
            setBooks(Array.isArray(data) ? data : data.items || []);
        } catch (error) {
            console.error(error);
            setBooks([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const openModal = (book = null) => {
        if (book) {
            setForm({
                title: book.title || '',
                author: book.author || '',
                description: book.description || '',
                coverImage: book.coverImage || book.thumbnail || '',
                fileUrl: book.fileUrl || '',
                isPaid: Boolean(book.isPaid),
                price: Number(book.price || 0),
            });
            setEditingId(book._id);
        } else {
            setForm(initialForm);
            setEditingId(null);
        }
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingId(null);
        setForm(initialForm);
    };

    const handleUpload = async (file, type) => {
        if (!file) return;
        try {
            setUploading((s) => ({ ...s, [type]: true }));
            const uploaded = await uploadFile(file, 'books');
            if (type === 'cover') setForm((prev) => ({ ...prev, coverImage: uploaded.url }));
            if (type === 'file') setForm((prev) => ({ ...prev, fileUrl: uploaded.url }));
        } catch (error) {
            alert(error.response?.data?.message || error.message || 'Upload failed');
        } finally {
            setUploading((s) => ({ ...s, [type]: false }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            price: form.isPaid ? Number(form.price || 0) : 0,
        };

        try {
            if (editingId) {
                await api.put(`/api/books/${editingId}`, payload);
            } else {
                await api.post('/api/books', payload);
            }
            closeModal();
            fetchBooks();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to save book');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this book?')) return;
        try {
            await api.delete(`/api/books/${id}`);
            setBooks((prev) => prev.filter((book) => book._id !== id));
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete book');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gold-500">Manage Books</h1>
                <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
                    <Plus size={20} /> New Book
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gold-500">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {books.map((book) => (
                        <div key={book._id} className="card flex flex-col">
                            <img src={toMediaUrl(book.coverImage || book.thumbnail) || 'https://placehold.co/300x450'} alt={book.title} className="w-full h-52 object-cover rounded mb-4" />
                            <h3 className="font-bold text-lg">{book.title}</h3>
                            <p className="text-sm text-gray-400 mb-2">{book.author}</p>
                            <p className="text-sm text-gray-300 line-clamp-3 flex-1">{book.description}</p>
                            <div className="mt-4 flex items-center justify-between">
                                <span className={`text-xs px-2 py-1 rounded ${book.isPaid ? 'bg-gold-500 text-black' : 'bg-green-500/20 text-green-400'}`}>
                                    {book.isPaid ? `Paid (ETB ${Number(book.price || 0).toLocaleString()})` : 'Free'}
                                </span>
                                <div className="flex gap-2">
                                    <button onClick={() => openModal(book)} className="text-blue-400 hover:text-blue-300"><Edit size={18} /></button>
                                    <button onClick={() => handleDelete(book._id)} className="text-red-400 hover:text-red-300"><Trash size={18} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && books.length === 0 && <div className="text-center py-12 text-gray-500">No books yet.</div>}

            {modalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-dark-800 rounded-lg w-full max-w-xl border border-gold-500/20">
                        <div className="p-6 border-b border-dark-700 flex items-center justify-between">
                            <h2 className="text-xl font-bold">{editingId ? 'Edit Book' : 'Create Book'}</h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-white"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <input className="input-field" placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
                            <input className="input-field" placeholder="Author" value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} required />
                            <input className="input-field" placeholder="Cover image URL" value={form.coverImage} onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))} />
                            <div className="flex items-center gap-3">
                                <input type="file" accept="image/*" onChange={(e) => handleUpload(e.target.files?.[0], 'cover')} className="text-sm text-gray-400" />
                                {uploading.cover && <span className="text-xs text-gold-500">Uploading cover...</span>}
                            </div>
                            {form.coverImage && <img src={toMediaUrl(form.coverImage)} alt="Cover preview" className="h-28 rounded object-cover" />}

                            <input className="input-field" placeholder="File URL (PDF/Resource)" value={form.fileUrl} onChange={(e) => setForm((f) => ({ ...f, fileUrl: e.target.value }))} />
                            <div className="flex items-center gap-3">
                                <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip,.mp4,.webm,image/*" onChange={(e) => handleUpload(e.target.files?.[0], 'file')} className="text-sm text-gray-400" />
                                {uploading.file && <span className="text-xs text-gold-500">Uploading file...</span>}
                            </div>

                            <textarea className="input-field h-24" placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} required />
                            <div className="flex items-center gap-3">
                                <label className="text-sm text-gray-300">Paid resource?</label>
                                <input type="checkbox" checked={form.isPaid} onChange={(e) => setForm((f) => ({ ...f, isPaid: e.target.checked }))} />
                            </div>
                            {form.isPaid && (
                                <input type="number" min="0" className="input-field" placeholder="Price (ETB)" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} required />
                            )}
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

export default AdminBooks;
