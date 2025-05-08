// src/lib/schemas/apiKey.ts
import { z } from 'zod';

// Base schema for API Key properties
export const APIKeyBaseSchema = z.object({
  description: z.string().max(255).optional().nullable(),
  isActive: z.boolean().default(true),
  expiresAt: z.date().optional().nullable(),
});

// Schema for creating an API Key (input)
// We don't include prefix or hashedKey as they are generated server-side
export const APIKeyCreateSchema = APIKeyBaseSchema;

// Schema for API Key data retrieved from DB (includes generated fields)
export const APIKeyDBSchema = APIKeyBaseSchema.extend({
  id: z.string().uuid(),
  prefix: z.string(), // First few characters of the key, safe to display
  hashedKey: z.string(), // The hashed version of the key, NEVER return to client
  createdAt: z.date(),
  lastUsedAt: z.date().optional().nullable(),
});

// Schema for API Key data returned to the client (omits sensitive info)
export const APIKeyReadSchema = APIKeyDBSchema.omit({ hashedKey: true });

// Special schema to include the actual generated API key ONCE upon creation
export const APIKeyCreateResponseSchema = APIKeyReadSchema.extend({
  apiKey: z.string().describe("The actual generated API key. Store this securely as it will not be shown again."),
});

export type APIKeyCreateInput = z.infer<typeof APIKeyCreateSchema>;
export type APIKeyReadOutput = z.infer<typeof APIKeyReadSchema>;
export type APIKeyCreateResponseOutput = z.infer<typeof APIKeyCreateResponseSchema>;
