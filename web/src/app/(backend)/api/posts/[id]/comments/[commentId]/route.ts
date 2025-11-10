import { NextRequest, NextResponse } from "next/server";
import { updateCommentSchema } from "@/backend/schemas";
import { blockForbiddenRequests, getUserFromRequest, returnInvalidDataErrors, validBody, zodErrorHandler } from "@/utils/api";
import { updateComment, deleteComment, getCommentById } from "@/backend/services/comments";
import { AllowedRoutes } from "@/types";

const allowedRoles: AllowedRoutes = {
  PATCH: ["USER", "ADMIN", "SUPER_ADMIN"],
  DELETE: ["USER", "ADMIN", "SUPER_ADMIN"]
}

// Get a specific comment
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params;
    const comment = await getCommentById(commentId);

    if (!comment) {
      return NextResponse.json(
        { error: "Comentário não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(comment);
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    return zodErrorHandler(error);
  }
}

// Update a comment
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
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

    const { commentId } = await params;

    const body = await validBody(request);
    const validationResult = updateCommentSchema.safeParse(body);

    if (!validationResult.success) {
      return returnInvalidDataErrors(validationResult.error);
    }

    const validatedData = validationResult.data;

    const comment = await updateComment(commentId, user.id, validatedData);

    return NextResponse.json({
      message: "Comentário atualizado com sucesso",
      comment
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

// Delete a comment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
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

    const { commentId } = await params;

    await deleteComment(commentId, user.id);

    return NextResponse.json({
      message: "Comentário deletado com sucesso"
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
