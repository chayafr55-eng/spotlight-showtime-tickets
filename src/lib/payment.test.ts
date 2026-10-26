import { describe, it, expect } from "vitest";
import { charge } from "./payment";

describe("test card payments", () => {
  it("approves visa test card", () => expect(charge("4242 4242 4242 4242").ok).toBe(true));
  it("approves mastercard test card", () => expect(charge("5555555555554444").ok).toBe(true));
  it("declines decline card", () => expect(charge("4000000000000002").ok).toBe(false));
  it("rejects unknown card", () => expect(charge("1111222233334444").ok).toBe(false));
});
