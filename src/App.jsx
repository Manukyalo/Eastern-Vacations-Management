import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Pricing from './pages/Pricing';
import { authAPI, bookingAPI, driverAPI, vehicleAPI } from './services/api';

import Bookings from './pages/Bookings';
import Drivers from './pages/Drivers';
import Vehicles from './pages/Vehicles';
import Settings from './pages/Settings';
import SecurityHub from './pages/SecurityHub';

// Mock DB until backend is fully integrated
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
        id: res.data._id
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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout user={user} onLogout={handleLogout} vehicles={vehicles} bookings={bookings} />}>
          <Route index element={<Dashboard bookings={bookings} drivers={drivers} vehicles={vehicles} user={user} />} />
          <Route path="bookings" element={<Bookings bookings={bookings} setBookings={setBookings} drivers={drivers} vehicles={vehicles} />} />
          <Route path="drivers" element={<Drivers drivers={drivers} setDrivers={setDrivers} />} />
          <Route path="vehicles" element={<Vehicles vehicles={vehicles} setVehicles={setVehicles} />} />
          <Route path="security-hub" element={user.role === 'admin' ? <SecurityHub bookings={bookings} drivers={drivers} vehicles={vehicles} /> : <Navigate to="/" replace />} />
          <Route path="pricing" element={user.role === 'admin' ? <Pricing /> : <Navigate to="/" replace />} />
          <Route path="settings" element={user.role === 'admin' ? <Settings companyDetails={companyDetails} setCompanyDetails={setCompanyDetails} /> : <Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;