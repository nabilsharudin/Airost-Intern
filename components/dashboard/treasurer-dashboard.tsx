import { CircleDollarSign, Clock3, FolderKanban, TrendingUp } from "lucide-react";
import type { Expense, Project } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { ApprovalWorkspace } from "./approval-workspace";
import { BudgetCard } from "./budget-card";
import { ProjectForm } from "./project-form";
export function TreasurerDashboard({ projects, pendingExpenses }: { projects: Project[]; pendingExpenses: Expense[] }) {
  const allocated = projects.reduce((sum, p) => sum + Number(p.allocated_budget), 0); const spent = projects.reduce((sum, p) => sum + Number(p.current_spent), 0); const burn = allocated ? Math.round(spent / allocated * 100) : 0;
  const metrics = [[CircleDollarSign,"Total allocated",formatCurrency(allocated)],[TrendingUp,"Approved spend",formatCurrency(spent)],[Clock3,"Awaiting approval",String(pendingExpenses.length)],[FolderKanban,"Active projects",String(projects.length)]] as const;
  return <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-7"><div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold text-emerald-700">Treasury command centre</p><h1 className="mt-1 text-3xl font-black tracking-tight">Financial overview</h1><p className="mt-1 text-slate-500">Review requests and keep every project within plan.</p></div><ProjectForm /></div>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(([Icon,label,value]) => <div className="card flex items-center gap-4 p-4" key={label}><span className="grid size-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-700"><Icon size={20} /></span><div><p className="text-xs text-slate-500">{label}</p><p className="mt-0.5 text-xl font-black">{value}</p></div></div>)}</div>
    <section className="mt-8"><div className="mb-3 flex items-end justify-between"><div><h2 className="font-black">Budget health</h2><p className="mt-0.5 text-xs text-slate-500">Overall burn rate: {burn}%</p></div><span className="text-xs text-slate-400">Updates after every approval</span></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{projects.map(p => <BudgetCard detailed key={p.id} project={p} />)}{!projects.length && <div className="card col-span-full p-8 text-center text-sm text-slate-500">Create your first project to start tracking a budget.</div>}</div></section>
    <section className="mt-8"><div className="mb-3"><h2 className="font-black">Approval workspace</h2><p className="mt-0.5 text-xs text-slate-500">Compare each claim with its receipt before making a decision.</p></div><ApprovalWorkspace expenses={pendingExpenses} /></section></div>;
}
