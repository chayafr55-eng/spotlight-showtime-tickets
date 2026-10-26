import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { actions, fmtDate, useCurrentUser, useStore } from "@/lib/store";
import { charge, formatCard, TEST_CARDS } from "@/lib/payment";

export const Route = createFileRoute("/checkout/$id")({
  validateSearch: (s: Record<string, unknown>) => ({ qty: Math.max(1, Number(s["qty"]) || 1) }),
  head: () => ({ meta: [{ title: "תשלום – טיקסה" }, { name: "description", content: "תשלום מאובטח על הכרטיסים." }, { property: "og:title", content: "תשלום – טיקסה" }, { property: "og:description", content: "תשלום על כרטיסים." }] }),
  component: Checkout,
});

function Checkout() {
  const { id } = Route.useParams();
  const { qty } = Route.useSearch();
  const ev = useStore((s) => s.events.find((e) => e.id === id));
  const user = useCurrentUser();
  const nav = useNavigate();
  const [card, setCard] = useState("");
  const [exp, setExp] = useState("12/29");
  const [cvv, setCvv] = useState("123");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  if (!user) return <p className="p-20 text-center">יש <Link to="/login" className="text-primary">להתחבר</Link> כדי לשלם</p>;
  if (!ev) return <p className="p-20 text-center">האירוע לא נמצא</p>;

  const pay = (e: React.FormEvent) => {
    e.preventDefault(); setErr(""); setBusy(true);
    setTimeout(() => {
      const r = charge(card);
      setBusy(false);
      if (!r.ok) return setErr(r.error);
      const b = actions.book(ev.id, qty, card.replace(/\s/g, "").slice(-4));
      nav({ to: "/confirmation/$bookingId", params: { bookingId: b.id } });
    }, 900);
  };

  return (
    <main className="mx-auto grid max-w-5xl gap-8 px-4 py-12 md:grid-cols-5">
      <form onSubmit={pay} className="glass space-y-5 rounded-3xl p-8 md:col-span-3">
        <h1 className="text-4xl">תשלום</h1>
        <div className="ticket-gradient relative h-48 overflow-hidden rounded-2xl p-6" dir="ltr">
          <div className="absolute -top-10 -left-10 size-40 rounded-full bg-background/10" />
          <p className="font-display text-sm opacity-70">TIXA CARD</p>
          <p className="mt-10 font-mono text-2xl tracking-widest">{card || "•••• •••• •••• ••••"}</p>
          <div className="mt-4 flex justify-between text-sm"><span>{user.name.toUpperCase()}</span><span>{exp}</span></div>
        </div>
        <input className="field font-mono" dir="ltr" inputMode="numeric" placeholder="0000 0000 0000 0000" required value={card} onChange={(e) => setCard(formatCard(e.target.value))} />
        <div className="grid grid-cols-2 gap-4">
          <input className="field" dir="ltr" placeholder="MM/YY" required value={exp} onChange={(e) => setExp(e.target.value)} />
          <input className="field" dir="ltr" placeholder="CVV" required maxLength={4} value={cvv} onChange={(e) => setCvv(e.target.value)} />
        </div>
        {err && <p className="rounded-xl bg-destructive/15 p-3 text-sm text-destructive">{err}</p>}
        <button className="btn-primary w-full" disabled={busy}>{busy ? "מעבד תשלום..." : `תשלום ₪${qty * ev.price}`}</button>

        <div className="rounded-2xl border border-dashed border-border p-4">
          <p className="mb-3 text-sm text-muted-foreground">כרטיסי בדיקה – לחצו למילוי:</p>
          <div className="space-y-2">
            {TEST_CARDS.map((c) => (
              <button type="button" key={c.number} onClick={() => setCard(formatCard(c.number))}
                className="flex w-full items-center justify-between rounded-xl bg-secondary px-4 py-2 text-sm hover:bg-muted">
                <span>{c.label}</span>
                <span dir="ltr" className={`font-mono ${c.result === "approved" ? "text-success" : "text-destructive"}`}>{formatCard(c.number)}</span>
              </button>
            ))}
          </div>
        </div>
      </form>

      <aside className="glass h-fit rounded-3xl p-6 md:col-span-2">
        <img src={ev.image} alt={ev.title} className="mb-4 aspect-video w-full rounded-2xl object-cover" />
        <h2 className="text-2xl">{ev.title}</h2>
        <p className="text-sm text-muted-foreground">{fmtDate(ev.date)} · {ev.venue}</p>
        <div className="my-4 border-t border-dashed border-border" />
        <div className="flex justify-between text-sm"><span>{qty} × ₪{ev.price}</span><span>₪{qty * ev.price}</span></div>
        <div className="mt-2 flex justify-between font-display text-2xl"><span>סה״כ</span><span className="text-primary">₪{qty * ev.price}</span></div>
      </aside>
    </main>
  );
}
