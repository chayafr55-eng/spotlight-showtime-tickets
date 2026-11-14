import { Link } from "@tanstack/react-router";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fmtDate, type EventItem } from "@/lib/store";

/** קרוסלת Hero של אירועים מובילים. RTL: "הבא" נע שמאלה. */
export function EventCarousel({ events }: { events: EventItem[] }) {
  const [ref, api] = useEmblaCarousel({ direction: "rtl", loop: events.length > 1 });
  if (events.length === 0) return null;

  return (
    <section aria-label="אירועים מובילים" className="relative">
      <div ref={ref} className="overflow-hidden rounded-3xl" dir="rtl">
        <div className="flex">
          {events.map((e) => (
            <div key={e.id} className="min-w-0 flex-[0_0_100%]">
              <Link
                to="/events/$id"
                params={{ id: e.id }}
                className="group relative block aspect-[4/5] overflow-hidden sm:aspect-[16/7]"
              >
                <img src={e.image} alt={e.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent sm:bg-gradient-to-l sm:from-background/90 sm:via-background/40" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:inset-y-0 sm:right-0 sm:flex sm:w-1/2 sm:flex-col sm:justify-center sm:p-12">
                  <div className="mb-3 flex gap-2">
                    <span className="glass rounded-full px-3 py-1 text-xs">{e.genre}</span>
                    {e.sponsored && (
                      <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">ממומן</span>
                    )}
                  </div>
                  <h2 className="text-4xl md:text-6xl">{e.title}</h2>
                  <p className="mt-2 text-muted-foreground">
                    {fmtDate(e.date)} · {e.venue}
                  </p>
                  <div className="mt-5 flex items-center gap-4">
                    <span className="btn-primary">להזמנה · ₪{e.price}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      {events.length > 1 && (
        <>
          <button
            type="button"
            aria-label="הקודם"
            onClick={() => api?.scrollPrev()}
            className="glass absolute top-1/2 right-3 grid size-10 -translate-y-1/2 place-items-center rounded-full"
          >
            <ChevronRight className="size-5" />
          </button>
          <button
            type="button"
            aria-label="הבא"
            onClick={() => api?.scrollNext()}
            className="glass absolute top-1/2 left-3 grid size-10 -translate-y-1/2 place-items-center rounded-full"
          >
            <ChevronLeft className="size-5" />
          </button>
        </>
      )}
    </section>
  );
}
