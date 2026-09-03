import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/travel_hotel_platform';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('💡 To connect to your cloud database on Render:');
    console.log('   Add MONGO_URI in Render Dashboard -> Environment Variables with your MongoDB Atlas connection string.');
  }
};

export default connectDB;

