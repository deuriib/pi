# Spec: {{FEATURE/COMPONENT}}

**ID:** SPEC-XXX (filename: `SPEC-<slug>.md` in `docs/specs/backlog/`)
**Owner:** [domain lead — per 8-domain catalogue]
**Domains-Touched:** [subset of: engineering | security | finance | legal | marketing/brand | people | revenue | automation/ops | product + data angle if applicable]
**Brief Reference:** GOAL-XXX
**Status:** draft | review | approved | implemented
**Priority:** P0 | P1 | P2
**Execution_Mode:** subagents (inherited from brief, frozen at agree-the-goal; overridden per SPEC only with CEO documented exception)

## 1. Context

[Why this spec exists. What problem does it solve? For non-code specs, describe the business outcome in plain language.]

## 2. Requirements

- REQ-001: [Specific, testable requirement — code or non-code with evidence type]
- REQ-002: [Specific, testable requirement]

## 3. Acceptance Criteria

- [ ] AC-001: [Measurable outcome + evidence location]
- [ ] AC-002: [Measurable outcome + evidence location]

## 4. Contracts & Interfaces

[API signatures, data schemas, event definitions for engineering; for other domains: document/contract/campaign/policy/workflow targets + sign-off contracts (e.g. finance owner controls, legal owner redline, marketing owner brand). Delete non-applicable, never force API shape on non-code.]

## 5. Out of Scope

[Explicitly excluded — prevents scope creep]

## 6. Dependencies

[Upstream/downstream specs, external services, domain sign-offs]

## 7. Traceability

| Requirement | Acceptance Criterion | Proposed Change | Evidence |
|-------------|---------------------|-----------------|----------|
| REQ-001 | AC-001 | PROPOSAL.md | test ID or sign-off path |

Singleton: per lane, create-if-missing else update-in-place, never suffix — one UPPER_SNAKE canonical per type (only `PROPOSAL.md`, never `PROPOSAL-*.md`).
