import Sidebar from './Sidebar';
import { useSidebar } from '../../context/SidebarContext';

const MainLayout = ({ children }) => {
    const { isOpen } = useSidebar();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content - adjust margin based on sidebar state */}
            <main className={`transition-all duration-300 ${isOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
                <div className="min-h-screen">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
