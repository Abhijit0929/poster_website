import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { SYSTEM_PROMPT } from "../../../lib/knowledge-base";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "messages array is required" },
        { status: 400 }
      );
    }

    const chatCompletion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const content =
      chatCompletion.choices[0]?.message?.content ||
      "Sorry, I could not generate a response.";

    return NextResponse.json({
      message: content,
    });
  } catch (error) {
    console.error("Groq API Error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate response",
      },
      { status: 500 }
    );
  }
}