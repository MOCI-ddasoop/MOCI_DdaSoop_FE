"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

function isAdminRole(role: string | undefined): boolean {
  if (!role) return false;
  const upper = role.toUpperCase();
  return upper === "ADMIN" || upper.includes("ADMIN");
}

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const me = useAuthStore((s) => s.me);
  const accessToken = useAuthStore((s) => s.accessToken);
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAuthReady(true), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!authReady) return;

    if (!accessToken) {
      router.replace("/");
      return;
    }
    if (me === null) {
      fetchMe().catch(() => router.replace("/"));
      return;
    }
    if (!isAdminRole(me.role)) {
      router.replace("/");
    }
  }, [authReady, accessToken, me, router, fetchMe]);

  if (!authReady) {
    return (
      <div className="pt-[60px] flex items-center justify-center min-h-[200px] text-gray-500">
        확인 중...
      </div>
    );
  }

  if (!accessToken) {
    return null;
  }

  if (me === null) {
    return (
      <div className="pt-[60px] flex items-center justify-center min-h-[200px] text-gray-500">
        확인 중...
      </div>
    );
  }

  if (!isAdminRole(me.role)) {
    return null;
  }

  return <>{children}</>;
}
