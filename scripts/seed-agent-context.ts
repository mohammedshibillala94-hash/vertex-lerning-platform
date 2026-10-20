import { createClient } from "next-sanity";
import {
  DEFAULT_AGENT_CONTEXT_FILTER,
  DEFAULT_AGENT_CONTEXT_INSTRUCTIONS,
} from "../lib/search-prompt";
import fs from "fs";
import path from "path";

async function main() {
  const doc = {
    _id: "sanity.agentContext.search-agent",
    _type: "sanity.agentContext",
    title: "Vertex Search Agent Context",
    slug: {
      _type: "slug",
      current: "search-agent",
    },
    groqFilter: DEFAULT_AGENT_CONTEXT_FILTER,
    instructions: DEFAULT_AGENT_CONTEXT_INSTRUCTIONS,
  };

  const ndjsonPath = path.resolve(process.cwd(), "agent-context.ndjson");
  fs.writeFileSync(ndjsonPath, JSON.stringify(doc) + "\n");
  console.log(`Generated agent-context.ndjson at ${ndjsonPath}`);

  const writeToken = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN;
  if (!writeToken) {
    console.log("Note: SANITY_API_WRITE_TOKEN is not configured in .env.local.");
    console.log("Document is ready for import via Sanity Studio or: npx sanity dataset import agent-context.ndjson production");
    return;
  }

  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: "2024-01-01",
    useCdn: false,
    token: writeToken,
  });

  try {
    const result = await client.createOrReplace(doc);
    console.log("Successfully wrote sanity.agentContext document to Sanity Content Lake:", result._id);
  } catch (err: unknown) {
    const error = err as { message?: string };
    console.warn("Could not write directly via client:", error?.message);
    console.log("Use Sanity Studio or agent-context.ndjson to import.");
  }
}

main().catch(console.error);
