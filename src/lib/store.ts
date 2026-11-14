import { useSyncExternalStore } from "react";
import ev1 from "@/assets/ev1.jpg";
import ev2 from "@/assets/ev2.jpg";
import ev3 from "@/assets/ev3.jpg";
import ev4 from "@/assets/ev4.jpg";
import lionKing from "@/assets/lion-king.jpg"; // CC BY-SA 4.0, Giles Laurent – ראו src/assets/CREDITS.md
import heidi from "@/assets/heidi.jpg"; // CC BY-SA 4.0, Evelyne Scherer – ראו src/assets/CREDITS.md

export type EventKind = "סרט" | "מופע";
export const GENRES = {
  "סרט": ["מדע בדיוני", "מותחן", "קומדיה", "דרמה", "סרטי ילדים"],
  "מופע": ["רוק", "סטנדאפ", "מוזיקה ישראלית", "ילדים ומשפחה"],
} as const;
export type Genre = (typeof GENRES)[EventKind][number];
export type EventItem = {
  id: string; title: string; kind: EventKind; genre: Genre; venue: string; date: string;
  price: number; seats: number; image: string; description: string;
  // ממומן: נקבע בנתוני ה-seed בלבד, לא דרך טופס העריכה
  sponsored?: boolean; sponsor?: string; tagline?: string;
};
export type User = { email: string; name: string; password: string };
export type Booking = {
  id: string; eventId: string; email: string; qty: number; total: number; createdAt: string; last4: string;
};
type State = { events: EventItem[]; users: User[]; session: string | null; bookings: Booking[] };

const seed: State = {
  events: [
    { id: "orbit", title: "אורביט", kind: "סרט", genre: "מדע בדיוני", venue: "סינמה סיטי, תל אביב", date: "2026-11-28T20:30", price: 48, seats: 120, image: ev1, description: "אסטרונאוטית בודדה מגלה כוכב שמסתיר סוד עתיק. מדע בדיוני מהפנט על מסך IMAX.", sponsored: true, sponsor: "ניוטק", tagline: "החוויה הקולנועית של העונה, בחסות ניוטק" },
    { id: "stardust", title: "אבק כוכבים", kind: "סרט", genre: "מדע בדיוני", venue: "סינמה סיטי, ראשון לציון", date: "2026-12-06T19:45", price: 46, seats: 140, image: ev1, description: "צוות חוקרים יוצא למסע אל קצה הגלקסיה ומגלה שהם לא לבד." },
    { id: "noir", title: "גשם אדום", kind: "סרט", genre: "מותחן", venue: "סינמטק ירושלים", date: "2026-11-15T21:00", price: 42, seats: 80, image: ev3, description: "מותחן נואר אפל ברחובות עיר גשומה. בלש אחד, לילה אחד, אמת אחת." },
    { id: "zero-hour", title: "שעת אפס", kind: "סרט", genre: "מותחן", venue: "לב סמדר, תל אביב", date: "2026-11-22T22:15", price: 44, seats: 90, image: ev3, description: "שעה אחת, חטיפה אחת, ועיר שלמה שמחכה לתשובה." },
    { id: "surprise-wedding", title: "חתונה בהפתעה", kind: "סרט", genre: "קומדיה", venue: "יס פלאנט, חיפה", date: "2026-11-19T20:00", price: 40, seats: 160, image: ev4, description: "שלושה ימים לפני החתונה, החתן נעלם. קומדיה משפחתית מטורפת." },
    { id: "this-family", title: "המשפחה הזאת", kind: "סרט", genre: "קומדיה", venue: "גלילות, תל אביב", date: "2026-12-01T20:30", price: 40, seats: 150, image: ev4, description: "ארוחת שישי אחת, ארבעה דורות, אפס סודות. כמעט." },
    { id: "house-by-sea", title: "בית על הים", kind: "סרט", genre: "דרמה", venue: "סינמטק תל אביב", date: "2026-11-25T19:30", price: 38, seats: 70, image: ev3, description: "דרמה אינטימית על אחים שחוזרים לבית הילדות כדי להיפרד ממנו." },
    { id: "last-letters", title: "מכתבים אחרונים", kind: "סרט", genre: "דרמה", venue: "סינמטק הרצליה", date: "2026-12-09T20:15", price: 38, seats: 75, image: ev3, description: "סיפור אהבה שנכתב במכתבים, על פני שלושה עשורים." },
    { id: "lion-king", title: "מלך האריות", kind: "סרט", genre: "סרטי ילדים", venue: "סינמה סיטי, ירושלים", date: "2026-11-21T16:00", price: 36, seats: 180, image: lionKing, description: "סימבה הצעיר חייב למצוא את דרכו להיות מלך. הרפתקה מוזיקלית אהובה לכל המשפחה. מתאים מגיל 4." },
    { id: "heidi", title: "היידי בת ההרים", kind: "סרט", genre: "סרטי ילדים", venue: "סינמטק תל אביב", date: "2026-11-28T11:00", price: 32, seats: 100, image: heidi, description: "ילדה קטנה מגיעה לחיות עם סבה בהרי האלפים, ומגלה את כוחה של חברות ושל טבע. מתאים מגיל 4." },
    { id: "pollyanna", title: "פוליאנה", kind: "סרט", genre: "סרטי ילדים", venue: "יס פלאנט, ראשון לציון", date: "2026-12-05T11:30", price: 32, seats: 120, image: ev4, description: "פוליאנה מלמדת עיירה שלמה את 'משחק השמחה' ומוכיחה שתמיד יש במה לשמוח. מתאים מגיל 5." },
    { id: "volt", title: "VOLT – לייב", kind: "מופע", genre: "רוק", venue: "היכל מנורה, תל אביב", date: "2026-12-03T21:30", price: 189, seats: 400, image: ev2, description: "להקת הרוק הלוהטת חוזרת עם מופע אורות ופירוטכניקה שלא נראה כמותו.", sponsored: true, sponsor: "קפה ליל", tagline: "ערב רוק בלתי נשכח – בחסות קפה ליל" },
    { id: "fire-steel", title: "אש ופלדה", kind: "מופע", genre: "רוק", venue: "בארבי, תל אביב", date: "2026-11-27T22:00", price: 120, seats: 250, image: ev2, description: "ערב רוק כבד ואנרגטי עם שלוש להקות ללא הפסקה." },
    { id: "mic", title: "מיקרופון פתוח", kind: "מופע", genre: "סטנדאפ", venue: "קומדי בר, חיפה", date: "2026-11-20T22:00", price: 79, seats: 60, image: ev4, description: "ערב סטנדאפ עם חמשת הקומיקאים החמים של העונה. צחוק מובטח." },
    { id: "standup-night", title: "ליל סטנדאפ", kind: "מופע", genre: "סטנדאפ", venue: "הקומדי קלאב, ירושלים", date: "2026-12-11T21:45", price: 85, seats: 90, image: ev4, description: "מיטב הקומיקאים על במה אחת, ערב שלם של צחוק." },
    { id: "sea-of-songs", title: "ים של שירים", kind: "מופע", genre: "מוזיקה ישראלית", venue: "זאפה, הרצליה", date: "2026-12-05T21:00", price: 150, seats: 300, image: ev2, description: "ערב שירי ארץ ישראל בעיבודים חדשים, עם שירה משותפת לכל הקהל.", sponsored: true, sponsor: "פיצה פלוס", tagline: "שרים ביחד – בחסות פיצה פלוס" },
    { id: "hits-night", title: "ליל להיטים", kind: "מופע", genre: "מוזיקה ישראלית", venue: "היכל התרבות, פתח תקווה", date: "2026-12-18T21:00", price: 135, seats: 350, image: ev2, description: "הלהיטים הגדולים של שני עשורים, בהופעה חיה אחת." },
    { id: "wonder-circus", title: "קרקס הפלאות", kind: "מופע", genre: "ילדים ומשפחה", venue: "האוהל הגדול, רמת גן", date: "2026-11-21T17:00", price: 65, seats: 220, image: ev1, description: "אקרובטים, ליצנים וקסמים לכל המשפחה. מתאים מגיל 3.", sponsored: true, sponsor: "ניוטק", tagline: "כיף לכל המשפחה – בחסות ניוטק" },
    { id: "little-prince", title: "הנסיך הקטן – המחזמר", kind: "מופע", genre: "ילדים ומשפחה", venue: "תיאטרון הילדים, ירושלים", date: "2026-12-13T16:30", price: 70, seats: 130, image: ev1, description: "העיבוד המוזיקלי לסיפור האהוב, עם תפאורה קסומה ושירים מרגשים." },
  ],
  users: [], session: null, bookings: [],
};

