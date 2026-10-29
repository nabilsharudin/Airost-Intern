import { BarChart3, CheckCircle2, ReceiptText } from "lucide-react";
import { Brand } from "@/components/brand";
export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return <main className="grid min-h-screen lg:grid-cols-[1.05fr_.95fr]">
    <section className="relative hidden overflow-hidden bg-[#113a29] p-12 text-white lg:flex lg:flex-col lg:justify-between">
      <div className="absolute inset-0 opacity-20 grid-texture" /><div className="relative"><Brand light /></div>
      <div className="relative max-w-xl"><span className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold tracking-wider uppercase">Made for campus teams</span><h1 className="text-5xl font-black leading-[1.06] tracking-[-.04em]">Every ringgit,<br />clear and accounted for.</h1><p className="mt-5 max-w-md text-lg leading-7 text-emerald-100/80">Submit expenses in seconds. Review receipts in one place. Keep every project on budget.</p></div>
      <div className="relative grid grid-cols-3 gap-3">{[[ReceiptText,"Fast claims"],[CheckCircle2,"Clear approvals"],[BarChart3,"Live budgets"]].map(([Icon,label]) => { const I = Icon as typeof ReceiptText; return <div key={label as string} className="rounded-2xl border border-white/10 bg-white/7 p-4"><I size={20} className="mb-5 text-emerald-300" /><p className="text-sm font-bold">{label as string}</p></div>; })}</div>
    </section>
    <section className="flex items-center justify-center px-6 py-14"><div className="w-full max-w-md"><div className="mb-10 lg:hidden"><Brand /></div><p className="mb-2 text-xs font-black tracking-[.16em] text-emerald-700 uppercase">Club finance, simplified</p><h2 className="text-3xl font-black tracking-tight">{title}</h2><p className="mt-2 mb-8 text-slate-500">{subtitle}</p>{children}</div></section>
  </main>;
}
