import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { EventCard } from "@/components/EventCard";
import { EventCarousel } from "@/components/EventCarousel";
import { GenreRow } from "@/components/GenreRow";
import { SponsoredBanner } from "@/components/SponsoredBanner";
import { GENRES, useCurrentUser, useStore, type EventKind, type Genre } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "טיקסה – כרטיסים לסרטים ומופעים" },
      { name: "description", content: "הזמינו כרטיסים לסרטים ולמופעים החמים ביותר בכמה קליקים." },
      { property: "og:title", content: "טיקסה – כרטיסים לסרטים ומופעים" },
      { property: "og:description", content: "הזמינו כרטיסים לסרטים ולמופעים החמים ביותר." },
    ],
  }),
  component: Index,
});

const filters = ["הכל", "סרט", "מופע"] as const;
const filterLabel = { הכל: "הכל", סרט: "סרטים", מופע: "מופעים" } as const;

function Index() {
  const events = useStore((s) => s.events);
  const user = useCurrentUser();
  const [f, setF] = useState<(typeof filters)[number]>("הכל");
  const [genre, setGenre] = useState<Genre | null>(null);

  // סדר דטרמיניסטי (לפי תאריך) כדי שרינדור השרת והלקוח יהיו זהים
  const sorted = useMemo(() => [...events].sort((a, b) => a.date.localeCompare(b.date)), [events]);
  const visible = sorted.filter((e) => f === "הכל" || e.kind === f);
  const sponsored = useMemo(() => sorted.filter((e) => e.sponsored), [sorted]);
  const featured = useMemo(() => {
    const ids = new Set<string>();
    return [...sponsored, ...sorted].filter((e) => !ids.has(e.id) && ids.add(e.id)).slice(0, 6);
  }, [sorted, sponsored]);

  const kinds: EventKind[] = f === "הכל" ? ["סרט", "מופע"] : [f];
  const genres = kinds.flatMap((k) => GENRES[k]) as Genre[];
  const activeGenre = genre && genres.includes(genre) ? genre : null;
  const banner = sponsored.at(-1);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24">
      <section className="py-10 md:py-14">
        <p className="mb-4 inline-block rounded-full border border-primary/40 px-4 py-1 text-sm text-primary">● עכשיו בהזמנה</p>
        <h1 className="text-5xl leading-[1.05] md:text-7xl">
          הערב שלך
          <br />
          מתחיל <span className="text-primary">כאן.</span>
        </h1>
        <p className="mt-4 max-w-lg text-lg text-muted-foreground">סרטים, הופעות וסטנדאפ – בוחרים, משלמים, ונכנסים. בלי תורים.</p>
      </section>

      <div className="mb-12">
        <EventCarousel events={featured} />
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="glass flex gap-1 rounded-full p-1">
          {filters.map((x) => (
            <button
              key={x}
              onClick={() => setF(x)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${f === x ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {filterLabel[x]}
            </button>
          ))}
        </div>
        {user && (
          <Link to="/edit/$id" params={{ id: "new" }} className="btn-ghost">
            + אירוע חדש
          </Link>
        )}
      </div>

      <div className="-mx-4 mb-10 flex gap-2 overflow-x-auto px-4 pb-2" role="group" aria-label="סגנונות">
        <GenreChip active={activeGenre === null} onClick={() => setGenre(null)}>
          כל הסגנונות
        </GenreChip>
        {genres.map((g) => (
          <GenreChip key={g} active={activeGenre === g} onClick={() => setGenre(g)}>
            {g} · {visible.filter((e) => e.genre === g).length}
          </GenreChip>
        ))}
      </div>

      {activeGenre ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visible
            .filter((e) => e.genre === activeGenre)
            .map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
        </div>
      ) : (
        <>
          {banner && <SponsoredBanner event={banner} />}
          <GenreRow title="אירועים ממומנים" events={sponsored.filter((e) => f === "הכל" || e.kind === f)} />
          {genres.map((g) => (
            <GenreRow key={g} title={g} events={visible.filter((e) => e.genre === g)} />
          ))}
        </>
      )}
    </main>
  );
}

function GenreChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${active ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
    >
      {children}
    </button>
  );
}
