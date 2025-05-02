"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { X, Plus, Save, PlayCircle } from 'lucide-react';

import { PromptData, Parameter } from '@/lib/types';

export default function PromptCreator() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promptData, setPromptData] = useState<PromptData>({
    name: '',
    description: '',
    promptText: '',
    responseFormat: 'json',
    aiProvider: 'openai',
    aiModel: 'gpt-4',
    parameters: [],
    rateLimit: 100,
    apiKeyRequired: true,
    accessCont
    
    rol: { type: 'private' },
    promptTemplate: ''
  });
  
  const [newParam, setNewParam] = useState<Parameter>({
    name: '',
    type: 'string',
    required: true,
    description: ''
  });
  
  const [testResponse, setTestResponse] = useState<any>(null);
  const [testInputs, setTestInputs] = useState<Record<string, any>>({});
  const [testLoading, setTestLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!promptData.name) newErrors.name = 'Name is required';
    if (!promptData.promptText) newErrors.promptText = 'Prompt text is required';
    if (!promptData.aiModel) newErrors.aiModel = 'AI model is required';
    console.log("Prompt Data", promptData);  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      console.log("In  here", promptData);
      let response = await axios.post('/api/prompt', promptData);
      router.push(`/prompt-detail/${response.data.id}`);
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: 'Failed to create prompt. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleParamAdd = () => {
    if (!newParam.name) return;
    setPromptData({
      ...promptData,
      parameters: [...promptData.parameters, { ...newParam }]
    });
    setNewParam({ name: '', type: 'string', required: true, description: '' });
  };

  const handleParamRemove = (index: number) => {
    const updatedParams = [...promptData.parameters];
    updatedParams.splice(index, 1);
    setPromptData({ ...promptData, parameters: updatedParams });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPromptData({ ...promptData, [name]: value });
  };

  const handleTestPrompt = async () => {
    setTestLoading(true);
    try {
      const response = await axios.post('/api/prompts/test', {
        promptText: promptData.promptText,
        aiProvider: promptData.aiProvider,
        aiModel: promptData.aiModel,
        parameters: promptData.parameters,
        inputs: testInputs,
        responseFormat: promptData.responseFormat
      });
      setTestResponse(response.data);
    } catch (err: any) {
      setTestResponse({ error: err.response?.data?.message || 'Test failed' });
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pb-8">
      <h1 className="text-2xl font-bold mb-6">Create New Prompt</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Prompt Name</label>
              <input
                type="text"
                name="name"
                value={promptData.name}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Give your prompt a descriptive name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={promptData.description}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded h-24"
                placeholder="Describe what this prompt does"
              ></textarea>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">AI Provider</label>
                <select
                  name="aiProvider"
                  value={promptData.aiProvider}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="google">Google</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">AI Model</label>
                <select
                  name="aiModel"
                  value={promptData.aiModel}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded ${errors.aiModel ? 'border-red-500' : 'border-gray-300'}`}
                >
                  {promptData.aiProvider === 'openai' && (
                    <>
                      <option value="gpt-4">GPT-4</option>
                      <option value="gpt-4-turbo">GPT-4 Turbo</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    </>
                  )}
                  {promptData.aiProvider === 'anthropic' && (
                    <>
                      <option value="claude-3-opus">Claude 3 Opus</option>
                      <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                      <option value="claude-3-haiku">Claude 3 Haiku</option>
                    </>
                  )}
                  {promptData.aiProvider === 'google' && (
                    <>
                      <option value="gemini-pro">Gemini Pro</option>
                      <option value="gemini-ultra">Gemini Ultra</option>
                    </>
                  )}
                </select>
                {errors.aiModel && <p className="text-red-500 text-sm mt-1">{errors.aiModel}</p>}
              </div>
            </div>
            
            <h2 className="text-xl font-semibold mb-4 mt-8">Configuration</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Response Format</label>
                <select
                  name="responseFormat"
                  value={promptData.responseFormat}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="json">JSON</option>
                  <option value="text">Plain Text</option>
                  <option value="markdown">Markdown</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Rate Limit (calls/min)</label>
                <input
                  type="number"
                  name="rateLimit"
                  value={promptData.rateLimit}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Access Control</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="apiKeyRequired"
                  checked={promptData.apiKeyRequired}
                  onChange={(e) => setPromptData({ ...promptData, apiKeyRequired: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="apiKeyRequired">Require API Key</label>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Prompt Template</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Template Text</label>
              <textarea
                name="promptText"
                value={promptData.promptText}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded h-48 font-mono text-sm ${errors.promptText ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Write your prompt template here. Use {{parameter}} syntax for variables."
              ></textarea>
              {errors.promptText && <p className="text-red-500 text-sm mt-1">{errors.promptText}</p>}
              <p className="text-gray-500 text-sm mt-1">Use {"{{"}<span>paramName</span>{"}}"} syntax to include parameters</p>
            </div>
            
            <h2 className="text-xl font-semibold mb-4 mt-6">Parameters</h2>
            
            <div className="mb-4 flex flex-wrap items-end">
              <div className="mr-2 mb-2 flex-1">
                <input
                  type="text"
                  value={newParam.name}
                  onChange={(e) => setNewParam({ ...newParam, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Parameter name"
                />
              </div>
              <div className="mr-2 mb-2 w-24">
                <select
                  value={newParam.type}
                  onChange={(e) => setNewParam({ ...newParam, type: e.target.value as 'string' | 'number' | 'boolean' })}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="string">String</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                </select>
              </div>
              <div className="mr-2 mb-2 w-24">
                <select
                  value={newParam.required ? 'true' : 'false'}
                  onChange={(e) => setNewParam({ ...newParam, required: e.target.value === 'true' })}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="true">Required</option>
                  <option value="false">Optional</option>
                </select>
              </div>
              <button
                type="button"
                onClick={handleParamAdd}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded mb-2 hover:bg-gray-300"
              >
                <Plus size={18} />
              </button>
            </div>
            
            {promptData.parameters.length > 0 ? (
              <div className="overflow-auto border border-gray-200 rounded mb-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {promptData.parameters.map((param, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 whitespace-nowrap">{param.name}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{param.type}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{param.required ? 'Yes' : 'No'}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-right">
                          <button
                            type="button"
                            onClick={() => handleParamRemove(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 italic mb-4">No parameters added</p>
            )}
          </div>
        </div>
        
        <hr className="my-6" />
        
        <h2 className="text-xl font-semibold mb-4">Test Your Prompt</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-medium mb-2">Parameter Values</h3>
            
            {promptData.parameters.length > 0 ? (
              <div className="space-y-3">
                {promptData.parameters.map((param, index) => (
                  <div key={index} className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">{param.name} ({param.type})</label>
                    {param.type === 'boolean' ? (
                      <select
                        value={testInputs[param.name] ? 'true' : 'false'}
                        onChange={(e) => setTestInputs({...testInputs, [param.name]: e.target.value === 'true'})}
                        className="p-2 border border-gray-300 rounded"
                      >
                        <option value="true">True</option>
                        <option value="false">False</option>
                      </select>
                    ) : (
                      <input
                        type={param.type === 'number' ? 'number' : 'text'}
                        value={testInputs[param.name] || ''}
                        onChange={(e) => setTestInputs({...testInputs, [param.name]: e.target.value})}
                        className="p-2 border border-gray-300 rounded"
                        placeholder={`Enter ${param.name}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Add parameters to test with different inputs</p>
            )}
            
            <button
              type="button"
              onClick={handleTestPrompt}
              disabled={testLoading}
              className="mt-4 px-4 py-2 flex items-center justify-center bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-indigo-400 w-full"
            >
              {testLoading ? 'Testing...' : (
                <>
                  <PlayCircle size={18} className="mr-2" />
                  Test Prompt
                </>
              )}
            </button>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Response</h3>
            
            <div className="border border-gray-300 rounded p-4 h-64 overflow-auto bg-gray-50 font-mono text-sm">
              {testLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : testResponse ? (
                testResponse.error ? (
                  <div className="text-red-500">{testResponse.error}</div>
                ) : (
                  <pre>{JSON.stringify(testResponse, null, 2)}</pre>
                )
              ) : (
                <div className="text-gray-400 h-full flex items-center justify-center">
                  Test response will appear here
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 flex items-center bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-400"
          >
            <Save size={18} className="mr-2" />
            {isSubmitting ? 'Creating...' : 'Create Prompt'}
          </button>
        </div>
      </form>
    </div>
  );
}
