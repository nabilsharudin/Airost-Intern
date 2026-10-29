"use client";
import { AlertTriangle, RotateCcw } from "lucide-react";
export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="grid min-h-screen place-items-center bg-[#f7faf8] p-6"><div className="card max-w-md p-8 text-center"><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-red-50 text-red-600"><AlertTriangle /></span><h1 className="mt-4 text-2xl font-black">We couldn’t load the dashboard</h1><p className="mt-2 text-sm leading-6 text-slate-500">{error.message || "The database did not respond. Your data is safe—please try again."}</p><button className="btn-primary mt-6" onClick={reset}><RotateCcw size={15} />Try again</button></div></main>;
}
