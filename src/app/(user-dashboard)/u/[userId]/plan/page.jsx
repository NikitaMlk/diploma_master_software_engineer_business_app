"use client";
import React, { useState } from 'react';
import { Check, Plus, Calendar, Target, Clock, ArrowRight, Sparkles, Users, Code, Bug, BookOpen, TrendingUp, Coffee, Lightbulb, Wrench, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ContentPlannerSetup = () => {
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [postsPerDay, setPostsPerDay] = useState(2);
  const [planningDays, setPlanningDays] = useState(30);
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [createdPlanId, setCreatedPlanId] = useState(null);
  
  // Available themes with icons and descriptions
  const availableThemes = [
    { 
      id: 1, 
      name: "Dev Tips", 
      description: "Quick coding tips and best practices",
      icon: Lightbulb,
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      selectedColor: "bg-blue-500 text-white border-blue-500"
    },
    { 
      id: 2, 
      name: "Tool Reviews", 
      description: "Reviews of development tools and software",
      icon: Wrench,
      color: "bg-green-50 border-green-200 hover:bg-green-100",
      selectedColor: "bg-green-500 text-white border-green-500"
    },
    { 
      id: 3, 
      name: "Bug Stories", 
      description: "Debugging adventures and lessons learned",
      icon: Bug,
      color: "bg-red-50 border-red-200 hover:bg-red-100",
      selectedColor: "bg-red-500 text-white border-red-500"
    },
    { 
      id: 4, 
      name: "Learning Journey", 
      description: "Your progress learning new technologies",
      icon: BookOpen,
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
      selectedColor: "bg-purple-500 text-white border-purple-500"
    },
    { 
      id: 5, 
      name: "Industry News", 
      description: "Commentary on tech news and trends",
      icon: TrendingUp,
      color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
      selectedColor: "bg-orange-500 text-white border-orange-500"
    },
    { 
      id: 6, 
      name: "Code Snippets", 
      description: "Useful code examples and explanations",
      icon: Code,
      color: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
      selectedColor: "bg-indigo-500 text-white border-indigo-500"
    },
    { 
      id: 7, 
      name: "Career Advice", 
      description: "Professional development and career tips",
      icon: Users,
      color: "bg-teal-50 border-teal-200 hover:bg-teal-100",
      selectedColor: "bg-teal-500 text-white border-teal-500"
    },
    { 
      id: 8, 
      name: "Personal Updates", 
      description: "Share your daily work and projects",
      icon: Coffee,
      color: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
      selectedColor: "bg-yellow-500 text-white border-yellow-500"
    },
    { 
      id: 9, 
      name: "Ask Community", 
      description: "Questions and discussions with your audience",
      icon: MessageSquare,
      color: "bg-pink-50 border-pink-200 hover:bg-pink-100",
      selectedColor: "bg-pink-500 text-white border-pink-500"
    }
  ];

  const toggleTheme = (themeId) => {
    if (selectedThemes.includes(themeId)) {
      setSelectedThemes(selectedThemes.filter(id => id !== themeId));
    } else {
      setSelectedThemes([...selectedThemes, themeId]);
    }
  };

  const canProceed = selectedThemes.length >= 5 && postsPerDay >= 1 && planningDays >= 7;

const handleCreate = async () => {
    setIsCreating(true);
    try {
      // Get theme names for the selected theme IDs
      const selectedThemeObjects = availableThemes.filter(theme => 
        selectedThemes.includes(theme.id)
      );

      const planData = {
        themes: selectedThemeObjects.map(theme => ({
          id: theme.id,
          name: theme.name,
          description: theme.description,
          icon: theme.icon.name // Store icon name as string
        })),
        postsPerDay,
        planningDays,
        totalPosts: postsPerDay * planningDays,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + planningDays * 24 * 60 * 60 * 1000).toISOString()
      };

      const response = await fetch('/api/content-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(planData),
      });

      if (!response.ok) {
        throw new Error('Failed to create content plan');
      }

      const result = await response.json();
      console.log('Content plan created successfully:', result);
      
      // Store the plan ID for future use
      setCreatedPlanId(result.planId);
      
      // Move to success step
      setCurrentStep(4);
    } catch (error) {
      console.error('Error creating content plan:', error);
      alert('Failed to create content plan. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Setup Your Content Plan</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Let's configure your X content strategy in just a few steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                1
              </div>
              <span className={`text-sm font-medium ${
                currentStep >= 1 ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                Choose Themes
              </span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                2
              </div>
              <span className={`text-sm font-medium ${
                currentStep >= 2 ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                Set Goals
              </span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                3
              </div>
              <span className={`text-sm font-medium ${
                currentStep >= 3 ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                Review
              </span>
            </div>
          </div>
        </div>

        {currentStep === 1 && (
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Choose Your Content Themes
              </CardTitle>
              <CardDescription>
                Select at least 5 themes for your posts. These will help you maintain variety and consistency in your content.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableThemes.map(theme => {
                  const isSelected = selectedThemes.includes(theme.id);
                  const IconComponent = theme.icon;
                  
                  return (
                    <Card 
                      key={theme.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        isSelected ? theme.selectedColor : theme.color
                      }`}
                      onClick={() => toggleTheme(theme.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-white/20' : 'bg-white shadow-sm'
                          }`}>
                            <IconComponent className={`h-5 w-5 ${
                              isSelected ? 'text-white' : 'text-gray-600'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className={`font-semibold text-sm ${
                                isSelected ? 'text-white' : 'text-foreground'
                              }`}>
                                {theme.name}
                              </h3>
                              {isSelected && (
                                <Check className="h-4 w-4 text-white" />
                              )}
                            </div>
                            <p className={`text-xs leading-relaxed ${
                              isSelected ? 'text-white/80' : 'text-muted-foreground'
                            }`}>
                              {theme.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={selectedThemes.length >= 5 ? 'border-green-500 text-green-700 bg-green-50' : ''}>
                    {selectedThemes.length}/5 minimum
                  </Badge>
                  {selectedThemes.length >= 5 && (
                    <span className="text-sm text-green-600 font-medium">✓ Ready to proceed</span>
                  )}
                </div>
                <Button 
                  onClick={() => setCurrentStep(2)}
                  disabled={selectedThemes.length < 5}
                  className="bg-primary hover:bg-primary/90"
                >
                  Next Step
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Target className="h-5 w-5" />
                Set Your Posting Goals
              </CardTitle>
              <CardDescription>
                Configure how often you want to post and for how long you want to plan ahead.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Posts per day */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-4">
                    Posts per day
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map(num => (
                      <Button
                        key={num}
                        variant={postsPerDay === num ? "default" : "outline"}
                        className={`h-12 ${
                          postsPerDay === num 
                            ? 'bg-primary hover:bg-primary/90' 
                            : 'hover:bg-accent hover:text-accent-foreground'
                        }`}
                        onClick={() => setPostsPerDay(num)}
                      >
                        {num}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Recommended: 2-3 posts per day for optimal engagement
                  </p>
                </div>

                {/* Planning duration */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-4">
                    Planning duration
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 7, label: "1 Week", subtitle: "Quick start" },
                      { value: 30, label: "1 Month", subtitle: "Recommended" },
                      { value: 90, label: "3 Months", subtitle: "Long-term planning" }
                    ].map(option => (
                      <Button
                        key={option.value}
                        variant={planningDays === option.value ? "default" : "outline"}
                        className={`w-full h-auto p-4 justify-start ${
                          planningDays === option.value 
                            ? 'bg-primary hover:bg-primary/90' 
                            : 'hover:bg-accent hover:text-accent-foreground'
                        }`}
                        onClick={() => setPlanningDays(option.value)}
                      >
                        <div className="text-left">
                          <div className="font-semibold">{option.label}</div>
                          <div className={`text-xs ${
                            planningDays === option.value ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}>
                            {option.subtitle}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm text-foreground mb-1">
                      Your Content Plan Summary
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      You'll create <strong>{postsPerDay * planningDays} posts</strong> over the next{' '}
                      <strong>{planningDays === 7 ? '1 week' : planningDays === 30 ? '1 month' : '3 months'}</strong>,{' '}
                      posting <strong>{postsPerDay} time{postsPerDay > 1 ? 's' : ''} per day</strong> using{' '}
                      <strong>{selectedThemes.length} different themes</strong>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                >
                  <ArrowRight className="h-4 w-4 mr-1 rotate-180" />
                  Back
                </Button>
                <Button 
                  onClick={() => setCurrentStep(3)}
                  className="bg-primary hover:bg-primary/90"
                >
                  Review Setup
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Check className="h-5 w-5" />
                Review Your Setup
              </CardTitle>
              <CardDescription>
                Everything looks good? Let's create your content planning calendar!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-border bg-muted/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold">Selected Themes</span>
                    </div>
                    <div className="space-y-1">
                      {selectedThemes.map(themeId => {
                        const theme = availableThemes.find(t => t.id === themeId);
                        return (
                          <Badge key={themeId} variant="secondary" className="mr-1 mb-1">
                            {theme.name}
                          </Badge>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border bg-muted/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold">Posting Schedule</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-foreground">{postsPerDay}</p>
                      <p className="text-xs text-muted-foreground">posts per day</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border bg-muted/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold">Planning Duration</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-foreground">
                        {planningDays === 7 ? '1W' : planningDays === 30 ? '1M' : '3M'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {planningDays} days ahead
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Alert className="border-green-200 bg-green-50">
                <Check className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  <strong>Ready to go!</strong> We'll generate your content calendar starting from today, 
                  with {postsPerDay * planningDays} post slots distributed across your selected themes.
                </AlertDescription>
              </Alert>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                >
                  <ArrowRight className="h-4 w-4 mr-1 rotate-180" />
                  Back
                </Button>
                <Button 
                  onClick={handleCreate}
                  className="bg-primary hover:bg-primary/90 text-lg px-8 py-3 h-auto"
                >
                  Create My Content Plan
                  <Sparkles className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 4 && (
          <Card className="border-border shadow-sm text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                🎉 Content Plan Created!
              </h2>
              <p className="text-muted-foreground mb-6">
                Your personalized content calendar is ready. Time to start creating amazing posts!
              </p>
              <Button 
                className="bg-primary hover:bg-primary/90 text-lg px-8 py-3 h-auto"
              >
                Go to Calendar
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ContentPlannerSetup;