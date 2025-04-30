export interface Parameter {
  name: string;
  type: 'string' | 'number' | 'boolean';
  required: boolean;
  description: string;
}

export interface PromptData {
  id: string;
  name: string;
  description: string;
  promptText: string;
  responseFormat: 'json' | 'text' | 'markdown';
  aiProvider: string;
  aiModel: string;
  parameters: Parameter[];
  rateLimit: number;
  apiKeyRequired: boolean;
  accessControl: any;
  promptTemplate: string; // Added this property
}