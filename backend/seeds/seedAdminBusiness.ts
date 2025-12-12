import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Agency from '../models/Agency';
import Business from '../models/Business';
import Inventory from '../models/Inventory';
import BusinessCertificate from '../models/BusinessCertificate';
import VettingRequest from '../models/VettingRequest';
import Booking from '../models/Booking';

const MONGO_URI = 'mongodb+srv://manish:manish25@cluster0.n4rjlbq.mongodb.net/ewaste?retryWrites=true&w=majority';

const seedAdminAndBusiness = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const businessPassword = await bcrypt.hash('business123', 10);

    // Create Admin User
    let adminUser = await User.findOne({ email: 'admin@ecocycle.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'EcoCycle Admin',
        email: 'admin@ecocycle.com',
        password: hashedPassword,
        role: 'admin',
        isVerified: true,
        avatar: 'https://ui-avatars.com/api/?name=Admin&background=34D399&color=fff'
      });
      console.log('✅ Admin user created');
    } else {
      console.log('⚠️ Admin user already exists');
    }

    // Create Business Users
    const businessUsers = [
      {
        name: 'James Wilson',
        email: 'james@techcorp.com',
        company: 'TechCorp Solutions',
        industry: 'Technology'
      },
      {
        name: 'Sarah Miller',
        email: 'sarah@greenindustries.com',
        company: 'Green Industries Ltd',
        industry: 'Manufacturing'
      },
      {
        name: 'Michael Chen',
        email: 'michael@healthplus.com',
        company: 'HealthPlus Medical',
        industry: 'Healthcare'
      }
    ];

    for (const bu of businessUsers) {
      let user = await User.findOne({ email: bu.email });
      if (!user) {
        user = await User.create({
          name: bu.name,
          email: bu.email,
          password: businessPassword,
          role: 'business',
          isVerified: true,
          phone: '+91 98765 43210',
          address: {
            street: '123 Business Park',
            city: 'Mumbai',
            state: 'Maharashtra',
            zipCode: '400001'
          }
        });
        console.log(`✅ Business user created: ${bu.email}`);

        // Create Business Profile
        const business = await Business.create({
          userId: user._id,
          companyName: bu.company,
          description: `${bu.company} is a leading company in ${bu.industry} sector committed to sustainable e-waste management.`,
          industry: bu.industry,
          email: bu.email,
          phone: '+91 98765 43210',
          website: `https://www.${bu.company.toLowerCase().replace(/\s+/g, '')}.com`,
          address: {
            street: '123 Business Park',
            city: 'Mumbai',
            state: 'Maharashtra',
            country: 'India',
            zipCode: '400001'
          },
          contactPerson: {
            name: bu.name,
            role: 'Sustainability Manager',
            email: bu.email,
            phone: '+91 98765 43210'
          },
          totalWasteProcessed: Math.floor(Math.random() * 5000) + 1000,
          co2Saved: Math.floor(Math.random() * 3000) + 500,
          totalPickups: Math.floor(Math.random() * 50) + 10,
          complianceScore: 100,
          isVerified: true
        });

        // Create sample inventory items
        const categories = ['IT Equipment', 'Cables & Wiring', 'Batteries', 'Monitors', 'Mobile Devices'];
        const statuses = ['in-use', 'in-storage', 'ready-for-pickup'];
        const conditions = ['working', 'non-working', 'damaged'];

        for (let i = 0; i < 15; i++) {
          await Inventory.create({
            businessId: business._id,
            itemName: `${categories[i % categories.length]} Item ${i + 1}`,
            description: `Sample ${categories[i % categories.length].toLowerCase()} for recycling`,
            category: categories[i % categories.length],
            assetId: `AST-${Date.now()}-${i}`,
            serialNumber: `SN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
            manufacturer: ['Dell', 'HP', 'Lenovo', 'Apple', 'Samsung'][i % 5],
            itemModel: `Model-${i + 100}`,
            quantity: Math.floor(Math.random() * 10) + 1,
            weight: Math.random() * 20 + 0.5,
            condition: conditions[i % conditions.length],
            location: ['Warehouse A', 'Warehouse B', 'Office Floor 1', 'Office Floor 2'][i % 4],
            status: statuses[i % statuses.length],
            hazardous: Math.random() > 0.8,
            recyclable: true,
            tags: ['electronics', 'e-waste']
          });
        }
        console.log(`  ✅ Created inventory items for ${bu.company}`);

        // Create sample certificates
        const agencies = await Agency.find({ isVerified: true }).limit(3);
        if (agencies.length > 0) {
          const certTypes = ['recycling', 'destruction', 'donation'];
          for (let i = 0; i < 5; i++) {
            await BusinessCertificate.create({
              businessId: business._id,
              agencyId: agencies[i % agencies.length]._id,
              type: certTypes[i % certTypes.length],
              title: `${certTypes[i % certTypes.length].charAt(0).toUpperCase() + certTypes[i % certTypes.length].slice(1)} Certificate`,
              items: [
                { name: 'Old Laptops', category: 'IT Equipment', quantity: 5, weight: 15 },
                { name: 'Keyboards', category: 'IT Equipment', quantity: 10, weight: 8 }
              ],
              totalWeight: 23,
              totalItems: 15,
              co2Saved: 15.4,
              complianceStandards: ['ISO 14001', 'R2'],
              disposalMethod: 'Certified Recycling',
              issuedBy: {
                name: agencies[i % agencies.length].name,
                designation: 'Certification Authority'
              },
              status: 'issued',
              issuedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
            });
          }
          console.log(`  ✅ Created certificates for ${bu.company}`);
        }
      } else {
        console.log(`⚠️ Business user already exists: ${bu.email}`);
      }
    }

    // Create Vetting Requests (for agencies pending verification)
    const pendingAgencies = await Agency.find({ verificationStatus: 'pending' }).limit(3);
    for (const agency of pendingAgencies) {
      const existingRequest = await VettingRequest.findOne({ agencyId: agency._id });
      if (!existingRequest) {
        await VettingRequest.create({
          agencyId: agency._id,
          type: 'new-agency',
          status: 'pending',
          priority: 'medium',
          title: 'New Agency Registration',
          description: `Application for full e-waste processing license. ${agency.name} is applying for verification.`,
          documents: [
            { name: 'Business Registration', url: '/docs/registration.pdf', type: 'pdf', verified: false },
            { name: 'EPA Compliance', url: '/docs/epa.pdf', type: 'pdf', verified: false },
            { name: 'Insurance Certificate', url: '/docs/insurance.pdf', type: 'pdf', verified: false }
          ],
          trustScore: Math.floor(Math.random() * 30) + 60,
          verificationChecklist: [
            { item: 'Business Registration Verified', status: 'pending' },
            { item: 'Environmental Permits Valid', status: 'pending' },
            { item: 'Insurance Coverage Confirmed', status: 'pending' },
            { item: 'Equipment Standards Met', status: 'pending' }
          ]
        });
        console.log(`✅ Created vetting request for: ${agency.name}`);
      }
    }

    // Create some sample vetting requests for other types
    const verifiedAgencies = await Agency.find({ isVerified: true }).limit(2);
    const vettingTypes = [
      { type: 'slot-update', title: 'Slot Capacity Update', desc: 'Requesting increase in daily pickup capacity' },
      { type: 'license-renewal', title: 'License Renewal', desc: 'Annual EPA compliance certificate renewal' }
    ];

    for (let i = 0; i < verifiedAgencies.length; i++) {
      const agency = verifiedAgencies[i];
      const vt = vettingTypes[i % vettingTypes.length];
      
      const existing = await VettingRequest.findOne({ agencyId: agency._id, type: vt.type });
      if (!existing) {
        await VettingRequest.create({
          agencyId: agency._id,
          type: vt.type,
          status: 'pending',
          priority: 'low',
          title: vt.title,
          description: `${vt.desc} for ${agency.name}.`,
          documents: [
            { name: 'Supporting Document', url: '/docs/support.pdf', type: 'pdf', verified: false }
          ],
          trustScore: 85,
          verificationChecklist: [
            { item: 'Request Valid', status: 'pending' },
            { item: 'Documentation Complete', status: 'pending' }
          ],
          requestData: {
            currentCapacity: 500,
            requestedCapacity: 1000
          }
        });
        console.log(`✅ Created ${vt.type} vetting request for: ${agency.name}`);
      }
    }

    console.log('\n🎉 Admin and Business seed data created successfully!\n');
    console.log('='.repeat(50));
    console.log('Login Credentials:');
    console.log('='.repeat(50));
    console.log('\n📌 ADMIN:');
    console.log('   Email: admin@ecocycle.com');
    console.log('   Password: admin123');
    console.log('\n📌 BUSINESS USERS:');
    console.log('   Email: james@techcorp.com');
    console.log('   Password: business123');
    console.log('\n   Email: sarah@greenindustries.com');
    console.log('   Password: business123');
    console.log('\n   Email: michael@healthplus.com');
    console.log('   Password: business123');
    console.log('='.repeat(50));

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedAdminAndBusiness();
