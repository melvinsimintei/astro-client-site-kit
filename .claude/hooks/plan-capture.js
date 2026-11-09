/**
 * plan-capture.js — PostToolUse hook, matcher "ExitPlanMode".
 *
 * PostToolUse only fires once ExitPlanMode completes, i.e. the plan was
 * approved. Claude Code keeps plan files in ~/.claude/plans (shared by every
 * repo) and never reloads them after /clear, so this writes the approved plan
 * to docs/plans/ACTIVE_PLAN.md ("Status: in progress"). session-start.js
 * re-injects it until the Status line reads "done". Earlier plans live on in
 * this file's git history.
 *
 * Plan source: the approval payload only (tool_response.plan / tool_input.plan,
 * then the file path it names). Never a guess from ~/.claude/plans: that could
 * be another repo's plan.
 *
 * Best-effort: every failure exits 0 quietly. It must never block approval.
 */

import fs from "fs";
import path from "path";

const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const activePlanPath = path.join(projectDir, "docs", "plans", "ACTIVE_PLAN.md");
const EXECUTE_RULE =
  "Plan approved: execute every phase under ponytail full (lite for copy/docs); track the phases " +
  "with claude-mem work_state_write; end with /ponytail-review and /ponytail-debt, then recommend /review.";

function readIfFile(filePath) {
  try {
    if (filePath && fs.statSync(filePath).isFile()) return fs.readFileSync(filePath, "utf8");
  } catch {
    // fall through
  }
  return null;
}

function resolvePlan(payload) {
  const input = payload.tool_input || {};
  const response = payload.tool_response || {};
  for (const text of [response.plan, input.plan]) {
    if (typeof text === "string" && text.trim()) return text;
  }
  for (const file of [response.filePath, input.planFilePath]) {
    const text = readIfFile(file);
    if (text && text.trim()) return text;
  }
  return null;
}

let inputData = "";
process.stdin.on("data", (chunk) => {
  inputData += chunk;
});

process.stdin.on("end", () => {
  try {
    const plan = resolvePlan(JSON.parse(inputData || "{}"));
    if (plan) {
      const content = [
        "<!-- Written by .claude/hooks/plan-capture.js on plan approval. Set the Status line to `done` when the plan is finished. -->",
        "Status: in progress",
        `Approved: ${new Date().toISOString()}`,
        "",
        plan.trim(),
        "",
      ].join("\n");
      fs.mkdirSync(path.dirname(activePlanPath), { recursive: true });
      fs.writeFileSync(activePlanPath, content, "utf8");
    }
    // Ponytail is on all session; this ties it to the execution phase explicitly.
    console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: "PostToolUse", additionalContext: EXECUTE_RULE } }));
  } catch {
    // best-effort
  }
  process.exit(0);
});
