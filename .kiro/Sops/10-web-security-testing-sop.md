# WEB SECURITY TESTING & PRE-LAUNCH SOP — "The Last Gate Before the Internet"
# Cross-Cutting Layer — applies before any project built under this SOP
# series goes live, regardless of which roles built it
# Version: 2026
# Philosophy: Every other SOP in this series builds in security discipline as
#             it goes (Backend's auth checks, DevOps's secrets management,
#             DBA's constraints). This SOP is the final, independent check
#             that those individual pieces actually hold together as a whole
#             — because a system can follow every per-role rule perfectly and
#             still have a gap at the seams between roles.

---

## 0. IDENTITY & MANDATE

This SOP is the **final gate** before a project is exposed to the public
internet. It doesn't replace any role's own security rules — it independently
verifies them, as a whole system, the way an attacker would actually
encounter it: from the outside, with no inside knowledge of which role built
what.

**This layer owns:**
- Testing the live (or staging) system against the OWASP Top 10 categories
- Verifying security headers, TLS configuration, and secrets exposure from
  the outside
- Dependency/supply-chain vulnerability scanning
- Authentication, session, and rate-limiting verification
- A go/no-go gate before production hosting

**This layer does NOT own:**
- Fixing the underlying issue — a finding here routes back to the owning
  role (an IDOR routes to Backend, a missing security header might route to
  DevOps, a schema-level exposure to DBA)
- Testing or scanning anything the user doesn't own or isn't explicitly
  authorized to test — see Hard Rule 1, which overrides everything else in
  this document

---

## 1. HARD RULES — NEVER VIOLATE

1. **Only test systems you own or have explicit, documented authorization to
   test.** Scanning, probing, or attempting to exploit a system you don't
   control — even "just checking," even with good intentions — can be
   illegal regardless of intent, in most jurisdictions (e.g. under laws like
   the US Computer Fraud and Abuse Act). This rule overrides every other
   instruction in this document. If authorization is unclear, stop and
   confirm before testing anything beyond your own project.
2. **Never go live without running through the full checklist in §4 at least
   once**, on a staging environment that mirrors production.
3. **Never ship with a known critical or high-severity finding unaddressed**
   unless the risk is explicitly accepted in writing, by the person
   responsible for the decision — matches the Architect SOP's risk-register
   pattern (Architect SOP §9) applied at the security layer.
4. **Never test only with valid, well-formed input.** Every entry point gets
   tested with malformed, boundary, and deliberately malicious input — this
   is where real vulnerabilities actually live, not in the happy path.
5. **Never treat "the automated scanner passed" as proof of security.**
   Automated tools catch known patterns; they do not catch business-logic
   abuse (negative quantities, race conditions, workflow bypass) — manual
   review of anything money/permission/identity-related is still required.
6. **Never test against production with real user data** if a staging
   environment with equivalent configuration is available — testing itself
   can have side effects (data corruption, triggered alerts, rate-limit trips).
7. **Never leave a test/staging environment with weaker security than
   production** if it holds anything resembling real user data — a "just for
   testing" environment is a common real-world breach entry point precisely
   because it's treated as lower-stakes.

---

## 2. BEFORE TESTING ANYTHING

### 2.1 Required inputs
1. Explicit confirmation this is your own system, or written authorization
   to test it (Hard Rule 1) — do not proceed without this
2. A complete list of entry points: every API endpoint, form, auth flow,
   file upload, admin interface, webhook, and third-party integration
3. Which environment is being tested — staging strongly preferred over
   production (Hard Rule 6)
4. The tech stack and dependency manifest (`package.json`, `requirements.txt`,
   etc.) for the supply-chain check (§4.6)

### 2.2 Scope boundary
State explicitly what's in scope (this project's own infrastructure and
code) and what's out of scope (any third-party service it integrates with —
you don't have authorization to test their systems just because your app
calls their API).

---

## 3. REQUIRED DELIVERABLES

| Artifact | Purpose | Minimum content |
|---|---|---|
| Security test report | Record of what was checked | Every §4 category, pass/fail/N-A per item |
| Dependency scan results | Supply-chain visibility | Known CVEs by severity, remediation status |
| Security headers report | External-facing config check | Each required header, present or missing |
| TLS/SSL configuration report | Transport security | Protocol versions, cipher strength, cert validity |
| Remediation list | What needs fixing before launch | Prioritized by severity, owning role assigned |
| Go-live sign-off | The actual gate | Confirmation every critical/high item is resolved or explicitly accepted |

---

## 4. OWASP-ALIGNED TESTING CHECKLIST

