import type { Booking, EventItem } from "@/lib/store";
import { fmtDate } from "@/lib/store";

export function Ticket({ b, ev }: { b: Booking; ev: EventItem }) {
  return (
    <div className="flex overflow-hidden rounded-3xl border border-border bg-card">
      <img src={ev.image} alt={ev.title} className="w-28 object-cover md:w-36" />
      <div className="flex-1 p-5">
        <h3 className="text-2xl">{ev.title}</h3>
        <p className="text-sm text-muted-foreground">{fmtDate(ev.date)}</p>
        <p className="text-sm text-muted-foreground">{ev.venue}</p>
        <p className="mt-2 text-sm">{b.qty} כרטיסים · ₪{b.total}</p>
      </div>
      <div className="ticket-gradient flex w-28 flex-col items-center justify-center border-r-2 border-dashed border-background p-3 text-center">
        <span className="text-xs opacity-70">הזמנה</span>
        <span className="font-display text-lg" dir="ltr">#{b.id}</span>
      </div>
    </div>
  );
}
