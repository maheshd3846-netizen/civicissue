const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Department = require('./models/Department');
const Issue = require('./models/Issue');

// Load environment variables FIRST
dotenv.config();

console.log('Seeding data...');
console.log('MONGODB_URI:', process.env.MONGODB_URI);

// Use default MongoDB URI if not specified
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://maheshd-2005:RadhaKrishna143@cluster0.medyx5j.mongodb.net/civic_data?retryWrites=true&w=majority&appName=Cluster0';

const seedData = async () => {
    try {
        // Connect to DB
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');

        // Clear existing data
        console.log('Clearing existing data...');
        await User.deleteMany();
        await Department.deleteMany();
        await Issue.deleteMany();

        // Create departments
        console.log('Creating departments...');
        const departments = await Department.insertMany([
            {
                name: 'Public Works Department',
                code: 'PWD',
                categories: ['pothole', 'road_damage'],
                contact: {
                    email: 'pwd@jharkhand.gov.in',
                    phone: '0651-1234567',
                    address: 'Public Works Department, Jharkhand'
                }
            },
            {
                name: 'Municipal Corporation',
                code: 'MC',
                categories: ['trash', 'streetlight', 'water', 'sewage'],
                contact: {
                    email: 'municipal@jharkhand.gov.in',
                    phone: '0651-7654321',
                    address: 'Municipal Corporation, Jharkhand'
                }
            },
            {
                name: 'Water Supply Department',
                code: 'WSD',
                categories: ['water', 'sewage'],
                contact: {
                    email: 'water@jharkhand.gov.in',
                    phone: '0651-1112233',
                    address: 'Water Supply Department, Jharkhand'
                }
            }
        ]);

        // Create admin user
        console.log('Creating admin user...');
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@civicconnect.com',
            password: 'admin123',
            phone: '9876543210',
            role: 'admin'
        }); 

        // Create department staff
        console.log('Creating department staff...');
        const departmentStaff = await User.create({
            name: 'Rajesh Kumar',
            email: 'rajesh.pwd@jharkhand.gov.in',
            password: 'staff123',
            phone: '9876543212',
            role: 'department_staff',
            department: departments[0]._id
        });

        // Create sample citizens
        console.log('Creating sample citizens...');
        const citizen1 = await User.create({
            name: 'Rahul Kumar',
            email: 'rahul@example.com',
            password: 'password123',
            phone: '9876543211',
            address: {
                street: 'Main Road',
                city: 'Ranchi',
                state: 'Jharkhand',
                pincode: '834001'
            }
        });

        const citizen2 = await User.create({
            name: 'Priya Singh',
            email: 'priya@example.com',
            password: 'password123',
            phone: '9876543213',
            address: {
                street: 'Harmu Road',
                city: 'Ranchi',
                state: 'Jharkhand',
                pincode: '834002'
            }
        });

        // Create sample issues
        console.log('Creating sample issues...');
        const sampleIssues = await Issue.create([
            {
                title: 'Large pothole near Gandhi Chowk',
                description: 'Deep pothole causing traffic issues and vehicle damage. Needs immediate attention.',
                category: 'pothole',
                location: {
                    address: 'Gandhi Chowk, Ranchi, Jharkhand',
                    coordinates: { lat: 23.350, lng: 85.320 },
                    ward: 'Ward 15',
                    pincode: '834001'
                },
                reportedBy: citizen1._id,
                priority: 'high',
                assignedTo: departments[0]._id,
                status: 'in_progress',
                updates: [
                    {
                        status: 'reported',
                        description: 'Issue reported by citizen',
                        updatedBy: citizen1._id
                    },
                    {
                        status: 'acknowledged',
                        description: 'Issue acknowledged by PWD department',
                        updatedBy: departmentStaff._id
                    },
                    {
                        status: 'in_progress',
                        description: 'Repair work started',
                        updatedBy: departmentStaff._id
                    }
                ]
            },
            {
                title: 'Street light not working on Main Road',
                description: 'Light pole not functioning for 3 days, creating safety concerns at night',
                category: 'streetlight',
                location: {
                    address: 'Main Road, Harmu, Ranchi',
                    coordinates: { lat: 23.355, lng: 85.315 },
                    ward: 'Ward 12',
                    pincode: '834002'
                },
                reportedBy: citizen2._id,
                status: 'acknowledged',
                priority: 'medium',
                assignedTo: departments[1]._id,
                updates: [
                    {
                        status: 'reported',
                        description: 'Issue reported by citizen',
                        updatedBy: citizen2._id
                    },
                    {
                        status: 'acknowledged',
                        description: 'Issue acknowledged by Municipal Corporation',
                        updatedBy: adminUser._id
                    }
                ]
            },
            {
                title: 'Garbage bin overflowing near market',
                description: 'Trash bin overflowing for 2 days, attracting stray animals and creating unhygienic conditions',
                category: 'trash',
                location: {
                    address: 'Daily Market, Ranchi',
                    coordinates: { lat: 23.345, lng: 85.305 },
                    ward: 'Ward 10',
                    pincode: '834001'
                },
                reportedBy: citizen1._id,
                priority: 'high',
                assignedTo: departments[1]._id
            },
            {
                title: 'Water leakage near community park',
                description: 'Water pipeline leaking, causing water wastage and road damage',
                category: 'water',
                location: {
                    address: 'Near Community Park, Doranda',
                    coordinates: { lat: 23.340, lng: 85.310 },
                    ward: 'Ward 8',
                    pincode: '834002'
                },
                reportedBy: citizen2._id,
                status: 'resolved',
                priority: 'medium',
                assignedTo: departments[2]._id,
                actualResolutionTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                updates: [
                    {
                        status: 'reported',
                        description: 'Issue reported by citizen',
                        updatedBy: citizen2._id
                    },
                    {
                        status: 'in_progress',
                        description: 'Maintenance team dispatched',
                        updatedBy: adminUser._id
                    },
                    {
                        status: 'resolved',
                        description: 'Leakage fixed successfully',
                        updatedBy: adminUser._id
                    }
                ],
                citizenFeedback: {
                    rating: 4,
                    comment: 'Quick response and good work. Thank you!',
                    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
                }
            }
        ]);

        console.log('Data seeded successfully!');
        console.log(`Created ${departments.length} departments`);
        console.log(`Created 4 users (admin, staff, 2 citizens)`);
        console.log(`Created ${sampleIssues.length} sample issues`);
        
        // Display login credentials
        console.log('\n=== Login Credentials ===');
        console.log('Admin: email=admin@civicconnect.com, password=admin123');
        console.log('Staff: email=rajesh.pwd@jharkhand.gov.in, password=staff123');
        console.log('Citizen 1: email=rahul@example.com, password=password123');
        console.log('Citizen 2: email=priya@example.com, password=password123');
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

// Handle script termination
process.on('SIGINT', async () => {
    console.log('\nSeeding interrupted');
    await mongoose.connection.close();
    process.exit(0);
});

seedData();