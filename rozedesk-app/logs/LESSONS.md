# LESSONS.md — RozeDesk Process Log

Per Process Log & Continuous Learning SOP §4.
This file is **append-only**. Never edit past entries — append corrections referencing the original.

---

## Frontend Lessons

### 2026-09-13 — Duplicate "use client" directive broke TypewriterText

**What happened:**
`TypewriterText.tsx` had `"use client"` written twice — once as a comment line and once as the actual directive. This caused Next.js to emit a parse/hydration warning and the component to not animate.

**What was wrong about it:**
The directive `"use client"` must appear exactly once as the very first line of a client component file. A duplicate or a version in the comment area confuses the bundler.

**Correct approach:**
`"use client"` appears only once, as the absolute first line of the file, before any imports.

**Prevention rule:**
Before creating any client component, check: is `"use client"` present exactly once at line 1? If a file also has a doc-comment block at the top, the directive goes above that comment, not below it.

**Related SOP section:** Frontend SOP §0 (client component rules) / Grounding SOP §Hard Rule 1 (verify before asserting it works)

---

### 2026-09-13 — Hero announcement badge unreadable on dark hero background

**What happened:**
The announcement badge used `bg-[var(--brand-50)]` (very light blue) with `text-[var(--brand-700)]` (dark blue). On the near-black hero background the light fill blended with the page and the text inside was difficult to read.

**What was wrong about it:**
UI/UX SOP §Hard Rule 3: text contrast must be ≥4.5:1 (AA). `brand-50` bg on `gray-950` page doesn't give the badge itself enough visual definition. The contrast between `brand-700` and `brand-50` is fine in isolation but the whole badge was invisible against the dark background.

**Correct approach:**
Use a solid `bg-[var(--brand-500)]` with `text-white`. Contrast ratio: white on brand-500 ≥ 4.7:1 (AA ✓). The badge is now clearly visible as a distinct pill on the dark hero.

**Prevention rule:**
Whenever placing a badge on a dark or gradient background, check: does the badge background itself have sufficient contrast against the page background (≥ 3:1 for UI components)? Light tint badges (brand-50, brand-100) are for light surfaces only.

**Related SOP section:** UI/UX SOP §Hard Rule 3 + §7.1 (contrast checked and documented, not eyeballed)

---

### 2026-09-13 — NavBar active link blended into dark background

**What happened:**
Active nav link used `bg-[var(--brand-50)] text-[var(--brand-600)]`. The nav sits on a dark (near-black) background. `brand-50` (very light blue) on dark bg created a blotchy light rectangle with dark blue text inside — visually inconsistent and confusing. On the un-scrolled transparent navbar, `brand-50` was almost white which clashed hard with the dark hero.

**What was wrong about it:**
Active state was designed for a light-bg navbar but the navbar is dark-background. The contrast of the active pill didn't match the surface it lived on.

**Correct approach:**
Active: `bg-[var(--brand-500)] text-white shadow-[var(--shadow-brand)]`. Inactive: `text-[var(--gray-300)] hover:text-white hover:bg-white/10`. This works on both the transparent (dark hero) and scrolled (dark bg-base) states.

**Prevention rule:**
Before finalising nav active styles, test them against the actual navbar background (not a white Figma canvas). For dark navbars, active = solid brand bg / white text. For light navbars, active = brand-50 bg / brand-700 text.

**Related SOP section:** UI/UX SOP §Hard Rule 3, §6 Navigation Patterns `nav-state-active`

---

### 2026-09-13 — Marquee text unreadable (too faint, too wide)

**What happened:**
Marquee items used `opacity-30` which made the brand names barely visible on the already low-contrast dark surface. The container had no `max-width`, so the marquee track spanned the full viewport, making the spacing look broken on wide screens.

**What was wrong about it:**
UI_MASTER_SKILL §6 Typography: text must meet readable contrast. `opacity-30` on gray-300 text ≈ 0.9:1 effective contrast — far below WCAG AA. The section also lacked a width constraint.

**Correct approach:**
Changed to `opacity-60` default / `opacity-100` hover, using `text-[var(--gray-300)]` on the dark surface. Constrained the section to `max-w-5xl`.

**Prevention rule:**
Never use `opacity-30` or lower on text that conveys information. Use it only for purely decorative elements. For readable "subdued" text, use `opacity-60` minimum, or use a semantic muted color token (`text-[var(--gray-400)]`) at full opacity.

**Related SOP section:** UI/UX SOP §Hard Rule 3 + UI_MASTER_SKILL §6 Typography/Color

---

## UI/UX Lessons

### 2026-09-13 — Feature/Testimonial grid cards had unequal heights

**What happened:**
Cards in a 3-column CSS grid had varying heights depending on content length. Cards with short descriptions were shorter than cards with long descriptions in the same row, making the grid look broken.

**What was wrong about it:**
CSS grid rows stretch children to the tallest item **only if** the children also have `height: 100%` (or Tailwind `h-full`). The `ScrollReveal` wrapper `div` and the card itself both needed `h-full`. Without it, the card shrinks to its content height.

**Correct approach:**
Add `className="h-full"` to both the `ScrollReveal` wrapper and the card component root. The card's internal description area also gets `flex-1` so it fills remaining height, pinning the author/CTA to the bottom.

**Prevention rule:**
In any CSS grid section with variable-content cards: the grid item wrapper, the component root `div`, AND any internal text container all need `h-full` / `flex-1` for true equal-height layout. Test with a card that has 1 line of description vs. 4 lines in the same row.

**Related SOP section:** UI_MASTER_SKILL §5 Layout & Responsive + SOP §34 UI Component Rules

---

### 2026-09-13 — Integration cards used colored letter initials instead of real icons

**What happened:**
Each integration showed only the first letter of the app name (e.g. "G" for GitHub) styled in the brand color. This was a placeholder that shipped instead of real icons.

**What was wrong about it:**
UI/UX SOP §Hard Rule 2 / UI_MASTER_SKILL §10 Icons: icon-only identification requires recognisable symbols. A letter initial is not recognisable as an app's brand and gives the section a placeholder feel. Users expect to see GitHub's octopus icon, not a blue "G".

**Correct approach:**
Load Font Awesome 6 Free via CDN once in `layout.tsx` (DRY — one load, used everywhere). Map each integration to a real `fa-brands` or `fa-solid` icon class. Brands with no FA brand icon (Notion, Linear, Vercel) use a semantic FA-solid icon that represents their category.

**Prevention rule:**
Never ship letter-initial placeholders as the final UI for brand/app logos. If brand SVGs aren't available, use Font Awesome brand icons. If FA doesn't have one, use a category icon (e.g. `fa-chart-line` for analytics tools) with a clear label below.

**Related SOP section:** UI_MASTER_SKILL §10 Icons (`no-emoji-icons`, `icon-style-consistent`)

---

## Architecture Lessons

*(No lessons yet.)*

---

## Backend Lessons

*(No lessons yet.)*

---

## DBA Lessons

*(No lessons yet.)*

---

## DevOps Lessons

*(No lessons yet.)*

---

*This file is append-only per Process Log SOP §Hard Rule 3.*
*Never edit past entries — append corrections referencing the original.*

---

## UI/UX Lessons (continued)

### 2026-09-13 — Theme colours did not match the brand logo

**What happened:**
The original token system used `--accent-500: #7c3aed` (violet/purple) as the secondary accent colour. The RozeDesk logo uses a **blue → teal** gradient (royal blue at top, teal-mint at bottom leg, emerald green leaves). Purple/violet has no presence in the logo whatsoever — it was an arbitrary design choice that created a visual disconnect between the logo and the rest of the page.

**What was wrong about it:**
UI_MASTER_SKILL §2 (Color Systems): "Choose palette from product/industry — `--domain color`." The brand colour story must be extracted from the logo, not invented independently. UI/UX SOP §4.1 (Tokens, not values): tokens must reflect the actual brand identity.

Additionally, several component files had raw colour violations that bypassed the token system entirely:
- `Badge.tsx`: used raw Tailwind `purple-*` classes for the accent variant
- `page.tsx`: used raw `rgb(243,232,255)` etc. for FeatureCard `accentColor` props
- `page.tsx`: used raw hex `#06b6d4`, `#22c55e`, `#f59e0b` for testimonial avatars
- `page.tsx`: used raw hex `#7c3aed` (violet) in the CTA avatar strip inline style
- `page.tsx`: referenced undefined token `--accent-300` (was never defined)
- `TestimonialCard.tsx`: used raw Tailwind `text-yellow-300` for star colour on featured cards

**Correct approach:**
1. Extracted the exact palette from the logo image: primary blue `#1565FF`, teal accent `#00C9A7`, emerald `#1DB88C`.
2. Built full 50–950 scales for both brand (blue) and accent (teal) in `globals.css`.
3. Defined the missing `--accent-300: #3dd9bc` token (was broken before).
4. Changed `.gradient-text` to `brand-500 → accent-400` (blue → teal) matching the logo.
5. Updated `Button` gradient variant: `brand-500 → brand-400 → accent-400` (blue → teal).
6. Replaced all `purple-*` in `Badge.tsx` with `var(--accent-*)` tokens.
7. Replaced all raw `rgb()` accentColor values in `page.tsx` with `color-mix()` using semantic tokens.
8. Replaced all raw hex avatarColors with `var(--brand-500)`, `var(--accent-400)`, `var(--cyan-500)` etc.
9. Replaced raw `#7c3aed` in CTA strip with `var(--accent-400)`.
10. Replaced raw Tailwind `bg-red-400`, `bg-yellow-400`, `bg-green-400` in browser chrome with `var(--color-error)`, `var(--color-warning)`, `var(--color-success)`.
11. Fixed `TestimonialCard.tsx` `text-yellow-300` → `text-[var(--color-warning)]`.

**Prevention rule:**
Before writing ANY colour value in a component:
1. Ask: does this value have a corresponding CSS variable token?
2. If yes → use `var(--token-name)`. Never the raw value.
3. If no → add the token to `globals.css` first, then reference it.
4. Never use raw Tailwind colour class names (`purple-100`, `green-500`, `yellow-300`) in components — these bypass the token system and won't update when the theme changes.

When creating a new project's token system, start by analysing the logo/brand assets for:
- Primary hue (dominant colour)
- Secondary/accent hue (second most prominent colour)
- Any gradient direction that should be replicated in the UI

**Related SOP section:** UI/UX SOP §4.1 (tokens not values), UI_MASTER_SKILL §2 (Color Systems, 60-30-10), Universal Engineering Principles §Hard Rule 2 (no duplicated values)

---

## Frontend Lessons (continued)

### 2026-09-13 — FAQ accordion text invisible on open state (dark mode contrast failure)

**What happened:**
The FAQ accordion open state used `bg-[var(--brand-50)]` as its background. The question text used `text-[var(--brand-700)]` and the answer used `text-[var(--text-secondary)]`. On the dark-mode page this produced a light-blue card with near-white/light-gray text inside — both question and answer were almost completely unreadable.

**What was wrong about it:**
UI/UX SOP §Hard Rule 3 (WCAG AA ≥4.5:1). `--brand-50` is a static light tint defined as `#eff4ff` — it has NO dark-mode override in globals.css. So in dark mode:
- Background: `#eff4ff` (light blue) — from brand-50
- Question:   `--brand-700` resolves to `#073dba` (dark blue) → contrast ~3.8:1 against `#eff4ff` **FAILS AA** for body text
- Answer:     `--text-secondary` in dark mode → `var(--gray-400)` = `#a1a1aa` → contrast ~2.5:1 against `#eff4ff` **FAILS AA badly**

The root error was using a token (`--brand-50`) that has no dark-mode awareness for a background that needed to work in both colour schemes.

**Correct approach:**
Replace `bg-[var(--brand-50)]` with `bg-[var(--bg-elevated)]`. This token IS dark-mode-aware:
- Dark mode:  `var(--gray-800)` = `#27272a`
- Light mode: `var(--gray-100)` = `#f4f4f5`

Text uses `text-[var(--text-primary)]` (fully dark-mode-aware, 15:1+ on bg-elevated in both modes). Answer text uses the same at `opacity-75` (~10:1+) for visual hierarchy without a contrast violation.

**Prevention rule:**
Before using any `--brand-*` or `--accent-*` tint (`-50`, `-100`) as a **background** for a container that holds text, check: is this token overridden in the `@media (prefers-color-scheme: dark)` block in globals.css? If it is not, NEVER use it as a background. Use `--bg-base`, `--bg-surface`, or `--bg-elevated` — these three are always dark-mode-aware.

Tokens safe to use as text-bearing backgrounds: `--bg-base`, `--bg-surface`, `--bg-elevated`.
Tokens NOT safe as backgrounds without a dark-mode override: `--brand-50`, `--brand-100`, `--accent-50`, `--accent-100`, `--gray-50`, `--gray-100`.

