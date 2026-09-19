# 2026-09-13 — All Roles — Platform Pivot: Workspace → Job Search

## What changed

| File | Change |
|---|---|
| `src/lib/routes.ts` | Rewrote — full job platform routes: jobs, companies, salaries, resume, postJob, employers, pricing, profile, savedJobs, applications, alerts + helper fns |
| `src/components/NavBar.tsx` | Rewrote — job platform nav: Find Jobs, Companies, Salaries, Resume + Post a Job CTA + Sign In / Get Started |
| `src/components/Footer.tsx` | Rewrote — 4 columns: Job Seekers, Employers, Company, Legal — all links from ROUTES |
| `src/components/JobSearchBar.tsx` | New — hero search bar: job title + location inputs → routes to /jobs with query params |
| `src/app/page.tsx` | Rewrote — full job platform landing page |
| `src/app/signin/page.tsx` | Copy updates — "workspace" → "job dashboard", "Sign up free" → "Create a free account" |
| `src/app/signup/page.tsx` | Rewrote — added Job Seeker / Employer account type selector; dynamic copy per type |
| `src/app/layout.tsx` | Metadata updated — title/description for job platform |
| `src/components/AuthLayout.tsx` | Left panel copy updated — job platform value props |

## Landing page sections

| # | Section | Purpose |
|---|---|---|
| 1 | Hero | Search bar (JobSearchBar component), typewriter headline, popular search terms, micro stats |
| 2 | Featured Companies Marquee | Social proof — top Pakistani tech companies |
| 3 | Job Categories | 6 industry cards linking to /jobs?category=X |
| 4 | How It Works | Dual path: Job Seekers (3 steps) + Employers (3 steps) |
| 5 | Stats | 4 platform numbers with CountUp animation |
| 6 | Features | 6 product features (AI matching, alerts, one-click apply, salary data, company profiles, private mode) |
| 7 | Testimonials | 5 cards: job seekers + employers |
| 8 | Employer CTA Band | Teal gradient band — "Post your first job free" |
| 9 | Pricing | 3 employer plans: Free, Growth (PKR 4,999/mo), Enterprise |
| 10 | FAQ | 6 job-platform-specific questions |
| 11 | Final CTA | "85,000 jobs waiting" — get started / post a job |

## SOP compliance

- **DRY Hard Rule 1**: JobSearchBar checked for existing components before creating — none existed
- **DRY Hard Rule 2**: All routes from ROUTES, all colors from CSS vars, no raw hex
- **Frontend SOP §7**: JobSearchBar has sr-only labels (visible to screen readers), submit feedback, keyboard operable
- **UI/UX SOP §5.1**: Signup page maps seeker vs employer flow before individual screens — account type selector drives different copy, placeholder text, and success message
- **UI/UX SOP §Hard Rule 3**: Contrast maintained — all tokens verified dark-mode-aware
- **UI_MASTER_SKILL §4**: One primary CTA per section — never two primary buttons side-by-side
- **Architecture SOP §7**: Job categories link to `/jobs?category=X` using encodeURIComponent — never raw string interpolation

## Related lessons
None (no user corrections during this session).
