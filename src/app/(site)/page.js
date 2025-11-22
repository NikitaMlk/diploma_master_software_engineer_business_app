"use client"

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Clock, Zap, Brain, CheckCircle, Twitter, Sparkles, Heart, MessageCircle, Repeat2, Share, MoreHorizontal, Verified, TrendingUp, Target, Users, Calendar, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

// Components
const StatCounter = ({ end, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const counterRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted) {
            setHasStarted(true);
            
            setTimeout(() => {
              const increment = end / 50;
              const counter = setInterval(() => {
                setCount(prev => {
                  const next = prev + increment;
                  if (next >= end) {
                    clearInterval(counter);
                    return end;
                  }
                  return next;
                });
              }, 50);
            }, 500);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [end, hasStarted]);

  return (
    <span ref={counterRef}>
      {prefix}{Math.floor(count)}{suffix}
    </span>
  );
};

const TwitterPost = ({ post, isAfter = false }) => (
  <Card className={`bg-black border border-gray-800 hover:border-gray-600 transition-colors duration-300 ${isAfter ? 'shadow-xl' : ''}`}>
    <CardContent className="p-4">
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isAfter ? 'bg-white' : 'bg-gray-700'}`}>
            <Twitter className={`w-6 h-6 ${isAfter ? 'text-black' : 'text-white'}`} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-bold text-white">Alex Founder</span>
            {isAfter && <Verified className="w-4 h-4 text-white" />}
            <span className="text-gray-500">@alexbuilds</span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-500">{post.time}</span>
          </div>
          <p className="text-white text-[15px] leading-5 mb-3">{post.text}</p>
          <div className="flex items-center justify-between max-w-md">
            <div className="flex items-center space-x-2 text-gray-500 hover:text-gray-300 cursor-pointer transition-colors group">
              <div className="rounded-full p-2 group-hover:bg-gray-800 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="text-sm">{post.replies}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500 hover:text-gray-300 cursor-pointer transition-colors group">
              <div className="rounded-full p-2 group-hover:bg-gray-800 transition-colors">
                <Repeat2 className="w-4 h-4" />
              </div>
              <span className="text-sm">{post.retweets}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500 hover:text-gray-300 cursor-pointer transition-colors group">
              <div className="rounded-full p-2 group-hover:bg-gray-800 transition-colors">
                <Heart className="w-4 h-4" />
              </div>
              <span className="text-sm">{post.likes}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500 hover:text-gray-300 cursor-pointer transition-colors group">
              <div className="rounded-full p-2 group-hover:bg-gray-800 transition-colors">
                <Share className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0">
          <MoreHorizontal className="w-5 h-5 text-gray-500 hover:text-gray-300 cursor-pointer" />
        </div>
      </div>
      {post.engagement && (
        <div className="mt-3 flex items-center space-x-2">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            post.engagement === 'viral' ? 'bg-purple-500/20 text-purple-400' :
            post.engagement === 'high' ? 'bg-green-500/20 text-green-400' :
            post.engagement === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {post.engagement} engagement
          </div>
          {post.engagement !== 'low' && <TrendingUp className="w-4 h-4 text-gray-400" />}
        </div>
      )}
    </CardContent>
  </Card>
);

const Header = () => (
  <header className="relative z-10 container mx-auto px-6 py-8">
    <nav className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
          <Brain className="w-5 h-5 text-black" />
        </div>
        <span className="text-2xl font-bold text-white">ContentPilot</span>
      </div>
      <div className="hidden md:flex items-center space-x-8">
        <a href="#features" className="text-gray-300 hover:text-white transition-colors duration-300">
          Features
        </a>
        <a href="#pricing" className="text-gray-300 hover:text-white transition-colors duration-300">
          Pricing
        </a>
        <Button className="bg-white text-black hover:bg-gray-200 transform hover:scale-105 transition-all duration-300 shadow-lg font-semibold">
          Try Free for 7 Days
        </Button>
      </div>
    </nav>
  </header>
);

const TypewriterText = () => {
  const [typewriterText, setTypewriterText] = useState('');
  const typewriterTexts = [
    "Free your head",
    "Save your time",
    "Build products, not posts", 
    "Automate presence",
    "Amplify impact",
    "Think less, ship more"
  ];

  useEffect(() => {
    let currentTextIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    
    const typeEffect = () => {
      const currentText = typewriterTexts[currentTextIndex];
      
      if (!isDeleting && currentCharIndex < currentText.length) {
        setTypewriterText(currentText.slice(0, currentCharIndex + 1));
        currentCharIndex++;
        setTimeout(typeEffect, 100);
      } else if (isDeleting && currentCharIndex > 0) {
        setTypewriterText(currentText.slice(0, currentCharIndex - 1));
        currentCharIndex--;
        setTimeout(typeEffect, 50);
      } else if (!isDeleting && currentCharIndex === currentText.length) {
        setTimeout(() => {
          isDeleting = true;
          typeEffect();
        }, 2000);
      } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentTextIndex = (currentTextIndex + 1) % typewriterTexts.length;
        setTimeout(typeEffect, 500);
      }
    };
    
    typeEffect();
  }, []);

  return (
    <span className="block text-white hero-title">
      {typewriterText}
      <span className="inline-block w-1 h-16 md:h-20 bg-white ml-2 animate-pulse" />
    </span>
  );
};

const HeroSection = () => (
  <section className="relative container mx-auto px-6 py-20 z-10">
    <div className="max-w-6xl mx-auto text-center">
      <div className="mb-8 hero-badge">
        <Badge variant="secondary" className="bg-gray-900/50 text-gray-300 border border-gray-700 hover:border-gray-600 transition-all duration-300 backdrop-blur-sm px-4 py-2">
          <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
          Your Content Manager for $1/Day
        </Badge>
      </div>
      
      <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
        <TypewriterText />
        <span className="block text-4xl md:text-5xl mt-6 text-gray-400 hero-subtitle">
          with content autopilot
        </span>
      </h1>
      
      <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed hero-description">
        Stop burning mental energy on "what should I post today?" Your AI content manager learns your voice, understands your business, and always knows exactly what to say. Just $1/day for endless, authentic content ideas.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center hero-buttons">
        <Button size="lg" className="bg-white text-black hover:bg-gray-200 transform hover:scale-105 transition-all duration-300 shadow-2xl text-lg px-8 py-6 group">
          Start 7-Day Free Trial 
          <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
        <Button variant="outline" size="lg" className="border-gray-600 text-white hover:border-gray-500 hover:text-white hover:bg-gray-900/50 transform hover:scale-105 transition-all duration-300 text-lg px-8 py-6 backdrop-blur-sm">
          See It In Action
        </Button>
      </div>
    </div>
  </section>
);

const ProblemSection = () => {
  const problems = [
    { text: 'You overthink every single post for hours', icon: '🤯', severity: 'critical' },
    { text: 'Generic templates outperform your "creative" content', icon: '😤', severity: 'embarrassing' },
    { text: 'Missing posting days kills your momentum', icon: '📉', severity: 'critical' },
    { text: 'Context switching destroys your flow state', icon: '💔', severity: 'productivity killer' },
    { text: 'Competitor posts 3x daily while you struggle with 3x weekly', icon: '🏃‍♂️', severity: 'falling behind' },
    { text: 'Your best insights die in your head because posting feels like work', icon: '💀', severity: 'tragic' }
  ];

  return (
    <section className="relative py-20 bg-gray-950 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-white">
              While You Overthink, Others Just Ship
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              You don't need to be a poet. 
              <span className="text-white font-semibold"> Consistency beats creativity</span> every single time.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left side: problems */}
            <div>
              <h3 className="text-3xl font-semibold mb-8 text-white">The Brutal Reality</h3>
              <div className="space-y-6">
                {problems.map((item, index) => (
                  <div 
                    key={index} 
                    className="group p-5 rounded-lg bg-gradient-to-r from-red-900/20 to-gray-900/30 backdrop-blur-sm border border-red-800/30 hover:border-red-600/50 transition-all duration-300"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="text-2xl mt-1">{item.icon}</div>
                      <div>
                        <span className="text-gray-200 text-lg font-medium block">{item.text}</span>
                        <span className="text-red-400 text-sm font-medium mt-1 block">
                          {item.severity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-10 p-6 bg-gray-900/60 rounded-xl border border-gray-700 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">
                    <StatCounter end={73} />% of founders
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    waste 2+ hours daily on "content strategy" instead of building their actual product
                  </p>
                </div>
              </div>
            </div>

            {/* Right side: single image */}
            <div className="flex justify-center lg:justify-end">
              <img 
                src="/1.png"
                alt="Startup problems illustration"
                className="rounded-xl shadow-2xl border border-gray-800 max-w-full lg:max-w-md"
              />
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <div className="inline-block p-6 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-xl border border-yellow-700/50 backdrop-blur-sm">
              <p className="text-xl text-yellow-200 font-semibold mb-2">
                The uncomfortable truth:
              </p>
              <p className="text-2xl text-white font-bold">
                Simple, consistent posts beat your "masterpieces" every time
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const SolutionSection = () => {
  const afterPosts = [
    {
      text: "Just shipped a major feature update! The feedback loop with our beta users has been incredible. Here's what we learned about solving the cold start problem in B2B SaaS... 🧵",
      likes: 247,
      retweets: 89,
      replies: 34,
      time: "2h",
      engagement: "high"
    },
    {
      text: "Fascinating insight from our user interviews: 73% of founders waste 2+ hours daily on 'brand maintenance' tasks. We're building to give that time back. What would you do with an extra 14 hours per week?",
      likes: 189,
      retweets: 67,
      replies: 28,
      time: "1d",
      engagement: "high"
    },
    {
      text: "The compound effect of consistent, authentic content is wild. 6 months of consistent posting = 300% follower growth + 12 inbound partnership requests. Focus on building > posting worked.",
      likes: 342,
      retweets: 156,
      replies: 43,
      time: "3d",
      engagement: "viral"
    }
  ];

  const benefits = [
    { text: 'Learns your voice from existing content', icon: '🎯' },
    { text: 'Generates insights, not generic fluff', icon: '💡' },
    { text: 'Maintains authenticity at scale', icon: '✨' },
    { text: 'Optimizes timing for your audience', icon: '🚀' }
  ];

  return (
    <section className="relative py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-white">
              Your Content, Always Ready, Always Perfect
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Same authentic voice. Same insights. Zero mental overhead.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-4">
              {afterPosts.map((post, index) => (
                <TwitterPost key={index} post={post} isAfter={true} />
              ))}
            </div>
            
            <div>
              <h3 className="text-3xl font-semibold mb-6 text-white">How Your Content Manager Works</h3>
              <div className="space-y-6">
                {benefits.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-center space-x-4 p-4 rounded-lg bg-gray-900/40 backdrop-blur-sm border border-gray-700 hover:border-gray-600 transition-colors duration-300"
                  >
                    <div className="text-2xl">{item.icon}</div>
                    <span className="text-gray-200 text-lg font-medium">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-900/40 rounded-xl border border-gray-700">
                  <div className="text-2xl font-bold text-white mb-1">
                    <StatCounter end={340} prefix="+" />%
                  </div>
                  <p className="text-gray-400 text-sm">Engagement increase</p>
                </div>
                <div className="p-4 bg-gray-900/40 rounded-xl border border-gray-700">
                  <div className="text-2xl font-bold text-white mb-1">
                    <StatCounter end={12} /> hrs
                  </div>
                  <p className="text-gray-400 text-sm">Saved per week</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: 'Voice Learning',
      description: 'Analyzes your existing content, emails, and writing to learn your unique voice, tone, and expertise areas.'
    },
    {
      icon: Users,
      title: 'Smart Idea Generation', 
      description: 'Transforms your business insights into engaging content angles. Never runs out of authentic things to say.'
    },
    {
      icon: Target,
      title: 'Audience Intelligence',
      description: 'Understands what your followers care about and tailors content to drive real engagement and conversations.'
    },
    {
      icon: Zap,
      title: 'Instant Variations',
      description: 'Generate multiple versions of any post in seconds. Pick your favorite or blend different approaches.'
    },
    {
      icon: TrendingUp,
      title: 'Context Awareness',
      description: 'Knows your business, product, and industry trends. Creates content that actually serves your business goals.'
    },
    {
      icon: Clock,
      title: 'Always Ready',
      description: 'Your content manager never sleeps. Fresh ideas ready whenever inspiration strikes or deadlines loom.'
    }
  ];

  return (
    <section className="py-20 bg-gray-950">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-white">
              More Than a Tool—Your Content Partner
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Like having a content manager who knows your business inside-out and never has writer's block
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="bg-gray-900/30 border-gray-800 backdrop-blur-sm hover:bg-gray-900/50 transition-all duration-300 hover:border-gray-700"
              >
                <CardContent className="p-8">
                  <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                    <feature.icon className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 text-center leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const CTASection = () => (
  <section className="py-20 bg-gray-950">
    <div className="container mx-auto px-6 text-center">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-6xl font-bold mb-6 text-white">
          Your Product Deserves Your Full Attention
        </h2>
        <p className="text-2xl text-gray-300 mb-12 leading-relaxed">
          Stop sacrificing product development time for social media busywork. Let AI handle your Twitter presence while you build the future.
        </p>
        
        <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm mb-12 shadow-2xl">
          <CardContent className="p-12">
            <div className="grid md:grid-cols-4 gap-8 mb-10">
              <div className="text-center">
                <div className="text-5xl font-bold mb-3 text-white">7 days</div>
                <div className="text-gray-400 text-lg">Free trial</div>
                <div className="text-gray-400 text-sm mt-1">No commitment</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-3 text-white">$36/mo</div>
                <div className="text-gray-400 text-lg">After trial</div>
                <div className="text-gray-400 text-sm mt-1">Cancel anytime</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-3 text-white">2 min</div>
                <div className="text-gray-400 text-lg">Setup time</div>
                <div className="text-gray-400 text-sm mt-1">Then it's hands-off</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-3 text-white">∞</div>
                <div className="text-gray-400 text-lg">Mental freedom</div>
                <div className="text-gray-400 text-sm mt-1">Priceless</div>
              </div>
            </div>
            
            <div className="space-y-6">
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-gray-200 transform hover:scale-105 transition-all duration-300 shadow-2xl text-xl px-12 py-8 group font-semibold"
              >
                Start Your 7-Day Free Trial
                <ArrowRight className="ml-3 w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              
              <p className="text-white font-semibold text-lg">
                Join club of entrepreneurs who've automated their Twitter success
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid md:grid-cols-3 gap-6 text-gray-400 max-w-2xl mx-auto">
          {[
            { text: 'No credit card required' },
            { text: 'Cancel anytime' },
            { text: 'Full access to all features' }
          ].map((item, index) => (
            <div 
              key={index}
              className="flex items-center justify-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
              <span className="text-center">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="border-t border-gray-800 py-16 bg-black">
    <div className="container mx-auto px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <Twitter className="w-5 h-5 text-black" />
              </div>
              <span className="text-2xl font-bold text-white">X Scheduler</span>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              The Twitter automation platform built specifically for entrepreneurs who value their time and mental energy.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Product</h4>
            <ul className="space-y-3">
              {['Features', 'Pricing', 'API', 'Integrations'].map(item => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-3">
              {['Help Center', 'Contact', 'Privacy', 'Terms'].map(item => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            © 2025 X Scheduler. Empowering entrepreneurs to focus on what matters.
          </div>
          <div className="flex items-center space-x-6">
            <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300">
              Made with ❤️ for builders
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

// Main Component
const XSchedulerLanding = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      <Header />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <CTASection />
      <Footer />

      <style jsx>{`
        .hero-badge {
          animation: fadeInUp 1s ease-out 0.2s both;
        }
        
        .hero-title {
          animation: fadeInUp 1s ease-out 0.6s both;
        }
        
        .hero-subtitle {
          animation: fadeInUp 1s ease-out 0.8s both;
        }
        
        .hero-description {
          animation: fadeInUp 1s ease-out 1s both;
        }
        
        .hero-buttons {
          animation: fadeInUp 1s ease-out 1.2s both;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default XSchedulerLanding;