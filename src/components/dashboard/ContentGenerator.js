"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Target, Users, TrendingUp, Sparkles, Settings, Play, Download, Copy, Edit3, Clock, MapPin, RefreshCw, Check, X, Plus, ChevronRight, BarChart3, MessageCircle, Heart, Share2, BookOpen, Lightbulb, Zap, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

// API utility functions
const api = {
  async getCampaignTemplates() {
    const response = await fetch('/api/campaigns/templates');
    if (!response.ok) throw new Error('Failed to fetch templates');
    return response.json();
  },

  async createCampaign(campaignData) {
    const response = await fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campaignData)
    });
    if (!response.ok) throw new Error('Failed to create campaign');
    return response.json();
  },

  async generatePosts(campaignId) {
    const response = await fetch(`/api/campaigns/${campaignId}/generate`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to generate posts');
    return response.json();
  },

  async getCampaign(campaignId) {
    const response = await fetch(`/api/campaigns/${campaignId}`);
    if (!response.ok) throw new Error('Failed to fetch campaign');
    return response.json();
  },

  async updateCampaign(campaignId, updates) {
    const response = await fetch(`/api/campaigns/${campaignId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update campaign');
    return response.json();
  }
};

// TweetCard component for displaying example posts
const TweetCard = ({ tweet, onCopy, onEdit }) => {
  const getEngagementColor = (score) => {
    if (score >= 90) return 'text-purple-400 bg-purple-500/20';
    if (score >= 80) return 'text-green-400 bg-green-500/20';
    if (score >= 70) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  return (
    <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-black" />
            </div>
            <div>
              <p className="font-semibold text-white">Alex Founder</p>
              <p className="text-sm text-gray-400">@alexbuilds • {tweet.timestamp || '2h'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={`${getEngagementColor(tweet.engagement?.score || tweet.score || 75)} border-0`}>
              {tweet.engagement?.score || tweet.score || 75}% score
            </Badge>
          </div>
        </div>

        <p className="text-white text-[15px] leading-6 mb-4">{tweet.content}</p>

        <div className="flex items-center justify-between text-gray-400 text-sm mb-4">
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{tweet.engagement?.replies || tweet.replies || 0}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Share2 className="w-4 h-4" />
              <span>{tweet.engagement?.retweets || tweet.retweets || 0}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{tweet.engagement?.likes || tweet.likes || 0}</span>
            </span>
          </div>
          <Badge variant="outline" className="border-gray-700 text-gray-400">
            {tweet.theme || tweet.category || 'Update'}
          </Badge>
        </div>

        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={() => onCopy(tweet.content)}
            className="bg-white text-black hover:bg-gray-200 flex-1"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy to Post
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(tweet._id || tweet.id)}
            className="border-gray-700 text-gray-300 hover:text-white hover:border-gray-600"
          >
            <Edit3 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const CampaignGenerator = ({ userId = "default_user" }) => {
  const [currentStep, setCurrentStep] = useState('setup');
  const [campaignConfig, setCampaignConfig] = useState({
    type: '',
    name: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    postsPerDay: 3,
    duration: 30,
    themes: [],
    targetCommunities: [],
    companyName: '',
    industry: '',
    customPrompts: ''
  });
  
  const [generatedCampaign, setGeneratedCampaign] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [copiedText, setCopiedText] = useState('');
  const [error, setError] = useState('');
  const [campaignTypes, setCampaignTypes] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load campaign types and communities on mount
  useEffect(() => {
    loadTemplateData();
  }, []);

  const loadTemplateData = async () => {
    try {
      setLoading(true);
      const data = await api.getCampaignTemplates();
      setCampaignTypes(data.campaignTypes);
      setCommunities(data.communities);
    } catch (err) {
      setError('Failed to load campaign templates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (key, value) => {
    setCampaignConfig(prev => ({ ...prev, [key]: value }));
    setError(''); // Clear errors when user makes changes
  };

  const handleThemeToggle = (theme) => {
    setCampaignConfig(prev => ({
      ...prev,
      themes: prev.themes.includes(theme)
        ? prev.themes.filter(t => t !== theme)
        : [...prev.themes, theme]
    }));
  };

  const generateCampaign = async () => {
    try {
      setIsGenerating(true);
      setError('');

      // Create campaign in database
      const campaignData = {
        userId,
        ...campaignConfig,
        settings: {
          postsPerDay: campaignConfig.postsPerDay,
          duration: campaignConfig.duration,
          startDate: campaignConfig.startDate,
          themes: campaignConfig.themes,
          targetCommunities: campaignConfig.targetCommunities
        }
      };

      const { campaignId, campaign } = await api.createCampaign(campaignData);
      
      // Generate posts for the campaign
      const { posts } = await api.generatePosts(campaignId);
      
      // Get updated campaign with posts
      const { campaign: updatedCampaign } = await api.getCampaign(campaignId);
      
      setGeneratedCampaign(updatedCampaign);
      setCurrentStep('review');
      
    } catch (err) {
      setError(err.message || 'Failed to generate campaign');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyPost = (content) => {
    navigator.clipboard.writeText(content);
    setCopiedText(content);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const handleEditPost = (postId) => {
    const post = generatedCampaign?.posts.find(p => p._id === postId);
    if (post) {
      setSelectedPost(post);
    }
  };

  const startCampaign = async () => {
    try {
      await api.updateCampaign(generatedCampaign._id, { status: 'active' });
      setGeneratedCampaign(prev => ({ ...prev, status: 'active' }));
      // You could redirect to campaign management page here
    } catch (err) {
      setError('Failed to start campaign');
    }
  };

  const exportCampaign = () => {
    const exportData = {
      campaign: generatedCampaign,
      posts: generatedCampaign.posts
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campaign-${generatedCampaign.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Loading Campaign Generator</h3>
          <p className="text-muted-foreground">Setting up your content creation tools...</p>
        </div>
      </div>
    );
  }

  const renderSetupStep = () => (
    <div className="space-y-8">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Campaign Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Choose Campaign Type
          </CardTitle>
          <CardDescription>
            Select the type of campaign that best fits your goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaignTypes.map(type => (
              <Card 
                key={type.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  campaignConfig.type === type.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleConfigChange('type', type.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{type.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold">{type.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {type.themes.slice(0, 2).map(theme => (
                          <Badge key={theme} variant="secondary" className="text-xs">
                            {theme}
                          </Badge>
                        ))}
                        {type.themes.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{type.themes.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Campaign Details */}
      {campaignConfig.type && (
        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Campaign Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Q1 Product Launch Campaign"
                  value={campaignConfig.name}
                  onChange={(e) => handleConfigChange('name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  placeholder="Your startup name"
                  value={campaignConfig.companyName}
                  onChange={(e) => handleConfigChange('companyName', e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select value={campaignConfig.industry} onValueChange={(value) => handleConfigChange('industry', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="saas">SaaS</SelectItem>
                    <SelectItem value="fintech">FinTech</SelectItem>
                    <SelectItem value="healthtech">HealthTech</SelectItem>
                    <SelectItem value="edtech">EdTech</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="marketplace">Marketplace</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={campaignConfig.startDate}
                  onChange={(e) => handleConfigChange('startDate', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Campaign Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe your campaign goals and key messages..."
                value={campaignConfig.description}
                onChange={(e) => handleConfigChange('description', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Campaign Settings */}
      {campaignConfig.type && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Campaign Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Posts per Day: {campaignConfig.postsPerDay}</Label>
              <Slider
                value={[campaignConfig.postsPerDay]}
                onValueChange={(value) => handleConfigChange('postsPerDay', value[0])}
                max={5}
                min={2}
                step={1}
                className="mt-2"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>Consistent</span>
                <span>Aggressive</span>
              </div>
            </div>

            <div>
              <Label>Campaign Duration: {campaignConfig.duration} days</Label>
              <Slider
                value={[campaignConfig.duration]}
                onValueChange={(value) => handleConfigChange('duration', value[0])}
                max={90}
                min={14}
                step={7}
                className="mt-2"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>2 weeks</span>
                <span>3 months</span>
              </div>
            </div>

            <div>
              <Label>Content Themes</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {campaignTypes.find(t => t.id === campaignConfig.type)?.themes.map(theme => (
                  <Badge
                    key={theme}
                    variant={campaignConfig.themes.includes(theme) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleThemeToggle(theme)}
                  >
                    {theme}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="customPrompts">Additional Instructions (Optional)</Label>
              <Textarea
                id="customPrompts"
                placeholder="Any specific topics, tone, or messaging you want to include..."
                value={campaignConfig.customPrompts}
                onChange={(e) => handleConfigChange('customPrompts', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button 
          onClick={generateCampaign}
          disabled={!campaignConfig.type || !campaignConfig.name || isGenerating}
          size="lg"
          className="px-8"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {isGenerating ? 'Generating...' : 'Generate Campaign'}
        </Button>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Campaign Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {generatedCampaign?.name}
              </CardTitle>
              <CardDescription>
                {generatedCampaign?.settings?.postsPerDay} posts per day × {generatedCampaign?.settings?.duration} days
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="px-3 py-1">
                {generatedCampaign?.analytics?.totalPosts || 0} posts
              </Badge>
              <Badge variant={generatedCampaign?.status === 'active' ? 'default' : 'secondary'}>
                {generatedCampaign?.status || 'draft'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{generatedCampaign?.analytics?.totalPosts || 0}</div>
              <div className="text-sm text-muted-foreground">Total Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{generatedCampaign?.analytics?.estimatedReach?.toLocaleString() || '0'}</div>
              <div className="text-sm text-muted-foreground">Est. Reach</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{generatedCampaign?.analytics?.estimatedEngagement?.toLocaleString() || '0'}</div>
              <div className="text-sm text-muted-foreground">Est. Engagement</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Calendar */}
      <Tabs defaultValue="calendar" className="w-full">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="posts">All Posts ({generatedCampaign?.posts?.length || 0})</TabsTrigger>
          <TabsTrigger value="communities">Communities</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 max-h-96 overflow-y-auto">
            {Array.from({ length: Math.min(generatedCampaign?.settings?.duration || 0, 14) }, (_, day) => (
              <Card key={day} className="min-h-[120px]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Day {day + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {generatedCampaign?.posts
                    ?.filter(post => post.day === day + 1)
                    ?.map(post => (
                      <div
                        key={post._id}
                        className="p-2 bg-muted rounded text-xs cursor-pointer hover:bg-muted/80"
                        onClick={() => setSelectedPost(post)}
                      >
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{post.time}</span>
                        </div>
                        <div className="mt-1 font-medium truncate">
                          {post.theme}
                        </div>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {post.engagement?.score || 75}%
                        </Badge>
                      </div>
                    ))}
                </CardContent>
              </Card>
            ))}
          </div>
          {(generatedCampaign?.settings?.duration || 0) > 14 && (
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                Showing first 14 days. Full campaign contains {generatedCampaign?.settings?.duration} days with {generatedCampaign?.analytics?.totalPosts} total posts.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="posts" className="space-y-4">
          <div className="max-h-96 overflow-y-auto space-y-3">
            {generatedCampaign?.posts?.slice(0, 20)?.map(post => (
              <Card key={post._id} className="cursor-pointer hover:shadow-md" onClick={() => setSelectedPost(post)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">Day {post.day}</Badge>
                        <Badge variant="secondary" className="text-xs">{post.time}</Badge>
                        <Badge variant="outline" className="text-xs">{post.theme}</Badge>
                        <Badge variant={post.status === 'draft' ? 'secondary' : 'default'} className="text-xs">
                          {post.status}
                        </Badge>
                      </div>
                      <p className="text-sm">{post.content?.substring(0, 100)}...</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="text-xs text-muted-foreground">
                          Score: {post.engagement?.score || 75}%
                        </div>
                        {post.placeholders?.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {post.placeholders.length} placeholders
                          </Badge>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            )) || (
              <div className="text-center py-8">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">No posts generated yet</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="communities" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {communities.slice(0, 4).map(community => (
              <Card key={community.name}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{community.name}</CardTitle>
                    <Badge variant={community.engagement === 'Very High' ? 'default' : 'secondary'}>
                      {community.engagement}
                    </Badge>
                  </div>
                  <CardDescription>{community.audience}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Best for: </span>
                      <span className="text-sm text-muted-foreground">
                        {community.bestFor.join(', ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Tone: </span>
                      <span className="text-sm text-muted-foreground">{community.tone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep('setup')}>
          <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
          Back to Setup
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCampaign}>
            <Download className="h-4 w-4 mr-2" />
            Export Campaign
          </Button>
          <Button 
            onClick={startCampaign}
            disabled={generatedCampaign?.status === 'active'}
          >
            <Play className="h-4 w-4 mr-2" />
            {generatedCampaign?.status === 'active' ? 'Campaign Active' : 'Start Campaign'}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Monthly Campaign Generator</h1>
          <p className="text-muted-foreground">
            Create comprehensive social media campaigns with strategic posting schedules and community recommendations
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <Badge variant={currentStep === 'setup' ? 'default' : 'outline'}>
              1. Setup Campaign
            </Badge>
            <div className="flex-1 h-px bg-border" />
            <Badge variant={currentStep === 'review' ? 'default' : 'outline'}>
              2. Review & Launch
            </Badge>
          </div>
          <Progress 
            value={currentStep === 'setup' ? 50 : 100} 
            className="h-2"
          />
        </div>

        {/* Loading State */}
        {isGenerating && (
          <Card className="mb-8">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Generating Your Campaign</h3>
                <p className="text-muted-foreground">
                  Creating {campaignConfig.postsPerDay * campaignConfig.duration} posts optimized for your audience...
                </p>
                <div className="mt-4">
                  <Progress value={75} className="w-64 mx-auto" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        {!isGenerating && (
          <>
            {currentStep === 'setup' && renderSetupStep()}
            {currentStep === 'review' && renderReviewStep()}
          </>
        )}

        {/* Copy Success Notification */}
        {copiedText && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg z-50">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              <span>Copied to clipboard!</span>
            </div>
          </div>
        )}

        {/* Post Detail Modal */}
        {selectedPost && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Day {selectedPost.day} - {selectedPost.time}
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedPost(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>
                  {selectedPost.theme} • Expected {selectedPost.engagement?.score || 75}% engagement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Template Content */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    Post Template
                  </Label>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm font-mono">{selectedPost.content}</p>
                  </div>
                  {selectedPost.placeholders && selectedPost.placeholders.length > 0 && (
                    <div className="mt-3">
                      <Label className="text-sm font-medium">Placeholders to customize:</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedPost.placeholders.map((placeholder, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {placeholder}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Recommended Communities */}
                <div>
                  <Label className="mb-2 block">Recommended Communities</Label>
                  <div className="space-y-2">
                    {selectedPost.communities?.map(communityName => {
                      const community = communities.find(c => c.name === communityName);
                      return community ? (
                        <div key={community.name} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <div className="font-medium">{community.name}</div>
                            <div className="text-sm text-muted-foreground">{community.platform}</div>
                          </div>
                          <Badge variant="outline">{community.engagement}</Badge>
                        </div>
                      ) : (
                        <div key={communityName} className="flex items-center justify-between p-3 border rounded">
                          <div className="font-medium">{communityName}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleCopyPost(selectedPost.content)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Template
                  </Button>
                  <Button className="flex-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Post
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignGenerator;