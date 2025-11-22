"use client";

import React from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import AuthButton from "../shared/AuthButton";
import ThemeToggle from "@/components/shared/DarkModeToggle";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const Header = () => {
  const navLinks = [
    { href: "#product", label: "Product" },
    { href: "#pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <header className="bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/95 border-b border-border/50 sticky top-0 z-50 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2.5 group transition-all duration-200 hover:opacity-80">
            <Image
              src="/uploads/logo.png"
              alt="WebSeed Logo"
              width={36}
              height={36}
              className="h-9 w-auto"
            />
            <div className="flex flex-col">
              <span className="text-xl font-semibold tracking-tight text-foreground">
                WebSeed
              </span>
              <span className="text-[10px] text-muted-foreground/80 tracking-wide uppercase font-medium -mt-0.5">
                Launch Fast
              </span>
            </div>
          </a>

          {/* Center Navigation (desktop) */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="flex items-center space-x-1">
              {navLinks.map(({ href, label }) => (
                <NavigationMenuItem key={href}>
                  <NavigationMenuLink
                    href={href}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-all duration-200 ease-out"
                  >
                    {label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right Side (desktop) */}
          <div className="hidden lg:flex items-center space-x-3">
            <ThemeToggle />
            <div className="h-4 w-px bg-border"></div>
            <AuthButton />
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center space-x-2 lg:hidden">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 hover:bg-accent/50 transition-colors"
                  aria-label="Toggle Menu"
                >
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 border-l border-border/50">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                
                {/* Mobile menu header */}
                <div className="flex items-center justify-between pb-6 border-b border-border/50">
                  <div className="flex items-center gap-2.5">
                    <Image
                      src="/uploads/logo.png"
                      alt="WebSeed Logo"
                      width={36}
                      height={36}
                      className="h-8 w-auto"
                    />
                    <span className="text-lg font-semibold text-foreground">
                      WebSeed
                    </span>
                  </div>
                </div>

                {/* Mobile navigation links */}
                <nav className="flex flex-col space-y-1 pt-6">
                  {navLinks.map(({ href, label }) => (
                    <a
                      key={href}
                      href={href}
                      className="flex items-center px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all duration-200"
                    >
                      {label}
                    </a>
                  ))}
                </nav>

                {/* Mobile auth section */}
                <div className="absolute bottom-6 left-6 right-6 pt-6 border-t border-border/50">
                  <AuthButton />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;