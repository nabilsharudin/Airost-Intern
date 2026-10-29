import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
export function Alert({ message, success = false }: { message: string; success?: boolean }) {
  return <div role="alert" className={cn("flex items-start gap-2 rounded-xl border px-3.5 py-3 text-sm", success ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800")}>
    {success ? <CheckCircle2 className="mt-0.5 size-4 shrink-0" /> : <AlertCircle className="mt-0.5 size-4 shrink-0" />}<span>{message}</span>
  </div>;
}
