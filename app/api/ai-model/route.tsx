import Constants from "@/data/Constants";
import { db } from "@/configs/db";
import { WireframeToCodeTable } from "@/configs/schema";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai"
const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_AI_API_KEY,

})
export const maxDuration = 300;

export async function POST(req: NextRequest) {
    const authUser = await getAuthUser(req);
    if (!authUser) return unauthorized();

    // The prompt is built on the server from the user's own saved record,
    // so this route cannot be used as an open proxy to the AI provider.
    const { uid } = await req.json();
    const records = await db.select().from(WireframeToCodeTable)
        .where(and(
            eq(WireframeToCodeTable.uid, uid),
            eq(WireframeToCodeTable.createdBy, authUser.email)
        ));
    const record = records[0];
    if (!record) {
        return NextResponse.json({ error: 'No Record Found' }, { status: 404 });
    }

    const ModelObj = Constants.AiModelList.find(item => item.name == record.model)
    const modelName = ModelObj?.modelName;
    const response = await openai.chat.completions.create({
        model: modelName ?? 'google/gemini-2.0-pro-exp-02-05:free',
        stream: true,
        messages: [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": record.description + ":" + Constants.PROMPT
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": record.imageUrl ?? ''
                        }
                    }
                ]
            }
        ]
    });

    // Create a readable stream to send data in real-time
    const stream = new ReadableStream({
        async start(controller) {
            for await (const chunk of response) {
                const text = chunk.choices?.[0]?.delta?.content || "";
                controller.enqueue(new TextEncoder().encode(text)); // Send data chunk
            }
            controller.close(); // End stream
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
        },
    });

}
