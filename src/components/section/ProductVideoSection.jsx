// components/ProductVideo.jsx
"use client";

import React from "react";

export default function ProductVideoSection() {
  return (
    <section className="relative w-full bg-background overflow-hidden py-12 md:py-16"> {/* Added vertical padding for spacing */}
      <div className="container mx-auto px-4"> {/* This div provides the left/right padding */}
        <div className="relative w-full h-0 pb-[56.25%] overflow-hidden rounded-lg shadow-2xl"> {/* Aspect ratio box for responsive video */}
          <video
            autoPlay
            loop
            muted
            playsInline // Important for autoplay on mobile devices
            className="absolute inset-0 w-full h-full object-cover" // Video fills the aspect ratio box
          >
            {/* Replace with your video paths */}
            <source src="/videos/product-demo.mp4" type="video/mp4" />
            <source src="/videos/product-demo.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
          {/* Optional: You can keep a very subtle overlay if the video is too bright */}
          {/* <div className="absolute inset-0 bg-black opacity-10"></div> */}
        </div>
      </div>
    </section>
  );
}