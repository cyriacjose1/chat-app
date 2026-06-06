import { z } from "zod";

export const createMessageSchema = z.object({
  conversationId: z.uuid(),
  content: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(2000),
});

export type CreateMessageInput =
  z.infer<typeof createMessageSchema>;