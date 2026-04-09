---
name: blink-test-auditor
description: >
  Audits slide content for cognitive load and instant readability using the "blink test" — can a viewer grasp the slide's message in under 3 seconds? Use this skill whenever a user wants to review, audit, score, or improve presentation slides, decks, or any markdown/text content intended for slides. Also trigger when the user mentions "slide density", "too much text", "cognitive load", "3-second rule", "deck review", or asks if a slide is "too wordy" or "hard to read". Always use this skill for slide content reviews even if the user just pastes text and says "does this work for a slide?"
---

# Blink Test Auditor

Evaluates slide content for instant readability. Goal: a viewer should grasp the core message in **under 3 seconds**.

---

## Evaluation Criteria

Apply all four checks. A single failure = overall **Fail**.

### 1. Header Hook (1 H2 max)
- The slide must have exactly one `##` header.
- It must function as a "hook" — a clear, specific claim or question.
- ❌ Fail if: no header, multiple headers, or vague header (e.g., *"Overview"*, *"Summary"*).

### 2. The 3-3-3 Rule
- Max **3 bullet points** per slide.
- Max **3 lines of text** per bullet.
- Max **3 levels of nesting** (prefer 1–2).
- ❌ Fail if any bullet exceeds 3 lines, or if there are 4+ bullets.

### 3. Hierarchy & Scannability
- Content must have visual rhythm: header → bullets or header → short paragraph.
- A wall of uniform text (no whitespace, no bold, no structure) automatically fails.
- ❌ Fail if there is no clear visual hierarchy.

### 4. Token Density Check
- Mentally estimate: would it take more than ~100 tokens to *describe* this slide's content? If yes, it's too dense.
- ❌ Fail if the slide requires "deep reading" to extract the message.

---

## Output Format

```
## Blink Test Result

**Grade:** Pass ✅  /  Fail ❌

**Checks:**
- Header Hook: Pass / Fail — [one-line reason]
- 3-3-3 Rule: Pass / Fail — [one-line reason]
- Hierarchy: Pass / Fail — [one-line reason]
- Density: Pass / Fail — [one-line reason]

**Verdict:** [1–2 sentences explaining the overall assessment]
```

For **Fail** grades, always append a **Blink-Ready Rewrite**:

```
## Blink-Ready Rewrite

[Rewritten slide content that passes all four checks.
Preserve the core message. Slash word count ruthlessly.
Use bold for the 1–2 most critical words per bullet.]
```

---

## Tips for Rewrites

- Cut hedging language: *"It is worth noting that..."* → delete entirely.
- Convert paragraphs to 3–5 word bullets with a bold anchor word.
- Replace vague hooks with concrete claims: *"Q3 Results"* → *"Q3 Revenue Up 18%"*.
- If a slide has two ideas, split it — don't compress.
