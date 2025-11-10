import { z } from "zod";

export const createPostSchema = z.object({
  text: z
    .string()
    .min(1, "O texto do post não pode estar vazio")
    .max(280, "O texto do post deve ter no máximo 280 caracteres"),
  imageUrl: z.string().url("URL da imagem inválida").optional(),
});

export const updatePostSchema = z.object({
  text: z
    .string()
    .min(1, "O texto do post não pode estar vazio")
    .max(280, "O texto do post deve ter no máximo 280 caracteres")
    .optional(),
  imageUrl: z.string().url("URL da imagem inválida").nullable().optional(),
}).refine((data) => data.text !== undefined || data.imageUrl !== undefined, {
  message: "Pelo menos um campo precisa ser fornecido para atualização",
});

export type CreatePostData = z.infer<typeof createPostSchema>;
export type UpdatePostData = z.infer<typeof updatePostSchema>;
