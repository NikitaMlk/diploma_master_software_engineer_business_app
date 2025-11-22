"use client";

import React, { useState } from 'react';
import { Zap, ShoppingCart, Globe, Rocket, ArrowRight, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const DetailedProductSection = () => {
  const [hoveredKit, setHoveredKit] = useState(null);

  const websiteKits = [
    {
      icon: <Rocket className="w-5 h-5" />,
      title: "Landing Pages",
      description: "High-converting pages that capture leads and drive conversions",
      tech: "Next.js + Resend"
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Blog Platform", 
      description: "SEO-optimized content management for thought leadership",
      tech: "Next.js + MongoDB"
    },
    {
      icon: <ShoppingCart className="w-5 h-5" />,
      title: "E-commerce Store",
      description: "Complete online store with payments and inventory management",
      tech: "Stripe + MongoDB"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "SaaS Platform",
      description: "Subscription billing and user management for service businesses",
      tech: "Stripe + Auth"
    }
  ];

  const stats = [
    {
      icon: <Clock className="w-4 h-4" />,
      value: "3 Days",
      label: "To Launch"
    },
    {
      icon: <DollarSign className="w-4 h-4" />,
      value: "90%",
      label: "Faster Revenue"
    },
    {
      icon: <Zap className="w-4 h-4" />,
      value: "4 Kits",
      label: "Complete Solutions"
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <Badge className="bg-primary/10 text-primary border border-primary/20 text-sm px-6 py-2 rounded-full hover:bg-primary/20 transition-colors duration-300 group cursor-pointer">
            <Rocket className="w-3 h-3 mr-1" />
            Startup Growth Kit
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6 mt-6">
            Skip setup.
            <br />
            <span className="text-foreground">Start earning.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Four production-ready website solutions to launch your startup and reach revenue faster.
          </p>
        </div>

        {/* Stats */}
        <div className="flex justify-center mb-20">
          <div className="grid grid-cols-3 gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 text-muted-foreground">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Website Kits */}
        <div className="mb-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {websiteKits.map((kit, index) => (
              <Card 
                key={index}
                className={`group cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  hoveredKit === index ? 'shadow-lg ring-1 ring-primary/20' : ''
                }`}
                onMouseEnter={() => setHoveredKit(index)}
                onMouseLeave={() => setHoveredKit(null)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-muted rounded-lg mr-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {kit.icon}
                    </div>
                    <h3 className="font-semibold text-foreground">{kit.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {kit.description}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {kit.tech}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Built with modern technology</h2>
            <p className="text-muted-foreground">Production-ready stack trusted by thousands of startups</p>
          </div>
          <div className="flex justify-center">
            <div className="flex items-center space-x-8 p-6 bg-muted/30 rounded-2xl border">
              {['Next.js', 'MongoDB', 'Stripe', 'Resend'].map((tech, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-foreground font-medium">{tech}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" className="group h-12 px-8">
            Launch Your Startup
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Button>
          <p className="text-muted-foreground text-sm mt-4">Ready to deploy in minutes</p>
        </div>
      </div>
    </section>
  );
};

export default DetailedProductSection;