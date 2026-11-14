import { Link } from "@tanstack/react-router";
import { fmtDate, type EventItem } from "@/lib/store";

/** באנר פרסומי רחב לאירוע ממומן. */
export function SponsoredBanner({ event: e }: { event: EventItem }) {
  return (
    <Link
      to="/events/$id"
      params={{ id: e.id }}
      className="ticket-gradient group relative mb-12 flex flex-col gap-4 overflow-hidden rounded-3xl p-6 sm:flex-row sm:items-center sm:p-8"
    >
      <img
        src={e.image}
        alt=""
        className="h-40 w-full rounded-2xl object-cover sm:h-32 sm:w-56"
      />
      <div className="flex-1">
        <p className="mb-1 text-xs font-semibold opacity-80">ממומן · בחסות {e.sponsor ?? "מפרסם"}</p>
        <h2 className="text-3xl">{e.title}</h2>
        <p className="mt-1 opacity-80">{e.tagline ?? `${fmtDate(e.date)} · ${e.venue}`}</p>
      </div>
      <span className="rounded-full bg-background px-6 py-3 text-center font-bold text-foreground transition group-hover:-translate-y-0.5">
        להזמנה · ₪{e.price}
      </span>
    </Link>
  );
}
