import type { EventItem } from "@/lib/store";
import { EventCard } from "./EventCard";

/** שורת אירועים עם כותרת, בגלילה אופקית. */
export function GenreRow({ title, events }: { title: string; events: EventItem[] }) {
  if (events.length === 0) return null;
  return (
    <section className="mb-12" aria-label={title}>
      <h2 className="mb-4 text-3xl">{title}</h2>
      <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-3">
        {events.map((e) => (
          <EventCard key={e.id} event={e} className="w-56 shrink-0 snap-start sm:w-60" />
        ))}
      </div>
    </section>
  );
}
