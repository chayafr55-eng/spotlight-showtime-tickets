import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { fmtDate, useCurrentUser, useStore } from "@/lib/store";

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

function Index() {
  const events = useStore((s) => s.events);
  const user = useCurrentUser();
  const [f, setF] = useState<(typeof filters)[number]>("הכל");
  const list = events.filter((e) => f === "הכל" || e.kind === f);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24">
      <section className="py-16 md:py-24">
        <p className="mb-4 inline-block rounded-full border border-primary/40 px-4 py-1 text-sm text-primary">● עכשיו בהזמנה</p>
        <h1 className="text-5xl leading-[1.05] md:text-8xl">
          הערב שלך<br />מתחיל <span className="text-primary">כאן.</span>
        </h1>
        <p className="mt-6 max-w-lg text-lg text-muted-foreground">סרטים, הופעות וסטנדאפ – בוחרים, משלמים, ונכנסים. בלי תורים.</p>
      </section>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="glass flex gap-1 rounded-full p-1">
          {filters.map((x) => (
            <button key={x} onClick={() => setF(x)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${f === x ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {x === "הכל" ? "הכל" : x === "סרט" ? "סרטים" : "מופעים"}
            </button>
          ))}
        </div>
        {user && <Link to="/edit/$id" params={{ id: "new" }} className="btn-ghost">+ אירוע חדש</Link>}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((e, i) => (
          <Link key={e.id} to="/events/$id" params={{ id: e.id }}
            className={`group relative overflow-hidden rounded-3xl border border-border ${i % 3 === 0 ? "lg:row-span-1" : ""}`}>
            <img src={e.image} alt={e.title} width={768} height={1024} loading="lazy"
              className="aspect-[3/4] w-full object-cover transition duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            <span className="glass absolute top-3 right-3 rounded-full px-3 py-1 text-xs">{e.kind}</span>
            <div className="absolute inset-x-0 bottom-0 p-5">
              <h3 className="text-2xl">{e.title}</h3>
              <p className="text-sm text-muted-foreground">{fmtDate(e.date)}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-display text-xl text-primary">₪{e.price}</span>
                <span className="text-xs text-muted-foreground">{e.seats} מקומות</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
