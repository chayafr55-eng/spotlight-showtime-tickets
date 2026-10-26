import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { actions, useStore, type EventItem } from "@/lib/store";
import ev1 from "@/assets/ev1.jpg";

export const Route = createFileRoute("/edit/$id")({
  head: () => ({ meta: [{ title: "עריכת אירוע – טיקסה" }, { name: "description", content: "יצירה ועריכה של אירועים." }, { property: "og:title", content: "עריכת אירוע – טיקסה" }, { property: "og:description", content: "עריכת אירוע." }] }),
  component: EditEvent,
});

function EditEvent() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const existing = useStore((s) => s.events.find((e) => e.id === id));
  const blank: EventItem = { id: "", title: "", kind: "סרט", venue: "", date: "", price: 50, seats: 100, image: ev1, description: "" };
  const [f, setF] = useState<EventItem>(existing ?? blank);
  useEffect(() => { if (existing) setF(existing); }, [existing?.id]);
  const up = <K extends keyof EventItem>(k: K, v: EventItem[K]) => setF({ ...f, [k]: v });

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-5xl">{existing ? "עריכת אירוע" : "אירוע חדש"}</h1>
      <form className="glass grid gap-5 rounded-3xl p-8 md:grid-cols-2" onSubmit={(e) => {
        e.preventDefault();
        const ev = { ...f, id: f.id || actions.newEventId() };
        actions.saveEvent(ev);
        nav({ to: "/events/$id", params: { id: ev.id } });
      }}>
        <label className="md:col-span-2 space-y-2"><span className="text-sm text-muted-foreground">שם האירוע</span>
          <input className="field" required value={f.title} onChange={(e) => up("title", e.target.value)} /></label>
        <label className="space-y-2"><span className="text-sm text-muted-foreground">סוג</span>
          <select className="field" value={f.kind} onChange={(e) => up("kind", e.target.value as EventItem["kind"])}>
            <option>סרט</option><option>מופע</option></select></label>
        <label className="space-y-2"><span className="text-sm text-muted-foreground">מועד</span>
          <input className="field" type="datetime-local" required value={f.date} onChange={(e) => up("date", e.target.value)} /></label>
        <label className="md:col-span-2 space-y-2"><span className="text-sm text-muted-foreground">מקום</span>
          <input className="field" required value={f.venue} onChange={(e) => up("venue", e.target.value)} /></label>
        <label className="space-y-2"><span className="text-sm text-muted-foreground">מחיר (₪)</span>
          <input className="field" type="number" min={0} required value={f.price} onChange={(e) => up("price", +e.target.value)} /></label>
        <label className="space-y-2"><span className="text-sm text-muted-foreground">מקומות פנויים</span>
          <input className="field" type="number" min={0} required value={f.seats} onChange={(e) => up("seats", +e.target.value)} /></label>
        <label className="md:col-span-2 space-y-2"><span className="text-sm text-muted-foreground">קישור לתמונה</span>
          <input className="field" dir="ltr" value={f.image} onChange={(e) => up("image", e.target.value)} /></label>
        <label className="md:col-span-2 space-y-2"><span className="text-sm text-muted-foreground">תיאור</span>
          <textarea className="field min-h-28" value={f.description} onChange={(e) => up("description", e.target.value)} /></label>
        <div className="md:col-span-2 flex gap-3">
          <button className="btn-primary">שמירה</button>
          <button type="button" className="btn-ghost" onClick={() => history.back()}>ביטול</button>
        </div>
      </form>
    </main>
  );
}
