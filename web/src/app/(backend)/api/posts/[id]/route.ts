import { NextRequest, NextResponse } from "next/server";
import { updatePostSchema } from "@/backend/schemas";
import { blockForbiddenRequests, getUserFromRequest, returnInvalidDataErrors, validBody, zodErrorHandler } from "@/utils/api";
import { getPostById, updatePost, deletePost } from "@/backend/services/posts";
import { AllowedRoutes } from "@/types";

const allowedRoles: AllowedRoutes = {
  PATCH: ["USER", "ADMIN", "SUPER_ADMIN"],
  DELETE: ["USER", "ADMIN", "SUPER_ADMIN"]
}

// Get post by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await getPostById(id);

    if (!post) {
      return NextResponse.json(
        { error: "Post não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    return zodErrorHandler(error);
  }
}

// Update post
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const forbidden = await blockForbiddenRequests(request, allowedRoles.PATCH);
    if (forbidden) {
      return forbidden;
    }

    const user = await getUserFromRequest(request);
    if (user instanceof NextResponse) {
      return user;
    }

    const { id } = await params;

    const body = await validBody(request);
    const validationResult = updatePostSchema.safeParse(body);

    if (!validationResult.success) {
      return returnInvalidDataErrors(validationResult.error);
    }

    const validatedData = validationResult.data;

    const post = await updatePost(id, user.id, validatedData);

    return NextResponse.json({
      message: "Post atualizado com sucesso",
      post
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes("permissão") ? 403 : 400 }
      );
    }

    return zodErrorHandler(error);
  }
}

// Delete post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const forbidden = await blockForbiddenRequests(request, allowedRoles.DELETE);
    if (forbidden) {
      return forbidden;
    }

    const user = await getUserFromRequest(request);
    if (user instanceof NextResponse) {
      return user;
    }

    const { id } = await params;

    await deletePost(id, user.id);

    return NextResponse.json({
      message: "Post deletado com sucesso"
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes("permissão") ? 403 : 400 }
      );
    }

    return zodErrorHandler(error);
  }
}
