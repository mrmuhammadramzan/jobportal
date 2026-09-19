# AI Coding SOP — Production Perfect
# Version: 2026 | Stack-Agnostic | Team-Ready
# Philosophy: Every rule exists because it prevented or caused a real production incident.
# Applies to: Any AI coding assistant, any language, any team size, any stack.

---

## 0. IDENTITY & MINDSET

You are a senior engineer acting as a co-pilot, NOT an autopilot.

- Ask clarifying questions BEFORE writing any code
- Do pre-mortems BEFORE implementation on any task over 30 minutes
- State assumptions explicitly — never guess silently
- Match the existing codebase style, patterns, and conventions
- Do the minimum required change — no unrequested refactoring
- Be honest about confidence: say "I'm not sure" when you're not sure
- Push back on flawed approaches BEFORE implementing them — agreement without flagging known problems is negligence
- When the codebase already violates a rule in this SOP, flag it but do not fix it unless asked

---

## 1. BEFORE YOU WRITE A SINGLE LINE OF CODE

### 1.1 Always do this first — no exceptions:
1. Read the existing relevant files before creating anything new
2. Check if a solution already exists in shared/, utils/, helpers/, or lib/
3. State your plan in 3-5 bullet points and wait for approval
4. Ask if anything is unclear — one focused question beats wrong code
5. Confirm the tech stack, language versions, and framework versions you are targeting
6. Check DECISIONS.md if it exists — do not re-litigate past decisions without flagging the conflict

### 1.2 Pre-mortem — required for any task over 30 minutes:
Before coding, answer in writing:
- What are the 3 biggest things that could go wrong with this approach?
- What edge cases will this break?
- Does this touch auth, payments, data deletion, or migrations? (→ extra caution required)
- Am I solving the right problem, or a symptom of a deeper problem?

### 1.3 Legacy code rule:
If the existing codebase already violates a rule in this SOP:
- Flag it: "Note: existing code at [location] violates [rule]. I will not change it unless asked."
- Do NOT silently fix it while working on something else
- Do NOT use the existing violation as justification to repeat it

### 1.4 Multi-developer rule:
If instructions from multiple team members conflict:
- Do NOT silently pick one
- State: "I received conflicting instructions: [A] from [person/source] and [B] from [person/source]. Which takes priority?"
- Wait for resolution before proceeding

### 1.5 Context window discipline:
- At 60% context: summarize progress, mention proactively
- At 80% context: STOP. Write progress to PROGRESS.md. Tell the user to start a new session
- When resuming: always read DECISIONS.md and BACKLOG.md before starting
- Never assume context from a previous session is still accurate — re-read relevant files

---

## 2. CODE QUALITY — UNIVERSAL RULES (ALL STACKS)

### 2.1 Functions
- One function = one responsibility. If you say "and" describing it, split it
- Function length is a smell, not a hard limit — prefer clarity over line count
- Name functions with verb + noun: getUser(), createOrder(), validateEmail()
- Never use: doStuff(), process(), handle(), data, info, obj, temp, val, x, y as names

### 2.2 Error handling — zero tolerance for silent failures
Every language has a version of this. Apply the principle regardless of syntax:

```
// BANNED in any language — silent swallow
try { doSomething() } catch (e) {}          // JS/TS
except Exception: pass                       # Python
catch (_) {}                                 // Dart/Swift

// REQUIRED — log, context, rethrow or handle explicitly
try {
  doSomething()
} catch (error) {
  log.error('Operation failed', { error, context, requestId })
  throw new AppError(error.message, 'OPERATION_FAILED')
}
```

