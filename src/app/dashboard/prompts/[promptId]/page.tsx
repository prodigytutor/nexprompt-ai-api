"use client"; // Required for useParams

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"; // Assuming breadcrumb components are here

// Placeholder: In a real scenario, you'd fetch prompt details using promptId
// For example, using trpc.prompts.getPromptById.useQuery({ promptId });
// const { data: prompt, isLoading, error } = trpc.prompts.getPromptById.useQuery({ promptId });

export default function PromptDetailPage() {
  const params = useParams();
  const promptId = params.promptId as string; // Type assertion

  // Placeholder for prompt name - ideally fetched based on promptId
  const promptName = `Details for Prompt ${promptId.substring(0, 8)}...`; 

  if (!promptId) {
    return <p className="p-4">Loading prompt details or invalid prompt ID...</p>;
  }

  // Placeholder content - replace with actual prompt viewing/testing UI
  return (
    <div className="p-4 md:p-6 space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/prompts">Prompts</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{promptName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Prompt Details: {promptId}</h1>
      
      <div className="p-6 border rounded-lg shadow-sm bg-white">
        <p className="text-lg">
          Viewing details for Prompt ID: <strong>{promptId}</strong>
        </p>
        <p className="mt-2 text-gray-600">
          This page will be used to view detailed information about a prompt,
          test its execution, view its versions, and analyze its performance.
        </p>
        {/* 
          Future enhancements:
          - Display all fields of the prompt (name, description, text, parameters, etc.).
          - Allow testing the prompt with various inputs.
          - Show a list of prompt versions.
          - Display analytics related to this prompt.
        */}
        <div className="mt-6">
          <Link href={`/dashboard/prompts/${promptId}/edit`} passHref>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-colors text-sm">
              Edit This Prompt
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
