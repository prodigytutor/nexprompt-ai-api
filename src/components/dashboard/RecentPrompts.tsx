"use client";

import React from 'react';
import { trpc } from '@/app/_trpc/client';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Adjust path if necessary
import { Button } from "@/components/ui/button"; // Adjust path if necessary
import type { Prompt } from '../../../generated/prisma/client'; // Using Prisma type for Prompt

const RecentPrompts = () => {
  const { data: prompts, isLoading, error } = trpc.prompts.listPrompts.useQuery(
    { take: 4 }, // Fetching 4 prompts for a 2x2 grid or a single row
    {
      // Optional: configure staleTime, cacheTime, etc.
      // staleTime: 1000 * 60 * 5, // 5 minutes
    }
  );

  const formatDate = (dateString: Date | string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-3">Recent Prompts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-300 rounded w-3/4"></div> {/* Placeholder for Title */}
                <div className="h-4 bg-gray-300 rounded w-1/2 mt-1"></div> {/* Placeholder for Description */}
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="h-8 bg-gray-300 rounded w-1/3"></div> {/* Placeholder for Button */}
                <div className="h-8 bg-gray-300 rounded w-1/3"></div> {/* Placeholder for Button */}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-3">Recent Prompts</h2>
        <p className="text-red-600">Error fetching recent prompts: {error.message}</p>
      </div>
    );
  }

  if (!prompts || prompts.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-3">Recent Prompts</h2>
        <p>No recent prompts found. <Link href="/dashboard/prompts/create" className="text-blue-500 hover:underline">Create a new prompt!</Link></p> 
        {/* Assuming /dashboard/prompts/create is where users can create prompts */}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Recent Prompts</h2>
        <Link href="/dashboard/prompts" passHref>
          <Button variant="outline" size="sm">View All Prompts</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {prompts.map((prompt: Prompt) => (
          <Card key={prompt.id} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="truncate" title={prompt.name}>{prompt.name}</CardTitle>
              <CardDescription>
                Last updated: {formatDate(prompt.updatedAt)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 line-clamp-3" title={prompt.description || prompt.promptText}>
                {prompt.description ? 
                    (prompt.description.length > 100 ? `${prompt.description.slice(0, 97)}...` : prompt.description) :
                    (prompt.promptText.length > 100 ? `${prompt.promptText.slice(0, 97)}...` : prompt.promptText)
                }
                {(!prompt.description && !prompt.promptText) && "No description or prompt text."}
              </p>
            </CardContent>
            <CardFooter className="flex justify-start gap-2 pt-4"> {/* Changed justify-between to justify-start */}
              <Link href={`/dashboard/prompts/${prompt.id}/edit`} passHref>
                <Button variant="default" size="sm">Edit</Button>
              </Link>
              <Link href={`/dashboard/prompts/${prompt.id}/view`} passHref>
                <Button variant="secondary" size="sm">View/Test</Button> 
                {/* Changed "outline" to "secondary" for visual difference */}
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecentPrompts;
