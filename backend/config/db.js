import mongoose from 'mongoose';
export const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/ecocycle';
        const conn = await mongoose.connect(mongoUri);
    }
    catch (error) {
        process.exit(1);
    }
};
