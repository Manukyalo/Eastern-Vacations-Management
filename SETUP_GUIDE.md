# Complete Setup Guide - Eastern Vacations v2.0

## 🎯 Quick Start (5 Minutes)

### Step 1: Extract Files
1. Download the complete package
2. Extract to your desired location
3. Open terminal/command prompt in the extracted folder

### Step 2: Install Everything
```bash
npm install
```
This installs all dependencies (takes 2-3 minutes)

### Step 3: Setup Database

**Option A: Use MongoDB Atlas (Cloud - Easiest)**
1. Go to https://mongodb.com/cloud/atlas/register
2. Create free account
3. Create a free cluster (M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Create `.env` file and paste:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eastern-vacations
JWT_SECRET=your-random-secret-key-here
PORT=5000
VITE_API_URL=http://localhost:5000
```

**Option B: Use Local MongoDB**
1. Download MongoDB: https://mongodb.com/try/download/community
2. Install and start MongoDB
3. Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/eastern-vacations
JWT_SECRET=your-random-secret-key-here
PORT=5000
VITE_API_URL=http://localhost:5000
```

### Step 4: Create Admin Account
```bash
# Start server
npm run server-only

# In new terminal, create admin (Windows PowerShell):
Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/auth/register" -ContentType "application/json" -Body '{"name":"Admin","email":"admin@easternvacations.com","password":"admin123","role":"admin"}'

# Or (Mac/Linux):
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@easternvacations.com","password":"admin123","role":"admin"}'
```

### Step 5: Run the App
```bash
# Stop the server (Ctrl+C) then run:
npm run dev
```

Open browser to: http://localhost:3000

Login with:
- **Email**: admin@easternvacations.com
- **Password**: admin123

**Done!** 🎉

---

## 📋 Detailed Setup Instructions

### For Windows Users

1. **Install Node.js**
   - Download from https://nodejs.org
   - Choose LTS version
   - Run installer
   - Restart computer

2. **Install MongoDB** (if using local)
   - Download from https://mongodb.com/try/download/community
   - Choose Windows version
   - Run installer
   - Select "Complete" installation
   - Install as Windows Service
   - Install MongoDB Compass (optional GUI)

3. **Setup Project**
   ```cmd
   cd path\to\eastern-vacations-complete
   npm install
   copy .env.example .env
   notepad .env
   ```

4. **Edit .env file** in Notepad:
   ```env
   MONGODB_URI=mongodb://localhost:27017/eastern-vacations
   JWT_SECRET=change-this-to-something-random-and-long
   PORT=5000
   VITE_API_URL=http://localhost:5000
   ```

5. **Create Admin & Run**
   ```cmd
   npm run server-only
   ```
   In new Command Prompt:
   ```cmd
   curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"name\":\"Admin\",\"email\":\"admin@easternvacations.com\",\"password\":\"admin123\",\"role\":\"admin\"}"
   ```
   Stop server (Ctrl+C), then:
   ```cmd
   npm run dev
   ```

### For Mac Users

1. **Install Node.js**
   ```bash
   # Using Homebrew
   brew install node
   
   # Or download from https://nodejs.org
   ```

2. **Install MongoDB** (if using local)
   ```bash
   # Using Homebrew
   brew tap mongodb/brew
   brew install mongodb-community
   brew services start mongodb-community
   ```

3. **Setup Project**
   ```bash
   cd /path/to/eastern-vacations-complete
   npm install
   cp .env.example .env
   nano .env  # or use any text editor
   ```

4. **Edit .env file**:
   ```env
   MONGODB_URI=mongodb://localhost:27017/eastern-vacations
   JWT_SECRET=change-this-to-something-random-and-long
   PORT=5000
   VITE_API_URL=http://localhost:5000
   ```

5. **Create Admin & Run**
   ```bash
   npm run server-only &
   sleep 3
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Admin","email":"admin@easternvacations.com","password":"admin123","role":"admin"}'
   
   # Stop server then run:
   npm run dev
   ```

### For Linux Users

1. **Install Node.js**
   ```bash
   # Ubuntu/Debian
   curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Or use your package manager
   ```

2. **Install MongoDB**
   ```bash
   # Ubuntu/Debian
   wget -qO - https://pgp.mongodb.com/server-6.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

3. **Setup Project**
   ```bash
   cd /path/to/eastern-vacations-complete
   npm install
   cp .env.example .env
   nano .env
   ```

4. **Edit .env file**:
   ```env
   MONGODB_URI=mongodb://localhost:27017/eastern-vacations
   JWT_SECRET=change-this-to-something-random-and-long
   PORT=5000
   VITE_API_URL=http://localhost:5000
   ```

5. **Create Admin & Run**
   ```bash
   npm run server-only &
   sleep 3
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Admin","email":"admin@easternvacations.com","password":"admin123","role":"admin"}'
   
   # Stop server then run:
   npm run dev
   ```

---

## 🌐 Using MongoDB Atlas (Cloud)

### Why MongoDB Atlas?
- ✅ Free tier available
- ✅ No local installation needed
- ✅ Accessible from anywhere
- ✅ Automatic backups
- ✅ Easy setup

### Setup Steps:

1. **Create Account**
   - Go to https://mongodb.com/cloud/atlas/register
   - Sign up (free)

2. **Create Cluster**
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select region closest to you
   - Click "Create"
   - Wait 3-5 minutes

3. **Setup Access**
   - Click "Database Access" → "Add New Database User"
   - Create username and password (remember these!)
   - Set role to "Read and write to any database"
   
   - Click "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Confirm

4. **Get Connection String**
   - Click "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your password
   - Replace `<dbname>` with `eastern-vacations`

5. **Update .env**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eastern-vacations
   ```

---

## 🐛 Common Issues & Solutions

### Issue: "npm: command not found"
**Solution**: Node.js not installed. Install from https://nodejs.org

### Issue: "MongoDB connection failed"
**Solution**: 
- Check if MongoDB is running: `sudo systemctl status mongod`
- Or check connection string in .env
- For Atlas: Check IP whitelist

### Issue: "Port 5000 already in use"
**Solution**:
```bash
# Find process using port
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :5000
kill -9 <PID>

# Or change PORT in .env to 5001
```

### Issue: "Cannot find module"
**Solution**: Run `npm install` again

### Issue: "CORS error in browser"
**Solution**: Make sure both frontend and backend are running

### Issue: "Token expired"
**Solution**: Login again

---

## ✅ Verification Checklist

After setup, verify:
- [ ] `npm install` completed without errors
- [ ] `.env` file exists with correct values
- [ ] MongoDB is running (or Atlas connection works)
- [ ] Admin user created successfully
- [ ] `npm run dev` starts both servers
- [ ] Frontend opens at http://localhost:3000
- [ ] Can login with admin credentials
- [ ] Can see dashboard

---

## 🚀 Next Steps

After successful setup:
1. Login and change admin password
2. Create additional users (admin or reservation staff)
3. Add some test data:
   - Create a few drivers
   - Add some vehicles
   - Create test bookings
4. Test the system thoroughly
5. Read the USER_MANUAL.md for usage instructions

---

## 📞 Need Help?

If you encounter issues:
1. Check this guide again
2. Read error messages carefully
3. Check the README.md
4. Google the specific error
5. Contact support with:
   - Operating system
   - Node.js version (`node --version`)
   - Error message
   - What you were trying to do

---

**You're ready to start! Good luck with Eastern Vacations Management System! 🎉**
