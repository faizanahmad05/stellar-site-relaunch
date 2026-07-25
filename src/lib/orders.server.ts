// Server-only helpers for persisting orders to a text file inside the GitHub
// repo via the GitHub Contents API. Never import from client code — the
// *.server.ts suffix keeps this out of the browser bundle.
//
// Required env vars (set as server-only secrets):
//   GITHUB_TOKEN        — PAT with `repo` (contents:write) scope
//   GITHUB_REPO_OWNER   — repo owner / org (e.g. "faizan-ahmad")
//   GITHUB_REPO_NAME    — repo name (e.g. "majestic-stoff")
//   GITHUB_ORDERS_PATH  — optional, defaults to "data/orders.txt"
//   GITHUB_BRANCH       — optional, defaults to repo default branch

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

function countOrders(contents: string): number {
  const matches = contents.match(/ORDER #(\d+)/g) ?? [];
  let max = 0;
  for (const m of matches) {
    const n = parseInt(m.replace("ORDER #", ""), 10);
    if (!Number.isNaN(n) && n > max) max = n;
  }
  return max;
}

// Base64 helpers that work in Workers/Node without Buffer polyfills.
function b64encode(text: string): string {
  // Encode UTF-8 -> base64
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  // btoa is available in Workers and modern Node
  return btoa(bin);
}
function b64decode(b64: string): string {
  const clean = b64.replace(/\s+/g, "");
  const bin = atob(clean);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

interface GhConfig {
  token: string;
  owner: string;
  repo: string;
  path: string;
  branch?: string;
}

function getConfig(): GhConfig {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;
  if (!token || !owner || !repo) {
    throw new Error("GitHub storage not configured");
  }
  return {
    token,
    owner,
    repo,
    path: process.env.GITHUB_ORDERS_PATH || "data/orders.txt",
    branch: process.env.GITHUB_BRANCH || undefined,
  };
}

interface FetchedFile {
  content: string;
  sha: string | null;
}

async function ghGet(cfg: GhConfig): Promise<FetchedFile> {
  const url =
    `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${encodeURIComponent(cfg.path).replace(/%2F/g, "/")}` +
    (cfg.branch ? `?ref=${encodeURIComponent(cfg.branch)}` : "");
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${cfg.token}`,
      "User-Agent": "majestic-stoff-orders",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (res.status === 404) return { content: "", sha: null };
  if (!res.ok) {
    const body = await res.text();
    console.error("GitHub GET failed", res.status, body);
    throw new Error("GitHub GET failed: " + res.status);
  }
  const json = (await res.json()) as { content?: string; sha?: string; encoding?: string };
  const content =
    json.encoding === "base64" && json.content ? b64decode(json.content) : json.content || "";
  return { content, sha: json.sha ?? null };
}

async function ghPut(
  cfg: GhConfig,
  newContent: string,
  sha: string | null,
  message: string,
): Promise<void> {
  const url = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${encodeURIComponent(cfg.path).replace(/%2F/g, "/")}`;
  const body: Record<string, unknown> = {
    message,
    content: b64encode(newContent),
  };
  if (sha) body.sha = sha;
  if (cfg.branch) body.branch = cfg.branch;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${cfg.token}`,
      "User-Agent": "majestic-stoff-orders",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("GitHub PUT failed", res.status, text);
    const err = new Error("GitHub PUT failed: " + res.status) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
}

export async function appendOrder(order: OrderInput): Promise<number> {
  const cfg = getConfig();

  const attempt = async (): Promise<number> => {
    const { content, sha } = await ghGet(cfg);
    const n = countOrders(content) + 1;
    const block = formatOrder(n, order);
    const updated = content + block;
    await ghPut(cfg, updated, sha, `New order #${n}`);
    return n;
  };

  try {
    return await attempt();
  } catch (e) {
    const status = (e as { status?: number }).status;
    // 409 conflict or 422 (sha mismatch) — retry once
    if (status === 409 || status === 422) {
      return await attempt();
    }
    throw e;
  }
}