### 4.1 Broken access control
- Test IDOR directly: can resource A be accessed/modified by a user who
  doesn't own it, by changing an ID in the request? (matches Backend SOP §6.2
  — this independently re-verifies that rule actually holds in the deployed system)
- Test forced browsing to admin/internal paths without the right role
- Test privilege escalation: can a regular user reach an admin-only action
  by calling the endpoint directly, bypassing a UI that merely hides the button?

### 4.2 Cryptographic failures
- TLS configuration graded independently (e.g. via SSL Labs or equivalent) —
  no deprecated protocol versions (SSLv3, TLS 1.0/1.1), no weak ciphers
- Confirm sensitive data is actually encrypted at rest where the DBA SOP's
  NFRs require it (§9.2 of the DBA SOP), not just assumed to be
- Confirm certificates are valid, not self-signed or expired, on anything
  public-facing

### 4.3 Injection
- Test every input field/parameter with standard injection probes (SQL
  injection patterns, script-tag payloads for XSS) to confirm parameterized
  queries (Backend SOP §8.2) and output encoding (Frontend SOP Hard Rule 4)
  actually hold in the deployed system — this is testing your own system
  defensively, confirming the existing rules weren't silently bypassed
  somewhere, not an offensive exercise against anyone else

### 4.4 Insecure design / business logic
- Test abuse cases specific to the application's actual logic: negative
  quantities, applying the same coupon twice, racing a request to bypass a
  one-time action (matches DBA SOP §7.2's race condition checklist,
  re-verified from the outside)
- These are the findings automated scanners miss entirely (Hard Rule 5) —
  they require understanding what the application is supposed to do, then
  trying to make it do something else

### 4.5 Security misconfiguration
- Check for exposed `.env` files, `.git` directories, or debug/admin
  endpoints reachable without authentication
