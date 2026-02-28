import React, { useMemo, useState, useEffect } from 'react';
import api from '../api';
import { Download, ShoppingCart, Search, BookOpen } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { toMediaUrl } from '../utils/uploads';

const Books = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const { data } = await api.get('/api/books');
                setBooks(Array.isArray(data) ? data : data.items || []);
            } catch (error) {
                setBooks([]);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    const filtered = useMemo(() => {
        return books.filter((book) => {
            const text = `${book.title} ${book.author} ${book.description}`.toLowerCase();
            const matchesSearch = text.includes(search.toLowerCase());
            const matchesFilter = filter === 'all' ? true : filter === 'free' ? !book.isPaid : book.isPaid;
            return matchesSearch && matchesFilter;
        });
    }, [books, search, filter]);

    const handleOpenBook = (book) => {
        if (book.isPaid) {
            alert('Checkout integration is pending. This action can be linked to your payment flow.');
            return;
        }

        if (book.fileUrl) {
            window.open(toMediaUrl(book.fileUrl), '_blank', 'noopener,noreferrer');
        } else {
            alert('No downloadable file has been added for this resource yet.');
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-12 px-4">
            <Breadcrumb items={[{ label: 'Books' }]} />
            <h1 className="text-4xl font-bold mb-8 text-center text-gold-500">Books & Resources</h1>

            <div className="card mb-8 flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-3 text-gray-500" />
                    <input
                        className="input-field pl-9"
                        placeholder="Search books or authors"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select className="input-field md:w-52" value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="all">All books</option>
                    <option value="free">Free only</option>
                    <option value="paid">Paid only</option>
                </select>
            </div>

            {loading ? (
                <div className="text-center text-gold-500 py-12">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filtered.map((book) => (
                        <div key={book._id} className="card hover:translate-y-[-5px] transition-transform flex flex-col">
                            <img src={toMediaUrl(book.coverImage || book.thumbnail) || 'https://placehold.co/300x450'} alt={book.title} className="w-full h-64 object-cover rounded-md mb-4" />
                            <h3 className="text-xl font-bold mb-1">{book.title}</h3>
                            <p className="text-sm text-gray-400 mb-2">by {book.author}</p>
                            <p className="text-gray-300 text-sm mb-4 line-clamp-3 flex-1">{book.description}</p>
                            <div className="flex items-center justify-between mt-auto">
                                <span className="font-bold text-gold-500">{book.isPaid ? `ETB ${Number(book.price || 0).toLocaleString()}` : 'Free'}</span>
                                <button className="btn-primary py-1 px-3 text-sm flex items-center" onClick={() => handleOpenBook(book)}>
                                    {book.isPaid ? <ShoppingCart size={16} className="mr-1" /> : <Download size={16} className="mr-1" />}
                                    {book.isPaid ? 'Buy' : 'Open'}
                                </button>
                            </div>
                            {book.fileUrl && !book.isPaid && (
                                <a href={toMediaUrl(book.fileUrl)} target="_blank" rel="noreferrer" className="text-xs text-gray-500 hover:text-gold-500 mt-2 flex items-center gap-1">
                                    <BookOpen size={14} /> Direct link
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {!loading && filtered.length === 0 && <div className="text-center py-12 text-gray-500">No books match your filters.</div>}
        </div>
    );
};

export default Books;
