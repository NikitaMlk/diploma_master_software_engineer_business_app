'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Database, Cloud, Rocket } from 'lucide-react'; // Replace Rocket if you prefer another icon

const quickLinks = [
  {
    name: 'MongoDB Atlas',
    url: 'https://cloud.mongodb.com/',
    icon: Database,
  },
  {
    name: 'Google Cloud',
    url: 'https://console.cloud.google.com/',
    icon: Cloud,
  },
  {
    name: 'Vercel',
    url: 'https://vercel.com/dashboard',
    icon: Rocket,
  },
];

export default function QuickAccessButtons() {
  return (
    <Card className="w-full mt-8 mb-8">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Quick Access</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <TooltipProvider>
            {quickLinks.map((link, i) => (
              <Tooltip key={i}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start space-x-3 text-left p-4"
                    asChild
                  >
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      <link.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span>{link.name}</span>
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open {link.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}
