import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../server/models/userModel.js';

dotenv.config();

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await User.countDocuments();
        console.log("Total Users in DB:", count);
        const users = await User.find({}, 'email isAdmin').limit(10);
        console.log("Last 10 users:", users);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

check();
