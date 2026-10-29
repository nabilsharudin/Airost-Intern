import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { MemberDashboard } from "@/components/dashboard/member-dashboard";
import { TreasurerDashboard } from "@/components/dashboard/treasurer-dashboard";
import { RealtimeRefresh } from "@/components/dashboard/realtime-refresh";
import { createClient } from "@/lib/supabase/server";
import type { Expense, Profile, Project } from "@/lib/types";
import { hasSupabaseConfig } from "@/lib/config";
import { DemoDashboard } from "@/components/dashboard/demo-dashboard";

export default async function DashboardPage() {
  if (!hasSupabaseConfig()) return <DemoDashboard />;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profileData, error: profileError } = await supabase.from("users").select("id,email,role").eq("id", user.id).single();
  if (profileError) throw new Error(`Could not load your profile: ${profileError.message}`);
  const profile = profileData as Profile;
  const { data: projectData, error: projectError } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
  if (projectError) throw new Error(`Could not load projects: ${projectError.message}`);
  const projects = (projectData ?? []) as Project[];
  let content: React.ReactNode;
  if (profile.role === "treasurer") {
    const { data, error } = await supabase.from("expenses").select("*, projects(name), users(email)").eq("status", "pending").order("submitted_at", { ascending: true });
    if (error) throw new Error(`Could not load pending requests: ${error.message}`);
    const expenses = (data ?? []) as unknown as Expense[];
    const withReceipts = await Promise.all(expenses.map(async expense => {
      if (!expense.receipt_url) return { ...expense, signedReceiptUrl: null };
      const { data: signed } = await supabase.storage.from("receipts").createSignedUrl(expense.receipt_url, 3600);
      return { ...expense, signedReceiptUrl: signed?.signedUrl ?? null };
    }));
    content = <TreasurerDashboard projects={projects} pendingExpenses={withReceipts} />;
  } else {
    const { data, error } = await supabase.from("expenses").select("*, projects(name)").eq("user_id", user.id).order("submitted_at", { ascending: false }).limit(8);
    if (error) throw new Error(`Could not load your expenses: ${error.message}`);
    content = <MemberDashboard profile={profile} projects={projects} expenses={(data ?? []) as unknown as Expense[]} />;
  }
  return <main className="min-h-screen grid-texture"><RealtimeRefresh /><DashboardHeader profile={profile} />{content}</main>;
}
