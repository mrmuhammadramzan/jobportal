/**
 * GET /api/jobs — public job listings with filtering
 * Query params: q, category, location, type, sort, page, limit
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const q        = searchParams.get("q")        ?? "";
    const category = searchParams.get("category") ?? "";
    const location = searchParams.get("location") ?? "";
    const type     = searchParams.get("type")     ?? "";
    const sort     = searchParams.get("sort")     ?? "latest";
    const page     = Math.max(1, Number(searchParams.get("page") ?? "1"));
    const limit    = Math.min(50, Number(searchParams.get("limit") ?? "20"));
    const skip     = (page - 1) * limit;

    const where = {
      status: "ACTIVE" as const,
      ...(q        ? { OR: [
        { title:       { contains: q        } },
        { company:     { contains: q        } },
        { description: { contains: q        } },
      ]} : {}),
      ...(category ? { category: { equals:   category } } : {}),
      ...(location ? { location: { contains: location } } : {}),
      ...(type     ? { type:     { equals:   type     } } : {}),
    };

    const orderBy = sort === "applicants"
      ? { applications: { _count: "desc" as const } }
      : { createdAt: "desc" as const };

    const [jobs, total] = await Promise.all([
      db.job.findMany({ where, orderBy, skip, take: limit,
        include: { _count: { select: { applications: true } } } }),
      db.job.count({ where }),
    ]);

    return NextResponse.json({
      jobs: jobs.map(j => ({
        id:           j.id,
        title:        j.title,
        company:      j.company,
        location:     j.location,
        type:         j.type,
        category:     j.category,
        salaryMin:    j.salaryMin,
        salaryMax:    j.salaryMax,
        deadline:     j.deadline,
        status:       j.status,
        postedAt:     j.createdAt,
        applicants:   j._count.applications,
        requirements: Array.isArray(j.requirements) ? j.requirements : [],
        benefits:     Array.isArray(j.benefits)     ? j.benefits     : [],
      })),
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (e) {
    console.error("[GET /api/jobs]", e);
    return NextResponse.json({ message: "Failed to load jobs." }, { status: 500 });
  }
}
