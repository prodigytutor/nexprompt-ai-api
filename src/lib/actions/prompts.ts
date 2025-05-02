'use server'

import prisma from '@/lib/db'
import { Prompt, Prisma } from '@prisma/client' // Import necessary types

// Define interfaces for input data for clarity, though inline objects are also fine
interface CreatePromptData {
  userId: string;
  name: string;
  description?: string | null; // Optional fields marked with ? and allow null
  promptText: string;
  responseFormat?: string; // Optional with default in schema
  parameters: Prisma.JsonObject;
  rateLimit?: number;      // Optional with default in schema
  accessControl?: Prisma.JsonObject | null;
  apiKeyRequired?: boolean; // Optional with default in schema
  aiProvider?: string;     // Optional with default in schema
  aiModel: string;
}

interface UpdatePromptData {
  name?: string;
  description?: string | null;
  promptText?: string;
  responseFormat?: string;
  parameters?: Prisma.JsonObject;
  rateLimit?: number;
  accessControl?: Prisma.JsonObject | null;
  apiKeyRequired?: boolean;
  aiProvider?: string;
  aiModel?: string;
}


export async function createPrompt(data: CreatePromptData): Promise<Prompt> {
  const newPrompt = await prisma.prompt.create({
    data: {
      userId: data.userId,
      name: data.name,
      description: data.description,
      promptText: data.promptText,
      responseFormat: data.responseFormat, // Will use default if undefined
      parameters: data.parameters,
      rateLimit: data.rateLimit,          // Will use default if undefined
      accessControl: data.accessControl,
      apiKeyRequired: data.apiKeyRequired, // Will use default if undefined
      aiProvider: data.aiProvider,         // Will use default if undefined
      aiModel: data.aiModel,
    },
  })
  return newPrompt
}

export async function updatePrompt(promptId: string, userId: string, data: UpdatePromptData): Promise<Prompt> {
  const prompt = await prisma.prompt.findUniqueOrThrow({
    where: { id: promptId },
  })

  if (prompt.userId !== userId) {
    throw new Error('Unauthorized: You do not own this prompt')
  }

    // --- Create a version before updating ---

    // Optional: Check if versionable fields are changing
    // const isTextChanged = data.promptText !== undefined && data.promptText !== prompt.promptText;
    // const isParamsChanged = data.parameters !== undefined && JSON.stringify(data.parameters) !== JSON.stringify(prompt.parameters);

    // if (isTextChanged || isParamsChanged) { // Only create version if relevant fields change

        // Find the latest version number
        const latestVersion = await prisma.promptVersion.findFirst({
            where: { promptId: promptId },
            orderBy: { version: 'desc' },
            select: { version: true } // Only select the version number
        });
        const nextVersionNumber = (latestVersion?.version ?? 0) + 1;

        // Create the new version record using the *current* prompt state
        try {
             await prisma.promptVersion.create({
                data: {
                    promptId: prompt.id,
                    version: nextVersionNumber,
                    promptText: prompt.promptText, // Data before update
                    parameters: prompt.parameters, // Data before update
                    // Add other fields from 'prompt' if needed for version history
                },
            });
        } catch (versionError) {
            // Handle potential errors during version creation (e.g., log it)
            // Decide if the main update should proceed if versioning fails
            console.error(`Failed to create version ${nextVersionNumber} for prompt ${promptId}:`, versionError);
            // Depending on requirements, you might re-throw the error or allow the update to continue
        }
    // } // End optional check block

    // --- Proceed with the update ---
  const updatedPrompt = await prisma.prompt.update({
    where: { id: promptId },
    data: data, // Pass the update data object directly
  })
  return updatedPrompt
}

export async function deletePrompt(promptId: string, userId: string): Promise<Prompt> {
   const prompt = await prisma.prompt.findUniqueOrThrow({
    where: { id: promptId },
  })

  if (prompt.userId !== userId) {
    throw new Error('Unauthorized: You do not own this prompt')
  }

  const deletedPrompt = await prisma.prompt.delete({
    where: { id: promptId },
  })
  return deletedPrompt
}

// Function to get prompts for a specific user (useful for the dashboard)
export async function getPromptsForUser(userId: string): Promise<Prompt[]> {
  const prompts = await prisma.prompt.findMany({
    where: { userId: userId },
    orderBy: { createdAt: 'desc' }, // Optional: order by creation date
  });
  return prompts;
}