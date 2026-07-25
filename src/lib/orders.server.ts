// Server-only order handler. Sends each order as an email via Resend.
// Never import from client code — the *.server.ts suffix keeps this out of
// the browser bundle.
//
// Required env vars (set as server-only secrets):
//   RESEND_API_KEY       — Resend API key
//   ORDER_RECIPIENT_EMAIL — inbox to receive orders (e.g. fa7055726@gmail.com)

import { Resend } from "resend";

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

function generateOrderId(d: Date): string {
  const pad = (x: number) => String(x).padStart(2, "0");
  const date =
    d.getFullYear().toString() + pad(d.getMonth() + 1) + pad(d.getDate());
  const time = pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds());
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${date}-${time}-${rand}`;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtml(orderId: string, dateStr: string, order: OrderInput): string {
  const itemsRows = order.items
    .map(
      (it) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;">
            <strong>${esc(it.name)}</strong>${it.color ? `<br/><span style="color:#666;font-size:13px;">Color: ${esc(it.color)}</span>` : ""}
          </td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${esc(it.size)}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${it.qty}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${fmtRs(it.price)}</td>
        </tr>`,
    )
    .join("");

  const paymentBlock =
    order.paymentMethod === "sadapay"
      ? `<p style="margin:4px 0;"><strong>Payment Method:</strong> Sadapay</p>
         <p style="margin:4px 0;"><strong>Transaction ID:</strong> ${esc(order.transactionId || "-")}</p>`
      : `<p style="margin:4px 0;"><strong>Payment Method:</strong> Cash on Delivery</p>`;

  return `<!DOCTYPE html>
<html><body style="font-family:Arial,sans-serif;color:#111;max-width:640px;margin:0 auto;padding:20px;">
  <h2 style="margin:0 0 4px;">New Order</h2>
  <p style="color:#666;margin:0 0 20px;">Order ID: <strong>${esc(orderId)}</strong> · ${esc(dateStr)}</p>

  <h3 style="margin:20px 0 8px;border-bottom:2px solid #111;padding-bottom:4px;">Customer</h3>
  <p style="margin:4px 0;"><strong>Name:</strong> ${esc(order.name)}</p>
  <p style="margin:4px 0;"><strong>Phone:</strong> ${esc(order.phone)}</p>
  <p style="margin:4px 0;"><strong>Address:</strong> ${esc(order.address)}</p>
  <p style="margin:4px 0;"><strong>City:</strong> ${esc(order.city)}</p>
  ${order.note ? `<p style="margin:4px 0;"><strong>Delivery Note:</strong> ${esc(order.note)}</p>` : ""}

  <h3 style="margin:20px 0 8px;border-bottom:2px solid #111;padding-bottom:4px;">Payment</h3>
  ${paymentBlock}

  <h3 style="margin:20px 0 8px;border-bottom:2px solid #111;padding-bottom:4px;">Items</h3>
  <table style="width:100%;border-collapse:collapse;font-size:14px;">
    <thead>
      <tr style="background:#f5f5f5;">
        <th style="padding:8px;text-align:left;">Item</th>
        <th style="padding:8px;text-align:center;">Size</th>
        <th style="padding:8px;text-align:center;">Qty</th>
        <th style="padding:8px;text-align:right;">Price</th>
      </tr>
    </thead>
    <tbody>${itemsRows}</tbody>
  </table>

  <table style="width:100%;margin-top:16px;font-size:14px;">
    <tr><td style="padding:4px 8px;">Subtotal</td><td style="padding:4px 8px;text-align:right;">${fmtRs(order.subtotal)}</td></tr>
    <tr><td style="padding:4px 8px;">Shipping</td><td style="padding:4px 8px;text-align:right;">Free</td></tr>
    <tr><td style="padding:4px 8px;">Savings</td><td style="padding:4px 8px;text-align:right;">${fmtRs(order.savings)}</td></tr>
    <tr style="font-weight:bold;font-size:16px;border-top:2px solid #111;">
      <td style="padding:8px;">Total</td>
      <td style="padding:8px;text-align:right;">${fmtRs(order.total)}</td>
    </tr>
  </table>
</body></html>`;
}

export async function submitOrder(order: OrderInput): Promise<string> {
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.ORDER_RECIPIENT_EMAIL;
  if (!apiKey || !recipient) {
    throw new Error("Order email is not configured");
  }

  const now = new Date();
  const orderId = generateOrderId(now);
  const dateStr = fmtDate(now);
  const html = buildHtml(orderId, dateStr, order);

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: recipient,
    subject: `New Order - ${order.name} - ${fmtRs(order.total)}`,
    html,
  });

  if (error || !data) {
    console.error("Resend send failed", error);
    throw new Error("Failed to send order email");
  }

  return orderId;
}
