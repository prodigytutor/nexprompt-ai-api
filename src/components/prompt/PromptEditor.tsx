"use client"
import React, { useState, useEffect } from 'react';
import { trpc } from '@/app/_trpc/client'; 
// It's good practice to import the actual Prisma types if you need to reference them.
// For form state, we can define a local type or rely on inference.
// import type { Prompt } from '../../../generated/prisma/client'; 

interface PromptEditorProps {
  promptId: string;
}

// Define a type for the form state, matching Prompt model fields more closely
type PromptFormState = {
  name: string;
  description: string | null;
  promptText: string;
  responseFormat: string;
  parameters: string; // Store as JSON string for textarea
  rateLimit: number;
  accessControl: string; // Store as JSON string for textarea
  apiKeyRequired: boolean;
  aiProvider: string;
  aiModel: string;
  url: string | null;
};

export default function PromptEditor({ promptId }: PromptEditorProps) {
  const [formState, setFormState] = useState<PromptFormState>({
    name: '',
    description: '',
    promptText: '',
    responseFormat: 'json',
    parameters: '{}',
    rateLimit: 100, // Default value
    accessControl: '{}',
    apiKeyRequired: true, // Default value
    aiProvider: 'openai', // Default value
    aiModel: '',
    url: '',
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // For success messages

  // tRPC hooks
  const { data: promptData, isLoading: isLoadingPrompt, error: fetchError, refetch: refetchPrompt } = trpc.prompts.getPromptById.useQuery(
    { promptId },
    { enabled: !!promptId } // Only run query if promptId is available
  );

  const updatePromptMutation = trpc.prompts.updatePrompt.useMutation({
    onSuccess: () => {
      if (refetchPrompt) refetchPrompt();
      setSuccessMessage('Prompt saved successfully!');
      setErrorMessage(null); // Clear any previous errors
      setTimeout(() => setSuccessMessage(null), 3000); // Clear success message after 3 seconds
    },
    onError: (error: any) => {
      const message = error.data?.message || error.message || 'Failed to save prompt.';
      setErrorMessage(message);
      setSuccessMessage(null); // Clear any previous success messages
    }
  });

  useEffect(() => {
    if (promptData) {
      setFormState({
        name: promptData.name || '',
        description: promptData.description || null, 
        promptText: promptData.promptText || '',
        responseFormat: promptData.responseFormat || 'json',
        parameters: promptData.parameters ? JSON.stringify(promptData.parameters, null, 2) : '{}',
        rateLimit: promptData.rateLimit === null ? 100 : promptData.rateLimit,
        accessControl: promptData.accessControl ? JSON.stringify(promptData.accessControl, null, 2) : '{}',
        apiKeyRequired: promptData.apiKeyRequired === null ? true : promptData.apiKeyRequired,
        aiProvider: promptData.aiProvider || 'openai',
        aiModel: promptData.aiModel || '',
        url: promptData.url || null, 
      });
    }
  }, [promptData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormState(prev => ({ ...prev, [name]: checked }));
    } else {
        // For number fields, convert explicitly
        if (name === "rateLimit") {
            setFormState(prev => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
        } else {
            setFormState(prev => ({ ...prev, [name]: value }));
        }
    }
  };

  const handleSave = async () => {
    setErrorMessage(null);
    setSuccessMessage(null); // Clear previous success messages on new save attempt
    let parsedParameters: any;
    let parsedAccessControl: any;

    try {
      parsedParameters = JSON.parse(formState.parameters || '{}'); // Default to empty object if string is empty
    } catch (error) {
      setErrorMessage('Invalid JSON in Parameters field. Please provide a valid JSON object.');
      return;
    }

    try {
      parsedAccessControl = JSON.parse(formState.accessControl || '{}'); // Default to empty object if string is empty
    } catch (error) {
      setErrorMessage('Invalid JSON in Access Control field. Please provide a valid JSON object.');
      return;
    }

    const payload = {
      promptId,
      name: formState.name,
      description: formState.description,
      promptText: formState.promptText,
      responseFormat: formState.responseFormat,
      parameters: parsedParameters,
      rateLimit: Number(formState.rateLimit), // Ensure rateLimit is a number
      accessControl: parsedAccessControl,
      apiKeyRequired: formState.apiKeyRequired,
      aiProvider: formState.aiProvider,
      aiModel: formState.aiModel,
      url: formState.url || null,
    };

    updatePromptMutation.mutate(payload);
    // Consider moving alerts to onSuccess/onError callbacks of the mutation for cleaner separation
    // For example, the success alert can be in the onSuccess callback.
    // The error alert is already in the onError callback.
    // If you keep alerts here, they might fire before mutation completes or settles.
  };

  // Ensure this is the ONLY definition of these hooks.
  // The definitions that were previously around line 125-140 should be removed by this diff.
  // The `data: promptData` and `updatePromptMutation` used throughout the component
  // should refer to these specific hook instances.
  
  if (!promptId) return <p>No Prompt ID provided.</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '700px', margin: 'auto', padding: '25px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Edit Prompt: {promptData?.name || (isLoadingPrompt ? 'Loading...' : 'N/A')}</h2>
      
      {/* Display loading, error, and success messages */}
      {isLoadingPrompt && <p style={{ textAlign: 'center', color: '#007bff', padding: '10px' }}>Loading prompt data...</p>}
      {fetchError && <p style={{ color: 'red', textAlign: 'center', padding: '10px', border: '1px solid red', borderRadius: '4px' }}>Error fetching prompt: {fetchError.message}</p>}
      {errorMessage && <p style={{ color: 'red', textAlign: 'center', padding: '10px', border: '1px solid red', borderRadius: '4px' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green', textAlign: 'center', padding: '10px', border: '1px solid green', borderRadius: '4px' }}>{successMessage}</p>}
      
      {!isLoadingPrompt && !fetchError && promptData && (
        <>
          <label style={{ fontWeight: 'bold', color: '#555' }}>
            Name:
            <input type="text" name="name" value={formState.name} onChange={handleChange} style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px', marginTop: '5px' }} />
          </label>
          
          <label style={{ fontWeight: 'bold', color: '#555' }}>
            Description:
            <textarea name="description" value={formState.description || ''} onChange={handleChange} style={{ width: '100%', minHeight: '80px', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px', marginTop: '5px' }} />
          </label>
          
          <label style={{ fontWeight: 'bold', color: '#555' }}>
            Prompt Text:
            <textarea name="promptText" value={formState.promptText} onChange={handleChange} style={{ width: '100%', minHeight: '150px', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px', marginTop: '5px' }} />
          </label>
          
          <label style={{ fontWeight: 'bold', color: '#555' }}>
            Response Format:
            <select name="responseFormat" value={formState.responseFormat} onChange={handleChange} style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px', marginTop: '5px' }}>
              <option value="json">JSON</option>
              <option value="text">Text</option>
            </select>
          </label>
          
          <label style={{ fontWeight: 'bold', color: '#555' }}>
            Parameters (JSON):
            <textarea name="parameters" value={formState.parameters} onChange={handleChange} style={{ width: '100%', minHeight: '120px', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px', fontFamily: 'monospace', marginTop: '5px' }} />
          </label>
          
          <label style={{ fontWeight: 'bold', color: '#555' }}>
            Rate Limit:
            <input type="number" name="rateLimit" value={formState.rateLimit} onChange={handleChange} style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px', marginTop: '5px' }} />
          </label>
          
          <label style={{ fontWeight: 'bold', color: '#555' }}>
            Access Control (JSON):
            <textarea name="accessControl" value={formState.accessControl} onChange={handleChange} style={{ width: '100%', minHeight: '120px', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px', fontFamily: 'monospace', marginTop: '5px' }} />
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', color: '#555', marginTop: '5px' }}>
            API Key Required:
            <input type="checkbox" name="apiKeyRequired" checked={formState.apiKeyRequired} onChange={handleChange} style={{ height: '20px', width: '20px' }} />
          </label>
          
          <label style={{ fontWeight: 'bold', color: '#555' }}>
            AI Provider:
            <input type="text" name="aiProvider" value={formState.aiProvider} onChange={handleChange} style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px', marginTop: '5px' }} />
          </label>
          
          <label style={{ fontWeight: 'bold', color: '#555' }}>
            AI Model:
            <input type="text" name="aiModel" value={formState.aiModel} onChange={handleChange} style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px', marginTop: '5px' }} />
          </label>
          
          <label style={{ fontWeight: 'bold', color: '#555' }}>
            URL (optional):
            <input type="text" name="url" value={formState.url || ''} onChange={handleChange} style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px', marginTop: '5px' }} />
          </label>
          
          <button 
            onClick={handleSave} 
            disabled={updatePromptMutation.isPending || isLoadingPrompt}
            style={{ 
              padding: '12px 20px', 
              backgroundColor: (updatePromptMutation.isPending || isLoadingPrompt) ? '#ccc' : '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: (updatePromptMutation.isPending || isLoadingPrompt) ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              marginTop: '10px'
            }}
          >
            {updatePromptMutation.isPending ? 'Saving...' : 'Save Prompt'}
          </button>
        </>
      )}
      {!isLoadingPrompt && !fetchError && !promptData && (
        <p style={{ textAlign: 'center', color: 'orange' }}>No prompt data found for ID: {promptId}. It might have been deleted or the ID is incorrect.</p>
      )}
    </div>
  );
}