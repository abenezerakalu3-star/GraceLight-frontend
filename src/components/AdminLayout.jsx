import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    Video,
    Heart,
    BookOpen,
    Book,
    ScrollText,
    Users,
    Settings,
    LogOut,
    Mail,
    Newspaper,
    Calendar,
    MessageSquare,
    Pin,
    Quote,
    Menu,
    X,
    ChevronDown,
} from 'lucide-react';

const groupedLinks = [
    {
        title: 'Overview',
        links: [{ name: 'Dashboard', path: '/admin', icon: LayoutDashboard }],
    },
    {
        title: 'Content',
        links: [
            { name: 'Blogs', path: '/admin/blogs', icon: FileText },
            { name: 'Livestreams', path: '/admin/livestreams', icon: Video },
            { name: 'Events', path: '/admin/events', icon: Calendar },
            { name: 'Announcements', path: '/admin/announcements', icon: Pin },
            { name: 'Courses', path: '/admin/courses', icon: BookOpen },
            { name: 'Books', path: '/admin/books', icon: Book },
            { name: 'Verses', path: '/admin/verses', icon: ScrollText },
            { name: 'Testimonies', path: '/admin/testimonies', icon: Quote },
        ],
    },
    {
        title: 'Community',
        links: [
            { name: 'Offerings', path: '/admin/offerings', icon: Heart },
            { name: 'Prayer', path: '/admin/prayer', icon: MessageSquare },
            { name: 'Newsletter', path: '/admin/newsletter', icon: Newspaper },
            { name: 'Inbox', path: '/admin/inbox', icon: Mail },
            { name: 'Users', path: '/admin/users', icon: Users },
            { name: 'Settings', path: '/admin/settings', icon: Settings },
        ],
    },
];

const AdminLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openSections, setOpenSections] = useState({ Content: true, Community: true });

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login', { replace: true });
    };

    const currentTitle = useMemo(() => {
        for (const group of groupedLinks) {
            const match = group.links.find((l) => l.path === location.pathname);
            if (match) return match.name;
        }
        return 'Admin';
    }, [location.pathname]);

    const renderNav = (onNavigate) => (
        <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-3 px-2">
                {groupedLinks.map((group) => (
                    <li key={group.title}>
                        {group.links.length === 1 ? (
                            <div>
                                {group.links.map((link) => {
                                    const Icon = link.icon;
                                    return (
                                        <Link
                                            key={link.name}
                                            to={link.path}
                                            onClick={onNavigate}
                                            className={`flex items-center px-4 py-3 rounded-md transition-colors ${location.pathname === link.path
                                                ? 'bg-gold-500/10 text-gold-500'
                                                : 'text-gray-400 hover:bg-dark-700 hover:text-white'
                                                }`}
                                        >
                                            <Icon size={20} className="mr-3" />
                                            {link.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-dark-900/30 rounded-lg border border-gold-500/5">
                                <button
                                    type="button"
                                    onClick={() => setOpenSections((s) => ({ ...s, [group.title]: !s[group.title] }))}
                                    className="w-full flex items-center justify-between px-4 py-2 text-xs uppercase tracking-wide text-gray-500"
                                >
                                    <span>{group.title}</span>
                                    <ChevronDown size={14} className={`transition-transform ${openSections[group.title] ? 'rotate-180' : ''}`} />
                                </button>
                                {openSections[group.title] && (
                                    <div className="pb-2">
                                        {group.links.map((link) => {
                                            const Icon = link.icon;
                                            return (
                                                <Link
                                                    key={link.name}
                                                    to={link.path}
                                                    onClick={onNavigate}
                                                    className={`flex items-center px-4 py-2 rounded-md transition-colors ${location.pathname === link.path
                                                        ? 'bg-gold-500/10 text-gold-500'
                                                        : 'text-gray-400 hover:bg-dark-700 hover:text-white'
                                                        }`}
                                                >
                                                    <Icon size={18} className="mr-3" />
                                                    {link.name}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );

    return (
        <div className="min-h-screen flex bg-dark-900 text-white">
            <aside className="hidden lg:flex w-72 bg-dark-800 border-r border-gold-500/10 h-screen sticky top-0 flex-col">
                <div className="h-16 px-4 flex items-center border-b border-gold-500/10">
                    <h1 className="text-xl font-serif text-gold-500 font-bold">GraceLight Admin</h1>
                </div>
                {renderNav(undefined)}
                <div className="p-4 border-t border-gold-500/10">
                    <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-gray-400 hover:text-red-400 transition-colors">
                        <LogOut size={20} className="mr-3" />
                        Logout
                    </button>
                </div>
            </aside>

            <div className="flex-1 min-w-0 flex flex-col">
                <header className="lg:hidden h-16 px-4 border-b border-gold-500/10 bg-dark-800 flex items-center justify-between sticky top-0 z-40">
                    <button type="button" onClick={() => setMobileOpen(true)} className="p-2 rounded text-gold-500 hover:bg-dark-700" aria-label="Open admin menu">
                        <Menu size={22} />
                    </button>
                    <h2 className="text-sm font-semibold text-gold-500 truncate">{currentTitle}</h2>
                    <button type="button" onClick={handleLogout} className="text-xs text-red-400">Logout</button>
                </header>

                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>

            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    <button className="absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} aria-label="Close menu" />
                    <aside className="relative w-80 max-w-[85%] bg-dark-800 border-r border-gold-500/10 h-full flex flex-col">
                        <div className="h-16 px-4 flex items-center justify-between border-b border-gold-500/10">
                            <h1 className="text-lg font-serif text-gold-500 font-bold">Admin Menu</h1>
                            <button type="button" onClick={() => setMobileOpen(false)} className="p-2 text-gray-300 hover:text-white" aria-label="Close admin menu">
                                <X size={20} />
                            </button>
                        </div>
                        {renderNav(() => setMobileOpen(false))}
                        <div className="p-4 border-t border-gold-500/10">
                            <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-gray-400 hover:text-red-400 transition-colors">
                                <LogOut size={20} className="mr-3" /> Logout
                            </button>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
};

export default AdminLayout;
