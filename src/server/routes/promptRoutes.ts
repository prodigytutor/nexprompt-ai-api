import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, protectedProcedure } from '../../server/trpc';
import prisma from '../../../lib/db';

// Helper to safely parse JSON
const safeJsonParse = (jsonString: string | null | undefined, defaultValue: any = null) => {
  if (!jsonString) return defaultValue;
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    // console.error("Failed to parse JSON:", e); // Optional: log error
    return defaultValue; // Or throw new TRPCError for bad input
  }
};


export const promptRouter = router({
  getPromptById: protectedProcedure
    .input(z.object({ promptId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { promptId } = input;
      const userId = ctx.userId;

      const prompt = await prisma.prompt.findUnique({
        where: { id: promptId },
      });

      if (!prompt) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Prompt with ID ${promptId} not found.`,
        });
      }

      if (prompt.userId !== userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You are not authorized to access this prompt.',
        });
      }
      return prompt;
    }),

  listPrompts: protectedProcedure
    .input(
      z.object({
        take: z.number().int().positive().optional(),
      }).optional() // Make the whole input object optional
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.userId;
      const takeValue = input?.take; // Access take from the optional input object

      const prompts = await prisma.prompt.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' }, // Changed to updatedAt for "recent"
        take: takeValue, // Use the value if provided
      });
      return prompts;
    }),

  updatePrompt: protectedProcedure
    .input(
      z.object({
        promptId: z.string(),
        name: z.string().optional(),
        description: z.string().optional().nullable(),
        promptText: z.string().optional(),
        responseFormat: z.string().optional(),
        parameters: z.any().optional(), // Prisma.JsonValue is tricky with Zod, z.any() is a common approach
        rateLimit: z.number().int().min(0).optional(),
        accessControl: z.any().optional().nullable(), // Same as parameters
        apiKeyRequired: z.boolean().optional(),
        aiProvider: z.string().optional(),
        aiModel: z.string().optional(),
        url: z.string().url().optional().nullable(), // Ensure URL can be null if it's optional
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { promptId, ...updateData } = input;
      const userId = ctx.userId;

      const currentPrompt = await prisma.prompt.findUnique({
        where: { id: promptId },
        include: { versions: { orderBy: { version: 'desc' }, take: 1 } },
      });

      if (!currentPrompt) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Prompt with ID ${promptId} not found.`,
        });
      }

      if (currentPrompt.userId !== userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You are not authorized to update this prompt.',
        });
      }
      
      // Ensure parameters and accessControl are actual JSON objects if they are strings
      // This is more of a server-side guard if client sends stringified JSON
      let finalParameters = updateData.parameters;
      if (typeof updateData.parameters === 'string') {
        finalParameters = safeJsonParse(updateData.parameters, currentPrompt.parameters);
      } else if (updateData.parameters === undefined) {
        finalParameters = currentPrompt.parameters;
      }

      let finalAccessControl = updateData.accessControl;
      if (typeof updateData.accessControl === 'string') {
        finalAccessControl = safeJsonParse(updateData.accessControl, currentPrompt.accessControl);
      } else if (updateData.accessControl === undefined) {
        finalAccessControl = currentPrompt.accessControl;
      }


      const shouldCreateNewVersion =
        (updateData.promptText !== undefined && updateData.promptText !== currentPrompt.promptText) ||
        (finalParameters !== undefined && JSON.stringify(finalParameters) !== JSON.stringify(currentPrompt.parameters));

      if (shouldCreateNewVersion) {
        const latestVersion = currentPrompt.versions[0];
        const newVersionNumber = latestVersion ? latestVersion.version + 1 : 1;

        await prisma.promptVersion.create({
          data: {
            promptId: currentPrompt.id,
            version: newVersionNumber,
            promptText: currentPrompt.promptText,
            parameters: currentPrompt.parameters, // Prisma expects Prisma.JsonValue
          },
        });
      }
      
      // Prepare data for Prisma update, ensuring no undefined values are passed for Json fields
      // if they are not being updated, or they could be set to null if Prisma schema allows.
      // For Json fields, if updateData.field is undefined, it means client didn't send it, so we don't update it.
      // If it's null, client explicitly wants to set it to null (if schema allows).
      const dataToUpdate: any = { ...updateData };
      if (updateData.parameters !== undefined) {
        dataToUpdate.parameters = finalParameters;
      }
      if (updateData.accessControl !== undefined) {
        dataToUpdate.accessControl = finalAccessControl;
      }


      const updatedPrompt = await prisma.prompt.update({
        where: { id: promptId },
        data: {
          ...dataToUpdate,
          updatedAt: new Date(),
        },
      });

      return updatedPrompt;
    }),
});

export type PromptRouter = typeof promptRouter;
