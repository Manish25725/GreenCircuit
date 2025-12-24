import mongoose from 'mongoose';
import Business from './models/Business';
import Agency from './models/Agency';
import Booking from './models/Booking';
import BusinessCertificate from './models/BusinessCertificate';
import User from './models/User';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL || '';

async function createCertificateForCurrentUser() {
  try {
    if (!MONGO_URI) {
      console.error('❌ No MONGO_URI found in environment');
      return;
    }
    
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas\n');
    
    // Find the user with business ID 6948254146d75caee0015fa0
    const business = await Business.findById('6948254146d75caee0015fa0').populate('userId');
    
    if (!business) {
      console.log('❌ Business not found!');
      return;
    }
    
    console.log('✅ Business found:', business.companyName);
    console.log('  Business ID:', business._id);
    const user = business.userId as any;
    console.log('  User:', user?.email);
    
    // Find or create an agency
    let agency = await Agency.findOne({});
    if (!agency) {
      console.log('Creating ABC agency...');
      // Find an agency user or create one
      let agencyUser = await User.findOne({ role: 'agency' });
      if (!agencyUser) {
        agencyUser = await User.create({
          name: 'ABC Recycling',
          email: 'abc@recycling.com',
          password: '$2a$10$hashedpassword',
          role: 'agency',
          phone: '+91 9876543210',
          isVerified: true
        });
      }
      
      agency = await Agency.create({
        userId: agencyUser._id,
        name: 'ABC Recycling Center',
        email: 'abc@recycling.com',
        phone: '+91 9876543210',
        address: {
          street: '123 Green Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          zipCode: '400001'
        },
        services: ['E-Waste Collection', 'Recycling', 'Disposal'],
        gstNumber: 'GST1234567',
        headName: 'ABC Manager',
        businessType: 'Recycling Center',
        verificationStatus: 'approved',
        isVerified: true
      });
      console.log('✅ Agency created');
    } else {
      console.log('✅ Agency found:', agency.name);
    }
    
    // Create a completed booking
    console.log('\nCreating booking...');
    const booking = await Booking.create({
      userId: user._id,
      agencyId: agency._id,
      items: [
        {
          type: 'Laptops',
          description: 'Old office laptops',
          quantity: 5,
          estimatedWeight: 10,
          weight: 10,
          category: 'Computers'
        },
        {
          type: 'Monitors',
          description: 'LCD Monitors',
          quantity: 3,
          estimatedWeight: 6,
          weight: 6,
          category: 'Displays'
        }
      ],
      address: '123 Business Street, Mumbai',
      scheduledDate: new Date(),
      scheduledTime: '10:00 - 12:00',
      timeSlot: '10:00 - 12:00',
      totalWeight: 16,
      status: 'completed',
      completedAt: new Date()
    });
    console.log('✅ Booking created:', booking.bookingId);
    
    // Create compliance certificate
    console.log('\nCreating compliance certificate...');
    const items = booking.items.map((item: any) => ({
      name: item.description || item.type,
      category: item.type || item.category,
      quantity: item.quantity,
      weight: item.weight || item.estimatedWeight
    }));
    
    const totalWeight = booking.totalWeight || 16;
    
    const certificate = await BusinessCertificate.create({
      businessId: business._id,
      bookingId: booking._id,
      agencyId: agency._id,
      type: 'compliance',
      title: 'E-Waste Compliance Certificate',
      items,
      totalWeight: totalWeight,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      co2Saved: totalWeight * 2.5,
      materialsRecovered: [
        { material: 'Metals', weight: totalWeight * 0.65 },
        { material: 'Plastics', weight: totalWeight * 0.20 },
        { material: 'Glass', weight: totalWeight * 0.10 },
        { material: 'Other Materials', weight: totalWeight * 0.05 }
      ],
      complianceStandards: [
        'EPA - E-Waste Management Guidelines',
        'ISO 14001 - Environmental Management',
        'R2 - Responsible Recycling',
        'e-Stewards Certification',
        'Ministry of Environment Guidelines'
      ],
      disposalMethod: 'Certified E-Waste Recycling - Environmentally Sound Management',
      issuedBy: {
        name: agency.name,
        designation: 'Authorized E-Waste Recycling Partner'
      },
      status: 'issued',
      validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
      issuedAt: new Date()
    });
    
    console.log('\n🎉 SUCCESS!');
    console.log('Certificate ID:', certificate.certificateId);
    console.log('Type:', certificate.type);
    console.log('Weight:', certificate.totalWeight, 'kg');
    console.log('CO2 Saved:', certificate.co2Saved, 'kg');
    console.log('Valid Until:', certificate.validUntil?.toLocaleDateString());
    
    console.log('\n✅ Now refresh your browser to see the certificate!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected');
  }
}

createCertificateForCurrentUser();
