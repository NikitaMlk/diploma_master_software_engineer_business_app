"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Zap, Clock, Code, Rocket, Shield, Compass } from "lucide-react";

export default function AudienceSection() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const audiencePoints = [
    { 
      title: "You're a Serious Maker", 
      description: "You're serious about launching an impactful product and want to hit the ground running.",
      icon: Rocket,
      accent: "orange"
    },
    { 
      title: "You Value Your Time", 
      description: "You understand that time is your most precious asset and want to optimize every moment.",
      icon: Clock,
      accent: "blue"
    },
    { 
      title: "You Demand Quality Code", 
      description: "You appreciate well-structured, solid, and extendable codebases that won't hold you back.",
      icon: Code,
      accent: "purple"
    },
    { 
      title: "You're an Ambitious Dreamer", 
      description: "You refuse to waste another month stuck in setup hell and are ready to build your vision, now.",
      icon: Zap,
      accent: "yellow"
    },
    { 
      title: "You Seek Confidence", 
      description: "You want the confidence that your foundation is robust, secure, and ready for growth.",
      icon: Shield,
      accent: "green"
    },
    { 
      title: "You Desire Freedom", 
      description: "You crave the freedom to focus on your core product, not boilerplate.",
      icon: Compass,
      accent: "indigo"
    },
  ];

  return (
    <section id="audience" className="relative py-16 md:py-24 bg-background overflow-hidden">

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl text-center relative z-10">
        {/* Header with enhanced styling */}
        <div className="mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-6">
            <CheckCircle className="w-4 h-4 text-primary mr-2" />
            <span className="text-primary text-sm font-medium">Perfect Fit Assessment</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-foreground leading-tight">
            Who is <span className="text-primary">WebSeed</span> For?
          </h2>
          
          <div className="w-24 h-1 bg-primary mx-auto mb-8 rounded-full"></div>
          
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-light">
            This isn't for everyone. But if you're ready to <span className="text-primary font-medium">build boldly</span>, 
            <span className="text-secondary-foreground font-medium"> skip the noise</span>, and 
            <span className="text-primary font-medium"> launch a real SaaS</span> — WebSeed is made for you.
          </p>
        </div>

        {/* Enhanced grid with animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audiencePoints.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Card
                key={index}
                className={`group relative bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 transition-all duration-500 hover:scale-105 hover:bg-card/90 hover:border-primary/30 cursor-pointer overflow-hidden ${
                  hoveredIndex === index ? 'shadow-2xl shadow-primary/20' : 'shadow-lg shadow-black/10'
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Primary color overlay on hover */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                
                {/* Animated border glow */}
                <div className={`absolute inset-0 rounded-xl transition-all duration-500 ${
                  hoveredIndex === index 
                    ? 'shadow-[0_0_20px_rgba(var(--primary)/0.3)] ring-1 ring-primary/20' 
                    : ''
                }`}></div>

                <CardHeader className="p-0 pb-4 relative z-10">
                  {/* Icon with theme-aware styling */}
                  <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/40 group-hover:scale-110 transition-all duration-300">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  
                  <CardTitle className="text-xl font-bold mb-2 text-card-foreground group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-0 relative z-10">
                  <p className="text-muted-foreground group-hover:text-card-foreground transition-colors duration-300 leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>

                {/* Subtle shine effect using primary color */}
                <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Call-to-action section */}
        <div className="mt-16 p-8 bg-muted/30 rounded-xl border border-border backdrop-blur-sm">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Ready to Skip the Setup Hell?
          </h3>
          <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
            If these points resonate with you, WebSeed is your launchpad to SaaS success.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <CheckCircle className="w-4 h-4 text-primary mr-2" />
              <span className="text-primary text-sm font-medium">Quality Foundation</span>
            </div>
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Zap className="w-4 h-4 text-secondary-foreground mr-2" />
              <span className="text-secondary-foreground text-sm font-medium">Lightning Fast Setup</span>
            </div>
            <div className="inline-flex items-center px-4 py-2 bg-accent/20 rounded-full border border-accent/30">
              <Rocket className="w-4 h-4 text-accent-foreground mr-2" />
              <span className="text-accent-foreground text-sm font-medium">Launch Ready</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}