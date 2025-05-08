
// src/lib/schemas/prompt.ts
import { z } from 'zod';

// Base schema for Prompt Template properties
export const PromptTemplateBaseSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long").max(255),
  description: z.string().optional().nullable(),
  promptText: z.string().min(10, "Prompt text must be at least 10 characters long"),
  modelProvider: z.string().min(1, "Model provider is required").max(50), // e.g., 'openai', 'anthropic'
  modelName: z.string().min(1, "Model name is required").max(100), // e.g., 'gpt-4o'
  modelParameters: z.record(z.any()).default({}).describe("JSON object for model parameters like temperature, max_tokens"), // Allows any JSON structure
  isActive: z.boolean().default(true),
  slug: z.string()
    .max(100)
    .regex(/^[a-zA-Z0-9_-]+$/, "Slug can only contain alphanumeric characters, underscores, and hyphens")
    .transform(val => val.toLowerCase()) // Convert slug to lowercase
    .optional()
    .describe("Optional URL-friendly identifier. If not provided, one will be generated."),
});

// Schema for creating a new Prompt Template (input)
export const PromptTemplateCreateSchema = PromptTemplateBaseSchema;

// Schema for updating an existing Prompt Template (input - all fields optional)
export const PromptTemplateUpdateSchema = PromptTemplateBaseSchema.partial().extend({
  // Slug update is typically handled carefully or disallowed once set.
  // For this schema, we allow it to be part of the partial update.
  // If you want to disallow slug updates, omit it here or handle it in the API logic.
});

// Schema for Prompt Template data retrieved from DB (includes generated fields)
export const PromptTemplateDBSchema = PromptTemplateBaseSchema.extend({
  id: z.string().uuid(),
  slug: z.string(), // Slug becomes mandatory and non-optional in the DB/response
  createdAt: z.date(),
  updatedAt: z.date(),
  // userId: z.string().uuid().optional().nullable(), // If linking to users
});

// Schema for Prompt Template data returned to the client
export const PromptTemplateReadSchema = PromptTemplateDBSchema;

export type PromptTemplateCreateInput = z.infer<typeof PromptTemplateCreateSchema>;
export type PromptTemplateUpdateInput = z.infer<typeof PromptTemplateUpdateSchema>;
export type PromptTemplateReadOutput = z.infer<typeof PromptTemplateReadSchema>;


// Schemas for the /run/{slug} endpoint
export const ExecutionRequestSchema = z.object({
  variables: z.record(z.any()).describe("Key-value pairs for template variables"),
  // overrideParameters: z.record(z.any()).optional().describe("Optional: Override model parameters at runtime"),
});

export const ExecutionResponseSchema = z.object({
  result: z.any().describe("The AI's response (can be string or structured JSON)"),
  status: z.enum(["success", "error"]).default("success"),
  modelUsed: z.string(),
  promptUsed: z.string().optional().describe("The actual prompt sent to the model (for debugging)"),
  usage: z.record(z.number()).optional().describe("e.g., { prompt_tokens: 100, completion_tokens: 250 }"),
  errorDetails: z.string().optional().nullable(),
});

export type ExecutionRequestInput = z.infer<typeof ExecutionRequestSchema>;
export type ExecutionResponseOutput = z.infer<typeof ExecutionResponseSchema>;

