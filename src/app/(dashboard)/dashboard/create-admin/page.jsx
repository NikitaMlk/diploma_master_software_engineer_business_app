'use client';

import { useState, useEffect } from "react";
import { Trash, Plus, Loader2, UserPlus } from "lucide-react"; // Added UserPlus icon
import { useTranslations } from "next-intl"; // Added useTranslations
import { toast } from "sonner"; // For toasts

// Shadcn UI Components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Separator } from "@/components/ui/separator";

export default function CreateAdmin() {
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin", // lowercase for new API
  });
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(true); // Loading state for fetching admins
  const [isSubmittingForm, setIsSubmittingForm] = useState(false); // Loading state for form submission

  const t = useTranslations('createAdmin'); // Initialize useTranslations

  useEffect(() => {
    async function fetchAdmins() {
      setIsLoadingAdmins(true);
      try {
        const res = await fetch("/api/users/admins");
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch admins: ${res.status} - ${errorText}`);
        }
        const data = await res.json();
        setAdmins(data || []); // Ensure data is an array
      } catch (error) {
        console.error("Failed to fetch admins:", error);
        toast.error(t('messages.fetchError'), {
          description: error.message || "Could not load admin users.",
        });
        setAdmins([]); // Clear admins on error
      } finally {
        setIsLoadingAdmins(false);
      }
    }
    fetchAdmins();
  }, [t]); // Depend on t for re-fetching on language change if needed

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (value) => {
    setFormData({ ...formData, role: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingForm(true); // Start submitting

    try {
      const res = await fetch("/api/users/admins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success(t('messages.createSuccess', { name: result.name, role: result.role }));
        // Assuming result includes the newly created admin object with an 'id' or '_id'
        // Using `_id` as per other APIs, falling back to `id` if present
        setAdmins((prevAdmins) => [...prevAdmins, { ...result, _id: result._id || result.id }]);
        setFormData({ name: "", email: "", password: "", role: "admin" }); // Reset form
      } else {
        toast.error(t('messages.createError'), {
          description: result.error || "An unknown error occurred while creating admin.",
        });
      }
    } catch (error) {
      console.error("Failed to create admin:", error);
      toast.error(t('messages.createError'), {
        description: "Network error or server unreachable.",
      });
    } finally {
      setIsSubmittingForm(false); // Stop submitting
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/users/admins/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (res.ok) {
        setAdmins(admins.filter((admin) => (admin._id || admin.id) !== id)); // Handle both _id and id
        toast.success(t('messages.deleteSuccess'));
      } else {
        toast.error(t('messages.deleteError'), {
          description: result.error || "An unknown error occurred while deleting admin.",
        });
      }
    } catch (error) {
      console.error("Failed to delete admin:", error);
      toast.error(t('messages.deleteError'), {
        description: "Network error or server unreachable.",
      });
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <UserPlus className="h-6 w-6" /> {t('title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Create Admin Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">{t('form.namePlaceholder')}</Label>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder={t('form.namePlaceholder')}
                value={formData.name}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">{t('form.emailPlaceholder')}</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder={t('form.emailPlaceholder')}
                value={formData.email}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">{t('form.passwordPlaceholder')}</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder={t('form.passwordPlaceholder')}
                value={formData.password}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="role">{t('form.roleLabel')}</Label>
              <Select onValueChange={handleSelectChange} value={formData.role}>
                <SelectTrigger id="role" className="w-full mt-1">
                  <SelectValue placeholder={t('form.roleLabel')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">{t('form.roleOptions.admin')}</SelectItem>
                  <SelectItem value="owner">{t('form.roleOptions.owner')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmittingForm}>
              {isSubmittingForm && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('form.createButton')}
            </Button>
          </form>

          <Separator />

          {/* Admin List */}
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('list.title')}</h3>
          {isLoadingAdmins ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-gray-700 dark:text-gray-300">{t('list.loadingAdmins')}</span>
            </div>
          ) : admins.length === 0 ? (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              {t('list.noAdminsFound')}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('list.tableHeaders.name')}</TableHead>
                    <TableHead>{t('list.tableHeaders.email')}</TableHead>
                    <TableHead>{t('list.tableHeaders.role')}</TableHead>
                    <TableHead className="text-right">{t('list.tableHeaders.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.map((admin) => (
                    <TableRow key={admin._id || admin.id}>
                      <TableCell className="font-medium">{admin.name}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>{t(`form.roleOptions.${admin.role}`)}</TableCell>
                      <TableCell className="text-right">
                        {/* Only allow deletion if not 'owner' role. Adjust logic based on your backend rules. */}
                        {admin.role !== "owner" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash className="h-4 w-4" />
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
                                <AlertDialogAction onClick={() => handleDelete(admin._id || admin.id)}>
                                  {t('deleteConfirmContinue')}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
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
