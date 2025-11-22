"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  CheckCircle, 
  Rocket, 
  Zap, 
  TrendingUp, 
  Star, 
  Timer, 
  Shield, 
  Code2, 
  Sparkles,
  ArrowRight,
  PlayCircle,
  Users,
  DollarSign,
  Crown,
  Target,
  Gauge
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function SolutionSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const sectionRef = useRef(null);

  const features = [
    {
      icon: Rocket,
      title: "Launch in Days",
      description: "Start with authentication, payments, dashboards, SEO, and email systems already built and optimized.",
      metric: "48hrs",
      details: "Average launch time",
      highlight: "90% faster than custom builds"
    },
    {
      icon: Zap,
      title: "Skip the Complexity",
      description: "No more tutorial hell or duct-taped solutions. Focus on your unique value proposition.",
      metric: "200+",
      details: "Hours saved per project",
      highlight: "Production-ready architecture"
    },
    {
      icon: TrendingUp,
      title: "Scale with Confidence",
      description: "Enterprise-grade infrastructure that grows with your business from day one to millions of users.",
      metric: "∞",
      details: "Unlimited scalability",
      highlight: "Built for enterprise demands"
    },
    {
      icon: Target,
      title: "Real Results Fast",
      description: "Ship features that matter while we handle the infrastructure. Your users see value, not loading screens.",
      metric: "10x",
      details: "Faster MVP delivery",
      highlight: "Focus on what differentiates you"
    }
  ];

  const transformationSteps = [
    { 
      icon: Timer, 
      title: "Time Investment", 
      before: "6+ months of setup",
      after: "Launch in 48 hours",
      metric: "95% time saved"
    },
    { 
      icon: Shield, 
      title: "Security & Compliance", 
      before: "Security vulnerabilities",
      after: "Enterprise-grade protection",
      metric: "Bank-level security"
    },
    { 
      icon: Code2, 
      title: "Development Experience", 
      before: "Tutorial hell confusion",
      after: "Clean, documented codebase",
      metric: "Zero learning curve"
    },
    { 
      icon: Gauge, 
      title: "Performance & Speed", 
      before: "Slow, unoptimized apps",
      after: "Lightning-fast performance",
      metric: "99.9% uptime SLA"
    }
  ];

  const metrics = [
    { icon: DollarSign, value: "$25K+", label: "Average first quarter revenue", color: "text-primary" },
    { icon: Users, value: "1,000+", label: "Successful SaaS launches", color: "text-primary" },
    { icon: Timer, value: "48hrs", label: "From idea to live product", color: "text-accent" }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animate through features
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isVisible, features.length]);

  // Animate transformation steps
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => {
      const stepInterval = setInterval(() => {
        setCompletedSteps((prev) => {
          if (prev >= transformationSteps.length) {
            clearInterval(stepInterval);
            return prev;
          }
          return prev + 1;
        });
      }, 600);
      return () => clearInterval(stepInterval);
    }, 800);
    return () => clearTimeout(timer);
  }, [isVisible, transformationSteps.length]);

  return (
    <section 
      ref={sectionRef}
      id="solution" 
      className="relative py-24 md:py-32 bg-background overflow-hidden"
    >
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Enhanced Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}>
          <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium rounded-full border border-primary/20">
            <Sparkles className="w-4 h-4 mr-2" />
            The WebSeed Advantage
          </Badge>
          
          <h2 className="text-5xl md:text-7xl text-foreground font-bold mb-8 leading-tight">
            Your SaaS Vision<br />
            <span className="text-primary">Launched Right</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
            Stop building the same infrastructure over and over. Start with production-ready foundations 
            and focus on what makes your SaaS{" "}
            <span className="text-primary font-semibold">extraordinary</span>.
          </p>

          {/* Key metrics showcase */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div key={index} className="text-center group">
                  <div className={`${metric.color} mb-2 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 mx-auto mb-2" />
                  </div>
                  <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
                  <div className="text-sm text-muted-foreground max-w-[120px]">{metric.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hero Value Proposition */}
        <div className={`mb-20 transition-all duration-1000 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}>
          <Card className="max-w-6xl mx-auto bg-card border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-xl shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="flex items-center justify-center mb-8">
                <div className="p-4 bg-primary/10 rounded-full mr-4">
                  <Crown className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-foreground">
                  WebSeed isn't just a boilerplate
                </h3>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-primary mb-8">
                It's your express lane to market leadership
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                <div className="p-6 bg-muted/30 rounded-xl border border-border">
                  <div className="text-4xl font-bold text-primary mb-2">48hrs</div>
                  <div className="text-muted-foreground">From code to customers</div>
                </div>
                <div className="p-6 bg-muted/30 rounded-xl border border-border">
                  <div className="text-4xl font-bold text-primary mb-2">$0</div>
                  <div className="text-muted-foreground">Hidden setup costs</div>
                </div>
                <div className="p-6 bg-muted/30 rounded-xl border border-border">
                  <div className="text-4xl font-bold text-primary mb-2">100%</div>
                  <div className="text-muted-foreground">Production ready</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Transformation Visualization */}
        <div className={`mb-20 transition-all duration-1000 delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}>
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4 text-foreground">
              The WebSeed Transformation
            </h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Watch your development process evolve from chaos to clarity
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {transformationSteps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = completedSteps > index;
              
              return (
                <Card 
                  key={index}
                  className={`relative overflow-hidden transition-all duration-700 group cursor-pointer ${
                    isCompleted 
                      ? 'bg-card border-2 border-primary/40 shadow-lg hover:shadow-xl' 
                      : 'bg-muted/20 border border-muted'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`p-3 rounded-xl border transition-all duration-500 ${
                        isCompleted ? 'bg-primary/10 border-primary/20' : 'bg-muted/20 border-muted'
                      }`}>
                        <Icon className={`transition-all duration-500 ${
                          isCompleted ? 'text-primary scale-110' : 'text-muted-foreground'
                        }`} size={24} />
                      </div>
                      {isCompleted && (
                        <div className="flex items-center">
                          <CheckCircle className="text-primary animate-scale-in" size={20} />
                        </div>
                      )}
                    </div>
                    
                    <h4 className="font-bold text-lg text-foreground mb-4">{step.title}</h4>
                    
                    <div className="space-y-3 mb-4">
                      <div className={`text-sm p-3 rounded-lg border transition-all duration-500 ${
                        isCompleted ? 'text-destructive/80 bg-destructive/10 border-destructive/20 line-through' : 'text-muted-foreground bg-muted/20 border-muted'
                      }`}>
                        ❌ {step.before}
                      </div>
                      <div className={`text-sm p-3 rounded-lg border font-medium transition-all duration-500 ${
                        isCompleted ? 'text-primary bg-primary/10 border-primary/20' : 'text-muted-foreground/60 bg-muted/10 border-muted'
                      }`}>
                        ✅ {step.after}
                      </div>
                    </div>

                    {isCompleted && (
                      <div className="text-xs font-semibold text-primary bg-primary/10 px-3 py-2 rounded-full text-center animate-fade-in">
                        {step.metric}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Enhanced Features Grid */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4 text-foreground">
              Built for Modern SaaS Success
            </h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every feature designed to accelerate your path to product-market fit
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = activeFeature === index;
              const isHovered = hoveredCard === `feature-${index}`;
              
              return (
                <Card 
                  key={index}
                  className={`group relative overflow-hidden bg-card border transition-all duration-700 hover:shadow-xl ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                  } ${isActive ? 'ring-2 ring-primary/30 shadow-lg border-primary/30' : 'border-border hover:border-primary/20'}`}
                  style={{ transitionDelay: `${600 + index * 100}ms` }}
                  onMouseEnter={() => setHoveredCard(`feature-${index}`)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <CardHeader className="relative z-10 pb-4">
                    <div className="flex items-start justify-between mb-6">
                      <div className="p-4 bg-muted/30 rounded-xl border border-border group-hover:border-primary/20 transition-all duration-300">
                        <Icon className={`text-primary transition-all duration-300 ${isActive ? 'animate-pulse scale-110' : 'group-hover:scale-110'}`} size={32} />
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-primary mb-1">
                          {feature.metric}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {feature.details}
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-3">
                      {feature.title}
                    </CardTitle>
                    <div className="text-sm font-medium text-accent bg-accent/10 px-3 py-1 rounded-full w-fit">
                      {feature.highlight}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="relative z-10 pt-0">
                    <p className="text-muted-foreground leading-relaxed text-lg group-hover:text-foreground transition-colors duration-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </section>
  );
}