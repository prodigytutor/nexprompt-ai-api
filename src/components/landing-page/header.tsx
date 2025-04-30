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
      <div className="container">
        <div className="mx-auto flex max-w-5xl flex-col items-center">
          <div className="z-10 flex flex-col items-center gap-6 text-center">
            <Image width={32} height={16} src="/logo.png" alt="logo" className="h-16" />
            <Badge>NexPrompt API</Badge>
            <div>
              <h1 className="mb-6 text-2xl font-bold lg:text-6xl py-2 overflow-visible">
              Define, Test, Deploy AI Prompts in Minutes{" "}
                <span className="text-lg bg-gradient-to-r from-[#e03cbf] via-[#bb81eb] to-[#bd15e6] inline-block text-transparent bg-clip-text py-2">
                Create powerful AI prompts and instantly generate API endpoints. 
              Test, iterate, and deploy without writing a single line of code. 
                </span>
              </h1>
              <p className="text-muted-foreground lg:text-xl">
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
              </p>
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
        </div>
      </div>
    </section>
  );
};

export default Hero;
