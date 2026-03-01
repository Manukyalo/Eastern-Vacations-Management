import React, { useState } from 'react';
import { Save, User, Building, Shield, Bell } from 'lucide-react';
import Modal from '../components/Modal';

const Settings = ({ companyDetails, setCompanyDetails }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [isMpesaModalOpen, setIsMpesaModalOpen] = useState(false);
    const [isPesapalModalOpen, setIsPesapalModalOpen] = useState(false);

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">System Settings</h2>
                <p className="text-slate-500 text-sm">Manage your platform preferences and integrations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Side Nav */}
                <div className="space-y-2">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium border text-left transition-colors ${activeTab === 'profile' ? 'bg-primary-500/10 text-primary-400 border-primary-500/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent'}`}
                    >
                        <User size={18} /> Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('company')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium border text-left transition-colors ${activeTab === 'company' ? 'bg-primary-500/10 text-primary-400 border-primary-500/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent'}`}
                    >
                        <Building size={18} /> Company Details
                    </button>
                    <button
                        onClick={() => setActiveTab('notifications')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium border text-left transition-colors ${activeTab === 'notifications' ? 'bg-primary-500/10 text-primary-400 border-primary-500/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent'}`}
                    >
                        <Bell size={18} /> Notifications
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium border text-left transition-colors ${activeTab === 'security' ? 'bg-primary-500/10 text-primary-400 border-primary-500/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent'}`}
                    >
                        <Shield size={18} /> Security
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="md:col-span-3 space-y-6">
                    {activeTab === 'profile' && (
                        <>
                            <div className="glass-card relative">
                                <h3 className="text-lg font-bold text-slate-900 mb-6">Administrator Profile</h3>
                                <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert('Profile preferences updated successfully!'); }}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">First Name</label>
                                            <input required type="text" placeholder="e.g. Admin" className="w-full bg-white/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary-500 transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Last Name</label>
                                            <input required type="text" placeholder="e.g. Executive" className="w-full bg-white/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary-500 transition-colors" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                                        <input type="email" defaultValue="admin@easternvacations.com" className="w-full bg-white/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-600 focus:outline-none focus:border-primary-500 transition-colors cursor-not-allowed" disabled />
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
                                <h3 className="text-lg font-bold text-slate-900 mb-2">API Integrations</h3>
                                <p className="text-sm text-slate-500 mb-6">Manage external connections like M-Pesa and Pesapal.</p>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-300 bg-slate-100">
                                        <div>
                                            <p className="font-bold text-slate-900">M-Pesa Daraja API</p>
                                            <p className="text-xs text-slate-500">Status: <span className="text-emerald-400 font-semibold">Active</span></p>
                                        </div>
                                        <button onClick={() => setIsMpesaModalOpen(true)} className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 border border-slate-300 rounded-lg transition-colors bg-white/50 hover:bg-slate-200">Configure</button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-300 bg-slate-100">
                                        <div>
                                            <p className="font-bold text-slate-900">Pesapal v3</p>
                                            <p className="text-xs text-slate-500">Status: <span className="text-emerald-400 font-semibold">Active</span></p>
                                        </div>
                                        <button onClick={() => setIsPesapalModalOpen(true)} className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 border border-slate-300 rounded-lg transition-colors bg-white/50 hover:bg-slate-200">Configure</button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'company' && (
                        <div className="glass-card">
                            <h3 className="text-lg font-bold text-slate-900 mb-6">Company Information</h3>
                            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert('Company Details updated!'); }}>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Company Name</label>
                                    <input required type="text" value={companyDetails.name} onChange={(e) => setCompanyDetails({ ...companyDetails, name: e.target.value })} className="w-full bg-white/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary-500 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Address</label>
                                    <input required type="text" value={companyDetails.address} onChange={(e) => setCompanyDetails({ ...companyDetails, address: e.target.value })} className="w-full bg-white/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary-500 transition-colors" />
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
                            <h3 className="text-lg font-bold text-slate-900 mb-6">Notification Preferences</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-300 bg-slate-100">
                                    <div>
                                        <p className="font-bold text-slate-900">Email Alerts</p>
                                        <p className="text-xs text-slate-500">Receive daily summaries.</p>
                                    </div>
                                    <button onClick={() => alert('Toggled Email Alerts')} className="text-sm font-semibold text-emerald-400 px-4 py-2 border border-emerald-500/20 rounded-lg transition-colors bg-emerald-500/10 hover:bg-emerald-500/20">Enabled</button>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-300 bg-slate-100">
                                    <div>
                                        <p className="font-bold text-slate-900">AI Insurance Warnings</p>
                                        <p className="text-xs text-slate-500">Tracker alerts 30 days prior to expiry.</p>
                                    </div>
                                    <button onClick={() => alert('Toggled AI Warnings')} className="text-sm font-semibold text-emerald-400 px-4 py-2 border border-emerald-500/20 rounded-lg transition-colors bg-emerald-500/10 hover:bg-emerald-500/20">Enabled</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="glass-card">
                            <h3 className="text-lg font-bold text-slate-900 mb-6">Security Settings</h3>
                            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert('Password updated!'); }}>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Current Password</label>
                                    <input required type="password" placeholder="••••••••" className="w-full bg-white/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-red-500 transition-colors" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">New Password</label>
                                        <input required type="password" placeholder="••••••••" className="w-full bg-white/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-red-500 transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Confirm Password</label>
                                        <input required type="password" placeholder="••••••••" className="w-full bg-white/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-red-500 transition-colors" />
                                    </div>
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <button type="submit" className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-500 text-slate-900 px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-red-500/20 hover:-translate-y-0.5 transition-all">
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
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Consumer Key</label>
                        <input required type="text" defaultValue="sk_live_mpesa_***" className="w-full bg-white/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-emerald-500 transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Consumer Secret</label>
                        <input required type="password" defaultValue="secret_***" className="w-full bg-white/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-emerald-500 transition-colors" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Shortcode</label>
                            <input required type="text" defaultValue="174379" className="w-full bg-white/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-emerald-500 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Passkey</label>
                            <input required type="password" defaultValue="passkey123" className="w-full bg-white/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-emerald-500 transition-colors" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Callback URL</label>
                        <input required type="url" defaultValue="https://api.easternvacations.com/webhooks/mpesa" className="w-full bg-white/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors" />
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={() => setIsMpesaModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:text-slate-900 transition-colors border border-transparent hover:border-slate-300">Cancel</button>
                        <button type="submit" className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-900 px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 transition-all">
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
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Consumer Key</label>
                        <input required type="text" defaultValue="pk_live_pesapal_***" className="w-full bg-white/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Consumer Secret</label>
                        <input required type="password" defaultValue="secret_***" className="w-full bg-white/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">IPN (Instant Payment Notification) URL</label>
                        <input required type="url" defaultValue="https://api.easternvacations.com/webhooks/pesapal" className="w-full bg-white/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-600 focus:outline-none focus:border-blue-500 transition-colors" />
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={() => setIsPesapalModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:text-slate-900 transition-colors border border-transparent hover:border-slate-300">Cancel</button>
                        <button type="submit" className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-slate-900 px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 transition-all">
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
