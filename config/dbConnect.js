import mongoose from 'mongoose';
export const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database connected successfully');
  } catch (error) {
    console.log('Database connection failed');
    process.exit(1);
  }
};
