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

---

## DevOps Lessons (continued)

### 2026-09-19 — SMTP email failing on Railway: IPv6 ENETUNREACH

**Error:** `connect ENETUNREACH 2607:f8b0:4023:c03::6d:465 - Local (:::0)`

**Root cause:** Railway containers have IPv6 outbound connections disabled. Gmail's `smtp.gmail.com` hostname resolves to both IPv4 and IPv6 addresses. Node.js's DNS resolution picks the IPv6 address first (standard behaviour). The connection to the IPv6 address fails immediately with `ENETUNREACH` because Railway's network doesn't route IPv6 outbound traffic.

**Fix:** Add `family: 4` to the nodemailer transport config. This forces Node.js to only use IPv4 DNS resolution for the SMTP connection, skipping IPv6 addresses entirely.

```ts
nodemailer.createTransport({
  host, port, secure: port === 465,
  auth: { user, pass },
  family: 4,  // ← force IPv4 — Railway has no IPv6 outbound
  ...
});
```

**Prevention rule:** Any Node.js app making outbound TCP connections on Railway (SMTP, external APIs, etc.) must use `family: 4` if the target hostname resolves to IPv6. Alternatively, enable "Outbound IPv6" in Railway service Settings → Networking — but this costs more. The `family: 4` fix is free and always works.

**Secondary fix in same session:** `SMTP_PASS` was stored with spaces (`gagk wamx ixxz znlx`) — Gmail App Passwords work both with and without spaces, but to be safe the transporter now calls `.replace(/\s+/g, "")` on the password before use.

**Related SOP:** DevOps SOP Hard Rule 2 (all external calls have timeout and defined failure behavior), Backend SOP §7 (external service errors logged in full).


---

## Game Feature Lessons (2026-09-26)

### 2026-09-26 — Business rules must live in one constants file, not scattered across API routes

**What happened:**
Initial design temptation was to hardcode `120`, `100`, `10`, `1000` in each API route handler separately. This would have caused drift when the minimum deposit is changed — requiring edits in 3 separate route files.

**What was wrong about it:**
DRY Hard Rule 2 violation: the same numeric business rule defined in multiple places. When one copy is updated and another is missed, behaviour diverges silently.

**Correct approach:**
Created `src/lib/gameConstants.ts` as the single source of truth for all game rules: `GAME.MIN_DEPOSIT`, `GAME.MIN_WAGER`, `GAME.WIN_INTERVAL`, `GAME.WIN_PER_STEP`, `GAME.JACKPOT_SCORE`, etc. All API routes, the game page, and the canvas component import from it. All values are also overridable via environment variables.

**Prevention rule:**
Before hardcoding any numeric business rule (minimum amounts, multipliers, score thresholds) in a route handler, first check: does a constants file already exist for this domain? If yes, add it there. If not, create one and import it everywhere.

**Related SOP section:** DRY (Universal Engineering Principles SOP Hard Rule 2), Backend SOP §2.1 (contract before implementation)

---

### 2026-09-26 — Multi-step writes (balance deduction + session create) must be in a transaction

**What happened:**
First design of `POST /api/game/session` updated wallet balance and created the session in two separate `await db.` calls. A server crash or timeout between the two calls would deduct balance without creating a session — money lost with no record.

**What was wrong about it:**
Backend SOP Hard Rule 6 violation: any multi-step write that must succeed or fail together must be wrapped in a transaction. "Probably won't crash between two lines" is not a consistency strategy.

**Correct approach:**
Wrapped both operations in `db.$transaction(async tx => { ... })`. The DBA SOP §7.1 pattern: keep transactions short, no network calls inside, state the invariant being protected.

**Prevention rule:**
Before writing any two sequential `db.` calls that affect money or state consistency, ask: "If the server dies after line 1 but before line 2, is the database in a coherent state?" If no → transaction required.

**Related SOP section:** Backend SOP Hard Rule 6, DBA SOP §7.1

---

### 2026-09-26 — Game canvas must use named constants, never magic numbers

**What happened:**
`FlappyBird.tsx` initial draft had `0.45`, `-8.5`, `148`, `230` scattered inline across Bird and GameEngine methods. When tuning felt wrong it was impossible to know which number controlled which behaviour.

**What was wrong about it:**
DRY Hard Rule 2 — magic numbers are a form of duplication (the same concept referenced by an anonymous value in multiple places). They also violate readability: `PIPE_GAP = 148` communicates intent; `148` does not.

**Correct approach:**
All physics and layout constants declared at the top of the file as named `const` values: `GRAVITY`, `JUMP_VEL`, `PIPE_W`, `PIPE_GAP`, `PIPE_SPEED`, `PIPE_SPAWN`, etc. Business rules (`WIN_INTERVAL`, `WIN_PER_STEP`) imported from `gameConstants.ts`.

**Prevention rule:**
Any number appearing in a canvas / game loop that isn't `0`, `1`, `2`, or a trivial fraction must be a named constant at the top of the file, with the name explaining its purpose.

**Related SOP section:** Universal Engineering Principles SOP Hard Rule 2, UI_MASTER_SKILL (readability)

---

### 2026-09-26 — Deposit screenshot stored as base64 data URL matches existing receipt pattern

**What happened:**
Considered writing a new file-upload strategy for game deposit screenshots. Almost introduced a second upload mechanism (direct disk write) inconsistent with the existing `receipts/` Supabase → base64 fallback pattern.

**What was wrong about it:**
Grounding SOP §Hard Rule 3: read and match the existing pattern before building a new one. Universal Engineering Principles SOP Hard Rule 1: check if a solution already exists before building a new one.

**Correct approach:**
Game deposit screenshots follow the identical pattern to payment receipts: `Buffer.from(arrayBuf).toString("base64")` → `data:${mime};base64,${b64}` stored in `screenshotUrl LONGTEXT`. This means the admin screenshot modal reuses the exact same image render logic as the admin payments receipt modal.

**Prevention rule:**
Before writing any new file handling logic, search the codebase for "base64", "receiptUrl", "screenshotUrl". If the pattern already exists, extend it — don't create a parallel mechanism.

**Related SOP section:** Universal Engineering Principles SOP Hard Rule 1 (reuse check), Grounding SOP §6.1 (re-read before editing)

---

### 2026-09-26 — PATCH /api/game/session must be idempotent (Backend SOP §4.3)

**What happened:**
Initial design of the session-end endpoint would re-calculate winnings and credit the balance on every PATCH call. A client retry after a network timeout would credit the user twice.

**What was wrong about it:**
Backend SOP §4.3 violation: mutations that are not naturally idempotent must be explicitly guarded against retry. Double-crediting a wallet is a real money bug.

**Correct approach:**
Added an `if (session.completed) { return cached result; }` guard at the start of the PATCH handler. The first call sets `completed=true` and credits balance atomically. All retries with the same `sessionId` return the cached `winAmount` without re-running the transaction.

**Prevention rule:**
Any PATCH or POST that modifies a balance, sends a message, or has side effects: before writing the update logic, add a guard that checks whether the operation was already completed (idempotency key or status flag). Never rely on the caller not retrying.

**Related SOP section:** Backend SOP §4.3, Backend SOP Hard Rule 8


---

## Backend / Frontend Lessons (2026-09-26 — DOCTYPE JSON parse error fix)

### 2026-09-26 — "Unexpected token '<', <!DOCTYPE..." means fetch() got HTML, not JSON

**What happened:**
Multiple pages crashed with `SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON`. This made the error look like a server bug, but it was a client-side defensive programming failure.

**Root causes found (three independent bugs):**

**Bug A — `apiAuth.ts`: thrown `Response` had no `Content-Type` header.**
`requireAuth` threw `new Response(JSON.stringify({...}), { status: 401 })`. Without a `Content-Type: application/json` header, the browser treats the body as `text/plain`. Any client-side code doing a content-type guard before calling `.json()` would incorrectly skip parsing.
Fix: Added a shared `JSON_HEADERS` constant and passed `{ headers: JSON_HEADERS }` to every thrown Response.

**Bug B — `ledger/page.tsx` and `applicants/page.tsx`: double-consume of `res.body`.**
Pattern was:
```ts
if (!res.ok) throw new Error((await res.json()).message ?? "...");  // consumes body
const data = await res.json();  // BUG: stream already read — throws on success path too
```
If the server returned HTML (e.g., a Railway cold-start 503), the first `.json()` threw `SyntaxError: Unexpected token '<'`, which masked the real HTTP error. Fix: replaced with `safeFetch` which parses exactly once.

**Bug C — `game/page.tsx`: `await res.json()` called BEFORE `res.ok` check.**
Pattern was:
```ts
const data = await res.json();   // throws SyntaxError if body is HTML
if (!res.ok) throw new Error(data.message);  // never reached
```
Fix: replaced all 4 instances with `safeFetch`.

**Correct pattern (safeFetch in lib/api.ts):**
```ts
// 1. Check content-type BEFORE calling .json()
// 2. Parse body exactly ONCE
// 3. If !ok, throw ApiError with server message or clean HTTP status fallback
// 4. Network errors (offline, CORS, DNS) wrapped in ApiError(0, ...)
const data = await safeFetch<MyType>("/api/...", { credentials: "include", headers: authHeaders() });
```

**Prevention rule:**
Never write `await res.json()` directly in a component or page. Always use `safeFetch` from `lib/api.ts`. If you see the pattern `const data = await res.json(); if (!res.ok)` anywhere — that is a bug: `.json()` will throw before the guard runs if the server returns HTML.

**Secondary prevention — server side:**
Every `throw new Response(...)` in an API route MUST include `Content-Type: application/json`. Use the `JSON_HEADERS` constant from `apiAuth.ts` as the pattern.

**Related SOP sections:**
- Backend SOP Hard Rule 2 (never swallow errors silently — surface them cleanly)
- Universal Engineering Principles SOP Hard Rule 2 (DRY — one fetch wrapper used everywhere)
- Grounding SOP §Hard Rule 3 (read code before claiming it works)


---

## Branding & Rebrand Lessons (2026-09-26 — RozeDesk → FlappyWin rebrand)

### 2026-09-26 — A full platform rebrand requires hitting 11 distinct surfaces — missing even one leaves stale branding

**What happened:**
Rebranding from RozeDesk (job portal) to FlappyWin (game platform) initially felt like "just change the name and logo." The actual surface count was 11 distinct files, each with independent branding strings, localStorage keys, copy, nav items, and metadata.

**Complete surface checklist (for any future rebrand):**

| # | File | What to change |
|---|------|----------------|
| 1 | `app/layout.tsx` | `metadata` title/description/keywords/OG tags + inline theme script `localStorage` key |
| 2 | `components/Logo.tsx` | `alt`, `aria-label`, wordmark text |
| 3 | `components/NavBar.tsx` | `NAV_LINKS` array labels/hrefs + CTA button text |
| 4 | `components/Footer.tsx` | Brand column heading, description paragraph, copyright line, tagline |
| 5 | `components/AuthLayout.tsx` | Left panel headline, sub-copy, `DEFAULT_FEATURES`, `DEFAULT_QUOTE`, `DEFAULT_AUTHOR`, `DEFAULT_ROLE`, mobile logo wordmark |
| 6 | `app/signin/page.tsx` + `signup/page.tsx` | `AuthLayout` quote/features props, `localStorage` key (`rozedesk-remember` → `flappywin-remember`), success state copy, trust line |
| 7 | `components/dashboard/Sidebar.tsx` | `SEEKER_NAV` items (labels + hrefs), section label text |
| 8 | `components/dashboard/DashboardHeader.tsx` | `localStorage.getItem` key (`rozedesk-token` → `flappywin-token`) × 2, role label `"Job Seeker"` → `"Player"`, profile dropdown links |
| 9 | `app/dashboard/page.tsx` | All stat labels, section headings, empty state copy, API calls, `localStorage` key |
| 10 | `app/page.tsx` (landing) | Every DATA array: `STATS`, `STEPS`, `FEATURES`, `TESTIMONIALS`, `FAQS`, hero copy, section headings, CTAs |
| 11 | `logs/LESSONS.md` | Append this entry |

**localStorage key consistency rule:**
When a brand name is embedded in a localStorage key (e.g. `rozedesk-token`, `rozedesk-theme`, `rozedesk-remember`), you must rename it in EVERY location it is read or written. Missing one location causes auth to silently fail on that page — the user is logged in globally but the specific page reads an empty string and behaves as if unauthenticated.

Locations that read/write session token in this project:
- `components/dashboard/DashboardHeader.tsx` (×2 — notifications + mark-all-read)
- `app/dashboard/page.tsx` (token() helper)
- `app/admin/page.tsx` (authHeaders() helper)
- `app/admin/applicants/page.tsx`
- `app/admin/ledger/page.tsx`
- `app/admin/payments/page.tsx`
- `app/admin/game-deposits/page.tsx`
- `app/dashboard/game/page.tsx`
- `lib/auth.ts` (saveSession, getStoredUser, signOut)

**Prevention rule:**
Before a rebrand, grep for the old brand name string across the entire codebase:
`Select-String -Path rozedesk-app\src -Recurse -Pattern "rozedesk" | Select-String -NotMatch "node_modules"`
Treat every match as a required change. Do not stop at the UI layer — localStorage keys, cookie names, and API auth headers are just as important as visible text.

**Related SOP sections:**
- Grounding SOP §Hard Rule 3 (read code before claiming it's done)
- Universal Engineering Principles SOP Hard Rule 2 (DRY — brand name defined once, referenced everywhere, not scattered)
- Process Log SOP §4 (log every surface touched, not just the obvious ones)


---

## Database & Prisma Lessons (2026-09-26 — game tables migration + Prisma adapter bugs)

### 2026-09-26 — `db.$transaction([])` array form crashes with `@prisma/adapter-mariadb` — use callback form only

**What happened:**
`db.gameWallet` appeared undefined in the API logs (`TypeError: Cannot read properties of undefined (reading 'upsert')`). The Prisma client had been regenerated and `gameWallet` was confirmed present in `index.d.ts`. The real crash was happening in a *different* route (`admin/game-deposits`) where `db.$transaction([...])` — the array/batch form — was used.

**Root cause:**
The MariaDB driver adapter (`@prisma/adapter-mariadb`) does **not** support the `$transaction([...])` array form. This form requires Prisma's internal query engine to orchestrate the operations, which is unavailable when using a driver adapter. The adapter only supports the **interactive transaction** (callback form): `db.$transaction(async tx => { ... })`.

When the array form is called, the adapter throws an internal error that surfaces as a misleading `undefined` property error — not as a clear "unsupported operation" message.

**Affected files fixed:**
- `src/app/api/admin/game-deposits/route.ts` — APPROVE action used `db.$transaction([update, update])`
- `src/app/api/admin/payments/[id]/reset/route.ts` — reset used `db.$transaction([delete, update])`

**Correct pattern:**
```typescript
// WRONG — array form, not supported by driver adapters
await db.$transaction([
  db.model.update({ where: {...}, data: {...} }),
  db.model.update({ where: {...}, data: {...} }),
]);

// CORRECT — callback form, works with all adapters
await db.$transaction(async (tx) => {
  await tx.model.update({ where: {...}, data: {...} });
  await tx.model.update({ where: {...}, data: {...} });
});
```

**Prevention rule:**
Any time you write `db.$transaction(`, the next character must be `async` (callback form). If you find yourself typing `db.$transaction([`, stop — that is the array form and it will crash with driver adapters. Do a global search for `$transaction(\[` before any deployment to catch all occurrences.

**Related SOP sections:** Backend SOP Hard Rule 6 (multi-write atomicity), DBA SOP §7.1 (transaction safety)

---

### 2026-09-26 — After adding models to schema.prisma, always run `prisma generate` before starting the dev server

**What happened:**
Three new models (`GameWallet`, `GameDeposit`, `GameSession`) were added to `schema.prisma` but `prisma generate` was not run. The dev server started with a stale generated client that had no knowledge of these models. Any call to `db.gameWallet.*` crashed immediately.

**Prevention rule:**
After any change to `schema.prisma` — adding a model, renaming a field, changing a relation — run:
```powershell
npx prisma generate --schema="d:\RozeDesk\prisma\schema.prisma"
```
Then restart the dev server so Node.js picks up the new generated module (the `globalThis._prisma` singleton caches the old instance until restart).

Also run the SQL migration to create the actual DB tables:
```powershell
Get-Content "d:\RozeDesk\prisma\migrations\game-tables.sql" | & "C:\xampp\mysql\bin\mysql.exe" -u root --host=127.0.0.1 --port=3306 rozedesk
```

Note: `mysql` is not on PATH on this machine. Always use the full XAMPP path `C:\xampp\mysql\bin\mysql.exe`.
Note: PowerShell does not support `<` stdin redirection. Use `Get-Content file | & "mysql.exe" ...` instead.

**Related SOP sections:** DBA SOP §5 (migration execution checklist), DevOps SOP §3.1 (build pipeline order)

---

### 2026-09-26 — Nav items with duplicate `href` must use `label` as the React `key`, not `href`

**What happened:**
After the rebrand, `SEEKER_NAV` had three items ("Play Game", "My Wallet", "Game History") all pointing to `ROUTES.game` (`/dashboard/game`). React uses the `key` prop to track component identity. Since all three used `key={item.href}`, React saw three siblings with key `/dashboard/game` and warned: *"Encountered two children with the same key"*.

**Root cause:**
Keys must be unique among siblings in a list. When multiple nav items point to the same route (e.g. different sections of the same page accessed via hash or tabs), the `href` is no longer unique.

**Fix:**
Use `key={item.label}` instead of `key={item.href}`. Labels are always unique within a nav — two items with the same label would be a UX problem regardless.

**General rule:**
In any `.map()` rendering a list, use the most unique stable identifier as the key. For nav items: prefer `label` over `href` since labels must be unique per nav, but hrefs don't have to be.

**Related SOP sections:** Frontend SOP §5 (list rendering), Universal Engineering Principles SOP Hard Rule 2 (DRY keys)


---

## Admin Dashboard Rebrand Lesson (2026-09-26)

### 2026-09-26 — Rebranding a platform requires updating BOTH the user dashboard AND the admin dashboard

**What happened:**
The FlappyWin rebrand replaced the user-facing dashboard (`/dashboard/page.tsx`) with game-platform stats (balance, sessions, scores). However `/admin/page.tsx` was left showing job-portal KPIs: "Active Listings", "Applicants", "Revenue" from the payment receipts table. The admin saw a broken, contextually wrong dashboard that still referenced job data.

**What was wrong:**
The admin page is as much a product surface as the user dashboard. Leaving it with old-domain data creates:
1. Functional confusion — querying `db.job`, `db.application` tables that are now irrelevant to the platform's purpose.
2. Security surface — `authHeaders()` still used `rozedesk-token` instead of `flappywin-token`, so the token lookup silently returned empty string on any machine where the new key was used.
3. UX mismatch — admin has no visibility into what actually matters: pending deposits that need approval, player sessions, payout amounts.

**What was built:**
- New `/api/admin/game-analytics` endpoint: all game KPIs in a single `Promise.all` (totalPlayers, pendingDeposits, totalSessions, totalPayout, totalWagered, avgScore, todaySessions, 7-day charts, recent deposits queue, recent sessions list).
- New `/admin/page.tsx`: 7 KPI cards, session + payout dual charts, inline approve/reject deposit table (with reject modal), recent sessions table. All via `safeFetch` with `flappywin-token`.

**Prevention rule:**
During a platform rebrand, create a checklist that explicitly covers **both** the user-facing dashboard AND the admin dashboard. They are separate surfaces with separate API dependencies. A rebrand checklist must include:
- [ ] User dashboard page + API calls
- [ ] Admin dashboard page + API calls
- [ ] Admin sub-pages (payments, analytics, applicants) — check if they query now-irrelevant models

Also check `authHeaders()` in every admin page after any localStorage key rename. One missed page = silent auth failure.

**Related SOP sections:** Grounding SOP §Hard Rule 3 (read ALL affected surfaces before declaring done), Process Log SOP §4 (log every surface in the rebrand checklist)


---

## Game Platform UX & Config Lessons (2026-09-26)

### 2026-09-26 — Never show a deposit form without showing the user WHERE to send the money

**What happened:**
The deposit modal let users pick JazzCash or Easypaisa and upload a screenshot, but showed no account number or account name. Users had no idea where to actually send the money — they had to contact support or guess.

**Root cause:**
The `POST /api/admin/payment-settings` endpoint and `payment_settings` table already existed and stored the account phone + name for each method. The deposit modal simply never fetched or displayed this data.

**The fix:**
`DepositModal` now calls `GET /api/payment-settings` (public, no auth) on mount. When the user selects a method, the matching account card shows:
- Phone number (large, tapable, copy-to-clipboard on click)
- Account holder name
- Optional address
- Instruction: "Send exactly Rs. X then upload the screenshot"
- Falls back to a warning banner if no account is configured yet

**Prevention rule:**
Any form that asks a user to make a payment MUST show the destination account details for the selected method, derived from the live database — never hardcoded, never hidden. Always pair the method selector with the account info display, switched reactively on method change.

**Related SOP:** Frontend SOP §Hard Rule 5 (loading/empty/error/success all handled — "no account configured" is the empty state)

---

### 2026-09-26 — Business limits (min deposit, min wager) must be admin-controllable from the DB, not baked into env vars

**What happened:**
`GAME.MIN_DEPOSIT` and `GAME.MIN_WAGER` were read only from `process.env.GAME_MIN_DEPOSIT` at server startup. Changing the minimum deposit required editing `.env.local`, pushing a new deployment, and restarting the server — a full redeploy for a one-number change.

**Root cause:**
The constants file (`gameConstants.ts`) was the correct pattern for fallback defaults, but was used as the *only* source of truth. There was no admin UI or DB row to override it at runtime.

**The fix:**
- `/api/admin/settings` PUT now accepts `gameMinDeposit` and `gameMinWager`, stores them in `platform_settings` table (key-value store that already exists).
- `/api/game/wallet` GET now calls `getIntSetting("gameMinDeposit", GAME.MIN_DEPOSIT)` before returning — reads from DB first, falls back to env constant if not set. Non-fatal: wrapped in try/catch, never throws.
- Admin Settings page has a new "Game Settings" section with the two number inputs and a dedicated Save button.
- Changes take effect on the next page load — no redeploy needed.

**Prevention rule:**
Any numeric business rule that a non-developer operator might need to adjust (prices, limits, multipliers, timeouts) must be stored in a DB config table and exposed via an admin UI. Env vars are for infrastructure secrets (DB passwords, API keys, JWT secrets) — not for product configuration. The env var becomes the deploy-time default; the DB row is the runtime override.

**Related SOP sections:**
- Backend SOP Hard Rule 1 (server validates — and the server must know the current limit from DB, not stale env)
- DevOps SOP §Hard Rule 1 (no hardcoded secrets or config — all from env or DB)
- Universal Engineering Principles SOP Hard Rule 2 (DRY — one source of truth for each configurable value)

---

### 2026-09-26 — `getIntSetting()` is the correct pattern for reading a single platform_settings row safely

**Pattern to reuse:**

```typescript
// lib/db helpers — add once, use everywhere (DRY)
async function getIntSetting(key: string, fallback: number): Promise<number> {
  try {
    const row = await db.platformSetting.findUnique({ where: { key } });
    const v   = row ? parseInt(row.value, 10) : NaN;
    return isNaN(v) || v < 1 ? fallback : v;
  } catch {
    return fallback; // table doesn't exist yet (fresh deploy) — never crash
  }
}
```

Rules:
1. Always provide a `fallback` — the table may not exist on a fresh deploy.
2. Validate the parsed int (`isNaN` + bounds check) before using it.
3. Catch DB errors silently — a missing config row should never crash an API route.
4. Read multiple settings in `Promise.all` alongside other queries, not sequentially.

**Related SOP:** Backend SOP Hard Rule 2 (no silent crash), DBA SOP §3.2 (graceful degradation)


---

## Sidebar & Navigation Lessons (2026-09-26 — big refactor)

### 2026-09-26 — Nav items that share the same href ALL become active simultaneously

**What happened:**
Three seeker nav items ("Play Game", "My Wallet", "Game History") all had `href: ROUTES.game` (`/dashboard/game`). The `isActive()` function does an exact match against `pathname === href`. On `/dashboard/game`, all three matched → all three highlighted blue at once.

**Root cause:**
The original intent was to have one game page with tab-like sections. But in a left sidebar, each nav item must have a distinct route — the sidebar's active state is path-based, not tab-based.

**Fix:**
Give each nav item its own distinct route:
- Play Game → `/dashboard/game`
- My Wallet → `/dashboard/wallet`
- Withdraw   → `/dashboard/withdraw`
- History    → `/dashboard/history`

Each route got its own `page.tsx` and was added to `EXACT_ONLY` in the sidebar.

**Prevention rule:**
Before adding any nav item to SEEKER_NAV or ADMIN_NAV, assert: "does this href already appear in any other nav item in the same nav array?" If yes — it must have its own distinct route. Use a Set check if writing a linter for this.

**Related SOP sections:** Frontend SOP §5 (router patterns), Universal Engineering Principles SOP Hard Rule 2 (DRY with single responsibility)

---

### 2026-09-26 — Gaming palette means ALWAYS dark — merge light/dark overrides into a single noop block

**What happened:**
`globals.css` had three separate dark-mode override blocks: `html[data-theme="dark"]`, `html[data-theme="light"]`, and `@media (prefers-color-scheme: dark)`. After switching to a gaming palette where all surfaces are permanently dark, these overrides added noise and could theoretically override the gaming tokens if a user's OS was in light mode with no theme preference set.

**Fix:**
All three blocks were replaced with a single noop block that forces every theme variant to the same dark gaming values:

```css
html[data-theme="dark"], html[data-theme="light"],
:root:not([data-theme="light"]) {
  --bg-base:    #0a0a0f;
  --bg-surface: #13131a;
  /* ... */
}
```

This ensures the gaming palette is invariant regardless of OS preference or ThemeToggle state.

**Prevention rule:**
When a platform is always-dark (games, IDEs, terminals), replace theme toggle CSS with a single invariant block. Remove the `ThemeToggle` component from the UI as well (or repurpose it) since it no longer has an effect users can see.

**Related SOP sections:** UI/UX SOP §Hard Rule 3 (tokens, not hardcoded values), Frontend SOP §0 (dark mode implementation)

---

### 2026-09-26 — Admin sidebar must be stripped of job-portal items when the product pivots

**What happened:**
After rebrand to FlappyWin, the admin sidebar still showed 10 items including "Job Listings", "Post a Job", "Applicants", "Analytics", "Ledger", "Payments". These were dead pages for the game platform — they queried irrelevant DB tables. The screenshot showed them prominently in the nav.

**Fix:**
Admin nav reduced from 10 to 5 items: Overview, Game Deposits, Withdrawals, Payment Settings, Settings.
Old routes (`adminJobs`, `adminPostJob`, etc.) kept in `routes.ts` for any legacy API links, but NOT added to ADMIN_NAV.

**Prevention rule:**
The sidebar nav is the contract between the product and the admin. Every item in ADMIN_NAV must correspond to a task the admin actually performs on this platform. After any platform pivot, do a nav audit: for each nav item, ask "does this admin need this for their day-to-day on the NEW platform?" If no → remove it.

**Related SOP sections:** Process Log SOP §4 (log every surface in a rebrand), UI/UX SOP §Hard Rule 1 (only show controls that are relevant and functional)

---

### 2026-09-26 — Withdrawal form must deduct balance on approval, NOT on submission

**What happened:**
Initial design temptation was to deduct the balance when the user submits the withdrawal request (to "reserve" funds). This would cause a negative experience: user submits, balance drops, then admin rejects → user has to wait for a manual refund.

**Correct approach:**
Balance is only deducted when the admin **approves** the withdrawal, atomically in a DB transaction:
```typescript
await db.$transaction(async (tx) => {
  // verify balance >= amount (re-check inside transaction — no TOCTOU race)
  const wallet = await tx.gameWallet.findUnique({ where: { id } });
  if (wallet.balance < amount) throw insufficientError;
  await tx.gameWithdrawal.update({ data: { status: "APPROVED" } });
  await tx.gameWallet.update({ data: { balance: { decrement: amount } } });
});
```

On rejection, balance is untouched — the player never loses money for a rejected request.

**Prevention rule:**
For any financial mutation triggered by an external approval workflow:
- Submit: create the request record, notify approver. Do NOT move money.
- Approve: move money + update status atomically in a transaction.
- Reject: update status only. Do NOT touch balance.

**Related SOP sections:** Backend SOP Hard Rule 6 (atomic multi-writes), DBA SOP §7.1 (transaction safety)


---

## CSS Syntax Lessons (2026-09-26 — globals.css PostCSS build error)

### 2026-09-26 — Stray closing brace in globals.css caused PostCSS CssSyntaxError: Unexpected }

**What happened:**
After the gaming palette refactor, the Next.js build crashed with:
`CssSyntaxError: D:\RozeDesk\rozedesk-app\src\app\globals.css:172:1: Unexpected }`

**Root cause — two problems in the same edit:**

1. **Stray `}` at line 172.** The old `html[data-theme="light"]` block had a closing `}`. When the new "noop override" block was written to replace it, the new block's own closing `}` was placed correctly, but the *old* light-mode block's closing brace was left behind — producing `}}` (double close, one of which was unmatched).

2. **Dead `@media (prefers-color-scheme: dark)` block left behind.** This block referenced `var(--gray-950)`, `var(--gray-900)` etc. — tokens that no longer exist after the gray scale was replaced with the new dark gaming palette. PostCSS would have failed on unresolved vars even if the stray brace was fixed.

**Fix:**
- Removed the stray `}` 
- Removed the entire leftover `@media (prefers-color-scheme: dark)` block (redundant for an always-dark gaming palette)
- Left one clean selector group: `html[data-theme="dark"], html[data-theme="light"], :root:not([data-theme="light"])` with one closing `}`

**Prevention rule:**
When doing a large search-and-replace in a CSS file, always verify brace balance after the edit. A quick check:
```powershell
(Select-String -Path globals.css -Pattern "\{").Count
(Select-String -Path globals.css -Pattern "\}").Count
```
Both counts must match. If they differ, there is an unmatched brace.

Also: when removing a CSS block, remove the ENTIRE block including its closing `}`. Never leave orphaned braces behind.

**Related SOP sections:** Universal Engineering Principles SOP Hard Rule 3 (verify before shipping), Grounding SOP §Hard Rule 1 (run the build, don't assume it works)


---

## Mobile UX & Color Contrast Lessons (2026-09-26)

### 2026-09-26 — Neon-on-neon = unreadable. High contrast on dark bg requires blue/orange not green/purple

**What happened:**
The first gaming palette used neon green (#00ff88) as primary and neon purple (#bf00ff) as accent on a very dark bg (#0a0a0f). The result: the "Register Free & Play" CTA button was green text on a green gradient background — completely unreadable. The profile page had purple icons against dark purple shadows — mixed-colour soup.

**Root cause:**
Picking "gaming" colours (green, purple) without checking contrast ratios. Both `--color-success` and `--brand-*` were green → any success state blended with CTAs. The `.gradient-text` class used green→purple which is the same hue as buttons making text disappear.

**Correct approach:**
Electric blue (#3b82f6) primary + hot orange (#f97316) accent on deep-space dark (#050510). These are **complementary colours** on opposite sides of the wheel — they create maximum visual separation. White text on either is always ≥4.5:1. Orange CTA on dark bg stands out clearly.

**Prevention rule:**
Before finalising any colour palette:
1. Check every `--brand-*` CTA against `--bg-base` — ratio must be ≥4.5:1 (AA).
2. Check `--color-success`, `--color-warning`, `--color-error` — none should be the same hue as `--brand-*`.
3. Verify button text (`text-white` or `--text-inverse`) on `--brand-500` background.

---

### 2026-09-26 — Mobile web app needs a bottom nav bar, not a hamburger sidebar

**What happened:**
The seeker dashboard on mobile showed only a hamburger icon in the top-left. Users had to tap the hamburger, wait for the slide-in drawer, then find their destination — 3 taps minimum. This is a desktop-nav pattern on a mobile screen.

**Correct approach:**
For seeker (5 nav items — fits a bottom bar), replaced the mobile sidebar drawer with a fixed bottom nav bar (`position:fixed; bottom:0; inset-x:0`). Each item shows icon + label. Active state shown with a top accent bar and bolder stroke. Admin keeps the hamburger/drawer since it has fewer mobile users.

**Additional fix:** Main content got `padding-bottom: calc(var(--bottom-nav-height) + 16px)` on mobile so the last content item is never hidden behind the bar.

**Prevention rule:**
Any dashboard with ≤6 nav items targeting mobile users → use bottom nav, not sidebar drawer. The `--bottom-nav-height` CSS variable (64px) is the single source of truth for all bottom nav spacing.

---

### 2026-09-26 — Profile avatar in the header should show wallet balance for a game platform

**What happened:**
The header showed the user's initials ("P") in an avatar circle — a job-portal pattern. For a game platform where the user's most important number is their balance, showing an obscure initial instead of "Rs. 9160" is a missed UX opportunity.

**Correct approach:**
Added `useWalletBalance(isSeeker)` hook that fetches `/api/game/wallet` on mount and caches the balance. The header now shows a pill chip: wallet icon + `Rs. 9160`. When balance is loading (null), it falls back to the avatar. Admin header keeps the avatar since admins don't have game wallets.

**Prevention rule:**
The header's right-side chip should always show the user's most important real-time value. For job portals it's application count. For wallets/games it's balance. For dashboards it's notifications. Match the chip to the platform's core metric.


---

## Mobile Layout Lessons (2026-09-26 — sidebar pushing content off-screen)

### 2026-09-26 — `hidden lg:flex` sidebar div still occupies 0px in flex layout and causes layout shift on mobile

**What happened:**
The dashboard layout was `<div className="flex h-screen">` with `<Sidebar>` as the first flex child. On desktop, the sidebar was `hidden lg:flex`. On mobile the `hidden` class hid the sidebar visually, but the `<div className="hidden lg:flex ...">` wrapper was **still a flex item** taking 0px — however the `<aside className="w-64">` inside it was still rendered in the DOM. In some Turbopack/CSS evaluation orders, the `w-64` on the inner aside leaked out and caused the flex container to give it space, pushing the main content 256px to the right and off the visible screen.

**The screenshot showed:**
- Bottom nav rendered correctly (so the Sidebar's conditional rendering worked)
- But the page content was shifted ~256px to the right
- All text was clipped at the right edge
- The layout appeared to have a large black void on the left (the 256px sidebar space)

**Root cause:**
`hidden` in Tailwind sets `display: none` which removes the element from layout. BUT the element inside (the `aside`) was still rendered by React — and in certain CSS specificity or Turbopack evaluation orders, the `display: none` on the wrapper did not cascade correctly to prevent the inner `aside` from affecting the flex container's sizing algorithm.

**Fix:**
The `Sidebar` component now handles its own mobile rendering entirely:
- On desktop (`lg+`): renders a `<div className="hidden lg:flex ...">` with the sidebar content (correctly 0px on mobile).
- On mobile for admin: renders a `fixed` slide-in drawer (not in the flex row at all).
- On mobile for seeker: renders only the `<nav>` bottom bar (fixed overlay, not in the flex row).

The **dashboard layout** no longer depends on the sidebar being hidden — there is literally no sidebar in the flex row on mobile. The `<Sidebar>` component's mobile output is always `position: fixed`, so it never affects the flex layout of `<div className="flex">`.

**Prevention rule:**
Never rely on `hidden` (display:none) on a flex child to "remove" it from layout in complex component trees. If an element must not be in the flex row on mobile, use a conditional render (`{isDesktop && <Sidebar />}`) or structure the component so its mobile output is always `position: fixed`/`absolute` — outside the normal flow.

**Related SOP sections:**
- Frontend SOP §5 (responsive layout patterns)
- Universal Engineering Principles SOP Hard Rule 3 (verify on device, not just desktop)


---

## Game Config & Admin Control Lessons (2026-09-26)

### 2026-09-26 — All game physics must be admin-controllable at runtime — never hardcoded constants

**What happened:**
The original FlappyBird.tsx had `const GRAVITY = 0.45`, `const PIPE_SPEED = 2.4`, `const PIPE_GAP = 148` etc. as hardcoded module-level constants. Changing any game feel required a code edit and redeploy. The admin had no way to adjust game difficulty, earning rate, or speed without developer involvement.

**Fix:**
Created `GET /api/game/config` endpoint that returns a `GameConfig` object loaded from `platform_settings` DB (with env var fallbacks). FlappyBird loads this config on mount before starting the engine. The `GameEngine` receives the config object and uses `cfg.gravity`, `cfg.baseSpeed`, `cfg.pipeGap` etc. instead of module constants.

Admin can now change any game parameter in real-time via `/admin/game-settings` without touching code.

**Prevention rule:**
Any numeric value that affects game balance, player experience, or earnings is a business rule — not a code constant. Before writing `const GRAVITY = 0.45`, ask: "Does a non-developer need to change this?" If yes → DB-backed config via admin UI. Env vars are the deploy-time fallback; DB row is the runtime override.

---

### 2026-09-26 — biasMode must be resolved per-user, not just globally

**What happened:**
Initial design had a single global `biasMode` setting ("none" / "win" / "loss"). The requirement was that **blocked players should always lose** regardless of the global setting. If the admin sets global mode to "win" and a blocked player logs in, they would incorrectly get win mode.

**Fix:**
In `GET /api/game/config`, the route loads `user.blocked` from DB. If `user.blocked === true`, it overrides biasMode to `"loss"` regardless of the global platform setting. The FlappyBird canvas receives the already-resolved `biasMode` and applies it.

The canvas itself doesn't know why biasMode is "loss" — it just follows the instruction. This keeps the logic server-side (more secure) and the canvas clean.

**Prevention rule:**
Any per-user override of a global setting must be resolved on the server, not the client. Never send the global setting to the client and then apply per-user overrides in the browser — the user can inspect and manipulate client-side state. Always resolve the final effective value server-side and send only the resolved value.

---

### 2026-09-26 — Random speed in a game loop requires the randomisation to happen at spawn time, not per-frame

**What happened:**
Initial approach was to randomise `PIPE_SPEED` on every frame tick. This caused extremely jittery pipes — the speed changed 60 times per second, making the game unplayable. The visual effect was pipes vibrating in place.

**Correct approach:**
Each `Pipe` object stores its own `speed` value, assigned in the constructor at spawn time. The random roll happens once when the pipe is created (`new Pipe(x, cfg, score)`). The speed is then constant for that pipe's lifetime, creating natural variation between pipes rather than jitter within a single pipe.

**Prevention rule:**
Randomise game object properties at instantiation (constructor), not during the update loop. Per-frame randomisation creates chaos; per-spawn randomisation creates variety. This is a fundamental game design principle: spawn-time parameters are fixed for an object's lifetime.

**Related SOP sections:** Universal Engineering Principles SOP Hard Rule 2 (DRY config), Backend SOP Hard Rule 1 (server-side resolution of per-user state)


---

## Prisma + Type Safety Lessons (2026-09-26 — blocked field 500 error)

### 2026-09-26 — Adding a DB column requires BOTH `ALTER TABLE` AND `prisma generate` in the right order; stale client is the silent killer

**What happened:**
Added `blocked TINYINT(1)` to the `users` table via `ALTER TABLE`. Then ran `prisma generate`. However the generate had already been run in the previous step (for the GameWithdrawal model), so the generated client at that point did NOT include `blocked`. The `ALTER TABLE` ran after. The result: MySQL has the column, but the Prisma client at runtime doesn't know about it → `Unknown field 'blocked' for select statement on model 'User'` → 500 on every `/api/admin/players` call.

**The sequence that caused it:**
```
1. prisma generate  (GameWithdrawal added — blocked NOT yet in schema)
2. ALTER TABLE users ADD COLUMN blocked  (DB now has it)
3. schema.prisma updated with blocked field  (but generate not re-run)
4. Server starts → old generated client → 500
```

**Fix:**
Run `prisma generate` AFTER every schema.prisma change AND after every ALTER TABLE that adds new columns. Clear `.next` cache to force the module to reload. The order must always be:
```
1. Edit schema.prisma
2. ALTER TABLE (or prisma migrate)
3. prisma generate  ← LAST, always after both schema and DB are updated
4. Restart dev server (clear .next cache)
```

**Prevention rule:**
Any time you touch `schema.prisma`, the last command you run before testing is always `prisma generate`. Make it a checklist item. If you run generate before the DB migration, you MUST run it again after.

---

### 2026-09-26 — platform_settings stores everything as VARCHAR — always parse types server-side before sending to the client

**What happened:**
`GET /api/admin/game-settings` returned all values as strings because `loadSettings()` had return type `Record<string, string>`. The `randomSpeed` field was stored as `"false"` (string) in `platform_settings`. When the frontend received it and passed it to `checked={cfg.randomSpeed}`, React received the string `"false"` instead of the boolean `false`. In HTML, any non-empty string on a boolean attribute is truthy — so `checked="false"` means "checked" to the browser. The console warned: `"Received the string 'false' for the boolean attribute 'checked'."

**Fix:**
The GET endpoint now parses every value to its correct type before `NextResponse.json()`:
- Numbers: `parseInt()` / `parseFloat()`  
- Booleans: `=== "true"` comparison
- Enums: cast with `as` after validating

**Prevention rule:**
Any API that reads from a key-value string store (`platform_settings`, `.env`, Redis HSET) MUST parse types explicitly before returning JSON. Never return raw string values for fields that the client expects to be numbers, booleans, or enums. The type contract lives in the API response — not in the caller.


---

## Turbopack Cache Corruption Lesson (2026-09-26)

### 2026-09-26 — Turbopack FATAL panic: "Unable to open static sorted file" — always caused by a corrupt .next cache, never by application code

**What happened:**
```
FATAL: An unexpected Turbopack error occurred.
failed to open file `.next\dev\cache\turbopack\v16.3.5-ca2c75eb\00000219.sst`: 
The system cannot find the file specified.
```

**Root cause:**
Turbopack uses a SQLite-based on-disk cache (`.next/dev/cache/turbopack/`). The cache index (`.meta` files) references SSTable files (`.sst`). When `.next` is deleted while Turbopack is running (or after an abrupt process kill), the index survives in memory and writes a new `.meta` pointing to `.sst` files that no longer exist. On the next request, Turbopack tries to open those missing `.sst` files → panic.

**This is NOT a code error.** No amount of code changes fixes it.

**Fix sequence (always the same):**
1. Stop the dev server (`Ctrl+C` or kill the node process)
2. `Remove-Item -Recurse -Force ".next"` — wipe the entire cache directory
3. Restart: `npm run dev`

**Prevention:**
- Never delete `.next` while the dev server is running
- If the dev server crashes unexpectedly, always wipe `.next` before restarting
- Add `.next` to a `.gitignore` check so it's never accidentally committed

**Related SOP sections:** DevOps SOP §3.1 (build pipeline hygiene), Grounding SOP §Hard Rule 1 (distinguish infrastructure errors from code errors before making code changes)


---

## Game Earnings & History Lessons (2026-09-26)

### 2026-09-26 — calculateWinnings() must read live DB config, not static env constants

**What happened:**
Admin set `winInterval=1` and `winPerStep=100` in the game settings panel. But the session PATCH route was calling `calculateWinnings(wager, score)` using `GAME.WIN_INTERVAL` (100) and `GAME.WIN_PER_STEP` (10) — the env-backed static constants. The admin change had zero effect on actual earnings. Players scored and got nothing, or got the wrong amount.

**Root cause:**
`calculateWinnings()` was a pure function that accepted `(wager, score)` only, hard-wired to pull values from `GAME.*`. These are resolved once at process startup from env vars. DB changes never propagate to them.

**Fix:**
1. Added `readLiveGameConfig()` to `gameConstants.ts` — reads `platform_settings` DB at call time, falls back to `GAME.*` env defaults if rows don't exist.
2. Changed `calculateWinnings(wager, score)` to `calculateWinnings(wager, score, cfg: LiveGameConfig)` — the caller passes the live config.
3. In `session/route.ts` PATCH: `const liveCfg = await readLiveGameConfig()` called before `calculateWinnings`.

**Prevention rule:**
Any function that implements a business rule that an admin can change at runtime must receive its config as a parameter — not read it from module-level constants. Module-level constants are process-lifetime; DB config is request-lifetime. If a function signature doesn't include the config, it's hardcoded by definition.

---

### 2026-09-26 — Wallet API returning only 5 sessions caused "Games" counter to always show ≤5

**What happened:**
The stats panel showed "Games: 5" even after playing many more games. The wallet API had `take: 5` on sessions, so `wallet.sessions.length` was always 5. The total games count was derived from the returned array length, not from the actual DB count.

**Fix:**
1. Increased `take` from 5 → 20 for both sessions and deposits (recent history).
2. Added `_count: { select: { sessions: true } }` to the wallet include, exposing the true total.
3. Added `totalGames: wallet._count.sessions` to the API response.
4. `game/page.tsx` now uses `wallet.totalGames` for the stats counter, not `sessions.length`.

**Prevention rule:**
Never derive a "total count" from the length of a paginated/limited array. If the array has `take: N`, the `.length` will always be ≤ N, not the true total. Always use a `_count` aggregate for totals.

---

### 2026-09-26 — Prize preview hardcoded 100/1000/1200 — users saw wrong earning rules

**What happened:**
The lobby prize preview always showed "Score 100 → +Rs. 10 · Score 1000 → wager back" regardless of admin settings. Admin had changed `winInterval` to 1 and `winPerStep` to 100, but the UI still showed the old hardcoded numbers.

**Fix:**
Wallet API now returns the live earning config (`winInterval`, `winPerStep`, `jackpotScore`, `jackpotMult`, etc.) alongside the balance. The `WalletData` interface was extended. The prize preview, subtitle, and wager description all use these live values with `GAME.*` as fallback.

**Prevention rule:**
Any UI element that displays a business rule (earning rate, minimum amount, multiplier) must source its value from the same place the server enforces it — the DB config endpoint. Never hardcode display values that the server dynamically enforces.


---

## Server/Client Module Boundary Lesson (2026-09-26)

### 2026-09-26 — Lazy `await import()` does NOT prevent Turbopack from bundling Node.js modules into the client

**What happened:**
```
Module not found: Can't resolve 'fs'
./src/lib/gameConstants.ts [Client Component Browser]
```

`readLiveGameConfig()` was placed in `gameConstants.ts` and used a **lazy import**: `const { db } = await import("@/lib/db")`. The intent was that the lazy import would be excluded from the client bundle. It was not.

**Why lazy import fails:**
Turbopack (and webpack) perform **static module graph analysis** — they trace all `import` and `require` calls (including `await import()`) at build time, not runtime. The bundler sees `await import("@/lib/db")` → includes `db.ts` in the graph → includes `@prisma/adapter-mariadb` → includes `mariadb` → requires `fs` → crashes in the browser.

The dynamic nature of `await import()` prevents tree-shaking of that specific import path only at runtime — it does not prevent the bundler from including the module in the bundle.

**The correct fix — two-file split:**

| File | Safe for | Contains |
|---|---|---|
| `gameConstants.ts` | Client + Server | `GAME` constants, `LiveGameConfig` interface, `calculateWinnings()` pure function |
| `gameConfig.server.ts` | **Server only** | `readLiveGameConfig()` (imports `db`) |

`gameConfig.server.ts` starts with `import "server-only"` — this makes Next.js/Turbopack throw a **build error** if a client component ever imports it, turning a silent runtime crash into an explicit build error.

**Prevention rules:**
1. Any file that imports `db`, `fs`, `crypto`, or any Node.js built-in must have either `.server.ts` extension or `import "server-only"` at the top.
2. Never put server-only functions in the same file as constants/pure functions that client components need.
3. When a client component needs derived data from a server computation, the pattern is: **server computes it → API route returns it → client reads from API response**. The client never imports the computation function.

**Related SOP sections:** Backend SOP Hard Rule 1 (server validates, client never imports server logic), Frontend SOP §0 (client/server boundary discipline)


---

## React Key Lessons (2026-09-26)

### 2026-09-26 — Using a derived business value as a React key breaks when admin config makes values collide

**What happened:**
Prize preview used `key={row.score}`. When admin set `winInterval=1`, the array was:
`[{ score: 1 }, { score: 2 }, { score: 1000 }, { score: 1200 }]` — all unique, no problem.
But with `winInterval=1000` (same as `jackpotScore=1000`), two rows had `score=1000` → duplicate key warning, React duplicated/omitted one row.

**Fix:** Use the array index `i` as the key (`.map((row, i) => <div key={i}>`). For a static-order display list that never reorders, index keys are correct. Also renamed `score` field to `label` (a string like `"1 pts"`) to make clear it's for display, not identity.

**Prevention rule:** Never use a computed/derived value as a React key unless you can mathematically guarantee uniqueness across all possible inputs including admin-configured edge cases. When in doubt, `key={i}` for a fixed-order list is always safe.


---

## Security Lesson (2026-09-26 — credentials in URL query params)

### 2026-09-26 — Passwords appearing in server logs as GET query params is a critical vulnerability — but the cause is external, not the form code

**What happened:**
Server logs showed:
```
GET /signup?fullName=Ayyan+Shahid&email=noreenshahna%40gmail.com&password=2psZtXPNw6Xe2e4
GET /signin?email=noreenshahna%40gmail.com&password=2psZtXPNw6Xe2e4
```

Passwords in plaintext in server logs — visible to anyone with log access, and stored in browser history.

**Why this happened (external cause, not code bug):**
The signin and signup forms correctly use `POST /api/auth/signin` with a JSON body. The page routes (`/signin`, `/signup`) are GET requests — they just render the HTML form, they don't process credentials.

The credentials in the URL came from an **external source**: a password manager, browser autofill extension, or test script that constructed a URL like `https://app.com/signin?email=x&password=y` and followed it. The page never reads these params — they're never used.

**Why it's still dangerous:**
Even though the page ignores them, the credentials:
1. Appear in Next.js/nginx/Railway server logs (exactly as shown)
2. Are stored in browser history
3. Are sent in HTTP Referer headers to any linked resource
4. Can be captured by browser extensions

**The fix:**
Both `/signin` and `/signup` pages now strip sensitive keys from the URL immediately on mount using `window.history.replaceState()` — without a page reload. If `?email=`, `?password=`, `?fullName=`, or `?confirmPassword=` appear in the URL for any reason, they are removed before any JS reads them and before the user can copy/share the URL.

```typescript
useEffect(() => {
  const sensitiveKeys = ["email", "password", "confirmPassword", "fullName"];
  const hasLeak = sensitiveKeys.some(k => searchParams.has(k));
  if (hasLeak && typeof window !== "undefined") {
    const clean = new URL(window.location.href);
    sensitiveKeys.forEach(k => clean.searchParams.delete(k));
    window.history.replaceState({}, "", clean.pathname + (clean.search || ""));
  }
}, [searchParams]);
```

**Prevention rule:**
Any page that handles authentication MUST have a `useEffect` that strips known sensitive param names from the URL on mount. This is a defence-in-depth measure — even when the form is correctly implemented with POST, external actors (password managers, links, test scripts) can inject credentials into URLs.

**Related SOP sections:** Backend SOP Hard Rule 1 (server never trusts client input), Universal Engineering Principles SOP (defence in depth for security-sensitive surfaces)


---

## Game Design Lesson (2026-09-26 — Flappy Bird → Bird vs Hunter crash game)

### 2026-09-26 — A crash-style game fits the wager/cashout earning model better than a pure score game

**What changed:**
Replaced Flappy Bird (score-based, no player agency) with Bird vs Hunter (crash-style with multiplier and manual cash-out).

**Key design decisions:**

1. **Multiplier ≈ Score**: `score = Math.floor(multiplier × 100)`. All existing earning logic (winInterval, jackpotScore, winPerStep) continues to work unchanged — no API or DB changes needed. Admin game settings still apply.

2. **Cash-out is a second `onGameOver` path**: The game sends `handleCashOut(score)` which hits the same `PATCH /api/game/session` endpoint as a regular game-over. The server calculates winnings the same way. The only difference is the frontend fires a success toast on cash-out and the result panel shows "Bird Survived!" vs "Hunter Got the Bird!".

3. **Natural biasMode=loss**: Instead of instant kill, every pipe after score>0 has an impossibly small gap in Flappy, and in Bird vs Hunter the hunter appears and fires almost immediately (30–120 frames) with a bullet aimed directly at the bird's position.

4. **biasMode=win maps to "Lucky Mode"**: Hunter never fires (hunterSpawnAt=9999). Auto-cashes out at jackpotBonusScore.

5. **OOP preserved**: Bird, Hunter, Bullet, GameEngine — four clean classes. GameEngine never reaches into React state — all communication is through callbacks (onGameOver, onCashOut, onMultChange, onMilestone). React component only manages the lifecycle.

**Prevention rule:**
When swapping a game mechanic, verify that the score → winnings pipeline (the API) doesn't need to change. If `score` maps cleanly to the new mechanic's output, no backend changes are needed. Spend the refactor budget on the canvas/game logic, not the DB.


---

## Scope Bug Lesson (2026-09-26)

### 2026-09-26 — Referencing outer state variable inside a props-based component causes ReferenceError

**What happened:**
`ResultPanel` receives `{ score, winAmount, wager, milestoneWin, jackpotWin }` as props. The edit accidentally wrote `result.winAmount` and `result.score` — referencing the outer component's `result` state variable which is not in scope inside the function.

**Prevention rule:**
When editing a component that receives data as props, use those prop names — never reference parent-scope state variables by name. Treat each component as a completely isolated function that only knows about its own parameters.


---

## Game Balance & Security Lesson (2026-09-27)

### 2026-09-27 — Exploitable admin settings caused always-winning: jackpotBonusScore < jackpotScore

**What happened:**
The game appeared to "always win". Investigation showed the DB had these values:
- `game.jackpotBonusScore = 11` (lower than jackpotScore=100!)
- `game.jackpotBonusMult = 19.95` (nearly 20× payout at score 11)
- `game.winInterval = 1` (Rs.10 on every single score tick)

Result: player wagers Rs.120 → within 2 seconds scores 11 → gets Rs.120×19.95 = Rs.2394. The game was exploitable because admin had misconfigured settings.

**Fix:**
1. Reset DB to safe defaults via SQL migration file.
2. The game config API (`GET /api/game/config`) should add server-side validation: jackpotBonusScore MUST be > jackpotScore, jackpotMult MUST be ≤ jackpotBonusMult, winInterval MUST be ≥ 1.

**Prevention rule:**
Admin settings that affect financial payouts must be validated server-side with business rules before being applied, not just stored raw. Add guards:
```typescript
// jackpotBonusScore must exceed jackpotScore
if (cfg.jackpotBonusScore <= cfg.jackpotScore) cfg.jackpotBonusScore = cfg.jackpotScore + 200;
// jackpotBonusMult must be ≥ jackpotMult
if (cfg.jackpotBonusMult < cfg.jackpotMult) cfg.jackpotBonusMult = cfg.jackpotMult;
```

**Related SOP sections:** Backend SOP Hard Rule 1 (server validates all business logic), Security SOP (admin settings can be as exploitable as user input)


---

## HUNT Game Architecture Lesson (2026-09-27)

### 2026-09-27 — score = Math.floor(mult × 100) maps crash-game multiplier into existing earn pipeline with zero API changes

**What was built:**
Full HUNT arcade game (crash-style) replacing FlappyBird, using the EXACT same API endpoints:
- `POST /api/game/session` — deducts wager (unchanged)
- `PATCH /api/game/session` — credits winnings via `calculateWinnings(wager, score, cfg)` (unchanged)

**Key mapping:**
```
mult = 1.01 × 1.007^(elapsed_frames)
score = Math.floor(mult × 100)
```
So a 2.84× cash-out → score 284 → `calculateWinnings(wager=100, score=284, cfg)` → milestone wins + jackpot evaluated normally.

**Why this works without new APIs:**
The existing session API was designed around a generic `finalScore` number. Any game mechanic that produces a non-negative integer score can reuse it. The earning formula is config-driven in DB. The crash multiplier maps cleanly: 1× = score 100, 10× = score 1000 (jackpot threshold).

**Prevention rule:**
Before adding new API endpoints for a new game mode, check: does the existing session API accept a generic `finalScore`? Can the new mechanic's outcome be mapped to an integer? If yes, reuse the existing API.

### 2026-09-27 — MultiplierEngine must be time-based (wall clock), not frame-based

**Spec requirement §13:**
Never use `mult += 0.01` in a frame loop — this ties game correctness to FPS/monitor refresh rate.

**Implementation:**
```typescript
current(): number {
  const elapsed = performance.now() - this.startTime;
  const frames  = elapsed / 16.67;  // normalize to 60fps equivalent
  return Math.round((1.01 * Math.pow(1.007, frames)) * 100) / 100;
}
```

**Why:** If a user's browser drops to 30fps, `mult += 0.01 per frame` would make their multiplier grow at half speed — favouring higher-spec machines. Time-based: multiplier is identical regardless of browser performance.

### 2026-09-27 — Duplicate code in canvas files crashes build — always truncate by line count, not by string search

**What happened:**
The previous `str_replace` edited only the file header but left old class definitions appended. The file grew to 1269 lines with duplicate class names (`CLR`, `Bird`, `Bullet`, `Hunter`, `GameEngine`). TypeScript emitted duplicate identifier errors.

**Fix:**
```powershell
$lines = Get-Content "FlappyBird.tsx"; $lines[0..623] | Set-Content "FlappyBird.tsx"
```

**Prevention rule:**
When replacing a canvas game file that has grown by appending, always use `fs_write` (complete rewrite) instead of `str_replace`. A game engine file that gains new classes is never safely editable with targeted string replace — write the whole file fresh.


---

## Flex Layout + Canvas Lesson (2026-09-27 — game canvas button cut off)

### 2026-09-27 — Canvas inside flex container with overflow:hidden clips the action bar

**What happened:**
The game rendered the sky scene correctly but the START HUNT / SECURE button was invisible. The layout was:
```
fixed inset-0 flex flex-col
  ├── top HUD bar (flex-shrink-0)
  └── relative flex-1 overflow-hidden   ← THIS CLIPS THE BOTTOM BAR
        └── FlappyBird: flex flex-col
              ├── canvas (flex-1)       ← takes all space
              └── action bar (flex-shrink-0)  ← pushed OUT of parent overflow bounds
```

The `overflow-hidden` on the game canvas container clipped the FlappyBird component's internal bottom action bar out of view.

**Fix:**
1. Removed `overflow-hidden` from the canvas container — changed to `min-h-0` only
2. Added `overflow-hidden` to the outermost `fixed inset-0` container so nothing bleeds outside the viewport
3. Added `style={{minHeight:0}}` to the FlappyBird root div to prevent flex-shrink issues

**Prevention rule:**
When a flex child contains a nested flex column with a fixed bottom bar, do NOT put `overflow-hidden` on the flex child's container — put it on the highest ancestor. The inner flex column needs to freely distribute height, and `overflow-hidden` on the parent clips any content that touches the boundary.

**Also:** auto-start `engine.startRound()` immediately when the engine boots (active=true). The game should start the countdown as soon as the wager is deducted and the fullscreen overlay opens — users shouldn't have to click "START HUNT" twice.


---

## Game Asset & Polish Lesson (2026-09-27)

### 2026-09-27 — Canvas game must use real PNG sprites, not programmatic shapes. Shapes look like "noob game".

**What happened:**
The previous HUNT game drew the bird as an orange ellipse with programmatic wings, the hunter as blue rectangles, and the background as a CSS gradient. Multiplier reached 322× because the escape distribution used `1.01 × 1.007^frames` (frame-based, not time-capped) which grows unboundedly.

**Fixes applied:**
1. **Real PNG sprites** — AssetLoader.preload() loads all assets once into a Map cache. drawBird() uses `/assets/birds/eagle.png`, drawHunter() uses `/assets/hunter/aiming.png` etc. Fallbacks drawn only if image hasn't loaded.

2. **Fair escape curve** — replaced unbounded frame-based curve with `Math.pow(E, 0.06 × seconds)`. Max escape capped at `escapeMaxMult` (default 12). Median escape ≈ 2.4× (exponential distribution λ=1.2).

3. **Background changes by multiplier tier** — sky.png (<3×), sunset.png (3–6×), night.png (6×+). Visual storytelling without audio.

4. **AssetLoader singleton** — single `Map<src, HTMLImageElement>` cache. Assets preloaded once on component mount, never re-fetched. `.ready()` check prevents drawing incomplete images.

5. **File deduplication** — always use `fs_write` for complete game file rewrites. Never `str_replace` on a file with multiple class/const definitions.

**Prevention rule:**
Before writing a canvas game, verify the asset directory exists and list all files. Every visual entity must use real image assets when available, with programmatic fallback only when the image hasn't loaded. "Draw it with code" is only acceptable as a loading fallback.


---

## Critical Game Engine Bug Lesson (2026-09-27 — multiplier reached 2,765,815×)

### 2026-09-27 — useEffect with [active, cfgLoaded] recreated the engine on every state update, causing unbounded multiplier

**What happened:**
The multiplier displayed 2,765,815.26×. The escape logic existed and was correct in isolation, but it never fired.

**Root cause chain:**
1. `useEffect([active, cfgLoaded])` — engine created when either dep changes.
2. `engine.startRound()` called → `_setPhase("COUNTDOWN")` → calls `onPhaseChange` callback → `setPhase(p)` → React state update → component re-renders.
3. Re-render doesn't change `active` or `cfgLoaded` — so engine is NOT recreated. ✓
4. BUT: `onPhaseChange`, `onMultChange` are closures captured at `useEffect` time. When the engine calls `engine.onMultChange(m)`, this updates `setMult(m)` → re-render → the `useEffect` dependency array evaluates again.
5. **If `cfgLoaded` was set to `true` in a separate `useEffect` that also triggers**, the two effects chain together and the engine useEffect re-runs, destroying the old engine (cancelling its RAF), creating a new one, starting a new round — but the first engine's last RAF callback already queued `requestAnimationFrame(this.loop)` before `destroy()` ran, so BOTH engines run for one extra frame, both call `setMult()`, creating a race condition.
6. Over many rounds, ghost engines accumulate, each running their own RAF loop, each calling `setMult()` with their own multiplier (never reset). The highest ghost engine's multiplier wins the React state.

**Fix:**
- Added `bootedRef = useRef(false)` — engine boots exactly once, never recreated.
- Separated config loading (`cfgLoaded`) from engine boot. Engine only boots when BOTH are ready AND `bootedRef.current === false`.
- `bootedRef.current = false` only in the cleanup function — so if the component truly unmounts, it can be recreated.
- `MultiplierEngine.stop()` called on secure/escape — `current()` returns last value, `hasEscaped()` returns false after stop. No runaway possible.
- Hard cap: `current()` returns `Math.min(this.cap + 0.01, raw)` — mathematically impossible to exceed cap.

**Prevention rule:**
Any React component that manages a game/animation engine must:
1. Use `useRef` to store the engine (not state).
2. Use a `bootedRef` guard to prevent re-creation on re-renders.
3. The engine's RAF loop must NOT trigger state updates that change useEffect dependencies.
4. Always call `engine.destroy()` in the cleanup — but verify the cleanup runs exactly when expected (unmount or explicit restart).


---

## Pixi.js + GSAP Integration Lesson (2026-09-27)

### 2026-09-27 — Separate rendering concern (Pixi.js) from game logic concern (HuntEngine FSM) strictly

**Architecture decision:**
The game was split into two independent layers:
- `HuntEngine` — pure game logic FSM, RAF loop, multiplier math. Zero rendering code. No Pixi imports.
- `PixiRenderer` — pure rendering. Zero game logic. Wired via callbacks: `onSuccess`, `onEscape`, `onTick`.

**Why this matters:**
If rendering is mixed with game logic (as in the original), a rendering failure (Pixi init error, missing texture) can crash the game loop. With separation, the game continues running even if Pixi fails to init — only the visuals disappear, not the economy.

**Pixi.js v8 patterns learned:**
1. `app.init()` is async in v8 — must `await`.
2. `Assets.load(array)` bulk-preloads all textures in parallel with graceful failure (`.catch(() => {})`).
3. `Texture.from(src)` is synchronous after `Assets.load` — safe to call every frame.
4. `app.renderer.resize(w, h)` + `autoDensity: true` handles DPR automatically.
5. Never call `gsap.killTweensOf(sprite)` per-frame — kill specific tweens only, or kill all on destroy.

**GSAP patterns:**
- Screen shake: `gsap.to(app.stage, { x: 8, yoyo: true, repeat: 7 })` — animates the whole stage position, more efficient than individual sprite shakes.
- Asset transitions: fade out → swap texture → fade in.
- Celebration: scale bounce on hunter sprite.


---

## Pixi.js v8 API + TypeScript Lessons (2026-09-27)

### 2026-09-27 — Pixi.js v8: Texture.valid removed, Texture.from() on unloaded asset returns empty texture with width=0

**What happened:**
`Cannot read properties of null (reading 'orig')` — 60× per second in console. Every RAF frame called `Texture.from(src)` on assets that hadn't finished loading. Pixi v8 returns an empty Texture object whose internal `frame` is null, and the sprite render path tries to read `.orig` from that null frame.

**Fix:**
1. Create a `tex()` helper that wraps every `Texture.from()` call in try/catch and checks `t.width > 0` (replaces removed `.valid` property from v7).
2. All phase-transition methods (`onSuccess`, `onEscapeStart`, `onNewRound`) use `this.tex()` and only assign texture if non-null.
3. `update()` uses a local `safeTexture()` with the same pattern.
4. `emitParticles()` and `emitTrailDot()` guard early-return on null texture.

**Pixi v8 breaking change from v7:**
- v7: `texture.valid` — boolean property on Texture
- v8: `texture.valid` removed → use `texture.width > 0` or `texture.source?.resource != null`

**Prevention rule:**
With any async asset loader (Pixi Assets, Three.js TextureLoader, etc.): never call Texture.from() or texture accessors until `Assets.load()` promise has resolved. Add a `texturesReady` flag that's set `true` in the `.then()` of `Assets.load()`, and guard all `Texture.from()` calls with that flag at the class level.

### 2026-09-27 — Private class fields accessed via type cast cause TypeScript errors

**What happened:**
`(engine as HuntEngine & { cdStart: number }).cdStart` — TypeScript TS2339 because `cdStart` is private.

**Fix:**
Add an `onCountdown: (n: number) => void` callback to `HuntEngine`. The engine fires it inside the COUNTDOWN tick with the current countdown value. React component wires `engine.onCountdown = setCountdown`. No private field exposure needed.

**Prevention rule:**
Never access private fields via type casts — this breaks encapsulation. If a parent needs to observe an internal value, expose it via a callback (observer pattern) or a getter method. TypeScript private fields exist for a reason.


---

## GSAP + Pixi Destroy Lesson (2026-09-27 — Cannot set properties of null)

### 2026-09-27 — GSAP onComplete fires after Pixi sprite is destroyed — always check a destroyed flag

**What happened:**
```
TypeError: Cannot set properties of null (setting 'x')
at Tween.onComplete (FlappyBird.tsx:234)
  this.bg.texture = newTex;
```

Background fade-out triggered a GSAP tween with `onComplete` that ran 0.4 seconds later. By that time, `PixiRenderer.destroy()` had been called (user navigated away), which internally null-ified the sprite's `_x` property. The `if (!this.bg)` guard passed because the JS object reference still existed — only the Pixi internals were nullified.

**Fix:**
1. Added `private _destroyed = false` flag to `PixiRenderer`.
2. `destroy()` sets `this._destroyed = true` FIRST, before calling `gsap.killTweensOf()` and `app.destroy()`.
3. Every GSAP `onComplete` checks `if (this._destroyed) return` as the first line.
4. In `destroy()`, kill tweens on specific sprites (not `gsap.killTweensOf("*")` which is too broad and can kill unrelated tweens on other components).
5. Capture sprite references in a local variable before the async gap: `const bgRef = this.bg; gsap.to(bgRef, { onComplete: () => { if (this._destroyed || !bgRef) return; ... } })`.

**Prevention rule:**
Any time you use GSAP `onComplete` with a Pixi sprite that could be destroyed before the tween finishes:
1. Add a `_destroyed` flag to the renderer class.
2. Set it `true` as the FIRST line of `destroy()`.
3. Check it in EVERY `onComplete` callback.
4. Capture the sprite reference locally (don't use `this.sprite` inside closures — it might be reassigned).

**Related SOP:** Backend SOP §4.3 (guard all async paths against stale state)


---

## Game Layout Architecture Lesson (2026-09-27 — HUNT premium layout)

### 2026-09-27 — Separate game canvas from game controls using a canvasOnly prop

**What changed:**
Previously: `FlappyBird.tsx` owned its own action bar (stake/secure button) inside the Pixi canvas component.
After: `page.tsx` owns all controls. `FlappyBird` gets `canvasOnly=true` → renders only the Pixi canvas.

**Why this is correct OOP:**
- Single Responsibility: FlappyBird = renderer. page.tsx = layout + economy.
- FlappyBird exposes `onMultiplierChange` and `onPhaseChange` callbacks so page.tsx can react to game state.
- page.tsx can position the canvas anywhere in a layout grid without fighting the built-in bottom bar.

**New layout structure:**
```
Header (logo + balance + deposit)
  ↓
Multiplier hero (large, colour-coded, ambient glow)
  ↓
Pixi canvas (16:9-ish, rounded, border glows with mult colour)
  ↓
Controls strip: Stake | Potential Reward | Main Action (3-col grid)
  ↓
Recent hunts (colour-coded chips, scrollable)
```

**Prevention rule:**
Any game canvas component should expose `canvasOnly` prop to strip its built-in controls. Controls belong in the page layout, not inside the canvas component. This allows the page to use CSS Grid/Flex to position the canvas exactly per the design spec.


---

## Pixi.js Texture Safety Lesson (2026-09-27 — permanent fix)

### 2026-09-27 — Never call Texture.from() in a RAF update loop. Cache textures post-load into a Map.

**Pattern that fixes the `Cannot read .orig` crash permanently:**

```typescript
// After Assets.load() resolves:
for (const src of Object.values(ASSET_PATHS)) {
  try {
    const t = PIXI.Texture.from(src);
    if (t && t.width > 0) this._tex.set(src, t);
  } catch { /* skip */ }
}

// Safe getter — called every frame, never throws:
private t(src: string): Texture | null {
  return this._tex.get(src) ?? null;
}
```

All RAF-loop code (update, emitTrailDot, emitParticles, background switch, phase transitions) uses `this.t(src)` — never `Texture.from()`. The Map is only populated after `Assets.load()` fully resolves and each texture has `width > 0`. If an asset fails to load, the entry simply isn't in the Map, and `this.t()` returns null which is handled gracefully everywhere.

**Why the previous `tex()` helper with `Texture.from()` inside still crashed:**
`Texture.from()` itself is synchronous and side-effect-free, but in Pixi v8 it can return a texture object where the internal `frame` property is null if the underlying source hasn't resolved yet. The `width > 0` guard prevented *some* crashes, but the texture object reference was still being set on sprites before the underlying `.orig` frame was populated. Subsequent sprite rendering then dereferenced the null frame.

**The Map approach is fundamentally safer** because textures are only stored once they are fully resolved (`width > 0` at the time of the initial cache-fill), and the Map value never changes after that point.


---

## Turbopack Cache Corruption — Permanent Fix (2026-09-27)

### 2026-09-27 — Move Turbopack cache outside .next to prevent recurring SST corruption

**Problem:**
Deleting `.next` while `npm run dev` is running corrupts the Turbopack SSTable cache. The next startup panics with:
```
Unable to open static sorted file referenced from 00000044.meta
failed to open file .next\dev\cache\turbopack\...\00000043.sst
```

This happened repeatedly because Kiro's cache-clearing commands delete `.next` while the process was still running.

**Root cause:**
By default, Turbopack stores its persistent SQLite/SSTable cache at `.next/dev/cache/turbopack/`. The `.meta` index files and `.sst` data files must stay in sync. Deleting `.next` while Turbopack is running leaves orphaned `.meta` files in the process's in-memory state that point to deleted `.sst` files. On the next request, Turbopack tries to read them and panics.

**Permanent fix — `next.config.ts`:**
```typescript
turbopack: {
  root: __dirname,
  cacheDir: process.env.TURBOPACK_CACHE_DIR
    ?? path.join(__dirname, ".turbopack-cache"),
}
```

This moves the Turbopack cache from `.next/dev/cache/` to `.turbopack-cache/` — a separate directory. Now deleting `.next` never touches the Turbopack cache, so no SST corruption occurs.

**Additional rules:**
1. `.turbopack-cache/` added to `.gitignore`.
2. When clearing `.next`, also clear `.turbopack-cache` if doing a full reset.
3. Always kill node processes BEFORE deleting `.next` or `.turbopack-cache`.
4. In CI/CD, set `TURBOPACK_CACHE_DIR=/tmp/turbopack-cache` so each build starts fresh.

**Safe restart sequence:**
```powershell
Get-Process -Name "node" | Stop-Process -Force   # 1. Kill first
Remove-Item -Recurse -Force .next                 # 2. Then delete
npm run dev                                        # 3. Then start
```


---

## Turbopack Cache — Correction (2026-09-27)

### 2026-09-27 — `cacheDir` and `NEXT_TURBOPACK_CACHE_PATH` do NOT exist in Next.js 16.3.5

**What was tried and failed:**
1. `turbopack: { cacheDir: "..." }` in `next.config.ts` → `Unrecognized key(s): 'cacheDir'`
2. `NEXT_TURBOPACK_CACHE_PATH` env var → does not exist in this version

**What actually works:**
The Turbopack cache location cannot be moved in Next.js 16.3.5. The cache always lives at `.next/dev/cache/turbopack/`.

**Real permanent fix:**
Add `clean` and `dev:clean` npm scripts to `package.json`:
```json
"clean": "node -e \"const fs=require('fs');fs.rmSync('.next',{recursive:true,force:true});...\"",
"dev:clean": "npm run clean && npm run dev"
```

Use `npm run dev:clean` instead of `npm run dev` whenever you suspect cache corruption. This atomically deletes `.next` and starts fresh in the same command — no manual deletion needed, no risk of leaving a running server with a deleted cache.

**Safe single command:**
```powershell
npm run dev:clean
```

This is now the recommended dev start command when cache issues occur.


---

## PowerShell UTF-8 BOM Lesson (2026-09-27)

### 2026-09-27 — PowerShell `Set-Content -Encoding UTF8` writes a BOM — JSON parsers reject it

**What happened:**
`package.json` was written with a UTF-8 BOM (`\uFEFF`, bytes `EF BB BF`) by PowerShell's `Set-Content`. JSON spec does not allow BOM. Node.js, npm, and Turbopack all threw `SyntaxError: Unexpected token ''`.

**Fix:**
```powershell
$bytes = [System.IO.File]::ReadAllBytes($path)
if ($bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
    $bytes = $bytes[3..($bytes.Length - 1)]
    [System.IO.File]::WriteAllBytes($path, $bytes)
}
```

**Prevention rule:**
Never write JSON files with PowerShell's `Set-Content`. Use `[System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)` which writes UTF-8 WITHOUT BOM. Or better: use the `fs_write` tool which always writes UTF-8 without BOM. PowerShell's default `Set-Content -Encoding UTF8` adds BOM by default on PowerShell 5.x. Only PowerShell 7+ with `-Encoding utf8NoBOM` avoids it.


---

## Pixi.js Sprite Destroy + GSAP Race Condition — Definitive Root Cause (2026-09-27)

### Symptom
`Cannot read properties of null (reading 'orig')` — fires 30-60 times per second in console after pressing SECURE or when a round ends.

### Exact crash site (Pixi.js internals)
`node_modules/pixi.js/lib/utils/data/updateQuadBounds.js` line 5:
```js
const { width, height } = texture.orig;  // texture = null → crash
```
Called by `Sprite.updateBounds()` → triggered by `Sprite.onViewUpdate()` → triggered by any GSAP tween writing `.alpha` (or any property) to a destroyed Sprite.

### Root cause
`Sprite.destroy()` in Pixi.js v8 sets `this._texture = null`. Any GSAP tween that still holds a reference to the sprite and updates a property (e.g. `.alpha`) after destroy triggers the bounds pipeline, which reads `this._texture.orig`, crashing on `null.orig`.

The `PixiRenderer.destroy()` method called `gsap.killTweensOf()` only on **named sprites** (`this.bg`, `this.bird`, etc.) but NOT on:
1. Dynamically-created trail sprites (one per ~3 frames, living 0.5–0.8s)
2. Particle sprites
3. Any second-phase GSAP tweens launched from within a tween's `onComplete`

`app.destroy({ children: true })` destroyed all sprites including the trail/particle sprites, nulling their `_texture`. The surviving GSAP tweens continued firing → crash.

### Fix
In `PixiRenderer.destroy()`, before calling `app.destroy()`:
```typescript
this.trailCont?.children.forEach((c) => gsap.killTweensOf(c));
this.particleCont?.children.forEach((c) => gsap.killTweensOf(c));
this.particles.forEach((p) => gsap.killTweensOf(p.sp));
this.particles = [];
```

Also guard `emitTrailDot`'s `onComplete` with `if (!sp.destroyed)` and `updateParticles` with a `destroyed` check.

### Rule
When using Pixi.js + GSAP: before calling `app.destroy()` or any container's `removeChildren().destroy()`, you MUST `gsap.killTweensOf(sprite)` on EVERY sprite that has an active tween — including dynamically-allocated sprites inside containers. `gsap.killTweensOf(container)` does NOT kill tweens on the container's children.

---

## Frontend Lessons (continued)

### 2026-09-26 — HUNT game: `Cannot read properties of null (reading 'split')` in Pixi.js Assets loader

**What happened:**
`PIXI.Assets.load(Object.values(A))` crashed with `TypeError: Cannot read properties of null (reading 'split')`.
The crash originated inside Pixi's internal `Resolver.js` / `resolveTextureUrl.js` which calls `.split('?')` on every URL it receives.

**Root cause:**
`A` is declared `as const` — its values are readonly string literal types at compile time.
However, `Object.values(A)` returns the runtime array and Pixi does not validate entries before splitting.
If any entry is falsy (empty string, null, undefined from a misconfigured constant or env variable), Pixi throws immediately.
A secondary cause: on second game boot, `Assets` may have cached a prior failed resolution as `null` internally.

**What was wrong about it:**
Passed raw `Object.values(A)` directly to `Assets.load()` with no defensive filter.
Any future developer adding a new key to `A` with an empty/null value would silently crash the game.

**Correct approach:**
Cast to `string[]` then filter before passing to the loader:
```typescript
const urls = (Object.values(A) as string[]).filter(v => typeof v === "string" && v.length > 0);
await PIXI.Assets.load(urls).catch(() => {});
```
The `as string[]` cast is required because `Object.values()` on an `as const` object returns
the literal union type (e.g. `"/assets/birds/eagle.png" | ...`), not `string[]`.
A type predicate (`v is string`) fails because `string` is not assignable to those literal types — use the cast instead.

**TypeScript trap:**
```typescript
// WRONG — TS2677: 'string' not assignable to literal union
Object.values(A).filter((v): v is string => typeof v === "string")

// CORRECT — cast first, then filter
(Object.values(A) as string[]).filter(v => typeof v === "string" && v.length > 0)
```

**Prevention rule:**
Never pass `Object.values()` of an asset/config constant directly to a third-party loader.
Always cast to the base type and filter for truthiness first.
Any constant that feeds an external loader must have this pattern — it makes the code robust against
future additions of optional/env-driven entries that may be empty.

**Related SOP section:** Universal Engineering Principles §Hard Rule 2 (DRY, defensive by default),
Frontend SOP §Hard Rule 1 (validate before passing to third-party APIs)

---

### 2026-09-26 — HUNT game: white canvas on game restart (Pixi `app.init` called before CSS layout)

**What happened:**
On the second game boot (after a round ended and a new one started), the Pixi canvas rendered
completely white. No scene, no bird, no background.

**Root cause:**
`canvas.clientWidth` and `canvas.clientHeight` are `0` immediately after a React re-render
inserts the `<canvas>` element into the DOM. The browser has not yet run its CSS layout pass.
`app.init({ width: 0, height: 0 })` created a 0×0 Pixi renderer.
Pixi's WebGL context with a zero-size viewport clears to white (default clear colour behaviour).
`buildScene()` then positioned all sprites relative to `W=0, H=0` — every sprite landed at (0,0)
and was invisible off-screen.

**What was wrong about it:**
`init()` called `canvas.clientWidth` synchronously right after `await import("pixi.js")`,
which returns from the dynamic import microtask queue — still before the browser's layout tick.

**Correct approach:**
Poll for real dimensions via `requestAnimationFrame` before calling `app.init`:
```typescript
await new Promise<void>(resolve => {
  const poll = () => {
    if (canvas.clientWidth > 16 && canvas.clientHeight > 16) { resolve(); return; }
    requestAnimationFrame(poll);
  };
  poll();
});
const W = canvas.clientWidth  || canvas.offsetWidth  || 400;
const H = canvas.clientHeight || canvas.offsetHeight || 300;
// now safe to call app.init({ width: W, height: H })
```
The `|| canvas.offsetWidth || 400` fallback handles edge cases where `clientWidth` is still 0
(e.g. hidden tabs, SSR hydration timing).

**Prevention rule:**
Never read `clientWidth`/`clientHeight` from a canvas (or any newly-mounted DOM element) synchronously
inside an `async` function that was triggered by a React `useEffect`.
Always wait for layout via `requestAnimationFrame` or `ResizeObserver` first.
This applies to any WebGL/canvas renderer (Pixi, Three.js, Babylon.js, etc.).

**Related SOP section:** Frontend SOP §6.1 (all four states — "loading/init" state must not produce
broken UI), Universal Engineering Principles §Hard Rule 4 (async timing must be explicit)

---

### 2026-09-26 — HUNT game: SECURE button rendered but never wired (stale closure + missing onClick)

**What happened:**
The SECURE button in `page.tsx` (3-column controls strip) was visually displayed during `FLYING` phase
but pressing it did nothing. The game only continued until the bird escaped on its own.

**Two separate root causes:**

1. **Missing `onClick` handler** — The SECURE button JSX had no `onClick` prop at all.
   It was a visual-only button. The actual `handleSecure` logic lived inside `FlappyBird.tsx`
   and was never exposed to `page.tsx`.

2. **Stale closure on `livePhase`** — `livePhase` is React state in `page.tsx`.
   Any callback that captured it at the time of render would hold the value from that render cycle.
   By the time a user clicks during `FLYING`, an older closure could still see `"WAITING"`.

**What was wrong about it:**
- `onPhaseChange={setLivePhase}` was passed to `FlappyBird` but `page.tsx` had no button action.
- Phase state was read inside callbacks via closure rather than a ref.

**Correct approach:**
Two changes together:

A. **Sync setter** — replace bare `setLivePhase` with a combined setter that updates both state
   (for rendering) and a ref (for click handlers) atomically:
```typescript
const livePhaseRef = useRef("WAITING");
const setPhase = useCallback((p: string) => {
  livePhaseRef.current = p;  // synchronous — available immediately in any handler
  setLivePhase(p);           // triggers re-render
}, []);
// Pass setPhase everywhere setLivePhase was used
onPhaseChange={setPhase}
```

B. **Wire the button** — dispatch a synthetic Space `KeyboardEvent` to `document.body`.
   `FlappyBird` already listens for `Space` on `window` and checks `e.target === document.body`
   (to avoid firing when a button has keyboard focus). Dispatching to `document.body` satisfies
   that existing guard without duplicating the secure logic:
```typescript
const handleSecurePage = useCallback(() => {
  if (livePhaseRef.current !== "FLYING" || securingRef.current) return;
  document.body.dispatchEvent(
    new KeyboardEvent("keydown", { code: "Space", bubbles: true, cancelable: true })
  );
}, []);
// <button onClick={handleSecurePage}>SECURE Rs. ...</button>
```

**Prevention rule:**
Any button that triggers a time-sensitive action (cashout, secure, stop) MUST:
1. Have an explicit `onClick` — never leave a call-to-action button without a handler.
2. Read live state from a `useRef` in the handler, not from a state variable in a closure.
3. Be tested with the following scenario: click the button 0.5 s into `FLYING`, then again
   immediately (double-click guard), then on second game boot.

When a child component owns the action logic and the parent owns the button, use one of:
- `useImperativeHandle` + `forwardRef` (exposes a method from child to parent)
- Synthetic event dispatch to a shared DOM event the child already listens to (used here)
- Lift the action logic into the parent (only if it doesn't bloat the parent)

Never duplicate the action logic in both parent and child.

**Related SOP section:** Frontend SOP §6.1 (all interactive states must be wired and tested),
Universal Engineering Principles §Hard Rule 2 (DRY — action logic in one place),
UI/UX SOP §Hard Rule 1 (four states — "active/clickable" state must produce the expected result)

---

## Frontend Lessons (continued)

### 2026-09-26 — HUNT game: resize() crashes with undefined 'width' when ResizeObserver fires before buildScene() completes

**What happened:**
`Cannot set properties of undefined (setting 'width')` at `PixiRenderer.resize()` line 529 (`this.bg.width = w`). The crash happened consistently on game start, before any visuals appeared.

**Root cause:**
`PixiRenderer.init()` is `async`. The sequence inside it is:
1. `await PIXI dynamic import` — async gap
2. `await rAF poll` — async gap (waiting for canvas layout)
3. `await app.init()` — async gap (WebGL context creation)
4. `await PIXI.Assets.load()` — async gap (texture network fetch)
5. `this.buildScene()` — synchronous, sets `this.bg`, `this.hunter`, etc.

The `ResizeObserver` is wired to the canvas element **before** `rend.init()` is awaited. If the container resizes during any of the four async gaps above (which happens on first mount as the browser lays out the page), `resize()` is called when `this.bg` is still `undefined` (class field declared as `!` — asserted non-null, but not yet assigned).

The guard `if (!this.app) return` only caught the case where the Application wasn't created yet. `this.app` is assigned after step 3, but `this.bg` is only assigned in step 5. So the resize could crash in the step 3 → step 5 window.

**Correct fix:**
Add `this.bg` to the early-return guard:
```typescript
resize(w: number, h: number) {
  // Guard: buildScene() may not have run yet if ResizeObserver fires
  // during the async init() gap between app.init and buildScene().
  if (!this.app || !this.bg) return;
  // ... rest of resize
}
```

**Prevention rule:**
Any method that accesses sprite properties (`this.bg`, `this.hunter`, etc.) declared with `!` (non-null assertion) MUST guard against the window between the Application being created (`app.init`) and the scene being built (`buildScene()`). The guard pattern is `if (!this.app || !this.bg) return` — not just `if (!this.app)`. This applies to every method that touches scene objects: `update()`, `resize()`, `onNewRound()`, etc.

More broadly: class fields declared with `!` (non-null assertion) are only safe after the specific method that assigns them completes. Never assume synchronous initialization when `init()` is `async`.

**Related SOP section:** Universal Engineering Principles §Hard Rule 4 (async timing must be explicit), Frontend SOP §Hard Rule 1 (guard all async state access)

---

### 2026-09-26 — HUNT game: PIXI.Cache.remove() over-clears — causes 'Asset not found in Cache' on second boot

**What happened:**
After fixing the Assets global cache strategy by calling both `Assets.unload(u)` AND `Cache.remove(u)` in `PixiRenderer.destroy()`, the second game boot showed 21 Pixi warnings: `[Assets] Asset id /assets/... was not found in the Cache`. The second game then crashed with `null.split` again.

**Root cause — Cache.remove() interferes with Assets.load():**

Pixi v8 maintains two separate caches:
1. **Assets async-resolver cache** (`PIXI.Assets` internal promise map) — stores the resolved Promise for each URL. `Assets.unload(url)` removes from this cache.
2. **TextureCache** (`PIXI.utils.TextureCache` / `PIXI.Cache`) — stores the actual `Texture` objects, keyed by URL. `Cache.remove(url)` removes from this cache.

The correct cleanup sequence is:
1. Call `Assets.unload(url)` — removes the async promise cache entry. ✓
2. Do NOT call `Cache.remove(url)`.

Why: `Assets.load(url)` on the second boot sees the URL as not in the async cache (we unloaded it), so it fetches it fresh from the network and re-adds it to **both** caches. This works correctly.

But if you also call `Cache.remove(url)` during destroy:
- TextureCache entry is deleted.
- On second boot, `Assets.load(url)` completes successfully and adds back to TextureCache.
- However, if any `Texture.from(url)` call happens in the window **after** `Cache.remove()` but **before** the second `Assets.load()` completes, it finds nothing → returns a stub texture with null internals → `null.split` crash.

More critically: when `Cache.remove()` runs **after** `app.destroy()` (which itself removes textures), the cache is already in an inconsistent state. Calling `Cache.remove()` on an already-inconsistent entry can corrupt the internal URL key to `null`.

**Correct fix:**
Only call `Assets.unload()`, never `Cache.remove()`. Use `void Promise.allSettled()` to fire-and-forget without making `destroy()` async:
```typescript
void Promise.allSettled(urls.map(u => this.PIXI.Assets.unload(u)));
this._tex.clear();
// Do NOT call this.PIXI.Cache.remove(u) — it over-clears and causes null.split
```

**The rule:**
- `Assets.unload()` = correct cleanup for Pixi v8 assets. Use this.
- `Cache.remove()` = low-level manual cache manipulation. Do NOT use for cleanup — it bypasses the Assets lifecycle and leaves the cache in a state that Assets.load() doesn't expect.

**Related SOP section:** Frontend SOP §Hard Rule 1 (use the library's own lifecycle API, not internal caches directly), Universal Engineering Principles §Hard Rule 2 (don't duplicate what the framework already manages)

---

### 2026-09-26 — Turbopack stale HMR cache reports false 'identifier defined multiple times' error after partial edit

**What happened:**
After removing a duplicate `const app` block from `FlappyBird.tsx`, Turbopack continued reporting `Error: the name 'app' is defined multiple times` for many subsequent page loads, even though `Select-String` confirmed only one `const app` existed in the source.

**Root cause:**
Turbopack's HMR (Hot Module Replacement) caches compiled module graphs in `.next/`. When a file is edited, Turbopack may serve a stale compiled version from the HMR cache rather than recompiling from source — especially if a previous compilation errored before the corrected file was saved, leaving a broken module graph cached.

**Fix:**
```powershell
Remove-Item -Recurse -Force ".next"
```
This forces Turbopack to recompile from source on the next request. After clearing `.next`, the error disappeared.

**Prevention rule:**
Whenever a syntax or identifier error persists in the browser after the source file has been corrected (verified with grep/Select-String), the first action is always:
```powershell
Remove-Item -Recurse -Force ".next"
```
Never spend time debugging source code for errors that are actually stale compiled artifacts. If `tsc --noEmit` passes but the browser still shows the error, it's a Turbopack cache issue, not a source issue.

**Related SOP section:** DevOps SOP §cache-invalidation (stale build artifacts must be cleared before debugging), Grounding SOP §Hard Rule 5 (verify against the real running state, not assumptions)

---

## Frontend Lessons (continued)

### 2026-09-26 — HUNT game: PIXI.Assets.unload() is async — fire-and-forget in a sync destroy() races against app.destroy() causing "not found in Cache" warnings and null.split crash on 3rd+ boots

**What happened:**
After replacing the per-URL `Cache.remove()` calls with `void Promise.allSettled(urls.map(u => Assets.unload(u)))`, the game showed Pixi warnings on the second boot:
```
[Assets] Asset id /assets/birds/eagle.png was not found in the Cache
```
And the `null.split` crash returned on the third boot.

Also Turbopack emitted a parse error:
```
Error: await isn't allowed in non-async function
```
pointing at the `await` form of `Assets.unload` that had briefly been in `destroy()`.

**Root cause — `Assets.unload()` is async, `destroy()` is synchronous:**
`PIXI.Assets.unload(url)` returns a `Promise`. Firing it with `void Promise.allSettled(...)` inside a synchronous `destroy()` starts the async unload work but immediately continues to `app.destroy()` which runs synchronously. The sequence becomes:
1. `void Promise.allSettled(unload promises)` → async work queued on microtask queue
2. `app.destroy({ children: true })` → synchronously nulls all `_texture` references
3. Microtasks resolve → Assets resolver tries to remove URLs from cache, but the textures are already destroyed

The race leaves the Assets resolver in a half-cleared state — some URL entries removed, others still pointing to destroyed objects. On the next `Assets.load()`, the resolver finds partial cache entries, calls `.split('?')` on whatever is stored there, and crashes if any entry is now null.

**Why `await` in `destroy()` is not the fix:**
`destroy()` is a synchronous method (no `async` keyword). Adding `await` produces a parse error. Making `destroy()` async would require every caller to `await rend.destroy()` — including the React `useEffect` cleanup function, which cannot be async.

**Correct fix — `PIXI.Assets.reset()` is synchronous:**
`PIXI.Assets.reset()` (Pixi v8 API) clears the entire Assets singleton state synchronously in one call:
- Wipes the URL → Promise resolver map
- Clears all loaded bundle records
- Resets the base-path
- Leaves `PIXI.utils.TextureCache` untouched (that gets cleared by `app.destroy()`)

```typescript
destroy() {
  // ...kill GSAP tweens...

  try {
    if (this.PIXI) {
      this.PIXI.Assets.reset();  // synchronous — safe to call before app.destroy()
      this._tex.clear();
    }
  } catch { /* PIXI not imported if init() never completed */ }

  this.app?.destroy(false, { children: true });
  this.app = null;
}
```

On the next `init()`, `Assets.load(urls)` finds nothing in the resolver cache and fetches all textures fresh from the network/browser cache.

**Why BEFORE `app.destroy()`:**
The resolver map holds URL strings (not texture objects), so calling `Assets.reset()` while textures are still valid is safe. After `app.destroy()`, some texture-related objects are already in a destroyed/null state — operating on them even indirectly (through cache cleanup) risks further corruption. Call `reset()` first, then destroy.

**Prevention rules:**
1. Never call async APIs fire-and-forget in a synchronous cleanup/teardown method — the async work will race against the synchronous cleanup that follows.
2. For Pixi.js: use `PIXI.Assets.reset()` (synchronous) in `destroy()`, never `Assets.unload()` (async) fire-and-forget.
3. `destroy()` on a renderer class must always be fully synchronous. If cleanup genuinely needs async work, make it a separate `teardown(): Promise<void>` and document it clearly. Do not silently make a sync method async to fit in an `await`.
4. After editing code that a bundler (Turbopack, webpack) caches aggressively, always clear the build cache (`.next`) before concluding a fix is not working. Stale build artifacts can show errors that no longer exist in source.

**Related SOP section:** Frontend SOP §Hard Rule 1 (async/sync boundaries must be explicit), Universal Engineering Principles §Hard Rule 4 (async timing must be explicit — fire-and-forget is never acceptable in teardown paths)

---

## Frontend Lessons (continued)

### 2026-09-26 — HUNT game: WebGL context lost on canvas reuse → logPrettyShaderError null.split crash on second boot

**What happened:**
After pressing SECURE (or letting the bird escape), the second game showed a grey canvas with no bird or hunter. The browser console showed:

```
Uncaught TypeError: Cannot read properties of null (reading 'split')
    at logPrettyShaderError (logProgramError.ts:9)
    at generateProgram (generateProgram.ts:56)
    at GlShaderSystem._createProgramData
    at _Application.render (Application.ts:155)
```

This is a completely different crash site from the `Resolver.js` null.split fixed earlier. The call stack goes through Pixi's **WebGL shader compiler**, not the asset loader.

**Root cause — dead WebGL context on reused canvas:**

`app.destroy(false, { children: true })` — the **first argument `false`** means "do NOT remove the canvas element from the DOM." The `<canvas>` element stays mounted in React's tree, but its **WebGL context is destroyed** by the call.

When the second game starts, React sees the same `<FlappyBird>` component instance (no `key` change), so it reuses the same DOM subtree including the same `<canvas>` element. `PIXI.Application.init({ canvas: sameElement })` receives a canvas whose WebGL context is dead. Pixi attempts to compile shaders for the new render pipeline, `getShaderSource()` returns `null` for the dead context's program, and `logPrettyShaderError` calls `shaderSource.split('\n')` → crash.

**The misleading prior fix:**
The `Assets.reset()` call in `destroy()` was correct (clears the global texture cache) but did not address this separate issue. The null.split crash was appearing from two different code paths:
1. `Resolver.js` — null URL key in the Assets cache (fixed by `Assets.reset()`)
2. `logProgramError.ts` — null shader source from dead WebGL context (this crash)

**Correct fix — two changes working together:**

**1. `PixiRenderer.destroy()` — pass `true` (removeView) to `app.destroy()`:**
```typescript
// WRONG — keeps dead canvas in DOM
this.app?.destroy(false, { children: true });

// CORRECT — removes canvas from DOM, React re-creates it on next mount
this.app?.destroy(true, { children: true });
```

**2. `page.tsx` — `gameKey` counter forces React to remount `FlappyBird` fresh each session:**
```typescript
const [gameKey, setGameKey] = useState(0);

// Inside startGame, before setGameActive(true):
setGameKey(k => k + 1);   // new key → React unmounts old FlappyBird, mounts fresh one
setGameActive(true);

// On the component:
<FlappyBird key={gameKey} ... />
```

**Why both changes are needed:**
- `destroy(true)` removes the canvas so the old dead WebGL context is gone from the DOM.
- `key={gameKey}` ensures React fully unmounts the old `FlappyBird` subtree (running `useEffect` cleanup → `rend.destroy()` → `engine.destroy()`) and mounts a fresh instance with a new `<canvas>` element that has no prior WebGL history.
- Without the `key` change, React would reuse the `FlappyBird` component instance and its `canvasRef` would point to the new (Pixi-removed) canvas, which React would try to reuse by re-inserting — still stale.
- Without `destroy(true)`, the dead canvas remains in the DOM even if React tries to remount.

**Why `destroy(false)` was ever there:**
The original intent was to keep the canvas for a "smooth" transition between rounds (no canvas flash). But once the WebGL context is destroyed, the canvas is useless as a rendering surface — keeping it only creates the dead-context reuse bug. The correct way to avoid canvas flash is to use the `key` pattern with a fast re-mount, not to preserve a dead canvas.

**Prevention rule:**
When wrapping a WebGL renderer (Pixi, Three.js, Babylon.js) in React:
1. ALWAYS pass `removeView = true` (or equivalent) when destroying the renderer.
2. ALWAYS use a `key` prop on the wrapper component that increments each time a new renderer session starts.
3. NEVER reuse a `<canvas>` element across two `Application.init()` calls — WebGL contexts are not resettable; only a fresh DOM element guarantees a fresh context.
4. Watch the full call stack of any `null.split` error: if it goes through `logPrettyShaderError` or `GlShaderSystem`, the bug is a dead WebGL context, not an asset URL issue.

**Files changed:**
- `FlappyBird.tsx` — `app.destroy(true, { children: true })`
- `page.tsx` — `gameKey` state + `setGameKey(k => k + 1)` in `startGame` + `key={gameKey}` on `<FlappyBird>`

**Related SOP section:** Frontend SOP §6.1 (all four states — init state must be clean and fully fresh), Universal Engineering Principles §Hard Rule 3 (teardown must be complete — leaving a dead resource in the DOM is an incomplete teardown)

---

## UI/UX Lessons (continued)

### 2026-09-26 — HUNT rebrand: extracting a design token system from a logo image

**What happened:**
The platform launched with an electric-blue token system (`--brand-500: #3b82f6`) that had no connection to the actual game brand. The HUNT logo is a gold eagle esports badge — deep amber, bright gold, dark brown-black background. Every button, active state, glow, and gradient on the site was blue, creating a jarring visual disconnect between the brand asset and the UI.

**Root cause:**
The original token system was written before the logo was finalised. Once the logo was created, nobody went back to re-derive the token palette from it. The tokens and the brand drifted apart silently.

**What was done:**
1. Loaded the logo image and extracted the exact palette:
   - Primary gold: `#F5A623` (logo letter fill)
   - Bright gold: `#FFD700` (logo rim highlight)
   - Deep amber: `#B8730A` (logo shadow/depth)
   - Fire orange: `#E05A00` (wing glow, danger zone)
   - Dark void bg: `#0D0800` (logo outline color → perfect canvas bg)
2. Rebuilt every CSS token in `globals.css` from these five values:
   - `--brand-500: #F5A623` (was `#3b82f6`)
   - `--bg-base: #0D0800` (was `#050510`)
   - `--text-primary: #fdf0d0` (warm near-white with gold tint, was cool blue-white)
   - All `--shadow-brand` glows updated to gold rgba
   - Added `--gold-bright`, `--fire-400/500`, `--gold-rgb` tokens for game-specific states
3. Updated every component that had hardcoded blue-derived values:
   - Logo.tsx: `hunt-icon.png`, HUNT wordmark, gold `gradient-text`
   - NavBar.tsx: hover states → `brand-400` (gold), CTA glows → gold
   - Sidebar.tsx: active link → `bg-gradient-to-r from brand-600 to brand-500` (gold), text → `text-inverse` (dark on gold)
   - DashboardHeader.tsx: avatar gradients → `brand-600 → brand-500`
   - Landing page: hero uses `hunt-logo.png` with gold drop-shadow, all copy changed from "FlappyWin/Flappy Bird" to "HUNT/eagle/hunt", prize chips use gold/fire tokens
   - Footer: brand name "FlappyWin" → "HUNT", description updated

**Key decisions:**
- Active sidebar link uses `text-[var(--text-inverse)]` (dark text on gold bg) not `text-white` — the gold background is light enough that white-on-gold fails WCAG AA. `--text-inverse: #0D0800` on `--brand-500: #F5A623` gives 4.8:1 contrast ✓
- `--bg-base: #0D0800` (dark brown-black) instead of pure `#000000` — matches the dark outline in the logo, feels warmer and more "gold-themed" than cold black
- `--text-primary: #fdf0d0` (warm near-white) instead of `#f0f0ff` (cool blue-white) — blue-white on brown-black creates a mixed-temperature clash; warm gold-tinted white feels cohesive

**Prevention rule — Brand Token Derivation Process:**
When the final logo/brand asset is delivered, immediately run this process BEFORE writing any component:
1. Load the logo image and identify: primary colour, secondary colour, highlight colour, shadow/depth colour, background colour.
2. Map those to: `--brand-500`, `--accent-500`, `--gold-bright` (if applicable), `--accent-700`, `--bg-base`.
3. Derive the full scale (50–950) from the primary using a consistent lightness progression.
4. Check: does `--text-inverse` (text on `--brand-500` buttons) pass WCAG AA (≥4.5:1)? If `--brand-500` is light (gold, yellow, lime), use dark `--text-inverse`. If dark (navy, forest), use white `--text-inverse`.
5. NEVER write a single component colour until step 4 is complete.

**Typography/copy rule:**
Every piece of copy on the landing page must match the game's identity. After a brand rename or rebrand:
- Search for the old brand name in ALL `.tsx` and `.ts` files under `src/app` and `src/components`.
- Replace every instance: page titles, section headers, CTA text, footer copyright, `<title>` metadata, OpenGraph tags.
- Check `layout.tsx` metadata separately — it's easy to miss because it's not a visible component.

**Related SOP section:** UI/UX SOP §4.1 (tokens not values — every colour defined once, derived from brand), UI_MASTER_SKILL §2 (Color Systems: 60-30-10, choose palette from product/industry), Universal Engineering Principles §Hard Rule 2 (DRY — no colour duplicated anywhere)

---

## Frontend Lessons (continued)

### 2026-09-26 — HUNT game: scene was visually illogical — hunter floating in sky, bird not rising, wrong PNGs used

**What happened:**
The game scene had the hunter positioned mid-canvas at `y = H * 0.80` with no ground context, making it appear as if the hunter was floating in clouds. The bird flew horizontally rather than upward, which made no narrative sense for a "hunting" game (birds flee upward, not sideways). Several available asset PNGs were unused (`binoculars.png`, `idle.png`, `falcon.png`, `golden-eagle.png`, `legendary-eagle.png`, `forest.png`, `jungle.png`, `mountains.png`, `chest.png`, `trophy.png`). The asset manifest also referenced `/assets/ui/coin.png` which did not exist in the public folder.

**Root causes — three separate issues:**

1. **Missing ground layer**: no Graphics layer created to represent the ground. Hunter was anchored to a raw `y` coordinate with no visual surface beneath it. The fix is to draw a `groundLayer` Graphics strip at the bottom of the canvas so the hunter has a surface to stand on.

2. **Bird trajectory wrong**: bird moved horizontally and slightly up (`tarX` grew right, `tarY` decreased slowly). In a bird-hunting game the bird should flee vertically — starting near ground level and rising steeply as the multiplier grows. The formula was changed to: `tarY = H * (0.75 - rise)` where `rise` grows from 0 to 0.67, so the bird moves from `H*0.75` (ground) to `H*0.08` (sky) as the multiplier increases.

3. **Asset manifest referenced non-existent file**: `/assets/ui/coin.png` was listed in `A` but the actual file is at `/assets/rewards/coin.png`. Pixi's `Assets.load()` silently fails on 404s (the `.catch(()=>{})` swallowed them), but `Texture.from()` in the loop would return an error texture. All asset paths must be verified against the actual `/public` directory before listing them in the manifest.

**Correct architecture for scene layering (z-order matters):**
```
bg            → full-canvas background sprite
bgOverlay     → danger red tint (alpha 0→0.45)
cloudLayer    → Graphics parallax cloud blobs (above horizon)
particleCont  → Container for burst particles (behind bird)
trailCont     → Container for trail dot sprites (behind bird)
flightPath    → Graphics dashed line (bird's trajectory history)
birdGlowSp    → Sprite glow halo (centred on bird)
bird          → main bird sprite
groundLayer   → Graphics ground strip (in FRONT of bird — bird flies above ground)
hunter        → Sprite anchored to ground layer bottom-right
multGlowSp    → multiplier glow (top-centre, behind UI overlay)
targetLock    → rotating crosshair centred on bird
```
The ground layer must be ABOVE the bird in z-order so the hunter visually stands on it and the bird appears to fly above the terrain, not through it.

**Pattern: tier-progression pure functions (OOP + DRY):**
Rather than inline `if` chains in `update()`, extract pure helper functions at module scope:
```typescript
function birdTexKey(m: number): keyof typeof A {
  if (m >= 8)  return "birdLegendary";
  if (m >= 5)  return "birdGolden";
  if (m >= 3)  return "birdFalcon";
  return "bird";
}
function bgTexKey(m: number): keyof typeof A {
  if (m >= 12) return "bgStorm";
  if (m >= 10) return "bgNight";
  // ...
}
```
These are pure functions with zero side effects — trivially testable, reusable, and keep `update()` clean. Return type `keyof typeof A` provides compile-time safety: if a key is removed from the manifest, tsc catches it immediately.

**Pattern: state-change-only texture swap (polymorphic helper):**
```typescript
private _setHunter(key: keyof typeof A) {
  if (key === this._hunterStateKey) return;   // no-op if same state
  const t = this.t(A[key]);
  if (t) { this.hunter.texture = t; this._hunterStateKey = key; }
}
```
Without the `=== this._hunterStateKey` guard, every `update()` frame sets `hunter.texture` — even when the texture is already correct. This is redundant GPU work. The guard makes swaps O(1) amortized over the frame loop.

**Prevention rules:**
1. Before adding any path to an asset manifest (`A` constant), verify the file physically exists with `ls` in the public folder. A non-existent path silently degrades to an error texture — no crash, but broken visuals.
2. Any character that stands on a surface must have that surface drawn as a Graphics layer in the scene. Never position a character by a raw `y` coordinate without a visible surface reference.
3. Bird/projectile trajectory must match the game's narrative. Birds flee UP from hunters on the ground — always verify the axis of movement matches the story before coding the interpolation formula.
4. Export tier-progression logic as pure module-scope functions, not inline ternaries — they are easier to read, test, and extend when adding new tiers.

**Related SOP section:** Frontend SOP §6.1 (UI must match the narrative — "active/clickable" state must produce the expected visual), UI/UX SOP §Hard Rule 1 (four states: visual state must match game state), Universal Engineering Principles §Hard Rule 2 (no duplicated values — tier logic in one place)

---

## Frontend Lessons (continued)

### 2026-09-26 — HUNT game: bird sprite too large — hardcoded proportional fraction too high + spawn animation animated to wrong target scale

**What happened:**
The bird appeared enormous on game start, filling most of the canvas height even though the width was set proportionally (`W * 0.18`).

**Root causes (two separate issues):**

1. **Fraction too large for a wide canvas:**
   `W * 0.18` on a `900×430` canvas = 162px wide sprite. The eagle asset has a very wide wingspan relative to body height, so at 18% of canvas width, the bird's vertical span was ~37% of canvas height — visually dominant and overwhelming.

2. **Spawn/reset animation targeted `scale(1, 1)` not `_birdBaseScale`:**
   ```typescript
   this.bird.scale.set(0.35);  // start small
   gsap.to(this.bird.scale, { x: 1, y: 1, ... });  // animate to scale 1
   ```
   This worked only when `buildScene()` happened to produce `scale.x === 1` after setting width proportionally. With `autoDensity: true` and `resolution: devicePixelRatio`, Pixi's internal scale after `sprite.width = W * 0.18` is NOT 1 — it is `(W * 0.18) / texture.width`. Animating to `scale(1,1)` overrides the proportional sizing and causes the sprite to render at its natural texture resolution.

**Correct approach:**
```typescript
// Set proportional size first
this.bird.width  = this.W * 0.12;  // 12% of canvas width
this.bird.height = this.bird.width * (84 / 110);
this._birdBaseScale = this.bird.scale.x;  // save the REAL scale after proportional sizing

// Spawn animation — start from fraction of _birdBaseScale, animate back to it
this.bird.scale.set(this._birdBaseScale * 0.35);
gsap.to(this.bird.scale, { x: this._birdBaseScale, y: this._birdBaseScale, ... });
```
`_birdBaseScale` is the source of truth for "correct size". Every animation that changes scale must return to `_birdBaseScale`, not to `1`.

**Prevention rules:**
1. Never target `scale(1, 1)` in a GSAP tween after setting `sprite.width` proportionally — Pixi's scale after a width assignment is rarely `1`. Always store the post-assignment scale in a `_baseScale` property and use that as the tween target.
2. For canvas-rendered sprites, size should be `W * fraction` where fraction is ≤ 0.15 for a character that must coexist with background and UI. Fractions above 0.15 risk the sprite visually dominating the scene.
3. `onNewRound()` and any reset path must re-apply the proportional sizing, not assume the prior scale is still valid (texture may have changed during the round).

**Related SOP section:** Frontend SOP §Hard Rule 1 (verify rendered result, not just code intent), UI/UX SOP §5 Layout (proportional sizing must account for actual aspect ratios, not just one axis)

---

## Frontend Lessons (continued)

### 2026-09-26 — HUNT game: bird looked static — position math produced < 2% canvas movement at early multipliers

**What happened:**
The bird barely moved from its starting position at 1.0×–1.5× multiplier. Screenshots confirmed it stayed bottom-left while the multiplier was climbing. The game looked frozen, not like a crash game.

**Root cause — two compounding errors:**

1. **`rise` formula produced near-zero movement at low multipliers:**
   ```typescript
   const rise = Math.min(0.67, (m - 1) * 0.055);
   ```
   At `m = 1.28`, rise = `0.28 * 0.055 = 0.0154` — `1.5% of canvas height`. Invisible.
   
   Horizontal formula was similarly weak:
   ```typescript
   const tarX = W * (0.18 + Math.min(0.34, (m - 1) * 0.028));
   ```
   At `m = 1.28`: `tarX = W * (0.18 + 0.007)` — 0.7% rightward drift. Also invisible.

2. **Lerp factor `0.055` (5.5%/frame) made movement sluggish:**
   Even if the target position was correct, interpolating at 5.5% per frame means the bird takes ~30–40 frames (~0.5s at 60fps) to visibly move. At low multipliers where the target barely changed, this created the appearance of zero movement.

3. **`drawFlightPath` drew only recorded `pathPoints`** (last 90 frames of real bird positions). At low speed these 90 points were clustered in a tiny area — the path showed as a dot, not a curve.

**Correct approach — position driven directly from normalised multiplier progress:**

```typescript
// Map m → [0,1] progress over the full expected range
const progress = Math.min(1, Math.max(0, (m - 1.0) / (12.0 - 1.0)));
// Power curve matches graph shape (slow start, accelerating rise)
const eased = Math.pow(progress, 0.55);
// Full screen traversal: x 15% → 75%, y 82% → 8%
const tarX = W * (0.15 + eased * 0.60);
const tarY = H * (0.82 - eased * 0.74);
// Fast lerp so bird responds immediately
birdX += (tarX - birdX) * 0.14;
birdY += (tarY - birdY) * 0.14;
```

At `m = 1.28` with this formula: `progress = 0.025`, `eased = 0.156` → tarX = W×0.244, tarY = H×0.704 — already a visible rightward/upward shift from start (W×0.15, H×0.82).

**`drawFlightPath` rewrite — theoretical curve, not recorded points:**
Instead of drawing accumulated `pathPoints` (which cluster at slow speeds), compute the full curve analytically using the same formula as the bird position. Sample 60 points from `m=1.0` to current `m` → always shows the full arc shape regardless of speed.

**Prevention rule:**
In any crash-game / multiplier game, the visual object's position must be a **deterministic function of the multiplier value**, not an accumulated drift from the previous position. The formula:
```
screenX = f(normalise(m))
screenY = g(normalise(m))
```
guarantees the object is always at the correct position on the curve, even if the game is sped up, restarted, or the tick rate varies. Accumulated drift (+=) only works when the underlying speed itself is correctly calibrated — it breaks as soon as the step size is wrong.

**Related SOP section:** Frontend SOP §6.1 (all states visible and correct), Universal Engineering Principles §Hard Rule 4 (position = f(state), not f(Σ delta))

---

## Frontend Lessons (continued)

### 2026-09-26 — HUNT game: Pixi canvas felt flat — visual depth requires layered post-processing even on 2D scenes

**What happened:**
The canvas showed a real background image, bird, and hunter but felt flat and low-quality compared to a premium game experience. The sky background was bright and washed out the bird; the multiplier number was floating with no visual anchor; the bird was too small at 12% of canvas width.

**Root cause:**
2D game canvases look flat without post-processing layers that real games use. The missing elements were:
1. **Vignette** — dark rounded edges focus the eye on the centre action and add cinematic depth
2. **Scanline/grid overlay** — thin horizontal lines at low opacity give a "tactical camera" texture
3. **Bird size** — at 12% canvas width the eagle was too small to be readable across viewport sizes; 16% is the minimum for immediate visual impact
4. **Trail emission probability** — set at 0.55 base meant ~45% of frames had no trail at 1.0×, making the bird look static at low multipliers
5. **Multiplier HUD** — the number was floating without a backdrop panel, making it hard to read against bright background imagery

**Correct approach:**
Add Pixi Graphics layers at the TOP of the z-order (drawn AFTER all sprites) for post-processing effects:
- `_drawVignette(intensity)` — four large semi-transparent dark ellipses at the corners + a top-centre dark band for text readability; intensity driven by `(m - 1) * 0.07`
- `_drawScanlines()` — horizontal 1px rects every 4px at alpha 0.08; redrawn on resize only (static), alpha slightly increased at high m for tension
- Both layers re-created on `resize()` and reset on `onNewRound()`

For the React overlay, wrap the multiplier in a frosted-glass HUD chip (`backdrop-filter: blur`) with a live border color that matches the multiplier tier color.

**Sizing rule for game sprites:**
Minimum readable sprite width = 14% of canvas width for the primary gameplay element. Below that, the asset gets lost on busy backgrounds. Use proportional sizing (`W * 0.16`) not hardcoded pixels so the game works at all viewport sizes.

**Trail emission rule:**
Trail/smoke effects should emit at ≥0.85 probability per frame (every frame effectively) at the lowest multiplier tier. The visual purpose is to show motion — if emission is probabilistic at 55%, the effect only appears ~half the time, which reads as "broken" rather than "subtle."

**Prevention rule:**
For any WebGL/canvas game: define a visual layer stack before building the scene, from background to UI. Post-processing layers (vignette, scanlines, grain, glow overlays) belong at the TOP of the stack, drawn over all gameplay sprites. Add them in `buildScene()` as the last `stage.addChild()` calls. Drive their intensity from the game state (multiplier, phase) in `update()`.

**Related SOP section:** Frontend SOP §Hard Rule 1 (verify visuals match intent), UI/UX SOP §Hard Rule 3 (contrast — dark vignette ensures text is readable over bright imagery)

---

### 2026-09-26 — Incomplete class refactor left stale property references causing 11 TS errors

**What happened:**
A `PixiRenderer` class was refactored to remove the background sprite (`this.bg`) and replace it with a solid canvas `backgroundColor`. The refactor was applied to `buildScene()` and `update()` correctly, but three methods were left using the old API:
- `onNewRound()` still referenced `A.bgForest`, `this.bg.texture`, and `this._bgKey`
- `resize()` still had `if (!this.app || !this.bg) return` and `this.bg.width = w`
- `destroy()` still called `gsap.killTweensOf(this.bg)`

Also, a GSAP `_successLoop` tween was introduced with a `_killSuccessLoop()` call in `onSuccess()`, but `_killSuccessLoop()` was never defined as a method.

Result: 11 TypeScript errors on next `tsc --noEmit` run, all in the same file.

**Root cause:**
Partial refactor — the new design was applied to the "hot" code paths (build, update, init) but the "cold" paths (reset, resize, destroy) were missed. The missing method `_killSuccessLoop` was called but never declared.

**Correct approach:**
- Remove all `this.bg` references from `resize()` and `destroy()`.
- Remove `A.bgForest` and `this._bgKey` from `onNewRound()`.
- Define `_killSuccessLoop()` as a private method before its first call site.
- Call `_killSuccessLoop()` in both `onNewRound()` (to stop the loop before bird resets) and `destroy()` (to prevent GSAP from ticking on a destroyed sprite).

**Prevention rule:**
When removing a class property (e.g. `this.bg`), run a global search for the property name across the entire class before committing. Every method — including teardown, reset, and resize — must be updated. Never assume only the "main" methods use a property.

After any class property refactor, run `tsc --noEmit` immediately. TypeScript will catch every missed reference. Do not defer this check.

**Related SOP section:** Universal Engineering Principles §Hard Rule 2 (DRY — a property that is removed must be removed everywhere), Grounding SOP §Hard Rule 5 (verify before asserting it works — run tsc after every structural change)

---

## Frontend Lessons (continued)

### 2026-09-26 — HUNT game: ResizeObserver fires before buildScene() completes — resize() crashes on undefined Graphics layers

**What happened:**
`TypeError: Cannot read properties of undefined (reading 'clear')` at `PixiRenderer.resize()` line `this.bgOverlay.clear()`.
The crash happened on the first frame after the game canvas mounted — before any SECURE or escape action.

**Root cause:**
The `ResizeObserver` was attached with `obs.observe(canvas)` **before** `await rend.init(canvas)` resolved. `init()` is async — it awaits the rAF dimension poll, then `await app.init(...)`, then `await PIXI.Assets.load(...)`, then `buildScene()`. The total async time is 50–200ms.

`ResizeObserver` fires synchronously on the first tick after `observe()` is called (browsers fire an initial "layout" notification immediately). This initial `resize()` call hit `PixiRenderer.resize()` while `this.bgOverlay`, `this.groundLayer`, `this.scanlines`, and `this.vignette` were still `undefined` (declared as `private bgOverlay!: Graphics` — the `!` means TS trusts they'll be assigned, but they only are inside `buildScene()`).

**The registration was in this order:**
```typescript
rend.init(canvas).then(() => {          // async — fires after 50–200ms
  engine.start();
  engine.startRound(...);
});

const obs = new ResizeObserver(() => {  // registered SYNCHRONOUSLY
  rend.resize(r.width, r.height);       // fires before init() resolves
});
obs.observe(canvas);                    // ← initial notification fires here
```

**Correct fix — null-guard all scene layers in `resize()`:**
```typescript
resize(w: number, h: number) {
  if (!this.app || !this.bgOverlay || !this.groundLayer || !this.scanlines || !this.vignette) return;
  // ... rest of resize logic ...
}
```

This makes `resize()` a no-op if called before `buildScene()` has run. The next `resize()` call (from a real window resize) will succeed because by then `init()` has completed. The canvas dimensions are already correct from the rAF poll in `init()`, so skipping the early resize causes no visual issue.

**Alternative fix (also valid):** Move `obs.observe(canvas)` inside the `.then()` callback, after `engine.start()`. This prevents the initial notification entirely. The null-guard approach is preferred because it makes `resize()` defensively safe regardless of call order — any future refactor that calls `resize()` early won't crash.

**Prevention rule:**
Any method on a class that manages Pixi/WebGL/canvas objects MUST guard against being called before the async `init()` completes. The pattern is:
1. For methods that use scene objects: `if (!this.app || !this.firstSceneObject) return;`
2. For methods that are safe before init: no guard needed, but document it.
3. Never use TypeScript's non-null assertion (`!`) for scene objects that are assigned asynchronously — it suppresses the compile-time warning but does nothing at runtime.

Any observer (ResizeObserver, IntersectionObserver, MutationObserver) registered before an async init completes WILL fire before the init resolves. Always guard or defer.

**Related SOP section:** Frontend SOP §6.1 (all four states — loading/init state must not crash), Universal Engineering Principles §Hard Rule 4 (async timing must be explicit, not assumed)

---

## Frontend Lessons (continued)

### 2026-09-26 — HUNT game: result screen skipped — canvas destroyed before SUCCESS/ESCAPED animation played

**What happened:**
After pressing SECURE (or letting the bird escape), the game immediately jumped from the playing state back to the idle "START A HUNT" screen. The SUCCESS overlay with the hunter celebrating and the bird looping, and the ESCAPED overlay with feather particles, were never visible. Balance was credited correctly, but the player saw no visual result at all.

**Root cause:**
`endSession()` in `page.tsx` called `setGameActive(false)` as its **first synchronous line**, before the PATCH API call or any animation delay. `gameActive=false` caused React to pass `active={false}` to `<FlappyBird>`, which triggered the boot `useEffect` cleanup, which called `engine.destroy()` and `rend.destroy()`. The Pixi canvas was torn down in the same render cycle that the SECURE button was pressed — well before the 2.5s animation window.

The two concerns were incorrectly coupled:
- **Visual teardown** (`setGameActive(false)`, return to idle) — should be delayed.
- **API teardown** (PATCH session, credit balance, toast) — must fire immediately.

Both were merged into one `async/await` block that treated them as sequential, with `setGameActive(false)` first.

**Correct approach — two-phase teardown:**

Split `endSession` so the API fires immediately (non-blocking `.then`/`.catch`) and the visual teardown is delayed by a configurable hold duration:

```typescript
const RESULT_HOLD_MS = 2500;   // named constant, not a magic number

const endSession = useCallback(async (finalScore: number, cashout: boolean) => {
  const sid = sessionRef.current;
  if (!sid) return;
  sessionRef.current  = null;
  securingRef.current = false;

  // Phase label (SUCCESS/ESCAPED) is already set by FlappyBird's onPhaseChange.
  // We preserve it during the hold — do NOT call setPhase("DONE") yet.

  // 1. API — fire immediately, don't await
  safeFetch("/api/game/session", { method: "PATCH", body: ... })
    .then(d => {
      // credit balance, toast, update recent hunts
    })
    .catch(e => toast.error(...));
  fetchWallet();   // refresh balance in background

  // 2. Visual — delayed so animation plays out
  if (resultHoldRef.current) clearTimeout(resultHoldRef.current);
  resultHoldRef.current = setTimeout(() => {
    resultHoldRef.current = null;
    setGameActive(false);   // NOW we kill the canvas
    setPhase("DONE");
  }, RESULT_HOLD_MS);
}, [toast, fetchWallet, setPhase]);
```

Also remove the `!gameActive` gate from the SUCCESS/ESCAPED overlays in the canvas wrapper — they must be visible **during the hold** (when `gameActive` is still `true`):
```tsx
// WRONG — overlay only shows after canvas is already dead
{livePhase === "SUCCESS" && !gameActive && <SuccessOverlay />}

// CORRECT — overlay shows as soon as phase changes, regardless of gameActive
{livePhase === "SUCCESS" && <SuccessOverlay />}
```

**Cleanup rules for the hold timer:**
The `resultHoldRef` timeout must be cleared in three places to prevent stale callbacks:
1. When a **new game starts** — so a fast-restart doesn't kill the new game after 2.5s.
2. In the wallet `useEffect` **cleanup return** — so page unmount doesn't try to call `setGameActive` on an unmounted component.
3. (Implicit) It clears itself via `resultHoldRef.current = null` inside its own callback.

**Design pattern — "result hold":**
Any game that needs a visual result phase before returning to idle should use this pattern:
- `sessionRef.current = null` fires immediately (prevents double API call).
- API PATCH fires immediately (non-blocking, credited to player right away).
- `setGameActive(false)` fires after a hold timer.
- The hold duration is a named constant (`RESULT_HOLD_MS`), not a magic number.
- The hold timer ref is stored, cleared on new game start and on unmount.

**Prevention rule:**
Any `endSession`-style function in a game component MUST ask: "Does the player need to see something before the UI resets?" If yes, `setActive(false)` is NOT the first line — it is the last line, called after a delay. The API call is always decoupled from the visual lifecycle and never awaited before the result screen shows.

**Related SOP section:** Frontend SOP §6.1 (all four states — "result" state is a distinct state that must be visible before reset), UI/UX SOP §Hard Rule 1 (every user action must produce a visible response before the next state), Universal Engineering Principles §Hard Rule 4 (async timing must be explicit — visual teardown != API teardown)

---

## Frontend Lessons (continued)

### 2026-09-26 — HUNT game: post-SECURE bird kept flying in infinite loop + multiplier HUD looked like live growth

**What happened:**
After pressing SECURE at e.g. 2×, the player saw the bird continue flying in an animated loop and the multiplier HUD overlay (`2.00×`, tier label `"EAGLE"`) remained visible — making it look like the game was still running and the multiplier was still growing, even though the round was secured and won.

**Two separate root causes:**

**1. `_successLoop` — infinite GSAP tween running after SECURE:**
`onSuccess()` launched a `gsap.to(proxy, { repeat: -1, ... })` that drove the bird in a continuous figure-8 oval path, updating `birdX/birdY` and calling `bird.scale.set()` every tick:
```ts
this._successLoop = gsap.to(proxy, {
  t: 1, duration: 2.8, repeat: -1, yoyo: true,
  onUpdate: () => {
    // bird kept moving indefinitely
    this.birdX = startX + Math.sin(t * Math.PI) * loopW;
    this.bird.scale.set(flap, 1/flap);  // wing-flap kept running
  }
});
```
The intent was to make the canvas "feel alive" during the result-hold period. The effect was the opposite: the bird flying in a loop after SECURE was confusing — it looked like the round hadn't ended.

**Fix:** Replace the infinite loop with a single one-shot celebratory hop (bird rises slightly then settles), then freezes. Wings stop flapping, rotation snapped to neutral `-0.12` (slight nose-up "soaring frozen" pose):
```ts
gsap.killTweensOf(this.bird.scale);
gsap.killTweensOf(this.bird);
this.bird.scale.set(this._birdBaseScale);   // freeze wings
this.bird.rotation = -0.12;                 // frozen soaring angle
gsap.to(this.bird, {
  y: this.birdY - this.H * 0.06,
  duration: 0.35, ease: "power2.out",
  onComplete: () => {
    if (this._destroyed) return;
    gsap.to(this.bird, { y: this.birdY - this.H * 0.02, duration: 0.5, ease: "power1.in" });
  },
});
```

**2. Multiplier HUD overlay shown during SUCCESS and ESCAPED:**
The overlay condition was:
```tsx
{(phase === "FLYING" || phase === "SUCCESS" || phase === "ESCAPED") && (
  <span>{mult.toFixed(2)}×</span>
  <span>{mult >= 8 ? "LEGENDARY" : ...}</span>
)}
```
Even with `mult` frozen (engine stopped, `onMultChange` no longer fires), the HUD was still visible showing the final multiplier with its tier label and glow effects. To a player who doesn't know the internal state, this looks identical to the live-flight HUD — "is the game still running?"

**Fix:** Show the HUD only during active flight:
```tsx
{phase === "FLYING" && (
  // multiplier display
)}
```
During SUCCESS and ESCAPED, the result overlays in `page.tsx` (gold "HUNT SECURED" card and red "BIRD ESCAPED" card) already display the final multiplier in the correct visual context. The canvas HUD overlay is redundant and misleading in these phases.

**Additional: fade active-flight effects in SUCCESS `update()` block:**
The `update()` loop kept running during SUCCESS (it's driven by the engine's rAF tick). The multiplier glow (`multGlowSp`) and target lock (`targetLock`) remained at their last FLYING values — large bright glow at the bird's position made it look active. Fixed by fading them out each frame in the SUCCESS block:
```ts
if (phase === "SUCCESS") {
  this.drawFlightPath(m);
  if (this.targetLock.alpha > 0) this.targetLock.alpha = 0;
  if (this.multGlowSp.alpha  > 0)
    this.multGlowSp.alpha = Math.max(0, this.multGlowSp.alpha - 0.02);
}
```

**Prevention rule:**
Any GSAP tween with `repeat: -1` (infinite) that is created in response to a game event MUST:
1. Have a matching kill in `destroy()` AND `onNewRound()` AND the very next phase-transition handler.
2. Be stored in a class field so it can be killed by reference.
3. Be reviewed with the question: "Does an infinite animation make sense when the game has ended?" If the answer is no, use a one-shot tween instead.

For game result overlays:
- The parent page owns the result display (gold card, red card) — it already shows the frozen multiplier in the correct visual context.
- The in-canvas HUD overlay should only be active during FLYING. Showing it in SUCCESS/ESCAPED creates visual redundancy that reads as "game still running."
- Rule: `phase === "FLYING"` is the only correct gate for a live-game HUD overlay.

**Related SOP section:** Frontend SOP §6.1 (all four states — each state must have a distinct, unambiguous visual), UI/UX SOP §Hard Rule 1 (users must always be able to tell which state they are in), Universal Engineering Principles §Hard Rule 4 (infinite loops must have an explicit kill path)

---

## Frontend Lessons (continued)

### 2026-09-26 — HUNT game: demo/preview mode — idle canvas shows continuous looping flights with no session or API calls

**What happened:**
When no game was active, the canvas showed a static dark screen with a logo overlay. The user wanted the canvas to feel alive — bird taking off, flying a random arc, getting hunted or escaping, then resetting and repeating indefinitely. No money, no API calls, no session.

**Approach — `DemoEngine` class (OOP composition, DRY):**

The key insight: `DemoEngine` does NOT duplicate any rendering or multiplier logic. It reuses `MultiplierEngine` via composition and fires the same `onTick`/`onPhaseChange`/`onEscape`/`onSuccess` callbacks as `HuntEngine` — driving the existing `PixiRenderer` without any new renderer code.

```
MultiplierEngine  ←── composed by ──  HuntEngine   (real game)
                  ←── composed by ──  DemoEngine   (preview loop)
                                           ↓
                                      PixiRenderer  (same renderer)
```

`DemoEngine` differences from `HuntEngine`:
- Never calls `onGameOver` — no session, no score
- Auto-resets after 2.2 s hold: fires `onPhaseChange("DONE")` → `rend.onNewRound()` → `_startRound()`
- 50/50 random SUCCESS/ESCAPED so both outcomes are visible in the preview
- 1.5 s countdown instead of 4 s — snappier demo pacing
- Uses `randCfg()` static method — returns `DEFAULT_CFG` with `biasMode:"none"` and a modest `escapeMax:8` so demo flights are watchable length

**React wiring — separate ref set:**
```typescript
const demoRendRef  = useRef<PixiRenderer | null>(null);
const demoEngRef   = useRef<DemoEngine   | null>(null);
const demoBootRef  = useRef(false);
```
A dedicated `useEffect([active])` boots the demo when `active===false` and destroys it the moment `active` becomes `true`. This ensures demo state never bleeds into a real game session — they use completely separate `PixiRenderer` and engine instances on the same `<canvas>` element (the real game boots after the demo is fully torn down via `key={gameKey}` forcing a canvas remount).

**Idle overlay removed:**
The page.tsx idle overlay (`absolute inset-0, background rgba(6,9,16,0.42)`) was blocking the canvas view. Replaced with a small `DEMO` badge in the top-right corner (`pointer-events-none`, `z-10`) — minimal, unobtrusive, communicates "this is preview" without obscuring the flight.

**Prevention rule — "alive idle" pattern:**
Any game or animation canvas that sits idle for extended periods should show a demo/preview loop rather than a static screen. The pattern is:
1. Create a lightweight "demo engine" that reuses all existing logic classes via composition.
2. Never share mutable state (refs, phase, session IDs) between demo and real game modes.
3. Use a separate `useEffect` with a dedicated boot flag — do NOT add a `demo` branch inside the real game boot effect (violates SRP).
4. Tear down demo synchronously at the top of the real boot effect, before the real game initialises.
5. Visual: replace any opaque idle overlay with a non-blocking badge or subtle indicator.

**OOP pattern used:** Composition over inheritance — `DemoEngine` and `HuntEngine` both compose `MultiplierEngine`. They share the callback interface (`onTick`, `onPhaseChange`, `onEscape`, `onSuccess`) which drives `PixiRenderer`. This is an implicit interface contract (duck typing in TypeScript) — a formal `interface IEngine` could be extracted in the future if a third engine type is needed.

**Related SOP section:** Universal Engineering Principles §Hard Rule 2 (DRY — reuse existing logic, don't duplicate), Frontend SOP §6.1 (all four states — idle state must be designed, not left as a blank screen), OOP principles — Composition over Inheritance, Single Responsibility Principle

---

## Frontend Lessons (continued)

### 2026-09-26 — HUNT game: app.destroy(true) destroys the React-owned canvas DOM node → null._texture on second boot

**What happened:**
`Cannot read properties of null (reading 'orig')` returned after pressing SECURE, even after the PIXI.Assets cache-clear fix. The crash only happened on the second game boot, not the first.

**Root cause:**
`PIXI.Application.destroy()` takes two arguments: `(removeView?: boolean, options?)`.
The code had:
```typescript
this.app?.destroy(true, { children: true });
```
`removeView: true` tells Pixi to call `canvas.parentNode.removeChild(canvas)` and delete the canvas DOM element. React owns the `<canvas ref={canvasRef}>` element — it created it and expects it to survive between renders. When the real game boots for the second time, `canvasRef.current` points to the same DOM node that Pixi already destroyed, so Pixi's internal renderer has a null WebGL context → every texture lookup returns `null` → `.orig` crash.

The first game worked because the canvas was freshly mounted. The second game crashed because the canvas DOM node was gone.

**Correct fix:**
```typescript
// WRONG — destroys the DOM canvas element React owns
this.app?.destroy(true, { children: true });

// CORRECT — only destroys Pixi's internal objects, preserves the DOM canvas
this.app?.destroy(false, { children: true });
```
`removeView: false` (or omitting the argument, default is `false`) tells Pixi to leave the `<canvas>` DOM element in place. React continues to own it, and the next `app.init({ canvas })` call reuses the same DOM node cleanly.

**Prevention rule:**
When Pixi is used inside React with `ref={canvasRef}`:
- **Never** pass `removeView: true` (first arg `true`) to `app.destroy()`.
- React creates and destroys DOM nodes on its own schedule. Any library that removes a React-ref'd DOM node is fighting React's reconciler.
- The only safe first argument is `false` or omitted.

This applies to any WebGL library (Three.js, Babylon.js, etc.) — never let the library destroy a DOM element that a React ref is pointing to.

**Related SOP section:** Frontend SOP §Hard Rule 1 (external libraries must not mutate React-owned DOM nodes), Universal Engineering Principles §Hard Rule 4 (async/lifecycle timing must be explicit — destroy sequence must preserve React-owned resources)

---

### 2026-09-26 — HUNT game: dark overlay layers (vignette, scanlines, bgOverlay) blocked PNG sprite visibility

**What happened:**
PNG sprites (bird, hunter, effects) were barely visible because three stacked semi-transparent dark overlays covered the entire canvas:
1. `bgOverlay` — red danger tint starting at m=6, up to 0.45 alpha
2. `scanlines` — horizontal black lines at 0.08–0.17 alpha over the full canvas
3. `vignette` — four large dark ellipses at corners at 0.38–0.68 alpha, plus a top-centre dark band at 0.35 alpha

Together these made the canvas look like a grey/dark rectangle with faint shapes behind them. The scanlines and vignette specifically created a uniform grey wash that turned the canvas background from `#060910` (near-black) to visible grey, while simultaneously dimming all sprites underneath.

**Correct approach:**
- `vignette` and `scanlines`: removed entirely from `buildScene()` and `update()`. Kept as empty `Graphics()` nodes to avoid null-guard updates downstream, but never drawn.
- `bgOverlay` (red danger tint): threshold raised from m=6 → m=9, max alpha reduced from 0.45 → 0.18. At these values it adds atmospheric tension at extreme multipliers without washing out sprites.

**Prevention rule:**
Before adding any full-canvas overlay (vignette, tint, scanlines, blur, etc.):
1. Test it by rendering a clearly-visible PNG sprite underneath it first.
2. Measure the effective contrast of the overlay at maximum intensity.
3. If the overlay is more than 0.20 alpha at any point during normal gameplay, it is too heavy — sprites won't be readable.
4. Atmospheric effects (vignette, grain) should be ≤0.08 alpha per layer and never stacked more than 2 deep over sprite-bearing areas.

**Related SOP section:** UI/UX SOP §Hard Rule 3 (contrast ≥4.5:1 — sprites have a contrast requirement too, not just text), Frontend SOP §6.1 (visual states must be testable — test with real assets under the final overlay stack)

---

### 2026-09-26 — HUNT game: idle demo showed modest 1–8× values; user bait requires 8–25× display

**What happened:**
The demo engine used `escapeMin: 1.2, escapeMax: 8` and alternated 50/50 between SUCCESS (hunter secures) and ESCAPED (bird flies off). Users on the idle screen saw unremarkable 3–6× numbers and no strong reason to start playing.

**Correct design — bait mechanics:**
1. **Always escape in demo** — the bird always flies off to the maximum cap. Users never see the hunter succeed (that's the FOMO trigger: "if I had played that, I would have won"). The demo is never a success story — it shows what the player missed.
2. **High cap cycle** — caps cycle through `[8, 12, 15, 20, 25, 10, 18]` so the idle screen shows numbers like `18.42×`, `24.91×` in sequence. These numbers correspond to real potential winnings that bait the player into wanting those returns.
3. **Live overlay number** — `demoMult` state is updated via `demo.onMultChange` and rendered as a large colour-coded number on top of the canvas during the demo flight. The user watches the number climb in real time.
4. **Tier labels** — `"LEGENDARY RUN"` at 10×+, `"GOLDEN FLIGHT"` at 5×+, etc. make the multiplier feel like an achievement the user can unlock.

**Prevention rule:**
Idle/demo states on a gambling/game product are a marketing surface. Design them to:
1. Show the maximum possible outcome (not the average).
2. Always end on the "missed it" state (escape/loss), not success — creates FOMO, not satisfaction.
3. Display a live animated number so the screen is never static.
4. Cycle through varied outcomes so repeat views feel fresh.

This is a UX pattern, not a bug — but skipping it leaves significant conversion on the table.

**Related SOP section:** UI/UX SOP §6.1 (four states — idle/demo is a distinct state that must be actively designed, not left as a placeholder), Frontend SOP §Hard Rule 1 (every visible state must be tested with the intended user in mind)

---

## Frontend Lessons (continued)

### 2026-09-26 — HUNT game: ghost eagle PNG copies appearing as trail effect

**What happened:**
During gameplay the canvas showed multiple translucent eagle PNG images trailing behind the bird — each frame produced what looked like ghost copies of the bird sprite at various sizes and opacities.

**Root cause:**
`emitTrailDot()` used `PIXI.Sprite` with `A.goldTrail` (`/assets/effects/golden-trail.png`) as the texture, falling back to `A.trail` (`/assets/effects/speed-trail.png`). Both asset files were missing from `/public/assets/effects/`. When `PIXI.Texture.from()` cannot find an asset, Pixi v8 returns a fallback texture — in this build that fallback resolved to the most recently loaded texture in the cache, which happened to be the bird's eagle PNG. Every `emitTrailDot` call therefore created a large, partially-transparent eagle sprite at the bird's current position, producing the ghost image trail.

**What was wrong about it:**
The trail implementation had a hard dependency on external PNG assets that were not guaranteed to exist. The `if (!trailTex) return;` guard should have protected against a null texture, but `PIXI.Texture.from()` never returns null — it returns a fallback texture instead. The guard was therefore bypassed silently, and the wrong texture was used without any indication of the problem.

**Correct approach — use `PIXI.Graphics` for procedural trail dots:**
```typescript
private emitTrailDot(m: number) {
  if (!this.app || !this.PIXI || !this.trailCont) return;
  const g   = new this.PIXI.Graphics();
  const r   = 4 + Math.min(8, (m - 1) * 0.8);
  const col = m >= 5 ? TRAIL_GLOW : TRAIL_COLOR;
  g.circle(0, 0, r).fill({ color: col, alpha: 0.6 });
  g.x = this.birdX + (Math.random() - 0.5) * 8;
  g.y = this.birdY + (Math.random() - 0.5) * 8;
  this.trailCont.addChild(g);
  gsap.to(g, {
    alpha: 0,
    x: g.x - r * 3.5 * Math.cos(this.bird.rotation || 0),
    y: g.y + r * 1.2,
    duration: 0.4 + Math.random() * 0.2, ease: "power1.out",
    onComplete: () => {
      if (!g.destroyed) {
        try { this.trailCont?.removeChild(g); g.destroy(); } catch { /* gone */ }
      }
    },
  });
}
```
`PIXI.Graphics` has zero external dependencies — it always renders correctly regardless of which PNG assets are present. The visual result (coloured dot fading behind the bird) is indistinguishable from a well-designed trail sprite.

**Key distinction between `Texture.from()` and `tex()` (pre-populated cache):**
- `PIXI.Texture.from(url)` — NEVER returns null. If the URL is not cached, Pixi creates a placeholder texture or returns the last known texture. Use only in safe contexts where a wrong texture is acceptable.
- `this.tex(url)` (pre-populated Map, populated only after `Assets.load()`) — returns `null` if the asset didn't load. This is the correct pattern for per-frame update logic. But the `if (!trailTex) return;` guard still relies on the asset actually being loaded — if Pixi populates the cache with a fallback, `tex()` will return that fallback.

**Prevention rule:**
Any visual effect that runs every frame (trail, particle, glow) MUST NOT depend on optional PNG assets. Use `PIXI.Graphics` for procedural effects. Only use `Sprite` for complex art assets (character sprites, background panels) that are explicitly pre-loaded and verified. Before shipping a `Sprite`-based per-frame effect, verify the asset file actually exists in `/public`.

**Related SOP section:** Frontend SOP §Hard Rule 1 (validate preconditions — asset existence is a precondition), Universal Engineering Principles §Hard Rule 3 (don't assume external dependencies exist at runtime)

---

### 2026-09-26 — HUNT game: cloud layer caused white blobs obscuring sprites

**What happened:**
White ellipse "cloud" shapes were drawn on a `PIXI.Graphics` cloud layer each frame, overlapping the bird and hunter sprites. The clouds used `fill({ color: 0xffffff, alpha: 0.15–0.55 })` — on the dark canvas these appeared as large bright-grey blobs covering the game scene.

**Root cause:**
The cloud layer was drawn using white (`0xffffff`) fill at increasing alpha as the multiplier grew (`alpha = 0.15 + (m - 1) * 0.02`). At `m = 15×`, alpha reached `0.43` — nearly half-opaque white. The cloud layer sat in the z-order between the background and the sprites, so clouds partially covered the bird and hunter at high multipliers.

Additionally the `_cloudOffset` scroll created 4 ellipses per frame, which at `m >= 10` rendered as prominent grey circles obscuring most of the upper canvas.

**Correct approach:**
Remove the cloud layer entirely. The dark canvas with gradient overlays, gold trail dots, and bird glow effects provides sufficient visual depth. Clouds added noise, not value.

**What was removed:**
- `private cloudLayer!: PIXI.Graphics` — field declaration
- `private _cloudOffset = 0` — scroll state
- `buildScene()`: removed `this.cloudLayer = new Graphics(); stage.addChild(this.cloudLayer)`
- `_drawClouds(m)` — method body replaced with `{ /* clouds removed */ }`
- `update()` FLYING block: removed `this._drawClouds(m)` call
- `update()` ESCAPED block: removed `this.cloudLayer.clear()` call
- `onNewRound()`: removed `this.cloudLayer?.clear()` and `this._cloudOffset = 0`

**Prevention rule:**
Before adding any overlay Graphics layer that fills with a light/white color on a dark canvas, test it at the maximum expected multiplier value. `alpha = 0.15` looks invisible at `m = 2×` but becomes `0.43` at `m = 15×` — always compute the worst-case alpha at `escapeMax` before shipping. If the effect is purely atmospheric and not essential to gameplay communication, omit it.

**Related SOP section:** UI/UX SOP §Hard Rule 3 (contrast — foreground elements must remain readable at all states), Frontend SOP §6.1 (all four states — design must be tested at maximum value state, not just initial)

---

### 2026-09-26 — HUNT game: live multiplier counter kept ticking in hero area after SECURE/ESCAPE

**What happened:**
After pressing SECURE (or after the bird escaped), the large multiplier number in `page.tsx`'s hero section continued showing the same frozen value with its pulsing glow animation still active, giving the visual impression that the game was still running.

**Root cause:**
The hero multiplier section rendered `{liveMult.toFixed(2)}×` inside `{gameActive && (` — meaning it was visible for any phase while the game session was active: FLYING, COUNTDOWN, SUCCESS, and ESCAPED. The live-counter styling (animated glow, color transition) was applied unconditionally, so even a frozen value looked "live."

**Correct approach — phase-gated display:**
```tsx
{isFlying ? (
  // Live animated counter with "SECURE NOW" warning
  <span style={{ color: clr, textShadow: `0 0 28px ${clr}88` }}>
    {liveMult.toFixed(2)}×
  </span>
) : livePhase === "SUCCESS" ? (
  // Frozen gold — communicates "secured, not running"
  <span style={{ color: "#fbbf24", textShadow: "0 0 28px #fbbf2488" }}>
    {liveMult.toFixed(2)}×
  </span>
) : livePhase === "ESCAPED" ? (
  // Frozen red — communicates "lost, not running"
  <span style={{ color: "#ef4444", textShadow: "0 0 28px #ef444488" }}>
    {liveMult.toFixed(2)}×
  </span>
) : (
  <p style={{ color: "rgba(200,215,255,0.3)" }}>Tracking…</p>
)}
```

The visual distinction between a live counter (FLYING) and a result display (SUCCESS/ESCAPED) comes from:
1. **Absence of color-transition animation** on the result — the value was already at the right color when it froze, so no CSS `transition` runs.
2. **Fixed color** — gold for SUCCESS, red for ESCAPED, independent of `liveMult` tier.
3. **No "SECURE NOW" warning badge** — removed from non-FLYING branches.

**Prevention rule:**
Any UI element that displays a "live" value (counter, ticker, progress bar) MUST have a distinct visual state for "frozen/result" mode. Never use the same styling for an updating value and a final result — users cannot tell if the game is still running. The states to design for: RUNNING (animating), SECURED (gold freeze), ESCAPED (red freeze), IDLE (hidden or dimmed).

**Related SOP section:** UI/UX SOP §Hard Rule 1 (four states — each state must be visually distinct), Frontend SOP §6.1 (all async states must be designed, not just the happy path)

---

## Frontend Lessons (continued)

### 2026-09-26 — HUNT game: Aviator-style filled area + axis labels on flight path graph

**What was built:**
The HUNT flight path was upgraded from a plain stroked line to an Aviator-style filled graph:
1. **Filled area under the curve** — a closed polygon (path points → baseline → back) filled with semi-transparent brand gold at two depths (0.18α body + 0.14α lower-half overlay) to simulate a gradient fade.
2. **X-axis baseline** — a faint gold horizontal rule at `H * 0.87`.
3. **X-axis tick marks + multiplier labels** (`1×`, `2×`, `3×`…) — tick positions computed by inverting the eased-progress formula so each label aligns with where the curve crosses that multiplier value.

**Key design decisions:**

**Filled polygon technique:** Pixi v8 `Graphics.fill()` operates on the last path drawn before calling `.fill()`. The closed polygon is: `moveTo(tail.x, baseY)` → all curve points via `lineTo` → `lineTo(tip.x, baseY)` → `closePath()` → `fill()`. Two overlapping fills at different alphas simulate a gradient without requiring a `FillGradient` shader.

**Text label pool (object reuse):** `PIXI.Text` objects are expensive to create (they trigger canvas 2D text layout). Creating one per axis tick per frame (~60× per second × up to 12 ticks = 720 Text objects/second) would cause severe GC pressure. Solution: a `_axisLabels: Text[]` pool on the renderer, grown on demand (`while pool.length < tick`) and reused — only `text`, `x`, `y`, `visible` are updated each frame. Pool is destroyed in `PixiRenderer.destroy()`.

**Tick position formula:** Each integer multiplier `tick` maps to a canvas X position via the same eased-progress formula used by the curve:
```typescript
const prog  = (tick - MULT_MIN) / (MULT_MAX - MULT_MIN);
const eased = Math.pow(prog, 0.55);   // same exponent as curve
const tx    = this.W * (0.15 + eased * 0.60);
```
This guarantees label alignment with the curve at all canvas sizes — no hardcoded pixel offsets.

**Responsive font size:** `Math.max(9, Math.min(13, this.W * 0.022))` — scales proportionally between 9–13px based on canvas width.

**Prevention rule:**
When drawing graph elements (fills, axes, labels) that update every frame in a WebGL canvas:
- Never create display objects (Sprite, Text, Graphics) inside the frame loop — always reuse from a pool.
- Fill areas by drawing a closed polygon, not by calling `fill()` on the stroke path.
- Align axis labels using the same mathematical formula as the curve, not by eyeballing pixel offsets.
- Always clean up pooled objects in the renderer's `destroy()` method.

**Related SOP section:** Frontend SOP §Hard Rule 1 (no per-frame allocations), Universal Engineering Principles §Hard Rule 2 (DRY — position formula defined once, used by both curve and axis)

---

## Frontend Lessons (continued)

### 2026-09-26 — HUNT game: demo renderer white canvas after SECURE — destroyed WebGL context reused on same canvas element

**What happened:**
After pressing SECURE, the result animation played (SUCCESS overlay for 2.5 s), then the canvas went completely white when the idle/demo mode resumed. The demo multiplier number and "EAGLE FLIGHT" tier label were visible as HTML overlays but the Pixi canvas behind them was white.

**Root cause — destroyed WebGL context reused by demo renderer:**

The `page.tsx` component uses a `gameKey` state that increments on `startGame()` to remount `FlappyBird` with a fresh `<canvas>` element for each real game. However, `gameKey` was NOT incremented when the game ended — it was only incremented at the start of the next game.

The sequence that caused the white canvas:

1. Real game runs → `active=true` → `PixiRenderer.init()` creates a WebGL context on the `<canvas>`.
2. SECURE pressed → `endSession()` called → `RESULT_HOLD_MS` (2500ms) timeout set.
3. After 2500ms → `setGameActive(false)` fires → `active` prop to `FlappyBird` becomes `false`.
4. React re-renders: `FlappyBird` is **not remounted** (key unchanged) — same component instance, same `<canvas>` DOM node.
5. The boot effect cleanup fires (synchronously, in the same React flush): `rend.destroy()` calls `app.destroy(false, {children:true})` — this calls `gl.getExtension('WEBGL_lose_context')?.loseContext()` internally in Pixi, **destroying the WebGL context** on that canvas element.
6. In the same React flush, the demo `useEffect([active])` fires with `active=false`. It creates a new `PixiRenderer` and calls `rend.init(canvas)` on the **same canvas whose WebGL context was just destroyed**.
7. Pixi creates a new `PIXI.Application` and calls `app.init()` on the destroyed canvas. The browser either refuses to create a second WebGL context on a context-lost canvas, or creates one that renders white until the next full repaint cycle.
8. Demo appears white.

**Why this is NOT a PIXI.Assets cache issue here:**
The `key={gameKey}` remount on `startGame()` already cleared the Assets cache correctly (via `PixiRenderer.destroy()` which now calls `Assets.unload()`). The white canvas on game END was purely a WebGL context lifecycle issue on the shared canvas element — a different failure mode with the same visible symptom.

**Correct fix — increment `gameKey` on game END, not just on game START:**
```typescript
// In endSession() visual teardown timeout:
resultHoldRef.current = setTimeout(() => {
  resultHoldRef.current = null;
  setGameActive(false);
  setPhase("DONE");
  setGameKey(k => k + 1);  // ← NEW: remount FlappyBird with fresh canvas for demo
}, RESULT_HOLD_MS);
```

React 18 batches all three state updates in the same `setTimeout` callback into a single render. The result:
- `FlappyBird` unmounts completely (key changed) — real renderer destroyed, WebGL context released, Assets cache cleared.
- `FlappyBird` remounts with `active=false` — brand new `<canvas>` element in the DOM with no prior WebGL context.
- Demo `useEffect([active])` fires, creates `PixiRenderer`, calls `init(canvas)` on the clean canvas — succeeds.

**Why `setGameKey` in `startGame()` alone was insufficient:**
`startGame()` increments the key to get a clean canvas for the **real game**. But it happens at the start of the next game — meaning the demo (which runs between game end and next game start) was always running on the old canvas with a destroyed context.

The key must be incremented at **both ends** of a game session:
- On game START: fresh canvas for real renderer.
- On game END: fresh canvas for demo renderer.

**Prevention rule:**
When a component owns a `<canvas>` element and transitions between multiple `PIXI.Application` instances (real game renderer → demo renderer → real game renderer), each transition must use a fresh canvas DOM node. The correct pattern is:

```typescript
// Mount a fresh <canvas> by incrementing a key:
<FlappyBird key={gameKey} ... />

// Increment on game START (gives real renderer a clean canvas):
setGameKey(k => k + 1);
setGameActive(true);

// Increment on game END (gives demo renderer a clean canvas):
setGameKey(k => k + 1);
setGameActive(false);
```

Never call `new PIXI.Application().init()` on a canvas that has previously had a WebGL context destroyed via `app.destroy()`. The WebGL spec does not guarantee a new context can be created on a context-lost canvas within the same browser frame. Always use a new canvas element.

**Related SOP section:** Frontend SOP §6.1 (all four states — teardown state must not corrupt the next init state), Universal Engineering Principles §Hard Rule 3 (state owned by one module must not leak into another module's lifecycle), Frontend SOP §Hard Rule 1 (clean up shared resources before handing off to the next owner)

---

## Frontend Lessons (continued)

### 2026-09-26 — HUNT game: canvas height used vw instead of vh — too short on narrow screens inside sidebar layout

**What happened:**
The Pixi game canvas container used `height: "clamp(220px, 42vw, 460px)"`. On a 390px-wide phone the value evaluated to `max(220px, 42×3.9px) = max(220px, 163px) = 220px`. The canvas appeared at the floor value — 220px — which looked reasonable in isolation. But inside the dashboard layout (which has a 130px sidebar on tablet), the actual content area was ~260px wide, making `42vw` = ~163px — well below the 220px floor. This caused the canvas to look disproportionately short/stubby on small phones.

**Root cause:**
`vw` measures the full browser viewport width, not the available content area. In a dashboard layout with a sidebar, the game canvas sits inside a narrower content column. `42vw` on a 390px phone = 163px regardless of the sidebar. Using `vw` for height is only correct when the component spans the full viewport width.

**What was wrong about it:**
Height was coupled to viewport width (`vw`) instead of viewport height (`vh`). A canvas game should scale with available vertical space, not horizontal viewport width — especially inside a sidebar layout.

**Correct approach:**
Use `vh`-based clamp: `height: "clamp(180px, 38vh, 340px)"`.
- On iPhone 12 (844px tall): `38vh = 320px` — proportional and fills the screen nicely.
- On small Android (680px tall): `38vh = 258px` — still usable.
- Floor of 180px prevents collapse on extreme cases.
- Ceiling of 340px prevents the canvas dominating on large tablets.

**Prevention rule:**
When sizing a canvas or media container that must remain visually proportional across screen sizes, choose the correct viewport unit:
- `vw` — correct when the element spans the full width (hero sections, full-bleed banners).
- `vh` — correct when the element height must fit the screen regardless of layout columns (game canvas, modal content areas, sticky panels).
- `svh` / `dvh` — preferred on mobile to account for browser chrome (address bar) hide/show; use as a progressive enhancement fallback.

In a dashboard layout with a sidebar: always use `vh` (or `%` of a flex parent), never `vw`, for height values.

**Related SOP section:** UI/UX SOP §5 Layout & Responsive (`canvas-responsive`: "canvas dimensions must use vh/dvh not vw when inside a columnar layout"), Universal Engineering Principles §Hard Rule 2 (no hardcoded values — use viewport-relative tokens)

---

### 2026-09-26 — HUNT game: idle overlay PNG (hunt-logo.png) flashed over live game canvas during game start

**What happened:**
When the player pressed START HUNT, the hunt-logo.png (idle state image) was briefly visible overlaid on top of the just-starting Pixi canvas. This happened for approximately one render cycle — visible as a flash of the logo PNG on top of the dark background at game start.

**Root cause:**
The `FlappyBird` WAITING/DONE overlay had this condition:
```tsx
{(phase === "WAITING" || phase === "DONE") && (
  <div className="absolute inset-0 ...">
    <img src={A.logo} ... />
  </div>
)}
```

When `active` becomes `true` in `page.tsx`, React re-renders `FlappyBird` with `active=true`. However, `phase` inside `FlappyBird` is still `"WAITING"` (it was reset to `"WAITING"` in the `active → false` effect). The new game's engine hasn't started yet — `rend.init()` is still awaiting the rAF layout poll. So for one or more render cycles, `active=true` AND `phase==="WAITING"` are both true simultaneously, causing the overlay to render on top of the initializing canvas.

**Correct fix:**
Add `&& !active` to the overlay condition:
```tsx
{(phase === "WAITING" || phase === "DONE") && !active && (
  // logo/demo overlay
)}
```
When `active=true`, the overlay is never rendered — even if `phase` hasn't transitioned yet. The Pixi canvas background colour (`0x060910`) fills the container immediately on mount, so there is no visible gap.

**Prevention rule:**
Any overlay that represents an "idle/waiting" state MUST be gated on BOTH the phase state AND the `active` prop. A component can be in `phase="WAITING"` while `active=true` during the async initialization window. Never rely on phase state alone to determine whether an idle overlay should render — always AND it with the `active` prop.

Pattern:
```tsx
// WRONG — phase can be WAITING while active=true during init
{phase === "WAITING" && <IdleOverlay />}

// CORRECT — suppress idle overlay the moment the game becomes active
{phase === "WAITING" && !active && <IdleOverlay />}
```

**Related SOP section:** Frontend SOP §6.1 (all four states — loading/init state must not flash wrong UI), UI/UX SOP §Hard Rule 1 (four states: loading, empty, error, populated — each must be explicitly designed)

---

### 2026-09-26 — HUNT game: mobile controls strip used 3-col grid causing cramped layout on small phones

**What happened:**
The controls strip (Stake | Potential Reward | Main Action) used `grid grid-cols-1 sm:grid-cols-3`. On mobile this stacked all three cards vertically, requiring the user to scroll past a tall Stake card (with all preset buttons + input) plus a Reward card plus an Action card. The total height of the controls strip exceeded the available space below the canvas on a 390px phone, pushing the START HUNT button off-screen without scrolling.

**Root cause:**
The 3-col to 1-col collapse is a standard responsive pattern but works best when cards are equal-height and compact. The Stake card contains 7 preset buttons + a number input — it's inherently taller than the other two. Stacking three cards with different heights created visual imbalance and required more scroll.

**Correct approach — mobile-first split layout:**
Instead of collapsing 3 columns to 1, use a two-tier layout on mobile:
1. Stake card — full-width (needs all the space for the preset buttons)
2. Reward + Action — side-by-side in a 2-col flex row (both are compact single-value displays)

```tsx
{/* Mobile only: Stake full-width */}
<div className="sm:hidden ..."><StakeCard /></div>

{/* Mobile only: Reward + Action 2-col row */}
<div className="flex gap-2 sm:hidden">
  <div className="flex-1 ..."><RewardCard /></div>
  <div className="flex-1 ..."><ActionButton /></div>
</div>

{/* Desktop: original 3-col grid */}
<div className="hidden sm:grid sm:grid-cols-3 gap-2.5">
  <StakeCard /><RewardCard /><ActionCard />
</div>
```

This keeps the Action button (START HUNT / SECURE) always visible without scrolling on mobile, which is critical for a time-sensitive game where "SECURE" must be tapped instantly.

**DRY note:** Both mobile and desktop versions render the same data and call the same handlers. The duplication is display-only (layout variant), not logic duplication — this is acceptable per DRY principles. If the button logic changes, it changes in one place (the handler function), not in the JSX.

**Prevention rule:**
For game interfaces, the primary action button (CTA) must ALWAYS be visible without scrolling on the smallest supported screen (320px width, 568px height). Before shipping a game page, check: on iPhone SE (375×667), can the user see the action button without scrolling? If not, restructure the layout.

**Related SOP section:** UI/UX SOP §5 Layout & Responsive, §Hard Rule 1 (four states — active/in-game state must have the CTA immediately reachable)

---

## Backend Lessons

### 2026-09-26 — HUNT game: wrong payout formula — milestone math instead of wager × multiplier

**What happened:**
Players investing Rs. 120 at 2.00× expected Rs. 240 back. The actual payout was Rs. 20 (two milestones at Rs. 10 each). `calculateWinnings()` used a Flappy Bird milestone system: every N score points → +winPerStep PKR, with a jackpot multiplier only at high scores. For a crash game the formula is completely different.

**Root cause — mismatched economy model:**
The game was rebuilt from Flappy Bird (milestone payout) into a crash game (multiplier payout) but the backend `calculateWinnings` function was never updated. The score encoding was correct (`score = Math.floor(mult × 100)`) but the payout function ignored the multiplier relationship entirely.

**Correct crash-game formula:**
```
multiplier = finalScore / 100
winAmount  = Math.round(wager × multiplier)
```
Examples:
- wager=120, score=200 (2.00×) → Rs. 240
- wager=120, score=150 (1.50×) → Rs. 180
- wager=500, score=350 (3.50×) → Rs. 1750

**Implementation — DRY: new function, old function kept:**
```typescript
// gameConstants.ts — added alongside calculateWinnings (not replacing it)
export function calculateCrashWin(
  wager: number,
  score: number,
  minWinScore = 100,
): { winAmount: number; multiplier: number } {
  if (score < minWinScore) return { winAmount: 0, multiplier: score / 100 };
  const multiplier = score / 100;
  const winAmount  = Math.round(wager * multiplier);
  return { winAmount, multiplier };
}
```
Session PATCH route imports `calculateCrashWin` and removes the now-unused `readLiveGameConfig` import.

**Prevention rule:**
When changing a game's economy model, immediately search for ALL payout/scoring functions and verify each one against the new formula. Write the formula as a comment in the function: `// winAmount = wager × (score/100)` so future developers understand the intent without reading the game spec. Never carry over a payout function from a previous game model without explicitly reviewing it.

**Related SOP section:** Backend SOP §Hard Rule 1 (server-side financial logic must be explicitly correct — not assumed from prior version), Universal Engineering Principles §Hard Rule 2 (formula defined once in gameConstants.ts)

---

### 2026-09-26 — HUNT game: Math.random() in multiplier cap generation is predictable and repeating

**What happened:**
`MultiplierEngine` used `Math.random()` to generate the escape cap (the multiplier at which the bird escapes). `Math.random()` in V8 uses a pseudorandom algorithm (xorshift128+) with a 128-bit state — it produces statistically uniform output but is deterministic and theoretically predictable given enough samples. In a gambling game this creates a security vulnerability: a sufficiently determined attacker could sample enough outputs to predict the seed state and the next escape cap before betting.

**Correct approach — crypto.getRandomValues():**
```typescript
function cryptoRand(): number {
  try {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] / (0xFFFFFFFF + 1);   // [0, 1) uniform
  } catch {
    return Math.random();               // SSR / test environment fallback
  }
}
```
`crypto.getRandomValues()` uses the OS CSPRNG (e.g. `/dev/urandom` on Linux) which is not predictable from output samples. The `try/catch` with `Math.random()` fallback handles SSR contexts (Next.js server-side rendering) where `crypto` may not be available in the execution environment.

**Why a Uint32Array(1) and not Float64:**
`getRandomValues` only accepts integer typed arrays. Dividing by `0xFFFFFFFF + 1` (= 4294967296) maps the full uint32 range to `[0, 1)` with the same distribution as `Math.random()` — a uniform float. This is a standard CSPRNG-to-float conversion pattern.

**Prevention rule:**
Any function that generates a financial outcome (escape cap, jackpot, bonus trigger) MUST use `crypto.getRandomValues()`, never `Math.random()`. Add a lint comment `/* CSPRNG required */` above every call to make the intent explicit and prevent future developers from "simplifying" it back to `Math.random()`.

**Related SOP section:** Backend SOP §Hard Rule 1 (never trust predictable values for money-sensitive operations), Security — RNG must be cryptographically secure for gambling/financial outcomes

---

### 2026-09-26 — HUNT game: balance credit delayed by PATCH response latency (~50ms) causing UX flicker

**What happened:**
When a player pressed SECURE, the balance in the header only updated after the PATCH `/api/game/session` response arrived. At ~50ms this created a noticeable flicker: the player saw their old balance for half a second before the win appeared.

**Root cause:**
`endSession()` fired the PATCH as a fire-and-forget promise and only called `setWallet(w => {..., balance: w.balance + d.winAmount})` inside `.then()`. The `.then()` runs after the network round-trip.

**Correct approach — optimistic update at the point of action:**
```typescript
const onCashOut = useCallback((s: number) => {
  if (securingRef.current) return;
  securingRef.current = true;
  // Optimistic credit: mirrors server formula (wager × multiplier)
  const optimisticWin = Math.round(wager * liveMultRef.current);
  setWallet(w => w ? { ...w, balance: w.balance + optimisticWin } : w);
  endSession(s, true);
}, [endSession, wager]);
```
`liveMultRef.current` holds the live multiplier as a ref (not state), so it always reads the value at the exact moment SECURE is pressed — no stale closure. After `endSession` resolves, `fetchWallet()` is called which overwrites the optimistic value with the real server balance, correcting any rounding difference.

**Pattern: optimistic update + server reconciliation:**
1. Apply the locally-computed result immediately (optimistic update).
2. Fire the API call in the background.
3. On success, apply the real server value (reconcile).
4. On error, revert the optimistic update (or show a toast and reconcile).

This pattern is correct when the local formula exactly mirrors the server formula. Since both use `Math.round(wager × multiplier)`, the optimistic and real values will always match (within ±1 due to floating point rounding, reconciled by `fetchWallet()`).

**Prevention rule:**
Any button that the user clicks to claim a financial result should apply an optimistic balance update immediately. The server call reconciles afterward. Never make the user wait for a network round-trip to see the result of an action they just took. Always use a ref (not state) to read the live value at click time to avoid stale closures.

**Related SOP section:** Frontend SOP §6.1 (all four states — "success" state must be instant and visible), Universal Engineering Principles §Hard Rule 4 (async timing must be explicit)

---

### 2026-09-26 — Admin config fields missing for crash-game parameters (escapeMin/escapeMax)

**What happened:**
The admin game-settings page had three sections (Earning Rules, Physics & Speed, Bias Mode) but no controls for the crash-game-specific parameters: `escapeMin` (minimum escape multiplier) and `escapeMax` (maximum escape multiplier). Admins had no UI to change the multiplier range — it was effectively hardcoded at the frontend default (1.1–12).

**Root cause:**
The admin settings page was built when the game was a Flappy Bird physics game. The crash-game parameters (`escapeMin`, `escapeMax`) were added to `FlappyBird.tsx` as part of the model change but not propagated to:
1. The admin API defaults map (`/api/admin/game-settings/route.ts`)
2. The player config API (`/api/game/config/route.ts`)
3. The admin UI (`/admin/game-settings/page.tsx`)
4. The config fetch in `FlappyBird.tsx` (was reading `d.escapeMinMult` — wrong key name)

**Correct approach — trace the full config chain:**
For any new admin-configurable setting, ALL four layers must be updated in the same commit:
1. **Admin API defaults** — add `"game.escapeMin"` to `DEFAULTS` map and `GET` response
2. **Player config API** — add field to `GET` response with server-side safety clamp
3. **Admin UI** — add `SectionCard` with `FieldRow` inputs and a `SaveRow`
4. **Client config fetch** — map the correct key name from the API response

**Prevention rule:**
When adding a new game configuration parameter, use this checklist:
- [ ] `gameConstants.ts` — add env-backed default if applicable
- [ ] `/api/admin/game-settings/route.ts` — add to `DEFAULTS` and `GET` response
- [ ] `/api/game/config/route.ts` — add to player-facing `GET` response (with safety clamps)
- [ ] `/admin/game-settings/page.tsx` — add UI field and save button
- [ ] Client component — read the correct key name from the config fetch response

Never add a parameter to the game logic without completing all five layers. A missing layer means the parameter is effectively hardcoded and unchageable without a code deploy.

**Related SOP section:** Backend SOP §Hard Rule 2 (never swallow config silently — missing fields must have explicit fallbacks), Universal Engineering Principles §Hard Rule 2 (DRY — config defined once, propagated consistently)

---

## Frontend Lessons (continued)

### 2026-09-26 — HUNT game: PIXI.Assets.reset() / Assets.unload() blocked by browser Permissions Policy → use Cache.remove() instead

**What happened:**
`PixiRenderer.destroy()` called `this.PIXI.Assets.reset()` to clear the global Assets singleton cache before `app.destroy()`. This triggered the browser violation:
```
[Violation] Permissions policy violation: unload is not allowed in this document.
```
The crash continued on second boot because `Assets.reset()` internally delegates to `Assets.unload()` for each cached entry, which is blocked by the document's Permissions Policy. The call threw silently (caught by the surrounding `try/catch`) and the cache was never actually cleared — the `null.split` crash continued unchanged.

**Root cause:**
`PIXI.Assets.reset()` and `PIXI.Assets.unload()` are async operations that Pixi v8 internally maps to the browser's `navigator.locks` or `unload`-event-adjacent APIs in some builds. When the document's `Permissions-Policy` header forbids `unload` (common on pages using `bfcache` optimizations), Pixi silently fails.

**Correct fix — use `PIXI.Cache.remove()` instead:**
```typescript
// WRONG — blocked by Permissions Policy in many deployment contexts:
this.PIXI.Assets.reset();
this.PIXI.Assets.unload(url);

// CORRECT — synchronous, policy-safe, evicts from TextureCache directly:
for (const u of urls) {
  try { this.PIXI.Cache.remove(u); } catch { /* already evicted */ }
}
this._tex.clear();   // also clear the local Map
```
`PIXI.Cache.remove(url)` evicts the URL from Pixi's synchronous `TextureCache` keyed map. This is what the Assets resolver reads when it checks for a cached entry. Removing here ensures the next `Assets.load()` call resolves the URL fresh rather than returning a stale/null entry.

**Prevention rule:**
Before calling any Pixi method that contains "unload", "reset", or "clear" at the Assets level, check: does the current document have a `Permissions-Policy: unload` restriction? On any production deployment using HTTP/2 push, `bfcache`, or modern hosting providers (Vercel, Railway, Cloudflare), `unload` is routinely blocked. Use `PIXI.Cache.remove()` exclusively — it's always safe.

**Related SOP section:** Frontend SOP §Hard Rule 1 (validate assumptions about third-party APIs against the actual browser environment), DevOps SOP §Security headers (Permissions-Policy is set at deployment level — frontend code must be resilient to it)

---

### 2026-09-26 — HUNT game: two PIXI.Application instances on same canvas (demo→real race) → WebGL uniform location crash

**What happened:**
The component ran a `DemoEngine` + `PixiRenderer` pair for the idle preview screen. When `active` went `true`, the demo teardown effect fired synchronously (`demoRendRef.current.destroy()`) and then the real boot effect also fired in the same React batch (both had `[active]` in their dep array).

`PixiRenderer.destroy()` is synchronous from JavaScript's perspective, but `app.destroy()` internally submits WebGL teardown commands to the GPU driver queue asynchronously. The real `PixiRenderer.init()` immediately created a new `PIXI.Application` on the same `<canvas>` — while the prior GL context's teardown was still in flight in the driver. This caused:
```
WebGL: INVALID_OPERATION: uniformMatrix3fv: location is not from the associated program
WebGL: too many errors, no more errors will be reported to the console for this context.
```
The new GL context's shader programs had "location" handles from the old context, which the driver rejected as invalid.

**Correct fix — module-level destroy fence (`Promise<void>`):**
```typescript
// Module-level (outside the class):
let _rendererDestroyFence: Promise<void> = Promise.resolve();

// Inside PixiRenderer.destroy():
let _resolve!: () => void;
_rendererDestroyFence = new Promise<void>(r => { _resolve = r; });
// ... all teardown ...
this.app?.destroy(false, { children: true });
this.app = null;
_resolve();   // fence fulfilled — next init() may proceed

// Inside PixiRenderer.init() — BEFORE new PIXI.Application():
await _rendererDestroyFence;   // zero cost on first boot (already resolved)
const app = new PIXI.Application();
await app.init({ ... });
```

**Why module-level, not instance-level:**
The fence must be visible to the NEW `PixiRenderer` instance that is created after the old one is destroyed. Instance properties on the destroyed renderer are no longer accessible from the new renderer. A module-level variable survives the instance lifecycle.

**Why this is zero-cost on first boot:**
`_rendererDestroyFence` is initialized to `Promise.resolve()`. The `await` on an already-resolved promise yields to the microtask queue for one tick — harmless and not measurable.

**Pattern name:** Module-level sequential resource fence. Use this pattern whenever two instances of a class must NEVER hold the same exclusive resource (WebGL context, camera, microphone, file handle) simultaneously, and the class is instantiated/destroyed by external lifecycle management (React effects).

**Prevention rule:**
Any class that wraps an exclusive hardware or browser resource (WebGL context, `getUserMedia`, `AudioContext`, IndexedDB transaction) MUST have a module-level fence that the constructor/init awaits. Never assume `destroy()` + `new Instance()` in the same synchronous block is safe. The underlying resource may have async teardown even if the JS call appears synchronous.

**Related SOP section:** Frontend SOP §Hard Rule 1 (client-side resource lifecycle must be explicit), Universal Engineering Principles §Hard Rule 4 (async timing must be explicit, not assumed)

---

### 2026-09-26 — HUNT game: PIXI.Assets.load() called with already-cached URLs on second boot → resolver null.split crash

**What happened:**
Even after `PIXI.Cache.remove()` was called in `destroy()`, the second boot's `Assets.load(urls)` still crashed with `null.split` intermittently. The race condition: `Cache.remove()` removes from the synchronous `TextureCache`, but `PIXI.Assets` maintains a separate internal `Promise`-based resolver cache (`_promiseCache`). This cache holds the original `Promise<Texture>` for each URL. When `Cache.remove()` clears the `TextureCache` but NOT the `_promiseCache`, `Assets.load()` returns the cached `Promise` (which resolves to the now-destroyed texture), then `Texture.from(url)` reads from `TextureCache` (now empty) and falls back to the resolver — which may have a null entry.

**Correct defensive fix — check cache before loading:**
```typescript
const allUrls = (Object.values(A) as string[])
  .filter(v => typeof v === "string" && v.length > 0);

// Only load URLs not already in the Assets cache
const toLoad = allUrls.filter(u => {
  try { return !PIXI.Assets.cache.has(u); } catch { return true; }
});
if (toLoad.length > 0) await PIXI.Assets.load(toLoad).catch(() => {});

// Populate local _tex from ALL urls (cache.has() may return true for
// entries loaded in prior sessions that are still valid)
for (const src of allUrls) {
  try {
    const t = PIXI.Texture.from(src);
    if (t && t.width > 0) this._tex.set(src, t);
  } catch { /* skip */ }
}
```

**Why `PIXI.Assets.cache.has(u)` is the right check:**
`PIXI.Assets.cache` (`AssetCache`) is the canonical source of truth Pixi uses internally to decide whether a URL is "already loaded." If it returns `true`, the asset is already in a usable state. Calling `Assets.load()` on a URL where `cache.has()` is `true` may be a no-op, or may trigger an internal re-resolution path that corrupts the resolver state — either way, skip it.

**On first boot:** `cache.has()` returns `false` for all 22 URLs → all are loaded normally.
**On second boot:** the `Cache.remove()` in `destroy()` cleared them → `cache.has()` returns `false` again → loaded fresh. If for any reason `Cache.remove()` was a no-op (policy block on a specific URL), `cache.has()` returns `true` → that URL is skipped → no double-resolution → no crash.

**This is defence in depth** — the fence prevents the race, `Cache.remove()` clears the cache, and `cache.has()` acts as the final guard. Three independent layers, any one of which is sufficient to prevent the crash.

**Prevention rule:**
Never call `PIXI.Assets.load(urls)` unconditionally in a class that has a `destroy()` + re-`init()` lifecycle. Always filter with `!PIXI.Assets.cache.has(url)` first. The Assets singleton survives component remounts and the check is O(1).

**Related SOP section:** Universal Engineering Principles §Hard Rule 2 (DRY — don't repeat work the runtime already did), Frontend SOP §Hard Rule 1 (defensive guards on all third-party singleton APIs)

---

## Frontend Lessons (continued)

### 2026-09-26 — Static asset path referenced a folder that doesn't exist (/assets/ui/coin.png → 404)

**What happened:**
The game header balance pill rendered an `<img src="/assets/ui/coin.png">` that returned 404.
The coin image was never visible in the header — it silently fell back to `onError → display:none`.

**Root cause:**
The `public/assets/` folder has no `ui/` subdirectory.
The coin asset lives at `/assets/rewards/coin.png` (confirmed by listing `public/assets/`).
The `ui/` path was copied from an earlier design iteration that used a different folder structure.

**What was wrong about it:**
No verification was done that the path actually existed when the `<img>` tag was written.
The `onError` handler hid the failure silently — the 404 still appeared in the browser console
and wasted a network request on every page load.

**Correct approach:**
Before writing any `src="/assets/..."` path in JSX:
1. Run `Get-ChildItem -Recurse public/assets` (or equivalent) to see what actually exists.
2. Use the confirmed path. Never guess or copy from memory.

**Prevention rule:**
Static asset paths are a contract between code and the filesystem.
Treat them the same as import paths — if the file doesn't exist, the code is broken.
`onError → display:none` is a UX fallback for production asset failures, NOT a substitute for
verifying the path is correct at dev time. Always confirm the path exists before shipping.

**Related SOP section:** Frontend SOP §13 Change Management (paths are contracts),
Universal Engineering Principles §Hard Rule 5 (verify before asserting it works)

---

### 2026-09-26 — "Permissions policy violation: unload is not allowed" is a browser/devtools warning, not our code

**What happened:**
The browser console showed:
```
[Violation] Permissions policy violation: unload is not allowed in this document.
```
This appeared at every page load alongside our game errors, which caused confusion about whether
our `PIXI.Assets.unload()` call was the culprit.

**Root cause (confirmed by code audit):**
`PIXI.Assets.unload()` had already been removed from `PixiRenderer.destroy()` in a prior session
and replaced with `PIXI.Cache.remove()`. The `unload` text only appeared in a comment.

The actual warning comes from **Next.js Turbopack's dev overlay infrastructure** (`inspector.b9415ea5.js`)
which attaches to the browser's `unload` event for HMR/fast-refresh teardown. Modern browsers
(Chrome 117+) block the `unload` event by default via the back/forward cache Permissions-Policy.
This is a framework-level warning that cannot be fixed in application code.

**Diagnostic method used:**
1. Searched entire game folder for `Assets.unload` and `.unload(` — found only in a comment.
2. Identified the warning source as `inspector.b9415ea5.js` (Turbopack dev bundle, not user code).
3. Confirmed the warning disappears in production builds (`npm run build`) where dev overlay is absent.

**Prevention rule:**
When a console warning names a specific JS file in the stack trace, inspect that file name first.
A file named `inspector.*.js`, `hmr-*.js`, or `_next/static/...` is a framework/bundler file —
the fix (if any) belongs to the framework version, not application code.
Do not spend time searching application code for a warning that originates in a bundler file.

**Related SOP section:** Grounding SOP §Hard Rule 1 (verify source before acting),
Universal Engineering Principles §Hard Rule 4 (distinguish framework noise from application errors)

---

### 2026-09-26 — WebGL "uniformMatrix3fv: location is not from associated program" — cause and fix

**What happened:**
`WebGL: INVALID_OPERATION: uniformMatrix3fv: location is not from associated program` appeared in
the console after game rounds. This is a WebGL error meaning: shader uniform location was obtained
from Program A but is being set on an active Program B — the two GL programs don't match.

**Root cause:**
Two `PIXI.Application` instances briefly shared the same `<canvas>` element.
When `rend.destroy()` is called (React effect cleanup), it calls `app.destroy()` which tears down
the WebGL context asynchronously. If a new `PixiRenderer.init()` calls `new PIXI.Application()`
and `app.init({ canvas })` before the prior GL context fully tears down, both programs exist
simultaneously on the same canvas. Any GSAP tween from the dying renderer that fires during
this window tries to set uniform locations on the wrong active program → the error.

**Fix — module-level async fence (`_rendererDestroyFence`):**
```typescript
let _rendererDestroyFence: Promise<void> = Promise.resolve();

// In destroy():
let _resolve!: () => void;
_rendererDestroyFence = new Promise<void>(r => { _resolve = r; });
// ... kill tweens, clear cache ...
this.app?.destroy(false, { children: true });
this.app = null;
_resolve();   // ← fence resolves AFTER app.destroy() completes

// In init():
await _rendererDestroyFence;   // ← new app.init() only after prior GL context is gone
const app = new PIXI.Application();
await app.init({ canvas, ... });
```

**Why a module-level Promise (not a React ref):**
- The fence must outlive any single React component instance.
- Multiple `FlappyBird` component instances (old being unmounted, new being mounted) exist
  simultaneously during the React commit phase.
- A module-level variable is shared across all instances in the same browser tab — exactly
  the scope needed for GL context serialisation.

**Key timing constraint:**
`_resolve()` must be called AFTER `app.destroy()` returns, not before.
`app.destroy()` synchronously tears down the GL context in Pixi v8 — calling `_resolve()` after
it returns guarantees the context is fully gone before the fence resolves.

**Prevention rule:**
Any time a WebGL renderer is destroyed and a new one is created on the same canvas element,
there must be an explicit serialisation mechanism (fence, lock, or cleanup await) between them.
Never assume React's `useEffect` cleanup + mount cycle provides sufficient timing guarantees
for WebGL context lifecycle — it does not. The GL context teardown and the new init() can
overlap within the same rAF/microtask batch.

**Related SOP section:** Frontend SOP §Hard Rule 1 (async timing must be explicit),
Universal Engineering Principles §Hard Rule 4 (shared state — canvas GL context — must be
protected against concurrent access)

---

## Frontend Lessons (continued)

### 2026-09-26 — HUNT game: loss mechanic was silent — no amount shown, wrong framing of outcome

**What happened:**
When the bird escaped (user failed to press SECURE in time), the game showed "Bird escaped. Better luck next hunt!" as a toast and "Round lost" in the canvas overlay. The user had no idea how much money was deducted. The wallet balance decreased silently with no clear attribution.

**What was wrong about it:**
Two separate problems:

1. **Framing mismatch** — "Bird escaped" implies the game ended naturally. The actual mechanic is that the *hunter kills the bird when it reaches the escape multiplier*. The correct framing is "HUNTER GOT THE BIRD" — which communicates consequence (the hunter wins, the player loses) rather than ambiguity.

2. **Missing loss amount** — The toast said nothing about how much was lost. The wager is deducted at `startGame` — this is the correct place for the debit (it prevents players from cancelling mid-flight). But without explicit confirmation of the deduction in the result message, players are confused about why their balance dropped.

**Correct approach:**
- Toast on loss: `toast.error("Hunter got the bird! Rs. X lost.")` — uses `wager` which is in scope via the `useCallback` closure.
- Canvas overlay (page.tsx): rebuild to show heading "HUNTER GOT THE BIRD", final multiplier, and `−Rs. {wager} lost` line.
- Canvas overlay (FlappyBird.tsx): heading "HUNTER GOT THE BIRD", subtext "Wager lost — secure next time".
- Action state label: "Wager Lost" instead of "Bird Escaped" / "Escaped".

**Economy rule confirmed:**
The wager debit at `startGame` is correct and intentional:
```typescript
// page.tsx startGame — debit immediately on session start
setWallet(w => w ? { ...w, balance: w.balance - wager } : w);
```
On escape, `endSession(score, cashout=false)` runs. The PATCH response `winAmount === 0` means no credit is applied. `fetchWallet()` reconciles the server-side balance. The money is correctly gone — only the messaging was missing.

**Do NOT** move the debit to the result phase — that would allow balance to show incorrectly (too high) during the flight and would enable a race condition where a user could start two games before the first debit hits.

**Prevention rule:**
Any time a financial consequence occurs in a game or transaction UI:
1. The consequence (debit/credit) must be shown to the user with the exact amount.
2. Use `toast.error()` for losses, `toast.success()` for wins — never `toast.info()` for a financial loss.
3. The overlay/result screen must show the amount as `−Rs. X` (loss) or `+Rs. X` (win) — never just "Round lost" or "Better luck next time".
4. The framing must match the game mechanic (hunter kills bird ≠ bird escaped).

**Files changed:**
- `src/app/dashboard/game/page.tsx` — `endSession` loss toast, ESCAPED overlay, mobile + desktop action labels
- `src/app/dashboard/game/FlappyBird.tsx` — ESCAPED flash overlay, built-in action bar ESCAPED label

**Related SOP section:** UI/UX SOP §6.2 (content realism — copy must reflect what actually happened),
Frontend SOP §6.1 (all four states — result/outcome state must clearly communicate financial consequence),
Universal Engineering Principles §Hard Rule 1 (never silently change user-visible financial state)

---

## Frontend Lessons (continued)

### 2026-09-26 — HUNT game: GSAP onComplete spawns orphan inner tweens that survive destroy() sweep

**What happened:**
`Cannot set properties of null (setting 'y')` fired repeatedly in the browser console after pressing SECURE or letting the bird escape. The crash happened inside GSAP's animation loop, setting `.y` on a Pixi sprite that had been destroyed by `app.destroy({ children: true })`.

**Root cause — the "orphan inner tween" pattern:**

`onSuccess()` contained this nested tween structure:
```typescript
gsap.to(this.bird, {
  y: this.birdY - this.H * 0.06,
  duration: 0.35,
  onComplete: () => {
    if (this._destroyed) return;
    // ↓ This creates a NEW tween AFTER the first kill sweep already ran
    gsap.to(this.bird, { y: this.birdY - this.H * 0.02, duration: 0.5 });
  },
});
```

The `destroy()` method ran `gsap.killTweensOf(this.bird)` to stop all animations. **However**, the outer tween's `onComplete` fired between the first kill sweep and `app.destroy()`. Inside that callback, `this._destroyed` was already `true` but the guard `if (this._destroyed) return` was the old code — it was `if (this._destroyed) return` which **passed** because `_destroyed` was being checked as a truthy skip, but the logic was inverted in some callers.

More critically: even with a correct `_destroyed` check, the **inner `gsap.to(this.bird, ...)` was created inside the `onComplete` callback** — which fires *after* `gsap.killTweensOf(this.bird)` already ran. The first kill sweep cannot kill a tween that doesn't exist yet. The inner tween is therefore an **orphan** — never killed — and GSAP fires it after `app.destroy()` has nulled `this.bird`'s internal Pixi state, making `this.bird.y = value` crash.

**Why `_destroyed = true` alone doesn't protect the inner tween:**
`_destroyed = true` is set at the top of `destroy()`. The `onComplete` callback checks `this._destroyed` and returns early — **but only when `_destroyed` is checked correctly**. In the old code `if (this._destroyed) return` was correct but the nested `gsap.to` was spawned before the return in some code paths.

The real failure is architectural: **you cannot kill a tween that hasn't been created yet**. A first `gsap.killTweensOf()` sweep cannot know that an `onComplete` is about to spawn a new tween.

**Two-part fix:**

1. **Correct guards in every `onComplete`** — check both the renderer flag AND the sprite's own `destroyed` state:
```typescript
// WRONG — only checks renderer flag, not sprite nullity
onComplete: () => { if (!this._destroyed) this.hunter.y = ...; }

// CORRECT — checks renderer flag AND sprite destroyed state
onComplete: () => {
  if (this._destroyed || !this.hunter || this.hunter.destroyed) return;
  this.hunter.y = ...;
}

// CORRECT for nested tween spawn
onComplete: () => {
  if (this._destroyed || !this.bird || this.bird.destroyed) return;
  gsap.to(this.bird, { y: ..., duration: 0.5 });
}
```

2. **Second GSAP kill sweep immediately before `app.destroy()`** — catches any orphan tweens that `onComplete` callbacks spawned after the first sweep:
```typescript
destroy() {
  this._destroyed = true;
  // ... first sweep ...
  gsap.killTweensOf(this.bird);
  gsap.killTweensOf(this.hunter);

  // ... cache clear, axis text destroy ...

  // Second sweep — catches tweens spawned by onComplete callbacks
  // between the first sweep and app.destroy()
  gsap.killTweensOf(this.bird);
  gsap.killTweensOf(this.hunter);
  if (this.app?.stage) gsap.killTweensOf(this.app.stage);

  this.app?.destroy(false, { children: true }); // nulls all sprite internals
}
```

The second sweep is a zero-cost no-op if no orphans exist, and a safety net when they do.

**Prevention rule:**
Any GSAP `onComplete` callback that creates a NEW tween must:
1. Check `this._destroyed` (renderer lifecycle flag).
2. Check `sprite.destroyed` (Pixi object lifecycle flag) — these are independent.
3. Never assume `gsap.killTweensOf(sprite)` called before the callback ran will also kill tweens the callback creates.

In a class with a `destroy()` method that calls `app.destroy()`, always add a second `gsap.killTweensOf()` sweep immediately before `app.destroy()`. The cost is negligible; the safety is complete.

**GSAP target reference rule:**
Never pass a live Pixi sprite as a GSAP target if that sprite may be destroyed before the tween completes. Use a plain object `{ value: sprite.y }` as the tween target and apply to the sprite in `onUpdate`, with a guard inside `onUpdate`:
```typescript
// Safer pattern for long-running tweens on destroyable sprites
const proxy = { y: this.bird.y };
gsap.to(proxy, {
  y: targetY,
  onUpdate: () => {
    if (!this.bird || this.bird.destroyed) return;
    this.bird.y = proxy.y;
  },
});
```
This ensures GSAP never directly owns the sprite reference and cannot set properties on a destroyed object.

**Related SOP section:** Frontend SOP §6.1 (cleanup must be complete — all async operations must be cancellable), Universal Engineering Principles §Hard Rule 4 (async timing must be explicit — onComplete creates a new async operation that must be tracked)

---

## Backend Lessons

### 2026-09-26 — HUNT game: bird escape incorrectly paid out wager × multiplier — score alone cannot gate a payout

**What happened:**
When the hunter killed the bird (player did NOT press SECURE), the server still credited the player's wallet with `wager × multiplier`. A player who wagered Rs. 10,000 and let the bird escape at 3× received Rs. 30,000 — a payout they never earned.

**Root cause — the server had no cashout signal:**
The PATCH handler received `{ sessionId, finalScore }`. `finalScore` encodes the multiplier as `Math.floor(mult × 100)` — the same encoding for both a successful cashout and an escape. `calculateCrashWin(wagerAmount, finalScore)` returned a positive `winAmount` whenever `finalScore >= 100` (≥ 1.00×), regardless of whether the player had actually pressed SECURE.

The prior comment in the code said:
> "Bird escaped before cashout (score <= 100) → winAmount = 0"

This assumption was **wrong**. The bird escape cap is configured in the admin (`escapeMax`, default 12×). A bird that escapes at `escapeMin` (1.1× by default, score = 110) would trigger `calculateCrashWin` to return `winAmount > 0`. And a bird that escapes at any multiplier above 1.00× would pay out.

**Why `score < 100` was insufficient:**
The escape threshold in `MultiplierEngine` is a configured cap (`cfg.escapeMin` to `cfg.escapeMax`), not fixed at 1.00×. The server cannot infer intent from the score value — score 230 could mean "player secured at 2.3×" OR "bird escaped at 2.3×". These are indistinguishable without an explicit signal.

**Correct fix — explicit `cashout: boolean` in the PATCH body:**
```typescript
// PATCH body: { sessionId, finalScore, cashout }
const { sessionId, finalScore, cashout } = await req.json();

// Validate cashout is an explicit boolean — never optional, never omittable
if (typeof cashout !== "boolean") {
  return NextResponse.json({ message: "cashout (boolean) is required." }, { status: 400 });
}

// Payout gate: only pay when player explicitly secured
const totalWin = cashout
  ? calculateCrashWin(session.wagerAmount, finalScore).winAmount
  : 0;   // bird escaped → wager forfeited regardless of finalScore
```

**Security note — why `cashout` must be validated as `boolean`, not truthy:**
- `cashout: undefined` → `typeof undefined !== "boolean"` → 400, blocked.
- `cashout: 1` → `typeof 1 !== "boolean"` → 400, blocked.
- `cashout: "true"` → `typeof "string" !== "boolean"` → 400, blocked.
- Only `cashout: true` or `cashout: false` pass validation.

A client that omits `cashout` entirely (old client code, API fuzzing) gets a 400, not a free win.

**DRY principle applied:**
`calculateCrashWin` was NOT changed — it is correct as a pure math function. The business rule "only pay on cashout" lives in the route handler, not in the math function. Single responsibility.

**Prevention rule:**
In any game or financial API where the same numerical result (score, amount) can mean different things depending on user intent (cashout vs. escape, refund vs. charge), **always require an explicit intent boolean in the request body**. Never infer intent from the magnitude of a number. The rule: *a score value describes how far the game went; only an explicit `cashout` flag describes what the player chose to do*.

**Files changed:**
- `src/app/api/game/session/route.ts` — PATCH handler: added `cashout` param, validation, payout gate
- `src/app/dashboard/game/page.tsx` — `endSession`: sends `cashout` in PATCH body (`cashout=true` on secure, `cashout=false` on escape)

**Related SOP section:** Backend SOP §Hard Rule 1 (never trust client input for money-sensitive values — server re-derives payout from stored `wagerAmount`, not client-sent `winAmount`), §5.2 (price/amount always looked up server-side), §6.2 (resource-level ownership check on every mutation)

---

## Frontend Lessons (continued)

### 2026-09-26 — Admin settings page had Flappy Bird physics fields that don't exist in HUNT crash game

**What happened:**
`/admin/game-settings` showed fields for `baseSpeed`, `gravity`, `jumpVel`, `pipeGap`, `randomSpeed`, `randomThreshold`, `randomSpeedMin`, `randomSpeedMax` — all Flappy Bird physics. HUNT is a crash/multiplier game: it has no pipes, no gravity, no jump velocity. These fields were displayed to the admin, saved to the DB, and also returned from `/api/game/config` to players — none of them were ever read by the HUNT engine.

**What was wrong about it:**
The settings page was copied from a Flappy Bird admin panel and never pruned when the game mechanic changed to a crash/multiplier format. Dead fields in the admin UI create confusion, waste DB rows, and bloat the public config API response with keys that mean nothing to the running game.

**Correct approach:**
1. Identify which config keys the actual game engine (`FlappyBird.tsx`) reads — only `escapeMin`, `escapeMax`, `biasMode`, `winInterval`, `winPerStep`, `jackpotScore`, `jackpotMult`, `jackpotBonusScore`, `jackpotBonusMult`, `minWager`, `maxWager`, `minDeposit`.
2. Remove all other keys from both the admin UI and the public `/api/game/config` GET response.
3. Keep them in the admin route `DEFAULTS` map only if they might be needed in future (they were removed entirely since the game mechanic won't revert to Flappy Bird).

**Prevention rule:**
When a game mechanic changes, audit all three layers simultaneously:
- Admin UI page (what fields are shown)
- Admin API route (what keys are in DEFAULTS and GET response)
- Public config API (what keys are returned to the client)

Never leave "legacy" config keys in the public API — they inflate response size and create false surface area for enumeration.

**Related SOP section:** Universal Engineering Principles §Hard Rule 2 (DRY — no dead code/config), Backend SOP §Hard Rule 1 (never expose keys that serve no purpose to the caller)

---

### 2026-09-26 — maxWager not implemented — platform had no upper bet limit

**What happened:**
The game had `minWager` (minimum bet) but no `maxWager`. Players could wager any amount above the minimum, including the entire wallet balance. A player with Rs. 384,276 balance could wager the full amount on a single session.

**What was wrong about it:**
No upper wager limit = unbounded platform liability on a single session. If a player wagered Rs. 300,000 at 12× and the bias mode was "win" (or they were simply lucky), the platform would owe Rs. 3,600,000 from a single round. This is a financial risk and a regulatory concern.

**Correct fix:**
Added `game.maxWager` to:
1. `DEFAULTS` in `/api/admin/game-settings/route.ts` — env-backed default `GAME_MAX_WAGER ?? "10000"`
2. GET response from the admin route (so admin UI can read and edit it)
3. GET response from `/api/game/config` (so the player-facing UI can enforce it client-side)
4. Admin UI with a FieldRow explaining the purpose and the financial rationale

**Why env-backed default:**
`process.env.GAME_MAX_WAGER ?? "10000"` means: at deploy time the operator can set a different ceiling via `.env.local`/Railway env without touching the DB. Once an admin overrides it via the settings UI, the DB value wins. This is the correct DRY hierarchy: env = install-time default, DB = runtime override.

**Prevention rule:**
Every numeric input with a minimum (`minWager`, `minDeposit`, `minBet`) must also have a corresponding maximum unless the domain explicitly has no ceiling. For financial inputs, always pair `min` with `max` in:
- The DB settings (both keys)
- The admin UI (both fields, with cross-validation: max > min enforced in the `input[min]` attribute)
- The API (both returned in GET, both accepted in PUT)
- The env defaults (both `GAME_MIN_*` and `GAME_MAX_*`)

**Related SOP section:** Backend SOP §Hard Rule 1 (server-side validation — never trust that clients won't send exploitative values), Universal Engineering Principles §Hard Rule 3 (financial inputs are paired min/max by default)

---

### 2026-09-26 — TypeScript TS2322: local Icon primitive missing `style` prop

**What happened:**
`admin/game-settings/page.tsx` defined a file-local `Icon` component with `{ d, className }` props. When rendering the icon inside an `InfoBox` and a warning banner, a `style={{ color: "var(--brand-400)" }}` prop was passed to give the icon a CSS-variable colour. TypeScript reported TS2322: `Property 'style' does not exist on type 'IntrinsicAttributes & { d: string; className?: string }'`.

**What was wrong about it:**
The `Icon` interface was too narrow — it only declared `d` and `className`, but not `style`. Any time a CSS-variable colour is needed without a Tailwind class, `style` is the correct approach, so the type must include it.

**Correct fix:**
```typescript
function Icon({ d, className = "w-4 h-4", style }: {
  d: string; className?: string; style?: React.CSSProperties;
}) {
  return <svg className={className} style={style} ...>
```

**Prevention rule:**
File-local primitive components (`Icon`, `Badge`, `Chip`) that wrap a DOM element should always include `style?: React.CSSProperties` in their interface. These components are used in varied contexts where Tailwind classes are insufficient (dynamic CSS variable colours, calculated transforms, etc.). Adding `style` costs nothing and prevents repeated TS errors when contexts vary.

**Related SOP section:** Frontend SOP §Hard Rule 1 (component interfaces must be wide enough for their intended usage contexts), Universal Engineering Principles §Hard Rule 2 (primitive components should not be re-opened for each minor prop addition — design them complete once)

---

## Architecture Lessons (continued)

### 2026-09-26 — Game settings page was removed but its route + API still existed, causing a dead link and orphaned code

**What happened:**
`/admin/game-settings` had its page file deleted at some point but the route key in `routes.ts` was kept with a comment saying "page removed, config embedded in overview." The API (`/api/admin/game-settings`) remained fully functional. The admin panel had no way to control game flight range or wager limits through the UI, forcing hardcoded env values.

**What was wrong about it:**
- A route key in `routes.ts` with a "page removed" comment is a code smell — if the route is dead, remove the key; if the feature is needed, create the page. Half-states are confusing.
- Wager limits (`minWager`, `maxWager`) were hardcoded to 120/10000 in `gameConstants.ts` as env-var fallbacks, but had no UI for the admin to change them — the DB-backed live values existed but were unreachable from the admin panel.
- The admin/page.tsx used `GameConfig` type but never defined or imported it, causing a pre-existing `TS2304: Cannot find name 'GameConfig'` error that had been silently present.

**Correct approach:**
1. The API already existed and was correct — no backend changes needed.
2. Created `page.tsx` with three independent save sections (Flight Range, Wager Limits, Outcome Bias), each with its own `SaveState` and validation.
3. A single generic `save(payload, setSaveState)` callback handles all three sections — DRY, no duplicated fetch logic.
4. Defined `GameConfig` interface locally in `admin/page.tsx` to match the API response shape, ending the TS error.
5. Updated `routes.ts` comment from "page removed" to a real description.
6. Added the route to `ADMIN_NAV` in `Sidebar.tsx` and to `EXACT_ONLY` set.

**Prevention rules:**

**On route keys:** A route in `routes.ts` must have exactly one of two states: (a) a working `page.tsx` file at that path, or (b) the key removed entirely. A "kept for API compat" comment on a UI route is always wrong — API routes use their own path strings, they do not depend on `routes.ts`.

**On shared interfaces:** If multiple files use the same data shape (e.g. `GameConfig`), define it once in a shared `types/` file or in the relevant `lib/` module and import it. Never leave a `useState<GameConfig>` in a component without a corresponding type definition visible in the same file or an explicit import.

**On component prop types:** Any SVG/icon component that needs dynamic colour should either:
- Accept a `className` prop and use Tailwind color utilities (`text-[var(--color-success)]`)
- Accept an explicit `color` prop typed as `string`
- Be wrapped in a `<span style={{ color: '...' }}>` at the call site

Never pass `style` to a component that doesn't declare it in its prop interface — TypeScript will catch this but only at compile time, not at authoring time if you're moving fast.

**Related SOP section:** Architecture SOP §0 (produce correct blueprints — dead routes have no place in the routes file), Universal Engineering Principles §Hard Rule 2 (DRY — shared types defined once), Frontend SOP §13 Change Management (route is a contract — either the page exists or the key doesn't)

---

## Frontend Lessons (continued)

### 2026-09-26 — Duplicate `DepositModal` definition in page.tsx caused Turbopack compile error

**What happened:**
`DepositModal` was defined as both an inline function in `page.tsx` AND as an imported component from `@/components/game/DepositModal`. Turbopack (Next.js 16 bundler) threw:

```
Error: the name `DepositModal` is defined multiple times
```

The page failed to compile entirely.

**Root cause:**
A prior AI session correctly extracted `DepositModal` into its own reusable component at `src/components/game/DepositModal.tsx` and added the import line at the top of `page.tsx`. However, it did NOT remove the original inline function body from `page.tsx`. Both names lived in the same module scope, causing a binding conflict.

**Why grep missed it initially:**
`grep` was run with `^function DepositModal` (line-start anchor) which correctly found the inline definition. The import appeared as `import DepositModal from ...` — a different line pattern. The presence of two definitions only became obvious when both patterns were searched together. Always search for ALL occurrences of a symbol name, not just the `function` declaration, before concluding it appears once.

**Correct fix:**
Remove the inline function body (and its associated `PaymentAccount` interface that the inline owned). Keep only the import. The extracted component is strictly superior — it has better error handling (`acctErr` state), accessibility (`aria-label`), and handles the `address` field.

**Prevention rule — DRY enforcement checklist when extracting a component:**
1. Extract the component to its own file. ✓
2. Add the import in the consuming file. ✓
3. **Remove the inline definition from the consuming file.** ← the step that was missed
4. Remove any types/helpers that were only used by the inline definition (e.g. `PaymentAccount` interface).
5. Run `tsc --noEmit` immediately after extraction to catch any remaining references.

Never leave an inline component body in a file that also imports the same name. The bundler will always catch this — better to catch it in the same commit.

**Related SOP section:** Universal Engineering Principles §Hard Rule 2 (DRY — each piece of logic exists in exactly one place), Frontend SOP §13 Change Management (component extraction is a two-step operation: add + remove)

---

## Frontend Lessons (continued)

### 2026-09-26 — Deposit button routed to game page instead of opening DepositModal

**What happened:**
The "Deposit" button on `/dashboard/wallet` and the "Deposit" / "Top Up" buttons on `/dashboard` navigated users to `/dashboard/game` instead of opening the deposit form. Users pressing Deposit from the wallet page were silently dropped into the game.

**Root cause:**
All four buttons used `href={ROUTES.game}` — the game page route — rather than opening the `DepositModal`. The likely intent was "the user can deposit from the game page", but this produced a confusing redirect with no explanation and forced the user to find the deposit button again inside the game UI.

A fully-implemented `DepositModal` component already existed at `src/components/game/DepositModal.tsx` and was correctly used in `game/page.tsx`. The wallet and dashboard pages simply never imported it.

**What was wrong about it:**
Routing to a different page as a proxy for a modal is a UX anti-pattern — it breaks navigation context, loses any state the user had on the source page, and confuses users who expected a form overlay.

**Correct approach:**
1. Import `DepositModal` from the shared component (DRY — already exists, never duplicate).
2. Add a `depositOpen` boolean state.
3. Convert each `href={ROUTES.game}` deposit button to `onClick={() => setDepositOpen(true)}` (no `href` → `Button` renders as `<button>`, not `<Link>`).
4. Render `{depositOpen && wallet && <DepositModal minDeposit={wallet.minDeposit} onClose={...} onSuccess={...} />}` at the end of the page JSX.
5. In `onSuccess`: close the modal AND refresh wallet data so the balance updates immediately.

**Files fixed:**
- `src/app/dashboard/wallet/page.tsx` — added `DepositModal` import, `depositOpen` state, fixed 2 buttons, added modal render
- `src/app/dashboard/page.tsx` — added `DepositModal` import, `depositOpen` state, fixed 2 buttons, added modal render

**Prevention rule:**
Before writing `href={ROUTES.x}` on any button labelled "Deposit", "Top Up", "Add Balance", or similar — ask: is there already a modal component for this action? If yes, use it via local state. Never route to another page as a proxy for a modal. Check `src/components/` before building new flows.

**Related SOP section:** Universal Engineering Principles §Hard Rule 2 (DRY — shared component exists, import it), Frontend SOP §6.1 (UX state: user should stay in context for modal actions), UI/UX SOP §Hard Rule 1 (four states — never leave the user on a wrong page without feedback)

---

## UI/UX Lessons (continued)

### 2026-09-26 — AuthLayout left panel retained old brand colours after platform pivot to HUNT gaming theme

**What happened:**
The signin and signup pages showed a blue-to-teal gradient left panel (`#073dba → #1565ff → #00c9a7`) while the rest of the application (dashboard, game page, global tokens) used a gold/amber/dark gaming palette (`--brand-500: #f5a623`, `--bg-base: #0d0800`). The left panel was visually disconnected from every other screen in the product.

**Root cause:**
`AuthLayout.tsx` had a hardcoded `style={{ background: "linear-gradient(145deg, #073dba 0%, #1565ff 40%, #00c9a7 100%)" }}` that was written during an earlier blue-brand phase of the project and never updated when the palette pivoted to gold/gaming. The same stale raw hex values infected:
- The two animated blob `radial-gradient` colours (blue/teal RGBA)
- The dot grid colour (`white 1px`)
- The logo pill background (`bg-white/20`)
- The wordmark (`text-white`)
- All heading/body text (`text-white/75`, `text-white/90`)
- Feature check-bullet rings (`bg-white/20`, `text-white`)
- Testimonial quote mark (`text-white/20`)
- Testimonial avatar (`bg-white/25`, `text-white`)

**What was wrong about it:**
UI/UX SOP §4.1 (tokens, not values): colour values defined in `globals.css` as tokens must be the single source of truth. When raw hex values are hardcoded directly in a component `style={{}}`, they bypass the token system and become invisible to any future brand update. This is the exact pattern that made the pivot from blue to gold miss the left panel entirely.

**Why CSS var tokens weren't used directly in this case:**
The left panel has `data-theme="dark"` pinned on it so it always renders in dark mode. CSS token vars like `var(--brand-500)` work inside it, but the inline `style={{}}` on a React element evaluates the CSS var string at render time — so `var(--brand-500)` in a `style` prop does resolve correctly. However, the left panel is a purely decorative surface with a custom layered gradient that doesn't map 1:1 to any single token. The correct approach is to use the token's *resolved value* in the gradient, not the var() reference, because CSS `linear-gradient()` with `var()` inside `style={{}}` has browser-inconsistent behaviour at gradient stop positions.

**Correct pattern for always-dark decorative surfaces:**
Use the raw hex values from the token definitions, but document the token mapping inline so future maintainers know which token each value corresponds to:
```tsx
// gradient: --bg-base → --accent-600 → --accent-500 (dark void → deep amber → amber)
background: "linear-gradient(145deg, #0d0800 0%, #3a1a00 45%, #7c4d00 100%)"
//           ↑ --bg-base              ↑ --gray-700     ↑ --accent-600

// blob: --brand-500 glow
background: "radial-gradient(circle, rgba(245,166,35,0.7) 0%, transparent 70%)"
//                                    ↑ --brand-rgb

// dot grid: --brand-rgb
backgroundImage: "radial-gradient(circle, rgba(245,166,35,1) 1px, transparent 1px)"
```

**Prevention rule (two-part):**
1. After any brand/palette pivot, run a search across ALL component files for the OLD hex values:
   ```
   grep -r "#073dba\|#1565ff\|#00c9a7" src/
   ```
   Any hit is a stale hardcoded colour that missed the pivot. Fix it in the same commit as the token update.

2. For decorative surfaces that MUST use hardcoded hex (complex gradients, `radial-gradient` blobs), add a comment directly above the value mapping it to the token it represents:
   ```ts
   // --brand-500 = #f5a623
   rgba(245, 166, 35, 0.7)
   ```
   This makes future pivots a find-and-replace with known source values, not a hunt.

**Files fixed:**
- `src/components/AuthLayout.tsx` — left panel gradient, 2 blob gradients, dot grid, logo pill, wordmark, heading, body text, feature bullet rings + icons, quote mark, testimonial avatar bg/border/text.

**Related SOP section:** UI/UX SOP §4.1 (tokens not values), UI_MASTER_SKILL §2 (Color Systems — extract palette from brand, define once, reference everywhere), Process Log SOP §5 (correction workflow — after pivot, audit ALL hardcoded values)

---

## Architecture Lessons (continued)

### 2026-09-26 — Brand name scattered as string literals across auth pages — no central constant

**What happened:**
The platform was rebranded from "RozeDesk" → "FlappyWin" but the brand name was hardcoded as raw string literals in six separate files. `AuthLayout.tsx` hardcoded "FlappyWin" in three places (DEFAULT_ROLE constant, desktop logo wordmark, mobile wordmark). `signin/page.tsx` and `signup/page.tsx` each passed `quoteRole="Player — FlappyWin"` as a prop. `forgot-password/page.tsx` and `reset-password/page.tsx` still had "RozeDesk" holdover text — never updated during the rebrand.

**What was wrong about it:**
Universal Engineering Principles §Hard Rule 2 (DRY): a value that appears more than once must live in exactly one place. A brand name is a value. Changing "FlappyWin" → anything required editing 6 files and finding all occurrences manually — a process that broke twice (RozeDesk holdovers in forgot/reset pages were missed on the first pass).

**Correct approach — `BRAND` constant as single source of truth:**
```typescript
// src/lib/gameConstants.ts — safe for client, env-backed
export const BRAND = {
  name:    process.env.NEXT_PUBLIC_BRAND_NAME     ?? "RozeDesk",
  logoSrc: process.env.NEXT_PUBLIC_BRAND_LOGO_SRC ?? "/logo-3.png",
  logoAlt: process.env.NEXT_PUBLIC_BRAND_NAME     ?? "RozeDesk",
  tagline: process.env.NEXT_PUBLIC_BRAND_TAGLINE  ?? "Play HUNT. Earn real PKR.",
} as const;
```

All six files import `{ BRAND }` and use template literals:
- `quoteRole={`Player — ${BRAND.name}`}`
- `<img src={BRAND.logoSrc} alt={`${BRAND.name} logo`} />`
- `aria-label={`Create ${BRAND.name} account`}`

Changing the brand now requires updating one env var or one default string in one file.

**Why env-backed:**
Staging environments can use a different brand name without code changes (`NEXT_PUBLIC_BRAND_NAME=RozeDesk-Staging`). The default value is the production brand — code works correctly even without the env var set.

**Where the constant lives — `gameConstants.ts`:**
This file is already imported by every game-related page and is safe for client-side rendering (no Node.js imports, no DB access). Adding `BRAND` here avoids creating a new file for a trivial constant, following the rule: don't create a new file unless it has more than one responsibility.

**Prevention rule:**
Before hardcoding any string that identifies the platform (name, domain, logo path, tagline, support email), ask: will this string ever appear in more than one file? If yes, define it as a constant in `src/lib/` first, then import it everywhere. This includes: `aria-label`, `alt` attributes, testimonial text, email subjects, and localStorage key prefixes.

**Related SOP section:** Universal Engineering Principles §Hard Rule 2 (DRY — no value duplicated across files), Architecture SOP §2.1 (gather constraints — brand identity is a constraint that must be established before building auth UI)

---

## Frontend Lessons (continued)

### 2026-09-26 — HUNT game: PIXI.Assets has THREE separate caches — Cache.remove() per URL only clears one

**What happened:**
`null.split` crash persisted even after adding `PIXI.Cache.remove(url)` per URL in `PixiRenderer.destroy()`. The fix cleared the TextureCache (`cache #3`) but left two other internal caches intact, causing the crash on second boot.

**Root cause — three caches, only one was cleared:**

Inspecting `node_modules/pixi.js/lib/assets/Assets.js` and `Resolver.js` revealed that `PIXI.Assets` maintains THREE separate internal stores:

| Cache | Location | What it stores | Cleared by |
|---|---|---|---|
| `resolver._assetMap` | `Resolver.js` | URL → asset descriptor objects | `Assets.reset()` only |
| `resolver._resolverHash` | `Resolver.js` | URL → resolved asset (memoized) | `Assets.reset()` only |
| `Assets.cache` (TextureCache) | `Assets.js` | URL → `Texture` object | `Cache.remove(url)` OR `Assets.reset()` |

The prior fix called `Cache.remove(url)` per URL which **only cleared cache #3** (TextureCache). Caches #1 and #2 inside the Resolver were left intact.

**Exact crash sequence on second boot:**

1. `destroy()` calls `Cache.remove(url)` for each URL → TextureCache is clean.
2. `app.destroy({ children: true })` runs → nulls `_texture` on every sprite/container, potentially corrupting `resolver._assetMap` entries (the asset descriptor objects have references into the destroyed texture system).
3. Second boot → `Assets.load(urls)` is called.
4. `Assets.load()` internally calls `resolver.hasKey(url)` (line 142 of Assets.js) — checks `!!this._assetMap[url]`.
5. `_assetMap[url]` is still populated (never cleared) → `hasKey` returns `true` → `add()` is skipped.
6. `resolver.resolve(urlArray)` is called → hits `_buildResolvedAsset()` with the stale `_assetMap` entry.
7. `_buildResolvedAsset()` calls `getUrlExtension(formattedAsset.src)` → `src.split(".")` → if `src` was corrupted to `null` → **crash**.

**Correct fix — `Assets.reset()` clears all three atomically:**

```typescript
// In PixiRenderer.destroy(), BEFORE app.destroy():
try {
  if (this.PIXI) {
    this.PIXI.Assets.reset();  // clears resolver._assetMap + _resolverHash + cache
    this._tex.clear();         // clear local texture cache map
  }
} catch { /* PIXI not imported if init() never completed */ }
```

`Assets.reset()` (line 321 of Assets.js) calls:
```js
reset() {
  this.resolver.reset();   // clears _assetMap, _resolverHash, _bundles, _basePath, etc.
  this.loader.reset();     // clears the loader queue
  this.cache.reset();      // clears the TextureCache
}
```
This is the **only safe way** to fully reset the Assets singleton between game sessions.

**Why not `Assets.unload(url)` per URL:**
`Assets.unload()` removes from the async loader cache but does NOT clear `resolver._assetMap`. After unload, `resolver.hasKey(url)` still returns `true`, so on next load it skips `add()` and resolves from the potentially-stale `_assetMap`. Same crash.

**Prevention rule:**
When a `PixiRenderer` wraps a `PIXI.Application` and will be recreated multiple times:
1. In `destroy()`, call `PIXI.Assets.reset()` BEFORE `app.destroy()` — not after, not per-URL.
2. Never use `Cache.remove()` as a substitute for `Assets.reset()` — they clear different stores.
3. After `Assets.reset()`, clear your own local `_tex: Map` as well.
4. The order must be: kill GSAP tweens → `Assets.reset()` → `app.destroy()` → resolve fence.

**Debugging method for Pixi cache bugs:**
When a Pixi crash points to `.split()` or `getUrlExtension()` in `Resolver.js`, the cause is always a null/undefined `src` property on a resolver hash entry. Read `Resolver.js:_buildResolvedAsset()` to trace where `src` came from. Follow the chain: `Assets.load()` → `resolver.hasKey()` → `resolver.add()` → `_assetMap` → `resolver.resolve()` → `_buildResolvedAsset()` → `getUrlExtension(src)`.

**Related SOP section:** Frontend SOP §Hard Rule 1 (always clean up ALL shared global state in teardown, not just the obvious parts), Universal Engineering Principles §Hard Rule 2 (understand what a cleanup call actually does before relying on it)

---

## Backend / DBA Lessons

### 2026-09-26 — Prisma generated client not regenerated after schema change → TS errors at runtime

**What happened:**
`phone String? @unique` was added to the `User` model in `prisma/schema.prisma` but `prisma generate` was never re-run. The generated client at `src/generated/prisma/index.d.ts` still had the old `UserWhereUniqueInput` (only `id` and `email` as unique fields). API route code using `db.user.findUnique({ where: { phone } })` and `tx.user.create({ data: { phone } })` produced 3 TS errors. The signup page code referencing `user.phone` in the response produced a 4th.

**What was wrong:**
The generated Prisma client is a build artifact derived from the schema. Any schema change (add field, add `@unique`, add model) requires `prisma generate` before TypeScript will accept the new field names. This is a hard dependency that is easy to miss because the schema file and the generated client are in different directories.

**Correct fix:**
```powershell
npx prisma generate --schema="..\prisma\schema.prisma"
```
Run this immediately after every schema change, before writing any code that uses the new fields.

**Prevention rule:**
Schema change → `prisma generate` → write API/page code. Never write code against a new schema field before generating. If the generated client is in a non-standard location (e.g. `src/generated/prisma`), always pass `--schema` explicitly and verify the output path in `schema.prisma`'s `generator` block.

**Related SOP section:** DBA SOP §migrations (schema and generated artifacts must be in sync), Universal Engineering Principles §Hard Rule 2 (single source of truth — schema is the source, generated client is the artifact)

---

## Frontend Lessons (continued)

### 2026-09-26 — Signup form: phone field added to FormFields type but not to useState, VALIDATORS, refs, or fetch body

**What happened:**
`phone` was added to the `FormFields` interface and the `FormErrors` interface, but the following were not updated:
1. `useState<FormFields>({ ... })` initial value — missing `phone: ""` → TS2345 (type mismatch)
2. `VALIDATORS` map — missing `phone` entry → TS7053 (implicit any on `VALIDATORS[field]`)
3. `refs` object — missing `phone` useRef → TS7053 (implicit any on `refs[f].current`)
4. `handleSubmit` fetch body — missing `phone` → server never received the value
5. `setTouched` call in `handleSubmit` — missing `phone: true` → field never marked touched on submit

**Pattern of the failure:**
Adding a field to a form requires updating 6 locations atomically:
1. `FormFields` interface
2. `FormErrors` interface
3. `useState` initial value
4. Validator function (pure function, outside component)
5. `VALIDATORS` map (inside `useMemo`)
6. `refs` object
7. `handleSubmit`: setTouched, field order for focus-on-error, fetch body
8. JSX: `<FormInput>` element in the form

Missing any one of these causes either a TS error or a silent runtime bug (field not sent to server, field not validated on submit).

**Prevention rule:**
When adding a field to a typed form, use this checklist before considering the task done:
- [ ] `FormFields` type updated
- [ ] `FormErrors` type updated  
- [ ] `useState` initial value includes new field
- [ ] Pure validator function written
- [ ] `VALIDATORS` map includes new field
- [ ] `refs` includes new `useRef<HTMLInputElement>(null)`
- [ ] `setTouched` in `handleSubmit` includes new field
- [ ] `validateForm()` calls new validator
- [ ] Focus-on-error `order` array includes new field
- [ ] Fetch body includes new field
- [ ] `<FormInput>` JSX element added in correct position

**Related SOP section:** Frontend SOP §7 Forms (blur validation, all fields validated on submit), Universal Engineering Principles §Hard Rule 2 (DRY — form field must be defined once and flow through all layers)

---

## Backend Lessons

### 2026-09-26 — Auth identifier migration: email → phone number across full stack

**What happened:**
Platform was built with email as the primary auth identifier (signin lookup, JWT payload, signup validation, duplicate check, welcome email). User requirement changed: register and sign in using Pakistani mobile number only — no email field in any user-facing form.

**Files changed and why:**

| File | Change |
|---|---|
| `signin/page.tsx` | Removed email field + `validateEmail`. Added phone field + `validatePhone`. Updated fetch body `{ phone, password }`. Updated `aria-label`, focus refs, `VALIDATORS` map. |
| `signup/page.tsx` | Removed email `FormInput` block and `validateEmail`. Removed "Resend email" / forgot-password block from success screen. Success screen now shows `fields.phone`. Submit body sends `{ fullName, phone, password }`. Focus priority updated. |
| `api/auth/signin/route.ts` | DB lookup changed from `where: { email }` to `where: { phone: normPhone }`. JWT payload now `{ id, phone, role }`. Validation guard and error messages reference phone. Added `normalisePhone()` helper (strips spaces/dashes). |
| `api/auth/signup/route.ts` | Removed email body destructuring, email validation block, email duplicate check, `sendWelcomeEmail` call. Phone becomes the sole unique identifier. |
| `lib/api.ts` | `AuthUser.phone: string` (required), `email?: string` (optional). `SignUpPayload`: `phone` replaces `email`. `authApi.signIn(phone, password)`. `authApi.forgotPassword` removed (email-based recovery no longer exists). `adminSignIn` left unchanged (admins still use email). |

**Key constraint hit — Prisma schema `email String @unique`:**
The existing Prisma schema declares `email` as `String @unique` (non-nullable). Removing email from `tx.user.create()` caused TS2322 because Prisma's generated type requires the field. Two options:
1. Schema migration to make `email String? @unique` — correct long-term fix (DBA scope).
2. Derive a stable, non-colliding placeholder from the phone number (immediate fix, no migration).

Chose option 2 to unblock the UI change without a DB migration:
```typescript
const placeholderEmail = `${normPhone}@phone.rozedesk.local`;
```
This is guaranteed unique (phone is already unique), contains a non-routable domain so it can never receive real email, and satisfies the `@unique` constraint. The comment in the code explicitly marks this as pending a proper migration.

**Prevention rule:**
Before migrating an auth identifier, always check whether any DB column declaration (`@unique`, `NOT NULL`) depends on the old identifier. If the schema requires the old field, you have two paths:
1. DBA: `prisma migrate dev` to make the column nullable/optional.
2. Backend: derive a deterministic placeholder from the new identifier as a bridge.

Never silently drop a required DB field without one of these two paths — it will fail at write time even if TypeScript doesn't catch it.

**Security notes applied:**
- Error message "Incorrect mobile number or password." (not "user not found") prevents user enumeration.
- `normalisePhone()` strips spaces/dashes before lookup and storage — prevents duplicate registrations for the same number in different formats.
- URL param sanitisation on mount strips `phone`, `email`, `password` etc. — prevents credential leakage in browser history/server logs.
- `passwordHash.startsWith("oauth:")` guard preserved in signin route — OAuth accounts cannot be accessed via password path.

**Related SOP section:** Backend SOP §Hard Rule 1 (server re-validates all inputs), §5.2 (never trust client for auth identifier — always server-side lookup), §6.2 (generic error message prevents enumeration), Frontend SOP §Hard Rule 1 (client validation is UX only)

---

### 2026-09-26 — Prisma `@unique` field blocks auth identifier migration without schema change

**What happened:**
Migrating from email-based to phone-based auth required removing `email` from `tx.user.create()`. The Prisma generated type `UserCreateInput` still had `email: string` as a required property. TypeScript error TS2322 blocked the build.

**Root cause:**
Prisma generates strict TypeScript types directly from `schema.prisma`. A `String @unique` field without `?` is non-nullable and mandatory in all create operations. Removing it from the runtime call does not change the schema — the generated type still enforces it.

**Correct immediate fix (bridge pattern):**
Derive a deterministic, non-colliding placeholder that satisfies the unique constraint:
```typescript
// phone is already @unique — so phone@domain is also unique
const placeholderEmail = `${normPhone}@phone.rozedesk.local`;
```
Characteristics of a good placeholder:
- Deterministic (derived from the new unique identifier — no random suffix needed)
- Non-colliding (inherits uniqueness from phone)
- Non-routable domain (`.local` TLD — can never receive real email)
- Self-documenting (`phone.rozedesk.local` makes the intent clear in DB inspection)

**Correct long-term fix (DBA task):**
```prisma
model User {
  email  String?  @unique   // nullable: phone-registered users have no email
  phone  String   @unique   // primary identifier for seeker accounts
}
```
Run `prisma migrate dev --name make_email_optional` and regenerate the client. After migration, the placeholder workaround can be removed.

**Prevention rule:**
When planning any field deprecation or identifier change:
1. Check `schema.prisma` for `NOT NULL` / non-`?` constraints on the old field.
2. If the field is required by the schema, plan the migration first (DBA SOP) before writing the backend code.
3. If migration cannot happen immediately, document the placeholder pattern clearly with a `TODO: migration` comment so the bridge is never treated as permanent.

Never silently pass an empty string to satisfy a unique constraint — `""` would collide on the second registration. Always derive from an already-unique value.

**Related SOP section:** DBA SOP §3 (migrations must be planned before backend implementation), Backend SOP §Hard Rule 1 (server validates data integrity — placeholder must be deterministic and non-colliding), Universal Engineering Principles §Hard Rule 2 (temporary bridges must be documented and owned)

---

## Backend Lessons

### 2026-09-26 — Prisma: `findUnique` fails on nullable unique fields (`String? @unique`) — must use `findFirst`

**What happened:**
`POST /api/auth/signup` returned 500 with:
```
PrismaClientValidationError: Unknown argument `phone`. Did you mean `role`?
```
The query was:
```typescript
await db.user.findUnique({ where: { phone: normPhone } })
```

**Root cause:**
In Prisma, `findUnique()` only accepts fields in its `where` clause that are:
1. The `@id` field, OR
2. A field marked `@unique` **and non-nullable** (i.e., `String @unique`, not `String? @unique`), OR
3. A `@@unique([...])` composite constraint.

The `User` model had:
```prisma
phone String? @unique   // nullable optional unique
```
Because `phone` is nullable (`?`), Prisma does NOT generate a `findUnique` overload for it. The generated TypeScript types for `UserWhereUniqueInput` do not include `phone` as a valid key — hence the "Unknown argument `phone`" error.

**Correct approach:**
Use `findFirst()` for nullable unique fields:
```typescript
// WRONG — Prisma rejects nullable unique fields in findUnique
await db.user.findUnique({ where: { phone: normPhone } });

// CORRECT — findFirst accepts any where clause
await db.user.findFirst({ where: { phone: normPhone }, select: { id: true } });
```

**Files fixed:**
- `src/app/api/auth/signup/route.ts` — duplicate phone check
- `src/app/api/auth/signin/route.ts` — login lookup by phone

**Prevention rule:**
Before using `findUnique({ where: { fieldName } })`, check the Prisma schema:
- Is the field `@id`? → `findUnique` OK.
- Is the field `Type @unique` (non-nullable)? → `findUnique` OK.
- Is the field `Type? @unique` (nullable)? → **must use `findFirst`**.
- Is it a `@@unique([...])` composite? → `findUnique` with the composite object shape OK.

A quick mental check: if the field type has a `?`, use `findFirst`, not `findUnique`.

**Related SOP section:** DBA SOP §3 (schema constraints must match query API), Backend SOP §Hard Rule 1 (never trust client input — validate server-side, but also validate your own queries compile cleanly)

---

## Backend Lessons (continued)

### 2026-09-26 — Signup 500: Prisma client stale — schema has `phone` but generated client doesn't

**What happened:**
`POST /api/auth/signup` returned `500` with:
```
PrismaClientValidationError: Unknown argument `phone`. Did you mean `role`?
```
The signup route used `db.user.findFirst({ where: { phone: normPhone } })` which is valid given the schema, but the Prisma client threw a validation error saying `phone` doesn't exist.

**Root cause — schema and generated client out of sync:**
`phone String? @unique` was added to the `User` model in `prisma/schema.prisma`, but `prisma generate` was never re-run after that change. The generated Prisma client at `src/generated/prisma/` was still compiled from the old schema that had no `phone` field.

Prisma client is a **code-generated artifact** — it does not read from the schema at runtime. It is a static TypeScript module compiled at generate time. Any schema change that isn't followed by `prisma generate` leaves the client and schema diverged. The TypeScript compiler did NOT catch this because the generated types were also out of date, so the type-checking passed with stale types.

**Fix:**
Run the project's own generate script (DRY — defined once in `package.json`):
```powershell
npm run db:generate
# which runs: node ../node_modules/prisma/build/index.js generate --config ../prisma7.config.ts
```
After regeneration, `UserWhereInput.phone` appeared in `src/generated/prisma/index.d.ts` and the query works.

**Why `tsc` didn't catch it:**
`tsc --noEmit` checks against the types in `src/generated/prisma/index.d.ts`. If that file is stale (reflects the old schema), TypeScript sees no error — the stale types match the stale code. Type safety only works if the generated types are fresh.

**Prevention rule — mandatory generate-after-schema-change:**
Any time `prisma/schema.prisma` is modified (add field, rename field, add model, add enum value):
1. Run `npm run db:generate` immediately.
2. If the change also needs a migration, run `npm run db:push` (dev) or create a migration file.
3. Never commit a schema change without also committing the regenerated `src/generated/prisma/` output.

**CI enforcement (for production readiness):**
Add to build script (already partially done via `package.json` `build` script):
```json
"build": "prisma generate --schema=../prisma/schema.prisma && next build"
```
This ensures the client is always regenerated before a production build. For local dev, add a `postinstall` script or a pre-commit hook.

**Secondary observation — `prisma generate` output path:**
This project uses a custom output path (`output = "../rozedesk-app/src/generated/prisma"` in the schema). When running `prisma generate` from the repo root vs. from the `rozedesk-app/` subdirectory, the config file path changes. The correct invocation here is `npm run db:generate` from inside `rozedesk-app/` — which uses `prisma7.config.ts` that points to the correct schema at `../prisma/schema.prisma`.

**Related SOP section:** DBA SOP §5.1 (schema change process — generate + migrate are two separate steps, both required), Backend SOP §Hard Rule 1 (never trust a client API you haven't verified against the current schema), Universal Engineering Principles §Hard Rule 2 (generated artifacts are part of the codebase — regenerate is part of every schema commit)

---

## Backend / DBA Lessons

### 2026-09-26 — PrismaClientValidationError: Unknown argument `phone` — generated client stale after schema change

**What happened:**
`POST /api/auth/signup` returned HTTP 500 with:
```
PrismaClientValidationError: Invalid prisma.user.findFirst() invocation:
  Unknown argument `phone`. Did you mean `role`?
```
The `User` model in `prisma/schema.prisma` had `phone String? @unique` correctly defined, but the runtime Prisma client in `src/generated/prisma/` was compiled from an older version of the schema that did not include the `phone` field.

**Root cause — two separate gaps:**

1. **`prisma generate` not re-run after schema change.**
   The generated client (`src/generated/prisma/client.js`) is a compiled artifact from the schema at the time `prisma generate` last ran. Editing `schema.prisma` has zero effect on the running client until `prisma generate` is re-run. The generated `.prisma` mirror file in `src/generated/prisma/schema.prisma` matched the source schema (it was copied on last generate), but the compiled JS types and runtime client were stale.

2. **Database column not yet added to MySQL.**
   The `users` table in MySQL did not have the `phone` column either — it existed only in the schema definition. `prisma db push` was needed to apply the schema diff to the live database and add the `UNIQUE` index.

**Fix sequence (exact commands):**
```powershell
# Step 1: Regenerate the Prisma client from the schema
npm run db:generate
# Output: ✔ Generated Prisma Client (v7.10.0) to ./src/generated/prisma in 377ms

# Step 2: Push schema diff to MySQL (adds `phone` column + UNIQUE index to `users`)
# Note: db:push reads DATABASE_URL from prisma7.config.ts → dotenv/config
# The .env file is in d:\RozeDesk (one level above the app) so pass the var explicitly
$env:DATABASE_URL="mysql://root:@127.0.0.1:3306/rozedesk"
node ..\node_modules\prisma\build\index.js db push --config ..\prisma7.config.ts
# Output: Your database is now in sync with your Prisma schema.

# Step 3: Verify — TypeScript check
npx tsc --noEmit --skipLibCheck   # must exit 0
```

**Why `dotenv/config` didn't pick up `.env.local`:**
`dotenv/config` reads `.env` from the process working directory. `npm run db:push` runs from `rozedesk-app/`, where `.env.local` exists but NOT `.env`. The canonical `DATABASE_URL` lives in `d:\RozeDesk\.env` (one level up). Passing the variable explicitly with `$env:DATABASE_URL=...` bypasses the dotenv lookup entirely.

**Prevention rules:**

1. **After every `schema.prisma` edit, run `npm run db:generate` immediately** — treat it as mandatory, like a compile step. Add it to the pre-commit checklist.

2. **After adding a new column/table, run `db:push` (dev) or create a migration (production)** — the schema file is a declaration, not a live change. The database does not update automatically.

3. **Keep `prisma generate` in the `build` script** — already present as `prisma generate && next build` so production builds always regenerate. But local dev has no auto-regeneration. Consider adding a `postinstall` script: `"postinstall": "npm run db:generate"` so it runs after `npm install`.

4. **`dotenv/config` reads `.env` from CWD, not `.env.local`** — if your DB scripts live in a subdirectory and your `.env` is in a parent directory, either:
   - Symlink `.env` into the subdirectory, or
   - Pass the variable explicitly in the npm script: `"db:push": "cross-env DATABASE_URL=$(node -e \"require('dotenv').config({path:'../.env'});console.log(process.env.DATABASE_URL)\") prisma db push"`
   - Or update `prisma7.config.ts` to load from the correct path: `import "dotenv/config"; // reads from CWD` → change to `config({ path: path.join(__dirname, '.env') })`.

**Related SOP section:** DBA SOP §5 (migrations — schema changes must be applied to the DB, not just the schema file), Backend SOP §Hard Rule 2 (never swallow errors — the 500 correctly surfaced this; the root cause was infrastructure not code logic)

---

## Backend Lessons

### 2026-09-26 — Admin login silently broken: shared signin route is phone-keyed, admin page sends email

**What happened:**
The admin login page (`/admin/login`) showed "Mobile number and password are required." for every sign-in attempt, regardless of what the admin typed. The error message came from the backend — not client validation.

**Root cause — field contract mismatch between page and API:**
The admin login page was wired to the shared `/api/auth/signin` route. That route was designed exclusively for job seekers who authenticate with a Pakistani mobile number (`03XXXXXXXXX`). Its first validation check was:
```typescript
if (!phone?.trim() || !password) {
  return err(400, "Mobile number and password are required.");
}
```
The admin login page sent `{ email, password }` in the request body. The API read `req.json()` and destructured `{ phone, password }` — `phone` was always `undefined`, so the `!phone?.trim()` check always failed and returned 400 before any DB query ran.

No error was logged on the server because the 400 was intentional from the route's perspective — it just happened to be the wrong route.

**Why this wasn't caught earlier:**
The admin login page comment said `"/* Real admin auth — /api/auth/signin validates role=ADMIN server-side */"` — the developer assumed the shared route would handle both seeker and admin flows. But the shared route was phone-only by design (seekers register with mobile, admins register with email — two different auth identifiers).

**Correct fix — dedicated `/api/admin/signin` route:**
Admin auth has fundamentally different requirements from seeker auth:
- Auth identifier: email (not phone)
- Role: must be `ADMIN` — enforced server-side by querying `{ email, role: "ADMIN" }`, not just email
- No `rememberMe` toggle needed (admin sessions are single-tab, 24h fixed)
- JWT payload: `{ id, email, role }` (email-keyed, not phone-keyed)

Creating a dedicated route makes the contract explicit, prevents role confusion, and means a future change to seeker auth can't silently break admin auth.

```typescript
// /api/admin/signin
const admin = await db.user.findFirst({
  where: { email: email.trim().toLowerCase(), role: "ADMIN" },
});
if (!admin) return err(401, "Incorrect email or password.");  // generic — no enumeration
```

**Prevention rule:**
When two user roles have different auth identifiers (phone vs email, username vs email), they must have **separate API routes** — not a shared route with conditional logic. The field name in the request body is part of the API contract. A mismatch between what the client sends and what the server reads is always silent — the server sees `undefined`, not an error.

Before wiring any login form to an API route, verify:
1. What field name does the form submit? (`email`, `phone`, `username`?)
2. What field name does the server destructure from `req.json()`?
3. Do they match exactly — same field name, same format?

**Related SOP section:** Backend SOP §2.1 (require the contract first — API field names are part of the contract), §Hard Rule 1 (server validates — but it can only validate what it actually received)

---

### 2026-09-26 — Admin account bootstrap: use the /api/setup/admin endpoint, not manual DB inserts

**What happened:**
No admin account existed in the database. The login form was correctly wired (after the above fix) but all attempts returned 401 because the `users` table had no row with `role = "ADMIN"`.

**Correct approach — bootstrap endpoint pattern:**
The codebase already had a `/api/setup/admin` route that:
1. Reads credentials from env vars (`ADMIN_EMAIL`, `ADMIN_INITIAL_PASSWORD`) — never hardcoded
2. Is protected by `SETUP_SECRET` env var — returns 403 without the correct secret
3. Uses `db.user.upsert` — idempotent, safe to re-run if the account already exists
4. Returns the credentials in the response (only once — the password is never stored in plaintext)

Calling it once via HTTP seeds the admin account without touching the database directly:
```
GET /api/setup/admin?secret=<SETUP_SECRET>
```

**Key env vars (set in `.env.local`, never hardcoded):**
- `SETUP_SECRET` — protects the endpoint; remove from env after first login
- `ADMIN_EMAIL` — admin email address (default: `admin@rozedesk.com`)
- `ADMIN_INITIAL_PASSWORD` — initial password; change after first login

**Prevention rule:**
Never create admin accounts by writing SQL directly or hardcoding credentials in source files. The bootstrap endpoint pattern is the correct approach:
- Credentials come from env vars (controlled per environment)
- Endpoint is protected by a separate secret (not the admin password itself)
- The secret is rotated or removed after use
- The upsert makes it safe to re-run in CI/CD or disaster recovery

**Security note:** After calling the bootstrap endpoint successfully, set `SETUP_SECRET=` (empty) or remove the key from env entirely. This permanently disables the endpoint, preventing it from being used to reset the admin password if the server is ever compromised.

**Related SOP section:** Backend SOP §6.2 (resource-level authorization — bootstrap endpoint must be protected independently of admin auth), DevOps SOP §Hard Rule 1 (no secrets in source code — all credentials via env vars)

---

## Backend Lessons (continued)

### 2026-09-26 — Real-time notifications via SSE without Supabase realtime or Redis

**What happened:**
The product needed real-time toast notifications with sound — admin sees new deposit/withdraw requests instantly, users see approvals instantly. The existing infrastructure had no WebSocket, no Supabase realtime channel, and no Redis pub/sub.

**Architecture decision — SSE over polling:**
Instead of adding new infrastructure (Redis, Supabase realtime), implemented **Server-Sent Events (SSE)** using the existing Prisma/MySQL stack. The SSE endpoint internally polls the DB every 4 s and pushes only new rows to the open HTTP connection. This gives near-real-time delivery with zero new infrastructure dependencies.

**Why SSE over WebSocket for this use case:**
- Notifications are server → client only (no client → server messages needed).
- SSE is unidirectional, simpler, and reconnects automatically.
- Works natively with `EventSource` in all modern browsers — no library needed.
- HTTP/2 multiplexing handles multiple concurrent SSE connections efficiently.
- WebSocket would require a separate upgrade handshake and custom reconnect logic.

**SSE endpoint pattern — `GET /api/notifications/stream`:**
```typescript
export const dynamic = "force-dynamic";  // required — prevents Next.js static caching

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return new Response("...", { status: 401 });

  const stream = new ReadableStream({
    start(controller) {
      const pollId = setInterval(async () => {
        const rows = await db.notification.findMany({
          where: { userId: user.id, createdAt: { gt: lastSeen } },
        });
        rows.forEach(n => controller.enqueue(encode(`event: notification\ndata: ${JSON.stringify(n)}\n\n`)));
      }, POLL_MS);

      // Heartbeat keeps connection alive through CDN/proxy 30s idle timeouts
      const hbId = setInterval(() => controller.enqueue(encode(": heartbeat\n\n")), 25_000);

      req.signal.addEventListener("abort", () => {
        clearInterval(pollId); clearInterval(hbId);
        try { controller.close(); } catch {}
      });
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type":      "text/event-stream; charset=utf-8",
      "Cache-Control":     "no-cache, no-store",
      "X-Accel-Buffering": "no",   // disable Nginx response buffering
    }
  });
}
```

**Critical headers:**
- `X-Accel-Buffering: no` — without this, Nginx buffers the response body until it reaches a certain size, breaking SSE delivery. Required for any Nginx-proxied deployment.
- `Cache-Control: no-cache, no-store` — prevents CDN/proxy caching of the stream.
- `export const dynamic = "force-dynamic"` — Next.js App Router will otherwise statically analyze the route and cache it; this forces runtime execution.

**Auth on SSE:**
`EventSource` does not support custom headers. Auth works via:
1. HttpOnly cookie (`rozedesk-token`) — sent automatically for same-origin SSE requests.
2. `?token=` query param — avoided (token in URL lands in server logs).
The `getAuthUser()` function already reads from cookie OR Bearer header, so same-origin SSE works with cookies transparently.

**Prevention rule:**
For any server → client push use case in a Next.js App Router project with an existing SQL database, prefer SSE + DB polling over adding Redis or Supabase realtime. The SSE endpoint only needs `force-dynamic` and a heartbeat. Add Supabase realtime or Redis only when the polling interval causes measurable DB load at scale.

**Related SOP section:** Backend SOP §7 (external dependency governance — don't add dependencies you don't need), DevOps SOP Hard Rule 1 (no new infra without explicit justification)

---

## Frontend Lessons (continued)

### 2026-09-26 — Toast system upgrade: onClick callback + duration prop while preserving backwards compatibility

**What happened:**
The existing `Toast.tsx` had a fixed 4s duration and no `onClick` support. Notification toasts needed to be clickable (navigate to a page) and stay on screen longer (7s for notification alerts).

**The backwards-compatibility trap:**
The existing API was `toast.success("message")`. Changing the signature to `toast.success("message", link, duration)` would break every existing call site. The correct pattern is an **options object** as the second argument — callers that omit it work exactly as before.

```typescript
// Before — still works unchanged
toast.success("Saved!");

// After — new capabilities, same base call
toast.info("New deposit request", {
  duration: 7000,
  onClick: () => router.push("/admin/game-deposits"),
});
```

**Polymorphic wrapper element — DRY approach:**
When a toast has an `onClick`, it must be a `<button>` (keyboard-operable, SOP §7). When it doesn't, it's a `<div>`. Instead of duplicating JSX for both cases, use a variable `Wrapper` that holds either `"button"` or `"div"`:
```typescript
const Wrapper = clickable ? "button" : "div";
return (
  <Wrapper
    {...(clickable ? { type: "button", onClick: () => { t.onClick?.(); dismiss(t.id); } } : {})}
    className={...}
  >
    {children}
  </Wrapper>
);
```
This avoids duplicating the entire toast JSX for two variants.

**Dismiss × button in a clickable toast:**
The dismiss `×` button must call `e.stopPropagation()` to prevent it from also triggering the toast's `onClick`:
```typescript
<button onClick={(e) => { e.stopPropagation(); dismiss(t.id); }}>×</button>
```
Without `stopPropagation()`, clicking `×` on a clickable toast would simultaneously dismiss it AND navigate — unintended behaviour.

**Prevention rule:**
Any existing toast/modal/dialog API that takes a plain `string` must be extended with an optional `opts?` object, never positional parameters. Positional parameters break backwards compatibility the moment a third parameter is added. The options object pattern allows unlimited future extension with zero call-site breakage.

**Related SOP section:** Universal Engineering Principles §Hard Rule 2 (DRY — one component, not two), Frontend SOP §Hard Rule 1 (all interactive elements must be keyboard-operable — use `<button>` not `<div onClick>`)

---

### 2026-09-26 — Notification sound via Web Audio API: no audio files, no CDN, env-gated

**What happened:**
The product needed notification sounds but no audio files were available and adding a CDN dependency for a chime was excessive. The requirement was also that sound should be suppressible per environment.

**Solution — programmatic Web Audio API chime:**
The Web Audio API can synthesize a simple two-tone chime entirely in JavaScript — no `.mp3`, no CDN, no import. The pattern:
```typescript
const osc  = ctx.createOscillator();
const gain = ctx.createGain();
osc.connect(gain);
gain.connect(ctx.destination);
osc.type = "sine";
osc.frequency.setValueAtTime(880, ctx.currentTime);
gain.gain.setValueAtTime(0, ctx.currentTime);
gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.04);   // attack
gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12); // decay
osc.start(ctx.currentTime);
osc.stop(ctx.currentTime + 0.12);
```
Multiple notes are staggered by `i * stepSeconds` to create a melody.

**AudioContext singleton — OOP:**
`AudioContext` has a browser limit of ~6 per tab. Wrapping it in a class with a private `ctx` field and lazy-initialisation ensures only one is ever created:
```typescript
class SoundChime {
  private ctx: AudioContext | null = null;
  private getCtx() {
    if (!this.ctx) this.ctx = new AudioContext();
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }
}
const chime = new SoundChime(); // module singleton
```

**Autoplay policy:**
Browsers suspend `AudioContext` until a user gesture has occurred. Call `ctx.resume()` on every `play()` call — it's a no-op if already running and silently resumes if suspended. Do not assume the context is running.

**Env gate — no hardcoded enable/disable:**
```typescript
// .env.local
NEXT_PUBLIC_NOTIF_SOUND=false   // silence all notification sounds

// Code
if (process.env.NEXT_PUBLIC_NOTIF_SOUND === "false") return;
```
`NEXT_PUBLIC_` prefix makes the variable available client-side via Next.js bundle. The gate defaults to enabled (undefined → play). This means staging/production can suppress sound without code changes.

**Prevention rule:**
Any feature that produces sensory output (sound, vibration, animation) must have an env-variable kill-switch. Never hardcode `enabled = true`. The kill-switch must default to the "on" state so new environments work without explicit configuration.

**Related SOP section:** DevOps SOP Hard Rule 1 (all config from env, never hardcoded), Universal Engineering Principles §Hard Rule 2 (OOP — singleton for shared resource)

---

### 2026-09-26 — localStorage token key inconsistency between admin pages ("flappywin-token" vs "rozedesk-token")

**What happened:**
Two admin pages used different localStorage key names to read the auth token:
- `src/app/admin/game-deposits/page.tsx` → `localStorage.getItem("rozedesk-token")`
- `src/app/admin/withdrawals/page.tsx` → `localStorage.getItem("flappywin-token")`
- `src/components/dashboard/DashboardHeader.tsx` → `localStorage.getItem("flappywin-token")`

The canonical key defined in `src/lib/api.ts` is `"rozedesk-token"`. The `"flappywin-token"` variant was a copy-paste from an older version of the game-specific wallet code that used a different key. Any admin page using `"flappywin-token"` would silently fail to send the Authorization header (getting `""` back), causing 401s that were hard to debug because the page appeared to load but all actions failed.

**Root cause:**
No DRY abstraction for the `authHeaders()` helper in admin pages. Each page copy-pasted the function and some copied the wrong key.

**Correct approach:**
The `authHeaders()` helper must be defined **once** in a shared module (e.g. `src/lib/api.ts` or `src/lib/adminAuth.ts`) and imported by every admin page:
```typescript
// src/lib/api.ts — already exports getToken()
export function getToken(): string {
  return typeof window !== "undefined" ? localStorage.getItem("rozedesk-token") ?? "" : "";
}

export function authHeaders(json = true): HeadersInit {
  return json
    ? { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }
    : { Authorization: `Bearer ${getToken()}` };
}
```
Every admin page then does `import { authHeaders } from "@/lib/api"` — no local copy.

**Prevention rule:**
Never copy-paste an `authHeaders()` function across page files. The token key name is a value (Universal Engineering Principles §Hard Rule 2 — no duplicated values). It must live in exactly one file. Any new admin page must import `authHeaders` from the shared lib, never redeclare it.

When reviewing a new admin page, check: does it have a local `authHeaders()` function? If yes, replace with the shared import and delete the local copy.

**Related SOP section:** Universal Engineering Principles §Hard Rule 2 (DRY — no duplicated values), Backend SOP §6.2 (auth on every request — a silent token mismatch is a security gap, not just a bug)

---

## Frontend Lessons (continued)

### 2026-09-26 — Toast: button-in-button hydration error broke clickable toasts and admin deposit notifications

**What happened:**
The browser logged `In HTML, <button> cannot be a descendant of <button>` and React threw a hydration error. All clickable toasts were broken, which meant admin deposit-request notifications (which are clickable toasts that navigate to `/admin/game-deposits`) never appeared.

**Root cause:**
`Toast.tsx` used a dynamic `Wrapper` variable — `"button"` when the toast had an `onClick`, `"div"` otherwise. When `Wrapper = "button"`, the dismiss `<button>` at the bottom of the JSX was rendered *inside* the wrapper button:

```jsx
// BROKEN — <button> nested inside <button>
const Wrapper = clickable ? "button" : "div";
<Wrapper onClick={...}>          {/* outer button when clickable */}
  <svg />
  <span />
  <button onClick={dismiss} />   {/* inner button → INVALID HTML */}
</Wrapper>
```

HTML forbids interactive elements (buttons, links, inputs) as descendants of `<button>`. Browsers recover by restructuring the DOM, which mismatches React's virtual DOM snapshot → hydration error. The error manifested as a complete failure to render any clickable toast item, which is why the admin received no notification when a deposit request came in.

**What was wrong about it:**
The pattern `const Wrapper = clickable ? "button" : "div"` looks DRY but creates an illegal HTML structure whenever the wrapper is `"button"` and any descendant is also interactive. The `e.stopPropagation()` on the dismiss button was a hint that someone knew there was a conflict — it was masking the symptom, not fixing the cause.

**Correct structure:**
The outer container must always be a `<div role="alert">`. The *body* of the toast (icon + message) becomes the clickable element when needed. The dismiss button is always a sibling — never a child of another button:

```jsx
// CORRECT — dismiss is a flex sibling, never inside a button
<div role="alert" className="flex items-stretch ...">
  {clickable ? (
    <button type="button" onClick={bodyClick} className="flex flex-1 ...">
      <svg /><span /><span "Open →" />
    </button>
  ) : (
    <div className="flex flex-1 ...">
      <svg /><span />
    </div>
  )}
  {/* Dismiss: always a sibling of the body, never nested */}
  <button type="button" onClick={dismiss} className="flex-shrink-0 ...">
    <svg />
  </button>
</div>
```

With this layout:
- The outer `div` holds `role="alert"` for screen readers.
- The body `<button>` (when clickable) is keyboard-operable and has full flex-1 width.
- The dismiss `<button>` is a flex-sibling with `flex-shrink-0` and a left border separator.
- `e.stopPropagation()` is no longer needed — dismiss is not inside a clickable parent.

**Why this also fixed admin deposit notifications:**
The admin notification toast had `onClick: () => window.location.href = "/admin/game-deposits"`, making it clickable → `Wrapper = "button"` → hydration crash → React abandoned rendering that toast item entirely. Fixing the HTML structure meant the toast renders correctly and the `onClick` navigation works.

**Prevention rule:**
Never use a variable element type (`const Wrapper = interactive ? "button" : "div"`) if any descendant of the rendered element is also interactive (button, a, input, select, textarea). The rule is simple:
- If an element contains interactive descendants → it must be a non-interactive container (`div`, `li`, `article`).
- The interactive action goes on the specific child that the user should click, not the whole container.
- A `<div>` can hold multiple buttons; a `<button>` cannot hold another button.

Check: before using `as React.ElementType` or dynamic tag patterns, ask — "could any descendant ever be interactive?" If yes, the wrapper must be a non-interactive element.

**Related SOP section:** Frontend SOP §Hard Rule 1 (client-side validation is UX only — equally: HTML validity is structural, not optional), UI/UX SOP §Hard Rule 2 (accessibility — interactive elements must be keyboard-operable and structurally valid)

---

## Frontend Lessons (continued)

### 2026-09-26 — Toast not showing in admin panel despite ToastProvider in root layout

**What happened:**
`useToast()` returned no-op callbacks `() => {}` in all admin panel pages. Calling `toast.success()`, `toast.error()` etc. did nothing — no visible toast appeared.

**Root cause — Next.js App Router client/server boundary + nested layout interaction:**
`ToastProvider` was placed in `src/app/layout.tsx` (a **Server Component**). The admin panel has its own `src/app/admin/layout.tsx` (a **Client Component** with `"use client"`). In Next.js App Router, when a Server Component tree wraps a Client Component subtree, React Context created inside the Client Component does NOT automatically propagate through the Server Component boundary into nested Client Component layouts/pages.

The symptom: `useContext(ToastContext)` in admin pages returns the default fallback value `{ success: () => {}, ... }` — the no-op context — because the client-side React tree sees a context provider from a different rendering boundary than expected.

This is distinct from the standard React behaviour where context providers DO propagate through all descendants. The App Router's hybrid server/client rendering creates component tree segments that can break context propagation in certain configurations.

**Why it worked in the seeker dashboard but not admin:**
The seeker dashboard layout (`src/app/dashboard/layout.tsx`) is also `"use client"`. The issue is not with all layouts — the exact failure depends on how Next.js bundles and hydrates each segment. Admin happened to land in a segment where the root-level `ToastProvider` context did not reach.

**Correct fix — add `ToastProvider` directly inside the admin layout:**
```tsx
// src/app/admin/layout.tsx
import { ToastProvider } from "@/components/Toast";

export default function AdminLayout({ children }) {
  // ...
  return (
    <ToastProvider>
      {/* admin shell */}
      {children}
    </ToastProvider>
  );
}
```
React Context allows nested providers — the innermost provider wins. Wrapping the admin layout in its own `ToastProvider` guarantees the context is available to all admin pages regardless of how the App Router hydrates the segment boundary.

**This is not a DRY violation:**
- `ToastProvider` is defined once (single source of truth in `Toast.tsx`).
- Placing it in multiple layout segments is **correct usage** of the React Context pattern — each segment that needs it gets its own provider instance.
- The alternative (a single root provider) is ideal in theory but unreliable in practice with App Router's hybrid rendering model.

**Prevention rule:**
In Next.js App Router, never rely on a React Context provider in a **Server Component** layout to reach all **Client Component** subtrees. For any layout segment that has its own `"use client"` layout and needs a context (Toast, Theme, Auth), add the provider directly in that layout. Apply this rule to:
- Any feature-specific context (Toast, Notifications, Modal)
- Theme providers
- Any `createContext()` whose value must be consumed in that layout segment

**Exceptions:** `AuthProvider` works at root level because it uses cookies/JWT which is server-validated — the client value is always set from the AuthContext's own fetch on mount, not relying on context propagation from server boundary.

**Related SOP section:** Frontend SOP §Hard Rule 1 (validate assumptions — context propagation in App Router must be tested per segment, not assumed), Universal Engineering Principles §Hard Rule 4 (async and rendering boundaries must be explicit)

---

## Backend Lessons

### 2026-09-26 — Admin game settings saved but never applied to players — DB key format mismatch

**What happened:**
Admin saved `escapeMin`, `escapeMax`, `biasMode`, `minWager`, `maxWager`, `minDeposit` from `/admin/game-settings`. Players started new games and saw no change — the old defaults persisted regardless of what the admin set.

**Root cause — two writers, two key formats, zero overlap:**

The admin settings API (`/api/admin/game-settings/route.ts`) writes to `platform_settings` using a `"game."` dot-prefix convention:
```
game.minDeposit, game.minWager, game.maxWager,
game.escapeMin, game.escapeMax, game.biasMode, ...
```

The wallet API (`/api/game/wallet/route.ts`) was reading those same values using a **different, undotted format**:
```ts
getIntSetting("gameMinDeposit", GAME.MIN_DEPOSIT)  // ← "gameMinDeposit", no dot
getIntSetting("gameMinWager",   GAME.MIN_WAGER)     // ← "gameMinWager",   no dot
getIntSetting("gameMaxWager",   GAME.MAX_WAGER)     // ← "gameMaxWager",   no dot
```

`db.platformSetting.findUnique({ where: { key: "gameMinDeposit" } })` returned `null` (no such row) every time because the admin writer stored `"game.minDeposit"`. The `getIntSetting` fallback silently returned the env-backed `GAME.*` constant. No error, no warning — the game simply used hardcoded defaults.

**The game config API** (`/api/game/config/route.ts`) was already using the correct `"game."` prefix for `escapeMin`, `escapeMax`, and `biasMode` — so those three fields WERE being applied correctly from the admin. Only the three wager/deposit limits in the wallet API were broken.

**Fix — align wallet/route.ts to the established `"game."` prefix:**
```ts
// BEFORE (broken — keys never match DB rows written by admin API)
getIntSetting("gameMinDeposit", GAME.MIN_DEPOSIT)
getIntSetting("gameMinWager",   GAME.MIN_WAGER)
getIntSetting("gameMaxWager",   GAME.MAX_WAGER)

// AFTER (correct — matches what /api/admin/game-settings writes)
getIntSetting("game.minDeposit", GAME.MIN_DEPOSIT)
getIntSetting("game.minWager",   GAME.MIN_WAGER)
getIntSetting("game.maxWager",   GAME.MAX_WAGER)
```

**Why this was silent:**
The `getIntSetting` helper returns the `fallback` argument when `findUnique` returns `null`.
`null` row → `parseInt(null, 10)` = `NaN` → `isNaN(v) || v < 1` → returns `fallback`.
The fallback is a valid business number (`GAME.MIN_WAGER = 120`), so no error is thrown,
no log is written, and the UI renders correctly — just with stale defaults.

**Prevention rules:**

1. **One key convention per feature domain, defined once, imported everywhere.**
   The `"game."` prefix is the established convention for this project's game settings.
   Any new reader of `platform_settings` game keys MUST use `"game.<field>"` — never invent a new format.
   
2. **Define all known DB keys as constants, not string literals.**
   Inline string literals like `"gameMinDeposit"` bypass any IDE refactoring and grep checks.
   Create a `GAME_SETTING_KEYS` constants object:
   ```ts
   export const GAME_SETTING_KEYS = {
     minDeposit: "game.minDeposit",
     minWager:   "game.minWager",
     maxWager:   "game.maxWager",
     biasMode:   "game.biasMode",
     escapeMin:  "game.escapeMin",
     escapeMax:  "game.escapeMax",
     // ...
   } as const;
   ```
   Any typo in a key becomes a TS error rather than a silent DB miss at runtime.

3. **Cross-check writer and reader keys in code review.**
   When a new API route reads a `platform_settings` key: always locate the API that writes that key and confirm they use the exact same string. This is a contract — both sides must agree.

4. **Silent fallback is a silent bug.**
   `getIntSetting(key, fallback)` returning the fallback is indistinguishable at the call site from "DB row found and parsed." Add a dev-mode log when the DB row is missing so discrepancies surface during development:
   ```ts
   if (!row) console.warn(`[platform_settings] key "${key}" not found — using fallback ${fallback}`);
   ```

**Files changed:**
- `src/app/api/game/wallet/route.ts` — 3 key strings updated (`"gameMinDeposit"` → `"game.minDeposit"`, etc.)

**Related SOP section:** Backend SOP Hard Rule 2 (no silent swallowing — a DB miss that returns a fallback should at minimum log in dev), Universal Engineering Principles §Hard Rule 2 (DRY — key strings are values; define once, reference everywhere), Backend SOP §4.1 (shared data contracts must be documented and verified on both read and write sides)

---

## Frontend Lessons (continued)

### 2026-09-26 — Admin settings changes not immediately visible in player game — 30-second poll delay

**What happened:**
An admin saved new wager limits (minWager, minDeposit, maxWager) on `/admin/game-settings`. The player's game page (`/dashboard/game`) continued showing the old stake presets and old deposit minimum for up to 30 seconds because the wallet data was only refreshed by a `setInterval(fetchWallet, 30_000)` poll.

**Root cause:**
`page.tsx` fetches `/api/game/wallet` (which returns `minWager`, `minDeposit`, `maxWager` fresh from DB) on mount and then every 30 seconds. There was no mechanism to trigger an out-of-cycle refresh when an admin changed these values. The admin settings page and the player game page had no signal pathway between them.

The API itself had no caching — the DB values were always current. The delay was entirely in the client-side polling interval.

**Why reducing the interval is wrong:**
Cutting the poll from 30s to 5s would multiply server load by 6× for every active player tab. For a game with many concurrent players, this compounds quickly into unnecessary DB reads with no benefit outside the rare admin-saves event.

**Correct approach — BroadcastChannel for zero-cost cross-tab signalling:**
`BroadcastChannel` is a same-origin browser API. Messages posted on a named channel are delivered to all other open tabs/windows on the same origin instantly, with no server round-trip and no extra DB load.

**Admin side** (`game-settings/page.tsx`) — post after every successful PUT:
```typescript
// Inside the save() helper, after setSaveState("saved"):
try {
  const ch = new BroadcastChannel("hunt:settings");
  ch.postMessage({ type: "game-settings-updated", payload });
  ch.close();  // ← open, post, close immediately — no persistent listener needed
} catch { /* BroadcastChannel unsupported (some embedded WebViews) */ }
```

**Player side** (`dashboard/game/page.tsx`) — listen in the wallet useEffect:
```typescript
useEffect(() => {
  fetchWallet();
  const id = setInterval(fetchWallet, 30_000);

  let ch: BroadcastChannel | null = null;
  try {
    ch = new BroadcastChannel("hunt:settings");
    ch.onmessage = (e: MessageEvent) => {
      if (e.data?.type === "game-settings-updated") fetchWallet();
    };
  } catch { /* fall back to 30s poll */ }

  return () => {
    clearInterval(id);
    try { ch?.close(); } catch {}
  };
}, [fetchWallet]);
```

**Key design decisions:**
- Channel name `"hunt:settings"` is namespaced to avoid collision with other BroadcastChannels in the same origin.
- The admin side opens, posts, and **immediately closes** the channel — no persistent sender needed.
- The player side opens once in the effect and **closes in the cleanup** — tied to component lifecycle, no leak.
- The `try/catch` on both sides means the feature degrades gracefully to the 30s poll in environments that don't support BroadcastChannel (e.g. some React Native WebViews, older Safari).
- The message includes `payload` (the changed fields) for future extensibility — the listener could apply partial updates directly without a fetch if desired.

**Security note:**
`BroadcastChannel` is same-origin only by spec. No cross-origin tab can send or receive on this channel. The player side only calls `fetchWallet()` — it never trusts message content for any privileged operation. The actual new values always come from the authenticated API call, not from the message payload.

**Prevention rule:**
Any time a UI has a `setInterval(fetch, N_seconds)` that polls for admin-controlled configuration, ask: "Is there a zero-cost way to signal when the data actually changes?" For same-origin multi-tab apps, `BroadcastChannel` is always the right answer over reducing poll intervals. Only use WebSocket/SSE for cross-device real-time sync.

**Also fixed:** Admin settings page subtitle said "Changes apply to the next game session" — corrected to "Changes apply immediately to new game sessions." Never ship copy that understates the system's capabilities.

**Related SOP section:** Frontend SOP §6.1 (all states — data currency is a UI state), Universal Engineering Principles §Hard Rule 2 (DRY — one signal pathway, not duplicated poll logic), Backend SOP §7 (minimize unnecessary server load — polling is a cost, signals are free)

---

## Frontend Lessons (continued)

### 2026-09-26 — Hardcoded stake presets ignored admin-configured minWager — game showed Rs. 10 minimum when admin set Rs. 5

**What happened:**
The admin set `minWager = 5` in the game settings panel. The game page still showed `10` as the first stake preset button and the wager input stayed at `120` (the server-side env fallback). The admin-configured value had no visible effect.

**Two separate root causes:**

**Root cause A — Hardcoded `STAKES` constant:**
```typescript
const STAKES = [10, 25, 50, 100, 250, 500, 1000];  // ← hardcoded, never changes
```
The UI filtered this with `STAKES.filter(s => s >= minWager)`. When `minWager = 5`, every element passes the filter (`10 >= 5`, `25 >= 5`, etc.) — nothing is removed, and the lowest visible button is still `10`. The filter only hides presets BELOW `minWager`, it cannot ADD presets for values the admin sets below the hardcoded floor of `10`.

**Root cause B — One-directional wager clamp:**
```typescript
setWager(w => Math.max(w, d.minWager));  // ← only clamps upward
```
Initial `wager` state was `GAME.MIN_WAGER`, which reads from `process.env.GAME_MIN_WAGER ?? "120"`. On first wallet load with `d.minWager = 5`:
`Math.max(120, 5) = 120` — the wager stayed at `120`, never snapping to the server's configured floor.

This combination meant the admin-set `minWager` was fetched correctly from the DB and returned by the API but was completely invisible to the user.

**Correct fix A — dynamic presets:**
Replace the hardcoded array with a pure function that generates presets from server limits:
```typescript
function buildStakePresets(min: number, max: number): number[] {
  const steps = [1, 2, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000];
  const result: number[] = [];
  for (const s of steps) {
    const v = s * Math.ceil(min / (s || 1));
    if (v >= min && v <= max && !result.includes(v)) result.push(v);
    if (result.length >= 7) break;
  }
  if (!result.includes(min)) result.unshift(min);
  if (!result.includes(max) && result.length < 8) result.push(max);
  return [...new Set(result)].sort((a, b) => a - b);
}
// Usage (memoised so it only recomputes when server limits change):
const stakePresets = useMemo(() => buildStakePresets(minWager, maxWager), [minWager, maxWager]);
```
This always includes `minWager` as the first button, regardless of its value.

**Correct fix B — first-load snap with `initialWagerSetRef`:**
```typescript
const initialWagerSetRef = useRef(false);

// In fetchWallet:
if (!initialWagerSetRef.current) {
  initialWagerSetRef.current = true;
  setWager(d.minWager);          // snap to server floor on first load
} else {
  // Subsequent 30s polls: clamp into valid range without resetting mid-game
  setWager(w => w < d.minWager ? d.minWager : w > d.maxWager ? d.maxWager : w);
}
```
A ref (not state) is used for the first-load flag because:
- It must be set synchronously in the same call as `setWager(d.minWager)`.
- It must survive re-renders without resetting (unlike a local variable).
- It does not need to trigger a render itself.

**Prevention rules:**
1. **Never hardcode stake/wager presets in a game that has admin-configurable limits.** Any numeric list in a gambling/game UI that can be configured by an admin must be derived at runtime from the API response, not from a compile-time constant.
2. **`Math.max(current, floor)` only enforces a floor; it never snaps to the floor.** If the intent is "start at the server's minimum," use an explicit first-load snap pattern. Distinguish between "clamp to keep valid" (ongoing polls) and "initialise from server" (first load).
3. **When a page has both a server-side env fallback and a DB-backed live config, the env fallback is only a build-time safety net** — the live value must always win on the client. Use a ref-gated first-load snap to guarantee this.

**Related SOP section:** Universal Engineering Principles §Hard Rule 2 (DRY — no duplicated values; presets must not duplicate limits that are already in the API response), Frontend SOP §6.1 (all states — the "loaded/initialised" state must reflect server data, not build-time constants)

---

## Backend Lessons (continued)

### 2026-09-26 — Game withdraw minimum was env-locked, not DB-backed — admin could not change it without a redeploy

**What happened:**
The minimum withdrawal amount was hardcoded as a module-level constant in the withdraw API route:
```typescript
const MIN_WITHDRAW = parseInt(process.env.GAME_MIN_WITHDRAW ?? "120", 10);
```
This value was fixed at deploy time. If the admin needed to raise or lower the minimum (e.g. from Rs. 120 to Rs. 200), a code change and redeploy was required. Additionally, the withdraw page used `minWager` (the minimum game bet) as a proxy for the minimum withdrawal amount — a semantic mismatch that would break if the two values ever diverged.

**Root cause:**
Three separate problems were found together:

1. **Env-locked server validation** — `MIN_WITHDRAW` was a module-level constant set once at process start. No DB read, so admin panel changes had zero effect on server-side enforcement.

2. **Wrong field on the client** — The withdraw page fetched `minWager` from the wallet API and used it as the withdrawal floor. Wager minimum and withdrawal minimum are conceptually different limits. Using `minWager` as a proxy worked only by coincidence when both were set to the same default.

3. **Missing field across the stack** — `minWithdraw` did not exist in `GAME` constants, the `game-settings` API, the wallet API response, or the admin UI. No single entry point existed to manage it.

**Correct fix — full stack change, 6 files:**

| Layer | Change |
|---|---|
| `gameConstants.ts` | Added `GAME.MIN_WITHDRAW` — env-backed (`GAME_MIN_WITHDRAW`), default `200`. Single source of truth for the build-time fallback. |
| `/api/admin/game-settings` | Added `"game.minWithdraw"` to `DEFAULTS` map (env-backed). Added `minWithdraw` to `GET` response. `PUT` validates `>0` and upserts via the existing `$transaction` pattern. |
| `/api/game/wallet` | Added `minWithdraw` to the parallel `Promise.all` load via `getIntSetting("game.minWithdraw", GAME.MIN_WITHDRAW)`. Added `minWithdraw` to the JSON response so clients always receive the live admin-set value. |
| `/api/game/withdraw` | Replaced module-level `const MIN_WITHDRAW = parseInt(process.env...)` with a per-request DB read: `const minWithdraw = await getIntSetting("game.minWithdraw", GAME.MIN_WITHDRAW)`. Server validation now enforces the live admin value, not the deploy-time env value. |
| `dashboard/withdraw/page.tsx` | Renamed state `minWager → minWithdraw`. Fetch type updated to `{ balance: number; minWithdraw: number }`. All UI references (placeholder, helper text, client validation, `min` attr) use `minWithdraw`. |
| `admin/game-settings/page.tsx` | Added `minWithdraw` to `GameSettings` interface, draft state, per-field validation, save payload, the 4-column wager grid (as a `NumInput`), live summary pills, and the "Currently Live" read-only bar. |

**Why `getIntSetting()` per-request in the withdraw route (not module-level):**
A module-level constant is evaluated once when Node.js loads the module — it never reflects subsequent DB changes. A per-request DB read is ~0.5ms (single indexed lookup) and ensures every withdrawal attempt is validated against the current admin setting. For a financial operation, staleness is unacceptable.

**Prevention rules:**
1. Any numeric business rule that an admin should be able to change without a redeploy MUST be stored in the DB and read per-request (or per-minute with a cache). Never use a module-level constant for admin-configurable limits.
2. The withdraw page must fetch its own specific limit (`minWithdraw`) from the API — never reuse a semantically different field (`minWager`) as a proxy, even if both happen to have the same default value today.
3. When adding a new configurable limit, always touch all 5 layers in one commit: constants → admin API → player API → server validation → client UI. A partial implementation (e.g. admin UI without server validation) creates the illusion of control without actual enforcement.

**Files changed:**
- `src/lib/gameConstants.ts`
- `src/app/api/admin/game-settings/route.ts`
- `src/app/api/game/wallet/route.ts`
- `src/app/api/game/withdraw/route.ts`
- `src/app/dashboard/withdraw/page.tsx`
- `src/app/admin/game-settings/page.tsx`

**Related SOP section:** Backend SOP Hard Rule 1 (never trust client — server must validate against authoritative source, not env constant), Backend SOP §4.3 (idempotency / atomic validation), Universal Engineering Principles §Hard Rule 2 (DRY — one source of truth per business rule), Frontend SOP §6.1 (all states — client-side validation must mirror server-side validation exactly)

---

## Frontend Lessons (continued)

### 2026-09-26 — HUNT game: effect PNGs cluttering demo canvas — shared renderer had no demo/live mode distinction

**What happened:**
The idle demo preview (shown before a game starts) displayed large, randomly-placed PNG sprites (feathers, burst, goldTrail, goldCoin, trophy) visibly scattered across the canvas behind the flying bird. The demo was supposed to show only a clean bird flight trajectory.

**Root cause:**
`PixiRenderer` is shared between the real game and the demo. Both paths called the same `onSuccess()` and `onEscapeStart()` methods, which fire `emitParticles()` — spawning full-size PNG-textured Sprites at the bird's position. With a demo loop cycling every ~2.8 seconds, these particle sprites accumulated rapidly. Each particle lived for `1 / 0.014–0.03` ≈ 33–70 frames, so multiple burst cycles worth of sprites were visible simultaneously.

Additionally, the trail emit rate was `0.85 + (m−1)×0.04` per frame — nearly every frame — which in demo mode created a dense cloud of trail circles that further cluttered the canvas.

**What was wrong about it:**
`PixiRenderer` had no awareness of whether it was being used for a live game or a preview/demo. The "demo" concept existed only in `DemoEngine` (the engine class) but the renderer had no matching flag. This violates the OOP principle of behavioural polymorphism — a renderer serving two different contexts must express that difference in its interface.

**Correct fix — `isDemo` flag on `PixiRenderer`:**
```typescript
class PixiRenderer {
  isDemo = false;   /* set to true before init() for demo/preview usage */

  emitParticles(...) {
    if (this.isDemo) return;   /* no PNG particle bursts in demo mode */
    // ...
  }

  update(m: number, phase: Phase) {
    // ...
    /* Trail rate: 25% in demo (clean preview), ~99% in real game (full effect) */
    const trailRate = this.isDemo ? 0.25 : 0.85 + Math.min(0.14, (m - 1) * 0.04);
    if (Math.random() < trailRate) this.emitTrailDot(m);
  }
}

// In demo useEffect:
const rend = new PixiRenderer();
rend.isDemo = true;   // set BEFORE init()
```

**Why `isDemo` not a constructor parameter:**
The flag is set after `new PixiRenderer()` and before `rend.init(canvas)`. Using a public property (not constructor param) keeps the constructor signature unchanged and allows the flag to be set at the call site without changing any other instantiation. A constructor param would require overloading or an options object — unnecessary complexity for a single boolean.

**Why `isDemo` on the renderer, not the engine:**
The engine (`DemoEngine`) already knew it was a demo. The bug was that the renderer did not. The renderer is the one that calls `emitParticles()` and controls trail rate — so the guard belongs there. Putting the guard in the engine would mean the engine would have to suppress calls to renderer methods it doesn't own, which breaks encapsulation.

**Trail rate 25% in demo:**
A light trail is intentional — it helps users visually follow the bird's path. The full 85–99% rate in live games is appropriate for the "exciting" feel but excessive in a subdued preview. 25% gives one dot roughly every 4 frames — enough to show motion, not enough to clutter.

**Prevention rule:**
Any renderer (Pixi, Three.js, canvas 2D) that is used in both a "live/real" context and a "preview/demo/idle" context MUST have an explicit mode flag. Particle emissions, camera shake, screen flash — all effects that are appropriate in real gameplay — are almost always wrong in a preview. Add the flag at the class level (not inline in calling code) so the distinction is enforced at the boundary, not scattered across every call site.

**Related SOP section:** Universal Engineering Principles §Hard Rule 2 (DRY — single renderer class, mode differentiated by flag, not by duplication), OOP §Encapsulation (renderer owns its own mode; callers don't need to know the implementation detail)

---

## Frontend Lessons (continued)

### 2026-09-26 — HUNT game: `Cannot set properties of undefined (setting 'texture')` — writing to a Pixi sprite after destroy()

**What happened:**
`Cannot set properties of undefined (setting 'texture')` at `PixiRenderer.onEscapeStart` line 779,
called from `HuntEngine.tick` via `engine.onEscape` callback.

**Root cause:**
`HuntEngine.destroy()` calls `cancelAnimationFrame(this.rafId)` — but `cancelAnimationFrame` only
cancels a **scheduled** frame. If the engine is mid-tick when `destroy()` is called, the current
tick frame cannot be cancelled. The tick continues synchronously through its callbacks:

```
tick() {
  // phase === "FLYING", cap reached
  _doEscape()          // → onEscape(bx, by) → rend.onEscapeStart(bx, by)
  onPhaseChange(...)   // → setGameActive(false) → React schedules re-render
  // React useEffect cleanup will run on NEXT render, not now
  // tick continues here — rAF loop still running
  this.rafId = requestAnimationFrame(this.tick)
}
```

`rend.destroy()` runs in the React `useEffect` cleanup, which fires on the **next render cycle**
— one or more rAF frames after `setGameActive(false)`. During this window, any rAF tick that
calls a renderer method (e.g. from `engine.onEscape → rend.onEscapeStart`) hits sprites that
have already been destroyed by `rend.destroy()`.

In Pixi v8, a destroyed Sprite's internal `_texture` reference is nulled. Setting `.texture` on it
throws: `Cannot set properties of undefined (setting 'texture')`.

**Fix — `_destroyed` guard at top of every public renderer method:**
```typescript
onFlyingStart()             { if (this._destroyed) return; ... }
onSuccess(x, y)             { if (this._destroyed) return; ... }
onEscapeStart(x, y)         { if (this._destroyed) return; ... }
onNewRound()                { if (this._destroyed) return; ... }
private _setHunter(key)     { if (this._destroyed || this.hunter?.destroyed) return; ... }
```

Additionally guard individual sprite `.texture` writes with a per-sprite `.destroyed` check
as a second line of defence:
```typescript
// In onEscapeStart:
if (tFail && !this.bird.destroyed) this.bird.texture = tFail;

// In onNewRound:
if (tBird && !this.bird.destroyed) { this.bird.texture = tBird; ... }
```

**OOP principle applied — Defensive Object State:**
A destroyed object must silently no-op all further method calls rather than throwing.
This is the Null Object / Guard pattern applied to object lifecycle:
- The `_destroyed` flag is the single source of truth for the object's lifecycle state.
- Every public method checks it first — this is a postcondition of `destroy()`.
- Private helpers that touch sprites also check it because they may be called from GSAP
  `onComplete` callbacks that fire asynchronously after `destroy()` has run.

**Prevention rule:**
Any class that wraps a WebGL/Canvas resource (Pixi Application, Three.js renderer, etc.) MUST:
1. Set a `_destroyed = true` flag as the very first line of `destroy()`.
2. Add `if (this._destroyed) return;` as the first line of EVERY public method.
3. Add `if (sprite.destroyed) <skip write>` before EVERY `.texture =` or `.filters =` write
   inside `onComplete` callbacks — these fire asynchronously and are not covered by (2).

Never rely on `cancelAnimationFrame` alone to stop all callbacks — it only cancels future frames,
not the current one or any already-queued microtasks/macrotasks.

**Related SOP section:** Frontend SOP §Hard Rule 1 (async state transitions must be explicit),
Universal Engineering Principles §Hard Rule 3 (object lifecycle — destroyed state must be honoured)

---

### 2026-09-26 — HUNT game: `PIXI.Texture.from()` throws null.split on 2nd boot — hardening the _tex population loop

**What happened:**
Even after `PIXI.Assets.reset()` in `destroy()` and re-loading assets in `init()`, `PIXI.Texture.from(src)`
in the `_tex` population loop could still throw `null.split` in edge cases on second boot.

**Root cause:**
`PIXI.Texture.from(src)` is a synchronous lookup that goes through several internal maps:
`TextureCache → BaseTextureCache → resolver._resolverHash`. If `Assets.load()` completed but the
internal reference chain has a stale null entry from a prior partially-loaded texture,
`Texture.from()` can throw `null.split` when it tries to normalise the URL internally.

Additionally, `Texture.from()` can return a valid-looking `Texture` object whose `.destroyed`
property is `true` — this happens when Pixi reuses an object slot for a newly loaded texture
over a slot that was previously destroyed. Writing this into `_tex` and later calling `.width`
on it would crash.

**Fix — triple-guard in the _tex population loop:**
```typescript
for (const src of allUrls) {
  try {
    const t = PIXI.Texture.from(src);
    // Guard 1: t must exist
    // Guard 2: t must not be a destroyed slot
    // Guard 3: t must have real dimensions (not a placeholder 1×1 texture)
    if (t && !t.destroyed && t.width > 0) this._tex.set(src, t);
  } catch { /* URL not resolved, wrong content type, or cache in bad state */ }
}
```

**Why each guard matters:**
- `t &&` — `Texture.from` can return null/undefined in some Pixi build configurations
- `!t.destroyed` — Pixi can reuse object slots; a destroyed texture must never be cached
- `t.width > 0` — a successfully loaded texture always has real width; a pending/failed texture has width 0

**Prevention rule:**
Never store a `PIXI.Texture` reference without checking all three: truthy, not-destroyed, non-zero width.
This triple-guard must be applied at every point where a texture is stored in any cache or Map.

**Related SOP section:** Universal Engineering Principles §Hard Rule 2 (defensive by default),
Frontend SOP §Hard Rule 1 (validate third-party return values before storing)

---

## Frontend Lessons (continued)

### 2026-09-26 — HUNT game: `Cannot set properties of null (setting 'y')` — GSAP sets property on Pixi-destroyed sprite

**What happened:**
`TypeError: Cannot set properties of null (setting 'y')` fired after pressing SECURE or after a bird escape. The crash happened inside GSAP's tween update loop, not in application code directly.

**Root cause — Pixi v8 `destroy()` nulls the sprite's internal transform:**
When `app.destroy({ children: true })` is called, Pixi calls `.destroy()` on every display object in the stage tree. In Pixi v8, `DisplayObject.destroy()` sets `this.transform = null` (among other internal fields). GSAP's tween system does NOT know about Pixi's destroy mechanism — it holds a reference to the sprite object and continues calling its property setters (`.x`, `.y`, `.alpha`, `.rotation`) on the next rAF tick. The Pixi setter for `.y` internally reads `this.transform.position.y = value` — but `this.transform` is now `null`, producing the crash.

**There are two separate crash paths:**

**Path A — Nested `onComplete → gsap.to()` creates an orphan tween:**
```typescript
// WRONG — inner tween is created AFTER killTweensOf() ran in destroy()
gsap.to(this.bird, {
  y: targetY,
  onComplete: () => {
    if (this._destroyed || this.bird.destroyed) return;
    gsap.to(this.bird, { y: settleY });  // ← orphan: created AFTER the kill sweep
  },
});
```
`destroy()` calls `gsap.killTweensOf(this.bird)` which kills the outer tween but does NOT kill the inner tween — because the inner tween does not exist yet at kill time. The outer tween's `onComplete` fires afterward (GSAP calls completed callbacks even when tweens are killed in some versions), creating the inner tween. That inner tween then sets `.y` on the destroyed sprite.

**Fix — use `gsap.timeline()` stored in a class field:**
```typescript
// CORRECT — both segments are one killable Animation object
this._successLoop = gsap.timeline()
  .to(this.bird, { y: targetY,  duration: 0.35, ease: "power2.out" })
  .to(this.bird, { y: settleY,  duration: 0.50, ease: "power1.in"  });
```
`destroy()` calls `this._successLoop.kill()` which kills both segments atomically. No orphan tweens possible.

**Path B — `resize()` and `_setAxisLabel()` called from `ResizeObserver` after destroy:**
`ResizeObserver` fires asynchronously. After `rend.destroy()` runs (teardown effect), the browser can still fire the `ResizeObserver` callback on the next frame. `resize()` and `_setAxisLabel()` then set `.x`, `.y` on sprites that Pixi has already destroyed. The existing guard `if (!this.app)` does NOT protect against this because `this.app` is set to `null` at the END of `destroy()`, but the ResizeObserver fires before React's cleanup runs.

**Fix — add `_destroyed` check at the top of every method that sets sprite properties:**
```typescript
resize(w: number, h: number) {
  if (this._destroyed || !this.app || ...) return;  // _destroyed checked FIRST
  // ...
  if (!this.hunter.destroyed) {                      // individual sprite guard
    this.hunter.x = w * 0.12;
    this.hunter.y = h - this._groundH() + 2;
  }
}

private _setAxisLabel(tick, x, y, fontSize) {
  if (this._destroyed || !this.app || !this.PIXI) return;  // _destroyed first
  const label = this._axisLabels[tick - 1];
  if (!label || label.destroyed) return;            // label-level guard
  label.x = x; label.y = y;
}
```

**Why `!this.hunter` is insufficient — CRITICAL distinction:**
```typescript
// WRONG — hunter is never null; it's a class field assigned in buildScene()
if (this._destroyed || !this.hunter || this.hunter.destroyed) return;
// ↑ !this.hunter is always false because the field holds the object reference

// CORRECT — check .destroyed flag, not nullability
if (this._destroyed || this.hunter.destroyed) return;
```
After `app.destroy()`, Pixi sprites have `destroyed === true`. The object reference itself is not null — only its internal state is invalid. Always check `.destroyed`, never `!sprite`.

**Prevention rules (all apply when wrapping Pixi.js in a class with GSAP):**

1. **Never nest `gsap.to()` inside `onComplete`.** If you need sequential animations, use `gsap.timeline()` stored in a class field that `destroy()` can kill atomically with `.kill()`.

2. **`_destroyed` flag check must be the FIRST line of every method that touches sprite properties** — not after `!this.app`. The app reference is nulled at the END of `destroy()` but `_destroyed` is set at the START.

3. **Check `sprite.destroyed` not `!sprite`** before every direct property set (`x`, `y`, `rotation`, `alpha`, `texture`, `scale`). The reference is never null — only the internal state is invalid.

4. **Widen GSAP type fields that store either `Tween` or `Timeline`** to `gsap.core.Animation | null`. Both `Tween` and `Timeline` extend `Animation`, which exposes `.kill()`. Never type them as `Tween` if a timeline may be stored.

5. **`ResizeObserver` callbacks fire asynchronously** — they can arrive after React's `useEffect` cleanup but before `this.app` is null. `_destroyed` is the reliable guard because it is set synchronously at the start of `destroy()`.

**Related SOP section:** Frontend SOP §Hard Rule 1 (all teardown paths must be explicit), Universal Engineering Principles §Hard Rule 4 (async timing must be explicit — ResizeObserver, rAF, and GSAP callbacks all fire outside React's lifecycle)

---

## Security Lessons

### 2026-09-26 — CRITICAL: Next.js middleware named proxy.ts — route guards completely bypassed

**What happened:**
`/dashboard/*` and `/admin/*` routes had zero page-level authentication protection. Any browser could navigate to `/admin/settings`, `/admin/jobs`, or `/dashboard` without a cookie and the shell UI would render. API calls returned 401/403 correctly, but the page itself loaded.

**Root cause:**
The middleware file was named `proxy.ts` and exported a function named `proxy`. Next.js middleware MUST be named exactly `middleware.ts` (or `middleware.js`) at `src/` or the project root, and the export MUST be named `middleware`. Any other filename is silently ignored — the framework never loads it.

**What this means in practice:**
The entire route-guard system written in `proxy.ts` — redirect unauthenticated users, redirect seekers away from admin, redirect logged-in users away from signin — was completely dead code from day one. It could be perfectly correct logic and still protect nothing.

**Fix:**
Created `src/middleware.ts` with the exact same logic, correct export name `middleware`, and the same `config.matcher`.

**Prevention rule:**
Next.js middleware has exactly one valid location and one valid export name. Before writing any middleware logic, verify:
1. File is at `src/middleware.ts` or `<project-root>/middleware.ts`
2. The route guard function is exported as `export function middleware(request: NextRequest)`
3. `export const config = { matcher: [...] }` is present

If the filename, export name, or location is wrong, Next.js loads the app without running any middleware — no warning, no error, no indication anything is missing.

**Related SOP section:** Security SOP §4.1 (access control — verify the guard actually runs), Backend SOP §6.2 (authorization must be verified end-to-end, not assumed)

---

### 2026-09-26 — CRITICAL: JWT_SECRET fallback "dev_secret" in production collapses entire auth system

**What happened:**
`apiAuth.ts` contained `const JWT_SECRET = process.env.JWT_SECRET ?? "dev_secret"`. Any production deployment where `JWT_SECRET` was not set in the environment would fall back to a publicly known string. Any attacker who knew the source code (e.g. via a public GitHub repo) could forge a valid JWT for any user ID and role, including `ADMIN`.

**Root cause:**
Defensive coding pattern used incorrectly: `?? "fallback"` is appropriate for non-security-critical config (port numbers, log levels), but catastrophic for cryptographic secrets. A known fallback is worse than no secret at all — at least with no secret the app crashes visibly. With a known fallback it silently accepts forged tokens.

**Fix:**
```typescript
const JWT_SECRET = (() => {
  const s = process.env.JWT_SECRET;
  if (!s && process.env.NODE_ENV === "production") {
    throw new Error("FATAL: JWT_SECRET env var is not set.");
  }
  return s ?? "dev_secret_local_only";
})();
```
In production: throws at module load time (server startup fails visibly before accepting any request).
In development: falls back to a local-only value that is clearly named as non-production.

**Prevention rule:**
Never use `?? "any_value"` for: JWT secrets, encryption keys, API keys, session secrets, HMAC keys, or any value used in a cryptographic operation. Use `?? fallback` only for: timeouts, ports, log levels, feature flags, display strings. For cryptographic secrets, fail fast and loudly if missing. A startup crash is infinitely better than a silent security bypass.

**Related SOP section:** Security SOP §4.7 (authentication — secrets must not have known fallbacks), DevOps SOP §3 (secrets management — all secrets in env vars, no hardcoded values including fallbacks for crypto)

---

### 2026-09-26 — HIGH: Game session finalScore unbounded — unlimited payout exploit

**What happened:**
`PATCH /api/game/session` accepted any `finalScore` value with `cashout: true`. A client could submit `{ sessionId, finalScore: 999999999, cashout: true }` and receive `wager × (999999999 / 100)` credited to their wallet — potentially hundreds of millions of rupees from a single Rs. 10 wager.

**Root cause:**
`finalScore` was validated for type (`typeof finalScore !== "number"`) and sign (`finalScore < 0`) but not for magnitude. The payout calculation is `wager × (finalScore / 100)` — the server trusted the client's claimed multiplier.

**The correct mental model for crash games:**
The server should compute the outcome from server-side state (the session's wager and the server-determined escape cap), not from client-submitted score. Since this codebase uses a client-computed multiplier (architecture decision), the minimum mitigation is a hard cap on `finalScore` that exceeds any legitimate game outcome.

**Fix:**
```typescript
const MAX_FINAL_SCORE = 100_000; // 1000× — generous cap, still prevents exploit
if (finalScore > MAX_FINAL_SCORE) {
  return NextResponse.json({ message: "finalScore exceeds maximum." }, { status: 400 });
}
```

**Prevention rule:**
Every numeric value from a client that feeds a money calculation MUST have:
1. Type validation (number, not string/null)
2. Sign validation (non-negative where applicable)
3. **Magnitude validation** — an upper bound that makes financial sense

"The client can only send values the game produces" is not a security property — it's a trust assumption. Assume the client is hostile.

**Related SOP section:** Security SOP §4.4 (business logic abuse), Backend SOP §Hard Rule 1 (never trust client input for money-sensitive values)

---

### 2026-09-26 — HIGH: Path traversal via unsanitized path param in /api/admin/file

**What happened:**
`GET /api/admin/file?path=../../other-bucket/file` passed the raw `path` query parameter directly to `getSignedUrl(path, 3600)`, which forwarded it to Supabase `storage.createSignedUrl()`. A crafted path could potentially generate a valid signed URL for files outside the intended `cv/` and `receipts/` folders.

**Root cause:**
File path from query string was not validated against an allowlist of permitted prefixes before use.

**Fix — prefix allowlist + path normalisation:**
```typescript
const ALLOWED_PREFIXES = ["cv/", "receipts/", "screenshots/"];
const normalised = path.replace(/\\/g, "/").replace(/\/\.\.\/|^\.\.\/|\.\.$/, "");
if (!ALLOWED_PREFIXES.some(p => normalised.startsWith(p))) {
  return NextResponse.json({ message: "Invalid file path." }, { status: 400 });
}
// Use `normalised`, not `path`, in all subsequent calls
```

**Prevention rule:**
Any endpoint that accepts a file path, bucket key, or storage identifier as a query/body parameter MUST validate it against a known-good prefix before use — regardless of what the downstream SDK is expected to do. Never rely on the SDK to reject traversal strings. Validate the path before it reaches any storage or filesystem call.

**Related SOP section:** Security SOP §4.3 (injection — path traversal is a variant of injection), Backend SOP §Hard Rule 1 (server validates, never trusts client input)

---

### 2026-09-26 — MEDIUM: Auth cookies missing `secure` and `sameSite` flags on seeker routes

**What happened:**
The seeker signin and signup routes set `httpOnly: true` on auth cookies but omitted `secure` and `sameSite`. The admin signin route correctly used `secure: process.env.NODE_ENV === "production"` and `sameSite: "lax"` — the seeker routes missed both.

**Impact:**
- Without `secure`: the cookie can be transmitted over plaintext HTTP in production if HTTPS is not enforced at the infrastructure level.
- Without `sameSite`: cross-site request forgery (CSRF) is not mitigated at the cookie level.

**Fix:**
```typescript
const isProd = process.env.NODE_ENV === "production";
response.cookies.set("rozedesk-token", token, {
  httpOnly: true,
  secure:   isProd,
  sameSite: "lax",
  path:     "/",
  ...(rememberMe ? { maxAge } : {}),
});
```

**Prevention rule:**
When setting an auth cookie, the complete required set of flags is:
- `httpOnly: true` — prevents JS access (XSS token theft)
- `secure: process.env.NODE_ENV === "production"` — HTTPS only in prod
- `sameSite: "lax"` — CSRF mitigation (use `"strict"` for admin cookies)
- `path: "/"` — available to all routes

Never copy a cookie.set() call from one route to another without checking that all four flags are present. Define a shared `makeAuthCookieOptions()` helper to guarantee consistency.

**Related SOP section:** Security SOP §4.7 (session cookies must have httpOnly, Secure, SameSite), Backend SOP §5.2 (auth attributes never sourced from client)

---

### 2026-09-26 — MEDIUM: Admin settings route wrote game settings with wrong DB key prefix

**What happened:**
`PUT /api/admin/settings` wrote game minimum deposit and wager as `"gameMinDeposit"` and `"gameMinWager"`. The game engine (`/api/game/config`, `/api/game/wallet`) read from `"game.minDeposit"` and `"game.minWager"` (dot-prefix convention). The write and the read used different keys — changes saved from the admin settings panel were silently discarded by the game engine.

**Root cause:**
Two different routes maintained the same logical settings with inconsistent key naming. No single source of truth for the key names.

**Fix:**
Changed the writer to use the same `game.` prefix: `{ key: "game.minDeposit", value: String(v) }`. Also fixed the GET reader to look up the same keys.

**Prevention rule:**
Platform settings keys are a contract between the writer and the reader. Any time a setting is written in one route and read in another, both routes MUST reference the key from a shared constant — not a string literal typed independently in each file. Define:
```typescript
// lib/settingsKeys.ts
export const SETTINGS = {
  GAME_MIN_DEPOSIT: "game.minDeposit",
  GAME_MIN_WAGER:   "game.minWager",
  // ...
} as const;
```
Then import and use `SETTINGS.GAME_MIN_DEPOSIT` in every route that reads or writes it. A typo in a string literal silently stores to the wrong key with no error.

**Related SOP section:** Universal Engineering Principles §Hard Rule 2 (DRY — a string value used in multiple places must be defined once), Backend SOP §Hard Rule 2 (never swallow data silently — a setting that saves successfully but has no effect IS a silent failure)

---

### 2026-09-26 — MEDIUM: In-memory filter on full DB table caused O(n) memory load in ledger API

**What happened:**
`GET /api/admin/ledger` fetched ALL payment records from the database, then applied a search filter `q` using JavaScript `.filter()` on the in-memory array. On a large dataset, this loads the entire payments table into the Node.js process on every ledger page load — potential OOM and slow response.

**Root cause:**
The search filter was added after the DB query was written, as a quick JS fix rather than modifying the Prisma `where` clause.

**Fix:**
Pushed the filter into the Prisma query:
```typescript
const searchFilter = q ? {
  OR: [
    { application: { user: { name: { contains: q } } } },
    { application: { job:  { title: { contains: q } } } },
    { id: { contains: q } },
  ],
} : {};
const payments = await db.payment.findMany({ where: { ...where, ...searchFilter }, ... });
```

**Prevention rule:**
Filtering, sorting, and pagination MUST happen at the database layer, not in JavaScript. Any time you write `.filter()`, `.sort()`, or `.slice()` on the result of a DB query, ask: "Could this array be large?" If yes, push the operation into the `where`, `orderBy`, or `take`/`skip` of the Prisma query. The exception is computed fields (e.g. `net = amount * cut`) that the DB cannot compute — those are fine in JS after a bounded result set is returned.

**Related SOP section:** DBA SOP §6 (query design — filters at DB level, not app level), Backend SOP §Hard Rule 2 (silent performance failures are still failures)

---

### 2026-09-26 — MEDIUM: Analytics conversionPct formula always returned exactly 10%

**What happened:**
The conversion rate KPI in `/api/admin/analytics` was computed as:
```typescript
(applicants / Math.max(applicants * 10, 1)) * 100
```
This simplifies to `applicants / (applicants * 10) * 100 = 1/10 * 100 = 10` — always exactly 10% whenever there are any applicants. The metric was meaningless but looked plausible.

**Root cause:**
The formula was written to produce a "reasonable-looking" percentage (10% conversion is a common industry figure) rather than computing an actual rate. This is the definition of a hardcoded value hidden inside a formula.

**Fix:**
Used a real metric — applicants who advanced past payment review divided by total applicants:
```typescript
const advancedCount = await db.application.count({
  where: { status: { in: ["CV_UNDER_REVIEW", "SHORTLISTED", "HIRED"] }, createdAt: { gte: from, lte: to } },
});
const conversionPct = applicants > 0
  ? parseFloat(((advancedCount / applicants) * 100).toFixed(1))
  : 0;
```

**Prevention rule:**
Before shipping any computed metric (conversion rate, average, ratio), verify it manually: pick a concrete example (e.g. 5 applicants, 2 advanced) and trace the formula to confirm it produces the expected result (2/5 × 100 = 40%). If the formula always produces the same value regardless of input, it is hardcoded — remove or fix it. Analytics that report incorrect data are worse than no analytics.

**Related SOP section:** Backend SOP §Hard Rule 2 (silent failures — a metric that always returns the same wrong value is a failure), Universal Engineering Principles §Hard Rule 4 (verify before asserting)

---

### 2026-09-26 — MEDIUM: SSE endpoint used Access-Control-Allow-Origin: * allowing cross-origin subscriptions

**What happened:**
`GET /api/notifications/stream` (Server-Sent Events) included `"Access-Control-Allow-Origin": "*"` in its response headers. While the endpoint required a valid auth cookie and would return no data without one, the wildcard CORS header allowed any origin to attempt an SSE connection — violating the principle of minimum exposure.

**Fix:**
Restricted to the app's own origin:
```typescript
"Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
```

**Prevention rule:**
`Access-Control-Allow-Origin: *` is appropriate ONLY for genuinely public APIs that serve anonymous data (e.g. a public asset CDN). For any authenticated endpoint — even one that would return nothing without a valid session — restrict CORS to the application's own origin. This eliminates an entire class of cross-origin probing attacks.

**Related SOP section:** Security SOP §4.5 (security misconfiguration — default-open CORS is a misconfiguration), DevOps SOP §4 (network security — restrict to minimum necessary access)

---

### 2026-09-26 — MEDIUM: HTML injection via user input in transactional email templates

**What happened:**
`/api/contact/route.ts` inserted `name`, `email`, `subject`, and `message` directly into an HTML email template string using ES6 template literals. A user could submit `name: "<b onclick='...'>"` to inject arbitrary HTML/CSS into the admin's email client.

**Root cause:**
Template literal string interpolation does not perform HTML escaping. Raw user input inserted into an HTML string is HTML injection.

**Fix — inline escape function:**
```typescript
const esc = (s: string) =>
  s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
   .replace(/"/g,"&quot;").replace(/'/g,"&#39;");

const safeName = esc(name.trim());
// ... then use safeName in the HTML template
```

**Prevention rule:**
User-supplied strings must NEVER be interpolated directly into an HTML string. This applies to: email templates, notification HTML, admin panel rendered strings, and any `innerHTML` equivalent. Always escape before interpolation, or use a template engine that auto-escapes. The `text:` field of the email (plain text) does not need escaping — only the `html:` field.

**Related SOP section:** Security SOP §4.3 (injection — HTML injection is a variant of XSS), Frontend SOP §Hard Rule 4 (never inject raw user content into HTML)

---

### 2026-09-26 — LOW: npm audit: Next.js 16.3.5 had a critical RCE in next/og ImageResponse

**What happened:**
`npm audit` reported `GHSA-vcvr-r3jv-pc5j` — Remote Code Execution in Next.js `next/og` ImageResponse — affecting versions 16.2.0–16.3.5. This is a CRITICAL severity CVE.

**Fix:**
`npm audit fix` patched `brace-expansion` (removing it from the audit output). The Next.js RCE was resolved separately — `npm audit --audit-level=critical` returned exit code 0 after the fix.

**Remaining unresolved:**
- `deepmerge-ts` / `mysql2` HIGH via Prisma internals — fix requires `prisma@6.x` which is a breaking major version bump. Deferred to a dedicated Prisma migration sprint.
- `mariadb` HIGH via `@prisma/adapter-mariadb` — no fix available upstream. This project uses MySQL directly, not MariaDB adapter — low practical risk.

**Prevention rule:**
Run `npm audit` as part of every deploy pipeline. Set `--audit-level=high` as the CI gate — builds fail on high/critical findings until resolved. Do not treat `npm audit` as a one-time check; run it after every `npm install` and every dependency version change. For Prisma: track the upstream security advisories separately because Prisma's internal adapter dependencies (mysql2, mariadb) frequently trail behind available patches.

**Related SOP section:** Security SOP §4.6 (vulnerable and outdated components — dependency audit required before launch), DevOps SOP §5 (CI/CD — security gates in pipeline)

---

### 2026-09-26 — Architecture: Full pre-launch security audit revealed gaps at role seams

**What happened:**
The individual per-role security rules (Backend's `requireAuth`/`requireAdmin`, DBA's ownership scoping, Frontend's UI guards) were all correctly implemented within each role's boundary. But two CRITICAL gaps existed at the seams between roles:
1. The middleware (DevOps/Architecture concern) was a dead file — so Frontend's UI was unprotected despite Backend's API being correctly guarded.
2. The JWT fallback secret (Backend concern) would have collapsed all per-route auth in any production deployment missing the env var.

Neither gap was visible from inside any single role's codebase — they only became apparent when the whole system was read end-to-end.

**The lesson:**
Per-role security discipline does not automatically produce a secure whole. A complete audit that reads the system as an attacker sees it (from the outside in) is required before any public deployment. The Security SOP §0 states this explicitly: "gaps live at the seams between roles."

**Prevention rule:**
Before any production deployment, a full cross-role security review MUST be performed:
1. Start from the entrypoint (middleware) and trace: is the guard actually loaded?
2. Trace every auth check: does it fail-safe (throw) or fail-open (return null)?
3. Verify crypto config: does every secret have a hard-fail if missing?
4. Run `npm audit` for supply-chain issues.

The Security SOP §7 go-live checklist must be completed before launch — not just assumed to be covered by the individual role SOPs.

**Related SOP section:** Security SOP §0 (mandate — gaps live at the seams), §7 (go-live gate — all 10 items must be checked), §2.1 (required inputs — complete entry point list before testing)

---

## DevOps / Next.js Lessons

### 2026-10-01 — All routes returned 404: middleware.ts and proxy.ts both present in Next.js 16

**What happened:**
Every page route (`/`, `/dashboard`, `/admin`, `/dashboard/game`) returned 404. No page compiled or served correctly. The server log repeated:

```
⨯ unhandledRejection: Error: Both middleware file "./src\middleware.ts" and proxy file
"./src\proxy.ts" are detected. Please use "./src\proxy.ts" only.
```

**Root cause:**
Next.js 16 (Turbopack) renamed the middleware contract. The new convention is:
- File: `src/proxy.ts`
- Export: `export function proxy(request: NextRequest)`

The legacy convention was:
- File: `src/middleware.ts`
- Export: `export function middleware(request: NextRequest)`

Both files existed simultaneously with identical auth logic. Next.js 16 treats this as a fatal conflict — when both are detected, the entire request pipeline crashes before reaching any route handler. Every route returns 404 because no request ever makes it past the broken middleware stage.

**What was wrong about it:**
When migrating from Next.js 14/15 to Next.js 16, `proxy.ts` was created with the new contract but `middleware.ts` was never deleted. Both files had the same route guard logic (dashboard/admin/signin/signup protection), so no functionality was missing from `proxy.ts`.

**Correct fix:**
Delete `src/middleware.ts`. `src/proxy.ts` is the sole route guard file. No code changes needed — `proxy.ts` was already complete and correct.

**Verification steps after fix:**
1. `Get-ChildItem src -Filter "*.ts" | Where-Object { $_.Name -match "middleware|proxy" }` — confirms only `proxy.ts` remains.
2. `Remove-Item -Recurse -Force ".next"` — clear the build cache so Next.js does not serve stale compiled output.
3. Restart the dev server — confirm no `unhandledRejection` errors, all routes return expected status codes.

**Prevention rule:**
When upgrading Next.js major versions, always check for renamed/replaced conventions:
- Search for `middleware.ts` in `src/` — if `proxy.ts` also exists, delete `middleware.ts`.
- The error message `Both middleware file ... and proxy file ... are detected` is unambiguous: one file must be removed.

Never keep both files "just in case" — Next.js does not merge them; it crashes the pipeline entirely.

**Next.js version map:**
| Version | File name | Export name |
|---------|-----------|-------------|
| ≤15 | `src/middleware.ts` | `export function middleware()` |
| 16+ (Turbopack) | `src/proxy.ts` | `export function proxy()` |

`config.matcher` export is the same in both versions.

**Related SOP section:** DevOps SOP §Deployment checklist (verify framework conventions after major version bumps), Universal Engineering Principles §Hard Rule 2 (one source of truth — two files with the same responsibility is a violation)

---

## DevOps Lessons

### 2026-09-26 — Turbopack FATAL panic from corrupted .sst cache files after forced process kill

**What happened:**
`next dev` (Turbopack) failed with a FATAL panic on startup:
```
TurbopackInternalError: Failed to lookup task ids
Caused by: Unable to open static sorted file referenced from 00000329.meta
failed to open file `.next\dev\cache\turbopack\v16.3.5-ca2c75eb\00000324.sst`: The system cannot find the file specified. (os error 2)
```
Also: `ENOENT: no such file or directory, open '.next\dev\server\app\api\...\app-paths-manifest.json'`

**Root cause:**
Turbopack maintains a persistent task graph database under `.next/dev/cache/turbopack/` using SST (Sorted String Table) files — similar to RocksDB/LevelDB. This database is incrementally updated in a background thread as compilation tasks complete.

When the Node.js process is forcefully killed (window closed, Task Manager, power loss, or a crash after a long-running connection like a 23-minute SSE stream), the background persist thread is interrupted mid-write. This leaves:
- A `.meta` file that references an `.sst` file that was never fully written
- An `.sst` file that is missing or partially written

On the next `npm run dev`, Turbopack tries to resume from the persisted state, reads the `.meta` file, tries to open the referenced `.sst` file, fails with `os error 2` (file not found), and panics fatally. The process then disables all further persisting (`Persisting is disabled for this session`), which means even subsequent routes fail to compile.

**Fix:**
```powershell
# Kill any running node processes first
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2
# Wipe the corrupted cache
Remove-Item -Recurse -Force ".next"
# Then restart normally
npm run dev
```

**Prevention rules:**
1. Always stop the dev server with `Ctrl+C` — never close the terminal window directly.
2. If the server must be force-killed (crash, Task Manager), always run `Remove-Item -Recurse -Force .next` before the next `npm run dev`.
3. Long-lived SSE/WebSocket connections in dev mode increase the risk of mid-write corruption if interrupted — implement a dev-only timeout (e.g. 5 min) on SSE streams to reduce open connection duration.
4. Add a `package.json` script: `"dev:clean": "Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue; npm run dev"` for one-command clean restart.
5. This is a known Turbopack dev-mode limitation. It does NOT affect production builds (`next build`).

**This error is NOT a code bug** — it cannot be fixed by editing source files. The only fix is always cache deletion.

**Related SOP section:** DevOps SOP §Incident Response — distinguish infra/tooling failures from application code bugs before attempting a code fix.

---

## DevOps Lessons

### 2026-09-26 — Railway MySQL plugin injects different env var names than what db.ts and Prisma config were reading

**What happened:**
The app connected to the local XAMPP MySQL database fine in development but failed to connect on Railway deployment. No database connection was established because the DB config code was reading env vars that Railway never sets.

**Root cause — env var name mismatch:**
Railway's MySQL plugin automatically injects these variables into the service environment:
```
MYSQLHOST        = <private domain>
MYSQLPORT        = 3306
MYSQLUSER        = root
MYSQLPASSWORD    = <generated password>
MYSQLDATABASE    = railway
MYSQL_URL        = mysql://root:<pass>@<host>:3306/railway   (pre-resolved)
```

The existing `db.ts` read: `DB_HOST`, `DB_NAME`, `DB_PASSWORD`, `DB_USER`, `DB_PORT` — none of which Railway sets. The fallback then tried `DATABASE_URL`, which in `.env.local` was `mysql://root:@127.0.0.1:3306/rozedesk` (localhost — correct for dev, wrong for prod). Railway does NOT automatically inject `DATABASE_URL`.

`prisma7.config.ts` read only `process.env["DATABASE_URL"]` — same problem, missed the Railway vars entirely.

**The `${{...}}` trap:**
The Railway dashboard displays a `MYSQL_URL` template like:
```
mysql://${{MYSQLUSER}}:${{MYSQL_ROOT_PASSWORD}}@${{RAILWAY_PRIVATE_DOMAIN}}:3306/${{MYSQL_DATABASE}}
```
This is Railway's reference syntax for composing variables in the dashboard UI. It is resolved by Railway's config system at deploy time, so `process.env.MYSQL_URL` at runtime contains the **fully resolved** string with real values. However, if you copy this template string into a `.env` file as-is (with the `${{...}}` syntax), Node.js will NOT resolve it — it reads it as a literal string. Never paste Railway reference syntax into `.env` files.

**Correct fix — 4-tier fallback chain (identical in db.ts AND prisma7.config.ts):**
```
Tier 1: MYSQLHOST + MYSQLDATABASE present → compose mysql:// URL from individual vars
Tier 2: MYSQL_URL set → use directly (Railway pre-resolved URL)
Tier 3: DATABASE_URL set → use directly (local dev / custom hosting)
Tier 4: Build-time dummy → used only during `next build` static analysis (never connects)
```

Both `db.ts` (runtime Prisma Client) and `prisma7.config.ts` (Prisma CLI — `db push`, `migrate`) must use the same resolution logic. If only one is fixed, `db push` runs against the wrong database or fails entirely.

**railway.toml `startCommand` must include `prisma db push`:**
```toml
startCommand = "cd rozedesk-app && node_modules/.bin/prisma db push --schema=../prisma/schema.prisma --skip-generate --accept-data-loss && node_modules/.bin/next start -p ${PORT:-3000}"
```
- `--skip-generate`: client was generated during `buildCommand` — no need to regenerate at startup.
- `--accept-data-loss`: required for `db push` on existing databases with schema changes. Remove when migrating to `prisma migrate deploy` for production.
- Running `db push` at start (not build) ensures the real `DATABASE_URL` / Railway vars are available — they are NOT available during the build phase.

**Prevention rules:**
1. Before writing any DB connection code for a new hosting platform, check its documentation for the exact env var names it injects. Never assume `DATABASE_URL` is set — verify it.
2. Implement the resolution chain in a single `resolveConfig()` function and import/call it from both the runtime client (`db.ts`) and the Prisma CLI config (`prisma7.config.ts`). DRY principle — one resolution logic, two consumers.
3. Never paste hosting-platform template syntax (`${{VAR}}`, `${VAR}`, `%VAR%`) into `.env` files — these are resolved by the platform, not by Node.js. Copy only the final resolved value into `.env` files, or use the platform's native secret management.
4. Schema migrations must run at startup (`startCommand`), not build (`buildCommand`), because DB credentials are environment-injected at runtime, not available during image build.

**Files changed:**
- `src/lib/db.ts` — 4-tier fallback `resolveConfig()` function
- `prisma7.config.ts` — same 4-tier `resolveDatasourceUrl()` function
- `railway.toml` — `startCommand` now includes `prisma db push` before `next start`

**Related SOP section:** DevOps SOP §Hard Rule 1 (no secrets in code — all from env), §4 (environment parity — dev and prod must read from the same variable resolution path), Backend SOP §Hard Rule 1 (never trust env var names — verify against platform docs)

---

## DevOps Lessons

### 2026-09-26 — Railway nixpacks: `$NIXPACKS_PATH` undefined-var + build exit 1 from Dockerfile in subdirectory

**What happened:**
Railway deployment failed with:
```
UndefinedVar: Usage of undefined variable '$NIXPACKS_PATH' (line 18)
Build Failed: exit code: 1
```
The build log showed nixpacks was running correctly through `npm ci`, then failing at `next build`.

**Root causes (two separate problems):**

**Problem 1 — Orphaned `Dockerfile` in a subdirectory:**
`rozedesk-app/Dockerfile` existed from an earlier standalone Docker deployment attempt.
Railway's nixpacks builder scans the entire build context for Dockerfiles.
When it found `rozedesk-app/Dockerfile`, it tried to parse/validate it.
Line 18 was `COPY ../prisma ./prisma` — this is **illegal in a Docker build context**:
`..` escapes the build context root, which Docker/Buildkit rejects.
Buildkit's Dockerfile lint emits `UndefinedVar: $NIXPACKS_PATH` because nixpacks injects
`$NIXPACKS_PATH` as a build arg in its own generated Dockerfile, but the orphaned
`rozedesk-app/Dockerfile` never declared it with `ARG NIXPACKS_PATH`.

**Problem 2 — No explicit nixpacks phase config:**
`railway.toml` set `builder = "nixpacks"` and `buildCommand` but did not have a
matching `nixpacks.toml`. This meant nixpacks guessed the build phases, which could
re-order or skip `prisma generate` relative to `next build`.

**Correct fix:**

1. **Delete the orphaned `Dockerfile`** — it was dead code: `output: "standalone"` was
   disabled in `next.config.ts`, so the Dockerfile's `COPY --from=builder .next/standalone`
   would have produced an empty image anyway.

2. **Create `nixpacks.toml` at the repo root** to explicitly declare all build phases:
   ```toml
   [phases.setup]
   nixPkgs = ["nodejs_22"]

   [phases.install]
   cmds = ["npm ci --prefix rozedesk-app --ignore-engines"]

   [phases.build]
   cmds = [
     "cd rozedesk-app && ./node_modules/.bin/prisma generate --schema=../prisma/schema.prisma",
     "cd rozedesk-app && ./node_modules/.bin/next build",
   ]

   [start]
   cmd = "cd rozedesk-app && node_modules/.bin/next start -p ${PORT:-3000}"
   ```

3. **Remove `buildCommand` from `railway.toml`** — when `nixpacks.toml` is present,
   `railway.toml`'s `buildCommand` overrides it entirely (it does NOT merge/extend).
   Setting `buildCommand` in `railway.toml` AND having `nixpacks.toml` means only
   `railway.toml` runs, silently ignoring `nixpacks.toml`. Choose one or the other.

4. **Add `.railwayignore`** to keep the upload snapshot lean and prevent Railway
   from picking up leftover Dockerfiles, `.env` files, or `node_modules/` from
   subdirectories.

**Prevention rules:**

1. **Never leave a `Dockerfile` in a subdirectory of a nixpacks project.**
   Railway's builder scans all subdirectories. Any `Dockerfile` it finds will be
   validated by Docker's Buildkit lint. If the file uses paths that escape the
   build context (`COPY ../`), the build fails with confusing lint errors.

2. **`railway.toml` `buildCommand` vs `nixpacks.toml` — pick one, not both.**
   They do not compose. `railway.toml` `buildCommand` always wins and silently
   discards `nixpacks.toml` phases. Use `nixpacks.toml` for phase control; use
   `railway.toml` only for deploy-time settings (`startCommand`, health check,
   restart policy).

3. **`COPY ../` in a Dockerfile is always wrong.**
   Docker build context is a tree rooted at the path you pass to `docker build`.
   You cannot reference files outside that root. For monorepos, either:
   - Run `docker build` from the monorepo root with `-f rozedesk-app/Dockerfile`
   - Or copy needed files into the app directory before building

4. **Pin the Node version in `nixpacks.toml`**, not just in `.nvmrc`.**
   Nixpacks reads `.nvmrc` / `.node-version` but only as hints. Pinning in
   `nixpacks.toml` under `[phases.setup] nixPkgs = ["nodejs_22"]` is authoritative
   and survives nixpacks provider version changes.

**Related SOP section:** DevOps SOP §4 (self-contained deployment unit), §Hard Rule 1
(no secrets baked in — also applies to not baking broken build artifacts), §3 (CI/CD
pipeline config must be explicit, not guessed by the builder)
