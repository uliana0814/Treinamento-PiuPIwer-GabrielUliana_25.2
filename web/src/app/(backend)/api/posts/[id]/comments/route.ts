import { NextRequest, NextResponse } from "next/server";
import { createCommentSchema } from "@/backend/schemas";
import { blockForbiddenRequests, getUserFromRequest, returnInvalidDataErrors, validBody, zodErrorHandler } from "@/utils/api";
import { createComment, getCommentsByPostId } from "@/backend/services/comments";
import { AllowedRoutes } from "@/types";

const allowedRoles: AllowedRoutes = {
  POST: ["USER", "ADMIN", "SUPER_ADMIN"]
}

// Get comments for a post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const result = await getCommentsByPostId(id, page, limit);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    return zodErrorHandler(error);
  }
}

// Create a comment on a post
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const forbidden = await blockForbiddenRequests(request, allowedRoles.POST);
    if (forbidden) {
      return forbidden;
    }

    const user = await getUserFromRequest(request);
    if (user instanceof NextResponse) {
      return user;
    }

    const { id } = await params;

    const body = await validBody(request);
    
    // Add postId from params
    const dataWithPostId = {
      ...body,
      postId: id
    };
    
    const validationResult = createCommentSchema.safeParse(dataWithPostId);

    if (!validationResult.success) {
      return returnInvalidDataErrors(validationResult.error);
    }

    const validatedData = validationResult.data;

    const comment = await createComment(user.id, validatedData);

    return NextResponse.json(
      {
        message: "Comentário criado com sucesso",
        comment
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return zodErrorHandler(error);
  }
}
