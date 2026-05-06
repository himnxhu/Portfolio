import { query } from "@/lib/db";
import {
  isPositiveInteger,
  readJsonBody,
  RequestBodyTooLargeError,
} from "@/lib/request";
import { NextResponse } from "next/server";

const COMMENT_BODY_LIMIT_BYTES = 8 * 1024;

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

function getPositiveIntParam(value: string | null) {
  if (!value) return null;

  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const postId = getPositiveIntParam(searchParams.get("postId"));

  if (!postId) {
    return NextResponse.json({ error: "Valid postId is required" }, { status: 400 });
  }

  try {
    const result = await query(
      "SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at ASC LIMIT 50",
      [postId]
    );
    return NextResponse.json(result.rows);
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { postId, content, userId } = await readJsonBody<{
      postId?: unknown;
      content?: unknown;
      userId?: unknown;
    }>(req, COMMENT_BODY_LIMIT_BYTES);

    if (
      !isPositiveInteger(postId) ||
      typeof content !== "string" ||
      typeof userId !== "string" ||
      content.trim().length === 0 ||
      content.length > 1_000 ||
      userId.length > 64
    ) {
      return NextResponse.json({ error: "Invalid comment payload" }, { status: 400 });
    }

    const result = await query(
      "INSERT INTO comments (post_id, content, user_id) VALUES ($1, $2, $3) RETURNING *",
      [postId, content, userId]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error: unknown) {
    if (error instanceof RequestBodyTooLargeError) {
      return NextResponse.json({ error: error.message }, { status: 413 });
    }

    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { commentId, content, userId } = await readJsonBody<{
      commentId?: unknown;
      content?: unknown;
      userId?: unknown;
    }>(req, COMMENT_BODY_LIMIT_BYTES);

    if (
      !isPositiveInteger(commentId) ||
      typeof content !== "string" ||
      typeof userId !== "string" ||
      content.trim().length === 0 ||
      content.length > 1_000 ||
      userId.length > 64
    ) {
      return NextResponse.json({ error: "Invalid comment payload" }, { status: 400 });
    }
    
    // Check if within 5 mins
    const checkResult = await query(
      "SELECT created_at FROM comments WHERE id = $1 AND user_id = $2",
      [commentId, userId]
    );

    if (checkResult.rows.length === 0) {
      return NextResponse.json({ error: "Comment not found or unauthorized" }, { status: 404 });
    }

    const createdAt = new Date(checkResult.rows[0].created_at);
    const now = new Date();
    const diff = (now.getTime() - createdAt.getTime()) / 1000 / 60; // diff in minutes

    if (diff > 5) {
      return NextResponse.json({ error: "Edit window (5 mins) has expired" }, { status: 403 });
    }

    const result = await query(
      "UPDATE comments SET content = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
      [content, commentId, userId]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error: unknown) {
    if (error instanceof RequestBodyTooLargeError) {
      return NextResponse.json({ error: error.message }, { status: 413 });
    }

    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const commentId = getPositiveIntParam(searchParams.get("id"));
  const userId = searchParams.get("userId");

  if (!commentId || !userId || userId.length > 64) {
    return NextResponse.json({ error: "Valid id and userId are required" }, { status: 400 });
  }

  try {
    const result = await query(
      "DELETE FROM comments WHERE id = $1 AND user_id = $2 RETURNING id",
      [commentId, userId]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Unauthorized or not found" }, { status: 403 });
    }
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
