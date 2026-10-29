"use client";
import { useRouter } from "next/navigation";
import { LogOut, ShieldCheck } from "lucide-react";
import { Brand } from "@/components/brand";
import { createClient } from "@/lib/supabase/supabaseClient";
import type { Profile } from "@/lib/types";
export function DashboardHeader({ profile }: { profile: Profile }) {
  const router = useRouter();
  async function signOut() { await createClient().auth.signOut(); router.push("/login"); router.refresh(); }
  return <header className="border-b border-[#dfe8e2] bg-white/90 px-4 py-3 backdrop-blur md:px-7"><div className="mx-auto flex max-w-[1440px] items-center justify-between"><Brand /><div className="flex items-center gap-3"><div className="hidden text-right sm:block"><p className="max-w-52 truncate text-sm font-bold">{profile.email}</p><p className="flex items-center justify-end gap-1 text-xs capitalize text-slate-500">{profile.role === "treasurer" && <ShieldCheck size={12} />}{profile.role}</p></div><button className="btn-secondary size-10 p-0" onClick={signOut} aria-label="Sign out"><LogOut size={16} /></button></div></div></header>;
}
