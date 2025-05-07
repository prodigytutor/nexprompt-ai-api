import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";


const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexPrompt | Define, Test & Deploy AI Prompts with API Integration<",
  description: "NexPrompt is a platform that allows you to define, test, and deploy AI prompts with API integration. It provides a user-friendly interface for creating and managing prompts, making it easy to integrate AI capabilities into your applications.",
  keywords: [
    "AI prompts",
    "API integration",
    "prompt management",
    "AI deployment",
    "NexPrompt",
    "AI tools",
    "AI applications",
    "prompt testing",
    "AI development",
    "AI solutions",
    "AI prompt platform",
    "AI prompt creation",
    "AI prompt deployment",
    "AI prompt testing",
    "AI prompt management",
    "AI prompt API",
]};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
