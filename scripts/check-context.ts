import { serverClient } from "../sanity/lib/client";
import {
  DEFAULT_AGENT_CONTEXT_FILTER,
  DEFAULT_AGENT_CONTEXT_INSTRUCTIONS,
  VERTEX_SEARCH_SYSTEM_PROMPT,
} from "../lib/search-prompt";
import fs from "fs";
import path from "path";

async function main() {
  console.log("=== Vertex Search Tuning Check ===");
  console.log("\n1. Active System Prompt (shape-your-agent):");
  console.log(VERTEX_SEARCH_SYSTEM_PROMPT.slice(0, 300) + "...\n");

  console.log("2. Content Scope Filter (dial-your-context):");
  console.log(DEFAULT_AGENT_CONTEXT_FILTER);

  console.log("\n3. Custom Instructions Pure Deltas (dial-your-context):");
  console.log(DEFAULT_AGENT_CONTEXT_INSTRUCTIONS.slice(0, 350) + "...\n");

  const ndjsonPath = path.resolve(process.cwd(), "agent-context.ndjson");
  console.log("4. Local agent-context.ndjson file exists:", fs.existsSync(ndjsonPath));

  try {
    const docs = await serverClient.fetch('*[_type == "sanity.agentContext"]');
    console.log("5. Dataset sanity.agentContext documents count:", docs.length);
  } catch (err: unknown) {
    const error = err as { message?: string };
    console.log("5. Dataset fetch notice:", error?.message);
  }
}

main().catch(console.error);
