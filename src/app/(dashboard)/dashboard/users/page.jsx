'use client';

import { useState, useEffect } from "react";
import { Search, Ban, CheckCircle, Edit, Trash, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation"; // To navigate to edit page

// Shadcn UI Components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { toast } from "sonner"; // For toasts

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true); // Loading state for initial fetch
  const router = useRouter(); // For potential navigation (e.g., edit user)
  const t = useTranslations("userManagement"); // Translations for user management page

  // Fetch users from API
  useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/users");
        if (!res.ok) {
          throw new Error('Failed to fetch users data');
        }
        const data = await res.json();
        setUsers(data.users || []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast.error(t('messages.fetchError'), {
          description: error.message || "Could not retrieve user list. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchUsers();
  }, [t]); // Depend on t for re-fetching on language change if needed

  const filteredUsers = users.filter((user) => {
    const matchesFilter = filter === "all" || user.status === filter;
    const matchesSearch =
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleBanUnban = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "banned" : "active";

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === id ? { ...user, status: newStatus } : user
          )
        );
        toast.success(t('messages.statusUpdateSuccess'));
      } else {
        const errorData = await res.json();
        toast.error(t('messages.statusUpdateError'), {
          description: errorData.message || "An unknown error occurred while updating status.",
        });
      }
    } catch (error) {
      console.error("Failed to update user status:", error);
      toast.error(t('messages.statusUpdateError'), {
        description: "Network error or server unreachable while updating status.",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setUsers(users.filter((user) => user._id !== id));
        toast.success(t('messages.deleteSuccess'));
      } else {
        const errorData = await res.json();
        toast.error(t('messages.deleteError'), {
          description: errorData.message || "An unknown error occurred while deleting user.",
        });
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error(t('messages.deleteError'), {
        description: "Network error or server unreachable while deleting user.",
      });
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{t('title')}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
              <Input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t('filterBy')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filterOptions.all')}</SelectItem>
                <SelectItem value="active">{t('filterOptions.active')}</SelectItem>
                <SelectItem value="banned">{t('filterOptions.banned')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-gray-700 dark:text-gray-300">{t('messages.loadingUsers')}</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              {t('messages.noUsersFound')}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('tableHeaders.name')}</TableHead>
                    <TableHead>{t('tableHeaders.email')}</TableHead>
                    <TableHead>{t('tableHeaders.status')}</TableHead>
                    <TableHead className="text-right">{t('tableHeaders.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user.name || "—"}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            user.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                          }`}
                        >
                          {t(`status.${user.status}`)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        {/* Ban/Unban Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBanUnban(user._id, user.status)}
                          className="mr-2"
                        >
                          {user.status === "active" ? (
                            <Ban className="h-4 w-4" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                          <span className="sr-only sm:not-sr-only sm:ml-1">
                            {user.status === "active" ? t('actions.ban') : t('actions.unban')}
                          </span>
                        </Button>
                        {/* Delete Button with AlertDialog */}
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
                              <AlertDialogAction onClick={() => handleDelete(user._id)}>
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
