import React from 'react';
import { Calendar, Users, Car, DollarSign, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useAITracker } from '../hooks/useAITracker';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const StatCard = ({ title, value, icon, color, trend }) => {
    const colorMap = {
        blue: 'from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/20',
        green: 'from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/20',
        orange: 'from-orange-500/20 to-orange-600/5 text-orange-400 border-orange-500/20',
        purple: 'from-purple-500/20 to-purple-600/5 text-purple-400 border-purple-500/20',
    };

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className={`glass-card relative overflow-hidden group`}
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${colorMap[color]} opacity-50`} />
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-white/50 rounded-xl border border-slate-200 shadow-inner">
                        {icon}
                    </div>
                    {trend && (
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${trend > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                            }`}>
                            {trend > 0 ? '+' : ''}{trend}%
                        </span>
                    )}
                </div>
                <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
                <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
            </div>

            <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-current opacity-10 blur-2xl group-hover:scale-150 transition-transform duration-500`} />
        </motion.div>
    );
};

const Dashboard = ({ bookings, drivers, vehicles, user }) => {
    const activeBookings = bookings?.filter(b => b.status === 'confirmed').length || 0;
    const pendingBookings = bookings?.filter(b => b.status === 'pending').length || 0;
    const availableDrivers = drivers?.filter(d => d.status === 'available').length || 0;
    const totalRevenue = bookings?.reduce((acc, curr) => acc + (curr.payment || 0), 0) || 0;

    const aiAlerts = useAITracker(vehicles, bookings);

    // Chart.js Configuration
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleColor: '#fff',
                bodyColor: '#cbd5e1',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                callbacks: {
                    label: function (context) {
                        return 'Ksh ' + context.parsed.y.toLocaleString();
                    }
                }
            },
        },
        scales: {
            x: { display: false }, // Hide bottom X-axis lines and ticks
            y: { display: false }, // Hide side Y-axis lines and ticks
        },
        interaction: { mode: 'nearest', axis: 'x', intersect: false },
        layout: { padding: 0 }
    };

    // Calculate dynamic revenue data per month
    const processRevenueData = () => {
        if (!bookings) return { labels: [], data: [] };

        const monthlyRevenue = {};
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // Initialize all months to 0
        months.forEach(m => monthlyRevenue[m] = 0);

        bookings.forEach(booking => {
            if (booking.paymentStatus === 'paid' && booking.startDate) {
                const date = new Date(booking.startDate);
                const monthName = months[date.getMonth()];
                monthlyRevenue[monthName] += Number(booking.payment || 0);
            }
        });

        return {
            labels: months,
            data: months.map(m => monthlyRevenue[m])
        };
    };

    const liveChartData = processRevenueData();

    const revenueData = {
        labels: liveChartData.labels,
        datasets: [
            {
                label: 'Revenue',
                data: liveChartData.data,
                fill: true,
                borderColor: '#fbbf24',
                backgroundColor: 'rgba(251, 191, 36, 0.1)',
                tension: 0.4,
                borderWidth: 3,
                pointBackgroundColor: '#fbbf24',
                pointBorderColor: '#fff',
                pointRadius: 0, // Hide dots globally for a cleaner sparkline look
                pointHoverRadius: 6,
            },
        ],
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            <div className="glass-card mb-8 border-primary-500/20 bg-gradient-to-r from-primary-900/20 to-transparent">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Ready for today's adventures?
                </h2>
                <p className="text-slate-500">
                    You have <span className="text-primary-400 font-bold">{pendingBookings} pending bookings</span> that need your attention.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Active Safaris" value={activeBookings} icon={<Calendar size={24} className="text-blue-400" />} color="blue" trend={12} />
                <StatCard title="Available Drivers" value={availableDrivers} icon={<Users size={24} className="text-emerald-400" />} color="green" />
                <StatCard title="Pending Bookings" value={pendingBookings} icon={<Clock size={24} className="text-orange-400" />} color="orange" trend={-5} />
                {user?.role === 'admin' && (
                    <StatCard title="Total Revenue" value={totalRevenue.toLocaleString()} icon={<DollarSign size={24} className="text-purple-400" />} color="purple" trend={8} />
                )}
            </div>

            {/* Admin Chart Section */}
            {user?.role === 'admin' && (
                <div className="glass-card mt-8 p-6 border border-slate-200">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Revenue Overview</h3>
                            <p className="text-sm text-slate-500">Monthly financial performance</p>
                        </div>
                        <select className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg px-3 py-2 outline-none focus:border-primary-500/50">
                            <option>This Year</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    <div className="h-72 w-full">
                        <Line options={chartOptions} data={revenueData} />
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                <div className="lg:col-span-2 glass-card">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Recent Deployments</h3>
                        <button className="text-sm text-primary-400 hover:text-primary-300 transition-colors">View All</button>
                    </div>

                    <div className="space-y-4">
                        {bookings?.slice(0, 5).map((booking) => (
                            <div key={booking._id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 border border-slate-200 hover:bg-slate-100 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${booking.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400' :
                                        booking.status === 'pending' ? 'bg-orange-500/10 text-orange-400' :
                                            'bg-dark-500/10 text-slate-500'
                                        }`}>
                                        {booking.status === 'confirmed' ? <CheckCircle size={20} /> :
                                            booking.status === 'pending' ? <Clock size={20} /> :
                                                <AlertTriangle size={20} />}
                                    </div>
                                    <div>
                                        <h4 className="text-slate-900 font-medium">{booking.clientName}</h4>
                                        <p className="text-xs text-slate-500">{booking.destination} &bull; {booking.startDate}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    {user?.role === 'admin' && <p className="text-slate-900 font-bold">{booking.payment.toLocaleString()}</p>}
                                    <p className={`text-xs capitalize font-medium ${booking.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-orange-400'}`}>
                                        {booking.paymentStatus}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-card flex flex-col gap-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4">AI Insurance Alerts</h3>
                        <div className="space-y-3">
                            {/* Render alerts dynamically from AI tracker */}
                            {aiAlerts.filter(a => a.id.startsWith('ins-')).map(alert => (
                                <div key={alert.id} className={`p-3 rounded-lg border flex gap-3 ${alert.type === 'critical' ? 'bg-red-500/10 border-red-500/20' : 'bg-orange-500/10 border-orange-500/20'
                                    }`}>
                                    <AlertTriangle className={`${alert.type === 'critical' ? 'text-red-400' : 'text-orange-400'} shrink-0 mt-0.5`} size={16} />
                                    <div>
                                        <p className={`text-sm font-medium ${alert.type === 'critical' ? 'text-red-200' : 'text-orange-200'}`}>{alert.title}</p>
                                        <p className={`text-xs ${alert.type === 'critical' ? 'text-red-300/80' : 'text-orange-300/80'}`}>{alert.message}</p>
                                    </div>
                                </div>
                            ))}
                            {aiAlerts.filter(a => a.id.startsWith('ins-')).length === 0 && (
                                <p className="text-slate-500 text-sm italic">AI Tracker: All policies active.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
