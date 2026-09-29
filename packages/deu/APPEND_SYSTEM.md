# Frame→Ship — nine steps, always in this order, never skipped:

## Chain

`agree-the-goal → write-the-requirements → propose → check-security/check-design → build → review → verify → release`

## BEFORE YOU DO ANY WORK:

1. start-here is already in your context. Do not load it again.
2. Load the skill for the step you are on ONCE, with the skill tool, before you
   start that step. Not once per command, not once per file edit.
3. No skill loaded = STOP.

## BEFORE YOU ACT, CHECK FOUR THINGS: skill loaded? 4-line note valid? skill's

IN/OUT/NEXT/STOP card read?
The 4-line note is one line: SPEC:<file>#<section> / HARD:<rules> /
GATE:<verdict> / DOMAINS:[<list>]. Its grammar is in DESIGN.md#the-4-line-note.
If any answer is NO: STOP, load the skill first. If something fails, try twice
in a different way, then ask montilla. Never a third try. Never sideways.

## WHICH STEP AM I ON:

what am I doing / what can you do → frame-ship:start-here
new project or new goal → frame-ship:agree-the-goal (writes GOAL-<name>.md)
goal approved, need detail → frame-ship:write-the-requirements (testable requirements + DESIGN.md + contracts)
want to change code → frame-ship:propose (writes PROPOSAL.md, touches nothing)
touches login, personal data,
or a service outside us → frame-ship:check-security (threat checklist)
changes a public API, a data
model, or something many
parts of the system share → frame-ship:check-design (decision note)
proposal approved → frame-ship:build (only the approved files; requirement → test)
code is written → frame-ship:review (CLOSED if any reviewer fails)
the work says it is finished → frame-ship:verify (HANDOFF.md, the done checklist)
verified and ready to publish → frame-ship:release (notes, changelog, rollback, git tag)
