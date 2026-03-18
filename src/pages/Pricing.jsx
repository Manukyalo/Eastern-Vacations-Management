import React, { useState } from 'react';
import { Check, Zap, Shield, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { authAPI } from '../services/api';

const PricingCard = ({ tier, isSelected, onSelect }) => {
    const isEnterprise = tier.name === 'Enterprise';

    return (
        <motion.div
            whileHover={{ y: -10 }}
            className={`relative rounded-3xl p-8 flex flex-col h-full bg-slate-50 dark:bg-[#0f172a]/80 backdrop-blur-xl border transition-all ${isSelected ? 'border-primary-500 shadow-2xl shadow-primary-500/20 scale-105 z-10' : 'border-slate-300 dark:border-white/10 opacity-70 hover:opacity-100 cursor-pointer'
                }`}
            onClick={() => !isSelected && onSelect(tier)}
        >
            {isSelected && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary-500 to-orange-500 rounded-full text-xs font-bold text-white shadow-lg uppercase tracking-wider">
                    Selected Plan
                </div>
            )}

            {isEnterprise && (
                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent rounded-3xl pointer-events-none" />
            )}

            <div className="mb-8 relative z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-lg ${tier.name === 'Basic' ? 'bg-blue-500/20 text-blue-400' :
                    tier.name === 'Pro' ? 'bg-gradient-to-br from-primary-400 to-orange-500 text-white shadow-orange-500/30' :
                        'bg-purple-500/20 text-purple-400'
                    }`}>
                    {tier.name === 'Basic' ? <Shield size={24} /> :
                        tier.name === 'Pro' ? <Zap size={24} /> :
                            <Crown size={24} />}
                </div>

                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{tier.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm min-h-[40px]">{tier.description}</p>
            </div>

            <div className="mb-8 relative z-10">
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-slate-900 dark:text-white">${tier.price}</span>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">/month</span>
                </div>
                <div className="mt-2 text-primary-400 text-sm font-semibold">
                    or Ksh {tier.kesPrice} /month
                </div>
            </div>

            <ul className="space-y-4 mb-8 flex-1 relative z-10">
                {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                        <Check size={20} className={isSelected ? 'text-primary-400 shrink-0' : 'text-slate-500 dark:text-slate-400 shrink-0'} />
                        <span className={feature.highlight ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-600 dark:text-slate-300'}>{feature.text}</span>
                    </li>
                ))}
            </ul>

            <button
                onClick={(e) => { e.stopPropagation(); onSelect(tier); }}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 relative z-10 ${isSelected
                    ? 'bg-gradient-to-r from-primary-500 to-orange-500 text-white shadow-lg shadow-orange-500/30'
                    : isEnterprise
                        ? 'bg-purple-600 hover:bg-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-1'
                        : 'bg-slate-100 dark:bg-[#1e293b] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-800 hover:-translate-y-1'
                    }`}
            >
                {isSelected ? 'Active Subscription' : tier.cta}
            </button>
        </motion.div>
    );
};

