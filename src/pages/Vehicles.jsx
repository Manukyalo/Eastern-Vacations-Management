import React, { useState } from 'react';
import { Plus, Search, MoreVertical, ShieldAlert, Key, Save, Car } from 'lucide-react';
import Modal from '../components/Modal';
import { vehicleAPI } from '../services/api';

const Vehicles = ({ user, vehicles, setVehicles }) => {
    const maxVehicles = user?.planType === 'Basic' ? 5 : user?.planType === 'Pro' ? 50 : Infinity;
    const canAddVehicle = vehicles.length < maxVehicles;
    const [searchTerm, setSearchTerm] = useState('');
    const [openDropdown, setOpenDropdown] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const handleUpdateExpiry = async (id, newDate) => {
        try {
            await vehicleAPI.update(id, { insuranceExpiry: newDate });
            setVehicles(prev => prev.map(v => v._id === id ? { ...v, insuranceExpiry: newDate } : v));
        } catch (err) { console.error('Update expiry error:', err); }
    };

    const handleDeleteVehicle = async (id) => {
        try {
            await vehicleAPI.delete(id);
            setVehicles(prev => prev.filter(v => v._id !== id));
            setOpenDropdown(null);
        } catch (err) { console.error('Delete vehicle error:', err); }
    };

    const handleUpdateVehicleStatus = async (id, newStatus) => {
        try {
            await vehicleAPI.update(id, { status: newStatus });
            setVehicles(prev => prev.map(v => v._id === id ? { ...v, status: newStatus } : v));
            setOpenDropdown(null);
        } catch (err) { console.error('Update status error:', err); }
    };

    const handleRegisterVehicle = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            const res = await vehicleAPI.create({
                model: formData.get('model'),
                plate: formData.get('plate'),
                seats: Number(formData.get('seats')),
                insuranceExpiry: formData.get('insuranceExpiry'),
                status: 'available'
            });
            setVehicles(prev => [...prev, res.data]);
            setIsAddModalOpen(false);
        } catch (err) {
            console.error('Create vehicle error:', err);
            alert('Registration Failed: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="space-y-1.5">
                    <h2 className="text-3xl font-black text-white tracking-tight">Vehicle Fleet</h2>
                    <p className="text-dark-400 text-sm font-medium">Monitor Safari Cruisers, Vans, and their insurance validity.</p>
                </div>
                <button
                    onClick={() => canAddVehicle ? setIsAddModalOpen(true) : alert(`Plan limit reached (${maxVehicles} maximum). Please upgrade your tier.`)}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg transition-all w-full sm:w-auto ${canAddVehicle ? 'bg-gradient-to-r from-primary-500 to-orange-500 hover:from-primary-400 hover:to-orange-400 text-white shadow-primary-500/20 hover:-translate-y-0.5' : 'bg-dark-700 text-dark-400 cursor-not-allowed border border-white/5'}`}
                >
                    <Plus size={20} />
                    {canAddVehicle ? 'Register Vehicle' : 'Upgrade to Add'}
                </button>
            </div>

            <div className="glass-card p-5 sm:p-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-5 shadow-2xl">
                <div className="relative w-full sm:flex-1 sm:max-w-md shrink-0">
                    <input
                        type="text"
                        placeholder="Search by model or plate..."
                        className="w-full bg-dark-900/80 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all font-medium shadow-inner"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="glass-card !p-0 overflow-hidden border-white/10 bg-transparent sm:bg-dark-800/80">
                <div className="w-full sm:min-h-[50vh]">
                    <div className="w-full px-4 py-4 sm:p-0">
                        <table className="w-full text-left border-collapse block sm:table">
                            <thead className="hidden sm:table-header-group">
                                <tr className="bg-white/5 border-b border-white/10 text-dark-300 text-xs uppercase tracking-wider">
                                    <th className="p-4 font-semibold whitespace-nowrap">Model / Year</th>
                                    <th className="p-4 font-semibold whitespace-nowrap">License Plate</th>
                                    <th className="p-4 font-semibold whitespace-nowrap">Insurance Expiry</th>
                                    <th className="p-4 font-semibold whitespace-nowrap">Status</th>
                                    <th className="p-4 font-semibold text-right whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="block sm:table-row-group divide-y-0 sm:divide-y divide-white/5 mt-4 sm:mt-0 space-y-4 sm:space-y-0">
                                {filteredVehicles.map((vehicle) => {
                                    const expiryDate = new Date(vehicle.insuranceExpiry);
                                    const today = new Date();
                                    const daysToExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
                                    const isExpiringSoon = daysToExpiry <= 30;

                                    return (
                                        <tr key={vehicle._id} className="block sm:table-row bg-dark-900/80 sm:bg-transparent rounded-2xl p-5 sm:p-0 border border-white/5 sm:border-none relative hover:bg-white/5 transition-colors group shadow-lg sm:shadow-none">
                                            <td className="block sm:table-cell mb-4 sm:mb-0 p-0 sm:p-4 whitespace-nowrap">
                                                <div className="sm:hidden text-xs font-bold text-dark-400 uppercase tracking-widest mb-1">Model / Year</div>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-medium text-white text-lg sm:text-base">{vehicle.model}</span>
                                                </div>
                                            </td>
                                            <td className="block sm:table-cell mb-4 sm:mb-0 p-0 sm:p-4 whitespace-nowrap">
                                                <div className="sm:hidden text-xs font-bold text-dark-400 uppercase tracking-widest mb-1">License Plate</div>
                                                <div className="text-primary-400 font-black font-mono tracking-wider">{vehicle.plate}</div>
                                            </td>
                                            <td className="block sm:table-cell mb-4 sm:mb-0 p-0 sm:p-4 whitespace-nowrap">
                                                <div className="sm:hidden text-xs font-bold text-dark-400 uppercase tracking-widest mb-1">Insurance Expiry</div>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="date"
                                                        value={vehicle.insuranceExpiry}
                                                        onChange={(e) => handleUpdateExpiry(vehicle._id, e.target.value)}
                                                        className={`bg-dark-800 sm:bg-transparent px-3 py-1.5 sm:p-0 rounded-lg sm:rounded-none sm:border-b text-sm focus:outline-none focus:border-blue-500 transition-colors/[color-scheme:dark] ${isExpiringSoon ? 'text-orange-400 border-orange-500/30' : 'text-dark-300 border-white/10'}`}
                                                    />
                                                    {isExpiringSoon && <ShieldAlert size={16} className="text-orange-500 animate-pulse ml-2" />}
                                                </div>
                                            </td>
                                            <td className="block sm:table-cell mb-4 sm:mb-0 p-0 sm:p-4 whitespace-nowrap">
                                                <div className="sm:hidden text-xs font-bold text-dark-400 uppercase tracking-widest mb-1">Vehicle Status</div>
                                                <span className={`px-3 py-1.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-bold ${vehicle.status === 'available' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                    }`}>
                                                    {vehicle.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="block sm:table-cell p-0 sm:p-4 text-left sm:text-right relative whitespace-nowrap mt-4 sm:mt-0 pt-4 sm:pt-0 border-t border-white/5 sm:border-none">
                                                <button
                                                    onClick={() => setOpenDropdown(openDropdown === vehicle._id ? null : vehicle._id)}
                                                    className="w-full sm:w-auto flex items-center justify-center gap-2 p-3 sm:p-2 bg-dark-800 border border-white/10 sm:border-none sm:bg-transparent text-white hover:bg-white/10 rounded-xl sm:rounded-lg transition-colors font-bold"
                                                >
                                                    <span className="sm:hidden">Manage Vehicle Configuration</span>
                                                    <MoreVertical size={18} className="hidden sm:block" />
                                                </button>

                                                {openDropdown === vehicle._id && (
                                                    <div className="absolute left-0 sm:left-auto right-0 sm:right-8 top-16 sm:top-10 w-full sm:w-36 bg-dark-800 border border-white/10 shadow-2xl rounded-xl z-20 overflow-hidden animate-in fade-in zoom-in-95">
                                                        <button onClick={() => { setOpenDropdown(null); setSelectedVehicle(vehicle); }} className="w-full text-left px-5 py-3 sm:px-4 sm:py-2 text-sm font-semibold text-white hover:bg-white/10 transition-colors border-b border-white/5 sm:border-none">View Details Log</button>
                                                        <button onClick={() => { setOpenDropdown(null); alert('Assign Driver Modal'); }} className="w-full text-left px-5 py-3 sm:px-4 sm:py-2 text-sm font-semibold text-white hover:bg-white/10 transition-colors border-b border-white/5 sm:border-none">Assign Driver Unit</button>

                                                        {vehicle.status === 'available' ? (
                                                            <button onClick={() => handleUpdateVehicleStatus(vehicle._id, 'suspended')} className="w-full text-left px-4 py-2 text-sm text-orange-400 hover:bg-orange-400/10 transition-colors">Suspend Option</button>
                                                        ) : (
                                                            <button onClick={() => handleUpdateVehicleStatus(vehicle._id, 'available')} className="w-full text-left px-4 py-2 text-sm text-emerald-400 hover:bg-emerald-400/10 transition-colors">Reactivate Option</button>
                                                        )}

                                                        <button onClick={() => handleDeleteVehicle(vehicle._id)} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 transition-colors">Delete</button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register New Vehicle">
                <form className="space-y-4" onSubmit={handleRegisterVehicle}>
                    <div>
                        <label className="block text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">Vehicle Model</label>
                        <input name="model" required type="text" placeholder="e.g. Land Cruiser V8" className="w-full bg-dark-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">License Plate</label>
                            <input name="plate" required type="text" placeholder="e.g. KCA 123B" className="w-full bg-dark-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">Seats Capacity</label>
                            <input name="seats" required type="number" min="2" max="50" placeholder="e.g. 8" className="w-full bg-dark-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">Insurance Expiry</label>
                        <input name="insuranceExpiry" required type="date" className="w-full bg-dark-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors/[color-scheme:dark]" />
                    </div>
                    <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3">
                        <button type="button" onClick={() => setIsAddModalOpen(false)} className="w-full sm:w-auto flex justify-center px-5 py-3 rounded-xl font-bold text-dark-300 hover:text-white bg-dark-800 sm:bg-transparent border border-white/5 sm:border-transparent transition-colors">Cancel</button>
                        <button type="submit" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-orange-500 hover:from-primary-400 hover:to-orange-400 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-primary-500/20 hover:-translate-y-0.5 transition-all">
                            <Save size={18} />
                            Register Vehicle
                        </button>
                    </div>
                </form>
            </Modal>

            {/* View Details Modal */}
            <Modal isOpen={!!selectedVehicle} onClose={() => setSelectedVehicle(null)} title="Vehicle Profile">
                {selectedVehicle && (
                    <div className="space-y-4">
                        <div className="bg-dark-900/50 p-4 rounded-xl border border-white/10">
                            <p className="text-xs text-dark-400 uppercase tracking-wider mb-1">Model & Make</p>
                            <p className="text-white font-bold text-lg">{selectedVehicle.model}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-dark-900/50 p-4 rounded-xl border border-white/10">
                                <p className="text-xs text-dark-400 uppercase tracking-wider mb-1">License Plate</p>
                                <p className="text-white font-mono tracking-wider">{selectedVehicle.plate}</p>
                            </div>
                            <div className="bg-dark-900/50 p-4 rounded-xl border border-white/10">
                                <p className="text-xs text-dark-400 uppercase tracking-wider mb-1">Current Status</p>
                                <span className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-semibold ${selectedVehicle.status === 'available' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                    {selectedVehicle.status}
                                </span>
                            </div>
                        </div>
                        <div className="bg-dark-900/50 p-4 rounded-xl border border-white/10 flex justify-between items-center">
                            <div>
                                <p className="text-xs text-dark-400 uppercase tracking-wider mb-1">Insurance Valid Until</p>
                                <p className="text-white">{selectedVehicle.insuranceExpiry}</p>
                            </div>
                            <ShieldAlert size={24} className={Math.ceil((new Date(selectedVehicle.insuranceExpiry) - new Date()) / (1000 * 60 * 60 * 24)) <= 30 ? "text-orange-500 animate-pulse" : "text-dark-500"} />
                        </div>
                        <div className="pt-4 flex justify-end">
                            <button onClick={() => setSelectedVehicle(null)} className="px-5 py-2.5 bg-dark-800 text-white rounded-xl font-bold border border-white/10 hover:bg-white/5 transition-colors">
                                Close Details
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Vehicles;
