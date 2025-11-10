import { NextRequest, NextResponse } from "next/server";
import { blockForbiddenRequests, getUserFromRequest, zodErrorHandler } from "@/utils/api";
import { followUser, unfollowUser, getFollowers, getFollowing } from "@/backend/services/follows";
import { AllowedRoutes } from "@/types";

const allowedRoles: AllowedRoutes = {
  POST: ["USER", "ADMIN", "SUPER_ADMIN"],
  DELETE: ["USER", "ADMIN", "SUPER_ADMIN"]
}

// Get followers or following
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "followers" or "following"
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    let result;
    if (type === "followers") {
      result = await getFollowers(id, page, limit);
    } else if (type === "following") {
      result = await getFollowing(id, page, limit);
    } else {
      return NextResponse.json(
        { error: "Tipo inválido. Use 'followers' ou 'following'" },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    return zodErrorHandler(error);
  }
}

// Follow a user
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

    const follow = await followUser(user.id, id);

    return NextResponse.json({
      message: "Usuário seguido com sucesso",
      follow
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

// Unfollow a user
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

    await unfollowUser(user.id, id);

    return NextResponse.json({
      message: "Deixou de seguir o usuário com sucesso"
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
