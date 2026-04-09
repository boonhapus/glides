---
name: signal-to-noise-refiner
description: >
  Edits text to maximize signal (meaningful content and data) while eliminating noise (filler phrases, passive voice, redundant formatting, and fluff). Use this skill whenever a user wants to tighten writing, remove filler words, make copy more punchy or scannable, or asks to "clean up", "sharpen", "trim", or "refine" any text. Also trigger for requests like "make this more concise", "cut the fluff", "make it more direct", "less corporate speak", or any editing task focused on clarity and brevity. Works well on slide bullets, executive summaries, reports, emails, and any professional writing. Always use this skill when the goal is reduction and clarity, even if the user just says "can you make this better?"
---

# Signal-to-Noise Refiner

Maximizes **Signal** (meaningful data and insight) by eliminating **Noise** (filler, passive voice, redundant formatting, and throat-clearing phrases).

---

## Editing Rules

Apply all rules in sequence.

### Rule 1 — Strip Unnecessary Articles from Headers
Remove *a*, *an*, *the* from headers and titles where meaning is preserved.
- ❌ *"The Results of the Analysis"* → ✅ *"Analysis Results"*
- ❌ *"An Overview of the Strategy"* → ✅ *"Strategy Overview"*

### Rule 2 — Activate Passive Descriptions
Replace weak, passive constructions with active, data-forward language.
- ❌ *"We saw growth in Q3"* → ✅ *"Q3 growth reached 18%"*
- ❌ *"There was a reduction in churn"* → ✅ *"Churn dropped 12 points"*
- If no specific data exists, use a strong active verb: *"Churn fell significantly"*.

### Rule 3 — Bold for Scan
In every list item, **bold** the 1–2 most critical words — the ones a skimmer must not miss.
- Apply to bullets, numbered lists, and table rows.
- Do not bold entire sentences; surgical bolding only.

### Rule 4 — Delete Fluff Phrases
Remove these categories entirely. Do not replace — just cut:

| Category | Examples |
|---|---|
| Throat-clearing | *"It is important to note that..."*, *"In this section, we will..."* |
| Redundant transitions | *"With that in mind..."*, *"As mentioned above..."* |
| Hedging inflation | *"sort of"*, *"kind of"*, *"in some ways"*, *"arguably"* |
| Meta-commentary | *"This is a complex topic..."*, *"There are many factors..."* |

---

## Output Format

```
### Original
[Paste original text here]

---

### High-Signal Version
[Edited text here]

---

### Noise Reduction
- Characters removed: [N]
- Noise Reduction: [X]%
- Key changes: [bullet list of the most impactful edits made]
```

**Calculate Noise Reduction %:**
`((original_char_count - revised_char_count) / original_char_count) × 100`

Round to the nearest whole number.

---

## Quality Bar

A good pass achieves **20–40% noise reduction** without losing meaning. 

- **< 15%** — The original was already tight, or the edit was too conservative. Note this.
- **> 50%** — Double-check that no signal was accidentally cut.

If the user provides multiple blocks (e.g., a full slide deck or document), process each block separately and provide a **combined total** noise reduction at the end.
