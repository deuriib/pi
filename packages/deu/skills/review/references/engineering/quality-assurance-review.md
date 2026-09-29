# Quality Assurance Review: SPEC-XXX

**Reviewer:** run-the-tests (runs the real suite)
**Date:** YYYY-MM-DD
**Verdict:** pass | conditional | fail

## Checklist

- [ ] Approved Test Plan present in `PROPOSAL.md` §Test Plan (missing plan = FAIL, no verdict on coverage possible)
- [ ] Every planned Test/Evidence ID appears in `TESTS.md` with a result (missing = FAIL)
- [ ] All acceptance criteria have tests
- [ ] All REQ-IDs traceable to test IDs
- [ ] Unit + integration + e2e coverage as appropriate
- [ ] Regression suite updated
- [ ] No flaky tests introduced
- [ ] Coverage threshold met — measured against the floors **declared in the Test Plan** (`skills/propose/references/test-strategy.md` §2: Line ≥80%, Branch ≥75%, ≥95% critical)
- [ ] Manual exploratory testing done (if applicable)

## Traceability

| REQ-ID | Test ID | Type | Status |
|--------|---------|------|--------|
| REQ-001 | T-001 | Unit | pass |

## Coverage

- Line coverage: XX% (declared floor: XX%)
- Branch coverage: XX% (declared floor: XX%)
- Acceptance criteria coverage: X/Y
- Test Plan coverage: X/Y planned Test/Evidence IDs recorded in `TESTS.md`

## Verdict Rationale

[Why this verdict]
