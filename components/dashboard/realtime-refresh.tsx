"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/supabaseClient";
export function RealtimeRefresh() {
  const router = useRouter();
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel("dashboard-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "projects" }, () => router.refresh())
      .on("postgres_changes", { event: "*", schema: "public", table: "expenses" }, () => router.refresh())
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [router]);
  return null;
}
