# Eastern Vacations Management System v2.0
## Complete Production System with MongoDB & JWT Authentication

A full-stack tour operator management platform with secure authentication, persistent database storage, and advanced features.

## 🚀 What's New in v2.0

### Backend (NEW!)
- ✅ **MongoDB Database** - Persistent data storage
- ✅ **JWT Authentication** - Secure login with tokens
- ✅ **RESTful API** - Complete backend API
- ✅ **Role-Based Access** - Admin & Reservation staff roles
- ✅ **Password Hashing** - Secure bcrypt encryption

### Frontend (Enhanced)
- ✅ **Real Login System** - Email & password authentication
- ✅ **API Integration** - Connected to backend
- ✅ **Edit Features** - Edit bookings, drivers, vehicles
- ✅ **Delete Features** - Soft delete with confirmations
- ✅ **Better Notifications** - Real-time updates
- ✅ **Responsive Design** - Mobile, tablet, desktop

## 📁 Project Structure

```
eastern-vacations-complete/
├── server/                          # Backend (Node.js + Express)
│   ├── models/                      # MongoDB models
│   │   ├── User.js
│   │   ├── Booking.js
│   │   ├── Driver.js
│   │   └── Vehicle.js
│   ├── routes/                      # API routes
│   │   ├── auth.js
│   │   ├── bookings.js
│   │   ├── drivers.js
│   │   ├── vehicles.js
│   │   └── users.js
│   ├── middleware/                  # Middleware
│   │   └── auth.js
│   └── server.js                    # Server entry point
│
├── src/                             # Frontend (React)
│   ├── contexts/
│   │   └── AuthContext.jsx          # Authentication context
│   ├── api.js                       # API utilities
│   ├── App.jsx                      # Main application
│   └── main.jsx                     # React entry point
│
├── .env.example                     # Environment variables template
├── package.json
├── vite.config.js
└── index.html
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Git (optional)

### Step 1: Install Dependencies

```bash
cd eastern-vacations-complete
npm install
```

### Step 2: Set Up MongoDB

**Option A: Local MongoDB**
1. Install MongoDB: https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # Mac
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

**Option B: MongoDB Atlas (Cloud - Free)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Whitelist your IP address

### Step 3: Configure Environment

```bash
# Copy example file
cp .env.example .env

# Edit .env file with your settings
```

Example `.env` file:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/eastern-vacations
JWT_SECRET=change-this-to-a-long-random-string-for-production
VITE_API_URL=http://localhost:5000
```

### Step 4: Create First Admin User

Start the server, then use this API call or create via code:

```bash
# Start server first
npm run server-only

# In another terminal, create admin
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@easternvacations.com",
    "password": "admin123",
    "role": "admin"
  }'
```

### Step 5: Run the Application

```bash
# Run both frontend and backend
npm run dev

# Or run separately:
npm run client    # Frontend only (port 3000)
npm run server    # Backend only (port 5000)
```

### Step 6: Access the System

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## 🔐 Default Login Credentials

After creating your admin user:
- **Email**: admin@easternvacations.com
- **Password**: admin123

⚠️ **IMPORTANT**: Change these credentials immediately after first login!

## 📚 API Documentation

### Authentication Endpoints

```
POST /api/auth/register     - Register new user
POST /api/auth/login        - Login user
GET  /api/auth/me           - Get current user
```

### Bookings Endpoints

```
GET    /api/bookings           - Get all bookings
GET    /api/bookings/:id       - Get single booking
POST   /api/bookings           - Create booking (Admin only)
PUT    /api/bookings/:id       - Update booking
PUT    /api/bookings/:id/assign - Assign driver/vehicle
DELETE /api/bookings/:id       - Delete booking (Admin only)
```

### Drivers Endpoints

```
GET    /api/drivers             - Get all drivers
GET    /api/drivers/available   - Get available drivers
GET    /api/drivers/:id         - Get single driver
POST   /api/drivers             - Create driver (Admin only)
PUT    /api/drivers/:id         - Update driver (Admin only)
DELETE /api/drivers/:id         - Delete driver (Admin only)
```

### Vehicles Endpoints

```
GET    /api/vehicles                    - Get all vehicles
GET    /api/vehicles/available          - Get available vehicles
GET    /api/vehicles/insurance-expiring - Get vehicles with expiring insurance
GET    /api/vehicles/:id                - Get single vehicle
POST   /api/vehicles                    - Create vehicle (Admin only)
PUT    /api/vehicles/:id                - Update vehicle (Admin only)
DELETE /api/vehicles/:id                - Delete vehicle (Admin only)
```

