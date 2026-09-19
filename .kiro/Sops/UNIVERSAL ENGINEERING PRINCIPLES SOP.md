# UNIVERSAL ENGINEERING PRINCIPLES SOP — "The Craftsmanship Layer"
# Cross-Cutting Layer — applies to all 6 roles (Architect, DBA, Backend,
# Frontend, UI/UX, DevOps)
# Version: 2026
# Philosophy: A team can follow every process rule perfectly and still ship
#             code that's slow, duplicated, and painful to change — because
#             process rules answer "did we do the right steps," not "is the
#             code itself well-built." This SOP is the second one. Its whole
#             reason to exist: change one button's color in one place, not
#             seventeen.

---

## 0. IDENTITY & MANDATE

This SOP runs underneath all 6 role SOPs, the same way the Process Log &
Learning SOP does. It doesn't replace any role's own rules — it adds a shared
baseline of code-quality discipline that applies regardless of which role is
active: DRY, single responsibility, algorithmic awareness, and memory
discipline.

**This layer owns:**
- Reuse-before-creation discipline (DRY) across code, components, and config
- Core object-oriented/structural principles (SOLID, adapted pragmatically)
- Algorithmic efficiency awareness (right data structure, right complexity
  for the realistic data size)
- Function/component size and single-responsibility discipline
- Memory and resource management discipline

**This layer does NOT own:**
- Whether a specific business rule or schema is correct — that's each role's
  own SOP
- It generalizes rules that already exist in fragments across the other six
  SOPs (Frontend's "god component," Backend's "fat controller," DBA's query
  performance checks) into one baseline every role checks, instead of each
  role reinventing its own version

---

## 1. HARD RULES — NEVER VIOLATE

1. **Never create a new component, function, utility, or config value without
   first checking whether one already exists that does the job.** Search
   before you build. This is the rule that directly prevents "17 buttons,
   17 slightly different shades of blue."
2. **Never duplicate a value used in more than one place** (a color, a URL, a
   business constant, a magic number) — it becomes a named constant/token/
   config, referenced everywhere, defined once.
3. **Never write a function, component, or class that does more than one
   job.** If describing it needs "and," split it — this is the same rule
   already stated per-role (Architect SOP §7.3, Backend SOP §4.1, Frontend
   SOP §4.1); this layer makes it universal instead of three separate copies.
4. **Never choose an approach with meaningfully worse algorithmic complexity
   than necessary for the realistic data size**, without a stated reason.
   A nested loop over a collection that can realistically grow large, where a
   hash-based lookup would do the same job, is a defect — not a style choice.
5. **Never leave a resource unreleased when it's no longer needed** — open
   file handles, DB connections, subscriptions, event listeners, timers, or
   large in-memory objects held past their useful life.
6. **Never hand-roll something a well-established library already does
   correctly** (date parsing, deep-equality checks, UUID generation,
   cryptography) unless there's a specific, stated reason the library doesn't
   fit — reinventing this is wasted effort and a fresh source of bugs.
7. **Never sacrifice readability for a performance gain that hasn't been
   measured as necessary** — but never ignore an *obviously* bad complexity
   choice on the grounds that "it's fine for now" when the data size is
   realistically going to grow (this hard rule and Hard Rule 4 are two sides
   of the same judgment call, see §5.3).

---

## 2. BEFORE WRITING ANY NEW CODE

### 2.1 The reuse check — required every time
```
BEFORE CREATING SOMETHING NEW, ASK:
1. Does a component/function/utility already exist that does this, or
   almost does this?
2. If it "almost" does this — can it be extended with a prop/parameter
   instead of duplicated? (usually yes)
3. Is this value (color, spacing, URL, business number) already defined
   somewhere as a constant/token? Use that reference, don't retype the value.
4. If nothing exists and this is genuinely new — where should it live so the
   *next* person finds it before creating a duplicate? (a shared components
   folder, a constants file, a utils module — not buried inside one feature's
   local files)
```
This check costs seconds and is what prevents the exact problem described in
this SOP's philosophy line: a primary button styled inline in fifteen
different files instead of one `<Button variant="primary">` component.

