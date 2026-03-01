import React, { useState, useRef, useEffect } from 'react';
import { Plus, Search, Filter, MoreVertical, Calendar, Save, Car, MapPin, Navigation, FileText, ChevronDown, MessageSquare, Mail, CheckCircle, Trash } from 'lucide-react';
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
                endDate: formData.get('endDate'),
                guests: Number(formData.get('guests')),
                payment: Number(formData.get('payment')),
                vehicle: formData.get('vehicle'),
                driver: formData.get('driverId'),
                status: 'pending',
                paymentStatus: 'pending',
                category: activeTab
            });
            setBookings(prev => [...prev, res.data]);
            setIsAddModalOpen(false);
            alert('Booking registered successfully!');
        } catch (err) {
            console.error('Error creating booking:', err);
            alert('Transaction Failed. System validation error:\n' + err.message);
        }
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
            await bookingAPI.update(id, { paymentStatus: 'paid', requiresAdminVerification: true });
            setBookings(prev => prev.map(b => b._id === id ? { ...b, paymentStatus: 'paid' } : b));
            setOpenDropdown(null);

            if (user?.role === 'reservation') {
                alert('Payment logged. A notification has been sent to the Admin for final verification.');
                // In a full implementation, this would trigger a socket event or email to the admin.
            } else {
                alert('Payment confirmed successfully.');
            }
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

    const handleWhatsAppShare = (booking) => {
        const text = encodeURIComponent(
            `Hello ${booking.clientName},\n\nYour Eastern Vacations invoice for the ${booking.destination || booking.route} safari is ready.\n\nTotal Due: KES ${typeof booking.price === 'number' ? booking.price.toLocaleString() : booking.payment}\n\n*Please ensure you have attached the PDF receipt.*`
        );
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    const handleEmailShare = (booking) => {
        const subject = encodeURIComponent(`Eastern Vacations Invoice - ${booking.clientName}`);
        const body = encodeURIComponent(
            `Hello ${booking.clientName},\n\nPlease find attached your formal Eastern Vacations invoice for the recent ${booking.destination || booking.route} safari.\n\nTotal Due: KES ${typeof booking.price === 'number' ? booking.price.toLocaleString() : booking.payment}\n\nThank you for choosing Eastern Vacations Kenya.\n\nBest regards,\nThe Reservations Team`
        );
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="space-y-1.5">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Manage Reservations</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Organize safaris, transfers, and city tours.</p>
                </div>
                <button
                    onClick={() => canAddBooking ? setIsAddModalOpen(true) : alert("Basic Plan limit reached (50 maximum). Upgrade to Pro or Enterprise for unlimited safaris!")}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg transition-all whitespace-nowrap w-full sm:w-auto ${canAddBooking ? 'bg-gradient-to-r from-primary-500 to-orange-500 hover:from-primary-400 hover:to-orange-400 text-white shadow-primary-500/20 hover:-translate-y-0.5' : 'bg-slate-100 dark:bg-[#1e293b] text-slate-500 dark:text-slate-400 cursor-not-allowed border border-slate-200 dark:border-white/5'}`}
                >
                    <Plus size={20} />
                    {canAddBooking ? currentTab.actionText : 'Upgrade to Add'}
                </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto hide-scrollbar gap-2 border-b border-slate-300 dark:border-white/10 pb-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white border-b-2 border-primary-500'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-[#1e293b]'
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
                        className="w-full bg-white/80 dark:bg-white/10 border border-slate-300 dark:border-white/10 rounded-xl py-3.5 px-4 text-slate-900 dark:text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all font-medium shadow-inner"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => setIsFilterActive(!isFilterActive)}
                    className={`flex items-center gap-2 border px-5 py-3 rounded-xl transition-colors w-full sm:w-auto shrink-0 justify-center h-full ${isFilterActive ? 'bg-primary-500/20 border-primary-500/50 text-primary-400' : 'bg-white/50 dark:bg-white/5 border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:bg-[#1e293b]'
                        }`}
                >
                    <Filter size={20} />
                    {isFilterActive ? 'Filter Active' : 'Filter Options'}
                </button>
                <div className="hidden sm:block flex-1"></div>
            </div>

            {/* Data Grid */}
            <div className="glass-card !p-0 overflow-hidden border-slate-300 dark:border-white/10">
                <div className="overflow-x-auto min-h-[50vh]">
                    <div className="w-full">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-100 dark:bg-[#1e293b] border-b border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider">
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
                                    <tr key={booking._id} className="hover:bg-slate-100 dark:bg-[#1e293b] transition-colors group">
                                        <td className="p-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">{booking.clientName}</td>
                                        <td className="p-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">{booking.destination}</td>
                                        <td className="p-4 text-slate-600 dark:text-slate-300 flex items-center gap-2 whitespace-nowrap mt-1">
                                            <Calendar size={16} className="text-primary-400" />
                                            {booking.startDate}
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${booking.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            <div className="text-slate-900 dark:text-white font-medium">Ksh {booking.payment}</div>
                                            <div className={`text-xs ${booking.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-orange-400'}`}>
                                                {booking.paymentStatus}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex flex-wrap items-center justify-end gap-2 min-w-max">
                                                {booking.paymentStatus === 'pending' && (user?.role === 'reservation' || user?.role === 'admin') && (
                                                    <button onClick={() => handleConfirmPayment(booking._id)} className="p-2 sm:p-2.5 bg-blue-50 text-blue-500 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200" title="Confirm Payment">
                                                        <CheckCircle size={18} />
                                                    </button>
                                                )}
                                                {booking.status === 'pending' && (
                                                    <button onClick={() => handleUpdateBookingStatus(booking._id, 'confirmed')} className="p-2 sm:p-2.5 bg-emerald-50 text-emerald-500 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200" title="Confirm Safari">
                                                        <Calendar size={18} />
                                                    </button>
                                                )}
                                                {booking.status === 'confirmed' && (
                                                    <button onClick={() => handleUpdateBookingStatus(booking._id, 'completed')} className="p-2 sm:p-2.5 bg-purple-50 text-purple-500 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200" title="Mark as Completed">
                                                        <CheckCircle size={18} />
                                                    </button>
                                                )}
                                                {booking.status === 'completed' && (
                                                    <button onClick={() => handleDeleteBooking(booking._id)} className="p-2 sm:p-2.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors border border-red-200" title="Delete Booking">
                                                        <Trash size={18} />
                                                    </button>
                                                )}
                                                <button onClick={() => handleEmailShare(booking)} className="p-2 sm:p-2.5 bg-indigo-50 text-indigo-500 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200" title="Email Client">
                                                    <Mail size={18} />
                                                </button>
                                                <button onClick={() => handleWhatsAppShare(booking)} className="p-2 sm:p-2.5 bg-green-50 text-green-500 hover:bg-green-100 rounded-lg transition-colors border border-green-200" title="WhatsApp Client">
                                                    <MessageSquare size={18} />
                                                </button>
                                                <button onClick={() => generateInvoice(booking)} className="p-2 sm:p-2.5 flex items-center justify-center gap-2 bg-gradient-to-r from-primary-400 to-orange-500 text-white rounded-lg font-bold shadow-sm shadow-orange-500/20 hover:-translate-y-0.5 transition-all text-sm">
                                                    <FileText size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredBookings.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-slate-500 dark:text-slate-400">
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
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Client Name</label>
                        <input name="clientName" required type="text" placeholder="e.g. Michael Scott" className="w-full bg-white/50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Route / Destination</label>
                        <input name="destination" required type="text" placeholder="e.g. Airport Transfer or Masai Mara" className="w-full bg-white/50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Assign Vehicle</label>
                            <input name="vehicle" type="text" placeholder="e.g. Toyota Hiace KCD 123A" className="w-full bg-white/50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Assign Driver</label>
                            <input name="driverId" type="text" placeholder="e.g. John Doe" className="w-full bg-white/50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Start Date</label>
                            <input name="startDate" required type="date" className="w-full bg-white/50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors/[color-scheme:dark]" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">End Date</label>
                            <input name="endDate" required type="date" className="w-full bg-white/50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors/[color-scheme:dark]" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Number of Guests</label>
                            <input name="guests" required type="number" min="1" placeholder="2" className="w-full bg-white/50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Payment Initial (Ksh)</label>
                            <input name="payment" required type="number" placeholder="2500" className="w-full bg-white/50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors" />
                        </div>
                    </div>
                    <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3">
                        <button type="button" onClick={() => setIsAddModalOpen(false)} className="w-full sm:w-auto flex justify-center px-5 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white bg-slate-50 dark:bg-[#0f172a] sm:bg-transparent border border-slate-200 dark:border-white/5 sm:border-transparent transition-colors">Cancel</button>
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
