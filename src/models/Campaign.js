// src/models/Campaign.js
export const CampaignSchema = {
  _id: "ObjectId",
  userId: "ObjectId", // Reference to user
  name: "string",
  description: "string", 
  type: "string", // 'product_launch', 'thought_leadership', etc.
  companyName: "string",
  industry: "string",
  status: "string", // 'draft', 'active', 'completed', 'paused'
  
  // Campaign settings
  settings: {
    postsPerDay: "number",
    duration: "number", // in days
    startDate: "Date",
    endDate: "Date",
    themes: ["string"], // array of themes
    targetCommunities: ["string"],
    customPrompts: "string"
  },
  
  // Generated posts
  posts: [{
    _id: "ObjectId",
    day: "number",
    time: "string", // "08:00"
    theme: "string",
    content: "string",
    templateUsed: "string",
    placeholders: ["string"],
    communities: ["string"],
    status: "string", // 'draft', 'scheduled', 'posted', 'failed'
    scheduledAt: "Date",
    postedAt: "Date",
    engagement: {
      score: "number",
      likes: "number",
      retweets: "number", 
      replies: "number"
    }
  }],
  
  // Campaign analytics
  analytics: {
    totalPosts: "number",
    estimatedReach: "number",
    estimatedEngagement: "number",
    actualReach: "number",
    actualEngagement: "number"
  },
  
  createdAt: "Date",
  updatedAt: "Date"
};