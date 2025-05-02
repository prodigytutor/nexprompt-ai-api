"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from "@clerk/nextjs"; // Import useAuth
import { useRouter } from 'next/navigation'; // Import useRouter
import { deletePrompt, getPromptsForUser } from '@/lib/actions/prompts'; // Import server actions
import { Prompt } from '@/lib/types'; // Import the updated Prompt type
import { Button } from '@/components/ui/button'; // Import Button for consistency

const PromptList = () => {
  const { userId } = useAuth(); // Get userId from Clerk
  const router = useRouter(); // Get router instance
  const [prompts, setPrompts] = useState<Prompt[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrompts = async () => {
      if (!userId) {
        // If userId is not yet available, don't fetch
        // Optionally set loading false or show a specific message
        setLoading(false);
        setError("User not authenticated."); // Or handle appropriately
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const userPrompts = await getPromptsForUser(userId);
        setPrompts(userPrompts);
      } catch (err) {
        console.error("Failed to fetch prompts:", err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred while fetching prompts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, [userId]); // Re-run effect if userId changes

  const handleEdit = (promptId: string) => {
    router.push(`/dashboard/prompts/edit/${promptId}`); // Navigate to edit page
  };

  const handleDelete = async (promptId: string) => {
    if (!userId) {
        setError("Cannot delete: User not authenticated.");
        return;
    }
    if (window.confirm('Are you sure you want to delete this prompt?')) {
      try {
        setLoading(true); // Indicate loading state during delete
        await deletePrompt(promptId, userId);
        setPrompts((prev) => prev?.filter((p) => p.id !== promptId) || null);
        setError(null); // Clear any previous error
      } catch (err) {
        console.error("Failed to delete prompt:", err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred while deleting.');
      } finally {
          setLoading(false); // Reset loading state
      }
    }
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
            {/* Use Button component and pass IDs */}
            <Button variant="outline" size="sm" onClick={() => handleEdit(p.id)}>Edit</Button>
            <Button variant="destructive" size="sm" onClick={() => handleDelete(p.id)} disabled={loading}>Delete</Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PromptList;
