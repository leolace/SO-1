import { prisma } from "~/prisma";
import type { Route } from "../+types/root";

export const loader = async ({ params }: Route.LoaderArgs) => {
  const sectionId = params.sectionId;

  try {
    if (!sectionId) {
      throw new Error("Section ID is required");
    }

    const comments = await prisma.comment.findMany({
      where: { sectionId },
      orderBy: { createdAt: "desc" },
    });

    return comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Response("Failed to fetch comments", { status: 500 });
  }
};
