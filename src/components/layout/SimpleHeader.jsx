"use client";

import React from "react";
import Image from "next/image";
import { Menu } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const SimpleHeader = () => {
  const navLinks = [
    { href: "#videoproduct", label: "Product" },
    { href: "#demo", label: "Three Minute Launch" },
    { href: "#features", label: "What You Get" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <header className="bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b border-border shadow-sm sticky top-0 z-50">
      <div className="mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <Image
            src="/uploads/logo.png"
            alt="SaaSStarter Logo"
            width={36}
            height={36}
            className="h-9 w-auto rounded-md"
          />
          <div className="flex flex-col leading-none">
            <span className="text-3xl font-bold tracking-tight text-primary group-hover:text-primary/80 transition-colors">
              WebSeed
            </span>
            <span className="text-sm tracking-wider">
              Launch Fast. Grow Smart.
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <div className="flex items-center space-x-4">
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="space-x-8">
              {navLinks.map(({ href, label }) => (
                <NavigationMenuItem key={href}>
                  <NavigationMenuLink
                    href={href}
                    className="text-base font-medium hover:text-primary transition-colors"
                  >
                    {label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Toggle Menu"
              >
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[260px] pt-10">
              <div className="flex flex-col space-y-6">
                {navLinks.map(({ href, label }) => (
                  <a
                    key={href}
                    href={href}
                    className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default SimpleHeader;
