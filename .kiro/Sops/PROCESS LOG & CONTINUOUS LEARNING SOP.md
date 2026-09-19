# PROCESS LOG & CONTINUOUS LEARNING SOP — "The Institutional Memory Layer"
# Cross-Cutting Layer — applies to all 6 roles (Architect, DBA, Backend,
# Frontend, UI/UX, DevOps)
# Version: 2026
# Philosophy: A team with no memory repeats every mistake forever. This SOP
#             is not a 7th role — it's the thing that makes the other six
#             actually improve over time instead of staying static documents.
#             Two jobs: (1) leave a trail of what changed, when, and why, so
#             any session can reconstruct history without asking the user to
#             repeat themselves. (2) when corrected, record the correction as
#             a reusable rule, so the same mistake doesn't happen twice.

---

## 0. IDENTITY & MANDATE

This SOP does not replace or compete with the 6 role SOPs — it runs
underneath all of them, regardless of which role is currently active. Every
role's "review gate" checklist gets one more item because of this SOP: **was
this change logged, and was any correction from the user turned into a
lesson before moving on.**

**This layer owns:**
- The change log — a dated, timestamped record of what changed, by which
  role, and why
- The lessons file — a running record of mistakes the user had to catch,
  turned into rules that get checked *before* the same mistake is possible again
- Escalation from "logged mistake" to "SOP patch" when a mistake repeats

**This layer does NOT own:**
- Deciding whether something is right or wrong technically — that's still
  each role's own SOP
- It is purely additive: logging and learning happen *alongside* normal work,
  never instead of it, and never as an excuse to skip a role's actual review gate

---

## 1. HARD RULES — NEVER VIOLATE

1. **Never make a change without a log entry.** Not "log it later" — the log
   entry is part of the change being done, the same way a migration isn't
   done without its reverse migration.
2. **Never let a user correction pass without a lesson entry.** If the user
   says "that's wrong" / "that's not how we do it" / "you missed X," a lesson
   gets written before moving on to the fix — not after, not "if there's time."
3. **Never overwrite or delete a past log or lesson entry.** Both are
   append-only. If a past entry turns out to be wrong, append a correction
   referencing it — never edit history.
4. **Never repeat a logged mistake without checking the lessons file first.**
   Before starting work in a role, check that role's section of the lessons
   file for anything relevant to the task at hand.
5. **Never let the same category of mistake get logged 3+ times without
   escalating to a SOP patch** (§7). A lesson file is short-term memory; a
   SOP hard rule is long-term memory. Repetition means it needs to graduate.
6. **Never write a vague log or lesson entry.** "Fixed stuff" or "improved
   the code" is not a log entry — it has to be specific enough that a future
   session (or a different person) can understand what happened without
   re-asking.

---

## 2. DIRECTORY STRUCTURE — THE CHANGE LOG

### 2.1 Layout
```
/logs/
  2026-09-01/
    14-03-architect-define-order-module-boundaries.md
    15-40-backend-implement-checkout-endpoint.md
    16-12-dba-add-orders-index.md
  2026-09-02/
    09-15-frontend-fix-stale-cart-total.md
  LESSONS.md          <- see §4, one running file, not date-partitioned
  CHANGELOG.md         <- optional single rollup, see §2.4
```
- One folder per calendar date (`YYYY-MM-DD`)
- One file per change, named `HH-MM-<role>-<short-kebab-case-description>.md`
  — time-sortable within a day, role-visible at a glance, description
  specific enough to skim
- `LESSONS.md` lives at the top level, not per-date — it's cumulative, not
  a daily log (see §4)

### 2.2 When a new dated folder is created
Automatically, the first time a change is logged on a new calendar date — not
pre-created, not something the user has to set up.

### 2.3 One entry per logical change
A logical change is one coherent unit of work — one endpoint implemented, one
schema migration, one bug fixed, one design decision made. Don't bundle
unrelated changes into a single log entry, and don't split one coherent change
into several fragments — matches the DBA SOP's "one migration, one purpose"
rule (DBA SOP §5.1) applied to logging.

### 2.4 Optional rollup
For a quick daily/weekly overview, a `CHANGELOG.md` at the top level can list
one line per entry with a link/reference to the detailed log file — useful
for skimming, not a replacement for the detailed entries.

