import prisma from "@/backend/services/db";
import { CreateCommentData, UpdateCommentData } from "../../schemas";

export async function createComment(authorId: string, data: CreateCommentData) {
  // Verify post exists
  const post = await prisma.post.findUnique({
    where: { id: data.postId },
  });

  if (!post) {
    throw new Error("Post não encontrado");
  }

  return await prisma.comment.create({
    data: {
      text: data.text,
      authorId,
      postId: data.postId,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });
}

export async function getCommentsByPostId(postId: string, page: number = 1, limit: number = 50) {
  const skip = (page - 1) * limit;

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where: { postId },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    }),
    prisma.comment.count({ where: { postId } }),
  ]);

  return {
    comments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getCommentById(id: string) {
  return await prisma.comment.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      post: {
        select: {
          id: true,
          text: true,
          authorId: true,
        },
      },
    },
  });
}

export async function updateComment(id: string, authorId: string, data: UpdateCommentData) {
  // Verify comment belongs to user
  const comment = await prisma.comment.findUnique({
    where: { id },
  });

  if (!comment) {
    throw new Error("Comentário não encontrado");
  }

  if (comment.authorId !== authorId) {
    throw new Error("Você não tem permissão para editar este comentário");
  }

  return await prisma.comment.update({
    where: { id },
    data,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });
}

export async function deleteComment(id: string, authorId: string) {
  // Verify comment belongs to user
  const comment = await prisma.comment.findUnique({
    where: { id },
  });

  if (!comment) {
    throw new Error("Comentário não encontrado");
  }

  if (comment.authorId !== authorId) {
    throw new Error("Você não tem permissão para deletar este comentário");
  }

  return await prisma.comment.delete({
    where: { id },
  });
}
