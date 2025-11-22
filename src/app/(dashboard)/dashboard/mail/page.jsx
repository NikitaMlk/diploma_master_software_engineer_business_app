'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner"; // For toasts
import { Plus, Pencil, Trash2, Send, Mail, Users, User, FlaskConical, Loader2 } from "lucide-react";

// Shadcn UI Components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Separator } from "@/components/ui/separator"; // For visual separation

export default function MailDashboard() {
  const router = useRouter();
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(""); // Stores _id of selected email
  const [audience, setAudience] = useState("all");
  const [role, setRole] = useState(""); // Initialize role as empty string
  const [testEmail, setTestEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false); // For send button
  const [isFetchingEmails, setIsFetchingEmails] = useState(true); // For initial email fetch

  const t = useTranslations('mailManagement');

  useEffect(() => {
    async function fetchEmails() {
      setIsFetchingEmails(true);
      try {
        const res = await fetch("/api/emails");
        if (!res.ok) {
          throw new Error("Failed to fetch email templates");
        }
        const data = await res.json();
        setEmails(data.emails || []);
        // If data is fetched and there are emails, select the first one by default
        if (data.emails && data.emails.length > 0) {
          setSelectedEmail(data.emails[0]._id);
        } else {
          setSelectedEmail(""); // Clear selection if no emails
        }
      } catch (err) {
        console.error("Failed to fetch emails:", err);
        toast.error(t('messages.fetchError'), {
          description: err.message || "Could not load email templates.",
        });
      } finally {
        setIsFetchingEmails(false);
      }
    }
    fetchEmails();
  }, [t]); // Dependency array includes t for re-fetching on locale changes

  const handleSend = async () => {
    if (!selectedEmail) {
      toast.error(t('messages.selectTemplateError'));
      return;
    }
    if (audience === "role" && !role.trim()) {
      toast.error(t('messages.roleRequiredError'));
      return;
    }
    if (audience === "test" && !testEmail.trim()) {
      toast.error(t('messages.testEmailRequiredError'));
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`/api/emails/${selectedEmail}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audience,
          role: audience === "role" ? role.trim() : undefined, // Send role only if audience is 'role'
          testEmail: audience === "test" ? testEmail.trim() : undefined, // Send testEmail only if audience is 'test'
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || t('messages.sendSuccess'));
      } else {
        toast.error(t('messages.sendError'), {
          description: data.error || "An unknown error occurred while sending emails.",
        });
      }
    } catch (err) {
      console.error("Error sending email:", err);
      toast.error(t('messages.sendError'), {
        description: "Network error or server unreachable.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedEmail) return; // Should not happen if button is conditionally rendered

    try {
      const res = await fetch(`/api/emails/${selectedEmail}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || t('messages.deleteSuccess'));
        setEmails((prev) => prev.filter((e) => e._id !== selectedEmail));
        // After deleting, try to select the first email, or clear if none remain
        if (emails.length > 1) { // If there are other emails left after deletion
            setSelectedEmail(emails.filter(e => e._id !== selectedEmail)[0]?._id || "");
        } else {
            setSelectedEmail(""); // No emails left
        }
      } else {
        toast.error(t('messages.deleteError'), {
          description: data.error || "An unknown error occurred while deleting template.",
        });
      }
    } catch (err) {
      console.error("Error deleting email:", err);
      toast.error(t('messages.deleteError'), {
        description: "Network error or server unreachable.",
      });
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-xl mx-auto">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Mail className="h-6 w-6" /> {t('title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => router.push("/dashboard/mail/add")}>
              <Plus className="mr-2 h-4 w-4" /> {t('addEmailButton')}
            </Button>

            {selectedEmail && ( // Only show edit/delete if an email is selected
              <>
                <Button variant="outline" onClick={() => router.push(`/dashboard/mail/edit/${selectedEmail}`)}>
                  <Pencil className="mr-2 h-4 w-4" /> {t('editSelectedButton')}
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> {t('deleteButton')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('messages.deleteConfirmTitle')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('messages.deleteConfirmDescription')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('messages.deleteConfirmCancel')}</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>
                        {t('messages.deleteConfirmContinue')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>

          <Separator />

          {/* Select Email Template */}
          <div>
            <Label htmlFor="email-template-select" className="mb-1">{t('selectTemplateLabel')}</Label>
            {isFetchingEmails ? (
              <div className="flex items-center text-gray-500">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <span>{t('messages.loadingTemplates')}</span>
              </div>
            ) : emails.length === 0 ? (
              <p className="text-gray-500">{t('messages.noTemplatesFound')}</p>
            ) : (
              <Select onValueChange={setSelectedEmail} value={selectedEmail}>
                <SelectTrigger id="email-template-select">
                  {/* Removed explicit placeholder SelectValue to allow auto-display based on `value` */}
                  <SelectValue placeholder={t('selectTemplatePlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {/* Removed the SelectItem with value="" */}
                  {emails.map((e) => (
                    <SelectItem key={e._id} value={e._id}>
                      {e.subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Audience Selector */}
          <div>
            <Label htmlFor="audience-select" className="mb-1">{t('targetAudienceLabel')}</Label>
            <Select onValueChange={setAudience} value={audience}>
              <SelectTrigger id="audience-select">
                <SelectValue placeholder={t('audienceOptions.all')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <span className="flex items-center gap-2"><Users className="h-4 w-4" /> {t('audienceOptions.all')}</span>
                </SelectItem>
                <SelectItem value="role">
                  <span className="flex items-center gap-2"><User className="h-4 w-4" /> {t('audienceOptions.role')}</span>
                </SelectItem>
                <SelectItem value="test">
                  <span className="flex items-center gap-2"><FlaskConical className="h-4 w-4" /> {t('audienceOptions.test')}</span>
                </SelectItem>
              </SelectContent>
            </Select>

            {audience === "role" && (
              <div className="mt-4">
                <Label htmlFor="role-input" className="sr-only">Role</Label>
                <Input
                  id="role-input"
                  type="text"
                  placeholder={t('rolePlaceholder')}
                  className="w-full"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Test Email Field */}
          {audience === "test" && (
            <div>
              <Label htmlFor="test-email-input" className="mb-1">{t('testEmailLabel')}</Label>
              <Input
                id="test-email-input"
                type="email"
                placeholder={t('testEmailPlaceholder')}
                className="w-full"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
            </div>
          )}

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={isLoading || isFetchingEmails || emails.length === 0}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('sendingEmailButton')}
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" /> {t('sendEmailButton')}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
