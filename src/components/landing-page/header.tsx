"use client";

import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import Particles from "@/components/magicui/particles";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const Hero = () => {
  const { theme } = useTheme();
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    setColor(theme === "dark" ? "#ffffff" : "#282c35");
  }, [theme]);

  return (
    <section id="home" className="relative overflow-hidden py-32">
      <Particles
        className="absolute inset-0"
        quantity={100}
        ease={80}
        color={color}
        size={2}
        refresh
      />
      <div id="hero" className="relative overflow-hidden bg-neutral-800 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="z-10 flex flex-col items-center gap-6 text-center">
            <div className="text-white space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Define, Test, Deploy AI Prompts in Minutes{" "}
                <span className="text-lg bg-gradient-to-r from-[#e03cbf] via-[#bb81eb] to-[#bd15e6] inline-block text-transparent bg-clip-text py-2">
                Create powerful AI prompts and instantly generate API endpoints. 
              Test, iterate, and deploy without writing a single line of code. 
                </span>
              </h1>
              {/* <p className="text-muted-foreground lg:text-xl">
              Forget juggling complex backend code and API infrastructure 
              just to integrate AI. Our platform streamlines the entire process, 
              putting the focus back on the core of AI interaction: the prompt. 
              Design, refine, and perfect your instructions within our 
              intuitive environment. With a single click, transform these prompts 
              into fully functional, secure API endpoints ready for integration. 
              This allows for incredibly fast iteration cycles – test your AI's responses, 
              tweak the prompt, and redeploy immediately. It's the simplest way to embed 
              sophisticated AI capabilities into your applications and workflows, 
              dramatically reducing development time and technical hurdles.
              </p> */}
            </div>
            <div className="mt-4 flex justify-center gap-2">
              <Button>Get Started</Button>
              <Link href="/dashboard" className={buttonVariants({ variant: "default" })}>
                Checkout Dashboard <ExternalLink className="ml-2 h-4" />
              </Link>
            </div>
            <div className="mt-20 flex flex-col items-center gap-4">
              <p className="text-center: text-muted-foreground lg:text-left">
                Powered By
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a href="#" className={"group px-3"}>
                  <Image
                  width={16}
                  height={16}
                    src="/power-by-icons/hugging-face.svg"
                    alt="huggingFace logo"
                    className="w-16 transition-all"
                  />
                </a>
                <a href="#" className={"group px-3"}>
                  <Image
                  width={12}
                  height={12}
                    src="/power-by-icons/stability-ai.svg"
                    alt="stability ai logo"
                    className="w-12 transition-all"
                  />
                </a>

                <a href="#" className={"group px-3"}>
                  <Image
                  width={12}
                  height={12}
                    src="/power-by-icons/google.svg"
                    alt="google"
                    className="w-12 transition-all"
                  />
                </a>
                <a href="#" className={"group px-3"}>
                  <Image
                  width={12}
                  height={12}
                    src="/power-by-icons/microsoft.svg"
                    alt="microsoft"
                    className="w-12 transition-all"
                  />
                </a>
              </div>
            </div>
          </div>
         
          <div className="relative">
          <div className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-700 shadow-lg">
            <div className="p-4 bg-neutral-800 border-b border-neutral-700 flex items-center">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-neutral-500"></div>
                <div className="w-3 h-3 rounded-full bg-neutral-500"></div>
                <div className="w-3 h-3 rounded-full bg-neutral-500"></div>
              </div>
              <div className="mx-auto text-neutral-400 text-sm">Prompt API Dashboard</div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <div className="text-neutral-400 text-sm mb-2">Define Your Prompt</div>
                <div className="bg-neutral-700 p-3 rounded-md text-neutral-200 text-sm font-mono">
                  You are a customer service AI. Help the user with their  issue related to . Be concise and solution-oriented.
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-neutral-400 text-sm">Test Parameters</span>
                  <span className="text-indigo-400 text-sm">Run Test</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-neutral-700 p-2 rounded-md">
                    <div className="text-neutral-400 text-xs">product</div>
                    <div className="text-neutral-200 text-sm">SmartHome Hub</div>
                  </div>
                  <div className="bg-neutral-700 p-2 rounded-md">
                    <div className="text-neutral-400 text-xs">issue_type</div>
                    <div className="text-neutral-200 text-sm">connectivity</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-indigo-900 bg-opacity-30 rounded-md border border-indigo-700">
                <div className="text-indigo-300 text-sm">API Endpoint Generated</div>
                <div className="text-indigo-300 text-sm font-mono">/api/v1/prompt/cs-helper</div>
              </div>
            </div>
          </div>
          
          <div className="absolute -bottom-6 -right-6 -z-10 w-64 h-64 bg-indigo-600 bg-opacity-20 rounded-full blur-3xl"></div>
          <div className="absolute -top-6 -left-6 -z-10 w-64 h-64 bg-purple-600 bg-opacity-20 rounded-full blur-3xl"></div>
        </div>

         
          <div className="hidden md:flex justify-center">
        </div>
      </div>
      </div>
      </div>
    </section>
  );
};

export default Hero;
