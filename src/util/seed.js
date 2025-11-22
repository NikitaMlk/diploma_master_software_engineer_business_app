//all users have password: password123

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DATABASE_NAME = process.env.DATABASE_NAME || 'test_app_db';

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DATABASE_NAME);
    
    // Clear existing collections (optional - remove if you want to preserve existing data)
    const collections = ['users', 'accounts', 'sessions', 'verification_tokens', 'auth_events', 'domain_whitelist', 'feature_flags', 'organizations', 'failed_attempts'];
    
    for (const collectionName of collections) {
      try {
        await db.collection(collectionName).drop();
        console.log(`Dropped collection: ${collectionName}`);
      } catch (error) {
        // Collection might not exist, continue
        console.log(`Collection ${collectionName} not found, skipping drop`);
      }
    }

    // Create indexes for better performance
    await createIndexes(db);
    
    // Seed Users Collection
    await seedUsers(db);
    
    // Seed Domain Whitelist
    await seedDomainWhitelist(db);
    
    // Seed Feature Flags
    await seedFeatureFlags(db);
    
    // Seed Organizations
    await seedOrganizations(db);
    
    // Seed Sample Auth Events
    await seedAuthEvents(db);
    
    console.log('Database seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

async function createIndexes(db) {
  console.log('Creating indexes...');
  
  // Users collection indexes
  await db.collection('users').createIndexes([
    { key: { email: 1 }, unique: true },
    { key: { provider: 1 } },
    { key: { role: 1 } },
    { key: { lastLogin: 1 } },
    { key: { createdAt: 1 } }
  ]);
  
  // Auth events indexes
  await db.collection('auth_events').createIndexes([
    { key: { email: 1 } },
    { key: { type: 1 } },
    { key: { timestamp: 1 } },
    { key: { userId: 1 } }
  ]);
  
  // Failed attempts indexes
  await db.collection('failed_attempts').createIndexes([
    { key: { email: 1 }, unique: true },
    { key: { lastAttempt: 1 }, expireAfterSeconds: 3600 } // Expire after 1 hour
  ]);
  
  // Sessions collection indexes
  await db.collection('sessions').createIndexes([
    { key: { sessionId: 1 }, unique: true },
    { key: { userId: 1 } },
    { key: { expiresAt: 1 }, expireAfterSeconds: 0 }
  ]);
  
  console.log('Indexes created successfully');
}

async function seedUsers(db) {
  console.log('Seeding users...');
  
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const users = [
    {
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      provider: 'credentials',
      image: null,
      loginCount: 0,
      lastLogin: null,
      lastActivity: new Date(),
      isFirstLogin: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      profileData: null,
      subscription: {
        status: 'active',
        plan: 'premium',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
      },
      password: hashedPassword
    },
    {
      email: 'user@example.com',
      name: 'Regular User',
      role: 'user',
      provider: 'credentials',
      image: null,
      loginCount: 0,
      lastLogin: null,
      lastActivity: new Date(),
      isFirstLogin: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      profileData: null,
      subscription: {
        status: 'active',
        plan: 'basic',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      },
      password: hashedPassword
    },
    {
      email: 'owner@example.com',
      name: 'Owner User',
      role: 'owner',
      provider: 'google',
      image: 'https://example.com/avatar.jpg',
      loginCount: 5,
      lastLogin: new Date(),
      lastActivity: new Date(),
      isFirstLogin: false,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      updatedAt: new Date(),
      profileData: {
        googleId: '1234567890',
        verified: true
      },
      subscription: {
        status: 'active',
        plan: 'enterprise',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      }
    },
    {
      email: 'github.user@example.com',
      name: 'GitHub User',
      role: 'user',
      provider: 'github',
      image: 'https://avatars.githubusercontent.com/u/123456?v=4',
      loginCount: 3,
      lastLogin: new Date(),
      lastActivity: new Date(),
      isFirstLogin: false,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      updatedAt: new Date(),
      profileData: {
        githubId: '123456',
        verified: true
      },
      subscription: {
        status: 'trial',
        plan: 'premium',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      }
    }
  ];
  
  const result = await db.collection('users').insertMany(users);
  console.log(`Inserted ${result.insertedCount} users`);
  return result;
}

async function seedDomainWhitelist(db) {
  console.log('Seeding domain whitelist...');
  
  const domains = [
    {
      domain: 'example.com',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      domain: 'company.com',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      domain: 'trusted-org.org',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  const result = await db.collection('domain_whitelist').insertMany(domains);
  console.log(`Inserted ${result.insertedCount} domains`);
  return result;
}

async function seedFeatureFlags(db) {
  console.log('Seeding feature flags...');
  
  const featureFlags = [
    {
      name: 'beta_dashboard',
      description: 'Enable beta dashboard features',
      enabled: true,
      userRoles: ['admin', 'owner'],
      userIds: [], // Specific user IDs can be added here
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'advanced_analytics',
      description: 'Enable advanced analytics features',
      enabled: true,
      userRoles: ['admin', 'owner'],
      userIds: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'premium_features',
      description: 'Enable premium subscription features',
      enabled: true,
      userRoles: ['admin', 'owner'],
      subscriptionPlans: ['premium', 'enterprise'],
      userIds: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'experimental_ui',
      description: 'Enable experimental UI components',
      enabled: false,
      userRoles: ['admin'],
      userIds: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  const result = await db.collection('feature_flags').insertMany(featureFlags);
  console.log(`Inserted ${result.insertedCount} feature flags`);
  return result;
}

async function seedOrganizations(db) {
  console.log('Seeding organizations...');
  
  const organizations = [
    {
      name: 'Example Corp',
      slug: 'example-corp',
      description: 'A sample organization for testing',
      ownerId: null, // Will be updated after users are created
      members: [],
      settings: {
        allowPublicJoin: false,
        requireApproval: true
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Tech Startup',
      slug: 'tech-startup',
      description: 'A technology startup organization',
      ownerId: null,
      members: [],
      settings: {
        allowPublicJoin: true,
        requireApproval: false
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  const result = await db.collection('organizations').insertMany(organizations);
  console.log(`Inserted ${result.insertedCount} organizations`);
  return result;
}

async function seedAuthEvents(db) {
  console.log('Seeding auth events...');
  
  const authEvents = [
    {
      type: 'SIGNIN_SUCCESS',
      email: 'admin@example.com',
      provider: 'credentials',
      timestamp: new Date(),
      metadata: {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ip: '192.168.1.1'
      }
    },
    {
      type: 'SIGNIN_FAILED',
      email: 'invalid@example.com',
      provider: 'credentials',
      reason: 'INVALID_CREDENTIALS',
      timestamp: new Date(Date.now() - 60000), // 1 minute ago
      metadata: {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ip: '192.168.1.2'
      }
    },
    {
      type: 'EVENT_USER_CREATED',
      email: 'user@example.com',
      userId: null, // Would be populated with actual user ID in real scenario
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      metadata: {
        registrationSource: 'web'
      }
    }
  ];
  
  const result = await db.collection('auth_events').insertMany(authEvents);
  console.log(`Inserted ${result.insertedCount} auth events`);
  return result;
}

// Run the seeding script
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = {
  seedDatabase,
  seedUsers,
  seedDomainWhitelist,
  seedFeatureFlags,
  seedOrganizations,
  seedAuthEvents
};