### Users Endpoints (Admin Only)

```
GET    /api/users               - Get all users
GET    /api/users/:id           - Get single user
PUT    /api/users/:id           - Update user
PUT    /api/users/:id/password  - Update password
DELETE /api/users/:id           - Delete user
```

## 🔒 Security Features

- **JWT Tokens**: 30-day expiration
- **Password Hashing**: Bcrypt with salt rounds
- **Role-Based Access**: Admin and Reservation staff
- **Protected Routes**: Token verification on all API calls
- **Input Validation**: Schema validation with Mongoose
- **Soft Deletes**: Records marked inactive, not deleted

## 🚀 Deployment

### Deploy to Production

#### Backend (Heroku/Railway/Render)

1. **Create account** on your chosen platform
2. **Set environment variables**:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
3. **Deploy**: Connect GitHub repo or use CLI

#### Frontend (Vercel/Netlify)

1. **Build the frontend**:
   ```bash
   npm run build
   ```
2. **Deploy** the `dist` folder
3. **Set environment variable**:
   - `VITE_API_URL=https://your-backend-url.com`

### Environment Variables for Production

```env
# Backend
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/eastern-vacations
JWT_SECRET=super-long-random-string-generated-securely
CORS_ORIGIN=https://your-frontend-url.com

# Frontend
VITE_API_URL=https://your-backend-url.com
```

## 📱 Features

### For Admins:
- ✅ Create/Edit/Delete bookings
- ✅ Create/Edit/Delete drivers
- ✅ Create/Edit/Delete vehicles
- ✅ View payment information
- ✅ Manage users
- ✅ Assign resources
- ✅ View all notifications

### For Reservation Staff:
- ✅ View all bookings
- ✅ Assign drivers and vehicles
- ✅ View driver/vehicle availability
- ✅ See insurance expiry alerts
- ✅ Receive notifications
- ❌ Cannot see payment info
- ❌ Cannot create/delete records

## 🧪 Testing

### Test the API

```bash
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@easternvacations.com","password":"admin123"}'

# Get bookings (replace TOKEN)
curl http://localhost:5000/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🐛 Troubleshooting

### MongoDB Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB service or check connection string

### JWT Token Invalid
```
Error: Not authorized, token failed
```
**Solution**: Login again to get a fresh token

### Port Already in Use
```
Error: Port 5000 is already in use
```
**Solution**: Change PORT in .env or kill the process using that port

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Check CORS configuration in server.js

## 📊 Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'admin' | 'reservation',
  isActive: Boolean,
  createdAt: Date
}
```

### Bookings Collection
```javascript
{
  clientName: String,
  clientEmail: String,
  clientPhone: String,
  destination: String,
  startDate: Date,
  endDate: Date,
  guests: Number,
  payment: Number,
  paymentStatus: 'pending' | 'partial' | 'paid',
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled',
  driver: ObjectId (ref: Driver),
  vehicle: ObjectId (ref: Vehicle),
  notes: String,
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Drivers Collection
```javascript
{
  name: String,
  phone: String,
  email: String,
  licenseNumber: String,
  status: 'available' | 'assigned' | 'on-leave',
  currentBooking: ObjectId (ref: Booking),
  isActive: Boolean,
  createdAt: Date
}
```

### Vehicles Collection
```javascript
{
  model: String,
  plate: String (unique),
  seats: Number,
  insuranceExpiry: Date,
  status: 'available' | 'assigned' | 'maintenance',
  currentBooking: ObjectId (ref: Booking),
  isActive: Boolean,
  lastServiceDate: Date,
  createdAt: Date
}
```

## 🔄 Backup & Restore

### Backup MongoDB

```bash
# Local MongoDB
mongodump --db eastern-vacations --out ./backup

# MongoDB Atlas
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/eastern-vacations" --out ./backup
```

### Restore MongoDB

```bash
# Local MongoDB
mongorestore --db eastern-vacations ./backup/eastern-vacations

# MongoDB Atlas
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/eastern-vacations" ./backup/eastern-vacations
```

## 📞 Support

For issues or questions:
1. Check this README
2. Check API documentation
3. Review error logs
4. Contact system administrator

## 📝 Version History

### v2.0.0 (Current)
- Added MongoDB database
- Added JWT authentication
- Added complete REST API
- Added edit/delete features
- Added user management

### v1.0.0
- Initial release
- In-memory storage
- Simple role selection
- Basic CRUD operations

## 📜 License

Proprietary - Eastern Vacations Company

---

**Built with ❤️ for Eastern Vacations**
