import React, { useState, useRef, useEffect } from 'react';
import { Bell, Menu, AlertTriangle, ShieldAlert, CheckCircle, Info } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAITracker } from '../hooks/useAITracker';

const Header = ({ toggleSidebar, user, vehicles, bookings }) => {
    const location = useLocation();
    const [showNotifications, setShowNotifications] = useState(false);
    const notifRef = useRef(null);
    const originalAlerts = useAITracker(vehicles, bookings);
    const [dismissedAlertIdList, setDismissedAlertIdList] = useState([]);

    // Filter out dismissed alerts
    const alerts = originalAlerts.filter(a => !dismissedAlertIdList.includes(a.id));

    const handleDismissAlert = (e, id) => {
        e.stopPropagation();
        setDismissedAlertIdList([...dismissedAlertIdList, id]);
    };

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getPageTitle = () => {
        switch (location.pathname) {
            case '/': return 'Dashboard Overview';
            case '/bookings': return 'Manage Bookings';
            case '/drivers': return 'Driver Fleet';
            case '/vehicles': return 'Vehicle Fleet';
            case '/pricing': return 'Subscription & Billing';
            case '/settings': return 'System Settings';
            default: return 'Eastern Vacations';
        }
    };

    const getAlertIcon = (type) => {
        switch (type) {
            case 'critical': return <ShieldAlert className="text-red-400" size={18} />;
            case 'warning': return <AlertTriangle className="text-orange-400" size={18} />;
            case 'info': return <Info className="text-blue-400" size={18} />;
            default: return <CheckCircle className="text-emerald-400" size={18} />;
        }
    };

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8 bg-dark-900/80 backdrop-blur-lg border-b border-white/5">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 -ml-2 rounded-xl text-dark-300 hover:text-white hover:bg-white/10 lg:hidden transition-colors"
                >
                    <Menu size={24} />
                </button>
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{getPageTitle()}</h1>
                    <p className="text-xs sm:text-sm text-dark-400 hidden sm:block">Welcome back, {user?.name || 'User'}</p>
                </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-5">
                {/* Notifications Dropdown */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`relative p-2 rounded-xl transition-colors ${showNotifications ? 'bg-white/10 text-white' : 'text-dark-300 hover:text-white hover:bg-white/10'}`}
                    >
                        <Bell size={22} className={alerts.length > 0 ? "animate-pulse-slow text-orange-400" : ""} />
                        {alerts.length > 0 && (
                            <span className="absolute top-1 right-1 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                            </span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 sm:w-[26rem] glass-card !p-0 border-white/10 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                            <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
                                <h3 className="font-bold text-white">Notifications</h3>
                                <span className="text-xs font-semibold bg-primary-500/20 text-primary-400 px-2 py-1 rounded-full">{alerts.length} New</span>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {alerts.length === 0 ? (
                                    <div className="p-8 text-center text-dark-400">
                                        <CheckCircle size={32} className="mx-auto mb-3 opacity-50" />
                                        <p>You're all caught up!</p>
                                    </div>
                                ) : (
                                    alerts.map(alert => (
                                        <div key={alert.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors group flex justify-between items-start">
                                            <div className="flex gap-3 items-start cursor-pointer flex-1" onClick={() => setShowNotifications(false)}>
                                                <div className="mt-1 flex-shrink-0">
                                                    {getAlertIcon(alert.type)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-white">{alert.title}</p>
                                                    <p className="text-xs text-dark-300 mt-1">{alert.message}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => handleDismissAlert(e, alert.id)}
                                                className="p-1.5 text-dark-400 opacity-0 group-hover:opacity-100 peer hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                                title="Dismiss Notification"
                                            >
                                                <span className="text-xs font-bold leading-none font-mono tracking-tighter">X</span>
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-8 w-[1px] bg-white/10 hidden sm:block"></div>

                <div className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-white/10">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary-600 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                        <span className="text-white font-bold text-sm tracking-widest">{user?.name?.charAt(0) || 'U'}</span>
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-semibold text-white leading-tight">{user?.name || 'User'}</p>
                        <p className="text-xs text-primary-400 font-medium capitalize">{user?.role || 'Staff'}</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
