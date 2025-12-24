import mongoose from 'mongoose';
import User from './models/User';
import Business from './models/Business';
import BusinessCertificate from './models/BusinessCertificate';

async function debug() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/ewaste');
    console.log('Connected to MongoDB\n');
    
    // Find the business user
    const user = await User.findOne({ email: 'asdb@gmail.com' });
    if (!user) {
      console.log('❌ User asdb@gmail.com not found!');
      return;
    }
    
    console.log('✅ User found:');
    console.log('  ID:', user._id.toString());
    console.log('  Email:', user.email);
    console.log('  Role:', user.role);
    
    // Find business profile
    const business = await Business.findOne({ userId: user._id });
    if (!business) {
      console.log('❌ No business profile for this user!');
      return;
    }
    
    console.log('\n✅ Business profile found:');
    console.log('  ID:', business._id.toString());
    console.log('  Company:', business.companyName);
    console.log('  User ID:', business.userId.toString());
    
    // Find certificates
    const certs = await BusinessCertificate.find({ businessId: business._id });
    console.log('\n📜 Certificates for this business:', certs.length);
    
    if (certs.length === 0) {
      console.log('❌ NO CERTIFICATES FOUND!');
      console.log('\nChecking all certificates in database...');
      const allCerts = await BusinessCertificate.find({});
      console.log('Total certificates in DB:', allCerts.length);
      
      if (allCerts.length > 0) {
        console.log('\nAll certificates:');
        allCerts.forEach(cert => {
          console.log(`  - ${cert.certificateId}`);
          console.log(`    Business ID: ${cert.businessId?.toString()}`);
          console.log(`    Type: ${cert.type}`);
          console.log(`    Match: ${cert.businessId?.toString() === business._id.toString()}`);
        });
      }
    } else {
      certs.forEach(cert => {
        console.log(`  ✅ ${cert.certificateId}`);
        console.log(`     Type: ${cert.type}`);
        console.log(`     Weight: ${cert.totalWeight}kg`);
        console.log(`     Status: ${cert.status}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected');
  }
}

debug();
