/**
 * POST /api/applications
 * Creates Application + Payment in one transaction.
 * CV from profile or file upload. Receipt file saved to public/uploads/.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/apiAuth";
import { APP_FEE_PKR } from "@/lib/constants";
import { createNotification } from "@/lib/notify";

async function getAppFee(): Promise<number> {
  try {
    const row = await db.platformSetting.findUnique({ where: { key: "appFee" } });
    const fee = row ? parseInt(row.value, 10) : NaN;
    return isNaN(fee) ? APP_FEE_PKR : fee;
  } catch { return APP_FEE_PKR; }
}

async function uploadOrStub(file: File, folder: "cv" | "receipts", userId: string, jobId: string): Promise<string> {
  /* Option 1: Supabase Storage (production — persistent, cloud) */
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { uploadFile } = await import("@/lib/storage");
    return uploadFile(file, folder, userId, jobId);
  }

  /* Option 2: Local filesystem (dev only — NOT persistent on Railway/containers) */
  if (process.env.NODE_ENV !== "production") {
    const ext      = file.name.split(".").pop()?.toLowerCase() ?? "bin";
    const filename = `${userId}_${jobId}_${Date.now()}.${ext}`;
    const webPath  = `/uploads/${folder}/${filename}`;
    try {
      const { writeFile, mkdir } = await import("fs/promises");
      const { join }             = await import("path");
      const dir = join(process.cwd(), "public", "uploads", folder);
      await mkdir(dir, { recursive: true });
      await writeFile(join(dir, filename), Buffer.from(await file.arrayBuffer()));
    } catch (e) { console.error("[uploadOrStub] local write failed:", e); }
    return webPath;
  }

  /* Option 3: Base64 data URL stored in DB (production fallback when no cloud storage)
     Works on any platform — no filesystem dependency.
     Trade-off: larger DB rows. Suitable for receipts (<10MB) and CVs (<5MB).
     Set SUPABASE_SERVICE_ROLE_KEY to use cloud storage instead.           */
  const arrayBuf   = await file.arrayBuffer();
  const base64     = Buffer.from(arrayBuf).toString("base64");
  const mimeType   = file.type || "application/octet-stream";
  return `data:${mimeType};base64,${base64}`;
}

function err(status: number, message: string) {
  return NextResponse.json({ message }, { status });
}

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    const fd   = await req.formData();

    const jobId         = fd.get("jobId")         as string | null;
    const method        = fd.get("paymentMethod") as string | null;
    const receiptRef    = fd.get("receiptRef")    as string | null;
    const cvFromProfile = fd.get("cvFromProfile") as string | null;
    const receiptFile   = fd.get("receipt")       as File   | null;
    const cvFile        = fd.get("cv")            as File   | null;

    if (!jobId)        return err(400, "jobId is required.");
    if (!method)       return err(400, "paymentMethod is required.");
    if (!receiptFile)  return err(400, "Payment receipt is required.");

    const normalizedMethod = method.toUpperCase();
    if (!["JAZZCASH","EASYPAISA"].includes(normalizedMethod)) return err(400, "Invalid payment method.");

    const rxExt = receiptFile.name.split(".").pop()?.toLowerCase() ?? "";
    if (!["jpg","jpeg","png","pdf"].includes(rxExt)) return err(400, "Receipt must be JPG, PNG, or PDF.");
    if (receiptFile.size > 10 * 1024 * 1024) return err(400, "Receipt must be under 10 MB.");

    const usingProfileCv = cvFromProfile === "true";
    if (!usingProfileCv && !cvFile) return err(400, "CV file is required.");
    if (!usingProfileCv && cvFile) {
      const cvExt = cvFile.name.split(".").pop()?.toLowerCase() ?? "";
      if (!["pdf","doc","docx"].includes(cvExt)) return err(400, "CV must be PDF, DOC, or DOCX.");
      if (cvFile.size > 5 * 1024 * 1024) return err(400, "CV must be under 5 MB.");
    }

    const job = await db.job.findUnique({ where: { id: jobId } });
    if (!job || job.status !== "ACTIVE") return err(404, "This job listing is not available.");

    /* Allow re-submission if previous attempt left a PENDING_PAYMENT application */
    const existing = await db.application.findUnique({
      where:   { userId_jobId: { userId: auth.id, jobId } },
      include: { payment: true },
    });
    if (existing) {
      if (existing.status !== "PENDING_PAYMENT") return err(409, "You have already applied for this job.");
      if (existing.payment) await db.payment.delete({ where: { id: existing.payment.id } });
      await db.application.delete({ where: { id: existing.id } });
    }

    const [cvUrl, receiptUrl] = await Promise.all([
      usingProfileCv ? Promise.resolve(`/profile-cv/${auth.id}`) : uploadOrStub(cvFile!, "cv", auth.id, jobId),
      uploadOrStub(receiptFile, "receipts", auth.id, jobId),
    ]);

    const fee    = await getAppFee();
    const result = await db.$transaction(async (tx) => {
      const application = await tx.application.create({
        data: { userId: auth.id, jobId, cvUrl, status: "PENDING_PAYMENT" },
      });
      await tx.payment.create({
        data: { applicationId: application.id, amount: fee, method: normalizedMethod as "JAZZCASH"|"EASYPAISA", receiptUrl, receiptRef: receiptRef?.trim() || null, status: "PENDING" },
      });
      await tx.application.update({ where: { id: application.id }, data: { status: "PAYMENT_UNDER_REVIEW" } });
      return application;
    });

    /* Notifications — fire and forget */
    createNotification({ userId: auth.id, title: "Application Submitted", body: `Your application is submitted. Receipt is under review.`, type: "success", link: "/dashboard/applications" });
    db.user.findFirst({ where: { role: "ADMIN" }, orderBy: { createdAt: "asc" }, select: { id: true } })
      .then(admin => { if (admin) createNotification({ userId: admin.id, title: "New Application", body: `New application with payment receipt pending review.`, type: "applicant", link: "/admin/payments" }); })
      .catch(() => {});

    return NextResponse.json({ applicationId: result.id, status: "PAYMENT_UNDER_REVIEW", message: "Application submitted." }, { status: 201 });

  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[POST /api/applications]", e);
    return NextResponse.json({ message: "Failed to submit application." }, { status: 500 });
  }
}
