# Clean Up Markdown Slides

## Objective
Refine and clean up Markdown-based presentation slides to make them audience-ready.

## Mandatory Preflight (run before any edits)
1. Read `.cursor/rules/slides-standards.mdc`.
2. If any user request conflicts with these constraints, ask for clarification before proceeding.

## Instructions
1. **STOP and ASK the user for two pieces of information before proceeding:**
   - "Which directory contains the Markdown files you want me to clean up?"
   - "What is the desired tone for the audience? (e.g., Professional, Humorous, Technical, Minimalist)"

2. **Once the user provides the directory and tone:**
   - Scan all `.md` files in the specified directory.
   - Improve clarity and flow while adhering to the chosen **tone**.
   - Format lists for readability (max 3-5 bullets per slide).
   - Ensure consistent heading levels.
   - Remove any "speaker notes" or "TODOs" unless otherwise specified.
   - Keep the original slide delimiters (like `---`) intact.

3. **Before output:** Run a final compliance pass against `.cursor/rules/slides-standards.mdc` and fix violations.

4. **Output:** Show a summary of the changes made to each file and provide the updated content in a code block or apply the changes directly if in Composer mode.