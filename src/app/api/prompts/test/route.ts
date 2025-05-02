import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import OpenAI from 'openai';

export async function POST(request: Request) {
  try {
    // --- Authentication ---
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // --- Parse Request Body ---
    let body;
    try {
        body = await request.json();
    } catch (e) {
        return new NextResponse("Invalid JSON body", { status: 400 });
    }

    const { promptText, aiProvider = 'openai', aiModel, inputs } = body;

    // --- Validation ---
    if (!promptText || !aiModel || !inputs) {
      // Use the exact error message specified
      return new NextResponse("Missing required fields", { status: 400 });
    }
    if (typeof inputs !== 'object' || inputs === null) {
      // Use the exact error message specified (although previous was similar)
      return new NextResponse("Field 'inputs' must be an object", { status: 400 });
    }

    // --- Environment Variable Check ---
    if (aiProvider === 'openai' && !process.env.OPENAI_API_KEY) { // Check only if using OpenAI
      console.error("OpenAI API key not configured");
      // Use the exact error message specified
      return new NextResponse("OpenAI API key not configured", { status: 500 });
    }
    // TODO: Add checks for other potential provider API keys if implemented

    // --- Interpolation (using for...in loop as specified) ---
    let interpolatedPrompt = promptText;
    for (const key in inputs) {
        // Create a RegExp for each key to find {{ key }} with optional whitespace
        const placeholder = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        // Replace occurrences with the string version of the input value
        interpolatedPrompt = interpolatedPrompt.replace(placeholder, String(inputs[key] ?? '')); // Replace null/undefined with empty string
    }

    // Optional: Check if any placeholders remain unreplaced
    const remainingPlaceholderRegex = /{{\s*\w+\s*}}/;
    if (remainingPlaceholderRegex.test(interpolatedPrompt)) {
        console.warn("Warning: Some placeholders may remain unreplaced in the prompt.");
        // Decide if this should be an error or just a warning
    }


    // --- AI Call (OpenAI Example) ---
    if (aiProvider === 'openai') {
      try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const completion = await openai.chat.completions.create({
          model: aiModel,
          messages: [{ role: 'user', content: interpolatedPrompt }],
          // Add other parameters like temperature, max_tokens if needed
        });
        const result = completion.choices[0]?.message?.content;

        return NextResponse.json({ response: result });

      } catch (error) {
        // Use the exact error handling specified
        console.error("AI API call failed:", error);
        return new NextResponse("Failed to get response from AI provider", { status: 500 });
      }
    } else {
      // Use the exact error handling specified
      return new NextResponse(`Unsupported AI provider: ${aiProvider}`, { status: 400 });
    }

  } catch (error) {
    // General error handling
    console.error("[PROMPT_TEST_API_ERROR]", error);
    if (error instanceof SyntaxError) { // Handle JSON parsing errors from request body
        return new NextResponse("Invalid request body: Failed to parse JSON.", { status: 400 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
