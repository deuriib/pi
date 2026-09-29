---
name: start-here
description: "Explains the nine steps and the rules that hold in all of them. Use when a session starts, after the conversation gets shortened, or when someone asks what this does. Triggered by \"what can you do\", \"how does this work\", or session start."
---

# Start here — the nine steps and the rules

> _"Haces las cosas como para Dios, por eso trabajas con excelencia, dedicación y minimalista."_

## 1. Why this exists

To make the nine steps work from the very first message. This skill is the
bootstrap. It explains that skills load on their own, gives the order of the
steps, and says which skill owns which kind of work.

It produces nothing. No goals, no requirements, no code. It only points.

## 2. Contract

- **IN** — the session started, or the conversation got shorter, or someone
  asked what this does. Nothing else.
- **OUT** — nothing written. You now know the order and which skill owns what.
- **NEXT** — `frame-ship:agree-the-goal` for something new. Any other kind of
  work goes to its own skill.
- **STOP** — you did not load a step skill yet. Stop. Never load this skill
  again through the skill tool; it is already in your context.

```text
frame-ship:start-here (this one) → frame-ship:agree-the-goal
  → frame-ship:write-the-requirements → frame-ship:propose
  → frame-ship:check-security / frame-ship:check-design → frame-ship:build
  → frame-ship:review → frame-ship:verify → frame-ship:release
```

## 2b. Who does what

This skill binds behaviour, not a role. Whoever is running holds it.

One owner per step, never the same person as the worker:

- `orchestrator` owns goals and releases, and is the only one who hands work to
  the rest of the team.
- `vasquez` (engineering) owns design verdicts.
- `barrera` (security) owns security verdicts.
- A specialist never hands work to anyone and never approves their own
  proposal.

## 3. What to do

**0. The load order. Do not break it.**

   1. This skill is already in your context. Never load it again.
   2. Load the skill for the step you are on, once, at the start of that step,
      before doing that step's work. Not once per command, not once per edit.
      **No skill loaded = STOP.**
   3. Understand which role you are playing, and which step skill goes with it.
      Say the path in your output.
   4. Before acting, check: skill loaded? 4-line note valid? IN/OUT/NEXT/STOP
      card read? Any NO means stop and load the skill. Something failed? Try
      twice in a different way, then ask `orchestrator`. Never a third try,
      never sideways.

   Outside skills, if the task matches one: load them **after** the step skill,
   at most 1 or 2. The nine steps win any conflict — an outside skill never
   skips a hard rule, a review, or the load order. Cite them by path and
   section, never paste them whole.

**1. Look for the right skill before doing anything.** These are not
suggestions. Load the step's skill through the skill tool before you act.

**2. Pick the step by what the task looks like — never by guessing.**

   | The task | Load |
   | --- | --- |
   | new project, new goal, "what are we building" | `frame-ship:agree-the-goal` |
   | the goal is approved, need it spelled out | `frame-ship:write-the-requirements` |
   | want to change code, needs a yes first | `frame-ship:propose` |
   | touches login, personal data, or an outside service | `frame-ship:check-security` |
   | changes a public API, a data model, or something many parts share | `frame-ship:check-design` |
   | the proposal is approved, time to write it | `frame-ship:build` |
   | the code is written, wants checking | `frame-ship:review` |
   | the work says it is done, wants a second look | `frame-ship:verify` |
   | it is verified, wants to go out | `frame-ship:release` |
   | a bug, a failing test, something unexpected | `frame-ship:fix-a-bug` |
   | a branch, a pull request, ready for review | `frame-ship:open-a-pull-request` |
   | two areas in parallel, at most | `frame-ship:build` + its `references/worktree-annex.md` |

**3. Hold the hard rules on every step.** The full list is in
`references/bootstrap-checklist.md`. In short: no code before the proposal is
approved (or before an outside send, filing, or launch, for non-code work); a
security check for login, personal data, and outside services; a decision note
for contract changes; nothing handed off while a review is CLOSED without a
written exception from the domain leads and `orchestrator`; every requirement
traced to a test, a file, and a verdict; `HANDOFF.md` before a release; and
4-line notes between steps, never pasted files.

   Work is handed to subagents: `orchestrator` hands to everyone, a lead
   only inside its own domain, a specialist to nobody. At most 2 areas at a time.
   Trivial reversible work — under about 15 lines — is the CEO shortcut, outside
   the nine steps, and never a branch in the chain.

   If the tool you are running cannot hand off work, do the same steps in the
   same thread, one after the other. Same 4-line note, same reviewers, same
   review every time. No smaller review. No quiet downgrade.

   Every prompt you hand out must say, in this order: understand the area
   before acting; accept the task by reference; give back the work, the risks,
   the assumptions, and proof scoped to what was asked. Need another domain? Write
   a request and give it to `orchestrator`, who decides.

**4. If the conversation got shortened, load this skill again first**, then
pick up at the step you were on, with your trace and your verdicts intact.

## 4. What I won't do

- Write goals, requirements, proposals, code, or releases. Those belong to the
  step skills.
- Skip a step, or approve my own work.
- Paste whole files between steps. Paths only.

## 5. References

- `references/bootstrap-checklist.md` — what to check when a session starts and
  after the conversation gets shortened.
- `references/challenge-round.md` — the optional "ask me hard questions" round.
  `agree-the-goal`, `propose`, `review`, and `verify` all point at it.
