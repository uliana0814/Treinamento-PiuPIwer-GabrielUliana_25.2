import { z } from "zod";

export const followSchema = z.object({
  followingId: z.string().min(1, "ID do usuário a seguir é obrigatório"),
});

export type FollowData = z.infer<typeof followSchema>;
