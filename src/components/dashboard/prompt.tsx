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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DownloadIcon,
  PauseIcon,
  PenIcon,
  PlayIcon,
  Volume2,
} from "lucide-react";
import { Visualizer } from "@/components/dashboard/visualizer";
import PromptList from "../prompt/PromptList";
import Link from "next/link";
import { createPrompt, createPromptData } from "@/lib/actions/prompts";
import { useUser } from "@clerk/nextjs";
import test from "node:test";


export function PromptDashboard() {
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [inputText, setInputText] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const voices = ["Morgan", "Zeke", "Amy", "Ava", "Caleb"];
const user =  useUser();
    const userId = user?.user?.id;
    console.log("User ID:", userId);
    console.log("User Data:", user);
    console.log("User Data:", user.user);
  const handleGenerate = () => {
    setIsPlaying(!isPlaying);
  };

  async function handleSpare() {
    
    const testPrompt = {
      name: "Test Prompt",
      description: "This is a test prompt for demonstration purposes.",
      promptText: "You are a helpful assistant please respond courteously",
      responseFormat: "json",
      parameters: "",
      rateLimit: 0,
      accessControl: "",
      apiKeyRequired: false,
      aiProvider: "OpenAI",
      aiModel: "gpt-3.5-turbo",
      userId: userId, // Replace with actual user ID
      url: "https://example.com", // Replace with actual URL

    };

    const promptData: createPromptData = {
      description: testPrompt.description,
      url: testPrompt.url,
      userId: testPrompt.userId || "1",
      name: testPrompt.name,
      promptText: testPrompt.promptText,
      responseFormat: testPrompt.responseFormat,
      parameters: "",
      rateLimit: testPrompt.rateLimit,
      accessControl: testPrompt.accessControl,
      apiKeyRequired: testPrompt.apiKeyRequired,
      aiProvider: testPrompt.aiProvider,
      aiModel: testPrompt.aiModel,
    }

    const newPrompt = createPrompt(promptData)
      .then(() => {
        alert("Test prompt saved successfully!");
      })
      .catch((error) => {
        console.error("Error saving test prompt:", error);
        alert("Failed to save test prompt.");
      });
  }

  return (
    <>
      <Card className="mx-auto border-none shadow-none  ">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Prompting Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mt-6">
            <div className="border border-2 rounded-lg  items-center justify-center">
              <div className="flex justify-between">
                <div className="flex justify-start gap-4">

                  <Button className="mt-5">
                    Execution History
                    <DownloadIcon className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                <p className="m-5 text-2xl font-semibold">
                  {!isPlaying ? "Click Play To Start" : "Playing Your Story"}
                </p>
              </div>
              <Visualizer isAnimating={isPlaying} />
            </div>
          </div>
          <div className="space-y-6 mt-8">
            <PromptList />

            <div className="flex justify-end gap-4">
              <Link href="/dashboard/prompts/builder">
                <Button onClick={handleGenerate}>
                  <Volume2 className="mr-2 h-4 w-4" /> New Prompt
                </Button>
              </Link>
              <Button onClick={handleSpare}>
                <PenIcon className="mr-2 h-4 w-4" /> Spare Button #1
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
