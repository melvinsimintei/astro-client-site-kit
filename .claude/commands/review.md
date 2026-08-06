# /review — Code Reviewer Command
#
# HOW TO USE:
#   /review
#   /review src/components/Hero.astro   ← review a specific file
#
# WHAT HAPPENS:
#   Triggers the code-reviewer subagent
#   Reviewer reads git diff to see what changed since last commit
#   Returns a pass/fail verdict with specific issues listed
#
# IMPORTANT RULE:
#   Always run /review in a FRESH Claude Code session
#   Never review code in the same session that wrote it
#   Fresh eyes = unbiased review (no memory of why you made choices)

Use the code-reviewer subagent to review: $ARGUMENTS

The reviewer must:
1. Run 'git diff HEAD' to see all changes since last commit
2. If $ARGUMENTS is a specific file, focus review there first
3. Check for: broken placeholders, hardcoded content, missing alt text,
   accessibility issues, color variables used correctly, form inputs valid
4. Return a verdict: PASS or FAIL
5. If FAIL: list each issue with the exact file and line number
6. If PASS: confirm what was checked and give green light to commit

Rule: No code changes. No npm install. Read and judge only.
