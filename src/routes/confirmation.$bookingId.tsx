import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { Ticket } from "@/components/Ticket";

export const Route = createFileRoute("/confirmation/$bookingId")({
  head: () => ({ meta: [{ title: "ההזמנה אושרה – טיקסה" }, { name: "description", content: "אישור הזמנת כרטיסים." }, { property: "og:title", content: "ההזמנה אושרה – טיקסה" }, { property: "og:description", content: "אישור הזמנה." }] }),
  component: Confirmation,
});

function Confirmation() {
  const { bookingId } = Route.useParams();
  const b = useStore((s) => s.bookings.find((x) => x.id === bookingId));
  const ev = useStore((s) => s.events.find((e) => e.id === b?.eventId));
  if (!b || !ev) return <p className="p-20 text-center">ההזמנה לא נמצאה</p>;
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="ticket-gradient mx-auto mb-6 flex size-20 items-center justify-center rounded-full text-4xl shadow-[var(--shadow-glow)] animate-in zoom-in duration-500">✓</div>
      <h1 className="text-5xl">ההזמנה אושרה!</h1>
      <p className="mb-10 mt-3 text-muted-foreground">שולם בכרטיס המסתיים ב-{b.last4}. הכרטיסים מחכים לך באזור האישי.</p>
      <div className="text-right"><Ticket b={b} ev={ev} /></div>
      <div className="mt-10 flex justify-center gap-3">
        <Link to="/account" className="btn-primary">לכרטיסים שלי</Link>
        <Link to="/" className="btn-ghost">לאירועים נוספים</Link>
      </div>
    </main>
  );
}
