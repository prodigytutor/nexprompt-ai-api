'use server'

import prisma from '@/lib/db';
import { Prompt } from '../../../generated/prisma';
// Define the CreatePromptData type
export type createPromptData = {
  userId: string;
  name: string;
  description: string;
  promptText: string;
  responseFormat: string;
  parameters: string;
  rateLimit: number;
  accessControl: string;
  apiKeyRequired: boolean;
  aiProvider: string;
  aiModel: string;
  url: string;
};

// Utility function to check prompt ownership
async function verifyPromptOwnership(promptId: string, userId: string): Promise<Prompt> {
  const prompt = await prisma.prompt.findUnique({
    where: { id: promptId },
  });

  if (!prompt) {
    throw new Error(`Prompt with ID ${promptId} not found`);
  }

  if (prompt.userId !== userId) {
    throw new Error('Unauthorized: You do not own this prompt');
  }

  return prompt;
}

// Create a new prompt
export async function createPrompt(data: createPromptData): Promise<Prompt> {
  try {
    const newPrompt = await prisma.prompt.create({
      data: {
        userId: data.userId,
        name: data.name,
        description: data.description,
        promptText: data.promptText,
        responseFormat: data.responseFormat,
        parameters: data.parameters,
        rateLimit: data.rateLimit,
        accessControl: data.accessControl,
        apiKeyRequired: data.apiKeyRequired,
        aiProvider: data.aiProvider,
        aiModel: data.aiModel,
        url: data.url, // Add a valid URL value here
      },
    });
    return newPrompt;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create prompt: ${error.message}`);
    } else {
      throw new Error('Failed to create prompt: Unknown error');
    }
  }
}

// Update an existing prompt
export async function updatePrompt(promptId: string, userId: string, data: createPromptData): Promise<Prompt> {
  await verifyPromptOwnership(promptId, userId);

  try {
    const updatedPrompt = await prisma.prompt.update({
      where: { id: promptId },
      data: data,
    });
    return updatedPrompt;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update prompt: ${error.message}`);
    } else {
      throw new Error('Failed to update prompt: Unknown error');
    }
  }
}

// Delete a prompt
export async function deletePrompt(promptId: string, userId: string): Promise<Prompt> {
  await verifyPromptOwnership(promptId, userId);

  try {
    const deletedPrompt = await prisma.prompt.delete({
      where: { id: promptId },
    });
    return deletedPrompt;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete prompt: ${error.message}`);
    } else {
      throw new Error('Failed to delete prompt: Unknown error');
    }
  }
}

// Get all prompts for a specific userring, data: UpdatePromptData): Promise<Prompt> {
export async function getPromptsForUser(userId: string): Promise<Prompt[]> {
  try {
    console.log("User ID: {in the server action}", userId);
    const prompts = await prisma.prompt.findMany();
    return prompts;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch prompts: ${error.message}`);
    } else {
      throw new Error('Failed to fetch prompts: Unknown error');
    }
  }
}