---
name: writing-review
description: "Proofread and fix spelling, grammar, phrasing, and context errors in text files. Use when: checking spelling, fixing typos, correcting grammar, reviewing writing quality, improving phrasing, verifying context accuracy, editing documentation, polishing copy, reviewing HTML content text, proofreading Markdown."
argument-hint: "Provide a file path or paste text to review and fix"
---

# Writing Review

Proofread files for spelling, grammar, phrasing, and contextual errors — then fix them.

## When to Use

- Reviewing any text-heavy file (`.html`, `.md`, `.txt`) for errors before publishing
- Fixing spelling mistakes and typos across workspace files
- Checking that sentences read clearly and use correct grammar
- Verifying content is internally consistent (no contradictions, broken references, or out-of-place statements)
- Polishing documentation, README files, or website copy

## Procedure

### 1. Identify Target

Determine what to review:
- A single file the user points to
- A block of pasted text
- Multiple files matching a pattern (e.g., all `.html` pages)

Read the full content of each target file before making any judgments.

### 2. Scan — Spelling

Check every word against standard English spelling. Flag:
- Misspelled words (`recieve` → `receive`)
- Transpositions (`teh` → `the`)
- Homophone misuse (`their`/`there`/`they're`, `its`/`it's`)
- Double words (`the the`)

**Skip**: brand names, technical terms, variable names, code blocks, URLs, HTML tags, CSS classes.

### 3. Scan — Grammar

Check sentence structure. Flag:
- Subject-verb disagreement (`The team are` → `The team is`)
- Tense inconsistency within a paragraph
- Missing or misplaced punctuation (commas, periods, apostrophes)
- Sentence fragments and run-on sentences
- Incorrect article usage (`a` vs `an`)

### 4. Scan — Phrasing

Check readability and conciseness. Flag:
- Redundant phrases (`in order to` → `to`, `at this point in time` → `now`)
- Awkward or ambiguous wording
- Passive voice where active is clearer (only when it genuinely improves readability)
- Unnecessarily complex vocabulary where simpler words suffice

### 5. Scan — Context

Check logical consistency. Flag:
- Statements that contradict each other within the same document
- References to sections, links, or anchors that don't exist
- Claims that don't fit the surrounding content
- Inconsistent naming (same thing called different names in different places)

### 6. Report Findings

Present a summary table of all issues found:

| # | Category | Location | Issue | Fix |
|---|----------|----------|-------|-----|
| 1 | Spelling | Line X | "recieve" | "receive" |
| 2 | Grammar | Line Y | missing comma | added comma |
| 3 | Phrasing | Line Z | "in order to" | "to" |
| 4 | Context | Line W | contradicts paragraph above | flagged for user |

### 7. Apply Fixes

- Apply all clear-cut corrections (spelling, grammar) directly to the file
- For phrasing improvements, apply only when the improvement is unambiguous
- For context issues, flag them and ask the user — do not guess at intent
- After applying, re-read changed sections to verify no new errors were introduced

### 8. Verify

- Confirm total count of fixes applied vs. issues flagged for review
- Re-scan changed areas to ensure fixes didn't introduce regressions

## Rules

- **Preserve meaning** — Never change what the author intended to say
- **Preserve tone** — Match the existing voice (formal, casual, technical)
- **Preserve code** — Never modify content inside `<code>`, `<pre>`, backtick blocks, or HTML attributes
- **Preserve names** — Brand names, product names, and proper nouns are not spelling errors unless clearly wrong
- **When uncertain, ask** — If a word could be intentional (e.g., a coined term), flag it instead of changing it