---

## 3. LOG ENTRY FORMAT

### 3.1 Required template
```markdown
# [Time] — [Role] — [Short title]

**What changed:** [specific — which files, which decision, which endpoint/
component/table]

**Why:** [what triggered this — a user request, a bug report, a review gate
failure, a downstream role's flagged issue]

**Role SOP section(s) applied:** [e.g. "Backend SOP §6.2 resource-level
authorization"]

**Result:** [what exists now that didn't before, or what's different]

**Related lesson (if any):** [link to a LESSONS.md entry if this change was
made specifically to fix a previously-logged mistake]
```

### 3.2 What counts as loggable
- Any code/config/schema/design change handed off between roles or shown to
  the user as "done"
- Any architecture/schema/contract decision (this overlaps with each role's
  own ADR requirement — the ADR is the detailed record, the log entry is the
  dated pointer to it)
- Any fix made in direct response to a user-reported problem

### 3.3 What doesn't need a separate entry
Pure exploration/discussion that didn't result in a change — no log entry
needed for "we talked about options and decided nothing yet." Log the
decision when it's made, not the conversation that led to it.

---

## 4. THE LESSONS FILE — LEARNING FROM MISTAKES

### 4.1 Structure — `LESSONS.md`, organized by role
```markdown
## [Role] Lessons

### [Date] — [Short title]

**What happened:** [the mistake, specifically — what was built/decided/said]

**What was wrong about it:** [the actual problem, not just "user didn't like it"]

**Correct approach:** [what should have happened instead]

**Prevention rule:** [a concrete, checkable rule — phrased so it can be
scanned before similar work, not just a vague reminder]

**Related SOP section:** [which existing role-SOP section this should have
caught it, if any — if none, that's itself a signal per §7]
```

### 4.2 Writing a good prevention rule
A prevention rule has to be checkable, not just true. Compare:
```
❌ VAGUE — not checkable before doing similar work
"Be more careful with authorization."

✅ CHECKABLE — can be scanned against a new task before starting
"Before marking a resource-scoped endpoint done, confirm the ownership
check compares the resource's owner to the *authenticated* user's ID, not
just to a value taken from the request body."
```
Vague prevention rules don't prevent anything the second time — they read as
true but don't change what the agent actually checks.

### 4.3 When to write a lesson
- Immediately when the user corrects something — in the same turn as the fix,
  per Hard Rule 2, not deferred
- When a role's own review gate (§ from that role's SOP) catches something
  that should have been caught earlier in the process — that's worth a lesson
  even without an explicit user correction, because it reveals a process gap
- Not for simple typos or one-off slips with no generalizable pattern — a
  lesson file cluttered with noise stops getting read. Use judgment: would a
  future task in this role actually benefit from being warned about this
  specific class of mistake?

### 4.4 Checking lessons before starting work
Before starting a task in a given role, scan that role's section of
`LESSONS.md` for anything relevant to the task's domain (not the whole file
every time — just the active role's section, plus cross-role sections if the
task spans a handoff). This is a quick relevance scan, not re-reading every
lesson ever logged.

---

## 5. THE CORRECTION WORKFLOW

```
WHEN THE USER POINTS OUT A MISTAKE OR ERROR:

1. Acknowledge specifically what was wrong — not a generic apology, the
   actual technical or process error (matches the universal "own mistakes
   without over-apologizing" principle)
2. Write the LESSONS.md entry (§4.1) BEFORE or ALONGSIDE the fix — capturing
   what happened while it's fresh and specific, not reconstructed later
3. Make the fix
4. Log the fix itself as a normal change log entry (§3.1), with the
   "Related lesson" field pointing at the lesson entry from step 2
5. If this is the 3rd+ time a similar mistake has been logged for this role
   (scan LESSONS.md for the pattern), escalate per §7 — propose a SOP patch,
   don't just add a 4th nearly-identical lesson entry
```

---

## 6. WHAT GOOD LOOKS LIKE — WORKED EXAMPLE

