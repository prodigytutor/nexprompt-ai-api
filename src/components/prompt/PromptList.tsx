"use client";
import React from 'react';
import { trpc } from '@/app/_trpc/client'; // Import tRPC client
import Link from 'next/link'; // Import Link for navigation
import type { Prompt } from '../../../generated/prisma/client'; // Using Prisma type

const PromptList = () => {
  // Fetch prompts using tRPC
  const { data: prompts, isLoading, error, refetch: refetchPrompts } = trpc.prompts.listPrompts.useQuery(undefined, {
    // `undefined` as input because listPrompts doesn't take any input
    // Add any options like `staleTime`, `cacheTime` if needed
  });
  
  // TODO: Implement delete functionality with tRPC mutation
  const handleDelete = async (id: string) => {
    console.log('Attempting to delete prompt with id:', id);
    // Example: await deletePromptMutation.mutateAsync({ promptId: id });
    // For now, just refetching to simulate change if deletion was successful elsewhere or for optimistic updates.
    // Ideally, you'd call a delete mutation and then refetch or update cache.
    alert("Delete functionality not fully implemented. Refetching list.");
    refetchPrompts(); 
  };

  if (isLoading) {
    return <div className="p-4">Loading prompts...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error fetching prompts: {error.message}</div>;
  }

  if (!prompts || prompts.length === 0) {
    return <div className="p-4">No prompts available. Create one!</div>;
  }

  return (
    <div className="p-4 space-y-3">
      <h2 className="text-2xl font-semibold mb-4">Your Prompts</h2>
      {prompts.map((p: Prompt) => ( // Explicitly type `p` if not inferred correctly
        <div key={p.id} className="border border-gray-300 p-4 mb-3 rounded-lg shadow-sm hover:shadow-md transition-shadow flex justify-between items-center">
          <div>
            <h3 className="text-xl font-medium text-blue-600">{p.name}</h3>
            <p className="text-sm text-gray-700 mt-1">
              {p.description ? `${p.description.slice(0, 100)}${p.description.length > 100 ? '...' : ''}` : (p.promptText ? `${p.promptText.slice(0,100)}${p.promptText.length > 100 ? '...' : ''}`: 'No description or text.')}
            </p>
            <p className="text-xs text-gray-500 mt-2">Model: {p.aiProvider} / {p.aiModel}</p>
            <p className="text-xs text-gray-500">Updated: {new Date(p.updatedAt).toLocaleDateString()}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 items-center">
            <Link href={`/dashboard/prompts/${p.id}/edit`} passHref>
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-colors text-sm">
                Edit
              </button>
            </Link>
            <button 
              onClick={() => handleDelete(p.id)} 
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-colors text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PromptList;
