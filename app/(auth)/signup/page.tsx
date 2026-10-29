import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
export default function SignupPage() { return <AuthShell title="Join your society" subtitle="Create a member account to start submitting expenses."><AuthForm mode="signup" /></AuthShell>; }
