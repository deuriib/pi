# Test Strategy: SPEC-XXX

**Specialist / Owner:** [specialist name or role]  
**Date:** YYYY-MM-DD  
**Spec ID:** SPEC-XXX  
**Domains-Touched:** [e.g. engineering, security, data]  
**Target Version:** vX.Y.Z  

---

## 1. Directory & Path Standards

Test files must follow standard naming and directory layout conventions according to their scope and runtime level:

```
tests/
├── unit/                      # Fast, isolated tests without external I/O or network
│   ├── <module>/
│   │   └── <feature>.test.ts  # Collocated *.test.ts or *.spec.ts also permitted
├── integration/               # Multi-component interaction (DB, HTTP, message queues, adapters)
│   ├── api/
│   ├── persistence/
│   └── adapters/
├── e2e/                       # Full workflow / browser / CLI system journeys
│   └── <user-flow>.e2e.test.ts
├── contract/                  # API schema, serialization, cross-boundary contracts
│   └── <boundary>-contract.test.ts
├── architecture/              # Fitness functions, dependency hygiene, layer boundaries
│   └── fitness.test.ts
├── security/                  # STRIDE regression, auth boundaries, input sanitization, SAST
│   └── <vulnerability-or-threat>.security.test.ts
├── performance/               # Benchmarks, latency budgets, load & throughput
│   └── <scenario>.bench.ts
├── fixtures/                  # Static test data, deterministic payloads, sample envelopes
└── helpers/                   # Shared test harnesses, mock factories, memory adapters
```

### Path Conventions
- **Unit tests:** `tests/unit/<domain>/<name>.test.ts` (or collocated adjacent to implementation: `src/<domain>/<name>.test.ts`).
- **Integration tests:** `tests/integration/<domain>/<name>.integration.test.ts`.
- **E2E tests:** `tests/e2e/<flow-name>.e2e.test.ts`.
- **Non-code domain evidence:** `docs/specs/work/<domain>/evidence/` (e.g. `E-001-legal-redline.pdf`, `E-002-finance-recon.xlsx`).

---

## 2. Coverage Targets & Quality Floors

| Scope / Metric | Standard Baseline | Critical Paths (Auth, Data, Finance, PII) | Non-Code Domains |
|---|---|---|---|
| **Line Coverage** | ≥ 80% | ≥ 95% | N/A (with written justification) |
| **Branch Coverage** | ≥ 75% | ≥ 90% | N/A (with written justification) |
| **Function Coverage** | ≥ 85% | ≥ 95% | N/A (with written justification) |
| **P0 Acceptance Criteria** | 100% automated test trace | 100% automated test trace | 100% attestation/evidence trace |
| **Flaky Tests** | 0 tolerance (quarantine & root-cause) | 0 tolerance | N/A |
| **Execution Speed** | Unit suite < 30s | Unit suite < 30s | N/A |

> **Rule:** High coverage with weak assertions is prohibited. Assertions must verify boundary invariants, state transitions, and expected side-effects, not merely invocation counts.

---

## 3. Catalog of Testing Types

### 3.1 Unit Testing
- **Focus:** Single functions, pure business logic, domain entities, value objects.
- **Dependencies:** In-memory mocks, fakes, or stubs. No real disk I/O, network, or external processes.
- **Speed:** Milliseconds per test.

### 3.2 Integration Testing
- **Focus:** Interactions between two or more architectural units (e.g., repository + database, client + external API adapter, middleware pipeline).
- **Dependencies:** Ephemeral containers, local test databases, or local loopback servers.
- **Speed:** Seconds per test suite.

### 3.3 End-to-End (E2E) Testing
- **Focus:** Complete end-to-end user journeys from public boundary to database and back.
- **Dependencies:** Fully assembled application runtime or dedicated staging environment.
- **Speed:** Tens of seconds to minutes.

### 3.4 Acceptance & Behavioral Testing (BDD)
- **Focus:** Verification of user stories and business acceptance criteria using Given-When-Then phrasing.
- **Dependencies:** Directly maps to `REQ-XXX` acceptance criteria.

### 3.5 Regression Testing
- **Focus:** Verification that existing functionality, fixed defects, and previous features continue to operate without regression.
- **Dependencies:** Automated suite executed on every commit and PR.

### 3.6 Contract & Schema Testing
- **Focus:** Data transfer objects (DTOs), API schemas, protobuf/JSON schemas, and client-server wire compatibility.
- **Dependencies:** Consumer-driven contract harnesses, schema validators.

### 3.7 Security & threat checklist Verification Testing
- **Focus:** Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege.
- **Dependencies:** Fuzzers, authentication bypass suites, token expiration checks, PII leakage scanners.

