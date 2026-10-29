import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export const formatCurrency = (amount: number | string) => new Intl.NumberFormat("en-MY", { style: "currency", currency: "MYR" }).format(Number(amount));
export const formatDate = (date: string) => new Intl.DateTimeFormat("en-MY", { day: "numeric", month: "short", year: "numeric" }).format(new Date(date));