- Confirm verbose error messages/stack traces are not shown to end users in
  production (should show a generic error, log the detail server-side —
  matches Backend SOP's error handling discipline)
- Confirm directory listing is disabled on any static file server
- Confirm required security headers are present (§5)

### 4.6 Vulnerable and outdated components
- Run a dependency audit (`npm audit`, `pip-audit`, `safety`, or the
  equivalent for the stack) and review every critical/high finding
- Confirm no unused or abandoned dependencies remain in the manifest —
  smaller surface area, fewer things to patch

### 4.7 Authentication failures
- Confirm rate limiting / account lockout exists on login and password-reset
  endpoints — brute-force without it is trivial
- Confirm session tokens are set with `httpOnly`, `Secure`, and an
  appropriate `SameSite` attribute
- Confirm logout actually invalidates the session server-side, not just
  clears the client-side token
- Confirm password requirements and hashing match DBA SOP §9.2 (bcrypt/
  argon2/scrypt, never reversible encryption)

### 4.8 Software and data integrity
- Confirm the CI/CD pipeline doesn't give an externally-triggered build
  direct production credential access without a human approval gate
  (DevOps SOP §5.2, re-verified)
- Confirm no insecure deserialization of untrusted data anywhere in the request path

### 4.9 Logging and monitoring
- Confirm security-relevant events (failed logins, permission denials,
  admin actions) are actually logged (matches DevOps SOP §8.2) — and that
  logs don't themselves leak secrets or PII

### 4.10 Server-side request forgery (SSRF)
- Any feature where the server fetches a user-supplied URL (webhook
  registration, "fetch image from URL," link preview) is tested for SSRF: can
  it be pointed at an internal/private IP range or cloud metadata endpoint?
  Confirm the server validates/restricts the destination rather than blindly
  fetching whatever URL it's given

---

## 5. SECURITY HEADERS CHECKLIST

| Header | Purpose |
|---|---|
| `Content-Security-Policy` | Restricts what scripts/resources can load, mitigates XSS impact |
| `Strict-Transport-Security` (HSTS) | Forces HTTPS, prevents protocol-downgrade attacks |
| `X-Content-Type-Options: nosniff` | Prevents MIME-type sniffing attacks |
| `X-Frame-Options` / `frame-ancestors` | Prevents clickjacking via iframe embedding |
| `Referrer-Policy` | Controls what's leaked to external sites via the referrer |
| `Permissions-Policy` | Restricts browser feature access (camera, geolocation, etc.) |

Check with an external header-analysis tool rather than trusting that a
framework default is sufficient — framework defaults vary and change between
versions.

---

## 6. ANTI-PATTERNS — REJECT ON SIGHT

| Anti-pattern | Why it's rejected | What to do instead |
|---|---|---|
| Testing in production with real user data | Risk of corrupting real data or triggering real side effects | Test on staging with equivalent config (Hard Rule 6) |
| Treating "automated scan passed" as a complete audit | Misses business-logic abuse entirely | Manual review of logic-heavy flows (§4.4, Hard Rule 5) |
| Launching with a known critical finding "for now" | "For now" becomes the permanent state once it's live | Fix it, or get an explicit written risk acceptance (Hard Rule 3) |
| No rate limiting on login/password reset | Trivial brute-force target | Rate limiting + lockout required (§4.7) |
| Verbose stack traces shown to end users in production | Leaks internals that help an attacker, looks unprofessional | Generic user-facing error, detailed server-side log only |
| Secrets/API keys visible in client-side bundle | Anything shipped to the browser is public (Frontend SOP §10) | Never ship server-side secrets to the client |
| Staging environment with production data but weaker security | Common real-world breach entry point | Equivalent security baseline on any environment holding real data (Hard Rule 7) |

---

## 7. GO-LIVE REVIEW GATE

```
GO-LIVE SECURITY GATE (mandatory before hosting publicly):

1. Every §4 OWASP category has been tested, with results recorded
2. No critical/high-severity finding remains unaddressed and unaccepted
3. Security headers (§5) confirmed present via external check, not assumed
4. TLS configuration independently graded, no deprecated protocols/ciphers
5. Dependency scan run, critical/high CVEs resolved or explicitly accepted
6. Rate limiting confirmed on auth endpoints
7. No secrets/debug endpoints/verbose errors exposed externally
8. Logging captures security-relevant events without leaking secrets/PII
9. Business-logic abuse cases manually tested, not just automated-scanned
10. Staging environment security matches production if it holds real data
```

If any item fails, do not launch — state which item and what's needed, and
route the fix to the owning role.

---

## 8. CHANGE MANAGEMENT — RE-TEST TRIGGERS

Re-run the relevant portion of this checklist (not necessarily the whole
thing) when:
- A new entry point is added (new endpoint, new form, new integration)
- Authentication/authorization logic changes
- A new third-party dependency is added
- Infrastructure configuration changes (new exposed port, new public service)

A security review done once at initial launch and never repeated is a
snapshot of a system that no longer exists by the time it matters.

---

## 9. DOCUMENTATION

- `SECURITY.md` — what was tested, when, findings and remediation status;
  how to report a vulnerability if someone external finds one
- Test report archive — kept per the Process Log SOP's dated structure, so
  "when did we last check this" has an actual answer

---

## 10. LIGHTWEIGHT MODE — DOES NOT FULLY APPLY HERE

Even a weekend prototype, if it's going to be reachable on the public
internet at all (not just `localhost`), keeps these without compression:
- Hard Rule 1 (authorization) — always, no exception, ever
- No secrets in code/client bundle
- Basic security headers and valid TLS
- Rate limiting on any auth endpoint that's actually live

What can compress for a genuinely low-stakes prototype: the full OWASP
checklist depth (§4) can be a quick pass rather than an exhaustive one, and
formal reporting (§3) can be a short note instead of a full report — but
state explicitly that a lightweight pass was done, not a full one, so nobody
mistakes it for a completed security review later.

---

## 11. PUSHBACK PROTOCOL

Push back, in writing, when:
- Asked to launch skipping this gate entirely "just to hit a deadline" —
  name the specific exposure this creates, then proceed only if explicitly accepted
- Asked to test a system without clear ownership/authorization confirmed —
  stop and get that confirmed first (Hard Rule 1), don't proceed on an assumption
- A critical finding is discovered and the instinct is to launch anyway —
  state it plainly as a risk decision for the responsible person to make, not
  something to quietly work around

---

## 12. QUICK REFERENCE — GO-LIVE CHECKLIST

- [ ] Authorization confirmed — only testing systems you own (Hard Rule 1)
- [ ] All OWASP categories (§4) tested on staging, results recorded
- [ ] Security headers confirmed present via external check
- [ ] TLS graded independently, no deprecated protocols/ciphers
- [ ] Dependency scan run, critical/high CVEs resolved or accepted
- [ ] Rate limiting confirmed on auth endpoints
- [ ] No exposed secrets, debug endpoints, or verbose production errors
- [ ] Business-logic abuse cases manually tested, not just automated
- [ ] No unaddressed critical/high finding without explicit written acceptance
- [ ] Lightweight Mode usage (if any) stated explicitly, not assumed as full review

---

*This SOP is the final independent check before a project built under this
series goes live. It re-verifies, from the outside, that the individual
security rules scattered across the Architect, DBA, Backend, Frontend, UI/UX,
and DevOps SOPs actually held together as a whole system — because gaps live
at the seams between roles, not usually inside any single role's own careful work.*
