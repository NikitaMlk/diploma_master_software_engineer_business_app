'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Pencil, Trash, Plus, Loader2 } from "lucide-react"; // Added Loader2 icon
import { useTranslations } from "next-intl"; // Added useTranslations

// Shadcn UI Components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
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

export default function BlogManagement() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Renamed `loading` to `isLoading` for consistency
  const t = useTranslations('blogManagement'); // Initialize useTranslations

  useEffect(() => {
    fetchBlogs();
  }, [t]); // Depend on t for re-fetching on language change if needed

  async function fetchBlogs() {
    setIsLoading(true); // Set loading true at start of fetch
    try {
      const res = await fetch("/api/posts/all");
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch blogs: ${res.status} - ${errorText}`);
      }

      const data = await res.json();

      if (Array.isArray(data.posts)) {
        setBlogs(data.posts);
      } else {
        throw new Error("Invalid API response: Expected an array of posts.");
      }
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
      toast.error(t('messages.fetchError'), {
        description: err.message || "Could not retrieve blog posts. Please try again.",
      });
      setBlogs([]); // Ensure blogs array is empty on error
    } finally {
      setIsLoading(false); // Set loading false at end of fetch
    }
  }

  async function deleteBlog(id) {
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete blog");
      }
      toast.success(t('messages.deleteSuccess'));
      fetchBlogs(); // Refresh list after deletion
    } catch (err) {
      console.error("Failed to delete blog:", err);
      toast.error(t('messages.deleteError'), {
        description: err.message || "An unknown error occurred.",
      });
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">{t('title')}</CardTitle>
          <Button asChild>
            <Link href="/dashboard/blog/create">
              <Plus className="w-4 h-4 mr-2" /> {t('addPostButton')}
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-gray-700 dark:text-gray-300">{t('messages.loadingPosts')}</span>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              {t('messages.noPostsFound')}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('tableHeaders.title')}</TableHead>
                    <TableHead className="text-right">{t('tableHeaders.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogs.map((blog) => (
                    <TableRow key={blog._id}>
                      <TableCell className="font-medium">{blog.title}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button asChild variant="outline" size="sm" className="mr-2">
                          <Link href={`/dashboard/blog/edit/${blog._id}`}>
                            <Pencil className="w-4 h-4" />
                            <span className="sr-only sm:not-sr-only sm:ml-1">{t('actions.edit')}</span>
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash className="w-4 h-4" />
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
                              <AlertDialogAction onClick={() => deleteBlog(blog._id)}>
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
