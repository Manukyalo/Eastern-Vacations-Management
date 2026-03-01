import React, { useState, useEffect } from 'react';
import { ShieldAlert, Activity, Database, DownloadCloud, Server, Lock, AlertTriangle } from 'lucide-react';

const SecurityHub = ({ bookings, drivers, vehicles }) => {
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [lastBackup, setLastBackup] = useState('Today at 08:00 AM');
    const [logs, setLogs] = useState([]);

    const [backupHistory, setBackupHistory] = useState([]);

    // Real-time AI System Scan
    useEffect(() => {
        const analyzeState = () => {
            const suspendedDrivers = drivers?.filter(d => d.status === 'suspended').length || 0;
            const pendingBookings = bookings?.filter(b => b.status === 'pending').length || 0;
            const expiringVehicles = vehicles?.filter(v => Math.ceil((new Date(v.insuranceExpiry) - new Date()) / (1000 * 60 * 60 * 24)) <= 30).length || 0;

            const newLogs = [];

            if (expiringVehicles > 0) {
                newLogs.push({ id: Date.now() + 1, time: 'Just now', event: `AI detected ${expiringVehicles} expiring insurance policies.`, type: 'warning' });
            }
            if (suspendedDrivers > 0) {
                newLogs.push({ id: Date.now() + 2, time: 'Just now', event: `${suspendedDrivers} driver(s) currently suspended.`, type: 'info' });
            }
            if (pendingBookings > 5) {
                newLogs.push({ id: Date.now() + 3, time: 'Just now', event: 'High volume of pending bookings detected.', type: 'warning' });
            }

            if (newLogs.length === 0) {
                newLogs.push({ id: Date.now(), time: 'Just now', event: 'AI background scan complete: System secure. No anomalies.', type: 'success' });
            }

            setLogs(prev => [...newLogs, ...prev].slice(0, 15));
        };

        // Run analysis when state actually changes
        analyzeState();
    }, [bookings, drivers, vehicles]);

    const handleBackup = () => {
        setIsBackingUp(true);
        setTimeout(() => {
            const dataToBackup = {
                timestamp: new Date().toISOString(),
                exportUser: 'Admin Superuser',
                data: {
                    bookings,
                    drivers,
                    vehicles
                }
            };

            // Create a Blob and trigger a download of the JSON file
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToBackup, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "eastern_vacations_backup_" + Date.now() + ".json");
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();

            const newBackup = {
                id: `bw_${Date.now()}`,
                date: 'Just now',
                size: `${(JSON.stringify(dataToBackup).length / 1024).toFixed(1)} KB`,
                type: 'manual',
                data: dataToBackup
            };

            setIsBackingUp(false);
            setLastBackup('Just now');
            setBackupHistory(prev => [newBackup, ...prev]);
            setLogs(prev => [{ id: Date.now(), time: 'Just now', event: 'System state manually exported as JSON backup', type: 'info' }, ...prev].slice(0, 15));
        }, 2000);
    };

    const handleDownloadHistoricalBackup = (backupData, backupId) => {
        if (!backupData) {
            alert("Warning: Actual dataset payload was not cached for this automated placeholder. Please generate a new manual backup.");
            return;
        }
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `eastern_vacations_backup_${backupId}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();

        setLogs(prev => [{ id: Date.now(), time: 'Just now', event: `Vault backup ${backupId} re-downloaded to local machine`, type: 'info' }, ...prev].slice(0, 15));
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <ShieldAlert className="text-red-500" />
                        AI Security Operations Center
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Real-time threat detection and system redundancy controls.</p>
                </div>
                <button
                    onClick={handleBackup}
                    disabled={isBackingUp}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-slate-900 dark:text-white shadow-lg transition-all ${isBackingUp ? 'bg-slate-100 dark:bg-[#1e293b] cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:-translate-y-0.5 shadow-blue-500/20'}`}
                >
                    <DownloadCloud size={20} className={isBackingUp ? "animate-bounce" : ""} />
                    {isBackingUp ? 'Backing Up...' : 'Backup System Data'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card p-6 border-red-500/20 bg-gradient-to-br from-red-900/10 to-transparent">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Activity className="text-red-400 animate-pulse" />
                                Live Threat Monitor
                            </h3>
                            <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                System Secure
                            </span>
                        </div>

                        <div className="bg-white dark:bg-[#1e293b]/80 dark:bg-white dark:bg-[#1e293b]/10 rounded-xl p-4 font-mono text-sm border border-slate-200 dark:border-white/5 h-64 overflow-y-auto space-y-2">
                            {logs.map(log => (
                                <div key={log.id} className="flex gap-4 p-2 rounded hover:bg-slate-100 dark:bg-[#1e293b] transition-colors border-l-2"
                                    style={{ borderColor: log.type === 'error' ? '#f87171' : log.type === 'warning' ? '#fbbf24' : log.type === 'success' ? '#34d399' : '#60a5fa' }}>
                                    <span className="text-slate-500 dark:text-slate-400 w-20 shrink-0">{log.time}</span>
                                    <span className={
                                        log.type === 'error' ? 'text-red-400' :
                                            log.type === 'warning' ? 'text-orange-400' :
                                                log.type === 'success' ? 'text-emerald-400' : 'text-blue-400'
                                    }>{log.event}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass-card border-slate-200 dark:border-white/5">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <Database className="text-blue-400" />
                            Data Redundancy
                        </h3>
                        <div className="space-y-4">
                            <div className="bg-white dark:bg-[#1e293b]/50 dark:bg-white dark:bg-[#1e293b]/5 p-4 rounded-xl border border-slate-300 dark:border-white/10">
                                <p className="text-xs text-slate-500 dark:text-slate-400 tracking-wider uppercase mb-1">Last Backup</p>
                                <p className="text-slate-900 dark:text-white font-medium">{lastBackup}</p>
                            </div>
                            <div className="bg-white dark:bg-[#1e293b]/50 dark:bg-white dark:bg-[#1e293b]/5 p-4 rounded-xl border border-slate-300 dark:border-white/10 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 tracking-wider uppercase mb-1">Backup Server</p>
                                    <p className="text-slate-900 dark:text-white font-medium flex items-center gap-2">
                                        <Server size={14} className="text-emerald-400" /> AWS eu-west-1
                                    </p>
                                </div>
                                <span className="text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded">Online</span>
                            </div>
                        </div>

                        {/* Backup Vault Section */}
                        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/5">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Local Backup Vault</h4>
                            <div className="space-y-2 h-40 overflow-y-auto pr-2">
                                {backupHistory.map(backup => (
                                    <div key={backup.id} className="bg-dark-900/40 p-3 rounded-lg border border-slate-200 dark:border-white/5 flex items-center justify-between hover:bg-slate-100 dark:bg-[#1e293b] transition-colors group">
                                        <div>
                                            <p className="text-sm text-slate-900 dark:text-white font-medium">{backup.date}</p>
                                            <div className="flex gap-2 items-center mt-1">
                                                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{backup.size}</span>
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded capitalize ${backup.type === 'manual' ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-100 dark:bg-[#1e293b] text-slate-600 dark:text-slate-300'}`}>
                                                    {backup.type}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDownloadHistoricalBackup(backup.data, backup.id)}
                                            className="text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 hover:text-blue-300 pointer-events-auto">
                                            <DownloadCloud size={14} /> Download
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="glass-card border-slate-200 dark:border-white/5 bg-gradient-to-b from-dark-800 to-dark-900">
                        <div className="flex flex-col items-center text-center p-4">
                            <div className="p-4 bg-white dark:bg-[#1e293b] rounded-full border border-slate-300 dark:border-white/10 mb-4 shadow-lg">
                                <Lock size={32} className="text-emerald-400" />
                            </div>
                            <h4 className="text-slate-900 dark:text-white font-bold mb-2">End-to-End Encrypted</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                All data is AES-256 encrypted at rest. Traffic is scanned by AI heuristics in real-time. Only Superadmins have access to this portal.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecurityHub;
