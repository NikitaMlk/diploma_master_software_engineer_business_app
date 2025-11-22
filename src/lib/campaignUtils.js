// src/lib/campaignUtils.js
export const campaignUtils = {
  // Calculate campaign progress
  getCampaignProgress: (campaign) => {
    if (!campaign.posts || campaign.posts.length === 0) return 0;
    
    const completedPosts = campaign.posts.filter(post => 
      post.status === 'posted'
    ).length;
    
    return Math.round((completedPosts / campaign.posts.length) * 100);
  },

  // Get campaign status color
  getStatusColor: (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  },

  // Format campaign duration
  formatDuration: (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    if (days < 7) return `${days} days`;
    if (days < 30) return `${Math.ceil(days / 7)} weeks`;
    return `${Math.ceil(days / 30)} months`;
  },

  // Get next scheduled post
  getNextScheduledPost: (campaign) => {
    if (!campaign.posts) return null;
    
    const now = new Date();
    const scheduledPosts = campaign.posts
      .filter(post => post.status === 'scheduled' && new Date(post.scheduledAt) > now)
      .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
    
    return scheduledPosts[0] || null;
  },

  // Calculate engagement metrics
  calculateEngagementMetrics: (campaign) => {
    if (!campaign.posts) return { avgScore: 0, totalEngagement: 0 };
    
    const postedPosts = campaign.posts.filter(post => post.status === 'posted');
    if (postedPosts.length === 0) return { avgScore: 0, totalEngagement: 0 };
    
    const totalScore = postedPosts.reduce((sum, post) => 
      sum + (post.engagement?.score || 0), 0
    );
    
    const totalEngagement = postedPosts.reduce((sum, post) => 
      sum + (post.engagement?.likes || 0) + 
      (post.engagement?.retweets || 0) + 
      (post.engagement?.replies || 0), 0
    );
    
    return {
      avgScore: Math.round(totalScore / postedPosts.length),
      totalEngagement
    };
  },

  // Generate campaign summary
  generateSummary: (campaign) => {
    const progress = campaignUtils.getCampaignProgress(campaign);
    const metrics = campaignUtils.calculateEngagementMetrics(campaign);
    const nextPost = campaignUtils.getNextScheduledPost(campaign);
    
    return {
      progress,
      ...metrics,
      nextPost,
      totalPosts: campaign.posts?.length || 0,
      completedPosts: campaign.posts?.filter(p => p.status === 'posted').length || 0,
      scheduledPosts: campaign.posts?.filter(p => p.status === 'scheduled').length || 0
    };
  }
};