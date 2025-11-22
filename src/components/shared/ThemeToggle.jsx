// components/theme-toggle.jsx (or theme-switcher.jsx)
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Palette } from "lucide-react"; // Import Palette icon for custom theme

import { Button } from "@/components/ui/button"; // Assuming you have shadcn/ui Button
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Assuming you have shadcn/ui DropdownMenu

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  // State to manage the icon displayed, initialized to a sensible default
  const [iconToDisplay, setIconToDisplay] = useState('dark'); // Matches your defaultTheme="dark"

  // Use useEffect to update the icon based on the resolved theme after hydration
  useEffect(() => {
    if (theme) {
      setIconToDisplay(theme);
    }
  }, [theme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {/* Conditionally render icon based on the active theme */}
          {iconToDisplay === "dark" ? (
            <Moon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          ) : iconToDisplay === "light" ? (
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          ) : (
            // For your custom theme, use a generic palette icon or another suitable icon
            <Palette className="h-[1.2rem] w-[1.2rem]" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("theme-dark-moss-green")}>
          Moss Green
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("hunyadi-yellow")}>
          Yellow
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("cool-purple")}>
          Cool Purple
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}