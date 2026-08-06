# /ship — Stage and Commit Command
#
# HOW TO USE:
#   /ship "Add mobile nav toggle"
#   /ship "Fix phone validation pattern"
#
# WHAT HAPPENS:
#   1. Shows you a summary of what's about to be committed
#   2. STOPS and waits for your explicit approval
#   3. Only commits after you type: "approved" or "yes, ship it"
#   4. Never runs git push — that is always a separate manual step
#
# WHY THE PAUSE?
#   Committing the wrong thing is easy to do and annoying to undo
#   The pause gives you one last chance to catch mistakes
#   Push is always manual — never automatic

When I run /ship "$ARGUMENTS", do the following:

Step 1 — Show what will be committed:
Run 'git diff HEAD' and summarize the changes in plain English.
List every file that was modified, added, or deleted.

Step 2 — STOP. Do not commit yet.
Ask me: "Ready to commit with message: '$ARGUMENTS' — approve? (yes/no)"

Step 3 — Wait for my response.
If I say yes or approved: run 'git add -A && git commit -m "$ARGUMENTS"'
If I say no or anything else: cancel and tell me what to fix first.

Step 4 — After committing:
Show the commit hash and confirm: "Committed. Push manually when ready."
Never run git push. Ever.

Rule: One issue per commit. If the diff contains unrelated changes, warn me.
