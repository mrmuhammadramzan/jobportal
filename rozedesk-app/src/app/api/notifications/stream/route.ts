/**
 * GET /api/notifications/stream — Server-Sent Events (SSE) notification stream.
 *
 * Keeps an open HTTP connection per client. Pushes new notifications as
 * `data: <json>\n\n` SSE frames whenever the DB has unseen events.
 *
 * HOW IT WORKS:
 *   - Polls the DB every POLL_MS (4 s) for notifications newer than the
 *     last seen `createdAt`. This is deliberate: no Supabase realtime, no
 *     Redis — just the existing Prisma/MySQL stack.
 *   - On reconnect the client sends `?since=<ISO>` so we don't re-deliver
 *     already-shown notifications.
 *   - Admins receive NEW deposit/withdrawal requests (their userId appears
 *     in the Notification table because createNotification() writes one
 *     per admin). Users receive approval/rejection events.
 *
 * SECURITY:
 *   - requireAuth — unauthenticated requests get 401 immediately.
 *   - Only notifications for req.user.id are streamed.
 *   - No cross-user data leakage possible.
 *
 * Backend SOP Hard Rule 1: auth on every method.
 * DevOps: NEXT_PUBLIC_SSE_POLL_MS env controls the interval (default 4000).
 */
import { NextRequest } from "next/server";
import { db }          from "@/lib/db";
import { getAuthUser } from "@/lib/apiAuth";

export const dynamic = "force-dynamic";

const POLL_MS      = parseInt(process.env.NEXT_PUBLIC_SSE_POLL_MS ?? "4000", 10);
const HEARTBEAT_MS = 25_000; // keep connection alive through proxies

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) {
    return new Response(JSON.stringify({ message: "Not authenticated." }), {
      status:  401,
      headers: { "Content-Type": "application/json" },
    });
  }

  /* `since` lets the client resume without re-delivering past notifications */
  const sinceParam = req.nextUrl.searchParams.get("since");
  let   lastSeen   = sinceParam ? new Date(sinceParam) : new Date();

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      let closed = false;

      const send = (event: string, payload: unknown) => {
        if (closed) return;
        try {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`),
          );
        } catch {
          closed = true;
        }
      };

      /* Initial connection ack */
      send("connected", { ts: new Date().toISOString() });

      /* Poll DB for new notifications */
      const pollId = setInterval(async () => {
        if (closed) { clearInterval(pollId); clearInterval(heartbeatId); return; }
        try {
          const rows = await db.notification.findMany({
            where:   { userId: user.id, createdAt: { gt: lastSeen } },
            orderBy: { createdAt: "asc" },
          });
          if (rows.length) {
            lastSeen = rows[rows.length - 1].createdAt;
            for (const n of rows) {
              send("notification", {
                id:        n.id,
                title:     n.title,
                body:      n.body,
                type:      n.type,
                link:      n.link,
                read:      n.read,
                createdAt: n.createdAt.toISOString(),
              });
            }
          }
        } catch {
          /* DB error — don't crash the stream, just skip this tick */
        }
      }, POLL_MS);

      /* Heartbeat comment to keep the connection alive through CDN/proxies */
      const heartbeatId = setInterval(() => {
        if (closed) return;
        try { controller.enqueue(encoder.encode(": heartbeat\n\n")); }
        catch { closed = true; }
      }, HEARTBEAT_MS);

      /* Clean up when client disconnects */
      req.signal.addEventListener("abort", () => {
        closed = true;
        clearInterval(pollId);
        clearInterval(heartbeatId);
        try { controller.close(); } catch { /* already closed */ }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type":                "text/event-stream; charset=utf-8",
      "Cache-Control":               "no-cache, no-store",
      "Connection":                  "keep-alive",
      "X-Accel-Buffering":           "no",
      /* Restrict to the app's own origin — no cross-origin SSE subscriptions */
      "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    },
  });
}
