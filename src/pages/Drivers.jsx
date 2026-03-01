import React, { useState } from 'react';
import { Plus, Search, MoreVertical, ShieldCheck, Watch, Save } from 'lucide-react';
import Modal from '../components/Modal';
import { driverAPI } from '../services/api';

const Drivers = ({ user, drivers, setDrivers }) => {
    const maxDrivers = user?.planType === 'Basic' ? 5 : user?.planType === 'Pro' ? 50 : Infinity;
    const canAddDriver = drivers.length < maxDrivers;
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);

    const handleRegisterDriver = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            const res = await driverAPI.create({
                name: formData.get('name'),
                phone: formData.get('phone'),
                task: formData.get('task'),
                status: 'available'
            });
            setDrivers(prev => [...prev, res.data]);
            setIsAddModalOpen(false);
        } catch (err) {
            console.error('Error creating driver:', err);
            alert('Registration Failed: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDeleteDriver = async (id) => {
        try {
            await driverAPI.delete(id);
            setDrivers(prev => prev.filter(d => d._id !== id));
            setOpenDropdown(null);
        } catch (err) { console.error('Error deleting driver:', err); }
    };

    const handleUpdateDriverStatus = async (id, newStatus) => {
        try {
            await driverAPI.update(id, { status: newStatus });
            setDrivers(prev => prev.map(d => d._id === id ? { ...d, status: newStatus } : d));
            setOpenDropdown(null);
        } catch (err) { console.error('Error updating driver status:', err); }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="space-y-1.5">
                    <h2 className="text-3xl font-black text-white tracking-tight">Driver Fleet</h2>
                    <p className="text-dark-400 text-sm font-medium">Manage your certified tour operators and dispatch statuses.</p>
                </div>
                <button
                    onClick={() => canAddDriver ? setIsAddModalOpen(true) : alert(`Plan limit reached (${maxDrivers} maximum). Please upgrade your tier.`)}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg transition-all w-full sm:w-auto ${canAddDriver ? 'bg-gradient-to-r from-primary-500 to-orange-500 hover:from-primary-400 hover:to-orange-400 text-white shadow-primary-500/20 hover:-translate-y-0.5' : 'bg-dark-700 text-dark-400 cursor-not-allowed border border-white/5'}`}
                >
                    <Plus size={20} />
                    {canAddDriver ? 'Add Driver' : 'Upgrade to Add'}
                </button>
            </div>

            <div className="glass-card p-5 sm:p-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-5 shadow-2xl">
                <div className="relative w-full sm:flex-1 sm:max-w-md shrink-0">
                    <input
                        type="text"
                        placeholder="Search by driver name..."
                        className="w-full bg-dark-900/80 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all font-medium shadow-inner"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {drivers.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase())).map((driver) => (
                    <div key={driver._id} className="glass-card hover:bg-white/5 border-white/10 transition-colors group relative overflow-visible">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-dark-800 border-2 border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xl">
                                    {driver.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-white font-bold">{driver.name}</h3>
                                    <div className="flex items-center gap-1 text-xs text-dark-400 mt-0.5">
                                        <ShieldCheck size={14} className="text-emerald-400" />
                                        Certified Guide
                                    </div>
                                </div>
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() => setOpenDropdown(openDropdown === driver._id ? null : driver._id)}
                                    className="text-dark-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    <MoreVertical size={20} />
                                </button>
                                {openDropdown === driver._id && (
                                    <div className="absolute right-0 top-10 w-32 bg-dark-800 border border-white/10 shadow-2xl rounded-xl z-20 overflow-hidden animate-in fade-in zoom-in-95">
                                        <button onClick={() => { setOpenDropdown(null); alert('View Driver Profile'); }} className="w-full text-left px-4 py-2 text-sm text-dark-200 hover:bg-white/10 hover:text-white transition-colors">View Profile</button>
                                        {driver.status === 'available' ? (
                                            <button onClick={() => handleUpdateDriverStatus(driver._id, 'suspended')} className="w-full text-left px-4 py-2 text-sm text-orange-400 hover:bg-orange-400/10 transition-colors">Suspend</button>
                                        ) : (
                                            <button onClick={() => handleUpdateDriverStatus(driver._id, 'available')} className="w-full text-left px-4 py-2 text-sm text-emerald-400 hover:bg-emerald-400/10 transition-colors">Reactivate</button>
                                        )}
                                        <button onClick={() => handleDeleteDriver(driver._id)} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 transition-colors">Delete</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-dark-300">Status:</span>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${driver.status === 'available' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'
                                    }`}>
                                    {driver.status}
                                </span>
                            </div>
                            {driver.status !== 'available' && <Watch size={18} className="text-orange-400 animate-pulse" />}
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register New Driver">
                <form className="space-y-4" onSubmit={handleRegisterDriver}>
                    <div>
                        <label className="block text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">Driver Name</label>
                        <input name="name" required type="text" placeholder="e.g. John Doe" className="w-full bg-dark-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">Phone Number</label>
                        <input name="phone" required type="text" placeholder="e.g. +254 712 345 678" className="w-full bg-dark-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">Assign Task</label>
                        <input name="task" type="text" placeholder="e.g. Airport Transfer" className="w-full bg-dark-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-dark-300 hover:text-white transition-colors">Cancel</button>
                        <button type="submit" className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 transition-all">
                            <Save size={18} />
                            Register Driver
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Drivers;
