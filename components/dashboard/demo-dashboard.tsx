"use client";
import { useEffect, useState } from "react";
import { BarChart3, Check, CircleDollarSign, Clock3, FileText, Landmark, Plus, ReceiptText, ShieldCheck, UploadCloud, UserRound, X } from "lucide-react";
import { BudgetCard } from "./budget-card";
import type { Expense, Project, Role } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

const initialProjects: Project[] = [
  { id: "orientation", name: "Orientation Week", allocated_budget: 5000, current_spent: 1840.5, created_at: new Date().toISOString() },
  { id: "outreach", name: "Community Outreach", allocated_budget: 2500, current_spent: 1725, created_at: new Date().toISOString() },
  { id: "dinner", name: "Annual Society Dinner", allocated_budget: 8000, current_spent: 2160, created_at: new Date().toISOString() },
];
const initialExpenses: Expense[] = [
  { id: "e1", project_id: "orientation", user_id: "member", amount: 286.4, description: "Printing orientation flyers and welcome packs", receipt_url: "demo-receipt.jpg", status: "pending", submitted_at: new Date().toISOString(), projects: { name: "Orientation Week" }, users: { email: "amira@university.edu" } },
  { id: "e2", project_id: "outreach", user_id: "member", amount: 145, description: "Refreshments for volunteer briefing", receipt_url: null, status: "pending", submitted_at: new Date(Date.now() - 86400000).toISOString(), projects: { name: "Community Outreach" }, users: { email: "daniel@university.edu" } },
];

