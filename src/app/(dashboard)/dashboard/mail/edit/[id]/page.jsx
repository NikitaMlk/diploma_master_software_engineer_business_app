'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner"; // For toasts
import { Pencil, Upload, Calendar, Repeat2, Loader2, Send } from "lucide-react"; // Icons

// Shadcn UI Components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function EditEmailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    subject: "",
    content: "",
    schedule: "immediate",
    scheduledDate: "",
    repeat: false,
  });
  const [isLoading, setIsLoading] = useState(true); // For initial data fetch
  const [isSubmitting, setIsSubmitting] = useState(false); // For form submission
  const t = useTranslations('editMail'); // Translations for edit mail page

  useEffect(() => {
    async function fetchData() {
      if (!id) return; // Don't fetch if ID is not available yet
      setIsLoading(true);
      try {
        const res = await fetch(`/api/emails/${id}`);
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch email: ${res.status} - ${errorText}`);
        }
        const data = await res.json();
        setFormData({
          subject: data.subject ?? "",
          content: data.content ?? "",
          schedule: data.schedule ?? "immediate",
          scheduledDate: data.scheduledDate
            ? new Date(data.scheduledDate).toISOString().slice(0, 16) // Format for datetime-local input
            : "",
          repeat: data.repeat ?? false,
        });
      } catch (err) {
        console.error("Failed to fetch email for editing:", err);
        toast.error(t('messages.fetchError'), {
          description: err.message || "Could not load email template details.",
        });
        router.push('/dashboard/mail'); // Redirect if template not found or error
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id, router, t]); // Depend on id, router, and t

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({ ...prev, content: event.target?.result || "" }));
      };
      reader.onerror = (error) => {
        console.error("File reading error:", error);
        toast.error(t('messages.fileReadError'), {
          description: "Could not read the selected file.",
        });
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Start submitting

    try {
      const payload = {
        ...formData,
        scheduledDate: formData.schedule === "scheduled" ? formData.scheduledDate : undefined,
      };

      const res = await fetch(`/api/emails/${id}`, {
        method: "PUT", // Use PUT for updates
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(t('messages.updateSuccess'));
        router.push("/dashboard/mail");
      } else {
        const errorData = await res.json();
        toast.error(t('messages.updateError'), {
          description: errorData.message || "An unknown error occurred. Please try again.",
        });
      }
    } catch (error) {
      console.error("Failed to update email template:", error);
      toast.error(t('messages.updateError'), {
        description: "Network error or server unreachable. Please check your connection.",
      });
    } finally {
      setIsSubmitting(false); // Stop submitting
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen-minus-header">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <span className="ml-3 text-lg text-gray-700 dark:text-gray-300">Loading email template...</span>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Pencil className="h-6 w-6" /> {t('title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="subject">{t('form.subjectPlaceholder')}</Label>
              <Input
                id="subject"
                type="text"
                name="subject"
                placeholder={t('form.subjectPlaceholder')}
                value={formData.subject}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="file-upload" className="mb-1">{t('form.fileUploadLabel')}</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".html"
                onChange={handleFileUpload}
                className="mt-1 file:text-blue-600 file:bg-blue-50 file:border-blue-200"
              />
              <p className="text-sm text-muted-foreground mt-1">{t('form.fileUploadHelp')}</p>
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

            <Separator />

            {/* Scheduling */}
            <div className="space-y-4">
              <Label htmlFor="schedule">{t('form.sendTimingLabel')}</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, schedule: value }))} value={formData.schedule}>
                <SelectTrigger id="schedule" className="w-full">
                  <SelectValue placeholder={t('form.sendTimingLabel')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">
                    <span className="flex items-center gap-2"><Send className="h-4 w-4" /> {t('form.scheduleImmediate')}</span>
                  </SelectItem>
                  <SelectItem value="scheduled">
                    <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {t('form.scheduleScheduled')}</span>
                  </SelectItem>
                </SelectContent>
              </Select>

              {formData.schedule === "scheduled" && (
                <div>
                  <Label htmlFor="scheduledDate" className="mt-4 block">{t('form.scheduledDateLabel')}</Label>
                  <Input
                    id="scheduledDate"
                    type="datetime-local"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={handleChange}
                    className="mt-1"
                    required
                  />
                </div>
              )}

              <div className="flex items-center space-x-2 mt-4">
                <Checkbox
                  id="repeat"
                  name="repeat"
                  checked={formData.repeat}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, repeat: checked }))}
                />
                <Label htmlFor="repeat" className="flex items-center gap-2">
                  <Repeat2 className="h-4 w-4" /> {t('form.repeatEmailLabel')}
                </Label>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('form.updateButton')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
