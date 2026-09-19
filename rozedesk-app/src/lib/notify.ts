/**
 * notify.ts — Server-side notification creation helper.
 *
 * DRY: call createNotification() from any API route to send
 * a notification to a user. Never build notification objects inline.
 *
 * Silent — errors are logged but never propagate to the caller.
 * Notifications are non-critical; a failure must never break the main action.
 */
import { db } from "@/lib/db";

export interface NotifyPayload {
  userId: string;
  title:  string;
  body:   string;
  type?:  "info" | "success" | "warning" | "error" | "applicant" | "payment";
  link?:  string;
}

export async function createNotification(payload: NotifyPayload): Promise<void> {
  try {
    await db.notification.create({
      data: {
        userId: payload.userId,
        title:  payload.title,
        body:   payload.body,
        type:   payload.type ?? "info",
        link:   payload.link ?? null,
      },
    });
  } catch (e) {
    /* Non-fatal — log and continue */
    console.error("[notify] Failed to create notification:", e);
  }
}