### 2.2 The concrete button example, worked through
```jsx
// ❌ BANNED — the color/style is duplicated in every file that needs a
// primary button. Changing the brand color means finding and editing every
// one of these by hand, and AI-assisted edits will inevitably miss one.
<button style={{ background: '#3a7bd5', padding: '8px 16px', borderRadius: 4 }}>
  Submit
</button>
// ...repeated with slightly different values in 15 other files...

// ✅ REQUIRED — one canonical component, styled from design tokens (UI/UX
// SOP §4.1), used everywhere. Change the color once, in the token or the
// component — every usage updates.
<Button variant="primary">Submit</Button>
```
This is Hard Rule 1 and Hard Rule 2 working together: the *component* isn't
duplicated (Hard Rule 1), and the *color value* inside it isn't duplicated
either (Hard Rule 2) — it comes from a design token, not a hardcoded hex code.

---

## 3. DRY — DON'T REPEAT YOURSELF

### 3.1 What DRY actually means (it's not "never write similar code twice")
DRY is about **duplicated knowledge**, not duplicated syntax. Two pieces of
code that happen to look similar but represent genuinely different business
rules are not a DRY violation — forcing them into one shared function because
they *look* alike creates a fragile abstraction that breaks the moment the two
rules diverge. The test: if this value/rule/logic changed, would I have to
remember to change it in more than one place? If yes, that's the violation.

### 3.2 Where this applies across roles
| Role | What "don't repeat yourself" means here |
|---|---|
| Architect | Don't let two modules implement the same cross-cutting concern differently (Architect SOP §10 already flags this) |
| DBA | Don't duplicate a derived/computed value across tables without a documented sync mechanism (DBA SOP §11 anti-pattern) |
| Backend | Don't reimplement validation/business rules in more than one service — one owning function, called from everywhere it's needed |
| Frontend | One shared component library, not per-screen reimplementations (§2.2 above) |
| UI/UX | One design token set, not per-screen color/spacing values (UI/UX SOP §4.1) |
| DevOps | One IaC source for all environments, not hand-duplicated per-environment configs (DevOps SOP §4.1) |

Each role SOP already has a version of this rule in its own domain — this
layer is what makes it explicit that it's the *same underlying discipline*
everywhere, not six unrelated rules.

---

## 4. STRUCTURAL PRINCIPLES (SOLID, APPLIED PRAGMATICALLY)

These apply loosely regardless of whether the codebase is strictly
object-oriented — the underlying ideas hold for functions and modules too.

### 4.1 Single Responsibility
One function/component/class, one reason to change. Already stated as Hard
Rule 3 above — this is where it comes from academically, stated practically.

