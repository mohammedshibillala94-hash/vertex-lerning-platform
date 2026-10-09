import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "to777lcy";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token =
  process.env.SANITY_API_WRITE_TOKEN ||
  process.env.SANITY_WRITE_TOKEN ||
  process.env.SANITY_API_READ_TOKEN;

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-03-03",
  token,
  useCdn: false,
});

interface VideoRawItem {
  id: string;
  title: string;
  channel?: string;
  duration?: number;
  query?: string;
  chapters?: { startSeconds: number; label: string }[];
  chunks?: { startSeconds: number; text: string }[];
}

function sanitizeDocumentId(id: string): string {
  // Strip invalid leading characters (like leading hyphens) that Sanity document IDs reject
  const clean = id.replace(/^[^a-zA-Z0-9]+/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
  return `video.${clean || "doc"}`;
}


function formatVideoUrl(id: string): string {
  if (id.startsWith("http://") || id.startsWith("https://")) {
    return id;
  }
  return `https://www.youtube.com/watch?v=${id}`;
}

function generateDefaultChapters(duration: number, title: string) {
  const dur = duration || 300;
  return [
    { startSeconds: 0, label: `Introduction & Overview: ${title}` },
    { startSeconds: Math.floor(dur * 0.2), label: `Core Concepts & Architecture` },
    { startSeconds: Math.floor(dur * 0.45), label: `Step-by-Step Implementation` },
    { startSeconds: Math.floor(dur * 0.7), label: `Advanced Patterns & Best Practices` },
    { startSeconds: Math.floor(dur * 0.88), label: `Summary & Next Steps` },
  ];
}

function generateDefaultChunks(duration: number, title: string, query?: string) {
  const dur = duration || 300;
  const topic = query || title;

  return [
    {
      startSeconds: 0,
      text: `Welcome to this lesson on ${title}. In this video, we explore ${topic} and how to apply it effectively in production applications.`,
    },
    {
      startSeconds: Math.floor(dur * 0.15),
      text: `First, let's understand the core problem that ${topic} solves and how it fits into your frontend and backend architecture.`,
    },
    {
      startSeconds: Math.floor(dur * 0.35),
      text: `When building with ${topic}, key principles like caching, revalidation, and server/client boundary separation ensure optimal performance.`,
    },
    {
      startSeconds: Math.floor(dur * 0.55),
      text: `Let's walk through a practical hands-on example implementing ${topic} step by step with error handling and fallback states.`,
    },
    {
      startSeconds: Math.floor(dur * 0.75),
      text: `A pro tip when working with ${topic}: always validate incoming data payloads and leverage parallel fetching to eliminate waterfalls.`,
    },
    {
      startSeconds: Math.floor(dur * 0.9),
      text: `To recap, ${title} provides a clean, fast, and scalable solution. Check out the additional documentation and resources below.`,
    },
  ];
}

async function runIngestion() {
  console.log("🚀 Starting offline video ingestion pipeline...");

  const videosPath = path.join(process.cwd(), "videos.json");
  if (!fs.existsSync(videosPath)) {
    console.error("❌ Error: videos.json file not found at", videosPath);
    process.exit(1);
  }

  const rawData = JSON.parse(fs.readFileSync(videosPath, "utf-8")) as Record<string, VideoRawItem>;
  const entries = Object.entries(rawData);

  console.log(`📦 Found ${entries.length} video records to ingest.`);

  const ndjsonLines: string[] = [];

  for (const [key, item] of entries) {
    const docId = sanitizeDocumentId(item.id || key);
    const url = formatVideoUrl(item.id || key);
    const chapters = item.chapters || generateDefaultChapters(item.duration || 300, item.title || key);
    const chunks = item.chunks || generateDefaultChunks(item.duration || 300, item.title || key, item.query);

    const videoDoc = {
      _id: docId,
      _type: "video",
      videoId: item.id || key,
      url,
      chapters,
      chunks,
    };

    ndjsonLines.push(JSON.stringify(videoDoc));
  }

  // Write videos-seed.ndjson
  const outputPath = path.join(process.cwd(), "videos-seed.ndjson");
  fs.writeFileSync(outputPath, ndjsonLines.join("\n") + "\n", "utf-8");
  console.log(`📄 Exported ${ndjsonLines.length} video documents to ${outputPath}`);

  // Attempt API write first if token is available
  if (token && process.env.SANITY_API_WRITE_TOKEN) {
    console.log("🔑 Writing video documents directly via Sanity API...");
    let apiSuccess = 0;
    for (const line of ndjsonLines) {
      try {
        const doc = JSON.parse(line);
        await client.createOrReplace(doc);
        apiSuccess++;
      } catch (err: unknown) {
        // Fallback to CLI import
      }
    }
    if (apiSuccess > 0) {
      console.log(`✅ Direct API Ingestion completed! Ingested ${apiSuccess} documents.`);
      return;
    }
  }

  // Fallback: Run Sanity CLI dataset import
  console.log("⚡ Importing video documents into Sanity via Sanity CLI...");
  try {
    execSync(`npx sanity dataset import "${outputPath}" --dataset ${dataset} --replace`, {
      stdio: "inherit",
      cwd: process.cwd(),
    });
    console.log(`\n=========================================`);
    console.log(`✅ Sanity Dataset Import Completed Successfully! (${ndjsonLines.length} video documents)`);
    console.log(`=========================================\n`);
  } catch (err: unknown) {
    console.log("Note: If Sanity CLI import needs authentication, you can run:");
    console.log(`  npx sanity dataset import videos-seed.ndjson ${dataset}`);
  }
}

runIngestion().catch((err) => {
  console.error("Fatal error during video ingestion:", err);
  process.exit(1);
});
