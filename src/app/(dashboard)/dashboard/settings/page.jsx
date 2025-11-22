'use client';

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner"; // For toasts
import { Loader2, Settings, Save, Upload, Download, Undo2 } from "lucide-react"; // Icons

// Shadcn UI Components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch"; // For boolean settings
import { Separator } from "@/components/ui/separator";
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";


export default function SettingsPage() {
  const [settings, setSettings] = useState({});
  const [initialSettings, setInitialSettings] = useState({}); // To check for changes
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const t = useTranslations('settingsManagement'); // Assuming a 'settingsManagement' namespace

  useEffect(() => {
    async function fetchSettings() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/settings");
        if (!res.ok) {
          throw new Error('Failed to fetch settings');
        }
        const data = await res.json();
        setSettings(data);
        setInitialSettings(data); // Store initial settings
      } catch (error) {
        console.error("Failed to load settings:", error);
        toast.error(t('messages.fetchError'), {
          description: error.message || "Could not load application settings.",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchSettings();
  }, [t]);

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        toast.success(t('messages.saveSuccess'));
        setInitialSettings(settings); // Update initial settings after successful save
      } else {
        const errorData = await res.json();
        toast.error(t('messages.saveError'), {
          description: errorData.message || "An unknown error occurred while saving settings.",
        });
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error(t('messages.saveError'), {
        description: "Network error or server unreachable.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackup = async () => {
    setIsBackingUp(true);
    try {
      const res = await fetch("/api/settings/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        toast.success(t('messages.backupSuccess'));
      } else {
        const errorData = await res.json();
        toast.error(t('messages.backupError'), {
          description: errorData.message || "An unknown error occurred during backup.",
        });
      }
    } catch (error) {
      console.error("Backup failed:", error);
      toast.error(t('messages.backupError'), {
        description: "Network error or server unreachable.",
      });
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      const res = await fetch("/api/settings/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        toast.success(t('messages.restoreSuccess'));
        // Re-fetch settings after restore to update UI
        await fetchSettings();
      } else {
        const errorData = await res.json();
        toast.error(t('messages.restoreError'), {
          description: errorData.message || "An unknown error occurred during restore.",
        });
      }
    } catch (error) {
      console.error("Restore failed:", error);
      toast.error(t('messages.restoreError'), {
        description: "Network error or server unreachable.",
      });
    } finally {
      setIsRestoring(false);
    }
  };

  // Helper to compare current settings with initial settings
  const hasChanges = JSON.stringify(settings) !== JSON.stringify(initialSettings);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen-minus-header">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <span className="ml-3 text-lg text-gray-700 dark:text-gray-300">{t('messages.loadingSettings')}</span>
      </div>
    );
  }

  // Example settings structure from your API (you'll adapt this)
  // For demonstration, I'm assuming some common settings fields.
  // Replace these with your actual settings keys from MongoDB.
  const commonSettings = [
    { key: 'appName', label: t('form.appName'), type: 'text', placeholder: t('form.appNamePlaceholder') },
    { key: 'adminEmail', label: t('form.adminEmail'), type: 'email', placeholder: t('form.adminEmailPlaceholder') },
    { key: 'allowRegistrations', label: t('form.allowRegistrations'), type: 'switch' },
    { key: 'maintenanceMode', label: t('form.maintenanceMode'), type: 'switch' },
    { key: 'supportEmail', label: t('form.supportEmail'), type: 'email', placeholder: t('form.supportEmailPlaceholder') },
    { key: 'itemsPerPage', label: t('form.itemsPerPage'), type: 'number', placeholder: "10" }
  ];

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6" /> {t('title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            <h3 className="text-xl font-semibold">{t('sections.generalSettings')}</h3>
            {commonSettings.map(setting => (
              <div key={setting.key}>
                {setting.type === 'switch' ? (
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor={setting.key}>{setting.label}</Label>
                    <Switch
                      id={setting.key}
                      checked={!!settings[setting.key]} // Ensure boolean
                      onCheckedChange={(checked) => handleChange(setting.key, checked)}
                    />
                  </div>
                ) : (
                  <div>
                    <Label htmlFor={setting.key}>{setting.label}</Label>
                    <Input
                      id={setting.key}
                      type={setting.type}
                      name={setting.key}
                      placeholder={setting.placeholder}
                      value={settings[setting.key] || ''}
                      onChange={(e) => handleChange(setting.key, e.target.value)}
                      className="mt-1"
                      required={setting.required}
                    />
                  </div>
                )}
              </div>
            ))}

            <Button type="submit" className="w-full" disabled={isSaving || !hasChanges}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('actions.saveSettings')}
            </Button>
          </form>

          <Separator />

          {/* Backup & Restore Section */}
          <Collapsible className="space-y-4">
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <Download className="h-4 w-4" /> {t('sections.backupRestore')}
                </span>
                {t('sections.backupRestoreDescription')} {/* Description */}
                {/* <ChevronDown className="h-4 w-4" /> */}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 px-4 py-2 bg-muted/30 rounded-md">
              <div>
                <Label>{t('sections.backupSettings')}</Label>
                <p className="text-sm text-muted-foreground mb-2">{t('sections.backupSettingsDescription')}</p>
                <Button onClick={handleBackup} disabled={isBackingUp} className="w-full">
                  {isBackingUp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Upload className="mr-2 h-4 w-4" /> {t('actions.createBackup')}
                </Button>
              </div>

              <Separator />

              <div>
                <Label>{t('sections.restoreSettings')}</Label>
                <p className="text-sm text-muted-foreground mb-2">{t('sections.restoreSettingsDescription')}</p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isRestoring} className="w-full">
                      {isRestoring && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <Undo2 className="mr-2 h-4 w-4" /> {t('actions.restoreBackup')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('messages.restoreConfirmTitle')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('messages.restoreConfirmDescription')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('messages.restoreConfirmCancel')}</AlertDialogCancel>
                      <AlertDialogAction onClick={handleRestore}>
                        {t('messages.restoreConfirmContinue')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  );
}
