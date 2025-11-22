'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  CheckCircle,
  Loader2, // For loading state
  Clock, // For countdown timer
  Zap, // For discount badge
  Tag // For price tags
} from "lucide-react";
import PayButton from "../shared/PaymentButton";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton"; // For loading states
import { toast } from "sonner"; // For toasts

// Countdown Timer Component
function CountdownTimer({ validUntil }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const targetTime = new Date(validUntil).getTime();
      const difference = targetTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
        setIsExpired(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [validUntil]);

  if (isExpired) {
    return (
      <div className="font-semibold text-sm text-foreground flex items-center gap-1">
        <Clock size={16} />
        <span>Don't Miss Out!</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <Clock size={16} className="text-primary" />
      <div className="flex gap-1 font-mono font-semibold">
        {timeLeft.days > 0 && (
          <span className="bg-red-600 text-white px-2 py-1 rounded text-xs">
            {timeLeft.days}d
          </span>
        )}
        <span className="bg-red-600 text-white px-2 py-1 rounded text-xs">
          {String(timeLeft.hours).padStart(2, '0')}h
        </span>
        <span className="bg-red-600 text-white px-2 py-1 rounded text-xs">
          {String(timeLeft.minutes).padStart(2, '0')}m
        </span>
        <span className="bg-red-600 text-white px-2 py-1 rounded text-xs">
          {String(timeLeft.seconds).padStart(2, '0')}s
        </span>
      </div>
    </div>
  );
}

// Discount Badge Component
function DiscountBadge({ discount }) {
  if (!discount || !discount.enabled) return null;

  const discountText = discount.type === 'percentage' 
    ? `${discount.value}% OFF` 
    : `$${discount.value} OFF`;

  return (
    <div className="absolute -top-3 -right-3 z-10">
      <Badge className="bg-destructive hover:bg-destructive/90 text-destructive-foreground border-0 px-3 py-1 text-sm font-bold animate-pulse shadow-lg">
        <Zap size={14} className="mr-1" />
        {discountText}
      </Badge>
    </div>
  );
}

// Price Display Component
function PriceDisplay({ product }) {
  const { discount } = product;
  const originalPrice = Number(product.price);
  
  if (!discount || !discount.enabled) {
    return (
      <CardDescription className="text-lg mt-1">
        <span className="text-3xl font-bold text-foreground">
          ${originalPrice.toFixed(2)}
        </span>
        {product.isSubscription && <span className="text-base"> per month</span>}
      </CardDescription>
    );
  }

  // Calculate discounted price
  let discountedPrice;
  if (discount.type === 'percentage') {
    discountedPrice = originalPrice * (1 - discount.value / 100);
  } else {
    discountedPrice = originalPrice - discount.value;
  }
  
  // Ensure discounted price doesn't go below 0
  discountedPrice = Math.max(0, discountedPrice);

  return (
    <CardDescription className="text-lg mt-1 space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-3xl font-bold text-green-600">
          ${discountedPrice.toFixed(2)}
        </span>
        <span className="text-lg text-muted-foreground line-through">
          ${originalPrice.toFixed(2)}
        </span>
        {product.isSubscription && <span className="text-base"> per month</span>}
      </div>
      <div className="text-sm text-green-600 font-semibold flex items-center gap-1">
        <Tag size={14} />
        You save ${(originalPrice - discountedPrice).toFixed(2)}!
      </div>
    </CardDescription>
  );
}

// Discount Banner Component
function DiscountBanner({ discount }) {
  if (!discount || !discount.enabled) return null;

  const isExpiringSoon = () => {
    const now = new Date().getTime();
    const validUntil = new Date(discount.validUntil).getTime();
    const hoursLeft = (validUntil - now) / (1000 * 60 * 60);
    return hoursLeft <= 24 && hoursLeft > 0; // Less than 24 hours
  };

  return (
    <div className={`p-3 rounded-lg mb-4 border-l-4 ${
      isExpiringSoon() 
        ? 'bg-destructive/10 border-destructive' 
        : 'bg-primary/10 border-primary'
    }`}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={16} className={isExpiringSoon() ? 'text-destructive' : 'text-primary'} />
            <span className="font-semibold text-sm">
              {discount.description || 'Limited Time Offer'}
            </span>
          </div>
          {isExpiringSoon() && (
            <Badge variant="destructive" className="text-xs animate-pulse">
              Hurry!
            </Badge>
          )}
        </div>
        <CountdownTimer validUntil={discount.validUntil} />
      </div>
    </div>
  );
}

export default function PricingSection() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Hardcoded list of product IDs you want to display on the pricing page.
  // Only products with these IDs (and active: true in DB) will be shown.
  // You can adjust this list to include 1, 2, or 3 specific product IDs.
  const productIdsToDisplay = [
    "684e7fa4cbc144b1d720b29b", // Example: Basic Plan ID
    "689095ff9b0e5560f4053bbd", // Example: Pro Plan ID
    "68628a95237897dbcce85828", // Example: Enterprise Plan ID
  ];

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/product'); // Fetch all products from your API
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch pricing plans: ${res.status} - ${errorText}`);
        }
        const data = await res.json();
        
        // Ensure data.products is an array before filtering
        const fetchedProducts = Array.isArray(data.products) ? data.products : [];

        // Filter for active products AND those present in our hardcoded productIdsToDisplay list,
        // then sort by price ascending, and limit to maximum 3 for display.
        const activeAndSortedProducts = fetchedProducts
          .filter(p => p.active && productIdsToDisplay.includes(p._id))
          .sort((a, b) => (a.price || 0) - (b.price || 0))
          .slice(0, 3); // Still limit to max 3 cards for layout consistency

        setProducts(activeAndSortedProducts);
      } catch (err) {
        console.error('Failed to load pricing plans:', err);
        toast.error("Failed to load pricing plans.", {
          description: err.message || "Could not retrieve pricing plans.",
        });
        setProducts([]); // Clear products on error
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []); // No dependencies are needed since productIdsToDisplay is static

  // Check if any active discounts exist
  const hasActiveDiscounts = products.some(p => p.discount?.enabled);

  // Improved grid layout logic
  const getGridLayout = () => {
    if (products.length === 1) {
      return "flex justify-center"; // Use flex for perfect centering
    } else if (products.length === 2) {
      return "grid grid-cols-1 md:grid-cols-2 place-items-center";
    } else {
      return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    }
  };

  // Card width for single product
  const getCardWidth = () => {
    return products.length === 1 ? "w-full max-w-md" : "w-full";
  };

  return (
    <section className="bg-background text-foreground py-16 px-4 md:px-6">
      {/* Heading */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          Simple & Transparent Pricing
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Find the perfect plan for your needs.
        </p>
        {hasActiveDiscounts && (
          <div className="mt-6 p-4 bg-destructive/10 rounded-lg border border-destructive/30">
            <div className="flex items-center justify-center gap-2 text-destructive font-semibold">
              <Zap size={20} />
              <span>Limited Time Offers Available - Don't Miss Out!</span>
            </div>
          </div>
        )}
      </div>

      {/* Pricing Cards Container */}
      {isLoading ? (
        // Show skeletons with proper layout
        <div className={getGridLayout()}>
          <div className="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
            {[...Array(Math.min(productIdsToDisplay.length, 3))].map((_, i) => (
              <Card key={i} className="bg-card text-card-foreground p-6 flex flex-col items-center w-full max-w-md">
                <Skeleton className="h-10 w-3/4 mb-4" />
                <Skeleton className="h-16 w-1/2 mb-6" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-6" />
                <Skeleton className="h-12 w-full" />
              </Card>
            ))}
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          No pricing plans available at the moment. Please check back later!
        </div>
      ) : (
        <div className={`${getGridLayout()} gap-8 max-w-5xl mx-auto`}>
          {products.map((product) => (
            <Card
              key={product._id}
              className={`border bg-card text-card-foreground p-6 flex flex-col relative ${getCardWidth()} ${
                product.isPopular ? 'shadow-lg ring-2 ring-primary' : 'shadow-md'
              } ${
                product.discount?.enabled ? 'ring-2 ring-destructive/50 shadow-destructive/20' : ''
              }`}
            >
              {/* Discount Badge */}
              <DiscountBadge discount={product.discount} />

              <CardHeader className="text-left px-0 pt-0 pb-4">
                {product.isPopular && (
                  <Badge variant="outline" className="text-sm w-fit mb-2">
                    Most Popular
                  </Badge>
                )}
                <CardTitle className="text-3xl font-bold">{product.name}</CardTitle>
                <PriceDisplay product={product} />
              </CardHeader>

              <CardContent className="space-y-3 flex-1 px-0 py-0">
                {/* Discount Banner */}
                <DiscountBanner discount={product.discount} />

                {/* Product Description */}
                {product.description && (
                  <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                )}
                <Separator />
                {/* Product-specific features (assuming product.features is an array of strings from API) */}
                <div className="space-y-2 pt-2">
                  {product.features && Array.isArray(product.features) && product.features.length > 0 ? (
                    product.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 text-base text-foreground"
                      >
                        <CheckCircle className="text-primary" size={20} />
                        <span>{feature}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No features listed.</p>
                  )}
                </div>

                {/* Product-specific tiers (if applicable) */}
                {product.subscriptionTiers && Array.isArray(product.subscriptionTiers) && product.subscriptionTiers.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-foreground">Tiers:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {product.subscriptionTiers.map((tier, idx) => (
                        <li key={idx}>{tier}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex flex-col gap-3 mt-6 px-0 pb-0">
                <PayButton
                  productId={product._id} // Pass productId for Stripe or fallback
                  userEmail={userEmail}
                  checkoutUrl={product.checkoutUrl} // Pass checkoutUrl for Lemon Squeezy
                  className={product.discount?.enabled ? 'bg-red-600 hover:bg-red-700 animate-pulse' : ''}
                >
                  {product.discount?.enabled ? 'Claim Discount Now' : 'Get Started'}
                </PayButton>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
        <div className="mt-12 flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <span>✓ Cancel anytime</span>
          <span>✓ No setup fees</span>
          <span>✓ 24/7 support</span>
        </div>
    </section>
  );
}