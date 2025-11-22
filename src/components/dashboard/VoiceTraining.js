"use client";

import React, { useState } from 'react';
import { 
  Target, Upload, Brain, TrendingUp, Clock, 
  CheckCircle, AlertCircle, RefreshCw, Zap,
  FileText, BarChart3, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Mock voice analysis data
const mockAnalysis = {
  confidence: 94,
  tone: 'Professional yet conversational, with technical insights and entrepreneurial energy',
  characteristics: [
    { trait: 'Technical Depth', score: 92, description: 'Strong focus on technical concepts and implementation details' },
    { trait: 'Conversational Tone', score: 88, description: 'Approachable and engaging writing style' },
    { trait: 'Entrepreneurial Spirit', score: 95, description: 'Business-focused perspective with growth mindset' },
    { trait: 'Educational Value', score: 90, description: 'Provides actionable insights and learnings' }
  ],
  samplePhrases: [
    "Just shipped a feature that...",
    "Building in public taught me...", 
    "The biggest lesson I learned...",
    "Here's what I wish I knew..."
  ],
  improvements: [
    'Consider adding more personal anecdotes to increase relatability',
    'Experiment with asking more questions to boost engagement',
    'Try incorporating current industry trends and news'
  ]
};

const VoiceTraining = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [analysis, setAnalysis] = useState(mockAnalysis);
  const [activeTab, setActiveTab] = useState('overview');

  const handleFileUpload = async (files) => {
    setIsAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      const newFiles = Array.from(files).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        status: 'analyzed',
        tweetsCount: Math.floor(Math.random() * 100) + 50
      }));
      
      setUploadedFiles(prev => [...prev, ...newFiles]);
      setIsAnalyzing(false);
    }, 3000);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'characteristics', label: 'Voice Traits', icon: User },
    { id: 'samples', label: 'Sample Phrases', icon: FileText },
    { id: 'improvements', label: 'Suggestions', icon: TrendingUp }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Voice Training</h1>
        <p className="text-gray-400">Analyze and refine your unique writing style</p>
      </div>

      {/* Upload Section */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Upload Your Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-gray-600 transition-colors">
            <Upload className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              {isAnalyzing ? 'Analyzing Your Voice...' : 'Drop your files here'}
            </h3>
            <p className="text-gray-400 mb-4">
              Upload tweets, blog posts, or any text content to analyze your writing style
            </p>
            
            {isAnalyzing ? (
              <div className="flex items-center justify-center space-x-2">
                <RefreshCw className="w-5 h-5 animate-spin text-blue-400" />
                <span className="text-blue-400">Processing your content...</span>
              </div>
            ) : (
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Files
              </Button>
            )}
            
            <input
              id="file-upload"
              type="file"
              multiple
              accept=".txt,.csv,.json"
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-white font-medium">Uploaded Files</h4>
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <div>
                      <span className="text-white text-sm">{file.name}</span>
                      <span className="text-gray-500 text-xs ml-2">({file.tweetsCount} tweets analyzed)</span>
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                    Analyzed
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Confidence Score */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-2">{analysis.confidence}%</div>
            <div className="text-gray-400 text-sm">Voice Confidence</div>
            <div className="w-full bg-gray-800 rounded-full h-2 mt-4">
              <div 
                className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${analysis.confidence}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Analyzed Content</span>
                <span className="text-white font-semibold">{uploadedFiles.reduce((sum, f) => sum + f.tweetsCount, 0)} tweets</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Voice Traits</span>
                <span className="text-white font-semibold">{analysis.characteristics.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Sample Phrases</span>
                <span className="text-white font-semibold">{analysis.samplePhrases.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-6">
            <div className="text-center">
              <Brain className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <div className="text-lg font-bold text-white mb-1">Voice Model</div>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 mb-3">
                Trained & Ready
              </Badge>
              <div className="text-sm text-gray-400">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <div className="flex space-x-1 border-b border-gray-800">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gray-800 text-white border-b-2 border-blue-500'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Detected Voice Tone</h3>
                <p className="text-gray-300 bg-gray-800/50 p-4 rounded-lg italic">
                  "{analysis.tone}"
                </p>
              </div>
            </div>
          )}

          {activeTab === 'characteristics' && (
            <div className="space-y-4">
              {analysis.characteristics.map((trait, index) => (
                <div key={index} className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-white">{trait.trait}</h4>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {trait.score}%
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-sm">{trait.description}</p>
                  <div className="w-full bg-gray-700 rounded-full h-1.5 mt-3">
                    <div 
                      className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${trait.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'samples' && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white mb-4">Common Phrase Patterns</h3>
              {analysis.samplePhrases.map((phrase, index) => (
                <div key={index} className="p-3 bg-gray-800/50 rounded-lg border-l-4 border-purple-500">
                  <span className="text-gray-300 italic">"{phrase}"</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'improvements' && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white mb-4">Suggestions for Enhancement</h3>
              {analysis.improvements.map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-gray-800/50 rounded-lg">
                  <Zap className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <p className="text-gray-300">{suggestion}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceTraining;