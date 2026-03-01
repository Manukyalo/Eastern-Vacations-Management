import React, { useState, useRef, useEffect } from 'react';
import { Plus, Search, Filter, MoreVertical, Calendar, Save, Car, MapPin, Navigation } from 'lucide-react';
import Modal from '../components/Modal';
import { bookingAPI } from '../services/api';
import { generateInvoice } from '../utils/generateInvoice';

const Bookings = ({ user, bookings, setBookings, drivers, vehicles }) => {
    const maxBookings = user?.planType === 'Basic' ? 50 : Infinity;
    const canAddBooking = bookings.length < maxBookings;
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isFilterActive, setIsFilterActive] = useState(false);
    const [activeTab, setActiveTab] = useState('safaris');
    const [openDropdown, setOpenDropdown] = useState(null);

    const handleSaveBooking = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            const res = await bookingAPI.create({
                clientName: formData.get('clientName'),
                destination: formData.get('destination'),
                startDate: formData.get('startDate'),
                payment: Number(formData.get('payment')),
                vehicle: formData.get('vehicle'),
                driverId: formData.get('driverId'),
                status: 'pending',
                paymentStatus: 'pending',
                category: activeTab
            });
            setBookings(prev => [...prev, res.data]);
            setIsAddModalOpen(false);
        } catch (err) { console.error('Error creating booking:', err); }
    };

    const handleUpdateBookingStatus = async (id, newStatus) => {
        try {
            await bookingAPI.update(id, { status: newStatus });
            setBookings(prev => prev.map(b => b._id === id ? { ...b, status: newStatus } : b));
            setOpenDropdown(null);
        } catch (err) { console.error('Error updating status:', err); }
    };

    const handleConfirmPayment = async (id) => {
        try {
            await bookingAPI.update(id, { paymentStatus: 'paid' });
            setBookings(prev => prev.map(b => b._id === id ? { ...b, paymentStatus: 'paid' } : b));
            setOpenDropdown(null);
        } catch (err) { console.error('Error confirming payment:', err); }
    };

    const handleDeleteBooking = async (id) => {
        try {
            await bookingAPI.delete(id);
            setBookings(prev => prev.filter(b => b._id !== id));
            setOpenDropdown(null);
        } catch (err) { console.error('Error deleting booking:', err); }
    };

    const tabs = [
        { id: 'safaris', label: 'Safaris', icon: <MapPin size={16} />, actionText: 'New Safari' },
        { id: 'transfers', label: 'Transfers', icon: <Car size={16} />, actionText: 'New Transfer' },
        { id: 'city_tours', label: 'City Tours', icon: <Navigation size={16} />, actionText: 'New City Tour' },
        { id: 'drop_offs', label: 'Drop Offs', icon: <Navigation size={16} className="rotate-180" />, actionText: 'New Drop Off' },
    ];

    const currentTab = tabs.find(t => t.id === activeTab);

    // Filter bookings based on active category tab and search term
    const filteredBookings = bookings.filter(b =>
        b.category === activeTab &&
        b.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="space-y-1.5">
                    <h2 className="text-3xl font-black text-white tracking-tight">Manage Reservations</h2>
                    <p className="text-dark-400 text-sm font-medium">Organize safaris, transfers, and city tours.</p>
                </div>
                <button
                    onClick={() => canAddBooking ? setIsAddModalOpen(true) : alert("Basic Plan limit reached (50 maximum). Upgrade to Pro or Enterprise for unlimited safaris!")}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg transition-all whitespace-nowrap w-full sm:w-auto ${canAddBooking ? 'bg-gradient-to-r from-primary-500 to-orange-500 hover:from-primary-400 hover:to-orange-400 text-white shadow-primary-500/20 hover:-translate-y-0.5' : 'bg-dark-700 text-dark-400 cursor-not-allowed border border-white/5'}`}
                >
                    <Plus size={20} />
                    {canAddBooking ? currentTab.actionText : 'Upgrade to Add'}
                </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto hide-scrollbar gap-2 border-b border-white/10 pb-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                            ? 'bg-white/10 text-white border-b-2 border-primary-500'
                            : 'text-dark-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="glass-card p-5 sm:p-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-5 shadow-2xl">
                <div className="relative w-full sm:flex-1 sm:max-w-md shrink-0">
                    <input
                        type="text"
                        placeholder={`Search ${currentTab.label.toLowerCase()}...`}
                        className="w-full bg-dark-900/80 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all font-medium shadow-inner"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => setIsFilterActive(!isFilterActive)}
                    className={`flex items-center gap-2 border px-5 py-3 rounded-xl transition-colors w-full sm:w-auto shrink-0 justify-center h-full ${isFilterActive ? 'bg-primary-500/20 border-primary-500/50 text-primary-400' : 'bg-dark-900/50 border-white/10 text-dark-200 hover:bg-white/5'
                        }`}
                >
                    <Filter size={20} />
                    {isFilterActive ? 'Filter Active' : 'Filter Options'}
                </button>
                <div className="hidden sm:block flex-1"></div>
            </div>

            {/* Data Grid */}
            <div className="glass-card !p-0 overflow-hidden border-white/10">
                <div className="overflow-x-auto min-h-[50vh]">
                    <div className="w-full">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10 text-dark-300 text-xs uppercase tracking-wider">
                                    <th className="p-4 font-semibold whitespace-nowrap">Client Name</th>
                                    <th className="p-4 font-semibold whitespace-nowrap">Destination / Route</th>
                                    <th className="p-4 font-semibold whitespace-nowrap">Date</th>
                                    <th className="p-4 font-semibold whitespace-nowrap">Status</th>
                                    <th className="p-4 font-semibold whitespace-nowrap">Payment</th>
                                    <th className="p-4 font-semibold text-right whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredBookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4 font-medium text-white whitespace-nowrap">{booking.clientName}</td>
                                        <td className="p-4 text-dark-300 whitespace-nowrap">{booking.destination}</td>
                                        <td className="p-4 text-dark-300 flex items-center gap-2 whitespace-nowrap mt-1">
                                            <Calendar size={16} className="text-primary-400" />
                                            {booking.startDate}
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${booking.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            <div className="text-white font-medium">Ksh {booking.payment}</div>
                                            <div className={`text-xs ${booking.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-orange-400'}`}>
                                                {booking.paymentStatus}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right relative whitespace-nowrap">
                                            <button
                                                onClick={() => setOpenDropdown(openDropdown === booking._id ? null : booking._id)}
                                                className="p-2 text-dark-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                            >
                                                <MoreVertical size={18} />
                                            </button>

                                            {openDropdown === booking._id && (
                                                <div className="absolute right-8 top-10 w-36 bg-dark-800 border border-white/10 shadow-2xl rounded-xl z-20 overflow-hidden animate-in fade-in zoom-in-95">
                                                    {booking.status === 'pending' && <button onClick={() => handleUpdateBookingStatus(booking._id, 'confirmed')} className="w-full text-left px-4 py-2 text-sm text-emerald-400 hover:bg-emerald-400/10 transition-colors">Confirm</button>}
                                                    {booking.paymentStatus === 'pending' && <button onClick={() => handleConfirmPayment(booking._id)} className="w-full text-left px-4 py-2 text-sm text-blue-400 hover:bg-blue-400/10 transition-colors">Confirm Payment</button>}
                                                    {booking.status !== 'cancelled' && <button onClick={() => handleUpdateBookingStatus(booking._id, 'cancelled')} className="w-full text-left px-4 py-2 text-sm text-orange-400 hover:bg-orange-400/10 transition-colors">Cancel</button>}
                                                    <button onClick={() => generateInvoice(booking)} className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors">Download Invoice (PDF)</button>
                                                    <button onClick={() => handleDeleteBooking(booking._id)} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 transition-colors">Delete</button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filteredBookings.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-dark-400">
                                            No {currentTab.label.toLowerCase()} found. Try adjusting your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title={currentTab.actionText}>
                <form className="space-y-4" onSubmit={handleSaveBooking}>
                    <div>
                        <label className="block text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">Client Name</label>
                        <input name="clientName" required type="text" placeholder="e.g. Michael Scott" className="w-full bg-dark-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">Route / Destination</label>
                        <input name="destination" required type="text" placeholder="e.g. Airport Transfer or Masai Mara" className="w-full bg-dark-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">Assign Vehicle</label>
                            <input name="vehicle" type="text" placeholder="e.g. Toyota Hiace KCD 123A" className="w-full bg-dark-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">Assign Driver</label>
                            <input name="driverId" type="text" placeholder="e.g. John Doe" className="w-full bg-dark-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">Start Date</label>
                            <input name="startDate" required type="date" className="w-full bg-dark-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors/[color-scheme:dark]" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">Payment Initial (Ksh)</label>
                            <input name="payment" required type="number" placeholder="2500" className="w-full bg-dark-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors" />
                        </div>
                    </div>
                    <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3">
                        <button type="button" onClick={() => setIsAddModalOpen(false)} className="w-full sm:w-auto flex justify-center px-5 py-3 rounded-xl font-bold text-dark-300 hover:text-white bg-dark-800 sm:bg-transparent border border-white/5 sm:border-transparent transition-colors">Cancel</button>
                        <button type="submit" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-orange-500 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 transition-all">
                            <Save size={18} />
                            Save
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Bookings;
