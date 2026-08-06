/**
 * pre-tool-use.js — Runs BEFORE every tool Claude tries to execute
 *
 * HOW CLAUDE CODE HOOKS WORK:
 * Claude Code passes information about the tool call to this script
 * via standard input (stdin) as a JSON object.
 * This script reads that JSON, checks the rules, and either:
 *   - Exits with code 0  → allow the tool to run
 *   - Exits with code 2  → block the tool and show the reason
 *
 * THE JSON CLAUDE CODE SENDS LOOKS LIKE THIS:
 * {
 *   "tool_name": "Bash",
 *   "tool_input": { "command": "git push origin main" },
 *   "agent_name": "code-reviewer"
 * }
 */

// 'process' is a built-in Node.js object
// It gives you access to the running process — inputs, outputs, exit codes

// We will build up the incoming JSON string chunk by chunk
// Start with an empty string
let inputData = "";

// 'process.stdin' is the standard input stream
// Think of it like a pipe — Claude Code pours data in, we read it here
// 'on("data")' fires every time a new chunk of data arrives
process.stdin.on("data", (chunk) => {
  // Each chunk is a piece of the JSON string
  // We add it to inputData until the full message arrives
  inputData += chunk;
});

// 'on("end")' fires when Claude Code has finished sending all the data
// This is where we do our actual work
process.stdin.on("end", () => {

  // Parse the JSON string into a real JavaScript object
  // so we can read tool_name, tool_input, agent_name
  const toolCall = JSON.parse(inputData);

  // Destructure the three fields we care about
  // This is shorthand for:
  //   const tool_name = toolCall.tool_name
  //   const tool_input = toolCall.tool_input
  //   const agent_name = toolCall.agent_name
  const { tool_name, tool_input, agent_name } = toolCall;

  // ─────────────────────────────────────────
  // GUARD 1 — Block git push without approval
  // ─────────────────────────────────────────
  // Check if the tool is Bash AND the command contains "git push"
  // 'tool_input.command' is the actual bash command Claude wants to run
  // '.includes()' returns true if the string contains that substring
  if (tool_name === "Bash" && tool_input.command?.includes("git push")) {

    // Print a clear reason to the screen so you know why it was blocked
    console.error("BLOCKED: git push is not allowed automatically.");
    console.error("Run /review first, get a PASS verdict, then push manually.");

    // Exit code 2 tells Claude Code: BLOCK this tool call
    // Exit code 0 would mean: allow it
    // Exit code 1 means: something went wrong in the hook itself
    process.exit(2);
  }

  // ─────────────────────────────────────────────────────
  // GUARD 2 — Block npm install inside the reviewer agent
  // ─────────────────────────────────────────────────────
  // The reviewer should only read files and run git diff
  // It must never install packages — that changes the project state
  if (
    agent_name === "code-reviewer" &&
    tool_name === "Bash" &&
    tool_input.command?.includes("npm install")
  ) {
    console.error("BLOCKED: code-reviewer cannot run npm install.");
    console.error("The reviewer reads and judges only. It cannot change anything.");
    process.exit(2);
  }

  // ─────────────────────────────────────────────────────
  // GUARD 3 — Block rm -rf (permanent file deletion)
  // ─────────────────────────────────────────────────────
  // rm -rf deletes files instantly with no recycle bin
  // There is almost never a good reason for Claude to run this
  if (tool_name === "Bash" && tool_input.command?.includes("rm -rf")) {
    console.error("BLOCKED: rm -rf is not allowed.");
    console.error("Delete files manually if you truly need to remove something.");
    process.exit(2);
  }

  // ─────────────────────────────────────────
  // ALL GUARDS PASSED — allow the tool to run
  // ─────────────────────────────────────────
  // If we reach this line, none of the guards fired
  // Exit code 0 tells Claude Code: proceed normally
  process.exit(0);
});
