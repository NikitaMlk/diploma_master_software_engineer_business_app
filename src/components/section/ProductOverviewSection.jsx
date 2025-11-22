"use client";

import React from "react";
// Import all necessary Lucide icons, replaced Update with RotateCw
import {
  Award, DollarSign, LayoutDashboard, BookOpen, ShieldCheck, Globe, Code, RotateCw
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function ProductOverviewSection() {
  const features = [
    {
      icon: <Award size={40} />, // Increased icon size to match visual design
      title: "Production-Ready Design",
      description: "A polished, modern UI built with a Shadcn UI aesthetic, ensuring a professional and trustworthy first impression.",
    },
    {
      icon: <DollarSign size={40} />,
      title: "Start Earning Instantly",
      description: "Seamless Stripe + LemonSqueezy payment integrations, ready for you to start earning from day one.",
    },
    {
      icon: <LayoutDashboard size={40} />,
      title: "Admin & User Dashboards",
      description: "Pre-built, fully functional dashboards for managing your SaaS operations and empowering your users.",
    },
    {
      icon: <BookOpen size={40} />,
      title: "Grow Traffic with Content",
      description: "Launch your content strategy immediately with an integrated, SEO-friendly blog.",
    },
    {
      icon: <ShieldCheck size={40} />,
      title: "Robust Authentication",
      description: "Secure and reliable user authentication system, handling sign-up, login, and more out of the box.",
    },
    {
      icon: <Globe size={40} />,
      title: "SEO & Email Tools",
      description: "Essential tools pre-configured to optimize for search engines and manage effective user communications.",
    },
    {
      icon: <Code size={40} />,
      title: "Build on a Solid Base",
      description: "Well-structured, thoroughly commented, and easily extendable code built with modern React practices.",
    },
    {
      // Changed from <Update size={40} /> to <RotateCw size={40} />
      icon: <RotateCw size={40} />,
      title: "Keep Growing Forever",
      description: "Receive all future updates, improvements, and new features to the kit, forever.",
    },
  ];

  return (
    // Section styling to match the sales page, using theme colors
    <section id="features" className="py-16 md:py-24 bg-background text-foreground rounded-t-3xl shadow-inner">
      <div className="container mx-auto px-4">
        {/* Main Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
          WebSeed: Your Premium SaaS Growing Kit
        </h2>
        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground text-center max-w-3xl mx-auto mb-12">
          WebSeed isn’t just a bundle of files — it’s a system built with purpose. Just real traction from day one.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="bg-card p-6 rounded-xl shadow-md flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:shadow-lg duration-300"
            >
              <CardHeader className="flex flex-col items-center text-center p-0 pb-4">
                <div className="text-primary mb-4"> {/* Icon color set to primary (your brand green) */}
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-semibold mb-2 text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
