import React, { useState } from 'react';
import { FileText, Download, CheckCircle, Clock, MessageSquare, Mail } from 'lucide-react';
import { generateInvoice } from '../utils/generateInvoice';

const Invoices = ({ bookings }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter to only confirmed or paid bookings for professional invoicing
    // and apply search criteria
    const invoiceableBookings = bookings.filter(b =>
        (b.status === 'confirmed' || b.paymentStatus === 'paid') &&
        (b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.route?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.destination?.toLowerCase().includes(searchTerm.toLowerCase()))
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
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-3">Customer Invoices</h1>
                    <p className="text-slate-500 text-lg">Generate formal PDF receipts for confirmed Safari bookings.</p>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="glass-card p-6 flex flex-col gap-2">
                    <div className="text-slate-500 text-sm font-bold uppercase tracking-wider">Total Generated</div>
                    <div className="text-3xl font-black text-slate-900">{invoiceableBookings.length}</div>
                </div>
                <div className="glass-card p-6 flex flex-col gap-2 border-emerald-500/20 bg-emerald-500/5">
                    <div className="text-emerald-400 text-sm font-bold uppercase tracking-wider">Paid Invoices</div>
                    <div className="text-3xl font-black text-slate-900">{invoiceableBookings.filter(b => b.paymentStatus === 'paid').length}</div>
                </div>
                <div className="glass-card p-6 flex flex-col gap-2 border-orange-500/20 bg-orange-500/5">
                    <div className="text-orange-400 text-sm font-bold uppercase tracking-wider">Pending Balances</div>
                    <div className="text-3xl font-black text-slate-900">{invoiceableBookings.filter(b => b.paymentStatus === 'pending').length}</div>
                </div>
            </div>

            {/* Search */}
            <div className="glass-card p-5 sm:p-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-5 shadow-2xl">
                <div className="relative w-full sm:max-w-md shrink-0">
                    <input
                        type="text"
                        placeholder="Search by client name or destination..."
                        className="w-full bg-white/80 border border-slate-300 rounded-xl py-3.5 px-4 text-slate-900 placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all font-medium shadow-inner"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Invoices Data Grid */}
            <div className="glass-card !p-0 overflow-hidden border-slate-300">
                <div className="overflow-x-auto min-h-[50vh]">
                    <div className="w-full">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-100 border-b border-slate-300 text-slate-600 text-xs uppercase tracking-wider">
                                    <th className="p-4 font-semibold whitespace-nowrap">Invoice ID</th>
                                    <th className="p-4 font-semibold whitespace-nowrap">Client Name</th>
                                    <th className="p-4 font-semibold whitespace-nowrap">Destination</th>
                                    <th className="p-4 font-semibold whitespace-nowrap">Amount (KES)</th>
                                    <th className="p-4 font-semibold whitespace-nowrap">Payment Status</th>
                                    <th className="p-4 font-semibold text-right whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {invoiceableBookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-slate-100 transition-colors group">
                                        <td className="p-4 font-mono text-slate-500 text-sm whitespace-nowrap">
                                            EV-{booking._id.substring(0, 8).toUpperCase()}
                                        </td>
                                        <td className="p-4 font-medium text-slate-900 whitespace-nowrap">
                                            {booking.clientName}
                                        </td>
                                        <td className="p-4 text-slate-600 whitespace-nowrap">
                                            {booking.destination || booking.route}
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            <div className="text-slate-900 font-medium">{typeof booking.price === 'number' ? booking.price.toLocaleString() : booking.payment}</div>
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            <div className={`flex items-center gap-1.5 text-xs font-semibold ${booking.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-orange-400'}`}>
                                                {booking.paymentStatus === 'paid' ? <CheckCircle size={14} /> : <Clock size={14} />}
                                                {booking.paymentStatus.toUpperCase()}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right whitespace-nowrap">
                                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 w-full">
                                                <button
                                                    onClick={() => handleEmailShare(booking)}
                                                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg font-bold transition-colors border border-blue-500/20 w-full sm:w-auto"
                                                    title="Share via Email"
                                                >
                                                    <Mail size={16} />
                                                    <span className="hidden xl:inline">Email Invoice</span>
                                                    <span className="xl:hidden">Email</span>
                                                </button>
                                                <button
                                                    onClick={() => handleWhatsAppShare(booking)}
                                                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg font-bold transition-colors border border-emerald-500/20 w-full sm:w-auto"
                                                    title="Share via WhatsApp"
                                                >
                                                    <MessageSquare size={16} />
                                                    <span className="hidden xl:inline">Send WhatsApp</span>
                                                    <span className="xl:hidden">WhatsApp</span>
                                                </button>
                                                <button
                                                    onClick={() => generateInvoice(booking)}
                                                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-gradient-to-r from-primary-500 to-orange-500 text-white rounded-lg font-bold shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 transition-all text-sm w-full sm:w-auto"
                                                >
                                                    <Download size={16} />
                                                    <span className="hidden xl:inline">Download PDF</span>
                                                    <span className="xl:hidden">PDF</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {invoiceableBookings.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-slate-500">
                                            No confirmed bookings available for invoicing yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Invoices;
