import { query } from "@/lib/db";
import { NextResponse } from "next/server";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

export async function POST(req: Request) {
  try {
    const { postId, action } = await req.json(); // action: 'like' | 'unlike'

    if (action === 'like') {
      await query("UPDATE posts SET likes = likes + 1 WHERE id = $1", [postId]);
    } else {
      await query("UPDATE posts SET likes = GREATEST(0, likes - 1) WHERE id = $1", [postId]);
    }

    const result = await query("SELECT likes FROM posts WHERE id = $1", [postId]);
    return NextResponse.json({ likes: result.rows[0].likes });
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
