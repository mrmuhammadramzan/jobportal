import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/apiAuth";
import { createNotification } from "@/lib/notify";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(req);
    const { id }    = await params;
    const { status } = await req.json() as { status: string };
    if (!status) return NextResponse.json({ message: "Status required." }, { status: 400 });

    /* Allowlist — reject any value not in the ApplicationStatus enum */
    const VALID_STATUSES = [
      "PENDING_PAYMENT", "PAYMENT_UNDER_REVIEW", "CV_UNDER_REVIEW",
      "SHORTLISTED", "HIRED", "REJECTED",
    ] as const;
    type ValidStatus = typeof VALID_STATUSES[number];
    if (!VALID_STATUSES.includes(status as ValidStatus)) {
      return NextResponse.json(
        { message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 },
      );
    }

    const application = await db.application.update({
      where:   { id },
      data:    { status: status as ValidStatus },
      include: {
        user: { select: { id: true, name: true } },
        job:  { select: { title: true } },
      },
    });

    /* Notify seeker of status change */
    const STATUS_MESSAGES: Record<string, string> = {
      SHORTLISTED:         `Congratulations! You've been shortlisted for "${application.job.title}".`,
      HIRED:               `🎉 You've been hired for "${application.job.title}"! Check your dashboard.`,
      REJECTED:            `Your application for "${application.job.title}" was not successful.`,
      CV_UNDER_REVIEW:     `Your CV for "${application.job.title}" is now under review.`,
    };
    const body = STATUS_MESSAGES[status];
    if (body) {
      createNotification({
        userId: application.userId,
        title:  status === "HIRED" ? "You got the job! 🎉" : status === "SHORTLISTED" ? "You're shortlisted!" : "Application Update",
        body,
        type:   status === "HIRED" || status === "SHORTLISTED" ? "success" : status === "REJECTED" ? "error" : "info",
        link:   "/dashboard/applications",
      });
    }

    return NextResponse.json(application);
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[PATCH /api/admin/applicants/[id]]", e);
    return NextResponse.json({ message: "Failed." }, { status: 500 });
  }
}
