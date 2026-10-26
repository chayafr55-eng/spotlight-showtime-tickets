import { createFileRoute, Link } from "@tanstack/react-router";
import { useCurrentUser, useStore } from "@/lib/store";
import { Ticket } from "@/components/Ticket";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "האזור האישי – טיקסה" }, { name: "description", content: "הכרטיסים וההזמנות שלך." }, { property: "og:title", content: "האזור האישי – טיקסה" }, { property: "og:description", content: "הכרטיסים שלך." }] }),
  component: Account,
});

function Account() {
  const user = useCurrentUser();
  const bookings = useStore((s) => s.bookings);
  const events = useStore((s) => s.events);
  if (!user) return <p className="p-20 text-center">יש <Link to="/login" className="text-primary">להתחבר</Link> כדי לראות את האזור האישי</p>;
  const mine = bookings.filter((b) => b.email === user.email).reverse();
  const spent = mine.reduce((a, b) => a + b.total, 0);
  const tickets = mine.reduce((a, b) => a + b.qty, 0);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10 flex items-center gap-5">
        <div className="ticket-gradient flex size-20 items-center justify-center rounded-full font-display text-3xl">{user.name.charAt(0)}</div>
        <div><h1 className="text-4xl">היי, {user.name}</h1><p className="text-muted-foreground">{user.email}</p></div>
      </div>
      <div className="mb-10 grid grid-cols-3 gap-4">
        {[["הזמנות", mine.length], ["כרטיסים", tickets], ["סה״כ", `₪${spent}`]].map(([l, v]) => (
          <div key={l} className="glass rounded-3xl p-5"><p className="text-sm text-muted-foreground">{l}</p><p className="font-display text-3xl text-primary">{v}</p></div>
        ))}
      </div>
      <h2 className="mb-4 text-2xl">הכרטיסים שלי</h2>
      {mine.length === 0 ? (
        <div className="glass rounded-3xl p-10 text-center"><p className="mb-4 text-muted-foreground">עוד אין הזמנות</p><Link to="/" className="btn-primary">גלו אירועים</Link></div>
      ) : (
        <div className="space-y-4">
          {mine.map((b) => { const ev = events.find((e) => e.id === b.eventId); return ev ? <Ticket key={b.id} b={b} ev={ev} /> : null; })}
        </div>
      )}
    </main>
  );
}
