import Sidebar from './Sidebar';
import { Icon } from '@iconify/react';
import { useSidebar } from '../../context/SidebarContext';

const MainLayout = ({ children }) => {
    const { isOpen, setIsOpen } = useSidebar();

    return (
        <div className="min-h-screen bg-brand-green">
            {/* Mobile Header with Hamburger */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-brand-green border-b border-gray-200 z-10 flex items-center px-4">
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <Icon icon="solar:hamburger-menu-bold" className="w-6 h-6 text-gray-700" />
                </button>
                <div className="flex items-center ml-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                        <Icon icon="solar:book-bold" className="w-5 h-5 text-white" />
                    </div>
                    <span className="ml-2 text-lg font-bold text-gray-900">CBT System</span>
                </div>
            </header>

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className={`
                transition-all duration-300 
                pt-16 lg:pt-0
                ${isOpen ? 'lg:ml-64' : 'lg:ml-20'}
            `}>
                <div className="min-h-screen p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
