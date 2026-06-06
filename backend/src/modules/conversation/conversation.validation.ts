import { z } from "zod";

export const createConversationSchema =
  z.object({
    userId: z.uuid(),
  });

export type CreateConversationInput =
  z.infer<
    typeof createConversationSchema
  >;