import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
export function BudgetCard({ project, detailed = false }: { project: Project; detailed?: boolean }) {
  const percentage = project.allocated_budget ? Math.min(100, Math.round((Number(project.current_spent) / Number(project.allocated_budget)) * 100)) : 0;
  const remaining = Number(project.allocated_budget) - Number(project.current_spent);
  const tone = percentage >= 90 ? "bg-red-500" : percentage >= 70 ? "bg-amber-400" : "bg-emerald-500";
  return <article className="card p-5">
    <div className="flex items-start justify-between"><div><p className="text-xs font-bold tracking-wider text-slate-400 uppercase">Project budget</p><h3 className="mt-1 text-lg font-black">{project.name}</h3></div><span className="grid size-8 place-items-center rounded-full bg-emerald-50 text-emerald-700"><ArrowUpRight size={16} /></span></div>
    <div className="mt-7 flex items-end justify-between"><div><p className="text-xs text-slate-500">Remaining</p><p className="mt-1 text-xl font-black">{formatCurrency(remaining)}</p></div><p className="text-sm font-black text-slate-500">{percentage}%</p></div>
    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${tone}`} style={{ width: `${percentage}%` }} /></div>
    <div className="mt-3 flex justify-between text-xs text-slate-500"><span>{formatCurrency(project.current_spent)} spent</span><span>{formatCurrency(project.allocated_budget)} total</span></div>
    {detailed && <p className="mt-4 border-t border-slate-100 pt-4 text-xs text-slate-500">{percentage >= 90 ? "Budget needs attention" : percentage >= 70 ? "Spend is approaching the limit" : "Spending is on track"}</p>}
  </article>;
}
