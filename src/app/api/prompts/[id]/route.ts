import { NextResponse } from "next/server"
import db from "@/lib/db"
import { auth } from "@clerk/nextjs"
export async function POST(req: Request) {

    try {
        const body = await req.json()
        const { messages } = body
    
        if (!messages) {
        return new Response("Messages are required", { status: 400 })
        }
    
        // const response = await openai.chat.completions.create({
        //   model: "gpt-4-1106-preview",
        //   messages,
        // })
    
        // return NextResponse.json(response.choices[0].message)
    } catch (error) {
        console.log("[PROMPT_ERROR]", error)
        return new Response("Internal Error", { status: 500 })
    }
    }
 export async function GET(req: Request) {
    try {
       // const { userId } = auth()
        const { searchParams } = new URL(req.url)
        const promptId = searchParams.get("id")
        const locale = searchParams.get("locale")
        const prompt = await db.prompt.findFirst({
            where: {
                id: promptId,
                locale: locale,
            },
        })
        if (!prompt) {
            return new Response("Prompt not found", { status: 404 })
        }
        return NextResponse.json(prompt)    
    } catch (error) {   
        console.log("[PROMPT_ERROR]", error)
        return new Response("Internal Error", { status: 500 })
    }
}
// export async function DELETE(req: Request) {