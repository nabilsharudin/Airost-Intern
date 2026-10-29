"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileCheck2, LoaderCircle, Paperclip, Receipt, UploadCloud, X } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { createClient } from "@/lib/supabase/supabaseClient";
import type { Project } from "@/lib/types";
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
export function ExpenseForm({ projects, userId }: { projects: Project[]; userId: string }) {
  const router = useRouter(); const inputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1); const [projectId, setProjectId] = useState(projects[0]?.id ?? "");
  const [amount, setAmount] = useState(""); const [description, setDescription] = useState(""); const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false); const [loading, setLoading] = useState(false); const [message, setMessage] = useState(""); const [success, setSuccess] = useState(false);
  function choose(next: File | undefined) {
    if (!next) return; setMessage("");
    if (!ACCEPTED.includes(next.type)) return setMessage("Use a JPG, PNG, WebP, or PDF receipt.");
    if (next.size > 5 * 1024 * 1024) return setMessage("Receipt files must be 5 MB or smaller."); setFile(next);
  }
  async function submit() {
    setLoading(true); setMessage(""); const supabase = createClient(); let receiptPath: string | null = null;
    if (file) {
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]/g, "-");
      receiptPath = `${userId}/${crypto.randomUUID()}-${safeName}`;
      const { error } = await supabase.storage.from("receipts").upload(receiptPath, file, { contentType: file.type, upsert: false });
      if (error) { setMessage(`Receipt upload failed: ${error.message}`); setLoading(false); return; }
    }
    const { error } = await supabase.from("expenses").insert({ project_id: projectId, user_id: userId, amount: Number(amount), description: description.trim(), receipt_url: receiptPath, status: "pending" });
    if (error) { if (receiptPath) await supabase.storage.from("receipts").remove([receiptPath]); setMessage(error.message); setLoading(false); return; }
    setSuccess(true); setMessage("Expense submitted for treasury review."); setAmount(""); setDescription(""); setFile(null); setStep(1); setLoading(false); router.refresh();
  }
  if (!projects.length) return <div className="card p-8 text-center"><Receipt className="mx-auto mb-3 text-slate-300" size={34} /><h3 className="font-black">No projects yet</h3><p className="mt-1 text-sm text-slate-500">Ask your treasurer to create a project before submitting an expense.</p></div>;
  return <div className="card overflow-hidden">
    <div className="border-b border-slate-100 p-5"><div className="flex items-center justify-between"><div><p className="text-xs font-black tracking-wider text-emerald-700 uppercase">New claim</p><h2 className="mt-1 text-xl font-black">Submit an expense</h2></div><span className="text-xs font-bold text-slate-400">Step {step} of 2</span></div><div className="mt-4 grid grid-cols-2 gap-2"><div className={`h-1 rounded-full ${step >= 1 ? "bg-emerald-500" : "bg-slate-100"}`} /><div className={`h-1 rounded-full ${step >= 2 ? "bg-emerald-500" : "bg-slate-100"}`} /></div></div>
    <div className="p-5">{message && <div className="mb-4"><Alert message={message} success={success} /></div>}
      {step === 1 ? <div className="space-y-5">
        <div><label className="label" htmlFor="project">Project</label><select id="project" className="field" value={projectId} onChange={e => setProjectId(e.target.value)}>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
        <div><label className="label" htmlFor="amount">Amount (MYR)</label><input id="amount" className="field text-lg font-bold" type="number" min="0.01" step="0.01" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} /></div>
        <div><label className="label" htmlFor="description">What was this for?</label><textarea id="description" className="field min-h-24 resize-none" maxLength={500} placeholder="e.g. Printing 100 orientation flyers" value={description} onChange={e => setDescription(e.target.value)} /><p className="mt-1 text-right text-xs text-slate-400">{description.length}/500</p></div>
        <button className="btn-primary w-full" disabled={!projectId || Number(amount) <= 0 || description.trim().length < 3} onClick={() => { setMessage(""); setSuccess(false); setStep(2); }}>Continue to receipt</button>
      </div> : <div className="space-y-5">
        <div onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); choose(e.dataTransfer.files[0]); }} onClick={() => inputRef.current?.click()} className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition ${dragging ? "border-emerald-500 bg-emerald-50" : "border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40"}`}>
          <input ref={inputRef} className="hidden" type="file" accept={ACCEPTED.join(",")} onChange={e => choose(e.target.files?.[0])} />
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700"><UploadCloud /></span><p className="mt-3 font-black">Drop your receipt here</p><p className="mt-1 text-xs text-slate-500">or tap to browse · JPG, PNG, WebP or PDF · max 5 MB</p>
        </div>
        {file && <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3"><FileCheck2 className="shrink-0 text-emerald-700" size={20} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{file.name}</p><p className="text-xs text-slate-500">{(file.size / 1024).toFixed(0)} KB</p></div><button onClick={() => setFile(null)} aria-label="Remove file"><X size={17} /></button></div>}
        <div className="rounded-xl bg-slate-50 p-4 text-sm"><div className="flex justify-between"><span className="text-slate-500">Amount</span><strong>RM {Number(amount).toFixed(2)}</strong></div><div className="mt-2 flex justify-between gap-4"><span className="text-slate-500">Description</span><strong className="text-right">{description}</strong></div></div>
        <div className="grid grid-cols-[auto_1fr] gap-2"><button className="btn-secondary" onClick={() => setStep(1)}>Back</button><button className="btn-primary" onClick={submit} disabled={loading}>{loading ? <><LoaderCircle className="size-4 animate-spin" />Submitting</> : <><Paperclip size={15} />Submit expense</>}</button></div>
      </div>}
    </div>
  </div>;
}
