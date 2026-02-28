import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Footer from './Footer';
import api from '../api';
import { toMediaUrl } from '../utils/uploads';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [siteConfig, setSiteConfig] = useState({ siteTitle: 'GraceLight', logoUrl: '' });
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const sync = () => {
            try {
                setUserInfo(JSON.parse(localStorage.getItem('userInfo')));
            } catch {
                setUserInfo(null);
            }
        };
        sync();
        window.addEventListener('storage', sync);
        return () => window.removeEventListener('storage', sync);
    }, [location.pathname]);

    useEffect(() => {
        const loadConfig = async () => {
            try {
                const { data } = await api.get('/api/config');
                setSiteConfig({
                    siteTitle: data?.siteTitle || 'GraceLight',
                    logoUrl: data?.logoUrl || '',
                });
            } catch (_error) {}
        };
        loadConfig();
    }, []);

    const toggleLang = () => i18n.changeLanguage(i18n.language === 'en' ? 'am' : 'en');

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        setUserInfo(null);
        navigate('/');
    };

    const mainLinks = [
        { name: t('Home'), path: '/' },
        { name: t('Sermons'), path: '/sermons' },
        { name: t('Giving'), path: '/give' },
        { name: 'Chat', path: '/chat' },
        { name: 'Events', path: '/events' },
        { name: 'Courses', path: '/courses' },
    ];

    const moreLinks = [
        { name: t('About'), path: '/about' },
         { name: 'Verse', path: '/verses' },
        { name: 'Contact', path: '/contact' },
        { name: 'Announcements', path: '/announcements' },
        { name: 'Books', path: '/books' },
        { name: 'Blog', path: '/blog' },
        { name: 'Prayer', path: '/prayer' },
        { name: 'Testimonies', path: '/testimonies' },

    ];

    const linkClass = (path) =>
        `px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === path ? 'text-gold-500' : 'text-gray-300 hover:text-gold-400'}`;

    return (
        <nav className="bg-dark-900 border-b border-gold-500/20 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="text-xl sm:text-2xl font-serif font-bold text-gold-500 shrink-0 flex items-center gap-2 min-w-0">
                        {siteConfig.logoUrl && <img src={toMediaUrl(siteConfig.logoUrl)} alt={siteConfig.siteTitle} className="h-8 w-8 rounded-full object-cover" />}
                        <span className="truncate">{siteConfig.siteTitle || 'GraceLight'}</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {mainLinks.map((link) => (
                            <Link key={link.name} to={link.path} className={linkClass(link.path)}>
                                {link.name}
                            </Link>
                        ))}
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
                                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${dropdownOpen ? 'text-gold-500' : 'text-gray-300 hover:text-gold-400'}`}
                            >
                                More <ChevronDown size={16} />
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-1 w-48 py-2 bg-dark-800 border border-gold-500/20 rounded-lg shadow-xl z-50 max-h-80 overflow-auto">
                                    {moreLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            to={link.path}
                                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-dark-700 hover:text-gold-500"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {userInfo ? (
                            <div className="flex items-center gap-2 ml-2">
                                {userInfo.role === 'admin' ? (
                                    <Link to="/admin" className={linkClass('/admin')}>Admin</Link>
                                ) : (
                                    <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
                                )}
                                <button onClick={handleLogout} className="flex items-center gap-1 px-3 py-2 text-sm text-gray-400 hover:text-red-400">
                                    <LogOut size={18} /> Logout
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="btn-outline text-sm ml-2">{t('Login')}</Link>
                        )}
                    </div>

                    <button className="md:hidden p-2 rounded-md text-gold-500 hover:text-white" onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden bg-dark-800 border-t border-gold-500/10">
                    <div className="px-2 py-3 space-y-1">
                        {[...mainLinks, ...moreLinks].map((link) => (
                            <Link key={link.name + link.path} to={link.path} className="block px-3 py-2 rounded text-gray-300 hover:bg-dark-700 hover:text-gold-500" onClick={() => setIsOpen(false)}>
                                {link.name}
                            </Link>
                        ))}
                        <button onClick={toggleLang} className="block w-full text-left px-3 py-2 text-gray-300 hover:text-gold-500">
                            {i18n.language === 'en' ? 'Amharic' : 'English'}
                        </button>
                        {userInfo ? (
                            <>
                                {userInfo.role === 'admin' && <Link to="/admin" className="block px-3 py-2 text-gold-500" onClick={() => setIsOpen(false)}>Admin</Link>}
                                {userInfo.role !== 'admin' && <Link to="/dashboard" className="block px-3 py-2 text-gold-500" onClick={() => setIsOpen(false)}>Dashboard</Link>}
                                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-red-400">Logout</button>
                            </>
                        ) : (
                            <Link to="/login" className="block px-3 py-2 text-gold-500" onClick={() => setIsOpen(false)}>{t('Login')}</Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

const Layout = ({ children }) => (
    <div className="min-h-screen flex flex-col bg-dark-900 text-white">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
    </div>
);

export default Layout;