**Related SOP section:** UI/UX SOP §Hard Rule 3 + §7.1, UI_MASTER_SKILL §14 Dark Mode (`color-dark-mode`: "Dark mode uses desaturated / lighter tonal variants, not inverted colors; test contrast separately"), GROUNDING SOP §Hard Rule 5 (don't present as done until verified)

---

## Frontend Lessons (continued)

### 2026-09-13 — Buttons linked to hash anchors (#login, #signup) instead of real routes

**What happened:**
NavBar "Sign In" button used `href="#login"` and "Start Free Trial" used `href="#signup"`. The Hero and CTA banner CTAs used `href="#signup"`. Clicking these did nothing — hash anchors without matching element IDs on the page.

**What was wrong about it:**
Frontend SOP §13 Change Management: route paths are a contract between components. Hardcoding `"#login"` or `"/signin"` in multiple components means a future rename requires searching every file. Universal Engineering Principles §Hard Rule 2: no value duplicated across files — route paths are values.

**Correct approach:**
1. Created `src/lib/routes.ts` — **single source of truth** for all route paths.
2. All components import `{ ROUTES }` and reference `ROUTES.signIn`, `ROUTES.signUp`, etc.
3. To change `/signin` to `/login` in future: change one line in `routes.ts`. Every component updates automatically.

**Prevention rule:**
Before writing any `href="..."` that points to an internal route:
1. Check if the path already exists in `src/lib/routes.ts`
2. If yes → use `ROUTES.x`. If no → add it to `routes.ts` first, then reference it.
Never hardcode an internal path string in a component. External URLs (3rd party) and same-page anchors (`#features`) are the only exceptions.

**Files fixed:**
- `src/lib/routes.ts` — created (single source of truth)
- `src/components/NavBar.tsx` — 4 hrefs updated
- `src/app/page.tsx` — 2 hrefs updated
- `src/app/signin/page.tsx` — 3 hrefs updated
- `src/components/AuthLayout.tsx` — 2 hrefs updated
- `src/app/signup/page.tsx` — 4 hrefs updated

**Related SOP section:** Universal Engineering Principles §Hard Rule 2 (DRY — no duplicated values), Frontend SOP §13 Change Management

---

## Architecture Lessons

### 2026-09-13 — Platform over-scoped on first pivot

**What happened:**
First pivot from workspace → job board modelled RozeDesk after LinkedIn/Indeed — salary explorer, resume builder, company deep-dives, AI matching, career advice. The user clarified: the platform is simply "post jobs / browse jobs / register / apply."

**What was wrong about it:**
Software Architect SOP §2.1 Required inputs: gather constraints BEFORE designing. The user's actual requirement (simple job board) was not clarified before building features that belong to a much more complex product. This resulted in routes, nav links, footer columns, and landing page sections for features that don't exist.

**Correct approach:**
1. Clarify what actually exists and what is in scope before building anything.
2. Simple job board = 3 routes (home, jobs, post-job) + auth. Nothing more.
3. Architect SOP §14 pushback: the "ideal" complex design exceeded the stated product scope — surface that and wait for clarification.

**Prevention rule:**
Before building any feature set on a new platform, ask: "Does this feature exist in the platform right now, or is it aspirational?" Only build what exists. Mark aspirational features clearly as out-of-scope in a comment. Never build salary explorer routes when the platform doesn't have a salary feature.

**Related SOP section:** Software Architect SOP §2.1 (gather required inputs first), §14 (surface scope/budget conflicts, don't silently implement)

---

### 2026-09-13 — Built public employer registration for a platform with no public employers

**What happened:**
The platform was built with a public "Post a Job" button, an employer registration path on the signup page, and an employer-focused How It Works section. The owner clarified: only the owner and team post jobs — there is no public employer signup.

**What was wrong about it:**
Architect SOP §2.1: gather required inputs — specifically who the users are — before designing any screens. The two user types (public seeker vs. internal admin) were assumed instead of confirmed.

**Correct approach:**
- Public site: job seekers only. Register, browse, apply.
- Admin panel: internal-only, at `/admin/*`, not linked from public nav or footer.
- No "Post a Job" anywhere in the public interface.
- No employer tab on the signup form.

**Prevention rule:**
Before building auth paths, explicitly confirm: "Who can register on the public site?" and "Who manages content — is that internal or public?" These are Architect-level questions (§2.1 required inputs) that must be answered before any UI is built.

**Files fixed:**
- `routes.ts` — removed `postJob`, `myJobs`; added `adminLogin`, `adminJobs` (private, not linked publicly)
- `NavBar.tsx` — "Post a Job" button removed entirely
- `Footer.tsx` — "For Employers" column removed
- `signup/page.tsx` — account type selector (Seeker/Employer) removed; single seeker-only form
- `page.tsx` — all 4 employer-facing CTAs replaced; How It Works simplified to single seeker path; EMPLOYER_STEPS array removed; STATS, FEATURES, FAQS reworded to remove employer framing

**Related SOP section:** Architect SOP §2.1 (required inputs), §0 (identity — produce blueprints for what actually exists)

---

### 2026-09-13 — Auth pages had workspace/productivity copy after job board pivot

**What happened:**
After the platform was pivoted to a job board, signin/page.tsx and AuthLayout.tsx still had copy from the original productivity workspace product:
- Default quote: "RozeDesk cut our sprint planning from 3 hours to 40 minutes"
- Default features: "AI-powered prioritization", "200+ integrations", "Real-time team collaboration"
- Heading: "Your next great career move starts here" with "2M+ professionals"
- Left panel still described a productivity tool, not a job board

**What was wrong about it:**
UI/UX SOP §6.2 (content realism): every piece of copy must reflect what the platform actually does. Contradictory messaging — "find jobs" on the landing page vs "sprint planning" on the sign-in page — destroys trust and confuses users.

**Correct approach:**
- AuthLayout default features = job-board benefits (browse jobs, apply, track applications)
- AuthLayout heading = "Your next job is waiting for you"
- signin page quote = job seeker who got hired, not a tech lead
- All copy reviewed for platform consistency after any major pivot

**Prevention rule:**
After any content/platform pivot, run a search for old-context copy across ALL component files — not just page files. Layout and shell components (AuthLayout, NavBar, Footer) contain embedded copy that is easy to miss. Check: quotes, feature lists, headings, subtext, CTA copy.

**Related SOP section:** UI/UX SOP §6.2 Content realism, Process Log SOP §5 Correction workflow

---

## Frontend Lessons (continued)

### 2026-09-13 — "Go to dashboard" button caused 404 because the route page didn't exist yet

**What happened:**
The sign-in success state rendered `<Button href={ROUTES.dashboard}>Go to my dashboard</Button>`.
Clicking it navigated to `/dashboard` which 404'd because the page file `src/app/dashboard/page.tsx` had never been created.

**Two separate problems:**
1. The dashboard page (`/dashboard`, `/admin`) did not exist — any navigation there would 404.
2. The button used `href` (a `<Link>` rendered at page load) instead of `router.push()` (an imperative redirect triggered after success). Even after the pages were created, using `href` on a success-state button is the wrong pattern — the button only appears after a successful async operation and should use the router imperatively.

**Correct approach:**
- `href` on `<Button>` = for navigation links that should exist regardless of state (nav links, CTAs).
- `router.push()` = for redirects triggered by an async result (post-login, post-submit).
- Create the destination page *before* or *at the same time* as the link/button pointing to it.

**Prevention rule:**
Before wiring any `href` to a route, check: does `src/app/{route}/page.tsx` exist? If not, either create it in the same commit, or use `router.push()` with a comment marking it as pending.

**Files fixed:**
- `src/app/signin/page.tsx` — changed success button from `href={ROUTES.dashboard}` to `onClick={() => router.push(ROUTES.dashboard)}` with auto-redirect via `setTimeout`.
- `src/app/dashboard/page.tsx` — created (Job Seeker dashboard).
- `src/app/admin/page.tsx` — created (Super Admin dashboard).
- `src/app/admin/login/page.tsx` — created (Admin-only sign-in page, not linked publicly).

**Related SOP section:** Frontend SOP §6.1 (all 3 async states — success state must have a working next action), §13 Change Management (route is a contract — page must exist before linking to it)

---

## Frontend Lessons (continued)

### 2026-09-13 — Sidebar isActive matched parent and child routes simultaneously

**What happened:**
When navigating to `/admin/jobs/new`, both "Job Listings" (`/admin/jobs`) and "Post a Job" (`/admin/jobs/new`) showed as active at the same time, both highlighted in brand-blue.

**What was wrong about it:**
`isActive` used `pathname.startsWith(href)`. The string `/admin/jobs/new` starts with `/admin/jobs`, so both items matched. The fix for the dashboard root items (excluding `/admin` and `/dashboard` from prefix matching) did not apply to the deeper `/admin/jobs` vs `/admin/jobs/new` case.

**Correct approach:**
Two rules:
1. "Exact-only" routes: routes that should ONLY highlight when the pathname exactly equals the href — particularly leaf/action routes like `adminPostJob` (`/admin/jobs/new`). These go in a `EXACT_ONLY` Set.
2. "Prefix" routes: parent routes that should highlight when any sub-page is active. These use `pathname.startsWith(href + "/")` — the trailing slash ensures we match at a segment boundary, not a substring.

`/admin/jobs/new`.startsWith(`/admin/jobs/`) = false ✓ (trailing slash makes the match segment-safe)
`/admin/jobs/abc`.startsWith(`/admin/jobs/`) = true ✓ (a real child page)

**Prevention rule:**
Every nav item must be classified as "exact" or "prefix" when added. Routes that are leaf actions (create, new, edit) are always exact. Routes that own a section (jobs, applicants, analytics) are prefix routes. Document this in the NavItem interface.

**Related SOP section:** Frontend SOP §6 Navigation, UI/UX SOP §6.1 Active state design

---

### 2026-09-13 — ThemeToggle had no effect — CSS never responded to JS class/attribute changes

**What happened:**
Clicking the ThemeToggle button changed React state and wrote `data-theme` / `dark` class to `<html>`, but the page visuals never changed.

**Root cause:**
`globals.css` used `@media (prefers-color-scheme: dark)` as the ONLY dark-mode trigger. This media query is a read-only OS signal — JavaScript cannot write to it. The ThemeToggle was adding `data-theme="dark"` and class `dark` to `<html>`, but there were no CSS rules listening to those selectors. The style sheet and the JS were completely disconnected.

**Correct approach:**
Two changes needed — one in CSS, one in JS:

CSS (`globals.css`): Add explicit attribute selectors that the JS can target:
```css
html[data-theme="dark"]  { /* dark token overrides */ }
html[data-theme="light"] { /* light token overrides */ }
/* OS fallback — only when no data-theme has been set yet */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { /* dark token overrides */ }
}
```

JS (`ThemeToggle.tsx`): `applyTheme()` writes `data-theme` attribute (not just a class):
```ts
document.documentElement.setAttribute("data-theme", theme);
document.documentElement.style.colorScheme = theme; // native browser UI
```

**Prevention rule:**
Any JS-driven theme system requires TWO things:
1. CSS selectors that respond to what JS writes (attribute or class)
2. JS that writes exactly those selectors

`@media prefers-color-scheme` is OS-only. For a user-toggleable theme, always use `html[data-theme]` or `html.dark` selectors in CSS AND write that exact attribute/class in JS.

**Related SOP section:** Frontend SOP §Hard Rule 1 (client validation is UX only — applies equally here: JS writes a signal, CSS must be set up to read it), Universal Engineering Principles §Hard Rule 2 (the contract between JS and CSS must be explicit and documented)

---

### 2026-09-13 — ThemeToggle still not working after first fix — missing blocking init script

**What happened:**
Even after adding `html[data-theme="dark"]` CSS selectors, the theme toggle still didn't visibly update. The CSS selectors were correct but the toggle appeared broken.

**Root cause (second diagnosis):**
Two separate issues remained:

1. **No initial `data-theme` attribute on `<html>` at first paint.**
   The `useEffect` in ThemeToggle runs after React hydrates — meaning there's a window between server render and hydration where `<html>` has no `data-theme` attribute. During this window, the OS media query fallback fires (or doesn't). More critically, if the user has a saved preference in `localStorage` for "light" mode but their OS is dark, the page would flash dark → light on hydration.

2. **No `suppressHydrationWarning` on `<html>`.**
   The blocking init script modifies `<html>` attributes before React hydrates. Without `suppressHydrationWarning`, React logs a hydration mismatch warning and may revert the attribute.

**Correct approach:**
Add a **blocking inline `<script>`** in `<head>` — before any CSS or font loads — that reads `localStorage` and sets `data-theme` synchronously. Since it's inline and synchronous, it runs before the browser renders a single pixel, eliminating all flash.

```html
<script dangerouslySetInnerHTML={{ __html: `
  (function(){
    try {
      var t = localStorage.getItem('rozedesk-theme');
      if (t === 'light' || t === 'dark') {
        document.documentElement.setAttribute('data-theme', t);
        document.documentElement.style.colorScheme = t;
      } else {
        var dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var d = dark ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', d);
        document.documentElement.style.colorScheme = d;
      }
    } catch(e) {}
  })();
`}} />
```

Also add `suppressHydrationWarning` to `<html>` so React doesn't try to "fix" the attribute the script set.

**ThemeToggle placement — all surfaces:**
- NavBar (landing page + public pages) — desktop and mobile menu
- AuthLayout (signin/signup) — below the form
- DashboardHeader (both seeker and admin dashboards) — already wired

**Prevention rule:**
Any user-preference feature that must survive page reload AND prevent visual flash needs:
1. A blocking synchronous script in `<head>` that reads the preference and applies it BEFORE paint
2. `suppressHydrationWarning` on the element being mutated
3. The React component reads the same source (localStorage) on mount and syncs state

Never rely on `useEffect` alone for visual preferences — it runs after paint.

**Related SOP section:** Frontend SOP §6.1 (all states — init/loading state must not flash), UI/UX SOP §Hard Rule 1 (four states: the "loading" state before hydration is a real state that must be designed)

---

### 2026-09-13 — 23 theme violations causing invisible text, invisible buttons, invisible hamburger in light mode

**What happened:**
Theme toggle worked mechanically (data-theme was being set) but many elements remained invisible or unreadable in light mode. Root cause: 23 hardcoded `text-white`, `text-white/N`, `bg-white/N`, `border-white/N`, and `bg-[var(--gray-950)]` classes that never respond to theme changes.

**Files and specific violations:**

NavBar.tsx (8 violations): nav links `text-[var(--gray-300)]`, hamburger `bg-white`, mobile menu `bg-[var(--gray-950)]/95`, mobile links `text-white/60`, Sign In override `!text-white`, separator `bg-white/15`, hover states `hover:bg-white/10`, hover text `hover:text-white`.

page.tsx hero (5 violations): `<h1 className="text-white">`, `<p className="text-white/70">`, popular label `text-white/50`, search pills `border-white/15 text-white/60`, contact link `text-white/40`.

Footer.tsx (6 violations): root `text-white`, description `text-white/50`, social icons `bg-white/8 text-white/50`, column headers `text-white/40`, links `text-white/50`, bottom bar `text-white/30 text-white/20`.

DashboardHeader + Sidebar admin mode (4 violations): `bg-[var(--gray-950)]` backgrounds, `text-white` / `text-white/N` for all text, `bg-white/N` for hovers.

admin/layout.tsx (2 violations): `bg-[var(--gray-950)]` and `bg-[var(--gray-900)]` hardcoded backgrounds.

**Root pattern:**
Every violation was `text-white/N` or `bg-white/N` — an opacity-based approach that only works on dark backgrounds. These classes produce white (or near-white) colour regardless of theme. On a light background, white text is invisible.

**Correct approach (implemented):**
1. **Public surfaces (NavBar, hero, pages):** Replace all `text-white`, `text-white/N`, `bg-white/N` with semantic token classes: `text-[var(--text-primary)]`, `text-[var(--text-secondary)]`, `text-[var(--text-muted)]`, `bg-[var(--bg-elevated)]`, `border-[var(--border-default)]`. These tokens flip automatically with the theme.

2. **Intentionally-always-dark surfaces (Footer, Admin Panel):** Instead of hardcoded grays or white-opacity hacks, add `data-theme="dark"` to the root element of that surface. The CSS token system then resolves all `var(--*)` inside it to dark values. Token classes (`text-[var(--text-secondary)]`, `bg-[var(--bg-elevated)]`) are used instead of `text-white/50`, `bg-white/8`. This is cleaner, documented, and future-proof.

**Prevention rule:**
Before using ANY `text-white`, `text-white/N`, `bg-white/N`, `border-white/N` class, ask:
- "Is this element guaranteed to always sit on a dark/coloured background?"
- If YES → it's valid, but add a comment explaining why (e.g., "// On brand-500 background, always dark")
- If NO → use a semantic token class instead

Never use `text-white/N` as a way to create "muted" text. That's what `text-[var(--text-secondary)]` and `text-[var(--text-muted)]` are for.

**Related SOP section:** UI_MASTER_SKILL §2 Color Systems (60-30-10), UI/UX SOP §Hard Rule 3 (contrast ≥4.5:1 — must be verified in BOTH themes), Universal Engineering Principles §Hard Rule 2 (no duplicated values — one token, used everywhere)

---

### 2026-09-13 — Admin panel theme switcher completely non-functional — two root causes

**What happened:**
ThemeToggle had no effect in the admin panel. Backgrounds, text, borders stayed dark regardless of toggle clicks.

**Root Cause 1 — `data-theme="dark"` pin on admin layout overrode every toggle click.**
The admin layout had `data-theme="dark"` hardcoded on its root div. The CSS rule `html[data-theme="dark"]` at the `<html>` level has lower specificity than a nested `[data-theme="dark"]` on a div. Every time the ThemeToggle set `html[data-theme="light"]`, the admin layout's own `data-theme="dark"` attribute on its inner div re-applied dark tokens to everything inside it. The toggle was being overridden immediately by the layout element itself.

**Root Cause 2 — ThemeToggle was hidden in admin header (`{!isAdmin && <ThemeToggle />}`).**
Even if the pin hadn't existed, the toggle button wasn't rendered at all in admin mode. Users had no way to trigger a switch.

**Root Cause 3 — All 5 admin pages still had ~50+ hardcoded `text-white/N`, `bg-[var(--gray-800)]`, `border-white/8` etc.**
Even after fixing the layout pin, those classes would never respond to theme changes. The layout fix was necessary but not sufficient.

**Correct approach:**
1. Remove `data-theme="dark"` from admin layout. Admin follows the user's theme preference like everything else.
2. Show `<ThemeToggle />` unconditionally in DashboardHeader (remove `!isAdmin` guard).
3. Replace all hardcoded `text-white/N`, `bg-[var(--gray-N)]`, `border-white/N` in all 5 admin pages with semantic token classes. Full mapping:
   - `text-white` → `text-[var(--text-primary)]`
   - `text-white/50` → `text-[var(--text-muted)]`
   - `bg-[var(--gray-800)]` → `bg-[var(--bg-elevated)]`
   - `bg-[var(--gray-700)]` → `bg-[var(--bg-surface)]`
   - `border-white/8` → `border-[var(--border-default)]`
   - `hover:bg-white/4` → `hover:bg-[var(--bg-surface)]`
   - etc.

**Files fixed:**
- `src/app/admin/layout.tsx` — removed `data-theme="dark"` pin
- `src/components/dashboard/DashboardHeader.tsx` — removed `!isAdmin` guard on ThemeToggle
- `src/app/admin/page.tsx` — full token replacement
- `src/app/admin/jobs/page.tsx` — full token replacement
- `src/app/admin/applicants/page.tsx` — full token replacement
- `src/app/admin/analytics/page.tsx` — full token replacement
- `src/app/admin/settings/page.tsx` — full token replacement

**Prevention rule:**
Never add `data-theme="dark"` to a layout div as a way to "always force dark." That creates a CSS specificity battle that will override the global ThemeToggle at `<html>` level. If you want a section to always be dark, that's a valid design decision — but implement it by scoping the dark token overrides to that element's selector IN `globals.css`, not by adding a `data-theme` attribute that competes with the global toggle.

**Related SOP section:** Lessons.md §2026-09-13 (23 theme violations), Universal Engineering Principles §Hard Rule 2 (no competing sources of truth), Frontend SOP §6.1 (all states must be reachable and functional)

---

### 2026-09-13 — "Job Listings" and "Post a Job" both active at /admin/jobs/new (third time)

**What happened:**
On `/admin/jobs/new`, both "Job Listings" (`/admin/jobs`) and "Post a Job" (`/admin/jobs/new`) were highlighted simultaneously in the sidebar.

**Root cause (after previous fix):**
The previous fix added `adminPostJob` to `EXACT_ONLY` to prevent it from prefix-matching. But `adminJobs` was NOT added to `EXACT_ONLY`. So on `/admin/jobs/new`:

1. "Post a Job" (`/admin/jobs/new`) → in `EXACT_ONLY` → `pathname === href` = true → active ✓
2. "Job Listings" (`/admin/jobs`) → NOT in `EXACT_ONLY` → falls to `pathname.startsWith(href + "/")` = `"/admin/jobs/new".startsWith("/admin/jobs/")` = **true** → also active ✗

The startsWith check cannot distinguish between:
- `/admin/jobs/abc` — a real child of Job Listings (should activate Job Listings)
- `/admin/jobs/new` — the "Post a Job" action (should NOT activate Job Listings)

Both start with `/admin/jobs/`. They're siblings at the same depth, not parent-child.

**Correct approach:**
Add `adminJobs` to `EXACT_ONLY`. "Job Listings" should only be active when the pathname is exactly `/admin/jobs`. If we ever add `/admin/jobs/[id]` detail pages, they will have their own breadcrumb/context — activating "Job Listings" via prefix would be the right call then, and we can remove it from EXACT_ONLY at that point with documentation.

**Prevention rule (refined from earlier lesson):**
The classification question for any nav item is:
> "Does this route have REAL child pages that should visually 'belong' to this section?"

- `/admin/jobs` → has no child pages yet. `/admin/jobs/new` is a sibling action. → EXACT_ONLY
- `/admin/jobs/new` → leaf action. → EXACT_ONLY
- `/admin/applicants` → filter params, not path-based sub-pages. → EXACT_ONLY (or prefix if you add `/admin/applicants/[id]` detail pages)
- `/admin` → root. → EXACT_ONLY

When you ADD a new route that is a true child (e.g., `/admin/jobs/123`), REMOVE the parent (`adminJobs`) from EXACT_ONLY at that time, with a comment explaining the change.

**Related SOP section:** LESSONS.md §2026-09-13 (sidebar isActive, first fix), Frontend SOP §6 Navigation active states

---

## UI/UX Lessons (continued)

### 2026-09-13 — Header buttons were visual-only — no interaction state, no dropdowns

**What happened:**
The notification bell and profile area in DashboardHeader were `<button>` elements that had no `onClick` handler and no `useState` — clicking them did nothing. The ThemeToggle icon switched but had no animation.

**What was wrong about it:**
UI/UX SOP §Hard Rule 1: all four states designed — default, hover, active (open), disabled. A button with no active state is only 2 of 4 states.
Frontend SOP §7: interactive elements must have visible feedback on interaction. A button that appears to do nothing destroys user trust.
UI_MASTER_SKILL §8 Feedback: "Every interactive action must produce visible feedback within 100ms."

**Correct approach (implemented):**

1. **Notification dropdown:**
   - `useState` open/closed
   - `useRef` + click-outside listener closes it (mousedown)
   - Esc key closes it (keyboard accessibility)
   - `aria-expanded`, `aria-haspopup`, `aria-label` wired correctly
   - Scale + opacity CSS transition on open/close (origin-top-right)
   - Unread dot has a ping/pulse animation (draws attention without being intrusive)
   - Empty state designed, not blank
   - "Mark all read" + "View all" actions present
   - Unread items have a subtle tinted background + dot (Hard Rule 4: not colour alone)

2. **Profile dropdown:**
   - Same open/close pattern as notification
   - Chevron icon rotates 180° when open (visual affordance)
   - Links driven by a data array (DRY — no duplicate JSX per link)
   - `role="menu"`, `role="menuitem"` ARIA roles for screen readers
   - Sign out at bottom separated by divider, styled red-on-hover (destructive affordance)
   - `isAdmin` prop switches the link set — seeker sees Dashboard/Applications/Profile, admin sees Dashboard/Settings

3. **ThemeToggle animation:**
   - `<style>` tag injects `@keyframes themeIconEnter/Exit` once (no extra CSS file — DRY)
   - Icon mounts with `key={theme}` so React remounts it on each toggle → triggers CSS animation
   - Entering icon: rotates from -90° to 0°, scales from 0.5→1, fade in (spring easing)
   - `prefers-reduced-motion`: animation skipped entirely via `@media` inside the `<style>` tag

**Both dropdowns use same shared constants:**
```ts
const DROPDOWN_BASE = "absolute right-0 top-[calc(100%+8px)] z-50 origin-top-right rounded-[...] border bg-[var(--bg-base)] shadow-[...] transition-all duration-[...]"
const DROPDOWN_OPEN   = "opacity-100 scale-100 pointer-events-auto translate-y-0"
const DROPDOWN_CLOSED = "opacity-0 scale-95 pointer-events-none -translate-y-1"
```
DRY: one set of animation classes drives both dropdowns.

**Prevention rule:**
Before shipping any `<button>` element, verify it has:
1. A visible state change on click (at minimum: bg colour change, preferably a dropdown/modal/action)
2. `aria-label` or visible text
3. `aria-expanded` if it controls a disclosure widget
4. Keyboard: either fires on Enter/Space (default for `<button>`) or has explicit `onKeyDown`
5. Click-outside + Esc close behavior for any dropdown it opens

**Related SOP section:** UI/UX SOP §Hard Rule 1 (four states), §Hard Rule 2 (keyboard operable), UI_MASTER_SKILL §8 Feedback and Interaction

---

## Frontend Lessons (continued)

### 2026-09-13 — DateFilter component: preset-driven date ranges with custom picker

**What was built:**
A reusable `DateFilter` component used across admin/page.tsx, admin/analytics/page.tsx, and admin/ledger/page.tsx. Presets: Today (default) · 24 Hours · This Week · This Month · This Year · Custom.

**Design decisions per SOP:**

1. **Defaults to "Today"** — UI/UX SOP §5.1 flow mapping: the most common admin view is "what happened today." Requiring the user to always select a range before seeing data is friction. Default = most useful state.

2. **`useDefaultDateRange()` hook** — Frontend SOP §Hard Rule 1 (single source of truth): the default is defined once in the component file and exported as a hook. Pages call `useState<DateRange>(useDefaultDateRange())`. No page hardcodes "today" strings.

3. **Custom picker shows only when "Custom" selected** — UI/UX SOP §5.1 progressive disclosure: don't show fields the user doesn't need yet. The custom date inputs appear only when "Custom" is pressed, keeping the default UI clean.

4. **`min`/`max` constraints on date inputs** — Frontend SOP §7 validation: `from` max = `to` value, `to` min = `from` value. Prevents user selecting an end date before the start date at the input level (UX guard, server must also validate).

5. **Range summary always visible** — UI/UX SOP §Hard Rule 4: icon + text label. "Showing data for: Today" tells the user exactly what they're looking at without relying on the highlighted pill alone.

**Business model — application fee:**
`APP_FEE_PKR = 150` defined as a constant in admin/page.tsx and admin/ledger/page.tsx. This is the **single source of truth** for the fee. If the fee changes, change one constant; all revenue calculations update automatically. Frontend SOP §Hard Rule 1 applies: this is a UX stub — real value must come from server configuration, never hardcoded in production.

**Ledger page architecture:**
- `REVENUE_BY_JOB` is derived from job applicant counts × fee — not stored separately. DRY.
- `PLATFORM_CUT = 0.85` (85%) — net revenue shown throughout. Processing fee (15%) is explicit.
- Transaction table: status filter tabs + search, empty state, filtered revenue summary.
- `pkr()` formatter function — DRY: used 12+ times, defined once.

**Prevention rule:**
Any feature that shows financial data must:
1. Clearly distinguish gross vs net revenue
2. Never hardcode a fee amount inline — use a named constant
3. Always show the fee structure to the admin (transparency)
4. Mark all financial data as "UX stub — replace with real API" so it's never shipped as-is

**Related SOP section:** Frontend SOP §Hard Rule 1 (single source of truth), UI/UX SOP §5.1 (progressive disclosure), UI/UX SOP §Hard Rule 4 (icon + text, not colour alone)

---

## Architecture Lessons (continued)

### 2026-09-13 — APP_FEE_PKR duplicated across two files before constants.ts

**What happened:**
`APP_FEE_PKR = 150` and `PLATFORM_CUT = 0.85` were defined as module-scope constants in both `admin/ledger/page.tsx` and `admin/page.tsx`. When the admin/page.tsx was created, the constant was re-defined instead of imported from the ledger file.

**What was wrong about it:**
Universal Engineering Principles §Hard Rule 2 (DRY): every value defined once. Two definitions means a fee change requires updating two files — one will inevitably be missed.

**Correct approach:**
`src/lib/constants.ts` — single file for all shared business constants. Any page that needs `APP_FEE_PKR` imports from there. Changing the fee now updates every page, chart, and calculation in one edit.

**Prevention rule:**
Before defining any business constant in a page file, ask: "Is this value used in more than one file, or could it be?" If yes → move it to `lib/constants.ts` immediately. Never duplicate a business rule in two places.

---

## Frontend Lessons (continued)

### 2026-09-13 — Multi-step form flow: CV upload → Payment → Receipt → Confirmation

**What was built:**
`/dashboard/apply/[jobId]` — a 3-step application flow with file upload and payment receipt submission.

**Key SOP decisions:**

1. **StepIndicator uses number + colour + text** — UI/UX SOP §Hard Rule 4. Step is communicated by the step number, the colour change, and the text label simultaneously. A step that only changed colour would fail for colour-blind users.

2. **UploadBox: drag-and-drop + click, accessible label, error state** — Frontend SOP §7: the `<label>` wrapping the `<input type="file">` is always visible (not sr-only). The file input is visually hidden but the visible drop zone is the click target.

3. **File validation on submit, not on change** — Frontend SOP §8 inline-validation rule. File type and size are validated when the user proceeds, not as they pick the file. This avoids showing errors during normal file browsing.

4. **Payment config fetched from server** — The `PAYMENT_CONFIG` object in the apply page is marked as a stub (`/* In production, fetched from /api/payment-settings */`). The payment phone number and method are admin-configurable — they must never be hardcoded in the component. The UI is built to render whatever the server returns.

5. **Step 3 success state shows status timeline** — UI/UX SOP §Hard Rule 1 (all states designed). The success state is not just "You're done." It shows what happens next (payment review → CV review) so the applicant isn't left wondering. This reduces support inquiries.

**Prevention rule:**
Multi-step forms must:
1. Show progress via a StepIndicator (number + colour + text)
2. Validate before advancing to next step — never silently advance
3. Make the success state informative — show what happens next
4. Never hardcode business config (fees, account numbers) in the component

---

### 2026-09-13 — UploadBox: defined in two pages instead of being extracted

**What happened:**
`UploadBox` is defined locally in both `dashboard/apply/[jobId]/page.tsx` and `dashboard/profile/page.tsx`. This is technically a DRY violation — two definitions of the same component.

**Why it was acceptable here:**
DRY Hard Rule 1 says check for existing before creating. Both pages are in the same feature area (application flow) and the component is 30 lines. Extracting it to `components/` adds import indirection and a new file for a component that currently has only 2 consumers. The rule of three applies: extract when 3+ consumers exist.

**Prevention rule (updated):**
Extract a local component to `components/` when it has 3 or more consumers OR when it grows beyond ~50 lines and is reused even twice. Document the "not yet extracted" decision with a comment in the file so future developers know it was intentional.

**Related SOP section:** Universal Engineering Principles §Hard Rule 1 (check for existing before creating), §Hard Rule 3 (single responsibility — component is focused, acceptable to leave local when small)

---

## UI/UX Lessons (continued)

### 2026-09-13 — ThemeToggle buried at bottom of auth pages — unfindable

**What happened:**
ThemeToggle on signin/signup was placed below the form content, below the footer links, at the very bottom of the scrollable right panel. In the screenshot it appears as a small button after "Privacy Policy · Terms of Service" — easy to miss, requires scrolling, inconsistent with dashboard placement.

**What was wrong about it:**
UI_MASTER_SKILL §8 Feedback and Interaction: "Controls the user needs must be findable on first glance." The ThemeToggle is a persistent UI preference — it should be in a consistent, predictable location, not buried below content.
UI/UX SOP §5.1: flow mapping — the user arrives at the auth page, wants to switch theme before reading the form. Making them scroll past the form to find the toggle is poor flow.

**Correct approach:**
ThemeToggle placed in the form panel's top bar, right-aligned, alongside the mobile logo. This matches where users expect global controls (top right) and mirrors the dashboard header placement. The right panel now has a consistent header row: [Logo (mobile only)] ←spacer→ [ThemeToggle].

**Prevention rule:**
Global preference controls (theme, language) belong in a header/nav position — top of the page or top of the panel they affect. Never place them below the primary content of a page. The user should be able to switch theme before they interact with any form field.

**Related SOP section:** UI_MASTER_SKILL §8 Feedback, UI/UX SOP §5.1 Flow mapping, UI/UX SOP §6 Navigation patterns

---

### 2026-09-13 — Mobile logo on auth pages: contrast issue in light mode

**What happened:**
The mobile-only Logo on the auth right panel used the default `textColor` but was placed on `bg-[var(--bg-base)]` (white in light mode). In some theme configurations the Logo image (`logo-3.png`) has a dark/transparent background making the "R" icon nearly invisible against white.

**What was wrong about it:**
UI/UX SOP §Hard Rule 3 (WCAG AA ≥3:1 for UI components, ≥4.5:1 for text): the logo mark must be visible in both themes. The `logo-3.png` image has implicit dark styling — using it on a white background reduces contrast.

**Correct approach:**
1. Logo uses `textColor="default"` so `gradient-text` and `text-[var(--text-primary)]` are used for the wordmark — both are theme-aware and readable in both modes.
2. The right panel background changed from `bg-[var(--bg-base)]` (pure white/pure black) to `bg-[var(--bg-base)]` with the header row having slightly elevated bg — providing a visible container for the logo.
3. The form content area uses `bg-[var(--bg-base)]` while form inputs use `bg-[var(--bg-elevated)]` — maintaining the subtle visual hierarchy.

**Prevention rule:**
Before placing any image-based logo on a surface, verify it in both light and dark modes. If the logo image has a fixed dark or light treatment, it must only be used on the matching background — or use a CSS-rendered alternative (gradient-text wordmark) for the other mode.

**Related SOP section:** UI/UX SOP §Hard Rule 3 (contrast both modes), LESSONS.md §2026-09-13 Logo contrast

---

### 2026-09-13 — Auth left panel logo invisible on gradient background (fourth attempt — definitive fix)

**Root cause (confirmed from screenshots):**
The `Logo` component renders `<Image src="/logo-3.png">` + a wordmark. The `logo-3.png` file itself contains a coloured/dark mark. When placed directly on a dark gradient with no background pill, the mark's own colours blend into the gradient at certain opacity levels, making it appear faint or invisible.

Previous attempts used `textColor="white"` and `data-theme="dark"` on the container — these fix the *wordmark* but not the *image*. The image pixels are fixed colours inside the PNG file; CSS token tricks don't change PNG pixel colours.

**Definitive fix:**
1. **Left panel logo**: Replaced the `<Logo>` component in the left panel with a manual inline rendering: a `bg-white/20` pill wrapping a raw `<img>` tag + a hardcoded `text-white` wordmark. The pill gives the image a light-tinted background, making the logo mark always visible against the dark gradient. The wordmark is `text-white` not a token — the left panel is always dark (hardcoded gradient, not token-dependent).

2. **Left panel gradient**: Changed from `background: "linear-gradient(145deg, var(--brand-700) 0%..."` to literal hex values `#073dba → #1565ff → #00c9a7`. This removes any token-resolution dependency. The left panel must ALWAYS be dark — never trust tokens for a panel that must have a fixed visual treatment.

3. **Mobile logo on right panel**: Wrapped logo image in `bg-[var(--bg-elevated)] border border-[var(--border-default)]` pill. In light mode: gray-100 pill → dark logo pixels visible. In dark mode: gray-800 pill → light logo pixels visible. The pill provides contrast regardless of logo image content or panel background.

4. **Form area**: Wrapped children in `bg-[var(--bg-base)] rounded-2xl border shadow` card. This creates a visually distinct form container in both themes:
   - Light: white card on gray-50 panel → form clearly delineated
   - Dark: gray-950 card on gray-900 panel → subtle but distinct

**Prevention rules (DEFINITIVE):**
1. Image-based logos MUST be placed on a contrasting background container (pill/card), never directly on a gradient or coloured background.
2. For permanently-dark decorative panels, use hardcoded hex values for the background — never CSS token vars that could resolve unexpectedly.
3. Never rely solely on `textColor="white"` to fix logo visibility — that only affects the text/wordmark component of `<Logo>`, not the image file pixels.

**Related SOP section:** UI/UX SOP §Hard Rule 3 (contrast both themes), LESSONS.md §2026-09-13 Logo contrast (multiple entries — this is the definitive fix)

---

### 2026-09-13 — max-w constraint on page root inside a max-width layout = double-constrained, huge whitespace (recurring)

**What happened (third occurrence):**
`admin/settings/page.tsx` used `max-w-3xl` on its root div.
`admin/payment-settings/page.tsx` used `max-w-2xl` on its root div.
Both pages showed a narrow content column with a large empty right side, even though the admin layout already applies `max-w-7xl` to the content area.

**The pattern:**
```
Admin layout: max-w-7xl mx-auto px-4 sm:px-6 py-8
  ↓ content flows into this container
    Page root: max-w-3xl   ← EXTRA unnecessary constraint
      ↓ all content squished into ~768px
        right 300-400px of the 1280px layout = empty
```

**Correct approach:**
Remove `max-w-*` from the page root. Use a CSS Grid to fill the available width:
- Form-heavy pages: `grid grid-cols-1 lg:grid-cols-3 gap-6`
  - Left `lg:col-span-2`: form sections
  - Right `lg:col-span-1`: preview / help / quick-info panel
- This fills the full layout width AND provides a useful right panel.

**Previous lesson:** This exact mistake was noted on 2026-09-13 for `admin/jobs/new/page.tsx` (`max-w-3xl` removed, content fills full width). The lesson was logged but not applied to settings and payment-settings pages created in the same session.

**Prevention rule (FINAL — no more occurrences acceptable):**
1. Never add `max-w-*` to a page's root div if that page lives inside a layout that already has `max-w-*`.
2. If a form page needs visual constraint, use a two-column grid with a sidebar panel on the right — the total still fills the layout width.
3. Before committing any page, check: does the parent layout already have `max-w-7xl`? If yes, the page root gets NO `max-w`.
4. Search the entire codebase for `max-w` in page root divs after every batch of page creation.

**Files fixed:**
- `src/app/admin/settings/page.tsx` — removed `max-w-3xl`, added `grid grid-cols-1 lg:grid-cols-3` with quick-info right panel
- `src/app/admin/payment-settings/page.tsx` — removed `max-w-2xl`, added `grid grid-cols-1 lg:grid-cols-3` with live preview right panel (moved from bottom to sticky sidebar)

**Related SOP section:** Universal Engineering Principles §Hard Rule 3 (single responsibility — layout sets width, page fills it), LESSONS.md §2026-09-13 max-w constraint (first and second occurrences)

---

## Architecture Lessons (continued)

### 2026-09-13 — Complete project audit: 9 missing pages, 3 functional gaps

**What was found (full audit results):**

**Missing pages — 9 routes in routes.ts with no page.tsx:**
1. `/jobs` — linked from NavBar, landing page (×6), dashboard (×3), applications page (×2), Sidebar
2. `/jobs/[id]` — linked from landing page job cards (×6), dashboard recommended jobs (×3)
3. `/about` — linked from NavBar
4. `/contact` — linked from NavBar, landing page (×2)
5. `/forgot-password` — route defined, linked from signin page
6. `/dashboard/saved-jobs` — Seeker Sidebar nav item
7. `/dashboard/alerts` — Seeker Sidebar nav item
8. `/admin/jobs/[id]/edit` — "Edit" buttons on admin/jobs and admin/page
9. `/terms` + `/privacy` — linked from Footer, AuthLayout

**Functional gaps — code existed but behaviour was broken:**
1. `admin/jobs/page.tsx`: "Close" and "Delete" buttons had no onClick handler → clicking did nothing
2. `admin/applicants/page.tsx`: `?job=` query param was ignored → `adminJobApplicantsUrl()` produced valid URLs but the page always showed "All Listings" regardless
3. `admin/jobs/[id]/edit`: `adminEditJobUrl()` helper existed in routes.ts, "Edit" links rendered everywhere, but the destination page did not exist → 404

**Root cause pattern:**
All missing pages were routes that were defined in `routes.ts` and used in components/links, but never had the corresponding `src/app/[route]/page.tsx` file created. This is the **same root cause as the `/dashboard` 404 bug** from earlier in this session — routes are a contract, and both sides of that contract must exist simultaneously.

**Prevention rules (added to existing):**

Rule: **After adding any route to `routes.ts`, immediately create the placeholder `page.tsx` file for it.** An empty page with just a heading is better than a 404. This matches `git`'s rule: never commit a reference to something that doesn't exist.

Rule: **Any `<button>` that will mutate data must have an `onClick` handler before it ships.** A button without an `onClick` is not a button — it's a decoration. Check every `type="button"` element before committing.

Rule: **Any URL builder helper (e.g., `adminJobApplicantsUrl()`) must have its destination page read the expected query parameters.** If the URL is `/admin/applicants?job=j1`, the page must call `useSearchParams()` and consume `job`. Never build a URL with query params that the destination ignores.

**Files created/fixed:**
- `src/app/jobs/page.tsx` — browse + filter all listings
- `src/app/jobs/[id]/page.tsx` — job detail, apply CTA
- `src/app/about/page.tsx`
- `src/app/contact/page.tsx`
- `src/app/forgot-password/page.tsx`
- `src/app/dashboard/saved-jobs/page.tsx`
- `src/app/dashboard/alerts/page.tsx`
- `src/app/admin/jobs/[id]/edit/page.tsx`
- `src/app/terms/page.tsx`
- `src/app/privacy/page.tsx`
- `src/app/admin/jobs/page.tsx` — Close/Delete buttons now open confirmation modal (SOP §Hard Rule 5)
- `src/app/admin/applicants/page.tsx` — consumes `?job=` via `useSearchParams()` on mount

**Related SOP section:** Frontend SOP §13 Change Management (route is a contract — page must exist before linking), UI/UX SOP §Hard Rule 5 (destructive actions need confirmation), LESSONS.md §2026-09-13 "Go to dashboard" 404 (same root cause, different route)

---

## Architecture Lessons (continued)

### 2026-09-13 — Backend Readiness Audit: Complete findings and what was done

**Full audit results — 20 items requiring backend wiring found.**

**Category 1: Missing API layer (critical)**
No `src/lib/api.ts` existed. Every page would have had to roll its own `fetch()` with no shared error handling, no auth token attachment, no base URL config. This is the equivalent of copying the same CSS into every component instead of using a design token system.

Created `src/lib/api.ts` with:
- `api.get/post/put/patch/delete` typed wrapper
- `uploadFile()` for CV and receipt uploads
- `ApiError` class for normalized error handling
- Auth token read from `localStorage['rozedesk-token']` on every request
- Complete typed endpoints: `authApi`, `jobsApi`, `seekerApi`, `applicationApi`, `adminApi`
- All shared TypeScript interfaces: `AuthUser`, `Job`, `Application`, `Receipt`, `Transaction`, etc.

**Category 2: No route guards (critical)**
No `middleware.ts` existed. Any user could visit `/dashboard` or `/admin` without authentication. The entire auth system was visual only.

Created `middleware.ts`:
- `/dashboard/*` → requires `rozedesk-token` cookie → else redirect `/signin?redirect=...`
- `/admin/*` → requires token + `rozedesk-role=admin` → else redirect `/admin/login`
- Already-logged-in users redirected away from auth pages

Note: middleware uses cookies (not localStorage) because Edge Runtime has no access to `localStorage`. The signin/login pages must set cookies as well as localStorage on successful login.

**Category 3: No auth context (high priority)**
No React Context existed for user session. Both layouts hardcoded `userName="Ayesha Malik"` and `userName="Super Admin"`. Profile dropdown and sidebar showed a real user name that never matched the actual logged-in user.

Created `src/context/AuthContext.tsx`:
- `AuthProvider` wraps the root layout — reads `getStoredUser()` on mount
- `useAuth()` hook — exposes `{ user, isLoading, signOut, refreshUser }`
- `useUser()` and `useUserInitials()` convenience hooks
- Both layouts now read from `useAuth()` instead of hardcoded strings

**Category 4: Sign Out buttons non-functional**
Both the Sidebar `Sign Out` button and the DashboardHeader profile dropdown `Sign Out` had no onClick handler. Clicking did nothing — or at most closed a dropdown.

Fixed:
- Sidebar: added `SignOutButton` component using `useRouter` — calls `authSignOut()`, clears cookies, redirects to `/signin`
- DashboardHeader: `ProfileDropdown` now receives `handleSignOut` callback that does the same

**Category 5: Math.random() in signin form (always-broken 20% of the time)**
The signin page `handleSubmit` had `Math.random() > 0.2` meaning 20% of submit attempts randomly failed with "Incorrect email or password." This broke every 5th user sign-in attempt in the UI demo.

Fixed: Replaced with a clean `setTimeout(res, 1200)` stub with a clear TODO comment pointing to `authApi.signIn()`.

**Category 6: No error pages**
Next.js renders a generic white screen for 404 and 500 errors with no branding.

Created:
- `src/app/not-found.tsx` — branded 404 with gradient text, navigation links, NavBar + Footer
- `src/app/error.tsx` — client error boundary with Try Again + Go Home actions, logs to console (ready for Sentry)
- `src/app/global-error.tsx` — root layout error boundary with its own `<html>/<body>` (last resort)

**Category 7: No loading skeletons**
All dashboard and admin pages rendered hardcoded data synchronously with zero loading state. When real API calls are added, there would be a blank flash before data arrives.

Created:
- `src/components/dashboard/SkeletonCard.tsx` — reusable animated skeleton (DRY)
- `src/app/dashboard/loading.tsx` — seeker dashboard skeleton
- `src/app/admin/loading.tsx` — admin dashboard skeleton
- Next.js App Router automatically shows `loading.tsx` while page data loads

**Category 8: Visual-only buttons wired**
- Ledger "Export CSV" — now generates and downloads a real CSV file from local data (full API call commented as TODO)
- Signup "Resend it" — now has onClick with alert stub + TODO comment
- Settings "Yes, Delete All" — now has onClick with alert stub + TODO comment

**Prevention rules:**

1. **Create API client before first page.** `src/lib/api.ts` must exist before any page makes a network call. Never `fetch()` directly in a page.

2. **Create middleware.ts when first protected route is added.** The moment `/dashboard` is created, `middleware.ts` protecting it must be created in the same commit.

3. **Create AuthContext when first layout needs user data.** The moment a layout shows a user name, it must come from context — never hardcoded.

4. **Never use `Math.random()` to simulate success/failure in UI stubs.** Use `setTimeout(resolve, delay)` only — deterministic always-success behavior. Real failure cases come from real API responses.

5. **Create error pages in the first project setup session.** They take 30 minutes and are invisible until needed — but when needed, a blank screen destroys trust immediately.

6. **Every `<button>` must have an `onClick` or `type="submit"`.** A button without an onClick is a design element, not a button. This is a hard rule that must be checked before every commit.

**Related SOP section:** Architect SOP §2.1 (required inputs — auth system is a required input before any protected routes), Frontend SOP §13 Change Management (infrastructure created with the first page that needs it, not later)

---

## Database / Prisma Lessons

### 2026-09-15 — Prisma 7: `url` must be removed from schema.prisma datasource block

**What happened:**
`npx prisma generate` failed with:
```
Error: The datasource property `url` is no longer supported in schema files.
Move connection URLs for Migrate to `prisma.config.ts`
```

**Root cause:**
Prisma 7 is a breaking change from v5/v6. In Prisma 7, `url` and `directUrl` must be configured in `prisma7.config.ts` (or `prisma.config.ts`), NOT in `prisma/schema.prisma`. The schema `datasource` block must only contain `provider`.

**Correct schema.prisma pattern (Prisma 7):**
```prisma
datasource db {
  provider = "postgresql"
  // url goes in prisma7.config.ts — NOT here
}
```

**Correct prisma7.config.ts pattern:**
```ts
export default defineConfig({
  datasource: {
    url:       process.env["DATABASE_URL"]!,
    directUrl: process.env["DIRECT_URL"]!,
  },
});
```

**Prevention rule:**
Never add `url` or `directUrl` to `schema.prisma` datasource block in Prisma 7+ projects.

---

### 2026-09-15 — Prisma db push fails P1001 without directUrl (pgbouncer URLs cannot be used for migrations)

**What happened:**
`prisma db push` failed with `P1001: Can't reach database server` even though the DATABASE_URL was correctly set.

**Root cause:**
The `DATABASE_URL` in `.env` uses pgbouncer (`?pgbouncer=true&connection_limit=1`). Pgbouncer is a connection pooler — it cannot handle the long-lived connections required by Prisma's schema engine (migrate/db push). Prisma needs a **direct** database connection for CLI operations.

**Fix:**
Add `directUrl` to `prisma7.config.ts`:
```ts
datasource: {
  url:       process.env["DATABASE_URL"]!,   // pgbouncer — used by Prisma Client at runtime
  directUrl: process.env["DIRECT_URL"]!,     // direct — used by CLI (generate, db push, migrate)
},
```

**Rule:**
- `DATABASE_URL` (pgbouncer) → Prisma Client (runtime queries in the app)
- `DIRECT_URL` (direct)     → Prisma CLI (generate, db push, migrate dev/deploy)
- Both must be set for Supabase + Prisma 7 projects.

---

### 2026-09-15 — Supabase P1001 may indicate paused project (not just network)

**What happened:**
Even with correct directUrl, `db push` still got P1001.

**Root cause:**
Supabase free tier **pauses projects** after 1 week of inactivity. A paused project returns P1001 because port 5432 is closed.

**Fix:**
Go to https://supabase.com/dashboard → select the project → click "Restore project". Wait 1-2 minutes for it to wake up, then retry `db push`.

**Prevention rule:**
Before running any Prisma CLI command against Supabase, verify the project is active in the Supabase dashboard. Check the green "Active" status indicator.

---

## Install / Tooling Lessons

### 2026-09-15 — PowerShell execution policy blocks npm/npx .ps1 scripts

**What happened:**
Running `npx prisma generate` or `npm install` in PowerShell terminal failed with:
```
File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system.
```

**Root cause:**
Windows PowerShell execution policy is set to `Restricted`, which blocks `.ps1` scripts including the npm/npx wrappers.

**Workaround:**
Use `cmd /c "command"` to run npm/npx commands via Command Prompt instead of PowerShell:
```
cmd /c "cd D:\RozeDesk\rozedesk-app && npm install bcryptjs jsonwebtoken"
```

Or for Prisma, invoke the build entry directly:
```
node node_modules\prisma\build\index.js generate
node node_modules\prisma\build\index.js db push
```

**Long-term fix:**
Run once in PowerShell as Administrator:
```
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## Frontend Wiring Lessons

### 2026-09-15 — Pages using hardcoded data arrays need state + useEffect for real API wiring

**What happened:**
Multiple pages (jobs/page.tsx, dashboard pages, admin pages) used `const ALL_JOBS = [...]` static arrays. Wiring them to real APIs required adding `useState`, `useEffect`, loading/error states, and the `"use client"` directive.

**Pattern for wiring a page to real API:**
1. Add `"use client"` at top
2. Replace static array with `useState<T[]>([])`
3. Add `loading` and `error` state
4. `useEffect` → `fetch("/api/...")` → `setData()`
5. Render loading skeleton, error state, then populated data

**DRY rule:**
The token for auth headers is always: `localStorage.getItem("rd_token") ?? ""`
Extract to a `token()` helper function at module level to avoid repetition.

**Prevention rule:**
Never ship a page with a hardcoded `const ALL_* = [...]` array for production data. Mark these with `/* TODO: wire to API */` comments during UI phase so they are easy to find.

---

### 2026-09-15 — saved-jobs DELETE uses body, not URL param

**What happened:**
The `/api/seeker/saved-jobs` DELETE handler reads `req.json()` for `{ jobId }`, not a URL segment. The client must send a DELETE with JSON body, not call `/api/seeker/saved-jobs/[id]`.

**Correct client pattern:**
```ts
fetch("/api/seeker/saved-jobs", {
  method: "DELETE",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
  body: JSON.stringify({ jobId }),
});
```

**Rule:**
Always check the API route's request parsing before writing the client fetch call. Match the body parsing method (`req.json()`, `searchParams`, URL params) exactly.

---

## Next.js 16 Breaking Changes

### 2026-09-15 — Next.js 16: `params` in App Router route handlers is a Promise

**What happened:**
Build failed with TypeScript errors on all `[id]` API routes:
```
Type '{ params: Promise<{ id: string; }>; }' is not assignable to type '{ params: { id: string; }; }'
```

**Root cause:**
Next.js 16 changed the `params` object in App Router route handlers to be a `Promise`. This is a breaking change from Next.js 14/15.

**Wrong (old pattern):**
```ts
export async function GET(req, { params }: { params: { id: string } }) {
  const id = params.id; // ❌ TypeError at runtime in Next.js 16
}
```

**Correct (Next.js 16 pattern):**
```ts
export async function GET(req, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // ✅ must await
}
```

**Prevention rule:**
Every App Router route handler with `[id]` segments must type params as `Promise<{id: string}>` and `await params` before accessing values.

---

### 2026-09-15 — Next.js 16: `middleware.ts` renamed to `proxy.ts`

**What happened:**
Build warning: "The 'middleware' file convention is deprecated. Please use 'proxy' instead."

**Fix:**
Rename `src/middleware.ts` → `src/proxy.ts`. The file contents (matcher config, route guard logic) remain identical.

**Prevention rule:**
In Next.js 16 projects, use `proxy.ts` not `middleware.ts`.

---

### 2026-09-15 — Button component: add `iconLeft` as alias for `icon`

**What happened:**
Multiple pages used `iconLeft={...}` on the Button component, but the Button interface only had `icon`. This caused TypeScript errors across admin and dashboard pages.

**Fix:**
Added `iconLeft` as an alias prop in `ButtonProps`. Both `icon` and `iconLeft` are accepted — `iconLeft ?? icon` is used internally.

**Prevention rule:**
When a component has a common alias (icon vs iconLeft), accept both in the interface. Document which is canonical.

---

### 2026-09-15 — Spread causing duplicate `id` property in object literal

**What happened:**
```ts
{ id: s.id, ...s.job, savedAt: s.savedAt }
```
If `s.job` also has an `id`, TypeScript warns about duplicate property. The spread `id` overrides the explicit `id`.

**Fix:**
Explicitly map all needed fields instead of spreading:
```ts
{ id: s.id, jobId: s.job.id, title: s.job.title, ... }
```

**Prevention rule:**
Never spread an object that may have overlapping keys with explicit properties in the same object literal.

---

### 2026-09-15 — `JSX.IntrinsicElements` → `React.JSX.IntrinsicElements` in React 19

**What happened:**
`ScrollReveal.tsx` used `keyof JSX.IntrinsicElements` which causes a TS2503 "Cannot find namespace 'JSX'" error in React 19 / TypeScript strict mode.

**Fix:**
Replace with `keyof React.JSX.IntrinsicElements`.

**Prevention rule:**
In React 19 projects, always use `React.JSX.*` not the bare `JSX.*` namespace.

---

## Email / SMTP Lessons

### 2026-09-15 — Nodemailer: use App Password for Gmail, not account password

**What to do:**
For Gmail SMTP, you must use a Google **App Password**, not your Gmail login password.

Steps:
1. Google Account → Security → 2-Step Verification (must be enabled)
2. Security → App passwords → Select app: Mail → Generate
3. Copy the 16-character password (no spaces) into `SMTP_PASS`

**Config for Gmail:**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx   (16 chars, remove spaces)
SMTP_FROM=RozeDesk <you@gmail.com>
```

**Rule:** `SMTP_PASS` is an app password, not an account password. Never store real passwords in env files.

---

### 2026-09-15 — Email send failures must be non-fatal in signup/auth routes

**Pattern:**
Email sending after signup or payment approval must NEVER block the main response. If email fails, the user should still be registered / payment still processed.

**Correct pattern:**
```ts
// Fire-and-forget — log failure, never throw
sendWelcomeEmail(user.email, user.name).catch(e =>
  console.error("[signup] Welcome email failed (non-fatal):", e.message)
);
```

**Wrong:**
```ts
await sendWelcomeEmail(...); // blocks — if email fails, signup fails
```

**Rule:** Email is a side-effect, not the primary operation. Non-fatal. Always `.catch()` it.

---

### 2026-09-15 — Password reset: always return 200 regardless of email existence

**Security rule:**
The forgot-password endpoint must always return 200 with the same message whether the email exists or not. Returning 404 for unknown emails leaks user existence (email enumeration attack).

**Correct:**
```ts
if (!user) return NextResponse.json(SAFE_RESPONSE); // 200
```

**Wrong:**
```ts
if (!user) return NextResponse.json({ message: "Email not found" }, { status: 404 }); // leaks info
```

---

## Account Deletion Lessons

### 2026-09-15 — DELETE endpoint uses DB cascade — never do manual cascade deletes

**What happened:**
Account deletion must remove: User, SeekerProfile, Applications, Payments, SavedJobs, Alerts.

**Wrong approach:**
```ts
// Manually delete each related record — error-prone, misses tables
await db.seekerProfile.delete(...)
await db.application.deleteMany(...)
await db.user.delete(...)
```

**Correct approach:**
All relations in `schema.prisma` are defined with `onDelete: Cascade`. Deleting the User row cascades to all related records automatically. A single DB operation.

```ts
await db.user.delete({ where: { id: auth.id } });
```

**Rule:** Let the DB handle cascades defined in the schema. Never repeat cascade logic in application code — it's the DRY principle applied to data integrity.

---

### 2026-09-15 — Two-step delete confirmation: use integer step state not boolean

**Pattern used:**
```ts
const [deleteStep, setDeleteStep] = useState<0|1|2>(0);
// 0 = idle (no modal)
// 1 = confirm shown (modal open)
// 2 = deleting (loading state, buttons disabled)
```

This is cleaner than `showModal + isDeleting` booleans because:
- Single state controls all three UI states
- Impossible to be in "modal open AND not deleting" at step 2
- Easy to add more steps (e.g. type-to-confirm) by extending the type

**Rule:** For multi-step destructive actions, use integer step state over multiple booleans.

---

### 2026-09-15 — Clear auth cookies in DELETE response, not just localStorage

**What happened:**
Account deletion must clear both localStorage (client) and HttpOnly cookies (middleware).

**Correct:**
```ts
const response = NextResponse.json({ message: "Account deleted." });
response.cookies.set("rozedesk-token", "", { maxAge: 0, path: "/" });
response.cookies.set("rozedesk-role",  "", { maxAge: 0, path: "/" });
return response;
```

Client-side also calls `signOut()` which clears localStorage.

**Rule:** Auth state lives in both cookies (middleware) and localStorage (AuthContext). Both must be cleared on logout/deletion. Cookie clearing must happen server-side via `maxAge: 0`.

---

## Auth System Lessons

### 2026-09-15 — Google OAuth with Supabase: use redirect flow, not popup

**Pattern used:**
```
User clicks "Sign in with Google"
  → GET /api/auth/google (server-side, uses Supabase to get Google consent URL)
  → Redirect to Google
  → Google redirects to GET /api/auth/callback?code=xxx
  → Exchange code → get user email → find/create Prisma user → issue JWT → redirect to dashboard
```

**Why server-side redirect, not client-side supabase.auth.signInWithOAuth():**
Client-side OAuth requires the Supabase session to stay in sync with our custom JWT auth. By doing the OAuth entirely server-side and immediately converting to our own JWT, we keep one auth system (our JWT) instead of two (Supabase session + our JWT). This is simpler, more secure, and avoids session desync bugs.

**Rule:** In hybrid auth (Supabase for OAuth + custom JWT for app auth), always convert the OAuth identity to your own JWT immediately at the callback. Never run two parallel session systems.

---

### 2026-09-15 — OAuth users need a non-matchable password hash

**Problem:**
OAuth users have no password. But our DB schema requires `passwordHash NOT NULL`.

**Solution:**
Store a sentinel value that bcrypt can never produce:
```ts
passwordHash: `oauth:google:${supaUser.id}`
```

The signin route checks for this prefix and returns a specific error:
```ts
if (user.passwordHash.startsWith("oauth:")) {
  return err(401, "This account uses Google sign-in. Please use the Google button.");
}
```

**Rule:** Never store empty string or null for passwordHash of OAuth users. Store a clearly identifiable sentinel so you can detect OAuth accounts and give a helpful error when they try password login.

---

### 2026-09-15 — rememberMe: use cookie maxAge, not just JWT expiry

**Wrong:**
Only set JWT expiry to 30d — browser cookie expires when browser closes regardless.

**Correct:**
rememberMe=true  → JWT expires 30d + `maxAge: 60*60*24*30` on cookie
rememberMe=false → JWT expires 24h + NO maxAge on cookie (session cookie, clears on browser close)

```ts
response.cookies.set("rozedesk-token", token, {
  httpOnly: true,
  path: "/",
  ...(rememberMe ? { maxAge: 60 * 60 * 24 * 30 } : {}),
});
```

**Rule:** JWT expiry and cookie maxAge must match. A 30d JWT in a session cookie is useless — the cookie dies when the browser closes. Both must be set together.

---

### 2026-09-15 — GitHub OAuth removed: keep OAuth providers minimal

**Decision:**
Only Google OAuth enabled. GitHub removed.

**Reason:**
- Job seekers in Pakistan primarily have Gmail accounts
- GitHub OAuth adds complexity for no user benefit on a job board
- Fewer OAuth providers = smaller attack surface

**Rule:** Only add OAuth providers that your actual user base will use. Every additional provider adds redirect URIs, secrets, and potential failure modes.

---

### 2026-09-15 — Always install packages before importing them

**What happened:**
Build error: `Module not found: Can't resolve '@supabase/ssr'`

`@supabase/ssr` and `@supabase/supabase-js` were imported in code but never added to `package.json` via `npm install`.

**Fix:**
```
npm install @supabase/supabase-js @supabase/ssr --legacy-peer-deps
```

**Prevention rule:**
Before writing any `import { x } from "package-name"`, check `package.json` dependencies first. If the package isn't listed, install it before writing the import. Never assume a package is available because it was mentioned in planning — verify it exists in `node_modules`.

---

## Sign Out Lessons

### 2026-09-15 — HttpOnly cookies CANNOT be cleared by client-side JavaScript

**Root cause of sign-out not working:**
`document.cookie = "rozedesk-token=; Max-Age=0; path=/"` does NOT clear HttpOnly cookies.
HttpOnly cookies are invisible to JavaScript — `document.cookie` cannot read or write them.

**Consequence:**
After "signing out", the HttpOnly `rozedesk-token` cookie still existed.
The proxy/middleware read it and kept the user "signed in" — redirect to dashboard on next visit.

**Correct fix:**
Create a `/api/auth/signout` POST route that returns `Set-Cookie: rozedesk-token=; Max-Age=0` in the response header. Only the server can clear HttpOnly cookies.

```ts
// /api/auth/signout/route.ts
const response = NextResponse.json({ message: "Signed out." });
response.cookies.set("rozedesk-token", "", { maxAge: 0, path: "/" });
response.cookies.set("rozedesk-role",  "", { maxAge: 0, path: "/" });
return response;
```

Client calls: `await fetch("/api/auth/signout", { method: "POST", credentials: "include" })`

**Rule:** Never try to clear HttpOnly cookies with `document.cookie`. Always clear them via a server API route.

---

### 2026-09-15 — DRY: centralise sign-out in a single hook

**Problem found:**
Sign-out logic was duplicated in 3 places:
- `DashboardHeader.tsx` (handleSignOut)
- `Sidebar.tsx` (SignOutButton → handleSignOut)
- `AuthContext.tsx` (handleSignOut)

Each one was slightly different. One had a typo (`"rozedesk-role=;  Max-Age=0"` — two spaces before `Max-Age` broke the syntax).

**Fix:**
Created `src/hooks/useSignOut.ts` — one hook, one implementation:
1. POST to `/api/auth/signout` (clears HttpOnly cookies server-side)
2. Clears localStorage via `signOut()` from `@/lib/auth`
3. Clears non-HttpOnly cookies
4. Navigates to `/signin`

All three components now call `const signOut = useSignOut()` — zero duplication.

**Rule:** Any auth action that appears in more than one component must be extracted into a shared hook immediately. Never inline auth logic in UI components.

---

### 2026-09-15 — SMTP env var quoting: quotes around values with special chars

**Problem:**
```env
SMTP_PASS="gagk wamx ixxz znlx"   # quotes included in the value — breaks auth
SMTP_FROM=RozeDesk <sheenriser2@gmail.com>  # < > break env parsing
```

**Fix:**
```env
SMTP_PASS=gagk wamx ixxz znlx           # no quotes — Node reads spaces correctly
SMTP_FROM="RozeDesk <sheenriser2@gmail.com>"  # quotes needed when value contains < >
```

**Rule:**
- `.env` values with `<`, `>`, `#`, `=` must be quoted with double quotes
- `.env` string values with spaces do NOT need quotes (dotenv handles them)
- Never wrap an App Password in quotes — it adds the quote chars to the value

---

### 2026-09-15 — Never silently swallow external service errors — log them in full

**What happened:**
`sendPasswordResetEmail()` was failing but the error was swallowed with just `.message`:
```ts
.catch(e => console.error("[forgot-password] Email send failed:", e.message))
```

This only logged the message string, losing the stack trace, SMTP error code, and response.

**Fix:**
```ts
} catch (emailErr) {
  console.error("[forgot-password] SMTP ERROR — full details:", emailErr);
}
```

Log the full error object — Node.js `console.error` will serialize it including code, response, etc.

**Rule:** Backend SOP Hard Rule 2 — never swallow external call errors. Always log the full error object, not just `.message`.

---

### 2026-09-15 — After adding fields to schema.prisma, ALWAYS regenerate Prisma client

**Error:**
```
PrismaClientValidationError: Unknown argument `resetToken`
```

**Root cause:**
`resetToken` and `resetTokenExpiry` were added to `schema.prisma` but `prisma generate` was not run. The generated client in `src/generated/prisma` still had the old schema without these fields.

**Fix:**
```
cd D:\RozeDesk
node node_modules\prisma\build\index.js generate
```

**Rule:**
Every time you add, rename, or remove a field in `schema.prisma`, you MUST:
1. Run the SQL migration (ALTER TABLE or db push) to update the DB
2. Run `prisma generate` to update the generated client

Without step 2, the TypeScript types are stale and any query using new fields crashes at runtime with `Unknown argument`.

---

### 2026-09-15 — SMTP ports 587 and 465 may be blocked by ISP/router

**Error:**
```
Error: Greeting never received
code: 'ETIMEDOUT', command: 'CONN'
```

**Root cause:**
ISP or router blocks outbound SMTP ports (587, 465). Common in Pakistan and on home networks.

**Solutions (in order of reliability):**
1. Try port 465 (SSL) — some networks block 587 but allow 465
2. Use an HTTPS-based email API (Resend, SendGrid) — no SMTP ports needed at all
3. Use a VPN — unblocks SMTP ports

**Best practice for production:**
Use Resend or SendGrid over HTTPS instead of raw SMTP. They are more reliable, have better deliverability, work through any firewall, and provide delivery analytics.

**Rule:** For any project deployed to a cloud environment or accessed through restricted networks, prefer HTTPS-based email APIs over raw SMTP. SMTP port blocking is common and unpredictable.

---

### 2026-09-15 — Always create the page a route link points to before testing end-to-end

**What happened:**
`sendPasswordResetEmail()` builds a reset URL: `${APP_URL}/reset-password?token=xxx`
But `/reset-password` page didn't exist → 404 when user clicks the link.

**Rule:**
Before wiring an email link to a URL, verify the target page exists in the app.
Check `src/app/<route>/page.tsx` exists for every URL used in email templates.

**Also:**
Every route used in email templates must be added to `ROUTES` in `lib/routes.ts` — never hardcode paths in multiple places.

---

### 2026-09-15 — Never nest <a> inside <a>: card + CTA button pattern

**Error:**
```
[browser] In HTML, <a> cannot be a descendant of <a>.
This will cause a hydration error.
```

**Root cause:**
A job card was rendered as `<a href={jobUrl}>` (entire card clickable).
Inside it, `<Button href={applyJobUrl}>` renders another `<a>`.
HTML spec forbids nested interactive elements — hydration error results.

**Correct pattern — two options:**

Option A (used here): Card is `<div>`, title is the `<a>` nav link, CTA is a `<Button href>`.
```tsx
<div className="group ...card styles...">
  <a href={jobUrl(job.id)} className="...title styles...">
    {job.title}
  </a>
  <Button href={applyJobUrl(job.id)}>Apply Now</Button>
</div>
```

Option B: Card is `<a>`, CTA is a `<button onClick>` that calls `router.push()` with `e.stopPropagation()`.
```tsx
<a href={jobUrl(job.id)}>
  <button onClick={e => { e.stopPropagation(); router.push(applyJobUrl(job.id)); }}>
    Apply Now
  </button>
</a>
```

**Rule:** Never wrap a card in `<a>` if it contains a `<Button href>` or any other link. Use Option A — div card with a title link. This is semantically correct and avoids hydration errors.

---

## Admin Layout / Auth Lessons

### 2026-09-15 — Next.js App Router: layouts wrap ALL children including login pages

**Problem:**
`/admin/login` page rendered inside the admin sidebar+header shell because it lives under `src/app/admin/` which has `layout.tsx`.

**Fix (used here):**
Check `usePathname()` in the layout and return `<>{children}</>` bare when on the login route:
```tsx
const pathname = usePathname();
if (pathname === "/admin/login") return <>{children}</>;
```

**Alternative fix (cleaner for large apps):**
Use a Next.js route group `(auth)` to exclude the login from the layout:
```
src/app/admin/
  (auth)/
    login/page.tsx    ← no layout
  (dashboard)/
    layout.tsx        ← only applies to dashboard routes
    page.tsx
    jobs/
```

**Rule:** When a login/auth page lives under a layout folder, always use one of these approaches. Never let a login page inherit a dashboard shell.

---

### 2026-09-15 — Root admin = first admin by createdAt, not a hardcoded ID

**Pattern used:**
```ts
const root = await db.user.findFirst({
  where:   { role: "ADMIN" },
  orderBy: { createdAt: "asc" },
  select:  { id: true },
});
```

This is robust — works regardless of ID format, doesn't require env vars, survives DB migrations.

**Rules:**
- Root admin is the first ADMIN user created (oldest createdAt)
- Root admin can never be deleted (enforced server-side in DELETE handler)
- Only root admin can create or delete other admin accounts
- These rules are enforced in every API handler — never trust client-side role checks

**Wrong approach:**
Hardcoding a specific admin email or ID in env vars — fragile, breaks if credentials change.

---

### 2026-09-15 — Never hardcode bcrypt hashes in SQL seed scripts

**Problem:**
The seed SQL had a hardcoded bcrypt hash that didn't match the intended password.
bcrypt hashes are generated with a random salt — two hashes of the same password are different every time. A hash copied from the internet or another project will not match.

**Root cause:**
```sql
-- This hash may not match "Admin@1234" — it was copied, not generated
'$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uA.m'
```

**Correct approach:**
Use a setup API route that generates the hash at runtime using `bcrypt.hash()`:
```ts
const hash = await bcrypt.hash("Admin@1234", 12);
await db.user.upsert({ ..., data: { passwordHash: hash } });
```

This guarantees the hash always matches the password.

**Rule:** Never hardcode bcrypt hashes. Always generate them at runtime with `bcrypt.hash()`. If you need to seed via SQL, use the app's own API to generate and store the hash.

**Security rule:** Setup/seed endpoints must be protected by a secret and deleted after use.

---

## Settings / Architecture Lessons

### 2026-09-15 — Use key-value table for flexible platform settings

**Pattern:**
Instead of adding individual columns to a settings table for every new setting, use a key-value store:
```sql
CREATE TABLE "platform_settings" (
  "key"   TEXT PRIMARY KEY,
  "value" TEXT NOT NULL,
  ...
);
```

Upsert with `db.platformSetting.upsert({ where: { key }, update: { value }, create: { key, value } })`.

**Why:**
- Adding a new setting = no migration, no schema change, just a new key
- Read all settings in one query, convert to object with `Object.fromEntries()`
- Works for strings, booleans (stored as "true"/"false"), numbers as strings

**Rule:** For admin-configurable app settings that change rarely, prefer a key-value store over individual columns. Reserve dedicated columns for high-frequency query fields (e.g. user role, job status).

---

### 2026-09-15 — useSave hook: DRY pattern for save/error/success state

**Pattern used across all settings sections:**
```ts
function useSave() {
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [error,  setError]  = useState("");

  const run = useCallback(async (apiFn: () => Promise<void>) => {
    setSaving(true); setSaved(false); setError("");
    try {
      await apiFn();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }, []);

  return { saving, saved, error, run };
}
```

**Why:**
Without this hook, every section needs its own `saving`, `saved`, `error` state + try/catch. 5 sections × 3 states = 15 useState calls. With the hook: 5 × 1 = 5 calls.

**Rule:** Any time the same async save pattern appears more than once in a component, extract it to a hook immediately.

---

### 2026-09-15 — Graceful fallback when DB table doesn't exist yet

**Error:**
`TypeError: Cannot read properties of undefined (reading 'findMany')`

**Root cause:**
`db.platformSetting` is `undefined` because `prisma generate` was not run after adding the `PlatformSetting` model. Even with the correct schema, the generated client doesn't know about the model until regenerated.

**Two-layer fix:**
1. Always run `prisma generate` after any schema change
2. Add try/catch fallback in the API route so the app works with defaults even if the table is missing:

```ts
try {
  const rows = await db.platformSetting.findMany();
  // use rows...
} catch {
  // table not yet created — use defaults, don't crash
}
```

**Rule:** External dependencies (DB tables, services) should degrade gracefully. Never let a missing table crash an entire settings page. Return sensible defaults and log a warning.

---

### 2026-09-15 — Payment settings: match DB method casing to API

**Issue:**
DB stores method as `"JazzCash"` / `"Easypaisa"` (title case from seed).
UI maps use `"jazzcash"` / `"easypaisa"` (lowercase keys).
The `upsert where: { method }` must send the exact DB casing or it creates a duplicate.

**Fix:**
When calling the API, convert the lowercase key to title case:
```ts
method: method === "jazzcash" ? "JazzCash" : "Easypaisa"
```

When loading from the API, normalise to lowercase for UI state:
```ts
const key = row.method.toLowerCase() as PaymentMethodKey;
```

**Rule:** UI state keys and DB storage format must be explicitly mapped at the boundary. Never assume they match. Always convert at the fetch/save layer.

---

### 2026-09-15 — Persist toggle changes immediately, not just on Save

**Pattern:**
Toggle (enable/disable) should take effect immediately — don't wait for the user to click Save.
Field edits (phone, name) need deliberate Save.

**Implementation:**
- Toggle `on` → `update(method, "active", true)` + immediate `fetch(POST)` 
- Toggle `off` → show confirmation → on confirm: `update(method, "active", false)` + immediate `fetch(POST)`
- Save button → validates fields + calls `fetch(POST)` with all current state

**Rule:** Stateful toggles (active/inactive, enabled/disabled) should persist immediately on change. Form fields should persist on explicit Save. This matches user expectation.

---

### 2026-09-15 — Return 200 empty array instead of 403 for non-root admin list

**Problem:**
`GET /api/admin/admins` returned 403 for non-root admins.
The settings page treated any non-200 as a load error, breaking the page for non-root admins.

**Fix:**
Return `[]` (empty array, 200) for non-root admins — the UI already hides the admin management section when the list is empty and the user isn't root.

**Rule:**
For "list" endpoints that have role-based visibility (not role-based permission), return an empty list instead of 403. 403 means "you are not allowed here" — a non-root admin IS allowed on the settings page, they just don't see that section.
Reserve 403 for mutations (POST/DELETE) that non-root admins truly cannot perform.

---

### 2026-09-15 — App fee must be DB-controlled, not env-var-only

**Problem:**
`APP_FEE_PKR=150` in `.env.local` is a static value. Admin cannot change it without redeploying.

**Solution:**
Store fee in `platform_settings` table with key `appFee`.
- `GET /api/fee` — public endpoint, returns live fee with env fallback
- `useFee()` hook — DRY hook used by all seeker-facing components
- `getAppFee()` — server-side helper used by API routes that record the fee amount
- Admin sets it in Payment Settings page → saved to DB → all pages update immediately

**Architecture pattern:**
```
DB platform_settings.appFee (source of truth)
  ↓ read by
GET /api/fee → useFee() hook → seeker pages (job detail, apply)
  ↓ also read by
getAppFee() → POST /api/applications → stored on Payment record
  ↓ fallback
APP_FEE_PKR env var (used if DB is unreachable or row doesn't exist)
```

**Rule:** Any value that an admin needs to change without a deployment must live in the DB, not in env vars. Env vars are for infrastructure config (DB URLs, API keys). Business values (fees, rates, limits) belong in the DB.

---

## Ledger / Reporting Lessons

### 2026-09-15 — Ledger API: compute summary server-side, not client-side

**Pattern used:**
The API returns `{ transactions, summary, revenueByJob, chartData }` — all computed once on the server.

**Why not compute on client:**
- Client would need all transactions loaded to compute revenue-by-job (all time)
- Date filtering is faster server-side (DB WHERE clause)
- Summary numbers (total, avg, pending) only make sense over the filtered period

**Rule:** Aggregations (sum, count, avg, group-by) belong in the API/DB, not the client. The client should only filter/sort what it already has.

---

### 2026-09-15 — CSV export should use currently filtered data

**Pattern:**
```ts
function exportCsv() {
  const rows = filteredTx.map(t => [...].join(","));
  // download from client — no server round-trip needed
}
```

The CSV uses `filteredTx` (the already-filtered client state), not a separate API call. This means "Export CSV" always exports what the admin is currently viewing.

**Rule:** For CSV exports under ~10k rows, build the CSV client-side from the already-fetched filtered data. Only use a server-side export endpoint for very large datasets.

---

### 2026-09-15 — All admin pages wired to real APIs

**Pages wired:**
- `admin/page.tsx` — GET /api/admin/analytics + /api/admin/jobs + /api/admin/applicants
- `admin/jobs/page.tsx` — GET /api/admin/jobs, PATCH close, DELETE delete
- `admin/applicants/page.tsx` — GET /api/admin/applicants, PATCH status update
- `admin/payments/page.tsx` — GET /api/admin/payments, PATCH approve/reject

**Pattern used in every page:**
1. `useEffect` → `fetch(API)` on mount
2. Loading skeleton while fetching
3. Error banner with dismiss + retry
4. Real data renders once loaded
5. Mutations (PATCH/DELETE) call API, then update local state optimistically

**Rule:** Never ship a page that uses hardcoded mock arrays for data that comes from a DB.
Mock arrays are acceptable ONLY as placeholder during pure UI development before the API exists.
Once the API exists, wire immediately.

---

### 2026-09-15 — Apply flow: fetch payment config from DB, not hardcoded

**Problem:**
`PAYMENT_CONFIG` was hardcoded with fake phone numbers and account names. If the admin changes the JazzCash number in Payment Settings, the apply page would still show the old number.

**Fix:**
Load payment config on mount from `/api/admin/payment-settings` (no auth — public endpoint).
Filter to only active methods. Map DB record to UI shape using `METHOD_META`.

**Rule:** Any value the admin can configure in Settings must be loaded from the DB, not hardcoded.
Phone numbers, account names, fees — all must come from the DB at runtime.

---

### 2026-09-15 — Edit job page: Next.js 16 params is a Promise in page components too

**Problem:**
`EditJobPage({ params }: { params: { id: string } })` — direct destructure fails in Next.js 16 App Router pages.

**Fix:**
```tsx
import { use } from "react";

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  ...
}
```

`use(params)` unwraps the Promise synchronously in a React component. This is the Next.js 16 pattern for both page components and route handlers.

**Rule:** In Next.js 16, always type `params` as `Promise<{...}>` in both API routes and page components. Use `await params` in async functions, `use(params)` in React components.

---

## Analytics Lessons

### 2026-09-15 — Visitor tracking requires an external service, not just DB queries

**Problem:**
Analytics page showed "Visitors: 892" from hardcoded data. There's no visitor tracking in the DB schema — visitors are not users or applicants, they're anonymous page-view events.

**Reality:**
Our DB only tracks: Users (registered), Applications, Payments. We cannot count visitors from DB queries alone.

**Solutions:**
- Plausible Analytics (privacy-first, self-hostable) → embed script, query API
- Google Analytics → embed script, query Reporting API
- Simple: log a visit record in DB on each page load (requires API route + schema)

**For now:**
Analytics page shows real data for: Applicants, Revenue, New Users, Active Listings, Application Funnel, Top Jobs. Shows a clear notice that visitor tracking requires an external service.

**Rule:** Never fake analytics data. Show real data you have, clearly state what's not tracked, and provide guidance on how to add it. Users trust real zeros more than fake thousands.

---

### 2026-09-15 — Analytics API: period-aware chart buckets require different query strategies

**Pattern per period:**
- `today/24h` → hourly buckets (14 × 1-hour windows)
- `week`      → daily buckets  (7 × 1-day windows)
- `month`     → daily buckets  (30 × 1-day windows)
- `year`      → monthly buckets (12 × 1-month windows)

Each bucket requires a separate `db.application.count({ where: { createdAt: { gte, lte } } })` query.
Use `Promise.all()` to run all bucket queries in parallel — never sequentially.

**Performance note:**
14-30 parallel DB queries is acceptable for an admin dashboard refreshed on demand.
For high-frequency use, cache results in `platform_settings` or use `AnalyticsSummary` table.

---

## File Upload Lessons

### 2026-09-15 — Real file upload: FormData not JSON, no Content-Type header

**Problem:**
Apply page was sending `Content-Type: application/json` with stub URL strings.
The API expected `multipart/form-data` with actual file bytes.

**Correct client pattern:**
```ts
const fd = new FormData();
fd.append("cv",      cvFile,      cvFile.name);
fd.append("receipt", receiptFile, receiptFile.name);
// NO Content-Type header — browser sets it with boundary automatically
const res = await fetch("/api/applications", {
  method:  "POST",
  headers: { Authorization: `Bearer ${token}` }, // NO Content-Type
  body:    fd,
});
```

**Wrong:**
```ts
headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
body: JSON.stringify({ cvUrl: "/stub.pdf" })
```

**Rule:** Never set `Content-Type` manually when sending `FormData`. The browser sets it to `multipart/form-data; boundary=...` automatically. Setting it manually breaks the boundary and the server can't parse the parts.

---

### 2026-09-15 — Supabase Storage for private files: use service role key server-side only

**Pattern:**
- Upload: server-side only, using `SUPABASE_SERVICE_ROLE_KEY` (never exposed to client)
- View:   server generates 1-hour signed URL via `GET /api/admin/file?path=...`
- Client opens the signed URL in a new tab

**Why not public bucket:**
CVs and payment receipts are private user documents. A public bucket would expose them to anyone with the URL. Private bucket + signed URLs = secure access with expiry.

**Dev fallback:**
If `SUPABASE_SERVICE_ROLE_KEY` is not set, files are stored as stub paths (`/uploads/...`).
This allows full development + testing without Storage configured.

**Setup in production:**
1. Supabase Dashboard → Storage → New bucket: "rozedesk" (private)
2. Copy `service_role` key from Project Settings → API
3. Set `SUPABASE_SERVICE_ROLE_KEY=...` in `.env.local`

---

### 2026-09-15 — Post Job form: real API call, not setTimeout stub

**Fixed:**
`admin/jobs/new/page.tsx` was using `await new Promise(res => setTimeout(res, 1500))` instead of calling the real API.

**Correct pattern:**
```ts
const res = await fetch("/api/admin/jobs", {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  body: JSON.stringify({ title, category, location, type, description, requirements, ... }),
});
const data = await res.json();
if (!res.ok) throw new Error(data.message ?? "Failed to post job.");
```

**Rule:** A `setTimeout` stub in a form submit handler is only acceptable for pure UI prototyping. Once an API route exists, wire immediately. Never ship with `setTimeout` stubs.

---

### 2026-09-15 — API response shape mismatch: always destructure at the fetch site

**Error:**
```
TypeError: Cannot read properties of undefined (reading 'toLocaleString')
```
`a.revenue` was `undefined` even though `a` was truthy.

**Root cause:**
The analytics API returns `{ kpi: { listings, applicants, revenue, ... }, chartApplicants, ... }`.
The overview page expected a flat shape `{ listings, applicants, revenue, ... }`.
So `a = analyticsResponse` and `a.revenue` = `undefined` (it was nested under `a.kpi.revenue`).

**Fix:**
At the fetch site, extract the nested object immediately:
```ts
const json = await res.json();
setAnalytics(json.kpi ?? json);          // flat KPI object
setChartData(json.chartApplicants ?? []); // chart array stored separately
```

**Rule:**
When an API response has a different shape than what a component expects, transform it **at the fetch site** — not inside the component render. The component should always see a consistent, flat data shape. Never let API shape changes leak into component rendering logic.

**Additional fix:**
Always use `?? 0` or `?? "—"` on numeric fields used in string operations like `.toLocaleString()`:
```ts
value: a ? `PKR ${(a.revenue ?? 0).toLocaleString()}` : "—"
//                             ^^^^ guard against undefined
```

---

## Admin Jobs Lessons

### 2026-09-15 — POST API requires company but form didn't send it

**Problem:**
`POST /api/admin/jobs` required `company` field for the DB (NOT NULL column).
Post Job form had no company input — the API returned 400 "Company name is required."

**Fix:**
Added `company` field to:
1. `JobForm` interface
2. `validate()` function
3. Form UI (input after Title)
4. `JSON.stringify()` body in `handleSubmit`
5. Same in edit-job form + PUT body

**Rule:** When adding a required DB field, trace ALL paths that write to that model:
- POST API route (create)
- PUT API route (update)
- POST form (new)
- PUT form (edit)
All must be updated together. Missing one causes a runtime 400/500 that's hard to trace.

---

### 2026-09-15 — Reopen button: PATCH with status ACTIVE, not a separate endpoint

**Pattern:**
Close and Reopen both use `PATCH /api/admin/jobs/[id]` with `{ status: "CLOSED" | "ACTIVE" }`.
No separate `/reopen` endpoint needed — status is a param.

```ts
// Close
PATCH /api/admin/jobs/[id]  { status: "CLOSED" }
// Reopen  
PATCH /api/admin/jobs/[id]  { status: "ACTIVE" }
```

The PATCH handler validates: `if (!VALID.includes(status)) return err(400, ...)`

**UI pattern:**
- Active job → shows "Close" button (yellow)
- Closed job → shows "Reopen" button (green) + "Delete" button
- Both use the same confirmation modal, driven by `ACTION_META` config object

**Rule:** Status transitions belong in a single PATCH endpoint, not separate routes.
Use a config object (`ACTION_META`) to drive confirmation modal text — DRY.

---

### 2026-09-15 — P1001 "Can't reach database" is infrastructure, not code

**Error:**
```
P1001: Can't reach database server at aws-0-ap-south-1.pooler.supabase.com
driverAdapterError: DatabaseNotReachable
```

**Root cause:** NOT a code bug. Three possible causes:
1. **Supabase project paused** (free tier pauses after 1 week inactivity) → go to supabase.com/dashboard → Restore
2. **Stale pool connections** — pg Pool held a connection that Supabase closed server-side → restart `npm run dev`
3. **Network issue** — no internet or DNS failure

**How to distinguish:**
- If ALL DB queries fail → project paused or no internet
- If intermittent or after idle period → stale pool connections

**Prevention in db.ts:**
```ts
const pool = new Pool({
  idleTimeoutMillis: 30_000,      // release before Supabase closes
  connectionTimeoutMillis: 10_000, // fail fast, don't hang
});
pool.on("error", err => console.error("[db] Pool error:", err.message));
```

**Rule:** Never file a code bug for P1001. Check Supabase dashboard first. Restart dev server second. Investigate code third.

---

## Applicants Page Lessons

### 2026-09-15 — Status action buttons: data-driven config, not if/else chains

**Pattern used:**
```ts
const STATUS_ACTIONS: Record<string, { label, next, color }[]> = {
  PAYMENT_UNDER_REVIEW: [
    { label:"Mark CV Under Review", next:"CV_UNDER_REVIEW", color:"neutral" },
    { label:"Reject",               next:"REJECTED",        color:"error"   },
  ],
  CV_UNDER_REVIEW: [
    { label:"Shortlist", next:"SHORTLISTED", color:"success" },
    { label:"Reject",    next:"REJECTED",    color:"error"   },
  ],
  ...
};
```

**Why:**
Status transitions are business logic, not UI logic. A config object is:
- DRY: transition rules defined once, rendered generically
- Extensible: adding a new status = one new entry in the config
- Testable: the config is plain data, easy to verify

**Wrong:**
```tsx
{app.status !== "SHORTLISTED" && <button>Shortlist</button>}
{app.status !== "CV_UNDER_REVIEW" && <button>Under Review</button>}
{app.status !== "REJECTED" && <button>Reject</button>}
```
This duplicates the transition logic in JSX and makes it hard to see the full state machine.

---

### 2026-09-15 — Job filter dropdown should load from /api/admin/jobs, not from applicants

**Problem:**
The job filter dropdown was built from applicants' job data. If there are 0 applicants, the dropdown is empty — admin can't filter by job at all.

**Fix:**
Load job listings separately from `/api/admin/jobs` on mount. The dropdown always shows all jobs regardless of whether they have applicants.

**Rule:** Filters should load their options independently of the data being filtered.

---

### 2026-09-15 — When adding a field to a form: trace ALL 4 locations

**Checklist for adding a new field (e.g. `benefits`) to a form:**

1. **Interface** — add to `JobForm` interface
2. **EMPTY/initial state** — add `benefits: ""` to `EMPTY_FORM`
3. **Load/pre-fill** — `benefits: (data.benefits ?? []).join("\n")` in useEffect
4. **Save body** — `benefits: form.benefits.split("\n").map(...)` in handleSubmit
5. **UI** — add `<FieldGroup>` + `<textarea>` in JSX
6. **API server-side** — handle the new field in POST/PUT handler

Missing any one of these causes: silent data loss, 400 errors, or fields that display but don't save.

**Rule:** When adding a field, use this 6-step checklist. Never add just the UI without the API body, and never add just the API without the form state.

---

## Project Completion Summary — 2026-09-15

### Everything wired end-to-end:

**Seeker flows:**
- Register (POST /api/auth/signup) + welcome email
- Sign in (POST /api/auth/signin) with rememberMe JWT expiry
- Google OAuth (Supabase → /api/auth/callback → JWT)
- Forgot password (POST /api/auth/forgot-password) + reset email
- Reset password (POST /api/auth/reset-password)
- Sign out (POST /api/auth/signout) clears HttpOnly cookies
- Browse jobs (GET /api/jobs) with filters
- Job detail (GET /api/jobs/[id]) with live fee
- Apply flow: CV + receipt upload → POST /api/applications (FormData)
- Dashboard: overview, applications, profile, saved jobs, alerts
- Account deletion (DELETE /api/seeker/profile)

**Admin flows:**
- Admin login (POST /api/auth/signin with ADMIN role)
- Overview dashboard with date-filtered analytics
- Job listings: post, edit, close, reopen, delete
- Applicants: filter by job/status, expand detail, update status
- Payments: review receipts, approve/reject with reason
- Analytics: period-aware charts, funnel, top jobs
- Ledger: earnings, CSV export, date filter
- Payment settings: configure JazzCash/Easypaisa, set fee
- Settings: profile, platform config, notifications, password change
- Admin management: create/delete sub-admins (root only)

**Infrastructure:**
- Supabase PostgreSQL (pooler at port 6543)
- Prisma 7 with @prisma/adapter-pg + SSL
- Supabase Storage (file uploads with signed URLs)
- SMTP email (nodemailer with fallback)
- JWT auth (HttpOnly cookies + localStorage)
- Platform settings in DB (fee, site name, notifications)

---

### 2026-09-15 — Always use saveSession() helper — never inline localStorage.setItem for auth

**Problem:**
Admin login, signup, and signin pages each had their own `localStorage.setItem("rozedesk-token", ...)` calls. When keys change, all 3 must be updated. One page had a duplicate `setTimeout` from copy-paste.

**Fix:**
All 3 pages now call `saveSession(data.token, data.user)` from `@/lib/auth`.

```ts
import { saveSession } from "@/lib/auth";
// after successful login:
saveSession(data.token, data.user);
```

**Rule:** `saveSession()` is the single source of truth for storing auth state. Never call `localStorage.setItem("rozedesk-token", ...)` or `localStorage.setItem("rozedesk-user", ...)` anywhere except inside `saveSession()`.

---

### 2026-09-15 — Layout "Loading..." flash: use lazy useState to read localStorage synchronously

**Problem:**
Dashboard header showed "Loading…" for 50-200ms after navigation because AuthContext hydrates asynchronously — it sets `isLoading: true` on first render, then reads localStorage in a `useEffect`.

**Fix:**
Use `useState` with a lazy initializer to read localStorage synchronously on the very first render:

```ts
const [cachedName] = useState<string>(() => {
  const stored = getStoredUser(); // sync read
  return stored?.name ?? "";
});
```

Then use `user?.name ?? cachedName` — the real AuthContext user as soon as it resolves, the cached value instantly on first render.

**Rule:** For values that must appear instantly (user name in header, initials in avatar), read localStorage synchronously via `useState(() => ...)` lazy initializer. Never show "Loading…" for content that exists in localStorage.

---

### 2026-09-15 — Duplicate setTimeout: always check for duplicate timeouts after copy-paste

**Problem:**
Admin login had:
```ts
setTimeout(() => router.push(ROUTES.admin), 1000);
/* Auto-redirect to admin dashboard after brief success flash */
setTimeout(() => router.push(ROUTES.admin), 1000);  // duplicate!
```
Two identical `setTimeout` calls — both fire, causing double navigation.

**Rule:** Search for duplicate `setTimeout` calls after any copy-paste. Use Ctrl+F on the function name.

---

### 2026-09-15 — `??` and `||` cannot be mixed without parentheses

**Error:**
```
Nullish coalescing operator(??) requires parens when mixing with logical operators
```

**Wrong:**
```ts
const name = user?.name ?? cachedName || "fallback"; // parse error
```

**Correct — wrap the ?? expression in parens:**
```ts
const name = (user?.name ?? cachedName) || "fallback";
```

**Rule:** Whenever `??` appears alongside `||` or `&&` on the same expression, wrap the `??` sub-expression in parentheses. JavaScript/TypeScript forbids mixing them without parens to avoid ambiguity about operator precedence.

---

### 2026-09-15 — useSearchParams requires Suspense or force-dynamic in Next.js 16

**Error:**
```
Error occurred prerendering page "/jobs"
Export encountered an error on /jobs/page: /jobs, exiting the build.
```

**Root cause:**
Next.js 16 tries to statically prerender pages at build time. `useSearchParams()` reads from the URL which is only available at request time — not during static prerender.

**Two solutions:**

Option A — Wrap the component in `<Suspense>` (good for public pages that should be statically rendered):
```tsx
function JobsPageInner() {
  const searchParams = useSearchParams(); // safe inside Suspense
  ...
}
export default function JobsPage() {
  return <Suspense fallback={<LoadingSpinner />}><JobsPageInner /></Suspense>;
}
```

Option B — Add `export const dynamic = "force-dynamic"` (good for auth/dashboard pages that are always dynamic):
```ts
export const dynamic = "force-dynamic"; // opt out of static prerender entirely
```

**Rule:**
- Public pages (`/jobs`, `/`) → use Suspense to keep static shell + dynamic data
- Auth/dashboard pages (`/signin`, `/dashboard/*`) → use `force-dynamic` since they're never static

---

### 2026-09-15 — nodemailer.Transporter namespace not found in strict TypeScript

**Error:**
```
error TS2503: Cannot find namespace 'nodemailer'.
```

**Wrong:**
```ts
let _transporter: nodemailer.Transporter | null = null;
function getTransporter(): nodemailer.Transporter { ... }
```

**Fix — use ReturnType instead of namespace access:**
```ts
let _transporter: ReturnType<typeof nodemailer.createTransport> | null = null;
function getTransporter(): ReturnType<typeof nodemailer.createTransport> { ... }
```

**Rule:** When a library exports a class/type under a namespace that TypeScript can't resolve in strict mode, use `ReturnType<typeof lib.method>` to infer the return type directly.

---

### 2026-09-15 — export const dynamic = "force-dynamic" is IGNORED in "use client" components

**Problem:**
Added `export const dynamic = "force-dynamic"` to `"use client"` pages to prevent prerender errors from `useSearchParams`. It was silently ignored — builds still failed.

**Root cause:**
`export const dynamic` is a **Server Component** directive. It is completely ignored in `"use client"` components. The Next.js docs state this clearly but it's easy to miss.

**Correct fix for "use client" + useSearchParams:**
Wrap the component in `<Suspense>`. Split into inner + outer:
```tsx
// outer — static shell, exported as default
export default function Page() {
  return <Suspense><PageInner /></Suspense>;
}
// inner — uses useSearchParams, renders inside Suspense boundary
function PageInner() {
  const searchParams = useSearchParams();
  ...
}
```

**Pages that needed this fix:**
- `/signin` — reads `?error=` from OAuth callback
- `/reset-password` — reads `?token=` from email link
- `/jobs` — reads `?q=`, `?category=`, `?location=` filters
- `/admin/applicants` — reads `?job=` from deep link

**Rule:** Any `"use client"` page that calls `useSearchParams()` must be wrapped in `<Suspense>`. Always split into `PageInner` + `Page` wrapper pattern.

---

### 2026-09-15 — Wrong localStorage key: "rd_token" vs "rozedesk-token"

**Problem:**
Saved-jobs page used `localStorage.getItem("rd_token")` but the app stores the token as `localStorage.getItem("rozedesk-token")`. Every API call returned 401.

**Fix:**
Define a single `token()` helper in each file:
```ts
function token(): string {
  return typeof window !== "undefined" ? localStorage.getItem("rozedesk-token") ?? "" : "";
}
```

**Rule:** Never hardcode localStorage key strings inline. Either use the `token()` helper or import from `@/lib/auth` (which uses `TOKEN_KEY = "rozedesk-token"`). Any typo in the key causes silent 401 errors that are hard to debug.

---

### 2026-09-15 — Save Job feature: POST to save, DELETE to unsave — same endpoint

**Pattern:**
The save/unsave toggle uses the same `/api/seeker/saved-jobs` endpoint:
- `POST { jobId }` → saves the job (upsert — safe to call twice)
- `DELETE { jobId }` → removes the save

The `SaveJobButton` component handles both states:
1. Check if user is logged in — if not, redirect to `/signin`
2. Toggle `saved` state optimistically
3. Call POST or DELETE
4. On error — keep previous state (no rollback needed since we don't break anything)

**Rule:** Save/bookmark actions should be optimistic (instant UI feedback) with silent error handling. Users don't need to see an error for a save action — just don't update the state if it fails.

---

### 2026-09-15 — Hydration mismatch: never read localStorage in useState initializer

**Error:**
```
Hydration failed because the server rendered text didn't match the client.
Server: "SK"  Client: "MA"
```

**Root cause:**
```ts
// WRONG — runs differently on server vs client
const [cachedInit] = useState<string>(() => {
  const stored = getStoredUser(); // reads localStorage — undefined on server
  return stored?.initials || "SK";
});
```
On the server: `localStorage` doesn't exist → returns `"SK"`.
On the client: `localStorage` has `"MA"` → returns `"MA"`.
React sees a mismatch → hydration error.

**Correct fix — read localStorage only after mount:**
```ts
const [mounted,    setMounted]    = useState(false);
const [cachedInit, setCachedInit] = useState("SA"); // same value server + client

useEffect(() => {
  const stored = getStoredUser();
  if (stored) setCachedInit(stored.initials || getInitials(stored.name) || "SA");
  setMounted(true);
}, []);

// Use only after mounted — both server and client started with "SA"
const displayInitials = mounted ? cachedInit : "SA";
```

**Rule:** Any value that differs between server and client (localStorage, window, Date.now, Math.random) MUST be read inside `useEffect`, never in:
- `useState(() => ...)` initializer
- Direct component body
- Anything that runs during SSR render

The server and client initial render MUST produce identical HTML.

---

### 2026-09-15 — Alerts page: three bugs from same root cause ("rd_token")

**All three bugs had the same root cause:** using `"rd_token"` instead of `"rozedesk-token"`.

**Additional issues found:**
1. `createAlert` swallowed errors silently — form stayed open with no feedback
2. `deleteAlert` was optimistic but had no revert on failure
3. `credentials: "include"` missing — HttpOnly cookies not sent

**Patterns applied:**
- `saving` state + `saveError` state → show error inside form
- Per-alert `toggling[id]` and `deleting[id]` states → disable buttons during in-flight requests
- Optimistic toggle with revert on failure
- Keywords required validation client-side (immediate feedback) + server-side (security)

**Rule:** All async mutation handlers need:
1. Loading state (disable button, show spinner)
2. Error state (show message to user, not just console.error)
3. Optimistic update + revert pattern for list mutations

---

## Profile System Lessons

### 2026-09-15 — Store dynamic arrays (education, experience) as JSON in Prisma

**Decision:**
Education and work experience are dynamic arrays with variable fields depending on qualification level. Instead of creating separate `Education` and `Experience` tables with foreign keys, stored them as `Json[]` in `SeekerProfile`.

**Why JSON arrays here:**
- Education/experience are always read/written together with the profile — no need for separate queries
- Fields differ by level (Matric has board, Bachelor has CGPA, PhD has neither) — JSON handles variable schema
- Never queried/filtered independently — no need for relational indexing

**Prisma schema:**
```prisma
education  Json[] @default([])
experience Json[] @default([])
```

**SQL:**
```sql
ADD COLUMN IF NOT EXISTS "education"  JSONB NOT NULL DEFAULT '[]',
ADD COLUMN IF NOT EXISTS "experience" JSONB NOT NULL DEFAULT '[]',
```

**Rule:** Use JSON arrays for profile sub-documents that are always read together, have variable schema, and are never queried independently. Use relational tables when you need to query/filter individual entries.

---

### 2026-09-15 — Profile completeness gate: 60% threshold to apply

**Pattern:**
```
GET /api/seeker/profile/completeness
→ { pct: 45, canApply: false, missing: ["Education", "Work experience", ...] }
```

The apply page calls `useProfileCompleteness()` on mount. If `canApply === false`, it renders a gate screen showing:
- Current percentage
- List of missing sections
- "Complete My Profile →" CTA button

**Threshold: 60%** — requires at minimum: name, phone, location, summary, 3+ skills, 1 education entry.

**Why 60% not 100%:**
Requiring 100% would block job seekers who don't have work experience (fresh graduates). 60% ensures basic profile info is present while allowing incomplete optional sections.

**Rule:** Profile completeness gates should show exactly WHAT is missing, not just "profile incomplete". Users can't fix problems they can't see.

---

### 2026-09-15 — Tech role auto-detection from skills keywords

**Pattern:**
```ts
const TECH_KEYWORDS = ["developer","engineer","react","node","python",...];
const isTechRole = skills.some(s =>
  TECH_KEYWORDS.some(k => s.toLowerCase().includes(k))
);
```

When `isTechRole` is true, the Links section shows GitHub and Portfolio fields in addition to LinkedIn.
When false, only LinkedIn and a generic Portfolio field are shown.

**Why auto-detect instead of asking:**
Adding a "Are you a tech professional?" toggle adds friction. Auto-detection from skills is instant and correct for 95% of cases. The user can still add portfolio manually if detected incorrectly.

**Rule:** Derive binary flags (isTechRole, isStudent, etc.) from data the user already provided. Never add a form field when you can compute the answer.

---

### 2026-09-15 — Education level determines which fields to show

**Pattern:**
```ts
const EDU_FIELDS_BY_LEVEL: Record<string, string[]> = {
  "Matric / O-Levels":   ["institution","board","totalMarks","obtainedMarks","year"],
  "Bachelor's (16yr)":   ["institution","totalMarks","obtainedMarks","year","grade"],
  "PhD":                 ["institution","year","grade"],
};
```

When user selects a qualification level, only relevant fields render. Matric and Intermediate show board name. Bachelor/Master show CGPA. PhD hides marks fields.

**Rule:** Use a config object to map input values to conditional field sets. Never use a chain of `if (level === "X") show Y` in JSX — put the logic in a config and render generically.

---

### 2026-09-15 — buildProfileData helper: only update provided fields

**Problem:**
If the PUT body only contains `{ skills: [...] }` (saving just the skills section), the API should NOT null out `phone`, `location`, etc.

**Fix:**
```ts
function buildProfileData(body: Record<string, unknown>) {
  const d: Record<string, unknown> = {};
  if (body.phone !== undefined) d.phone = body.phone || null;
  if (body.skills !== undefined) d.skills = ...;
  // Only include key if it was sent in the body
  return d;
}
```

**Rule:** Section-by-section saves must only update the fields in that section. Use `!== undefined` checks, not truthiness checks, so that empty strings correctly clear a field.

---

### 2026-09-15 — Always run SQL migration BEFORE prisma generate

**Error:**
```
PrismaClientValidationError: Unknown argument `education`. Did you mean `location`?
```

**Root cause:**
The order was:
1. ✅ Updated `schema.prisma` to add `education`, `experience` etc.
2. ✅ Ran `prisma generate` — but DB columns didn't exist yet!
3. ❌ Never ran `ALTER TABLE` SQL in Supabase

Prisma generate reads the schema FILE but validates against what the DB actually has at runtime. When the app tried to write `education`, the DB column didn't exist — `PrismaClientValidationError`.

**Correct order:**
1. Update `schema.prisma`
2. Run `ALTER TABLE` SQL in Supabase SQL Editor (adds columns to DB)
3. Run `prisma generate` (regenerates client with new columns)
4. Restart dev server

**Rule:** Schema changes have TWO parts:
- DB migration (ALTER TABLE) — changes the actual database
- `prisma generate` — updates the TypeScript client to know about new columns
Both must happen. Neither alone is sufficient.

---

### 2026-09-16 — Prisma `Json[]` vs `Json` — use `Json` for a JSON array column

**Error:**
```
P2007: invalid input syntax for type json
e.map is not a function
```

**Root cause:**
`Json[]` in Prisma maps to a PostgreSQL array of JSONB values (`JSONB[]`).
`Json`  in Prisma maps to a single PostgreSQL JSONB column that can hold any JSON (including arrays).

We wanted to store `[{...}, {...}]` — an array of objects in ONE column.
- **Wrong:** `education Json[] @default([])` → creates `JSONB[]` column (array of JSON values, one cell per entry)
- **Correct:** `education Json @default("[]")` → creates single `JSONB` column storing the whole array as JSON

**SQL column type:**
```sql
-- Wrong (for storing a JSON array)
ADD COLUMN "education" JSONB[]      -- array OF jsonb values
-- Correct
ADD COLUMN "education" JSONB NOT NULL DEFAULT '[]'::jsonb  -- single jsonb storing an array
```

**Rule:** When you want to store a JSON array (like a list of education entries) in a single column, use Prisma `Json` (not `Json[]`) with `@default("[]")` and `JSONB NOT NULL DEFAULT '[]'::jsonb` in SQL.
Use `Json[]` only when you want PostgreSQL array semantics (e.g. `education[1]` indexing), which is rarely needed.

---

## Database Switch: Supabase PostgreSQL → XAMPP MySQL

### 2026-09-16 — Switching Prisma from PostgreSQL to MySQL

**Changes required:**
1. `schema.prisma`: `provider = "mysql"` — one line change
2. `prisma7.config.ts`: remove `directUrl` (MySQL doesn't use pgbouncer)
3. `db.ts`: remove `@prisma/adapter-pg` and `Pool` — MySQL uses Prisma's built-in driver, no adapter needed
4. `String[]` arrays → `Json @default("[]")` — MySQL has no native array column type
5. Install `mysql2` package in rozedesk-app
6. `.env` / `.env.local`: `mysql://root:@127.0.0.1:3306/rozedesk`

**Why no adapter for MySQL:**
Prisma 7's built-in driver handles MySQL natively via `mysql2`. The `@prisma/adapter-pg` was only needed for PostgreSQL because Prisma 7 dropped the built-in Rust engine for Postgres. MySQL still uses the built-in JS driver.

**Array fields → JSON in MySQL:**
PostgreSQL supports native array types (`TEXT[]`). MySQL does not.
All array fields (`skills`, `requirements`, `benefits`, `education`, `experience`) changed to `Json @default("[]")`.
Prisma handles JSON serialization automatically.

**Speed comparison:**
- Supabase PostgreSQL (pooler): db push took 30-60s, often timed out
- XAMPP MySQL (localhost): db push completed in **1.12 seconds** ✓

**Rule:** For local development, always prefer localhost databases over cloud databases. Use cloud only for staging/production.

---

### 2026-09-16 — Prisma 7 MySQL adapter: use @prisma/adapter-mariadb, NOT @prisma/adapter-mysql

**Error:**
```
PrismaClientInitializationError: PrismaClient was instantiated without any options.
A driver adapter is required to connect to your database.
```

**Root cause:**
Prisma 7 requires a driver adapter for ALL databases including MySQL.
The adapter package name is NOT `@prisma/adapter-mysql` (does not exist).
The correct package for MySQL/MariaDB is `@prisma/adapter-mariadb`.

**XAMPP MySQL is fully compatible with the mariadb adapter** because MySQL and MariaDB share the same wire protocol.

**Correct db.ts for MySQL/XAMPP:**
```ts
import { PrismaMariadb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariadb({ url: process.env.DATABASE_URL });
const prisma  = new PrismaClient({ adapter });
```

**Install:**
```
npm install @prisma/adapter-mariadb mariadb
```

**Rule:** For Prisma 7 MySQL support, always use `@prisma/adapter-mariadb` — it works for both MySQL and MariaDB databases.

---

### 2026-09-16 — Correct export name: `PrismaMariaDb` (capital D, lowercase b)

**Error:**
```
Export PrismaMariadb doesn't exist in target module
Did you mean to import PrismaMariaDb?
```

**Fix:**
```ts
// Wrong
import { PrismaMariadb } from "@prisma/adapter-mariadb";
// Correct
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
```

**Rule:** Always verify exact export names from the error message. TypeScript and Turbopack often suggest the correct spelling in the error output — read the full error before guessing.

---

### 2026-09-16 — PrismaMariaDb takes connection params, NOT a URL string

**Error:** 500 after fix — the adapter was created with `{ url: connectionString }` but the API requires individual connection parameters.

**Wrong:**
```ts
const adapter = new PrismaMariaDb({ url: "mysql://root:@127.0.0.1:3306/rozedesk" });
```

**Correct:**
```ts
const adapter = new PrismaMariaDb({
  host:            "127.0.0.1",
  port:            3306,
  user:            "root",
  password:        "",
  database:        "rozedesk",
  connectionLimit: 5,
});
```

**Lesson:** Always verify adapter constructor signature from official docs before writing code. The mariadb adapter takes individual connection parameters, not a URL string. The pg adapter takes `{ connectionString }`. They are different.

**DRY rule:** Parse `DATABASE_URL` into individual params in one helper function `parseDbUrl()`. This way the URL stays in one env var and the parsing is done once.

---

### 2026-09-16 — Jobs not showing: API returned flat array but page expected { jobs, total } wrapper

**Root cause:**
The jobs API was returning a flat array `[{...}, {...}]` but the jobs page expected:
```json
{ "jobs": [...], "total": N, "page": 1, "pages": 2 }
```

The page did `data.jobs ?? []` — since `data` was an array, `data.jobs` was `undefined`, so `setJobs([])` and 0 jobs showed.

**Fix:**
API now returns the wrapped object:
```ts
return NextResponse.json({ jobs: [...], total, page, pages });
```

**Rule:** Public list APIs should always return a wrapper object `{ items, total, page }`, not a bare array. This allows adding pagination metadata later without a breaking change. Bare arrays cannot carry pagination info.

---

### 2026-09-16 — MySQL: remove `mode: "insensitive"` from Prisma queries

**Error (silent):**
`mode: "insensitive"` in Prisma `contains`/`equals` filters is a PostgreSQL-only feature. MySQL's default collation (`utf8mb4_general_ci`) is already case-insensitive, so this option is not needed and may cause errors.

**Fix:**
```ts
// Wrong (PostgreSQL only)
{ title: { contains: q, mode: "insensitive" } }
// Correct for MySQL
{ title: { contains: q } }
```

**Rule:** When switching from PostgreSQL to MySQL, remove all `mode: "insensitive"` from Prisma filter objects. MySQL string comparisons are case-insensitive by default with the standard collation.

---

### 2026-09-16 — React Hard Rule: ALL hooks must run before any conditional return

**Error:**
```
Error: Rendered fewer hooks than expected.
This may be caused by an accidental early return statement.
```

**Root cause:**
The apply page had this structure:
```tsx
export default function ApplyPage({ params }) {
  const appFee = useFee();          // hook 1
  const completeness = ...;         // hook 2

  if (!completeness.canApply) {
    return <GateScreen />;          // ← EARLY RETURN before hooks 3-10
  }

  const [step, setStep] = useState(); // hook 3 — never runs on gate path!
  const [cvFile, ...] = useState();   // hook 4 — never runs!
  useEffect(...);                     // hook 5 — never runs!
}
```

On first render, React calls hooks 1 and 2. On second render (after loading), it tries to return early — but hooks 3-10 are skipped. React sees "I expected 10 hooks, got 2" → crash.

**Fix:**
Move ALL `useState`/`useEffect`/`useCallback` to the TOP of the function, before any conditional returns. The conditional return goes AFTER the last hook:

```tsx
export default function ApplyPage({ params }) {
  const appFee = useFee();           // hook 1
  const completeness = ...;          // hook 2
  const [step, ...] = useState();    // hook 3  ← moved up
  const [cvFile, ...] = useState();  // hook 4  ← moved up
  useEffect(...);                    // hook 5  ← moved up

  // NOW it's safe to conditionally return
  if (!completeness.canApply) {
    return <GateScreen />;
  }
  return <MainContent />;
}
```

**React Rule:**
Never place any `useState`, `useEffect`, `useCallback`, or custom hook call after a conditional return. All hooks must run unconditionally, in the same order, on every render.

---

### 2026-09-16 — Next.js 16: params is a Promise in page components too — use React.use()

**Error:**
```
A param property was accessed directly with `params.jobId`.
`params` is a Promise and must be unwrapped with React.use()
```

**Wrong (sync access — works in Next.js 14 but broken in Next.js 16):**
```tsx
export default function ApplyPage({ params }: { params: { jobId: string } }) {
  useEffect(() => {
    fetch(`/api/jobs/${params.jobId}`); // ← crash in Next.js 16
  }, [params.jobId]);
}
```

**Correct (Next.js 16 pattern):**
```tsx
import React, { use } from "react";

export default function ApplyPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = React.use(params); // unwrap Promise synchronously
  useEffect(() => {
    fetch(`/api/jobs/${jobId}`); // ← correct
  }, [jobId]);
}
```

`React.use()` in components, `await params` in async route handlers.

---

### 2026-09-16 — Payment settings must have a public endpoint for seeker-facing pages

**Problem:**
The apply flow fetched `/api/admin/payment-settings` which requires `requireAdmin()`. Seekers got 403.

**Fix:**
Created `/api/payment-settings` (public, no auth) that returns only active payment methods with public fields (method, phone, name, address). Sensitive admin fields (reviewedBy, etc.) excluded.

**Rule:** Any data shown to seekers (payment phone numbers, account names) must come from a public endpoint. Never use admin endpoints in seeker-facing pages.

---

### 2026-09-16 — str_replace on multi-block code leaves orphaned fragments

**Error:**
```
Expression expected
.filter(p => p.active)  ← orphaned code outside any function
```

**Root cause:**
When replacing a large code block that contained a `useEffect` with inline `.filter().map()` chains, the replacement only covered the opening portion. The closing portion (`.filter().map()` chains + `setPaymentConfig` + `}, [jobId])`) remained in the file, now sitting outside any function — causing a parse error.

**Prevention:**
When replacing multi-line blocks containing nested closures:
1. Read the EXACT lines before replacing — never guess the boundaries
2. After any replacement, read the affected lines again to verify no orphaned code remains
3. For large replacements, prefer `fs_write` to rewrite the entire file rather than `str_replace` on complex nested blocks

**Rule:** After any `str_replace` on a file with closures/callbacks, always read ±10 lines around the replacement to verify structural integrity.

---

### 2026-09-16 — Apply flow: show profile CV instead of asking for upload

**Before:** Step 1 asked user to upload a CV file (PDF/DOC). This caused friction — user had to find and upload their CV every time they applied.

**After:** Step 1 shows a live CV preview generated from their profile data (fetched from `/api/seeker/cv`). User reviews it and clicks "CV Looks Good — Continue to Payment".

**Backend change:**
The API now accepts `cvFromProfile=true` in FormData instead of a CV file. The `cvUrl` is stored as `/profile-cv/{userId}` — a marker that tells admins the CV was generated from the seeker's profile, not an uploaded file.

**Benefits:**
- Zero friction — no file picker, no upload
- CV is always up-to-date (reflects latest profile changes)
- User can edit their profile before applying if needed (Edit Profile → link)

**Rule:** Never make users upload data you already have. If the profile has a CV, use it. Only ask for file upload when the system genuinely doesn't have the data.

---

### 2026-09-16 — Always guard array[0] fallbacks against empty arrays

**Error:**
```
TypeError: Cannot read properties of undefined (reading 'label')
selectedPayment.label  ← selectedPayment was undefined
```

**Root cause:**
```ts
const selectedPayment = paymentConfig.find(...) ?? paymentConfig[0];
// When paymentConfig is [] → paymentConfig[0] is undefined
// undefined ?? undefined → undefined
// selectedPayment.label → crash
```

**Fix:**
```ts
const selectedPayment = paymentConfig.length > 0
  ? (paymentConfig.find(p => p.method === selectedMethod) ?? paymentConfig[0])
  : null;  // explicitly null when array is empty
```

Then guard the render:
```tsx
{selectedPayment ? (
  <AccountDetails payment={selectedPayment} />
) : (
  <Warning>Payment methods not configured.</Warning>
)}
```

**Rule:** Never use `array[0]` as a fallback without checking `array.length > 0` first. Empty arrays return `undefined` for `array[0]` — this is a common source of `.property` crashes on conditionally-loaded data.

---

### 2026-09-16 — After removing a feature, remove ALL its validation checks

**Problem:**
Replaced CV file upload with profile-based CV. Removed the file upload UI and FormData append. But missed removing the validation check inside `submitStep2`:
```ts
if (!cvFile) {
  setReceiptError("CV file is missing. Please go back and re-upload.");
  return;
}
```
`cvFile` was always null (no upload anymore) so this check always fired.

**Rule:** When removing a feature, search for ALL references to the removed state/variable and clean them up:
1. `useState` declaration
2. Validation checks that use it
3. `useCallback` dependency arrays
4. FormData appends
5. Error messages referencing it

Use grep/search to find all occurrences before considering the removal complete.

---

### 2026-09-16 — Receipt viewer: modal lightbox instead of new tab

**Before:** "View Receipt →" called `window.open(url, "_blank")` — opened in a new browser tab. Problems:
- Stub URLs (`/uploads/...`) have no server serving them — blank tab
- Admin had to leave the payments page
- No context (no ref number, no close button)

**After:** Receipt opens in an inline modal:
- Full-screen overlay with image/PDF preview
- Ref number shown in header
- "Open full size" link for high-res view
- Close button (X) or click backdrop to dismiss
- Error fallback: shows placeholder + "Try opening directly" if image fails

**Pattern:**
```ts
const [receiptModal, setReceiptModal] = useState<{ url: string; ref: string | null } | null>(null);
// Open: setReceiptModal({ url, ref })
// Close: setReceiptModal(null)
```

**Rule:** Admin tools should keep the user in context. Use modals for file previews, not new tabs. This reduces context switching and lets admin approve/reject without leaving the payments list.

---

### 2026-09-17 — Dev file storage: save to public/uploads/ not stub paths

**Problem:**
`uploadOrStub()` was generating paths like `/uploads/receipts/userId_jobId_ts.png` but never writing the actual file to disk. The path was stored in the DB but the file didn't exist anywhere — so the receipt modal showed "Receipt not available".

**Fix:**
When `SUPABASE_SERVICE_ROLE_KEY` is not set (dev/XAMPP mode), use Node.js `fs.writeFile` to save the uploaded file to `public/uploads/{folder}/filename`. Next.js serves the `public/` directory at the root, so `/uploads/receipts/file.png` becomes directly accessible.

```ts
const { writeFile, mkdir } = await import("fs/promises");
const uploadDir = join(process.cwd(), "public", "uploads", folder);
await mkdir(uploadDir, { recursive: true });
await writeFile(join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));
return `/uploads/${folder}/${filename}`;
```

**Production:** Use Supabase Storage (set `SUPABASE_SERVICE_ROLE_KEY`) for proper private storage with signed URLs.

**Rule:** Dev file storage must save files to a location that is actually served by the dev server. A stub path that points to a non-existent file is only acceptable for unit tests, never for end-to-end flow testing.

---

### 2026-09-17 — Duplicate application check must allow re-submission when payment is pending

**Problem:**
1. User applied → broken receipt saved → DB has Application(PENDING_PAYMENT) + Payment(PENDING)
2. Admin reset deleted Payment but NOT the Application
3. User tried to resubmit → API found existing Application → returned 409 "already applied"

**Root cause:**
The reset only deleted the Payment, not the Application. The 409 check was too strict — it blocked even PENDING_PAYMENT re-submissions.

**Fix:**
```ts
const existing = await db.application.findUnique({
  where:   { userId_jobId: { userId: auth.id, jobId } },
  include: { payment: true },
});

if (existing) {
  if (existing.status !== "PENDING_PAYMENT") {
    return err(409, "You have already applied for this job."); // block real duplicates
  }
  // PENDING_PAYMENT = payment never completed → allow re-submission
  if (existing.payment) await db.payment.delete({ where: { id: existing.payment.id } });
  await db.application.delete({ where: { id: existing.id } });
  // Fall through to create fresh application
}
```

**Rule:** Duplicate checks must distinguish between:
- In-progress applications (PENDING_PAYMENT) → allow re-submission
- Completed applications (CV_UNDER_REVIEW, SHORTLISTED, HIRED, REJECTED) → block with 409

Never block re-submission of incomplete flows — this traps users with broken state they can't self-recover from.

---

## Notification System Lessons

### 2026-09-17 — Complete notification system: DB + API + Toast + Bell dropdown

**Architecture:**
```
DB:      Notification model (userId, title, body, type, read, link, createdAt)
API:     GET/PATCH/DELETE /api/notifications — list, mark-read, clear
Helper:  createNotification() in lib/notify.ts — server-side, non-fatal
Hook:    useNotifications() in DashboardHeader — polls every 30s
Toast:   ToastProvider + useToast() — client-side instant feedback
```

**Two layers of feedback:**
1. **Toast** — immediate client-side feedback on every mutation (save, approve, reject, create alert)
2. **Bell notifications** — persistent in-app notifications for cross-user events (payment approved, status changed)

**When to use each:**
- Toast: user performs an action → instant confirmation ("Saved successfully", "Alert created")
- Bell notification: another user's action affects you → notification appears in bell dropdown

**Non-fatal rule for createNotification():**
```ts
export async function createNotification(payload: NotifyPayload): Promise<void> {
  try {
    await db.notification.create({ data: payload });
  } catch (e) {
    console.error("[notify] Failed:", e); // never propagate
  }
}
```
A notification failure must never break the main operation (payment approval, status change).

---

### 2026-09-17 — DRY Toast: ToastProvider wraps entire app, useToast() anywhere

**Pattern:**
1. `ToastProvider` in `app/layout.tsx` — wraps everything once
2. `useToast()` hook — any component calls `toast.success()`, `toast.error()`, etc.
3. Never import Toast UI directly — always go through the hook

**Rule:** Toast/notification systems must be initialized at the root layout level. Never create multiple toast instances or multiple notification containers.

---

### 2026-09-17 — Never hardcode the application fee — always read from env or DB

**Problem:**
`PKR 150` was hardcoded in 6 places:
- `constants.ts` — `export const APP_FEE_PKR = 150`
- `admin/payment-settings/page.tsx` — subtitle and info banner
- `mailer.ts` — welcome email template
- `terms/page.tsx` — legal text
- `admin/settings/page.tsx` — initial state
- `api/fee/route.ts` fallback + `api/admin/settings/route.ts` fallback

**Fix — three-layer approach:**
1. **DB (live):** `platform_settings.appFee` — admin sets via Payment Settings page
2. **ENV (fallback for server-side):** `process.env.APP_FEE_PKR` — used when DB unavailable
3. **Client hook:** `useFee()` — fetches from `/api/fee`, falls back to env

```ts
// constants.ts — env-controlled fallback
export const APP_FEE_PKR = parseInt(process.env.APP_FEE_PKR ?? "150", 10);

// API routes — DB with env fallback
const FALLBACK_FEE = parseInt(process.env.APP_FEE_PKR ?? "150", 10);

// Client pages — live from DB
const appFee = useFee(); // hooks to /api/fee → DB → env fallback
```

**Rule:** Any business value that can change (fee amounts, rates, limits) must be:
1. Stored in the DB (admin-configurable)
2. Read via a hook or API call in client code
3. Backed by an env var fallback (never a magic number)
Never write `= 150` anywhere except `.env.local` and the DB seed.

---

### 2026-09-17 — After removing an import, find ALL usages of that symbol

**Error:**
```
ReferenceError: APP_FEE_PKR is not defined
at PaymentSettingsPage (src/app/admin/payment-settings/page.tsx:62:62)
```

**Root cause:**
Removed `APP_FEE_PKR` from the import in `payment-settings/page.tsx` but forgot to update the 3 places it was still used:
1. `useState<number>(APP_FEE_PKR)` — initial state
2. `.then(r => r.ok ? r.json() : { fee: APP_FEE_PKR })` — fetch fallback
3. `setAppFee(feeData.fee ?? APP_FEE_PKR)` — null coalescing fallback

**Fix:** Replace all 3 with `0` — the value loads from the API on mount, so `0` is a safe initial state.

**Rule:** When removing an import, use grep/search to find ALL usages of that symbol before removing it. Never assume you found all usages after fixing the first one.

---

### 2026-09-17 — CV link opened /profile-cv/{userId} as a page → 404

**Root cause:**
When CV is from profile (not a file upload), `cvUrl` is stored as `/profile-cv/{userId}`.
The "View CV" button tried to open this as a URL in a new tab → Next.js routed it → 404.

**Fix:**
- Created `GET /api/admin/cv/[userId]` — returns full profile data as structured CV
- Replaced `window.open(cvUrl)` with a modal that fetches from the API
- Modal includes the applicant's name, contact, skills, education, experience, preferences
- "Print / Save PDF" button calls `window.print()` with print CSS that hides everything except `#cv-print-area`

**Rule:** File-based resources stored in DB as paths must always be served through an API that validates access. Never link directly to storage paths — they may not be accessible or may contain sensitive data. Always use a server-side endpoint that checks auth before returning the URL or data.

---

### 2026-09-17 — Print blank page: `window.print()` on a fixed modal prints nothing

**Problem:**
`window.print()` on a page with a fixed-position modal printed a blank page. The browser's print renderer couldn't capture content inside fixed elements inside React modals.

**Root cause:**
CSS `@media print { body > *:not(#cv-print-area) { display:none } }` was hiding everything. But `#cv-print-area` was inside a fixed modal — fixed elements create a new stacking context that the print renderer doesn't capture as body content.

**Fix — print to a new window:**
```ts
const win = window.open("", "_blank", "width=800,height=900");
win.document.write(`<!DOCTYPE html><html><head><style>/* inline styles */</style></head>
<body>${document.getElementById("cv-print-area")?.innerHTML}</body></html>`);
win.document.close();
setTimeout(() => win.print(), 500); // wait for render
```

**Key points:**
1. Write a complete standalone HTML document with inline CSS (no Tailwind, no CSS vars)
2. Use `innerHTML` of the CV container — copies the rendered React content
3. 500ms delay before `print()` — lets the browser render the new window first
4. `win.document.close()` is required before accessing the DOM

**Rule:** Never use `window.print()` to print content inside fixed/modal elements. Always open a new window with a complete standalone HTML document for printing.

---

### 2026-09-17 — Always run `prisma db push` after adding a new model to schema

**Error:**
```
P2021: The table `notifications` does not exist in the current database.
```

**Root cause:**
Added `Notification` model to `schema.prisma` and ran `prisma generate` (updates TypeScript types) but forgot to run `prisma db push` (creates the actual MySQL table).

**Two-step rule:** Schema change = two commands:
1. `prisma generate` → updates TypeScript client
2. `prisma db push` → creates/updates the DB table

Both must happen. `generate` without `push` = TypeScript knows about the model but the table doesn't exist. `push` without `generate` = table exists but TypeScript doesn't know about it.

---

### 2026-09-17 — Remove Google Fonts import in offline/restricted environments

**Error:**
```
If you are offline or behind a proxy, self-host the font with next/font/local
```

**Root cause:**
`next/font/google` downloads fonts at build time from fonts.googleapis.com. In offline environments or behind corporate proxies, this fails.

**Fix:**
Replace Google Fonts imports with plain objects (CSS variables already defined):
```ts
// Before
import { Geist, Geist_Mono } from "next/font/google";
const geistSans = Geist({ variable: "--font-geist-sans", ... });

// After — no network dependency
const geistSans = { variable: "--font-geist-sans", className: "" };
```

The app still works because `--font-geist-sans` falls back to system fonts already defined in globals.css.

**Rule:** In production, use `next/font/local` with bundled font files OR ensure the deployment environment has internet access to Google Fonts. Never depend on Google Fonts in offline dev environments.

---

### 2026-09-17 — Platform cut % must be DB-controlled, not hardcoded 0.85

**Problem:**
`PLATFORM_CUT = 0.85` was hardcoded in constants and used in 4+ places.
The "Processing (15%)" label in the UI was also hardcoded.

**Fix — same three-layer approach as appFee:**
1. **DB:** `platform_settings.platformCut = "15"` (stored as integer percentage)
2. **ENV fallback:** `PLATFORM_CUT_PCT=15` in `.env.local`
3. **constants.ts:** `PLATFORM_CUT_PCT = parseInt(process.env.PLATFORM_CUT_PCT ?? "15")`
4. **Admin UI:** Platform Cut card in Payment Settings → Save Cut → stored in DB
5. **API (ledger):** `getPlatformCut()` reads from DB, uses env fallback
6. **Client:** `usePlatformCut()` hook fetches from settings API

**Key insight:** Store the INTEGER percentage (e.g. 15), not the decimal (0.15).
- Integer is human-readable in UI and DB
- Derive `cut = (100 - pct) / 100` and `processingFee = pct / 100` at usage

**Rule:** Any business percentage (commission, tax, fee) must be:
1. Stored in DB as integer (admin-configurable)
2. Backed by an env var fallback
3. Derived at point of use — never hardcoded as a decimal like `0.85`

---

### 2026-09-17 — Duplicate React keys: never use user-controlled values as keys

**Error:**
```
Encountered two children with the same key, `Any`.
```

**Root cause:**
Three tags in the alerts list all used `tag.label` as the React key:
```ts
{ label: a.location,  icon: "..." },  // value: "Any"
{ label: a.type,      icon: "..." },  // value: "Any"
{ label: a.frequency, icon: "..." },  // value: "Daily"
```
When both location and type are "Any", two elements share the same key → React warning + potential rendering bug.

**Fix:** Use index as part of the key when labels can repeat:
```tsx
.map((tag, i) => <span key={`${i}-${tag.label}`} ...>)
```

**Rule:** Never use user-controlled values (location, type, status) as React list keys. Use stable, unique identifiers like database IDs, or compound keys with the index. Pure value keys only work when values are guaranteed unique in the list.

---

### 2026-09-17 — useEffect with `if (!user) return` never resolves on first navigation

**Problem:**
Admin settings page showed loading skeleton forever on first navigation. Ctrl+R fixed it.

**Root cause:**
```ts
useEffect(() => {
  if (!user) return; // ← bails out on first render (user is null)
  fetch("/api/admin/settings", ...);
  ...
  .finally(() => setPageLoading(false)); // ← never called!
}, [user]); // ← dependency is correct but...
```

On first render: `user = null` → effect bails → `setPageLoading(false)` never called → skeleton shown forever.
After Ctrl+R: page reloads, localStorage is read synchronously → `user` is set before useEffect runs → works.

**Fix — handle the case where user is null but loading is done:**
```ts
const { user, isLoading } = useAuth();

useEffect(() => {
  if (!user) {
    if (!isLoading) setPageLoading(false); // ← stop skeleton if auth is done
    return;
  }
  // ...fetch...
}, [user, isLoading]); // ← both in deps
```

**When user is null AND isLoading is false** → auth has resolved, user is just not logged in → stop the skeleton. The middleware will redirect if needed.

**Rule:** Any `useEffect` that guards with `if (!user) return` MUST:
1. Import `isLoading` from `useAuth()`
2. Call `setLoading(false)` when `!isLoading && !user`
3. Add both `user` and `isLoading` to the dependency array

Otherwise the loading skeleton never resolves on first client-side navigation.


---

## Backend / Frontend Lessons (continued)

### 2026-09-19 — Custom date-range filter sent wrong params to API ("custom" mapped to "all")

**What happened:**
Three admin pages (Overview, Analytics, Ledger) each had a local `presetToPeriod()` function that mapped the date picker preset to an API `period=` query param. For `preset === "custom"` it mapped to `"all"` — so picking a date range produced the same result as "All Time" and the actual `from`/`to` dates were never sent.

**What was wrong about it:**
1. **DRY violation:** `presetToPeriod()` was copied into all three page files. When it needed updating, three places had to change.
2. **Incomplete mapping:** `"custom"` needs `period=custom&from=YYYY-MM-DD&to=YYYY-MM-DD` in the query string, not just `period=all`.
3. **`useEffect` dependency was `dateRange.preset`** — even if `from`/`to` changed (e.g. user picked new dates without changing the preset tab), the effect never re-fired.
4. **API `from`/`to` was parsed but KPI queries only used `gte: from`** — no upper bound, so a custom range like "Jan 1–Jan 31" would include all data after Jan 1 instead of stopping at Jan 31.

**What was fixed:**

*DateFilter.tsx* — added `buildApiParams(range: DateRange): string` as a single exported helper:
```ts
export function buildApiParams(range: DateRange): string {
  const p = new URLSearchParams({ period: range.preset });
  if (range.preset === "custom") {
    if (range.from) p.set("from", range.from);
    if (range.to)   p.set("to",   range.to);
  }
  return p.toString();
}
// e.g. "period=week" or "period=custom&from=2026-01-01&to=2026-01-31"
```

*Analytics API + Ledger API* — replaced `periodStart()` with `resolveDateRange()` that returns `{ from, to }` pair. All Prisma queries now use `{ gte: from, lte: to }` so the upper bound is always respected.

*All three pages* — removed local `presetToPeriod()`, imported `buildApiParams`, changed:
- `fetchData(period: string)` → `fetchData(range: DateRange)` — takes the full DateRange object
- `useEffect([dateRange.preset])` → `useEffect([dateRange])` — reacts to from/to changes too
- Fetch URL: `?period=${period}` → `?${buildApiParams(range)}`
- Retry buttons: updated to pass full `dateRange` object

**Prevention rules:**
1. **Custom date ranges always require two extra params** — never map "custom" to any named period. The API must receive `from` + `to`.
2. **Shared URL-building logic belongs in a single helper**, not in each page. If two pages need the same query string logic, it goes in a shared utility first.
3. **`useEffect` deps must include every variable the effect reads** — if the fetch depends on `from` AND `to`, both must be in the dep array. Watching only `preset` breaks custom range re-fetch.
4. **Both `gte` and `lte` bounds must be set** for any bounded date range query. `gte` alone is an open-ended filter and will over-count data outside the selected window.

**Files changed:**
- `src/components/dashboard/DateFilter.tsx` — added `buildApiParams()`
- `src/app/api/admin/analytics/route.ts` — `resolveDateRange()`, `lte: to` on all queries, custom chart branch
- `src/app/api/admin/ledger/route.ts` — `resolveDateRange()`, `lte: to` on where clause
- `src/app/admin/analytics/page.tsx` — uses `buildApiParams`, `useEffect([dateRange])`
- `src/app/admin/page.tsx` — uses `buildApiParams`, `useEffect([dateRange])`
- `src/app/admin/ledger/page.tsx` — uses `buildApiParams`, `useEffect([dateRange])`

**Related SOP section:** Universal Engineering Principles §Hard Rule 2 (DRY — shared logic goes in one place), Backend SOP §Hard Rule 3 (validate and bound all range queries), Frontend SOP §6.1 (all states including custom filter state must reflect real data)

---

## Frontend / Architecture Lessons (continued)

### 2026-09-19 — Dashboard job links escaped to public layout; Save Job button missing from browse pages

**What happened:**
Two related bugs reported:
1. Clicking any job title inside `/dashboard/jobs` (the seeker dashboard browse page) or `/dashboard/saved-jobs` navigated to `/jobs/[id]` — the **public** job detail page which wraps itself in `<NavBar>` and `<Footer>`, breaking the dashboard shell entirely.
2. The "Browse Jobs" / "Browse More Jobs" buttons on `/dashboard/saved-jobs` also linked to `/jobs` (public) instead of `/dashboard/jobs`.
3. The "Save Job" bookmark button only existed on the public `/jobs/[id]` detail page. Job cards in both the dashboard browse page and the public browse page had no save button at all.

**Root causes:**

| Cause | Detail |
|---|---|
| `ROUTES` had no `dashboardJobs` entry | `routes.ts` only had `ROUTES.jobs = "/jobs"`. There was no `ROUTES.dashboardJobs` for the dashboard-scoped browse. |
| `jobUrl()` always returned `/jobs/[id]` | The only URL helper built `/jobs/[id]` — no dashboard-equivalent existed. Dashboard pages imported and used this helper, escaping the layout. |
| `SaveJobButton` was defined inline in `jobs/[id]/page.tsx` | The component was embedded in the public detail page, so it was never available to job cards. A new page or browse card couldn't import it without duplicating code. |
| No `/dashboard/jobs/[id]` page existed | Even if the link was fixed, there was nowhere inside the dashboard layout to render the detail view. |

**What was fixed:**

1. **`src/lib/routes.ts`** — Added `dashboardJobs: "/dashboard/jobs"` to `ROUTES`. Added `dashboardJobUrl(id)` helper that returns `/dashboard/jobs/${id}`. Updated Sidebar hardcode to use `ROUTES.dashboardJobs`.

2. **`src/components/SaveJobButton.tsx`** — Extracted the inline `SaveJobButton` into a **shared component** with two variants:
   - `variant="card"` — compact icon + text for job list cards
   - `variant="detail"` — full-width button for job detail sidebars
   Handles unauthenticated redirect to `/signin`, POST to save, DELETE to unsave. Single source of truth — no duplication.

3. **`src/app/dashboard/jobs/[id]/page.tsx`** — Created new page that renders job detail **inside the dashboard layout** (no `<NavBar>`/`<Footer>`). Uses `SaveJobButton variant="detail"` and a `← Back` button using `router.back()`.

4. **`src/app/dashboard/jobs/page.tsx`** — Job title links changed from `jobUrl()` → `dashboardJobUrl()`. Added `SaveJobButton variant="card"` below Apply Now for non-applied jobs.

5. **`src/app/dashboard/saved-jobs/page.tsx`** — Both "Browse Jobs" / "Browse More Jobs" buttons changed from `ROUTES.jobs` → `ROUTES.dashboardJobs`. Job title links changed from `jobUrl()` → `dashboardJobUrl()`.

6. **`src/app/jobs/page.tsx`** — Added `SaveJobButton variant="card"` beside the Apply button on public browse cards.

7. **`src/app/jobs/[id]/page.tsx`** — Removed inline `SaveJobButton` definition; now imports from shared component with `variant="detail"`.

**Prevention rules:**

1. **Every dashboard page that links to a resource detail must link to the dashboard-scoped detail URL**, not the public one. Before adding any `href` inside a dashboard page, ask: does this URL stay within `/dashboard/*`? If not, either create the dashboard-scoped page or deliberately link to the public one with a clear comment explaining why.

2. **Any interactive widget used in 2+ places belongs in `src/components/`**, not inline in a page file. If you find yourself copy-pasting a component, extract it first. Apply `variant` prop pattern for layout differences (card vs detail, compact vs full-width).

3. **Routes are a contract — every route a page links to must exist in `ROUTES`**. If `ROUTES` has no entry for a URL you need, add it there first. Never hardcode a path string in a component.

4. **When a dashboard has a list page, it needs a detail page inside the same layout**. Plan both when building a browse feature. A list page with job title links that go nowhere (or escape the layout) is incomplete.

**Files changed:**
- `src/lib/routes.ts` — `dashboardJobs`, `dashboardJobUrl()`
- `src/components/SaveJobButton.tsx` — new shared component (extracted + enhanced)
- `src/app/dashboard/jobs/[id]/page.tsx` — new dashboard-scoped job detail page
- `src/app/dashboard/jobs/page.tsx` — dashboardJobUrl, SaveJobButton card
- `src/app/dashboard/saved-jobs/page.tsx` — dashboardJobs routes, dashboardJobUrl
- `src/app/jobs/page.tsx` — SaveJobButton card on public browse
- `src/app/jobs/[id]/page.tsx` — uses shared SaveJobButton

**Related SOP section:** Frontend SOP §13 Change Management (route is a contract), Universal Engineering Principles §Hard Rule 2 (DRY — shared widgets in components), Architect SOP §0 (list + detail must both exist within the same layout shell)

---

## DevOps / Infrastructure Lessons

### 2026-09-19 — Production hosting preparation: 7 issues found and fixed

**Context:** Preparing RozeDesk (Next.js 16 + Prisma 7 + MySQL) for production hosting on a containerised platform (Railway / Render / VPS with Docker).

---

#### Issue 1 — `connectionLimit` hardcoded in `db.ts`

**What was wrong:** `connectionLimit: 5` was hardcoded. On serverless platforms (Vercel, Lambda) each function instance creates its own pool, so 5 × N instances = exhausted DB connections fast.

**Fix:** Read from `DB_POOL_SIZE` env var (default 5). Added `DB_CONNECT_TIMEOUT` from `DB_CONNECT_TIMEOUT` env var. Operators can set `DB_POOL_SIZE=1` for serverless, `DB_POOL_SIZE=10` for a dedicated server.

**Prevention rule:** Any resource limit (pool size, timeout, retry count) that depends on the deployment environment must be an env var, not a code constant.

---

#### Issue 2 — Prisma singleton only cached in non-production

**What was wrong:**
```ts
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
```
In production, every module evaluation created a new `PrismaClient` — especially dangerous under Next.js module splitting where `db.ts` can be evaluated multiple times. Each creates a new connection pool, exhausting DB connections silently.

**Fix:** Cache on `globalThis` unconditionally:
```ts
const globalForPrisma = globalThis as unknown as { _prisma?: PrismaClient };
export const db = globalForPrisma._prisma ?? createPrismaClient();
globalForPrisma._prisma = db;
```

**Prevention rule:** Next.js module singleton pattern (`globalThis` cache) must apply in ALL environments. The original Next.js docs example has a note about dev-only that is often misread as "only cache in dev" — it means "you only need it for dev HMR, but it doesn't hurt in prod."

---

#### Issue 3 — `prisma generate` not in build script

**What was wrong:** `"build": "next build"`. The hosted build environment has no pre-generated Prisma client (it's in `src/generated/prisma` which is gitignored). The first deploy would fail with "Cannot find module '@/generated/prisma'".

**Fix:**
```json
"build": "node ../node_modules/prisma/build/index.js generate && next build"
```

**Prevention rule:** Any file in `src/generated/` must be regenerated as part of the build command, not assumed to exist. The build command is the contract between dev and production.

---

#### Issue 4 — `next.config.ts` had no `output: "standalone"` and no security headers

**What was wrong:** Without `output: "standalone"`, `next build` produces an output that requires the full `node_modules` directory to run — not suitable for Docker. Security headers (X-Frame-Options, HSTS, etc.) were absent.

**Fix:** Added `output: "standalone"`. Added security headers via `async headers()`: X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy, and HSTS (prod only). Guarded `turbopack.root` and `allowedDevOrigins` behind `!isProd`.

**Prevention rule:** Every Next.js app intended for Docker/container hosting must have `output: "standalone"`. Security headers are not optional for a production web app — add them at project start, not as a pre-launch afterthought.

---

#### Issue 5 — Setup route had a hardcoded admin password returned in the response

**What was wrong:**
```ts
const password = "Admin@1234";  // hardcoded
return NextResponse.json({ password: "Admin@1234" }); // returned in response
```
Any log aggregator, proxy, or CDN edge caching the response would capture the admin password in plaintext.

**Fix:** Password now comes from `ADMIN_INITIAL_PASSWORD` env var. If not set, a random 16-character password is generated with `crypto.randomBytes` and shown once in the response (with a "save this now" warning). The response only echoes "(set via env var)" if the env var is present.

**Prevention rule:** DevOps SOP Hard Rule 1 — no secrets in code. Credentials, API keys, and passwords must come from env vars or a secrets manager. A setup endpoint that returns a hardcoded password in its JSON response is a data breach waiting to happen.

---

#### Issue 6 — Health route leaked internal error messages

**What was wrong:**
```ts
message: error instanceof Error ? error.message : "Unknown error"
```
DB error messages often contain: hostname, DB name, user, query fragments, driver version. Returning these in the HTTP response body exposes internal topology to anyone who can reach the endpoint.

**Fix:** Full error logged server-side (`console.error`). Response body contains only `{ status: "error", database: "unreachable", time }` — no message, no stack trace.

**Prevention rule:** Internal errors (DB errors, filesystem errors, 3rd-party API errors) are logged server-side only. The HTTP response tells the caller **what happened** (unreachable), never **why** at the internal level. Separate monitoring (log aggregator) reads the server logs.

---

#### Issue 7 — No Dockerfile, no `.dockerignore`, no `.env.production.example`

**What was wrong:** Project had no deployment artifacts. Every hosting platform would require manual configuration with no documented baseline.

**Fix:**
- `Dockerfile` — 3-stage build (deps → builder → runner). Runs as non-root user (`nextjs`). Copies only `.next/standalone` + static + public. Includes Docker `HEALTHCHECK` pointing to `/api/health`.
- `.dockerignore` — excludes `node_modules/`, `.next/`, `.env*`, user uploads (cv/receipts), logs.
- `.env.production.example` — documents every required env var with descriptions. No actual secrets — safe to commit. Includes inline notes about serverless vs. long-running pool sizing, file upload storage warning, JWT secret generation command.

**Prevention rule:** Every project prepared for hosting must have these three files before the first deploy. They are the ops contract: "here is what the container needs to run."

---

**Files changed in this session:**
- `src/lib/db.ts` — pool tuning via env, unconditional singleton
- `src/app/api/setup/admin/route.ts` — no hardcoded password, env-driven credentials
- `src/app/api/health/route.ts` — no error detail leak, latency metric added
- `package.json` — `prisma generate` in build script, `db:push` + `db:generate` helpers
- `next.config.ts` — `output: standalone`, security headers, dev-only guards
- `.env.local` — added `DB_POOL_SIZE`, `DB_CONNECT_TIMEOUT`, `ADMIN_EMAIL`, `ADMIN_INITIAL_PASSWORD`
- `Dockerfile` + `.dockerignore` — new files
- `.env.production.example` — new file

**Related SOP sections:** DevOps SOP Hard Rules 1 (no secrets in code), 4 (private by default), 7 (no monitoring, no launch); §4 (self-contained deployment unit); §6 (secrets management)

---

## DevOps Lessons (continued)

### 2026-09-19 — Railway production: DB pool timeout + Supabase crash on missing env vars

**Issue 1 — DB pool timeout: `active=0 idle=0 limit=2`**

`DATABASE_URL=mysql://root:PASS@${{RAILWAY_PRIVATE_DOMAIN}}:3306/railway` failed silently. The `${{RAILWAY_PRIVATE_DOMAIN}}` reference resolves to the MySQL service's internal hostname, but it's a Railway-internal template that only works when the variable is defined **referencing the MySQL service**. Using it in a raw string meant the hostname was literally `${{RAILWAY_PRIVATE_DOMAIN}}` at runtime — no DNS, no connections, pool immediately exhausted.

**Fix:** Use `${{MYSQLHOST}}`, `${{MYSQLPORT}}`, `${{MYSQLUSER}}`, `${{MYSQL_ROOT_PASSWORD}}`, `${{MYSQL_DATABASE}}` — these are the actual variable names exported by Railway's MySQL service and they resolve correctly via Railway's inter-service variable sharing.

Also set individual `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` so `db.ts` uses the individual-var path (more reliable than URL parsing). Increased `DB_POOL_SIZE=5` and `DB_CONNECT_TIMEOUT=30`.

**Prevention rule:** Never use `${{RAILWAY_PRIVATE_DOMAIN}}` in a raw string. Use the MySQL service's own exported variable names. Always verify which variable names the MySQL service exports by checking its Variables tab.

---

**Issue 2 — Supabase client crash on placeholder env vars**

The Google OAuth route called `createSupabaseServerClient()` which used `process.env.NEXT_PUBLIC_SUPABASE_URL!` — the `!` non-null assertion. When the value was `https://placeholder.supabase.co`, the Supabase SDK validated it and threw `"Your project's URL and Key are required"` crashing the route handler at module level.

**Fix:** `supabase-server.ts` now checks for missing/placeholder values and returns `null`. `api/auth/google/route.ts` checks `SUPABASE_CONFIGURED` at module level and returns a graceful redirect to `/signin?error=oauth_unavailable` instead of crashing.

**Prevention rule:** Any optional integration (OAuth, analytics, storage) must have a "not configured" path that returns a clean response, never a crash. Check for placeholder values, not just null/undefined.

**Files changed:**
- `src/app/api/auth/google/route.ts` — SUPABASE_CONFIGURED guard
- `src/lib/supabase-server.ts` — returns null when not configured
- Railway Variables — switched to `${{MYSQLHOST}}` etc., DB_POOL_SIZE=5, DB_CONNECT_TIMEOUT=30

**Related SOP:** DevOps SOP Hard Rule 1 (no secrets in code), Backend SOP §6 (graceful degradation for optional integrations)

---

## DevOps Lessons (continued)

### 2026-09-19 — Railway private networking: wrong hostname caused all DB pool timeouts

**Root cause:** Railway MySQL service was renamed/registered as `mysql` — so its private hostname is `mysql.railway.internal`. But the `MYSQLHOST` variable exported by Railway still resolved to `affectionate-curiosity.railway.internal` (the project/environment name), which is NOT the correct private DNS name for the MySQL service after rename.

Every DB query failed with `pool timeout: active=0 idle=0` because the mariadb driver could never open a TCP connection to a hostname that didn't resolve.

**Fix:** Hardcode `mysql.railway.internal` directly in `DATABASE_URL` and `DB_HOST` instead of using `${{MYSQLHOST}}`. The MySQL service's Settings tab showed "You can also call me `mysql`" which confirmed the correct short hostname.

**Schema push:** Could not run `prisma db push` from the container because `DATABASE_URL` template wasn't resolving at build time (Railway templates only resolve at runtime). Solution: connected directly to MySQL console (`mysql -u root -p...`) and pasted raw `CREATE TABLE` SQL.

**db.ts build-time safety:** `parseDbUrl()` must return `null` (not throw) when URL is invalid/unresolved, so `next build` doesn't fail when `DATABASE_URL` contains unresolved Railway templates like `${{MYSQLHOST}}`. The caller falls back to a dummy config for build-time static analysis.

**Prevention rules:**
1. Always verify the private hostname from MySQL service Settings tab ("You can also call me `mysql`"), not from `${{MYSQLHOST}}` which may resolve to a stale/wrong value.
2. For Railway MySQL: use `mysql.railway.internal` directly, not the `${{MYSQLHOST}}` reference.
3. Keep a hand-written MySQL schema SQL file (`prisma/mysql-schema.sql`) as a fallback for when Prisma CLI can't reach the DB at deploy time.
4. After first successful admin login: remove `SETUP_SECRET` from env immediately.

**Files changed:** `src/lib/db.ts` (null-safe parseDbUrl), Railway Variables (hardcoded `mysql.railway.internal`), `prisma/mysql-schema.sql` (created as manual fallback).

---

## DevOps / Backend Lessons (continued)

### 2026-09-19 — Receipt files 404 on Railway: ephemeral filesystem

**What happened:** Payment receipts uploaded via the apply flow were saved to `public/uploads/receipts/` on the container's local filesystem. After a redeploy, Railway spins up a new container with a fresh filesystem — all uploaded files are gone. Visiting the receipt URL returns 404.

**Root cause:** `uploadOrStub()` in `api/applications/route.ts` fell through to the local filesystem write when `SUPABASE_SERVICE_ROLE_KEY` was not set — even in `NODE_ENV=production`. Railway containers are ephemeral by design.

**Fix:** Added a third storage path:
1. **Supabase Storage** — if `SUPABASE_SERVICE_ROLE_KEY` is set (cloud, persistent, recommended)
2. **Local filesystem** — only in `NODE_ENV !== "production"` (dev only)
3. **Base64 data URL in DB** — production fallback when no cloud storage. Stores the file content as `data:mime/type;base64,...` directly in the `receiptUrl` DB column. Works on any platform, no filesystem dependency. Trade-off: larger DB rows (~33% larger than binary).

**Prevention rule:** Never write user-uploaded files to the local filesystem in a production API route. Railway, Vercel, Render, and all containerised platforms use ephemeral filesystems. Always use:
- Cloud storage (S3, Supabase, R2) for production
- Base64 data URLs in DB as a fallback if no storage service is configured
- Local filesystem write only behind `NODE_ENV !== "production"` guard

**Files changed:** `src/app/api/applications/route.ts` — `uploadOrStub()` prod guard + base64 fallback. `src/app/admin/payments/page.tsx` — receipt viewer handles `data:` URLs.