export function DemoDashboard() {
  const [role, setRole] = useState<Role>("treasurer");
  const [projects, setProjects] = useState(initialProjects);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [description, setDescription] = useState(""); const [amount, setAmount] = useState(""); const [projectId, setProjectId] = useState(initialProjects[0].id); const [notice, setNotice] = useState("");
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = localStorage.getItem("clubledger-demo");
      if (saved) { try { const value = JSON.parse(saved); setProjects(value.projects); setExpenses(value.expenses); } catch {} }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  function save(nextProjects: Project[], nextExpenses: Expense[]) { setProjects(nextProjects); setExpenses(nextExpenses); localStorage.setItem("clubledger-demo", JSON.stringify({ projects: nextProjects, expenses: nextExpenses })); }
  function decide(expense: Expense, status: "approved" | "rejected") {
    const nextExpenses = expenses.map(item => item.id === expense.id ? { ...item, status } : item) as Expense[];
    const nextProjects = status === "approved" ? projects.map(p => p.id === expense.project_id ? { ...p, current_spent: Number(p.current_spent) + Number(expense.amount) } : p) : projects;
    save(nextProjects, nextExpenses); setNotice(`Expense ${status}. Budget totals updated locally.`);
  }
  function submit(e: React.FormEvent) {
    e.preventDefault(); const project = projects.find(p => p.id === projectId)!;
    const next: Expense = { id: crypto.randomUUID(), project_id: projectId, user_id: "demo-member", amount: Number(amount), description, receipt_url: null, status: "pending", submitted_at: new Date().toISOString(), projects: { name: project.name }, users: { email: "you@university.edu" } };
    save(projects, [next, ...expenses]); setDescription(""); setAmount(""); setNotice("Demo expense submitted. Switch to Treasurer to review it.");
  }
  const pending = expenses.filter(e => e.status === "pending"); const spent = projects.reduce((sum,p) => sum + Number(p.current_spent), 0); const allocated = projects.reduce((sum,p) => sum + Number(p.allocated_budget), 0);
  return <main className="min-h-screen grid-texture">
    <div className="bg-[#113a29] px-4 py-2 text-center text-xs font-bold text-emerald-50">Demo mode · Sample data is stored only in this browser · Supabase is not connected</div>
    <header className="border-b border-slate-200 bg-white px-4 py-3 md:px-7"><div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2.5"><span className="grid size-9 place-items-center rounded-xl bg-emerald-600 text-white"><Landmark size={19} /></span><span className="text-lg font-black">ClubLedger</span></div><div className="flex rounded-xl bg-slate-100 p-1"><button onClick={() => setRole("member")} className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold ${role === "member" ? "bg-white shadow-sm" : "text-slate-500"}`}><UserRound size={14} />Member view</button><button onClick={() => setRole("treasurer")} className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold ${role === "treasurer" ? "bg-white shadow-sm" : "text-slate-500"}`}><ShieldCheck size={14} />Treasurer view</button></div></div></header>
    <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-7">
      {notice && <div className="mb-5 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"><span>{notice}</span><button onClick={() => setNotice("")}><X size={16} /></button></div>}
      {role === "treasurer" ? <>
        <div className="mb-7"><p className="text-sm font-bold text-emerald-700">Treasury command centre</p><h1 className="mt-1 text-3xl font-black">Financial overview</h1><p className="mt-1 text-slate-500">This is interactive demo data—approve a request to see budgets change.</p></div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[[CircleDollarSign,"Total allocated",formatCurrency(allocated)],[BarChart3,"Approved spend",formatCurrency(spent)],[Clock3,"Awaiting approval",String(pending.length)],[ReceiptText,"All claims",String(expenses.length)]].map(([Icon,label,value]) => { const I = Icon as typeof CircleDollarSign; return <div className="card flex items-center gap-4 p-4" key={label as string}><span className="grid size-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-700"><I size={20} /></span><div><p className="text-xs text-slate-500">{label as string}</p><p className="mt-0.5 text-xl font-black">{value as string}</p></div></div>; })}</div>
        <section className="mt-8"><h2 className="mb-3 font-black">Budget health</h2><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{projects.map(p => <BudgetCard detailed key={p.id} project={p} />)}</div></section>
        <section className="mt-8"><h2 className="font-black">Approval workspace</h2><p className="mb-3 mt-0.5 text-xs text-slate-500">Review pending sample claims.</p><div className="card overflow-hidden">{pending.length ? pending.map(expense => <div key={expense.id} className="grid border-b border-slate-100 last:border-0 md:grid-cols-[1fr_260px]"><div className="flex min-h-44 items-center justify-center bg-slate-100 p-6 text-slate-400"><div className="text-center"><FileText className="mx-auto" size={38} /><p className="mt-2 text-xs">Demo receipt preview</p></div></div><div className="p-5"><p className="text-xs text-slate-400">{expense.projects?.name}</p><h3 className="mt-2 font-black">{expense.description}</h3><p className="mt-2 text-xl font-black text-emerald-700">{formatCurrency(expense.amount)}</p><p className="mt-2 text-xs text-slate-500">{expense.users?.email} · {formatDate(expense.submitted_at)}</p><div className="mt-5 grid grid-cols-2 gap-2"><button onClick={() => decide(expense,"approved")} className="btn-primary bg-emerald-600"><Check size={15} />Approve</button><button onClick={() => decide(expense,"rejected")} className="btn-secondary text-red-600"><X size={15} />Reject</button></div></div></div>) : <div className="p-12 text-center"><Check className="mx-auto text-emerald-600" /><p className="mt-2 font-black">All caught up</p></div>}</div></section>
      </> : <>
        <div className="mb-7"><p className="text-sm font-bold text-emerald-700">Member workspace</p><h1 className="mt-1 text-3xl font-black">Good to see you.</h1><p className="mt-1 text-slate-500">Explore budgets and submit a simulated expense.</p></div>
        <div className="grid items-start gap-6 xl:grid-cols-[1fr_420px]"><div><h2 className="mb-3 font-black">Active budgets</h2><div className="grid gap-4 md:grid-cols-2">{projects.map(p => <BudgetCard key={p.id} project={p} />)}</div><h2 className="mb-3 mt-7 font-black">My recent expenses</h2><div className="card divide-y divide-slate-100">{expenses.slice(0,5).map(e => <div className="flex items-center justify-between gap-4 p-4" key={e.id}><div><p className="text-sm font-bold">{e.description}</p><p className="mt-1 text-xs text-slate-500">{e.projects?.name} · <span className="capitalize">{e.status}</span></p></div><strong>{formatCurrency(e.amount)}</strong></div>)}</div></div>
          <form onSubmit={submit} className="card p-5 xl:sticky xl:top-5"><p className="text-xs font-black tracking-wider text-emerald-700 uppercase">New claim</p><h2 className="mt-1 text-xl font-black">Submit an expense</h2><div className="mt-5 space-y-4"><div><label className="label">Project</label><select className="field" value={projectId} onChange={e => setProjectId(e.target.value)}>{projects.map(p => <option value={p.id} key={p.id}>{p.name}</option>)}</select></div><div><label className="label">Amount (MYR)</label><input className="field" type="number" min="0.01" step="0.01" required value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" /></div><div><label className="label">Description</label><textarea className="field min-h-24" required minLength={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="What was this for?" /></div><div className="rounded-xl border-2 border-dashed border-slate-200 p-5 text-center text-slate-400"><UploadCloud className="mx-auto" /><p className="mt-2 text-xs">Receipt upload preview</p></div><button className="btn-primary w-full"><Plus size={15} />Submit demo expense</button></div></form></div>
      </>}
    </div>
  </main>;
}
