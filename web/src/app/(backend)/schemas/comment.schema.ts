import { z } from "zod";

export const createCommentSchema = z.object({
  text: z
    .string()
    .min(1, "O texto do comentário não pode estar vazio")
    .max(280, "O texto do comentário deve ter no máximo 280 caracteres"),
  postId: z.string().min(1, "ID do post é obrigatório"),
});

export const updateCommentSchema = z.object({
  text: z
    .string()
    .min(1, "O texto do comentário não pode estar vazio")
    .max(280, "O texto do comentário deve ter no máximo 280 caracteres"),
});

export type CreateCommentData = z.infer<typeof createCommentSchema>;
export type UpdateCommentData = z.infer<typeof updateCommentSchema>;
