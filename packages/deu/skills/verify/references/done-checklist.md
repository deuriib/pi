# the done checklist: SPEC-XXX

**Verifier:** [agent]
**Date:** YYYY-MM-DD
**Domains-Touched:** [per spec]

## Common (all 9 domains)

- [ ] All acceptance criteria met
- [ ] All REQ-IDs have linked evidence (link present AND resolves AND relevant; attestation-alone = FAIL; missing link = FAIL; dead/irrelevant link = FAIL with recorded reviewer-judgment reason; no handoff. Demo: `docs/specs/work/security/SAMPLE-grilling-C4-deadlink-FAIL.md`)
- [ ] C4 FAIL lists `risk left over + owner` (security lane; silent PASS = FAIL)
- [ ] Edge cases / failure modes handled
- [ ] Gate OPEN (or CONDITIONAL conditions cleared + documented exception recorded if applicable)
- [ ] Load evidence: stage skill + handed the work agent template cited (paths), execution_mode declared: `subagents`, 4-line note intact — missing = FAIL, no handoff
- [ ] Docs/changelog updated for user-facing impact

## Engineering (engineering owner — only if engineering-touched)

- [ ] Lint passes with zero warnings
- [ ] Type checks pass
- [ ] Test coverage meets the floors declared in `PROPOSAL.md` §Test Plan (`skills/propose/references/test-strategy.md` §2)
- [ ] Every Test/Evidence ID in the approved Test Plan has a recorded result in `TESTS.md`
- [ ] No TODO/FIXME left in code

## Security (security owner — only if security-touched)

- [ ] Security review conditions met
- [ ] No secrets in code/config/logs/examples
- [ ] Input validation at all boundaries

## Domain appendix (only touched domains)

- [ ] Finance (finance owner): budget/controls/audit-trail signed
- [ ] Legal (legal owner): redline/IP/regulatory/liability signed, filing proof attached if applicable
- [ ] Marketing (marketing owner): brand/copy/GTM sign-off, launch-readiness checked if external-facing
- [ ] People (people owner): impact/skills/change-plan signed, comms sent if required
- [ ] Revenue (revenue owner): pipeline/quota/forecast check signed, GTM handoff to marketing owner confirmed
- [ ] Automation/ops (automation owner + engineering owner): workflow tested, rollback/runbook/monitoring/flags checked
- [ ] Data angle (engineering owner): lineage/schema/migration/backfill + PII handling signed if applicable

## Documentation

- [ ] API docs updated (engineering) OR domain file filed in agreed location
- [ ] Changelog entry added (or N/A with justification for internal-only non-code)
- [ ] DECISION written if architecture contract changed
