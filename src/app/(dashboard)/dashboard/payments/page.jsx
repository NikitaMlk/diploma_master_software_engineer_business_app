'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns'; // For date formatting
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
import { toast } from "sonner"; // For toasts
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, Pencil, Trash2, Plus } from "lucide-react"; // Icons

export default function PaymentsPage() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const t = useTranslations('paymentsManagement');

  useEffect(() => {
    async function fetchTransactions() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/transactions');
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch transactions: ${res.status} - ${errorText}`);
        }
        const data = await res.json();
        setTransactions(data.transactions || []);
      } catch (err) {
        console.error('Failed to load transactions:', err);
        toast.error(t('messages.fetchError'), {
          description: err.message || 'Could not retrieve payment list.',
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchTransactions();
  }, [t]);

  const handleDelete = async (id) => {
    try {
      // Note: The provided DELETE API expects query param: /api/transactions?id={id}
      const res = await fetch(`/api/transactions?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTransactions(prev => prev.filter(p => p._id !== id));
        toast.success(t('messages.deleteSuccess'));
      } else {
        const errorData = await res.json();
        toast.error(t('messages.deleteError'), {
          description: errorData.message || 'An unknown error occurred.',
        });
      }
    } catch (error) {
      console.error('Delete transaction failed:', error);
      toast.error(t('messages.deleteError'), {
        description: 'Network error or server unreachable.',
      });
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-full mx-auto">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">{t('title')}</CardTitle>
          {/* If you have an "Add Payment" page, you can uncomment and link this button */}
          {/* <Button onClick={() => router.push('/dashboard/payments/add')}>
            <Plus className="mr-2 h-4 w-4" /> Add Payment
          </Button> */}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">{t('messages.loadingPayments')}</span>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              {t('messages.noPaymentsFound')}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('tableHeaders.transactionId')}</TableHead>
                    <TableHead>{t('tableHeaders.userId')}</TableHead>
                    <TableHead>{t('tableHeaders.productId')}</TableHead>
                    <TableHead>{t('tableHeaders.amount')}</TableHead>
                    <TableHead>{t('tableHeaders.currency')}</TableHead>
                    <TableHead>{t('tableHeaders.status')}</TableHead>
                    <TableHead>{t('tableHeaders.paymentMethod')}</TableHead>
                    <TableHead>{t('tableHeaders.createdAt')}</TableHead>
                    <TableHead className="text-right">{t('tableHeaders.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map(payment => (
                    <TableRow key={payment._id}>
                      <TableCell className="font-medium max-w-[150px] truncate">{payment._id}</TableCell>
                      <TableCell className="max-w-[150px] truncate">{payment.userId || 'N/A'}</TableCell>
                      <TableCell className="max-w-[150px] truncate">{payment.productId || 'N/A'}</TableCell>
                      <TableCell>{Number(payment.amount).toFixed(2)}</TableCell>
                      <TableCell>{payment.currency}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            payment.status === "Paid"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                              : payment.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                          }`}
                        >
                          {t(`status.${payment.status}`)}
                        </span>
                      </TableCell>
                      <TableCell>{payment.paymentMethod}</TableCell>
                      <TableCell>
                        {payment.createdAt ? format(new Date(payment.createdAt), 'yyyy-MM-dd HH:mm') : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only sm:not-sr-only sm:ml-1">{t('actions.delete')}</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t('deleteConfirmTitle')}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {t('deleteConfirmDescription')}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t('deleteConfirmCancel')}</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(payment._id)}>
                                {t('deleteConfirmContinue')}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
