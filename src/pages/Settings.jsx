import React, { useState, useEffect } from 'react';
import { Save, User, Building, Shield, Bell, Moon, Sun } from 'lucide-react';
import Modal from '../components/Modal';

const Settings = ({ companyDetails, setCompanyDetails }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [isMpesaModalOpen, setIsMpesaModalOpen] = useState(false);
    const [isPesapalModalOpen, setIsPesapalModalOpen] = useState(false);

    const [isDarkMode, setIsDarkMode] = useState(() => {
        return document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
    });

    const toggleTheme = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDarkMode(true);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">System Settings</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your platform preferences and integrations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Side Nav */}
                <div className="space-y-2">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium border text-left transition-colors ${activeTab === 'profile' ? 'bg-primary-500/10 text-primary-400 border-primary-500/20' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-[#1e293b] border-transparent'}`}
                    >
                        <User size={18} /> Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('company')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium border text-left transition-colors ${activeTab === 'company' ? 'bg-primary-500/10 text-primary-400 border-primary-500/20' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-[#1e293b] border-transparent'}`}
                    >
                        <Building size={18} /> Company Details
                    </button>
                    <button
                        onClick={() => setActiveTab('notifications')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium border text-left transition-colors ${activeTab === 'notifications' ? 'bg-primary-500/10 text-primary-400 border-primary-500/20' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-[#1e293b] border-transparent'}`}
                    >
                        <Bell size={18} /> Notifications
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium border text-left transition-colors ${activeTab === 'security' ? 'bg-primary-500/10 text-primary-400 border-primary-500/20' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-[#1e293b] border-transparent'}`}
                    >
                        <Shield size={18} /> Security
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="md:col-span-3 space-y-6">
                    {activeTab === 'profile' && (
                        <>
                            <div className="glass-card relative">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Administrator Profile</h3>
                                <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert('Profile preferences updated successfully!'); }}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">First Name</label>
                                            <input required type="text" placeholder="e.g. Admin" className="w-full bg-white dark:bg-[#1e293b]/50 dark:bg-white dark:bg-[#1e293b]/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Last Name</label>
                                            <input required type="text" placeholder="e.g. Executive" className="w-full bg-white dark:bg-[#1e293b]/50 dark:bg-white dark:bg-[#1e293b]/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                                        <input type="email" defaultValue="admin@easternvacations.com" className="w-full bg-white dark:bg-[#1e293b]/50 dark:bg-white dark:bg-[#1e293b]/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-600 dark:text-slate-300 focus:outline-none focus:border-primary-500 transition-colors cursor-not-allowed" disabled />
                                        <p className="text-xs text-dark-500 mt-2">Email changes require identity verification by a Superadmin.</p>
                                    </div>
                                    <div className="pt-4 flex justify-end">
                                        <button type="submit" className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-orange-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 transition-all">
                                            <Save size={18} />
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div className="glass-card">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Appearance</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Customize the user interface theme globally.</p>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-[#1e293b]">
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white">Dark Mode</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Reduce eye strain with a darker interface.</p>
                                        </div>
                                        <button
                                            onClick={toggleTheme}
                                            className="p-2 rounded-lg bg-white dark:bg-[#1e293b]/50 border border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-slate-200 transition-colors"
                                            title="Toggle Theme"
                                        >
                                            {isDarkMode ? <Sun size={20} className="text-primary-400" /> : <Moon size={20} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">API Integrations</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Manage external connections like M-Pesa and Pesapal.</p>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-[#1e293b]">
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white">M-Pesa Daraja API</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Status: <span className="text-emerald-400 font-semibold">Active</span></p>
                                        </div>
                                        <button onClick={() => setIsMpesaModalOpen(true)} className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white px-4 py-2 border border-slate-300 dark:border-white/10 rounded-lg transition-colors bg-white dark:bg-[#1e293b]/50 dark:bg-white dark:bg-[#1e293b]/5 hover:bg-slate-200">Configure</button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-[#1e293b]">
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white">Pesapal v3</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Status: <span className="text-emerald-400 font-semibold">Active</span></p>
                                        </div>
                                        <button onClick={() => setIsPesapalModalOpen(true)} className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white px-4 py-2 border border-slate-300 dark:border-white/10 rounded-lg transition-colors bg-white dark:bg-[#1e293b]/50 dark:bg-white dark:bg-[#1e293b]/5 hover:bg-slate-200">Configure</button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'company' && (
                        <div className="glass-card">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Company Information</h3>
                            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert('Company Details updated!'); }}>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Company Name</label>
                                    <input required type="text" value={companyDetails.name} onChange={(e) => setCompanyDetails({ ...companyDetails, name: e.target.value })} className="w-full bg-white dark:bg-[#1e293b]/50 dark:bg-white dark:bg-[#1e293b]/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Address</label>
                                    <input required type="text" value={companyDetails.address} onChange={(e) => setCompanyDetails({ ...companyDetails, address: e.target.value })} className="w-full bg-white dark:bg-[#1e293b]/50 dark:bg-white dark:bg-[#1e293b]/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors" />
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <button type="submit" className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-orange-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 transition-all">
                                        <Save size={18} />
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="glass-card">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Notification Preferences</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-[#1e293b]">
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white">Email Alerts</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Receive daily summaries.</p>
                                    </div>
                                    <button onClick={() => alert('Toggled Email Alerts')} className="text-sm font-semibold text-emerald-400 px-4 py-2 border border-emerald-500/20 rounded-lg transition-colors bg-emerald-500/10 hover:bg-emerald-500/20">Enabled</button>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-[#1e293b]">
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white">AI Insurance Warnings</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Tracker alerts 30 days prior to expiry.</p>
                                    </div>
                                    <button onClick={() => alert('Toggled AI Warnings')} className="text-sm font-semibold text-emerald-400 px-4 py-2 border border-emerald-500/20 rounded-lg transition-colors bg-emerald-500/10 hover:bg-emerald-500/20">Enabled</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="glass-card">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Security Settings</h3>
                            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert('Password updated!'); }}>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Current Password</label>
                                    <input required type="password" placeholder="••••••••" className="w-full bg-white dark:bg-[#1e293b]/50 dark:bg-white dark:bg-[#1e293b]/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-red-500 transition-colors" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">New Password</label>
                                        <input required type="password" placeholder="••••••••" className="w-full bg-white dark:bg-[#1e293b]/50 dark:bg-white dark:bg-[#1e293b]/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-red-500 transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Confirm Password</label>
                                        <input required type="password" placeholder="••••••••" className="w-full bg-white dark:bg-[#1e293b]/50 dark:bg-white dark:bg-[#1e293b]/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-red-500 transition-colors" />
                                    </div>
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <button type="submit" className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-500 text-slate-900 dark:text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-red-500/20 hover:-translate-y-0.5 transition-all">
                                        <Shield size={18} />
                                        Update Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {/* M-Pesa Configuration Modal */}
            <Modal isOpen={isMpesaModalOpen} onClose={() => setIsMpesaModalOpen(false)} title="M-Pesa API Configuration">
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('M-Pesa config updated!'); setIsMpesaModalOpen(false); }}>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Consumer Key</label>
                        <input required type="text" defaultValue="sk_live_mpesa_***" className="w-full bg-white dark:bg-[#1e293b]/50 dark:bg-white dark:bg-[#1e293b]/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Consumer Secret</label>
                        <input required type="password" defaultValue="secret_***" className="w-full bg-white dark:bg-[#1e293b]/50 dark:bg-white dark:bg-[#1e293b]/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Shortcode</label>
                            <input required type="text" defaultValue="174379" className="w-full bg-white dark:bg-[#1e293b]/50 dark:bg-white dark:bg-[#1e293b]/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Passkey</label>
                            <input required type="password" defaultValue="passkey123" className="w-full bg-white dark:bg-[#1e293b]/50 dark:bg-white dark:bg-[#1e293b]/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Callback URL</label>
                        <input required type="url" defaultValue="https://api.easternvacations.com/webhooks/mpesa" className="w-full bg-white dark:bg-[#1e293b]/50 dark:bg-white dark:bg-[#1e293b]/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-600 dark:text-slate-300 focus:outline-none focus:border-emerald-500 transition-colors" />
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={() => setIsMpesaModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white transition-colors border border-transparent hover:border-slate-300 dark:border-white/10">Cancel</button>
                        <button type="submit" className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-900 dark:text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 transition-all">
                            <Save size={18} />
                            Save Config
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Pesapal Configuration Modal */}
            <Modal isOpen={isPesapalModalOpen} onClose={() => setIsPesapalModalOpen(false)} title="Pesapal v3 API Settings">
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Pesapal config updated!'); setIsPesapalModalOpen(false); }}>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Consumer Key</label>
                        <input required type="text" defaultValue="pk_live_pesapal_***" className="w-full bg-white dark:bg-[#1e293b]/50 dark:bg-white dark:bg-[#1e293b]/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Consumer Secret</label>
                        <input required type="password" defaultValue="secret_***" className="w-full bg-white dark:bg-[#1e293b]/50 dark:bg-white dark:bg-[#1e293b]/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">IPN (Instant Payment Notification) URL</label>
                        <input required type="url" defaultValue="https://api.easternvacations.com/webhooks/pesapal" className="w-full bg-white dark:bg-[#1e293b]/50 dark:bg-white dark:bg-[#1e293b]/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-600 dark:text-slate-300 focus:outline-none focus:border-blue-500 transition-colors" />
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={() => setIsPesapalModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white transition-colors border border-transparent hover:border-slate-300 dark:border-white/10">Cancel</button>
                        <button type="submit" className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-slate-900 dark:text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 transition-all">
                            <Save size={18} />
                            Save Config
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Settings;
