const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config({ path: '../.env' }); // load from root

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eastern-vacations');
        console.log('✅ Connected to MongoDB Atlas cluster');

        const adminExists = await User.findOne({ email: 'admin@easternvacations.com' });
        if (adminExists) {
            console.log('✅ Admin user already exists.');
            process.exit(0);
        }

        const admin = await User.create({
            name: 'Admin Executive',
            email: 'admin@easternvacations.com',
            password: 'Password123!',
            role: 'admin'
        });

        console.log('✅ Admin seeded successfully:', admin.email);
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedAdmin();
