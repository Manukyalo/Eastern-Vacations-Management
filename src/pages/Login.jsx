import React, { useState } from 'react';
import { Compass, Shield, Users, Eye, EyeOff, Loader2 } from 'lucide-react';
import Spline from '@splinetool/react-spline';

const Login = ({ onLogin }) => {
    const [activeTab, setActiveTab] = useState('admin');
    const [loginAnimating, setLoginAnimating] = useState(false);
    const [email, setEmail] = useState('admin@easternvacations.com');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setEmail(tab === 'admin' ? 'admin@easternvacations.com' : 'staff@easternvacations.com');
        setPassword('');
        setErrorMsg(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg(null);
        setLoginAnimating(true);
        try {
            await onLogin({ email, password });
        } catch (err) {
            setErrorMsg(err.response?.data?.message || "Invalid credentials. Please try again.");
            setLoginAnimating(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center font-mono overflow-hidden bg-dark-900 selection:bg-primary-500/30">
            {/* 3D Spline Background Canvas */}
            <div className="absolute inset-0 z-0">
                {/* 
                  * TODO: User will provide the Spline URL to drop in here.
                  * For example: <Spline scene="https://draft.spline.design/your-scene/scene.splinecode" />
                  */}
                <div className="absolute w-full h-full flex flex-col items-center justify-center bg-dark-900/80 backdrop-blur-sm z-10 opacity-0 pointer-events-none transition-opacity duration-1000">
                    <Loader2 className="w-8 h-8 text-primary-500 animate-spin mb-4" />
                    <p className="text-dark-300 font-medium">Loading 3D Environment...</p>
                </div>
            </div>

            {/* Fallback Dynamic Gradient (Will sit behind or be removed when Spline is active) */}
            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30">
                <div className="absolute w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-primary-600/20 rounded-full blur-[100px] animate-pulse-slow"></div>
                <div className="absolute w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-orange-600/20 rounded-full blur-[80px] -translate-x-1/4 -translate-y-1/4"></div>
            </div>

            <div className={`relative z-10 w-full max-w-md px-6 ${loginAnimating ? 'animate-out zoom-out duration-700' : 'animate-in fade-in slide-in-from-bottom-8 duration-700'}`}>
                <div className="glass-card !p-8 border-t border-l border-white/20 shadow-2xl relative overflow-hidden">

                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000"></div>

                    <div className="text-center mb-10">
                        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary-400 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/30 animate-bounce-slow">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                <path d="M12 2c5 0 9 4 9 9 0 2-1 4-2 5.5l1 4.5-5-2c-1 .3-2 .5-3 .5s-2-.2-3-.5l-5 2 1-4.5C4 15 3 13 3 11c0-5 4-9 9-9z" />
                                <circle cx="9" cy="11" r="1.5" fill="currentColor" />
                                <circle cx="15" cy="11" r="1.5" fill="currentColor" />
                                <path d="M12 14c-1 0-2 .5-2 1.5" />
                                <path d="M12 14c1 0 2 .5 2 1.5" />
                                <path d="M11 16h2" />
                            </svg>
                        </div>

                        <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-orange-500 mb-2 tracking-tight">
                            Eastern Vacations
                        </h1>
                        <p className="text-dark-400 text-sm font-medium">SaaS Management Platform v2.0</p>
                    </div>

                    <div className="flex bg-dark-800/50 p-1 rounded-xl mb-6 border border-white/5">
                        <button
                            onClick={() => handleTabChange('admin')}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 ${activeTab === 'admin' ? 'bg-gradient-to-r from-primary-500 to-orange-500 text-white shadow-lg' : 'text-dark-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Shield size={16} />
                            Admin
                        </button>
                        <button
                            onClick={() => handleTabChange('reservation')}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 ${activeTab === 'reservation' ? 'bg-gradient-to-r from-primary-500 to-orange-500 text-white shadow-lg' : 'text-dark-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Users size={16} />
                            Reservation
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {errorMsg && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center animate-in fade-in zoom-in duration-300">
                                {errorMsg}
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-dark-300 uppercase tracking-wider ml-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@easternvacations.com"
                                className="w-full bg-dark-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-dark-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all font-sans"
                                required
                            />
                        </div>

                        <div className="space-y-1 relative">
                            <label className="text-xs font-semibold text-dark-300 uppercase tracking-wider ml-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-dark-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-dark-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all font-sans pr-12"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors p-1"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loginAnimating || !email || !password}
                            className={`w-full flex items-center justify-center mt-6 gap-3 bg-gradient-to-r from-primary-500 to-orange-500 hover:from-primary-400 hover:to-orange-400 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/20 group ${loginAnimating || !email || !password ? 'opacity-50 cursor-not-allowed scale-95' : 'hover:-translate-y-1'}`}
                        >
                            {loginAnimating ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Sign In Securely</span>
                                    <Shield size={18} className="group-hover:rotate-12 transition-transform opacity-70" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-dark-500">
                            Secured by <span className="text-primary-500 font-bold">NEXT EDGE</span> Enterprise
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
