'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner"; // For toasts
import { Loader2 } from "lucide-react"; // For loading spinner

// Shadcn UI Components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"; // Although not used directly, good to have for forms

export default function CreateBlog() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    slug: "",
    image: "",
  });
  const [isLoading, setIsLoading] = useState(false); // Loading state for submission
  const t = useTranslations('createBlog'); // Translations for create blog page

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      const response = await fetch("/api/posts/all", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(t('messages.createSuccess')); // Sonner success toast
        router.push("/dashboard/blog");
      } else {
        const errorData = await response.json();
        toast.error(t('messages.createError'), { // Sonner error toast
          description: errorData.message || "An unknown error occurred. Please try again.",
        });
      }
    } catch (error) {
      console.error("Failed to create blog post:", error);
      toast.error(t('messages.createError'), { // Sonner error toast for network issues
        description: "Network error or server unreachable. Please check your connection.",
      });
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{t('title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">{t('form.titlePlaceholder')}</Label>
              <Input
                id="title"
                type="text"
                name="title"
                placeholder={t('form.titlePlaceholder')}
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="content">{t('form.contentPlaceholder')}</Label>
              <Textarea
                id="content"
                name="content"
                placeholder={t('form.contentPlaceholder')}
                value={formData.content}
                onChange={handleChange}
                className="mt-1 h-40"
                required
              />
            </div>
            <div>
              <Label htmlFor="slug">{t('form.slugPlaceholder')}</Label>
              <Input
                id="slug"
                type="text"
                name="slug"
                placeholder={t('form.slugPlaceholder')}
                value={formData.slug}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="image">{t('form.imagePlaceholder')}</Label>
              <Input
                id="image"
                type="text"
                name="image"
                placeholder={t('form.imagePlaceholder')}
                value={formData.image}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('form.createButton')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
