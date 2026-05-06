import { query } from "@/lib/db";
import { readJsonBody, RequestBodyTooLargeError } from "@/lib/request";
import { NextResponse } from "next/server";

let initTablePromise: Promise<void> | undefined;
const POST_BODY_LIMIT_BYTES = 64 * 1024;
const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "himanshu@2026";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

// Helper to initialize table
const initTable = async () => {
  if (initTablePromise) return initTablePromise;

  initTablePromise = (async () => {
    // Posts table
    await query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT DEFAULT 'Insight',
        likes INTEGER DEFAULT 0,
        read_time TEXT DEFAULT '5 min read',
        date TEXT DEFAULT TO_CHAR(CURRENT_TIMESTAMP, 'Mon DD, YYYY')
      );
    `);

    // Comments table
    await query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        user_id TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  })().catch((error) => {
    initTablePromise = undefined;
    throw error;
  });

  return initTablePromise;
};

export async function GET() {
  try {
    await initTable();
    const result = await query("SELECT * FROM posts ORDER BY id DESC LIMIT 20");
    return NextResponse.json(result.rows);
  } catch (error: unknown) {
    console.error("DB Error:", error);
    return NextResponse.json({ error: "Failed to fetch posts", details: getErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, excerpt, content, secret } = await readJsonBody<{
      title?: unknown;
      excerpt?: unknown;
      content?: unknown;
      secret?: unknown;
    }>(req, POST_BODY_LIMIT_BYTES);

    // Verify Secret
    if (secret !== ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (
      typeof title !== "string" ||
      typeof excerpt !== "string" ||
      typeof content !== "string" ||
      title.trim().length === 0 ||
      excerpt.trim().length === 0 ||
      content.trim().length === 0 ||
      title.length > 160 ||
      excerpt.length > 500 ||
      content.length > 30_000
    ) {
      return NextResponse.json({ error: "Invalid post payload" }, { status: 400 });
    }

    await initTable();
    
    // Estimate read time
    const words = content.split(/\s+/).length;
    const readTime = `${Math.ceil(words / 200)} min read`;

    const result = await query(
      "INSERT INTO posts (title, excerpt, content, read_time) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, excerpt, content, readTime]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error: unknown) {
    if (error instanceof RequestBodyTooLargeError) {
      return NextResponse.json({ error: error.message }, { status: 413 });
    }

    console.error("DB Error:", error);
    return NextResponse.json({ error: "Failed to create post", details: getErrorMessage(error) }, { status: 500 });
  }
}
