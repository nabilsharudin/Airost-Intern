"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { createClient } from "@/lib/supabase/supabaseClient";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); const [message, setMessage] = useState(""); const [success, setSuccess] = useState(false);
  const isLogin = mode === "login";
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setMessage(""); setSuccess(false);
    const supabase = createClient();
    const result = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${location.origin}/auth/confirm` } });
    if (result.error) { setMessage(result.error.message); setLoading(false); return; }
    if (!isLogin && !result.data.session) { setSuccess(true); setMessage("Check your inbox to confirm your account, then sign in."); setLoading(false); return; }
    router.push("/dashboard"); router.refresh();
  }
  return <form onSubmit={submit} className="space-y-5">
    {message && <Alert message={message} success={success} />}
    <div><label className="label" htmlFor="email">Email address</label><div className="relative"><Mail className="absolute left-3.5 top-3 size-4 text-slate-400" /><input id="email" className="field pl-10" type="email" autoComplete="email" placeholder="you@university.edu" value={email} onChange={e => setEmail(e.target.value)} required /></div></div>
    <div><label className="label" htmlFor="password">Password</label><div className="relative"><LockKeyhole className="absolute left-3.5 top-3 size-4 text-slate-400" /><input id="password" className="field pl-10" type="password" minLength={8} autoComplete={isLogin ? "current-password" : "new-password"} placeholder="At least 8 characters" value={password} onChange={e => setPassword(e.target.value)} required /></div></div>
    <button className="btn-primary w-full" disabled={loading}>{loading ? <LoaderCircle className="size-4 animate-spin" /> : <>{isLogin ? "Sign in" : "Create member account"}<ArrowRight size={16} /></>}</button>
    <p className="text-center text-sm text-slate-500">{isLogin ? "New to ClubLedger?" : "Already have an account?"} <Link className="font-bold text-emerald-700 hover:underline" href={isLogin ? "/signup" : "/login"}>{isLogin ? "Create an account" : "Sign in"}</Link></p>
  </form>;
}
