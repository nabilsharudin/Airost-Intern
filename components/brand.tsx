import { Landmark } from "lucide-react";
export function Brand({ light = false }: { light?: boolean }) {
  return <div className="flex items-center gap-2.5">
    <span className={light ? "grid size-9 place-items-center rounded-xl bg-white text-emerald-700" : "grid size-9 place-items-center rounded-xl bg-emerald-600 text-white"}><Landmark size={19} /></span>
    <span className={light ? "text-lg font-black tracking-tight text-white" : "text-lg font-black tracking-tight"}>ClubLedger</span>
  </div>;
}
