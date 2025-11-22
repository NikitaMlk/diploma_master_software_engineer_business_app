'use client';

import React, { useState, useEffect, useRef } from 'react';

/**
 * RollingNumber component animates a number from 0 to a target value.
 * It can handle integers, floats, and currency formatting.
 *
 * @param {object} props - Component props.
 * @param {number} props.value - The target number to animate to.
 * @param {number} [props.duration=1000] - Duration of the animation in milliseconds.
 * @param {string} [props.prefix=''] - String to prepend to the number (e.g., '$').
 * @param {string} [props.suffix=''] - String to append to the number (e.g., '%').
 * @param {boolean} [props.isCurrency=false] - If true, formats the number as currency.
 * @param {number} [props.decimals=0] - Number of decimal places to show for non-currency numbers.
 * @returns {JSX.Element} The animated number display.
 */
export default function RollingNumber({
  value,
  duration = 1000, // Default duration 1 second
  prefix = '',
  suffix = '',
  isCurrency = false,
  decimals = 0,
}) {
  const [currentValue, setCurrentValue] = useState(0);
  const animationFrameId = useRef(null);
  const startTimeRef = useRef(null);

  // Clean up any ongoing animation frames when component unmounts or value changes
  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  // Effect to trigger the animation when the 'value' prop changes
  useEffect(() => {
    // If the value is not a valid number, just set it directly or display default
    if (typeof value !== 'number' || isNaN(value)) {
      setCurrentValue(value); // Display the actual string value like "N/A" or "Error"
      return;
    }

    // Reset current value to 0 to start animation from scratch, unless it's already at target
    if (currentValue !== 0 && typeof currentValue === 'number') {
        setCurrentValue(0);
    }
    
    // Cancel any previous animation frame
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    // Start animation
    startTimeRef.current = performance.now();
    const animate = (currentTime) => {
      if (!startTimeRef.current) startTimeRef.current = currentTime; // Should not happen with current logic, but safety
      const progress = (currentTime - startTimeRef.current) / duration;

      if (progress < 1) {
        // Calculate the intermediate value based on progress
        const animatedValue = value * progress;
        setCurrentValue(animatedValue);
        animationFrameId.current = requestAnimationFrame(animate);
      } else {
        // Animation finished, set to the final value
        setCurrentValue(value);
        cancelAnimationFrame(animationFrameId.current);
      }
    };

    animationFrameId.current = requestAnimationFrame(animate);

  }, [value, duration]); // Rerun effect if target value or duration changes

  // Format the displayed number based on props
  const formatNumber = (num) => {
    if (typeof num !== 'number') return num; // If it's not a number (e.g., "N/A"), return as is

    if (isCurrency) {
      return num.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } else {
      // For non-currency numbers, apply specified decimals
      return num.toFixed(decimals).toLocaleString();
    }
  };

  return (
    <span className="text-2xl font-semibold">
      {prefix}
      {formatNumber(currentValue)}
      {suffix}
    </span>
  );
}
