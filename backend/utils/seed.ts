import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Agency } from '../models/Agency';
import { Reward } from '../models/Reward';
import { Slot } from '../models/Slot';
import path from 'path';

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/ecocycle';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Agency.deleteMany({});
    await Reward.deleteMany({});
    await Slot.deleteMany({});
    console.log('Cleared existing data');

    // Create Admin User
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@ecocycle.com',
      password: adminPassword,
      role: 'admin',
      ecoPoints: 0,
    });
    console.log('Created admin user:', admin.email);

    // Create Regular Users
    const userPassword = await bcrypt.hash('user123', 10);
    const users = await User.insertMany([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: userPassword,
        role: 'user',
        ecoPoints: 1500,
        totalWasteRecycled: 45.5,
        totalPickups: 8,
        address: { street: '123 Main St', city: 'New York', state: 'NY', zipCode: '10001' },
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: userPassword,
        role: 'user',
        ecoPoints: 2300,
        totalWasteRecycled: 78.2,
        totalPickups: 15,
        address: { street: '456 Oak Ave', city: 'Los Angeles', state: 'CA', zipCode: '90001' },
      },
      {
        name: 'Business Owner',
        email: 'business@example.com',
        password: userPassword,
        role: 'business',
        ecoPoints: 5000,
        totalWasteRecycled: 250.0,
        totalPickups: 45,
      },
    ]);
    console.log('Created regular users');

    // Create Agency Users and Agencies
    const agencyPassword = await bcrypt.hash('agency123', 10);
    
    const agencyUser1 = await User.create({
      name: 'GreenTech Recycling',
      email: 'greentech@agency.com',
      password: agencyPassword,
      role: 'agency',
      ecoPoints: 0,
    });

    const agencyUser2 = await User.create({
      name: 'EcoWaste Solutions',
      email: 'ecowaste@agency.com',
      password: agencyPassword,
      role: 'agency',
      ecoPoints: 0,
    });

    const agencyUser3 = await User.create({
      name: 'CleanEarth Partners',
      email: 'cleanearth@agency.com',
      password: agencyPassword,
      role: 'agency',
      ecoPoints: 0,
    });

    const agencies = await Agency.insertMany([
      {
        userId: agencyUser1._id,
        name: 'GreenTech Recycling',
        email: 'greentech@agency.com',
        phone: '+1-555-0101',
        description: 'Leading e-waste recycling company with state-of-the-art facilities. We specialize in responsible disposal of electronic waste.',
        services: ['E-Waste Pickup', 'Data Destruction', 'Certificate Issuance', 'Corporate Recycling'],
        address: {
          street: '789 Green Way',
          city: 'New York',
          state: 'NY',
          zipCode: '10002',
        },
        operatingHours: [
          { day: 'monday', open: '08:00', close: '18:00', isOpen: true },
          { day: 'tuesday', open: '08:00', close: '18:00', isOpen: true },
          { day: 'wednesday', open: '08:00', close: '18:00', isOpen: true },
          { day: 'thursday', open: '08:00', close: '18:00', isOpen: true },
          { day: 'friday', open: '08:00', close: '18:00', isOpen: true },
          { day: 'saturday', open: '09:00', close: '14:00', isOpen: true },
          { day: 'sunday', open: '', close: '', isOpen: false },
        ],
        rating: 4.8,
        totalReviews: 156,
        isVerified: true,
        verificationStatus: 'approved',
      },
      {
        userId: agencyUser2._id,
        name: 'EcoWaste Solutions',
        email: 'ecowaste@agency.com',
        phone: '+1-555-0102',
        description: 'Sustainable e-waste management for a greener tomorrow. Certified by EPA and committed to zero-landfill practices.',
        services: ['Residential Pickup', 'Commercial Pickup', 'Battery Recycling', 'Appliance Disposal'],
        address: {
          street: '321 Eco Boulevard',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90002',
        },
        operatingHours: [
          { day: 'monday', open: '07:00', close: '19:00', isOpen: true },
          { day: 'tuesday', open: '07:00', close: '19:00', isOpen: true },
          { day: 'wednesday', open: '07:00', close: '19:00', isOpen: true },
          { day: 'thursday', open: '07:00', close: '19:00', isOpen: true },
          { day: 'friday', open: '07:00', close: '19:00', isOpen: true },
          { day: 'saturday', open: '08:00', close: '16:00', isOpen: true },
          { day: 'sunday', open: '10:00', close: '14:00', isOpen: true },
        ],
        rating: 4.6,
        totalReviews: 89,
        isVerified: true,
        verificationStatus: 'approved',
      },
      {
        userId: agencyUser3._id,
        name: 'CleanEarth Partners',
        email: 'cleanearth@agency.com',
        phone: '+1-555-0103',
        description: 'Your trusted partner in electronic waste recycling. Family-owned business with 20+ years of experience.',
        services: ['E-Waste Collection', 'IT Asset Disposal', 'Recycling Reports'],
        address: {
          street: '567 Clean Street',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
        },
        operatingHours: [
          { day: 'monday', open: '09:00', close: '17:00', isOpen: true },
          { day: 'tuesday', open: '09:00', close: '17:00', isOpen: true },
          { day: 'wednesday', open: '09:00', close: '17:00', isOpen: true },
          { day: 'thursday', open: '09:00', close: '17:00', isOpen: true },
          { day: 'friday', open: '09:00', close: '17:00', isOpen: true },
          { day: 'saturday', open: '', close: '', isOpen: false },
          { day: 'sunday', open: '', close: '', isOpen: false },
        ],
        rating: 4.5,
        totalReviews: 67,
        totalPickups: 450,
        isVerified: false,
        verificationStatus: 'pending',
      },
    ]);
    console.log('Created agencies');

    // Create Rewards
    const rewards = await Reward.insertMany([
      {
        title: '$10 Amazon Gift Card',
        description: 'Redeem your eco points for a $10 Amazon gift card. Perfect for your online shopping needs!',
        pointsCost: 1000,
        category: 'Gift Cards',
        icon: '🎁',
        color: 'bg-orange-500',
        stock: 50,
        isActive: true,
      },
      {
        title: '$25 Starbucks Card',
        description: 'Enjoy your favorite coffee with a $25 Starbucks gift card. Treat yourself!',
        pointsCost: 2500,
        category: 'Gift Cards',
        icon: '☕',
        color: 'bg-green-600',
        stock: 30,
        isActive: true,
      },
      {
        title: 'Eco-Friendly Tote Bag',
        description: 'Sustainable cotton tote bag with EcoCycle branding. Say no to plastic bags!',
        pointsCost: 500,
        category: 'Lifestyle',
        icon: '👜',
        color: 'bg-teal-500',
        stock: 100,
        isActive: true,
      },
      {
        title: 'Reusable Water Bottle',
        description: 'BPA-free stainless steel water bottle. Stay hydrated while helping the environment!',
        pointsCost: 800,
        category: 'Lifestyle',
        icon: '🍶',
        color: 'bg-blue-500',
        stock: 75,
        isActive: true,
      },
      {
        title: 'Plant a Tree',
        description: 'We will plant a tree in your name! Help restore forests and offset your carbon footprint.',
        pointsCost: 300,
        category: 'Donations',
        icon: '🌳',
        color: 'bg-green-500',
        stock: 999,
        isActive: true,
      },
      {
        title: '10% Discount Coupon',
        description: 'Get 10% off on your next pickup service. Valid for 30 days.',
        pointsCost: 200,
        category: 'Other',
        icon: '🏷️',
        color: 'bg-purple-500',
        stock: 200,
        isActive: true,
      },
      {
        title: '$50 Best Buy Gift Card',
        description: 'Shop electronics responsibly with a $50 Best Buy gift card.',
        pointsCost: 5000,
        category: 'Gift Cards',
        icon: '📱',
        color: 'bg-blue-600',
        stock: 20,
        isActive: true,
      },
      {
        title: 'Solar Phone Charger',
        description: 'Portable solar-powered phone charger. Charge your devices using clean energy!',
        pointsCost: 1500,
        category: 'Electronics',
        icon: '🔋',
        color: 'bg-yellow-500',
        stock: 40,
        isActive: true,
      },
    ]);
    console.log('Created rewards');

    // Create Sample Slots for agencies
    const today = new Date();
    const slots: any[] = [];
    
    for (const agency of agencies) {
      if (agency.verificationStatus !== 'approved') continue;
      
      // Create slots for the next 30 days
      for (let day = 1; day <= 30; day++) {
        const date = new Date(today);
        date.setDate(date.getDate() + day);
        
        // Skip weekends for some variety
        if (date.getDay() === 0) continue; // Skip Sunday
        
        const timeSlots = [
          { startTime: '09:00 AM', endTime: '11:00 AM' },
          { startTime: '11:00 AM', endTime: '01:00 PM' },
          { startTime: '02:00 PM', endTime: '04:00 PM' },
          { startTime: '04:00 PM', endTime: '06:00 PM' },
        ];

        for (const time of timeSlots) {
          // Randomly make some slots booked or unavailable
          const rand = Math.random();
          let status: 'Available' | 'Booked' | 'Unavailable' = 'Available';
          let bookedBy = null;
          
          if (rand < 0.2) {
            status = 'Booked';
            bookedBy = users[Math.floor(Math.random() * users.length)]._id;
          } else if (rand < 0.3) {
            status = 'Unavailable';
          }

          slots.push({
            agencyId: agency._id,
            date: day,
            fullDate: date,
            startTime: time.startTime,
            endTime: time.endTime,
            status,
            bookedBy,
            maxCapacity: 5,
            currentBookings: status === 'Booked' ? 1 : 0,
          });
        }
      }
    }
    
    await Slot.insertMany(slots);
    console.log(`Created ${slots.length} time slots`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('-------------------');
    console.log('Admin:    admin@ecocycle.com / admin123');
    console.log('User:     john@example.com / user123');
    console.log('User:     jane@example.com / user123');
    console.log('Business: business@example.com / user123');
    console.log('Agency:   greentech@agency.com / agency123');
    console.log('Agency:   ecowaste@agency.com / agency123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
