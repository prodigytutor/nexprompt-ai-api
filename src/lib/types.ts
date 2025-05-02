export interface Parameter {
  name: string;
  type: 'string' | 'number' | 'boolean';
  required: boolean;
  description: string;
}


import { Prisma } from '@prisma/client'; // Import Prisma namespace for JsonObject

/**
 * Represents the structure of a Prompt object, aligning with the Prisma model.
 */
export interface Prompt {
  id: string;                 // Unique identifier
  userId: string;             // ID of the user who owns the prompt
  name: string;               // Name of the prompt
  description: string | null;   // Optional description
  promptText: string;         // The main text of the prompt
  responseFormat: string;     // Default 'json', but could be other formats
  parameters: Prisma.JsonObject; // JSON object for parameters
  rateLimit: number;          // Default 100
  accessControl: Prisma.JsonObject | null; // JSON object for access control, optional
  apiKeyRequired: boolean;    // Default true
  aiProvider: string;         // Default 'openai'
  aiModel: string;            // AI model identifier (e.g., 'gpt-3.5-turbo')
  createdAt: Date;            // Timestamp of creation
  updatedAt: Date;            // Timestamp of last update
  // Note: Relations like 'versions' and 'logs' are typically not included
  // directly in the type definition unless needed for specific component logic.
}