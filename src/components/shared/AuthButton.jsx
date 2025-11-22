"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const AuthButton = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const buttonBase =
    "px-4 py-2 rounded-lg transition font-medium border text-sm flex items-center justify-center";
  const buttonVariant =
    "bg-black text-white border-black hover:bg-white hover:text-black dark:bg-white dark:text-black dark:border-white dark:hover:bg-black dark:hover:text-white";

  const handleSignIn = () => {
    router.push('/auth/signin');
  };

  return (
    <div className="flex space-x-4 min-h-[42px]">
      <button
        onClick={handleSignIn}
        className={`${buttonBase} ${buttonVariant}`}
      >
        Sign In
      </button>
    </div>
  );
};

export default AuthButton;
