"use client"; // Required for useParams

import React from 'react';
import { useParams } from 'next/navigation'; // Hook to get dynamic route parameters
import PromptEditor from '@/components/prompt/PromptEditor'; // Adjust path as necessary

export default function EditPromptPage() {
  const params = useParams();
  const promptId = params.promptId as string; // Type assertion

  if (!promptId) {
    // This case might occur if params are not yet available or if the route is somehow malformed.
    // next/navigation should ensure promptId is available if the route matches.
    return <p>Loading prompt ID or invalid route...</p>;
  }

  return (
    <div>
      {/* 
        You might want to add a layout specific to this page or use a general dashboard layout.
        For now, directly rendering the editor.
      */}
      <PromptEditor promptId={promptId} />
    </div>
  );
}
