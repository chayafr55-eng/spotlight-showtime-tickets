import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthCard } from "@/components/AuthCard";
import { actions } from "@/lib/store";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "הרשמה – טיקסה" }, { name: "description", content: "פתחו חשבון טיקסה בחינם." }, { property: "og:title", content: "הרשמה – טיקסה" }, { property: "og:description", content: "פתחו חשבון טיקסה." }] }),
  component: Signup,
});

function Signup() {
  const nav = useNavigate();
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  return (
    <AuthCard title="הצטרפו לטיקסה" subtitle="חשבון אחד לכל הסרטים וההופעות">
      <form className="space-y-4" onSubmit={(e) => {
        e.preventDefault();
        if (f.password.length < 6) return setErr("סיסמה של 6 תווים לפחות");
        const r = actions.signup({ ...f, email: f.email.trim() });
        if (r) setErr(r); else nav({ to: "/account" });
      }}>
        <input className="field" placeholder="שם מלא" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        <input className="field" type="email" placeholder="אימייל" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        <input className="field" type="password" placeholder="סיסמה" required value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
        {err && <p className="text-sm text-destructive">{err}</p>}
        <button className="btn-primary w-full">יצירת חשבון</button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">כבר רשומים? <Link to="/login" className="text-primary">התחברות</Link></p>
    </AuthCard>
  );
}
