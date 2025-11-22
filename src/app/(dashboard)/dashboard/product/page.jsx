'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Pencil, Trash2, Info, Tag, Percent, DollarSign } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const t = useTranslations('productManagement');

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/product');
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch products: ${res.status} - ${errorText}`);
        }
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error('Failed to load products:', err);
        toast.error(t('messages.fetchError'), {
          description: err.message || 'Could not retrieve product list. Check console for details.',
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, [t]);

  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`/api/product/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter(p => p._id !== id));
        toast.success(t('messages.deleteSuccess'));
      } else {
        const errorData = await res.json();
        toast.error(t('messages.deleteError'), {
          description: errorData.message || 'An unknown error occurred.',
        });
      }
    } catch (error) {
      console.error('Delete product failed:', error);
      toast.error(t('messages.deleteError'), {
        description: 'Network error or server unreachable.',
      });
    }
  };

  // Helper function to calculate discounted price
  const calculateDiscountedPrice = (originalPrice, discount) => {
    if (!discount?.enabled || discount.value === null || discount.value === undefined) return originalPrice;
    
    // Handle MongoDB numeric types and regular numbers
    const discountValue = Number(discount.value) || 0;
    if (discountValue <= 0) return originalPrice;
    
    if (discount.type === 'percentage') {
      return originalPrice * (1 - discountValue / 100);
    } else if (discount.type === 'fixed') {
      return Math.max(0, originalPrice - discountValue);
    }
    
    return originalPrice;
  };

  // Helper function to check if discount is currently valid
  const isDiscountValid = (discount) => {
    if (!discount?.enabled) return false;
    if (!discount.validUntil) return true;
    
    // Handle different date formats from MongoDB
    const validUntilDate = new Date(discount.validUntil);
    const now = new Date();
    
    return validUntilDate > now;
  };

  return (
    <div className="p-6 md:p-8 max-w-full mx-auto">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">{t('list.title')}</CardTitle>
          <Button onClick={() => router.push('/dashboard/product/add')}>
            <Plus className="mr-2 h-4 w-4" /> {t('list.addProductButton')}
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">{t('list.loadingProducts')}</span>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              {t('list.noProductsFound')}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>{t('list.tableHeaders.name')}</TableHead>
                    <TableHead>{t('list.tableHeaders.category')}</TableHead>
                    <TableHead>{t('list.tableHeaders.price')}</TableHead>
                    <TableHead>{t('list.tableHeaders.isSubscription')}</TableHead>
                    <TableHead>{t('list.tableHeaders.isPopular')}</TableHead>
                    <TableHead>{t('list.tableHeaders.active')}</TableHead>
                    <TableHead className="w-[100px]">Discount</TableHead>
                    <TableHead className="w-[80px]">Details</TableHead>
                    <TableHead className="text-right">{t('list.tableHeaders.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map(p => {
                    const hasValidDiscount = isDiscountValid(p.discount);
                    const discountedPrice = calculateDiscountedPrice(Number(p.price), p.discount);
                    const originalPrice = Number(p.price);
                    
                    return (
                      <TableRow key={p._id}>
                        <TableCell className="font-mono text-xs">{p._id}</TableCell>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>{p.category}</TableCell>
                        <TableCell>
                          {hasValidDiscount && discountedPrice < originalPrice ? (
                            <div className="flex flex-col">
                              <span className="line-through text-gray-500 text-sm">
                                ${originalPrice.toFixed(2)}
                              </span>
                              <span className="text-green-600 font-medium">
                                ${discountedPrice.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span>${originalPrice.toFixed(2)}</span>
                          )}
                        </TableCell>
                        <TableCell>{p.isSubscription ? 'Yes' : 'No'}</TableCell>
                        <TableCell>{p.isPopular ? 'Yes' : 'No'}</TableCell>
                        <TableCell>{p.active ? 'Yes' : 'No'}</TableCell>
                        <TableCell>
                          {hasValidDiscount && Number(p.discount.value) > 0 ? (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {p.discount.type === 'percentage' ? (
                                <>
                                  <Percent className="h-3 w-3" />
                                  {Number(p.discount.value)}%
                                </>
                              ) : (
                                <>
                                  <DollarSign className="h-3 w-3" />
                                  ${Number(p.discount.value)}
                                </>
                              )}
                            </Badge>
                          ) : p.discount?.enabled ? (
                            <Badge variant="outline" className="text-gray-400">
                              <Tag className="h-3 w-3 mr-1" />
                              Expired
                            </Badge>
                          ) : (
                            <span className="text-gray-400 text-sm">None</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Info className="h-4 w-4" />
                              </Button>
                            </HoverCardTrigger>
                            <HoverCardContent 
                              className="w-80 max-w-[90vw] p-4 max-h-[80vh] overflow-y-auto" 
                              side="left" 
                              align="start"
                              sideOffset={5}
                            >
                              <div className="space-y-2">
                                {/* Discount Information Section */}
                                {p.discount?.enabled && (
                                  <div className="border-b pb-2 mb-2">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Tag className="h-4 w-4" />
                                      <p className="text-sm font-semibold">Discount Details:</p>
                                    </div>
                                    <div className="pl-6 space-y-1">
                                      <div className="flex items-center gap-1 text-sm">
                                        <span className="font-medium">Type:</span>
                                        {p.discount.type === 'percentage' ? (
                                          <div className="flex items-center gap-1">
                                            <Percent className="h-3 w-3" />
                                            <span>{Number(p.discount.value)}% off</span>
                                          </div>
                                        ) : (
                                          <div className="flex items-center gap-1">
                                            <DollarSign className="h-3 w-3" />
                                            <span>${Number(p.discount.value)} off</span>
                                          </div>
                                        )}
                                      </div>
                                      <p className="text-sm">
                                        <span className="font-medium">Original Price:</span> ${originalPrice.toFixed(2)}
                                      </p>
                                      <p className="text-sm">
                                        <span className="font-medium">Discounted Price:</span>{' '}
                                        <span className="text-green-600">${discountedPrice.toFixed(2)}</span>
                                      </p>
                                      {p.discount.description && (
                                        <p className="text-sm">
                                          <span className="font-medium">Badge:</span> {p.discount.description}
                                        </p>
                                      )}
                                      {p.discount.validUntil && (
                                        <p className="text-sm">
                                          <span className="font-medium">Valid Until:</span>{' '}
                                          <span className={hasValidDiscount ? 'text-green-600' : 'text-red-600'}>
                                            {new Date(p.discount.validUntil).toLocaleString()}
                                          </span>
                                        </p>
                                      )}
                                      <div className="flex items-center gap-2 text-sm">
                                        <span className="font-medium">Status:</span>
                                        <Badge variant={hasValidDiscount ? 'default' : 'destructive'} className="text-xs">
                                          {hasValidDiscount ? 'Active' : 'Expired/Invalid'}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {p.isSubscription && p.stripePriceId && (
                                    <div>
                                        <p className="text-sm font-semibold">Stripe Price ID:</p>
                                        <p className="text-sm text-muted-foreground break-all">{p.stripePriceId}</p>
                                    </div>
                                )}
                                {p.description && (
                                  <div>
                                    <p className="text-sm font-semibold">Description:</p>
                                    <p className="text-sm text-muted-foreground">{p.description}</p>
                                  </div>
                                )}
                                {p.availability && (
                                  <div>
                                    <p className="text-sm font-semibold">Availability:</p>
                                    <p className="text-sm text-muted-foreground">{p.availability}</p>
                                  </div>
                                )}
                                {p.subscriptionTiers && Array.isArray(p.subscriptionTiers) && p.subscriptionTiers.length > 0 && (
                                  <div>
                                    <p className="text-sm font-semibold">Tiers:</p>
                                    <p className="text-sm text-muted-foreground">{p.subscriptionTiers.join(', ')}</p>
                                  </div>
                                )}
                                {p.licenseKey && (
                                  <div>
                                    <p className="text-sm font-semibold">License Key:</p>
                                    <p className="text-sm text-muted-foreground break-all">{p.licenseKey}</p>
                                  </div>
                                )}
                                {p.apiKey && (
                                  <div>
                                    <p className="text-sm font-semibold">API Key:</p>
                                    <p className="text-sm text-muted-foreground break-all">{p.apiKey}</p>
                                  </div>
                                )}
                                
                                {/* Payment URLs Section */}
                                {(p.checkoutUrl || p.stripeCheckoutUrl) && (
                                  <div className="border-t pt-2">
                                    <p className="text-sm font-semibold mb-2">Payment URLs:</p>
                                    
                                    {p.checkoutUrl && (
                                      <div className="mb-2">
                                        <p className="text-xs font-medium text-muted-foreground">LemonSqueezy:</p>
                                        <a 
                                          href={p.checkoutUrl} 
                                          target="_blank" 
                                          rel="noopener noreferrer" 
                                          className="text-sm text-blue-500 hover:underline break-all"
                                          title="Open LemonSqueezy checkout"
                                        >
                                          {p.checkoutUrl}
                                        </a>
                                      </div>
                                    )}
                                    
                                    {p.stripeCheckoutUrl && (
                                      <div className="mb-2">
                                        <p className="text-xs font-medium text-muted-foreground">Stripe:</p>
                                        <a 
                                          href={p.stripeCheckoutUrl} 
                                          target="_blank" 
                                          rel="noopener noreferrer" 
                                          className="text-sm text-blue-500 hover:underline break-all"
                                          title="Open Stripe Payment Link"
                                        >
                                          {p.stripeCheckoutUrl}
                                        </a>
                                      </div>
                                    )}
                                    
                                    {!p.checkoutUrl && !p.stripeCheckoutUrl && (
                                      <p className="text-xs text-yellow-600">No payment URLs configured</p>
                                    )}
                                  </div>
                                )}
                                
                                {p.features && Array.isArray(p.features) && p.features.length > 0 && (
                                  <div>
                                    <p className="text-sm font-semibold">Features:</p>
                                    <p className="text-sm text-muted-foreground">{p.features.join(', ')}</p>
                                  </div>
                                )}

                                {/* Timestamps */}
                                {(p.createdAt || p.updatedAt) && (
                                  <div className="border-t pt-2">
                                    {p.createdAt && (
                                      <div>
                                        <p className="text-xs font-medium text-muted-foreground">Created:</p>
                                        <p className="text-xs text-muted-foreground">
                                          {new Date(p.createdAt).toLocaleDateString()}
                                        </p>
                                      </div>
                                    )}
                                    {p.updatedAt && (
                                      <div>
                                        <p className="text-xs font-medium text-muted-foreground">Updated:</p>
                                        <p className="text-xs text-muted-foreground">
                                          {new Date(p.updatedAt).toLocaleDateString()}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/dashboard/product/edit/${p._id}`)}
                            className="mr-2"
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only sm:not-sr-only sm:ml-1">{t('list.editButton')}</span>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only sm:not-sr-only sm:ml-1">{t('list.deleteButton')}</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{t('list.deleteConfirmTitle')}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t('list.deleteConfirmDescription')}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t('list.deleteConfirmCancel')}</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteProduct(p._id)}>
                                  {t('list.deleteConfirmContinue')}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}