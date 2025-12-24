import mongoose from 'mongoose';
import User from './models/User';
import Business from './models/Business';
import Booking from './models/Booking';
import BusinessCertificate from './models/BusinessCertificate';
import Agency from './models/Agency';

async function checkData() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/ewaste');
    console.log('Connected to MongoDB\n');
    
    // Find all users with business role
    const businessUsers = await User.find({ role: 'business' });
    console.log(`=== BUSINESS USERS (${businessUsers.length}) ===`);
    for (const user of businessUsers) {
      console.log(`\n${user.name} (${user.email})`);
      console.log(`  User ID: ${user._id}`);
      
      // Check for business profile
      const business = await Business.findOne({ userId: user._id });
      console.log(`  Business Profile: ${business ? business.companyName : 'NONE'}`);
      if (business) {
        console.log(`  Business ID: ${business._id}`);
      }
      
      // Check for bookings
      const bookings = await Booking.find({ userId: user._id });
      console.log(`  Total Bookings: ${bookings.length}`);
      
      const completedBookings = bookings.filter(b => b.status === 'completed');
      console.log(`  Completed Bookings: ${completedBookings.length}`);
      
      if (completedBookings.length > 0) {
        completedBookings.forEach(b => {
          console.log(`    - ${b.bookingId} (Status: ${b.status}, Completed: ${b.completedAt})`);
        });
      }
      
      // Check for certificates
      if (business) {
        const certs = await BusinessCertificate.find({ businessId: business._id });
        console.log(`  Certificates: ${certs.length}`);
        if (certs.length > 0) {
          certs.forEach(c => {
            console.log(`    - ${c.certificateId} (Type: ${c.type}, Weight: ${c.totalWeight}kg)`);
          });
        }
      }
    }
    
    // Check all bookings
    console.log('\n\n=== ALL BOOKINGS ===');
    const allBookings = await Booking.find({}).populate('userId', 'name email role').sort({ createdAt: -1 }).limit(10);
    for (const booking of allBookings) {
      console.log(`\n${booking.bookingId}`);
      console.log(`  User: ${(booking.userId as any)?.email || 'N/A'} (Role: ${(booking.userId as any)?.role})`);
      console.log(`  Status: ${booking.status}`);
      console.log(`  Created: ${booking.createdAt}`);
      console.log(`  Completed: ${booking.completedAt || 'Not completed'}`);
    }
    
    // Check all certificates
    console.log('\n\n=== ALL CERTIFICATES ===');
    const allCerts = await BusinessCertificate.find({}).populate('businessId', 'companyName').sort({ createdAt: -1 });
    console.log(`Total: ${allCerts.length}`);
    for (const cert of allCerts) {
      console.log(`\n${cert.certificateId}`);
      console.log(`  Business: ${(cert.businessId as any)?.companyName || 'N/A'}`);
      console.log(`  Type: ${cert.type}`);
      console.log(`  Status: ${cert.status}`);
      console.log(`  Weight: ${cert.totalWeight}kg`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n\nDisconnected');
  }
}

checkData();
