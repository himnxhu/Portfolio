import { query } from "@/lib/db";
import {
  isPositiveInteger,
  readJsonBody,
  RequestBodyTooLargeError,
} from "@/lib/request";
import { NextResponse } from "next/server";

const LIKE_BODY_LIMIT_BYTES = 1024;

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

export async function POST(req: Request) {
  try {
    const { postId, action } = await readJsonBody<{
      postId?: unknown;
      action?: unknown;
    }>(req, LIKE_BODY_LIMIT_BYTES);

    if (!isPositiveInteger(postId) || (action !== "like" && action !== "unlike")) {
      return NextResponse.json({ error: "Invalid like payload" }, { status: 400 });
    }

    if (action === "like") {
      await query("UPDATE posts SET likes = likes + 1 WHERE id = $1", [postId]);
    } else {
      await query("UPDATE posts SET likes = GREATEST(0, likes - 1) WHERE id = $1", [postId]);
    }

    const result = await query("SELECT likes FROM posts WHERE id = $1", [postId]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ likes: result.rows[0].likes });
  } catch (error: unknown) {
    if (error instanceof RequestBodyTooLargeError) {
      return NextResponse.json({ error: error.message }, { status: 413 });
    }

    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
