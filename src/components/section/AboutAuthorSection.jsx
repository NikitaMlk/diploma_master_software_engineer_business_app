"use client";

import { Github, Linkedin, Twitter } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function AboutAuthor() {
  return (
    <section id="author" className="bg-background py-16 px-8 rounded-3xl shadow-lg max-w-4xl mx-auto text-center transition-colors">
      <div className="flex flex-col items-center">
        {/* Profile Image */}
        <Avatar className="w-36 h-36 shadow-xl ring-4 ring-primary/40 dark:ring-primary/70">
          <AvatarImage src="/author.jpg" alt="John Doe" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>

        {/* Author Info */}
        <h2 className="text-4xl font-extrabold text-foreground mt-6 tracking-tight">
          John Doe
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mt-3 leading-relaxed">
          A passionate software developer, entrepreneur, and content creator dedicated to building high-quality digital products that help businesses grow.
        </p>

        {/* Social Media Links */}
        <div className="flex space-x-6 mt-6 text-muted-foreground">
          {[ 
            { href: "https://twitter.com", Icon: Twitter, label: "Twitter" },
            { href: "https://linkedin.com", Icon: Linkedin, label: "LinkedIn" },
            { href: "https://github.com", Icon: Github, label: "GitHub" },
          ].map(({ href, Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition"
              aria-label={label}
            >
              <Icon className="w-7 h-7" />
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8">
          <Button asChild>
            <a href="/blog" className="px-8 py-3 rounded-xl shadow-lg">
              Read My Blog
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
