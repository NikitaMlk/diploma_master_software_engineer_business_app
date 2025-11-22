"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PostLoginRedirector() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      const { role, id } = session.user;

      if (role === "admin" || role === "owner") {
        router.push("/dashboard");
      } else {
        router.push(`/u/${id}`);
      }
    }
  }, [status, session, router]);

  return null;
}
