
# /explore — Codebase Explorer Command

#

# HOW TO USE:

#   /explore src/components

#   /explore src/pages/index.astro

#   /explore                     ← explores the whole project

#

# WHAT HAPPENS:

#   Claude Code reads this file when you type /explore

#   $ARGUMENTS is replaced with whatever you typed after /explore

#   The codebase-explorer subagent is triggered to do the reading

Use the codebase-explorer subagent to explore: $ARGUMENTS

The explorer must:

1. Read the target files or folders (never edit anything)

2. Map what exists: components, layout, styles, scripts

3. Note any patterns, placeholders, or inconsistencies

4. Return a clear summary before any coding begins

Rule: No code changes. Read only. Summarize what you find.

