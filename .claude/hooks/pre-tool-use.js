/**
 * pre-tool-use.js — PreToolUse hook, matcher "Bash|PowerShell|Write|Edit|NotebookEdit".
 *
 * Enforces CLAUDE.md's Session Rules at the harness level:
 *   - git push → block (Claude never pushes; the owner pushes manually)
 *   - git commit → "ask" (the owner approves each commit); git add passes through.
 *     Both match through git's global flags (git -C dir, -c k=v, --no-pager).
 *   - recursive force-delete (rm -rf, Remove-Item -Recurse -Force) → block
 *   - printing .env (cat/grep/Get-Content … .env, or a recursive grep over the
 *     repo root without --exclude=.env*) → block; .env.example is fine
 *   - code-reviewer subagent → read-only commands only (git diff/log/status/
 *     show, npm run build, npm test, npx astro check, grep/ls/cat) → anything else blocked;
 *     its file writes (Write/Edit, granted by `memory: project`) are limited to
 *     its own memory directory.
 *
 * Exit 2 blocks and shows stderr to Claude. JSON on stdout with
 * permissionDecision "ask" prompts the owner. Exit 0 allows.
 * Tests: node .claude/hooks/pre-tool-use.test.mjs
 */

import path from "path";

let inputData = "";
process.stdin.on("data", (chunk) => {
  inputData += chunk;
});

function block(reason) {
  console.error(`BLOCKED: ${reason}`);
  process.exit(2);
}

function ask(reason) {
  console.log(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "ask",
        permissionDecisionReason: reason,
      },
    })
  );
  process.exit(0);
}

// `git` plus any global options before the subcommand.
const GIT = String.raw`\bgit(?:\s+(?:-[Cc]\s+\S+|--(?:git-dir|work-tree|namespace)\s+\S+|--?[\w-]+(?:=\S+)?))*\s+`;
const gitSub = (sub) => new RegExp(`${GIT}${sub}\\b`, "i");

// Each segment of a chained command must match one of these for the reviewer.
const REVIEWER_ALLOWED = [
  /^git\s+(diff|log|status|show|ls-files|rev-parse)\b/,
  /^git\s+branch(\s+(-a|-r|-v|-vv|--all|--remotes|--list|--show-current|--merged|--no-merged))*\s*$/,
  /^npm\s+run\s+build\b/,
  /^npm\s+test\b/,
  /^node\s+\.claude[\/\\]hooks[\/\\]pre-tool-use\.test\.mjs\b/,
  /^npx\s+astro\s+check\b/,
  // No sed: its w/e commands and -i write files or run commands; head/tail cover reading.
  /^(grep|rg|ls|cat|head|tail|wc|find|echo|pwd|test)\b/,
  /^(Get-ChildItem|Get-Content|Select-String|Test-Path)\b/i,
];

