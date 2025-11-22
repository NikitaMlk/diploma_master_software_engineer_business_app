"use client";

import React from "react";
import { Facebook, Twitter, Linkedin, Github, Mail, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Footer = () => {
  return (
    <footer className="mt-12 bg-background text-muted-foreground py-16 px-6 border-t border-muted transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-foreground">Startup Growth Kit</h3>
            <p className="text-sm mb-5 leading-relaxed">
              Production-ready Startup foundation with everything you need to launch, scale, and grow your startup. Skip months of development and start building your empire today.
            </p>
            <div className="flex flex-col space-y-2">
              <Badge variant="secondary" className="w-fit">
                💰 Worth $50K-$100K in dev costs
              </Badge>
              <Badge variant="outline" className="w-fit">
                ⚡ Launch in days, not months
              </Badge>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-foreground">Product</h3>
            <ul className="space-y-3 text-sm">
              {[
                { href: "#features", label: "Features" },
                { href: "#pricing", label: "Pricing" },
                { href: "#demo", label: "Live Demo" },
                { href: "#documentation", label: "Documentation" },
                { href: "#changelog", label: "Changelog" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="hover:text-primary transition-colors duration-300 flex items-center gap-1"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-foreground">Support</h3>
            <ul className="space-y-3 text-sm">
              {[
                { href: "#faq", label: "FAQ" },
                { href: "#contact", label: "Contact Support" },
                { href: "#license", label: "License Terms" },
                { href: "#privacy", label: "Privacy Policy" },
                { href: "#terms", label: "Terms of Service" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="hover:text-primary transition-colors duration-300"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-foreground">Stay Connected</h3>
            <p className="text-sm mb-4 leading-relaxed">
              Get updates on new features, startup tips, and exclusive offers.
            </p>
            
            <form className="flex flex-col space-y-3 mb-6" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder="Enter your email"
                required
                className="w-full"
              />
              <Button type="submit" className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Subscribe
              </Button>
            </form>

            {/* Social Media */}
            <div className="flex space-x-4">
              {[
                { href: "https://twitter.com/yourhandle", Icon: Twitter, label: "Twitter" },
                { href: "https://github.com/yourusername", Icon: Github, label: "GitHub" },
                { href: "https://linkedin.com/in/yourprofile", Icon: Linkedin, label: "LinkedIn" },
              ].map(({ href, Icon, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors duration-300 p-2 rounded-lg hover:bg-muted"
                  aria-label={`Follow us on ${label}`}
                  title={`Follow us on ${label}`}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-muted pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <p className="text-sm opacity-70">
                &copy; 2025 Startup Growth Kit. All Rights Reserved.
              </p>
            </div>
            
            {/* WebSeed Badge */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">Made with</span>
              <a
                href="https://webseed.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 hover:border-green-500/40 transition-all duration-300 group hover:shadow-lg hover:shadow-green-500/20"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 p-0.5 flex items-center justify-center">
                  <img 
                    src="/uploads/logo.png" 
                    alt="WebSeed Logo" 
                    className="w-full h-full rounded-full object-cover bg-white p-0.5"
                  />
                </div>
                <span className="text-xs font-medium text-foreground group-hover:text-green-600 transition-colors">
                  WebSeed
                </span>
                <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;