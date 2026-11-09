// Self-check for pre-tool-use.js: node .claude/hooks/pre-tool-use.test.mjs
// "pu"+"sh" keeps the guard from blocking any shell command that names this file's contents.
import { spawnSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const hook = path.join(here, "pre-tool-use.js");
const projectDir = path.resolve(here, "..", "..");
const P = "pu" + "sh";
const R = "code-reviewer";
const mem = path.join(projectDir, ".claude", "agent-memory", R, "notes.md");

// [agent, tool, command-or-file, expected]
const cases = [
  ["main", "Bash", `git ${P} origin main`, "BLOCK"],
  ["main", "Bash", `git -C . ${P}`, "BLOCK"],
  ["main", "Bash", `git -c core.x=y ${P}`, "BLOCK"],
  ["main", "Bash", `git --git-dir .git ${P}`, "BLOCK"],
  ["main", "PowerShell", `git ${P}`, "BLOCK"],
  ["main", "Bash", "git commit -m x", "ASK"],
  ["main", "Bash", "git --no-pager commit -m x", "ASK"],
  ["main", "Bash", "git -C . commit -m x", "ASK"],
  ["main", "Bash", "git status", "allow"],
  ["main", "Bash", "git log --grep commit", "allow"],
  ["main", "Bash", "rm -rf src", "BLOCK"],
  ["main", "Bash", "cat .env", "BLOCK"],
  ["main", "Bash", "cat .env.example", "allow"],
  ["main", "Bash", "cat ./.env", "BLOCK"],
  ["main", "PowerShell", "Get-Content .\\.env", "BLOCK"],
  ["main", "Bash", 'grep -rn "process.env" src', "allow"],
  ["main", "Bash", "grep -rn KEY src", "allow"],
  ["main", "Bash", "grep -rn KEY .", "BLOCK"],
  ["main", "Bash", "grep -rn KEY", "BLOCK"],
  ["main", "Bash", "grep -rn KEY . --exclude=.env*", "allow"],
  ["main", "Bash", "grep -rn KEY . --exclude='.env*'", "allow"],
  ["main", "Bash", 'grep -rn "a|b" .', "BLOCK"],
  ["main", "Bash", "grep -n KEY astro.config.mjs", "allow"],
  ["main", "Write", "src/pages/index.astro", "allow"],
  [R, "Bash", "git status --short", "allow"],
  [R, "Bash", "git diff HEAD", "allow"],
  [R, "Bash", "cd /c/Users/x && git status --short", "allow"],
  [R, "Bash", "git -C /c/x status", "allow"],
  [R, "Bash", "git --no-pager diff HEAD", "allow"],
  [R, "Bash", "git branch --show-current", "allow"],
  [R, "Bash", "npm run build 2>&1 | tail -20", "allow"],
  [R, "Bash", 'grep -rn "a\\|b" src', "allow"],
  [R, "Bash", "sed -n '1,200p' src/x.js", "BLOCK"],
  [R, "Bash", "npm test && git status", "allow"],
  [R, "Bash", "ls & npm install x", "BLOCK"],
  [R, "Bash", "ls&node -e x", "BLOCK"],
  [R, "PowerShell", "& node -e x", "BLOCK"],
  [R, "Bash", "sed -n '1,5w out' f", "BLOCK"],
  [R, "Bash", "sed -n '1e cmd' f", "BLOCK"],
  [R, "Bash", "sed -n 's/x/y/e' f", "BLOCK"],
  [R, "Bash", "sed -n -Ei 's/a/b/' f", "BLOCK"],
  [R, "Bash", "npm test", "allow"],
  [R, "Bash", "node .claude/hooks/pre-tool-use.test.mjs", "allow"],
  [R, "Bash", "node -e x", "BLOCK"],
  [R, "Bash", "find . -fls out.txt", "BLOCK"],
  [R, "Bash", "npm install x", "BLOCK"],
  [R, "Bash", "git branch -D x", "BLOCK"],
  [R, "Bash", "git branch newbranch", "BLOCK"],
  [R, "Bash", "sed -n 'w out.txt' f", "BLOCK"],
  [R, "Bash", "sed -i 's/a/b/' f", "BLOCK"],
  [R, "Bash", "rg --pre sh x", "BLOCK"],
  [R, "Bash", "find . -ok rm {} ;", "BLOCK"],
  [R, "Bash", 'grep "x" f > out.txt', "BLOCK"],
  [R, "Bash", `git -C . ${P}`, "BLOCK"],
  [R, "Write", "src/pages/index.astro", "BLOCK"],
  [R, "Edit", path.join(projectDir, "CLAUDE.md"), "BLOCK"],
  [R, "Edit", ".claude/agent-memory/code-reviewer/../../settings.json", "BLOCK"],
  [R, "Write", mem, "allow"],
  [R, "Edit", ".claude/agent-memory/code-reviewer/MEMORY.md", "allow"],
];

let bad = 0;
for (const [agent, tool, arg, want] of cases) {
  const tool_input = tool === "Write" || tool === "Edit" ? { file_path: arg } : { command: arg };
  const payload = { tool_name: tool, tool_input };
  if (agent !== "main") payload.agent_type = agent;
  const r = spawnSync("node", [hook], {
    input: JSON.stringify(payload),
    encoding: "utf8",
    env: { ...process.env, CLAUDE_PROJECT_DIR: projectDir },
  });
  const got = r.status === 2 ? "BLOCK" : r.stdout.includes('"ask"') ? "ASK" : "allow";
  if (got !== want) {
    bad++;
    console.log(`FAIL got ${got}, want ${want}: [${agent}/${tool}] ${arg}`);
  }
}
console.log(`${cases.length - bad}/${cases.length} passed`);

// plan-capture.js: writes ACTIVE_PLAN.md into a scratch project and prints the execute rule.
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "plan-capture-"));
const pc = spawnSync("node", [path.join(here, "plan-capture.js")], {
  input: JSON.stringify({ tool_input: { plan: "# Test plan" } }),
  encoding: "utf8",
  env: { ...process.env, CLAUDE_PROJECT_DIR: scratch },
});
const saved = fs.readFileSync(path.join(scratch, "docs", "plans", "ACTIVE_PLAN.md"), "utf8");
const pcOk = pc.status === 0 && saved.includes("# Test plan") && pc.stdout.includes("ponytail full");
console.log(`plan-capture ${pcOk ? "ok" : "FAIL"}`);
fs.rmSync(scratch, { recursive: true, force: true });
process.exit(bad || !pcOk ? 1 : 0);
