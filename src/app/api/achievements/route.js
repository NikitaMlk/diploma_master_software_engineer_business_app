// src/app/api/achievements/route.js

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";
import { getUserByEmail } from "@/lib/authService";

// Helper: get actual userId from session
async function getActualUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  let actualUserId = session.user.id;
  if (!actualUserId && session.user.email) {
    const dbUser = await getUserByEmail(session.user.email);
    if (dbUser) {
      actualUserId = dbUser._id?.toString() || dbUser.id?.toString();
    }
  }
  return actualUserId || null;
}

// Available achievements database
const ACHIEVEMENT_DEFINITIONS = {
  // Streak achievements
  "first-post": {
    name: "First Post",
    description: "Complete your very first post",
    icon: "🎉",
    type: "milestone",
    xpReward: 50,
    rarity: "common"
  },
  "streak-7": {
    name: "Week Warrior",
    description: "Maintain a 7-day posting streak",
    icon: "🔥",
    type: "streak",
    xpReward: 100,
    rarity: "common"
  },
  "streak-14": {
    name: "Two Week Champion",
    description: "Maintain a 14-day posting streak",
    icon: "⚡",
    type: "streak",
    xpReward: 250,
    rarity: "uncommon"
  },
  "streak-30": {
    name: "Monthly Master",
    description: "Maintain a 30-day posting streak",
    icon: "🌟",
    type: "streak",
    xpReward: 500,
    rarity: "rare"
  },
  "streak-60": {
    name: "Consistency King",
    description: "Maintain a 60-day posting streak",
    icon: "👑",
    type: "streak",
    xpReward: 1000,
    rarity: "epic"
  },
  "streak-100": {
    name: "Posting Legend",
    description: "Maintain a 100-day posting streak",
    icon: "🏆",
    type: "streak",
    xpReward: 2500,
    rarity: "legendary"
  },
  
  // Level achievements
  "level-5": {
    name: "Rising Star",
    description: "Reach level 5",
    icon: "⭐",
    type: "level",
    xpReward: 100,
    rarity: "common"
  },
  "level-10": {
    name: "Content Creator",
    description: "Reach level 10",
    icon: "📝",
    type: "level",
    xpReward: 250,
    rarity: "uncommon"
  },
  "level-20": {
    name: "Posting Pro",
    description: "Reach level 20",
    icon: "💪",
    type: "level",
    xpReward: 500,
    rarity: "rare"
  },
  "level-50": {
    name: "Master Creator",
    description: "Reach level 50",
    icon: "🎯",
    type: "level",
    xpReward: 1000,
    rarity: "epic"
  },
  
  // Volume achievements
  "posts-10": {
    name: "Getting Started",
    description: "Complete 10 posts",
    icon: "📊",
    type: "volume",
    xpReward: 75,
    rarity: "common"
  },
  "posts-50": {
    name: "Half Century",
    description: "Complete 50 posts",
    icon: "📈",
    type: "volume",
    xpReward: 200,
    rarity: "uncommon"
  },
  "posts-100": {
    name: "Centurion",
    description: "Complete 100 posts",
    icon: "💯",
    type: "volume",
    xpReward: 500,
    rarity: "rare"
  },
  "posts-500": {
    name: "Content Machine",
    description: "Complete 500 posts",
    icon: "🚀",
    type: "volume",
    xpReward: 1500,
    rarity: "epic"
  },
  
  // Special achievements
  "perfect-week": {
    name: "Perfect Week",
    description: "Complete all scheduled posts for 7 consecutive days",
    icon: "✨",
    type: "special",
    xpReward: 300,
    rarity: "rare"
  },
  "theme-master": {
    name: "Theme Master",
    description: "Complete posts in all available themes",
    icon: "🎨",
    type: "special",
    xpReward: 400,
    rarity: "rare"
  },
  "early-bird": {
    name: "Early Bird",
    description: "Complete 10 posts before 8 AM",
    icon: "🌅",
    type: "special",
    xpReward: 200,
    rarity: "uncommon"
  },
  "night-owl": {
    name: "Night Owl",
    description: "Complete 10 posts after 10 PM",
    icon: "🦉",
    type: "special",
    xpReward: 200,
    rarity: "uncommon"
  }
};

// -------------------- GET --------------------
export async function GET(req) {
  try {
    const userId = await getActualUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // all, unlocked, available
    const category = searchParams.get("category"); // streak, level, volume, special

    const { db } = await connectToDatabase();

    // Get user progress to determine unlocked achievements
    const userProgress = await db
      .collection("user-progress")
      .findOne({ userId: new ObjectId(userId) });

    const unlockedAchievements = userProgress?.achievements || [];

    if (type === "unlocked") {
      return NextResponse.json({
        achievements: unlockedAchievements
          .filter(achievement => !category || ACHIEVEMENT_DEFINITIONS[achievement.id]?.type === category)
          .map(achievement => ({
            ...achievement,
            definition: ACHIEVEMENT_DEFINITIONS[achievement.id]
          }))
          .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt))
      });
    }

    // Get available achievements (not yet unlocked)
    const unlockedIds = new Set(unlockedAchievements.map(a => a.id));
    const availableAchievements = Object.entries(ACHIEVEMENT_DEFINITIONS)
      .filter(([id, _]) => !unlockedIds.has(id))
      .filter(([_, achievement]) => !category || achievement.type === category)
      .map(([id, achievement]) => ({
        id,
        ...achievement,
        locked: true,
        progress: calculateAchievementProgress(id, userId, db)
      }));

    if (type === "available") {
      return NextResponse.json({
        achievements: availableAchievements
          .sort((a, b) => b.progress - a.progress)
      });
    }

    // Return all achievements
    const allAchievements = [
      ...unlockedAchievements.map(achievement => ({
        ...achievement,
        definition: ACHIEVEMENT_DEFINITIONS[achievement.id],
        locked: false,
        progress: 100
      })),
      ...availableAchievements
    ];

    return NextResponse.json({
      achievements: allAchievements
        .filter(achievement => !category || achievement.definition?.type === category || achievement.type === category)
        .sort((a, b) => {
          if (a.locked !== b.locked) return a.locked ? 1 : -1;
          return new Date(b.unlockedAt || 0) - new Date(a.unlockedAt || 0);
        }),
      summary: {
        total: Object.keys(ACHIEVEMENT_DEFINITIONS).length,
        unlocked: unlockedAchievements.length,
        categories: {
          streak: Object.values(ACHIEVEMENT_DEFINITIONS).filter(a => a.type === 'streak').length,
          level: Object.values(ACHIEVEMENT_DEFINITIONS).filter(a => a.type === 'level').length,
          volume: Object.values(ACHIEVEMENT_DEFINITIONS).filter(a => a.type === 'volume').length,
          special: Object.values(ACHIEVEMENT_DEFINITIONS).filter(a => a.type === 'special').length
        }
      }
    });

  } catch (error) {
    console.error("Failed to fetch achievements:", error);
    return NextResponse.json({ error: "Failed to fetch achievements" }, { status: 500 });
  }
}

