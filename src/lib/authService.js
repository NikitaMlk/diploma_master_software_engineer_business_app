import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Cache for frequently accessed data
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCacheKey(prefix, identifier) {
  return `${prefix}:${identifier}`;
}

function setCache(key, value) {
  cache.set(key, {
    value,
    timestamp: Date.now(),
  });
}

function getCache(key) {
  const cached = cache.get(key);
  if (!cached) return null;
  
  if (Date.now() - cached.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  
  return cached.value;
}

export async function getUserByEmail(email) {
  if (!email) return null;

  // Check cache first
  const cacheKey = getCacheKey('user', email);
  const cachedUser = getCache(cacheKey);
  if (cachedUser) return cachedUser;

  const { db } = await connectToDatabase();
  const usersCollection = db.collection("users");

  const user = await usersCollection.findOne({ email });
  
  // Cache the result
  if (user) {
    setCache(cacheKey, user);
  }
  
  return user;
}

export async function getUserById(id) {
  if (!id) return null;

  const cacheKey = getCacheKey('user_id', id);
  const cachedUser = getCache(cacheKey);
  if (cachedUser) return cachedUser;

  const { db } = await connectToDatabase();
  const usersCollection = db.collection("users");

  const user = await usersCollection.findOne({ _id: id });
  
  if (user) {
    setCache(cacheKey, user);
  }
  
  return user;
}

export async function upsertUser(userData) {
  const { email, _id, ...updateData } = userData;
  
  if (!email && !_id) {
    throw new Error("Missing email or _id in upsertUser");
  }

  const { db } = await connectToDatabase();
  const usersCollection = db.collection("users");

  // Clear cache for this user
  if (email) {
    const cacheKey = getCacheKey('user', email);
    cache.delete(cacheKey);
  }
  if (_id) {
    const cacheKey = getCacheKey('user_id', _id);
    cache.delete(cacheKey);
  }

  // If updating by _id, just update
  if (_id) {
    await usersCollection.updateOne(
      { _id },
      { 
        $set: { 
          ...updateData,
          updatedAt: new Date() 
        } 
      }
    );
    return;
  }

  // Otherwise, upsert by email
  const existingUser = await usersCollection.findOne({ email });

  if (!existingUser) {
    // Create new user
    await usersCollection.insertOne({
      email,
      name: updateData.name,
      image: updateData.image,
      provider: updateData.provider || 'google',
      role: updateData.role || 'user',
      verified: true,
      status: 'active',
      loginCount: 1,
      lastLogin: new Date(),
      isFirstLogin: true,
      failedLoginAttempts: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      profileData: updateData.profileData || {},
      subscription: updateData.subscription || null,
      features: updateData.features || {},
      organizations: updateData.organizations || [],
      ...updateData
    });
  } else {
    // Update existing user
    const updateFields = {
      updatedAt: new Date(),
    };

    // Only update changed fields
    if (updateData.name && updateData.name !== existingUser.name) {
      updateFields.name = updateData.name;
    }
    if (updateData.image && updateData.image !== existingUser.image) {
      updateFields.image = updateData.image;
    }
    if (updateData.role && updateData.role !== existingUser.role) {
      updateFields.role = updateData.role;
    }
    if (updateData.lastLogin) {
      updateFields.lastLogin = updateData.lastLogin;
    }
    if (updateData.lastActivity) {
      updateFields.lastActivity = updateData.lastActivity;
    }
    if (updateData.loginCount) {
      updateFields.loginCount = updateData.loginCount;
    }
    if (updateData.profileData) {
      updateFields.profileData = { ...existingUser.profileData, ...updateData.profileData };
    }

    await usersCollection.updateOne(
      { email },
      { $set: updateFields }
    );
  }
}

export async function isTrustedUser(email) {
  if (!email) return false;

  const cacheKey = getCacheKey('trusted', email);
  const cached = getCache(cacheKey);
  if (cached !== null) return cached;

  const { db } = await connectToDatabase();
  const trustedUsersCollection = db.collection("trusted_users");

  const trusted = await trustedUsersCollection.findOne({ email });
  const isTrusted = !!trusted;
  
  setCache(cacheKey, isTrusted);
  return isTrusted;
}

export async function validateCredentials(email, password) {
  if (!email || !password) return null;

  const { db } = await connectToDatabase();
  const usersCollection = db.collection("users");

  const user = await usersCollection.findOne({ 
    email,
    password: { $exists: true } // Only users with passwords
  });

  if (!user || !user.password) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (isValid) {
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      image: user.image,
    };
  }

  return null;
}

