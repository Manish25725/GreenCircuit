import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import Booking from './models/Booking';
import Business from './models/Business';
import BusinessCertificate from './models/BusinessCertificate';

dotenv.config({ path: '../.env' });

const MONGO_URI = process.env.MONGODB_URI || '';

async function checkBookings() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas\n');
    
    const user = await User.findOne({ email: 'asdb@gmail.com' });
    if (!user) {
      console.log('❌ User not found');
      process.exit(0);
    }
    
    console.log('👤 User:', user.name);
    console.log('   ID:', user._id);
    console.log('   Role:', user.role);
    
    const business = await Business.findOne({ userId: user._id });
    if (business) {
      console.log('\n🏢 Business:', business.companyName);
      console.log('   ID:', business._id);
    }
    
    const bookings = await Booking.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(10);
    
    console.log('\n📦 Total Bookings:', bookings.length);
    bookings.forEach((b, i) => {
      console.log(`${i+1}. ${b.bookingId || b._id}`);
      console.log(`   Status: ${b.status}`);
      console.log(`   Weight: ${b.totalWeight || 0}kg`);
      console.log(`   Date: ${b.scheduledDate}`);
      console.log(`   Items: ${b.items?.length || 0}`);
    });
    
    const completed = bookings.filter(b => b.status === 'completed');
    console.log('\n✅ Completed Bookings:', completed.length);
    
    if (business) {
      const certificates = await BusinessCertificate.find({ businessId: business._id });
      console.log('\n📜 Certificates for this business:', certificates.length);
      certificates.forEach((c, i) => {
        console.log(`${i+1}. ${c.certificateId} - Type: ${c.type} - Status: ${c.status}`);
        console.log(`   BookingId: ${c.bookingId || 'N/A'}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkBookings();
