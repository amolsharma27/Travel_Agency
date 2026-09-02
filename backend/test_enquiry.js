import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Enquiry from './src/models/Enquiry.js';
import connectDB from './src/config/db.js';

dotenv.config();

const testEnquiry = async () => {
  try {
    await connectDB();
    console.log('MongoDB Connected successfully');

    // Create a test student enquiry
    const testDoc = await Enquiry.create({
      studentName: 'Aarav Mehta',
      rollNumber: '2209144',
      email: 'aarav.mehta@pcte.edu.in',
      phone: '9988110021',
      course: 'B.Tech (Computer Science & Engineering)',
      packageTitle: 'Mussoorie – Kempty Water Fall',
      destination: 'Mussoorie & Kempty Falls, Uttarakhand',
      requestType: 'Booking Request',
      tourDuration: '1 Night / 2 Days',
      tourPrice: 'INR 3800 per person',
      requestDate: '02 Sep 2026',
      requestTime: '08:35 PM',
      notes: 'Test verification booking request from student',
    });

    console.log('Successfully created test enquiry in DB:', testDoc._id);

    const found = await Enquiry.findById(testDoc._id);
    console.log('Verified query from DB:', found.studentName, found.packageTitle, found.requestType);

    // Clean up test doc
    await Enquiry.findByIdAndDelete(testDoc._id);
    console.log('Cleaned up test enquiry');

    process.exit(0);
  } catch (err) {
    console.error('Test enquiry failed:', err);
    process.exit(1);
  }
};

testEnquiry();
