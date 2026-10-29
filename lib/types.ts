export type Role = "member" | "treasurer";
export type ExpenseStatus = "pending" | "approved" | "rejected";
export interface Profile { id: string; email: string; role: Role }
export interface Project { id: string; name: string; allocated_budget: number; current_spent: number; created_at: string }
export interface Expense {
  id: string; project_id: string; user_id: string; amount: number; description: string; receipt_url: string | null;
  status: ExpenseStatus; submitted_at: string; projects?: { name: string } | null; users?: { email: string } | null;
  signedReceiptUrl?: string | null;
}
