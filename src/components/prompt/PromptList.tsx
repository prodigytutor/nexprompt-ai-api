"use client";
import { PromptData } from '@/lib/types';
import React from 'react';



const PromptList = () => {
  const [prompts, setPrompts] = React.useState<PromptData[] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);  

  React.useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const response = await fetch('/api/prompts');
        if (!response.ok) {
          throw new Error('Failed to fetch prompts');
        }
        const data = await response.json();
        setPrompts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, []);
  function handleEdit(prompt: PromptData) {
    // Handle edit logic here
    console.log('Edit prompt:', prompt);
  }
  function handleDelete(id: string) {
    // Handle delete logic here
    console.log('Delete prompt with id:', id);
    setPrompts((prev) => prev?.filter((p) => p.id !== id) || null);
  }
  if (loading) {
    return <div className="p-2">Loading...</div>;
  }
  if (error) {
    return <div className="p-2 text-red-500">Error: {error}</div>;
  }
  if (!prompts || prompts.length === 0) {
    return <div className="p-2">No prompts available.</div>;
  }
  return (
    <div className="p-2">
      <h2 className="text-xl font-bold mb-2">All Prompts</h2>
      {prompts && prompts.map((p) => (
        <div key={p.id} className="border p-2 mb-2 rounded flex justify-between">
          <div>
            <div className="font-semibold">{p.name}</div>
            <div className="text-sm text-gray-600">{p.promptText.slice(0, 50)}...</div>
          </div>
          <div className="flex gap-2">
            <button className="border rounded px-2" onClick={() => handleEdit(p)}>Edit</button>
            <button className="border rounded px-2" onClick={() => handleDelete(p.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PromptList;