export async function incrementLoginCount(email) {
  if (!email) return 1;

  const { db } = await connectToDatabase();
  const usersCollection = db.collection("users");

  const result = await usersCollection.findOneAndUpdate(
    { email },
    { 
      $inc: { loginCount: 1 },
      $set: { isFirstLogin: false }
    },
    { returnDocument: 'after' }
  );

  return result?.loginCount || 1;
}

export async function getUserStatus(email) {
  if (!email) return { active: true };

  const cacheKey = getCacheKey('status', email);
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const { db } = await connectToDatabase();
  const usersCollection = db.collection("users");

  const user = await usersCollection.findOne(
    { email },
    { projection: { status: 1, banned: 1, suspended: 1, banReason: 1, suspendedUntil: 1 } }
  );

  if (!user) return { active: false };

  const status = {
    active: user.status === 'active',
    banned: user.banned === true,
    suspended: user.suspended === true || (user.suspendedUntil && new Date(user.suspendedUntil) > new Date()),
    banReason: user.banReason || null,
    suspendedUntil: user.suspendedUntil || null,
  };

  setCache(cacheKey, status);
  return status;
}

export async function checkDomainWhitelist(email) {
  if (!email) return false;

  const { db } = await connectToDatabase();
  
  // Check if domain whitelist is enabled
  const settingsCollection = db.collection("settings");
  const settings = await settingsCollection.findOne({ key: "domainWhitelist" });
  
  if (!settings || !settings.enabled) {
    return true; // No whitelist configured, allow all
  }

  const domain = email.split('@')[1];
  const allowedDomains = settings.domains || [];
  
  return allowedDomains.includes(domain);
}

export async function determineUserRole(email, provider) {
  if (!email) return 'user';

  // Check for admin patterns
  const adminPatterns = [
    /^admin@/,
    /^owner@/,
    /^support@/,
    /@yourcompany\.com$/
  ];

  for (const pattern of adminPatterns) {
    if (pattern.test(email)) {
      return 'admin';
    }
  }

  // Check for invited users with specific roles
  const { db } = await connectToDatabase();
  const invitationsCollection = db.collection("invitations");
  
  const invitation = await invitationsCollection.findOne({ 
    email,
    status: 'pending'
  });

  if (invitation && invitation.role) {
    // Mark invitation as used
    await invitationsCollection.updateOne(
      { _id: invitation._id },
      { $set: { status: 'accepted', acceptedAt: new Date() } }
    );
    return invitation.role;
  }

  return 'user';
}

export async function validateSession(sessionId) {
  if (!sessionId) return false;

  const { db } = await connectToDatabase();
  const sessionsCollection = db.collection("sessions");

  const session = await sessionsCollection.findOne({ 
    sessionId,
    expiresAt: { $gt: new Date() }
  });

  return !!session;
}

export async function generateSessionId() {
  return crypto.randomBytes(32).toString('hex');
}

export async function createSession(userId, sessionId) {
  const { db } = await connectToDatabase();
  const sessionsCollection = db.collection("sessions");

  await sessionsCollection.insertOne({
    userId,
    sessionId,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    lastActivity: new Date(),
  });
}

export async function invalidateSession(sessionId) {
  const { db } = await connectToDatabase();
  const sessionsCollection = db.collection("sessions");

  await sessionsCollection.deleteOne({ sessionId });
}

export async function getUserFeatureFlags(userId) {
  if (!userId) return {};

  const cacheKey = getCacheKey('features', userId);
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const { db } = await connectToDatabase();
  const usersCollection = db.collection("users");
  const featureFlagsCollection = db.collection("feature_flags");

  const user = await usersCollection.findOne({ _id: userId });
  if (!user) return {};

  // Get global feature flags
  const globalFlags = await featureFlagsCollection.find({ 
    global: true, 
    enabled: true 
  }).toArray();

  // Get role-specific flags
  const roleFlags = await featureFlagsCollection.find({ 
    roles: user.role, 
    enabled: true 
  }).toArray();

  // Combine flags
  const features = {};
  [...globalFlags, ...roleFlags].forEach(flag => {
    features[flag.key] = flag.value || true;
  });

  // Add user-specific flags
  if (user.features) {
    Object.assign(features, user.features);
  }

  setCache(cacheKey, features);
  return features;
}

