"use client";

import React, { useState, useEffect } from "react";
import { Clock, Rocket, TrendingDown, TrendingUp, Zap, Target, DollarSign, Timer } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ValueSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [animateNumbers, setAnimateNumbers] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setTimeout(() => setAnimateNumbers(true), 500);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const AnimatedNumber = ({ value, suffix = "", className = "" }) => {
    const [currentValue, setCurrentValue] = useState(0);
    
    useEffect(() => {
      if (!animateNumbers) return;
      
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCurrentValue(value);
          clearInterval(timer);
        } else {
          setCurrentValue(Math.floor(current));
        }
      }, duration / steps);
      
      return () => clearInterval(timer);
    }, [animateNumbers, value]);
    
    return <span className={className}>{currentValue}{suffix}</span>;
  };

  return (
    <section 
      id="pricing" 
      className="relative py-20 md:py-32 bg-gradient-to-b from-background via-secondary/20 to-background overflow-hidden"
    >

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Header Section */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium rounded-full border border-primary/20">
            <Zap className="w-4 h-4 mr-2" />
            Value Analysis
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            The Real Value Math
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
            Time is your most limited asset. Every week spent building from scratch is a week you're not 
            <span className="text-primary font-semibold"> validating</span>, 
            <span className="text-primary font-semibold"> earning</span>, or 
            <span className="text-primary font-semibold"> growing</span>.
          </p>
        </div>

        {/* Stats Bar */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Card className="bg-gradient-to-br from-card to-card/50 border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
            <CardContent className="p-6 text-center">
              <Timer className="w-8 h-8 mx-auto mb-3 text-primary" />
              <div className="text-3xl font-bold text-foreground mb-1">
                <AnimatedNumber value={200} suffix="+" />
              </div>
              <p className="text-sm text-muted-foreground">Hours Saved</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-card to-card/50 border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
            <CardContent className="p-6 text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-3 text-primary" />
              <div className="text-3xl font-bold text-foreground mb-1">
                $<AnimatedNumber value={2000} suffix="+" />
              </div>
              <p className="text-sm text-muted-foreground">Opportunity Cost</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-card to-card/50 border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 mx-auto mb-3 text-primary" />
              <div className="text-3xl font-bold text-foreground mb-1">
                <AnimatedNumber value={95} suffix="%" />
              </div>
              <p className="text-sm text-muted-foreground">Faster Launch</p>
            </CardContent>
          </Card>
        </div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* The DIY Drain Card */}
          <Card className={`group relative overflow-hidden bg-gradient-to-br from-destructive/5 to-destructive/10 border-2 border-destructive/20 hover:border-destructive/40 transition-all duration-500 hover:shadow-xl hover:shadow-destructive/20 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          } transition-all duration-1000 delay-500`}>
            <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <CardHeader className="relative z-10 pb-6">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="destructive" className="animate-pulse">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  High Risk
                </Badge>
                <Clock className="text-destructive animate-spin" size={32} />
              </div>
              <CardTitle className="text-3xl font-bold text-foreground flex items-center">
                The DIY Drain
              </CardTitle>
            </CardHeader>
            
            <CardContent className="relative z-10 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 animate-pulse"></div>
                  <div>
                    <p className="font-semibold text-foreground">Time Drain</p>
                    <p className="text-muted-foreground">
                      <AnimatedNumber value={200} suffix="+ hours" className="font-bold text-destructive" /> building dashboards, auth, blogs, SEO, payments — infrastructure your users never see.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 animate-pulse delay-200"></div>
                  <div>
                    <p className="font-semibold text-foreground">Lost Opportunity</p>
                    <p className="text-muted-foreground">
                      Minimum <span className="font-bold text-destructive">${<AnimatedNumber value={2000} />}+</span> in lost earning potential and critical market momentum.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 animate-pulse delay-400"></div>
                  <div>
                    <p className="font-semibold text-foreground">The Real Cost</p>
                    <p className="text-destructive font-bold text-lg">
                      Risk of burnout and never launching at all.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-destructive/20">
                <Button variant="outline" className="w-full bg-destructive border-destructive/40 text-primary hover:bg-destructive/10" disabled>
                  The Hard Way →
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* The WebSeed Catalyst Card */}
          <Card className={`group relative overflow-hidden bg-gradient-to-br from-accent/5 to-accent/10 border-2 border-accent/20 hover:border-accent/40 transition-all duration-500 hover:shadow-xl hover:shadow-accent/20 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          } transition-all duration-1000 delay-700`}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity duration-300"></div>
            
            <CardHeader className="relative z-10 pb-6">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="accent" className="bg-accent animate-pulse">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Smart Choice
                </Badge>
                <Rocket className="text-accent animate-bounce" size={32} />
              </div>
              <CardTitle className="text-3xl font-bold text-foreground flex items-center">
                The WebSeed Catalyst
              </CardTitle>
            </CardHeader>
            
            <CardContent className="relative z-10 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 animate-pulse"></div>
                  <div>
                    <p className="font-semibold text-foreground">Instant Delivery</p>
                    <p className="text-muted-foreground">
                      Complete, production-ready system with everything you need to launch today.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 animate-pulse delay-200"></div>
                  <div>
                    <p className="font-semibold text-foreground">Smart Investment</p>
                    <p className="text-muted-foreground">
                      One-time payment of <span className="font-bold text-accent text-xl">$499</span>. 
                      Earn just $1,000 earlier and you've <span className="font-bold text-accent">2x'd your ROI</span>.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 animate-pulse delay-400"></div>
                  <div>
                    <p className="font-semibold text-foreground">The Outcome</p>
                    <p className="text-accent font-bold text-lg">
                      Launch faster. Validate sooner. Win the market.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-accent/20">
                <Button className="w-full bg-accent hover:bg-accent/90 text-primary font-semibold py-3 transform hover:scale-105 transition-transform duration-200">
                  Get WebSeed Now →
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <p className="text-lg text-muted-foreground mb-6">
            The faster you launch, the faster you win. Every day counts.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-transform duration-200">
              Start Building Today
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
              See Live Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}