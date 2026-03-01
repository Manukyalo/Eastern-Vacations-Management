import React, { useState } from 'react';
import { Plus, Search, MoreVertical, ShieldCheck, Watch, Save, Calendar, MapPin, Users, Car, Plane, Clock, Navigation } from 'lucide-react';
import Modal from '../components/Modal';
import { driverAPI } from '../services/api';
import { KENYA_PARKS } from '../utils/constants';

const Drivers = ({ user, drivers, setDrivers }) => {
    const maxDrivers = user?.planType === 'Basic' ? 5 : user?.planType === 'Pro' ? 50 : Infinity;
    const canAddDriver = drivers.length < maxDrivers;
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [activeTab, setActiveTab] = useState('standard');

    // Task Management State
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [editingTaskIndex, setEditingTaskIndex] = useState(null);

    const filteredDrivers = drivers.filter(d =>
        (d.driverType || 'standard') === activeTab &&
        d.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRegisterDriver = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            const res = await driverAPI.create({
                name: formData.get('name'),
                phone: formData.get('phone'),
                driverType: formData.get('driverType'),
                status: 'available',
                tasks: []
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

    const openTaskModal = (driver) => {
        setSelectedDriver(driver);
        setEditingTaskIndex(null);
        setIsTaskModalOpen(true);
        setOpenDropdown(null);
    };

    const extractFormData = (formData) => {
        const taskObj = {
            date: formData.get('date'),
            time: formData.get('time'),
            pickupLocation: formData.get('pickupLocation'),
            dropoffLocation: formData.get('dropoffLocation'),
            guests: Number(formData.get('guests')),
            vehicleType: formData.get('vehicleType'),
            flightNumber: formData.get('flightNumber') || '',
            flightArrivalTime: formData.get('flightArrivalTime') || '',
            sgrArrivalTime: formData.get('sgrArrivalTime') || ''
        };

        if (selectedDriver?.driverType === 'safari') {
            taskObj.park = formData.get('park');
            taskObj.days = Number(formData.get('days'));
            taskObj.nights = Number(formData.get('nights'));
            taskObj.comment = formData.get('comment') || '';
        }

        // Preserve status if editing
        if (editingTaskIndex !== null && selectedDriver.tasks[editingTaskIndex]) {
            taskObj.status = selectedDriver.tasks[editingTaskIndex].status;
        } else {
            taskObj.status = 'pending';
        }

        return taskObj;
    };

    const handleSaveTask = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newTask = extractFormData(formData);

        const updatedTasks = [...(selectedDriver.tasks || [])];
        if (editingTaskIndex !== null) {
            updatedTasks[editingTaskIndex] = newTask;
        } else {
            updatedTasks.push(newTask);
        }

        try {
            const res = await driverAPI.update(selectedDriver._id, { tasks: updatedTasks });
            setDrivers(prev => prev.map(d => d._id === selectedDriver._id ? res.data : d));
            setSelectedDriver(res.data);
            setEditingTaskIndex(null);
            e.target.reset(); // Reset form after saving
        } catch (err) {
            console.error('Error saving task:', err);
            alert('Failed to save task.');
        }
    };

    const handleToggleTaskStatus = async (taskIndex) => {
        const updatedTasks = [...(selectedDriver.tasks || [])];
        const currentStatus = updatedTasks[taskIndex].status;
        updatedTasks[taskIndex].status = currentStatus === 'pending' ? 'completed' : 'pending';

        try {
            const res = await driverAPI.update(selectedDriver._id, { tasks: updatedTasks });
            setDrivers(prev => prev.map(d => d._id === selectedDriver._id ? res.data : d));
            setSelectedDriver(res.data);
        } catch (err) {
            console.error('Error toggling task:', err);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="space-y-1.5">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Driver Fleet</h2>
                    <p className="text-slate-500 text-sm font-medium">Manage your certified tour operators and dispatch statuses.</p>
                </div>
                <button
                    onClick={() => canAddDriver ? setIsAddModalOpen(true) : alert(`Plan limit reached (${maxDrivers} maximum). Please upgrade your tier.`)}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg transition-all w-full sm:w-auto ${canAddDriver ? 'bg-gradient-to-r from-primary-500 to-orange-500 hover:from-primary-400 hover:to-orange-400 text-white shadow-primary-500/20 hover:-translate-y-0.5' : 'bg-slate-100 text-slate-500 cursor-not-allowed border border-slate-200'}`}
                >
                    <Plus size={20} />
                    {canAddDriver ? 'Register Driver' : 'Upgrade to Add'}
                </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto hide-scrollbar gap-2 border-b border-slate-300 pb-2">
                <button
                    onClick={() => setActiveTab('standard')}
                    className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-bold transition-all whitespace-nowrap ${activeTab === 'standard'
                        ? 'bg-slate-200 text-slate-900 border-b-2 border-primary-500'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                >
                    <Car size={16} />
                    City & Transfers
                </button>
                <button
                    onClick={() => setActiveTab('safari')}
                    className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-bold transition-all whitespace-nowrap ${activeTab === 'safari'
                        ? 'bg-slate-200 text-slate-900 border-b-2 border-primary-500'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                >
                    <MapPin size={16} />
                    Safari Guides
                </button>
            </div>

            <div className="glass-card p-5 sm:p-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-5 shadow-2xl">
                <div className="relative w-full sm:flex-1 sm:max-w-md shrink-0">
                    <input
                        type="text"
                        placeholder="Search by driver name..."
                        className="w-full bg-white/80 border border-slate-300 rounded-xl py-3.5 px-4 text-slate-900 placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all font-medium shadow-inner"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDrivers.map((driver) => (
                    <div key={driver._id} className="glass-card hover:bg-slate-100 border-slate-300 transition-colors group relative overflow-visible flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-full bg-slate-50 border-2 border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xl">
                                        {driver.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-slate-900 font-bold">{driver.name}</h3>
                                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                                            <ShieldCheck size={14} className="text-emerald-400" />
                                            {driver.driverType === 'safari' ? 'Safari Guide' : 'Transfer Driver'}
                                        </div>
                                    </div>
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={() => setOpenDropdown(openDropdown === driver._id ? null : driver._id)}
                                        className="text-slate-500 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-200 transition-colors"
                                    >
                                        <MoreVertical size={20} />
                                    </button>
                                    {openDropdown === driver._id && (
                                        <div className="absolute right-0 top-10 w-40 bg-slate-50 border border-slate-300 shadow-2xl rounded-xl z-20 overflow-hidden animate-in fade-in zoom-in-95">
                                            <button onClick={() => openTaskModal(driver)} className="w-full text-left px-4 py-2 text-sm text-primary-400 hover:bg-primary-400/10 transition-colors">Manage Tasks</button>
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

                            {/* Legacy Task Fallback OR Pending Tasks Count */}
                            <div className="mt-4 mb-2">
                                {(driver.tasks && driver.tasks.length > 0) ? (
                                    <div className="text-sm font-medium text-slate-700 bg-slate-50/50 p-3 rounded-lg border border-slate-200">
                                        <span className="text-primary-400 font-bold">{driver.tasks.filter(t => t.status === 'pending').length}</span> Pending Tasks
                                        <br />
                                        <span className="text-emerald-400 font-bold">{driver.tasks.filter(t => t.status === 'completed').length}</span> Completed
                                    </div>
                                ) : driver.task ? (
                                    <div className="text-sm font-medium text-slate-700 bg-slate-50/50 p-3 rounded-lg border border-slate-200">
                                        <span className="text-slate-500 text-xs block mb-1">Legacy Task:</span>
                                        {driver.task}
                                    </div>
                                ) : (
                                    <div className="text-sm font-medium text-slate-500 italic bg-slate-50/50 p-3 rounded-lg border border-slate-200">
                                        No tasks assigned.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-slate-600">Status:</span>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${driver.status === 'available' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'
                                    }`}>
                                    {driver.status}
                                </span>
                            </div>
                            <button onClick={() => openTaskModal(driver)} className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-900 px-3 py-1.5 rounded-lg transition-colors">
                                Schedule
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Registration Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register New Driver">
                <form className="space-y-4" onSubmit={handleRegisterDriver}>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Driver Name</label>
                        <input name="name" required type="text" placeholder="e.g. John Doe" className="w-full bg-white/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-emerald-500 transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                        <input name="phone" required type="text" placeholder="e.g. +254 712 345 678" className="w-full bg-white/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-emerald-500 transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Driver Classification</label>
                        <select name="driverType" className="w-full bg-white/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-emerald-500 transition-colors">
                            <option value="standard">City & Transfer Driver</option>
                            <option value="safari">Safari Guide</option>
                        </select>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:text-slate-900 transition-colors">Cancel</button>
                        <button type="submit" className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-900 px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 transition-all">
                            <Save size={18} />
                            Register Driver
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Task Management Modal */}
            <Modal isOpen={isTaskModalOpen} onClose={() => { setIsTaskModalOpen(false); setEditingTaskIndex(null); }} title={`Manage Tasks: ${selectedDriver?.name}`}>
                <div className="space-y-6">
                    {/* Task List */}
                    <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
                        {selectedDriver?.tasks?.length === 0 ? (
                            <p className="text-slate-500 text-sm text-center py-4 bg-slate-50/50 rounded-xl border border-slate-200">No active or completed tasks.</p>
                        ) : (
                            selectedDriver?.tasks?.map((task, index) => (
                                <div key={index} className={`p-4 rounded-xl border ${task.status === 'completed' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-50 border-slate-300'} relative group`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-bold text-slate-900 text-sm">
                                            {task.date} at {task.time}
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleToggleTaskStatus(index)} className={`text-xs px-2 py-1 rounded-md font-bold transition-colors ${task.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30'}`}>
                                                {task.status === 'completed' ? 'Completed' : 'Mark Complete'}
                                            </button>
                                            <button onClick={() => setEditingTaskIndex(index)} className="text-xs px-2 py-1 bg-slate-200 text-slate-900 rounded-md hover:bg-slate-300 transition-colors">
                                                Edit
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-xs text-slate-600 space-y-1">
                                        <div className="flex items-center gap-1"><Navigation size={12} /> Route: {task.pickupLocation} → {task.dropoffLocation}</div>
                                        {task.flightNumber && <div className="flex items-center gap-1"><Plane size={12} /> Flight: {task.flightNumber} (Arr: {task.flightArrivalTime})</div>}
                                        {task.sgrArrivalTime && <div className="flex items-center gap-1"><Clock size={12} /> SGR Arrival: {task.sgrArrivalTime}</div>}
                                        {selectedDriver.driverType === 'safari' && task.park && (
                                            <>
                                                <div className="flex items-center gap-1 text-primary-400 mt-2 font-medium">
                                                    <MapPin size={12} /> {task.park} - {task.days} Days / {task.nights} Nights
                                                </div>
                                                {task.comment && (
                                                    <div className="mt-1 text-slate-600 italic border-l-2 border-primary-500/30 pl-2">
                                                        "{task.comment}"
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <hr className="border-slate-300" />

                    {/* Add/Edit Task Form */}
                    <form onSubmit={handleSaveTask} className="space-y-4 bg-slate-50/50 p-4 rounded-xl border border-slate-200">
                        <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                            {editingTaskIndex !== null ? '✎ Edit Task Schedule' : '📅 Add New Task'}
                        </h4>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Date</label>
                                <input name="date" required type="date" defaultValue={editingTaskIndex !== null ? selectedDriver.tasks[editingTaskIndex].date : ''} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary-500" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Time</label>
                                <input name="time" required type="time" defaultValue={editingTaskIndex !== null ? selectedDriver.tasks[editingTaskIndex].time : ''} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Pickup Location</label>
                                <input name="pickupLocation" required type="text" placeholder="e.g. JKIA" defaultValue={editingTaskIndex !== null ? selectedDriver.tasks[editingTaskIndex].pickupLocation : ''} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary-500" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Dropoff Location</label>
                                <input name="dropoffLocation" required type="text" placeholder="e.g. Hotel" defaultValue={editingTaskIndex !== null ? selectedDriver.tasks[editingTaskIndex].dropoffLocation : ''} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-1">
                                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Plane size={10} /> Flight No. (Opt)</label>
                                <input name="flightNumber" type="text" placeholder="e.g. KQ100" defaultValue={editingTaskIndex !== null ? selectedDriver.tasks[editingTaskIndex].flightNumber : ''} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary-500" />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Clock size={10} /> Flight Arr. (Opt)</label>
                                <input name="flightArrivalTime" type="time" defaultValue={editingTaskIndex !== null ? selectedDriver.tasks[editingTaskIndex].flightArrivalTime : ''} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary-500" />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Clock size={10} /> SGR Arr. (Opt)</label>
                                <input name="sgrArrivalTime" type="time" defaultValue={editingTaskIndex !== null ? selectedDriver.tasks[editingTaskIndex].sgrArrivalTime : ''} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Users size={10} /> Guests</label>
                                <input name="guests" required type="number" min="1" defaultValue={editingTaskIndex !== null ? selectedDriver.tasks[editingTaskIndex].guests : ''} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary-500" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Car size={10} /> Vehicle Type</label>
                                <input name="vehicleType" required type="text" placeholder="e.g. Land Cruiser" defaultValue={editingTaskIndex !== null ? selectedDriver.tasks[editingTaskIndex].vehicleType : ''} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary-500" />
                            </div>
                        </div>

                        {selectedDriver?.driverType === 'safari' && (
                            <div className="bg-primary-500/5 border border-primary-500/20 p-3 rounded-xl mt-4 space-y-4">
                                <h5 className="text-xs font-bold text-primary-400 flex items-center gap-1"><MapPin size={12} /> Safari Itinerary Details</h5>
                                <div>
                                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">National Park / Reserve</label>
                                    <select name="park" required defaultValue={editingTaskIndex !== null ? selectedDriver.tasks[editingTaskIndex].park : ''} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary-500">
                                        <option value="">Select a Park...</option>
                                        {KENYA_PARKS.map(park => (
                                            <option key={park} value={park}>{park}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Days</label>
                                        <input name="days" required type="number" min="1" defaultValue={editingTaskIndex !== null ? selectedDriver.tasks[editingTaskIndex].days : ''} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary-500" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Nights</label>
                                        <input name="nights" required type="number" min="0" defaultValue={editingTaskIndex !== null ? selectedDriver.tasks[editingTaskIndex].nights : ''} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary-500" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Admin/Reservation Comment (Optional)</label>
                                    <textarea name="comment" rows="2" placeholder="Add notes for this week/two-weeks safari..." defaultValue={editingTaskIndex !== null ? selectedDriver.tasks[editingTaskIndex].comment : ''} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary-500 resize-none"></textarea>
                                </div>
                            </div>
                        )}

                        <div className="pt-2 flex justify-end gap-2">
                            {editingTaskIndex !== null && (
                                <button type="button" onClick={() => { setEditingTaskIndex(null); }} className="px-4 py-2 text-sm rounded-lg font-bold text-slate-600 hover:text-slate-900 transition-colors border border-slate-300">Discard Edit</button>
                            )}
                            <button type="submit" className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-orange-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 transition-all text-sm">
                                <Save size={14} />
                                {editingTaskIndex !== null ? 'Update Selected Task' : '+ Add New Task'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default Drivers;

