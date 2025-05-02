import { NextResponse } from 'next/server';
import prisma from '@/lib/db'; // Assuming prisma client setup
import OpenAI from 'openai';
import { Prompt, ApiKey } from '@prisma/client'; // Import types

export async function POST(
    request: Request,
    { params }: { params: { promptId: string } }
) {
    const startTime = Date.now(); // Record start time for analytics

    try {
        // --- Get Prompt ID ---
        const { promptId } = params;
        if (!promptId) {
            return new NextResponse("Prompt ID is required", { status: 400 });
        }

        // --- Fetch Prompt ---
        const prompt: Prompt | null = await prisma.prompt.findUnique({
            where: { id: promptId },
        });

        if (!prompt) {
            return new NextResponse("Prompt not found", { status: 404 });
        }

        // --- API Key Authentication ---
        let apiKeyUserId: string | null = null; // To potentially associate logs with API key user
        if (prompt.apiKeyRequired) {
            const authHeader = request.headers.get('Authorization');
            const apiKey = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null; // Check format

            if (!apiKey) {
                return new NextResponse("API key required", { status: 401 });
            }

            const dbKey: ApiKey | null = await prisma.apiKey.findUnique({
                where: { key: apiKey },
            });

            // Validate the key - add expiry/status checks as needed
            // TODO: Add more robust key validation (expiry, status, potentially user matching if required)
            if (!dbKey /* || (dbKey.expiresAt && dbKey.expiresAt < new Date()) */) {
                // Use the exact error message specified
                return new NextResponse("Invalid API key", { status: 403 });
            }
            apiKeyUserId = dbKey.userId; // Store for potential logging
        }

        // --- Rate Limiting (Placeholder) ---
        // TODO: Implement rate limiting based on prompt.rateLimit and dbKey.userId or prompt.userId
        console.log(`TODO: Implement rate limiting for prompt ${promptId}`);

        // --- Parse Body ---
        let inputs: Record<string, any>;
        try {
            inputs = await request.json();
        } catch (e) {
            return new NextResponse("Invalid JSON request body", { status: 400 });
        }

        // --- Input Validation ---
        // Basic check example: Ensure 'inputs' is an object
        if (typeof inputs !== 'object' || inputs === null) {
            // Use the exact error message specified
            return new NextResponse("Invalid input format", { status: 400 });
        }
        // TODO: Implement robust validation of 'inputs' against 'prompt.parameters' schema


        // --- Interpolation ---
        let interpolatedPrompt = prompt.promptText;
        try {
            for (const key in inputs) {
                // Use RegExp to find placeholders like {{ key }} or {{key}}
                const placeholder = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
                // Optional: Warn if input key doesn't match any placeholder
                // if (!interpolatedPrompt.match(placeholder)) {
                //    console.warn(`Input key "${key}" not found in prompt template.`);
                // }
                // Replace occurrences with the string version of the input value
                interpolatedPrompt = interpolatedPrompt.replace(placeholder, String(inputs[key] ?? '')); // Handle null/undefined
            }
             // Optional: check if placeholders remain after interpolation
            if (interpolatedPrompt.match(/{{\s*.*\s*}}/)) {
               console.warn(`Prompt ${promptId}: Unreplaced placeholders remain.`);
               // Depending on strictness, might throw error:
               // throw new Error("Missing required inputs for prompt template");
            }
        } catch (error) {
             console.error(`Prompt ${promptId}: Failed to interpolate prompt`, error);
             // Use the exact error message specified
             return new NextResponse("Failed to interpolate prompt", { status: 400 });
        }

        // --- AI Call (OpenAI Example) ---
        let aiResult: string | null = null;
        try {
            if (prompt.aiProvider === 'openai') {
                if (!process.env.OPENAI_API_KEY) {
                    console.error(`OpenAI API key not configured for prompt ${promptId}`);
                    return new NextResponse("AI provider key not configured", { status: 500 });
                }
                const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
                const completion = await openai.chat.completions.create({
                    model: prompt.aiModel,
                    messages: [{ role: 'user', content: interpolatedPrompt }],
                    // TODO: Consider adding parameters from prompt.parameters if applicable
                });
                aiResult = completion.choices[0]?.message?.content;

            } else {
                // Handle other providers or throw error
                console.warn(`Prompt ${promptId}: Unsupported AI provider requested: ${prompt.aiProvider}`);
                return new NextResponse(`Unsupported AI provider: ${prompt.aiProvider}`, { status: 400 });
            }
        } catch (error) {
            console.error(`Prompt ${promptId}: AI API call failed for provider ${prompt.aiProvider}:`, error);
            // Use the exact error message specified
            return new NextResponse("Failed to get response from AI provider", { status: 500 });
        }

        // --- Analytics Logging & Response Formatting ---
        const durationMs = Date.now() - startTime;
        let responseData: any; // To store the data we'll log
        let finalResponse: NextResponse; // To store the response to send back

        if (prompt.responseFormat === 'json') {
            try {
                if (aiResult === null || aiResult.trim() === '') {
                    throw new Error("AI response was empty or null.");
                }
                responseData = JSON.parse(aiResult); // Parse first
                finalResponse = NextResponse.json(responseData); // Prepare successful JSON response
            } catch (e) {
                console.error(`Prompt ${promptId}: Failed to parse AI response as JSON. Raw response: ${aiResult}`, e);
                // Log the raw result with an error flag
                responseData = { rawResult: aiResult, error: "Failed to parse as JSON" };
                // Prepare the error response for the client
                finalResponse = new NextResponse("AI response was not valid JSON", { status: 500 });

                // Log the failure immediately before returning the error response
                 try {
                     await prisma.analyticsLog.create({
                         data: {
                             promptId: prompt.id,
                             requestBody: inputs as Prisma.JsonObject,
                             response: responseData as Prisma.JsonObject, // Log the error structure
                             durationMs: durationMs,
                             // userId: apiKeyUserId, // Uncomment if userId is added to schema
                         },
                     });
                 } catch (logError) {
                     console.error(`Failed to log analytics error for prompt ${promptId}:`, logError);
                 }
                 return finalResponse; // Return error to client
            }
        } else {
            // Handle 'text', 'markdown' etc. - return raw string content wrapped in a standard object
             return NextResponse.json({ response: aiResult });
            // Or return raw text:
            // return new NextResponse(aiResult ?? '', { status: 200, headers: { 'Content-Type': 'text/plain' } });
        }

        // Log successful request or parsed JSON failure (which was handled above)
        try {
             await prisma.analyticsLog.create({
                 data: {
                     promptId: prompt.id,
                     requestBody: inputs as Prisma.JsonObject,
                     response: responseData as Prisma.JsonObject, // Log the successful data or parse failure info
                     durationMs: durationMs,
                     // Optionally add apiKeyUserId if available and needed for logging
                     // userId: apiKeyUserId, // Uncomment if you add userId to AnalyticsLog model
                 },
             });
         } catch (logError) {
             // Avoid crashing the main request if logging fails
             console.error(`Failed to log analytics for prompt ${promptId}:`, logError);
         }

        return finalResponse; // Return the successful response

    } catch (error) {
        console.error(`[API_RUN_PROMPT_ERROR] PromptID: ${params?.promptId}`, error);
         if (error instanceof SyntaxError) { // Handle JSON parsing errors from request body
            return new NextResponse("Invalid request body: Failed to parse JSON.", { status: 400 });
        }
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
