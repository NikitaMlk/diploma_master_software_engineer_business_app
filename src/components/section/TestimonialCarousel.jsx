"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "James Carver",
    role: "Solo Founder",
    company: "Bootstraply.io",
    message:
      "I was stuck in analysis paralysis for 3 months — then I found WebSeed. I launched in 7 days and got my first Stripe payment the next week. It honestly saved the project.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
  },
  {
    id: 2,
    name: "Emily Tran",
    role: "AI App Developer",
    company: "InnovateLabs",
    message:
      "WebSeed gave me auth, payments, dashboards, emails — all out of the box. I stopped tweaking boilerplate and started building actual features. That shift was everything.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    rating: 5,
  },
  {
    id: 3,
    name: "Luca Bianchi",
    role: "Growth Hacker",
    company: "SaaS Launchpad",
    message:
      "Time-to-market is everything. WebSeed cut our launch timeline by 80%. And the UI? It's so clean, we used it as-is in production.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 5,
  },
  {
    id: 4,
    name: "Amina Yusuf",
    role: "Indie Hacker",
    company: "NextGen Solutions",
    message:
      "I burned out trying to DIY auth + Stripe + email + admin dashboard. WebSeed felt like flipping a switch. Boom — working SaaS scaffold with everything I needed.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 4,
  },
  {
    id: 5,
    name: "Felix Nakamura",
    role: "Co-founder",
    company: "Datapilot AI",
    message:
      "We used WebSeed to pivot fast. It saved weeks of dev time, and honestly gave us momentum we didn't have before. Feels like cheating, but it's just smart.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
  },
];

const StarRating = ({ rating, size = 20 }) => {
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
          } transition-colors duration-200`}
          aria-hidden="true"
        />
      );
    });
  }, [rating, size]);

  return (
    <div 
      className="flex items-center justify-center gap-1"
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {stars}
      <span className="sr-only">{rating} out of 5 stars</span>
    </div>
  );
};

export default function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % testimonials.length);
        setIsAnimating(false);
      }, 300);
    }, 7000); // Rotate every 7 seconds
    return () => clearInterval(interval);
  }, []);

  const testimonial = testimonials[index];

  return (
    <>
      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes fadeOutScale {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.95) translateY(-20px);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .testimonial-enter {
          animation: fadeInScale 0.6s ease-out forwards;
        }
        
        .testimonial-exit {
          animation: fadeOutScale 0.3s ease-in forwards;
        }
        
        .float-animation {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
      
      <section className="relative py-20 md:py-28 bg-background text-foreground overflow-hidden">
        
        <div className="container mx-auto px-4 max-w-4xl relative">
          <div
            className={`relative p-8 md:p-12 rounded-2xl shadow-xl text-center bg-card/60 backdrop-blur-sm transition-all duration-300 min-h-[500px] md:min-h-[550px] flex flex-col justify-center ${
              isAnimating ? 'testimonial-exit' : 'testimonial-enter'
            }`}
          >
            {/* Quotation marks background */}
            <div className="absolute top-6 left-6 text-6xl text-muted-foreground/10 select-none font-serif">
              "
            </div>
            <div className="absolute bottom-6 right-6 text-6xl text-muted-foreground/10 select-none font-serif rotate-180">
              "
            </div>

            {/* Avatar */}
            <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden mb-8 border-4 border-primary/20 shadow-lg">
              <img
                src={testimonial.avatar}
                alt={`${testimonial.name}'s profile picture`}
                className="object-cover w-full h-full"
                loading="lazy"
              />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md">
                <Quote size={14} className="text-primary-foreground" />
              </div>
            </div>

            {/* Message */}
            <blockquote className="text-xl md:text-2xl font-medium text-card-foreground leading-relaxed mb-8 italic max-w-3xl mx-auto min-h-[120px] md:min-h-[140px] flex items-center justify-center">
              "{testimonial.message}"
            </blockquote>

            {/* Rating */}
            <div className="mb-6">
              <StarRating rating={testimonial.rating} size={22} />
            </div>

            {/* Name & Role */}
            <div className="space-y-2 mb-6 min-h-[80px] flex flex-col justify-center">
              <div className="text-lg md:text-xl font-bold text-primary">
                {testimonial.name}
              </div>
              <div className="text-card-foreground/80 text-sm md:text-base">
                {testimonial.role}
              </div>
              <div className="text-muted-foreground text-xs md:text-sm font-medium">
                {testimonial.company}
              </div>
            </div>

            {/* CTA Line */}
            <div className="text-sm text-muted-foreground bg-card/40 rounded-full px-4 py-2 inline-block border border-border/50">
              has joined us — <span className="text-primary font-medium underline underline-offset-2 cursor-pointer hover:text-primary/80 transition-colors">are you next?</span>
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setIsAnimating(true);
                  setTimeout(() => {
                    setIndex(i);
                    setIsAnimating(false);
                  }, 300);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i === index 
                    ? 'bg-primary scale-125' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-6 max-w-xs mx-auto">
            <div className="w-full bg-muted-foreground/20 rounded-full h-1 overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300 ease-linear"
                style={{
                  width: `${((index + 1) / testimonials.length) * 100}%`
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>{index + 1}</span>
              <span>{testimonials.length}</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}