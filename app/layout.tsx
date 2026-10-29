import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClubLedger — Society Budget Tracker",
  description: "Simple, transparent club budgets and expense approvals.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