// Helper function to calculate achievement progress
async function calculateAchievementProgress(achievementId, userId, db) {
  const userProgress = await db
    .collection("user-progress")
    .findOne({ userId: new ObjectId(userId) });

  const posts = await db
    .collection("posts")
    .find({ userId: new ObjectId(userId), completed: true })
    .toArray();

  switch (achievementId) {
    case "first-post":
      return posts.length > 0 ? 100 : 0;
    
    case "streak-7":
      return Math.min(100, ((userProgress?.streak || 0) / 7) * 100);
    case "streak-14":
      return Math.min(100, ((userProgress?.streak || 0) / 14) * 100);
    case "streak-30":
      return Math.min(100, ((userProgress?.streak || 0) / 30) * 100);
    case "streak-60":
      return Math.min(100, ((userProgress?.streak || 0) / 60) * 100);
    case "streak-100":
      return Math.min(100, ((userProgress?.streak || 0) / 100) * 100);
    
    case "level-5":
      return Math.min(100, ((userProgress?.level || 1) / 5) * 100);
    case "level-10":
      return Math.min(100, ((userProgress?.level || 1) / 10) * 100);
    case "level-20":
      return Math.min(100, ((userProgress?.level || 1) / 20) * 100);
    case "level-50":
      return Math.min(100, ((userProgress?.level || 1) / 50) * 100);
    
    case "posts-10":
      return Math.min(100, (posts.length / 10) * 100);
    case "posts-50":
      return Math.min(100, (posts.length / 50) * 100);
    case "posts-100":
      return Math.min(100, (posts.length / 100) * 100);
    case "posts-500":
      return Math.min(100, (posts.length / 500) * 100);
    
    case "perfect-week":
      // Check for perfect week (simplified logic)
      return 0; // Would need more complex logic
    
    case "theme-master":
      // Check if user has posted in all available themes
      const uniqueThemes = new Set(posts.map(post => post.theme.id));
      const totalThemes = 9; // Based on your themes array
      return Math.min(100, (uniqueThemes.size / totalThemes) * 100);
    
    case "early-bird":
      const earlyPosts = posts.filter(post => {
        const hour = new Date(post.completedAt).getHours();
        return hour < 8;
      });
      return Math.min(100, (earlyPosts.length / 10) * 100);
    
    case "night-owl":
      const latePosts = posts.filter(post => {
        const hour = new Date(post.completedAt).getHours();
        return hour >= 22;
      });
      return Math.min(100, (latePosts.length / 10) * 100);
    
    default:
      return 0;
  }
}

// -------------------- POST --------------------
export async function POST(req) {
  try {
    const userId = await getActualUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { achievementId } = await req.json();

    if (!achievementId || !ACHIEVEMENT_DEFINITIONS[achievementId]) {
      return NextResponse.json({ error: "Invalid achievement ID" }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Check if user already has this achievement
    const userProgress = await db
      .collection("user-progress")
      .findOne({ userId: new ObjectId(userId) });

    const hasAchievement = userProgress?.achievements?.find(a => a.id === achievementId);
    
    if (hasAchievement) {
      return NextResponse.json({ error: "Achievement already unlocked" }, { status: 400 });
    }

    // Create achievement record
    const achievement = {
      id: achievementId,
      name: ACHIEVEMENT_DEFINITIONS[achievementId].name,
      description: ACHIEVEMENT_DEFINITIONS[achievementId].description,
      icon: ACHIEVEMENT_DEFINITIONS[achievementId].icon,
      type: ACHIEVEMENT_DEFINITIONS[achievementId].type,
      rarity: ACHIEVEMENT_DEFINITIONS[achievementId].rarity,
      unlockedAt: new Date()
    };

    // Add achievement to user progress
    await db.collection("user-progress").updateOne(
      { userId: new ObjectId(userId) },
      {
        $push: { achievements: achievement },
        $inc: { xp: ACHIEVEMENT_DEFINITIONS[achievementId].xpReward },
        $set: { updatedAt: new Date() }
      },
      { upsert: true }
    );

    return NextResponse.json({
      message: "Achievement unlocked!",
      achievement,
      xpReward: ACHIEVEMENT_DEFINITIONS[achievementId].xpReward
    });

  } catch (error) {
    console.error("Failed to unlock achievement:", error);
    return NextResponse.json({ error: "Failed to unlock achievement" }, { status: 500 });
  }
}