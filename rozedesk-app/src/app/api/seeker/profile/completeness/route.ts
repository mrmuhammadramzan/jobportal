/**
 * GET /api/seeker/profile/completeness
 * Returns profile completeness percentage and list of missing fields.
 * Used to gate the Apply flow and show progress on dashboard.
 * Backend SOP Hard Rule 1: requireAuth.
 * MySQL: Json fields need Array.isArray() not .length directly.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/apiAuth";

interface CheckItem { label: string; done: boolean; weight: number; }

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    const user = await db.user.findUnique({
      where:   { id: auth.id },
      include: { profile: true },
    });
    if (!user) return NextResponse.json({ message: "Not found." }, { status: 404 });

    const p      = user.profile;
    const edu    = Array.isArray(p?.education)  ? (p.education  as unknown[]) : [];
    const exp    = Array.isArray(p?.experience) ? (p.experience as unknown[]) : [];
    const skills = Array.isArray(p?.skills)     ? (p.skills     as unknown[]) : [];

    const checks: CheckItem[] = [
      { label:"Full name",                    done: Boolean(user.name?.trim()),           weight: 10 },
      { label:"Phone number",                 done: Boolean(p?.phone),                    weight: 8  },
      { label:"Location",                     done: Boolean(p?.location),                 weight: 7  },
      { label:"Professional summary",         done: Boolean(p?.summary?.trim()),          weight: 10 },
      { label:"At least 3 skills",            done: skills.length >= 3,                   weight: 10 },
      { label:"Education (at least 1)",       done: edu.length > 0,                       weight: 15 },
      { label:"Work experience (at least 1)", done: exp.length > 0,                       weight: 15 },
      { label:"Job type preference",          done: Boolean(p?.jobType),                  weight: 5  },
      { label:"Expected salary",              done: Boolean(p?.desiredSalary),            weight: 5  },
      { label:"LinkedIn profile",             done: Boolean(p?.linkedin),                 weight: 8  },
      { label:"Portfolio or GitHub",          done: Boolean(p?.portfolio || p?.github),   weight: 7  },
    ];

    const totalWeight  = checks.reduce((s, c) => s + c.weight, 0);
    const earnedWeight = checks.filter(c => c.done).reduce((s, c) => s + c.weight, 0);
    const pct          = Math.round((earnedWeight / totalWeight) * 100);
    const missing      = checks.filter(c => !c.done).map(c => c.label);
    const canApply     = pct >= 60;

    return NextResponse.json({ pct, canApply, missing, checks });
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[GET /api/seeker/profile/completeness]", e);
    return NextResponse.json({ message: "Failed." }, { status: 500 });
  }
}
