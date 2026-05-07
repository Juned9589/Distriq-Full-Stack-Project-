import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../server/models/userModel.js';

dotenv.config();

const reset = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = 'admin@gmail.com';
        const newPassword = 'admin123';
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        const result = await User.updateOne(
            { email: email },
            { $set: { password: hashedPassword } }
        );
        
        if (result.matchedCount > 0) {
            console.log(`Password for ${email} has been reset to: ${newPassword}`);
        } else {
            console.log(`User ${email} not found.`);
        }
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

reset();
