import React from 'react';
import { NavLink } from 'react-router-dom';
import { Car, Users, Calendar, DollarSign, Settings, LogOut, TrendingUp, Compass, ShieldAlert, FileText } from 'lucide-react';

const Sidebar = ({ role, onLogout, isMobile, isOpen, setIsOpen }) => {
    const adminLinks = [
        { to: '/', icon: <TrendingUp size={20} />, label: 'Dashboard' },
        { to: '/bookings', icon: <Calendar size={20} />, label: 'Bookings' },
        { to: '/invoices', icon: <FileText size={20} />, label: 'Invoices' },
        { to: '/drivers', icon: <Users size={20} />, label: 'Drivers' },
        { to: '/vehicles', icon: <Car size={20} />, label: 'Vehicles' },
        { to: '/security-hub', icon: <ShieldAlert size={20} />, label: 'Security Hub' },
        { to: '/pricing', icon: <DollarSign size={20} />, label: 'Subscription' },
        { to: '/settings', icon: <Settings size={20} />, label: 'Settings' },
    ];

    const staffLinks = [
        { to: '/', icon: <TrendingUp size={20} />, label: 'Dashboard' },
        { to: '/bookings', icon: <Calendar size={20} />, label: 'Bookings' },
        { to: '/invoices', icon: <FileText size={20} />, label: 'Invoices' },
        { to: '/drivers', icon: <Users size={20} />, label: 'Drivers' },
        { to: '/vehicles', icon: <Car size={20} />, label: 'Vehicles' },
    ];

    const links = role === 'admin' ? adminLinks : staffLinks;

    const sidebarClasses = `fixed inset-y-0 left-0 bg-dark-900/95 backdrop-blur-xl border-r border-white/10 w-64 transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'
        } ${!isMobile && 'translate-x-0 relative'}`;

    return (
        <>
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
            <aside className={sidebarClasses}>
                <div className="p-6 flex items-center gap-3 border-b border-white/5">
                    <div className="w-10 h-10 flex items-center justify-center shrink-0">
                        <img src="/icon/eastern-vacations-kenya-logo-rounded.png" alt="Eastern Vacations" className="w-full h-full object-contain drop-shadow-md" />
                    </div>
                    <div>
                        <h2 className="font-bold text-xl text-white tracking-tight">Eastern</h2>
                        <p className="text-primary-500 text-xs font-semibold tracking-wider uppercase">Vacations</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={() => isMobile && setIsOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${isActive
                                    ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                                    : 'text-dark-400 hover:bg-white/5 hover:text-dark-200'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-400 to-orange-500 rounded-r-full" />
                                    )}
                                    <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                        {link.icon}
                                    </span>
                                    <span className="font-medium">{link.label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5">
                    {role === 'admin' && (
                        <div className="glass-card mb-4 !p-4 border-primary-500/30 bg-primary-500/5 relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary-500/20 rounded-full blur-xl" />
                            <h4 className="text-sm font-bold text-white mb-1">Pro Plan</h4>
                            <p className="text-xs text-dark-400 mb-3">14 days left</p>
                            <NavLink
                                to="/pricing"
                                className="text-xs font-semibold text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors"
                            >
                                Upgrade now &rarr;
                            </NavLink>
                        </div>
                    )}

                    <button
                        onClick={onLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-400/10 hover:text-red-300 rounded-xl transition-all duration-200 font-medium"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
