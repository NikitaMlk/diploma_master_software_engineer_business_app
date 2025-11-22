"use client";

import React from 'react';
import { Twitter, Copy, Edit3, MessageCircle, Heart, Repeat2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const TweetCard = ({ tweet, onCopy, onEdit }) => {
  const getEngagementColor = (engagement) => {
    switch (engagement) {
      case 'viral': return 'text-purple-400 bg-purple-500/20';
      case 'high': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-red-400 bg-red-500/20';
    }
  };

  return (
    <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Twitter className="w-5 h-5 text-black" />
            </div>
            <div>
              <p className="font-semibold text-white">Alex Founder</p>
              <p className="text-sm text-gray-400">@alexbuilds • {tweet.timestamp}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={`${getEngagementColor(tweet.engagement)} border-0`}>
              {tweet.score}% score
            </Badge>
          </div>
        </div>

        <p className="text-white text-[15px] leading-6 mb-4">{tweet.content}</p>

        <div className="flex items-center justify-between text-gray-400 text-sm mb-4">
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{tweet.replies || 0}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Repeat2 className="w-4 h-4" />
              <span>{tweet.retweets || 0}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{tweet.likes || 0}</span>
            </span>
          </div>
          <Badge variant="outline" className="border-gray-700 text-gray-400">
            {tweet.category}
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
            onClick={() => onEdit(tweet.id)}
            className="border-gray-700 text-gray-300 hover:text-white hover:border-gray-600"
          >
            <Edit3 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TweetCard;