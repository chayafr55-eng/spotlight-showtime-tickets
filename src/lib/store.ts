import { useSyncExternalStore } from "react";
import ev1 from "@/assets/ev1.jpg";
import ev2 from "@/assets/ev2.jpg";
import ev3 from "@/assets/ev3.jpg";
import ev4 from "@/assets/ev4.jpg";

export type EventKind = "סרט" | "מופע";
export type EventItem = {
  id: string; title: string; kind: EventKind; venue: string; date: string;
  price: number; seats: number; image: string; description: string;
};
export type User = { email: string; name: string; password: string };
export type Booking = {
  id: string; eventId: string; email: string; qty: number; total: number; createdAt: string; last4: string;
};
type State = { events: EventItem[]; users: User[]; session: string | null; bookings: Booking[] };

const seed: State = {
  events: [
    { id: "orbit", title: "אורביט", kind: "סרט", venue: "סינמה סיטי, תל אביב", date: "2026-11-12T20:30", price: 48, seats: 120, image: ev1, description: "אסטרונאוטית בודדה מגלה כוכב שמסתיר סוד עתיק. מדע בדיוני מהפנט על מסך IMAX." },
    { id: "noir", title: "גשם אדום", kind: "סרט", venue: "סינמטק ירושלים", date: "2026-11-15T21:00", price: 42, seats: 80, image: ev3, description: "מותחן נואר אפל ברחובות עיר גשומה. בלש אחד, לילה אחד, אמת אחת." },
    { id: "volt", title: "VOLT – לייב", kind: "מופע", venue: "היכל מנורה, תל אביב", date: "2026-12-03T21:30", price: 189, seats: 400, image: ev2, description: "להקת הרוק הלוהטת חוזרת עם מופע אורות ופירוטכניקה שלא נראה כמותו." },
    { id: "mic", title: "מיקרופון פתוח", kind: "מופע", venue: "קומדי בר, חיפה", date: "2026-11-20T22:00", price: 79, seats: 60, image: ev4, description: "ערב סטנדאפ עם חמשת הקומיקאים החמים של העונה. צחוק מובטח." },
  ],
  users: [], session: null, bookings: [],
};

const KEY = "tixa-state-v1";
let state: State = seed;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try { const raw = localStorage.getItem(KEY); if (raw) state = { ...seed, ...JSON.parse(raw) }; } catch { /* ignore */ }
}
function set(fn: (s: State) => State) {
  load();
  state = fn(state);
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

export function useStore<T>(sel: (s: State) => T): T {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => { load(); return sel(state); },
    () => sel(seed),
  );
}

export const useCurrentUser = () =>
  useStore((s) => s.users.find((u) => u.email === s.session) ?? null);

const uid = () => Math.random().toString(36).slice(2, 9).toUpperCase();

export const actions = {
  signup(u: User): string | null {
    load();
    if (state.users.some((x) => x.email === u.email)) return "האימייל כבר רשום";
    set((s) => ({ ...s, users: [...s.users, u], session: u.email }));
    return null;
  },
  login(email: string, password: string): string | null {
    load();
    const u = state.users.find((x) => x.email === email && x.password === password);
    if (!u) return "אימייל או סיסמה שגויים";
    set((s) => ({ ...s, session: email }));
    return null;
  },
  logout() { set((s) => ({ ...s, session: null })); },
  saveEvent(e: EventItem) {
    set((s) => ({ ...s, events: s.events.some((x) => x.id === e.id) ? s.events.map((x) => (x.id === e.id ? e : x)) : [...s.events, e] }));
  },
  newEventId: () => "ev-" + uid().toLowerCase(),
  book(eventId: string, qty: number, last4: string): Booking {
    load();
    const ev = state.events.find((e) => e.id === eventId)!;
    const b: Booking = { id: uid(), eventId, email: state.session!, qty, total: qty * ev.price, createdAt: new Date().toISOString(), last4 };
    set((s) => ({ ...s, bookings: [...s.bookings, b], events: s.events.map((e) => (e.id === eventId ? { ...e, seats: e.seats - qty } : e)) }));
    return b;
  },
};

export const fmtDate = (d: string) =>
  new Date(d).toLocaleString("he-IL", { weekday: "short", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
