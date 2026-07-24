import { createServerFn } from "@tanstack/react-start";

import type { OrderInput } from "./orders.server";

function validate(input: unknown): OrderInput {
  if (!input || typeof input !== "object") throw new Error("Invalid order payload");
  const i = input as Record<string, unknown>;
  const req = (k: string): string => {
    const v = i[k];
    if (typeof v !== "string" || !v.trim()) throw new Error("Missing field: " + k);
    return v.trim().slice(0, 500);
  };
  const name = req("name");
  const phone = req("phone");
  const address = req("address");
  const city = req("city");
  const note = typeof i.note === "string" ? i.note.trim().slice(0, 1000) : "";
  const paymentMethod = i.paymentMethod === "sadapay" ? "sadapay" : "cod";
  const transactionId =
    paymentMethod === "sadapay"
      ? (() => {
          const t = typeof i.transactionId === "string" ? i.transactionId.trim() : "";
          if (!t) throw new Error("Missing transaction id");
          return t.slice(0, 200);
        })()
      : undefined;
  if (!Array.isArray(i.items) || i.items.length === 0) throw new Error("Empty cart");
  const items = i.items.map((raw) => {
    const it = raw as Record<string, unknown>;
    return {
      name: String(it.name || "").slice(0, 300),
      size: String(it.size || "").slice(0, 20),
      qty: Math.max(1, Math.min(999, Number(it.qty) || 1)),
      price: Math.max(0, Math.round(Number(it.price) || 0)),
      color: typeof it.color === "string" ? it.color.slice(0, 100) : undefined,
    };
  });
  const num = (k: string) => Math.max(0, Math.round(Number(i[k]) || 0));
  return {
    name,
    phone,
    address,
    city,
    note,
    paymentMethod,
    transactionId,
    items,
    subtotal: num("subtotal"),
    savings: num("savings"),
    total: num("total"),
  };
}

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator(validate)
  .handler(async ({ data }) => {
    const { appendOrder } = await import("./orders.server");
    const orderNumber = await appendOrder(data);
    return { orderNumber };
  });
