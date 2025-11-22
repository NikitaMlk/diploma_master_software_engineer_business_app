'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation'; // useParams to get ID
import { useTranslations } from 'next-intl';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner"; // Import toast from sonner
import { Loader2, Tag, Percent, DollarSign } from "lucide-react"; // For loading spinner and icons

export default function EditProduct() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    isSubscription: false, // true for recurring (e.g., per month), false for one-time
    stripePriceId: '', // Stripe Price ID for subscriptions
    availability: '',
    subscriptionTiers: '', // Comma-separated string for display
    licenseKey: '',
    apiKey: '',
    isPopular: false, // Mark as popular for pricing page
    active: true, // Show/hide on pricing page
    checkoutUrl: '', // LemonSqueezy direct checkout URL
    stripeCheckoutUrl: '', // NEW FIELD: Stripe Payment Link URL
    features: '', // Comma-separated string for product features
    // NEW: Discount fields
    discount: {
      enabled: false,
      type: 'percentage', // 'percentage' or 'fixed'
      value: '',
      validUntil: '',
      description: ''
    }
  });
  const [isLoading, setIsLoading] = useState(true); // For initial data fetch
  const [isSubmitting, setIsSubmitting] = useState(false); // For form submission
  const router = useRouter();
  const params = useParams(); // Get URL parameters, e.g., { id: 'product-id' }
  const productId = params.id; // Assuming the route is /dashboard/product/edit/[id]

  const t = useTranslations('productManagement');

  useEffect(() => {
    async function fetchProduct() {
      if (!productId) return; // Don't fetch if no ID is available yet
      setIsLoading(true);
      try {
        const res = await fetch(`/api/product/${productId}`);
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch product data: ${res.status} - ${errorText}`);
        }
        const data = await res.json();

        // Populate form with fetched data, including discount fields
        setForm({
          name: data.name || '',
          description: data.description || '',
          category: data.category || '',
          price: data.price ? (typeof data.price === 'object' && data.price.$numberInt ? data.price.$numberInt.toString() : data.price.toString()) : '', // Handle $numberInt
          isSubscription: data.isSubscription ?? false, // Use ?? for null/undefined
          stripePriceId: data.stripePriceId || '', // Populate stripePriceId
          availability: data.availability || '',
          subscriptionTiers: Array.isArray(data.subscriptionTiers) ? data.subscriptionTiers.join(', ') : '',
          licenseKey: data.licenseKey || '',
          apiKey: data.apiKey || '',
          isPopular: data.isPopular ?? false, // Populate new field
          active: data.active ?? true,     // Populate new field
          checkoutUrl: data.checkoutUrl || '', // Populate LemonSqueezy checkout URL
          stripeCheckoutUrl: data.stripeCheckoutUrl || '', // NEW: Populate Stripe checkout URL
          features: Array.isArray(data.features) ? data.features.join(', ') : '', // Populate new field
          // Populate discount fields
          discount: {
            enabled: data.discount?.enabled ?? false,
            type: data.discount?.type || 'percentage',
            value: data.discount?.value ? data.discount.value.toString() : '',
            validUntil: data.discount?.validUntil || '',
            description: data.discount?.description || ''
          }
        });
      } catch (error) {
        console.error('Failed to load product for editing:', error);
        toast.error(t('messages.fetchError'), {
          description: error.message || 'Could not load product details.',
        });
        router.push('/dashboard/product'); // Redirect if product not found or error
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduct();
  }, [productId, router, t]); // Add t to dependency array

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDiscountChange = (field, value) => {
    setForm(prevForm => ({
      ...prevForm,
      discount: {
        ...prevForm.discount,
        [field]: value,
      }
    }));
  };

  // Calculate discounted price for preview
  const calculateDiscountedPrice = () => {
    const originalPrice = parseFloat(form.price) || 0;
    const discountValue = parseFloat(form.discount.value) || 0;
    
    if (!form.discount.enabled || discountValue === 0) {
      return originalPrice;
    }
    
    if (form.discount.type === 'percentage') {
      return originalPrice * (1 - discountValue / 100);
    } else {
      return Math.max(0, originalPrice - discountValue);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...form,
      price: parseFloat(form.price),
      isSubscription: Boolean(form.isSubscription),
      isPopular: Boolean(form.isPopular), // Ensure boolean conversion for submission
      active: Boolean(form.active),     // Ensure boolean conversion for submission
      subscriptionTiers: form.isSubscription
        ? form.subscriptionTiers.split(',').map(t => t.trim()).filter(Boolean)
        : [],
      features: form.features.split(',').map(f => f.trim()).filter(Boolean), // Process features for submission
      // Process discount data
      discount: {
        enabled: form.discount.enabled,
        type: form.discount.type,
        value: form.discount.enabled ? parseFloat(form.discount.value) || 0 : 0,
        validUntil: form.discount.validUntil || null,
        description: form.discount.description || ''
      }
    };

    // Conditionally handle stripePriceId - make it optional for Payment Links approach
    if (!payload.isSubscription) {
      delete payload.stripePriceId; // Remove if not a subscription
    }

    try {
      const res = await fetch(`/api/product/${productId}`, {
        method: 'PUT', // Use PUT for updates
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(t('messages.updateSuccess'));
        router.push('/dashboard/product');
      } else {
        const errorData = await res.json();
        toast.error(t('messages.updateError'), {
          description: errorData.message || 'An unknown error occurred.',
        });
      }
    } catch (error) {
      console.error('Update product failed:', error);
      toast.error(t('messages.updateError'), {
        description: 'Network error or server unreachable.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen-minus-header"> {/* Adjust height as needed */}
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <span className="ml-3 text-lg text-gray-700 dark:text-gray-300">Loading product...</span>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{t('editProductTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label htmlFor="name">{t('form.name')}</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder={t('form.name')}
                value={form.name}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">{t('form.description')}</Label>
              <Textarea
                id="description"
                name="description"
                placeholder={t('form.description')}
                value={form.description}
                onChange={handleChange}
                className="mt-1 min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="category">{t('form.category')}</Label>
              <Input
                id="category"
                name="category"
                type="text"
                placeholder={t('form.category')}
                value={form.category}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="price">{t('form.price')}</Label>
              <Input
                id="price"
                name="price"
                type="number"
                placeholder={t('form.price')}
                value={form.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
                className="mt-1"
              />
              {form.discount.enabled && form.price && (
                <p className="text-sm text-green-600 mt-1">
                  Final price: ${calculateDiscountedPrice().toFixed(2)}
                </p>
              )}
            </div>

            {/* Discount Section */}
            <div className="md:col-span-2 border-t pt-4">
              <div className="flex items-center space-x-2 mb-4">
                <Tag className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Discount Settings</h3>
              </div>
              
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  id="discountEnabled"
                  checked={form.discount.enabled}
                  onCheckedChange={(checked) => handleDiscountChange('enabled', checked)}
                />
                <Label htmlFor="discountEnabled">Enable Discount</Label>
              </div>

              {form.discount.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-gray-50">
                  <div>
                    <Label htmlFor="discountType">Discount Type</Label>
                    <Select
                      value={form.discount.type}
                      onValueChange={(value) => handleDiscountChange('type', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select discount type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">
                          <div className="flex items-center">
                            <Percent className="h-4 w-4 mr-2" />
                            Percentage (%)
                          </div>
                        </SelectItem>
                        <SelectItem value="fixed">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2" />
                            Fixed Amount ($)
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="discountValue">
                      {form.discount.type === 'percentage' ? 'Discount Percentage' : 'Discount Amount'}
                    </Label>
                    <Input
                      id="discountValue"
                      type="number"
                      placeholder={form.discount.type === 'percentage' ? '25' : '10.00'}
                      value={form.discount.value}
                      onChange={(e) => handleDiscountChange('value', e.target.value)}
                      step={form.discount.type === 'percentage' ? '1' : '0.01'}
                      min="0"
                      max={form.discount.type === 'percentage' ? '100' : undefined}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="discountValidUntil">Valid Until (Optional)</Label>
                    <Input
                      id="discountValidUntil"
                      type="datetime-local"
                      value={form.discount.validUntil}
                      onChange={(e) => handleDiscountChange('validUntil', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="discountDescription">Discount Badge Text</Label>
                    <Input
                      id="discountDescription"
                      type="text"
                      placeholder="Limited Time Offer"
                      value={form.discount.description}
                      onChange={(e) => handleDiscountChange('description', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="availability">{t('form.availability')}</Label>
              <Input
                id="availability"
                name="availability"
                type="text"
                placeholder={t('form.availability')}
                value={form.availability}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="licenseKey">{t('form.licenseKey')}</Label>
              <Input
                id="licenseKey"
                name="licenseKey"
                type="text"
                placeholder={t('form.licenseKey')}
                value={form.licenseKey}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="apiKey">{t('form.apiKey')}</Label>
              <Input
                id="apiKey"
                name="apiKey"
                type="text"
                placeholder={t('form.apiKey')}
                value={form.apiKey}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            {/* Payment URLs Section */}
            <div className="md:col-span-2 border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">Payment Checkout URLs</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="checkoutUrl">LemonSqueezy Checkout URL</Label>
                  <Input
                    id="checkoutUrl"
                    name="checkoutUrl"
                    type="url"
                    placeholder="https://your.lemonsqueezy.com/checkout/..."
                    value={form.checkoutUrl}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="stripeCheckoutUrl">Stripe Payment Link URL</Label>
                  <Input
                    id="stripeCheckoutUrl"
                    name="stripeCheckoutUrl"
                    type="url"
                    placeholder="https://buy.stripe.com/..."
                    value={form.stripeCheckoutUrl}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mt-2">
                Update your pre-created checkout URLs from payment providers. Create Payment Links in Stripe Dashboard and checkout URLs in LemonSqueezy.
              </p>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="features">{t('form.features')}</Label>
              <Textarea
                id="features"
                name="features"
                placeholder="Feature 1, Feature 2, Another Feature"
                value={form.features}
                onChange={handleChange}
                className="mt-1 min-h-[80px]"
              />
            </div>

            <div className="flex items-center space-x-2 md:col-span-2">
              <Checkbox
                id="isSubscription"
                name="isSubscription"
                checked={form.isSubscription}
                onCheckedChange={(checked) => setForm({
                  ...form,
                  isSubscription: checked,
                  // Clear stripePriceId and subscriptionTiers if it's no longer a subscription
                  ...(checked ? {} : { stripePriceId: '', subscriptionTiers: '' })
                })}
              />
              <Label htmlFor="isSubscription">{t('form.isSubscription')}</Label>
            </div>

            {form.isSubscription && (
              <>
                <div className="md:col-span-2">
                  <Label htmlFor="stripePriceId">{t('form.stripePriceId')} (Optional for Payment Links)</Label>
                  <Input
                    id="stripePriceId"
                    name="stripePriceId"
                    type="text"
                    placeholder={t('form.stripePriceIdPlaceholder')}
                    value={form.stripePriceId}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Only needed if you plan to use Stripe Checkout Sessions. Not required for Payment Links.
                  </p>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="subscriptionTiers">{t('form.subscriptionTiers')}</Label>
                  <Input
                    id="subscriptionTiers"
                    name="subscriptionTiers"
                    type="text"
                    placeholder={t('form.subscriptionTiers')}
                    value={form.subscriptionTiers}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
              </>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPopular"
                name="isPopular"
                checked={form.isPopular}
                onCheckedChange={(checked) => setForm({ ...form, isPopular: checked })}
              />
              <Label htmlFor="isPopular">{t('form.isPopular')}</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="active"
                name="active"
                checked={form.active}
                onCheckedChange={(checked) => setForm({ ...form, active: checked })}
              />
              <Label htmlFor="active">{t('form.active')}</Label>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full md:col-span-2 mt-4">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('form.updateButton')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}