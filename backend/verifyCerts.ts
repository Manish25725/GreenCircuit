import mongoose from 'mongoose';
import BusinessCertificate from './models/BusinessCertificate';
import Business from './models/Business';
import Booking from './models/Booking';
import Agency from './models/Agency';
import User from './models/User';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const MONGO_URI = process.env.MONGODB_URI || '';

async function checkCertificates() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas\n');
    
    // Check all certificates
    const allCerts = await BusinessCertificate.find({});
    console.log(`📜 Total Certificates in Database: ${allCerts.length}\n`);
    
    if (allCerts.length === 0) {
      console.log('❌ NO CERTIFICATES FOUND!');
    } else {
      allCerts.forEach((cert, idx) => {
        console.log(`${idx + 1}. ${cert.certificateId}`);
        console.log(`   Business: ${(cert.businessId as any)?.companyName || 'N/A'}`);
        console.log(`   Business ID: ${cert.businessId}`);
        console.log(`   Agency: ${(cert.agencyId as any)?.name || 'N/A'}`);
        console.log(`   Type: ${cert.type}`);
        console.log(`   Status: ${cert.status}`);
        console.log(`   Weight: ${cert.totalWeight}kg`);
        console.log(`   Created: ${cert.createdAt}`);
        console.log('');
      });
    }
    
    // Check specific business
    const business = await Business.findById('6948254146d75caee0015fa0');
    if (business) {
      console.log(`\n🏢 Checking for Business: ${business.companyName}`);
      console.log(`   Business ID: ${business._id}`);
      
      const businessCerts = await BusinessCertificate.find({ businessId: business._id });
      console.log(`   Certificates for this business: ${businessCerts.length}`);
      
      if (businessCerts.length > 0) {
        businessCerts.forEach(cert => {
          console.log(`   ✅ ${cert.certificateId} - ${cert.type}`);
        });
      }
    }
    
    // Check all bookings
    console.log('\n\n📦 BOOKINGS:');
    const bookings = await Booking.find({}).populate('userId', 'name email').sort({ createdAt: -1 }).limit(5);
    bookings.forEach((booking, idx) => {
      console.log(`${idx + 1}. ${booking.bookingId}`);
      console.log(`   User: ${(booking.userId as any)?.email || 'N/A'}`);
      console.log(`   Status: ${booking.status}`);
      console.log(`   Created: ${booking.createdAt}`);
      console.log(`   Completed: ${booking.completedAt || 'Not completed'}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
}

checkCertificates();
