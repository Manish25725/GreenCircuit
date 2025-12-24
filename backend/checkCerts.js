import mongoose from 'mongoose';

const certSchema = new mongoose.Schema({}, { strict: false, collection: 'businesscertificates' });
const BusinessCertificate = mongoose.model('BusinessCertificate', certSchema);

const bookingSchema = new mongoose.Schema({}, { strict: false, collection: 'bookings' });
const Booking = mongoose.model('Booking', bookingSchema);

const businessSchema = new mongoose.Schema({}, { strict: false, collection: 'businesses' });
const Business = mongoose.model('Business', businessSchema);

const userSchema = new mongoose.Schema({}, { strict: false, collection: 'users' });
const User = mongoose.model('User', userSchema);

async function check() {
  try {
    await mongoose.connect('mongodb://localhost:27017/ecocycle');
    
    console.log('\n=== USERS ===\n');
    const users = await User.find({});
    console.log(`Total Users: ${users.length}\n`);
    users.forEach((u, i) => {
      console.log(`${i+1}. ${u.email} - Role: ${u.role}`);
      console.log(`   ID: ${u._id}`);
      console.log('');
    });
    
    console.log('\n=== CERTIFICATES CHECK ===\n');
    
    const certs = await BusinessCertificate.find({});
    console.log(`Total Certificates: ${certs.length}\n`);
    
    if (certs.length > 0) {
      certs.forEach((c, i) => {
        console.log(`${i+1}. ${c.certificateId}`);
        console.log(`   Business ID: ${c.businessId}`);
        console.log(`   Booking ID: ${c.bookingId}`);
        console.log(`   Weight: ${c.totalWeight} kg`);
        console.log(`   Date: ${c.issuedAt || c.createdAt}`);
        console.log('');
      });
    }
    
    console.log('\n=== BUSINESSES ===\n');
    const businesses = await Business.find({});
    console.log(`Total Businesses: ${businesses.length}\n`);
    businesses.forEach((b, i) => {
      console.log(`${i+1}. ${b.companyName} (ID: ${b._id})`);
      console.log(`   User ID: ${b.userId}`);
      console.log('');
    });
    
    console.log('\n=== COMPLETED BOOKINGS ===\n');
    const completedBookings = await Booking.find({ status: 'completed' });
    console.log(`Total Completed Bookings: ${completedBookings.length}\n`);
    completedBookings.forEach((b, i) => {
      console.log(`${i+1}. Booking ${b._id}`);
      console.log(`   User ID: ${b.userId}`);
      console.log(`   Weight: ${b.totalWeight} kg`);
      console.log(`   Completed: ${b.completedAt}`);
      console.log('');
    });
    
    console.log('\n=== ALL BOOKINGS ===\n');
    const allBookings = await Booking.find({});
    console.log(`Total Bookings: ${allBookings.length}\n`);
    allBookings.forEach((b, i) => {
      console.log(`${i+1}. Booking ${b._id} - Status: ${b.status}`);
      console.log(`   User ID: ${b.userId}`);
      console.log(`   Created: ${b.createdAt}`);
      console.log('');
    });
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

check();
