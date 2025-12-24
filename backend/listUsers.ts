import mongoose from 'mongoose';
import User from './models/User';
import Business from './models/Business';
import Booking from './models/Booking';
import BusinessCertificate from './models/BusinessCertificate';

async function listUsers() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/ewaste');
    console.log('Connected to MongoDB\n');
    
    const users = await User.find({}).sort({ createdAt: -1 }).limit(20);
    console.log(`=== ALL USERS (${users.length}) ===`);
    users.forEach((user, idx) => {
      console.log(`\n${idx + 1}. ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Created: ${user.createdAt}`);
    });
    
    const businesses = await Business.find({}).populate('userId', 'name email');
    console.log(`\n\n=== BUSINESSES (${businesses.length}) ===`);
    businesses.forEach((business, idx) => {
      console.log(`\n${idx + 1}. ${business.companyName}`);
      console.log(`   Email: ${business.email}`);
      console.log(`   User: ${(business.userId as any)?.email || 'N/A'}`);
    });
    
    const bookings = await Booking.find({ status: 'completed' }).populate('userId', 'name email').sort({ completedAt: -1 }).limit(10);
    console.log(`\n\n=== COMPLETED BOOKINGS (${bookings.length}) ===`);
    bookings.forEach((booking, idx) => {
      console.log(`\n${idx + 1}. ${booking.bookingId}`);
      console.log(`   User: ${(booking.userId as any)?.email || 'N/A'}`);
      console.log(`   Status: ${booking.status}`);
      console.log(`   Completed: ${booking.completedAt}`);
    });
    
    const certs = await BusinessCertificate.find({}).populate('businessId', 'companyName').sort({ createdAt: -1 }).limit(10);
    console.log(`\n\n=== CERTIFICATES (${certs.length}) ===`);
    certs.forEach((cert, idx) => {
      console.log(`\n${idx + 1}. ${cert.certificateId}`);
      console.log(`   Type: ${cert.type}`);
      console.log(`   Business: ${(cert.businessId as any)?.companyName || 'N/A'}`);
      console.log(`   Status: ${cert.status}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n\nDisconnected');
  }
}

listUsers();
