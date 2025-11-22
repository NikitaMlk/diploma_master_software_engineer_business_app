"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Circle, Trophy, Zap, Target, Clock, Plus, Edit3, BarChart3, Settings, Star, Flame, Award, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const XContentPlanner = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPostBuilder, setShowPostBuilder] = useState(false);
  const [completedPosts, setCompletedPosts] = useState(new Set());
  const [streak, setStreak] = useState(7);
  const [level, setLevel] = useState(3);
  const [xp, setXp] = useState(1250);
  
  // API-related state
  const [userConfig, setUserConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progressLoading, setProgressLoading] = useState(false);
  
  // Available themes database
  const allThemes = [
    { id: 1, name: "Dev Tips", color: "bg-blue-500", icon: "💡" },
    { id: 2, name: "Tool Reviews", color: "bg-green-500", icon: "🔧" },
    { id: 3, name: "Bug Stories", color: "bg-red-500", icon: "🐛" },
    { id: 4, name: "Learning Journey", color: "bg-purple-500", icon: "📚" },
    { id: 5, name: "Industry News", color: "bg-orange-500", icon: "📈" },
    { id: 6, name: "Code Snippets", color: "bg-indigo-500", icon: "🔗" },
    { id: 7, name: "Career Advice", color: "bg-teal-500", icon: "👥" },
    { id: 8, name: "Personal Updates", color: "bg-yellow-500", icon: "☕" },
    { id: 9, name: "Ask Community", color: "bg-pink-500", icon: "💬" }
  ];

  // Load user's content plan
  useEffect(() => {
    const loadContentPlan = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/content-plans');
        
        if (!response.ok) {
          throw new Error(`Failed to load content plan: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.plans && data.plans.length > 0) {
          // Get the most recent active plan
          const activePlan = data.plans
            .filter(plan => plan.status === 'active')
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
          
          if (activePlan) {
            // Convert the plan data to the format expected by the component
            const config = {
              selectedThemes: activePlan.themes.map(theme => theme.id),
              postsPerDay: activePlan.postsPerDay,
              planningDays: activePlan.planningDays,
              startDate: new Date(activePlan.startDate),
              endDate: new Date(activePlan.endDate),
              planId: activePlan._id,
              rawThemes: activePlan.themes
            };
            
            setUserConfig(config);
            console.log('Loaded content plan:', config);
          } else {
            setError('No active content plan found. Please create a content plan first.');
          }
        } else {
          setError('No content plans found. Please create your first content plan.');
        }
      } catch (err) {
        console.error('Error loading content plan:', err);
        setError(err.message || 'Failed to load content plan');
      } finally {
        setLoading(false);
      }
    };

    loadContentPlan();
  }, []);

  // Load completed posts from API
  useEffect(() => {
    const loadCompletedPosts = async () => {
      if (!userConfig?.planId) return;

      try {
        setProgressLoading(true);
        const response = await fetch(`/api/post-progress?planId=${userConfig.planId}`);
        
        if (response.ok) {
          const data = await response.json();
          const completedSet = new Set(data.completedPosts.map(post => post.postId));
          setCompletedPosts(completedSet);
          
          // Calculate XP based on completed posts
          setXp(1250 + (data.completedPosts.length * 50));
        }
      } catch (err) {
        console.error('Error loading post progress:', err);
      } finally {
        setProgressLoading(false);
      }
    };

    loadCompletedPosts();
  }, [userConfig?.planId]);

  // API function to toggle post completion
  const togglePostCompletion = async (postId, completed, postData = null) => {
    try {
      const response = await fetch('/api/post-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          planId: userConfig?.planId,
          completed,
          postData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update post progress');
      }

      const result = await response.json();
      console.log('Post progress updated:', result);
      
      return true;
    } catch (err) {
      console.error('Error updating post progress:', err);
      return false;
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <div className="text-center">
              <h3 className="text-lg font-semibold">Loading your content plan...</h3>
              <p className="text-sm text-gray-600">Please wait while we fetch your data.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-red-600" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-900">Unable to load content plan</h3>
              <p className="text-sm text-red-600 mb-4">{error}</p>
              <div className="space-y-2">
                <button 
                  onClick={() => window.location.reload()} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Try Again
                </button>
                <button 
                  onClick={() => window.location.href = '/dashboard/planner'}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Content Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If no userConfig is loaded, don't render the main component
  if (!userConfig) {
    return null;
  }

  // Get user's selected themes
  const userThemes = userConfig.rawThemes ? 
    userConfig.rawThemes.map(dbTheme => {
      const matchingTheme = allThemes.find(theme => theme.id === dbTheme.id);
      return {
        id: dbTheme.id,
        name: dbTheme.name,
        color: matchingTheme?.color || "bg-gray-500",
        icon: matchingTheme?.icon || "📝"
      };
    }) :
    allThemes.filter(theme => userConfig.selectedThemes.includes(theme.id));

  // Calculate plan end date
  const planEndDate = new Date(userConfig.endDate);

  // Check if a date is within the planning period
  const isDateInPlan = (date) => {
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const startOnly = new Date(userConfig.startDate.getFullYear(), userConfig.startDate.getMonth(), userConfig.startDate.getDate());
    const endOnly = new Date(planEndDate.getFullYear(), planEndDate.getMonth(), planEndDate.getDate());
    
    return dateOnly >= startOnly && dateOnly <= endOnly;
  };

  // Generate posts for a specific date based on user config
  const getPostsForDate = (date) => {
    if (!isDateInPlan(date) || userThemes.length === 0) {
      return [];
    }

    const daysSinceStart = Math.floor((date - userConfig.startDate) / (1000 * 60 * 60 * 24));
    
    const posts = [];
    for (let i = 0; i < userConfig.postsPerDay; i++) {
      const themeIndex = (daysSinceStart * userConfig.postsPerDay + i) % userThemes.length;
      const theme = userThemes[themeIndex];
      
      if (!theme) {
        console.warn('Theme not found at index:', themeIndex, 'Available themes:', userThemes);
        continue;
      }
      
      const postId = `${date.toDateString()}-${i}`;
      posts.push({
        id: postId,
        theme: theme.name,
        themeColor: theme.color,
        themeIcon: theme.icon,
        completed: completedPosts.has(postId),
        scheduledTime: `${9 + (i * 2)}:00 AM`,
        date: date.toDateString(),
        index: i
      });
    }
    
    return posts;
  };

  // Updated completePost function with API integration
  const completePost = async (date, index) => {
    const postId = `${date.toDateString()}-${index}`;
    const currentlyCompleted = completedPosts.has(postId);
    const newCompleted = !currentlyCompleted;
    
    // Get post data for storage
    const posts = getPostsForDate(date);
    const post = posts[index];
    const postData = post ? {
      theme: post.theme,
      date: date.toDateString(),
      scheduledTime: post.scheduledTime
    } : null;

    // Optimistically update UI
    const newCompletedSet = new Set(completedPosts);
    if (newCompleted) {
      newCompletedSet.add(postId);
      setXp(prev => prev + 50);
    } else {
      newCompletedSet.delete(postId);
      setXp(prev => Math.max(0, prev - 50));
    }
    setCompletedPosts(newCompletedSet);

    // Update via API
    const success = await togglePostCompletion(postId, newCompleted, postData);
    
    if (!success) {
      // Revert optimistic update on failure
      if (newCompleted) {
        newCompletedSet.delete(postId);
        setXp(prev => Math.max(0, prev - 50));
      } else {
        newCompletedSet.add(postId);
        setXp(prev => prev + 50);
      }
      setCompletedPosts(newCompletedSet);
      
      // You might want to show an error toast here
      console.error('Failed to update post progress');
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const nextLevel = Math.ceil(level * 500);
  const progressPercent = (xp % 500) / 5;
  
  // Calculate today's progress
  const today = new Date();
  const todayPosts = getPostsForDate(today);
  const todayCompletedCount = todayPosts.filter(post => post.completed).length;
  
  // Calculate total plan progress
  const totalDaysInPlan = userConfig.planningDays;
  const totalPostsInPlan = totalDaysInPlan * userConfig.postsPerDay;
  const completedPostsCount = Array.from(completedPosts).length;
  const planProgress = Math.round((completedPostsCount / totalPostsInPlan) * 100);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Plan Overview Banner */}
        <div className="mb-6 border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Content Plan Active</h2>
                <p className="text-sm text-gray-600">
                  {userConfig.postsPerDay} posts/day × {userConfig.planningDays} days = {totalPostsInPlan} total posts
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {userConfig.startDate.toLocaleDateString()} - {planEndDate.toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{completedPostsCount}</div>
                  <div className="text-xs text-gray-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{planProgress}%</div>
                  <div className="text-xs text-gray-600">Progress</div>
                </div>
                <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Settings className="h-4 w-4 mr-1 inline" />
                  Adjust Plan
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 pb-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-md">
                        <Flame className="h-3 w-3 mr-1" />
                        {streak} streak
                      </span>
                      <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-md">
                        <Star className="h-3 w-3 mr-1" />
                        Level {level}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => setCurrentDate(new Date())}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Today
                    </button>
                    <button 
                      onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {/* Calendar Header */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-3 text-center text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-2">
                  {getDaysInMonth(currentDate).map((date, index) => {
                    if (!date) {
                      return <div key={index} className="p-2 h-20"></div>;
                    }
                    
                    const posts = getPostsForDate(date);
                    const isToday = date.toDateString() === new Date().toDateString();
                    const isSelected = date.toDateString() === selectedDate.toDateString();
                    const isPastDate = date < new Date().setHours(0,0,0,0);
                    const isInPlan = isDateInPlan(date);
                    const completedCount = posts.filter(p => p.completed).length;
                    const totalCount = posts.length;
                    const isComplete = completedCount === totalCount && totalCount > 0;
                    
                    return (
                      <div 
                        key={date.toDateString()}
                        className={`relative p-3 h-20 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md ${
                          !isInPlan ? 'bg-gray-100 text-gray-400 cursor-default hover:scale-100 hover:shadow-none' :
                          isComplete ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-md' :
                          isToday ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md' : 
                          isSelected ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-md' :
                          isPastDate ? 'bg-gray-200 text-gray-500' :
                          totalCount > 0 ? 'bg-white border-2 border-gray-200 hover:border-purple-300' :
                          'bg-white border border-gray-200 hover:border-gray-400'
                        }`}
                        onClick={() => isInPlan && setSelectedDate(date)}
                      >
                        {/* Day Number */}
                        <div className={`text-lg font-bold ${
                          !isInPlan ? 'text-gray-400' :
                          isComplete || isToday || isSelected ? 'text-current' : 
                          isPastDate ? 'text-gray-500' : 'text-gray-900'
                        }`}>
                          {date.getDate()}
                        </div>
                        
                        {/* Progress Indicator */}
                        {totalCount > 0 && isInPlan && (
                          <div className="absolute bottom-2 left-2 right-2">
                            <div className={`flex gap-1 ${
                              completedCount === totalCount ? 'justify-center' : 'justify-start'
                            }`}>
                              {isComplete ? (
                                <div className="flex items-center gap-1">
                                  <CheckCircle2 className="h-4 w-4 text-white" />
                                  <span className="text-xs font-semibold text-white">
                                    {completedCount}/{totalCount}
                                  </span>
                                </div>
                              ) : (
                                posts.map((post, postIndex) => (
                                  <div 
                                    key={postIndex}
                                    className={`w-2 h-2 rounded-full ${
                                      post.completed ? 'bg-green-400' : 
                                      isToday || isSelected ? 'bg-white/50' : 
                                      isPastDate ? 'bg-gray-400' : 'bg-gray-400'
                                    }`}
                                  />
                                ))
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Plan boundary indicators */}
                        {!isInPlan && date >= userConfig.startDate && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs text-gray-400">Plan ended</span>
                          </div>
                        )}
                        
                        {/* Special Day Indicators */}
                        {isToday && !isComplete && isInPlan && (
                          <div className="absolute -top-1 -right-1">
                            <div className="w-3 h-3 bg-yellow-400 rounded-full border-2 border-white"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* Legend */}
                <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-1 text-xs">
                    <div className="w-3 h-3 bg-green-400 rounded"></div>
                    <span className="text-gray-600">Completed</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-gray-600">Today</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <div className="w-3 h-3 bg-gray-200 rounded"></div>
                    <span className="text-gray-600">Outside plan</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* XP Progress */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 pb-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">Level Progress</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-orange-600">{xp} XP</span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-md border border-orange-200">
                      Level {level}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {500 - (xp % 500)} XP to level {level + 1}
                  </p>
                </div>
              </div>
            </div>

            {/* Selected Day */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 pb-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </h3>
                <p className="text-sm text-gray-600">
                  {formatDate(selectedDate)}
                </p>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {progressLoading ? (
                    <div className="text-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-400 mx-auto" />
                      <p className="text-sm text-gray-500 mt-2">Loading posts...</p>
                    </div>
                  ) : (
                    <>
                      {getPostsForDate(selectedDate).map((post, index) => (
                        <div key={index} className={`p-4 rounded-lg border-2 transition-all ${
                          post.completed ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => completePost(selectedDate, index)}
                                className={`p-0 h-6 w-6 rounded-full transition-colors ${
                                  post.completed ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-green-600'
                                }`}
                              >
                                {post.completed ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                              </button>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-lg">{post.themeIcon}</span>
                                  <p className="font-medium text-sm">{post.theme}</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                  {post.completed ? '✨ Completed!' : `Scheduled for ${post.scheduledTime}`}
                                </p>
                              </div>
                            </div>
                            <button 
                              onClick={() => setShowPostBuilder(true)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      {getPostsForDate(selectedDate).length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">
                            {isDateInPlan(selectedDate) 
                              ? "No posts scheduled" 
                              : "Outside planning period"
                            }
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Today's Progress */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-sm border border-green-200">
              <div className="p-4 pb-3 border-b border-green-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">Today's Goal</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">
                      {todayCompletedCount}/{todayPosts.length || userConfig.postsPerDay}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-md ${
                      todayCompletedCount >= (todayPosts.length || userConfig.postsPerDay) 
                        ? "bg-green-500 text-white" 
                        : "bg-gray-200 text-gray-700"
                    }`}>
                      {todayCompletedCount >= (todayPosts.length || userConfig.postsPerDay) ? "Complete!" : "In Progress"}
                    </span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(todayCompletedCount / (todayPosts.length || userConfig.postsPerDay)) * 100}%` }}
                    ></div>
                  </div>
                  
                  {todayCompletedCount >= (todayPosts.length || userConfig.postsPerDay) && (
                    <div className="border border-green-200 bg-green-50 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <Trophy className="h-4 w-4 text-green-600 mt-0.5" />
                        <p className="text-sm text-green-700">
                          Fantastic! You've hit your daily goal. Keep the momentum! 🚀
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Active Themes */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 pb-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Active Themes</h3>
                <p className="text-sm text-gray-600">
                  {userThemes.length} themes in rotation
                </p>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-2">
                  {userThemes.map(theme => (
                    <span key={theme.id} className="inline-flex items-center px-2 py-1 bg-gray-100 border border-gray-200 text-sm rounded-md">
                      <span className="mr-1">{theme.icon}</span>
                      {theme.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 pb-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Quick Actions</h3>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  <button 
                    onClick={() => setShowPostBuilder(true)}
                    className="w-full flex items-center justify-start gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                    Create Post
                  </button>
                  <button className="w-full flex items-center justify-start gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <BarChart3 className="h-4 w-4" />
                    View Analytics
                  </button>
                  <button className="w-full flex items-center justify-start gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Settings className="h-4 w-4" />
                    Manage Themes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Post Builder Modal */}
        {showPostBuilder && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-auto bg-white rounded-lg shadow-2xl">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                      <Edit3 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Post Builder</h2>
                      <p className="text-sm text-gray-600">Create your content post</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowPostBuilder(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Template Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Choose Template
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="cursor-pointer hover:shadow-md transition-shadow border-2 border-blue-200 bg-blue-50 rounded-lg">
                      <div className="p-4">
                        <p className="font-semibold text-sm mb-1">💡 Quick Tip</p>
                        <p className="text-xs text-gray-600">Share a short development tip</p>
                      </div>
                    </div>
                    <div className="cursor-pointer hover:shadow-md transition-shadow border border-gray-200 rounded-lg">
                      <div className="p-4">
                        <p className="font-semibold text-sm mb-1">🔧 Code Snippet</p>
                        <p className="text-xs text-gray-600">Share code with explanation</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Builder */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Your Post
                  </label>
                  <textarea 
                    className="w-full p-4 border-2 border-gray-300 rounded-lg resize-none focus:border-blue-500 focus:outline-none transition-colors"
                    rows={6}
                    placeholder="💡 Quick tip: Always use semantic HTML elements..."
                    defaultValue="💡 Quick tip: Always use semantic HTML elements...

Here's why it matters:
1. Better accessibility  
2. Improved SEO
3. Cleaner code structure

What's your favorite semantic element? 

#WebDev #HTML #A11y"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>280 characters recommended</span>
                    <span className="font-medium">185/280</span>
                  </div>
                </div>

                {/* Preview */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Preview
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="p-4">
                      <div className="flex gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          Y
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-sm">Your Name</span>
                            <span className="text-gray-500 text-sm">@yourusername · 2m</span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">💡 Quick tip: Always use semantic HTML elements...

Here's why it matters:
1. Better accessibility  
2. Improved SEO
3. Cleaner code structure

What's your favorite semantic element? 

<span className="text-blue-600 font-medium">#WebDev #HTML #A11y</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                  <button 
                    onClick={() => setShowPostBuilder(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Save Draft
                  </button>
                  <button 
                    onClick={() => {
                      setShowPostBuilder(false);
                      completePost(selectedDate, 0);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Schedule Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default XContentPlanner;