```markdown
## Backend Lessons

### 2026-09-01 — Trusted client-supplied discount percentage

**What happened:** Implemented `/checkout` to accept a `discountPercent`
field directly from the request body and apply it to the total.

**What was wrong about it:** This is exactly the client-input-trust failure
Backend SOP Hard Rule 1 and §5.2 exist to prevent — the discount should be
looked up server-side from the coupon code, not accepted as a raw number
from the client.

**Correct approach:** Accept only a `couponCode` from the client; look up
the actual discount percentage server-side against the authoritative coupon
table.

**Prevention rule:** Before implementing any endpoint that accepts a field
affecting price, permission, or ownership, check: is this value looked up
server-side from an ID, or trusted directly from the request body? If
trusted directly and it affects money/access, that's a Hard Rule 1 violation
before writing another line.

**Related SOP section:** Backend SOP §5.2 (already covers this — this was a
process gap, not a documentation gap: the rule existed and wasn't checked
against before implementing)
```

Note the last line: this particular lesson didn't need a SOP patch, because
the rule already existed — the gap was in *checking* it, not in the rule
itself. Not every lesson escalates to §7; most are a reminder to actually
apply a rule that was already written down.

---

## 7. ESCALATION — WHEN A LESSON BECOMES A SOP PATCH

### 7.1 Trigger
A lesson escalates from "entry in LESSONS.md" to "propose a patch to the
relevant role SOP" when either:
- The same category of mistake appears 3+ times in that role's lessons, or
- A single mistake reveals a genuine gap where no existing rule would have
  caught it (the "Related SOP section" field in §4.1 is blank or says "none")

### 7.2 How to escalate — matches the audit-and-fix pattern already used on
### these SOPs during development
```
SOP PATCH PROPOSAL:
1. State the gap: what class of mistake keeps recurring, or what scenario
   has no covering rule
2. Propose the specific text to add to the relevant role SOP — a new Hard
   Rule, a new checklist item, or a new section, matching that SOP's existing
   format and section numbering
3. Add the change to that SOP's review gate and quick-reference checklist too
   (not just prose) — matches how every fix made during this SOP's own
   development was wired into the gate, not left as prose alone
4. Log the SOP patch itself as a change (§3), referencing the lessons it closes
```
This is the same loop used throughout this SOP series' own creation — test,
find a gap, patch the SOP, wire it into the gate — just triggered by real
usage instead of a simulated audit.

---

## 8. ANTI-PATTERNS — REJECT ON SIGHT

| Anti-pattern | Why it's rejected | What to do instead |
|---|---|---|
| Fixing a reported mistake without writing a lesson | Same mistake resurfaces next time, nobody remembers why | Lesson entry before/alongside the fix (Hard Rule 2) |
| Vague log entries ("fixed bug", "updated code") | Useless for reconstructing history or debugging later | Specific what/why/result (§3.1) |
| Editing or deleting a past log/lesson entry | Destroys the audit trail, hides that a mistake happened | Append a correction referencing the original (Hard Rule 3) |
| Same mistake logged 4, 5, 6 times with no SOP patch | The lesson file isn't actually preventing recurrence | Escalate at the 3rd occurrence (§7.1) |
| A lesson with no checkable prevention rule | Reads as insight but doesn't change future behavior | Write a specific, scannable rule (§4.2) |
| Logging every trivial exploratory step | Log becomes noise, real changes get buried | Log decisions/changes, not exploration (§3.3) |

---

## 9. QUICK REFERENCE — PROCESS LAYER CHECKLIST

- [ ] Every change has a log entry: what, why, which SOP section, result
- [ ] Every user-flagged mistake has a lesson entry, written before/alongside the fix
- [ ] Lesson entries have a specific, checkable prevention rule — not a vague reminder
- [ ] Relevant lessons were checked before starting a new task in that role
- [ ] No log or lesson entry was edited/deleted — corrections are appended, not overwritten
- [ ] A 3rd+ repeated mistake in one role triggered a SOP patch proposal, not just another lesson
- [ ] SOP patches are wired into that role's review gate and quick-reference
      checklist, not left as prose only

---

*This layer applies across all 6 role SOPs and doesn't replace any of their
review gates — it adds one shared requirement to all of them: log the
change, and if the user corrected something, write the lesson before moving
on. Over time, `LESSONS.md` plus the escalation path in §7 is what keeps
these six SOPs improving instead of staying frozen at whatever they covered
on the day they were written.*