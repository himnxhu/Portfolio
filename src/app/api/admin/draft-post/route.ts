import { portfolioData } from "@/data/portfolio";
import { readJsonBody, RequestBodyTooLargeError } from "@/lib/request";

export const maxDuration = 20;

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "himanshu@2026";
const DRAFT_BODY_LIMIT_BYTES = 8 * 1024;
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
const GEMINI_TIMEOUT_MS = 20_000;

interface DraftPost {
  title: string;
  excerpt: string;
  content: string;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

function getGeminiText(data: unknown) {
  if (
    typeof data === "object" &&
    data !== null &&
    "candidates" in data &&
    Array.isArray(data.candidates)
  ) {
    const parts = data.candidates[0]?.content?.parts;

    if (Array.isArray(parts)) {
      return parts
        .map((part) => (typeof part?.text === "string" ? part.text : ""))
        .join("")
        .trim();
    }
  }

  return "";
}

function getGeminiError(data: unknown) {
  if (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof data.error === "object" &&
    data.error !== null &&
    "message" in data.error &&
    typeof data.error.message === "string"
  ) {
    return data.error.message;
  }

  return "Gemini request failed";
}

function parseDraft(text: string): DraftPost | null {
  const jsonText = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    const data = JSON.parse(jsonText) as Partial<DraftPost>;

    if (
      typeof data.title === "string" &&
      typeof data.excerpt === "string" &&
      typeof data.content === "string" &&
      data.title.trim() &&
      data.excerpt.trim() &&
      data.content.trim()
    ) {
      return {
        title: data.title.trim().slice(0, 160),
        excerpt: data.excerpt.trim().slice(0, 500),
        content: data.content.trim().slice(0, 30_000),
      };
    }
  } catch {
    return null;
  }

  return null;
}

export async function POST(req: Request) {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  try {
    const { topic, secret } = await readJsonBody<{
      topic?: unknown;
      secret?: unknown;
    }>(req, DRAFT_BODY_LIMIT_BYTES);

    if (secret !== ADMIN_SECRET) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (typeof topic !== "string" || topic.trim().length < 3 || topic.length > 500) {
      return Response.json({ error: "Enter a topic between 3 and 500 characters" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json({ error: "GEMINI_API_KEY is not configured" }, { status: 500 });
    }

    const controller = new AbortController();
    timeout = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: `You are Nami, Himanshu Upadhyay's admin writing assistant. Write polished portfolio blog drafts for ${portfolioData.name}, a ${portfolioData.role}. Return only valid JSON with string fields: title, excerpt, content.`,
              },
            ],
          },
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Create a blog post draft about: ${topic.trim()}\n\nRequirements:\n- title: clear, specific, under 90 characters\n- excerpt: 1-2 sentence hook, under 260 characters\n- content: 700-1000 words, practical, professional, written in first person where natural\n- Use headings and short paragraphs\n- Mention AI/data/application development only when relevant\n- Do not invent fake company names, certifications, metrics, or client claims\n- Return JSON only, no markdown fence`,
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            maxOutputTokens: 1800,
            temperature: 0.55,
            thinkingConfig: {
              thinkingBudget: 0,
            },
          },
        }),
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return Response.json(
        { error: "Failed to generate draft", details: getGeminiError(data) },
        { status: 502 }
      );
    }

    const draft = parseDraft(getGeminiText(data));

    if (!draft) {
      return Response.json(
        { error: "Failed to parse generated draft" },
        { status: 502 }
      );
    }

    return Response.json(draft);
  } catch (error: unknown) {
    if (error instanceof RequestBodyTooLargeError) {
      return Response.json({ error: error.message }, { status: 413 });
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      return Response.json(
        { error: "Draft generation timed out", details: "Gemini did not respond in time." },
        { status: 504 }
      );
    }

    return Response.json(
      { error: "Failed to generate draft", details: getErrorMessage(error) },
      { status: 500 }
    );
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}
