"use client";

import React, { useState, useEffect } from "react";
import { Rocket, Leaf, ArrowRight, Zap, Code, Timer, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    "Next.js 14+ Full-Stack Application",
    "Three-Tier Architecture",
    "Production-Ready Codebase",
    "Stripe Integration",
    "LemonSqueezy Integration",
    "Webhook Handlers",
    "Transaction Management",
    "NextAuth Authentication",
    "Multi-Role System",
    "Protected Routes",
    "Resend Integration",
    "SEO-Optimized Pages",
    "Content Creation Tools",
    "i18n Ready Architecture",
    "Shadcn/UI Library",
    "Responsive Design",
    "Landing Page Sections"
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-16 md:py-24 px-6 bg-background text-foreground overflow-hidden">

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Launch Badge */}
        <div className={`mb-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <Badge className="bg-primary/10 text-primary border border-primary/20 text-sm px-6 py-2 rounded-full hover:bg-primary/20 transition-colors duration-300 group cursor-pointer">
            <Zap className="w-4 h-4 mr-2 group-hover:animate-pulse" />
            SaaS Starter Kit v1.0 - Launch Ready
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Badge>
        </div>

        {/* Main Title with Animation */}
        <div className={`mb-8 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            <span className="inline-block bg-accent text-black px-4 py-1">
              Plant
            </span>{" "}
            your Startup today.<br />
            <span className="inline-block bg-accent text-black px-4 py-1">
              Harvest
            </span>{" "}
            your MRR tomorrow.
          </h1>
        </div>

        {/* Dynamic Subtitle */}
        <div className={`mb-8 transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-4">
            Skip the setup struggle. Plant your website and
            watch it grow — <span className="text-primary font-semibold">fast</span>, 
            <span className="text-secondary-foreground font-semibold"> beautiful</span>, 
            <span className="text-primary font-semibold"> scalable</span>.
          </p>
          
          {/* Rotating Features */}
          <div className="flex items-center justify-center gap-2 text-lg">
            <span className="text-muted-foreground">Includes:</span>
            <div className="relative h-8 overflow-hidden">
              <div 
                className="flex flex-col transition-transform duration-500 ease-in-out"
                style={{ transform: `translateY(-${currentFeature * 32}px)` }}
              >
                {features.map((feature, index) => (
                  <div key={index} className="h-8 flex items-center">
                    <CheckCircle className="w-4 h-4 text-primary mr-2" />
                    <span className="text-primary font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feature Pills */}
        <div className={`mb-10 transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
            {[
              { icon: Timer, text: "5min Setup" },
              { icon: Code, text: "Clean Code" },
              { icon: Shield, text: "Production Ready" },
              { icon: Zap, text: "Lightning Fast" }
            ].map((item, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm border border-border rounded-full text-sm hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 cursor-pointer"
              >
                <item.icon className="w-4 h-4 text-primary" />
                <span className="text-card-foreground font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className={`mb-12 transform transition-all duration-1000 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button 
              asChild 
              size="lg" 
              className="group bg-primary hover:bg-primary/90 text-primary-foreground border-0 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-105"
            >
              <a href="#value" className="flex items-center gap-2">
                <Rocket className="w-5 h-5 group-hover:animate-pulse" />
                Start Growing Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="group border-2 border-border hover:border-primary/50 bg-card/50 backdrop-blur-sm text-card-foreground hover:bg-primary/5 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105"
            >
              <a href="#pricing" className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-primary group-hover:animate-bounce" />
                View Pricing
              </a>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>5min to launch</span>
            </div>
            <div className="w-px h-4 bg-border"></div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>No setup fees</span>
            </div>
            <div className="w-px h-4 bg-border"></div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>100% secure</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
}