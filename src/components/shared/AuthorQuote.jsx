"use client";

import React from "react";
import Image from "next/image";

export default function AuthorQuote() {
  return (
    <div className="relative max-w-4xl mx-auto bg-background border border-border rounded-2xl shadow-sm p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8">

      {/* Author Avatar */}
      <div className="shrink-0">
        <Image
          src="/uploads/that_guy.jpg" // Make sure this exists in /public/avatars/
          alt="that_guy"
          width={64}
          height={64}
          className="rounded-full border border-border shadow-md"
        />
      </div>

      {/* Content */}
      <div className="text-center md:text-left">
        <p className="text-muted-foreground text-lg md:text-xl leading-relaxed font-medium">
          “All further versions and updates are included in one price — you get them free.
          All included components are the latest versions and fully tested.”
        </p>

        <div className="mt-4 text-sm text-muted-foreground italic">
          — Nikita Malook, Creator of WebSeed
        </div>
      </div>
    </div>
  );
}
