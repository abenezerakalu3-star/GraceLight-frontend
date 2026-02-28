import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';

// Public Pages
import Home from './pages/Home';
import Livestream from './pages/Livestream';
import Give from './pages/Give';
import Courses from './pages/Courses';
import Books from './pages/Books';
import Verses from './pages/Verses';
import Blog from './pages/Blog';
import About from './pages/About';
import Contact from './pages/Contact';
import Events from './pages/Events';
import Prayer from './pages/Prayer';
import Testimonies from './pages/Testimonies';
import Announcements from './pages/Announcements';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import UserDashboard from './pages/UserDashboard';
import Chat from './pages/Chat';

// Admin Pages
import Dashboard from './pages/Dashboard';
import AdminBlogs from './pages/AdminBlogs';
import AdminLivestreams from './pages/AdminLivestreams';
import AdminSettings from './pages/AdminSettings';
import AdminContacts from './pages/AdminContacts';
import AdminNewsletter from './pages/AdminNewsletter';
import AdminEvents from './pages/AdminEvents';
import AdminPrayer from './pages/AdminPrayer';
import AdminAnnouncements from './pages/AdminAnnouncements';
import AdminTestimonies from './pages/AdminTestimonies';
import { Navigate } from 'react-router-dom';
import AdminOfferings from './pages/AdminOfferings';
import AdminCourses from './pages/AdminCourses';
import AdminBooks from './pages/AdminBooks';
import AdminUsers from './pages/AdminUsers';
import AdminVerses from './pages/AdminVerses';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
    let userInfo = null;
    try {
        userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
    } catch (_) {
        userInfo = null;
    }

    if (!userInfo?.token) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && userInfo.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/about" element={<Layout><About /></Layout>} />
                <Route path="/contact" element={<Layout><Contact /></Layout>} />
                <Route path="/blog" element={<Layout><Blog /></Layout>} />
                <Route path="/sermons" element={<Layout><Livestream /></Layout>} />
                <Route path="/give" element={<Layout><Give /></Layout>} />
                <Route path="/courses" element={<Layout><Courses /></Layout>} />
                <Route path="/books" element={<Layout><Books /></Layout>} />
                <Route path="/verses" element={<Layout><Verses /></Layout>} />
                <Route path="/events" element={<Layout><Events /></Layout>} />
                <Route path="/prayer" element={<Layout><Prayer /></Layout>} />
                <Route path="/testimonies" element={<Layout><Testimonies /></Layout>} />
                <Route path="/announcements" element={<Layout><Announcements /></Layout>} />


                {/* Auth Routes */}
                <Route path="/login" element={<Layout><Login /></Layout>} />
                <Route path="/register" element={<Layout><Register /></Layout>} />
                <Route path="/forgot-password" element={<Layout><ForgotPassword /></Layout>} />
                <Route path="/dashboard" element={<Layout><ProtectedRoute><UserDashboard /></ProtectedRoute></Layout>} />
                <Route path="/chat" element={<Layout><ProtectedRoute><Chat /></ProtectedRoute></Layout>} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout><ProtectedRoute adminOnly={true}><Dashboard /></ProtectedRoute></AdminLayout>} />
                <Route path="/admin/blogs" element={<AdminLayout><ProtectedRoute adminOnly={true}><AdminBlogs /></ProtectedRoute></AdminLayout>} />
                <Route path="/admin/livestreams" element={<AdminLayout><ProtectedRoute adminOnly={true}><AdminLivestreams /></ProtectedRoute></AdminLayout>} />
                <Route path="/admin/offerings" element={<AdminLayout><ProtectedRoute adminOnly={true}><AdminOfferings /></ProtectedRoute></AdminLayout>} />
                <Route path="/admin/courses" element={<AdminLayout><ProtectedRoute adminOnly={true}><AdminCourses /></ProtectedRoute></AdminLayout>} />
                <Route path="/admin/books" element={<AdminLayout><ProtectedRoute adminOnly={true}><AdminBooks /></ProtectedRoute></AdminLayout>} />
                <Route path="/admin/verses" element={<AdminLayout><ProtectedRoute adminOnly={true}><AdminVerses /></ProtectedRoute></AdminLayout>} />
                <Route path="/admin/users" element={<AdminLayout><ProtectedRoute adminOnly={true}><AdminUsers /></ProtectedRoute></AdminLayout>} />
                <Route path="/admin/inbox" element={<AdminLayout><ProtectedRoute adminOnly={true}><AdminContacts /></ProtectedRoute></AdminLayout>} />
                <Route path="/admin/newsletter" element={<AdminLayout><ProtectedRoute adminOnly={true}><AdminNewsletter /></ProtectedRoute></AdminLayout>} />
                <Route path="/admin/events" element={<AdminLayout><ProtectedRoute adminOnly={true}><AdminEvents /></ProtectedRoute></AdminLayout>} />
                <Route path="/admin/prayer" element={<AdminLayout><ProtectedRoute adminOnly={true}><AdminPrayer /></ProtectedRoute></AdminLayout>} />
                <Route path="/admin/announcements" element={<AdminLayout><ProtectedRoute adminOnly={true}><AdminAnnouncements /></ProtectedRoute></AdminLayout>} />
                <Route path="/admin/testimonies" element={<AdminLayout><ProtectedRoute adminOnly={true}><AdminTestimonies /></ProtectedRoute></AdminLayout>} />
                <Route path="/admin/settings" element={<AdminLayout><ProtectedRoute adminOnly={true}><AdminSettings /></ProtectedRoute></AdminLayout>} />
            </Routes>
        </Router>
    );
}

export default App;
