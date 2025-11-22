"use client";

import React from "react";
// Import Lucide icon for the checkmark
import { CheckCircle } from "lucide-react";
// Import Shadcn UI table components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// Card components are not strictly necessary for the table itself,
// but often tables are wrapped in cards, so including them if you choose to use them.
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


export default function WhatYouGetTableSection() {
  const features = [
    { feature: "Sales Page", description: "A high-converting sales page designed to showcase your SaaS." },
    { feature: "Blog System", description: "Fully integrated blog for content marketing and SEO." },
    { feature: "Admin Dashboard", description: "Powerful backend for managing users, content, and settings." },
    { feature: "User Dashboard", description: "Personalized user interface for your customers." },
    { feature: "Authentication System", description: "Secure user login, registration, and password management." },
    { feature: "Stripe & LemonSqueezy Integration", description: "Ready-to-use payment processing for subscriptions and one-time purchases." },
    { feature: "SEO Configuration", description: "Optimized for search engines to help your SaaS get discovered." },
    { feature: "Clean, Extendable Code", description: "A well-structured codebase that's easy to customize and scale." },
  ];

  return (
    // Section styling to match the sales page's "Detailed Feature Table" section
    // Uses bg-secondary and rounded-t-3xl shadow-inner as seen in the reference
    <section className="py-16 md:py-24 bg-background text-foreground rounded-t-3xl shadow-inner">
      <div className="container mx-auto px-4">
        {/* Main Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
          Everything You Need to Launch Like a Pro
        </h2>

        {/* Table wrapped in a Card for consistent styling */}
        <Card className="overflow-x-auto bg-card rounded-xl shadow-lg p-6 border border-border"> {/* Use bg-card for background */}
          {/* Removed whitespace between <Table> and its children */}
          <Table className="min-w-full divide-y divide-border">
            {/* Removed whitespace between <TableHeader> and its children */}
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider rounded-tl-lg">
                  Feature
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider rounded-tr-lg">
                  Description
                </TableHead>
                <TableHead className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Included
                </TableHead>
              </TableRow>
            </TableHeader>
            {/* Removed whitespace between <TableBody> and its children */}
            <TableBody className="divide-y divide-border">
              {features.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                    {item.feature}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                    {item.description}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-center">
                    {/* Checkmark icon, color set to primary (your brand green) */}
                    <CheckCircle className="text-primary mx-auto" size={20} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </section>
  );
}
