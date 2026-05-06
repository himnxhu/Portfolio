import { GoogleGenerativeAI } from "@google/generative-ai";
import { portfolioData } from "@/data/portfolio";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return Response.json({ error: "API Key not configured" }, { status: 500 });
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

    // Modern way to set system instructions for Gemini 2.0
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent(message);
    const response = result.response;
    const text = response.text();

    return Response.json({ text });
  } catch (error: any) {
    console.error("Chat Error:", error);
    return Response.json({ 
      error: "Failed to process chat", 
      details: error.message,
      status: error.status 
    }, { status: 500 });
  }
}
