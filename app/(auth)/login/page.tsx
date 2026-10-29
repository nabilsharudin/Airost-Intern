import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
export default function LoginPage() { return <AuthShell title="Welcome back" subtitle="Sign in to continue to your society dashboard."><AuthForm mode="login" /></AuthShell>; }
