"use client";

import { useState, useMemo } from "react";
import { Star, Quote } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const testimonialsData = [
  {
    id: 1,
    name: "Alexandra Chen",
    role: "Head of Engineering",
    company: "TechFlow Inc.",
    message: "This platform revolutionized our development workflow. The intuitive interface and powerful features have increased our team's productivity by 40%. It's not just a tool—it's a game changer.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    rating: 5,
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "Product Manager",
    company: "InnovateLabs",
    message: "Seamless integration, exceptional support, and results that speak for themselves. Our user engagement has tripled since implementation. Couldn't be happier with our choice.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 5,
  },
  {
    id: 3,
    name: "Sarah Kim",
    role: "Startup Founder",
    company: "NextGen Solutions",
    message: "As a startup, we needed something reliable yet cost-effective. This solution exceeded our expectations and scaled beautifully with our growth. Absolutely essential for any growing business.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 5,
  },
];

const StarRating = ({ rating, size = 16, className = "" }) => {
  const stars = useMemo(() => {
    return Array.from({ length: 5 }, (_, index) => {
      const starIndex = index + 1;
      const isFilled = starIndex <= rating;
      
      return (
        <Star
          key={starIndex}
          size={size}
      className={`${
            isFilled 
              ? "text-primary fill-primary" 
              : "text-muted-foreground/40"
          } transition-colors duration-200 ${className}`}
          aria-hidden="true"
        />
      );
    });
  }, [rating, size, className]);

  return (
    <div 
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {stars}
      <span className="sr-only">{rating} out of 5 stars</span>
    </div>
  );
};

const TestimonialCard = ({ testimonial, index }) => {
  const { name, role, company, message, avatar, rating } = testimonial;
  
  return (
    <Card 
      className="
        group relative overflow-hidden transition-all duration-300 ease-out
        hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02]
        bg-card/80 backdrop-blur-sm border border-border shadow-lg
      "
      style={{
        animationDelay: `${index * 150}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="text-center pb-4">
        <div className="relative inline-block">
          <Avatar className="w-16 h-16 mx-auto border-4 border-card shadow-lg">
            <AvatarImage 
              src={avatar} 
              alt={`${name}'s profile picture`}
              className="object-cover"
            />
            <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold text-lg">
              {name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <Quote size={12} className="text-primary-foreground" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="text-center px-6 pb-6">
        <blockquote className="text-card-foreground/90 leading-relaxed mb-6 text-sm font-medium italic">
          "{message}"
        </blockquote>
        
        <div className="space-y-3">
          <div>
            <h3 className="font-bold text-card-foreground text-lg">
              {name}
            </h3>
            <p className="text-sm text-card-foreground/80">
              {role}
            </p>
            <p className="text-xs text-muted-foreground font-medium">
              {company}
            </p>
          </div>
          
          <div className="flex justify-center">
            <StarRating rating={rating} size={18} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function TestimonialsSection() {
  const [testimonials] = useState(testimonialsData);
  
  const averageRating = useMemo(() => {
    const total = testimonials.reduce((sum, t) => sum + t.rating, 0);
    return (total / testimonials.length).toFixed(1);
  }, [testimonials]);

  return (
    <>
      <style jsx>{`
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
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .float-animation {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
      
      <section className="relative py-20 px-6 max-w-7xl mx-auto overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-background -z-10" />
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10 float-animation" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary/10 rounded-full blur-3xl -z-10 float-animation" style={{ animationDelay: '2s' }} />
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-card/60 backdrop-blur-sm border border-border px-4 py-2 rounded-full mb-6">
            <StarRating rating={5} size={14} />
            <span className="text-sm font-semibold text-card-foreground">
              {averageRating} average rating
            </span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Loved by Thousands
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join the community of successful businesses who've transformed their operations with our platform
          </p>
        </div>

        <Separator className="mb-16 bg-border" />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={testimonial.id} 
              testimonial={testimonial} 
              index={index}
            />
          ))}
        </div>
        
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-card/80 backdrop-blur-sm rounded-full shadow-lg border border-border">
            <div className="flex -space-x-2">
              {testimonials.slice(0, 3).map((testimonial, index) => (
                <Avatar key={testimonial.id} className="w-8 h-8 border-2 border-card">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span className="text-sm font-medium text-card-foreground">
              Join 10,000+ happy customers
            </span>
          </div>
        </div>
      </section>
    </>
  );
}