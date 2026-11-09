/**
 * sync-status.js — Stop hook (see settings.json).
 *
 * A soft, non-blocking reminder: if there is uncommitted work and the
 * narrative in docs/plans/STATUS.md is unchanged since the last commit, it
 * emits a systemMessage nudging an update so the next session keeps the
 * context. It never writes STATUS.md and never blocks (no "decision": "block").
 *
 * Branch and git status are not stored anywhere: session-start.js reads them
 * live from git at every start, so STATUS.md stays clean after a commit.
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const statusPath = path.join(projectDir, "docs", "plans", "STATUS.md");
const statusRelPath = "docs/plans/STATUS.md";

function git(args) {
  try {
    return execSync(`git ${args}`, {
      cwd: projectDir,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trimEnd(); // trimEnd: the leading space of ` M` is git's "unstaged" column
  } catch {
    return null; // not a git repo, git missing, no HEAD yet, etc.
  }
}

let inputData = "";
process.stdin.on("data", (chunk) => {
  inputData += chunk;
});

process.stdin.on("end", () => {
  try {
    const { hook_event_name } = JSON.parse(inputData || "{}");
    if (hook_event_name !== "Stop") process.exit(0);

    const otherChanges = (git("status --short") || "")
      .split("\n")
      .filter((line) => line.trim() && !line.includes(statusRelPath));
    if (otherChanges.length === 0) process.exit(0);

    // Uncommitted STATUS.md edits mean the narrative was already touched.
    const committed = git(`show HEAD:${statusRelPath}`);
    if (committed === null) process.exit(0); // no baseline yet
    // autocrlf checks out CRLF while the blob is LF; compare content, not line endings.
    const norm = (s) => s.replace(/\r\n/g, "\n").trim();
    if (norm(fs.readFileSync(statusPath, "utf8")) !== norm(committed)) process.exit(0);

    console.log(
      JSON.stringify({
        systemMessage:
          `Reminder: ${otherChanges.length} file(s) have uncommitted changes, but ` +
          "docs/plans/STATUS.md hasn't changed since the last commit. Update its narrative " +
          "so the next session doesn't lose this context. (Reminder only — nothing is blocked.)",
      })
    );
  } catch {
    // never break the turn
  }
  process.exit(0);
});
