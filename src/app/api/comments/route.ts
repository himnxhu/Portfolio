import { query } from "@/lib/db";
import { NextResponse } from "next/server";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");

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
    const { postId, content, userId } = await req.json();
    const result = await query(
      "INSERT INTO comments (post_id, content, user_id) VALUES ($1, $2, $3) RETURNING *",
      [postId, content, userId]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { commentId, content, userId } = await req.json();
    
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
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const commentId = searchParams.get("id");
  const userId = searchParams.get("userId");

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
