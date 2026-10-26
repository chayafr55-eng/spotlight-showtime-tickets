import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { fmtDate, useCurrentUser, useStore } from "@/lib/store";

export const Route = createFileRoute("/events/$id")({
  head: () => ({ meta: [{ title: "פרטי אירוע – טיקסה" }, { name: "description", content: "פרטי האירוע והזמנת כרטיסים." }, { property: "og:title", content: "פרטי אירוע – טיקסה" }, { property: "og:description", content: "הזמנת כרטיסים לאירוע." }] }),
  component: EventPage,
});

function EventPage() {
  const { id } = Route.useParams();
  const ev = useStore((s) => s.events.find((e) => e.id === id));
  const user = useCurrentUser();
  const nav = useNavigate();
  const [qty, setQty] = useState(2);
  if (!ev) return <p className="p-20 text-center">האירוע לא נמצא</p>;

  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-2">
      <img src={ev.image} alt={ev.title} width={768} height={1024} className="w-full rounded-3xl border border-border object-cover shadow-[var(--shadow-glow)]" />
      <div className="flex flex-col justify-center">
        <span className="mb-3 w-fit rounded-full border border-accent/50 px-3 py-1 text-sm text-accent">{ev.kind}</span>
        <h1 className="text-5xl md:text-6xl">{ev.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{ev.description}</p>
        <div className="mt-6 space-y-1 text-sm">
          <p>📍 {ev.venue}</p>
          <p>🗓 {fmtDate(ev.date)}</p>
          <p>🎟 נותרו {ev.seats} מקומות</p>
        </div>
        <div className="glass mt-8 rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <span>כמות כרטיסים</span>
            <div className="flex items-center gap-3">
              <button className="btn-ghost !p-0 size-10" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span className="font-display w-6 text-center text-xl">{qty}</span>
              <button className="btn-ghost !p-0 size-10" onClick={() => setQty(Math.min(10, ev.seats, qty + 1))}>+</button>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <span className="font-display text-3xl text-primary">₪{qty * ev.price}</span>
            <button className="btn-primary" disabled={ev.seats < 1}
              onClick={() => user ? nav({ to: "/checkout/$id", params: { id: ev.id }, search: { qty } }) : nav({ to: "/login" })}>
              {user ? "להזמנה" : "התחברו להזמנה"}
            </button>
          </div>
        </div>
        {user && <Link to="/edit/$id" params={{ id: ev.id }} className="mt-4 text-sm text-muted-foreground hover:text-primary">✎ עריכת אירוע</Link>}
      </div>
    </main>
  );
}
