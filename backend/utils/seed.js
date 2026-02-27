import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Agency } from '../models/Agency.js';
import { Reward } from '../models/Reward.js';
import { Slot } from '../models/Slot.js';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Load .env from project root
dotenv.config({ path: resolve(__dirname, '../../.env') });
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
        // Indian Agency Users
        const agencyUser4 = await User.create({
            name: 'E-Waste Recyclers India',
            email: 'ewaste@india.com',
            password: agencyPassword,
            role: 'agency',
            ecoPoints: 0,
        });
        const agencyUser5 = await User.create({
            name: 'Green Delhi Recycling',
            email: 'greendelhi@agency.com',
            password: agencyPassword,
            role: 'agency',
            ecoPoints: 0,
        });
        const agencyUser6 = await User.create({
            name: 'Mumbai E-Cycle Hub',
            email: 'mumbai@ecycle.com',
            password: agencyPassword,
            role: 'agency',
            ecoPoints: 0,
        });
        const agencyUser7 = await User.create({
            name: 'Bangalore Tech Recyclers',
            email: 'bangalore@techrecycle.com',
            password: agencyPassword,
            role: 'agency',
            ecoPoints: 0,
        });
        // International Agency Users
        const agencyUser8 = await User.create({
            name: 'London E-Cycle',
            email: 'london@ecycle.com',
            password: agencyPassword,
            role: 'agency',
            ecoPoints: 0,
        });
        const agencyUser9 = await User.create({
            name: 'Tokyo Green Tech',
            email: 'tokyo@greentech.jp',
            password: agencyPassword,
            role: 'agency',
            ecoPoints: 0,
        });
        const agencyUser10 = await User.create({
            name: 'Sydney EcoRecycle',
            email: 'sydney@ecorecycle.au',
            password: agencyPassword,
            role: 'agency',
            ecoPoints: 0,
        });
        const agencyUser11 = await User.create({
            name: 'Dubai E-Waste Solutions',
            email: 'dubai@ewaste.ae',
            password: agencyPassword,
            role: 'agency',
            ecoPoints: 0,
        });
        const agencyUser12 = await User.create({
            name: 'Singapore Green Hub',
            email: 'singapore@greenhub.sg',
            password: agencyPassword,
            role: 'agency',
            ecoPoints: 0,
        });
        const agencyUser13 = await User.create({
            name: 'Berlin Recycling Center',
            email: 'berlin@recycling.de',
            password: agencyPassword,
            role: 'agency',
            ecoPoints: 0,
        });
        const agencyUser14 = await User.create({
            name: 'Paris Eco Services',
            email: 'paris@ecoservices.fr',
            password: agencyPassword,
            role: 'agency',
            ecoPoints: 0,
        });
        const agencyUser15 = await User.create({
            name: 'Toronto Green Recyclers',
            email: 'toronto@greenrecycle.ca',
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
            // Indian Agencies
            {
                userId: agencyUser4._id,
                name: 'E-Waste Recyclers India',
                email: 'ewaste@india.com',
                phone: '+91-9876543210',
                description: 'India\'s premier e-waste recycling company. Government certified and EPA compliant. Serving all major cities.',
                services: ['E-Waste Pickup', 'Mobile Recycling', 'Computer Disposal', 'Data Destruction'],
                address: {
                    street: '123 MG Road',
                    city: 'Delhi',
                    state: 'Delhi',
                    zipCode: '110001',
                },
                location: {
                    type: 'Point',
                    coordinates: [77.2090, 28.6139]
                },
                operatingHours: [
                    { day: 'monday', open: '09:00', close: '18:00', isOpen: true },
                    { day: 'tuesday', open: '09:00', close: '18:00', isOpen: true },
                    { day: 'wednesday', open: '09:00', close: '18:00', isOpen: true },
                    { day: 'thursday', open: '09:00', close: '18:00', isOpen: true },
                    { day: 'friday', open: '09:00', close: '18:00', isOpen: true },
                    { day: 'saturday', open: '10:00', close: '16:00', isOpen: true },
                    { day: 'sunday', open: '', close: '', isOpen: false },
                ],
                rating: 4.7,
                totalReviews: 234,
                totalPickups: 1200,
                isVerified: true,
                verificationStatus: 'approved',
            },
            {
                userId: agencyUser5._id,
                name: 'Green Delhi Recycling',
                email: 'greendelhi@agency.com',
                phone: '+91-9898989898',
                description: 'Eco-friendly e-waste disposal in Delhi NCR. Free pickup for bulk orders. Certified recycling process.',
                services: ['Free Pickup', 'Bulk Collection', 'Corporate Services', 'Certificate Issuance'],
                address: {
                    street: '456 Connaught Place',
                    city: 'Delhi',
                    state: 'Delhi',
                    zipCode: '110001',
                },
                location: {
                    type: 'Point',
                    coordinates: [77.2195, 28.6328]
                },
                operatingHours: [
                    { day: 'monday', open: '08:00', close: '20:00', isOpen: true },
                    { day: 'tuesday', open: '08:00', close: '20:00', isOpen: true },
                    { day: 'wednesday', open: '08:00', close: '20:00', isOpen: true },
                    { day: 'thursday', open: '08:00', close: '20:00', isOpen: true },
                    { day: 'friday', open: '08:00', close: '20:00', isOpen: true },
                    { day: 'saturday', open: '09:00', close: '18:00', isOpen: true },
                    { day: 'sunday', open: '10:00', close: '14:00', isOpen: true },
                ],
                rating: 4.5,
                totalReviews: 156,
                totalPickups: 890,
                isVerified: true,
                verificationStatus: 'approved',
            },
            {
                userId: agencyUser6._id,
                name: 'Mumbai E-Cycle Hub',
                email: 'mumbai@ecycle.com',
                phone: '+91-9123456789',
                description: 'Mumbai\'s trusted e-waste recycling partner. ISO certified. Serving Mumbai, Thane, and Navi Mumbai.',
                services: ['Residential Pickup', 'Office Clearance', 'IT Equipment Disposal', 'Appliance Recycling'],
                address: {
                    street: '789 Andheri East',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    zipCode: '400069',
                },
                location: {
                    type: 'Point',
                    coordinates: [72.8777, 19.0760]
                },
                operatingHours: [
                    { day: 'monday', open: '09:00', close: '19:00', isOpen: true },
                    { day: 'tuesday', open: '09:00', close: '19:00', isOpen: true },
                    { day: 'wednesday', open: '09:00', close: '19:00', isOpen: true },
                    { day: 'thursday', open: '09:00', close: '19:00', isOpen: true },
                    { day: 'friday', open: '09:00', close: '19:00', isOpen: true },
                    { day: 'saturday', open: '10:00', close: '17:00', isOpen: true },
                    { day: 'sunday', open: '', close: '', isOpen: false },
                ],
                rating: 4.8,
                totalReviews: 312,
                totalPickups: 1500,
                isVerified: true,
                verificationStatus: 'approved',
            },
            {
                userId: agencyUser7._id,
                name: 'Bangalore Tech Recyclers',
                email: 'bangalore@techrecycle.com',
                phone: '+91-9876012345',
                description: 'Tech capital\'s leading e-waste solution. Specialized in IT hardware recycling. Partnered with major tech companies.',
                services: ['Tech Waste Collection', 'Server Disposal', 'Hard Drive Shredding', 'Green Certificate'],
                address: {
                    street: '321 Electronic City',
                    city: 'Bangalore',
                    state: 'Karnataka',
                    zipCode: '560100',
                },
                location: {
                    type: 'Point',
                    coordinates: [77.5946, 12.9716]
                },
                operatingHours: [
                    { day: 'monday', open: '08:00', close: '18:00', isOpen: true },
                    { day: 'tuesday', open: '08:00', close: '18:00', isOpen: true },
                    { day: 'wednesday', open: '08:00', close: '18:00', isOpen: true },
                    { day: 'thursday', open: '08:00', close: '18:00', isOpen: true },
                    { day: 'friday', open: '08:00', close: '18:00', isOpen: true },
                    { day: 'saturday', open: '09:00', close: '15:00', isOpen: true },
                    { day: 'sunday', open: '', close: '', isOpen: false },
                ],
                rating: 4.9,
                totalReviews: 445,
                totalPickups: 2100,
                isVerified: true,
                verificationStatus: 'approved',
            },
            // International Agencies - Europe
            {
                userId: agencyUser8._id,
                name: 'London E-Cycle',
                email: 'london@ecycle.com',
                phone: '+44-20-7946-0958',
                description: 'UK\'s leading WEEE compliant e-waste recycling service. Serving Greater London and surrounding areas with eco-friendly disposal.',
                services: ['WEEE Recycling', 'Data Destruction', 'Corporate Services', 'Free Collection'],
                address: {
                    street: '45 Canary Wharf',
                    city: 'London',
                    state: 'England',
                    country: 'UK',
                    zipCode: 'E14 5AB',
                },
                location: {
                    type: 'Point',
                    coordinates: [-0.1278, 51.5074]
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
                rating: 4.7,
                totalReviews: 289,
                totalPickups: 1800,
                isVerified: true,
                verificationStatus: 'approved',
            },
            {
                userId: agencyUser13._id,
                name: 'Berlin Recycling Center',
                email: 'berlin@recycling.de',
                phone: '+49-30-1234567',
                description: 'Germany\'s premier e-waste facility. TÜV certified with highest environmental standards. Serving Berlin and Brandenburg.',
                services: ['ElektroG Compliant', 'Battery Recycling', 'IT Disposal', 'Certificate Issuance'],
                address: {
                    street: '78 Alexanderplatz',
                    city: 'Berlin',
                    state: 'Berlin',
                    country: 'Germany',
                    zipCode: '10178',
                },
                location: {
                    type: 'Point',
                    coordinates: [13.4050, 52.5200]
                },
                operatingHours: [
                    { day: 'monday', open: '07:00', close: '17:00', isOpen: true },
                    { day: 'tuesday', open: '07:00', close: '17:00', isOpen: true },
                    { day: 'wednesday', open: '07:00', close: '17:00', isOpen: true },
                    { day: 'thursday', open: '07:00', close: '17:00', isOpen: true },
                    { day: 'friday', open: '07:00', close: '16:00', isOpen: true },
                    { day: 'saturday', open: '', close: '', isOpen: false },
                    { day: 'sunday', open: '', close: '', isOpen: false },
                ],
                rating: 4.8,
                totalReviews: 178,
                totalPickups: 950,
                isVerified: true,
                verificationStatus: 'approved',
            },
            {
                userId: agencyUser14._id,
                name: 'Paris Eco Services',
                email: 'paris@ecoservices.fr',
                phone: '+33-1-4567-8900',
                description: 'Service de recyclage électronique certifié. Respectueux de l\'environnement. Serving Paris and Île-de-France region.',
                services: ['DEEE Collection', 'Appliance Recycling', 'Professional Services', 'Green Certificate'],
                address: {
                    street: '23 Champs-Élysées',
                    city: 'Paris',
                    state: 'Île-de-France',
                    country: 'France',
                    zipCode: '75008',
                },
                location: {
                    type: 'Point',
                    coordinates: [2.3522, 48.8566]
                },
                operatingHours: [
                    { day: 'monday', open: '09:00', close: '18:00', isOpen: true },
                    { day: 'tuesday', open: '09:00', close: '18:00', isOpen: true },
                    { day: 'wednesday', open: '09:00', close: '18:00', isOpen: true },
                    { day: 'thursday', open: '09:00', close: '18:00', isOpen: true },
                    { day: 'friday', open: '09:00', close: '18:00', isOpen: true },
                    { day: 'saturday', open: '10:00', close: '15:00', isOpen: true },
                    { day: 'sunday', open: '', close: '', isOpen: false },
                ],
                rating: 4.6,
                totalReviews: 145,
                totalPickups: 720,
                isVerified: true,
                verificationStatus: 'approved',
            },
            // International Agencies - Asia Pacific
            {
                userId: agencyUser9._id,
                name: 'Tokyo Green Tech',
                email: 'tokyo@greentech.jp',
                phone: '+81-3-1234-5678',
                description: 'Japan\'s trusted e-waste recycler. Compliant with Home Appliance Recycling Law. High-tech secure data destruction.',
                services: ['Home Appliances', 'IT Equipment', 'Secure Destruction', 'Corporate Pickup'],
                address: {
                    street: '1-2-3 Shibuya',
                    city: 'Tokyo',
                    state: 'Tokyo',
                    country: 'Japan',
                    zipCode: '150-0002',
                },
                location: {
                    type: 'Point',
                    coordinates: [139.6503, 35.6762]
                },
                operatingHours: [
                    { day: 'monday', open: '09:00', close: '18:00', isOpen: true },
                    { day: 'tuesday', open: '09:00', close: '18:00', isOpen: true },
                    { day: 'wednesday', open: '09:00', close: '18:00', isOpen: true },
                    { day: 'thursday', open: '09:00', close: '18:00', isOpen: true },
                    { day: 'friday', open: '09:00', close: '18:00', isOpen: true },
                    { day: 'saturday', open: '10:00', close: '16:00', isOpen: true },
                    { day: 'sunday', open: '', close: '', isOpen: false },
                ],
                rating: 4.9,
                totalReviews: 523,
                totalPickups: 3200,
                isVerified: true,
                verificationStatus: 'approved',
            },
            {
                userId: agencyUser10._id,
                name: 'Sydney EcoRecycle',
                email: 'sydney@ecorecycle.au',
                phone: '+61-2-9876-5432',
                description: 'Australia\'s eco-friendly e-waste solution. NTCRS accredited. Serving Sydney metro and NSW with responsible recycling.',
                services: ['E-Waste Drop-off', 'Business Collection', 'TV Recycling', 'Computer Disposal'],
                address: {
                    street: '100 George Street',
                    city: 'Sydney',
                    state: 'NSW',
                    country: 'Australia',
                    zipCode: '2000',
                },
                location: {
                    type: 'Point',
                    coordinates: [151.2093, -33.8688]
                },
                operatingHours: [
                    { day: 'monday', open: '08:00', close: '17:00', isOpen: true },
                    { day: 'tuesday', open: '08:00', close: '17:00', isOpen: true },
                    { day: 'wednesday', open: '08:00', close: '17:00', isOpen: true },
                    { day: 'thursday', open: '08:00', close: '17:00', isOpen: true },
                    { day: 'friday', open: '08:00', close: '17:00', isOpen: true },
                    { day: 'saturday', open: '09:00', close: '13:00', isOpen: true },
                    { day: 'sunday', open: '', close: '', isOpen: false },
                ],
                rating: 4.7,
                totalReviews: 267,
                totalPickups: 1400,
                isVerified: true,
                verificationStatus: 'approved',
            },
            {
                userId: agencyUser11._id,
                name: 'Dubai E-Waste Solutions',
                email: 'dubai@ewaste.ae',
                phone: '+971-4-123-4567',
                description: 'UAE\'s premier e-waste management company. TADWEER approved. Serving Dubai, Abu Dhabi, and Northern Emirates.',
                services: ['Free Collection', 'IT Asset Management', 'Data Wiping', 'Certified Recycling'],
                address: {
                    street: 'Dubai Silicon Oasis',
                    city: 'Dubai',
                    state: 'Dubai',
                    country: 'UAE',
                    zipCode: '00000',
                },
                location: {
                    type: 'Point',
                    coordinates: [55.2708, 25.2048]
                },
                operatingHours: [
                    { day: 'monday', open: '08:00', close: '18:00', isOpen: true },
                    { day: 'tuesday', open: '08:00', close: '18:00', isOpen: true },
                    { day: 'wednesday', open: '08:00', close: '18:00', isOpen: true },
                    { day: 'thursday', open: '08:00', close: '18:00', isOpen: true },
                    { day: 'friday', open: '', close: '', isOpen: false },
                    { day: 'saturday', open: '09:00', close: '17:00', isOpen: true },
                    { day: 'sunday', open: '09:00', close: '17:00', isOpen: true },
                ],
                rating: 4.8,
                totalReviews: 198,
                totalPickups: 1100,
                isVerified: true,
                verificationStatus: 'approved',
            },
            {
                userId: agencyUser12._id,
                name: 'Singapore Green Hub',
                email: 'singapore@greenhub.sg',
                phone: '+65-6789-0123',
                description: 'Singapore\'s leading e-waste recycler. NEA licensed. Zero-waste commitment with full traceability.',
                services: ['Island-wide Collection', 'Corporate Pickup', 'Secure Disposal', 'Monthly Reports'],
                address: {
                    street: '50 Jurong Gateway Road',
                    city: 'Singapore',
                    state: 'Singapore',
                    country: 'Singapore',
                    zipCode: '608549',
                },
                location: {
                    type: 'Point',
                    coordinates: [103.8198, 1.3521]
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
                rating: 4.9,
                totalReviews: 356,
                totalPickups: 2400,
                isVerified: true,
                verificationStatus: 'approved',
            },
            // International Agencies - Americas
            {
                userId: agencyUser15._id,
                name: 'Toronto Green Recyclers',
                email: 'toronto@greenrecycle.ca',
                phone: '+1-416-555-0199',
                description: 'Canada\'s trusted e-waste partner. EPRA certified. Serving Greater Toronto Area with responsible recycling.',
                services: ['Curbside Pickup', 'Business Services', 'Electronics Recycling', 'Data Destruction'],
                address: {
                    street: '200 Bay Street',
                    city: 'Toronto',
                    state: 'Ontario',
                    country: 'Canada',
                    zipCode: 'M5J 2J2',
                },
                location: {
                    type: 'Point',
                    coordinates: [-79.3832, 43.6532]
                },
                operatingHours: [
                    { day: 'monday', open: '08:00', close: '18:00', isOpen: true },
                    { day: 'tuesday', open: '08:00', close: '18:00', isOpen: true },
                    { day: 'wednesday', open: '08:00', close: '18:00', isOpen: true },
                    { day: 'thursday', open: '08:00', close: '18:00', isOpen: true },
                    { day: 'friday', open: '08:00', close: '18:00', isOpen: true },
                    { day: 'saturday', open: '09:00', close: '15:00', isOpen: true },
                    { day: 'sunday', open: '', close: '', isOpen: false },
                ],
                rating: 4.6,
                totalReviews: 189,
                totalPickups: 980,
                isVerified: true,
                verificationStatus: 'approved',
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
        const slots = [];
        for (const agency of agencies) {
            if (agency.verificationStatus !== 'approved')
                continue;
            // Create slots for the next 30 days
            for (let day = 1; day <= 30; day++) {
                const date = new Date(today);
                date.setDate(date.getDate() + day);
                // Skip weekends for some variety
                if (date.getDay() === 0)
                    continue; // Skip Sunday
                const timeSlots = [
                    { startTime: '09:00 AM', endTime: '11:00 AM' },
                    { startTime: '11:00 AM', endTime: '01:00 PM' },
                    { startTime: '02:00 PM', endTime: '04:00 PM' },
                    { startTime: '04:00 PM', endTime: '06:00 PM' },
                ];
                for (const time of timeSlots) {
                    // Randomly make some slots booked or unavailable
                    const rand = Math.random();
                    let status = 'Available';
                    let bookedBy = null;
                    if (rand < 0.2) {
                        status = 'Booked';
                        bookedBy = users[Math.floor(Math.random() * users.length)]._id;
                    }
                    else if (rand < 0.3) {
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
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};
seedDatabase();
