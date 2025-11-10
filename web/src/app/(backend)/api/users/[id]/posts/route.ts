import { NextRequest, NextResponse } from "next/server";
import { zodErrorHandler } from "@/utils/api";
import { getPostsByUserId } from "@/backend/services/posts";

// Get posts by user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const result = await getPostsByUserId(id, page, limit);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    return zodErrorHandler(error);
  }
}
