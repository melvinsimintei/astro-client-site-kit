/**
 * session-start.js — SessionStart hook (startup, resume, clear, compact).
 *
 * Prints a compact restore payload so every session starts already knowing
 * where the build stands:
 *   1. the hand-written narrative, docs/plans/STATUS.md
 *   2. docs/plans/ACTIVE_PLAN.md, unless its Status line reads "done" — in
 *      full when it fits the budget, otherwise trimmed (see below)
 *   3. a short ground truth (branch + git status --short), read live from git
 *      and never stored, so no file goes stale or churns
 *   4. the Session Rules reminder
 *
 * Hook stdout over ~10KB gets swapped for a 2KB preview, which silently cut
 * the plan off. So the payload is held under BUDGET: the narrative is trimmed
 * first, then the plan, and any trim says which file to Read for the rest.
 * Never blocks: any failure prints a short note and exits 0.
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const statusPath = path.join(projectDir, "docs", "plans", "STATUS.md");
const activePlanPath = path.join(projectDir, "docs", "plans", "ACTIVE_PLAN.md");

const BUDGET = 9000;

const RULES =
  "Session Rules (CLAUDE.md): targeted Grep/Read before planning; codebase-explorer " +
  "only when that can't answer or when asked. An approved plan runs end-to-end without stopping between phases, " +
  "under ponytail full, phases tracked in claude-mem work_state_write; " +
  "set ACTIVE_PLAN.md's Status to done when finished. Recommend /review at the " +
  "end of a pass, never run the code-reviewer automatically. Never git " +
  "add/commit unless told; never push (the owner pushes manually). Update STATUS.md's narrative when a pass completes.";

function readOrNull(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}

function git(args) {
  try {
    return execSync(`git ${args}`, {
      cwd: projectDir,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trimEnd(); // keep the leading space of ` M` (git's "unstaged" column)
  } catch {
    return null;
  }
}

function truncate(text, max, pointer) {
  if (text.length <= max) return text;
  const note = `\n…truncated — Read ${pointer} for the rest.`;
  return text.slice(0, Math.max(0, max - note.length)) + note;
}

function activePlan() {
  const plan = readOrNull(activePlanPath);
  if (!plan) return null;
  const statusLine = plan.match(/^Status:\s*(.+)$/m);
  if (statusLine && /^done\b/i.test(statusLine[1].trim())) return null;
  return plan.trim();
}

function groundTruth() {
  const branch = git("rev-parse --abbrev-ref HEAD") || "(unknown branch)";
  const short = git("status --short");
  return [
    `Branch: ${branch}`,
    "Uncommitted (git status --short):",
    short && short.length > 0 ? short : "(clean working tree)",
  ].join("\n");
}

let inputData = "";
process.stdin.on("data", (chunk) => {
  inputData += chunk;
});

const NARRATIVE_TITLE = "docs/plans/STATUS.md narrative (auto-loaded)";
const PLAN_TITLE = "docs/plans/ACTIVE_PLAN.md (approved plan, in progress — execute it end-to-end)";
const NO_PLAN = "No active plan (docs/plans/ACTIVE_PLAN.md is missing or marked done).";
const SEPARATOR = "\n\n";

const wrap = (title, body) => `=== ${title} ===\n${body}\n=== end ${title} ===`;

function buildPayload() {
  const status = readOrNull(statusPath);
  if (status === null) return "No docs/plans/STATUS.md yet — nothing to restore.";

  const plan = activePlan();
  const truth = truncate(groundTruth(), 1200, "`git status`");
  const fixed = [wrap("Ground truth", truth), RULES].join(SEPARATOR);

  // Exact overhead: each wrap() repeats its title, plus the two separators
  // between the three sections and console.log's trailing newline.
  const overhead =
    wrap(NARRATIVE_TITLE, "").length +
    (plan ? wrap(PLAN_TITLE, "").length : NO_PLAN.length) +
    2 * SEPARATOR.length +
    1;
  let room = BUDGET - fixed.length - overhead;

  // The plan has priority over the narrative: it's what /clear must not lose.
  const narrativeShare = plan ? Math.max(600, room - plan.length) : room;
  const narrative = truncate(status.trim(), narrativeShare, "docs/plans/STATUS.md");
  room -= narrative.length;

  const sections = [wrap(NARRATIVE_TITLE, narrative)];
  sections.push(plan ? wrap(PLAN_TITLE, truncate(plan, room, "docs/plans/ACTIVE_PLAN.md")) : NO_PLAN);
  sections.push(fixed);
  return sections.join(SEPARATOR);
}

process.stdin.on("end", () => {
  try {
    console.log(buildPayload());
  } catch (err) {
    console.log(`session-start.js failed (${err.message}); Read docs/plans/STATUS.md and docs/plans/ACTIVE_PLAN.md.`);
  }
  process.exit(0);
});