function isReviewerSafe(command) {
  // Substitutions, newlines and command-running/write-capable flags can
  // smuggle a second command past the prefix match below.
  if (/`|\$\(|<\(|[\r\n]|--output\b|--pre\b|\s-(delete|exec|execdir|ok|okdir|fprint\w*|fls)\b/.test(command)) {
    return false;
  }
  // Quoted text (grep patterns etc.) can't run anything; drop it so its | ; >
  // aren't read as operators.
  const unquoted = command.replace(/"(?:[^"\\]|\\.)*"|'[^']*'/g, "''");
  // Stream merges and discards are fine; any other redirect writes a file.
  const stripped = unquoted.replace(/\d?>&\d|\d?>\s*\/dev\/null|\d?>\s*\$null/g, "");
  if (/>|\btee\b|\bxargs\b/.test(stripped)) return false;
  // A lone & backgrounds a second command (or is PowerShell's call operator); && is fine.
  if (/(^|[^&])&(?!&)/.test(stripped)) return false;
  return stripped
    .split(/&&|\|\||;|\|/)
    .map((part) =>
      part
        .trim()
        .replace(/^cd\s+\S+\s*$/, "")
        .replace(/^git(\s+(-C\s+\S+|--no-pager))+/, "git")
    )
    .filter(Boolean)
    .every((part) => REVIEWER_ALLOWED.some((re) => re.test(part)));
}

const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const reviewerMemoryDir = path.resolve(projectDir, ".claude", "agent-memory", "code-reviewer");

function inReviewerMemory(filePath) {
  const rel = path.relative(reviewerMemoryDir, path.resolve(projectDir, String(filePath || "")));
  return rel !== "" && !rel.startsWith("..") && !path.isAbsolute(rel);
}

process.stdin.on("end", () => {
  let payload;
  try {
    payload = JSON.parse(inputData || "{}");
  } catch {
    process.exit(0); // never break tool use over a malformed payload
  }

  const { tool_name, tool_input = {}, agent_type } = payload;

  if (["Write", "Edit", "NotebookEdit"].includes(tool_name)) {
    if (agent_type === "code-reviewer" && !inReviewerMemory(tool_input.file_path || tool_input.notebook_path)) {
      block("code-reviewer is read-only. It may only write inside .claude/agent-memory/code-reviewer/.");
    }
    process.exit(0);
  }

  if (tool_name !== "Bash" && tool_name !== "PowerShell") process.exit(0);

  const command = String(tool_input.command || "");

  const rmRecursive = /\brm\b(?=[^;&|\n]*\s(-[a-z]*r[a-z]*|--recursive)\b)(?=[^;&|\n]*\s(-[a-z]*f[a-z]*|--force)\b)/i;
  if (rmRecursive.test(command) || /Remove-Item\b(?=.*-Recurse)(?=.*-Force)/i.test(command)) {
    block("recursive force-delete is not allowed. Delete manually if you truly need to.");
  }

  // Keys live in .env and must never reach the transcript.
  // `.env` counts only as a path word, so `grep "process.env"` is fine.
  const printsEnv =
    /(?:^|[;&|(\n])\s*(cat|type|more|less|head|tail|grep|rg|findstr|sed|awk|bat|Get-Content|gc|Select-String|sls)\b[^;&|\n]*(?:^|[\s\/\\'"])\.env(?!\.example)\b/i;
  // grep ignores .gitignore, so a recursive grep of the repo root prints .env too.
  // shortcut: treats the first non-flag word as the pattern (misreads `-e PAT`), fine for a guard.
  const unquotedCmd = command.replace(/(=)?("(?:[^"\\]|\\.)*"|'[^']*')/g, (_, eq, q) => (eq ? "=" + q.slice(1, -1) : "PAT"));
  const grepsRoot = (unquotedCmd.match(/(?:^|[;&|(\n])\s*grep\b[^;&|\n]*/gi) || []).some((seg) => {
    if (!/\s(-[a-zA-Z]*[rR][a-zA-Z]*|--recursive)\b/.test(seg) || /--exclude=\.env/.test(seg)) return false;
    const words = seg.trim().split(/\s+/).slice(1);
    const paths = words.filter((w) => !w.startsWith("-")).slice(1);
    return paths.length === 0 || paths.some((p) => /^\.[\/\\]?$/.test(p));
  });
  if (printsEnv.test(command.replace(/--exclude=\S+/g, "")) || grepsRoot) {
    block(".env holds the keys and must not be printed.");
  }

  if (agent_type === "code-reviewer" && !isReviewerSafe(command)) {
    block(
      "code-reviewer is read-only. Allowed: git diff/log/status/show, " +
        "npm run build, npm test, npx astro check, grep/ls/cat."
    );
  }

  if (gitSub("push").test(command)) {
    block("CLAUDE.md: Claude never pushes. The owner pushes manually from their own terminal.");
  }

  if (gitSub("commit").test(command)) {
    ask("CLAUDE.md: commit only with the owner's approval. Approve to run this commit.");
  }

  process.exit(0);
});
