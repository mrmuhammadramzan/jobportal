# UI MASTER SKILL — The Anti-AI-Slop Design Bible
### Covers: Web (all stacks) · WordPress · Android · iOS · Desktop · System Software
### Level: Every micro-detail. Nothing assumed. Nothing skipped.

---

> **The rule before everything else:**
> Every pixel is a decision. Every decision needs a reason.
> If you can't explain why something looks the way it does, it will look like AI made it.

---

## TABLE OF CONTENTS

1. [Typography — The Foundation](#1-typography)
2. [Color Systems — Not Just a Palette](#2-color-systems)
3. [Spacing — The Invisible Architecture](#3-spacing)
4. [Buttons — Every State, Every Size](#4-buttons)
5. [Forms & Inputs — The Hardest Part](#5-forms--inputs)
6. [Navigation — Web, Mobile, Desktop](#6-navigation)
7. [Cards & Containers](#7-cards--containers)
8. [Scroll & Animation](#8-scroll--animation)
9. [Hover, Focus & Active States](#9-hover-focus--active-states)
10. [Icons & Imagery](#10-icons--imagery)
11. [Loading & Empty States](#11-loading--empty-states)
12. [Responsive Breakpoints](#12-responsive-breakpoints)
13. [Platform-Specific Rules](#13-platform-specific-rules)
    - Web (React / Vue / Vanilla / Next.js)
    - WordPress
    - Android (Material Design 3)
    - iOS (Human Interface Guidelines)
    - Desktop / System Software (Windows, macOS, Linux)
14. [Dark Mode](#14-dark-mode)
15. [Accessibility](#15-accessibility)
16. [Motion Design System](#16-motion-design-system)
17. [The Complete Anti-AI Checklist](#17-the-complete-anti-ai-checklist)

---

## 1. TYPOGRAPHY

Typography is not "pick a font." It is a complete system of size, weight, tracking, leading, measure, and contrast working together.

### Font Selection

**DO NOT USE** without a strong reason:
- Inter, Roboto, Arial, Helvetica, system-ui by themselves
- Generic Google Font pairings that every AI defaults to
- "Clean modern" fonts with no character

**CHOOSE based on personality:**

| Personality | Display Font | Body Font | Notes |
|---|---|---|---|
| Editorial / magazine | Playfair Display, Cormorant | Source Serif 4 | High contrast serifs |
| Technical / developer | JetBrains Mono | IBM Plex Sans | Mono for headings is bold |
| Luxury / fashion | Bodoni Moda, Didact Gothic | Garamond Premier | Tight tracking on headlines |
| Startup / SaaS | Sora, DM Sans | DM Sans | Consistent weight family |
| Brutalist / raw | Monument Extended, Bebas Neue | Space Grotesk | ALL CAPS headers |
| Organic / health | Recoleta, Freight Display | Nunito | Rounded, warm |
| Finance / enterprise | Neue Haas Grotesk, Aktiv Grotesk | Lato | Serious, no decoration |
| Playful / consumer | Clash Display, Quicksand | Plus Jakarta Sans | Friendly curves |

**Pairing rule:** One display font (headings only) + one workhorse font (body, UI labels). Never three fonts.

### Type Scale

Always build a scale. Never pick font sizes randomly.

**Recommended modular scale (ratio 1.25 — Major Third):**

```
xs:   12px  / 0.75rem   — captions, legal, timestamps
sm:   14px  / 0.875rem  — labels, helper text, meta
base: 16px  / 1rem      — body copy (THE BASE, never change this)
md:   20px  / 1.25rem   — lead paragraph, subtitle
lg:   24px  / 1.5rem    — H3, card titles
xl:   32px  / 2rem      — H2, section headers
2xl:  40px  / 2.5rem    — H1, page titles
3xl:  56px  / 3.5rem    — hero headlines
4xl:  72px  / 4.5rem    — massive hero (landing pages only)
```

For **tight/dense UIs** (dashboards, admin panels, system software):
Shift the scale down: base=14px, use 12/13/14/16/20/24/32

### Font Weight Rules

```
100–200  Thin        — decorative only, never body text
300      Light       — large headlines (40px+) for elegance
400      Regular     — all body copy
500      Medium      — UI labels, navigation items, button text
600      Semibold    — subheadings, emphasis in body
700      Bold        — headings H1–H3
800–900  Extrabold   — hero headlines, display text only
```

**Rule:** Never jump more than 2 weight steps between heading and body in the same section. It creates visual chaos.

### Line Height (Leading)

```
Tight   1.1–1.2  — display headlines 48px+
Normal  1.3–1.4  — headings 24–40px
Relaxed 1.5–1.6  — body paragraphs (most comfortable)
Loose   1.7–1.8  — long-form articles, accessibility content
```

**Critical rule:** Line height is NOT a font property. It is a container property. Set it on the parent, not the text.

### Letter Spacing (Tracking)

```
Tight display headlines (48px+):   -0.02em to -0.04em  (negative tracking = premium feel)
Normal headings (24–40px):         -0.01em to 0
Body text:                          0 (never touch this)
Small caps / labels (12–14px):     +0.04em to +0.08em  (small text needs air)
ALL CAPS labels:                   +0.08em to +0.15em  (mandatory for caps)
```

**Rule:** Tight tracking on big text = premium. Positive tracking on small text = legible. Never flip these.

### Measure (Line Length)

```
Ideal reading measure: 55–75 characters per line (about 600–700px at 16px)
Maximum:               85 characters (anything wider causes eye fatigue)
Minimum:               40 characters (shorter = choppy)
```

**Practical rule:** `max-width: 65ch` on all body text containers.

### Heading Hierarchy — What It Actually Means

```
H1  — ONE per page. Page identity. Largest size. Heaviest weight.
H2  — Section separators. Reader can skim H2s and understand the page.
H3  — Sub-sections within H2. Same size family, lighter weight.
H4  — Rarely needed. If you need H4, restructure your content.
H5+ — Almost never. System/admin panels only.
```

**Visual rule for headings:**
- H1 must be visually DOMINANT — at least 2x the size of body
- H2 should have significant whitespace ABOVE (3–4x the space below)
- Heading color should be darker than body text (10–15% more contrast)

---

## 2. COLOR SYSTEMS

Never pick colors. Build a system.

### The 60-30-10 Rule

```
60%  — Neutral base     (backgrounds, surfaces, large areas)
30%  — Supporting tone  (secondary surfaces, borders, subtle fills)
10%  — Accent           (CTAs, highlights, links, key actions)
```

Violating this is why AI designs look busy. The accent color should feel like a surprise.

### Building a Palette from Scratch

**Step 1: Pick one brand hue**
Example: `hsl(220, 80%, 50%)` — a strong blue

**Step 2: Generate the scale (9 stops)**
```
50   hsl(220, 80%, 97%)   — near white tint        (hover backgrounds)
100  hsl(220, 80%, 93%)   — light fill              (tag backgrounds)
200  hsl(220, 75%, 85%)   — soft fill               (borders on hover)
300  hsl(220, 72%, 72%)   — mid tone
400  hsl(220, 70%, 60%)   — secondary action color
500  hsl(220, 80%, 50%)   — PRIMARY brand color     (main buttons)
600  hsl(220, 85%, 40%)   — hover state on primary
700  hsl(220, 88%, 32%)   — pressed / active state
800  hsl(220, 90%, 22%)   — dark text on light bg
900  hsl(220, 92%, 14%)   — near-black tint
```

**Step 3: Add semantic colors (non-negotiable)**
```
Success:  hsl(142, 72%, 42%)  green
Warning:  hsl(38, 92%, 50%)   amber  
Error:    hsl(0, 84%, 50%)    red
Info:     hsl(200, 80%, 48%)  sky blue
```

**Step 4: Add neutrals (the most important colors)**
```
gray-50   #FAFAFA  — page background
gray-100  #F4F4F5  — card background
gray-200  #E4E4E7  — border default
gray-300  #D1D1D6  — border on hover
gray-400  #A1A1AA  — placeholder text
gray-500  #71717A  — secondary text
gray-600  #52525B  — body text light mode
gray-700  #3F3F46  — headings light mode
gray-800  #27272A  — dark mode surface
gray-900  #18181B  — dark mode base
gray-950  #09090B  — near-black
```

### Color Rules That Prevent "AI Look"

1. **Never use pure black (#000000) or pure white (#FFFFFF)** in production UI. Use gray-950 and gray-50.
2. **Text on colored backgrounds:** use 800–900 of the SAME ramp, never generic black.
3. **One accent color dominates.** Secondary accent is allowed if it's used for a different *purpose* (e.g., primary = blue for actions, amber = only for warnings).
4. **Background colors must breathe.** Primary bg, secondary bg (cards), tertiary bg (nested cards) — never one flat white everywhere.
5. **Borders are colors too.** Default border: gray-200. Hover: gray-300. Focus: brand-500. Error: red-500. Each has meaning.
6. **Disabled states:** opacity 0.4 on the element, cursor: not-allowed. Never just graying out text.

---

## 3. SPACING

Spacing is not aesthetic preference. It is information hierarchy made visible.

### The Spacing Scale (Base-8 system)

```
1    4px   — hairline gaps, icon internal padding
2    8px   — tight inline elements, icon-to-text gap
3    12px  — small component internal padding
4    16px  — default component padding (buttons, inputs)
5    20px  — medium gap between related elements
6    24px  — section internal gaps
8    32px  — gap between components
10   40px  — section padding top/bottom
12   48px  — large section separation
16   64px  — between major page sections
20   80px  — hero padding, page top
24   96px  — generous landing page sections
32   128px — maximum section padding
```

**Rule:** Only use values from this scale. If you find yourself writing `padding: 13px`, you are wrong.

### Proximity Principle

```
Related things:    8–16px apart
Grouped things:    24–32px apart
Separate sections: 48–80px apart
Page edge margins: 16px (mobile), 24px (tablet), 40–80px (desktop)
```

**Visual test:** Squint at your layout. You should be able to see "groups" without reading the text. If everything looks equidistant, you have a spacing problem.

### Padding Inside Components

**Buttons:**
```
xs:    padding: 4px 10px
sm:    padding: 6px 14px
md:    padding: 8px 16px    ← default
lg:    padding: 10px 20px
xl:    padding: 14px 28px
```

**Cards:**
```
tight:     padding: 16px
default:   padding: 20px 24px
spacious:  padding: 28px 32px
hero card: padding: 40px 48px
```

**Inputs:**
```
sm:  padding: 6px 10px
md:  padding: 8px 14px     ← default
lg:  padding: 12px 16px
```

---

## 4. BUTTONS

Buttons are the most interacted-with element. They must communicate state, hierarchy, and intent at a glance.

### Button Hierarchy

```
Primary    — ONE per view. The most important action. Filled, brand color.
Secondary  — Supporting action. Outlined or ghost. Same visual weight rules.
Tertiary   — Least important. Text-only or subtle ghost.
Destructive — Delete, remove, irreversible. Red variant.
Icon-only  — Square aspect ratio. Must have aria-label and tooltip.
```

**Rule:** Never put two primary buttons side by side. One primary + one secondary maximum.

### Button Variants

```css
/* Primary */
background: var(--brand-500);
color: white;
border: none;

/* Secondary */
background: transparent;
color: var(--brand-600);
border: 1.5px solid var(--brand-300);

/* Ghost */
background: transparent;
color: var(--gray-700);
border: 1.5px solid var(--gray-200);

/* Destructive */
background: var(--red-500);
color: white;
border: none;

/* Destructive secondary */
background: transparent;
color: var(--red-600);
border: 1.5px solid var(--red-200);
```

### Button States — Every Single One

```css
/* Default — resting state */
background: var(--brand-500);
transform: none;
box-shadow: none;

/* Hover */
background: var(--brand-600);
transform: translateY(-1px);          /* subtle lift */
box-shadow: 0 4px 12px rgba(brand, 0.3);
transition: all 0.15s ease;

/* Active / Pressed */
background: var(--brand-700);
transform: translateY(0px) scale(0.98);  /* press down */
box-shadow: none;
transition: all 0.08s ease;

/* Focus-visible (keyboard only) */
outline: 2px solid var(--brand-500);
outline-offset: 2px;
box-shadow: 0 0 0 4px var(--brand-100);

/* Disabled */
opacity: 0.4;
cursor: not-allowed;
pointer-events: none;
transform: none;
box-shadow: none;

/* Loading */
cursor: wait;
position: relative;
color: transparent;   /* hide text */
/* spinner positioned absolute, centered */
```

### Button Typography

```
font-size:      14px (sm), 15px (md), 16px (lg)
font-weight:    500–600 (medium to semibold)
letter-spacing: +0.01em to +0.03em  (buttons need slight tracking)
text-transform: none  (never all-caps on buttons unless brand choice)
white-space:    nowrap
```

### Button Radius

```
Rounded:    border-radius: 8px          (most common)
Pill:       border-radius: 9999px       (playful, modern)
Subtle:     border-radius: 4–6px        (dense/admin UI)
Square:     border-radius: 0            (brutalist / ultra-minimal)
```

**Rule:** Use ONE radius style per project. Mixing rounded and pill looks accidental.

### Button Width

```
Auto width:   padding controls size, text drives width (preferred)
Full width:   mobile CTAs, form submit buttons, modal actions
Fixed width:  icon buttons (32px, 36px, 40px square)
```

### Button Icon Rules

```
Icon + text:       icon LEFT of text, 8px gap
Icon only:         equal padding all sides, must be square
Icon size:         16px for sm/md buttons, 18px for lg
Icon color:        inherits text color (currentColor)
Icon stroke:       1.5–2px (never filled icons in buttons unless intentional)
```

---

## 5. FORMS & INPUTS

Forms are where most UIs fail silently. Users feel frustration but can't name why.

### Input Anatomy

```
Label          — above input, never placeholder-as-label
Input field    — the clickable area
Helper text    — below input (optional, muted color)
Error message  — below input, red, with icon
Character count — bottom right (when limit applies)
```

### Input States

```css
/* Default */
border: 1.5px solid var(--gray-200);
background: white;
color: var(--gray-900);

/* Hover */
border-color: var(--gray-300);

/* Focus */
border-color: var(--brand-500);
box-shadow: 0 0 0 3px var(--brand-100);
outline: none;
transition: border-color 0.15s, box-shadow 0.15s;

/* Filled (has value) */
border-color: var(--gray-300);
background: var(--gray-50);  /* subtle fill = feels secure */

/* Error */
border-color: var(--red-500);
box-shadow: 0 0 0 3px var(--red-100);

/* Disabled */
background: var(--gray-100);
color: var(--gray-400);
cursor: not-allowed;
opacity: 1;   /* do NOT use opacity for disabled inputs, use bg color */
```

### Label Rules

```
font-size:    14px (always, even in large forms)
font-weight:  500 (medium — slightly heavier than body)
color:        var(--gray-700) default, var(--red-600) on error
margin-bottom: 6px
display:      block  (never inline)
```

**NEVER use placeholder as label.** Placeholder disappears on type — user loses context. Use it only for format hints (e.g., "YYYY-MM-DD").

### Input Sizing

```
sm:  height 32px, font 13px, padding 0 10px
md:  height 40px, font 14px, padding 0 14px  ← default
lg:  height 48px, font 16px, padding 0 16px
```

### Select Dropdowns

```
— Custom arrow, never browser default
— Same sizing as inputs
— On open: dropdown appears with box-shadow, border matches focus state
— Option hover: brand-50 background, brand-700 text
— Selected option: check icon on right, brand color text
— Max dropdown height: 240px with scroll
— Border-radius on dropdown: 8px
— Dropdown offset from input: 4px gap
```

### Checkboxes & Radios

```
Size:           18x18px (never smaller — too hard to tap)
Border:         1.5px solid var(--gray-300)
Checked bg:     var(--brand-500)
Check icon:     white, 10px, stroke 2.5px
Transition:     background 0.1s ease, border 0.1s ease
Label gap:      10px from control
Label size:     15px, weight 400
Focus ring:     0 0 0 3px var(--brand-100)
```

### Form Validation Timing

```
On submit:      Always validate all fields
On blur:        Validate individual field after user leaves it
On type:        Only for character counts and password strength
Inline errors:  Appear 200ms after blur, never on first render
Error icon:     circle-x icon, 16px, red, left of error message text
```

---

## 6. NAVIGATION

Navigation is wayfinding. Every design decision must help users know: where am I, where can I go, where did I come from.

### Web Navigation — Top Bar

```
Height:       56–72px
Background:   white or brand color (never gradient)
Padding:      0 24px (mobile), 0 48px (desktop)
Logo:         left, 32–40px tall max
Nav links:    center or left-of-center
CTA button:   right side, primary variant
Border:       0 or 1px solid gray-100 (bottom only, subtle)
Position:     sticky, not fixed (unless scroll-away header needed)
Shadow on scroll: 0 1px 3px rgba(0,0,0,0.08) appears after 10px scroll
```

**Active nav link:**
```
color:         var(--brand-600)
font-weight:   600
indicator:     2px underline or bottom border, brand color
```

**Hover nav link:**
```
color:         var(--gray-900)
transition:    color 0.15s
background:    none (no background fills on nav links)
```

### Mobile Navigation — Bottom Bar (Android/Web)

```
Height:             56–64px (+ safe area inset bottom)
Background:         white / dark surface
Border-top:         1px solid gray-100
Icons:              24px, outlined style
Labels:             12px, 500 weight
Item layout:        icon centered, label below, 4px gap
Active icon:        filled version, brand color
Active label:       brand color
Active indicator:   small pill behind icon (Material 3 style)
Tap target:         minimum 48x48px even if icon is smaller
```

### Sidebar Navigation (Dashboard / Admin)

```
Width:          240–280px expanded, 64–72px collapsed
Background:     gray-900 (dark) or gray-50 (light)
Item height:    44px
Item padding:   0 16px
Icon:           20px, left, 16px from left edge
Label:          14px, 500 weight, 12px from icon
Active item:    brand-500 background at 10% opacity, brand-600 text, left border 3px brand-500
Hover item:     gray-100 background (light) or gray-800 (dark)
Section dividers: gray-200, with section label 11px uppercase tracking
Collapse toggle: bottom of sidebar, icon flips direction
```

### Breadcrumbs

```
font-size:      14px
color:          gray-500 (ancestors), gray-900 (current)
separator:      / or › or chevron-right icon, 12px, gray-300
current:        font-weight 600, no link
overflow:       truncate middle items with "..." on mobile
```

---

## 7. CARDS & CONTAINERS

### Card Anatomy

```
Background:     white (light) or gray-800 (dark)
Border:         1px solid gray-200 (light) or gray-700 (dark)
Border-radius:  12–16px (standard), 8px (dense), 20–24px (hero)
Shadow:         see shadow system below
Padding:        20px 24px (standard), 16px (compact), 32px (spacious)
```

### Shadow System

**Never use a single generic box-shadow. Build a layered system:**

```css
/* Level 0 — no elevation (flat, bordered) */
box-shadow: none;
border: 1px solid var(--gray-200);

/* Level 1 — slightly elevated (default cards) */
box-shadow:
  0 1px 2px rgba(0,0,0,0.04),
  0 2px 4px rgba(0,0,0,0.04);

/* Level 2 — elevated (hover state, dropdowns) */
box-shadow:
  0 2px 4px rgba(0,0,0,0.04),
  0 4px 12px rgba(0,0,0,0.08),
  0 8px 24px rgba(0,0,0,0.04);

/* Level 3 — floating (modals, popovers) */
box-shadow:
  0 4px 6px rgba(0,0,0,0.04),
  0 10px 25px rgba(0,0,0,0.10),
  0 20px 60px rgba(0,0,0,0.08);

/* Level 4 — critical overlay (toasts, drag-in-progress) */
box-shadow:
  0 8px 16px rgba(0,0,0,0.08),
  0 20px 40px rgba(0,0,0,0.12),
  0 40px 80px rgba(0,0,0,0.08);
```

**Colored shadows (brand feel):**
```css
/* Primary button hover shadow */
box-shadow: 0 4px 14px rgba(var(--brand-rgb), 0.35);

/* Danger button hover shadow */
box-shadow: 0 4px 14px rgba(var(--red-rgb), 0.35);
```

### Card Hover State

```css
transition: transform 0.2s ease, box-shadow 0.2s ease;

.card:hover {
  transform: translateY(-2px);
  box-shadow: /* Level 2 shadow */;
}
```

**Rule:** Only add hover lift if the card is clickable. Static cards must not lift.

---

## 8. SCROLL & ANIMATION

### Scroll Behavior

```css
html {
  scroll-behavior: smooth;
  scroll-padding-top: 80px;  /* account for sticky header */
}

/* Custom scrollbar (WebKit) */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: var(--gray-300);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover { background: var(--gray-400); }
```

### Scroll-triggered Animations

**Fade up (most versatile):**
```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

.animate-on-scroll {
  opacity: 0;
  animation: fadeUp 0.6s ease forwards;
  animation-play-state: paused;
}

.animate-on-scroll.visible {
  animation-play-state: running;
}
```

**Stagger children (lists, card grids):**
```css
.card:nth-child(1) { animation-delay: 0s; }
.card:nth-child(2) { animation-delay: 0.08s; }
.card:nth-child(3) { animation-delay: 0.16s; }
.card:nth-child(4) { animation-delay: 0.24s; }
/* Max stagger: 0.4s. Beyond that = annoying */
```

**Intersection Observer setup:**
```javascript
const observer = new IntersectionObserver(
  (entries) => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);  // animate once only
    }
  }),
  { threshold: 0.15 }  // 15% visible before triggering
);

document.querySelectorAll('.animate-on-scroll')
  .forEach(el => observer.observe(el));
```

### Page Load Animation

```
Order of reveals (staggered, 0.1s apart):
1. Navigation / header (0ms)
2. Hero headline (100ms)
3. Hero subtext (200ms)
4. Hero CTA (300ms)
5. Hero image / visual (350ms)
6. Everything below the fold: triggered on scroll, not on load
```

**Rule:** Page load animations must complete within 800ms total. Beyond that = feels broken.

### Parallax Rules

```
Parallax ratio:   0.3–0.5 (element moves 30–50% of scroll distance)
Apply only to:    background images, decorative elements, NOT text
Performance:      use transform: translateY, never top/left
Will-change:      add will-change: transform on parallax elements
Disable on mobile: parallax causes nausea on small screens
```

### Transition Duration Reference

```
Instant (state change with no motion):    0ms
Micro (checkbox, toggle, small icon):     100ms
Fast (button hover, link color):          150ms
Default (most UI transitions):            200–250ms
Deliberate (modal open, drawer slide):    300ms
Slow (page transitions, hero animations): 400–600ms
Never exceed:                             700ms for UI transitions
```

### Easing Reference

```
ease-in:          acceleration from 0 — use for EXIT animations (element leaving)
ease-out:         deceleration to 0   — use for ENTER animations (element arriving)
ease-in-out:      both                — use for state changes (toggle, expand)
linear:           constant speed      — use for spinners, progress bars only

Custom:
--ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1)  — overshoot, bouncy
--ease-smooth:    cubic-bezier(0.25, 0.1, 0.25, 1)   — refined, premium
--ease-sharp:     cubic-bezier(0.4, 0, 0.6, 1)       — snappy, Material-like
```

---

## 9. HOVER, FOCUS & ACTIVE STATES

This is what separates real design from AI output. Every interactive element needs all three states designed.

### Hover States (full reference)

| Element | Hover Change |
|---|---|
| Link in text | Color to brand-600, underline appears |
| Nav link | Color darkens, no background |
| Button primary | bg darkens 1 step, translateY(-1px), shadow appears |
| Button secondary | bg fills with brand-50 |
| Card (clickable) | translateY(-2px), shadow level up |
| Icon button | bg: gray-100 circle (8px radius) behind icon |
| Table row | bg: gray-50 |
| List item | bg: gray-50, cursor: pointer |
| Image | scale(1.03), overflow hidden on parent |
| Input | border-color darkens |
| Checkbox | border-color brand-400 |
| Select | bg: gray-50 |
| Tag / badge | bg darkens 1 stop, if clickable |
| Avatar | ring appears: 2px brand-500 |

### Focus States (keyboard navigation — non-negotiable for accessibility)

```css
/* Global focus rule — override browser default safely */
:focus-visible {
  outline: 2px solid var(--brand-500);
  outline-offset: 2px;
}

/* For buttons (add glow) */
button:focus-visible {
  outline: 2px solid var(--brand-500);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px var(--brand-100);
}

/* For inputs */
input:focus-visible {
  outline: none;
  border-color: var(--brand-500);
  box-shadow: 0 0 0 3px var(--brand-100);
}
```

**Rule:** Never do `outline: none` without providing a visible alternative. This is an accessibility violation.

### Active States (pressed)

```css
button:active {
  transform: scale(0.97) translateY(1px);
  box-shadow: none;
  transition-duration: 80ms;  /* faster than hover */
}

.card:active {
  transform: scale(0.99);
  transition-duration: 80ms;
}
```

---

## 10. ICONS & IMAGERY

### Icon Rules

**Style consistency:**
```
Pick ONE icon family per project. Never mix.
Options: Lucide, Phosphor, Tabler, Heroicons, Feather, Remix Icon
All must be: outline style by default, filled only for active states
Stroke width: 1.5px (most families), NEVER 2.5px+ in body UI
```

**Icon sizing:**
```
12px — inline in tiny labels (rare)
16px — inline with text, table cells, small buttons
20px — default standalone icon, button icons
24px — navigation icons, feature icons
32px — feature section icons (with background)
48px — illustration-level icons, empty states
```

**Icon color:**
```
Never hardcode icon colors
Use currentColor — icon inherits parent text color
Muted icons:    color: var(--gray-400)
Active icons:   color: var(--brand-500)
Error icons:    color: var(--red-500)
```

**Icon + text alignment:**
```css
display: flex;
align-items: center;
gap: 8px;

svg { flex-shrink: 0; }  /* prevents icon squishing */
```

### Image Rules

**Aspect ratios (use consistently):**
```
1:1   — avatars, product thumbnails, icons
4:3   — blog post thumbnails, cards
16:9  — video thumbnails, hero banners
3:2   — editorial photography
2:3   — portrait photos, book covers
```

**Image loading:**
```css
img {
  object-fit: cover;      /* never stretch */
  object-position: center;
  display: block;          /* removes inline gap */
  width: 100%;
}

/* Skeleton placeholder */
.img-loading {
  background: linear-gradient(90deg, var(--gray-100) 25%, var(--gray-200) 50%, var(--gray-100) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

---

## 11. LOADING & EMPTY STATES

### Loading States

**Skeleton screens (preferred over spinners for content):**
```
Shape: mirrors actual content layout
Color: gray-100 base, gray-200 highlight
Animation: shimmer left to right, 1.5s, ease-in-out
Border-radius: match content (text = 4px, images = actual radius)
Lines: vary widths (100%, 80%, 60%) — looks natural
```

**Spinners (for actions, not content loading):**
```
Size:       20px (inline), 32px (full page)
Stroke:     2px, brand-500
Speed:      0.8s per rotation
Easing:     linear
Placement:  centered absolutely within button/container
```

**Progress bars:**
```
Height:         4–6px
Border-radius:  9999px (pill)
Track:          gray-100
Fill:           brand gradient or solid brand-500
Transition:     width 0.3s ease
Striped option: repeating-linear-gradient with animation for indeterminate
```

### Empty States

```
Illustration:  simple SVG, 120–200px, brand color at 20% opacity
Headline:      16–20px, gray-700, explains WHAT is empty
Subtext:       14px, gray-500, explains WHY it's empty or what to do
CTA button:    primary, below text, action to populate the state
Container:     centered in the empty area, flex column, gap 16px
Max-width:     400px (don't let it spread across wide screens)
```

---

## 12. RESPONSIVE BREAKPOINTS

### Breakpoint System

```
xs:    0–479px     — small phones
sm:    480–767px   — large phones
md:    768–1023px  — tablets
lg:    1024–1279px — small desktops, laptops
xl:    1280–1535px — standard desktops
2xl:   1536px+     — large monitors, TV
```

### Mobile-First Rules

```css
/* Start mobile, add complexity up */
.container {
  padding: 0 16px;           /* mobile */

  @media (min-width: 768px)  { padding: 0 24px; }
  @media (min-width: 1024px) { padding: 0 40px; }
  @media (min-width: 1280px) { max-width: 1280px; margin: 0 auto; padding: 0 48px; }
}
```

### Typography at breakpoints

```
Mobile:  base 15px, H1 28px, H2 22px
Tablet:  base 16px, H1 36px, H2 28px
Desktop: base 16px, H1 48px, H2 36px
Wide:    base 16px, H1 56–72px, H2 40px
```

### Touch Target Rules (mobile mandatory)

```
Minimum tap target:    44x44px (Apple) / 48x48px (Google)
Minimum spacing between targets: 8px
Thumb reach zones:     design primary actions in bottom 2/3 of screen
Gesture conflicts:     avoid horizontal swipes near scroll edges
```

---

## 13. PLATFORM-SPECIFIC RULES

### WEB — React / Vue / Next.js / Vanilla

**CSS Architecture:**
```
Use CSS variables for all design tokens
BEM or CSS Modules for component scope
Tailwind: use config to enforce the spacing/color scale
No magic numbers in CSS (if you write 13px, document why)
```

**Performance:**
```
Images:      WebP format, lazy loading, responsive srcset
Fonts:       font-display: swap, preload critical fonts
CSS:         critical CSS inline, rest deferred
Animations:  use transform + opacity only (GPU composited)
Avoid:       layout-triggering properties in animations (width, height, top, left)
```

**Component rules:**
```
Button:     never a div. Always <button> or <a>
Form fields: always associated label (for/id or wrapping label)
Images:     always have alt text
Lists:      <ul>/<ol> for lists, never div soup
Headings:   correct hierarchy, never skip H1→H3
```

### WORDPRESS

**Theme architecture:**
```
Use child theme for all customizations
Custom CSS: Appearance → Customize → Additional CSS (or separate stylesheet)
Never edit parent theme files
Block editor (Gutenberg): use Global Styles for design tokens
```

**Typography in WordPress:**
```
Add custom fonts via @font-face in functions.php or via Google Fonts enqueue
Define font sizes in theme.json (block themes) or via add_theme_support
Use fluid typography: clamp(min, preferred, max)
```

**Color system:**
```json
In theme.json:
{
  "settings": {
    "color": {
      "palette": [
        { "slug": "primary", "color": "#2563EB", "name": "Primary" },
        { "slug": "gray-900", "color": "#111827", "name": "Heading" }
      ]
    }
  }
}
```

**Gutenberg block spacing:**
```
Use --wp--preset--spacing--* variables
Define custom spacing scale in theme.json settings.spacing.spacingSizes
Never hardcode px values in block styles
```

**Performance:**
```
Disable unused block styles: remove_action('wp_enqueue_block_library_styles')
Image optimization: WebP conversion plugin or server-side
Lazy load all images below fold
Critical CSS: use WP Rocket or manual inline critical CSS
```

### ANDROID — Material Design 3

**Color system (Dynamic Color):**
```
Primary:           Main brand actions (FAB, filled buttons)
On Primary:        Text on primary (always white or dark)
Secondary:         Supporting UI elements
Tertiary:          Contrasting accent
Surface:           Card and sheet backgrounds
Surface Variant:   Slightly tinted surfaces
Outline:           Border/divider color
```

**Elevation (not shadow, but tonal overlay):**
```
Level 0:  No overlay  — flat surface
Level 1:  5% primary overlay  — nav drawers, side sheets
Level 2:  8% primary overlay  — FAB resting
Level 3:  11% primary overlay — FAB pressed, chips
Level 4:  12% primary overlay — top app bar (scrolled)
Level 5:  14% primary overlay — modal nav drawers
```

**Typography scale (Material 3):**
```
Display Large:    57sp, Regular  — rare, biggest moments
Display Medium:   45sp, Regular
Headline Large:   32sp, Regular  — screen titles
Headline Medium:  28sp, Regular
Headline Small:   24sp, Regular
Title Large:      22sp, Regular  — top app bar title
Title Medium:     16sp, Medium
Title Small:      14sp, Medium
Body Large:       16sp, Regular  — primary reading
Body Medium:      14sp, Regular  — default body
Body Small:       12sp, Regular  — captions
Label Large:      14sp, Medium   — button text
Label Medium:     12sp, Medium   — tabs, chips
Label Small:      11sp, Medium   — smallest labels
```

**Touch targets:**
```
Minimum:           48x48dp
FAB:               56x56dp (standard), 96x96dp (large)
Icon buttons:      48x48dp tap target, 24dp icon
Bottom nav items:  minimum 48dp tall tap area
```

**Component-specific rules:**

Top App Bar:
```
Small:    64dp height — most screens
Medium:   112dp — when content title is needed prominently
Large:    152dp — when content context matters (article detail)
Collapse: Medium/Large collapse to Small on scroll
```

Bottom Navigation Bar:
```
3–5 destinations (5 maximum)
Icon + label: always show both
Active: filled icon variant + brand color
Inactive: outline icon + gray
No badge: 8dp dot / with number: pill shape
```

Cards:
```
Elevated:  White bg + shadow (Level 1)
Filled:    Surface variant bg + no shadow
Outlined:  Outline border + no shadow
Border-radius: 12dp (standard)
```

Buttons:
```
Filled:          brand color bg, white text
Filled Tonal:    secondary container bg, on-secondary-container text
Outlined:        transparent, brand border, brand text
Text:            no bg, no border, brand text
Elevated:        surface bg, shadow
FAB:             secondary container color
```

**Ripple effect:**
```
Color:          current color at 12% opacity
Radius:         fills container
Duration:       300ms
Unbounded:      for icon buttons
Bounded:        for all other buttons, cards
```

### iOS — Human Interface Guidelines

**Safe areas (mandatory):**
```css
padding-top: env(safe-area-inset-top);
padding-bottom: env(safe-area-inset-bottom);
padding-left: env(safe-area-inset-left);
padding-right: env(safe-area-inset-right);
```

**Typography (SF Pro):**
```
Large Title:   34pt, Regular  — navigation large title
Title 1:       28pt, Regular
Title 2:       22pt, Regular
Title 3:       20pt, Regular
Headline:      17pt, Semibold — section headers
Body:          17pt, Regular  — primary reading
Callout:       16pt, Regular
Subhead:       15pt, Regular  — secondary text
Footnote:      13pt, Regular
Caption 1:     12pt, Regular
Caption 2:     11pt, Regular
```

**Colors (iOS semantic):**
```
Label:              primary text
Secondary Label:    secondary text (gray)
Tertiary Label:     placeholder text
System Background:  white (light) / black (dark)
Secondary System Background: slightly tinted
Grouped Background: for grouped tables/forms
Separator:          hairline divider
```

**Hit targets:**
```
Minimum:      44x44pt
Navigation back button: 44x44pt minimum (extend tap area)
Tab bar items: full width of section
```

**Gestures:**
```
Swipe back:    system gesture, always support edge swipe
Pull to refresh: expected in scrollable content
Long press:    context menus (UIContextMenu)
Drag handles:  3 horizontal lines icon, gray-400
```

**Components:**
```
Navigation Bar: 44pt, large title 52pt
Tab Bar:        49pt + safe area
Toolbar:        44pt
Status Bar:     built-in, design around it
Modal sheets:   detent system (small/medium/large)
Action Sheets:  from bottom, rounded corners
Alerts:         centered, max 270pt wide
```

### DESKTOP / SYSTEM SOFTWARE

**Windows (Fluent Design System):**
```
Acrylic:     frosted glass background effect (use sparingly)
Reveal:      light effect on hover (deprecated, avoid)
Mica:        OS-aware semi-transparent tinting (Win11)
Shadow:      depth-elevation shadows (not CSS, use system)
Color:       accent color from Windows system settings
Typography:  Segoe UI Variable (Win11), Segoe UI (Win10)
Spacing:     4dp grid
Controls:    WinUI 3 / Windows App SDK recommended
Titlebar:    custom titlebar allowed with proper drag regions
```

**macOS (AppKit / SwiftUI):**
```
Vibrancy:    NSVisualEffectView for sidebars, toolbars
Materials:   .sidebar, .menu, .popover, .hudWindow
Typography:  SF Pro / SF Mono — always use system fonts
Colors:      NSColor.labelColor (auto adapts light/dark)
Toolbar:     native NSToolbar (draggable by default)
Sidebar:     source list style for navigation
Sheets:      modal sheets attach to window (not full-screen modal)
Popovers:    NSPopover for non-disruptive info
Menu bar:    avoid unless truly utility app
```

**Electron / Tauri (Cross-platform desktop web):**
```
Titlebar:    custom drag region with -webkit-app-region: drag
Frame:       frameless window recommended for custom look
Traffic lights: respect system (macOS) or design custom (Windows)
Native feel: use system fonts, follow platform spacing
Context menus: use native (contextmenu event) not custom HTML
File drop:    handle dragover + drop events properly
Keyboard:     implement standard shortcuts (Ctrl/Cmd+S, Z, C, V, F)
```

---

## 14. DARK MODE

Dark mode is not "white becomes black." It is a separate color system.

### Principles

```
1. Dark mode is NOT #000 backgrounds — use gray-900 (#111) to gray-950 (#0a0a0a)
2. Elevation shows through LIGHTER surfaces, not darker (invert shadow logic)
3. Reduce color saturation in dark mode — brand colors at 85% saturation
4. Text contrast increases: body text is gray-100, not white
5. Borders become subtle: gray-700 or gray-800
6. Shadows are nearly invisible — use elevation via bg-color difference
```

### Dark Mode Color Mapping

```
Light mode → Dark mode

gray-50   (page bg)        → gray-950
gray-100  (card bg)        → gray-900
gray-200  (border)         → gray-700
gray-400  (placeholder)    → gray-500
gray-500  (secondary text) → gray-400
gray-700  (body text)      → gray-300
gray-900  (headings)       → gray-50

brand-500 (primary)        → brand-400  (slightly lighter in dark)
brand-100 (tint bg)        → brand-900  (inverted tint)
```

### Implementation

```css
:root {
  --bg-primary: #FFFFFF;
  --bg-secondary: #F4F4F5;
  --text-primary: #111827;
  --text-secondary: #6B7280;
  --border: #E5E7EB;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #111111;
    --bg-secondary: #1C1C1E;
    --text-primary: #F9FAFB;
    --text-secondary: #9CA3AF;
    --border: #374151;
  }
}

/* Manual toggle class */
.dark {
  --bg-primary: #111111;
  /* ... */
}
```

---

## 15. ACCESSIBILITY

Accessibility is not optional. It is design correctness.

### Contrast Ratios (WCAG 2.1 AA)

```
Normal text (< 18pt / < 14pt bold):  minimum 4.5:1
Large text (≥ 18pt / ≥ 14pt bold):  minimum 3:1
UI components & graphics:            minimum 3:1
Focus indicators:                     minimum 3:1

Target (AAA):
Normal text: 7:1
Large text:  4.5:1
```

**Quick color contrast check:**
```
Black on white:        21:1  ✓
gray-700 on white:     8.6:1 ✓
gray-500 on white:     4.6:1 ✓ (barely passes AA)
gray-400 on white:     3.0:1 ✗ (fails for small text)
brand-500 on white:    must be checked per brand color
white on brand-500:    must be checked per brand color
```

### ARIA & Semantic HTML

```html
<!-- Buttons that look like buttons ARE buttons -->
<button type="button">Click me</button>

<!-- Icon-only buttons need label -->
<button type="button" aria-label="Close dialog">
  <svg aria-hidden="true">...</svg>
</button>

<!-- Form fields always labelled -->
<label for="email">Email address</label>
<input type="email" id="email" name="email" autocomplete="email">

<!-- Error messages linked to field -->
<input aria-invalid="true" aria-describedby="email-error">
<p id="email-error" role="alert">Enter a valid email address</p>

<!-- Loading states announced -->
<button aria-busy="true" aria-disabled="true">
  <span aria-hidden="true">Saving...</span>
  <span class="sr-only">Loading, please wait</span>
</button>

<!-- Landmark regions -->
<header role="banner">
<nav aria-label="Main navigation">
<main>
<aside aria-label="Related articles">
<footer>
```

### Keyboard Navigation Order

```
Tab:         next interactive element
Shift+Tab:   previous interactive element
Enter/Space: activate button, open select
Escape:      close modal, dismiss dropdown
Arrow keys:  navigate within component (menu, tabs, radio group)
Home/End:    jump to first/last in list
```

**Rule:** Every interactive element must be reachable and operable with keyboard only. Test your UI with tab navigation regularly.

---

## 16. MOTION DESIGN SYSTEM

### Motion Principles

```
1. Purpose     — every animation communicates something. If it doesn't, remove it.
2. Hierarchy   — more important elements animate more prominently.
3. Performance — only animate transform and opacity (GPU composited).
4. Restraint   — max 3 simultaneous animations on screen.
5. Respect     — always implement prefers-reduced-motion.
```

### Reduced Motion (mandatory)

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Animation Token System

```css
:root {
  /* Duration */
  --duration-instant:    0ms;
  --duration-micro:      100ms;
  --duration-fast:       150ms;
  --duration-default:    200ms;
  --duration-deliberate: 300ms;
  --duration-slow:       500ms;

  /* Easing */
  --ease-default:   cubic-bezier(0.25, 0.1, 0.25, 1);
  --ease-in:        cubic-bezier(0.4, 0, 1, 1);
  --ease-out:       cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out:    cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-bounce:    cubic-bezier(0.68, -0.6, 0.32, 1.6);
}
```

### Animation Library (ready to use)

```css
/* Entrance animations */
@keyframes fadeIn        { from { opacity: 0 } to { opacity: 1 } }
@keyframes fadeUp        { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
@keyframes fadeDown      { from { opacity: 0; transform: translateY(-16px) } to { opacity: 1; transform: translateY(0) } }
@keyframes fadeLeft      { from { opacity: 0; transform: translateX(16px) } to { opacity: 1; transform: translateX(0) } }
@keyframes fadeRight     { from { opacity: 0; transform: translateX(-16px) } to { opacity: 1; transform: translateX(0) } }
@keyframes scaleIn       { from { opacity: 0; transform: scale(0.92) } to { opacity: 1; transform: scale(1) } }
@keyframes scaleInCenter { from { opacity: 0; transform: scale(0.5) } to { opacity: 1; transform: scale(1) } }

/* Ongoing animations */
@keyframes spin          { to { transform: rotate(360deg) } }
@keyframes pulse         { 0%,100% { opacity: 1 } 50% { opacity: 0.5 } }
@keyframes bounce        { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
@keyframes shimmer       { to { background-position: -200% 0 } }
@keyframes float         { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-12px) } }

/* Exit animations */
@keyframes fadeOut       { to { opacity: 0 } }
@keyframes fadeOutDown   { to { opacity: 0; transform: translateY(16px) } }
@keyframes scaleOut      { to { opacity: 0; transform: scale(0.92) } }
```

---

## 17. THE COMPLETE ANTI-AI CHECKLIST

Before calling any UI complete, check every item.

### Typography
- [ ] Custom font pair (not Inter/Roboto by default)
- [ ] Font scale follows a ratio (1.25 or 1.333)
- [ ] Negative tracking on headlines 32px+
- [ ] Positive tracking on all-caps labels
- [ ] Line height 1.5–1.6 on body text
- [ ] Max line length 65ch on paragraphs
- [ ] H1 visually dominant (2x+ body size)
- [ ] Heading above has 3–4x more space above than below

### Color
- [ ] Real color system (not random #hex values)
- [ ] 60-30-10 rule respected
- [ ] No pure #000 or #FFF
- [ ] All text passes 4.5:1 contrast minimum
- [ ] Semantic colors defined (success, error, warning, info)
- [ ] Disabled states use bg-change not opacity

### Spacing
- [ ] All spacing from 4/8px base grid
- [ ] Related items: 8–16px apart
- [ ] Sections: 48–80px apart
- [ ] No padding: 13px or any non-grid value

### Buttons
- [ ] Clear hierarchy (one primary CTA per view)
- [ ] All states designed: default, hover, active, focus, disabled, loading
- [ ] Hover lifts (+shadow, -1px translateY)
- [ ] Active presses (scale 0.97)
- [ ] Focus ring visible (outline + glow)
- [ ] Loading state hides text, shows spinner
- [ ] Min 44x44px touch target (mobile)

### Forms
- [ ] Labels above every input (not placeholder-as-label)
- [ ] Focus ring on all inputs
- [ ] Error state with icon + message + red border
- [ ] Helper text where needed
- [ ] Autocomplete attributes on common fields
- [ ] Validation timing: on blur, not on keystroke

### Animation
- [ ] Page load < 800ms total
- [ ] Scroll animations use Intersection Observer (once only)
- [ ] Stagger max 0.4s total
- [ ] All transitions use transform/opacity only
- [ ] prefers-reduced-motion respected
- [ ] No animation > 600ms for UI transitions

### Hover/Focus/Active
- [ ] Every clickable element has visible hover state
- [ ] Hover cursors: pointer for clickable, default for static, text for text, not-allowed for disabled
- [ ] Focus-visible for all interactive elements
- [ ] Active/pressed state feels physical (scale down)

### Platform-Specific
- [ ] Safe area insets on iOS (top and bottom)
- [ ] 48dp touch targets on Android
- [ ] Bottom navigation 3–5 items max (mobile)
- [ ] Keyboard shortcuts on desktop apps
- [ ] Custom scrollbar matches design system
- [ ] Favicon + Apple touch icon + OG image (web)

### Dark Mode
- [ ] Dark backgrounds are gray-900/950, not #000
- [ ] Elevation shown via lighter surfaces not shadow
- [ ] Saturations reduced ~15% in dark mode
- [ ] prefers-color-scheme media query implemented
- [ ] No hard-coded hex colors (use CSS variables)

### Accessibility
- [ ] All images have alt text
- [ ] Buttons have accessible names
- [ ] Form fields have associated labels
- [ ] Error messages linked via aria-describedby
- [ ] Keyboard navigation tested
- [ ] Color is not the only indicator of state
- [ ] No content hidden from screen readers that users need

---

## QUICK REFERENCE CARD

```
SPACING:    4 | 8 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 64 | 80 | 96
RADIUS:     4px (tight) | 8px (default) | 12px (card) | 16px (large) | 9999px (pill)
SHADOW L1:  0 1px 2px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.04)
SHADOW L2:  0 2px 4px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.08)
SHADOW L3:  0 4px 6px rgba(0,0,0,0.04), 0 10px 25px rgba(0,0,0,0.10)
DURATION:   100ms micro | 150ms fast | 200ms default | 300ms deliberate
EASING:     ease-out for enter | ease-in for exit | ease-in-out for toggle
CONTRAST:   4.5:1 body text | 3:1 large text | 3:1 UI components
TOUCH:      44x44px iOS minimum | 48x48dp Android minimum
LINE:       max-width: 65ch for all paragraphs
FONT PAIR:  1 display + 1 body. Never 3 fonts.
BUTTON:     1 primary per view. Max 1 primary + 1 secondary side by side.
```

---

*This skill is a living document. Every UI project teaches something new. Add to it.*
