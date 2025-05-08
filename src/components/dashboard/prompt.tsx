"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; // Added CardDescription
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // Added Tooltip components
import {
  DownloadIcon, // Will be replaced
  History, // Added History icon
  PlusCircleIcon, 
  // PauseIcon, PenIcon, PlayIcon, Volume2, 
} from "lucide-react";
import { Visualizer } from "@/components/dashboard/visualizer";
import RecentPrompts from "@/components/dashboard/RecentPrompts"; // Import RecentPrompts
import Link from "next/link";
import { NeonGradientCard } from "@/components/magicui/neon-gradient-card"; // Assuming path

export const PromptDashboard = () => {
  // const [selectedVoice, setSelectedVoice] = useState<string>(""); // State for TTS, keep if Visualizer needs it
  // const [inputText, setInputText] = useState<string>(""); // State for TTS
  const [isPlaying, setIsPlaying] = useState<boolean>(false); // State for Visualizer

  // const voices = ["Morgan", "Zeke", "Amy", "Ava", "Caleb"]; // For TTS, keep if needed

  // This function seems to be a generic toggle for the visualizer,
  // not specifically for prompt generation from the button's context anymore.
  // If it's just for the visualizer, its name could be more specific, or it can be removed if not tied to new UI.
  const toggleVisualizer = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="p-4 md:p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Prompting Dashboard</h1>
        <Link href="/dashboard/prompts/builder" passHref>
          <Button size="lg">
            <PlusCircleIcon className="mr-2 h-5 w-5" /> Create New Prompt
          </Button>
        </Link>
      </div>

      {/* Main Interactive Tool Section (Visualizer) - Enhanced with NeonGradientCard */}
      <NeonGradientCard className="p-0"> {/* Apply padding control if NeonGradientCard adds its own */}
        <Card className="bg-transparent border-none"> {/* Make inner card transparent if NeonGradientCard provides the background/border */}
          <CardHeader className="flex flex-row justify-between items-center pb-2">
            <div>
              <CardTitle className="text-2xl">Audio Visualizer Demo</CardTitle>
              <CardDescription className="mt-1">
                Experience a demonstration of our audio processing capabilities.
              </CardDescription>
            </div>
            <Button variant="outline" onClick={toggleVisualizer} className="ml-4">
              {isPlaying ? "Pause Visualizer" : "Play Visualizer Demo"}
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="border-2 rounded-lg p-4 items-center justify-center">
              <div className="flex justify-between items-center mb-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="secondary">
                        <History className="mr-2 h-4 w-4" />
                        History
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View past audio generation activity (feature pending).</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <p className="text-xl font-semibold">
                  {!isPlaying ? "Click Play To Start Demo" : "Visualizer Active"}
                </p>
              </div>
              <Visualizer isAnimating={isPlaying} />
            </div>
          </CardContent>
        </Card>
      </NeonGradientCard>

      {/* Recent Prompts Section */}
      <section>
        <RecentPrompts />
      </section>

      {/* 
        The old PromptList is removed from here. 
        Navigation to the full list is handled by the "View All Prompts" button within RecentPrompts.
        The old "Spare Button #1" is removed.
        The "New Prompt" button is moved to the top as a primary action.
      */}
      
    </div>
  );
};
