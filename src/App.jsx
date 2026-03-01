import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Pricing from './pages/Pricing';
import { authAPI, bookingAPI, driverAPI, vehicleAPI } from './services/api';

import Bookings from './pages/Bookings';
import Invoices from './pages/Invoices';
import Drivers from './pages/Drivers';
import Vehicles from './pages/Vehicles';
import Settings from './pages/Settings';
import SecurityHub from './pages/SecurityHub';

// React Global Exception Interceptor
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("Unhandled Render Exception Caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center p-6 font-mono text-left z-50 relative">
          <div className="bg-red-900/20 border border-red-500/30 p-8 rounded-2xl max-w-4xl w-full">
            <h1 className="text-3xl font-black text-red-400 mb-4 flex items-center gap-3"><AlertTriangle size={32} /> Fatal React Render Exception</h1>
            <p className="text-red-200 mb-6">A component failed to render on your current device viewport. Please copy the stack trace below and send it to the developer:</p>
            <div className="bg-black/50 p-6 rounded-xl overflow-x-auto">
              <pre className="text-red-300 text-sm whitespace-pre-wrap font-bold mb-4">{this.state.error?.toString()}</pre>
              <pre className="text-red-400/70 text-xs whitespace-pre-wrap">{this.state.errorInfo?.componentStack}</pre>
            </div>
            <button onClick={() => window.location.reload()} className="mt-8 px-6 py-3 bg-dark-800 hover:bg-dark-700 text-white rounded-xl font-bold transition-colors w-full sm:w-auto">Reload Application</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Database init
const initialBookings = [];
const initialDrivers = [];
const initialVehicles = [];

const initialCompanyDetails = {
  name: "Eastern Vacations",
  address: "Nairobi, Kenya"
};

const App = () => {
  const [user, setUser] = useState(null);

  // App State
  const [bookings, setBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [companyDetails, setCompanyDetails] = useState(initialCompanyDetails);

  // Fetch true data from Node Backend
  const loadPlatformData = async () => {
    try {
      const [bookingsRes, driversRes, vehiclesRes] = await Promise.all([
        bookingAPI.getAll(),
        driverAPI.getAll(),
        vehicleAPI.getAll()
      ]);
      setBookings(bookingsRes.data);
      setDrivers(driversRes.data);
      setVehicles(vehiclesRes.data);
    } catch (err) {
      console.error("Failed to load platform DB:", err);
    }
  };

  useEffect(() => {
    if (user) {
      loadPlatformData();
    }
  }, [user]);

  const handleLogin = async (credentials) => {
    try {
      const res = await authAPI.login(credentials);

      // Store JWT token to enable API mutations
      localStorage.setItem('token', res.data.token);

      setUser({
        role: res.data.role,
        name: res.data.name,
        id: res.data._id,
        planType: res.data.planType
      });
    } catch (err) {
      console.error("Login failed:", err);
      // Removed fallback bypass since API is functional
      throw err;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout user={user} onLogout={handleLogout} vehicles={vehicles} bookings={bookings} />}>
            <Route index element={<Dashboard bookings={bookings} drivers={drivers} vehicles={vehicles} user={user} />} />
            <Route path="bookings" element={<Bookings user={user} bookings={bookings} setBookings={setBookings} drivers={drivers} vehicles={vehicles} />} />
            <Route path="invoices" element={<Invoices bookings={bookings} />} />
            <Route path="drivers" element={<Drivers user={user} drivers={drivers} setDrivers={setDrivers} />} />
            <Route path="vehicles" element={<Vehicles user={user} vehicles={vehicles} setVehicles={setVehicles} />} />
            <Route path="security-hub" element={user.role === 'admin' ? <SecurityHub bookings={bookings} drivers={drivers} vehicles={vehicles} /> : <Navigate to="/" replace />} />
            <Route path="pricing" element={user.role === 'admin' ? <Pricing user={user} setUser={setUser} /> : <Navigate to="/" replace />} />
            <Route path="settings" element={user.role === 'admin' ? <Settings companyDetails={companyDetails} setCompanyDetails={setCompanyDetails} /> : <Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;