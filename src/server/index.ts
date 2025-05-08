import { publicProcedure, router } from "@/server/trpc";
import { z } from "zod";
import { promptRouter } from './routes/promptRoutes'; // Added import

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});


/**
 * Customize routes according to your needs
 */
export const appRouter = router({
  // User-related procedures (placeholders)
  createUser: publicProcedure.query(async () => {
    return "User Created";
  }),
  updateUser: publicProcedure.query(async () => {
    return "Update User";
  }),
  getUser: publicProcedure.query(async () => {
    return "Get User";
  }),

  // Prompt-related procedures
  prompts: promptRouter, // Added promptRouter
});

export type AppRouter = typeof appRouter;