### 4.2 Open/Closed — extend without rewriting
Prefer designing something so new behavior can be *added* (a new prop, a new
strategy passed in, a new case in a well-structured branch) rather than
requiring every caller of existing code to be rewritten. Don't over-engineer
for hypothetical extension points that aren't needed yet, though — this is a
guideline for when extension is genuinely likely, not a mandate to abstract
everything preemptively (that's its own anti-pattern, see §7).

### 4.3 Dependency direction — depend on the interface, not the implementation
Matches the Architect SOP's module dependency rule (§7.1) and the Backend
SOP's "use the DBA's query interface, don't bypass it" rule (§11) — code
depends on a stable contract/interface, not on another module's internals.
This is the same principle already enforced structurally by the role SOPs;
stated here as the general case.

### 4.4 Don't force an inheritance/interface relationship that doesn't
### actually hold
If a subtype can't be used everywhere its supertype is expected without
surprising behavior (breaking Liskov substitution), that's a sign the
hierarchy is modeling the domain wrong — split it instead of special-casing
around the mismatch with type checks scattered through the code.

---

## 5. ALGORITHMIC EFFICIENCY & DATA STRUCTURE CHOICE

### 5.1 The practical version of Big-O awareness
You don't need to compute exact complexity for every line of code — you need
to catch the common, expensive mistakes:
```
COMMON INEFFICIENCIES TO CATCH BEFORE SHIPPING:
- Checking "is this in the list?" repeatedly with array search (.includes,
  .indexOf) inside a loop, on data that can grow → use a Set/Map for O(1)
  lookup instead of O(n) search repeated n times (turns O(n²) into O(n))
- Nested loops over two collections that can both grow → check whether a
  hash-based join (build a Map from one collection, look up against it) can
  replace the nested loop
- Re-sorting or re-filtering the same collection repeatedly inside a loop or
  a render cycle instead of once
- Fetching data one item at a time inside a loop when a single batched
  fetch/query would work (this is the same N+1 pattern the DBA and Backend
  SOPs already ban for queries — it applies to any repeated I/O, not just SQL)
```

### 5.2 Right-sizing the data structure
| Need | Reach for | Not |
|---|---|---|
| Membership test ("is X in this collection?"), repeated | `Set`/hash set | Array + `.includes()` in a loop |
| Key-based lookup, repeated | `Map`/dictionary/hash map | Array + `.find()` in a loop |
| Ordered, frequently-modified-at-both-ends queue | Deque/linked-list-backed queue | Array with `.shift()`/`.unshift()` in a hot path |
| "Give me the top N by some measure, repeatedly" | Heap/priority queue | Re-sorting the whole collection every time |

### 5.3 The judgment call — Hard Rules 4 and 7 together
Not every loop needs to be optimal — a one-time script processing 50 items
doesn't need a Map instead of an array. The question is always: **at the
realistic data size this touches (per the Architect's NFRs, Architect SOP
§6), does the complexity choice matter?** If the data size is bounded and
small, simple and readable wins. If the data size is realistically going to
scale, the efficient choice *is* the readable choice, because "it fell over
at 10,000 rows" isn't more readable than getting it right the first time.

---

## 6. FUNCTION / COMPONENT SIZE & READABILITY

### 6.1 Size discipline
- If a function/component doesn't fit on a screen without scrolling, that's
  a signal to look for an extraction, not a hard limit to hit exactly
- Deep nesting (3+ levels of conditionals/loops) is usually a sign a
  sub-function or an early-return would clarify the logic — extract, don't
  just keep indenting
- Names describe what something does or represents, specifically — `data`,
  `temp`, `handleClick2` are signals the responsibility wasn't clear enough
  to name properly

### 6.2 Extract early, not "later once it's a problem"
Waiting until a function is unmanageably long to split it usually means
splitting it badly, under pressure, without a clean seam. Extracting a clear
sub-responsibility as soon as it's recognizable is cheaper than a rewrite
later.

---

## 7. THE OTHER FAILURE MODE — OVER-ABSTRACTION

DRY and SOLID taken too literally create their own mess: a config-driven
"generic" system built for flexibility nobody asked for, three layers of
indirection to reach one line of actual logic, or a shared component so
overloaded with conditional props that it's harder to reason about than two
separate simple ones would have been.

**The check:** an abstraction is justified by an actual second use case
that exists *now*, not a hypothetical future one. "We might need this to be
configurable someday" is not sufficient justification — build the simple
version for the case that exists, extract the abstraction when the second
real case shows up (matches the Architect SOP §7.1's "justified by a real
reason, not a preference" pattern, applied at the code level instead of the
module level).

---

## 8. MEMORY & RESOURCE MANAGEMENT

### 8.1 Release what you acquire
- File handles, DB connections/pools, streams, subscriptions, timers, and
  event listeners are all closed/cleaned up when no longer needed — matches
  Frontend SOP Hard Rule 7 (cleanup on unmount) generalized to every resource
  type, in every role, not just frontend components
- Long-lived caches have a bound (max size, TTL, or eviction policy) — an
  unbounded cache is a memory leak with extra steps

### 8.2 Don't hold more in memory than the task needs
- Stream or paginate large datasets instead of loading an entire table/file
  into memory when only a portion is needed at once (matches DBA SOP §8.3's
  pagination default and Architect SOP §9.3's data-loss boundaries, applied
  here to memory footprint rather than durability)
- Release references to large objects once they're no longer needed, rather
  than keeping them alive by accident through a closure or a long-lived
  collection that never gets cleared

---

## 9. ANTI-PATTERNS — REJECT ON SIGHT

| Anti-pattern | Why it's rejected | What to do instead |
|---|---|---|
| Same button/color/spacing value hardcoded in many files | Changing it means finding every copy by hand, and misses happen | One shared component, styled from tokens (§2.2) |
| Magic numbers/strings scattered through code with no name | Unclear meaning, easy to update in one place and miss another | Named constant, defined once, imported everywhere (Hard Rule 2) |
| God function/class/component doing five unrelated things | Untestable, unreadable, breaks in unexpected ways when touched | Split by responsibility (§6, Hard Rule 3) |
| Array `.includes()`/`.find()` in a loop over data that can grow | Silently degrades to O(n²), fine in dev with 10 rows, slow in prod with 10,000 | Set/Map for repeated lookups (§5.1–5.2) |
| Hand-rolled date math / deep-equality / crypto instead of a library | Reinvents known-hard problems, introduces subtle bugs | Use the established library unless there's a stated reason not to (Hard Rule 6) |
| Config-driven "generic" system built for a hypothetical second use case | More indirection than the actual problem needs, harder to reason about | Build for the real case; abstract when a second real case exists (§7) |
| Unclosed DB connections, listeners, or subscriptions | Memory leaks, resource exhaustion under load | Explicit cleanup wherever a resource is acquired (§8.1) |

---

## 10. UNIVERSAL REVIEW GATE — RUN ALONGSIDE EACH ROLE'S OWN GATE

```
CRAFTSMANSHIP GATE (run in addition to the active role's own review gate):

1. Was an existing component/function/constant checked for before creating
   a new one? (§2.1)
2. Is any value (color, URL, number, business rule) duplicated in more than
   one place instead of referenced from a single source? (Hard Rule 2)
3. Does every function/component/class do exactly one job?
4. Is there a loop, repeated lookup, or repeated fetch operating on data
   that can realistically grow, using an approach worse than necessary?
5. Is every acquired resource (connection, subscription, listener, timer,
   large in-memory object) released when no longer needed?
6. Is there a hand-rolled reimplementation of something a standard library
   already does correctly, with no stated reason?
7. Is there an abstraction/config system built for a hypothetical case that
   doesn't exist yet? (over-engineering, the inverse failure mode)
```

If any item fails, it doesn't automatically block the role's own gate (§12
of most role SOPs) — but it should be raised explicitly, the same way a
Lightweight Mode assumption gets stated explicitly rather than silently
skipped.

---

## 11. LIGHTWEIGHT MODE — SOLO/PROTOTYPE PROJECTS

Applies under the same conditions as the Architect SOP §15.1. What compresses:

| Full-mode requirement | Lightweight equivalent |
|---|---|
| Full shared component library discipline | A handful of reused components is enough; don't over-build a library for 3 screens |
| SOLID applied formally | Apply single-responsibility, skip formal interface segregation ceremony |
| Complexity analysis on every loop | Only check it on anything touching data that could realistically exceed a few hundred items |

**Never compresses, even in Lightweight Mode:**
- Hard Rule 1/2 for anything visually repeated (buttons, colors, spacing) —
  costs nothing extra to define once, and is exactly the kind of thing that
  becomes painful to fix retroactively once a prototype grows (this is the
  literal scenario that motivated this SOP)
- Hard Rule 5 (resource cleanup) — a leaking prototype is still a leaking
  program if it runs for more than a few minutes

---

## 12. QUICK REFERENCE — CRAFTSMANSHIP CHECKLIST

- [ ] Checked for an existing reusable component/function/constant before creating new
- [ ] No value duplicated across files that should be a single named constant/token
- [ ] Every function/component/class has one responsibility
- [ ] No loop/lookup on potentially-large data using a worse-than-necessary approach
- [ ] Every acquired resource (connection, listener, subscription, timer) is released
- [ ] No hand-rolled reimplementation of a solved library problem without a stated reason
- [ ] No abstraction built for a hypothetical case that doesn't exist yet
- [ ] Deeply nested logic extracted into named sub-functions where it aids clarity
- [ ] Lightweight Mode usage (if any) stated explicitly, not assumed

---

*This layer applies across all 6 role SOPs, alongside the Process Log &
Learning SOP. It doesn't replace any role's own review gate — it adds one
shared craftsmanship check that applies everywhere: reuse before creating,
one source of truth per value, right-sized algorithms, and clean resource
lifecycles. The button-color example in §2.2 is the concrete case this whole
SOP exists to prevent.*