"use client";

import { CheckCircle, Layers, Rocket, ShieldCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function SimpleProductOverview() {
  const features = [
    {
      icon: <CheckCircle className="text-primary" size={28} />,
      title: "Intuitive Interface",
      description: "Navigate and manage with ease. No learning curve needed.",
    },
    {
      icon: <Rocket className="text-primary" size={28} />,
      title: "Lightning Speed",
      description: "Optimized performance so you can move at startup pace.",
    },
    {
      icon: <ShieldCheck className="text-primary" size={28} />,
      title: "Enterprise-Grade Security",
      description: "Your data is safe with built-in security and backups.",
    },
    {
      icon: <Layers className="text-primary" size={28} />,
      title: "Built to Scale",
      description: "Whether you're solo or a team of 100 — we grow with you.",
    },
  ];

  return (
    <section className="bg-background text-foreground p-10 text-center max-w-6xl mx-auto transition-colors">
      {/* Title */}
      <h2 className="text-4xl font-extrabold tracking-tight">
        Why Choose <span className="text-primary">WebSeed</span>?
      </h2>

      {/* Subtitle */}
      <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
        Powerful tools to grow your website, boost productivity, and scale effortlessly — all in one place.
      </p>

      <Separator className="my-10 max-w-md mx-auto" />

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map(({ icon, title, description }) => (
          <Card key={title} className="bg-muted/30">
            <CardHeader className="flex flex-row items-start gap-4">
              {icon}
              <div className="text-left">
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription className="text-sm mt-1">
                  {description}
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