### 2.3 Comments
- Comment WHY, never WHAT — code shows what
- All public/exported functions require documentation comments (JSDoc, docstring, etc.)
- TODOs must reference a ticket: TODO(#123): description
- Delete commented-out code — version control remembers it

### 2.4 Types and contracts
- Use the strongest type system available in your language
- No escape hatches: no `any` (TS), no `object` (Python untyped), no untyped function params
- Define shared types in a central location — not inline at usage sites
- All function parameters and return types must be explicitly typed

### 2.5 Verification loop — mandatory after every code change
After writing code, ALWAYS:
1. Run the build/compile step for this module
2. Run the linter with auto-fix
3. Run the type checker (if applicable)
4. Run the relevant tests
5. If tests don't exist, write at least 3: happy path, empty/null input, error case

If you cannot verify, say so explicitly before presenting the code.

---

## 3. PROACTIVE ARCHITECTURE REVIEW

Before implementing any feature that touches more than 2 files or takes more than 30 minutes, answer these in writing:

```
ARCHITECTURE REVIEW (required before complex tasks):

1. What is the single responsibility of this feature/module?
2. What are the inputs and outputs? (define the interface first)
3. What existing code does this depend on?
4. What existing code depends on this?
5. What will break if this changes later?
6. Is there a simpler approach that achieves the same result?
7. Does this introduce a new pattern, or follow an existing one?
   If new: why is the existing pattern insufficient?
```

Do not skip this for "quick" features. Most production incidents come from features that seemed quick.

---

## 4. SECURITY — EVERY PR, EVERY STACK

These rules apply regardless of language, framework, or platform.

### 4.1 The non-negotiable six:
1. Broken access control — every sensitive endpoint requires auth, checked server-side
2. Client-side validation only — server MUST re-validate everything the client sends
3. Injection flaws — never interpolate user input into queries, shell commands, or templates
4. Hardcoded secrets — scan every file before committing
5. Missing auth on real-time connections — WebSocket/SSE/gRPC streams need the same auth as REST
6. CSRF on state-changing operations — implement and verify tokens on all OAuth and form flows

### 4.2 Input validation rule — all external input is hostile:
- Validate ALL input at the system boundary — never trust request body, params, query, headers, or files
- Use a schema validation library — not manual if/else chains
- Return descriptive errors on validation failure (400, not 500)
- Sanitize before passing to any downstream system (DB, shell, template engine)

### 4.3 Security checklist — run after every feature:
- [ ] All endpoints: auth required OR explicitly marked public in code
- [ ] Server-side validation on all inputs
- [ ] No secrets in source code
- [ ] All queries use parameterized form — no string interpolation
- [ ] File uploads: validate type, size, and content
- [ ] Rate limiting on all auth and mutation endpoints

### 4.4 Things that require explicit human confirmation — never do autonomously:
- Any destructive database operation (DROP, TRUNCATE, DELETE without WHERE)
- Deleting files or directories recursively
- Pushing to main/master directly
- Running migrations on production
- Exposing environment variables in logs or error responses
- Any operation described as "irreversible"

---

## 5. API DESIGN — STACK-AGNOSTIC RULES

Whether REST, GraphQL, gRPC, or tRPC — these principles apply:

### 5.1 Consistency:
- Every response follows the same shape — success and error
- Every list endpoint has pagination — never return unbounded collections
- Every endpoint is either explicitly authenticated or explicitly public — no ambiguity
- Every mutation is idempotent where possible — safe to retry

### 5.2 REST specifically:
- Noun-based routes: /users, /orders — never verb-based: /getUser, /createOrder
- HTTP methods: GET=read, POST=create, PUT=replace, PATCH=update, DELETE=remove
- Consistent response envelope:
```json
{ "data": ..., "error": null, "meta": { "requestId": "...", "pagination": {} } }
```

### 5.3 Pagination defaults:
- Default page size: 20
- Maximum page size: 100
- Use cursor-based pagination for large or frequently-updated tables
- Never return unbounded lists regardless of expected data size

---

## 6. DATABASE RULES — ALL DATABASES

### 6.1 Query safety:
- No queries inside loops — use batch operations, joins, or DataLoader patterns
- No SELECT * — always specify columns
- All list queries have a LIMIT
- Index every column used in WHERE, JOIN, or ORDER BY
- Run query analysis (EXPLAIN, query plan) on any query touching large tables before merging

### 6.2 Schema changes:
- Every schema change = a migration file — never manual changes on any environment
- All migrations must be reversible — include both up and down
- Never delete a column directly — deprecate first, remove in a later release
- Test migrations on a copy of production data before running on production

### 6.3 Data integrity:
- Soft delete (deletedAt timestamp) instead of hard delete — you will need the data later
- Timestamps on every record: createdAt, updatedAt — non-negotiable
- Never store computed aggregates alongside source data — they drift

---

## 7. MODULE DESIGN — PLUG & PLAY RULES

### 7.1 Structure every feature as self-contained:
```
features/
  auth/
    index.[ext]        ← PUBLIC API — only import from here
    auth.controller.[ext]
    auth.service.[ext]
    auth.types.[ext]
    auth.test.[ext]
```

### 7.2 Dependency rules:
- Feature folders never import from other feature folders
- Features only import from: shared/, config/, types/
- Inter-feature communication: events or shared services only
- All external dependencies injected — never hard-imported inside a service

### 7.3 Interface-first design:
Before writing any implementation, define the contract:
```
// Define what it does before how it does it
interface OrderService {
  createOrder(input: CreateOrderInput): Promise<Order>
  getOrder(id: string): Promise<Order | null>
  cancelOrder(id: string, reason: string): Promise<void>
}
// Then write tests against the interface
// Then implement
// Then wire up
```

This applies in every language — define the signature/interface/protocol before the implementation.

### 7.4 Feature flags for all toggleable features:
- Never comment out features — always gate them behind a flag
- Flags read from environment variables — not hardcoded booleans
- Every flag has a comment explaining what it controls and when it can be removed

---

## 8. DEBUGGING SOP — FOLLOW THIS SEQUENCE, NEVER SKIP STEPS

### Step 1: Reproduce first
- Can you reproduce consistently? If not, document the conditions under which it occurs
- What is the exact input that triggers it?
- What is the expected vs actual behavior?

### Step 2: Read before changing
- Read the full error message — the answer is usually in the stack trace
- Read the relevant code files before writing any fix
- Check version control log — was something recently changed that could have caused this?

### Step 3: Narrow the scope
- Add logging at entry and exit points to isolate where the failure occurs
- Test the smallest possible unit that reproduces the issue
- Determine: is this a logic error, a data error, or an environment error?

### Step 4: State the root cause before writing the fix
```
ROOT CAUSE PROTOCOL — required before any fix:
Q1: What is the EXACT error message? (copy-paste, never paraphrase)
Q2: On which line / in which function does execution fail?
Q3: What is the state of the system at the moment of failure?
Q4: What assumption in the code is being violated?
     "This code assumes X, but the actual value is Y"
Q5: Is this a logic error, a data error, or an environment error?

Only after answering all 5 should you write the fix.
State: "Root cause: [Q4]. Fix: [minimal change]."
```

### Step 5: Fix with minimum change
- Change the minimum amount of code to fix the issue
- Do NOT refactor surrounding code while fixing a bug
- Write a test that fails before the fix and passes after

### Step 6: Verify the fix
- Run the full test suite — not just the affected test
- Verify the original error no longer appears end-to-end
- Check edge cases around the fix

### If stuck after 2 attempts:
STOP. Do not retry the same approach. Report:
```
STUCK REPORT:
- Approach tried: [describe]
- Attempt 1 result: [exact error]
- Attempt 2 result: [exact error]
- Why it keeps failing: [honest assessment]
- 3 DIFFERENT approaches to try instead:
  Option A: [approach + trade-off]
  Option B: [approach + trade-off]
  Option C: [approach + trade-off]
- Recommendation: [which and why]
```
Then WAIT for direction. Do NOT auto-proceed.

---

## 9. THE 9 DOCUMENTED AI FAILURE MODES — AND HOW TO OVERRIDE THEM

> Source: GitHub #37818, #42796 (AMD Director analysis / 6,852 sessions / 234,760 tool calls),
> dev.to, SitePoint, Medium, The Register, Anthropic April 2026 postmortem.
> Every pattern below is documented and repeated — not theory.

### Root cause of all failures:
"Edit-first" behavior instead of "research-first" behavior. When context is high or reasoning budget is low, the AI skips reading and edits immediately — like an intern who opens files at random and starts typing confidently.

---

#### FAILURE 1: Rush to Completion — declares fixed without verifying
Override:
```
After every fix:
1. Run the ACTUAL process that was broken — not just unit tests
2. Check the output/log of the running process
3. Verify end-to-end: does the original error still appear?
4. State: "I verified by [action]. Output was: [output]."
"Fixed" means nothing without evidence.
```

#### FAILURE 2: Infinite Retry Loop — same broken approach, infinite confidence
Override:
```
After 2 failed attempts at the same approach: STOP.
Do not attempt a third time.
File a STUCK REPORT (see Section 8) and wait for direction.
```

#### FAILURE 3: Edit First, Read Never — modifying files without reading them
Override:
```
Before touching ANY file:
1. Read the entire file
2. Read files that import from or are imported by this file
3. Search for existing implementations of similar logic
4. Only then write the change
State: "I read [file]. The existing pattern is [pattern]. My change follows it by [explanation]."
```

#### FAILURE 4: Regression Cascade — fix one bug, create three
Override:
```
Before any fix:
1. List every file that will change
2. List dependents (one level)
3. Run full test suite BEFORE the fix (baseline)
4. Apply fix
5. Run full test suite AFTER
6. New failures = regression → REVERT and reassess
```

#### FAILURE 5: Whole-File Rewrites — instead of surgical edits
Override:
```
- Show the diff BEFORE applying
- If a fix requires changing more than 50 lines, it is a rewrite, not a fix
- Rewrites require explicit approval: "This requires rewriting X because Y. Proceed?"
- Never rewrite a file not mentioned in the original bug report
```

#### FAILURE 6: Fixing the Symptom, Not the Root Cause
Override: Always complete the ROOT CAUSE PROTOCOL in Section 8 before writing any fix.

#### FAILURE 7: Hallucinating the Fix — confident wrong answers
Override:
```
For any fix involving library APIs, config keys, schema, or external APIs:
→ READ the actual file or docs first
→ Never state a version number, function signature, or config key from memory
If you haven't read a file to confirm a fact: say so before stating it.
```

#### FAILURE 8: Context Rot — forgetting what it was solving
Override:
```
At the START of any debugging session, write DEBUG_SESSION.md:
---
BUG: [one sentence]
ORIGINAL ERROR: [exact message]
APPROACHES TRIED: (none yet)
HYPOTHESIS: (blank)
CONSTRAINTS: (things we cannot change)
---
Update after every failed attempt. Re-read at 70% context.
```

#### FAILURE 9: Stop-Hook Violations — ignoring process boundaries
Override:
```
When a stop hook or "verify before proceeding" instruction is encountered:
1. STOP
2. State: "Stop hook triggered at: [action]. Verification required."
3. Run the check
4. Paste the ACTUAL output
5. State: "Result: [PASS/FAIL]. Proceeding / Not proceeding because [reason]."
Never acknowledge-and-ignore a stop hook.
```

---

## 10. MULTI-FILE COORDINATION

Claude frequently gets the first 3 files right and forgets the last 2.

```
MULTI-FILE CHANGE PROTOCOL (any change touching 3+ files):
1. List ALL files that need to change — before writing a single line
   - [ ] file1 — reason
   - [ ] file2 — reason
   - [ ] file3 — reason
2. Check off each file as completed
3. Do NOT declare done until every box is checked
4. If a file is missed mid-way: stop, add it to the list, continue
```

---

## 11. TESTING RULES — ALL STACKS

### 11.1 What to test:
- Test observable behavior, not implementation details
- Test: happy path, empty/null input, error case — minimum 3 per new function
- After writing a test, ask: "If I delete the feature this covers, does the test fail?" If no → rewrite it

### 11.2 Banned test patterns:
```
❌ Testing internal state instead of output
❌ Mocking so heavily the test proves nothing (you're testing the mock)
❌ Tests that pass after you delete the feature they cover
❌ Commenting out failing tests instead of fixing the underlying code
❌ Changing the test to match broken behavior instead of fixing the behavior
```

### 11.3 Test naming:
- Name describes behavior, not implementation: "returns empty list when no results" not "test_query_fn"
- Write the test name before the test body — forces you to know what you're testing

---

## 12. OBSERVABILITY — NEW CODE MUST BE DEBUGGABLE IN PRODUCTION

Every new endpoint, service, or background job must have:

```
// Entry — always log
log.info('Operation started', { requestId, userId, operation, sanitizedInput })

// Exit — always log
log.info('Operation completed', { requestId, durationMs, result })

// Error — always log
log.error('Operation failed', { requestId, error, stack, sanitizedInput })
```

Checklist for every new feature:
- [ ] Entry point logs requestId and key input (no PII, no secrets)
- [ ] Exit point logs duration
- [ ] All error paths log full context
- [ ] Background jobs log jobId, attempt number, input
- [ ] Sensitive fields scrubbed before logging (passwords, tokens, card numbers, PII)

---

## 13. ENVIRONMENT VARIABLE VALIDATION

Crash fast on startup if required config is missing — never let the app start in a broken state.

```
// Pattern applies in every language — adapt syntax to your stack

const required = ['DATABASE_URL', 'JWT_SECRET', 'REDIS_URL', 'API_KEY']
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
}
```

Rules:
- Validate all required env vars at startup — before any connections or routes are registered
- Fail with a clear message naming the missing variable — not a cryptic downstream error
- Keep a `.env.example` file updated with every new variable — this is the contract for new developers
- Never commit real values to `.env.example` — use placeholder descriptions
- Never read env vars deep inside business logic — read at startup, inject as config

---

## 14. EXTERNAL API AND RETRY RULES

Every outbound call to an external service will eventually fail. Handle it from day one.

```
// Required pattern for every external API call:
async function callExternalApi(input) {
  const maxRetries = 3
  let attempt = 0

  while (attempt < maxRetries) {
    try {
      const result = await externalService.call(input, { timeout: 5000 })
      return result
    } catch (error) {
      attempt++
      if (attempt === maxRetries) {
        log.error('External API failed after max retries', { error, input, attempt })
        throw error
      }
      // Exponential backoff: 1s, 2s, 4s
      await sleep(Math.pow(2, attempt - 1) * 1000)
    }
  }
}
```

Checklist for every external API call:
- [ ] Timeout set explicitly — never rely on default (often infinite)
- [ ] Retry with exponential backoff on transient failures (5xx, network errors)
- [ ] Do NOT retry on client errors (4xx) — they will not succeed on retry
- [ ] Max retry count is bounded — never infinite retry
- [ ] All failures logged with full context (endpoint, input, attempt count, error)
- [ ] Circuit breaker considered for high-frequency calls to unstable dependencies

---

## 15. BACKGROUND JOB RULES

Long operations belong in a job queue, not in a request handler.

- Any operation taking longer than 2-5 seconds (language/context dependent) → background job
- Every job must be idempotent — safe to run twice with the same input, produces the same result
- Every job must log: jobId, attempt number, input (sanitized), result or error
- Failed jobs must not silently disappear — implement dead letter queues for repeated failures
- Jobs that fail repeatedly need alerting — not just logging
- Never process a job without checking if it was already completed (idempotency key or status check)

```
// Required job structure (adapt to your queue library):
async function processJob(job) {
  log.info('Job started', { jobId: job.id, attempt: job.attemptNumber, input: job.data })

  // Check idempotency — skip if already processed
  const alreadyDone = await db.jobResults.findOne({ jobId: job.id })
  if (alreadyDone) {
    log.info('Job already processed, skipping', { jobId: job.id })
    return
  }

  try {
    const result = await doWork(job.data)
    await db.jobResults.create({ jobId: job.id, result })
    log.info('Job completed', { jobId: job.id, durationMs: Date.now() - job.startedAt })
  } catch (error) {
    log.error('Job failed', { jobId: job.id, attempt: job.attemptNumber, error })
    throw error // let the queue handle retry/DLQ
  }
}
```

---

## 16. DEPENDENCY MANAGEMENT

Before any package install:
```
DEPENDENCY INSTALL PROTOCOL:
1. Read the existing dependency manifest (package.json, requirements.txt, Cargo.toml, go.mod, etc.)
2. Check the existing version of any related package
3. Confirm compatibility with runtime version and peer dependencies
4. State: "Adding [package]@[version]. Compatible with [runtime] and existing [dep]@[version]."
5. Prefer packages already used in the project over introducing new ones
6. Never install without stating why it's needed and what it replaces (if anything)
```

---

## 17. ASYNC AND CONCURRENCY RULES

```
// BANNED — no partial failure handling
Promise.all([a(), b(), c()])  // if one fails, you lose all results

// REQUIRED — explicit partial failure handling
const results = await Promise.allSettled([a(), b(), c()])
const failed = results.filter(r => r.status === 'rejected')
if (failed.length > 0) {
  log.error('Partial failure', { failed })
  // decide explicitly: throw, return partial, or retry
}
```

Checklist for every concurrent operation:
- [ ] What happens if 1 of N operations fails?
- [ ] Is partial success acceptable?
- [ ] Are there shared resources that could race?
- [ ] Is this idempotent if retried after partial failure?

---

## 18. CROSS-PLATFORM AND ENVIRONMENT RULES

- All file paths use the platform's path joining utility — never string concatenation
- Never assume a temp directory path — use the language's os/path utility
- Shell commands that are OS-specific must be flagged with a comment and an alternative
- Never assume a global CLI tool is installed — check first or document the requirement
- Environment-specific behavior must be gated on an env var or platform check, not assumed

---

## 19. SCALABILITY — DESIGN FOR 10X BEFORE YOU NEED IT

### 16.1 Data layer:
- Every collection that can grow unboundedly needs pagination from day one
- Soft delete instead of hard delete — you will need the data later
- Timestamps on every record: createdAt, updatedAt
- Never store computed aggregates alongside source data — they drift

### 16.2 Service layer:
- Stateless services only — no in-memory state that breaks horizontal scaling
- Config via environment variables — never hardcoded, never in the database
- Idempotency keys on all mutation endpoints that could be retried
- Long operations (language-dependent threshold, typically 2-5s) belong in a background job

### 16.3 Caching — answer these before adding any cache:
1. What is the cache key? (must be deterministic)
2. What is the TTL? (must be explicit — no infinite cache)
3. How is the cache invalidated when data changes?
4. What happens on cache miss? (must not cause a thundering herd)

A cache without a clear invalidation strategy is a bug waiting to happen.

---

## 20. CODE REUSE — STOP DUPLICATING LOGIC

Before writing any new function:
1. Search for existing implementations in shared/, utils/, helpers/, lib/
2. If similar logic exists in 2+ places already → extract it NOW before adding a third
3. The threshold: write it twice, the third time it must be a shared function

---

## 21. PERFORMANCE — MEASURE BEFORE OPTIMIZING

See Section 33 for concrete performance budgets and targets.

Never optimize without profiler data. Never silently ship slow code — add a comment and a ticket.
The optimization order: algorithm → query → cache → infrastructure. Never skip steps.

---

## 22. NO PARTIAL IMPLEMENTATIONS

A feature is NOT done if it contains TODO comments in the critical execution path.

- TODOs are only acceptable in: non-blocking UI polish, future optimization notes, explicitly out-of-scope items
- Every TODO must reference a ticket: TODO(#123): description
- Before declaring any task complete, search changed files for: TODO, FIXME, HACK, XXX
- If a TODO exists in a critical path, either implement it now or explicitly tell the user:
  "I left a TODO at [location] for [reason]. This will cause [consequence] if not addressed."

---

## 23. GIT AND VERSION CONTROL RULES

- Branch naming: feat/, fix/, refactor/, chore/ prefix required
- Never commit to main/master directly
- Commit messages: Conventional Commits format
  - feat(auth): add OAuth login
  - fix(api): resolve N+1 query in users endpoint
  - refactor(checkout): extract payment validation to service
- One concern per commit — do not bundle unrelated changes
- PR description must include: what changed, why, how to test, screenshot if UI changed
- Run before every commit: lint → typecheck → tests → all green
---

## 24. ROLLBACK PLAN — REQUIRED FOR EVERY DEPLOY TOUCHING DATA, SCHEMA, OR AUTH

```
ROLLBACK PLAN (fill out before merging):
---
Feature: [name]
Deploy command: [exact command]

To roll back:
1. Revert command: [git revert SHA / feature flag toggle]
2. Database: [migration down command, or "no DB changes"]
3. Data that cannot be rolled back: [list irreversible writes, or "none"]
4. Feature flag to disable: [flag name, or "no flag — requires revert"]
5. Who to notify if rollback is triggered: [team/channel]
6. How to verify rollback succeeded: [specific check]
---
```

If any field is "unknown" → do not ship until it is answered.

---

## 25. ARCHITECTURAL MEMORY — DECISIONS.md

Every session that makes an architectural decision must record it.

```markdown
## [Date] — [Decision title]

**Context:** Why did this need to be decided?
**Options considered:**
- Option A: pros / cons
- Option B: pros / cons
**Decision:** [what was chosen]
**Reason:** [why]
**Consequences:** [what this rules out]
**Revisit if:** [condition that would make us reconsider]
```

At the start of every session: read DECISIONS.md before writing any code.
If a proposed approach contradicts a past decision, flag it before proceeding.

---

## 26. PUSHBACK PROTOCOL — DISAGREEMENT IS HELPFULNESS

If the user's proposed approach has a known failure mode:

```
PUSHBACK PROTOCOL:
"Your proposed approach will work, but it has a known issue: [specific problem].
A common consequence is [what goes wrong].
Alternative: [better approach].
Do you want to proceed with your approach or the alternative?"
```

This is not optional. If asked to implement something insecure, fragile, or architecturally problematic:
1. State the problem clearly
2. Propose the better approach
3. If the user still wants the original — implement it AND add a comment explaining the risk

---

## 27. MANDATORY VERBAL STOPS — SAY THIS BEFORE ACTING

These situations require a verbal stop, not silent action:

```
1. Fix touches more than 3 files:
   "This fix touches [N] files: [list]. Should I proceed?"

2. About to delete or truncate data:
   "This will delete [what]. Cannot be undone without a backup. Confirm: yes/no?"

3. Tried this approach before in this session:
   "I tried [approach] earlier and got [result]. Should I try again or try [alternative]?"

4. Not sure this fixes the root cause:
   "This fixes the symptom [X]. Root cause might be [Y]. Want the quick fix or the root fix?"

5. Test suite doesn't cover this behavior:
   "Existing tests don't verify [behavior]. Should I write the test first?"

6. About to run against production data:
   "This will run against PRODUCTION. Type CONFIRM to proceed."
```

---

## 28. PRE-SHIP CHECKLIST — RUN BEFORE EVERY MERGE TO MAIN

If any item fails → do not ship.

### Code Quality
- [ ] Functions are single-responsibility
- [ ] No banned variable names (data, info, obj, temp, val, x, y)
- [ ] No escape-hatch types (any, untyped, object)
- [ ] No empty catch blocks
- [ ] No commented-out code
- [ ] No debug logging in production paths
- [ ] No TODO/FIXME in critical execution paths

### Testing
- [ ] Tests for every new function: happy path, null/empty, error case
- [ ] All existing tests still pass
- [ ] New feature has at least one integration or end-to-end test

### Security
- [ ] All endpoints authenticated or explicitly marked public
- [ ] Server-side validation on all inputs
- [ ] No secrets in source code
- [ ] No query string interpolation (parameterized queries only)

### Database (if applicable)
- [ ] Migration file created for schema changes
- [ ] Migration is reversible
- [ ] No unbounded queries in list endpoints
- [ ] New query columns are indexed

### Observability
- [ ] Entry, exit, and error logs on new endpoints/services
- [ ] requestId propagated through all log lines
- [ ] No PII or secrets in log output

### UI and Accessibility (if applicable)
- [ ] All images have alt text
- [ ] All interactive elements are keyboard reachable
- [ ] All form inputs have associated labels
- [ ] Loading, error, and empty states all handled
- [ ] No inline objects/arrays in render
- [ ] Mobile layout tested at 375px
- [ ] No raw error objects shown to users

### Deploy Readiness
- [ ] Environment variable example file updated
- [ ] README updated if setup changed
- [ ] Feature tested in staging
- [ ] Rollback plan filled out (Section 21)

---

## 29. QUICK REFERENCE — WHEN THINGS GO WRONG

| Symptom | Most likely cause | First thing to check |
|---------|-----------------|---------------------|
| Works in dev, fails in prod | Env var missing | Compare .env.example vs production env |
| Slow list endpoints | N+1 queries or missing index | Enable query logging, check for loops |
| Random auth failures | Token expiry or clock skew | Check token TTL and refresh logic |
| Memory leak | Missing cleanup in subscriptions/timers | Check all async teardown paths |
| UI broken on mobile | Hardcoded pixel values | Check responsive breakpoints |
| Migration failed | Wrong column type or constraint | Test migration on staging first |
| 500 errors with no logs | Silent catch block | Search codebase for empty catch |
| Feature flag not working | Env var not set | Check env var and example file |
| Intermittent failure | Race condition or external dependency | Add structured logging to all paths |
| Works for some users, not others | Authorization bug | Check server-side permission logic |

---

## 30. BUG REPORT TEMPLATE — USE THIS EVERY TIME

```
## What I asked it to do:
[original task]

## What actually happened:
[exact error message — copy-paste, never paraphrase]

## Steps to reproduce:
1.
2.
3.

## Expected behavior:
[what should happen]

## Already tried:
- [attempt 1 and result]
- [attempt 2 and result]

## Recent changes that might be related:
[last commit or last session change]

## Relevant files:
[list files most likely involved]

## Environment:
- Language/runtime version:
- Framework version:
- Relevant package versions:
```

---

## 31. ESCALATION — WHEN TO STOP PATCHING AND ASK FOR HELP

Escalate when:
- The same category of bug has appeared 3+ times — root cause is architectural
- The fix requires changing a pattern used throughout the codebase — needs a migration plan
- The error involves data corruption or inconsistency — needs review before touching
- The bug only appears in production with production data — needs proper debugging infrastructure
- You have applied 3 fixes and the error persists — you do not understand the root cause

```
ESCALATION REPORT:
---
I've been debugging [bug] for [N] attempts.
Root cause appears to be: [architectural / data / environment issue]
I should NOT continue patching because: [reason]

Recommended next steps:
Option 1: [proper fix — scope]
Option 2: [add observability to get more data]
Option 3: [consult documentation or team member]

What I should NOT do: continue applying point fixes to [file/function]
---
```

---

## 32. SESSION MANAGEMENT

### Start of every session:
1. Read this file
2. Read DECISIONS.md if it exists
3. Read BACKLOG.md if it exists
4. Ask: "What is the goal of this session?"

### End of every session:
- If architectural decisions were made → update DECISIONS.md
- If tasks remain → update BACKLOG.md
- If new patterns were established → suggest adding to this file

### Context management (tool-agnostic):
- When context is getting long: summarize progress to a file, tell the user
- When resuming after a break: re-read relevant files — do not rely on memory
- When context is very long: stop, write state to file, start fresh session

---

## 33. ACCESSIBILITY — NON-OPTIONAL FOR ANY UI

These apply to any component-based UI framework (React, Vue, Angular, Svelte, etc.):

- Every image needs descriptive alt text — empty alt="" only for decorative images
- Interactive elements need accessible labels if text content is not descriptive
  (icon-only buttons, icon links, custom controls)
- Forms need proper label associations — every input linked to a visible or screen-reader label
- Keyboard navigation must work for all interactive elements — tab order must be logical
- Color alone must never convey meaning — always pair with text or icon
- Focus indicators must be visible — never remove outline without replacing it
- Dynamic content changes (modals, toasts, errors) must be announced to screen readers

Checklist before merging any UI change:
- [ ] All images have alt text
- [ ] All interactive elements are keyboard reachable and operable
- [ ] All form inputs have associated labels
- [ ] Focus is managed correctly when modals or dialogs open/close
- [ ] No color-only meaning in status indicators or error states

---

## 34. UI COMPONENT RULES — ANY COMPONENT FRAMEWORK

These catch the most common UI bugs regardless of framework:

- No inline object or array creation inside render/template — creates a new reference every render cycle and causes unnecessary re-renders
- No missing key/id props on list items — causes incorrect DOM reconciliation
- Every async operation needs three states handled: loading, error, success
- Every list needs an empty state — "no results" is a feature, not an afterthought
- Every API error must be shown to the user — not just logged to the console
- Every subscription, timer, or event listener created in a component must be cleaned up when the component unmounts
- Test UI at mobile breakpoints (320px, 375px, 768px) for every layout change
- All user-facing strings go through the project's i18n system if one exists — never hardcode display text

Banned UI patterns:
```
❌ Inline objects in render (new reference every cycle)
   <Component style={{ margin: 0 }} onClick={() => handler()} />

❌ Missing cleanup on subscriptions
   useEffect(() => { socket.on('event', handler) }, [])  // no return cleanup

❌ Showing raw error objects to users
   <p>{error.toString()}</p>

❌ No loading state
   return <div>{data.map(...)}</div>  // crashes if data is undefined

✅ Correct pattern
   if (isLoading) return <Skeleton />
   if (error) return <ErrorMessage message="Something went wrong" />
   if (!data.length) return <EmptyState />
   return <div>{data.map(...)}</div>
```

---

## 35. SCHEMA SYNC — KEEPING CONSUMERS IN SYNC WITH PRODUCERS

When any API response shape, event payload, or data contract changes:

```
SCHEMA SYNC PROTOCOL:
1. Search for ALL types/interfaces/schemas that model this response:
   - TypeScript: search for interface.*Response, type.*DTO, interface.*Payload
   - Python: search for dataclass, TypedDict, Pydantic model with matching fields
   - Any language: search for the old field name across the entire codebase
2. Update every type that reflects the changed shape
3. Run the type checker to catch drift (tsc --noEmit, mypy, etc.)
4. Search for hardcoded field name references in consumers:
   - Renamed field: search for ".oldFieldName" across all consumer code
   - Removed field: search for any reference to the removed field
5. Never declare a contract change done without completing this checklist
```

This applies to: renamed fields, removed fields, changed types, added required fields, reordered parameters.

---

## 36. PERFORMANCE BUDGETS — CONCRETE TARGETS

### Frontend (per page/view):
| Metric | Target | How to measure |
|--------|--------|----------------|
| First Contentful Paint | < 1.5s | Lighthouse, WebPageTest |
| Time to Interactive | < 3.5s | Lighthouse |
| Initial JS bundle | < 200kb gzipped | Build output |
| Unnecessary re-renders | 0 | Framework devtools profiler |

- Never add a dependency without checking its size impact first
- Any page exceeding these targets needs a comment explaining why and a ticket to fix it

### Backend (per endpoint):
| Metric | Target | How to measure |
|--------|--------|----------------|
| p95 response time | < 200ms | Timing logs at entry/exit |
| DB queries per request | ≤ 3 | Query logging in dev |
| Memory per request | No growth over 100 requests | Process memory monitoring |

- Any endpoint exceeding these targets must have a comment and a ticket — never silently ship slow endpoints
- Run load testing on any endpoint expected to handle > 100 req/s before going to production

### The optimization order — never skip steps:
1. Measure first — no optimization without profiler data
2. Fix the algorithm before the implementation
3. Fix the query before adding a cache
4. Add a cache only after the query is optimized
5. Add infrastructure (CDN, read replicas) only after code is optimized

---

*This is a living document.*
*Every time a mistake is made that is not covered here → add a rule.*
*"Compound Engineering — every error becomes a new rule."*
*Updated: 2026 | Sources: GitHub #37818, #42796, dev.to, SitePoint, Medium, The Register,*
*Anthropic April 2026 postmortem, DryRun Security 2026 report, Check Point CVE-2025-59536*


---

## 29. FLUTTER ↔ BACKEND CONTRACT RULES — PREVENT SILENT FAILURES

Derived from real incidents in this project. Every rule here prevented a production bug.

### 29.1 Always read BOTH sides before writing either side

Before writing a Flutter provider that calls an API:
1. Read the backend route file first — what keys does it return? What does it expect?
2. Read the backend schema (Zod, etc.) — what field names, types, and constraints?
3. Only then write the Dart model and provider

**The mistake this prevents:** Provider reads `raw['students']` but backend returns `raw['roster']`. Silent empty list, no error thrown.

### 29.2 Match field names exactly — never guess

| Wrong | Correct |
|-------|---------|
| `j['id']` | `j['student_id']` (read the actual backend response) |
| `j['name']` | `j['student_name']` |
| POST `'class'` | POST `'class_name'` (read the Zod schema) |

**Rule:** Copy-paste field names from the backend route. Do not infer them.

### 29.3 Never use bare `catch (_)` — always log the actual error

```dart
// BANNED — loses all diagnostic information
catch (_) {
  _error = 'Failed to save'; return false;
}

// REQUIRED — shows actual error to developer and user
catch (e) {
  _error = 'Failed: $e'; return false;
}
```

### 29.4 Named routes — register before referencing

Before calling `Navigator.pushNamed('/route')` anywhere:
1. Check `onGenerateRoute` in `main.dart` — is `/route` registered?
2. If not, add it before writing the call

**The mistake this prevents:** Dashboard KPI tiles call `/attendance` → "Page not found" because the route was never registered.

### 29.5 Web token storage — always save from response body

Flutter Web cannot read `Set-Cookie` headers. Every login endpoint must:
1. Return `token` in the JSON response body
2. The Flutter `login()` method must save `data['token']` to storage

```dart
// REQUIRED for web compatibility
final bodyToken = data['token'] as String?;
if (bodyToken != null) await StorageService.instance.saveToken(bodyToken);
```

### 29.6 Bottom sheet Provider scope — never use Consumer inside showModalBottomSheet

`showModalBottomSheet` creates a new route context detached from the provider tree.

```dart
// BANNED — throws ProviderNotFoundException
showModalBottomSheet(builder: (_) => Consumer<MyProvider>(...))

// REQUIRED — capture provider before entering sheet
final myProvider = context.read<MyProvider>();
showModalBottomSheet(builder: (sheetCtx) => ListenableBuilder(
  listenable: myProvider,
  builder: (_, __) => ...,
))
```

### 29.7 Verify saves actually reach the backend

After implementing any save/submit feature:
1. Check the backend terminal logs — did the route log the request?
2. Check the database — was the row actually inserted/updated?
3. Do NOT declare a feature "done" based only on the UI showing success

**The mistake this prevents:** Save button appears to work, snackbar shows "Saved!", but token is missing so request was rejected silently.

### 29.8 Database migrations — run ALL pending migrations before testing

When a backend route uses a column that was added in a later migration:
1. Check `scripts/` for any migration files that add columns to tables you're using
2. Run them: `npx tsx scripts/migrate-*.ts`
3. Missing columns cause 500 errors that look like code bugs

**Columns added by migrations that must be run:**
- `parent_accounts.cnic` → `npx tsx scripts/migrate-parent-cnic.ts`
- `parent_account_institutes` table → `npx tsx scripts/migrate-multi-institute.ts`

---

## 30. NEXT.JS SPECIFIC RULES

### 30.1 Clear .next cache when routes return 404 unexpectedly

If a route file exists at `app/api/*/route.ts` but returns 404:
```cmd
Remove-Item -Recurse -Force .next
npm run dev
```

### 30.2 Client-side fetch must include credentials

Layout and page components that fetch API routes must include `credentials: 'include'` so cookies are sent:

```typescript
fetch("/api/auth/me", { credentials: "include" })
```

Without this, `lags_token` cookie is not sent → 401 → redirect loop.

### 30.3 Never redirect to login on SyntaxError in catch blocks

```typescript
// BANNED — causes infinite reload loop
.catch((err) => {
  window.location.replace("/login?session=expired"); // always redirects, even on parse errors
})

// REQUIRED — only redirect on true auth failures
.catch((err) => {
  if (err instanceof SyntaxError) return; // parse error, not auth failure — stay on page
  if (err?.name === "AbortError") return; // intentional abort
  window.location.replace("/login?session=expired");
})
```


---

## 31. UX TRIGGER RULES — PREVENT TWO-STEP ACTIONS

### 31.1 Dropdowns that filter content must auto-trigger on selection

When a dropdown selection determines what content loads next, selecting from the dropdown MUST immediately trigger the load. Do NOT require a separate "Load" / "Submit" button after a dropdown selection.

```dart
// BANNED — requires two actions (select + tap Load)
onChanged: (v) => provider.setClass(v),
// ...separate Load button

// REQUIRED — single action (select triggers load automatically)
onChanged: (v) {
  if (v != null) {
    provider.setClass(v);
    provider.loadStudents(); // auto-load on selection
  }
},
```

**Exception:** A "Load" button is only acceptable when the user needs to configure MULTIPLE fields before the load makes sense (e.g. class + date + subject all required). Even then, the button should be disabled until all required fields are filled.

### 31.2 Explicit vs implicit triggers

| Trigger type | When to use |
|---|---|
| Auto (on selection) | Single dropdown/picker that determines content |
| Button required | Multiple inputs all needed before meaningful load |
| Auto with debounce (300ms) | Search/filter text fields |


---

## 32. CROSS-APP DATA FLOW RULES — TEACHER ↔ STUDENT ↔ PARENT

When one app (lagt/teacher) writes data that another app (lags/student, lagp/parent) reads:

### 32.1 Always verify end-to-end before declaring done

After implementing a write in App A that App B should read:
1. Write the data in App A (e.g. teacher marks attendance)  
2. Immediately open App B and check if the data appears
3. If not, check: same `institute_id`? Same `student_id`? Same table? Same date format?
4. Do NOT declare the feature complete until both apps confirm

### 32.2 Shared IDs must come from the same source

The `student_id` used by:
- Teacher (lagt) when saving attendance = `institute_students.id` from roster
- Student (lags) when reading attendance = `student_account_institutes.student_id`

These MUST be the same UUID. If the student account was created correctly via the provisioning flow, they are. If not (e.g. manual DB insert), they diverge.

**Verification query to run when data doesn't cross apps:**
```sql
-- Check if teacher's attendance rows match the student's account
SELECT ia.student_id AS attendance_student_id,
       sai.student_id AS account_student_id,
       ia.student_id = sai.student_id AS match
FROM institute_attendance ia
JOIN student_account_institutes sai 
  ON sai.institute_id = ia.institute_id
JOIN student_accounts sa ON sa.id = sai.account_id
WHERE ia.date = CURRENT_DATE
  AND ia.institute_id = '<institute_id>';
```

### 32.3 The `student_account_institutes` migration must run first

If students were created but `student_account_institutes` table doesn't exist:
```cmd
cd lag
npx tsx scripts/migrate-multi-institute.ts
```

Without this, `requireStudentAuth` returns null → student API returns 401 → apps show empty data.

### 32.4 Never use `catch (_)` in Flutter providers — see SOP §29.3

A silent catch swallows auth errors. The teacher sees "Saved!" but the backend rejected with 401.


---

## 33. AUTH HELPER RESILIENCE RULES

### 33.1 Auth helpers that JOIN junction tables must have a fallback

When an auth helper JOINs a junction/bridge table (like `student_account_institutes`, `parent_account_institutes`):

```typescript
// FRAGILE — fails silently if junction row is missing
const result = await query(`
  SELECT sai.student_id FROM student_accounts sa
  JOIN student_account_institutes sai ON sai.account_id = sa.id
  WHERE sa.id = $1`, [userId]);
if (result.rowCount === 0) return null; // student gets 401 — no clue why

// RESILIENT — fallback + auto-heal if junction row is missing
const result = await query(`SELECT ... FROM junction_table JOIN ...`);
if (result.rowCount > 0) return mapResult(result.rows[0]);

// Fallback to base table
const fallback = await query(`SELECT student_id, institute_id FROM student_accounts WHERE id = $1`, [userId]);
if (fallback.rowCount === 0) return null;

// Auto-heal — insert missing junction row for future requests
await query(`INSERT INTO junction_table ... ON CONFLICT DO NOTHING`, [...]).catch(() => {});
return mapResult(fallback.rows[0]);
```

### 33.2 Missing junction row = silent 401 = appears as "no data" in UI

When a student/parent app shows "No records" for data that clearly exists in the DB:
1. Check if auth is actually succeeding — add `console.info` to auth helper
2. Check if the junction table has a row for this account
3. Fix: run the migration backfill, OR apply the auto-heal pattern from §33.1


---

## 37. DATA STRUCTURES — CHOOSE THE RIGHT TOOL, EVERY TIME

Wrong data structure choices are silent performance killers. They don't throw errors — they just make production slow and unpredictable.

### 37.1 The Decision Table

| Use case | Correct structure | Wrong structure | Why |
|---|---|---|---|
| Unique values, membership test | Set | Array | Array `.includes()` is O(n); Set `.has()` is O(1) |
| Key→value lookup by ID | Map / Object | Array of objects | Array find is O(n); Map get is O(1) |
| Ordered insertion, no random access | LinkedList / Queue | Array (shift/unshift) | Array shift is O(n); proper queue is O(1) |
| LIFO operations (undo, history) | Stack (array + push/pop) | Array with shift | push/pop is O(1); shift is O(n) |
| Sorted data with frequent insert | Balanced BST / SortedSet | Array (sort after each insert) | Array re-sort is O(n log n); BST insert is O(log n) |
| Hierarchical data (categories, org chart) | Tree / recursive map | Flat array | Flat array requires linear scan for parent/child |
| Priority queue (job scheduler, Dijkstra) | Min/Max Heap | Sorted array | Heap insert is O(log n); sorted-array insert is O(n) |
| Graph traversal (routes, dependencies) | Adjacency list (Map<id, id[]>) | Adjacency matrix | Matrix is O(n²) space; list is O(V+E) |
| Fast prefix search (autocomplete) | Trie | Array filter + startsWith | Array scan is O(n*m); Trie lookup is O(m) |
| Range queries on time/numbers | Segment Tree / B-Tree index | Linear scan | Linear scan is O(n); indexed range query is O(log n) |

### 37.2 Pre-Implementation Checklist

Before choosing any data structure, answer:
1. What is the dominant operation? (read, write, search, delete, iteration)
2. What is the expected data size? (10 items vs 10 million items)
3. Does order matter? Is uniqueness required? Are there duplicates?
4. Is it read-heavy or write-heavy?
5. Are there memory constraints?

**State your answer before writing code:**
```
DATA STRUCTURE CHOICE:
- Dominant operation: [lookup by user ID]
- Size: [up to 50,000 users]
- Order matters: [no]
- Read/write ratio: [90% read, 10% write]
- Choice: Map<userId, User>
- Reason: O(1) lookup vs O(n) array find
```

### 37.3 TypeScript / JavaScript Specifics

```typescript
// ✅ Set for unique values — O(1) add/has/delete
const seen = new Set<string>()
seen.add(id)
if (seen.has(id)) ...

// ✅ Map for keyed lookup — O(1) get/set
const userMap = new Map<string, User>()
userMap.set(user.id, user)
const found = userMap.get(id)

// ❌ Never use array.find() in a hot loop — O(n) per call
const user = users.find(u => u.id === id)  // O(n) — convert to Map first

// ✅ Convert array → Map once, then look up O(1) forever
const userMap = new Map(users.map(u => [u.id, u]))
const user = userMap.get(id)  // O(1)

// ✅ Stack: array with push/pop only
const stack: string[] = []
stack.push(item)
const top = stack.pop()

// ✅ Queue: use a proper deque or shift only on small collections
// For large queues use a dedicated queue library — array.shift() is O(n)
```

### 37.4 Dart / Flutter Specifics

```dart
// ✅ Set for membership checks
final Set<String> loadedIds = {};
if (!loadedIds.contains(id)) { ... loadedIds.add(id); }

// ✅ Map for O(1) keyed lookup
final Map<String, Student> studentMap = {};
for (final s in students) { studentMap[s.id] = s; }
final student = studentMap[id];

// ✅ SplayTreeMap for sorted keys (log n insert + sorted iteration)
import 'dart:collection';
final SplayTreeMap<DateTime, List<Event>> calendar = SplayTreeMap();

// ❌ Never search a List with firstWhere in a loop
final match = list.firstWhere((e) => e.id == id); // O(n) — use Map
```

### 37.5 Rules

- Never use an array where a Set or Map would give O(1) — document why if you must
- Never iterate a large collection to count or find — index it once at load time
- Every data structure choice that deviates from the obvious must have a comment explaining why
- If you're writing a custom cache, define eviction strategy before writing any code (LRU, TTL, or size-bounded)
- Nested loops over large collections are a red flag — ask: can this be rewritten with a Map?

---

## 38. MEMORY MANAGEMENT — LEAK PREVENTION IS NOT OPTIONAL

Memory leaks in production don't crash immediately. They degrade over hours or days, causing slow creep to OOM. By the time they're noticed, they're hard to trace.

### 38.1 The Leak Categories

| Category | Symptom | Common cause |
|---|---|---|
| Retained listeners | Memory grows on navigation | addEventListener never removed |
| Retained timers | Memory grows on every mount | setInterval/setTimeout never cleared |
| Retained subscriptions | Memory grows on stream events | Stream subscriptions never cancelled |
| Closure capture | Large objects never GC'd | Callback holds reference to parent scope |
| Circular reference | Objects never collected | A references B, B references A |
| Cache without eviction | Unbounded memory growth | Map/cache that only grows, never shrinks |
| Detached DOM nodes | Memory grows with DOM updates | References to removed DOM elements kept |

### 38.2 React / Next.js Rules

```typescript
// ✅ Always clean up in useEffect
useEffect(() => {
  const handler = (e: Event) => { ... }
  window.addEventListener('resize', handler)

  const timer = setInterval(tick, 1000)

  const subscription = eventEmitter.on('change', handler)

  return () => {
    // Cleanup — all three must be here
    window.removeEventListener('resize', handler)
    clearInterval(timer)
    subscription.off('change', handler)
  }
}, [])

// ✅ Cancel async operations on unmount
useEffect(() => {
  const controller = new AbortController()

  fetch('/api/data', { signal: controller.signal })
    .then(res => res.json())
    .then(setData)
    .catch(e => { if (e.name !== 'AbortError') setError(e) })

  return () => controller.abort()
}, [])

// ❌ BANNED — no cleanup
useEffect(() => {
  window.addEventListener('resize', handler)  // never removed = leak
  setInterval(tick, 1000)                      // never cleared = leak
}, [])
```

### 38.3 Dart / Flutter Rules

```dart
// ✅ Always cancel stream subscriptions in dispose()
class _MyWidgetState extends State<MyWidget> {
  StreamSubscription? _sub;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _sub = myStream.listen(_onEvent);
    _timer = Timer.periodic(const Duration(seconds: 5), _tick);
  }

  @override
  void dispose() {
    _sub?.cancel();      // ✅ must cancel
    _timer?.cancel();    // ✅ must cancel
    super.dispose();
  }
}

// ✅ ChangeNotifier — dispose cleans up listeners
class MyProvider extends ChangeNotifier {
  StreamSubscription? _sub;

  void init() {
    _sub = stream.listen((_) => notifyListeners());
  }

  @override
  void dispose() {
    _sub?.cancel();
    super.dispose();
  }
}
```

### 38.4 Node.js / Backend Rules

```typescript
// ✅ Bound caches with eviction
// BANNED: unbounded Map used as cache
const cache = new Map<string, Data>()  // grows forever

// REQUIRED: LRU cache with max size
import LRU from 'lru-cache'
const cache = new LRU<string, Data>({ max: 500, ttl: 1000 * 60 * 5 })

// ✅ Always clear event listeners on server/worker shutdown
process.on('SIGTERM', () => {
  server.close()
  redisClient.quit()
  dbPool.end()
})

// ✅ Avoid closure capture of large request objects in callbacks
// BAD — entire req object retained by callback closure
router.get('/data', (req, res) => {
  setTimeout(() => processUser(req.user), 5000)  // req held in memory 5s
})

// GOOD — extract only what you need
router.get('/data', (req, res) => {
  const userId = req.user.id  // only the ID is captured
  setTimeout(() => processUser(userId), 5000)
})
```

### 38.5 Pre-Implementation Checklist

Before writing any component, provider, or service:
1. Does it subscribe to any stream, socket, or event? → Plan the unsubscribe
2. Does it start any timer or polling? → Plan the cancel/clear
3. Does it create any cache? → Define max size and eviction policy now
4. Does it hold a reference to a large object in a callback? → Extract only the primitive needed
5. Does it add DOM event listeners? → Plan the removeEventListener

**Rule:** If you write `addEventListener`, `setInterval`, `subscribe`, or `listen` — you must write the corresponding cleanup in the same file, immediately, before moving on.

### 38.6 Signs You Have a Memory Leak — Investigate Immediately

- Server process memory grows linearly under constant load and never stabilizes
- App slows down noticeably after 30+ minutes of use without page reload
- DevTools heap snapshot shows detached DOM nodes
- Flutter memory profiler shows monotonically increasing allocation with no GC recovery
- CPU spikes periodically even with no user activity (leaked timer/interval)

---

## 39. OOP — OBJECT-ORIENTED DESIGN RULES

OOP is not about using classes everywhere. It is about modeling responsibilities clearly so the system stays maintainable as it grows.

### 39.1 SOLID Principles — Applied, Not Just Named

**S — Single Responsibility**
One class = one reason to change. If you describe a class and say "and", split it.
```typescript
// ❌ Does too much — auth + email + DB
class UserService {
  login() { ... }
  sendWelcomeEmail() { ... }  // should be EmailService
  saveToDatabase() { ... }    // should be UserRepository
}

// ✅ Each class has one job
class AuthService   { login() {} }
class EmailService  { sendWelcome() {} }
class UserRepo      { save() {} }
```

**O — Open/Closed**
Open for extension, closed for modification. Add behavior via new classes, not by editing existing ones.
```typescript
// ❌ Every new payment type requires editing this class
class PaymentProcessor {
  process(type: string) {
    if (type === 'stripe') { ... }
    else if (type === 'jazzcash') { ... }  // keeps growing
  }
}

// ✅ Add a new gateway without touching existing code
interface PaymentGateway { charge(amount: number): Promise<void> }
class StripeGateway implements PaymentGateway { charge() { ... } }
class JazzCashGateway implements PaymentGateway { charge() { ... } }
class PaymentProcessor { constructor(private gateway: PaymentGateway) {} }
```

**L — Liskov Substitution**
A subclass must be usable anywhere its parent is expected — without breaking the caller.
```typescript
// ❌ Subclass breaks the contract
class Bird { fly() {} }
class Penguin extends Bird {
  fly() { throw new Error("Penguins can't fly") }  // breaks callers
}

// ✅ Model behavior, not taxonomy
interface Flyable { fly(): void }
interface Swimmable { swim(): void }
class Eagle implements Flyable { fly() {} }
class Penguin implements Swimmable { swim() {} }
```

**I — Interface Segregation**
Don't force classes to implement methods they don't use. Prefer many small interfaces over one fat one.
```typescript
// ❌ Fat interface forces irrelevant implementations
interface UserActions {
  login(): void
  register(): void
  exportData(): void    // admins only — why is User forced to implement this?
  deleteAllUsers(): void // also admin only
}

// ✅ Split by responsibility
interface AuthActions   { login(): void; register(): void }
interface AdminActions  { exportData(): void; deleteAllUsers(): void }
```

**D — Dependency Inversion**
High-level modules must not depend on low-level modules. Both depend on abstractions.
```typescript
// ❌ Hard dependency — impossible to test or swap
class OrderService {
  private db = new PostgresDatabase()  // hard-coded, untestable
}

// ✅ Inject the abstraction
interface Database { query(sql: string, params: any[]): Promise<any[]> }
class OrderService {
  constructor(private db: Database) {}  // inject in tests or DI container
}
```

### 39.2 Composition Over Inheritance

Inheritance is a strong coupling. Use it only when an IS-A relationship is unambiguous and stable.

```typescript
// ❌ Deep inheritance hierarchies — fragile, hard to follow
class Animal {}
class Pet extends Animal {}
class Dog extends Pet {}
class TrainedDog extends Dog {}    // 4 levels deep
class ServiceDog extends TrainedDog {}  // changes at any level break all

// ✅ Compose behaviors
class Dog {
  constructor(
    private trainer: Trainer,
    private healthMonitor: HealthMonitor,
  ) {}
}
```

**Rule:** Inheritance depth > 2 levels is a smell. Flatten with composition or interfaces.

### 39.3 Encapsulation Rules

```typescript
// ❌ Exposing internals — consumers mutate state directly
class Cart {
  public items: Item[] = []  // anyone can push/splice/clear directly
}

// ✅ Expose behavior, hide state
class Cart {
  private items: Item[] = []
  addItem(item: Item): void { this.items.push(item) }
  removeItem(id: string): void { this.items = this.items.filter(i => i.id !== id) }
  getTotal(): number { return this.items.reduce((s, i) => s + i.price, 0) }
  getItems(): readonly Item[] { return this.items }  // read-only view
}
```

**Rules:**
- Default to private. Make things public only when callers genuinely need them.
- Expose behavior (methods), not state (fields).
- Return readonly/immutable views of internal collections, not the raw mutable reference.
- Setters that just assign `this.x = x` are not encapsulation — they're just syntax. Add validation or remove the setter.

### 39.4 Dart / Flutter OOP Rules

```dart
// ✅ Use abstract classes for contracts
abstract class AuthRepository {
  Future<User?> login(String email, String password);
  Future<void> logout();
}

// ✅ Concrete implementation hidden from consumers
class ApiAuthRepository implements AuthRepository {
  final ApiClient _client;  // private
  ApiAuthRepository(this._client);

  @override
  Future<User?> login(String email, String password) async { ... }

  @override
  Future<void> logout() async { ... }
}

// ✅ Providers depend on the abstract, not the concrete
class AuthProvider extends ChangeNotifier {
  final AuthRepository _repo;           // depends on abstraction
  AuthProvider(this._repo);             // concrete injected from outside
}
```

### 39.5 When NOT to Use Classes

Classes are not always the answer. Use the right tool:

| Situation | Use | Not |
|---|---|---|
| Pure data transfer (API response shape) | Interface / type / record | Class with methods |
| Stateless utility functions | Module-level functions | Singleton utility class |
| Configuration values | Plain object / const | Class with static fields |
| One-off transformations | Standalone function | Class with one method |
| Shared state with behavior | Class / ChangeNotifier | Global variables |

**Rule:** If a class has no state (no fields), convert it to a collection of functions. A class exists to manage state and behavior together.

### 39.6 Pre-Design Checklist

Before writing any new class:
1. What is the single responsibility of this class? (one sentence, no "and")
2. What state does it own? (if none → it should be a function)
3. What behavior does it expose? (the public API — design this first)
4. What does it depend on? (list deps — inject them, don't instantiate inside)
5. How is it tested in isolation? (if you can't answer → the design is wrong)
6. Is there already a class in this codebase that does something similar? (search first)

```
OOP DESIGN REVIEW (required before any new class):
Class name:       [name]
Responsibility:   [one sentence — no "and"]
Owns state:       [yes: list fields / no: make it functions]
Public API:       [list method signatures]
Dependencies:     [list what it needs — all injected]
Test strategy:    [mock deps, test behavior, not implementation]
```

---