const Pricing = ({ user, setUser }) => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const tiers = [
        {
            name: 'Pro',
            price: 99,
            kesPrice: '12,900',
            description: 'Advanced management for growing regional tour companies.',
            cta: 'Upgrade to Pro',
            features: [
                { text: 'Unlimited active bookings', highlight: true },
                { text: 'Manage up to 50 drivers/vehicles' },
                { text: 'M-Pesa automated payments', highlight: true },
                { text: 'Automated PDF customer invoices' },
                { text: 'Priority 24/7 support' },
            ]
        },
        {
            name: 'Enterprise',
            price: 249,
            kesPrice: '32,500',
            description: 'Full-scale solution for high-volume multinational operators.',
            cta: 'Contact Sales',
            features: [
                { text: 'Everything in Pro', highlight: true },
                { text: 'Unlimited drivers & vehicles' },
                { text: 'Pesapal international payments', highlight: true },
                { text: 'Applicable for feature beta updates' },
                { text: 'Reduction on future app developments' },
                { text: 'Game Sanctuaries support included', highlight: true },
                { text: 'Admin Payment Notifications', highlight: true },
                { text: 'Autonomous AI Diagnostic Assistant', highlight: true },
            ]
        }
    ];

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-primary-500 font-bold uppercase tracking-widest text-sm mb-4">Pricing Plans</h2>
                <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                    Supercharge your tour operations
                </h1>
                <p className="text-xl text-slate-500 dark:text-slate-400">
                    Choose the perfect plan for your business size. Scale seamlessly as your safari bookings grow.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto gap-8 mb-16 px-4">
                {tiers.map((tier) => (
                    <PricingCard
                        key={tier.name}
                        tier={tier}
                        isSelected={user?.planType === tier.name}
                        onSelect={(t) => setSelectedPlan(t)}
                    />
                ))}
            </div>

            {/* Payment Selection Modal */}
            {selectedPlan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setPaymentMethod(null)} />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="glass-card w-full max-w-lg relative z-10 border-slate-300 dark:border-white/10 p-8"
                    >
                        <button
                            onClick={() => setSelectedPlan(null)}
                            className="absolute top-4 right-4 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white"
                        >
                            ✕
                        </button>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Subscribe to {selectedPlan.name}</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-8">
                            Total due: <span className="text-slate-900 dark:text-white font-bold">${selectedPlan.price}</span> (Ksh {selectedPlan.kesPrice})
                        </p>

                        <div className="space-y-4">
                            {!paymentMethod ? (
                                <>
                                    <button
                                        onClick={() => setPaymentMethod('mpesa')}
                                        className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-300 dark:border-white/10 hover:border-green-500 hover:bg-green-500/5 transition-all group gap-4 flex-col sm:flex-row sm:items-center items-start"
                                    >
                                        <div className="flex items-center gap-4 w-full sm:w-auto">
                                            <div className="w-12 h-12 shrink-0 bg-green-500 rounded-lg flex items-center justify-center text-white font-black italic">
                                                MP
                                            </div>
                                            <div className="text-left">
                                                <p className="text-slate-900 dark:text-white font-bold group-hover:text-green-400">Pay with M-Pesa</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">Instant STK Push prompt via Daraja API</p>
                                            </div>
                                        </div>
                                        <div className="w-6 h-6 shrink-0 rounded-full border border-slate-300 dark:border-white/10 group-hover:border-green-500 flex items-center justify-center sm:self-center self-end mt-2 sm:mt-0">
                                            <div className="w-3 h-3 rounded-full bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => setPaymentMethod('pesapal')}
                                        className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-300 dark:border-white/10 hover:border-blue-500 hover:bg-blue-500/5 transition-all group gap-4 flex-col sm:flex-row sm:items-center items-start"
                                    >
                                        <div className="flex items-center gap-4 w-full sm:w-auto">
                                            <div className="w-12 h-12 shrink-0 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black">
                                                Card
                                            </div>
                                            <div className="text-left">
                                                <p className="text-slate-900 dark:text-white font-bold group-hover:text-blue-400">Pay with Pesapal</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">Visa, Mastercard, Airtel Money</p>
                                            </div>
                                        </div>
                                        <div className="w-6 h-6 shrink-0 rounded-full border border-slate-300 dark:border-white/10 group-hover:border-blue-500 flex items-center justify-center sm:self-center self-end mt-2 sm:mt-0">
                                            <div className="w-3 h-3 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </button>
                                </>
                            ) : paymentMethod === 'mpesa' ? (
                                <form className="space-y-4 animate-in fade-in zoom-in-95 duration-300" onSubmit={async (e) => {
                                    e.preventDefault();
                                    try {
                                        setIsProcessing(true);
                                        const res = await authAPI.subscribe({ plan: selectedPlan.name });
                                        setUser({ ...user, planType: res.data.planType });
                                        alert('STK Push sent to your phone! Subscription processing...');
                                        setSelectedPlan(null);
                                        setPaymentMethod(null);
                                    } catch (err) {
                                        alert('Subscription failed: ' + (err.response?.data?.message || err.message));
                                    } finally {
                                        setIsProcessing(false);
                                    }
                                }}>
                                    <h4 className="text-slate-900 dark:text-white font-bold mb-4 flex items-center gap-2">
                                        <div className="w-8 h-8 shrink-0 bg-green-500 rounded flex items-center justify-center text-white font-black italic text-xs">MP</div>
                                        Pay with M-Pesa
                                    </h4>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">M-Pesa Phone Number</label>
                                        <input required disabled={isProcessing} type="tel" placeholder="e.g. 0712345678" className="w-full bg-white/50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-green-500 transition-colors" />
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <button disabled={isProcessing} type="button" onClick={() => setPaymentMethod(null)} className="flex-1 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white transition-colors bg-slate-100 dark:bg-[#1e293b] disabled:opacity-50">Back</button>
                                        <button disabled={isProcessing} type="submit" className="flex-1 bg-green-500 hover:bg-green-400 text-white rounded-xl font-bold transition-colors disabled:opacity-50">
                                            {isProcessing ? 'Processing...' : 'Send STK Push'}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <form className="space-y-4 animate-in fade-in zoom-in-95 duration-300" onSubmit={async (e) => {
                                    e.preventDefault();
                                    try {
                                        setIsProcessing(true);
                                        const res = await authAPI.subscribe({ plan: selectedPlan.name });
                                        setUser({ ...user, planType: res.data.planType });
                                        alert('Payment successful via Pesapal!');
                                        setSelectedPlan(null);
                                        setPaymentMethod(null);
                                    } catch (err) {
                                        alert('Subscription failed: ' + (err.response?.data?.message || err.message));
                                    } finally {
                                        setIsProcessing(false);
                                    }
                                }}>
                                    <h4 className="text-slate-900 dark:text-white font-bold mb-4 flex items-center gap-2">
                                        <div className="w-8 h-8 shrink-0 bg-blue-600 rounded flex items-center justify-center text-white font-black text-xs">Card</div>
                                        Pay with Pesapal
                                    </h4>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Card Number</label>
                                        <input required disabled={isProcessing} type="text" placeholder="XXXX XXXX XXXX XXXX" className="w-full bg-white/50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Expiry Date</label>
                                            <input required disabled={isProcessing} type="text" placeholder="MM/YY" className="w-full bg-white/50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">CVV</label>
                                            <input required disabled={isProcessing} type="password" placeholder="123" className="w-full bg-white/50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors" />
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <button disabled={isProcessing} type="button" onClick={() => setPaymentMethod(null)} className="flex-1 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white transition-colors bg-slate-100 dark:bg-[#1e293b] border border-slate-300 dark:border-white/10 disabled:opacity-50">Back</button>
                                        <button disabled={isProcessing} type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50">
                                            {isProcessing ? 'Processing...' : `Pay $${selectedPlan?.price}`}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-xs text-dark-500">Secure AES-256 encrypted checkout.</p>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Pricing;
