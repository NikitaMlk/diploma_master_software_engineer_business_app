"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VideoSection() {
  return (
    <section className="bg-background py-16 px-8 rounded-3xl shadow-lg max-w-6xl mx-auto text-center transition-colors">
      <Card className="bg-transparent shadow-none">
        <CardHeader>
          <CardTitle className="text-4xl font-extrabold text-foreground tracking-tight">
            See It in Action
          </CardTitle>
          <CardDescription className="mt-3 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Watch our quick walkthrough to explore the key features and benefits.
          </CardDescription>
        </CardHeader>

        <CardContent className="mt-8 p-0">
          <div className="w-full h-[280px] md:h-[400px] lg:h-[480px] rounded-xl overflow-hidden shadow-xl ring-4 ring-primary/30 dark:ring-primary/60 mx-auto max-w-4xl">
            <iframe
              className="w-full h-full rounded-xl"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Video Walkthrough"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </CardContent>
      </Card>

      <p className="mt-8 text-muted-foreground text-sm md:text-base">
        Have questions?{" "}
        <Button
          variant="link"
          asChild
          className="font-semibold"
        >
          <a href="#contact" className="hover:underline hover:text-primary">
            Contact us
          </a>
        </Button>
      </p>
    </section>
  );
}
