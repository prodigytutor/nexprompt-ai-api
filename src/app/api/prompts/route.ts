import { NextResponse } from "next/server"
import db from "@/lib/db"
import {createPrompt, createPromptData}  from "@/lib/actions/prompts"
import { auth, currentUser } from '@clerk/nextjs/server'
import getPromp from "next/dist/build/webpack-config"
import { getPromptsForUser } from "@/lib/actions/prompts"
export async function POST(req: Request) {
     const { userId } = await auth()
     if (!userId) {
         return new Response("Unauthorized", { status: 401 })
     }
    try {
        const body = await req.json()
        const { cpd: createPromptData } = body
    
        if (!cpd) {
        return new Response("Prompt data is required", { status: 400 })
        }
        const newPrompt = createPrompt( {data: createPromptData})
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
    const { userId } = await auth()
    if (!userId) {
        return new Response("Unauthorized", { status: 401 })
    }
    try {
       // const { userId } = auth()
       console.log("User ID: {in the get code", userId)  
        const prompt = await getPromptsForUser(userId) //await db.prompt.findMany()
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