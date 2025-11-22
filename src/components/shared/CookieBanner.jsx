"use client";

import { useEffect, useState } from "react";
import useIsLoggedIn from "@/hooks/useIsLoggedIn";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Cookie, Settings, X } from "lucide-react";

export default function CookieBanner({ 
  displayMode = "oncePerLogin",
  privacyPolicyUrl = "/cookie-policy",
  position = "bottom-right" // bottom-right, bottom-left, bottom-center
}) {
  const isLoggedIn = useIsLoggedIn();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const sessionKey = "cookieConsentSession";
    const localKey = "cookieConsentPersistent";
    const hasConsentedSession = sessionStorage.getItem(sessionKey);
    const hasConsentedPersistent = localStorage.getItem(localKey);

    if (displayMode === "always") {
      setIsOpen(true);
    } else if (displayMode === "oncePerLogin") {
      if (!hasConsentedSession && isLoggedIn) {
        setIsOpen(true);
      }
    } else if (displayMode === "once") {
      if (!hasConsentedPersistent) {
        setIsOpen(true);
      }
    }

    // Smooth entrance animation
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 100);
    }
  }, [displayMode, isLoggedIn, isOpen]);

  const getPositionClasses = () => {
    switch (position) {
      case "bottom-left":
        return "bottom-4 left-4";
      case "bottom-center":
        return "bottom-4 left-1/2 transform -translate-x-1/2";
      default:
        return "bottom-4 right-4";
    }
  };

  const handleAccept = () => {
    if (typeof window === "undefined") return;
    
    sessionStorage.setItem("cookieConsentSession", "true");
    if (displayMode === "once") {
      localStorage.setItem("cookieConsentPersistent", "true");
    }
    
    setIsVisible(false);
    setTimeout(() => setIsOpen(false), 300);
  };

  const handleDecline = () => {
    if (typeof window === "undefined") return;
    
    sessionStorage.setItem("cookieConsentSession", "declined");
    if (displayMode === "once") {
      localStorage.setItem("cookieConsentPersistent", "declined");
    }
    
    setIsVisible(false);
    setTimeout(() => setIsOpen(false), 300);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setIsOpen(false), 300);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed ${getPositionClasses()} z-50 transition-all duration-300 ease-out transform ${
        isVisible 
          ? "translate-y-0 opacity-100 scale-100" 
          : "translate-y-4 opacity-0 scale-95"
      }`}
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-description"
    >
      <div className="relative max-w-sm w-full mx-auto">
        {/* Backdrop blur effect */}
        <div className="absolute inset-0 bg-card/90 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl" />
        
        {/* Content */}
        <div className="relative p-6">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted/50 transition-colors duration-200 group"
            aria-label="Close cookie banner"
          >
            <X className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
          </button>

          {/* Header with icon */}
          <div className="flex items-start space-x-3 mb-4">
            <div className="flex-shrink-0 p-2 bg-primary/10 rounded-xl">
              <Cookie className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 
                id="cookie-banner-title"
                className="text-lg font-semibold text-foreground leading-tight"
              >
                Cookie Notice
              </h3>
            </div>
          </div>

          {/* Description */}
          <p 
            id="cookie-banner-description"
            className="text-sm text-muted-foreground leading-relaxed mb-5"
          >
            We use essential cookies to make our site work and analytics cookies to understand how you interact with our website.{" "}
            <a
              href={privacyPolicyUrl}
              className="inline-flex items-center gap-1 text-primary hover:text-primary/80 underline decoration-1 underline-offset-2 transition-colors duration-200"
            >
              Learn more
              <Settings className="w-3 h-3" />
            </a>
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleAccept}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              aria-label="Accept all cookies"
            >
              Accept All
            </Button>
            <Button
              onClick={handleDecline}
              variant="outline"
              className="flex-1 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              aria-label="Decline non-essential cookies"
            >
              Essential Only
            </Button>
          </div>
        </div>

        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-indigo-400/10 rounded-2xl blur-xl opacity-30 -z-10" />
      </div>
    </div>
  );
}