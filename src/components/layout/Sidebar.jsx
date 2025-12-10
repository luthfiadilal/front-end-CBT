import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';

const Sidebar = () => {
    const { isOpen, setIsOpen } = useSidebar();
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const profile = JSON.parse(localStorage.getItem('profile') || '{}');

    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: 'solar:widget-bold' },
        { path: '/ujian', label: 'Ujian', icon: 'solar:document-text-bold' },
        { path: '/nilai', label: 'Nilai', icon: 'solar:chart-bold' },
        { path: '/profile', label: 'Profile', icon: 'solar:user-bold' },
    ];

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const closeSidebar = () => {
        setIsOpen(false);
    };

    return (
        <>
            {/* Sidebar with Framer Motion - Only sidebar animates, not contents */}
            <motion.aside
                initial={false}
                animate={isOpen ? 'open' : 'closed'}
                variants={{
                    open: { x: 0, width: '16rem' },
                    closed: {
                        x: typeof window !== 'undefined' && window.innerWidth >= 1024 ? 0 : '-100%',
                        width: typeof window !== 'undefined' && window.innerWidth >= 1024 ? '5rem' : '16rem'
                    }
                }}
                transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30
                }}
                className="fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-30"
            >
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
                    <div className={`flex items-center ${isOpen ? '' : 'lg:justify-center lg:w-full'}`}>
                        <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Icon icon="solar:book-bold" className="w-6 h-6 text-white" />
                        </div>
                        {isOpen && (
                            <span className="ml-3 text-lg font-bold text-gray-900">
                                CBT System
                            </span>
                        )}
                    </div>
                    {isOpen && (
                        <button
                            onClick={closeSidebar}
                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors lg:block"
                        >
                            <Icon icon="solar:alt-arrow-left-bold" className="w-5 h-5 text-gray-600" />
                        </button>
                    )}
                </div>

                {/* Toggle Button (when closed on desktop) */}
                {!isOpen && (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="hidden lg:flex w-full p-4 justify-center hover:bg-gray-50 transition-colors"
                    >
                        <Icon icon="solar:alt-arrow-right-bold" className="w-6 h-6 text-gray-600" />
                    </button>
                )}

                {/* User Profile */}
                {isOpen && (
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                {profile.nama?.charAt(0) || user?.email?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                    {profile.nama || user?.email}
                                </p>
                                <p className="text-xs text-gray-500 capitalize">{user?.role || 'User'}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Menu Items */}
                <nav className="p-2 space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => {
                                // Close sidebar on mobile after navigation
                                if (window.innerWidth < 1024) {
                                    closeSidebar();
                                }
                            }}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive(item.path)
                                    ? 'bg-green-50 text-green-700 font-medium'
                                    : 'text-gray-700 hover:bg-gray-50'
                                } ${isOpen ? '' : 'lg:justify-center'}`}
                            title={!isOpen ? item.label : ''}
                        >
                            <Icon icon={item.icon} className="w-5 h-5 flex-shrink-0" />
                            {isOpen && <span className="text-sm">{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                {/* Logout Button */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors ${isOpen ? '' : 'lg:justify-center'
                            }`}
                        title={!isOpen ? 'Logout' : ''}
                    >
                        <Icon icon="solar:logout-2-bold" className="w-5 h-5 flex-shrink-0" />
                        {isOpen && <span className="text-sm font-medium">Logout</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Overlay for mobile when sidebar is open - with AnimatePresence */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 lg:hidden"
                        onClick={closeSidebar}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
