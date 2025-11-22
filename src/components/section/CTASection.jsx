"use client";

import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="bg-background text-center py-14 px-6 rounded-3xl shadow-lg max-w-4xl mx-auto transition-colors">
      <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
        Ready to Scale Your Business?
      </h2>
      <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
        Get started today and take your SaaS to the next level with our powerful solution.
      </p>

      <div className="mt-8 flex justify-center gap-6 flex-wrap">
        <Button asChild size="lg" className="px-8 rounded-xl shadow-md">
          <a href="/pricing">Get Started</a>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="px-8 rounded-xl"
        >
          <a href="/contact">Contact Us</a>
        </Button>
      </div>
    </section>
  );
}
