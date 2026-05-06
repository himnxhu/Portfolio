import { portfolioData } from "@/data/portfolio";
import { readJsonBody, RequestBodyTooLargeError } from "@/lib/request";

export const maxDuration = 10;

const CHAT_BODY_LIMIT_BYTES = 4 * 1024;

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
    const candidate = data.candidates[0];
    const parts = candidate?.content?.parts;

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

export async function POST(req: Request) {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  try {
    const { message } = await readJsonBody<{ message?: unknown }>(
      req,
      CHAT_BODY_LIMIT_BYTES
    );
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json({ error: "API Key not configured" }, { status: 500 });
    }

    if (typeof message !== "string" || message.trim().length === 0) {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

    const systemPrompt = `
      You are Nami, the personal AI assistant for ${portfolioData.name}, a ${portfolioData.role}.
      Your goal is to answer questions from recruiters and visitors about ${portfolioData.name}'s portfolio, experience, and projects on his behalf.
      
      Identity:
      - Your name is Nami.
      - You are friendly, intelligent, and helpful.
      
      Context:
      ${JSON.stringify(portfolioData, null, 2)}
      
      Instructions:
      - Speak on behalf of ${portfolioData.name} when appropriate, but maintain your identity as Nami his AI assistant.
      - Be professional, friendly, and concise.
      - If you don't know the answer based on the context, politely say you don't have that information and suggest contacting ${portfolioData.name} directly via the contact section.
      - Highlight key achievements and "Impact Numbers" where available.
      - Mention ${portfolioData.availability} if asked about availability.
    `;

    const controller = new AbortController();
    timeout = setTimeout(() => controller.abort(), 8_000);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: message.slice(0, 1_000) }],
            },
          ],
          generationConfig: {
            maxOutputTokens: 300,
            temperature: 0.4,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        {
          error: "Failed to process chat",
          details: getGeminiError(data),
        },
        { status: 502 }
      );
    }

    const text = getGeminiText(data);

    if (!text) {
      return Response.json({
        text: "I couldn't generate a response right now. Please try again in a moment.",
      });
    }

    return Response.json({ text });
  } catch (error: unknown) {
    if (error instanceof RequestBodyTooLargeError) {
      return Response.json({ error: error.message }, { status: 413 });
    }

    console.error("Chat Error:", error);
    return Response.json({ 
      error: "Failed to process chat", 
      details: getErrorMessage(error),
    }, { status: 500 });
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}
