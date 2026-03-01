const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const User = require('./models/User');

let mongod;

/**
 * Connect to the in-memory database.
 */
const connectDB = async () => {
    try {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();

        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`✅ In-Memory MongoDB Connected: ${uri}`);

        // Auto-seed Admin User
        const adminExists = await User.findOne({ email: 'admin@easternvacations.com' });
        if (!adminExists) {
            await User.create({
                name: 'Admin Executive',
                email: 'admin@easternvacations.com',
                password: '@EasternVacations2026',
                role: 'admin'
            });
            console.log('✅ Admin user automatically seeded into memory DB.');
        }

        // Auto-seed Staff User
        const staffExists = await User.findOne({ email: 'staff@easternvacations.com' });
        if (!staffExists) {
            await User.create({
                name: 'Reservation Agent',
                email: 'staff@easternvacations.com',
                password: 'Reservations@2026',
                role: 'reservation'
            });
            console.log('✅ Staff user automatically seeded into memory DB.');
        }
    } catch (error) {
        console.error('❌ In-Memory MongoDB Error:', error);
        process.exit(1);
    }
};

/**
 * Drop database, close the connection and stop mongod.
 */
const closeDB = async () => {
    if (mongod) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongod.stop();
        console.log('✅ In-Memory MongoDB Disconnected');
    }
};

/**
 * Remove all collections data.
 */
const clearDB = async () => {
    if (mongod) {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany();
        }
    }
};

module.exports = {
    connectDB,
    closeDB,
    clearDB,
};
