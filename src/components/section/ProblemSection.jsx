"use client";

import React, { useState, useEffect, useRef } from "react";
import { Clock, Zap, ShieldCheck, Frown, AlertTriangle, Code, Coffee, Brain, CheckCircle2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ProblemSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentProblem, setCurrentProblem] = useState(0);
  const sectionRef = useRef(null);

  const problems = [
    {
      icon: Clock,
      title: "Wasted Months",
      description: "Wiring auth, payments, and dashboards from scratch instead of building your product.",
      color: "text-amber-500",
      bgColor: "from-amber-500/10 to-amber-600/5",
      borderColor: "border-amber-500/20",
      hoverBorder: "hover:border-amber-500/40",
      stat: "200+ hours",
      details: "Average time spent on boilerplate"
    },
    {
      icon: Zap,
      title: "Developer Burnout",
      description: "Swapping between 12 tabs of tutorials, docs, and errors at 2AM.",
      color: "text-rose-500",
      bgColor: "from-rose-500/10 to-rose-600/5",
      borderColor: "border-rose-500/20",
      hoverBorder: "hover:border-rose-500/40",
      stat: "73%",
      details: "Of developers experience burnout"
    },
    {
      icon: ShieldCheck,
      title: "Security Anxiety",
      description: "Unsure if your login, auth, or payment flow is even secure or working.",
      color: "text-orange-500",
      bgColor: "from-orange-500/10 to-orange-600/5",
      borderColor: "border-orange-500/20",
      hoverBorder: "hover:border-orange-500/40",
      stat: "47%",
      details: "Of startups fail due to tech debt"
    },
    {
      icon: Frown,
      title: "Launch Paralysis",
      description: "\"What if I never launch? What if no one cares?\"",
      color: "text-gray-500",
      bgColor: "from-gray-500/10 to-gray-600/5",
      borderColor: "border-gray-500/20",
      hoverBorder: "hover:border-gray-500/40",
      stat: "90%",
      details: "Of side projects never see users"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Cycle through problems for emphasis
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setCurrentProblem((prev) => (prev + 1) % problems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isVisible, problems.length]);

  return (
    <section 
      ref={sectionRef}
      id="problem" 
      className="relative py-20 md:py-32 bg-gradient-to-b from-background via-muted/30 to-background overflow-hidden"
    >

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Badge variant="destructive" className="mb-6 px-4 py-2 text-sm font-medium animate-pulse border border-primary/20 rounded-full">
            <AlertTriangle className="w-4 h-4 mr-2" />
            The Hidden Startup Killer
          </Badge>
          
          <h2 className="text-4xl text-foreground md:text-6xl font-bold mb-6">
            Why Most SaaS Ideas Never Launch
          </h2>
          
          <p className="text-xl md:text-2xl max-w-4xl mx-auto text-muted-foreground leading-relaxed">
            You had a <span className="text-primary font-semibold">great idea</span>. 
            But instead of shipping, you're stuck in the weeds — solving problems that 
            <span className="text-destructive font-semibold"> shouldn't be your job</span> in 2025.
          </p>
        </div>

        {/* Pain Points Stats */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {problems.map((problem, index) => (
            <Card 
              key={index}
              className={`bg-gradient-to-br ${problem.bgColor} border-2 ${problem.borderColor} ${problem.hoverBorder} transition-all duration-500 hover:shadow-lg ${
                currentProblem === index ? 'scale-105 shadow-lg' : ''
              }`}
            >
              <CardContent className="p-4 text-center">
                <problem.icon className={`w-6 h-6 mx-auto mb-2 ${problem.color}`} />
                <div className={`text-2xl font-bold ${problem.color} mb-1`}>
                  {problem.stat}
                </div>
                <p className="text-xs text-muted-foreground leading-tight">
                  {problem.details}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Problem Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <Card 
                key={index}
                className={`group relative overflow-hidden bg-gradient-to-br ${problem.bgColor} border-2 ${problem.borderColor} ${problem.hoverBorder} transition-all duration-700 hover:shadow-xl ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                } ${currentProblem === index ? 'ring-2 ring-destructive/20 shadow-lg' : ''}`}
                style={{
                  transitionDelay: `${400 + index * 150}ms`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <CardContent className="relative z-10 p-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${problem.bgColor} border ${problem.borderColor}`}>
                      <Icon className={`${problem.color} transition-transform duration-300 group-hover:scale-110`} size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-foreground mb-2 group-hover:text-destructive transition-colors duration-300">
                        {problem.title}
                      </h4>
                      <Badge variant="outline" className={`${problem.color} border-current`}>
                        {problem.stat}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed text-lg group-hover:text-foreground transition-colors duration-300">
                    {problem.description}
                  </p>
                  
                  {/* Animated progress bar for current problem */}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Developer Journey Visualization */}
        <div className={`mb-16 transition-all duration-1000 delay-800 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Card className="bg-gradient-to-r from-muted/50 to-muted/20 border-2 border-muted hover:border-destructive/30 transition-all duration-500">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-center mb-8 text-foreground">
                The Typical Developer Journey
              </h3>
              
              <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 md:space-x-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <Brain className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <span className="font-semibold">Great Idea</span>
                  <span className="text-sm text-muted-foreground">Day 1</span>
                </div>
                
                <ArrowRight className="text-muted-foreground rotate-90 md:rotate-0" />
                
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-semibold">Start Building</span>
                  <span className="text-sm text-muted-foreground">Week 1</span>
                </div>
                
                <ArrowRight className="text-muted-foreground rotate-90 md:rotate-0" />
                
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center animate-spin">
                    <Coffee className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-semibold">Get Stuck</span>
                  <span className="text-sm text-muted-foreground">Month 2-4</span>
                </div>
                
                <ArrowRight className="text-muted-foreground rotate-90 md:rotate-0" />
                
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 bg-destructive rounded-full flex items-center justify-center">
                    <Frown className="w-6 h-6 text-destructive-foreground" />
                  </div>
                  <span className="font-semibold">Give Up</span>
                  <span className="text-sm text-muted-foreground">Month 6</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Powerful Quote */}
        <div className={`text-center mb-16 transition-all duration-1000 delay-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary/20 hover:border-primary/40 transition-all duration-500">
            <CardContent className="p-8">
              <blockquote className="text-2xl md:text-3xl font-bold text-primary leading-relaxed">
                "You're not failing — you're just stuck solving the{" "}
                <span className="text-destructive underline decoration-wavy">wrong problems</span>."
              </blockquote>
            </CardContent>
          </Card>
        </div>

        {/* Solution Teaser */}
        <div className={`text-center transition-all duration-1000 delay-1200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8 text-primary mr-3" />
              <h3 className="text-2xl font-bold text-foreground">There's a Better Way</h3>
            </div>
            
            <p className="text-xl leading-relaxed text-muted-foreground mb-8">
              WebSeed isn't just a template. It's a <span className="text-primary font-semibold">launch system</span> — 
              built by someone who's been there. It cuts through the chaos and gets you live.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-transform duration-200">
                Skip the Pain, Start Building
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                See How It Works
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}