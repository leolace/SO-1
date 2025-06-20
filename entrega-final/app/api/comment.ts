import type { ActionFunctionArgs } from "react-router";
import { prisma } from "~/prisma";

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const commentData = form.get("data")?.toString();
  const sectionId = form.get("sectionId")?.toString();

  try {
    if (!commentData || !sectionId) throw new Error("Missing required fields");

    const commment = prisma.comment.create({
      data: {
        content: commentData,
        sectionId,
      },
    });

    return commment;
  } catch (error) {
    console.error("Error creating comment:", error);
  }
}
