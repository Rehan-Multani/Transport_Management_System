const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./Models/UserModel');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

const createAdmin = async () => {
    try {
        const adminData = {
            name: 'Rehan Admin',
            email: 'admin@gmail.com',
            password: '123',
            role: 'admin',
            phone: '1234567890',
            address: 'Main Office, City',
            isVerified: true,
            status: 'active'
        };

        // Delete if exists (Old or same email)
        await User.deleteMany({ role: 'admin' });
        
        await User.create(adminData);
        console.log('New Admin User Created Successfully (admin@gmail.com / 123)!');
        process.exit();
    } catch (err) {
        console.error('Error creating admin:', err.message);
        process.exit(1);
    }
};

createAdmin();
