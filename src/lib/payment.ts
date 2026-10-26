export const TEST_CARDS = [
  { number: "4242424242424242", label: "ויזה – מאושר", result: "approved" as const },
  { number: "5555555555554444", label: "מאסטרקארד – מאושר", result: "approved" as const },
  { number: "4000000000000002", label: "כרטיס נדחה", result: "declined" as const },
];

export type ChargeResult = { ok: true } | { ok: false; error: string };

export function charge(cardNumber: string): ChargeResult {
  const clean = cardNumber.replace(/\s/g, "");
  const card = TEST_CARDS.find((c) => c.number === clean);
  if (!card) return { ok: false, error: "כרטיס לא מוכר – השתמשו באחד מכרטיסי הבדיקה" };
  if (card.result === "declined") return { ok: false, error: "העסקה נדחתה על ידי חברת האשראי" };
  return { ok: true };
}

export const formatCard = (v: string) =>
  v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
