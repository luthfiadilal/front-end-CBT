import React from 'react';
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
    const [openSubmenus, setOpenSubmenus] = React.useState({});

    const profile = JSON.parse(localStorage.getItem('profile') || '{}');
    const userRole = user?.role || 'siswa'; // Default to siswa if undefined

    // Determine the label for "User All" or "User Siswa" based on role logic if needed, 
    // but the request specified distinct menus.

    const roleMenus = {
        admin: [
            { path: '/admin/users', label: 'Kelola User', icon: 'solar:users-group-rounded-bold' },
            {
                label: 'Kelola Kriteria',
                icon: 'solar:list-check-bold',
                children: [
                    { path: '/admin/kriteria', label: 'All Kriteria' },
                ]
            },
            { path: '/admin/questions', label: 'Kelola Soal', icon: 'solar:question-circle-bold' },
            { path: '/admin/ranking', label: 'Rangking', icon: 'solar:ranking-bold' },
            { path: '/admin/exams', label: 'Kelola Latihan', icon: 'solar:clipboard-list-bold' },
            { path: '/admin/exam-attempts', label: 'Latihan Siswa', icon: 'solar:history-bold' },
            { path: '/profile', label: 'Akun', icon: 'solar:user-bold' },
        ],
        teacher: [

            { path: '/teacher/users', label: 'Kelola User', icon: 'solar:users-group-rounded-bold' },
            {
                label: 'Kelola Kriteria',
                icon: 'solar:list-check-bold',
                children: [
                    { path: '/teacher/kriteria', label: 'All Kriteria' },
                ]
            },
            { path: '/teacher/questions', label: 'Kelola Soal', icon: 'solar:question-circle-bold' },
            { path: '/teacher/ranking', label: 'Rangking', icon: 'solar:ranking-bold' },
            { path: '/teacher/exams', label: 'Kelola Latihan', icon: 'solar:clipboard-list-bold' },
            { path: '/teacher/exam-attempts', label: 'Latihan Siswa', icon: 'solar:history-bold' },
            { path: '/profile', label: 'Akun', icon: 'solar:user-bold' },
        ],
        siswa: [
            { path: '/dashboard', label: 'Dashboard', icon: 'solar:widget-bold' },
            { path: '/student/latihan', label: 'Latihan', icon: 'solar:dumbbell-bold' },
            { path: '/student/ranking', label: 'Rangking', icon: 'solar:ranking-bold' },
            { path: '/profile', label: 'Profile', icon: 'solar:user-bold' },
        ]
    };

    const currentMenu = roleMenus[userRole] || roleMenus['siswa'];

    const isActive = (path) => location.pathname === path;

    const toggleSubmenu = (label) => {
        if (!isOpen) setIsOpen(true);
        setOpenSubmenus(prev => ({
            ...prev,
            [label]: !prev[label]
        }));
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const closeSidebar = () => {
        setIsOpen(false);
        setOpenSubmenus({}); // Optional: collapse all on close
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
                className="fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-30 flex flex-col"
            >
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 flex-shrink-0">
                    <div className={`flex items-center ${isOpen ? '' : 'lg:justify-center lg:w-full'}`}>
                        <img src="/images/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
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
                        className="hidden lg:flex w-full p-4 justify-center hover:bg-gray-50 transition-colors flex-shrink-0"
                    >
                        <Icon icon="solar:alt-arrow-right-bold" className="w-6 h-6 text-gray-600" />
                    </button>
                )}

                {/* User Profile */}
                {isOpen && (
                    <div className="p-4 border-b border-gray-200 flex-shrink-0">
                        <div
                            onClick={() => {
                                const dashboardPath = userRole === 'teacher' ? '/teacher/dashboard' : '/dashboard';
                                navigate(dashboardPath);
                                if (window.innerWidth < 1024) closeSidebar();
                            }}
                            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                {profile.nama?.charAt(0) || user?.email?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                    {profile.nama || user?.email}
                                </p>
                                <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Menu Items - Scrollable Area */}
                <div className="flex-1 overflow-y-auto py-2 px-2 custom-scrollbar">
                    <nav className="space-y-1">
                        {currentMenu.map((item, index) => {
                            if (item.children) {
                                // Submenu Logic
                                const isExpanded = openSubmenus[item.label];
                                const hasActiveChild = item.children.some(child => isActive(child.path));

                                return (
                                    <div key={index} className="space-y-1">
                                        <button
                                            onClick={() => toggleSubmenu(item.label)}
                                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${hasActiveChild || isExpanded
                                                ? 'bg-gray-50 text-gray-900'
                                                : 'text-gray-700 hover:bg-gray-50'
                                                } ${isOpen ? '' : 'lg:justify-center'}`}
                                            title={!isOpen ? item.label : ''}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon icon={item.icon} className={`w-5 h-5 flex-shrink-0 ${hasActiveChild ? 'text-green-600' : ''}`} />
                                                {isOpen && <span className="text-sm font-medium">{item.label}</span>}
                                            </div>
                                            {isOpen && (
                                                <Icon
                                                    icon="solar:alt-arrow-down-bold"
                                                    className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                                />
                                            )}
                                        </button>

                                        {/* Submenu Items */}
                                        <AnimatePresence>
                                            {isOpen && isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="pl-11 pr-2 py-1 space-y-1">
                                                        {item.children.map((child, childIndex) => (
                                                            <Link
                                                                key={childIndex}
                                                                to={child.path}
                                                                onClick={() => {
                                                                    if (window.innerWidth < 1024) closeSidebar();
                                                                }}
                                                                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive(child.path)
                                                                    ? 'bg-green-50 text-green-700 font-medium'
                                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                                    }`}
                                                            >
                                                                {child.label}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            }

                            // Regular Menu Item
                            return (
                                <Link
                                    key={index}
                                    to={item.path}
                                    onClick={() => {
                                        if (window.innerWidth < 1024) closeSidebar();
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
                            );
                        })}
                    </nav>
                </div>

                {/* Logout Button */}
                <div className="p-4 border-t border-gray-200 flex-shrink-0 bg-white">
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
