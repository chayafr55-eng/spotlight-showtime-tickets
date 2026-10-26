import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthCard } from "@/components/AuthCard";
import { actions } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "התחברות – טיקסה" }, { name: "description", content: "התחברו לחשבון טיקסה שלכם." }, { property: "og:title", content: "התחברות – טיקסה" }, { property: "og:description", content: "התחברו לחשבון טיקסה." }] }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  return (
    <AuthCard title="ברוכים השבים" subtitle="התחברו כדי להזמין כרטיסים">
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); const r = actions.login(email.trim(), password); if (r) setErr(r); else nav({ to: "/account" }); }}>
        <input className="field" type="email" placeholder="אימייל" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="field" type="password" placeholder="סיסמה" required value={password} onChange={(e) => setPassword(e.target.value)} />
        {err && <p className="text-sm text-destructive">{err}</p>}
        <button className="btn-primary w-full">התחברות</button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">אין לכם חשבון? <Link to="/signup" className="text-primary">הרשמה</Link></p>
    </AuthCard>
  );
}
