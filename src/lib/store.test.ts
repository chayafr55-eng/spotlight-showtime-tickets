import { describe, expect, it } from "vitest";
import { mergeEvents, type EventItem } from "@/lib/store";

const mk = (o: Partial<EventItem> & { id: string }): EventItem => ({
  title: "t", kind: "סרט", genre: "דרמה", venue: "v", date: "2026-12-01T20:00",
  price: 10, seats: 10, image: "", description: "", ...o,
});

describe("mergeEvents", () => {
  const seedEvents = [mk({ id: "a", genre: "מותחן", sponsored: true, sponsor: "S" }), mk({ id: "b" })];

  it("returns the seed when nothing valid is saved", () => {
    expect(mergeEvents(undefined, seedEvents)).toBe(seedEvents);
  });

  it("adds new seed events and backfills genre/sponsored on old saved events", () => {
    const old = [{ ...mk({ id: "a", seats: 3 }), genre: undefined }] as unknown as EventItem[];
    const out = mergeEvents(old, seedEvents);
    expect(out.map((e) => e.id)).toEqual(["a", "b"]);
    expect(out[0]).toMatchObject({ genre: "מותחן", sponsored: true, sponsor: "S", seats: 3 });
  });

  it("keeps user-created events and gives them a fallback genre", () => {
    const user = { ...mk({ id: "ev-x", kind: "מופע" }), genre: undefined } as unknown as EventItem;
    const out = mergeEvents([user], seedEvents);
    expect(out.find((e) => e.id === "ev-x")?.genre).toBe("מוזיקה ישראלית");
    expect(out).toHaveLength(3);
  });
});
