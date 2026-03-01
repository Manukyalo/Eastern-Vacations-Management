import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import AIAssistant from './AIAssistant';

const Layout = ({ user, onLogout, vehicles, bookings }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth >= 1024) {
                setSidebarOpen(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-700 dark:text-slate-200 font-sans flex">
            {/* Dynamic Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary-900/10 blur-[120px]" />
                <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-orange-900/10 blur-[120px]" />
            </div>

            <Sidebar
                role={user?.role}
                onLogout={onLogout}
                isMobile={isMobile}
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
            />

            <div className="flex-1 flex flex-col min-h-screen lg:pl-64 relative z-10 transition-all duration-300">
                <Header
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    user={user}
                    vehicles={vehicles}
                    bookings={bookings}
                />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
                    <Outlet />
                </main>

                {/* Global Embedded AI Engine (Enterprise, Admin & Staff Defaults) */}
                {(user?.planType === 'Enterprise' || user?.role === 'admin' || user?.role === 'staff') && <AIAssistant user={user} />}
            </div>
        </div>
    );
};

export default Layout;