export const GUEST_USER: User = { email: "guest@tixa.com", name: "אורח", password: "guest1234" };
seed.users = [GUEST_USER];

const KEY = "tixa-state-v1";
let state: State = seed;
let loaded = false;
const listeners = new Set<() => void>();

const FALLBACK_GENRE: Record<EventKind, Genre> = { "סרט": "דרמה", "מופע": "מוזיקה ישראלית" };

/**
 * ממזג אירועים שמורים (localStorage) עם ה-seed לפי id: אירועי seed חדשים מתווספים,
 * שדות חדשים (genre / ממומן) משלימים אירועים ישנים, ואירועים שהמשתמש יצר נשמרים כמות שהם.
 */
export function mergeEvents(saved: unknown, seedEvents: EventItem[]): EventItem[] {
  if (!Array.isArray(saved)) return seedEvents;
  const seedById = new Map(seedEvents.map((e) => [e.id, e]));
  const merged = (saved as EventItem[]).map((e) => {
    const s = seedById.get(e.id);
    if (!s) return { ...e, genre: e.genre ?? FALLBACK_GENRE[e.kind] };
    // ברירות מחדל מה-seed, ערכים שמורים גוברים (seats וכו' נשמרים)
    return { ...s, ...e, genre: e.genre ?? s.genre };
  });
  const have = new Set(merged.map((e) => e.id));
  return [...merged, ...seedEvents.filter((e) => !have.has(e.id))];
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try { const raw = localStorage.getItem(KEY); if (raw) { const saved = JSON.parse(raw); state = { ...seed, ...saved, events: mergeEvents(saved.events, seed.events) }; } } catch { /* ignore */ }
  // תמיד לוודא שמשתמש האורח קיים (גם אם המצב השמור לא כולל אותו)
  const others = state.users.filter((u) => u.email !== GUEST_USER.email);
  state = { ...state, users: [GUEST_USER, ...others] };
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
