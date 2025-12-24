// This script generates a compliance certificate for booking ECO-000024
// Run with: npm run tsx backend/generateCertificate.ts

import mongoose from 'mongoose';
import User from './models/User';
import Business from './models/Business';
import Agency from './models/Agency';
import Booking from './models/Booking';
import BusinessCertificate from './models/BusinessCertificate';
import Notification from './models/Notification';

async function generateCertificateForBooking() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/ewaste');
    console.log('Connected to MongoDB');
    
    // Find the user first
    const user = await User.findOne({ email: 'asdb@gmial.com' }); // Note: gmial, not gmail
    if (!user) {
      console.log('User asdb@gmial.com not found!');
      return;
    }
    
    console.log('User:', user.email, 'Role:', user.role, 'ID:', user._id);
    
    // Find completed bookings for this user
    const bookings = await Booking.find({ userId: user._id, status: 'completed' }).sort({ completedAt: -1 });
    console.log('Found', bookings.length, 'completed bookings');
    
    if (bookings.length === 0) {
      console.log('No completed bookings found!');
      return;
    }
    
    const booking = bookings[0]; // Get the most recent completed booking
    console.log('Processing booking:', booking.bookingId, 'Status:', booking.status, 'Completed:', booking.completedAt);
    
    // Find or create business profile
    let business = await Business.findOne({ userId: user._id });
    if (!business) {
      console.log('Creating business profile for user...');
      business = await Business.create({
        userId: user._id,
        companyName: user.name + "'s Business",
        email: user.email,
        phone: user.phone || '',
        industry: 'Technology',
        address: user.address || {
          street: '',
          city: '',
          state: '',
          country: 'India',
          zipCode: ''
        }
      });
      console.log('Business profile created:', business.companyName);
    } else {
      console.log('Business profile found:', business.companyName);
    }
    
    // Check if certificate already exists
    const existing = await BusinessCertificate.findOne({ bookingId: booking._id });
    if (existing) {
      console.log('Certificate already exists:', existing.certificateId);
      return;
    }
    
    // Get agency
    const agency = await Agency.findById(booking.agencyId);
    if (!agency) {
      console.log('Agency not found!');
      return;
    }
    
    // Generate certificate
    const items = booking.items?.map((item: any) => ({
      name: item.description || item.type || 'E-Waste Item',
      category: item.type || item.category || 'General',
      quantity: item.quantity || 1,
      weight: item.estimatedWeight || item.weight || 0
    })) || [];

    const totalWeight = booking.totalWeight || 0;
    
    const certificate = await BusinessCertificate.create({
      businessId: business._id,
      bookingId: booking._id,
      agencyId: agency._id,
      type: 'compliance',
      title: 'E-Waste Compliance Certificate',
      items,
      totalWeight: totalWeight,
      totalItems: items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0),
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

    console.log('✅ Certificate created successfully!');
    console.log('Certificate ID:', certificate.certificateId);
    console.log('Type:', certificate.type);
    console.log('Total Weight:', certificate.totalWeight, 'kg');
    console.log('CO2 Saved:', certificate.co2Saved, 'kg');
    
    // Create notification
    await Notification.create({
      userId: user._id,
      type: 'certificate',
      title: 'Compliance Certificate Issued',
      message: `Your E-Waste Compliance Certificate (${certificate.certificateId}) has been issued for ${totalWeight}kg of recycled e-waste.`,
      icon: 'verified'
    });
    
    console.log('✅ Notification sent to user');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

generateCertificateForBooking();
