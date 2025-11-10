import { NextRequest, NextResponse } from "next/server";
import { blockForbiddenRequests, getUserFromRequest, zodErrorHandler } from "@/utils/api";
import { likePost, unlikePost } from "@/backend/services/posts";
import { AllowedRoutes } from "@/types";

const allowedRoles: AllowedRoutes = {
  POST: ["USER", "ADMIN", "SUPER_ADMIN"],
  DELETE: ["USER", "ADMIN", "SUPER_ADMIN"]
}

// Like a post
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

    await likePost(id, user.id);

    return NextResponse.json({
      message: "Post curtido com sucesso"
    });
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

// Unlike a post
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

    await unlikePost(id, user.id);

    return NextResponse.json({
      message: "Like removido com sucesso"
    });
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
