/**
 * POST /api/contact  —  the contact form's delivery.
 *
 * Vercel turns any file in /api into a serverless function automatically, with no
 * build step and no framework preset, which is why this is the mechanism: the API
 * key stays on the server, so the browser only ever talks to this site's own origin
 * and the "no third-party requests" property of every page still holds.
 *
 * Two environment variables have to be set in the Vercel project (Settings →
 * Environment Variables), for Production and Preview both:
 *
 *   RESEND_API_KEY   from resend.com, free tier, 3000 emails a month
 *   CONTACT_TO       the address the messages should land in
 *
 * Optionally CONTACT_FROM, if a domain has been verified with Resend. Without it the
 * default below is Resend's own sending address, which works with no DNS setup but
 * will only deliver to the address that owns the Resend account. That is exactly the
 * case here, so it is the right default rather than a compromise.
 *
 * With the variables missing the endpoint answers 503 and the page falls back to a
 * mailto link carrying whatever the visitor typed, so the form is never a dead end
 * during the window between deploying this and adding the key.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const LIMITS = { name: 120, email: 200, subject: 160, message: 5000 };

/* Best effort only. Serverless instances are recycled and run in parallel, so this
   stops a single caller hammering one warm instance and nothing more. The real
   protection is that a message costs the sender an email round trip. */
const recent = new Map();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 4;

function rateLimited(ip) {
  const now = Date.now();
  const hits = (recent.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  if (recent.size > 500) for (const [k, v] of recent) if (!v.some((t) => now - t < RATE_WINDOW_MS)) recent.delete(k);
  return hits.length > RATE_MAX;
}

const clean = (v, max) => String(v == null ? "" : v).replace(/\s+/g, " ").trim().slice(0, max);
/* Deliberately loose. The only thing that matters is that Reply-To is usable; a
   stricter pattern rejects real addresses far more often than it catches fake ones. */
const looksLikeEmail = (v) => /^[^\s@]+@[^\s@.]+\.[^\s@]+$/.test(v);

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  if (!key || !to) {
    /* Naming which one is absent turns a dead end into a ten-second fix, and it is not
       a leak: the variable names are in this file, which is public. The values never
       appear. The three things that cause this, in order of how often they do:
       the variable is ticked for Preview but not Production, the deployment predates
       the variable being saved, or the name has a typo or a trailing space. */
    const missing = [!key && "RESEND_API_KEY", !to && "CONTACT_TO"].filter(Boolean);
    return res.status(503).json({ error: "unconfigured", missing });
  }

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = null; } }
  if (!body || typeof body !== "object") return res.status(400).json({ error: "bad_request" });

  /* A field no human can see and no human fills in. Answer 200 anyway: telling a bot
     it was caught only tells it what to change. */
  if (clean(body.company, 100)) return res.status(200).json({ ok: true });

  const name = clean(body.name, LIMITS.name);
  const email = clean(body.email, LIMITS.email);
  const subject = clean(body.subject, LIMITS.subject);
  const message = String(body.message == null ? "" : body.message).trim().slice(0, LIMITS.message);

  const missing = [];
  if (!name) missing.push("name");
  if (!looksLikeEmail(email)) missing.push("email");
  if (!message) missing.push("message");
  if (missing.length) return res.status(400).json({ error: "invalid", fields: missing });

  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) return res.status(429).json({ error: "rate_limited" });

  const line = subject ? `${subject} — from ${name}` : `Message from ${name}`;
  const html =
    `<p style="margin:0 0 16px"><strong>${esc(name)}</strong> &lt;${esc(email)}&gt;</p>` +
    (subject ? `<p style="margin:0 0 16px">Subject: ${esc(subject)}</p>` : "") +
    `<div style="white-space:pre-wrap;line-height:1.6">${esc(message)}</div>` +
    `<hr style="margin:24px 0;border:none;border-top:1px solid #ddd">` +
    `<p style="margin:0;color:#666;font-size:13px">Sent from the contact form on the Santiago Aguilera Library.</p>`;

  try {
    const r = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || "Santiago Aguilera Library <onboarding@resend.dev>",
        to: [to],
        reply_to: email,          // so hitting reply answers the visitor, not the robot
        subject: line,
        html,
        text: `${name} <${email}>\n${subject ? subject + "\n" : ""}\n${message}`
      })
    });
    if (!r.ok) {
      const detail = await r.text().catch(() => "");
      console.error("resend failed", r.status, detail.slice(0, 400));
      return res.status(502).json({ error: "send_failed", status: r.status, detail: detail.slice(0, 300) });
    }
    /* Resend answers with the id it filed the message under. Accepted is not the same
       as delivered: from here it can still be greylisted, spam-foldered or bounced, and
       none of that comes back on this request. Handing the id back is what makes the
       difference findable in Resend's own Emails log rather than a guess. */
    const body = await r.json().catch(() => ({}));
    console.log("resend accepted", body.id || "(no id)");
    return res.status(200).json({ ok: true, id: body.id || null });
  } catch (e) {
    console.error("resend threw", e && e.message);
    return res.status(502).json({ error: "send_failed" });
  }
};
