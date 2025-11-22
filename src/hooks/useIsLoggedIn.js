import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function useIsLoggedIn() {
  const { data: session, status } = useSession();
  const [localAuth, setLocalAuth] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLocalAuth(!!token);

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const role = payload?.role;
        if (role) setUserRole(role.toLowerCase());
      } catch {
        // token is invalid or not JWT
        setUserRole(null);
      }
    }

    setLoading(false);
  }, []);

  const isLoggedIn =
    status === "authenticated" || (status === "unauthenticated" && localAuth);

  const role = userRole || session?.user?.role?.toLowerCase() || null;

  return { isLoggedIn, loading: status === "loading" || loading, role };
}
