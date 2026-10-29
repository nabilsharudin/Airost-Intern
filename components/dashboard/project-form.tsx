"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/supabaseClient";
export function ProjectForm() {
  const router = useRouter(); const [open, setOpen] = useState(false); const [name, setName] = useState(""); const [budget, setBudget] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  async function create(e: React.FormEvent) { e.preventDefault(); setLoading(true); setError(""); const { error } = await createClient().from("projects").insert({ name: name.trim(), allocated_budget: Number(budget) }); if (error) { setError(error.message); setLoading(false); return; } setName(""); setBudget(""); setOpen(false); setLoading(false); router.refresh(); }
  if (!open) return <button className="btn-primary" onClick={() => setOpen(true)}><Plus size={16} />New project</button>;
  return <form onSubmit={create} className="flex flex-wrap items-end gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3"><div><label className="label mb-1">Project name</label><input className="field w-52 py-2" value={name} onChange={e => setName(e.target.value)} minLength={2} required placeholder="Orientation Week" /></div><div><label className="label mb-1">Budget (MYR)</label><input className="field w-36 py-2" type="number" min="0" step="0.01" value={budget} onChange={e => setBudget(e.target.value)} required placeholder="5000" /></div><button className="btn-primary py-2" disabled={loading}>{loading ? <LoaderCircle size={15} className="animate-spin" /> : "Create"}</button><button type="button" className="btn-secondary py-2" onClick={() => setOpen(false)}>Cancel</button>{error && <p className="w-full text-xs text-red-700">{error}</p>}</form>;
}
