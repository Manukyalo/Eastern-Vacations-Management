# Complete Folder Structure - Eastern Vacations v2.0

## 📁 Directory Tree

```
eastern-vacations-complete/
│
├── server/                              # Backend Server (Node.js + Express + MongoDB)
│   ├── models/                          # MongoDB Mongoose Models
│   │   ├── User.js                      # User model with auth
│   │   ├── Booking.js                   # Booking model
│   │   ├── Driver.js                    # Driver model  
│   │   └── Vehicle.js                   # Vehicle model
│   │
│   ├── routes/                          # API Route Handlers
│   │   ├── auth.js                      # Authentication routes (login, register)
│   │   ├── bookings.js                  # Booking CRUD + assignment
│   │   ├── drivers.js                   # Driver CRUD operations
│   │   ├── vehicles.js                  # Vehicle CRUD + insurance alerts
│   │   └── users.js                     # User management (admin only)
│   │
│   ├── middleware/                      # Express Middleware
│   │   └── auth.js                      # JWT verification & role checking
│   │
│   └── server.js                        # Express server entry point
│
├── src/                                 # Frontend Application (React + Vite)
│   ├── contexts/                        # React Context Providers
│   │   └── AuthContext.jsx              # Authentication state management
│   │
│   ├── api.js                           # Axios API client & endpoints
│   ├── App.jsx                          # Main application component
│   └── main.jsx                         # React entry point with providers
│
├── public/                              # Static Assets (optional)
│   └── (empty - for logos, images)
│
├── .env.example                         # Environment variables template
├── .env                                 # Your actual env variables (not in git)
├── .gitignore                           # Git ignore file
├── index.html                           # HTML entry point
├── package.json                         # Dependencies & scripts
├── vite.config.js                       # Vite configuration with proxy
│
├── README.md                            # Main documentation
├── SETUP_GUIDE.md                       # Detailed setup instructions
├── FOLDER_STRUCTURE.md                  # This file
└── setup-windows-complete.bat           # Automated Windows setup
```

## 📊 File Count

- **Backend Files**: 10
- **Frontend Files**: 5
- **Configuration Files**: 5
- **Documentation Files**: 3
- **Total Files**: 23
- **Total Folders**: 6

## 📝 File Descriptions

### Backend (server/)

#### Models
- **User.js**: User authentication model with password hashing, role-based access
- **Booking.js**: Safari booking records with client info, dates, payments
- **Driver.js**: Driver management with availability status
- **Vehicle.js**: Fleet management with insurance tracking

#### Routes  
- **auth.js**: POST /register, POST /login, GET /me
- **bookings.js**: Full CRUD + PUT /assign for driver/vehicle assignment
- **drivers.js**: Full CRUD + GET /available for booking assignments
- **vehicles.js**: Full CRUD + GET /insurance-expiring for alerts
- **users.js**: Admin-only user management endpoints

#### Middleware
- **auth.js**: JWT token verification, admin-only protection, token generation

#### Server
- **server.js**: Express setup, MongoDB connection, route mounting, error handling

### Frontend (src/)

#### Contexts
- **AuthContext.jsx**: Global auth state, login/logout/register functions, user info

#### Core
- **api.js**: Axios instance, API endpoints for all resources
- **App.jsx**: Main UI with login, dashboard, bookings, drivers, vehicles, modals
- **main.jsx**: React root with AuthProvider wrapper

### Configuration

- **.env.example**: Template for environment variables
- **.gitignore**: Excludes node_modules, .env, dist, logs
- **vite.config.js**: Dev server on port 3000, proxy to backend
- **package.json**: All dependencies, npm scripts
- **index.html**: HTML shell with font imports

### Documentation

- **README.md**: Complete guide with API docs, deployment, troubleshooting
- **SETUP_GUIDE.md**: Step-by-step setup for Windows/Mac/Linux
- **FOLDER_STRUCTURE.md**: This file - complete directory reference

### Automation

- **setup-windows-complete.bat**: One-click setup for Windows users

## 🎯 Key Technologies

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- Bcrypt (password hashing)
- CORS

### Frontend
- React 18
- Vite (build tool)
- Axios (HTTP client)
- Lucide React (icons)
- Context API (state management)

## 🔄 Data Flow

```
User → Login Screen → AuthContext → JWT Token → LocalStorage

Authenticated Request Flow:
Frontend → axios interceptor (adds token) → Backend → auth middleware 
→ verify JWT → check role → route handler → MongoDB → response

Example: Create Booking
1. Admin clicks "Add Booking"
2. Fills form, clicks submit
3. Frontend: bookingsAPI.create(data)
4. Axios adds Authorization header
5. Backend: POST /api/bookings
6. Middleware: verify token, check if admin
7. Route: create booking in MongoDB
8. Response: new booking object
9. Frontend: update state, close modal
```

## 📦 Production Build

```
npm run build
```

Produces:
```
dist/
├── assets/
│   ├── index-[hash].js      # Bundled JS
│   └── index-[hash].css     # Bundled CSS
└── index.html               # Production HTML
```

Deploy `dist/` folder to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static host

Backend deploys separately to:
- Heroku
- Railway
- Render
- AWS EC2/ECS

## 🔒 Security Files

**.env** (never commit!):
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=super-secret-key
PORT=5000
VITE_API_URL=https://api.easternvacations.com
```

**.gitignore** protects:
- `.env`
- `node_modules/`
- `dist/`
- `*.log`

## 📱 Mobile Responsiveness

All components are responsive:
- Desktop: Full layout (>1024px)
- Tablet: Optimized grid (768-1024px)
- Mobile: Stacked layout (<768px)

Window width detection used throughout for:
- Font sizes
- Padding/margins
- Grid columns
- Modal widths

