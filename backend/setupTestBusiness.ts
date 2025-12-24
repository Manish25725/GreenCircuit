import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User';
import Business from './models/Business';
import Agency from './models/Agency';
import Booking from './models/Booking';
import BusinessCertificate from './models/BusinessCertificate';

async function setupTestData() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/ewaste');
    console.log('✅ Connected to MongoDB\n');
    
    // 1. Create or find business user
    let businessUser = await User.findOne({ email: 'asdb@gmail.com' });
    
    if (!businessUser) {
      console.log('Creating business user...');
      const hashedPassword = await bcrypt.hash('password123', 10);
      businessUser = await User.create({
        name: 'ASDB Business',
        email: 'asdb@gmail.com',
        password: hashedPassword,
        role: 'business',
        phone: '+91 9876543210',
        address: {
          street: '123 Business Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001'
        },
        isVerified: true
      });
      console.log('✅ Business user created');
    } else {
      console.log('✅ Business user exists:', businessUser.email);
      // Update role to business if it isn't
      if (businessUser.role !== 'business') {
        businessUser.role = 'business';
        await businessUser.save();
        console.log('✅ Updated user role to business');
      }
    }
    
    // 2. Create or find business profile
    let business = await Business.findOne({ userId: businessUser._id });
    
    if (!business) {
      console.log('Creating business profile...');
      business = await Business.create({
        userId: businessUser._id,
        companyName: 'ASDB Tech Solutions',
        email: 'asdb@gmail.com',
        phone: '+91 9876543210',
        industry: 'Technology',
        address: {
          street: '123 Business Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          zipCode: '400001'
        },
        description: 'IT Services and E-Waste Management'
      });
      console.log('✅ Business profile created:', business.companyName);
    } else {
      console.log('✅ Business profile exists:', business.companyName);
    }
    
    // 3. Create or find an agency
    let agency = await Agency.findOne({ name: 'ABC' });
    
    if (!agency) {
      // Create a partner user first
      let partnerUser = await User.findOne({ email: 'abc@agency.com' });
      if (!partnerUser) {
        const hashedPassword = await bcrypt.hash('password123', 10);
        partnerUser = await User.create({
          name: 'ABC Agency',
          email: 'abc@agency.com',
          password: hashedPassword,
          role: 'agency',
          phone: '+91 9876543211',
          isVerified: true
        });
      }
      
      console.log('Creating ABC agency...');
      agency = await Agency.create({
        userId: partnerUser._id,
        name: 'ABC',
        email: 'abc@agency.com',
        phone: '+91 9876543211',
        address: {
          street: '456 Agency Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          zipCode: '400002'
        },
        services: ['E-Waste Collection', 'Recycling', 'Disposal'],
        gstNumber: 'GST123456',
        headName: 'ABC Manager',
        businessType: 'Recycling Center',
        verificationStatus: 'approved',
        isVerified: true
      });
      console.log('✅ ABC agency created');
    } else {
      console.log('✅ ABC agency exists');
    }
    
    // 4. Create a completed booking
    console.log('\nCreating a completed booking...');
    const booking = await Booking.create({
      userId: businessUser._id,
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
      address: business.address.street + ', ' + business.address.city,
      scheduledDate: new Date(),
      scheduledTime: '10:00 - 12:00',
      timeSlot: '10:00 - 12:00',
      totalWeight: 16,
      status: 'completed',
      completedAt: new Date()
    });
    console.log('✅ Booking created:', booking.bookingId);
    
    // 5. Generate compliance certificate
    console.log('\nGenerating compliance certificate...');
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
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      issuedAt: new Date()
    });
    
    console.log('✅ Compliance certificate created!');
    console.log('\n=== SUMMARY ===');
    console.log('Business User:', businessUser.email);
    console.log('Business Profile:', business.companyName);
    console.log('Agency:', agency.name);
    console.log('Booking:', booking.bookingId, '(Status:', booking.status + ')');
    console.log('Certificate:', certificate.certificateId);
    console.log('Total Weight:', totalWeight, 'kg');
    console.log('CO2 Saved:', certificate.co2Saved, 'kg');
    
    console.log('\n🎉 Setup complete! You can now:');
    console.log('1. Login with: asdb@gmail.com / password123');
    console.log('2. Go to Business Dashboard');
    console.log('3. View your compliance certificate!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

setupTestData();
