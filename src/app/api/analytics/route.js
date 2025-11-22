// src/app/api/analytics/route.js

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

// Helper: Get date range
function getDateRange(period) {
  const today = new Date();
  const startDate = new Date();
  
  switch (period) {
    case "week":
      startDate.setDate(today.getDate() - 7);
      break;
    case "month":
      startDate.setMonth(today.getMonth() - 1);
      break;
    case "quarter":
      startDate.setMonth(today.getMonth() - 3);
      break;
    case "year":
      startDate.setFullYear(today.getFullYear() - 1);
      break;
    default:
      startDate.setMonth(today.getMonth() - 1); // Default to month
  }
  
  return { startDate, endDate: today };
}

// -------------------- GET --------------------
export async function GET(req) {
  try {
    const userId = await getActualUserId();
    if (!userId) {
      return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });

  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}

// Helper function to get week number
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// Helper function to check if date is recent (within last 2 days)
function isDateRecent(date, referenceDate) {
  const diffTime = Math.abs(referenceDate - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 2;
} "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "month"; // week, month, quarter, year
    const type = searchParams.get("type"); // overview, themes, consistency, engagement

    const { db } = await connectToDatabase();
    const { startDate, endDate } = getDateRange(period);

    // Base query for the period
    const baseQuery = {
      userId: new ObjectId(userId),
      scheduledDate: {
        $gte: startDate,
        $lte: endDate
      }
    };

    if (type === "overview" || !type) {
      // General analytics overview
      const [posts, userProgress, contentPlans] = await Promise.all([
        db.collection("posts").find(baseQuery).toArray(),
        db.collection("user-progress").findOne({ userId: new ObjectId(userId) }),
        db.collection("content-plans").find({ 
          userId: new ObjectId(userId), 
          status: "active" 
        }).toArray()
      ]);

      const completedPosts = posts.filter(post => post.completed);
      const totalScheduled = posts.length;
      const completionRate = totalScheduled > 0 ? (completedPosts.length / totalScheduled) * 100 : 0;

      // Daily posting consistency
      const postsByDay = {};
      const now = new Date(endDate);
      const start = new Date(startDate);

      // Initialize all days with 0
      for (let d = new Date(start); d <= now; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        postsByDay[dateStr] = { scheduled: 0, completed: 0 };
      }

      // Fill with actual data
      posts.forEach(post => {
        const dateStr = post.scheduledDate.toISOString().split('T')[0];
        if (postsByDay[dateStr]) {
          postsByDay[dateStr].scheduled++;
          if (post.completed) {
            postsByDay[dateStr].completed++;
          }
        }
      });

      const dailyConsistency = Object.values(postsByDay).map(day => 
        day.scheduled > 0 ? (day.completed / day.scheduled) * 100 : 0
      );

      const averageConsistency = dailyConsistency.length > 0 
        ? dailyConsistency.reduce((a, b) => a + b, 0) / dailyConsistency.length 
        : 0;

      return NextResponse.json({
        period,
        overview: {
          totalScheduled,
          totalCompleted: completedPosts.length,
          completionRate: Math.round(completionRate),
          currentStreak: userProgress?.streak || 0,
          currentLevel: userProgress?.level || 1,
          currentXp: userProgress?.xp || 0,
          activePlans: contentPlans.length,
          averageConsistency: Math.round(averageConsistency)
        },
        dailyBreakdown: Object.entries(postsByDay).map(([date, data]) => ({
          date,
          scheduled: data.scheduled,
          completed: data.completed,
          rate: data.scheduled > 0 ? Math.round((data.completed / data.scheduled) * 100) : 0
        }))
      });

    } else if (type === "themes") {
      // Theme-based analytics
      const posts = await db.collection("posts").find(baseQuery).toArray();
      
      const themeStats = {};
      posts.forEach(post => {
        const themeName = post.theme.name;
        if (!themeStats[themeName]) {
          themeStats[themeName] = {
            name: themeName,
            icon: post.theme.icon,
            color: post.theme.color,
            scheduled: 0,
            completed: 0,
            totalEngagement: 0
          };
        }
        
        themeStats[themeName].scheduled++;
        if (post.completed) {
          themeStats[themeName].completed++;
        }
        
        // Add engagement metrics
        if (post.engagement) {
          themeStats[themeName].totalEngagement += 
            (post.engagement.likes || 0) + 
            (post.engagement.retweets || 0) + 
            (post.engagement.replies || 0);
        }
      });

      const themes = Object.values(themeStats).map(theme => ({
        ...theme,
        completionRate: theme.scheduled > 0 ? Math.round((theme.completed / theme.scheduled) * 100) : 0,
        averageEngagement: theme.completed > 0 ? Math.round(theme.totalEngagement / theme.completed) : 0
      }));

      return NextResponse.json({
        period,
        themes: themes.sort((a, b) => b.completionRate - a.completionRate)
      });

    } else if (type === "consistency") {
      // Consistency and streak analytics
      const posts = await db.collection("posts")
        .find({
          userId: new ObjectId(userId),
          completed: true
        })
        .sort({ completedAt: 1 })
        .toArray();

      // Calculate weekly consistency for the period
      const weeklyStats = {};
      posts.forEach(post => {
        const week = getWeekNumber(post.completedAt);
        const year = post.completedAt.getFullYear();
        const key = `${year}-W${week}`;
        
        if (!weeklyStats[key]) {
          weeklyStats[key] = { completed: 0, week, year };
        }
        weeklyStats[key].completed++;
      });

      // Calculate best and current streaks
      let bestStreak = 0;
      let currentStreak = 0;
      const today = new Date();
      
      // Calculate streaks (simplified version)
      const dailyCompletions = {};
      posts.forEach(post => {
        const dateStr = post.completedAt.toISOString().split('T')[0];
        dailyCompletions[dateStr] = (dailyCompletions[dateStr] || 0) + 1;
      });

      const sortedDates = Object.keys(dailyCompletions).sort().reverse();
      let tempStreak = 0;
      let previousDate = null;

      for (const dateStr of sortedDates) {
        const currentDate = new Date(dateStr);
        
        if (!previousDate || 
            (previousDate.getTime() - currentDate.getTime()) === 24 * 60 * 60 * 1000) {
          tempStreak++;
          bestStreak = Math.max(bestStreak, tempStreak);
          
          // Check if this is current streak (continues to today)
          if (!currentStreak && isDateRecent(currentDate, today)) {
            currentStreak = tempStreak;
          }
        } else {
          if (currentStreak === 0) currentStreak = tempStreak;
          tempStreak = 1;
        }
        
        previousDate = currentDate;
      }

      return NextResponse.json({
        period,
        consistency: {
          bestStreak,
          currentStreak,
          weeklyBreakdown: Object.values(weeklyStats).sort((a, b) => 
            (a.year - b.year) || (a.week - b.week)
          ),
          totalActiveDays: Object.keys(dailyCompletions).length,
          averagePostsPerDay: posts.length / Math.max(Object.keys(dailyCompletions).length, 1)
        }
      });

    } else if (type === "engagement") {
      // Engagement analytics
      const posts = await db.collection("posts")
        .find({
          ...baseQuery,
          completed: true,
          "engagement.likes": { $exists: true }
        })
        .toArray();

      if (posts.length === 0) {
        return NextResponse.json({
          period,
          engagement: {
            totalLikes: 0,
            totalRetweets: 0,
            totalReplies: 0,
            totalViews: 0,
            averageEngagement: 0,
            topPosts: [],
            engagementByTheme: []
          }
        });
      }

      const totalEngagement = posts.reduce((acc, post) => ({
        likes: acc.likes + (post.engagement.likes || 0),
        retweets: acc.retweets + (post.engagement.retweets || 0),
        replies: acc.replies + (post.engagement.replies || 0),
        views: acc.views + (post.engagement.views || 0)
      }), { likes: 0, retweets: 0, replies: 0, views: 0 });

      const topPosts = posts
        .map(post => ({
          id: post._id.toString(),
          content: post.content?.substring(0, 100) + "...",
          theme: post.theme.name,
          totalEngagement: (post.engagement.likes || 0) + 
                          (post.engagement.retweets || 0) + 
                          (post.engagement.replies || 0),
          engagement: post.engagement,
          publishedAt: post.publishedAt || post.completedAt
        }))
        .sort((a, b) => b.totalEngagement - a.totalEngagement)
        .slice(0, 10);

      return NextResponse.json({
        period,
        engagement: {
          ...totalEngagement,
          averageEngagement: Math.round(
            (totalEngagement.likes + totalEngagement.retweets + totalEngagement.replies) / posts.length
          ),
          topPosts,
          totalPosts: posts.length
        }
      });
    }

    return NextResponse.json({ error: "Invalid analytics type" }, { status: 400 });

  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    return NextResponse.json({ error: