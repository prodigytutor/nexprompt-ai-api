"use client"
import { useState } from 'react';
import axios from 'axios';
import { z } from 'zod';
import { createPrompt, createPromptData } from '@/lib/actions/prompts';
import { comma } from 'postcss/lib/list';

export default function PromptEditor() {
  const [name, setName] = useState('');
  const [promptText, setPromptText] = useState('');
  const [parameters, setParameters] = useState('');
  const [responseFormat, setResponseFormat] = useState('json');
  const [customDomain, setCustomDomain] = useState('');
  const [rateLimit, setRateLimit] = useState('');
  const [accessControl, setAccessControl] = useState('');
  const [apiKeyRequired, setApiKeyRequired] = useState(false);
  const [aiModel, setAiModel] = useState('');
  const [aiProvider, setAiProvider] = useState('');
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const promptSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    promptText: z.string().min(1, "Prompt text is required"),
    parameters: z.string().refine((val) => {
      try {
        JSON.parse(val);
        return true;
      } catch {
        return false;
      }
    }, "Parameters must be a valid JSON string"),
    responseFormat: z.enum(["json", "text"]),
    url: z.string().url("Must be a valid URL").optional(),
    customDomain: z.string().optional(),
    rateLimit: z.number().int().positive().optional(),
    accessControl: z.string().optional(),
    apiKeyRequired: z.boolean(),
    aiModel: z.string().optional(),
    aiProvider: z.string().optional(),
    userId: z.string().optional(),
  });

  const handleSave = async () => {
    try {
      const formData = {
        name,
        promptText,
        parameters,
        responseFormat,
        url,
        customDomain,
        rateLimit: rateLimit ? parseInt(rateLimit, 10) : undefined,
        accessControl,
        apiKeyRequired,
        aiModel,
        aiProvider,
        userId: "defaultUserId", // Provide a non-undefined default string value for userId
      };

      const validatedData = promptSchema.parse(formData);

      const oData = await createPrompt(validatedData);
      alert('Prompt saved successfully!');
    } catch (error) {
      if (error instanceof z.ZodError) {
        alert(`Validation Error: ${error.errors.map((err) => err.message).join(', ')}`);
      } else {
        alert('An unexpected error occurred.');
      }
    }
  };



  // const handleSave = async () => {
  //   await axios.post('/api/prompts', {
  //     name,
  //     promptText,
  //     parameters: JSON.parse(parameters),
  //     responseFormat,
  //   });
  //   alert('Prompt saved successfully!');
  // };

  return (
    <div>
      <div>
        <h2>Edit Prompt</h2>
        <div>
          <label>
            Prompt Name:
            <input
              type="text"
              placeholder="Prompt Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Prompt Text:
            <textarea
              placeholder="Prompt Text"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Parameters:
            <textarea
              placeholder='Parameters ({"var1": "value"})'
              value={parameters}
              onChange={(e) => setParameters(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Response Format:
            <select
              value={responseFormat}
              onChange={(e) => setResponseFormat(e.target.value)}
            >
              <option value="json">JSON</option>
              <option value="text">Text</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            URL:
            <input
              type="text"
              placeholder="URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Custom Domain:
            <input
              type="text"
              placeholder="Custom Domain"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Rate Limit:
            <input
              type="number"
              placeholder="Rate Limit"
              value={rateLimit}
              onChange={(e) => setRateLimit(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Access Control:
            <input
              type="text"
              placeholder="Access Control"
              value={accessControl}
              onChange={(e) => setAccessControl(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            API Key Required:
            <select
              value={apiKeyRequired.toString()}
              onChange={(e) => setApiKeyRequired(e.target.value === "true")}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            AI Model:
            <input
              type="text"
              placeholder="AI Model"
              value={aiModel}
              onChange={(e) => setAiModel(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            AI Provider:
            <input
              type="text"
              placeholder="AI Provider"
              value={aiProvider}
              onChange={(e) => setAiProvider(e.target.value)}
            />
          </label>
        </div>
        <div>
          <button onClick={handleSave}>Save Prompt</button>
        </div>
      </div>
      <div>
        <input type="text" placeholder="Prompt Name" value={name} onChange={(e) => setName(e.target.value)} />
        <textarea placeholder="Prompt Text" value={promptText} onChange={(e) => setPromptText(e.target.value)} />
        <textarea placeholder='Parameters ({"var1": "value"})' value={parameters} onChange={(e) => setParameters(e.target.value)} />
        <select value={responseFormat} onChange={(e) => setResponseFormat(e.target.value)}>
          <option value="json">JSON</option>
          <option value="text">Text</option>
        </select>
        <button onClick={handleSave}>Save Prompt</button>
      </div>
    </div>
  );
}