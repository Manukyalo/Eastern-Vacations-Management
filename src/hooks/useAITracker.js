import { useMemo } from 'react';

export const useAITracker = (vehicles, bookings) => {
    return useMemo(() => {
        const alerts = [];

        // 1. AI Insurance Tracking Rule
        if (vehicles && vehicles.length > 0) {
            vehicles.forEach(v => {
                const expiryDate = new Date(v.insuranceExpiry);
                const now = new Date();
                const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

                if (daysUntilExpiry <= 30 && daysUntilExpiry >= 0) {
                    alerts.push({
                        id: `ins-${v.id}`,
                        type: 'warning',
                        title: 'AI Tracker: Insurance Expiring',
                        message: `${v.model} (${v.plate}) insurance expires in ${daysUntilExpiry} days.`,
                        date: new Date().toISOString(),
                    });
                } else if (daysUntilExpiry < 0) {
                    alerts.push({
                        id: `ins-${v.id}`,
                        type: 'critical',
                        title: 'AI Tracker: EXPIRED INSURANCE',
                        message: `${v.model} (${v.plate}) auto insurance expired ${Math.abs(daysUntilExpiry)} days ago! Immediate grounding required.`,
                        date: new Date().toISOString(),
                    });
                }
            });
        }

        // 2. Pending Bookings Rule
        if (bookings && bookings.length > 0) {
            const pendingCount = bookings.filter(b => b.status === 'pending').length;
            if (pendingCount > 0) {
                alerts.push({
                    id: `book-pending`,
                    type: 'info',
                    title: 'System Alert: Pending Action',
                    message: `You have ${pendingCount} pending booking(s) requiring confirmation.`,
                    date: new Date().toISOString(),
                });
            }
        }

        return alerts;
    }, [vehicles, bookings]);
};
