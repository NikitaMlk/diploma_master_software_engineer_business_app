"use client";

import React from 'react';
import { Brain, TrendingUp, Clock, Target, Plus, Zap, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data for voice analysis
const mockVoiceAnalysis = {
  confidence: 94,
  tone: 'Professional yet conversational, with technical insights and entrepreneurial energy'
};

const Dashboard = () => {
  const stats = [
    { label: 'Tweets Generated', value: '127', change: '+23%', icon: Brain, color: 'text-blue-400' },
    { label: 'Avg Engagement Score', value: '89%', change: '+12%', icon: TrendingUp, color: 'text-green-400' },
    { label: 'Time Saved', value: '34h', change: 'This month', icon: Clock, color: 'text-purple-400' },
    { label: 'Voice Confidence', value: '94%', change: 'Excellent', icon: Target, color: 'text-yellow-400' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome back, Alex</h1>
          <p className="text-gray-400 mt-1">Your AI assistant generated 12 new tweets today</p>
        </div>
        <div className="flex space-x-3">
          <Button className="bg-white text-black hover:bg-gray-200">
            <Plus className="w-4 h-4 mr-2" />
            Generate Content
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 ${stat.color}`}>{stat.change}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              Voice Training Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Confidence Level</span>
                <span className="text-white font-semibold">{mockVoiceAnalysis.confidence}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-500"
                  style={{ width: `${mockVoiceAnalysis.confidence}%` }}
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Detected Tone:</p>
                <p className="text-white text-sm">{mockVoiceAnalysis.tone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Quick Generate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full bg-white text-black hover:bg-gray-200">
                Generate Insight Tweet
              </Button>
              <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:text-white">
                Create Thread Starter
              </Button>
              <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:text-white">
                Industry Commentary
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Upcoming Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div>
                  <p className="text-white text-sm font-medium">Product insight</p>
                  <p className="text-gray-400 text-xs">Tomorrow 9:00 AM</p>
                </div>
                <CheckCircle className="w-4 h-4 text-green-400" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div>
                  <p className="text-white text-sm font-medium">Industry take</p>
                  <p className="text-gray-400 text-xs">Tomorrow 2:00 PM</p>
                </div>
                <Clock className="w-4 h-4 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;