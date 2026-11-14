import { Link } from "@tanstack/react-router";
import { fmtDate, type EventItem } from "@/lib/store";

export function EventCard({ event: e, className = "" }: { event: EventItem; className?: string }) {
  return (
    <Link
      to="/events/$id"
      params={{ id: e.id }}
      className={`group relative block overflow-hidden rounded-3xl border border-border ${className}`}
    >
      <img
        src={e.image}
        alt={e.title}
        width={768}
        height={1024}
        loading="lazy"
        className="aspect-[3/4] w-full object-cover transition duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      <span className="glass absolute top-3 right-3 rounded-full px-3 py-1 text-xs">{e.genre}</span>
      {e.sponsored && (
        <span className="absolute top-3 left-3 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
          ממומן
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="text-2xl">{e.title}</h3>
        <p className="text-sm text-muted-foreground">{fmtDate(e.date)}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-xl text-primary">₪{e.price}</span>
          <span className="text-xs text-muted-foreground">{e.seats} מקומות</span>
        </div>
      </div>
    </Link>
  );
}
