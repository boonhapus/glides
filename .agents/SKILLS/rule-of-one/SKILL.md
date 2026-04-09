---
name: rule-of-one
description: Transforms dense prose or Markdown into presentation-ready slide content using the "Rule of One" principle — one idea, one headline, one takeaway per slide. Use this skill whenever a user wants to convert an article, report, notes, or any text into slides, a deck, or a presentation. Also trigger when the user asks to "make this presentation-ready", "break this into slides", "turn this into a deck", "clean up my slides", or wants to apply the Rule of One to any content. Even if the user just pastes a block of text and says "can you make slides from this?" — use this skill.
---

# Rule of One — Slide Transformation

Converts dense prose or Markdown into structured, presentation-ready slide content by enforcing one constraint above all: **one idea per slide**.

---

## Core Rules

### 1. One Idea Per Slide
Every slide has a single central concept. If a section contains multiple distinct ideas, **split it into multiple slides** — don't compress.

### 2. Statement Headlines, Not Topic Labels
Transform passive headers into active, specific statements:
- ❌ "Results" → ✅ "Revenue Grew 20% YoY"
- ❌ "Challenges" → ✅ "Supply Chain Delays Cost Us 6 Weeks"
- ❌ "Recommendation" → ✅ "Switch to a Subsidized Leasing Model"

### 3. The 15-Word Cap
No bullet point exceeds 15 words. If it does, cut or split it.

### 4. Bold the Power Word
Bold **one keyword or phrase per bullet** — the thing the audience must remember. Don't bold everything.

### 5. 3–5 Bullets Max
No prose. No paragraphs. Each slide gets 3–5 tight bullets — no more.

### 6. Strip Filler
Remove: "In addition to," "It is worth noting that," "Basically," "As we can see," "Furthermore," and all similar padding.

---

## Slide Separators

Use `---` (horizontal rule) before and after every slide to define hard boundaries.

```
---
## Headline Here
* Bullet one with **key term** bolded.
* Bullet two with **key term** bolded.
---
```

---

## Visual Placeholders

If a slide describes data, trends, comparisons, or complex systems, add a placeholder on its own line:

```
![Visual: Line chart showing cost reduction 2015–2024]
![Visual: Before/after comparison table]
![Visual: Org chart or system diagram]
```

Use a short, descriptive label. Don't leave data-heavy slides without one.

---

## Final Slide Rule

The last slide in any sequence must end with either:
- A **"Key Takeaway:"** bullet summarizing the single most important point, or
- A **"Next Step:"** bullet with a clear, specific action.

---

## Transformation Workflow

When given content to transform:

1. **Read the full input** before writing any slides.
2. **Identify distinct ideas** — each becomes its own slide.
3. **Write a statement headline** for each slide.
4. **Convert prose to bullets** — 3–5 per slide, 15 words max each.
5. **Bold one keyword per bullet.**
6. **Add visual placeholders** where data or complexity warrants it.
7. **End with a Key Takeaway or Next Step slide.**
8. **Wrap every slide in `---` separators.**

---

## Examples

### Input
> "Our research into the renewable energy sector shows that solar costs have dropped significantly over the last decade. This makes it more viable for residential areas, though the initial installation cost remains a barrier for many low-income households. We recommend a subsidized leasing model to solve this."

### Output

```
---
## Solar Costs Have Plunged
* Costs have **dropped significantly** over the past decade.
* Residential solar is now **economically viable** at scale.
![Visual: Line graph — solar cost per kWh, 2014–2024]
---

---
## The Price Barrier Remains Real
* **Upfront installation costs** are the #1 adoption obstacle.
* Low-income households remain **effectively excluded**.
---

---
## The Fix: Subsidized Leasing
* Implement a **subsidized leasing model** to remove upfront cost.
* **Key Takeaway:** Accessibility, not technology, is the remaining challenge.
---
```

---

## Edge Cases

| Situation | Action |
|-----------|--------|
| Slide has only one idea but lots of detail | Pick the 3 most important details; cut the rest |
| Two ideas feel inseparable | Ask: "Could someone present these separately?" If yes, split them |
| No clear final action | Synthesize one from the content — don't leave it off |
| Input is already bulleted | Rewrite headlines as statements; enforce 15-word cap; bold keywords |
| Input is a table or data dump | Convert to bullets + add a visual placeholder; summarize the "so what" |