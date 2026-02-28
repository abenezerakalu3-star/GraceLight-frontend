import React, { useMemo, useState, useEffect } from 'react';
import api from '../api';
import { User, Search, BookOpen } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { SkeletonCard } from '../components/Skeleton';
import { toMediaUrl } from '../utils/uploads';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [priceFilter, setPriceFilter] = useState('all');
    const [selectedCourse, setSelectedCourse] = useState(null);

    useEffect(() => {
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
        fetchCourses();
    }, []);

    const filtered = useMemo(() => {
        return courses.filter((course) => {
            const text = `${course.title} ${course.description} ${course.instructor}`.toLowerCase();
            const matchesSearch = text.includes(search.toLowerCase());
            const matchesPrice =
                priceFilter === 'all' ? true : priceFilter === 'free' ? !course.isPaid : course.isPaid;
            return matchesSearch && matchesPrice;
        });
    }, [courses, search, priceFilter]);

    return (
        <div className="max-w-7xl mx-auto py-12 px-4">
            <Breadcrumb items={[{ label: 'Courses' }]} />
            <h1 className="text-4xl font-bold mb-8 text-center text-gold-500">Courses & Training</h1>

            <div className="card mb-8 flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-3 text-gray-500" />
                    <input
                        className="input-field pl-9"
                        placeholder="Search courses by title, instructor, topic"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select className="input-field md:w-52" value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
                    <option value="all">All courses</option>
                    <option value="free">Free only</option>
                    <option value="paid">Paid only</option>
                </select>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <SkeletonCard /><SkeletonCard /><SkeletonCard />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filtered.map((course) => (
                        <div key={course._id} className="card hover:border-gold-500 transition-colors flex flex-col">
                            <img src={toMediaUrl(course.thumbnail) || 'https://placehold.co/600x400'} alt={course.title} className="w-full h-48 object-cover rounded-md mb-4" />
                            <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
                            <p className="text-gray-400 mb-4 flex-grow line-clamp-3">{course.description}</p>
                            <div className="flex items-center text-sm text-gray-500 mb-4">
                                <User size={16} className="mr-1" /> {course.instructor}
                            </div>
                            <div className="flex items-center justify-between mt-auto">
                                <span className={`px-3 py-1 rounded text-sm font-bold ${course.isPaid ? 'bg-gold-500 text-black' : 'bg-green-500/20 text-green-500'}`}>
                                    {course.isPaid ? `ETB ${Number(course.price || 0).toLocaleString()}` : 'Free'}
                                </span>
                                <button className="btn-outline text-sm" onClick={() => setSelectedCourse(course)}>View Course</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && filtered.length === 0 && (
                <div className="text-center py-12 text-gray-500">No courses match your filters.</div>
            )}

            {selectedCourse && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-dark-800 rounded-lg w-full max-w-2xl border border-gold-500/20 p-6">
                        <h2 className="text-2xl font-bold mb-2">{selectedCourse.title}</h2>
                        <p className="text-gray-400 mb-4">{selectedCourse.description}</p>
                        <p className="text-sm text-gray-300 mb-4">Instructor: {selectedCourse.instructor}</p>
                        <h3 className="font-semibold mb-2 flex items-center gap-2"><BookOpen size={16} /> Lessons</h3>
                        {(selectedCourse.lessons || []).length === 0 ? (
                            <p className="text-gray-500">No lessons added yet.</p>
                        ) : (
                            <ul className="space-y-2 mb-6">
                                {selectedCourse.lessons.map((lesson, idx) => (
                                    <li key={`${lesson.title}-${idx}`} className="bg-dark-900 rounded p-3">
                                        <div className="font-medium">{lesson.title}</div>
                                        {lesson.content && <div className="text-sm text-gray-400 mt-1">{lesson.content}</div>}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="flex justify-end">
                            <button className="btn-primary" onClick={() => setSelectedCourse(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Courses;