export async function getUserOrganizations(userId) {
  if (!userId) return [];

  const cacheKey = getCacheKey('orgs', userId);
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const { db } = await connectToDatabase();
  const organizationsCollection = db.collection("organizations");
  const membershipsCollection = db.collection("memberships");

  const memberships = await membershipsCollection.find({ 
    userId,
    status: 'active' 
  }).toArray();

  if (memberships.length === 0) return [];

  const orgIds = memberships.map(m => m.organizationId);
  const organizations = await organizationsCollection.find({ 
    _id: { $in: orgIds } 
  }).toArray();

  const result = organizations.map(org => {
    const membership = memberships.find(m => 
      m.organizationId.toString() === org._id.toString()
    );
    return {
      id: org._id,
      name: org.name,
      slug: org.slug,
      role: membership.role,
      joinedAt: membership.createdAt,
    };
  });

  setCache(cacheKey, result);
  return result;
}

export async function logAuthEvent(eventData) {
  try {
    const { db } = await connectToDatabase();
    const authLogsCollection = db.collection("auth_logs");

    await authLogsCollection.insertOne({
      ...eventData,
      timestamp: eventData.timestamp || new Date(),
      ip: eventData.ip || null,
      userAgent: eventData.userAgent || null,
    });
  } catch (error) {
    console.error('Failed to log auth event:', error);
    // Don't throw - logging failures shouldn't break auth
  }
}

export async function getFailedAttempts(email) {
  if (!email) return 0;

  const { db } = await connectToDatabase();
  const usersCollection = db.collection("users");

  const user = await usersCollection.findOne(
    { email },
    { projection: { failedLoginAttempts: 1, lastFailedAttempt: 1 } }
  );

  if (!user) return 0;

  // Reset counter if last attempt was more than 15 minutes ago
  if (user.lastFailedAttempt) {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    if (user.lastFailedAttempt < fifteenMinutesAgo) {
      await usersCollection.updateOne(
        { email },
        { $set: { failedLoginAttempts: 0 } }
      );
      return 0;
    }
  }

  return user.failedLoginAttempts || 0;
}

export async function incrementFailedAttempts(email) {
  if (!email) return;

  const { db } = await connectToDatabase();
  const usersCollection = db.collection("users");

  await usersCollection.updateOne(
    { email },
    { 
      $inc: { failedLoginAttempts: 1 },
      $set: { lastFailedAttempt: new Date() }
    },
    { upsert: true }
  );
}

export async function resetFailedAttempts(email) {
  if (!email) return;

  const { db } = await connectToDatabase();
  const usersCollection = db.collection("users");

  await usersCollection.updateOne(
    { email },
    { 
      $set: { 
        failedLoginAttempts: 0,
        lastFailedAttempt: null
      }
    }
  );
}

export async function createPasswordHash(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

export async function createUserWithPassword(userData) {
  if (!userData.email || !userData.password) {
    throw new Error("Email and password are required");
  }

  const existingUser = await getUserByEmail(userData.email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await createPasswordHash(userData.password);

  await upsertUser({
    ...userData,
    password: hashedPassword,
    provider: 'credentials',
    verified: false, // Email verification required for password users
  });
}

export async function updatePassword(email, newPassword) {
  if (!email || !newPassword) {
    throw new Error("Email and new password are required");
  }

  const hashedPassword = await createPasswordHash(newPassword);
  
  const { db } = await connectToDatabase();
  const usersCollection = db.collection("users");

  await usersCollection.updateOne(
    { email },
    { 
      $set: { 
        password: hashedPassword,
        updatedAt: new Date()
      }
    }
  );

  // Clear cache
  const cacheKey = getCacheKey('user', email);
  cache.delete(cacheKey);
}

export async function banUser(email, reason) {
  const { db } = await connectToDatabase();
  const usersCollection = db.collection("users");

  await usersCollection.updateOne(
    { email },
    { 
      $set: { 
        banned: true,
        banReason: reason,
        bannedAt: new Date(),
        status: 'banned'
      }
    }
  );

  // Clear caches
  cache.delete(getCacheKey('user', email));
  cache.delete(getCacheKey('status', email));
}

export async function suspendUser(email, until, reason) {
  const { db } = await connectToDatabase();
  const usersCollection = db.collection("users");

  await usersCollection.updateOne(
    { email },
    { 
      $set: { 
        suspended: true,
        suspendedUntil: until,
        suspendReason: reason,
        suspendedAt: new Date(),
        status: 'suspended'
      }
    }
  );

  // Clear caches
  cache.delete(getCacheKey('user', email));
  cache.delete(getCacheKey('status', email));
}