### 3.8 Architectural & Fitness Testing
- **Focus:** Enforcing architectural rules (e.g. domain layer must never import infrastructure layer, no circular imports, bundle size budgets).
- **Dependencies:** AST parsers, linter rules, dependency-cruiser, arch-unit equivalents.

### 3.9 Performance, Benchmark & Load Testing
- **Focus:** Latency percentiles (p50, p95, p99), memory usage, CPU consumption under concurrency, leak detection.
- **Dependencies:** Benchmark harnesses, simulated traffic generators.

### 3.10 Refuter, Adversarial & Mutation Testing
- **Focus:** Deliberately attempting to break implementation assumptions with malformed payloads, out-of-order calls, boundary conditions, and test mutation analysis.
- **Dependencies:** Mutation testing engines, property-based testing generators (e.g. fast-check).

### 3.11 Resilience & Chaos Testing
- **Focus:** Fault tolerance, circuit breaker behavior, graceful degradation, recovery after panic, network partition handling.
- **Dependencies:** Injected network faults, killed sub-processes, simulated downstream timeouts.

### 3.12 Smoke & Synthetic Health Testing
- **Focus:** Post-deployment verification that core endpoints and critical runtimes respond correctly in staging or production.
- **Dependencies:** Live deployment environment, non-destructive synthetic probes.

### 3.13 Non-Code Domain Evidence & Attestations
- **Focus:** Verification for business domains (finance, legal, marketing, people, ops, revenue).
- **Dependencies:** Documented redlines, signed reconciliation reports, campaign approvals, regulatory filings.

---

## 4. Frame→Ship Fit — Who Owns What

This file is owned by `propose` (producer: the Test Plan section of `PROPOSAL.md`). Consumers cite it by reference; the chain itself is canonical in `../../AGENTS.md` — never restated here.

| Obligation | Stage | File |
|---|---|---|
| Test plan + declared floors (**produced, approved before any code**) | `propose` | `docs/specs/work/<domain>/PROPOSAL.md` §Test Plan |
| Test/evidence **execution** against the approved plan (TDD: failing test first) | `build` | `docs/specs/work/<domain>/TESTS.md` via `../../build/references/test-matrix.md` |
| Independent **verification** of plan vs results, floors met, zero flakes | `review` | `../../review/references/engineering/run-the-tests-review.md` |
| **the done checklist** — confirming the evidence links before the hand-off | `verify` | `../../verify/references/done-checklist.md` |
| Smoke, synthetic probes, rollback drill | `release` | `../../release/references/release-notes.md` |

- **`fix-a-bug`**: triggered on failure/defect — writes a failing reproduction test *before* proposing any fix; the plan is then updated through `propose`, never edited at the implementation stage.
- **`open-a-pull-request`**: validates CI test automation, linting/typechecks, and the test-to-code review budget.
- **Isolated lanes** (`../../build/references/worktree-annex.md`): run parallel test suites in segregated worktrees (`.worktrees/<spec-id>`, max 2) without cross-lane pollution.

---

## 5. Test Plan Rules

The plan is a **required section** of `PROPOSAL.md` (shape in `proposal-template.md` §Test Plan); this file owns its standard. A proposal without a plan is not approvable.

- **Every REQ-ID gets ≥ 1 Test ID (code) or ≥ 1 Evidence ID (non-code)** — the same obligation for all 9 domains.
- **Paths come from §1**, types from §3, floors from §2. Non-code domains record `N/A with written justification` for the coverage rows and an file path instead.
- **Positive and negative cases are planned, not discovered**: every REQ-ID declares its boundary check, its invalid-input case, and its edge cases up front.
- **The plan is frozen at approval.** Execution records results in `TESTS.md`; adding a test type or lowering a floor is a proposal amendment, not an execute-stage decision.
- **Environment and setup** (prerequisites, env vars, cleanup/isolation) are declared for every test lane that needs them.

---

## 6. Plan & Verification Checklist

Checked when the plan is proposed and again by the gate reviewers:

- [ ] All test files planned under canonical directories (`tests/unit`, `tests/integration`, etc.).
- [ ] Every requirement ID (`REQ-XXX`) has at least one corresponding Test ID (`T-XXX`) or Evidence ID (`E-XXX`).
- [ ] Assertions planned are real invariant checks (no empty mocks, no skipped tests, no invocation-count-only tests).
- [ ] Declared coverage floors meet or exceed §2 baselines (Line ≥80%, Branch ≥75%, Critical ≥95%).
- [ ] Negative test cases planned (invalid inputs, network timeouts, unauthorized access).
- [ ] Edge cases planned (empty arrays, boundary numbers, null/undefined inputs).
- [ ] Determinism planned: isolated state, no shared mutable singletons, no `sleep()` — condition-based waiting with deadlines only.
- [ ] Test environment + cleanup declared for every lane that needs it.
