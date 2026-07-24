// Server-only helpers for appending orders to a text file. Never import
// from client code — the *.server.ts suffix keeps this out of the browser bundle.
import { promises as fs } from "node:fs";
import path from "node:path";

const ORDERS_FILE = path.resolve(process.cwd(), "data", "orders.txt");

export interface OrderItemInput {
  name: string;
  size: string;
  qty: number;
  price: number;
  color?: string;
}

export interface OrderInput {
  name: string;
  phone: string;
  address: string;
  city: string;
  note?: string;
  paymentMethod: "cod" | "sadapay";
  transactionId?: string;
  items: OrderItemInput[];
  subtotal: number;
  savings: number;
  total: number;
}

async function ensureFile() {
  await fs.mkdir(path.dirname(ORDERS_FILE), { recursive: true });
  try {
    await fs.access(ORDERS_FILE);
  } catch {
    await fs.writeFile(ORDERS_FILE, "", "utf8");
  }
}

async function nextOrderNumber(): Promise<number> {
  await ensureFile();
  const contents = await fs.readFile(ORDERS_FILE, "utf8");
  const matches = contents.match(/ORDER #(\d+)/g) ?? [];
  let max = 0;
  for (const m of matches) {
    const n = parseInt(m.replace("ORDER #", ""), 10);
    if (!Number.isNaN(n) && n > max) max = n;
  }
  return max + 1;
}

function fmtRs(n: number) {
  return "Rs. " + Number(n).toLocaleString("en-PK");
}

function fmtDate(d: Date) {
  const pad = (x: number) => String(x).padStart(2, "0");
  return (
    d.getFullYear() +
    "-" +
    pad(d.getMonth() + 1) +
    "-" +
    pad(d.getDate()) +
    " " +
    pad(d.getHours()) +
    ":" +
    pad(d.getMinutes()) +
    ":" +
    pad(d.getSeconds())
  );
}

function formatOrder(orderNumber: number, order: OrderInput): string {
  const sep = "================================================";
  const inner = "--------------------------------";
  const paymentBlock =
    order.paymentMethod === "sadapay"
      ? "Payment Method:\nSadapay\n\nTransaction ID:\n" + (order.transactionId || "-")
      : "Payment Method:\nCash on Delivery";

  const itemsBlock = order.items
    .map((it) => {
      const lines = ["- " + it.name];
      if (it.color) lines.push("  Color: " + it.color);
      lines.push("  Size: " + it.size);
      lines.push("  Qty: " + it.qty);
      lines.push("  Price: " + fmtRs(it.price));
      return lines.join("\n");
    })
    .join("\n\n");

  return [
    sep,
    "ORDER #" + orderNumber,
    sep,
    "",
    "Date:",
    fmtDate(new Date()),
    "",
    "Customer",
    "",
    "Name:",
    order.name,
    "",
    "Phone:",
    order.phone,
    "",
    "Address:",
    order.address,
    "",
    "City:",
    order.city,
    "",
    "Delivery Note:",
    order.note || "-",
    "",
    paymentBlock,
    "",
    inner,
    "",
    "Items",
    "",
    itemsBlock,
    "",
    inner,
    "",
    "Subtotal:",
    fmtRs(order.subtotal),
    "",
    "Shipping:",
    "Free",
    "",
    "Savings:",
    fmtRs(order.savings),
    "",
    "Total:",
    fmtRs(order.total),
    "",
    sep,
    "",
    "",
  ].join("\n");
}

export async function appendOrder(order: OrderInput): Promise<number> {
  await ensureFile();
  const n = await nextOrderNumber();
  const block = formatOrder(n, order);
  await fs.appendFile(ORDERS_FILE, block, "utf8");
  return n;
}
