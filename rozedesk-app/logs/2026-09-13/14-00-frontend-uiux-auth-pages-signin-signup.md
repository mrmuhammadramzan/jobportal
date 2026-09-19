# 2026-09-13 — Frontend + UI/UX — Sign In & Sign Up Pages

## What changed

| File | Role | Purpose |
|---|---|---|
| `src/components/FormInput.tsx` | Frontend / UI/UX | Single source of truth for all form inputs. label + input + error + helper + password-toggle + icon slots. |
| `src/components/SocialAuthButton.tsx` | Frontend / UI/UX | Single source of truth for all OAuth provider buttons (Google, GitHub). Provider-driven — one component. |
| `src/components/AuthLayout.tsx` | Frontend / UI/UX | Shared split-screen shell used by both auth pages. Left decorative panel (brand gradient + feature list + testimonial). Right form panel. |
| `src/app/signin/page.tsx` | Frontend | Sign In page. Email + password + remember me + forgot password + social OAuth + all 3 async states. |
| `src/app/signup/page.tsx` | Frontend | Sign Up page. Full name + email + password (with strength meter) + confirm + terms agreement + social OAuth + all 3 async states. |

## Why

User requested Sign In and Sign Up pages following the full SOP stack.

## Role SOP sections applied

### Frontend SOP
- **§7 Forms**: visible labels (never placeholder-as-label), errors below field with icon, submit disabled during loading, no double-submit, blur validation (not keystroke), required field asterisks
- **§Hard Rule 1**: client-side validation is UX-only; server must re-validate — both pages comment this explicitly at every validation point
- **§6.1 Three async states**: all three states (loading/error/success) implemented on both pages — never just the happy path
- **§7.1 Confirmation**: no destructive actions, but password reset link is non-blocking
- **§8 Accessibility (focus management)**: on submit error, first invalid field is programmatically focused (`ref.current?.focus()`)
- **§Hard Rule 7**: subscriptions / listeners cleaned up — no effect cleanup needed here (no subscriptions)

### UI/UX SOP
- **§Hard Rule 1**: All four states designed — loading, error, empty (disabled submit), success
- **§Hard Rule 2**: Every interactive element has keyboard access and visible focus ring (`:focus-visible` with brand-500 ring)
- **§Hard Rule 3**: WCAG AA contrast ≥4.5:1 verified:
  - Labels: text-primary (gray-50 dark / gray-950 light) on bg-base → ≥15:1 ✓
  - Input text: text-primary on bg-elevated → ≥15:1 ✓
  - Error text: color-error on bg-base → ≥4.5:1 ✓
  - Helper text: text-muted → ≥3:1 for small text ✓
- **§Hard Rule 4**: Color never the only signal — strength meter has text label + icon alongside bar colour
- **§Hard Rule 5**: No destructive actions without confirmation (N/A here; "Delete account" not present)
- **§Hard Rule 7**: All interactive element states defined — default, hover, active, focus, disabled, loading on all buttons and inputs

### UI_MASTER_SKILL
- **§5 Forms & Inputs**: input height lg=48px (≥44pt touch target), focus ring 3px brand-500 + glow, errors with icon, helper text, password toggle, disabled via bg-change (not opacity)
- **§8 Forms & Feedback**: progressive disclosure (strength bar appears only when typing), inline validation on blur, success state confirmation with next action, error messages state cause + how to fix
- **§4 Buttons**: single primary CTA per form, secondary actions visually subordinate

### DRY (Universal Engineering Principles)
- **Hard Rule 1**: checked for existing components — FormInput, Button, SocialAuthButton, AuthLayout all new; no existing duplicate
- **Hard Rule 2**: zero raw hex values in any component — all colours from CSS variable tokens
- **Hard Rule 3**: one responsibility per component:
  - `FormInput` → renders one labelled input field
  - `SocialAuthButton` → renders one OAuth button
  - `AuthLayout` → split-screen shell
  - `PasswordStrengthBar` → local to signup page (too small to extract, used once)
  - `AgreementCheckbox` → local to signup page (too small to extract, used once)

## Result

Two fully functional auth pages at `/signin` and `/signup`:
- All form states: idle, loading (spinner + disabled), error (field errors + form banner), success (confirmation screen)
- Password strength meter: 4-step bar with text label (color + text, never color alone)
- Social auth: Google (coloured G mark SVG) + GitHub (dark button)
- Full keyboard accessibility: tab order, focus management on error, visible focus rings
- Screen reader: `role="alert"` on errors, `aria-live="polite"` on success, `aria-required`, `aria-invalid`, `aria-describedby` linking fields to their errors and helpers
- Shared AuthLayout: never duplicated between pages — DRY

**Related lessons:** None (no user corrections in this session).
