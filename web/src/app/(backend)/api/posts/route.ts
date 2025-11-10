import { NextRequest, NextResponse } from "next/server";
import { createPostSchema } from "@/backend/schemas";
import { blockForbiddenRequests, getUserFromRequest, returnInvalidDataErrors, validBody, zodErrorHandler } from "@/utils/api";
import { createPost, getAllPosts } from "@/backend/services/posts";
import { AllowedRoutes } from "@/types";

const allowedRoles: AllowedRoutes = {
  GET: [],
  POST: ["USER", "ADMIN", "SUPER_ADMIN"]
}

// Get all posts with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const result = await getAllPosts(page, limit);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    return zodErrorHandler(error);
  }
}

// Create a new post
export async function POST(request: NextRequest) {
  try {
    const forbidden = await blockForbiddenRequests(request, allowedRoles.POST);
    if (forbidden) {
      return forbidden;
    }

    const user = await getUserFromRequest(request);
    if (user instanceof NextResponse) {
      return user;
    }

    const body = await validBody(request);
    const validationResult = createPostSchema.safeParse(body);

    if (!validationResult.success) {
      return returnInvalidDataErrors(validationResult.error);
    }

    const validatedData = validationResult.data;

    const post = await createPost(user.id, validatedData);

    return NextResponse.json(
      {
        message: "Post criado com sucesso",
        post
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    return zodErrorHandler(error);
  }
}
