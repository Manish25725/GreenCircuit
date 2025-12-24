import mongoose from 'mongoose';
import User from './models/User.ts';
import Business from './models/Business.ts';
import BusinessCertificate from './models/BusinessCertificate.ts';
import Booking from './models/Booking.ts';

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/ewaste')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Find user by email
    const user = await User.findOne({ email: 'asdb@gmail.com' });
    console.log('\n=== USER INFO ===');
    if (user) {
      console.log('User ID:', user._id.toString());
      console.log('Email:', user.email);
      console.log('Name:', user.name);
      console.log('Role:', user.role);
    } else {
      console.log('User not found!');
      mongoose.disconnect();
      return;
    }
    
    // Find business profile
    const business = await Business.findOne({ userId: user._id });
    console.log('\n=== BUSINESS PROFILE ===');
    if (business) {
      console.log('Business ID:', business._id.toString());
      console.log('Company Name:', business.companyName);
      console.log('Email:', business.email);
    } else {
      console.log('No business profile found!');
    }
    
    // Find bookings
    const bookings = await Booking.find({ userId: user._id }).sort({ createdAt: -1 });
    console.log('\n=== BOOKINGS ===');
    console.log('Total bookings:', bookings.length);
    bookings.forEach((booking, idx) => {
      console.log(`\nBooking ${idx + 1}:`);
      console.log('  Booking ID:', booking._id.toString());
      console.log('  Status:', booking.status);
      console.log('  Created:', booking.createdAt);
      console.log('  Completed:', booking.completedAt || 'Not completed');
    });
    
    // Find certificates
    console.log('\n=== CERTIFICATES ===');
    const allCerts = await BusinessCertificate.find({});
    console.log('Total certificates in database:', allCerts.length);
    
    if (business) {
      const certs = await BusinessCertificate.find({ businessId: business._id }).populate('agencyId', 'name');
      console.log('Certificates for this business:', certs.length);
      certs.forEach((cert, idx) => {
        console.log(`\nCertificate ${idx + 1}:`);
        console.log('  Certificate ID:', cert.certificateId);
        console.log('  Type:', cert.type);
        console.log('  Status:', cert.status);
        console.log('  Issued:', cert.issuedAt);
        console.log('  Agency:', cert.agencyId?.name || 'N/A');
        console.log('  Total Weight:', cert.totalWeight);
        console.log('  Business ID:', cert.businessId?.toString());
      });
    }
    
    // Also check if there are any certificates with different businessIds
    console.log('\n=== ALL CERTIFICATES (Sample) ===');
    allCerts.slice(0, 5).forEach((cert, idx) => {
      console.log(`\nCertificate ${idx + 1}:`);
      console.log('  Certificate ID:', cert.certificateId);
      console.log('  Type:', cert.type);
      console.log('  Business ID:', cert.businessId?.toString());
    });
    
    mongoose.disconnect();
    console.log('\n\nDone!');
  })
  .catch(error => {
    console.error('Error:', error);
    mongoose.disconnect();
  });
